// DEAD LINT — keeps the prune discipline from silently re-accumulating. ADAPTED from
// tools/dead-lint-proto.js (itself the A-ORG-1 v23.0.0-prune tool) for A-ORG-2's
// index.html. Three mechanical checks, no deps, Node >=18:
//   1. CSS classes that appear only inside <style> and are never applied anywhere else.
//      A selector containing such a class can never match, so the rule is unreachable
//      weight shipped to every phone on every cold load. A-ORG-2's shell carries TWO
//      <style> wrappers (@TOKENS + @THEMES), so classes are collected from ALL style
//      blocks — the proto's single-block scan would miss the theme layer.
//   2. `function name(` declarations with zero non-definition references. Self-invoking
//      IIFEs — `(function loadNotes(){…})()` — are live and are NOT flagged (the
//      A-ORG-1 v7.6.x audit hit exactly that false positive).
//   3. Size budget (CLAUDE.md non-negotiable #7): index.html < 900 KB, with the byte
//      ledger printed every run so growth is visible long before the gate trips.
// Dynamically built class names are respected: a class is spared when some prefix of it
// appears in the source next to a concatenation or a `${}` interpolation, which is how
// 'bd-tag-'+tag and 'rf-t-'+side reach the DOM.
// Until M1 integration produces index.html there is nothing to prune: a missing
// index.html is a clean SKIP (exit 0), never a crash.
// Runs in the GitHub Action alongside the other checks; also `node tools/dead-lint.js`.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let fail = 0;
const bad = (m) => { fail++; console.log('✗ ' + m); };

const IDX = path.join(ROOT, 'index.html');
if (!fs.existsSync(IDX)) {
  console.log("DEAD LINT SKIP (no index.html yet — integration hasn't happened; nothing to prune)");
  process.exit(0);
}
const src = fs.readFileSync(IDX, 'utf8');

// ── locate ALL <style> blocks (shell contract: @TOKENS wrapper + identity wrapper).
//    Real style elements never live inside <script>, but script STRINGS/comments can
//    mention style tags (the export renderers write '<style>' into popup docs; an s3
//    comment names its old injected tag) — so blank out script bodies first and find
//    style spans in the blanked copy. Offsets still line up: blanking preserves length.
const srcNoScript = src.replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/g,
  (m, a, b, c) => a + b.replace(/[^\n]/g, ' ') + c);
const styleBlocks = [...srcNoScript.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => {
  return { index: m.index, 0: src.slice(m.index, m.index + m[0].length), 1: src.slice(m.index + 7, m.index + m[0].length - 8) };
});
if (!styleBlocks.length) { bad('could not locate any <style> block'); console.log('DEAD LINT FAIL'); process.exit(1); }
const css = styleBlocks.map(m => m[1]).join('\n');
let rest = '', last = 0;                                      // everything outside style innards
for (const m of styleBlocks) { rest += src.slice(last, m.index) + '<style></style>'; last = m.index + m[0].length; }
rest += src.slice(last);

