# PRJ-04 Evidence

Last updated: 2026-07-18

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `PRJ-04` First full flagship slice |
| Lifecycle | complete |
| Capabilities | `CAP-PRJ-005`, `CAP-PRJ-006`, `CAP-LIB-001` through `CAP-LIB-003` |
| Work item | `WI-PRJ-04-01` |
| Implementation | `1ccb0e7`, rollback correction `013d74a` |

## EV-PRJ-04-01: Signal-To-Understand Product Journey

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test and browser-flow |
| Claim | LifeInbox progresses from Signal and reviewed Approach through a deterministic Handle capture, focused Enter system map, and evidence-grounded Understand layer while transient edits remain local. |
| Evidence | `tests/lifeInboxExperience.test.tsx`, museum registry/navigation tests, and local browser execution of capture, organization, Enter, Understand, and refresh restoration. |

## EV-PRJ-04-02: Evidence, Persistence, And Project-World Handoff

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | browser-flow and content-review |
| Claim | The experience distinguishes verified local storage from illustrative organization, stores semantic depth only, exposes repository/field-note evidence, and provides canonical project-world and exact museum-return links. |
| Evidence | Local browser verified `/projects?stage=understand#lifeinbox`, repository and field-note links, `https://lifeinbox.marknperera.ca/`, and its return to the exact Understand URL. |

## EV-PRJ-04-03: Lazy Loading, Calm Path, And Failure Boundary

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | performance and integration-test |
| Claim | The nine-signal lobby does not eagerly load the LifeInbox interaction; reduced motion, sound-off, native keyboard controls, mobile reading, module failure, and selected-experience rollback retain essential meaning and navigation. |
| Evidence | Production output isolates LifeInbox in a 7,819-byte JavaScript chunk; desktop and 390x844 reviews pass; `ExhibitExperienceBoundary` preserves identity/handoff; `013d74a` makes `lifeinboxExperience` an enforced Preview/Production boundary. |

## Boundaries After Completion

- This proves one authored LifeInbox layer, not generalized all-project routing or multiple autopsy layers.
- The retained Sudoku reducer remains input to `PRJ-06`; Dreamlife remains `PRJ-05`.
- The interaction is a clearly labeled local simulation and does not call the LifeInbox production service.

