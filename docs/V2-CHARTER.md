# A-ORG-2 — VERSION 2 CHARTER

Owner directive (16 September 2026): *"Version 0 was getting everything
together. Version 1 was bringing all components together visually. Version 2
should focus on a professional application that will bring value to multiple
users vs a custom app for an individual."*

This is the program document: what V2 means, the four pillars the owner named,
the recommendations behind each, and the rulings still owed. `CLAUDE.md`
remains the law of record; this file is the map of intent.

---

## What "professional, multi-user" means here

Everything in V0/V1 optimized for one operator who knows the app's habits. A
professional tool for many users holds itself to four different standards:

1. **Predictability** — the same action always answers the same way. No
   behavior that depends on invisible state. (Pillar 1 is exactly this.)
2. **Throughput** — a new user with 50 records to enter must not fight the UI.
   Entry is keyboard-first, batchable, and correctable. (Pillar 2.)
3. **The brief is the product** — nothing else out there does it; every V2
   release should leave it sharper. (Pillar 3.)
4. **The work must leave the app** — value that cannot be handed to a
   colleague in a format they already live in (PowerPoint, PDF, Excel) is
   value trapped. Exports are document-native, not screenshots. (Pillar 4.)

Standing laws carry over unchanged: single file, no build step, phone-first
parity, zero foreign code at boot, tier-color semantics, never change org
`id`s, the ship ritual, suite-runs-last.

---

## Pillar 1 — Map selection: the right information, logically

**Owner:** "when in map view and selecting a base, we need to figure out the
right information to display logically. Sometimes it will randomly switch from
base to a specific command."

**Diagnosis (v2.0.0):** the flip was never random. v0.18.0's drill-down
silently remapped a dot tap to the *child org* whenever the tapped dot sat
inside the active selection's painted web (`_selKidOrg`), so identical taps
answered differently depending on invisible prior-selection state.

**The contract, shipped in v2.0.0:**
- A dot tap **always selects the installation**. The base speaks: name, then
  *state · senior unit* in the subtitle, then Units / Connect / Details.
- Descending into a command is **always an explicit, labeled act**: the Units
  picker, the Connect stepper, the rail chips — and the new **chain door**
  (arriving from a painted web, the base card offers
  "*parent* chain › *child org*" as one labeled tap; it lives exactly one
  selection, so it never goes stale).

**Later in V2 (not yet scheduled):** garrison/host line on the base card once
the data model carries it; tappable arc labels as a third explicit descent
path.

## Pillar 2 — Data input and tracking at scale

**Owner:** "Need to figure out how we want to move at scale when creating
records on bases/organizations. Fluidity of data entry and ability to display
or send to other references."

**What exists:** per-site records (People / Specs / Notes / Links) in
IndexedDB, an optional Supabase board behind a manual Connect, JSON backup and
restore.

**Recommendation (needs the owner's ruling — this is V2's biggest fork):**

- **RULING A — the data layer.** For true multi-user value, Supabase graduates
  from "optional backup board" to **the shared workspace**: records live in a
  team space, IndexedDB becomes the offline cache, and a viewer/editor split
  keeps a briefing audience read-only. The alternative — staying local-first
  with file exchange — keeps zero-infrastructure simplicity but caps V2 at
  "many separate users," never "users working together." Recommendation:
  **shared workspace**, kept behind the same manual-Connect boot law.
- **The intake surface** (no ruling needed, will ship regardless): a
  keyboard-first quick-add — type-ahead over bases+orgs, pick a record type,
  enter, next — plus **bulk paste**: TSV/CSV rows pasted from a spreadsheet
  land as records with a preview-before-commit table. A recent-entries tape
  makes the last ten entries one tap to correct.
- **Records reaching other references:** every record set rides the pillar-4
  exports (roster XLSX, PDF annex), and site/org deep links let one user hand
  another an exact card.

## Pillar 3 — Brief mode: the differentiator

