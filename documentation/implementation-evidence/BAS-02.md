# BAS-02 Evidence

Last updated: 2026-07-14

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `BAS-02` Content inventory |
| Lifecycle | complete |
| Owner | Codex |
| Capabilities | `CAP-BAS-002` |
| Requirements | `V-11`, `V-19` |
| Work items | `WI-BAS-02-01` |
| Baseline code | `a88e2907388e1faf10a271ac1286ed0f910972fc` plus the `BAS-02` implementation commit |
| Target environment | Repository content, local tests, and local production build |
| Started | 2026-07-14 |
| Last assessed | 2026-07-14 |

## Scope Delivered

Added deterministic content-inventory logic, a read-only CLI with Markdown and JSON output, focused fixture and repository tests, and a reviewed baseline covering all authored content categories, identifier provenance, current loaders, AI ingestion, and content destinations.

## Evidence Items

### EV-BAS-02-01: Deterministic Inventory And Validation Tests

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | unit-test |
| Claim | Content classification, identity provenance, loader coverage, route derivation, structural validation, and repository integrity are deterministically tested |
| Capabilities | `CAP-BAS-002` |
| Dimensions | `A`, `I`, `T` |
| Requirements | `V-11`, `V-19` |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | `BAS-02` implementation commit |
| Environment | Windows, Node `20.20.2`, Vitest `2.1.9` |

#### Method

```powershell
$env:PATH=(Resolve-Path '.tools\node').Path+';'+$env:PATH
& '.tools\node\npm.cmd' test
```

#### Expected

Lint completes without errors and inventory tests prove normal classification plus missing metadata, duplicate keys, cross-namespace collisions, unclassified content, nested-blog coverage, and real-corpus integrity.

#### Actual

Exit code `0`; 2 test files and 5 tests passed. The 3 new content-inventory tests passed, including a repository assertion for 39 nodes, 0 structural errors, 4 filename fallbacks, 3 skipped blog posts, and 20 runtime/AI identifier divergences. The 8 pre-existing lint warnings remain unchanged.

### EV-BAS-02-02: Reviewed Content And Route Inventory

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | content-review |
| Claim | Every current authored content node and its identity, consumer, ingestion, and route status is inventoried with unresolved gaps named |
| Capabilities | `CAP-BAS-002` |
| Dimensions | `S`, `C`, `A`, `Q` |
| Requirements | `V-11`, `V-19` |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | `BAS-02` implementation commit |
| Environment | Repository filesystem and App Router source |

#### Method

```powershell
& '.tools\node\npm.cmd' run inventory:content
```

Inspect `src/content/`, the three runtime loaders, `scripts/ingest.ts`, `src/lib/projectSites.ts`, `src/middleware.ts`, and generated App Router output.

#### Actual

Recorded 39 nodes across 9 projects, 20 About events, 7 miscellaneous documents, and 3 blog posts. Found no structural errors, 4 missing authored identifiers, 20 About runtime/retrieval identity divergences, 3 blog ingestion gaps, and one valid cross-namespace `dreamlife` collision.

#### Artifacts

- `documentation/implementation-baselines/2026-07-14-Content-Inventory.md`
- `src/lib/contentInventory.ts`
- `scripts/content-inventory.ts`

### EV-BAS-02-03: Production Build Regression

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test |
| Claim | Inventory tooling and tests compile without changing the production route output |
| Capabilities | `CAP-BAS-002` |
| Dimensions | `I`, `T`, `R` |
| Requirements | Platform |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | `BAS-02` implementation commit |
| Environment | Local production build |

#### Actual

Exit code `0`; compilation and type checking passed; 24 of 24 static pages generated; route output matched the technical baseline. The same 8 pre-existing lint warnings and existing edge-runtime warning were recorded.

## Known Gaps

- Stable namespaced IDs and rename migration belong to `ARC-01`.
- Recursive shared loading and blog retrieval parity belong to `KG-01`.
- Shared content schemas belong to `KG-02`.
- This package deliberately did not modify the four filename-only miscellaneous files, including the user's unrelated edit in `ai-productivity-system.mdx`.

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-BAS-002` | all unknown | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified | on-track | high | `EV-BAS-02-01` through `EV-BAS-02-03` | `WI-BAS-02-01` | `ARC-01` stable-ID policy after baseline queue |

## Completion Decision

`BAS-02` is complete. Its reviewed inventory is reproducible, tests detect structural regressions, the production build passes, and every unresolved identity or coverage gap has a named downstream owner.
