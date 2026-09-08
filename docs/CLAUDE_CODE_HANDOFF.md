# Claude Code Handoff — A-ORG-2 BRIEF Mode Remediation

**Prepared:** 2026-08-28 · Coordinator
**Companion doc:** `BRIEF_REMEDIATION_SPEC.md` — the actual spec. This file is the handoff wrapper.

---

## Setup

1. Drop both files into the repo: `docs/BRIEF_REMEDIATION_SPEC.md` and `docs/CLAUDE_CODE_HANDOFF.md`.
2. `cd` into the A-ORG-2 repo and start Claude Code.
3. Paste the kickoff prompt below. Nothing else needed in the first message.

---

## Kickoff prompt — paste this verbatim

```
Read docs/BRIEF_REMEDIATION_SPEC.md.

Context: that spec was written from two screenshots of the running app.
Whoever wrote it has never seen this codebase. The WHAT and WHY are
reliable — the observed defects are real and the reasoning about root
cause is sound. The WHERE is guesswork.

This session is reconnaissance only. Do not write any implementation code.

Answer the eight recon questions in the spec's "Before you write code"
section against the actual source. For each, cite the file and line you
found the answer in. Then tell me:

1. Where node x/y placement actually happens — the specific function
   and line that assigns a node's position.
2. Where the Fit percentage is computed and what it currently measures.
3. Whether the rail is one component or two.
4. Which of the spec's prescribed fixes DON'T fit this architecture,
   and what you'd do instead.
5. A revised P0 plan scoped to what's actually here.

If the spec is wrong about something structural, say so plainly. I would
rather rewrite the spec than have you implement against a bad assumption.
```

---

## After recon — session plan

One phase per session, one branch per phase. Do not let P0, P1 and P2 blur together.

| Session | Scope | Branch | Exit condition |
|---|---|---|---|
| 1 | Recon only, no code | — | Revised P0 plan agreed |
| 2 | P0: measure → layout → fit pipeline + edge layer | `fix/brief-layout-engine` | Acceptance criteria 1–4 pass |
| 3 | P0: rail clipping, CLEAR confirm, persistent rail model | `fix/control-rail` | Acceptance criteria 5–7 pass |
| 4 | P1 | `fix/brief-view-architecture` | Ship-quality |
| 5 | P2 | `polish/brief-chrome` | Full defect log closed |

Session 2 is the one that matters. If the layout pipeline lands correctly, the rest is straightforward. If it gets patched instead of rebuilt, everything downstream inherits the bug.

---

## Guardrails — restate these if Claude Code drifts

- **The app stays dark and gold.** That aesthetic is deliberate. This work changes layout, structure and control model only. If it offers to "modernize" or lighten the theme, decline.
- **No font shrinking, no lowering the fit floor.** Both hide the smear without fixing it. Named explicitly in spec §7 — hold the line on it.
- **Recon before code, every phase.** Not just session 1. Each phase starts by reading the code it's about to change.
- **Scope discipline.** If it finds defects outside the logged 22, it reports them; it does not fix them in the same pass.
- **Assertions, not screenshots.** The acceptance criteria are written to be programmatically checkable. If there's no test runner, that's the first thing to stand up in session 2 — a collision assertion over laid-out geometry is worth more than any amount of visual review.

---

## What to bring back here

When P0 lands, bring back:

- The recon findings, if the spec needs correcting — I'll revise the master and re-register it.
- Any defect Claude Code found that isn't in the log — it gets an ID and a severity.
- Screenshots of BRIEF at L2, L3 and L4 post-fix, so the defect log can be closed out row by row.

The spec master lives in the project at `claude/A-ORG-2_BriefMode_Rail_Remediation_Spec_2026.html` (print version) with this markdown as the working copy. Registry row: **A-ORG-2 BRIEF Mode & Control Rail**, status **Working**.

---

## Known gaps in this handoff

Stated plainly so nobody discovers them mid-session:

- **No source access at authoring time.** The entire spec is inferred from two screenshots. Recon exists to correct this.
- **Stack unknown.** `d3-flextree` is recommended on the assumption of an SVG/DOM tree render. If A-ORG-2 draws to canvas or WebGL, §3.1's measurement approach holds but §3.2's library choice may not.
- **Data model unknown.** `d3.hierarchy` needs a nested tree. If orgs are stored flat with level fields, a transform step is needed that isn't costed in the P0 plan.
- **No test infrastructure confirmed.** The eight acceptance criteria assume assertions are possible. If there's no runner, add that cost to session 2.
- **Original A-ORG-2 chat was deleted and is unrecoverable.** Any prior design decisions or constraints discussed there are lost. If Claude Code finds code that contradicts this spec, the code is probably right and the spec is missing context — flag it rather than overwriting.
