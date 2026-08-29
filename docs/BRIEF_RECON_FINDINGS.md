# BRIEF Mode Remediation — Reconnaissance Findings & Resolution Plan

**Session:** recon only, no implementation code · 2026-08-29
**Target:** index.html v1.18.0 (9,146 lines, 819 KB)
**Companion:** `BRIEF_REMEDIATION_SPEC.md` (screenshot-derived), `CLAUDE_CODE_HANDOFF.md`
**Method:** source read + live Chromium probe driving the real app

---

## 1. Headline: the smear is not an overlap bug

A 79-node / four-level brief driven in a real browser returns **zero** intra-level box
intersections. Zero at 17 nodes too. The layout engine already measures before it places.

What the screenshots show is a **correct layout rendered at 30% scale** — 10px type
becomes 3px, and the 1.4px connector stroke becomes 0.42px. Reproduced from a clean build.

### The chain, proven live

| Step | State | zoom | Label |
|---|---|---|---|
| 1 | brief opened, `chart-min` ON | `wrapCW=0`, `treeSW=0` | **0.3** → "Fit 30%" |
| 2 | user taps ⌗ to expand | `wrapCW=852`, `treeSW=1830` | **0.3** (stale) |
| 3 | any re-render while expanded | `wrapCW=852`, `treeSW=1830` | **0.463** → "Fit 46%" |

Same content, same viewport. The 30% was the collapsed-measure floor.

`setMode` adds `chart-min` and *then* renders (`index.html:4811-4812`). CSS `:570` puts
`.bf-wrap` at `display:none`, so `_bfFit` reads `clientWidth 0`; the `||1` fallbacks
(`:5180`) turn that into 1px; `(1-4)/1 = -3` clamps to the 0.30 floor (`:5184`). The ⌗
expand handler only toggles a body class (`:6827`) — it never re-fits.

A **second, independent** path to "Fit 30%" is the floor doing its job on genuinely wide
content: 79 nodes is an 11,609px tree against an 852px pane. An honest fit is 0.073 —
0.73px type. See §4.

---

## 2. Corrections to the spec

The spec's observations are accurate. Its two stated root causes are not.

| Spec claim | Verdict | Source |
|---|---|---|
| Bug 1: "nodes are positioned before they are measured; fixed per-level x-step" | **Refuted** | `boxW()` measures on canvas `:4917-4921`; `subW()` sums widths + 28px gap `:4923-4931`; `place()` positions from the sums `:4937-4959`. No fixed x-step — `PITCH`/`SPITCH` `:4908` are *vertical*. |
| Bug 2: "fit scales to the container, not the content" | **Refuted** | Denominator is `tree.scrollWidth` — content `:5180`. |
| Bug 2: "does not re-run after a level change" | **Refuted** | `data-bfdepth` → `bfDepth()` → `renderBrief()` → `_bfFit()` — `:6634 → :7505 → :5044`. |
| B-02: "no connector lines between levels" | **Refuted** | `elbow()` + SVG net `:4982-5001`, drawn unconditionally. The dock LINES toggle governs *globe arcs* `:3633`, not the chart. |
| B-08: "duplicate zoom" | **Refuted** | Rail zoom = globe camera `:1381,1383`; head zoom = chart scale `:4886-4890`. `body.brief-mode #navRow{display:none}` `:522` — never co-visible. |
| B-12: "L4 chip carries a caret, L1-L3 do not" | **Refuted** | Caret marks the *active* cell: `'L'+n+(dep===n?' ⌄':'')` `:4883`. |
| R-02: "CLEAR is destructive, a mis-tap costs the session's work" | **Refuted** | `clearAll()` clears view state only and toasts "your diagram is kept" `:5326`. Standing law CLAUDE.md v0.32.2. **Strike from P0.** |
| R-04: "rail sits under the time card, z-order incidental" | **Refuted** | `#timeLedger` `z-index:10` top-right `:880-884`; rail `z-index:43` mid-height `:511`. Explicit scale, no collision. Describes pre-v1.18.0 geometry. |
| R-05: "bare ZOOM for zoom-in" | **Refuted** | Both authored in full: `ZOOM −` `:1381`, `ZOOM +` `:1383`. Same legibility issue as R-01 — one defect, not two. |
| B-05: "root truncated, needs MAX_W ≥ 320" | **Misdiagnosed** | Truncation is real; cause is `_bfAbbr`: `short.length>18 ? short.slice(0,17)+'…'` `:3425`. Not a CSS clip. 57 of 79 labels affected. |
| B-06: "BRIEF floats over a live map" | **By design** | Owner correction, CLAUDE.md v0.7.0: "the brief is built ON the globe." |
| R-01: "rail runs off the right edge; SAVED clips to SAVD" | **Misdiagnosed** | Markup is `SAVED` `:1385`; labels are `nowrap` with no overflow/max-width `:494`; rail cannot exceed viewport at `right:6px`. Far likelier that **6.5px type is illegible**. Missing `env(safe-area-inset-right)` is real and worth fixing regardless. |

