# CLAUDE.md — A-ORG-2 (Claude Code reads this automatically)

A-ORG-2 is a ground-up rebuild of A-ORG-1 around three jobs: find any Army base ·
parent-child lines only · brief-to-PDF. Charter: docs/CHARTER.md. Scope §2 of the
charter is a CONTRACT — the OUT column returns only with written owner sign-off.

## Non-negotiables (inherited from A-ORG-1 because they are why the product works)
1. **Single file, no build step, no frameworks.** index.html is the app. Modules under
   modules/ exist only during construction; the shipped artifact is one file.
2. **Phone-first is sacred**; desktop lives in `@media (min-width:1100px)` layers only.
3. **Zero foreign code at boot.** Sync loads lazily on explicit connect only.
4. **Ship ritual**: APP_VERSION (index.html) ↔ CACHE (sw.js) move together + changelog
   entry. Lint-enforced.
5. **Single-brain law**: one selection model, one search, one drawer, one Globe ⇄ Brief
   toggle. No feature ships that does not route through that spine.
6. **Brief tier colors are semantics**: L1 white · L2 cools · L3 warms · L4 roses; no
   green on brief data. The base theme changes; this grammar does not.
7. **Size budget**: index.html < 900 KB. dead-lint + byte ledger run in CI.
8. Test before commit: `node tools/data-lint.js && node tools/harness_globe.js &&
   node tools/smoke_runtime.js && node tools/ship-lint.js && node tools/dead-lint.js`
   (suite grows with M2-M4: store, brief, PDF golden-file).

## Data law
- data/sites.json is the map layer: { id, base, unit, lat, lon, grp, parent }. The parent
  pointer IS the link model. No other relationship data exists in A-ORG-2.
- The datastore (M2) is IndexedDB, schema-versioned, exported/restored as one JSON file.

## Working style
- Small commits, version in message (vX.Y.Z: …). CI green before merge.
- The globe engine is PORTED from A-ORG-1, not rewritten — its math survived 22 major
  versions; treat regressions against A-ORG-1 behavior as bugs.
