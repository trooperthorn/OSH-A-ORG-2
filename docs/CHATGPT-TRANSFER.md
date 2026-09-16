# Transferring A-ORG-2 to ChatGPT

Two routes. They are not alternatives — use both, for different work.

| | Route A — Codex (repo-connected) | Route B — Project (files uploaded) |
|---|---|---|
| Has the repo | yes, a real checkout | no, only what you upload |
| Can run the Node suite | yes | no |
| Produces | a branch and a pull request | patches and prose in chat |
| Best for | shipping changes | planning, design, review, questions |

You are **already using Route A** — PR #5 merged from a `codex/` branch. What was
missing is the instruction file Codex reads, which this change adds.

---

## Route A — Codex, the repo-connected agent

**This is the one that ships code.** Codex clones the repo into a container with
Node, so it can run the eleven tools and open a PR. It is strictly better than
pasting files for anything that ends in a commit.

### Setup — one action

`AGENTS.md` now exists at the repository root. Codex reads it automatically on
every task; there is nothing to paste and nothing to re-upload. It carries the
non-negotiables, the byte-budget warning, the test commands, the ship ritual and
the editing discipline.

**This was the gap.** Codex has been working this repo (v1.26.0, v1.27.0) with no
instruction file at all. Two consequences are visible in the history:

- The v1.25.1 prune took `index.html` to 874,590 bytes. v1.26.0 and v1.27.0 spent
  all 47 KB of that headroom back inside two releases, returning the file to
  98.9% of the gate. (Since resolved: v1.31.0 moved the org tree out to
  `data/orgs.json`; the file now sits at 76%.)
- Six new check tools were added (`ux-*`, `brief-*`) but never wired into
  `.github/workflows/checks.yml`, so for two releases CI ran only the original
  five. (Since resolved: v1.28.0 wired all eleven into the workflow.)

Neither is a criticism of the work — both are what happens when an agent cannot
see the rules. `AGENTS.md` should stop the recurrence.

### Keeping it honest

Ask Codex to paste the tool output into the PR body rather than asserting the
suite passed. Check two things on every Codex PR before merging:

1. **The byte line.** `node tools/dead-lint.js` prints the ledger. If the change
   grew the file and there was no prune, ask why.
2. **The ship ritual.** `APP_VERSION`, `CACHE` and a changelog entry, all three,
   or `ship-lint` fails.

---

## Route B — a ChatGPT Project with the files uploaded

For thinking, not shipping: design conversations, "why does this happen", reading
the laws back, planning a release, reviewing a diff you paste in.

### Setup

1. Create a **Project** in ChatGPT (Projects keep files and instructions across
   chats; a Custom GPT works too if you want to share it).
2. Open the project's **Instructions** and paste the block from
   `docs/CHATGPT-INSTRUCTIONS.md` — everything below its `---` separator. It is
   ~6,000 characters and fits the limit with room to spare.
3. Upload the files below.

### What to upload, in priority order

| File | Size | Why |
|---|---|---|
| `docs/HANDOFF-CHATGPT.md` | 20 KB | the manual — architecture, data, laws, how to work |
| `docs/CODEMAP.md` | 15 KB | the index of `index.html`: sections, functions, line numbers, byte ledger |
| `AGENTS.md` | 7 KB | the operating rules, same ones Codex follows |
| `index.html` | 912 KB | the app itself |
| `CLAUDE.md` | 124 KB | the full law, one section per release |
| `data/orgs.json` | 313 KB | the org tree |
| `data/sites.json` | 50 KB | the installations |
| `sw.js` | 4 KB | the service worker and its update-path laws |

Skip the basemap geometry (`land-50m.json` and friends, ~800 KB of coordinates)
— it is inert data that will never inform an answer.

The first three are the ones that make ChatGPT useful. If you upload nothing
else, upload those.

### The first message

> Read HANDOFF-CHATGPT.md and CODEMAP.md before answering. Then tell me, in your
> own words: what is the byte budget situation, what are the three rules most
> likely to trip you, and what can you not verify? Do not write any code yet.

If the answer does not mention the ~900 KB gate and that it cannot run the Node
suite, the files did not load properly — re-upload before trusting anything else.

### The working loop

1. You describe the change.
2. ChatGPT asks for the region it needs — by banner name or line range from
   `CODEMAP.md`. Paste just that.
3. It returns an **anchored patch**: exact `old` text, `new` text, and the
   expected occurrence count. Not a regenerated file.
4. You (or Claude Code) apply it, run the tools, and report back.

If Code Interpreter is available in your plan, ChatGPT can do step 3 more
strongly: upload `index.html`, have it apply the patch in Python and hand back
the modified file. Probe with:

> Using Python, load index.html, print its byte count, and confirm the string
> `const APP_VERSION` occurs exactly once.

If that works, Python can also check anchor uniqueness and the byte budget. It
still cannot run the Node suite — that sandbox has no Node and no network.

---

## What ChatGPT cannot do on either route

- **Open the live site.** `a-org-2.philcase4.workers.dev` sits behind Cloudflare
  Access; automated fetches get a 302 to a login page. Verifying a deploy is a
  human opening it and reading the version stamp under the wordmark.
- **See the app render.** No browser, no screenshots, no visual judgement. Any
  claim about how something looks is a guess unless you showed it a picture.
- **Route B cannot run the tools.** Route A can, but ask for the output.

Hold the line on the wording: "applied and byte-checked, not run against the
suite" is honest; "verified" is not, unless something actually executed.

---

## Keeping the bundle fresh

Line numbers and byte counts move every release, and a stale map is worse than
none — it sends the reader to the wrong place with confidence.

After any release that moves code:

```bash
node tools/codemap.js     # regenerates docs/CODEMAP.md
```

Then, for Route B, re-upload `CODEMAP.md` and `index.html`. Route A needs
nothing — it reads the repo.

`HANDOFF-CHATGPT.md` carries its own "prepared against vX.Y.Z" line. When that
version is more than a release or two behind, refresh it rather than letting a
reader trust old measurements. It has already been caught stale once: it was
drafted against v1.24.0 and v1.25.0 landed mid-write.
