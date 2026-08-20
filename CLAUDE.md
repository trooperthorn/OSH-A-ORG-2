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

## Backlog (M1 close-out → M2 inputs)
1. **Fat fields to runtime**: unitFull/parentUnit/tenants stay in data/sites.json only;
   s3's fullF search rung and s4's crumb sub-labels sleep until the M2 datastore seeds
   them. Wire the seed, then delete this line.
2. **ASCC parent convention split** (SME hold): USARPAC/USARCENT/ARCYBER chain to COCOM
   sites; USAREUR-AF/USAWHC chain to HQDA. Pick one rule in the M2 data pass.
3. **Verify with sources**: 'Combined Arms Command (CAC)' naming (vs Combined Arms
   Center) across 6 rows; USAASC in austin-t2com-hq tenants; usnorthcom-peterson's
   263rd AAMDC tenant; camp-mujuk / camp-as-sayliyah retention (owner call).
4. **Label density**: COCOM landmark labels crowd the CONUS view at low zoom — label
   tiering pass (A-ORG-1's zoom-tier idiom is in the port, needs tuning).
5. **grp metadata**: fort-buchanan (PR) and fort-wainwright-greely-alaska carry
   grp=conus; inert on a sphere, but decide the vocabulary before any flat inset ships.
6. Upstream A-ORG-1 fix to send back: Detroit Arsenal latitude (42.59 → 42.49) at its
   index.html:12147.

## v0.2.0 — the committed identity + the export contract
- **ORBIT is THE look** (owner references, 20 Aug): deep-space navy, luminous
  continents on dark ocean, blue limb halo, light arcs; glass chrome at the
  edges only. No theme switcher. World paint = tokens (--ocean-hi/lo, --land,
  --coast, --world-glow).
- **buildSnapshot() is the export law.** Every exporter (PNG/PDF/HTML/JSON —
  s6-export) consumes ONLY the Snapshot object. New capability (datastore,
  brief) attaches to Snapshot.sites / Snapshot.extras — never rebuild a renderer.
- famOf()/FAM_META = command-family colors (data hues, not theme chrome);
  legend (⊙) is a filter. Trail chips + ‹ Back = the stroll. Dossier opens SLIM
  on phones (name-bar first — the globe owns the screen).

## v0.4.0 — the datastore
- s7-records: one record per org (people/specs/notes/links), memory map +
  IndexedDB write-through (aorg2/records, v1), loaded after first paint;
  degrades to memory-only where IndexedDB is absent. window.Records is the API.
- Sheet tabs are the UI; one Add row that becomes the two-field form in place.
- Records ride Snapshot.extras.records — exporters gained sections with zero
  plumbing changes. Backup/restore = one JSON file via the ⋯ menu.
