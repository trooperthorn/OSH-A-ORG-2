// CODEMAP — generate docs/CODEMAP.md, a navigable index of index.html.
//
// WHY THIS EXISTS: index.html is ~912 KB / 10,200 lines. No assistant working
// from pasted excerpts (ChatGPT, a fresh Claude, a human on a phone) can hold it
// in context, and line numbers move every release. This emits a map — every
// section banner, every top-level function, every exported global, and a byte
// ledger per section — so a reader can say "give me lines 5100-5180" instead of
// asking for the file.
//
// REGENERATE after any release that moves code:  node tools/codemap.js
// The map is a derived artifact; never hand-edit docs/CODEMAP.md.
//
// Node >=18, zero deps.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const IDX = path.join(ROOT, 'index.html');
const OUT = path.join(ROOT, 'docs', 'CODEMAP.md');

const src = fs.readFileSync(IDX, 'utf8');
const lines = src.split('\n');
const ver = (src.match(/APP_VERSION\s*=\s*'([^']+)'/) || [, '?'])[1];

// ── byte offset of each line, so a section's weight can be measured ──────────
const off = new Array(lines.length + 1);
{ let n = 0; for (let i = 0; i < lines.length; i++) { off[i] = n; n += Buffer.byteLength(lines[i], 'utf8') + 1; } off[lines.length] = n; }

// ── SECTIONS: the banners the file already carries ──────────────────────────
// Module banners are the spine; the big CSS/HTML/data banners bracket the rest.
const sections = [];
lines.forEach((L, i) => {
  let m;
  if ((m = L.match(/^\/\* ══════════ module: ([a-z0-9-]+) ══════════ \*\//))) {
    sections.push({ line: i + 1, key: m[1], kind: 'module' });
  } else if ((m = L.match(/^\/\* ═+\s*(.+?)\s*═+\s*\*\/\s*$/)) && m[1].length < 90) {
    sections.push({ line: i + 1, key: m[1], kind: 'css' });
  } else if (/^\/\/ ═══ CHANGELOG/.test(L)) {
    sections.push({ line: i + 1, key: 'CHANGELOG (in-file release ledger)', kind: 'prose' });
  } else if (/^var A1ORGS=window\.A1ORGS=/.test(L)) {
    sections.push({ line: i + 1, key: 'DATA: A1ORGS literal (inline copy of data/orgs.json)', kind: 'data' });
  } else if (/^var SITES=window\.SITES=/.test(L)) {
    sections.push({ line: i + 1, key: 'DATA: SITES literal (inline copy of data/sites.json)', kind: 'data' });
  } else if (/^window\.US_STATES=/.test(L)) {
    sections.push({ line: i + 1, key: 'DATA: US_STATES literal', kind: 'data' });
  } else if (/^<script>\s*$/.test(L)) {
    sections.push({ line: i + 1, key: '<script> — the application', kind: 'boundary' });
  } else if (/^<body/.test(L)) {
    sections.push({ line: i + 1, key: '<body> — markup', kind: 'boundary' });
  } else if (/^<style>/.test(L)) {
    sections.push({ line: i + 1, key: '<style> — all CSS', kind: 'boundary' });
  }
});
sections.sort((a, b) => a.line - b.line);
sections.forEach((s, i) => { s.end = i + 1 < sections.length ? sections[i + 1].line - 1 : lines.length; });
const secAt = (ln) => { let cur = null; for (const s of sections) { if (s.line <= ln) cur = s; else break; } return cur; };

// ── DECLARATIONS: top-level functions and the state they close over ─────────
const decls = [];
lines.forEach((L, i) => {
  let m;
  if ((m = L.match(/^(async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)/))) {
    decls.push({ line: i + 1, name: m[2], args: m[3].trim(), kind: 'fn' });
  } else if ((m = L.match(/^(?:const|let|var)\s+([A-Z][A-Z0-9_]{2,})\s*=/))) {
    decls.push({ line: i + 1, name: m[1], kind: 'const' });   // SHOUTY = a data table or contract
  }
});

// ── EXPORTS: what the app hands to window (the drive-it-headlessly surface) ──
const exp = [];
{ const rx = /window\.([A-Za-z_$][\w$]*)\s*=/g; let m;
  while ((m = rx.exec(src))) { if (!exp.includes(m[1])) exp.push(m[1]); } }

// ── ELEMENT IDS: the surfaces a probe can query ─────────────────────────────
const ids = [];
{ const rx = /\bid="([A-Za-z][\w-]*)"/g; let m;
  while ((m = rx.exec(src))) { if (!ids.includes(m[1])) ids.push(m[1]); } }

// ── EMIT ─────────────────────────────────────────────────────────────────────
const kb = (b) => (b / 1024).toFixed(1) + ' KB';
let out = '';
out += '# A-ORG-2 — CODEMAP\n\n';
out += '**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.\n\n';
out += 'Index of `index.html` at **' + ver + '** — ' +
       Buffer.byteLength(src, 'utf8').toLocaleString() + ' bytes, ' +
       lines.length.toLocaleString() + ' lines, ' + decls.filter(d => d.kind === 'fn').length +
       ' top-level functions.\n\n';
out += 'Line numbers move every release. Confirm by searching the banner or the\n';
out += '`function name(` text, not by trusting the number.\n\n';

out += '## Weight by section\n\n';
out += 'Where the bytes are. The file is under a hard 900 KB CI gate, so this table\n';
out += 'is the starting point for any prune.\n\n';
out += '| Section | Lines | Size |\n|---|---|---|\n';
sections.slice().sort((a, b) => (off[b.end] - off[b.line - 1]) - (off[a.end] - off[a.line - 1]))
  .slice(0, 20)
  .forEach(s => { out += '| ' + s.key + ' | ' + s.line + '–' + s.end + ' | ' + kb(off[s.end] - off[s.line - 1]) + ' |\n'; });

out += '\n## Sections in file order\n\n';
out += '| Line | Section | Kind |\n|---|---|---|\n';
sections.forEach(s => { out += '| ' + s.line + ' | ' + s.key + ' | ' + s.kind + ' |\n'; });

out += '\n## Functions by section\n\n';
const bySec = new Map();
decls.forEach(d => {
  const s = secAt(d.line), k = s ? (s.line + ' · ' + s.key) : '(before first section)';
  if (!bySec.has(k)) bySec.set(k, []);
  bySec.get(k).push(d);
});
for (const [k, ds] of bySec) {
  if (!ds.length) continue;
  out += '### ' + k + '\n\n';
  ds.forEach(d => {
    out += '- `' + d.line + '` ' + (d.kind === 'const' ? '**' + d.name + '**' : '`' + d.name + '(' + (d.args || '') + ')`') + '\n';
  });
  out += '\n';
}

out += '## Globals on `window`\n\n';
out += 'The headless-drive surface: what a probe or a browser console can call.\n\n';
out += exp.map(e => '`' + e + '`').join(' · ') + '\n\n';

out += '## Element IDs\n\n';
out += ids.map(e => '`#' + e + '`').join(' · ') + '\n';

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log('CODEMAP written: ' + path.relative(ROOT, OUT) +
            ' — ' + sections.length + ' sections · ' + decls.length + ' declarations · ' +
            exp.length + ' globals · ' + ids.length + ' ids · ' + kb(Buffer.byteLength(out, 'utf8')));
