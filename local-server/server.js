#!/usr/bin/env node
'use strict';

// A-ORG-2 LOCAL SERVER — v2.9.0. Self-hosted replacement for worker.js
// (the Cloudflare Worker) so this app can run entirely on Sean's own infra:
// Docker, or a plain Windows process behind IIS. Cloudflare stays a VALID
// option (worker.js/wrangler.jsonc are unchanged and still deploy) — this
// is simply no longer the only path.
//
// Why plain Node with zero dependencies, not a framework: the app's only
// server-side surface is two small JSON routes plus static file serving —
// exactly what Node's built-in `http` and `fs` modules do without help.
// Zero dependencies means `npm install` is never a build step that can go
// stale or need an internet connection on Sean's LAN, the Docker image has
// nothing to audit for supply-chain risk, and the same server.js runs
// unmodified as `node server.js` on Windows behind IIS or as the ENTRYPOINT
// in the Docker image below. Python's stdlib was the other zero-dependency
// option considered; Node was chosen only because this repo's own tools/
// (data-lint, smoke_runtime, etc.) are already Node, so anyone maintaining
// this app already has the runtime and the idiom on hand.
//
// CONTRACT — this intentionally mirrors worker.js's fetch handler byte for
// byte in request/response shape, so index.html's _liveFetch() and the
// swis-live-poller repo's push need ZERO changes to work against either
// backend:
//   POST /api/live-ingest   bearer-token-protected (LIVE_PUSH_TOKEN env var),
//                           body {"assets":[...]}, same field allowlist/
//                           truncation/validation as worker.js, same
//                           {ok:true,count:N} / error-status responses.
//   GET  /api/live.json     public, same {updatedUtc,assets} shape, same
//                           "no push yet" empty-but-well-formed fallback.
// Storage: a single local JSON file instead of Cloudflare KV — this is one
// LAN, one server process, so a file with an in-memory cache in front of it
// is simpler than KV ever needed to be for the same guarantee (survives a
// restart, one fixed key, no external dependency).
// Everything else (index.html, sw.js, manifest.webmanifest, icons,
// modules/s1-tokens.css, data/*.json) is served as static files, unmodified,
// exactly like the Worker's ASSETS binding did.

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');            // repo root — the static site
const PORT = Number(process.env.PORT) || 8080;
const LIVE_PUSH_TOKEN = process.env.LIVE_PUSH_TOKEN || '';
const DATA_DIR = process.env.LIVE_DATA_DIR
  ? path.resolve(process.env.LIVE_DATA_DIR)
  : path.join(__dirname, '.data');
const LIVE_FILE = path.join(DATA_DIR, 'live-assets.json');
const MAX_BODY_BYTES = 256 * 1024;                      // same ceiling as worker.js

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, body, headers) {
  const h = Object.assign({ 'Content-Type': 'application/json' }, headers || {});
  res.writeHead(status, h);
  res.end(body);
}

function sendJSON(res, status, obj, headers) {
  send(res, status, JSON.stringify(obj), headers);
}

// ── /api/live.json + /api/live-ingest — worker.js's contract, on a file ──

function readSnapshot() {
  try {
    const raw = fs.readFileSync(LIVE_FILE, 'utf8');
    const snap = JSON.parse(raw);
    if (snap && Array.isArray(snap.assets)) return snap;
  } catch (_e) { /* no push yet, or a corrupt file — treat as empty */ }
  return { updatedUtc: null, assets: [] };
}

function writeSnapshot(snapshot) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  // write to a temp file then rename — avoids a reader ever seeing a
  // half-written file if the process is killed mid-write
  const tmp = LIVE_FILE + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(snapshot));
  fs.renameSync(tmp, LIVE_FILE);
}

function handleLiveRead(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'Method Not Allowed', { 'Content-Type': 'text/plain', Allow: 'GET, HEAD' });
  }
  const body = readSnapshot();
  // short public cache, same rationale as worker.js: cheap on repeat polls
  // from many tabs, short enough a real update shows up within seconds
  sendJSON(res, 200, body, { 'Cache-Control': 'public, max-age=5' });
}

