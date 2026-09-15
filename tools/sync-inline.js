// SYNC-INLINE — regenerate index.html's inline data literals from the source
// files. data/orgs.json and data/sites.json are the source of truth; the page
// ships a copy of each, and before this tool existed the copy was rewritten by
// ad-hoc scripts inside whichever release touched the data. One door now.
//
//   node tools/sync-inline.js          # rewrite both literals from data/
//
// THE SLIM PROJECTION (v1.28.0): the inline A1ORGS copy ships only
//   { id, name, parent, site? }          (site omitted when null)
// because lvl and root are DERIVED from the parent chain — the exact walk
// data-lint verifies — and 1,416 shipped copies of two derivable fields cost
// ~41 KB of a 900 KB budget. The boot shim right under the literal rebuilds
// them before anything runs. A row carries an explicit "root" (or "lvl") ONLY
// where the stored source value disagrees with its own chain, so runtime state
// stays byte-for-byte faithful to the blessed file even for those rows.
// data-lint §8 holds both directions: inline === this projection of the
// source, and derivation(inline) === the source, row for row.
//
// data/sites.json ships FULL fidelity — its rows are small and its nulls are
// load-bearing (unit:null is a sanctioned category, not an omission).
//
// Node >=18, zero deps.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const IDX = path.join(ROOT, 'index.html');

const orgs  = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'orgs.json'),  'utf8')).orgs;
const sites = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'sites.json'), 'utf8')).sites;

// ── the derivation (single definition — data-lint requires this file) ───────
function derived(o, byId) {
  const chain = [o]; let c = o; const seen = new Set([o.id]);
  while (c.parent != null) { const p = byId[c.parent]; if (!p || seen.has(p.id)) break;
    seen.add(p.id); chain.push(p); c = p; }
  return { lvl: chain.length, root: chain.length === 1 ? null : chain[chain.length - 2].id };
}
function slimProject(rows) {
  const byId = {}; rows.forEach(o => byId[o.id] = o);
  return rows.map(o => {
    const d = derived(o, byId);
    const r = { id: o.id, name: o.name, parent: o.parent };
    if (o.site != null) r.site = o.site;
    if (o.lvl !== d.lvl)   r.lvl  = o.lvl;    // exception: stored disagrees with chain
    if (String(o.root) !== String(d.root)) r.root = o.root;
    return r;
  });
}
module.exports = { derived, slimProject };
if (require.main !== module) return;

// ── rewrite the two literals in place ────────────────────────────────────────
let html = fs.readFileSync(IDX, 'utf8');
const before = Buffer.byteLength(html, 'utf8');

const slim = slimProject(orgs);
const exceptions = slim.filter(r => r.root !== undefined || r.lvl !== undefined);

const RX_ORGS  = /(var A1ORGS=window\.A1ORGS=)(\[.*?\])(;)/s;
const RX_SITES = /(var SITES=window\.SITES=)(\[.*?\])(;)/s;
if (!RX_ORGS.test(html))  { console.error('✗ inline A1ORGS literal not found'); process.exit(1); }
if (!RX_SITES.test(html)) { console.error('✗ inline SITES literal not found');  process.exit(1); }
html = html.replace(RX_ORGS,  (m, a, b, c) => a + JSON.stringify(slim)  + c);
html = html.replace(RX_SITES, (m, a, b, c) => a + JSON.stringify(sites) + c);

fs.writeFileSync(IDX, html);
const after = Buffer.byteLength(html, 'utf8');
console.log('sync-inline: orgs ' + orgs.length + ' (slim, ' + exceptions.length + ' exception row' +
            (exceptions.length === 1 ? '' : 's') + ') · sites ' + sites.length +
            ' · index.html ' + before.toLocaleString() + ' -> ' + after.toLocaleString() +
            ' (' + (after - before >= 0 ? '+' : '') + (after - before).toLocaleString() + ' bytes)');
exceptions.forEach(r => console.log('  exception: ' + r.id +
  (r.root !== undefined ? ' root=' + r.root : '') + (r.lvl !== undefined ? ' lvl=' + r.lvl : '')));
