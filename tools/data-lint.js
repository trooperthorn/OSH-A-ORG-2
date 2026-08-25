// DATA LINT — sites.json invariants, run over the REAL data/sites.json (the map layer
// contract from CLAUDE.md: { id, base, unit, lat, lon, grp, parent }; the parent pointer
// IS the link model — no other relationship data exists in A-ORG-2). Mirrors A-ORG-1
// tools/data-lint.js in spirit: each check exists because its failure mode is one
// nothing else in the suite notices — a duplicate or drifted id silently orphans every
// parent pointer aimed at it; a dangling parent drops a lineage line without throwing;
// a parent CYCLE hangs any walker that follows the chain (dossier lineage, brief
// roll-up); an out-of-range lat/lon projects a dot onto the wrong hemisphere.
//
// Policy decisions (documented here, same as A-ORG-1's data-lint header):
// - unit == null is SANCTIONED for grp guard/guardInset/oib rows — Guard camps and OIB
//   plants are map dots first, org rows second. Exceptions are listed in the output so
//   the ledger stays visible and does not silently grow.
// - unit == null on any OTHER grp is a WARNING, not fatal: A-ORG-1's map legitimately
//   carried ~56 dots with no tree node (joint/COCOM HQs, APS-2 sites, MOTs, engineer
//   districts, overseas camps) and M1 extraction preserves exactly that population.
//   A unit that is PRESENT but blank (""/whitespace) is FATAL — that is a data bug,
//   not a map-only site.
// - id must equal slug(base), slug copied VERBATIM from tools/extract-sites.js — the
//   id IS the derived key; a hand-edited id breaks re-extraction idempotence and every
//   parent pointer that names it.
// Node >=18, zero deps. Run from anywhere: paths resolve against the repo root.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let fails = 0, warns = 0;
const bad  = (m) => { fails++; console.log('✗ ' + m); };
const warn = (m) => { warns++; console.log('~ ' + m); };

const FILE = path.join(ROOT, 'data', 'sites.json');
if (!fs.existsSync(FILE)) { console.log('✗ data/sites.json missing'); console.log('DATA LINT FAIL'); process.exit(1); }
let doc;
try { doc = JSON.parse(fs.readFileSync(FILE, 'utf8')); }
catch (e) { console.log('✗ data/sites.json is not valid JSON: ' + e.message); console.log('DATA LINT FAIL'); process.exit(1); }
const sites = doc && Array.isArray(doc.sites) ? doc.sites : null;
if (!sites || !sites.length) { console.log('✗ data/sites.json carries no sites[] array'); console.log('DATA LINT FAIL'); process.exit(1); }
console.log('· ' + sites.length + ' sites (schema v' + doc.v + ', updated ' + doc.updated + ', src: ' + doc.src + ')');

// ── 1. unique ids ────────────────────────────────────────────────────────────────
// The id is the ONLY key parent pointers (and GlobeState.sel) resolve against.
const byId = new Map();
{
  const dups = [];
  for (const s of sites) {
    if (typeof s.id !== 'string' || !s.id) { bad('row with missing/empty id (base: "' + (s.base || '?') + '")'); continue; }
    if (byId.has(s.id)) dups.push(s.id); else byId.set(s.id, s);
  }
  if (dups.length) bad('duplicate site id(s) — every parent pointer at these is ambiguous: ' + dups.join(' · '));
  else console.log('✓ all ' + byId.size + ' site ids unique');
}

// ── 2. id = slug(base) ───────────────────────────────────────────────────────────
// slug is copied VERBATIM from tools/extract-sites.js — the derivation is the contract.
{
  const slug = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');   // diacritics fold (v0.6.0: Chièvres → chievres)
  const drift = [];
  for (const s of sites) {
    if (typeof s.base !== 'string' || !s.base.trim()) { bad('row "' + s.id + '" has missing/blank base'); continue; }
    if (s.id !== slug(s.base)) drift.push(s.id + ' ≠ slug("' + s.base + '") = "' + slug(s.base) + '"');
  }
  if (drift.length) { bad(drift.length + ' id(s) drifted from slug(base) — hand-edited ids break re-extraction:'); drift.forEach(d => console.log('    ' + d)); }
  else console.log('✓ every id equals slug(base)');
}

// ── 3. every parent resolves to an existing id ───────────────────────────────────
{
  const dangling = sites.filter(s => s.parent != null && !byId.has(s.parent));
  if (dangling.length) { bad(dangling.length + ' dangling parent pointer(s) — the lineage line silently vanishes:'); dangling.forEach(s => console.log('    ' + s.id + ' → "' + s.parent + '"')); }
  else console.log('✓ all ' + sites.filter(s => s.parent != null).length + ' parent pointers resolve to real sites');
}

// ── 4. NO cycles in the parent graph ─────────────────────────────────────────────
// A loop hangs every chain walker (dossier lineage, brief roll-up) at runtime; nothing
// else in the suite exercises the full transitive closure.
{
  const safe = new Set(), seenCycles = new Set(); let maxDepth = 0;
  for (const s of sites) {
    const chain = [], seen = new Set(); let cur = s, cyc = null;
    while (cur && !safe.has(cur.id)) {
      if (seen.has(cur.id)) { cyc = chain.slice(chain.indexOf(cur.id)).concat(cur.id); break; }
      seen.add(cur.id); chain.push(cur.id);
      cur = cur.parent != null ? byId.get(cur.parent) : null;
    }
    if (cyc) {
      const key = cyc.slice(0, -1).sort().join('|');           // one report per loop, not per member
      if (!seenCycles.has(key)) { seenCycles.add(key); bad('parent CYCLE: ' + cyc.join(' → ')); }
    } else { chain.forEach(id => safe.add(id)); if (chain.length > maxDepth) maxDepth = chain.length; }
  }
  if (!seenCycles.size) console.log('✓ parent graph is acyclic (longest chain walked: ' + maxDepth + ' hops)');
}

