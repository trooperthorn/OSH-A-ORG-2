# AGENTS.md — A-ORG-2

Instructions for coding agents working in this repository (ChatGPT/Codex reads
this file automatically; it is the counterpart to `CLAUDE.md`, which carries the
full accumulated law). **Where the two disagree, `CLAUDE.md` wins** — it is
appended to on every release and is the authoritative history.

Read `docs/HANDOFF-CHATGPT.md` before your first change. Navigate `index.html`
with `docs/CODEMAP.md` rather than opening the whole file.

## What this is

A phone-first PWA: a gold-on-black globe of U.S. Army installations and
organizations, plus a diagram builder for briefs. **The entire app is
`index.html`** — ~912 KB, ~10,200 lines, no build step, no framework, no runtime
dependencies. `sw.js` is a small service worker. Everything else is data, docs,
and zero-dependency Node test tools.

The owner is solo, reviews on a phone, and gives short directives.

## Non-negotiables

1. **Single file, no build step, no frameworks.** `index.html` is the app.
2. **Phone-first.** Reference viewport 414×896. Desktop only inside
   `@media (min-width:1100px)`.
3. **Zero foreign code at boot.** Nothing external loads until the user acts;
   Supabase is injected only on a manual Connect tap.
4. **Ship ritual.** `APP_VERSION` (index.html) and `CACHE` (sw.js) move together
   — `vX.Y.Z` ↔ `a-org-2-vX-Y-Z` — plus a changelog entry above the previous
   `//   vPREV` marker, plus a law section appended to `CLAUDE.md` saying *why*.
5. **Single-brain law.** One selection model, one search, one drawer, one
   map⇄brief toggle. Nothing ships that bypasses that spine.
6. **Brief tier colours are semantics**, not decoration: L1 white · L2 cool ·
   L3 warm · L4 rose. **Never green on brief data** (green is status only). No
   blue chrome — the identity is gold on black.
7. **Byte budget: `index.html` < 900 KB, hard CI gate.** See the warning below.
8. **Never change an org `id`** — saved briefs reference ids. Change `name` or
   `parent` instead. A site `id` must equal `slug(base)`.
9. **Never touch the A-ORG (A-ORG-1) repo.** Archive-only.
10. Do not remove the diagnostics stack (`window.__errLog`, the error toast,
    sandbox detection, the wordmark long-press dump), the service worker's
    cross-origin passthrough, or the v1.25.0 update-path laws.

## ⚠ The byte budget is the binding constraint

`index.html` is at **~911,854 bytes — 98.9% of the 900 KB gate, under 10 KB of
headroom.** `tools/dead-lint.js` fails the build past it.

v1.25.1 pruned the file to 874,590 bytes; v1.26.0 and v1.27.0 spent all of that
back within two releases. **Do not propose a feature of any size without a prune
in the same release or immediately before it.** State the byte cost of every
change you make.

Where the weight is (see `docs/CODEMAP.md` for the live ledger): the inline
`A1ORGS` literal ~226 KB, the in-file `CHANGELOG` ~62 KB, `s4-dossier` ~174 KB.
The changelog is the cheapest lever — the retention law keeps only the current
era in-file, because older entries live in `git log` and `CLAUDE.md`.

## Before you commit — run the tools

```bash
node tools/data-lint.js        # sites+orgs invariants, inline-copy parity, currency
node tools/harness_globe.js    # real projection + marker math over the real data
node tools/smoke_runtime.js    # boots the app under a stub DOM, ~40 probes
node tools/ship-lint.js        # APP_VERSION ↔ CACHE ↔ changelog
node tools/dead-lint.js        # unreachable CSS/JS + the byte budget
```

Those five are the CI gate (`.github/workflows/checks.yml`). Six more exist and
are **not yet wired into CI** — run the ones your change touches:
`brief-scale-check.js`, `brief-support-check.js`, `ux-navigation-check.js`,
`ux-persistence-check.js`, `ux-records-check.js`, `ux-search-check.js`.

**The suite runs LAST**, after the version bump, the cache bump and the changelog
entry. Those edits are themselves source, and `smoke_runtime` reads the source as
a string — a green run taken before the ship ritual is a green run of a bundle
that was never shipped. This has shipped a red suite once already.

If you add a check, wire it into `.github/workflows/checks.yml` in the same
change, or it will never run again.

## Every fix ships its test

Add the probe that would have caught the bug, in the same release. Two laws:

- **A negative source assert is scoped to CODE, never a bare token.** The file
  documents its own history, so banning `_fooFlag` also matches the changelog
  sentence announcing its removal. Match the shapes it wears as code
  (`/_fooFlag\s*[=;,)\]'"]/`). **Prove the assert by re-injecting the defect and
  watching it fire** — an assert that has never fired is not known to work.
- `smoke_runtime`'s stub DOM **parses no static markup.** Assertions about HTML
  or CSS must grep the source string, not query the DOM. Slices taken with
  `.split(...)` need a guard or they pass vacuously when the anchor moves.

## Editing a 912 KB file

Use anchored replacement with an asserted occurrence count, not line numbers and
not a regenerated file:

```python
def rep(old, new, n=1):
    assert s.count(old) == n, (s.count(old), old[:110])
    s = s.replace(old, new)
```

Keep the comments. They are long, they explain *why*, and they name the owner's
words when a change answers a request. Do not strip them for bytes without
saying so. Regenerate `docs/CODEMAP.md` (`node tools/codemap.js`) when your
change moves code.

## Data

`data/orgs.json` (1,416 orgs) and `data/sites.json` (285 sites) are the source of
truth; `index.html` carries an **inline copy of each that must match exactly** —
`data-lint` enforces it. Edit the source and regenerate the inline copy in the
same script; never one by hand.

`lvl` is derived from the parent chain, never hand-held. `data-lint` also fails
on any dissolved command presented as live (FORSCOM, TRADOC, AFC, ARNORTH,
ARSOUTH, SDDC). **Verify structural claims against primary sources** — General
Orders and official announcements outrank secondary reporting, which has been
wrong in this domain more than once.

## Judgement

- **The Twice Rule** — the same bug *family* appearing twice means stop patching
  and re-architect the layer it lives in.
- **Invariants over instances** — convert a complaint into the invariant behind
  it, fix that, then sweep every site where it can break.
- **Advise before architectural patches** — when a fix could be a patch or a
  rebuild, present the recommendation and the cost first; the owner decides.
- **Flag ambiguity, do not silently pick.** When sources conflict, leave the
  defensible existing behaviour and put the decision to the owner.
- **Never claim verification you did not perform.** If you could not run the
  suite or a browser, say exactly that. The owner relies on the distinction.

## Commits

Small, one release each, version in the subject: `v1.27.0: <short title>`. The
body says what changed and why, names which tools exercise it, and states
plainly anything left unverified.
