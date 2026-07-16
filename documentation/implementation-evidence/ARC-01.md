# ARC-01 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `ARC-01` Stable ID policy |
| Lifecycle | complete |
| Capability | `CAP-ARC-001` |
| Work item | `WI-ARC-01-01` |
| Implementation commit | `fe64bb6` |

## Accepted Evidence

### EV-ARC-01-01: Canonical Content ID Contract And Fixtures

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | unit-test |
| Claim | Canonical content IDs are deterministic, namespaced, validated, and able to resolve explicit legacy aliases |
| Dimensions | `A`, `I`, `T` |
| Requirements | `V-10`, `V-11` |
| Date | 2026-07-14 |
| Reviewer | Codex |

#### Method

```powershell
$env:PATH = '<Node 24>;' + (Resolve-Path '.tools\node').Path + ';' + $env:PATH
& '.tools\node\npm.cmd' test
```

#### Actual

- 6 test files and 17 tests passed after the Firestore adapter was added.
- Lint completed with 0 errors and 11 retained warnings.
- Tests cover all four current content categories, path classification and shared derivation, invalid case/path shapes, canonical recognition, explicit alias resolution, inventory namespace output, duplicate scoped IDs, and repository inventory integrity.
- Inventory reports 39 nodes, 38 authored identifiers, 1 filename fallback, 0 inventory/ingestion identity divergences, and 0 structural errors.
- The Next.js 16 production build compiles and typechecks with the existing font network available.

#### Acceptance Boundary

`BAS-08` re-indexed the managed Firestore corpus and verified canonical IDs in local retrieval, exact-commit Preview, and Production. The separately edited misc file keeps its deterministic validated fallback ID; a future authored rename must add an explicit alias rather than silently changing identity.

## Current Gaps

- One separately edited miscellaneous record intentionally retains a deterministic filename fallback until a separately reviewed authored rename.
- Nested project posts remain outside ingestion; shared recursive traversal belongs to `KG-01` after ID policy acceptance.
- No alias is currently needed, so the resolver has fixtures but no production alias registry entry.

## Supporting Rollout Evidence

- `EV-BAS-08-03` proves 42 managed chunks cover 36 canonical IDs through the ready vector index.
- `EV-BAS-08-04` proves exact-commit Preview retrieval returns canonical DreamLife IDs.
- `EV-BAS-08-05` proves the same canonical retrieval contract in Production.

## Completion Decision

Complete. Constructors, validation, explicit alias behavior, inventory/ingestion parity, deterministic fallback policy, canonical managed-corpus rollout, tests, build, Preview, and Production evidence are accepted. Recursive loading remains correctly owned by `KG-01`.
