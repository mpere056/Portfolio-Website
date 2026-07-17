# PRJ-01 Evidence

Last updated: 2026-07-17

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `PRJ-01` Exhibit registry and shell |
| Lifecycle | complete |
| Capabilities | `CAP-PRJ-001`, `CAP-PRJ-002` |
| Work item | `WI-PRJ-01-01` |
| Implementation | `e462080` |
| Exposure | Additive foundation only; the existing `/projects` visitor UI is unchanged |

## EV-PRJ-01-01: Registry, Lazy Loading, And Direct Entry

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | contract and integration tests |
| Claim | All nine authored projects resolve through canonical graph and destination IDs; three explicit flagship manifests load only when requested; invalid ownership, unsupported depth, missing modules, failed modules, unknown exhibits, and malformed anchors fail closed. |
| Evidence | `tests/museumRegistry.test.ts` and `tests/museumExhibits.test.tsx` pass 11 focused cases; the full 33-file suite passes 134 tests; strict TypeScript and ESLint pass with only the ten pre-existing warnings. |

## EV-PRJ-01-02: Graph Boundary, Semantic Fallback, And Build

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration test and production build |
| Claim | The server adapter emits serializable public exhibit views and preserves authored names, headlines, summaries, technology labels, stable anchors, and project-world links when a product module is absent or rejects. |
| Evidence | Server-rendered fallback assertions pass for LifeInbox and failed-module behavior; content validation passes 49 nodes and 19 relationships; Next.js 16.2.10 produces build ID `O2KzZ9-28VnhxGnym9fce`. |

## Boundaries After Completion

- `supportedStages` names implemented depth only; all current manifests stop at Approach rather than claiming unfinished Handle/Enter/Understand behavior.
- The fallback shell is a dependable integration target, not the final museum art direction.
- No project API, production data, authentication, paid service, or visitor-facing route changed.
- `PRJ-02` selects the first product interaction; `PRJ-03` integrates Signal/Approach; `PRJ-08` completes URL/history and cross-domain depth behavior.
