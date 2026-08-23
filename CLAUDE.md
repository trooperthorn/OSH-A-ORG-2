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
- data/sites.json v2 is the map layer: { id, base, st, lat, lon, grp, cls, unit, parent }
  — the FULL A-ORG-1 roster carried over LIGHTWEIGHT (owner directive 20 Aug: no leader
  prose, no tenants, no descriptions — ever). The parent pointer IS the link model.
  cls ∈ base|hq|depot|guard. NOTE: grp folds A-ORG-1's kind as 'grp|kind' on 71 rows
  (e.g. 'conus|usace') — never consume grp as a plain enum.
- The inline SITES literal in index.html must stay row-for-row identical to
  data/sites.json (data-lint checks; regenerate with tools/extract-sites.js, whose slug
  MUST match data-lint's — NFD diacritics fold included; the derivation is the contract).
- The datastore (M2) is IndexedDB, schema-versioned, exported/restored as one JSON file.

## Working style
- Small commits, version in message (vX.Y.Z: …). CI green before merge.
- The globe engine is PORTED from A-ORG-1, not rewritten — its math survived 22 major
  versions; treat regressions against A-ORG-1 behavior as bugs.

## Backlog (v0.6.0 audit close-out → next data pass)
1. **ASCC parent convention split** (SME hold): USARPAC/USARCENT/ARCYBER chain to COCOM
   sites; USAREUR-AF/USAWHC chain to HQDA. Pick one rule in the next data pass.
2. **Verify with sources**: 'Combined Arms Command (CAC)' naming (vs Combined Arms
   Center); camp-mujuk / camp-as-sayliyah retention (owner call).
3. ~~Label density~~ — DONE at v0.10.0 (echelon ladder: roots 2.4 · hq 2.6 ·
   depot 3.2 · base 3.8 · inset 4.2, +0.7 phone; guard past 6.5).
4. **grp metadata**: fort-buchanan (PR) and fort-wainwright-greely-alaska carry
   grp=conus; inert on a sphere, but decide the vocabulary before any flat inset ships.
5. Upstream A-ORG-1 fix to send back: Detroit Arsenal latitude (42.59 → 42.49) at its
   index.html:12147. (A-ORG-2 carries the corrected 42.49 as a documented deviation.)
6. **A-ORG-1 upstream data questions surfaced by the v0.6.0 carryover audit** (roster is
   verbatim A-ORG-1 by owner law; flag, don't edit without owner sign-off): `sembach`
   (spine, coords ~100 km west near Luxembourg) vs `sembach-kaserne` (correct coords, no
   spine) look like one installation twice; suspect coords vs the retired v1 set on
   mainz-kastel (49.3,9.6 ≈ Heilbronn), vilseck (49.1,12.4), yuma-pg, camp-buehring,
   torii-station. hohenfels-jmrc was re-parented to grafenwohr-vilseck (v1 pointer broke
   in the NFD id rename) — already applied.
7. **Dropped at the v0.6.0 wipe** (in v1, not in A-ORG-1 — intentional under 'carry over
   A-ORG-1 entirely'): fort-mcnair, eglin-afb, nas-jrb-new-orleans-belle-chasse. Restore
   only if the owner asks.
8. **Cluster centroid is a raw lat/lon average** — dateline-unsafe if a 44px cell ever
   straddles ±180° (no current data does). Use the nearRegion dlon-wrap idiom if Pacific
   sites densify.

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

## v0.5.0 — Brief 2.0 (M3)
- BRIEF {hqs, ann} is the user-assembled set; persisted in IndexedDB kv (db v2).
  window.Brief is the API. 'Add to brief' lives on the org sheet; the brief-mode
  sheet is the manifest (annotate ≤80 chars via the inline-form grammar; remove
  inside the form). renderBrief: one tier-law block per HQ, four echelons, exact
  CSS connectors. extras.brief rides the Snapshot; dossier exports grew the
  tiered Brief section.

## v0.6.0 — the A-ORG-1 carryover (consult-team build)
- RADIAL NAV is the control law: home/back/clear/saved hidden INSIDE #navGlobe,
  tap = pop-out ring, hold 3 s (#nvRing progress) = MAP ⇄ BRIEF, ring self-closes
  on flip. No pointer capture; outside-tap swallow via GlobeState._navSwallow.
- selectSite(id, o) is the ONE selection rail (searchSelect delegates; o.keepCam
  for saved-view recall). Every pick feeds trail + SELECT-clock auto-fill.
- LCD pair: seg7 engine (keep .sg-a…g greppable-literal — a dead-code purge ate
  them in A-ORG-1), #clockTL LOCAL + #clockTR SELECT; zone state in kv 'selZone'
  (manual picks only; auto traffic is ephemeral and never touches storage).
- Markers: sharp glass reticle (no halo/shadowBlur in the dot pass), cls colors;
  zoom<1.6 clusters into count badges (never in brief). Brief thumbnail draws
  chain members only; drawGlobeLinks early-returns in brief.

## v0.7.0 — the brief is built ON the globe (owner correction, 21 Aug)
- Brief mode keeps the FULL-SCREEN globe; the chain draws on it (white dots +
  tier rings, tier-stream arcs via drawBriefArcs/drawBriefNodes, BF_STREAMS —
  L2 cools NEVER green). _briefChainMap() walks BRIEF.hqs → sites + ORGS four
  echelons deep; __bfC refreshes per frame in the links pass.
- The tree is the CHART CARD (#briefStage): compact _bfAbbr chips, arrives
  MINIMIZED (chart-min), never the hero. Objects show almost nothing; the
  OBJECT POPUP (_bfObjSheet) shows everything — tap a chain dot or a chip.
- Custom subordinate orgs: window.Orgs (kv 'orgs'), added from the popup or the
  map card (+ Subordinate), located at their base or their parent; they lead
  their chart row and ride Snapshot.extras.orgs.
- View toggles: Names · Dots · Lines rows in the Layers panel (GlobeState
  _namesOff/_dotsOff/_linesOff), honored in both rooms; an undrawn dot is
  untappable by design.
- App icon = the Lumen mark (gold wireframe globe + lit chain on black);
  icon-512/192/180 + icon-maskable-512, manifest + theme-color #060504.

## v0.8.0 — the holistic pass (owner directive, 21 Aug: no more 1-by-1 edits)
- NO OVERCAST, ever: --land stays near-black (17,14,9), --world-glow stays 0.
  Gold linework carries the map; any wash that survives a zoom level is a bug.
- Zoom span 1..28 (wheel/pinch/double-tap all clamp 28); page pinch-zoom is
  LOCKED (viewport maximum-scale=1) — chrome can no longer be scaled/clipped.
- THE RING is the control surface: back(undo) · clear · zoom− · zoom+ · saved ·
  layers on a 165°→15° arc, r=100. Home is retired. Back pops GlobeState._undo
  (snapshots pushed by selectSite/_dblZoom/cluster-fly/svRecall; o.noUndo guards
  restore paths). Zoom sats keep the ring open (rocker).
- CHROME LAW: the wordmark stands alone (no tiles, no ⋯). Maintenance = wordmark
  long-press → #appMenu (version · backup · restore · diagnostics). Layers lives
  in the ring. Chrome YIELDS (body.gesturing fades floats) during globe gestures.
- COMPACT CARD LAW: the org card face is ONE row; every action nests behind ⊕
  (brief ★ · subordinate · details ▤ — 40px circles that must stay clear of the
  FAB column); detail/tabs render only behind ▤. New selection = compact again.

## v0.9.0 — the anchored callout (owner reference set)
- Selection identity lives AT the dot: #calloutCard (z 38) with caret tail,
  tracked per dirty frame via GlobeState.__mCss + _coTrack; far side = faded.
  ✕ clears; ▤ opens the sheet (the ONLY auto-surface law: nothing opens the
  bottom sheet on plain selection anymore). Chart chips anchor the same card
  (fixed point). Forms stay in the sheet. Callout joins the gesture-yield set.

## v0.10.0 — the intuition pass (automation roadmap, owner "go")
- Labels arrive by echelon (ladder above); guard names only past zoom 6.5.
- Session memory: kv 'session' (change-gated 2.5s interval), restored in
  _rdbOpen post-paint ONLY on an untouched boot (GlobeState._touched guard).
- _bfFrame(): chain growth in the brief room reflies to hold the whole chain;
  _xpPulse(): the chart export button glows twice on growth. Both fire from
  bfAdd/orgAdd; both no-op outside the brief room.

## v0.11.0 — the A-ORG-1 spine (owner directive, 21 Aug)
- **THE ORG TREE IS LAW**: data/orgs.json + the inline A1ORGS literal carry the
  full A-ORG-1 reporting structure VERBATIM — 1,403 orgs, 9 levels, HQDA apex →
  ACOMs · ASCCs · DRUs · PAE/CPEs · NGB. {id, name, parent, lvl, root, site}.
  Never edit org rows by hand; they are A-ORG-1's own data (FORSCOM absent
  because A-ORG-1's USAWHC subsumed it — owner's source of truth). Sites are
  geo anchors; orgs are the spine. window._OG (byId/kids/atSite/eff) is built
  once by _ogBuild(); helpers orgOf/ogKids/ogEffSite/ogAtSite/ogPrimary/
  ogChainUp are the ONLY way to read the tree.
- Selection carries GlobeState.selOrg (org id) beside sel (site id); search
  rows 'og:…' route through selectSite(effSite,{orgId}). Brief hqs/ann and
  custom-org parents key by ORG id — kv migrations rewrote old site-id data
  once (no duplicates, owner law).
- **INTERIOR-MESH BORDERS**: _topoInteriorMesh() draws only arcs shared by ≥2
  geometries — coasts belong to the land layer ALONE. Any border pass that
  re-strokes a coastline is the double-trace bug returning.
- **THE MARK** (v0.15.0): logo.svg is a REAL-GEOGRAPHY glossy globe — actual
  continents projected orthographically from data/land-110m.json (Atlantic-
  centered, LAM -35 / PHI 18), gold land on black ocean, gold graticule,
  #FFB35C rim, vignette + specular. Regenerate with
  scratchpad logo/geo/{project,final,build-assets}.js. It is BOTH the app icon
  (globe fills the black tile) and the #navGlobe face (<img src="logo.svg">,
  referenced not inlined — logo.svg is in sw.js ASSETS for offline). The
  v0.14.0 crescent and the Star Net icon are retired. No blue, no green — ever.

## v0.12.0 — map control (owner directive, 21 Aug)
- **USACE is a class**, DERIVED in clsOf() from the grp fold (split('|')[1]===
  'usace' → 52 district rows; usace-hq-washington-dc stays hq). The data rows
  remain verbatim A-ORG-1 — never write 'usace' into cls in sites.json.
- View toggles are FOUR rows: Names · USACE names (_usaceOff) · Dots · Lines.
- **Chain labels outrank the toggles**: onChain labels draw regardless of
  _namesOff/_usaceOff — a selected command string always shows its names.
  Only the zoom-ladder (tiny label) pass obeys the toggles.
- clearAll() is the ring ✕: selection/arcs/callout, sheet, trail, search,
  open panels. It NEVER touches view toggles or stored data (brief, records,
  custom orgs).

## v0.13.0 — the hand-built brief (owner correction, 22 Aug: "this is broken")
- **NO AUTO-SUBTREES, EVER.** BRIEF.mem lists exactly the orgs the owner added
  (★ adds ONE; the popup's Subordinates picker adds real tree kids one tap at
  a time). _briefChainMap() renders members only; levels are DERIVED (nearest
  added ancestor; L1 = none). Re-introducing a recursive ogKids walk into the
  brief render path is THE bug the owner called broken — never bring it back.
- BRIEF={mem, ann, hide}; kv migrates legacy {hqs}→{mem} once. bfRemove
  CASCADES (added subordinates leave with their ancestor). Custom orgs created
  under a member auto-join (orgAdd → bfAdd).
- Chart: one .ch-col per L1 group — eye (data-bfeye, persisted in hide) shows/
  hides that component; bf-depth L1-L4 control (GlobeState._bfDepth, ephemeral)
  gates globe + chart. Brief.eye/Brief.depth are the API.
- Rooms are SEPARATE: map selection never writes to the brief; brief-room
  search opens _bfObjSheet (build grammar), never selectSite.
- Snapshot extras.brief={mem, hqs(roots), ann, hide, rows[]} — exporters print
  rows (the built picture), never a tree walk of their own.

## v0.14.0 — globe identity + bottom search (owner directive, 22 Aug)
- Search pill is BOTTOM-anchored (+96px above safe bottom, clear of the FAB);
  #searchResults opens UPWARD (bottom +152px). The keyboard lift writes
  bottom-insets via visualViewport — NEVER transforms (#searchResults is a
  scroll container; the no-transform law holds). Clocks + brief chart live at
  top +58px now.

## v0.17.0 — flanking controls + legible connections (owner, 22 Aug)
- Nav controls FLANK the globe: #navRow is two .nv-side groups (back·clear·
  zoomout | zoomin·saved·layers) at the globe's own bottom band (bottom+14,
  height 68, justify space-between), filling the bottom-left/right corners.
  No pill lift anymore. Buttons 44px. Same IDs/handlers.
- Map selection arcs are semantic now: _cmdLinkArcs (subordinates) draw DASHED
  dim yellow (T.accent, [2.5,5]); _hqArc (reports-to) draws SOLID bright orange
  (T.signal) with an arrowhead. drawSubtleArcs gained a `dash` param (8th).
  The callout carries a .co-rel summary ("↑ Reports to X · ↓ N subordinates",
  glyphs colored --signal/--accent) — never touch the no-blue/no-green law.

## v0.18.0 — map drill-down (owner, 22 Aug)
- A map selection shows ONE level, not the subtree. _syncSelArcs: UP = one line
  to the nearest NON-category located ancestor (skip _OG_CATS), then break; DOWN
  = direct children (the "L2"). GlobeState._selKidOrg maps child site → child org.
- DRILL: tapAtScreen, when the tapped site is in _selKidOrg, calls
  selectSite(site,{orgId:child}) — descends into that exact org (its own chain).
  Climb back via the details-sheet reports-to crumbs or the ring's back/undo.
- harness_globe expUp mirrors the one-hop rule (OGCATS skip) — keep them in sync.
