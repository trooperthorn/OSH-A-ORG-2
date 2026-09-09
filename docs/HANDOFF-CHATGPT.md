# A-ORG-2 — Engineering Handoff

**For an assistant picking this project up cold (written for ChatGPT).**
Prepared 9 September 2026 against `v1.25.0` (commit `a1d496e`).

**v1.25.1 status, 9 September 2026:** the prune described in §10 is implemented:
`index.html` is 874,590 bytes, with 47,010 bytes of headroom (94.9% of the gate).
The changelog now starts at v1.22.0; both orphan dock handlers are removed;
the byte ledger no longer double-counts export-template CSS. See the appended
v1.25.1 section in `CLAUDE.md` for the rules and verification boundary. This is a
draft PR pending browser boot/visual sanity. The remaining text and line numbers
below are the original v1.25.0 engineering snapshot, not updated measurements.

You are inheriting a mature, opinionated single-file web app. It has shipped 109
commits and ~60 releases. Almost every rule below exists because breaking it
already cost a release. Read §1 and §11 before you write a line of code.

---

## 1. The thirty-second orientation

**A-ORG-2** is a phone-first PWA: a gold-on-black globe of the U.S. Army's
installations and organizations, plus a diagram builder for briefs.

- **The whole app is one file**: `index.html`, 899,862 bytes, 10,165 lines. No
  build step, no framework, no bundler, no npm dependencies at runtime.
- **Owner**: philcase4@gmail.com (GitHub `PC444413`). Solo owner, reviews on a
  phone, iterates fast and in short directives.
- **Repo**: `github.com/PC444413/A-ORG-2`, branch `main`. Push to `main` deploys.
- **Live**: `a-org-2.philcase4.workers.dev` (Cloudflare Workers, behind
  Cloudflare Access).
- **Two "rooms"**: the **map** (globe, search, org cards) and the **brief**
  (a diagram you build). One toggle switches them. They share one selection
  model, one search, one drawer.

The single most important cultural fact: **this project treats a passing test
suite as the deliverable, not the code.** Every fix ships the check that would
have caught it.

---

## 2. Repository layout

```
index.html                 THE APP — 10,165 lines, everything
sw.js                      service worker, 4.5 KB, cache name tracks APP_VERSION
manifest.webmanifest       PWA manifest
wrangler.jsonc             Cloudflare Workers config (static assets, dir ".")
CLAUDE.md                  124 KB — the accumulated law (see §9)
README.md                  one-paragraph intro
docs/CHARTER.md            the scope contract, approved 19 Aug 2026
docs/HANDOFF-CHATGPT.md    this file
docs/BRIEF_RECON_FINDINGS.md      brief-layout recon, Aug 2026 (historical)
docs/BRIEF_REMEDIATION_SPEC.md    its resolution plan (historical)
docs/CLAUDE_CODE_HANDOFF.md       an earlier, narrower handoff (historical)
data/orgs.json             1,416 organizations (source of truth)
data/sites.json            285 installations (source of truth)
data/land-50m.json         basemap geometry (land, 545 KB)
data/land-110m.json        low-res land
data/countries-110m.json   country borders
data/states-10m.json       US state borders
data/regions/*.json        10 regional site packets
data/research/             raw research packets (input to tools/research-merge.js)
tools/*.js                 the test suite + data tooling (see §7)
.github/workflows/checks.yml   CI: runs the five tools on every push and PR
.github/workflows/probe.yml    manual: curls the live site from a runner
```

There is no `src/`, no `node_modules`, no test framework. The tools are plain
Node scripts with zero dependencies.

---

## 3. Hard rules — do not break these

These are quoted from `CLAUDE.md` and are non-negotiable without the owner's
written say-so.

1. **Single file, no build step, no frameworks.** `index.html` is the app.
2. **Phone-first is sacred.** Desktop lives only inside
   `@media (min-width:1100px)` layers. The reference viewport is **414×896**.
3. **Zero foreign code at boot.** Nothing external loads until the user
   explicitly acts. Supabase is injected only when the owner taps Connect.
4. **Ship ritual**: `APP_VERSION` (index.html) and `CACHE` (sw.js) move together
   — `vX.Y.Z` ↔ `a-org-2-vX-Y-Z` — plus a changelog entry. Lint-enforced.
5. **Single-brain law**: one selection model, one search, one drawer, one
   map⇄brief toggle. No feature ships that does not route through that spine.
6. **Brief tier colours are semantics**, not decoration: L1 white · L2 cool ·
   L3 warm · L4 rose. **Never green on brief data** (green is status only).
