# WI-PRJ-01-01: Establish The Shared Exhibit Foundation

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `PRJ-01` |
| Capabilities | `CAP-PRJ-001`, `CAP-PRJ-002` |
| Requirements | `V-10`, `V-14` |
| Outcome | `O-03` |
| Owner | Codex |
| Last update | 2026-07-17 |

## Acceptance

Every authored project resolves to one validated exhibit definition and stable museum anchor; the three flagship definitions can load a small project manifest lazily; unknown, missing, and failed experience modules preserve useful project copy and canonical navigation through a shared fallback shell; unit and integration tests cover registry validity, lazy loading, and direct links without replacing the current `/projects` presentation prematurely.

## Completion Summary

- All nine authored projects derive one exhibit from canonical content and destination records; no project copy is duplicated in the registry.
- Dreamlife, LifeInbox, and Sudoku Together expose lazy manifests whose IDs, project ownership, evidence, and implemented depth stages are runtime-validated.
- Unknown exhibits, unsupported depth, unavailable graph context, absent modules, rejected modules, and project-manifest mismatches fail into stable museum navigation and authored semantic HTML.
- The current `/projects` client remains unchanged; `PRJ-03` owns visitor integration after the foundation is proven.
- Verification: 134 tests in 33 files, strict TypeScript, repository lint with ten pre-existing warnings and no errors, 49-node/19-relationship content validation, and a production build with build ID `O2KzZ9-28VnhxGnym9fce` pass.
- Evidence: `EV-PRJ-01-01`, `EV-PRJ-01-02`.
- Implementation: `e462080`.
- Remaining work moved to: `WI-PRJ-02-01` for bounded LifeInbox/Sudoku feasibility and `PRJ-08` for visitor-facing URL/history and cross-domain depth integration.
