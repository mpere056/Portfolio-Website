# EXP-01 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `EXP-01` Versioned exploration store |
| Lifecycle | complete |
| Capabilities | `CAP-EXP-001`, `CAP-EXP-002` |
| Work item | `WI-EXP-01-01` |
| Implementation | `afa5f67` |

## EV-EXP-01-01: Persistence And Migration

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test |
| Claim | The dormant Zustand store is SSR-safe and supports per-origin hydration, v0 migration, partial recovery, semantic checkpoints, invalid-checkpoint rejection, and reset. |
| Evidence | `tests/experienceStore.test.ts` passes 6 memory-backed cases; the full 62-test suite and production build pass. |
| Safe exposure | Store is unmounted; current audio preferences, route history, cookies, and UI are unchanged. |

Package complete. `EXP-02` owns the first controlled UI consumer.