7. **Size budget**: `index.html` < 900 KB, enforced in CI. Currently
   **899,862 bytes — 97.6% of the gate, 21,738 bytes of headroom.** This is the
   binding constraint on the project right now: the next feature of any size
   needs a prune release *first*, not after (see §10).
8. **Never push to `/home/user/A-ORG` or the `PC444413/A-ORG` repo.** That is
   A-ORG-1, the predecessor, archive-only.

Also inherited and load-bearing:

- **Do not remove the diagnostics stack**: first-byte error capture, the error
  toast, `window.__errLog`, the wordmark long-press diagnostic dump, sandbox
  detection (`window.__SANDBOX`), or the service worker's cross-origin
  passthrough.
- **The globe engine is a port from A-ORG-1, not a rewrite.** Its math survived
  22 major versions. A behavioural difference from A-ORG-1 is a bug, not a
  design choice.

---

## 4. Navigating `index.html`

The file is ordered and sign-posted. Search for these exact banners:

| Banner | Line | What lives there |
|---|---|---|
| CSS tokens + theme | ~124 | the Lumen palette, radii, fonts, safe-area tokens |
| CSS: chrome, callout, datastore, brief | 1139–1500 | all styling |
| HTML body | 1521–1662 | the stage and every floating surface |
| `CHANGELOG` | 1664 | newest entry goes **above** the previous `//   vPREV` marker |
| `GlobeState` | 2160 | the shared camera/selection spine |
| `A1ORGS` literal | 2193 | inline copy of the org tree |
| `module: m1-geom` | 2227 | quaternion camera math, projection |
| `module: m2-render` | 2371 | the draw loop, basemap painting |
| `module: m3-input` | 2655 | pointer/touch/wheel, drag, pinch, tap routing |
| `module: m4-camera` | 2922 | fly-to, tweens, zoom clamps |
| `module: m5-markers` | 3070 | dots, labels, arcs, layers/modes, hit testing |
| `module: m6-mapdata` | 4270 | basemap data loading, state shapes |
| `module: s3-search` | 4657 | the search index and results |
| `module: s4-dossier` | 5126 | the drawer, the org card/callout, the brief |
| `module: s7-records` | 7747 | the datastore (IndexedDB) |
| `module: s6-export` | 9102 | snapshot/export |
| `module: s5-clocks` | 9324 | the time ledger |

Line numbers move every release — treat them as a starting point and confirm by
searching for the banner text.

**Key element IDs**: `#globeCanvas` `#titleBar` `#verTag` `#modeSeg`
`#searchPill` `#searchResults` `#navDock` `#navGlobe` `#navPod` `#briefDock`
`#briefStage` `#dossier` `#calloutCard` `#lyPanel` `#ledger` `#timeLedger`
`#exportSheet`.

**Global API surface** (assigned to `window`, useful for driving the app in a
headless browser): `GlobeState`, `SITES`, `A1ORGS`, `Orgs`, `Brief`, `Briefs`,
`Views`, `Records`, `Repo`, `Layers`, `Callout`, `DB`, `__errLog`, `_diagDump`.

**Update doors** (v1.25.0, present in every host; only the registration skips a
sandbox): `__updKick` (check now) · `__updCheck` → `{ok,found,why}` ·
`__swAsk`/`__swVer` (the worker names its build over a MessageChannel) ·
`__swHeal` (refresh the shell) · `__swVerCheck` (stale-build self-heal) ·
`__swReg` (harness hook).

---

## 5. The data model

Two JSON files are the source of truth. **`index.html` carries an inline copy of
each, and the copies must match the files exactly** — `data-lint` enforces this
(added v1.24.0, after the drift went unguarded for a year).

### `data/sites.json` — 285 installations, schema v2

```json
{ "id": "fort-bragg", "base": "Fort Bragg", "st": "NC",
  "lat": 35.14, "lon": -79.0, "grp": "conus", "cls": "base",
  "unit": "USAWHC", "parent": "the-pentagon" }
```

- `id` **must equal** `slug(base)`. The derivation is the contract; a hand-edited
  id breaks re-extraction and every pointer aimed at it.
- `cls` ∈ `base | hq | depot | guard`.
- `grp` folds A-ORG-1's `kind` as `'grp|kind'` on 71 rows (e.g. `'conus|usace'`).
  **Never consume `grp` as a plain enum.**