function handleLiveIngest(req, res) {
  if (req.method !== 'POST') {
    return send(res, 405, 'Method Not Allowed', { 'Content-Type': 'text/plain', Allow: 'POST' });
  }
  if (!LIVE_PUSH_TOKEN) {
    // secret not configured — refuse rather than accept unauthenticated writes
    return send(res, 500, 'LIVE_PUSH_TOKEN not configured', { 'Content-Type': 'text/plain' });
  }
  const auth = req.headers['authorization'] || '';
  if (auth !== 'Bearer ' + LIVE_PUSH_TOKEN) {
    return send(res, 401, 'Unauthorized', { 'Content-Type': 'text/plain' });
  }

  const contentLength = Number(req.headers['content-length'] || '0');
  if (contentLength && contentLength > MAX_BODY_BYTES) {
    return send(res, 400, 'Payload too large', { 'Content-Type': 'text/plain' });
  }

  const chunks = [];
  let total = 0;
  let refused = false;
  req.on('data', (chunk) => {
    if (refused) return;
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      refused = true;
      send(res, 400, 'Payload too large', { 'Content-Type': 'text/plain' });
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on('error', () => { /* client aborted; nothing to respond to */ });
  req.on('end', () => {
    if (refused) return;
    let body;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch (_e) {
      return send(res, 400, 'Invalid JSON', { 'Content-Type': 'text/plain' });
    }
    if (!body || !Array.isArray(body.assets)) {
      return send(res, 400, 'Body must be {"assets": [...]}', { 'Content-Type': 'text/plain' });
    }

    // same field allowlist/truncation/range-check as worker.js's handleIngest
    const assets = [];
    for (const a of body.assets) {
      if (!a || typeof a !== 'object') continue;
      const lat = Number(a.lat), lon = Number(a.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;
      assets.push({
        nodeId: a.nodeId != null ? a.nodeId : null,
        caption: typeof a.caption === 'string' ? a.caption.slice(0, 200) : '',
        lat, lon,
        source: typeof a.source === 'string' ? a.source.slice(0, 200) : '',
        status: typeof a.status === 'string' ? a.status.slice(0, 100) : '',
        lastPollUtc: typeof a.lastPollUtc === 'string' ? a.lastPollUtc.slice(0, 40) : '',
      });
    }

    const snapshot = { updatedUtc: new Date().toISOString(), assets };
    try {
      writeSnapshot(snapshot);
    } catch (e) {
      return send(res, 500, 'Storage write failed: ' + e.message, { 'Content-Type': 'text/plain' });
    }
    sendJSON(res, 200, { ok: true, count: assets.length });
  });
}

// ── static file serving — everything else, same-origin, no build step ──

function safeStaticPath(urlPath) {
  // decode + strip query/hash, collapse to a repo-relative path, and refuse
  // anything that would escape ROOT (path traversal)
  let p = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (p === '/' || p === '') p = '/index.html';
  const resolved = path.normalize(path.join(ROOT, p));
  if (!resolved.startsWith(ROOT)) return null;
  return resolved;
}

function serveStatic(req, res) {
  const target = safeStaticPath(req.url);
  if (!target) return send(res, 400, 'Bad request', { 'Content-Type': 'text/plain' });

  fs.stat(target, (err, stat) => {
    if (err || !stat.isFile()) {
      // sw.js expects a real 404 for a missing static asset, not the app shell
      return send(res, 404, 'Not found', { 'Content-Type': 'text/plain' });
    }
    const ext = path.extname(target).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stat.size,
      // let the service worker's own versioned cache (CACHE in sw.js) own
      // long-lived caching; the server itself stays conservative
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300',
    });
    fs.createReadStream(target).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const pathname = req.url.split('?')[0];
  if (pathname === '/api/live-ingest') return handleLiveIngest(req, res);
  if (pathname === '/api/live.json') return handleLiveRead(req, res);
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log('A-ORG-2 local server listening on http://localhost:' + PORT);
  console.log('Serving static files from: ' + ROOT);
  console.log('Live-assets storage file:  ' + LIVE_FILE);
  console.log(LIVE_PUSH_TOKEN
    ? 'LIVE_PUSH_TOKEN is set — /api/live-ingest is enabled.'
    : 'LIVE_PUSH_TOKEN is NOT set — /api/live-ingest will refuse all pushes (500) until it is.');
});

module.exports = server;
