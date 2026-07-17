# EXP-04 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `EXP-04` Non-linear guided tour |
| Lifecycle | complete |
| Capabilities | `CAP-EXP-007`, `CAP-EXP-008` |
| Work item | `WI-EXP-04-01` |
| Implementation | `4c80518` |
| Exposure | Development and Preview on; Production off pending creative rollout review |

## EV-EXP-04-01: Authored Any-Order Tour Contract

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | unit and integration tests |
| Claim | Role profiles are canonical and bounded; state records visits in any order; dismissal preserves role and recommendations; reset affects only tour state. |
| Evidence | `tests/guidedTour.test.ts`, `tests/experienceStore.test.ts`, and `tests/featureFlags.test.ts` pass 15 focused cases; strict typecheck passes. |

The tour contains no hidden-discovery IDs and resolves links through the destination registry rather than accepting authored raw URLs.

## EV-EXP-04-02: Role, Dismiss, Resume, And Route Flow

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | browser-flow |
| Environment | Local Development, in-app browser, `guidedTour=true` |
| Claim | Home offers one Quick Tour entry after First Note; role selection asks one purpose question; three unordered doors appear without progress UI; dismiss becomes Resume; a selected destination preserves the tour on `/projects`. |
| Evidence | DOM-backed browser flow against `http://localhost:3000/`, including Home AI doorway coexistence and `/projects#lifeinbox` navigation. |

## Boundaries After Completion

- Recommendations are deliberately authored rather than inferred dynamically from visitor behavior.
- The quick tour does not expose easter eggs; free exploration retains unique value.
- Production remains unchanged until the combined Phase 2 Preview receives creative review.

Package complete. `EXP-05` is next for the controlled discovery-physics and semantic-lighting prototype.