- `parent` is the *only* relationship. There is no other link data by design.
- `unit: null` is sanctioned for Guard camps and OIB plants (map dots, not org
  rows). A present-but-blank unit is a fatal data bug.

### `data/orgs.json` — 1,416 organizations, schema v1

```json
{ "id": "usawhc", "name": "USAWHC", "parent": "asccs",
  "lvl": 3, "root": "asccs", "site": "fort-bragg" }
```

- `lvl` is **derived** from the parent chain, never hand-held (lint checks it).
  Depth distribution: L1 ×1, L2 ×5, L3 ×34, L4 ×301, L5 ×353, L6 ×413, L7 ×265,
  L8 ×26, L9 ×18.
- `root` names the L2 grouping shell.
- The five L2 rungs: `acoms`, `asccs`, `drus`, `acquisition-paes-cpes`,
  `national-guard-bureau`. The first four are in `_OG_CATS` — grouping *shells*,
  filtered out of breadcrumbs because you cannot drill into them.
- **Never change an org `id`.** Users' saved briefs and views reference ids.
  Rename the `name`, re-point the `parent`, but keep the id.

### Data currency

The tree is a claim about the present and it goes stale. `data-lint` now fails if
any org names a command the Army has dissolved (FORSCOM, TRADOC, AFC, ARNORTH,
ARSOUTH, SDDC). When updating structure, **verify against the Army's own
announcements or the relevant General Order** — in the v1.24.0 pass, two things
that *looked* wrong turned out to be correct and were nearly "fixed" by mistake.

**Known unresolved data question**: whether USAWHC is an ACOM or an ASCC. It
replaced FORSCOM (an ACOM) and absorbed two ASCCs; sources split. It currently
sits under ASCCs. Do not regroup it without the owner's decision.

---

## 6. State and persistence

- **Records** (people/specs/notes/links per org): in-memory `RECORDS` map is the
  runtime source of truth; **IndexedDB** `aorg2` v2, stores `records` and `kv`,
  is write-through and loads once *after* first paint.
- **`localStorage` is read by exactly two keys**: `a2Coached` (first-run coach
  seen) and `a2VerSeen` (build-change toast). **Nothing else may read
  localStorage at boot** — that is the boot law. `sessionStorage` holds one key,
  `a2Healed`, so the stale-build self-heal reloads at most once per worker build
  per session.
- **Saved views / saved briefs**: `window.Views` and `window.Briefs`, persisted
  through the same IndexedDB `kv` store.
- **Supabase** is optional and lazy. Injected from jsDelivr only on a manual
  Connect tap. **The publishable key must never be committed. Never use a
  service_role key.** The owner's email is for identification only.

---

## 7. The test suite and the ship ritual

### The five tools — all must pass before any commit

```bash
node tools/data-lint.js      # sites+orgs invariants, inline-copy parity, currency
node tools/harness_globe.js  # real m1 math + m5 markers over the real data
node tools/smoke_runtime.js  # boots the whole app under a stub DOM, runs ~40 probes
node tools/ship-lint.js      # APP_VERSION ↔ CACHE ↔ changelog
node tools/dead-lint.js      # unreachable CSS/JS + the 900 KB byte budget
```

CI (`.github/workflows/checks.yml`) runs the same five on every push and PR.

### The ship ritual (any user-facing change)

1. Bump `APP_VERSION` in `index.html`.
2. Bump `CACHE` in `sw.js` to the matching `a-org-2-vX-Y-Z`.
3. Add a changelog entry **above** the previous `//   vPREV` marker (~line 1612).
4. Append a law section to `CLAUDE.md` describing *why*, not just what.
5. **Then** run the five tools.
6. Commit with the version in the subject: `v1.25.0: <short title>`.

### Two testing laws, each learned by shipping a red suite

1. **A negative source assert is scoped to CODE, never a bare token.** The file
   documents its own history, so every retirement plants a matching string in the
   changelog. A ban on `_usaceOff` fired on the sentence announcing its deletion.
   Match the shapes the identifier wears as code (`/_usaceOff\s*[=;,)\]'"]/`),
   and prove the assert by re-injecting the defect and watching it fire.
2. **The suite runs LAST — after the version bump, cache bump and changelog.**
   Those edits are themselves source, and `smoke_runtime` reads the source as a
   string. A green run taken before the ship ritual is a green run of a bundle
   that was never shipped.

### Quirks of `smoke_runtime.js` you will trip over

- Its stub DOM **parses no static markup**. Assertions about static HTML or CSS
  must grep the source `html` string, not query the DOM.
