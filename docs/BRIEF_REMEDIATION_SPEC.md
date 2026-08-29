# A-ORG-2 — BRIEF Mode & Control Rail Remediation Spec

**Applies to:** A-ORG-2 v1.18.0
**Scope:** BRIEF view layout engine · view architecture · control rail
**Authored:** 2026-08-28 · Phil Case
**Status:** Not yet reconciled against source. See "Before you write code."

---

## Before you write code

This spec was written from two screenshots of v1.18.0 — a mobile MAP view and a desktop BRIEF view. **The author has not seen the source.** Every *what* and *why* below is grounded in observed behavior and is reliable. Every *where* is an inference.

Do a reconnaissance pass first and report back before implementing. Do not start coding from this document alone.

### Recon questions to answer

1. **Rendering layer** — SVG, Canvas, DOM nodes, or WebGL? This determines how labels get measured and whether the three-pass pipeline in §3 applies as written.
2. **Framework** — React, Svelte, vanilla? Where does the BRIEF tree component live?
3. **Layout code** — is there a layout module, or is node placement inline in a render function? Find the exact line that assigns a node's x position.
4. **Data shape** — real nested tree, or a flat list with `level` fields? `d3.hierarchy` needs the former.
5. **Fit** — where is `Fit 30%` computed? What does it currently measure against?
6. **Rail** — one shared component with a mode prop, or two separate components? R-03's fix assumes it can become one.
7. **Dependencies** — is d3 already present? Any layout library?
8. **Tests** — is there a test runner? §6's acceptance criteria assume assertions are possible.

Report findings, flag anywhere this spec's prescription doesn't fit the actual architecture, and propose the adjusted approach. Then implement.

---

## 1. Root cause

Two bugs produce most of what's visible.

**Bug 1 — nodes are positioned before they are measured.** Placement uses a fixed per-level x-step while the node pill's width is content-driven. When a label is wider than the step, siblings overlap. At L3 this collapses the entire row into one illegible smear (`CaliforniaUSA RSELM RSNasASbam…`). The same bug produces the uneven L2 spacing where Regions 2 and 3 touch while Region 4 and ECCSP have gaps.

**Bug 2 — Fit scales to the container, not the content.** The view reports `Fit 30%` and still overflows top and bottom, because the fit factor is derived from viewport dimensions rather than the laid-out content bounding box. It also does not re-run after a level change.

Everything else — the orphan L4 column, missing connector lines, the truncated root, three separate ways to add an org, the clipped `SAVD` rail label — sits on top of these two.

---

## 2. Defect log

Severity: **C** = critical (blocks use) · **H** = high (ship blocker) · **M** = medium (polish).

### BRIEF mode

