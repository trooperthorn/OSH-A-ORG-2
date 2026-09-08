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

## v0.19.0 — the readout is the navigator (A-ORG-1 methodology)
- The map callout (#calloutCard) is a NAVIGATOR: crumbs (data-codrill on
  ancestors) climb UP, a subordinate list (data-codrill on kids) drills DOWN.
  Tapping any name re-selectSites that org → the card re-renders for it. You
  walk the tree by name, not by hunting dots. _coPlace band-clamps a tall card
  (topSafe 112 / botSafe vh-168); .co-drill scrolls; .co-clamped drops the caret.

## v0.20.0 — brief branch focus (A-ORG-1 methodology)
- Tapping a chart chip OR globe chain-node FOCUSES its branch: GlobeState._bfFocus
  isolates that lineage (UP ancestors + DOWN descendants), the chart dims every
  off-branch chip (focused chip ringed), and _briefChainMap prunes the globe to
  that branch only. setMode clears _bfFocus. Brief and map stay separate rooms.

## v0.21.0 — navigation overhaul (owner, 23 Aug: 6 fixes from a screen recording)
- ROOMS ARE SEPARATE (fix 1): "Show on map" (data-govmap) is REMOVED from both
  the callout and _bfObjSheet. The ★ add-to-brief button (data-bfadd/data-bfrm)
  renders ONLY in brief mode — gated `if(brief && briefSubj)`. A map dot never
  writes to the brief. data-orgadd is gated `if(briefSubj||o)` (no bare-base add).
- BASE TAP → UNITS PICKER (fix 2): selectSite no longer falls back to a base's
  primary org — `selOrg = (o.orgId && orgOf) ? o.orgId : null`. A bare base tap
  shows the installation + a "Units here N · tap to open" list (data-counit, from
  ogAtSite) so the USER chooses which org. data-counit → selectSite(sel,{orgId}).
