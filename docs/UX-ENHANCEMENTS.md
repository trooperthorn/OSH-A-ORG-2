# v1.26.0 — navigation and record workflow

Implements the owner's 10 September 2026 request to apply the A-ORG-2 usability
assessment, based on main `89d6efeeb4649a0d8ee20b08d7cc4b67ca049016`.

## User-facing changes

| Area | Result |
| --- | --- |
| Navigation | Independent 48px phone / 56px desktop targets; unclipped zoom rocker; 44px Map/Brief segments and Layers rows; bounded Layers scrolling; accurate Saved/Close controls. |
| Records | Overview/Records navigation, persistent installation and tracking-ID context, optional ID titles, and type filters with counts. |
| Contacts | Optional email, phone, organization/section and primary flag; Email, Call, Copy and Edit actions. |
| Notes and links | Multiline expandable notes, pinning and dates; safe http/https link normalization, Open and Copy actions in both Records and Repository. |
| Entry | Labeled 16px inputs, keyboard-aware drawer bounds, visible filing destination, session drafts, inline validation, stale-edit protection and single-record Undo. |
| Search | Live contact, ID/title, note, link, detail and saved-brief results. Exact-record results use the canonical editor. Saved-brief loading still requires confirmation. |
| Saving | Per-installation local and cloud status based on acknowledged storage operations. Pending/failed writes cannot be mistaken for a confirmed current save. |
| Export | PDF, HTML and JSON can include selected record kinds under one installation/ID. Rich fields and organization labels travel in a copied snapshot. |
| Repeat visits | Optional Skip intro preference in the existing app menu; blank-slate launch stays intact. |

## Compatibility and boundaries

The single-file app, existing globe engine, Army roster, hierarchy, Map/Brief
separation, and existing database schema are preserved. Record buckets remain
installation-owned. Optional organization links are chosen per item; legacy
records stay installation-wide.

The record v1 format gains additive fields. New items receive stable `rid` values;
legacy items receive deterministic IDs when normalized. Canonical fingerprints
ignore object-key order. Backups retain both new and unknown fields. Older clients
cannot edit the new fields in their UI, so simultaneous use of old and new clients
has not been certified. Cloud conflict resolution remains per-installation
last-write-wins; this change does not introduce collaborative record merging.

Drafts and the most recent deletion Undo are session-only. The Saved badge means
the corresponding persistence operation completed; it is not a guarantee against
later device-storage eviction or a later remote edit.

## Verification

The five existing Node tools are the automated release gate:

```
node tools/data-lint.js
node tools/harness_globe.js
node tools/smoke_runtime.js
node tools/ship-lint.js
node tools/dead-lint.js
```

Smoke runs four focused checks in isolated processes: navigation geometry and
control semantics; record migration, drafts and exact-item editing; live search
and stable shelf confirmation; persistence races and filtered snapshot exports.
They use source-derived geometry and DOM/storage/network stubs, not a browser.

## Browser gate before release

The local preview was rejected by the browser environment with
`ERR_BLOCKED_BY_CLIENT`; the deployed app reaches Cloudflare Access sign-in.
This pull request is held in draft for these checks:

- At 390px and 414px, verify independent hit areas, safe-area spacing, Layers
  scrolling, search and drawer clearance, and both Map and Brief controls.
- With an iPhone keyboard open, edit a long note and verify Save stays reachable.
  Switch ID/filter/site and return to confirm draft and destination recovery.
- At desktop width, confirm control spacing and drawer reading flow.
- Open a contact from search, use Email/Call/Copy, and open/edit a Repository link.
- Inspect HTML/PDF output with long notes and selected IDs; exercise a JSON backup
  round trip containing legacy and rich records.
- With two authorized test devices, verify offline edit, reconnect, acknowledged
  sync and conflicting edits. Stub tests do not establish real cross-device parity.

No deployment or production-data changes are part of this implementation PR.