| ID | Sev | Defect | Fix |
|---|---|---|---|
| B-01 | C | L3 renders as one overlapping smear. Siblings positioned on a fixed x-step; pill width is content-driven and exceeds the step. | Width-aware tidy-tree layout with a measurement pass. §3. |
| B-02 | C | No connector lines between levels. Hierarchy implied by vertical position only, meaningless once rows misalign. | Edge layer beneath the node layer — orthogonal elbows, 1px hairline, active branch highlighted. §3.4. |
| B-03 | C | L4 renders as an orphan left-aligned column attached to nothing; its own rows overlap internally. | L4 belongs to one L3 parent. Focus+context: expand only the selected branch, collapse siblings to a count chip. §3.3. |
| B-04 | C | Fit reports 30% and content still overflows. Fit scales to container, not content bbox; does not re-run on level change. | Compute bbox post-layout. §3.2. |
| B-05 | H | Root truncated to `National Guard Bu…` and clipped at top by the toolbar. | Root gets `MAX_W >= 320` and is never truncated. Canvas top padding clears toolbar height. |
| B-06 | H | BRIEF is a floating panel over a live, fully-rendered map. Modes are stacked, not separate; map stays interactive underneath. | BRIEF gets its own opaque canvas. Map unmounted, or 6% opacity static non-interactive backdrop toggled from Display. |
| B-07 | H | Three entry points for one action: floating `Add organization`, floating `New group`, rail `ADD`, plus `Search orgs + US states to add`. | Collapse to one. Rail ADD opens Organization / Group. Delete both floating mid-canvas buttons. |
| B-08 | H | Duplicate zoom: toolbar `ZOOM − / +` and rail `ZOOM − / ZOOM`. | Rail owns zoom in both modes. Toolbar keeps the scale readout only, click-to-fit. |
| B-09 | H | L2 spacing uneven — distribution is index-based, not width-based. | Same separation function as B-01. No per-level special-casing. |
| B-10 | M | Level gutter labels L1–L3 clipped at the panel's left edge at ~6px. | Fixed 40px sticky left gutter inside the canvas; faint alternating band per level. |
| B-11 | M | `HOLD A LEVEL TO STACK IT` — hidden gesture documented by static microcopy, no affordance on the chips. | Stack indicator glyph on each L-chip, stacked-state badge, tooltip on first hover. Retire the microcopy. |
| B-12 | M | L4 chip carries a caret; L1–L3 do not. Inconsistent control type in one segmented group. | All four identical. Caret only if every chip opens a menu. |
| B-13 | M | Pill colors (cyan / tan / orange) and map markers (cyan star, pink star, reticle) carry meaning with no key. | Legend in Display group. Glyph + label, never color alone. |

### Control rail & global chrome

| ID | Sev | Defect | Fix |
|---|---|---|---|
| R-01 | C | Rail container runs off the right screen edge. `SAVED` renders as `SAVD` — a clip, not an abbreviation. | Anchor `right: max(16px, env(safe-area-inset-right) + 8px)`. Fixed 64px item width. Labels never truncate. §5. |
| R-02 | C | `CLEAR` is destructive, unconfirmed, and one tap below `UNDO`. | Divider above, destructive styling, confirm sheet or 600ms press-and-hold ring. Never adjacent to UNDO. |
| R-03 | C | Rail vocabulary swaps wholesale on mode switch. MAP: UNDO/CLEAR/ZOOM/SAVED/LAYERS. BRIEF: ADD/NAMES/LINES/BRIEFS/EXPORT/LEDGER. Zero shared items, zero positional anchors — the rail is relearned every switch. | One persistent rail. Mode *disables* items at 40% opacity with a tooltip; never removes or reorders. §5. |
| R-04 | H | Rail and the LOCAL/BASE time card occupy the same top-right column; rail sits under the card and over the LAYERS panel. Z-order is incidental. | Dock the time card into the top toolbar row. Declare an explicit z-scale. §4. |
| R-05 | H | Zoom labels inconsistent — `ZOOM −` vs bare `ZOOM` for zoom-in. | `ZOOM −` / `ZOOM +` / `FIT`. |
| R-06 | H | Six actions of three classes share one undifferentiated stack: destructive (CLEAR), navigation (ZOOM), view state (SAVED, LAYERS). | Group with hairline dividers: Create · Edit · View · Display · Output. |
| R-07 | M | Disabled classes (HQ, Depot, USACE, Guard) use strikethrough, which reads as deleted rather than toggled off. | Dim to 45% with a hollow swatch. Reserve strikethrough for removal. |
| R-08 | M | `CONTROLS` is a floating bottom-center globe disconnected from every other control; version string occluded by the MAP/BRIEF pill on mobile. | Fold CONTROLS into the rail or toolbar. Move version beside the title. |
| R-09 | M | Persistent bottom search bar overlays canvas content in BRIEF while a ⌘K affordance already exists. | Keep the ⌘K palette; drop the persistent bar in BRIEF. |

---

## 3. Layout engine — the primary fix

B-01, B-03, B-04 and B-09 are one bug. Replace single-pass placement with a three-pass pipeline. Everything in §4 depends on this landing first.

