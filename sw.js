// A-ORG-2 service worker — same contract A-ORG-1 earned the hard way:
// cross-origin requests are NEVER touched; same-origin install is per-asset
// fault-tolerant and backfills on runtime misses; every respondWith ends in a
// concrete Response. CACHE moves with APP_VERSION (ship-lint enforces).
const CACHE = 'a-org-2-v1-18-1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './logo.svg',
  './data/land-110m.json', './data/land-50m.json',
  './data/states-10m.json', './data/countries-110m.json',
  './icon-192.png', './icon-512.png', './icon-180.png', './icon-maskable-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(a => c.add(a).catch(() => {})));  // per-asset tolerant
    self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;            // cross-origin passthrough
  e.respondWith((async () => {
    const hit = await caches.match(e.request);
    if (hit) return hit;
    try {
      const res = await fetch(e.request);
      if (res && res.ok && e.request.method === 'GET') {
        const c = await caches.open(CACHE); c.put(e.request, res.clone()); // backfill
      }
      return res;
    } catch (err) {
      return new Response('offline', { status: 503, statusText: 'offline' });
    }
  })());
});
