// SHIP LINT — enforces the CLAUDE.md ship ritual in CI: APP_VERSION (index.html) and
// CACHE (sw.js) must move together, vX.Y.Z ↔ a-org-2-vX-Y-Z. A drift here silently
// leaves returning users on a stale cached bundle (the SW never re-caches), so this is
// a hard gate. ADAPTED from A-ORG-1 tools/ship-lint.js — the cache prefix changes
// (army-org- → a-org-2-), paths resolve against the repo root, and there is one new
// branch: until M1 integration produces index.html there is no APP_VERSION to check,
// so a missing index.html is a clean SKIP (exit 0), never a crash — sw.js carries its
// parked CACHE for that first cut. Runs in the GitHub Action alongside the other
// checks; also runnable locally (`node tools/ship-lint.js`).
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let fail = 0;
const bad = (m) => { fail++; console.log('✗ ' + m); };

const IDX = path.join(ROOT, 'index.html');
if (!fs.existsSync(IDX)) {
  console.log("SHIP LINT SKIP (no index.html yet — integration hasn't happened; nothing to version-check)");
  process.exit(0);
}
const SW = path.join(ROOT, 'sw.js');
if (!fs.existsSync(SW)) { bad('sw.js missing — index.html exists, and the ship ritual needs both'); console.log('SHIP LINT FAIL'); process.exit(1); }

const html = fs.readFileSync(IDX, 'utf8');
const sw   = fs.readFileSync(SW, 'utf8');

const vm = html.match(/APP_VERSION\s*=\s*'([^']+)'/);
const cm = sw.match(/CACHE\s*=\s*'([^']+)'/);

if (!vm) bad('APP_VERSION not found in index.html');
if (!cm) bad('CACHE not found in sw.js');

if (vm && cm) {
  const ver = vm[1];                 // e.g. v0.1.0
  const cache = cm[1];               // e.g. a-org-2-v0-1-0
  if (!/^v\d+\.\d+\.\d+$/.test(ver)) bad('APP_VERSION "' + ver + '" is not vX.Y.Z');
  const expect = 'a-org-2-' + ver.replace(/\./g, '-');
  if (cache !== expect) {
    bad('ship-ritual drift — APP_VERSION ' + ver + ' expects CACHE "' + expect + '", but sw.js has "' + cache + '"');
  } else {
    console.log('✓ ship ritual in sync: ' + ver + ' ↔ ' + cache);
  }
  // the changelog should carry an entry for the current version (a nudge, not fatal-strict)
  if (html.indexOf('//   ' + ver + ' •') < 0 && html.indexOf('// ' + ver + ' •') < 0) {
    console.log('~ no changelog line found for ' + ver + ' (expected a "//   ' + ver + ' • …" entry)');
  } else {
    console.log('✓ changelog entry present for ' + ver);
  }
}

console.log(fail ? 'SHIP LINT FAIL' : 'SHIP LINT PASS');
process.exit(fail ? 1 : 0);
