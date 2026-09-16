// A-ORG-2 service worker — same contract A-ORG-1 earned the hard way:
// cross-origin requests are NEVER touched; same-origin install is per-asset
// fault-tolerant and backfills on runtime misses; every respondWith ends in a
// concrete Response. CACHE moves with APP_VERSION (ship-lint enforces).
//
// v1.25.0 — THE UPDATE PATH, HARDENED (owner: "connectivity and update issues"):
//  · precache fetches are cache:'no-cache' — a new build seeds from the ORIGIN
//    (revalidated), never from the browser's HTTP cache, so a v+1 worker can
//    no longer install a v0 index.html and strand the app on the old build
//    under a "current" cache name (the v0.33.1 stale-review class, at its root);
//  · the SHELL ('./') is MANDATORY: if it cannot be fetched the install throws,
//    the previous worker stays in control and the next update check retries —
//    a worker without its shell is worse than the old one. Data files stay
//    per-asset tolerant (runtime backfill);
//  · a response that arrived via redirect is never stored under the request
//    URL (a redirected cached response fails a navigation outright);
//  · navigations resolve to the cached shell with ignoreSearch — a query
//    string, a deep link, or an offline open all land on the app instead of
//    a blank "offline" 503;
//  · sw.js itself is never cached by the worker (the browser owns its update
//    check, and the page's diagnostic probe must see the origin);
//  · a message door: {t:'version'} answers the CACHE name; {t:'refresh-shell'}
//    re-fetches the shell from the origin — the page's stale-build self-heal.
const CACHE = 'a-org-2-v2-0-0';
const SHELL = './';
const ASSETS = [
  SHELL, './manifest.webmanifest', './logo.svg',
  './data/orgs.json',            /* v1.31.0 THE FETCHED SPINE — the org tree rides the versioned cache */
  './data/land-110m.json', './data/land-50m.json',
  './data/states-10m.json', './data/countries-110m.json',
  './icon-192.png', './icon-512.png', './icon-180.png', './icon-maskable-512.png'
];
// fetch from the origin (revalidated) and store — false on any failure, never a throw
async function precache(c, a) {
  try {
    const res = await fetch(new Request(a, { cache: 'no-cache' }));
    if (!res || !res.ok || res.redirected) return false;
    await c.put(a, res);
    return true;
  } catch (_) { return false; }
}
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    if (!await precache(c, SHELL)) throw new Error('shell precache failed');   // keep the old worker; retry next check
    await Promise.all(ASSETS.filter(a => a !== SHELL).map(a => precache(c, a)));  // per-asset tolerant
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // browser default for anything that is not a read
  let url; try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== location.origin) return;             // cross-origin passthrough
  if (/\/sw\.js$/.test(url.pathname)) return;             // the worker script is the browser's to check, never ours to cache
  const nav = req.mode === 'navigate';
  e.respondWith((async () => {
    const hit = await caches.match(req, nav ? { ignoreSearch: true } : undefined);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok && !res.redirected) {
        const c = await caches.open(CACHE); c.put(req, res.clone()); // backfill
      }
      return res;
    } catch (err) {
      if (nav) { const shell = await caches.match(SHELL); if (shell) return shell; }   // offline open → the app, not a 503
      return new Response('offline', { status: 503, statusText: 'offline' });
    }
  })());
});
function reply(e, msg) {
  try {
    if (e.ports && e.ports[0]) e.ports[0].postMessage(msg);
    else if (e.source && e.source.postMessage) e.source.postMessage(msg);
  } catch (_) {}
}
self.addEventListener('message', e => {
  const d = (e && e.data) || {};
  if (d.t === 'version') reply(e, { t: 'version', cache: CACHE });
  else if (d.t === 'refresh-shell') {
    e.waitUntil((async () => {
      let ok = false;
      try { ok = await precache(await caches.open(CACHE), SHELL); } catch (_) {}
      reply(e, { t: 'refresh-shell', ok });
    })());
  }
});