**One prescription to lift verbatim:** §3.1's "re-measure after `document.fonts.ready`".
`document.fonts` appears nowhere in the repo. It is a genuine gap.

---

## 3. Architecture answers (the eight recon questions)

1. **Rendering** — globe is 2D canvas; chart is **DOM + one inline SVG**. Boxes are
   absolutely-positioned divs `:5019`; connectors one `<svg class="bf-net">` `:4988-4999`;
   labels absolute spans `:4979`. Labels already measured off-DOM via `window.__bfMeasCv` `:4914`.
2. **Framework** — none, by law (non-negotiable #1). The chart is one function,
   `renderBrief()` `:4840-5051`, emitting an HTML string to `innerHTML` `:5043`.
3. **Layout** — inline, no module. Position assigned by `reg()` `:4933`; x decided at
   `:4958` (parent = midpoint of first/last child centres) and `:4951` (leaf).
   **The measured width is never applied to the box** — no `width` in the inline style or
   in `.bf-box` CSS `:691-699`. Measured divergence: mean **+0.71px** desktop / +0.78px
   phone, max +2px, from `letter-spacing:.01em` `:703` which `measureText` does not model.
   Caused zero overlaps at both scales tested.
4. **Data shape** — **flat with parent pointers**. `BRIEF={nodes:[],…}` `:7252`, node `{k,n,p,t,r,…}`.
   `_briefChainMap()` `:3476` returns `{nodes:{}, order:[]}`, `lvl` derived by walking `p`.
   Children recovered by filter `:4909`. `d3.hierarchy` would need `stratify` — moot, see 7.
5. **Fit** — `_bfFit()` `:5174-5190`, one line `:5184`. Container width ÷ content width; the
   `-4` cancels `.bf-wrap`'s 2px side padding `:683`. Height never read. **One call site** `:5044`.
   No `ResizeObserver`, no `document.fonts`, no `orientationchange` anywhere in the repo.
6. **Rail — TWO components.** `#navRow` `:1376-1387` (`.nv-cell`/`.nv-sat`/`.nv-lbl`, uppercase,
   disabled via `_nvSet`) and `#briefDock` `:1407-1416` (`.ch-tool`/`.od-ico`/`.ch-lbl`, title
   case, mirrored via `_bdSync` `:5052`). Zero shared items. Swapped by CSS `:522`.
   Both `right:6px`/`18px`, `top:50%` — **neither uses `env(safe-area-inset-right)`**.
7. **Dependencies — zero, and d3 cannot ship.** No d3, no layout lib, no `package.json`.
   One CDN URL permitted (Supabase, lazily, on manual Connect), enforced by non-negotiable
   #3 + a dead-lint allowlist + a smoke assert that fails the build. Inlining is bounded by
   the size gate: **819 KB / 900 KB = 91.0%, 80.9 KB headroom**; dead-lint warns past 90%.
   Hand-rolled algorithms over libraries is the established habit (`_topoInteriorMesh`, `_shoreHarvest`).
8. **Tests — five node harnesses in CI, none can assert geometry.** `smoke_runtime`'s stub
   returns `null` from `querySelector` and empty from `querySelectorAll`
   (`tools/smoke_runtime.js:83`), a constant 800×600 from every `getBoundingClientRect` (`:86`),
   constant `offsetWidth`/`clientWidth` 800 (`:89`), and has **no `scrollWidth`**. Under the
   harness `_bfFit` computes `(800-4)/1 → 1.0` every run and prints "Fit".
   **The suite is structurally incapable of catching this bug class** — which is why it shipped.
   Playwright 1.56.1 + Chromium are already installed (`/opt/node22/lib/node_modules`,
   `/opt/pw-browsers/chromium-1194`); the probe used here was stood up in ~15 minutes.

---

## 4. The readability ceiling — the number the plan must be built on

Derived from the app's own constants, pane widths measured live (desktop 852px, phone 312px):

| | 10-char labels | 18-char labels |
|---|---|---|
| **desktop, text ≥7px** | 10 siblings | 7 siblings |
| **phone, text ≥7px** | 3 siblings | 2 siblings |

A top-down row holds about **seven readable siblings on desktop, two or three on a phone**.
The observed tree was 11,609px against an 852px pane. No fit policy, floor, or font tweak
changes this — it is arithmetic. **§3.3 of the spec (orientation + focus/context) is the one
part of its prescription that survives contact with the code, and it is the real work.**

---

## 5. Resolution plan

Ordered by evidence. Each numbered item is a release (ship ritual applies: APP_VERSION ↔
sw.js CACHE ↔ changelog entry move together, lint-enforced).

### R1 — Make the fit measure something real
- Guard `_bfFit` against a zero/hidden container instead of letting `||1` manufacture a 30%
  (`:5180`). Bail early rather than writing a bogus zoom.
- Re-fit on expand: the `data-chmin` handler `:6827` is the missing trigger.
- Add the height term to `:5184` (`min` of both axes).
- Add a `ResizeObserver` on `.bf-wrap` and a `document.fonts.ready` re-fit + re-measure.
- **Keep CSS `zoom`.** The v0.25.0 law is deliberate ("zoom reflows, so the wrap scrolls
  honestly"); §3.2's `tx/ty` transform would fight it.
- **Do not touch `_bfCenter`.** Verified live: `scrollWidth` is unzoomed layout px while
  `getBoundingClientRect().width` reflects zoom — its multiply-by-zoom is correct.
- Closes B-04; B-02 and B-10 largely fall out with it. ~30 lines.

### R2 — Stop truncating at 18 characters
- Raise/bypass the cap **at the chart call site** `:4918`, not inside `_bfAbbr` `:3419`,
  which the globe label pass shares and where the v1.0.0 stepper law already carves an exception.
- Closes B-05. ~5 lines.

### R3 — Orientation and focus + context (the real work, own session)
- Left-to-right tidy tree for deep levels; unselected branches collapse to count chips.
- Acceptance target is the **ceiling table in §4**, not "no collisions" — collisions were
  never the problem.
- Addresses B-01, B-03, B-09 as observed.

### R4 — Rail: two small fixes now, unification deferred
- Add `env(safe-area-inset-right)` to `#navRow` `:512` and `#briefDock` `:609`.
- Raise `.nv-lbl` from 6.5px `:494` (7px desktop `:526`). Closes R-01 **and** R-05 together.
- **Drop R-02** — CLEAR is not destructive.
- R-03's one-rail model is a genuine rebuild of two independent components with separate
  state models. It is a design decision with real cost, not a P0 bug fix — **advise, decide,
  then schedule** (CLAUDE.md v0.33.1 standing law #4).

### R5 — Stand up the browser probe FIRST
- Commit a Playwright probe asserting: fit percentage, effective type size, intra-level box
  geometry, and rail label legibility, at 390×844 and 1440×900.
- Required by CLAUDE.md v0.33.1 standing law #3: "every fix ships its test."

### R6 — Polish (unchanged severity)
- B-07 collapse three add-doors to one. **Note:** deleting `.bf-foot` markup `:5039-5040`
  requires deleting its CSS `:802-806` — dead-lint fails the build on any styled-but-unapplied class.
- B-11 stack affordance — and note the hint is **desktop-only** `:584`; on phone the 480ms
  hold gesture `:7476` has no affordance at all.
- B-13 legend for brief tier colours + star kinds (map-class legend exists, `renderLegend` `:2899`).
- R-06 rail grouping; `.nv-side{display:contents}` `:521` currently erases the grouping visually.
- R-07 replace `line-through` `:988` with a dim + hollow swatch.
- R-08 `#verTag` `top:37px` `:303` vs `#modeSeg` `safe+48/50` `:311,321` — ~13px clearance;
  needs a device check.
- R-09 the brief search-pill position is a v1.16.3 owner decision `:617` — raise, don't just do.

---

## 6. Constraints any implementer must respect

- **dead-lint** fails on: any CSS class styled but never applied; any `function` with zero
  call sites; index.html ≥ 900 KB.
- **smoke_runtime** asserts the chart is `bf-tree`/`bf-box`/`bf-net`, that `ch-node` and
  `bf-grprow` never return, that `data-bfdepth` precedes `bf-tree`, and that no
  `dashed var(--bfrg` appears.
- **Ship ritual** — APP_VERSION ↔ sw.js CACHE ↔ changelog, lint-enforced.
- **Tier colours are semantics** (non-negotiable #6): L1 white · L2 cools · L3 warms ·
  L4 roses, no green on brief data.
- **Dark/gold stays.** Layout, structure and control model only.

---

## 7. Not verified

- **The owner's actual device.** All measurements are headless Chromium on Linux.
  R-01's "SAVD" and R-08's overlap are font-rendering questions needing a real phone.
- **B-03's internal L4 overlap.** The stacked-column layout reproduces; rows overlapping
  *inside* it does not. If `BRIEF.vert` was set for the screenshot, the "orphan column" is
  the stack feature working.
- **Whether the screenshots are HEAD.** `APP_VERSION` is `v1.18.0` `:1756`, matching — but
  CLAUDE.md v1.33.1 records a prior review made against a stale service-worker build.
- **Parent-drift at real scale.** `place()`'s parent `cx` is the midpoint of child *centres*
  `:4958`, not of its allocated slot: 0.88% of 60,000 randomised trees overlap, worst 8.5px.
  Real, minor, never observed on live org data.
