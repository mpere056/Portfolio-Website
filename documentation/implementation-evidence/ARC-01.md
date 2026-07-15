# ARC-01 Evidence

Last updated: 2026-07-14

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `ARC-01` Stable ID policy |
| Lifecycle | in-progress |
| Capability | `CAP-ARC-001` |
| Work item | `WI-ARC-01-01` |
| Implementation commit | pending |

## Candidate Evidence

### EV-ARC-01-01: Canonical Content ID Contract And Fixtures

| Field | Value |
| --- | --- |
| Status | candidate |
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

- 5 test files and 13 tests passed.
- Lint completed with 0 errors and 14 retained warnings.
- Tests cover all four current content categories, path classification and shared derivation, invalid case/path shapes, canonical recognition, explicit alias resolution, inventory namespace output, duplicate scoped IDs, and repository inventory integrity.
- Inventory reports 39 nodes, 38 authored identifiers, 1 filename fallback, 0 inventory/ingestion identity divergences, and 0 structural errors.
- The Next.js 16 production build compiles and typechecks with the existing font network available.

#### Candidate Boundary

This evidence remains candidate until the committed ingestion migration is previewed and the managed retrieval corpus is re-indexed and verified. The one separately edited misc file remains an explicit authored-ID gap.

## Current Gaps

- One separately edited miscellaneous record still uses a filename fallback ID.
- The managed retrieval corpus still needs a one-time re-index from bare legacy IDs to canonical IDs.
- Nested project posts remain outside ingestion; shared recursive traversal belongs to `KG-01` after ID policy acceptance.
- No alias is currently needed, so the resolver has fixtures but no production alias registry entry.