- Slices taken with `.split('\n</div>')[0]` need a guard — without one they pass
  vacuously when the anchor moves.

---

## 8. Deployment

Push to `main` → Cloudflare Workers builds and deploys (a `Workers Builds:
a-org-2` check appears on the commit). There is no deploy workflow in the repo;
the integration is configured in the Cloudflare dashboard.

**Review truth — read this before believing any screenshot.** `#verTag` under
the wordmark always shows the running build, and each build toasts
"A-ORG-2 vX.Y.Z" once on its first boot. The owner once reported a fix as broken
from a screenshot of the *previous* build. Check the stamp first, every time.

**The update path was hardened in v1.25.0.** Its laws are now load-bearing; do
not soften them:

- `sw.js` precaches from the **origin** (`cache:'no-cache'` Requests). A new
  worker may never seed its cache from the browser's HTTP cache, or a v+1 worker
  ships a v0 shell under a current cache name — that is the stale-review bug
  class at its root.
- The **shell (`'./'`) is mandatory at install**: no shell means the install
  throws, the old worker keeps control, and the next check retries. Better to
  stay on the old build than to serve a broken new one.
- **A redirected response is never stored under the request URL** — a redirected
  cached response fails a navigation outright. This is why the `'./index.html'`
  twin is gone: Cloudflare 308s it to `'/'`. Smoke bans the twin.
- Navigations match the shell with `ignoreSearch` and fall back to it offline.
  `sw.js` itself is never cached by the worker.
- **Stale-build self-heal**: `__swVerCheck` compares the worker's cache version
  to `APP_VERSION`; if the worker is *newer* it refreshes the shell and reloads
  once per worker build per session (`sessionStorage a2Healed`) — never a loop.

**Cloudflare Access still blocks automated verification.** Fetches from a runner
or a script get a 302 to a login page, so neither you nor CI can read the live
deploy. Verification of a deploy is a human opening the site and reading the
version stamp.

---

## 9. Design law

The identity is **Lumen**: illuminated gold on true black.

```
--ground #060504   --panel #14110A    --panel-2 #1C1810
--text   #F5F1E4   --dim   #C4BBA4    --faint   #9C947E
--accent #F5D76E   --accent-deep #D4B54A   --accent-wash rgba(245,215,110,.13)
--signal #FFB35C   --danger #FF7A66   --ok #58C08A  (status only)
--t1 #FFFFFF  --t2 #6FC7E8  --t3 #FFC95C  --t4 #FF8FC0   (brief tiers — semantics)
--r-card 16px --r-chip 11px --r-pill 999px   |   system font stacks only
```

- **No blue chrome.** Gold, warm neutrals, black.
- **One filled primary per surface**; secondary actions are quiet (outline or
  text). A panel with two competing filled gold buttons is a defect.
- Layer tokens `--rail-w`, `--rail-r`, `--gut` keep the bottom-right control pod
  clear of other surfaces. Respect `env(safe-area-inset-*)`.

**Four standing macro laws**, distilled with the owner and to be applied
unprompted:

1. **The Twice Rule** — the same bug *family* appearing twice means stop patching
   and re-architect the layer it lives in.
2. **Invariants over instances** — convert each complaint into the invariant
   behind it, fix the invariant, then sweep every site where it can break.
3. **Every fix ships its test.**
4. **Advise before architectural patches** — when a fix could be a patch or a
   rebuild, present the recommendation and cost first; the owner decides
   macro direction.

---

## 10. Current state and open items

**v1.25.0**, all five tools green.

| | |
|---|---|
| index.html | 899,862 bytes (**97.6%** of the 900 KB gate — 21,738 left) |
| sw.js | 4,477 bytes |
| organizations | 1,416 (data updated 2026-09-08) |
| installations | 285 (data updated 2026-08-25) |
| commits | 109 |

The last two releases: **v1.24.0** refreshed the org tree to the 2026 force
structure and added the echelon tag to the org card; **v1.25.0** hardened the
service-worker update path and Supabase connectivity (see §8).

### Open items, most pressing first

1. **THE PRUNE IS NOW BLOCKING — byte budget at 97.6%, 21,738 bytes left.**
   `dead-lint` warns on every run and the gate is hard. Do a prune release
   *before* proposing any feature of size. Precedent: v1.16.1 freed 66 KB by
   trimming the in-file changelog to the current era only — older entries live in
   `git log` and `CLAUDE.md`, so nothing is lost, only moved. That same lever is
   available again, and the changelog has grown since. A prune is a release like
   any other: version, cache, changelog, full suite, live boot sanity.
