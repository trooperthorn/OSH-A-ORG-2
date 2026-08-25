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
