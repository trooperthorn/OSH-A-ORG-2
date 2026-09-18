// v2.8.0 LIVE ASSETS backend. This repo deploys as a Cloudflare Worker with a
// static-assets binding (Workers Builds, auto-deploy on push to main — see
// docs/HANDOFF-CHATGPT.md §8), NOT classic Cloudflare Pages. That matters here:
// the "Pages Functions" functions/api/*.js convention this feature was first
// scoped against does not run in this deployment shape at all, because there is
// no Pages project. This file is the Worker's own fetch handler instead, wired
// through wrangler.jsonc's "main", and it defers to the ASSETS binding for
// every request it does not own — so index.html, sw.js and every data/*.json
// file keep being served exactly as before, byte for byte.
//
// Two routes, both same-origin so index.html's poll never needs a CORS grant
// or a credential of its own:
//
//   POST /api/live-ingest   bearer-token-protected, called by the swis-live-
//                           poller repo running on Sean's LAN. Writes the
//                           pushed snapshot into KV under one fixed key.
//   GET  /api/live.json     public, briefly cached, read by index.html's
//                           manual "Live Assets" layer (see index.html
//                           v2.8.0 changelog entry / _liveFetch()).
//
// No SWIS credential, no SWIS network reachability, and no persistence beyond
// the single KV key this writes — the same "no database, live poll only"
// contract swis-live-poller's README states on its side of the bridge.

const KV_KEY = "live-assets";
const MAX_BODY_BYTES = 256 * 1024; // generous for a few hundred assets; refuses anything absurd

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/live-ingest") {
      return handleIngest(request, env);
    }
    if (url.pathname === "/api/live.json") {
      return handleRead(request, env);
    }

    // Everything else: the static build, unmodified. If this Worker has no
    // ASSETS binding for some reason (misconfigured wrangler.jsonc), fail
    // loudly rather than pretending to serve the app.
    if (!env.ASSETS) {
      return new Response("ASSETS binding missing", { status: 500 });
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleIngest(request, env) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
  }

  const auth = request.headers.get("Authorization") || "";
  const expected = env.LIVE_PUSH_TOKEN;
  if (!expected) {
    // Secret not set yet — refuse rather than accept unauthenticated writes.
    return new Response("LIVE_PUSH_TOKEN not configured", { status: 500 });
  }
  if (auth !== `Bearer ${expected}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!env.LIVE_ASSETS) {
    return new Response("LIVE_ASSETS KV binding missing", { status: 500 });
  }

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength && contentLength > MAX_BODY_BYTES) {
    return new Response("Payload too large", { status: 400 });
  }

  let body;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return new Response("Payload too large", { status: 400 });
    }
    body = JSON.parse(text);
  } catch (_e) {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (!body || !Array.isArray(body.assets)) {
    return new Response('Body must be {"assets": [...]}', { status: 400 });
  }

  const assets = [];
  for (const a of body.assets) {
    if (!a || typeof a !== "object") continue;
    const lat = Number(a.lat), lon = Number(a.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;
    assets.push({
      nodeId: a.nodeId != null ? a.nodeId : null,
      caption: typeof a.caption === "string" ? a.caption.slice(0, 200) : "",
      lat,
      lon,
      source: typeof a.source === "string" ? a.source.slice(0, 200) : "",
      status: typeof a.status === "string" ? a.status.slice(0, 100) : "",
      lastPollUtc: typeof a.lastPollUtc === "string" ? a.lastPollUtc.slice(0, 40) : "",
    });
  }

  const snapshot = {
    updatedUtc: new Date().toISOString(),
    assets,
  };

  await env.LIVE_ASSETS.put(KV_KEY, JSON.stringify(snapshot));

  return new Response(JSON.stringify({ ok: true, count: assets.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleRead(request, env) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  if (!env.LIVE_ASSETS) {
    return new Response("LIVE_ASSETS KV binding missing", { status: 500 });
  }

  let snapshot = null;
  try {
    const raw = await env.LIVE_ASSETS.get(KV_KEY);
    if (raw) snapshot = JSON.parse(raw);
  } catch (_e) {
    snapshot = null;
  }

  // No push has landed yet (poller not deployed, or not running): an empty,
  // well-formed shape, not an error. index.html's _liveFetch() treats this
  // exactly like a network miss — the layer just has nothing to draw yet.
  const body = snapshot && Array.isArray(snapshot.assets)
    ? snapshot
    : { updatedUtc: null, assets: [] };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // Short public cache: cheap on repeat polls from many tabs, short
      // enough that a real position update shows up within a few seconds.
      "Cache-Control": "public, max-age=5",
    },
  });
}
