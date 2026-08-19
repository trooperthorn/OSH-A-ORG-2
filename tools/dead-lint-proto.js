// DEAD LINT — keeps the v23.0.0 prune from silently re-accumulating. Two mechanical checks
// against index.html, no deps, Node >=18:
//   1. CSS classes that appear only inside <style> and are never applied anywhere else.
//      A selector containing such a class can never match, so the rule is unreachable
//      weight shipped to every phone on every cold load.
//   2. `function name(` declarations with zero non-definition references. Self-invoking
//      IIFEs — `(function loadNotes(){…})()` — are live and are NOT flagged (the v7.6.x
//      audit hit exactly that false positive; see the changelog note in index.html).
// Dynamically built class names are respected: a class is spared when some prefix of it
// appears in the source next to a concatenation or a `${}` interpolation, which is how
// 'bd-tag-'+tag and 'rf-t-'+side reach the DOM.
// Runs in the GitHub Action alongside the six other checks; also `node tools/dead-lint.js`.
const fs = require('fs');
let fail = 0;
const bad = (m) => { fail++; console.log('✗ ' + m); };

const src = fs.readFileSync('./index.html', 'utf8');
const L = src.split('\n');

// ── locate the single <style> block ────────────────────────────────────────────
const a = L.findIndex(l => /<style>/.test(l));
const b = L.findIndex(l => /<\/style>/.test(l));
if (a < 0 || b < 0 || b <= a) { bad('could not locate the <style> block'); process.exit(1); }
const css  = L.slice(a + 1, b).join('\n');
const rest = L.slice(0, a + 1).join('\n') + '\n' + L.slice(b).join('\n');

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

console.log(fail ? 'DEAD LINT FAIL' : 'DEAD LINT PASS');
process.exit(fail ? 1 : 0);