2. **A dead click handler**: `index.html:7533` still routes `[data-bfledger]`,
   whose cell was removed in the v1.22.0 dock rebuild. Harmless, `dead-lint`
   does not flag it, free to remove next time that area is edited — and it is
   free bytes toward item 1.
3. **USAWHC ACOM-vs-ASCC** (see §5) — awaiting an owner decision.
4. **ASCC parent convention split** (long-standing, SME hold):
   USARPAC/USARCENT/ARCYBER chain to COCOM sites while USAREUR-AF/USAWHC chain to
   HQDA. Pick one rule in a data pass.
5. **Supabase Connect**: hardened in v1.25.0 (single in-flight load, dead-tag
   removal, 20 s timeout, one connect at a time, dirty-flag flush ladder, network
   watch). The owner has still never confirmed an end-to-end connect on a real
   device — treat it as unproven in the field, not as broken.
6. **Open architectural option, offered and undecided**: a single-family basemap
   (one Natural Earth 50m family for land + lakes + countries + states) to
   replace today's mixed `land-50m` / `countries-110m` / `states-10m` stack.
   Consistent by construction; restores Canadian lakeshores; permanently retires
   the offset-line bug class. ~1 release, adds data files — weigh against item 1.

---

## 11. How to work on this productively — read before your first change

You will almost certainly be working from pasted excerpts, not a checkout. Adapt
like this.

**Ask for the region you need.** The file is 10,165 lines; nobody will paste it
all. Use the map in §4 to name the banner or line range you want. Ask for the
current text of a function before rewriting it — this codebase is heavily
commented and the comments carry the reasoning.

**Return anchored patches, not whole files.** The working pattern that survives
here is an exact-match replacement with an asserted occurrence count:

```python
def rep(old, new, n=1):
    assert s.count(old) == n, (s.count(old), old[:110])
    s = s.replace(old, new)
```

An edit that cannot state its anchor and its expected count is not ready. Never
emit a regenerated `index.html` — it is 880 KB and the diff would be unreviewable.

**Be explicit about what you did and did not verify.** You cannot run the five
tools or a headless browser. Say so plainly, name which tool *would* exercise the
change, and never write "tested" or "verified" for something you reasoned about.
The owner relies on that distinction; a false claim of verification is the most
damaging thing you can do on this project.

**Write the test with the fix.** Even if you cannot run it, hand over the probe
you would add to `smoke_runtime.js` and say which defect it fires on. Then apply
testing law #1: scope negative asserts to code, and describe how to prove the
assert fires by re-injecting the defect.

**Spend bytes deliberately.** At ~21 KB of headroom against a hard CI gate,
"just add a panel" can fail the build outright. Prefer replacing dead weight over
adding, state what your change costs in bytes, and if it is more than a few KB,
say plainly that a prune should land first.

**Match the voice.** Commit messages and code comments here explain *why*,
name the owner's words when a change answers a request, and record what was
considered and rejected. Comments are long and load-bearing; do not strip them
to save space without saying so.

**Verify claims about the Army's structure against primary sources.** General
Orders and official announcements outrank secondary reporting, which has been
wrong in this domain more than once.

**When you find something ambiguous, flag it — do not silently pick.** The
USAWHC classification above is the model: state the conflict, leave the
defensible existing behaviour in place, and put the decision to the owner.

---

## 12. Vocabulary

The project has its own words. Using them correctly signals you have read this.

| Term | Meaning |
|---|---|
| **room** | the map room or the brief room; one toggle switches them |
| **the pod** | `#navPod`, the 42px glyph-only control strip, bottom right |
| **the dock** | `#briefDock`, the brief room's matching strip |
| **the rail** | the breadcrumb row at the top of an org card |
| **the echelon tag** | the gold ACOM/ASCC/DRU/ACQ/NGB badge leading the rail |
| **the constellation** | the illuminated-dot rendering of sites (v1.17.0) |
| **the repository** | `#ledger`, the app-wide side panel: Views · Briefs · Records |
| **the shelf** | a list of saved things inside the repository |
| **the brief** | the user-built diagram, not a document |
| **the ship ritual** | version + cache + changelog, together (§7) |
| **the boot law** | nothing foreign, and no localStorage reads, at boot |
| **the single-brain law** | one selection model, one search, one drawer, one toggle |

---

*Generated from the repository at commit `a1d496e` (v1.25.0). Where this document and
`CLAUDE.md` disagree, `CLAUDE.md` wins — it is the living law and is appended to
every release.*