// ── 1 · unreachable CSS classes ────────────────────────────────────────────────
// Collect class tokens from selector text only (everything at brace-depth 0).
const cssNC = css.replace(/\/\*[\s\S]*?\*\//g, '');
const classes = new Set();
{
  const clsRe = /\.(-?[_a-zA-Z][-\w]*)/g;
  let depth = 0, buf = '';
  for (const ch of cssNC) {
    if (ch === '{') { if (depth === 0) { let t; while ((t = clsRe.exec(buf))) classes.add(t[1]); buf = ''; } depth++; }
    else if (ch === '}') { depth--; if (depth < 0) depth = 0; buf = ''; }
    else if (depth === 0) buf += ch;
  }
}
const esc = s => s.replace(/-/g, '\\-');
const isDynamic = (c) => {
  for (let i = 3; i < c.length; i++) {
    const p = c.slice(0, i);
    if (new RegExp('[\'"`]' + esc(p) + '([\'"`]\\s*\\+|\\$\\{)').test(rest)) return true;
  }
  return false;
};
const deadClasses = [...classes]
  .filter(c => !new RegExp('\\b' + esc(c) + '\\b').test(rest))
  .filter(c => !isDynamic(c))
  .sort();

if (deadClasses.length) {
  bad(deadClasses.length + ' CSS class(es) styled but never applied — the rules can never match:');
  deadClasses.forEach(c => console.log('    .' + c));
} else {
  console.log('✓ every styled class (' + classes.size + ') is applied somewhere');
}

// ── 2 · functions with no call sites ───────────────────────────────────────────
// Strip comments so the changelog's prose never counts as a reference.
const noCmt = src.replace(/\/\*[\s\S]*?\*\//g, '')
                 .split('\n').map(l => l.replace(/^\s*\/\/.*$/, '')).join('\n');
const fnNames = new Set();
{ let m; const re = /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g; while ((m = re.exec(noCmt))) fnNames.add(m[1]); }

const deadFns = [];
for (const n of fnNames) {
  // a named IIFE is its own call site
  if (new RegExp('\\(\\s*function\\s+' + n + '\\s*\\(').test(noCmt)) continue;
  const total = (noCmt.match(new RegExp('\\b' + n + '\\b', 'g')) || []).length;
  const defs  = (noCmt.match(new RegExp('\\bfunction\\s+' + n + '\\s*\\(', 'g')) || []).length;
  if (total - defs === 0) deadFns.push(n);
}
deadFns.sort();

if (deadFns.length) {
  bad(deadFns.length + ' function(s) declared with zero call sites:');
  deadFns.forEach(n => console.log('    ' + n + '()'));
} else {
  console.log('✓ all ' + fnNames.size + ' declared functions have at least one call site');
}

// ── 3b · zero foreign origins in the boot path: no cross-origin URL literals in
//        any <script> (comments stripped — changelog citations are fine). The one
//        lesson of A-ORG-1 v8.9.1 plus the M1 hoisting-order near-miss: CDN rungs
//        must be structurally impossible, not just unreached. ─────────────────────
{
  const scripts = [...src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  const noCmt = scripts.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map(l => l.replace(/^\s*\/\/.*$/, '').replace(/([^:])\/\/.*$/, '$1')).join('\n');
  // v1.1.0 THE ONE EXCEPTION — the database door. ensureSupabase() lazy-injects
  // exactly this library on MANUAL Connect only; smoke enforces that no #sbLib
  // script and no window.supabase global exist at boot. Anything else stays banned.
  // v2.4.0 THE SECOND CLASS — XML NAMESPACE IDENTIFIERS. The deck exporter
  // (_pptxParts) hand-writes OOXML, and OOXML's namespace names are http://
  // URIs by spec: they are opaque identifiers inside generated markup, never
  // fetched, never loaded, never reachable by the network layer. Scoped to
  // exactly the OPC/OOXML schema hosts the exporter emits — any other origin
  // still fails the build.
  const ALLOW = [/^https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@/,
                 /^http:\/\/schemas\.openxmlformats\.org\//,
                 /^http:\/\/purl\.org\/dc\//,
                 /^http:\/\/www\.w3\.org\/2001\/XMLSchema-instance/];
  const hits = [...noCmt.matchAll(/https?:\/\/[^\s'"`)]+/g)].map(m => m[0])
    .filter(h => !ALLOW.some(a => a.test(h)));
  if (hits.length) {
    bad(hits.length + ' cross-origin URL literal(s) in script code (zero-foreign-code law):');
    hits.slice(0, 8).forEach(h => console.log('    ' + h));
  } else {
    console.log('✓ no cross-origin URL literals in script code (database CDN allowlisted, boot-inert)');
  }
}

// ── 3 · size budget: index.html < 900 KB, ledger printed every run ─────────────
{
  const BUDGET = 900 * 1024;
  const bytes = Buffer.byteLength(src, 'utf8');
  const sum = (re) => { let t = 0, m; while ((m = re.exec(src))) t += Buffer.byteLength(m[0], 'utf8'); return t; };
  // Export templates contain <style> strings inside scripts. Reuse the real
  // shell spans found above: counting those strings again made markup negative.
  const styleB  = styleBlocks.reduce((t, m) => t + Buffer.byteLength(m[0], 'utf8'), 0);
  const scriptB = sum(/<script[^>]*>[\s\S]*?<\/script>/g);
  const otherB  = bytes - styleB - scriptB;
  if (otherB < 0) bad('size ledger overlaps: embedded export styles must count inside scripts only');
  const pad = n => n.toLocaleString('en-US').padStart(9);
  const pct = (bytes / BUDGET * 100).toFixed(1);
  console.log('  size ledger (bytes):');
  console.log('    <style>   ' + pad(styleB));
  console.log('    <script>  ' + pad(scriptB));
  console.log('    markup    ' + pad(otherB));
  console.log('    total     ' + pad(bytes) + '   budget ' + pad(BUDGET) + '   (' + pct + '% used)');
  if (bytes >= BUDGET) {
    bad('size budget blown: index.html is ' + bytes.toLocaleString('en-US') + ' bytes ≥ ' + BUDGET.toLocaleString('en-US') + ' (900 KB) — prune before ship');
  } else {
    console.log('✓ size budget: ' + bytes.toLocaleString('en-US') + ' bytes < 900 KB (' + (BUDGET - bytes).toLocaleString('en-US') + ' headroom)');
    if (bytes >= BUDGET * 0.9) console.log('~ within 10% of the byte budget — plan the next prune now, not at the gate');
  }
}

console.log(fail ? 'DEAD LINT FAIL' : 'DEAD LINT PASS');
process.exit(fail ? 1 : 0);
