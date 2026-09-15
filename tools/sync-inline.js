// SYNC-INLINE — regenerate index.html's inline SITES literal from the source
// file. data/sites.json is the source of truth; the page ships a copy so the
// constellation paints on the very first frame with no fetch in the way.
//
//   node tools/sync-inline.js
//
// HISTORY: v1.28.0 also projected a slimmed A1ORGS literal here. v1.31.0
// (owner ruling: "Move the org data") retired the org literal entirely — the
// tree now rides data/orgs.json, fetched same-origin at boot and precached by
// the service worker. Sites stay inline: they are 49 KB, first-paint
// critical, and their nulls are load-bearing (unit:null is a sanctioned
// category). data-lint §8 enforces both halves of that contract.
//
// Node >=18, zero deps.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const IDX = path.join(ROOT, 'index.html');

const sites = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'sites.json'), 'utf8')).sites;

let html = fs.readFileSync(IDX, 'utf8');
const before = Buffer.byteLength(html, 'utf8');
const RX_SITES = /(var SITES=window\.SITES=)(\[.*?\])(;)/s;
if (!RX_SITES.test(html)) { console.error('✗ inline SITES literal not found'); process.exit(1); }
html = html.replace(RX_SITES, (m, a, b, c) => a + JSON.stringify(sites) + c);
fs.writeFileSync(IDX, html);
const after = Buffer.byteLength(html, 'utf8');
console.log('sync-inline: sites ' + sites.length + ' · index.html ' + before.toLocaleString() + ' -> ' + after.toLocaleString());