**Owner:** easier navigation · bulk add and bulk color for orgs and
subordinates · dynamic display on the globe while navigating the hierarchy ·
full-screen globe with a small hierarchy in the corner · dynamic linking of
organizations on the globe · draggable objects.

**Already shipped (v1.29–v1.30):** the back spine + podium + Present stage;
"Select all N direct subordinates"; cascade color (a swatch paints the node
plus its brief descendants).

**The V2 brief sequence (recommended order — each its own release):**

1. **v2.1.0 THE STAGE MIRROR** — full-screen globe as the brief's second
   stage: the chart shrinks to a corner miniature (tap to swap stages), the
   globe paints the brief's own web live — chart focus moves, globe follows;
   brief edges render as arcs between the objects' real locations (the
   "dynamic linking"). One release because these are one feature: the globe
   IS the dynamic display.
2. **v2.2.0 THE BRANCH ADD** — add an org *plus its whole subtree* in one act,
   with a preview count ("Add 4th ID + 23 subordinates") and a depth cap so a
   fat-finger on USAWHC cannot flood the chart.
3. **v2.3.0 THE HAND** — drag chart boxes: reorder among siblings, drop onto a
   new parent to re-chain (FLIP animation already in place from v1.10.0);
   touch + pointer both, with a long-press arm on phones so scrolling stays
   scrolling.

## Pillar 4 — Export and share: document-native, not screenshots

**Owner:** "advise on the best formats… Don't need to map it identically if
that doesn't show the information in the best way. Professional organized
document structures, charts, overview briefs."

**Recommendation — three formats, in this order:**

1. **PPTX (first — the Army's lingua franca).** A brief exports as a deck:
   title slide (brief name, date, classification-style banner), the org chart
   as **native, editable PowerPoint shapes** (tier colors preserved as fills),
   one slide per focused branch, a map-snapshot slide. Editable-shapes is the
   whole point: the recipient reworks it in their own deck instead of
   screenshotting ours.
2. **XLSX roster (second — feeds every other system).** Sheets: Organizations
   (echelon, parent, location), Installations, Records. Plain tables with a
   header row — the format staff systems and mail merges actually ingest.
3. **PDF command brief (third — polish of what exists).** Cover, chart page,
   roster table, records annex; the current print dossier grows into it.

PNG stays for quick sharing; JSON stays as the interchange/backup format.

**Implementation note (boot law):** PPTX and XLSX are ZIP+XML. Recommendation
is hand-rolled minimal OOXML in-app (shapes + text + tables need no library),
keeping zero-foreign-code intact. If a library ever becomes worth it, it loads
on the export tap only — the Supabase pattern — with the owner's sanction.

---

## Sequence and status

| Release | Pillar | Content | Status |
|---|---|---|---|
| v2.0.0 | 1 | THE SELECTION CONTRACT | **shipped** |
| v2.1.0 | 3 | THE STAGE MIRROR (globe-first brief + live links) | **shipped** |
| v2.2.0 | 3 | THE BRANCH ADD (whole-subtree, previewed) | next build |
| v2.3.0 | 3 | THE HAND (drag to reorder / re-chain) | queued |
| v2.4.0 | 4 | PPTX deck export | after ruling on format order |
| v2.5.0 | 4 | XLSX roster | queued |
| v2.6.0 | 2 | Intake surface + bulk paste | queued |
| v2.7.0 | 2 | Shared workspace (Supabase) | **blocked on RULING A** |

## Rulings owed by the owner

1. **RULING A — data layer:** shared Supabase workspace (recommended) vs
   local-first with file exchange. Decides v2.7.0.
2. **RULING B — export order:** PPTX → XLSX → PDF as recommended, or reorder.
3. **RULING C — brief sequence:** the v2.1→v2.3 order above, or reprioritize.

*Maintained alongside CLAUDE.md; update the table as releases land.*