- CONNECTIONS ARE OPT-IN (fix 3): nothing auto-draws. selectSite resets
  _showSubs=_showHQ=false, _relStep=-1, and calls _syncSelArcs(s.id) SYNCHRONOUSLY
  (the draw loop's own sync is a frame late — the callout must read fresh counts).
  drawGlobeLinks gates subs behind _showSubs, the HQ line behind _showHQ. The
  callout offers "↑ HQ line" / "↓ N subordinates" toggles (data-cotgl) — the sub
  count is _cmdLinkArcs.length (= what draws), so it matches the stepper. A
  ‹ i/N · name › stepper (data-costep prev/next/all) walks _relList one arc at a
  time (bright single when _relStep>=0, else all dim). _relList is built in
  _syncSelArcs index-aligned to _cmdLinkArcs.
- ZOOM ROBUSTNESS (fix 4): the pinch latch (_pinching) is cleared on touchcancel
  AND defensively on touchstart (a system gesture/notification used to strand it,
  blocking drag forever). Double-tap when already zoomed-in (z>=6) now zooms OUT.
- ✕ CLEARS THE WHOLE MAP (fix 5): clearAll cancels the camera/glide/pinch, drops
  sel/selOrg + all connection state (_showSubs/_showHQ/_relStep), and glides home
  (flyToLatLon 24,-30,1.0). The callout's ✕ (data-cox) → selectSite(null).
- ILLUMINATED RING (fix 6): popped-out nav satellites glow accent-yellow —
  `body.nav-open .nv-sat` gets the accent glyph, a 1.5px gold ring, lifted glass
  gradient, and a soft halo, so they read at a glance.
- harness_globe SEL ARCS turns _showSubs/_showHQ on before drawGlobeLinks (arcs
  are opt-in now); smoke_runtime asserts data-govmap is ABSENT from the sheet.

## v0.22.0 — simpler map + calmer surfaces (owner, 24 Aug: 3-part overhaul, parts 1-2)
- MAP CONNECTIONS reversed to show-all-on-select: selectSite sets _showSubs=!!selOrg
  (an org draws every subordinate arc at once; a bare base tap still shows the units
  picker). _relStep=-1 = show-all; the callout stepper (‹ n/N · name › · All) is
  ALWAYS present when subN>0 (dropped the _showSubs guard) and isolates one arc
  bright. The redundant subs on/off toggle is gone; HQ line is the one optional tap.
- FLOOD KILLED two ways: (1) the tiny-label pass has a hard CAP (_lblCap = 13 phone /
  22 desktop at rest, +a few when sel!=null), applied over the priority-sorted queue
  so the meaningful few survive; (2) session restore clamps zoom to <=1.5 when there
  is NO saved selection — a reopen returns to the cluster world, not a deep-zoom wall.
- CLUTTER: retired the global Dots + Lines view toggles (Lines' _linesOff early-return
  silently killed selection arcs; Dots hid + un-tappable'd the selection). renderLegend
  View row is now just Labels + USACE labels. drawGlobeLinks no longer reads _linesOff.
- STUCK POPUPS: calloutShow→hideDossier and _bfObjSheet/showDossier→calloutHide make the
  two floating surfaces mutually exclusive; tapAtScreen's empty-sphere no-hit now clears
  an open popup (tap-away) in both rooms; calloutHide/hideDossier reset the drill/sub
  filter state; #calloutCard z-index 38→41 (above #dossier 40).
- DISCLOSURE PRIMITIVE: _disc(id,title,body,{count,def}) builds one accordion (.disc /
  .disc-h / .disc-b, chevron, open state in GlobeState._discOpen, one delegated
  [data-disc] handler that toggles the class + re-clamps the callout). Applied to the
  Layers "Classes" list and the callout "Open a subordinate" browser — collapsed by
  default. Reuse this everywhere new options appear; default posture = collapsed.
- LABELS: callout action rail is labeled pills now (Brief/In brief · Add unit · Details ·
  Delete) via .co-poplbl; sheet "Annotate"→"Add note", note placeholder "Callout"→"Note"
  (ends the name collision with the anchored callout).
- Still tier-bucketed brief chart + free-text add — that is the v0.23.0 job (part 3).

## v0.23.0 — the brief is a real tree (owner, 24 Aug: overhaul part 3)
- renderBrief REWRITTEN from tier buckets to a recursive nested tree: for each L1
  root it walks C.order filtering C.nodes[k].parent===pid, rendering each node under
  its specific parent, indented by echelon (--ch-lvl) with a connector tick (.ch-rail).
  Per-parent child cap KIDCAP=16 with "+N more under <parent>"; depth dial (_bfDepth),
  per-group eye (data-bfeye), and branch focus (_bfFocus) all preserved. The data model
  was already correct — _briefChainMap sets nodes[id].parent (nearest ADDED ancestor);
  the globe (drawBriefArcs) already drew it. Only the chart had to change. No data change.
- Chart CSS: .ch-row/.ch-more(--ch-ind) → .ch-node/.ch-rail/.ch-kn(--ch-lvl); .ch-node.ch-more
  is the per-parent spill; .ch-chip / .ch-t1..t4 tier colors unchanged (load-bearing).
- ADD BY SEARCH (owner: "a search of organizations instead of add subordinates manually"):
  sfsResults cap 2→6 (top-2 buried real org matches); _sfsPaint count "sites"→"results" and
  an ORG/SITE badge per row (.sr-tag / .sr-tag-org / .sr-tag-site — full literals for dead-lint).
  Object sheet leads with "Add another organization — search" (data-bfsearch → focus #searchInput);
  the subordinates picker (data-bfsub, real kids, one tap) stays; the free-text creator is
  relabeled "Add a custom org (advanced)" inside a collapsed _disc, kept only for orgs not in
  the app (orgAdd/Orgs.add intact for that + existing briefs). Removed the data-orgadd buttons
  (callout, dossier fan) and the data-orgadd/data-orgcancel handlers; data-orgsave (custom form) kept.
- Every brief node maps to a real org → ogEffSite → lat/lon (custom orgs still resolve via base or
  the ancestor they ride). smoke_runtime OBJECT-popup probe updated (data-bfsearch + data-orgsave,
  no data-orgadd); Orgs.add path unchanged so the custom-org + snapshot tests still hold.

## v0.24.0 — two rooms, one app (owner, 24 Aug: "really need a total app approach")
THE ARCHITECTURE. Two rooms that never write to each other. MAP = what exists, where.
BRIEF = the diagram you are building. Nothing jumps between them.

### The brief is a diagram you BUILD (A-ORG-1's briefing ability, A-ORG-2's format)
- Structure is STORED, never derived. `BRIEF.nodes=[{k,n,p,t,r,c,sh,tx}]` — each node
  carries its OWN parent `p`, so anything can be a peer / parent / subordinate of
  anything else regardless of the real Army chain. THIS is what the derived model
  (v0.23.0 and earlier) could not do, and why the owner "couldn't do what's needed".
- Three kinds `t`: 'org' (r=org id, real location) · 'state' (r=state name) · 'custom'
  (free-text box). Key namespace: an org node IS its org id (so bfHas(orgId) holds);
  a state is 'st:<Name>'; a custom is 'cx:<rand>'.
- `BRIEF.mem` / `BRIEF.ann` are MAINTAINED MIRRORS (rebuilt by `_bfSync` on every
  mutation) so snapshot/export/harnesses keep reading one shape. Don't write them.
- Mutators: bfAdd(id,parent) · bfAddState(name,parent) · bfAddCustom(name,parent) ·
  bfRemove (cascades the stored subtree) · bfMove(k,newParent) (refuses cycles) ·
  bfReorder(k,dir) · bfColor(k,hex) · bfStripe(k) · bfNote. All on window.Brief.
- MIGRATION v1→v2 in the kv 'brief' restore: a flat {mem,ann} list becomes nodes with
  the structure it USED to derive frozen in as each node's own parent — an existing
  brief reopens identical, and is now movable. v2 payloads are validated on read.
- `_briefChainMap` reads the stored tree (no more nearest-added-ancestor walk); it
  still computes lvl/root/tier/shade and keeps the v0.20.0 focus filter.
- `custom` in the chain map still means "not a stock A1ORGS record" (free-text box OR
  an owner-created org) — the chart's sort and the smoke test depend on that.

### US states as brief subjects (ported from A-ORG-1)
- `US_STATES` (centroids) + the already-loaded `GLOBE_STATE_SHAPES` (keyed by state
  name, filled by loadStateBorders) — the geometry was always there, just unused.
- `drawBriefStates(ctx,m,labels)` — TWO PHASES: fills/stripes run from drawBriefArcs
  (UNDER the arcs and dots), labels run at the end of drawMarkersHook (on top, sharing
  the label collision list). Wash 0.26 + 1.7px outline; `sh` adds the diagonal
  ATTENTION LINES clipped to the polygon (7px pitch), exactly A-ORG-1's v13.7.1.
- States are searchable (STATE badge); a brief-room pick places one on the diagram.

### The selections (per node, collapsed accordions — expand when needed)
`_bfSelections(k)`: 24-swatch BF_PALETTE colour (state → highlight tint, otherwise the
chip tint) · ▨ striped fill (states) · ⇄ "Reports to" move-under select (cycles refused,
own subtree excluded) · ◀▶ reorder among sisters · note. `_bfPlainSheet` gives states and
custom boxes their own compact sheet; org members get the same block inside _bfObjSheet.

### The map opens quiet, and isolates
- `_FAM_DEFAULT_OFF=['depot','usace','guard']` via `_famOffSet()` — base + HQ dots and
  names only at rest; Layers turns the rest back on. EVERY reader must use _famOffSet().
- ISOLATE: in drawGlobeMarkers, `if(GlobeState.selOrg && !onChain) continue;` and the
  same gate on the label pass — selecting an organization leaves only that org and its
  connections on the globe. A bare BASE tap (no selOrg) keeps the full picture + units picker.
- harness_globe asserts BOTH: the isolated picture, then selOrg=null for the full pass.

### The rooms are severed
Removed: the map card's brief star, its one-button pop-out fan (records moved into the
header row), the empty-brief "add the map's selection" button (now points at search), and
the dead data-govmap "Show on map" handler. smoke_runtime asserts the empty brief offers
data-bfsearch and carries NO data-bfadd.

## v0.25.0 — the hierarchy chart (owner, 24 Aug: "do away with this chart … how it was done in A-ORG-1")
The indented list (v0.23-24 `.ch-node`) is DELETED. The chart is now A-ORG-1's real
TOP-DOWN org chart, rebuilt sleek for Lumen. If you touch it, keep these:
- STRUCTURE: nested `<ul class="bf-tree">` / `<li class="bf-li">` / `<div class="bf-box">`
  / `<ul class="bf-kids">`. Connector risers are CSS ::before/::after on .bf-li and
  .bf-kids (A-ORG-1's technique verbatim — no SVG to keep in sync). :first-child /
  :last-child / :only-child rules draw the corners. `--line-tree` is the rail colour
  (defined per room; the brief room overrides it in body.brief-mode).
- SIZING (this is what the owner meant by "optimized"): `_bfFit()` runs after every
  render — measures .bf-tree scrollWidth against the pane and sets CSS `zoom` (NOT
  transform: zoom reflows, so the wrap scrolls honestly). Floor 0.62 so it never
  shrinks past readable — pan instead. Manual ± pins `GlobeState._bfZoom`; the Fit
  button clears it. A litter wider than 6 wraps into banded rows of ceil(sqrt(n*1.7))
  inside one `.bf-kgroup` frame — A-ORG-1 §2.1, the fix for endless ribbons.
- #briefStage is now the full-width WORK SURFACE (left/right safe gutters, 56vh;
  ≥1100px it becomes a 880px column), not the old 300px corner tile. A hierarchy
  needs width. `⌗ CHART` still collapses it to a pill via body.chart-min.
- MINIMAL BOXES: name + a quiet station line, nothing else. NO per-box button rows.
  Every option lives in the node's sheet (`_bfSelections`) one tap away: colour,
  striped fill, move-under, reorder, note, hide-component (roots), remove.
- ADD UNDER A SPECIFIC ORG (the owner's core requirement): the sheet's
  "⊕ Add a subordinate under X" sets `GlobeState._bfAddUnder`, `_bfArmHint()` shows a
  fixed bar naming the target, and the next search pick lands there. `_bfTakeParent()`
  is the ONE consumer — it returns the armed key and disarms; bfAdd/bfAddState both
  call it, so every add path honours the target exactly once. searchSelect in the
  brief room now PLACES the org (bfAdd) instead of only opening its sheet.
- FOLD: `GlobeState._bfFold[k]` folds a branch; the caret shows `+<descendant count>`
  when folded, `▾` when open. Depth dial (L1-L4) still gates render depth on top.
- smoke_runtime asserts the chart is bf-tree/bf-box/bf-kids and that `ch-node` is gone.

## v0.25.1 — tapping the map selects again (regression fix + the guard that was missing)
- BUG (mine, from v0.22.0): `tapAtScreen`'s map branch called `selectSite(s.id)` on a
  hit and then FELL THROUGH into the v0.22.0 tap-away block, which saw the callout
  `selectSite` had just opened (`_coId != null`) and called `selectSite(null)`. Every
  tap selected and cleared in one gesture — the map could not be selected at all.
  FIX: `return` immediately after a hit. Tap-away on empty sphere is unaffected.
- WHY IT SHIPPED, and the lesson: the harness proved `siteHitTest` FINDS a dot, which
  is not the same claim as "a tap SELECTS one". Hit-testing was green the whole time.
  harness_globe now has a TAP CONTRACT probe that drives the real `tapAtScreen` at a
  dot's screen position and asserts `GlobeState.sel` survives the whole handler —
  confirmed to fail with the `return` removed and pass with it. `document.body` in
  that harness gained a real `classList` stub so tapAtScreen can run there.
- When touching tapAtScreen: each branch that consumes a gesture must RETURN. The
  tail of the map branch is the "nothing was hit" path only.

## v0.26.0 — ＋ and ✎ on every object, and multi-add
- Each `.bf-box` carries two small ops (`.bf-ops`/`.bf-op`): `data-bfaddkids` (＋ →
  the picker) and `data-bfedit` (✎ → `_bfObjSheet`, i.e. the v0.24.0 selections).
- **ORDERING TRAP — read before adding any op:** the ops render INSIDE `.bf-box`,
  which itself carries `data-bfobj`. Their delegate branches MUST sit ABOVE the
  `data-bfobj` branch in the click handler, or `closest('[data-bfobj]')` matches the
  parent box first and swallows the tap. That bug cost a round; the harness can't see
  it because the markup is correct — only a live click exposes it.
- `_bfAddSheet(parentKey)` — the MULTI picker. Candidates: the parent org's real
  `ogKids` first (with `_OG_CATS` shells opened to their grandchildren), then anything
  matching the search (orgs + US states) at ≥2 chars. Nodes already on the diagram are
  filtered out. Selection lives in `window._bfPick` (a Set); ticking a row repaints
  ONLY that row plus the footer via `_bfPickFoot()` — never re-render the list
  mid-selection or you lose the scroll position and the keyboard. `window._bfPickQ`
  holds the query; the input handler re-renders and restores focus + caret.
- `bfAddMany(ids,parent)` pushes every pick then `_bfSave`/`renderBrief`/`globeMark`/
  `_bfFrame` ONCE. Never loop `bfAdd` for a batch — that reframes the globe per node.
- The picker opens at `dz-full` with a sticky `.rc-acts` so the commit button is never
  stranded behind the globe FAB. `_bfToast(msg)` confirms the count.

## v0.27.0 — the compact card + the big desktop ring (owner, 24 Aug: 4 asks)
- DESKTOP NAV (≥1100px): #navRow centers under the globe (left:50%, translateX(-50%));
  .nv-side clusters gap 14px with 120px margins clearing the FAB; .nv-sat 64px, svg 26px.
  The media query must override BOTH transform states (closed translate(-50%,10px),
  open translate(-50%,0)) or the open ring jumps sideways.
- clearAll also clears: window._coSec/_coSecNext, GlobeState._bfFocus, _bfAddUnder
  (+_bfArmHint teardown). The ✕ = every screen selection, both rooms.
- _FAM_DEFAULT_OFF now includes 'hq' — the map opens with BASE dots only. The chain
  label at a selected dot uses inst.base when selOrg is null (unit voice returns with
  an org) so a bare base tap never flashes a tenant name anywhere.
- THE COMPACT CARD (map-mode _coRender): name + state, then THREE icons (.co-icrow/.co-ic):
  Units (tenant/subordinate count), Connect, Details. window._coSec ('units'|'conx'|null)
  is the open section — reset by selectSite; GlobeState._coSecNext pre-arms it across a
  re-select (the base→Connect hop picks ogPrimary and lands with arcs on). Connections
  are OFF until Connect asks: selectSite sets _showSubs=(coSecNext==='conx'). The conx
  section holds the ‹ n/N › stepper + HQ-line tap; the units section holds the tenant
  picker (base) or crumbs+drill (org). The .co-acts rail is brief/custom-only now.
- The compact-card contract lives in smoke_runtime: base name + all three icons, and
  the card must never lead with a tenant org on a bare base tap.

## v0.27.1 — the stepper navigates + honest chain names (owner recording)
- GlobeState._selSiteName (built in _syncSelArcs, cleared with the stores): siteId →
  the name of the org THE CHAIN put there — selected org at the focus, parent org at
  the up-hop, child org at each subordinate site. The chain-label pass reads this map
  FIRST; a site's own `unit` string (Aberdeen's is literally "ATEC") must never label
  a selection. Sites can host many commands — the chain decides which one is speaking.
- data-costep now FLIES: each step calls _flyPair(parentLatLon, subordinateLatLon) —
  great-circle midpoint, zoom keyed to separation (1.05 at >120° … 5.2 under 3°) — so
  the parent (and its callout) stays reachable while the arc's far end is on screen.
  'All' flies home to the parent. Keep the callout anchored to the PARENT; the fly
  guarantees it stays near-screen, and _coPlace clamps the rest.

## v0.28.0 — Connect zooms out to the whole web
- `_flyFitChain()` (beside _flyPair): selected site + every _cmdLinkArcs endpoint
  (+ _hqArc end when _showHQ) → mean-vector center, zoom keyed to 2×max-spread×1.15
  (>150°→1.0 … <10°→4.4). One point only → the old dive (2.2).
- Three doors call it: the Connect icon's on-branch, selectSite's conx landing
  (window._coSec==='conx' replaces the normal fly — check BEFORE the keepCam fly),
  and data-costep 'all'. Stepping keeps _flyPair (parent+subordinate dive); All is
  the pull-back. Camera grammar: Connect/All = wide, step = dive.

## v0.29.0 — the audit release (owner: "test as a user/audience, not can-we-execute")
A 6-journey UX audit (workflow: first-open, connections, search, brief-build, desktop,
details — each judging SCREENSHOTS, not return values) produced 27 ranked findings.
Full list: /tmp scratchpad tasks/we7u737z5.output. This release fixed ranks 1-5, 8, 9,
12-16, 18, 22, 24, 25, 27. STILL OPEN (next round): #6 double-tap-zoom vs 25px hit
radius, #7 per-site IANA timezones (data work), #10 co-located dot disambiguation,
#17 grip drag (touchmove detents), #19 cluster badge merge/fit, #20 SELECT chip label,
#21 result-count honesty, #23 stripe discoverability, #26 empty-tab copy.
- THE DOCKED CARD: map-room callout docks top-band (co-docked class; _coPlace early
  path). Brief room keeps anchored behavior. The dot's diamond is the pointer. NEVER
  reintroduce a center-anchored map card — every audit journey flagged it.
- Chrome exclusion: #calloutCard/#briefStage/#navRow are in _gChromeZones, so canvas
  labels can't ghost under glass (cache is per-frame; adding ids is enough).
- Honest copy law: any count shown next to another count must agree on screen —
  subN (arcs) vs unitsN (kids) differences are SAID ("+N here on this base").
- Dossier ✕ = close the sheet only. Ring Clear = the full reset. Keep it that way.
- setMode has a labeled door now (navSat-brief); the 3s hold remains as the fast path.

## v0.30.0 — the audit, closed out (all 27 findings resolved)
- DOUBLE-TAP (#6): the pointerup tap DEFERS 260ms (GlobeState._tapT); a second tap
  inside 300ms/24px cancels it and runs _dblZoom — a double-tap can never select.
  Any future tap-path change must preserve the defer+cancel pair. Hit radius 16px.
- TIMEZONES (#7): _tzForSite(site) = _TZ_SITE (split-state posts: fort-bliss→Denver,
  fort-campbell→Chicago, holston-aap→New_York) → _TZ_ST (state/territory/country →
  IANA; AZ→America/Phoenix, no DST) → nearRegion fallback for unknown st. Labels in
  _TZ_LBL. autoFillSelect reads it; the manual zone sheet is untouched. If SITES gains
  a new country code, add it to _TZ_ST or the clock silently falls back to nearRegion.
- THE PILE (#10): the base card lists co-located sites (Δlat<0.22, Δlon<0.28, cap 4)
  as .co-pilechip switch chips via data-odsel. Labels use the RAW base name with a
  trailing "(Fort X)" qualifier stripped — _bfAbbr collapses the Meade pile into
  identical chips; don't reintroduce it here.
- GRIP (#17): pointer-based drag on .sh-grip, ~180px per detent, snap on release;
  dz.__swallowStep guards the click that follows a drag from double-stepping.
- CLUSTERS (#19): badge cells whose circles intersect merge (iterative, guard 24);
  members ride each hit (h.mem) so a cluster tap fits them via _flyFitPts(pts, 2.0).
- Copy: BASE TIME —:— chip (#20) · "close matches" headline counts _s>=38 only (#21)
  · "Highlight color & stripes" (#23) · empty record tabs self-describe (#26) ·
  .co-name wraps two lines (#11).

## v0.31.0 — names as selected (owner recording: AMC 2/7 · TACOM)
Owner law: "When clicking through subordinates, you don't have to display all names at
the same time... You can show the names as selected." Plus the wfct595di re-verification
closeouts. The stepping label POLICY is now load-bearing:
- NAMES AS SELECTED: with an org driving the map (GlobeState.selOrg), chain-member
  labels in the dot loop print ONLY for: the selected site, the currently stepped
  subordinate (_relList[_relStep].siteId), and the HQ end while _showHQ is on.
  The All view is arcs + the HQ's own name, nothing else. Do NOT re-add
  all-chain-names — that was the flood the owner recorded twice.
- FORCED STEP LABEL: _placeGlobeLabel gained opts.force (skips label-rect collision,
  keeps chrome + edge discipline). The stepped site passes force:true. If the FULL
  name cannot be placed (ARL's 30-char title fits neither side of a mid-screen dot
  on a phone — the |x-ax|>4 clamp guard rejects both anchors), the label RETRIES
  with _bfAbbr's short form ("ARL"), which always fits. A stepped name silently
  vanishing is the bug this exists to prevent; keep the fallback.
- _flyPair rungs deepened: sep>1.2→5.4, >0.45→6.6, else 7.8. Know the limit: APG↔
  Adelphi (0.8°) is ~14 CSS px apart even at 6.6 — zoom cannot separate them; the
  forced short label is what makes the step read.
- FAB flag: the [data-codetail] handler calls _sheetFlag() after its dz-half
  promotion (it was the ONE path that missed it — FAB floated over sheet rows).
  Any new code that swaps dz-peek/half/full classes must call _sheetFlag().
- PEEK IS A HANDLE: #dossier.dz-peek hides .od-tabs and everything after it (CSS
  sibling rule) — the bottom band belongs to the globe FAB, nothing tappable may
  sit under it. Peek = grip + name + head icons only.
- Grip rubber-bands under the finger (damped 0.28, ±48px, transition:none inline,
  cleared on pointerup/pointercancel). Release still snaps detents; keep both.
- Search headline counts ROWS ON SCREEN: "closest N shown" when total>shown, else
  "N matches". Never print res.total (fuzzy inflation) and never a count that
  disagrees with visible rows (the 5-over-6 miscount).
- Docked card top is 114px — fully below the corner clocks (58px + ~52px chip);
  the ✕ sat under BASE TIME at 96px. Clocks move ⇒ move this with them.
- Cluster badges clamp fully on-screen (E=r+8, cx/cy clamped; hits use the clamped
  point). Pile chips max-width 178px.

## v0.31.1 — the missing lakes + sharper lines (owner: "look at Wisconsin")
- ROOT CAUSE, know it forever: world-atlas land-110m/land-50m contain NO lakes.
  The Great Lakes never existed on this globe. Wisconsin/Michigan were black
  voids: Michigan's entire lakeshore is a SINGLE-USE arc in states-10m, which
  the interior-mesh rule (use>=2) skips by design.
- FIX: _topoLakesShore() harvests states-10m single-use (coastal) arcs lying
  FULLY inside {lon -93.5..-73.0, lat 41.3..49.6} → GLOBE_SHORE_RINGS, drawn
  with the SAME ink as the ocean coast (they are coast). The fully-inside test
  is load-bearing: it excludes NYC-harbor/Long Island/NJ Atlantic arcs (east/
  south) and the 49th-parallel + Lake-of-the-Woods Canada border (west) that
  would double-trace (v0.11.0 law). Canadian lakeshores aren't in a US states
  file — international lakes draw their US shore; the dim countries mesh adds
  the mid-lake border. Zero new data files.
- Line inks sharpened (phone/near-black reality): states .45/0.7px → .60/0.9px;
  countries .30/0.55px → .36/0.65px. Coast unchanged (.85/1.0).
- NOT an audit finding: the UX audit tested flows and flagged faint CONNECTION
  arcs (fixed v0.29); basemap geography ink was never in its scope. If a future
  audit round runs, include a "geography reads" check per region.

## v0.32.0 — one surface + the ledger (owner, desktop screenshots)
- ONE SURFACE (desktop ≥1100px): #dossier lives on the SAME rail as the docked
  card — left:var(--safe-l), 400px, top safe+114 (identical numbers to
  #calloutCard.co-docked). Details = the card expanding in place; the sheet ✕
  returns the card to the same spot. If the card's dock geometry ever moves,
  move the desktop dossier WITH it — split rails was the owner complaint.
- LABEL POLICY (final form): plain selection → selected name only; Connect ALL
  → every connection end named (best-effort placement); STEPPING → only the
  stepped target (forced + _bfAbbr fallback); HQ line on → its end named.
  _allView flag in the dot-loop label gate. Don't collapse these cases.
- THE LEDGER: conx section = .co-cxled with parallel .co-cxrow rows, mono
  .co-cxk keys MAP · BASE · HQ. Stepper rides the MAP row; BASE says the real
  base name; HQ row holds the co-located note or the Show-line toggle.
  .co-note/.co-conx/.co-step CSS deleted with their markup (dead-lint).
  Honest-copy law continues: MAP subN + BASE hereN = UNITS count, in place.

## v0.32.1 — the clear window (owner recording #3: "This again…")
- LAW: every camera fit aims at the CLEAR WINDOW — canvas minus the docked
  card minus the search pill — never the canvas center. _clearBand() measures
  it live (phone: top band; desktop: left rail; co-docked only); _bandAim()
  fits the angular spread inside it AND offsets the flight center so the
  midpoint lands at the band's center. Wired into _flyPair, _flyFitChain,
  _flyFitPts (harness/DOM-less runs fall back to the old ladders). Any NEW
  camera fit must go through _bandAim or state why not.
- WHY IT SHIPPED BROKEN 3x: step verification SAMPLED 1-3 steps per chain, and
  the sampled ones happened to land in the visible strip. REVIEW CONTRACT NOW:
  camera/stepper work is verified by driving EVERY step of at least AMC(7) +
  DEVCOM(6) + XVIII(3) on phone AND desktop, asserting per step that the
  stepped target AND the selected diamond project inside _clearBand() (see
  scratchpad sweep.js pattern — port it forward). 32/32 green at ship time.

## v0.32.2 — ✕ clears the brief room (owner: "'X' still does not clear on brief")
- TWO stacked defects; know both: (1) _nvSet disabled navSat-clear whenever
  GlobeState.sel==null — in brief that is ALWAYS, so taps died before any
  handler (a disabled <button> swallows clicks silently — the bug was
  invisible to handler-level debugging). ✕ is the room reset: always enabled.
  Never gate a satellite on map-room state that a whole room lacks.
- (2) clearAll was map-room-only: it nulled _bfFocus but never called
  renderBrief() (no repaint = "looks dead"), and left calloutHide, _bfAnnEdit/
  _orgForm, window._bfPick, _bfAddArm (call _bfArmHint AFTER dropping it —
  the first call runs while it's still true and keeps the bar), _bfFold,
  body.chart-min untouched. All cleared now; brief mode also re-renders and
  toasts "View cleared — your diagram is kept".
- LAW: ✕ clears VIEW state in both rooms. It never deletes brief nodes —
  deleting built work needs its own explicit, confirmed control.
- Debug lesson recorded: when a button "does nothing", check .disabled before
  chasing listeners — element.click() on a disabled button fires no event.

## v0.32.3 — brief tap-away (owner recording: "Selections getting stuck when editing brief mode")
- THE GAP: the v0.22.0 stuck-popup law (one tap from gone) was implemented on
  the CANVAS (tapAtScreen). In the brief room the chart card + object sheet
  cover most of the screen — background taps land on DOM paper and used to
  fall through the click delegate into nothing. The edit state (sheet, box
  popup, focus dimming) had no exit but the nav ring.
- FIX: LAST branch of the document click delegate — after every control has
  returned — a tap on brief paper releases: object sheet, callout, note/org
  forms, armed add (+_bfArmHint AFTER dropping the flag), branch focus; then
  renderBrief+globeMark. #globeCanvas is EXCLUDED from this branch: the globe
  has its own tap law, and the click that trails a dot-tap must not undo the
  selection it just made. Keep the branch LAST and keep the exclusion list in
  sync when new chrome ids arrive.
- Harness gotcha recorded: the chart runs under CSS zoom (_bfFit) — Playwright
  coordinate taps MISS chart boxes in this Chromium; dispatch element.click()
  for box interactions in tests (owner devices hit-test fine, per recordings).

## v0.33.0 — one source per edge (owner: "traced unevenly 3 times — resolve in its entirety")
- THE LAYERING LAW (supersedes the v0.31.1 lakes-window hack): every basemap
  edge draws ONCE, from the best source that has it.
  · Ocean coast → land-50m alone. Nobody retraces it.
  · ALL US inland edges (Great Lakes shores, US-Canada, US-Mexico, AK-Canada,
    small islands 50m lacks) → states-10m single-use arcs via _shoreHarvest():
    per-POINT classification against the live 50m coast (0.3° grid hash, own+8
    neighbors ≈ 0.6°), split into inland segments with one-point reach into
    the coast zone so borders meet the coast without gaps. Arc-level rules
    CANNOT work — Maine's single arc is half ocean coast, half land border.
  · Other countries → countries-110m mesh with every arc the USA polygon
    touches dropped (_topoInteriorMesh exclGeom param). The coarse offset US
    border was the third trace.
- _shoreHarvest() re-runs on each land rung (110m→50m) — the classifier keys
  off whichever coast is live; the load race is harmless. _US_EDGE_CAND holds
  the decoded single-use lines between runs.
- Inks (Lumen flat): coast + US edges .92/1.1px · states .62/0.95px ·
  countries .36/0.65px. Hierarchy comes from WEIGHT, never from doubling.
  Any new geometry layer must state which existing layer yields to it.
- Verified: 49th parallel, Great Lakes, St. Lawrence, Maine (the split-arc
  case), US-Mexico, PNW border-meets-coast, CONUS + world — full-res crops,
  all single lines. NE zone data probe: 7 border segments live there.

## v0.33.1 — review truth + THE MACRO DIRECTIVES (advisory session with the owner)
- The owner judged v0.33.0 "not fixed" from a screenshot of the PRE-v0.33 build
  (diagnostic: the dim 110m US-Canada border, which v0.33.0 deleted, was
  visible). The SW serves the previous build on the first post-deploy load;
  auto-update reloads seconds later. Every build now toasts "A-ORG-2 vX.Y.Z"
  once on its first boot (a2VerSeen) so nobody reviews a stale build unknowingly.
- STANDING MACRO LAWS distilled from this session — apply them unprompted:
  1. THE TWICE RULE: the same bug FAMILY appearing twice means stop patching
     and re-architect the layer it lives in. (Wisconsin should have triggered
     the one-source-per-edge rebuild; it took three rounds.)
  2. INVARIANTS OVER INSTANCES: convert every owner complaint into the
     invariant behind it ("every boundary is exactly one line at every zoom,
     worldwide"), fix the invariant, then SWEEP all sites where it can break —
     never just the complaint site.
  3. EVERY FIX SHIPS ITS TEST: the check that would have caught the bug goes
     into the suite or the standing verification sweep in the same release.
  4. ADVISE BEFORE ARCHITECTURAL PATCHES: when a fix could be a patch or a
     rebuild, present the recommendation and cost first — the owner decides
     macro direction.
- KNOWN OPEN OPTION (offered, awaiting owner decision): single-family basemap —
  replace the mixed land-50m/countries-110m/states-10m stack with one Natural
  Earth 50m family (land + lakes + countries + states from the same geometry).
  Consistent by construction; restores Canadian lakeshores; retires the
  offset-line class permanently. ~1 release; adds data/ files.

## v0.33.2 — the build stamp (owner: "how can we track current build through the app?")
- #verTag: APP_VERSION under the wordmark, faint mono, pointer-events:none,
  visible in BOTH rooms, rides the title bar's gesture fade. Every screenshot
  and recording now self-documents its build — the review-truth loop closes:
  toast = a NEW build arrived (once); stamp = the CURRENT build (always);
  ⋯ menu row + wordmark long-press sheet = full detail (version + date).
- The stamp is populated from APP_VERSION in the boot block (single source —
  never hand-write a version into markup). Keep it OUT of interactive paths.

## v0.34.0 — the boot title (owner: spinning globe, big print, main → invert → main)
- #introVeil over the REAL globe: one eased full revolution (~2.3s) under the
  big engraved mark + build version; paper beat at 45–72%; veil fades, chrome
  breathes in, camera lands EXACTLY on the boot face (whole revolution + yaw
  restore in fin()). Tap skips. prefers-reduced-motion and __SANDBOX skip
  entirely. Stub DOMs (harness) no-op via the veil/classList/rAF guards; the
  900-frame hard cap makes a hostile rAF stub finite.
- THE INVERT IS A PALETTE, NOT A FILTER: GlobeState._introInvert makes
  drawGlobe swap ocean/coast/land inks to the paper set (cream #F1EBD8 ground,
  bronze 96,72,22 ink, parchment land). A CSS invert+hue-rotate was tried and
  REJECTED — it turns Lumen's gold grey-green (hue-rotate is a linear
  approximation; gold does not survive the round trip). Never reintroduce it.
- The version toast waits until 3.6s (after the veil) — nothing may crash the
  title sequence.

## v1.0.0 — FIRST OFFICIAL RELEASE (owner: "PM this to 1.0; other users start here")
- THE RESEARCH PIPELINE (the scalable build-out the owner asked for — reuse it):
  1. Parallel research agents, one per command family, WebSearch-ONLY (direct
     fetch of dvidshub.net/army.mil is egress-blocked; search snippets carry
     the facts). Each returns strict JSON rows {name, abbr, parent-by-name,
     echelon, base, city, st, lat/lon (only for non-marquee stations), sources,
     confidence}. HIGH-confidence rows only get merged — med/low are dropped
     and logged, never guessed at.
  2. tools/research-merge.js: dedupe verdicts → reparent ops → additions
     (parent resolved by normalized name; station resolved via alias map +
     normalized base match; NEW sites only when coords supplied, guard/oconus
     grp+cls policy, unit always set); regenerates data/*.json AND the inline
     A1ORGS/SITES literals in lockstep (smoke enforces the pairing).
  3. Source packets live in data/research/*.json — every added org carries its
     citations there. data/orgs.json src string names the sweep.
- v1.0.0 sweep: +96 orgs (→1,495), +9 sites (→285): division BCT/DIVARTY/CAB/
  DSB sets for 11 divisions, First Army Div East/West brigades, 4 MRCs + Army
  MEDCENs + MRDC institutes, INSCOM theater/functional MI, NETCOM signal
  commands, USASOC to Ranger/160th battalion depth, ARNG division BCTs, Army
  Corrections Command (the one missing DRU), dedupes of 2025-26 redesignation
  variants (18th TMC · SETAF-AF · USARCENT Fwd). 2026 ATI facts verified:
  T2COM (TRADOC+AFC inactivated), USAWHC (FORSCOM/ARNORTH/ARSOUTH), ARTRANS
  (ex-SDDC), 4ID→I Corps. Flagged for the owner, NOT applied: CRS styles
  USAWHC an ACOM (kept under asccs shell); III Armored Corps reportedly moved
  to USAWHC Aug 2026 (kept under USAREUR-AF pending owner call —
  the WRONG call; see v1.0.1: verify-and-resolve, never park).
- SCALE WITHOUT DILUTION: new depth is search/drill-only. Guard-class stations
  ship OFF by default (_FAM_DEFAULT_OFF). The map's default face is unchanged.
- 1.0 polish: first-run coach (3 chips, once ever, a2Coached, gone at first
  touch; reduced-motion shows instantly per the base-state CSS trick); About +
  provenance rows in the ⋯ menu (live counts); first-ever boot suppresses the
  version toast (the coach owns that moment); stepper names ride RAW (no
  _bfAbbr — it turned "3rd MBCT, 10th Mtn Div" into "10th Mtn").

## v1.0.1 — the knowledge check (owner: "1st ID reports to III Armoured Corps…
## find where it reports to and why this wasn't caught; run this check across the board")
- WHAT WAS WRONG: 1ID's direct link was right (III Armored Corps), but III AC
  itself sat under USAREUR-AF. The July 2026 SecArmy order moved III AC to
  USAWHC. My research agent FLAGGED the move and I parked it as "owner call"
  instead of verifying and applying it. NEW LAW: a sourced, current
  realignment gets verified and resolved in the same sweep — flag-and-park is
  how a knowledge check fails. "Owner call" is reserved for genuine style/
  policy choices (e.g. whether USAWHC is styled an ACOM), never for facts.
- THE SECOND FAILURE CLASS: the v1.0.0 merge deduped on exact normalized names
  only and skipped dupes WITHOUT reconciling parents. Result: 43 twin subtrees
  ("Division East" vs "First Army Division East", "(MDC-P)" paren variants,
  same-parent "1st Brigade Combat Team" vs "…, 82nd Airborne Division") and
  silently unapplied researched parents. All 43 merged back to their LEGACY
  ids (1,495 → 1,452); 1st Signal Bde → 311th SC(T) and 116th CBCT → 34th ID
  applied. Merge rule: dedupe verdicts must reconcile EVERYTHING the dropped/
  skipped row carried — parent, site, name — not just delete the row.
- THE STANDING GUARDS (fix the class):
  - data-lint §7 walks the org tree every run: unique ids, parents resolve,
    acyclic (≤40 depth), org.site resolves, and SAME-PARENT TWIN detection —
    aggressive key (parens stripped, alnum only) equality, plus prefix rule
    `stem ≥10 chars && remainder ≥4` (the remainder floor keeps roman-numeral
    siblings like "DCE Region I/II" legal).
  - tools/research-merge.js now dedupes by aggressive key too, skips
    prefix-twin siblings, reports parentConflicts on every skipped dupe whose
    researched parent disagrees with the tree, and exits non-zero (TWIN
    ALARM) if a merge run leaves a twin group touching a new org.
- Across-the-board verification: the 20-link command spine re-checked against
  current public sources — 18 confirmed; III AC fixed; SFAC inactivated
  8 Jan 2026 (1st SFAB → USAWHC, 5th → USARPAC; dataset already correct).
- /tmp/orgs.bak.json + /tmp/sites.bak.json are the pre-v1.0.0-merge state and
  define the "legacy id" set the repair scripts key on (legacy id always
  survives a twin merge — stable refs). Ephemeral to this container; the
  durable rule is: back up data/*.json before any bulk merge and key merges
  on the backup's id set.
- Legacy-only oddities flagged for the OWNER (not auto-deleted): 80th TC
  (USAR vs TASS trees), SSL/SSI duplicate pair, AAL/STE pair, the mangled
  16th CAB node under DIVARTY, TF Spartan historical markers.

## v1.0.2 — current organizations + the longer title (owner ruling on the flagged oddities)
- The owner ruled: "make all updates to reflect current organizations." Every
  legacy-only oddity v1.0.1 flagged is now RESOLVED, each against a verified
  2025-26 source (verdicts + citations in scratchpad research/repair3.config.json):
  USAWC → Combined Arms Command / T2COM (DRU status ended 2 Oct 2025; the DRU
  subtree merged in, SSL/SSI/AHEC child pairs deduped, CSL carried over);
  780th MI Bde (Cyber) → one node under INSCOM (OPCON ARCYBER is a relationship,
  not a parent); AAL stays under FCC/T2COM (it PARTNERS with acquisition's PIT,
  is not part of it) while STE is acquisition-only (PEO STRI → CPE ST3 6 Feb
  2026, PM SIM 12 Mar 2026); USACE Transatlantic Division deleted (TOA to SWD
  5 Aug 2025; Middle East + Transatlantic Expeditionary districts under SWD);
  80th Training Command → USARC only; the parallel Europe garrison shells
  merged; TF Spartan historical rotation markers deleted, current = 36th ID
  (TOA 6 Jun 2026); mangled multi-unit rows folded into clean nodes; PAO
  office stubs removed (sub-office granularity is out of model). 1,452→1,418.
- LESSON — BOTH-LEGACY DUPES: the legacy-id merge rule cannot pick a keeper
  when both twins predate the backup; the keeper is chosen by verified current
  truth + richer subtree, and each such pair needs a sourced verdict, not a
  guess. Rotation/history belongs in notes or names on ONE node, never as
  sibling marker nodes (they read as real units and trip the twin lint).
- THE TITLE at v1.0.2: T=4600 ms, REVS=3 (eased, lands exactly on the boot
  face; spin ≈1.5× v0.34.0), paper beat still 45-72% of the flight. The
  version toast (5600 ms) and first-run coach (5400 ms) are timed AFTER the
  veil — anything that pops during the title is a bug (the coach would also
  be killed unseen by the skip-tap listener). If T changes again, move both.

## v1.0.3 — groups in the brief (owner: filler organizations for hierarchy)
- A GROUP is the v0.24.0 custom node (t:'custom') wearing its real face: an
  owner-named filler element with no app record. Do NOT add a new node type
  for this — storage, kv load, chain map, exports all already carry customs,
  so old briefs load unchanged and old free-text boxes simply became groups.
- Entry points (the only two build surfaces, per the one-surface law): the
  chart foot / empty state ("⊞ New group" → inline name form in place, state
  window._bfGrpForm) and the ＋ picker's group row (creates under that parent,
  picker stays open to keep filling). Both funnel into bfAddCustom, which now
  honours an armed "add under X" via _bfTakeParent like every other add.
- bfRename is GROUP-ONLY (n.t==='custom' guard): real orgs and states keep
  their true names — a renamed "1st ID" would be a lie on the diagram.
- The box: .bf-grp = dashed outline (outline, not border — the tier box-shadow
  ring and layout stay untouched) + engraved GROUP tag (.bf-grptag). Tier
  colors still apply — a group is structure, and the dash is what says
  "not a real unit", never a color change (tier colors are semantics).
- Form state discipline: _bfRnEdit and window._bfGrpForm reset everywhere
  _bfAnnEdit does (sheet switches, ✕ clear, brief tap-away dirty list). A new
  brief-room form that skips those reset sites WILL get stuck — that class of
  bug shipped twice before (v0.32.2/v0.32.3).

## v1.0.4 — no overlapping surfaces (owner recording: "pop ups overlap… only show 3 at a time")
- TEXT FORMS LIVE IN SHEETS, NEVER IN CHART CHROME. The v1.0.3 inline
  group-name form in the chart foot collapsed to a sliver under the iOS
  keyboard + AutoFill bar (typed text invisible). Every "New group" door now
  opens _bfGroupSheet in the dossier — the same rc-form grammar as rename and
  note, which the keyboard already coexists with. Smoke fails the build if
  bf-grprow ever reappears in chart HTML.
- STICKY IS THE PICKER'S CONTRACT ONLY. #dossier .rc-acts was sticky with a
  transparent-top gradient; over scrolled sheet content it read as a second
  overlapping pop-up in the owner's recording. The sticky rule is now scoped
  to .bf-picksticky (the ＋ picker's commit row — a long list genuinely needs
  its commit reachable). Any other sheet's action row flows with the content.
- THE THREE-ROW LAW (owner, across the board): a floating list shows ~3 rows
  and scrolls. #searchResults is capped at 172px on phone AND desktop (the
  desktop 60vh override is gone). Apply the same cap to any future floating
  list; sheet-internal lists (picker) scroll inside the sheet and are exempt.
- Surface budget: at most the docked chart + ONE sheet-or-callout + one toast
  on screen. Sheets and the callout are already mutually exclusive; keep it
  that way — a fourth simultaneous surface is a bug by definition.

## v1.1.0 — the ID registry + the database door (owner: "not stored local")
- IDs live ON the record (r.ids, items carry item.xid) so they ride _recSave,
  the database push, backups and exports with zero extra plumbing. recAddId
  mints ID-001-style labels for NEW/blank, associates case-insensitively for
  an existing entry, never duplicates. recDelId UNTAGS — deleting an ID must
  never delete data. The ID tab sits between Overview and People; every
  record form carries the "Files under ID" box (existing · NEW · No ID; the
  last choice sticks via _rcLastXid).
- THE DATABASE DOOR is A-ORG-1's inception contract, ported verbatim:
  ensureSupabase() lazy-injects the client ONLY on manual Connect (⋯ menu →
  Database); nothing foreign at boot — smoke fails the build if #sbLib or
  window.supabase exists at boot, and dead-lint allowlists exactly the one
  CDN URL. One board row in table a2_records {id, data jsonb, updated_at,
  updated_by}; realtime channel filtered to the board; updated_by kills echo;
  merge is per-record newest-mod-wins. All record mutations funnel through
  _recSave → dbPush (debounced 700 ms) — new write paths MUST keep doing so.
- HONESTY CLAUSE (tell the owner, keep in copy): a PWA cannot be zero-local —
  IndexedDB remains the OFFLINE CACHE so the app opens in a dead zone, and
  the connect config (URL/key/board) is kept on-device so the sheet prefills.
  The DATABASE is the source of truth whenever connected; Connect is manual
  each session by law. The owner supplies their own Supabase project (table
  DDL is in the Database sheet's fold-away setup note).
- Harness hook: _odUI.form(kind) drives the add-form from smoke (closure
  state; do not try to set _rcForm from outside — it silently does nothing).

## v1.2.0 — the whole working set on the board + the reconnect chip
- The db snapshot is now {v:2, records, brief:{nodes,hide,mod}, views:{list,mod}}.
  Records merge per-record newest-wins; the brief diagram and the saved-view
  list each merge as ONE BLOB, newest edit wins. The edit clocks (_bfMod,
  _svMod) persist inside kv 'brief' and kv 'views' so offline edits from a
  previous session still out-rank an older remote blob. kv 'views' is now
  {v, list, mod}; the loader still accepts the legacy bare array.
- MERGE LAW: _dbApply writes IndexedDB DIRECTLY, never through _bfSave/_svSave
  /_recSave — the save paths call dbPush, and a merge that re-pushes is an
  echo loop. Any future board field follows the same pattern: save path
  stamps a mod + pushes; apply path compares mods + writes storage raw.
- THE RECONNECT CHIP (#dbChip): shows only when dbcfg exists AND the session
  is not connected, after the boot title (6.2 s floor). One tap = dbConnect
  (the library loads at the tap, not before — the law holds); ✕ dismisses;
  auto-retires at 25 s; a FAILED tap opens the Database sheet so the reason
  is readable. Harness hooks: DB.chip() + DB._setCfg() (closure state).

## v1.2.1 — the update path survives a blip
- ONE failed sw.js fetch used to strand the whole session (single register()
  try, catch(){} swallow, raw script-error toast). Now: register retries on a
  15s→2min ladder (5 tries) + on every foreground return while uncontrolled;
  the sw.js script error toasts as an UPDATE-CHECK failure in plain words,
  raw line preserved in __errLog. Never reduce the retry ladder to a single
  try again — a phone opening seconds after a deploy WILL hit blips.
- Field diagnosis pattern that found it: version stamp (v1.0.3) + toast text
  named the exact failing URL; Cloudflare build green + CI green + wrangler
  assets config sane ⇒ the client's single-try registration was the only
  suspect left. The stamp/toast review-truth stack keeps paying rent.

## v1.3.0 — matte objects in the brief (owner: bold text, chosen-color matte fill)
- The chart box IS its color: flat matte fill (tier deep hue by default, the
  picked swatch when chosen), name at 900 weight in ink computed by _bfInk
  (relative luminance > 0.58 → dark #221A08, else cream #FDF8E7). Everything
  on the box — station line, GROUP tag, ＋/✎ ops, the group dash — rides
  var(--bfink), so any fill stays legible. bf-tinted (the 16% wash) is
  RETIRED; never reintroduce washes or rings on chart objects.
- Tier law intact: L1/L2 cools/L3 warms/L4 roses moved from ring to body —
  same hue families, same semantics, no green on brief data.

## v1.4.0 — brief-only places (owner: locations that exist only in brief mode)
- A PLACE is a custom node carrying its OWN coords ({la,lo,bs} on the node);
  _briefChainMap uses them before the ride-the-parent fallback, so its globe
  dot sits at the anchor base. The fixed roster is BF_PLACES (12: seven state
  RSNs at their State NG dots, TARC RSN at Arlington/NGB, Bragg+JBLM RSN and
  ECCSP pairs). Offered ONLY in the brief ＋ picker ("Brief-only locations",
  searchable, placed ones drop out) — the map room and the shared search
  index never see them (rooms stay severed).
- A pinned custom is NOT a group: no dash, no GROUP tag; its station line is
  the host base. Coords resolve from the live site AT ADD TIME and are stored
  on the node — board-portable and offline-safe. kv loader and the board
  merge pass la/lo/bs through; strip-lists must keep doing so.
- Extending the roster = add a row to BF_PLACES (k 'px:…', n, site id). Keys
  are stable ids — never rename a k once shipped (placed nodes keep it).

## v1.5.0 — stack a level (owner: vertical/horizontal per level, horizontal default)
- BRIEF.vert = the chart levels (2-4) whose litters lay out as a COLUMN;
  persisted in kv 'brief' and on the board blob like hide. bfStack(n)
  toggles; the STACK seg sits beside the depth dial (only when the chart is
  deep). Levels deeper than 4 follow L4's setting (tier-law consistency).
- .bf-vert overrides the connector system: the horizontal top-border scheme
  is fully reset per child-position variant (first/last/only) and replaced
  with left-rail elbows — any new connector CSS must keep both schemes
  independent. Wide-litter wrapping (bf-kgroup) is horizontal-only.


## v1.5.2 — the co-located callout (owner: two small lines pointing to the location, labeled RSN / ECCSP)
- The v1.4.2 fan grew leader lines: every fanned dot draws a thin line back
  to the TRUE spot, plus one shared white tick AT the spot (first cluster
  member draws it). Fan ring widened to 15px (pairs) / 18px so the line
  reads. Leaders belong to dot geometry — gated by dotsOff, NOT by the
  v1.5.1 brief lines toggle (that governs hierarchy arcs only).
- `_bfFanShort(labels)` — pure, class-wide: labels in one cluster shed
  their common WORD prefix ("Fort Bragg RSN"+"Fort Bragg ECCSP" → RSN /
  ECCSP); a member whose remainder would be empty keeps its full label;
  unrelated labels pass through. smoke exercises all three shapes.
- Verbatim-name law (v1.4.1) reconciliation: verbatim governs SOLO
  placement and the chart boxes always; only a globe fan cluster — where
  the spot itself carries the shared name — sheds the prefix.

## v1.6.0 — territories + illuminated stars (owner, two asks)
- US_STATES holds 54: 50 states + DC + Puerto Rico + Guam + 'Virgin Islands'
  (owner's name — _namedStateShapes aliases the payload's 'United States
  Virgin Islands' key; never rename the roster entry without keeping the
  alias). data/states-10m.json is GEOGRAPHIC lon/lat and carries all four
  territory outlines; smoke decodes them.
- STATE LAW CHANGED: a selected state/territory is its bright border ALONE —
  no translucent wash, no centroid dot, no fan seat, no hit-list entry
  (drawBriefNodes skips kind 'state'; drawBriefStates owns outline + label).
  Stripes remain an explicit owner toggle.
- Bug unearthed: drawBriefStates' label phase referenced `bodyFont`, a
  drawGlobeMarkers LOCAL — swallowed ReferenceError, state names had never
  drawn from that path (the dot's label covered it). Fixed to T.body. The
  try{}catch around drawBriefStates calls can hide exactly this class:
  when a canvas layer goes silent, test the function bare.
- ILLUMINATED STARS: _bfStarKind(n) — custom node named '… RSN' → 'rsn',
  '… ECCSP' → 'eccsp', all else null (dot). BF_STAR={rsn:'#6FE3FF' ice,
  eccsp:'#FF7BD9' orchid} — class colors OUTSIDE the tier streams, never
  green; leader lines and labels keep tier shades. Both toggles (dots Aa)
  govern stars exactly as they governed dots.

## v1.7.0 — saved briefs · the ledger · asset inventory (owner, three asks)
- SAVED BRIEFS: SAVEDB/_sbMod, kv 'briefs' {v:1,list,mod}, snapshot key
  `briefs` — EXACTLY the views law (newest-wins blob; _dbApply writes kv
  directly, never via _sbSave — echo law). sbCapture deep-copies nodes;
  sbLoad re-validates org refs and re-cleans inv, then goes through _bfSave
  so the load itself syncs. Shelf capped at 24 like views.
- THE LEDGER: right drawer #ledger (.ld-* classes — .lg-* belongs to the
  LEGEND, never reuse it), doors = chart-head ▤ + ⋯ menu row. Shelf on top
  (save arms an inline name form; Load is a TWO-TAP arm 'Replace current?';
  ✕ deletes), then ID registry grouped by installation with per-ID
  P/S/N/L counts + an 'untagged' row. _ledgerHTML() is the pure builder —
  smoke asserts on its string. Inside .ld-row, .bf-act must stay
  width:auto (its default 100% ate the row — fixed in CSS).
- ASSET INVENTORY: nd.inv=[{q≤10ch,d≤60ch}] ≤40 rows, blank-desc rows drop
  (_bfInvClean — the ONE sanitizer every load path calls: kv m2 strip,
  sbLoad; _dbApply passes whole nodes so it rides free). Section on BOTH
  sheets (_bfPlainSheet + _bfObjSheet org path) via _bfInvHTML; the _disc
  accordion opens by default only when rows exist. _bfInvEdit joins the
  _bfAnnEdit/_bfRnEdit clear-sites (now 5 sites × 5 fields).
- Size watch: ship-lint now warns at 91.7% of the 900KB budget — plan a
  prune before the next big feature.

## v1.8.0 — owner correction: briefs to the brief room, panel = repository
- Owner on v1.7.0: "don't need a brief ledger". LAW: the side panel
  (#ledger, .ld-*) is the REPOSITORY — MAP DATA ONLY (records by
  installation, per-ID P/S/N/L counts, tap an ID → the actual items
  render via RC_KINDS field grammar: people name—role, specs label:value,
  notes text, links label·url; 'untagged' row included). Never put brief
  surfaces in it again.
- Saved briefs live in the BRIEF ROOM: chart-head ▤ (data-bfbriefs) →
  _sbOpenSheet in the dossier (the _svOpenSheet grammar) — save arms a
  name form, load is a two-tap replace-confirm, delete ✕. Data layer
  unchanged from v1.7.0 (SAVEDB/kv 'briefs'/board blob).
- window.Repo={open,close,html,sel} — sel() is the harness hook for the
  _ldSel closure var (the _rcForm lesson again). window.Ledger is gone.
- Repository refresh moved into _dbApply's `took` block — ANY merge
  (records included) re-renders an open panel, not just the briefs blob.

## v1.9.0 — groups off the globe + the control clean-up (owner, two asks)
- GROUPS ARE CHART-ONLY: drawBriefNodes skips kind 'custom' && !pinned in
  BOTH the fan pre-pass and the draw loop (symmetric, like states) — no
  star/dot/label/_screen entry. Inherited coords STAY on the chain node so
  arcs route parent → group spot → children. Pinned places (la!=null) keep
  their stars.
- UI GRAMMAR LAWS (born from a 3-agent design panel + 3-lens adversarial
  review, both clean):
  · Bar segments wear caption chips (.bf-vlab): LEVELS · STACK · ZOOM;
    .bf-zseg{margin-left:auto} keeps structure left, view right.
  · Head tools = .ch-tool wrapper (carries the data- attribute; inner
    .od-ico/.ch-lbl are pointer-events:none) + .ch-lbl caption; clusters
    VIEW │ FILE split by .ch-div; captions hide under body.chart-min.
    Handler branches MUST stay above data-chmin (v0.26.0 trap).
  · Sheets read: identity (rename/note = .bf-qt quiet text WITH the name)
    → ONE filled primary (.bf-act bf-addsub via _bfAddUnderBtn, or
    ★ Add to brief for non-members) → Quick add disc (counted, folded >8)
    → Search all → Custom disc → Appearance disc → Arrange disc (reports-to,
    order, AND the root hide toggle) → Assets disc → danger rail (.bf-act.rm,
    Remove/Delete ONLY, always last). One primary per sheet, ever.
  · .disc-h is a category header (uppercase mono + gold tick on hairline),
    NOT a gray slab — the restyle covers all nine _disc call sites.
- Review find fixed (pre-existing): Add-note is MEMBER-gated — bfNote
  writes to the brief node, so a non-member sheet offering it silently ate
  the text. Smoke enforces: non-member sheet = no data-bfannedit, leads
  with data-bfadd. _xpPulse pulses the inner .od-ico circle, not the
  labeled wrapper.

## v1.9.1 — the crisp pass (owner: "Word edit mode" → "iOS/Twitter fluidity, sleek/crisp/clean")
- DASHED RING RETIRED for groups — the engraved GROUP kicker is the ONLY
  filler marker. Never bring back dotted/dashed outlines on chart objects.
- Box law: matte fill + layered shadow (1px contact + soft ambient), 13px
  radius, springy press (scale .96, cubic-bezier(.32,1.4,.45,1)) and
  desktop hover lift. No brightness blinks.
- Ops law: ＋/✎ are 22px CIRCLES, ink at 12% fill, centered via
  .bf-ops{width:100%; justify-content:center}, spring press to .86.
- Micro-motion grammar: every chart control (segments, zoom, carets, head
  tools, sheet buttons) answers the finger with a spring-curve transform —
  cubic-bezier(.34,1.56,.64,1) for small chips, (.32,1.4,.45,1) for cards.
  New interactive chrome must ship with this feedback.

## v1.10.0 — the fluid chart (owner: "operate like iOS/Twitter — build it as its own release")
- FLIP over the whole chart: _bfFlipCapture at renderBrief's top (rects by
  data-bfobj key), _bfFlipPlay after _bfFit settles (zoom + centering must
  land FIRST or deltas lie). Movers: transitions off → transform back to
  the old spot (deltas ÷ per-box effective scale rect.width/offsetWidth —
  the CSS-zoom compensation) → forced reflow → release; the stylesheet
  spring carries the glide. New boxes: .bf-enter (opacity 0, scale .85)
  removed after two rAFs.
- Guards, all mandatory: null when chart-min, when no prior boxes, under
  prefers-reduced-motion; >560px deltas snap (teleports beat streaks);
  everything try/catch (stub DOM in smoke has no rects).
- LAW: the animation is PURE PRESENTATION — the DOM is final from the
  first frame. Anything reading the chart (hit-tests, exports, harnesses)
  must never wait on or know about the glide. Interruptible by design:
  a re-render mid-glide captures the box's CURRENT visual rect (gBCR
  includes the transform) and re-FLIPs from there.
- Proof pattern for motion: rAF-sample gBCR in-page (the trajectory
  201→…→591→571 with overshoot IS the spring); single screenshots lie
  about animation, headless first-paint lags ~60ms.

## v1.10.0 — the fluid chart (owner: iOS/Twitter movement, own release)
- FLIP: _bfFlipCapture at renderBrief top, _bfFlipPlay AFTER _bfFit (zoom +
  centering must settle first). Deltas ÷ per-box effective scale
  (rect.width/offsetWidth) = CSS-zoom compensation. New boxes: .bf-enter,
  removed after two rAFs. Guards: chart-min, no priors, reduced-motion,
  >560px snaps. PURE PRESENTATION — DOM final from frame one; interruptible
  (re-capture reads the mid-glide visual rect).
- Motion proof pattern: rAF-sample gBCR in-page; single screenshots lie,
  headless first paint lags ~60ms.

## v1.11.0 — always on · hover ops · segment polish (owner, three asks)
- AUTO-CONNECT amends the boot-inert law BY THE OWNER: boot still loads
  zero foreign code until the FIRST manual Connect; success sets
  dbcfg.auto=1 (only when auto==null — an explicit off is never
  overridden). Boot: _dbAutoBoot() when auto, else chip; failure ALWAYS
  degrades to the chip (.catch included — stub DOM rejects). Deliberate
  Disconnect stands auto down. Toggle = data-dbauto in the Database sheet.
  Smoke: inert w/o config · respects OFF · fires with ON · toggle present.
- HOVER OPS: .bf-ops is an absolute inset:0 overlay — out of the box's
  layout (boxes ~40px, was ~70). @media(hover:hover) reveals chips and
  dims the face (.bf-nm .14). Touch: no ops — the sheet leads with the
  same actions. Never re-add layout-consuming controls to .bf-box.
- SEGMENTS: iOS grammar — .bf-seg is a quiet rounded track (inset hairline),
  cells transparent, ON = filled var(--accent) pill with #141006 ink. All
  cell rules SCOPED under .bf-seg (a legacy .bf-depth block would win
  otherwise — that was the 'Fit highlight looks off' bug).

## v1.11.1 — the double border (owner: shared borders show BOTH colors)
- State outlines are clipped to their OWN polygon and stroked at 2× width
  (3.6 → 1.8 visible): only the inner half paints, so every selection hugs
  the inside of its border. Neighboring selections therefore sit side by
  side — a double line on shared borders in both colors — with zero
  adjacency detection. Stripes draw inside the same clip.
- Law: state outline rendering must stay inside-clipped; a centered stroke
  brings back last-drawn-wins overwriting on shared borders.
- Canvas proof pattern: pixel-scan getImageData for both hex colors and
  assert a cross-color pair within a few px along the border.

## v1.11.2 — uniform objects (owner reference chart)
- LAW: every .bf-box is EXACTLY 124×48 (fixed width AND height,
  box-sizing:border-box), content centered, .bf-nm/.bf-st truncate at
  102px. Never let content stretch a card — the diagram sits on one grid.
  Verified by measuring offsetWidth×offsetHeight across mixed kinds
  (org/group/place/state) and asserting ONE unique size.

## v1.11.3 — the straight rail (owner: stacked litters under the parent, compact, aligned)
- Stacked-column connectors are ONE system: ul::before = drop from the
  parent to the first card's center (left:16px, height:34px = 10px pad +
  24 half-card); per-li ::after = rail bridging card center to NEXT card
  center (top:24px → bottom:-30px = 6px gap + 24), so it passes cleanly
  left of any nested subtree; per-li ::before = 14px stub into the card's
  left edge at top:24px. ALL constants derive from the uniform 124×48 card
  and the 6px gap — if either ever changes, re-derive 24/30/34 together.
- Geometry proof: assert one unique card x per column, column center
  within 20px of the parent's center, and gaps === [6] via gBCR.

## v1.12.0 — the working copy (owner: one record, blank-slate opens) — AMENDS v1.2.0
- THE BRIEF WORKFLOW LAW: the working diagram is SESSION-SCOPED. Every open
  starts blank (map too: no restored selection, no restored room; camera
  angle only, zoom clamped to the calm world). Persistence = the saved
  brief record: first save names it and makes it the WORKING COPY
  (GlobeState._sbActive = record id); the Briefs sheet then leads with
  “Save changes to <name>” (sbUpdate — in place, same record), with
  save-as-new as the quiet fork. Loading a record makes IT the working
  copy; legacy records earn an id on first load; removing the active
  record clears the pointer.
- RETIRED from v1.2.0: the working-brief blob — kv 'brief' is no longer
  read (one-time rescue: pre-v1.12 nodes found there become a “Recovered
  brief” shelf record, slot emptied), _bfSave writes nothing durable,
  _dbSnapshot (v:3) carries no brief key, and _dbApply IGNORES incoming
  brief blobs from older versions. Saved records (briefs blob) are the
  ONLY cross-device carrier of diagram work — inventories, colors,
  stacking all ride inside record nodes.
- Smoke enforces: snapshot has NO brief key; a remote working-brief blob
  never applies; stacking + inventory persistence assert on the SAVED
  record; the working-copy lifecycle (activate/update/fork/clear).

## v1.12.1 — the dock (owner: "expert-level, like the references")
- HEAD LAW: the four chart tools live in ONE dark pill (.ch-dock, #141006,
  radius 22): uniform 40px slots, cream glyphs (#F2E4BC), gold CIRCLE
  behind an ON toggle (the reference's amber slot), hairline cream divider
  between VIEW and FILE clusters. chart-min keeps the pill, drops captions.
- DECK LAW: LEVELS · STACK · ZOOM are one row of equal-height (32px)
  tracks, gap-separated, wrapping as WHOLE units, left-aligned — never a
  margin-left:auto float (that was the ragged-right zoom pill).
- Geometry proof: assert one unique .bf-seg height and the dock height at
  both 414 and 1280.

## v1.13.0 — the console (owner's red-circle annotations) — AMENDS v1.12.1
- ONE HEAD ROW: ⌗ mark + L1-L4 track + ZOOM track + focus chip + the dock
  all live INSIDE .ch-head (a div[role=button][data-chmin] — a real
  <button> head would nest buttons, which is invalid HTML). The separate
  control bar (.bf-bar) is RETIRED; so are the "⌗ CHART" title text, the
  .ch-n org count, and the LEVELS/STACK captions ("Level" word gone —
  cells read L1-L4 bare). The v1.12.1 DECK LAW now governs the tracks
  inside the head (whole-unit wrap, equal heights); .ch-dock floats right
  via margin-left:auto.
- CHMIN EXCLUSION LIST: the head IS the minimize toggle, so its branch
  must exclude every interactive child:
  [data-xpbtn],[data-bfzoom],[data-bfdepth],[data-bffocusclear]. The
  data-bfzoom handler sits AFTER the chmin branch in the delegate — any
  new head control MUST join this list or taps on it minimize the chart.
- HOLD-TO-STACK: the STACK track is retired; long-press (480ms, >12px move
  cancels, contextmenu suppressed on the cells) on an L2-L4 depth cell
  opens #bfStackPop, whose .bf-sp button carries the SAME data-bfvert
  contract the old track used. Two delegate traps, learned live:
  (1) the click that ENDS the long-press hits the tap-away dismiss line
  first — it must skip while _bfLpFired is up, or the pop flashes and
  dies before the finger lifts; (2) the same flag makes the bdp branch
  swallow that click so the level doesn't switch. Tap-away (guarded) and
  any re-render dismiss the pop. L1 never stacks.
- chart-min hides .bf-seg tracks + .bf-clearfoc (CSS, body.chart-min),
  keeping the ⌗ + dock pill only.
- Track material follows the dock: #141006 pill, cream .72 cells, gold
  .on — never the old cream-outline segments.

## v1.13.1 — the seam (owner: "shared lines… more distinct, bolden") — AMENDS v1.11.1
- BAND LAW: the state outline is an 8.4 stroke clipped to its own polygon
  (4.2 visible inside every border, up from 1.8). Alpha 1.
- SEAM LAW: after ALL bands, one pass re-traces every selected outline
  with a 2px rgba(12,9,3,.9) line ON the border itself — touching
  selections read color · seam · color. ORDER IS THE INVARIANT: a seam
  drawn inside the band loop gets its neighbor-half repainted by the next
  state's clipped band and the colors bleed again. drawBriefStates is now
  two passes over a pre-gathered sel[] list with a shared trace() helper;
  the label phase is untouched.
- Smoke asserts band count, seam count, and max(band idx) < min(seam idx)
  on a recording ctx (California+Nevada, camera faced via the harness
  quaternion pattern — GLOBE_STATE_SHAPES does load in the smoke boot).
- Live proof pattern: pixel-scan a screen segment crossing a straight
  border stretch (WA/OR at 46°N, lon -118.5) and assert the run sequence.
  Classify pixels by NEAREST palette target under distance 60 — first-hit
  under a loose 90 misread pink as purple (they sit 85 apart).

## v1.14.0 — the map room refresh (owner's design handoff: options 3a + 2a)
The handoff bundle (design_handoff_ui_enhancements) is the design source of
truth for v1.14–v1.16; its README + committed artboards carry exact values.
- MODE SEG LAW: #modeSeg (glass pill under wordmark+verTag, centered, phone
  top +52 / desktop +50) is THE room door. Active cell = literal #F5D76E with
  #141006 ink (dock-material law — literals survive the cream room). Active
  state is pure CSS off body.brief-mode — no JS state. FAB hold stays a
  shortcut; in Brief a plain FAB tap returns to map (label swaps to TO MAP
  via .nv-fablbl::after content). The Brief satellite is RETIRED.
- TIME LEDGER LAW (AMENDS v0.6.0 clocks): ONE #timeLedger chip top-right
  replaces #clockTL/#clockTR; seg7 engine deleted. LOCAL row ticks SECONDS
  on desktop (1s boundary setTimeout, hidden-tab skip, typing guard, __k
  dedupe); phone is compact hh:mm (2a phone mock) at top +88 under the seg.
  BASE row keeps the whole zone brain untouched (auto-fill precedence,
  manual pin, toggle-off, 12-region sheet); the whole chip opens the sheet.
  Ledger persists in brief ON DESKTOP; phone brief hides it (phone mocks
  carry none — the chart owns the band). Chrome lists updated: gesturing,
  body.intro, canvas label-avoidance, outside-tap control list.
- CALLOUT RAIL LAW: map-room cards open with .co-rail (full-bleed strip,
  rgba(245,215,110,.07)): ≤2 command-chain chips (data-codrill) › HERE, ✕
  right. Name + inline .co-subin on one row. All three tiles carry counts
  (UNITS n / CONNECT subN / DETAILS recCount of host site). co-docked top:
  phone +136 (below the ledger), desktop +64 (the freed corner).
- SATELLITE LAW: every nav control wears a permanent micro-label (.nv-lbl,
  never a tooltip). Calm state = quiet glass + accent glyph; bright gold ring
  reserved for :active. Desktop: 56px circles, groups 96px off the FAB.
  Phone: ONE labeled glass strip (radius 20, inset 10) ABOVE the FAB at
  bottom +92; nav-open lifts the search pill to +188 so nothing stacks.
- ⌘K: hint chip .sp-kbd desktop-only; ⌘K and / already focused search.
- STUB-DOM LESSON: smoke's stub never parses markup CHILDREN — static
  markup asserts must grep the raw source (html), only JS-written innerHTML
  exists on IDS[...] stubs. Also: probes must reset zone state they inherit
  (selectSite(null) first) — earlier probes leak selections.

## v1.15.0 — the dark console (design 5a + 2b + 3b) — AMENDS v1.2.0/v1.3.0/v1.11.2/v1.11.3/v1.12.1
- CREAM RETIRED: the body.brief-mode token override + #F3ECD4 paint are GONE.
  Brief is said by: the seg, body.brief-mode::before (inset 8, r20, ring
  rgba(245,215,110,.55)), #globeCanvas opacity .78, and the brief dock.
  Never reintroduce a palette flip.
- CONSOLE LAW: #briefStage is a frameless radial pool (no ring, no drop):
  radial-gradient(ellipse 90% 100% at 50% 30%, rgba(6,5,4,.82) 55%,
  transparent). Phone: 6px gutters, r18; desktop: centered 880px via
  left/right:0 + margin auto (NEVER transform — the stage scrolls).
- CHART GRAMMAR (replaces the ul/li rail tree + 124×48 card): renderBrief
  computes an ABSOLUTE layout — content-hugging boxes (measured on a shared
  canvas; min 44px; +24/+20 padding) at height 24 desk / 22 phone, level
  pitch 48/40, stack pitch 32/30, sibling gap 28, left gutter 24 for the
  L-labels. Positions ride the markup (left/top in each box's style) so the
  stub-DOM probes can assert geometry from the HTML string.
- ILLUMINATED BOX: fill = tier 13% tint · ring = tier color (1.5px) · glow
  0 0 10px 30% · text = pale tier tint (.bf-t1..t4 own the vars; owner
  swatches go through _bfTint: ring=swatch, text lifted 65% to white).
  Focus adds 3.5px rgba(245,215,110,.4) + 16px glow; off-chain .35 opacity;
  groups wear a DASHED ring (the GROUP tag and .bf-st sublines are retired
  — name-only law). Boxes translateX(-50%): every transform (active/enter/
  FLIP) must carry it or the box jumps half a width.
- THE NET: one SVG per render — echelon hairlines (rgba .08 at next-band
  minus 8), base tree rgba .34/1.4 when unfocused; with a focus the lit
  chain draws twice (5px .28 at 50% + 1.6px .85) with r2.4 gold beads at
  its elbow drops and everything else at .18. Elbows are 4px corner quads;
  columns are straight V spines.
- STACKING: a stacked level FLATTENS into one column on the parent's
  center; descendants of stacked nodes continue the same column. Proof =
  shared left + descending tops (geometry, not classes).
- DOCK SPLIT (2b): the chart head is chart-scoped (⌗ · N ORGS · L1-L4 with
  ⌄ on the active cell + HOLD-A-LEVEL hint (desktop) · ZOOM · focus chip).
  #briefDock (static markup, .ch-dock material) carries ADD(data-bfsearch)
  NAMES LINES │ BRIEFS EXPORT LEDGER(data-bfledger→Repo.open). Being
  static, its toggle cells need _bdSync() after every render/mode change.
  Phone: full-width strip, .bd-gap spacer under the FAB. Foot chips went
  QUIET (dark, inset ring) — the bright slab pair died with the card.
- LEADER LAW: #bfLeader (DOM/SVG, z15) re-anchors in the SAME dirty-frame
  hook as _coTrack; hidden when unfocused/minimized/map-room/far-side.
  Label = host base + state, uppercase; 14px gold diamond at the dot.
- Search placeholder swaps per room in setMode.
- LESSON: `.bf-box.bf-dim .bf-ops{opacity:.5}` outside the hover gate had
  leaked ops onto touch screens since v1.11.0 — visible only once boxes
  went translucent. Overlay opacity rules live INSIDE @media(hover:hover).

## v1.16.0 — the world tour (design 4b) — REPLACES the v0.34.0 boot title
- THE TOUR: ~2.9s over the real canvas. One continuous westward pan on the
  28°N track (lon = 130 − 219·p, yaw=(lon−90)·π/180, pitch=28°, zoom eases
  1.05→1.30). Four beats (p·4): PACIFIC (kj/pi/gu ignite, Humphreys pulses)
  → SW ASIA (lineage line Humphreys→Arifjan, swa) → EUROPE (→Wiesbaden,
  eur; wordmark condenses .5em→.34em, opacity .22→1 — letter-spacing AND
  text-indent move in lockstep or the mark drifts) → FINALE (→Pentagon,
  '*' floods all groups, gold bloom over CONUS at 55% of the globe radius).
  LIGHT ACCUMULATES — nothing lit ever dims. fin() lands with
  flyToLatLon(33,−78,startZoom); tap skips; prefers-reduced-motion or
  __SANDBOX opens straight on the resting map; 900-frame hard cap.
- THE GATE: GlobeState._bootMode + _bootLit (Set of primary grp tokens,
  '*' floods). drawGlobeMarkers skips unlit sites, the cluster diversion
  and the tiny-label pass while _bootMode is up — the tour paints DOTS,
  never badges. _bootPaint (hooked at drawMarkersHook tail) draws the
  partial-progress lineage line (slerp+8% lift copy — drawSubtleArcs has
  no progress param), the Humphreys double ring, #FFD98C arrival flashes
  (450ms) and the finale bloom. State torn down entirely in fin().
- RETIRED: the spin+invert title and GlobeState._introInvert consumption.
  The old lesson stands in place: any future paper beat must be a REAL
  palette swap in drawGlobe, never a CSS invert (gold goes grey-green).
- COUPLED TIMERS moved with T: version toast 4000 · first-run coach 3800 ·
  #dbChip floor 4600. If T changes again, move all three.
- PROOF PATTERN: sample the tour on the PAGE clock (injected setTimeout
  recorder), never the test's — a mid-run Playwright screenshot costs
  ~0.5s of wall time and slides every later sample into the wrong beat.

## v1.16.1 — the prune (budget law) — AMENDS the ship ritual
- THE CHANGELOG RETENTION LAW: the in-file changelog keeps the CURRENT ERA
  only (today: v1.5.0+). Older entries live in `git log` and this file's
  law sections — they are never lost, only moved. When the ledger's oldest
  era no longer matches any live law, trim it in a prune release and move
  the pointer comment. 66 KB freed here: 97.4% → 90.3% of the 900 KB gate.
- A prune is a RELEASE like any other: version bump, cache, changelog
  entry, full suite, live boot sanity — "no user-facing change" never
  means "no proof".

## v1.16.2 — the ignition (owner: "the dimming effect and the dots did not change")
- During the tour the WORLD DIMS: drawMarkersHook opens with a full-canvas
  rgba(4,3,2,.55) veil while _bootMode is up, fading to 0 across the finale
  beat — the flood of light IS the landing.
- IGNITED DOTS: while _bootMode is up the reticle NEVER draws — the marker
  loop pushes the hit-cache entry and continues; _bootPaint paints every lit
  site as three concentric light arcs (halo 6px @.14 · corona 3.2 @.34 ·
  hot core 1.7 #FFE9AA), depth-faded. No gradients, no shadowBlur — cheap,
  boot-only, so the resting map's no-glow reticle law stands untouched.
- Proof pattern: pixel-sample on the page clock — the Humphreys pixel must
  read warm gold mid-beat-1 and an interior-land pixel must sit well under
  its resting luminance (measured 7.0 vs 12.7 here).
- Root cause of the miss: v1.16.0 verified the tour's STATE (lit sets,
  beats, teardown) but not its LOOK against the 4b frames. When a design
  frame exists, the live proof must include a pixel/visual comparison to
  it, not just state asserts.

## v1.16.3 — brief breathing room + the solid group ring (owner's phone review)
- BRIEF SPACE LAW (phone): seg top +48; console top +84 with 6px padding;
  console max-height = 100dvh − both safe insets − 218px; the search pill
  DROPS to bottom +74 in brief (results shelf +126) so it sits just above
  the dock. The chart owns everything between the seg and the search band.
- THE DASHED RING DIED TWICE: v1.9.1 retired it ("edit mode in Word");
  v1.15.0 quietly brought it back on groups; the owner caught it. It is now
  a smoke assert (no `dashed var(--bfrg` anywhere) — a retired style is not
  retired until a probe guards it.

## v1.16.4 — the closer (owner: "ending abruptly stops — one more hop, flash A-ORG-2")
- FIVE beats over T=3900 (seg=floor(p·5)): the 5th is the CLOSER — the line
  hops the Pentagon → Fort Bragg while the camera eases its last 11°
  (-89 → -78, pitch 28°→33°) onto the resting CONUS frame, so fin()'s
  landing fly is a settle, not a jump. The dim now fades on total progress
  (p .6→.95) and the bloom breathes out under the closer (seg 4).
- THE FLASH: from p>.86 the veil mark swells 6% and glows (drop-shadow up
  to 48px at .9 alpha), peaking on a sine and handing off into the veil's
  own .45s fade — the A-ORG-2 mark is the last thing the boot says.
- fin() must clear EVERY inline mark style it set (letter-spacing,
  text-indent, opacity, transform, filter).
- Coupled timers moved again with T: toast 5000 · coach 4800 · chip 5600.
- PROBE LESSON: style readbacks NORMALIZE colors — 'rgba(245,215,110'
  never matches; assert on '245, 215, 110' (spaced) or the function name.

## v1.16.5 — the theater order (owner recording: "Go pacific Korea SWA Europe US")
- HOP ORDER LAW: the intro reads west-to-east into home — Fort Shafter
  (Pacific, with Guam/Philippines igniting alongside) → Camp Humphreys
  (Korea) → Camp Arifjan (SWA) → Wiesbaden (Europe) → the Pentagon (US,
  lit '*'). GRPS = [['pi','gu'],['kj'],['swa'],['eur'],null].
- CAMERA WAYPOINTS: piecewise lon CAM=[205,150,90,25,-40,-78] lerped per
  beat (seg → seg+1 across segP), pitch 28° with a +5° ease on the final
  beat, zoom 1.05→1.30 on eased total progress. Changing hop order means
  re-deriving CAM — the camera must lead each landing, never chase it.
- ARRIVAL-FLASH LAW: a target flashes when the line LANDS, not when the
  beat starts — fire at segP>0.94 with a flash.some(f=>f.i===seg) dedupe.
  (v1.16.5's first cut ringed Arifjan while the line was still mid-ocean;
  the beat frame caught it. Mid-flight sample must show fl=[].)
- Dim veil holds through the four away beats and floods off across
  p .78→.97; the CONUS bloom is seg===4 only (bp=min(1,segP·1.3)) and
  hands into the veil fade. Wordmark condenses from p>.55 over .31.
- Coupled timers stand at T=3900: toast 5000 · coach 4800 · chip 5600 —
  any future T change moves all three (law since v1.16.0).

## v1.17.0 — the constellation (owner: "do away with the big numbers — illuminated dots instead")
- THE CLUSTER BADGES ARE RETIRED: the A-ORG-1 §3.4 grid/merge/count system
  (drawClusters, GlobeState._clu/_cluHits, the badge tap pass, _flyFitPts)
  is deleted. Smoke bans the identifiers in source — retired isn't retired
  until a probe guards it.
- WORLD VIEW = CONSTELLATION: below zoom 1.6 every ordinary site paints via
  _glowDot — the boot tour's three-arc ignited dot (halo 6 @.14·fd · corona
  3.2 @.34·fd · core 1.7 #FFE9AA @.95·fd), now a SHARED recipe (_bootPaint
  uses it too). Density IS the count: overlapping halos brighten where
  installations crowd. No gradients, no shadowBlur — ~270 must hold phone
  frames.
- The no-glow reticle law now governs the OPERATIONAL zoom (≥ 1.6) only;
  reticles, chain labels, and the tiny-label ladder are untouched there.
- TAP LAW: a constellation dot is a real door — every world-zoom site rides
  GlobeState._screen and siteHitTest; there is no badge hit pass anymore.
- Proof: harness CONSTELLATION probe (266 dots · ≥2 arcs each · no badges);
  live pixel law — the CONUS patch must outshine an empty-ocean patch
  (measured 50.5 vs 8.9), and a world-zoom tap must select a site.

## v1.17.1 — the constellation at every zoom (owner: "keep the illuminated dots… it still shows the white dots")
- THE GLOW IS THE MARKER, PERIOD: _glowDot paints every unselected site at
  ANY zoom — scaled by the old zb2 growth law (k), HQs ×1.25, guard ×0.85
  brightness. The v1.17.0 world-zoom-only gate lasted one release; the
  owner wanted the light everywhere.
- The GLASS RETICLE is now purely the SELECTION language — it draws on
  chain members only (accent/signal ink). Smoke pins this: the reticle
  fill `rgba(8,7,4,.85)` must appear EXACTLY once in source.
- NAMES IN THE SCHEME: the tiny-label pass inks rgba(245,215,110,.92) —
  the ignited gold — never T.text ice-white (smoke source law). Chain
  labels keep their accent/signal ink (selection language).
- CLS_META colors survive in the legend UI only; on the canvas the class
  distinction is size (HQ) and brightness (guard), not hue.
- Proof pattern: pixel-sample 8 marker centers at zoom 2.6 — all must read
  warm gold (b < r·0.78); ice-white cores fail at b/r ≈ .89.

## v1.17.2 — the illuminated name (owner: "that illuminating font like the dots for the names as well")
- NAMES GLOW LIKE MARKERS: the tiny-label pass draws _glowDot's recipe in
  type — dark ground stroke (legibility on coastlines), then a gold AURA
  (shadowColor rgba(245,215,110,.85), shadowBlur 8) under a hot CREAM core
  (rgba(255,233,170,.95) second fill). Chain labels illuminate the same
  way in their own selection ink (aura pass + crisp pass, hue preserved).
- shadowBlur on TEXT is allowed because the label cap (13–30) bounds it;
  the no-shadowBlur law still binds the DOTS (~270 per frame).
- Smoke pins the recipe: the aura line and the cream-core fill must both
  survive in source.
- PROOF LESSON: my __gLbl rect sampler read the same patch six times
  (wrong field names) and "passed" — a probe whose samples are all
  identical is broken, not lucky. The clipped 3× screenshot was the
  honest check; keep close-up crops in the visual proof kit.

## v1.17.3 — the quiet map (owner: "border lines dimmer for contrast; backfill dimmer; increase zoom")
- LINEWORK RECEDES, LIGHT LEADS: flat-print alphas — coast/US-shore
  .92→.55 · state borders .62→.38 · country borders .36→.22 (glow-mode
  values untouched). The constellation and its names are the brightest
  thing on the sphere by design.
- BACKFILL: --land 17,14,9 → 11,9,6 (ocean #080706/#030302 unchanged —
  land must stay a step lighter than ocean or the continents dissolve).
- RESTING CAMERA: default zoom 1.5 → 1.8 in THREE coupled places —
  GlobeState init, the session-restore clamp (Math.min(v.zoom||1.8,1.8)),
  and the boot fin() startZoom fallback. A future default-zoom change
  moves all three together.
- Live proof: boot must land at 1.8; pixel note — the UT/WY border sample
  point sits next to Hill AFB's glow, so border-level pixel reads there
  are contaminated; judge linework from the screenshot, not that sample.

## v1.18.0 — the rails (owner: "side panel on the right, readily available — I underestimated how often they're needed")
- THE RAIL LAW: navigation is PERMANENT chrome — one vertical glass rail
  pinned to the right edge, mid-height, in BOTH rooms. Map = #navRow
  (UNDO·CLEAR·ZOOM−·ZOOM+·SAVED·LAYERS); Brief = #briefDock
  (Add·Names·Lines·Briefs·Export·Ledger), same panel grammar. Phone
  right:6px, desktop right:18px. body.brief-mode hides #navRow (the brief
  rail owns the edge there).
- COLLAPSE: FAB short-press toggles body.nav-off (map rail only); outside
  taps and ESC no longer close it — the pop-up-ring era (_navSwallow
  setter, outside-pointerdown close) is deleted. _nvSet(true) refreshes
  disabled states and is called at boot, after sat actions, and on mode
  flips. nav-open (the class) is retired.
- LEFT IS CONTENT, RIGHT IS CONTROL: the docked callout keeps the left —
  phone right inset +56px so it never covers the rail; desktop was
  already a 400px left card. #briefStage phone right gutter 6→60px.
- THE DIRECT LINE: elbow() emits vertical-tangent cubics (C px,(py+k) …)
  straight through the empty inter-row band — no boxes live between rows,
  so the direct diagonal cannot cross content. The shared junction rail
  (V…Q…H…Q…V at parentBottom+8) is retired; smoke bans its grammar and
  requires the C builder. colSegs stack spines stay vertical.
- THE REAL FIT: _bfFit's floor 0.62 → 0.30 (the owner's "stuck at 62%"
  WAS the floor clamping wide charts into pan). Fit means fit.
- Probe notes: the smoke chart fixture is a single-child chain → every
  connector is a plain V; C-curve law lives as a SOURCE assert, not a
  render assert. Search-pill brief law (+74) unchanged and still pinned.

## v1.19.0 — the pod & the modes (owner: transport as "their own navigation buttons … accessible and discrete"; "a brand new plan for save and especially the layers sections")
Designed by a 20-agent workflow (6 recon · 4 precedent · 6 competing proposals ·
3 lens-diverse judges · 1 synthesis). The losing proposals' must-graft ideas are
folded in; the judgments are in the run journal.
- THE COLUMN: the right edge is ONE control column with two objects in frequency
  order. #navPod (bottom thumb band) holds ✕ · UNDO · the ZOOM rocker; #navRow
  above it holds the two DOORS, SAVED and LAYERS. Same width, same inset, same
  glass. Measured reach on a 414×896 phone: 94 · 131 · 188 · 261px — all four
  circled controls moved from the HARD band (449-630) into the natural zone.
- QUIET IS OPACITY ON A PLATE, NEVER A TIMER: gold over a lit coastline is
  1.03:1, so the plate never dims. The column rests at .55 (4.71:1, clears
  WCAG 1.4.11) and lifts to 1 on any pointerdown for 1600ms (body.tp-live).
  NO auto-hide — these are the only single-pointer path to zoom OUT.
- THE ROCKER: zoom is ONE fused object (.tp-rock, two .tp-half split by a
  hairline) under one label. Three near-identical circles are indistinguishable
  to a thumb that isn't looking; a miss lands on the other half of the same
  control. Hold 350ms → ×1.06/frame ramp. 40px of ink, 48px of hit (.co-x::after
  idiom); smallest pod pitch 59.5px so no two hit rects touch.
- FIVE TRANSPORT DEFECTS FIXED with the move: a zoom press now cancels a live
  camera tween (the rail's was the only zoom path that didn't); zoom enters the
  undo stack coalesced to one slot per 600ms burst; ✕ clears THEN syncs; the
  disable thresholds were a full step early (1.01/27.9 → 1.001/27.99); tpSync()
  is the ONE refresher and is called from pinch release and _dblZoom too.
- THE GUTTER LAW: --gut = --rail-r + --rail-w + 12px replaces EVERY hand-tuned
  right inset. This closed the live v1.18.0 defect where the z43 rail painted
  over the z40 #dossier (the Saved sheet's delete ✕ was unreachable). Content
  never enters the column — including .bf-toast, now centred on the content.
- MODES ARE THE ORGANISING LAW: every configuration of the map has a NAME.
  BASES 119 · COMMAND 126 · SUPPORT 191 · GUARD 206 · ALL 285, plus a DERIVED
  CUSTOM (inert, never a tile you press). lyKey() matches the off-set exactly.
  BASES is byte-identical to _FAM_DEFAULT_OFF, so the twice-cited owner boot
  directive stops being an undocumented constant and becomes a named choice.
- THE SCOPE READOUT: the LAYERS cell wears .nv-state (mode name over sites
  shown), gold when anything is hidden. The map opened with 166 of 285 sites
  hidden and never said so — that was the single worst defect in the app.
  ONE writer: lySync(). GlobeState._famOff is ASSIGNED in exactly four places
  (_famOffSet, lyMode, clearAll, _camApply) and smoke counts them — a stale
  readout would be worse than no readout, because now it is trusted.
- LAYER STATE DOES NOT PERSIST ACROSS RELOADS. It rides SAVED VIEW RECORDS
  only, so the app still opens on BASES on every device while a saved view is
  the user's unlimited extension of the five built-ins. clearAll() restores the
  default, which makes "✕ clears the map" honest.
- #legendPanel IS RETIRED: it bloomed bottom-LEFT from a right-edge button,
  shared #searchPill's exact anchor at a higher z, was missing from the canvas
  chrome zones, and its own button could never close it (a parse-time tap-away
  hid it and the delegate flipped it straight back). Layers and Saved are two
  tabs of the ONE drawer. renderLegend() survives as a PURE re-render that can
  never force a surface open.
- THE SHELF: _shOpen(tab)/_shRow(kind,rec) replace _svOpenSheet and
  _sbOpenSheet. Storage does NOT merge — two keys, two arrays, two clocks, no
  migration. Kind is interpolated (P='sb'|'sv') so every brief literal survives
  character-for-character. Saves are named at capture (pre-filled, one tap to
  accept), renameable forever, addressed by ID not array index (a board merge
  used to shift indices under a queued tap), pinned (the cap evicts the oldest
  UNPINNED), previewed by a glyph DRAWN from the record's own camera (zero
  stored bytes), and they PRINT THEIR SCOPE. A record without `lay` recalls
  exactly as before and prints "camera only".
- Recall is MAP-ONLY (_camApply room:false) so a brief:true record can never
  land in the empty brief room the v1.12.0 blank-slate law created, and the
  camera is isFinite-guarded and zoom-clamped.
- THE ROOMS READ AS ONE PRODUCT: brief keeps the same column — its dock is the
  doors, its pod is ✕ alone (no camera, no undo stack there). This restores the
  brief room's ✕, unreachable since v1.18.0 hid #navRow there.
- PROBE LESSON: my own MODES probe asserted that toggling hq off BASES yields
  CUSTOM. It yields COMMAND — exactly on a mode plan. The probe was wrong, not
  the code. When a probe fails, first ask whether the assertion is the thing
  that is mistaken.

## v1.20.0 — the slim pod & the integrated doors (owner: "control buttons can be much skinnier … saved and layers should not be side buttons anymore")
- THE POD IS 42px WIDE. The captions were the only thing forcing 60px, and ✕,
  the undo arrow and ± are universal glyphs, so they go: 34px of ink in a 42px
  strip, still 48px of hit each (desktop 44/56). .nv-cell and .nv-lbl retire
  with them, and a smoke assert bans both from ever coming back — this is the
  ONE deliberate exception to the v1.14.0 permanent-micro-label law, and it is
  scoped to the pod alone (every other control still wears its name).
- THE DOORS ARE INTEGRATED, NOT DOCKED. #navRow is deleted. Each door moved to
  the surface where its meaning already lives:
  · LAYERS → #lyChip, a glass status chip in the free TOP-LEFT corner at the
    ledger's exact top offset, so the two corners read as one instrument row
    (LAYERS · BASES 119 on the left, LOCAL/BASE time on the right). The scope
    readout had to be permanent anyway — making it the control costs zero new
    surface. It goes gold whenever anything is hidden, and hides in brief.
  · SAVED → .sp-star, a ★ inside the search pill. "Go back to somewhere"
    belongs where "go somewhere" lives, and since v1.19.0 typing a view's name
    already surfaces it there — the star is just the no-query entrance.
- DOOR STATE SYNCS ON CLOSE: hideDossier() clears aria-expanded and the star's
  lit class and deletes dataset.shTab, so a pane closed by the head ✕ or the
  grip cannot leave its door looking open. (Caught live: the star stayed lit
  after a ✕ close.)
- KNOWN AND ACCEPTED: at dz-half the drawer covers the search pill, so the star
  cannot toggle its own pane shut from there — the head ✕ and the grip are the
  closers, which is the shipped sheet grammar. The chip sits above the drawer
  and toggles normally.

## v1.21.0 — the globe is the layers (owner: hold to save · pod always available · layers embedded in the globe as pop-outs)
- THE GLOBE BUTTON IS THE LAYER CONTROL. A tap fans the five named modes plus a
  More door around it on a 112px arc (156°→24°), each showing its live count;
  picking one applies it and the ring closes behind it — "make selections then
  they are hidden". Escape, an outside press, or a second tap also close it.
  The pop-outs ride #navDock's own origin, so they orbit the button wherever it
  sits. While they are up the search pill YIELDS (opacity 0): the arc's ends
  land in the pill's band, and the ring is a transient choice, not a coexisting
  surface.
- A THREE-SECOND HOLD SAVES THE VIEW. The ring the FAB already carried becomes
  the progress bar, so the gesture explains itself while it happens; body.ly-save
  brightens the button from 12% in, and the save toasts its name. The old
  hold-to-flip-rooms is retired — the mode seg has been the room door since
  v1.14.0, so the hold was free.
- THE LABEL UNDER THE GLOBE IS THE SCOPE READOUT ("BASES · 119"). The button
  that controls the layers says what they are showing. #lyChip retires; the
  ::after CONTROLS/TO MAP content rules retire with it, and lySync() now writes
  the label — which means setMode MUST call lySync or the brief room keeps
  showing a map scope (caught live).
- THE POD NEVER HIDES. body.nav-off is deleted and _nvSet survives only as the
  transport refresher older paths call. Smoke bans both the class and its
  toggle — scoped to `body.nav-off #` and the toggle call, because an unscoped
  ban matched this changelog's own sentence about the retirement.
- The brief room keeps its law: no pop-outs there, the label reads TO MAP, and
  a plain tap still returns to the map.

## v1.22.0 — the repository (owner: rooms must match · layers as checkboxes · one app-wide side panel)
- ONE CONTROL GRAMMAR, BOTH ROOMS. The brief dock IS the map's pod now: same
  42px strip, same right inset, same bottom, same glyph-only cells, ✕ on top
  behind a hairline. Map pod = ✕ · UNDO · ZOOM; brief pod = ✕ · ADD · NAMES ·
  LINES · EXPORT. body.brief-mode hides #navPod entirely — one column, one
  occupant. The .ch-tool/.ch-lbl/.bd-gap caption vocabulary retires with the
  captions, and smoke bans captions from the dock.
- LAYERS ARE CHECKBOXES, NOT CIRCLES. The orbiting .ly-sat satellites are
  retired for #lyPanel: a 200px list in the bottom-right corner, modes as one
  wrapped row of small chips above seven checkbox rows (five classes with
  counts, then Labels and USACE labels). A MODE is one decision, so it closes
  the list behind you; a CHECKBOX is one of several, so the list stays up while
  you work. The panel sits ABOVE the search band (bottom +152) — anchored in
  the corner without crossing the pill.
- THE REPOSITORY IS ONE PANEL, APP-WIDE. The ledger drawer became a three-
  section panel — VIEWS · BRIEFS · RECORDS — reachable from either room by the
  ★ in the search pill (it opens on Briefs in the brief room, Views on the map).
  The two shelves render inside it with the same _shRow anatomy; _shOpen('sv'|
  'bf') survives as the repaint door so every existing rung keeps working.
- SUPERSEDED LAW, DELIBERATELY: v1.8.0 said "no brief ledger — the repository
  is map data only", and a smoke probe enforced it. The owner replaced that
  with "consolidate all the ledger, saved info, saved views … as a full
  repository". The probe now asserts the OPPOSITE and says why. When a probe
  encodes an owner preference, superseding it is a decision to state, not a
  test to quietly delete.
- Storage is unchanged: two arrays, two kv keys, two clocks. Only the surface
  consolidated — "saved at the ID or account level, or a full saved view"
  describes what was already true; v1.22.0 just puts all three in one place.

## v1.23.0 — the quiet list (owner: "super compact layers in bottom left · translucent · do not take up more page than you need to")
- SIZED TO ITS CONTENT, NOT TO A COLUMN: width:max-content capped at
  min(56vw,190px). The panel reserves nothing; it is exactly as wide as its
  longest row and no wider. Measured 183×187 against v1.22.0's 200×277.
- BOTTOM LEFT, the corner nothing else claims — the pod owns bottom right and
  the search band owns the strip between them, so the list stays clear of both
  (bottom +152 still).
- TRANSLUCENT, not a plate: rgba(20,17,10,.58)→rgba(6,5,4,.66) with a .13
  hairline instead of the full glass triple. The globe's meridians read
  through it, which is the point — it is a film over the map, not a panel on
  top of it. The .glass backdrop blur still applies.
- COMPACT METRICS: 22px rows, 10px body type, an 11px checkbox with a 2.8×5.8
  tick, 6.5px mode chips at 3×5 padding. Every row is still a full-width tap
  target, so the shrink costs reach nothing.

## v1.23.1 — one label switch (owner: "why is there a USACE and USACE labels?")
- USACE IS A LAYER, NOT A LABEL SETTING. Its checkbox governs its 52 dots. The
  separate "USACE labels" row was a v0.22.0 leftover from when USACE names
  crowded the map, and it made the list say the same word twice with two
  different meanings — the exact confusion the owner caught.
- GlobeState._usaceOff is DELETED, with its branch in the tiny-label pass. A
  family's names now follow the ONE Labels switch, like every other family.
  Smoke asserts exactly one data-vw (names) and bans the flag in CODE SHAPE
  (see the testing law below — the first cut of that ban matched this very
  changelog entry, and v1.23.1 shipped with a red suite because of it).
- COMPAT: svCapture/svUpdate stop writing lay.u; _camApply ignores it on read,
  so a view saved before v1.23.1 still recalls — it just no longer restores a
  setting that no longer exists. .lg-dep (the "turn the USACE layer on first"
  dependent-row treatment) retires with it.
- The list is down to six rows, 165px tall.

## TESTING LAW — two rules paid for twice
These are not style notes. Each was learned by shipping a red suite, and the
second time the lesson only lived in a session's memory, so it did not survive.
It lives here now.

1. **A negative source assert is scoped to CODE, never to a bare token.** The
   file documents its own history: every retirement gets a changelog sentence
   that names the thing retired. `html.indexOf('_usaceOff')>=0` therefore fires
   on the sentence announcing the deletion — the assert fails precisely because
   the work succeeded. Ban the shapes the identifier can wear as code
   (`/_usaceOff\s*[=;,)\]'"]/`), the way the `body.nav-off` ban was scoped to
   `body.nav-off #` and `classList.toggle('nav-off'`. Then prove the scoped
   assert by re-injecting each regression shape and watching it fire — a
   negative assert that has never fired is not known to work.
2. **The suite runs LAST — after the APP_VERSION bump, the sw.js CACHE bump and
   the changelog entry, not before.** Those three edits are themselves source
   changes, and smoke reads the source as a string. A green run taken before
   the ship ritual is a green run of a bundle that was never shipped. v1.23.1
   passed all five, then took its changelog entry, then committed: the entry
   broke the probe added in the same release. Order is: edit → ship ritual →
   five tools → commit.

## v1.24.0 — the 2026 refresh + the echelon (owner: "most up to date organization names and accuracy of hierarchy chart · improvements to both brief and map · continue to find the best way to present the key information")
- THE TREE IS A CLAIM ABOUT THE PRESENT, AND CLAIMS GO STALE. Everything below
  was verified against the Army's own announcements and AGO 2025-24 before it
  was touched, and two things I *expected* to be wrong turned out to be right —
  CIMT/Cadet Command/Fort Jackson really do sit under USAREC (the Dec 2025
  accessions consolidation), and ARTRANS really is current (SDDC redesignated
  24 Sep 2025). Verify before "fixing"; a confident edit to correct data is the
  most expensive kind of wrong.
- FIXED: III Armored Corps hung off USAWHC; AGO 2025-24 reassigned III Corps to
  USAREUR-AF effective 5 Dec 2025 (with I Corps → USARPAC). Secondary reporting
  contradicts this — one outlet headlined the opposite, and a Jan 2026 article
  still names FORSCOM as its higher HQ months after FORSCOM ceased to exist.
  The general order wins over both.
- FIXED: ARNORTH (inactivated 15 Jul 2026) and ARSOUTH (29 May 2026) were still
  presented as live commands. The headquarters are struck; their 12 standing
  elements (TF-51, the FEMA-region DCEs, JTF-Bravo, JTF-GTMO) survive the merge
  and reparent to USAWHC, which now shows 23 subordinates. Deleting a node the
  owner may have saved into a brief is a real cost — the sanitize path absorbs
  it — but presenting a dissolved command as current is the larger lie.
- FIXED: Futures & Concepts Command was sited at the Austin T2COM HQ; it
  activated at Fort Eustis on 12 Feb 2026, and the SITES row already said so.
  The org row and the site row disagreed and nothing noticed.
- UNRESOLVED, deliberately: whether USAWHC is an ACOM or an ASCC. It replaced
  FORSCOM (an ACOM) and absorbed two ASCCs, and the sources I can reach split.
  It stays under ASCCs, where it was, because guessing an L2 regrouping on
  ambiguous evidence is worse than leaving a defensible placement. Flagged to
  the owner rather than silently decided.
- data/orgs.json is the SOURCE; index.html carries a generated copy. Edit the
  source and regenerate the copy in the same script — never one by hand. Nothing
  checked they agreed until this release, so the page could have drawn a tree
  the lint had never seen.
- THE ECHELON TAG: the card's rail ended on the literal word HERE, which said
  nothing the name directly beneath it did not already say, while _OG_CATS
  filtered the ACOMs/ASCCs/DRUs rungs out of the crumbs as "shells, not
  commands" — so on the 2-crumb cap a deep unit's card could not say whether it
  hung off an ACOM or an ASCC at all. The dead slot now carries that
  classification. It LEADS the rail: trailing it read "I CORPS › 4TH INF DIV ›
  ASCC", which puts the classification below the division it sits above. It is
  a badge, not a link in the chain, and it is styled as one.
- MINIMIZE WHAT THERE IS TO MINIMIZE. setMode adds chart-min every time the
  brief opens (globe is the hero) and body.chart-min hides every child of
  #briefStage except the ⌗ head. With no members the only child IS the empty
  state, so opening an empty brief showed a bare pill over a bare globe and the
  guidance for the first move never reached the screen. The hero law holds the
  moment there is a chart to suppress.
- A PANEL NOBODY CAN SEE NEVER GETS DESIGN-REVIEWED: the empty state had been
  carrying two competing filled-gold primaries. Making it visible is what
  exposed that. Expect the same wherever a surface has been hidden a while.
