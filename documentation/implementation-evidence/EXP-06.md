# EXP-06 Evidence

Last updated: 2026-07-17

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `EXP-06` Meaningful discovery registry |
| Lifecycle | complete |
| Capabilities | `CAP-EXP-012`, `CAP-EXP-013` |
| Work item | `WI-EXP-06-01` |
| Implementation | `51b2e7d` |
| Exposure | Development and Preview on; Production off pending combined creative review |

## EV-EXP-06-01: Registry, Conditions, Safety, And Persistence

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | unit and integration tests |
| Claim | Exactly three public discoveries cover personal, technical, and relational meaning; explicit prerequisites fail closed; no page load completes a discovery; all entries are absent from tour profiles and persist without score UI. |
| Evidence | `tests/discoveries.test.ts`, `tests/experienceStore.test.ts`, `tests/guidedTour.test.ts`, `tests/environment.test.ts`, and `tests/featureFlags.test.ts` pass 26 focused cases; strict typecheck and touched-file lint pass. |

## EV-EXP-06-02: Free-Exploration Browser Flow

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | browser and visual review |
| Environment | Local Development, Home, About, and Projects |
| Claim | Keyboard discovery reveals the personal artifact; understanding the relationship instrument reveals the technical lesson; both unlock the relational insight on Home; closing and reloading does not reopen cards or expose scores/counts. |
| Evidence | DOM-backed browser flow and viewport visual review against `http://localhost:3000`; reset returns the world to First Note without stale discovery state. |

## Boundaries After Completion

- Discoveries communicate understanding rather than trivia or completion pressure.
- They are available only through free exploration and never appear in tour recommendations.
- Production remains unchanged until the combined Phase 2 Preview receives creative review.

Package complete. The aggregate Phase 2 release audit is tracked by `WI-QA-01-02`.