### 3.1 Pass 1 — Measure

Measure every label against the exact font stack, size and weight in use (`canvas.measureText`, or an off-screen span). Derive the box; do not assume it.

```js
// per node, before layout
const textW = ctx.measureText(node.label).width;
node.w = clamp(textW + 2 * PAD_X, MIN_W, MAX_W);   // MIN_W 88, MAX_W 320
node.h = ROW_H;                                     // 26
node.truncated = (textW + 2 * PAD_X) > MAX_W;       // -> ellipsis + title attr
```

Run the measurement pass **again** after `document.fonts.ready` resolves. A layout computed against fallback metrics drifts once the real face loads, and that drift alone reintroduces collisions.

### 3.2 Pass 2 — Position, Pass 3 — Fit

Tidy-tree with a width-aware separation function. Stock `d3.tree` separation returns a multiple of a uniform node size and cannot express variable widths — use `d3-flextree` (accepts per-node dimensions), or implement Reingold–Tilford with:

```js
// gap measured between box EDGES, not centers
separation(a, b) = (a.w + b.w) / 2 +
                   (a.parent === b.parent ? SIB_GAP : SUBTREE_GAP);
// SIB_GAP 14 · SUBTREE_GAP 34
```

Fit is computed from laid-out content, never the container:

```js
bbox = {
  x0: min(n.x - n.w/2), x1: max(n.x + n.w/2),
  y0: min(n.y - n.h/2), y1: max(n.y + n.h/2)
};
scale = min(cw / (bbox.w + 2*PAD), ch / (bbox.h + 2*PAD));
scale = clamp(scale, 0.10, 4.0);
tx = cw/2 - scale * (bbox.x0 + bbox.w/2);
ty = ch/2 - scale * (bbox.y0 + bbox.h/2);
```

**Re-run fit on every one of:** level change (L1–L4), expand/collapse, node add/remove, container resize (`ResizeObserver`), font load. Missing the resize and font-load triggers is what leaves the view stale after first paint.

### 3.3 Orientation — why L4 still fails after the above

With 32 orgs and the full state roster, a top-down tidy tree at L4 is wider than any scale that keeps 10px text legible. Fixing collisions alone yields a correct, still-unreadable diagram.

- **L1–L3** — top-down tidy tree. Fits comfortably; keep it.
- **L4** — left-to-right tidy tree scoped to the selected L3 branch only. Depth on x, breadth on y; leaves stack vertically and scroll naturally.
- **Unselected L3 branches** — collapse to a count chip (`REGION 2 — RSN · 14`). Click to focus. This is the actual fix for B-03.
- **Guard** — if `scale < 0.55` after fit, force left-to-right regardless of level and surface a "focus a branch" hint.

### 3.4 Edges

Render an edge layer beneath the node layer. Orthogonal elbow paths (down from parent, across, down into child), 1px hairline, active branch at the accent color at 1.5px. **Edges draw from the same laid-out coordinates as the nodes — never from a second position source.**

---

## 4. View architecture

| Element | Today | Target |
|---|---|---|
| Canvas | Translucent panel; map fully rendered and interactive behind | Opaque own canvas. Map unmounted, or 6% static non-interactive backdrop toggled from Display |
| Add organization | Floats mid-canvas over the map | Deleted. Rail `ADD` → Organization / Group |
| New group | Floats mid-canvas over the map | Deleted — same menu |
| Search bar | Persistent bottom-center bar over content | ⌘K command palette overlay only |
| Time card | Free-floating top-right, collides with rail | Docked into the top toolbar row |
| Zoom | Toolbar and rail, both live | Rail owns it. Toolbar shows readout, click-to-fit |
| Level gutter | L1–L3 labels clipped at panel edge | Fixed 40px sticky gutter, alternating level bands |

**Declare the z-scale explicitly:** map 0 · edges 10 · nodes 20 · panels 30 · rail 40 · modals 50. Every current overlap defect (R-04, B-05, B-06) traces to incidental stacking order rather than a declared scale.