// ── 5. lat ∈ [-90,90], lon ∈ [-180,180], both finite numbers ─────────────────────
{
  const okLat = v => typeof v === 'number' && isFinite(v) && v >= -90  && v <= 90;
  const okLon = v => typeof v === 'number' && isFinite(v) && v >= -180 && v <= 180;
  const off = sites.filter(s => !okLat(s.lat) || !okLon(s.lon));
  if (off.length) { bad(off.length + ' site(s) with out-of-range/non-numeric coordinates:'); off.forEach(s => console.log('    ' + s.id + ' (lat ' + s.lat + ', lon ' + s.lon + ')')); }
  else console.log('✓ all coordinates in range (lat ±90, lon ±180, finite)');
}

// ── 6. unit non-empty OR the row is a sanctioned guard*/oib exception ────────────
{
  const sanctionedGrp = g => /^guard/.test(g || '') || g === 'oib';
  const blank = sites.filter(s => s.unit != null && !String(s.unit).trim());
  if (blank.length) bad(blank.length + ' row(s) with a present-but-blank unit (data bug, not a map-only site): ' + blank.map(s => s.id).join(' · '));
  const unitless   = sites.filter(s => s.unit == null);
  const sanctioned = unitless.filter(s => sanctionedGrp(s.grp));
  const mapOnly    = unitless.filter(s => !sanctionedGrp(s.grp));
  console.log('✓ unit rule: ' + (sites.length - unitless.length) + ' rows carry a unit · ' + sanctioned.length + ' sanctioned unit-less exceptions (grp guard*/oib):');
  if (sanctioned.length) console.log('    ' + sanctioned.map(s => s.id).join(' · '));
  if (mapOnly.length) {
    warn(mapOnly.length + ' unit-less rows outside guard*/oib (map-only sites — expected for joint/COCOM HQs, APS-2 sites, MOTs, districts; do not let this list grow silently):');
    console.log('    ' + mapOnly.map(s => s.id).join(' · '));
  }
}


// ── 7. THE ORG TREE (v1.0.1 — added after the 1st ID knowledge check: the v1.0.0
//      merge created twin nodes the site-only lint could not see) ────────────────
{
  const OFILE = path.join(ROOT, 'data', 'orgs.json');
  if (!fs.existsSync(OFILE)) bad('data/orgs.json missing');
  else {
    let orgs;
    try { orgs = JSON.parse(fs.readFileSync(OFILE, 'utf8')).orgs; } catch (e) { orgs = null; bad('orgs.json unparsable: ' + e.message); }
    if (orgs) {
      const byId = new Map(orgs.map(o => [o.id, o]));
      const dupIds = orgs.length - byId.size;
      if (dupIds) bad(dupIds + ' duplicate org id(s)'); else console.log('✓ all ' + orgs.length + ' org ids unique');
      const orphans = orgs.filter(o => o.parent && !byId.has(o.parent));
      if (orphans.length) bad(orphans.length + ' org(s) with unresolvable parent: ' + orphans.slice(0,6).map(o=>o.id).join(' · '));
      else console.log('✓ every org parent resolves');
      let cyc = 0, deep = 0;
      for (const o of orgs) { let cur = o, seen = new Set(), d = 0;
        while (cur && cur.parent) { if (seen.has(cur.id)) { cyc++; break; } seen.add(cur.id); cur = byId.get(cur.parent); if (++d > 40) { cyc++; break; } }
        deep = Math.max(deep, d); }
      if (cyc) bad(cyc + ' org(s) in a parent cycle'); else console.log('✓ org tree acyclic (deepest chain ' + deep + ')');
      const siteIds = new Set(sites.map(s => s.id));
      const badSite = orgs.filter(o => o.site && !siteIds.has(o.site));
      if (badSite.length) bad(badSite.length + ' org(s) pointing at missing sites: ' + badSite.slice(0,6).map(o=>o.id).join(' · '));
      else console.log('✓ every org.site resolves to a real site');
      // TWIN RULES (the 1st ID lesson): same parent may not hold two orgs whose
      // aggressive keys match or extend each other — that is one unit written twice.
      const key = n => String(n).toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z0-9]+/g, '');
      const byParent = {};
      orgs.forEach(o => { (byParent[o.parent] = byParent[o.parent] || []).push(o); });
      const twins = [];
      for (const pid in byParent) { const ks = byParent[pid];
        for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) {
          const a = key(ks[i].name), b = key(ks[j].name);
          if (!a || !b) continue;
          // prefix counts only when the remainder is substantial — 'DCE Region I'
          // vs 'DCE Region II' differ by a numeral and are DIFFERENT units
          const pre = (s, t) => s.length >= 10 && t.startsWith(s) && (t.length - s.length) >= 4;
          if (a === b || pre(a, b) || pre(b, a))
            twins.push(ks[i].name + ' <> ' + ks[j].name);
        } }
      if (twins.length) { bad(twins.length + ' same-parent twin pair(s) — one unit written twice:'); twins.slice(0,12).forEach(t=>console.log('    ' + t)); }
      else console.log('✓ no same-parent twins (aggressive-key + prefix rule)');
    }
  }
}

console.log((fails ? 'DATA LINT FAIL' : 'DATA LINT PASS') + (warns ? ' (' + warns + ' warning' + (warns === 1 ? '' : 's') + ')' : ''));
process.exit(fails ? 1 : 0);
