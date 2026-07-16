# EXP-02 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `EXP-02` Depth-controller primitives |
| Lifecycle | complete |
| Capabilities | `CAP-EXP-003`, `CAP-EXP-004` |
| Work item | `WI-EXP-02-01` |
| Implementation | `4c9b02a` |
| Exposure | Dormant pure module; no current UI consumer |

## EV-EXP-02-01: Five-Stage Transition Contract

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | contract |
| Claim | Signal, Approach, Handle, Enter, and Understand have explicit reason-bound adjacent progression, one-step retreat, reset, and semantic restore behavior. |
| Evidence | `tests/depthTransitions.test.ts` passes 5 cases within the 68-test suite. |

Accepted transitions emit the existing typed action, semantic checkpoint, and AI context together. Skips, wrong reasons, and destination mismatches are rejected without producing effects.

## EV-EXP-02-02: Atomic Controller And Consumer Boundary

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test |
| Claim | One headless controller atomically applies accepted transitions to persistence, AI context, actions, and observers; rejected transitions mutate none; disposal removes only owned context. |
| Evidence | `tests/depthController.test.ts`, `tests/depthControllerProvider.test.tsx`, and atomic store fixture; full suite passes 75 tests in 21 files and production build passes. |

The dormant React provider exposes stable snapshots to a controlled server-rendered consumer. Vitest now includes `.test.tsx`, preventing future React tests from being silently skipped.

## Boundaries After Completion

- No production route mounts the provider, so current visuals and history are unchanged.
- Pointer, keyboard, browser history, and creative behavior begin with visitor-facing packages such as `EXP-03` and project consumers.
- Tour integration belongs to `EXP-04`; stimulation mapping belongs to `EXP-05`.

Package complete. Its reusable contract is ready for First Note and later project experiences.
