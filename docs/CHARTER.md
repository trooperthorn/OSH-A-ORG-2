# A-ORG-2 — Program Charter (approved 19 Aug 2026)

Owner decisions: D1 build approved · D2 new repo (PC444413/A-ORG-2) · D3 theme picked
from live mockups at M1 gate · D4 corner clocks only, time console retired.

## §1 Intent
Three jobs, one brain: find any base (global search) · parent-child lines only ·
brief → datastore → one-tap PDF. Single-brain law: one selection model, one search,
one drawer, one Globe ⇄ Brief toggle.

## §2 Scope contract
IN: full-bleed globe · search (base+unit) · parent-child arcs · sites = {base, unit} ·
brief mode (tiers L1-L4, annotations, share) · org datastore (people/notes/equipment/
diagrams, IndexedDB, JSON backup) · native PDF export · PWA offline · diagnostics ·
harness suite.
OUT (returns only with written owner sign-off): 587-node hierarchy browser · formations/
rank reference · cross-org link web · acquisition portfolios · time console · workspace
section sprawl · legacy dashboard/digest/glossary.

## §3-5 Pillars
- Map layer: data/sites.json — id, base, unit, lat, lon, grp, parent. Parent pointer IS
  the link model. Seeded from A-ORG-1 v22.27.1 (276 sites), SME-verified.
- Datastore (M2): IndexedDB, schema-versioned, people/notes/equipment/diagrams,
  one-tap JSON backup/restore. Sync optional + lazy, never at boot.
- Brief 2.0 (M3): ported tier grammar + datastore embeds + diagram annexes ("living
  briefs" — export always current).
- PDF engine (M4): in-house pure-JS vector writer. Cover · globe snapshot · one section
  per L1 org · embedded people/equipment/notes · diagram annexes. Golden-file harness,
  4-reader QA.

## §8 Team of 100
1 PM · 5 leads (Foundation&Globe 18 · Data&Datastore 20 · Brief 18 · PDF 18 ·
Design&QA 20) — executed as phased agent workflows with adversarial verification.

## §9 Roadmap
M1 v0.1.0 foundation+globe+search+lines · M2 v0.2.0 datastore · M3 v0.3.0 brief ·
M4 v0.4.0 PDF · M5 v1.0.0 theme final + QA fleet + ship.

Full charter (visual): the "A-ORG-2 Charter" artifact, 19 Aug 2026.