---

## 5. Unified control rail

One rail instance, identical geometry and ordering in both modes. Mode changes what is **enabled**, never what is present or where it sits. That single rule removes the relearn cost in R-03 and gives every item a stable position.

| Group | Items (fixed order) | MAP | BRIEF |
|---|---|---|---|
| Create | ADD | Place marker | Organization / Group |
| Edit | UNDO · REDO · *divider* · CLEAR | All active | All active |
| View | ZOOM − · ZOOM + · FIT | Active | Active |
| Display | LAYERS · NAMES · LINES · LEGEND | LINES disabled | LAYERS disabled |
| Output | SAVED · BRIEFS · EXPORT · LEDGER | All active | All active |

### Geometry — non-negotiable

- Anchor: `right: max(16px, env(safe-area-inset-right) + 8px)`, vertically centered.
- Item width fixed at 64px. Label 10px, uppercase, `letter-spacing: .08em`, `white-space: nowrap`, centered, **never truncated**. If a word does not fit at 64px, choose a shorter word — do not clip it. `SAVED` fits; `SAVD` is R-01.
- `max-height: calc(100vh - 160px)` with internal scroll and top/bottom fade masks. The rail must never extend past the viewport.
- Disabled state: 40% opacity, pointer-events retained for tooltip, no layout shift.
- Group dividers: 1px hairline, 12px vertical padding either side.

### CLEAR

Destructive, currently unconfirmed, one tap below UNDO. Move to the foot of the Edit group behind a divider, style it destructive, and gate it — confirm sheet ("Clear all annotations? This cannot be undone.") or 600ms press-and-hold with a progress ring. Touch targets in that rail are ~44px on a phone; a mis-tap costs the whole session's work.

---

## 6. Build order & acceptance

| Phase | Work | Gate |
|---|---|---|
| **P0** | Measure → layout → fit pipeline (B-01, B-04, B-09) · edge layer (B-02) · rail clipping (R-01) · CLEAR confirm (R-02) · persistent rail model (R-03) | Blocks release. No usable BRIEF view until this lands. |
| **P1** | BRIEF as own view (B-06) · dock floating chrome (B-07, R-04, R-09) · collapse duplicate zoom (B-08, R-05) · L4 focus+context (B-03) · root truncation (B-05) · rail grouping (R-06) | Ship-quality. |
| **P2** | Level gutter (B-10) · stack affordance (B-11) · chip consistency (B-12) · legend (B-13) · disabled-state styling (R-07) · CONTROLS + version placement (R-08) | Polish. |

### Acceptance criteria — assert these, don't eyeball them

1. At L4 with all 32 orgs expanded, **zero** node-box intersections within a level. Assert programmatically over the laid-out geometry.
2. Every label either fits its box or is ellipsized with the full string in a tooltip. No clipped glyphs anywhere.
3. Fit places the entire content bbox inside the canvas with ≥24px margin, at every level, verified at 1280×720, 1920×1080 and 2560×1440.
4. Root node never truncated at any level or scale.
5. Every rail label renders in full at every breakpoint; the rail never extends past the viewport edge.
6. Switching MAP ↔ BRIEF changes zero rail item positions.
7. CLEAR cannot fire from a single uninterrupted tap.
8. Re-running fit after a font load, a resize, and a level change all produce the same scale for the same content.

---

## 7. Constraints

- **Do not restyle the app.** A-ORG-2's dark/gold aesthetic is intentional and stays. This spec changes layout, structure and control model only.
- **Do not patch the smear by shrinking the font or lowering the fit floor.** Both make the screenshot look better and leave the root cause — placing a node before measuring it — fully in place, to resurface the moment an org name gets longer.
- **Do not fix defects outside the logged set** without flagging them first. If recon surfaces something worse, report it rather than expanding scope silently.
- Preserve existing data and saved state. No migrations as part of P0.
