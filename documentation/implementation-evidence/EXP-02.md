# EXP-02 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `EXP-02` Depth-controller primitives |
| Lifecycle | in-progress |
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

## Named Gaps

- No headless controller applies transition outputs to the exploration and AI stores yet.
- No controlled React/scene consumer, keyboard/pointer interaction, history behavior, or browser integration test exists.
- Visual hints, tour integration, and stimulation consumers remain unimplemented; stimulation belongs primarily to `EXP-05`.

The package remains in progress until a controlled consumer proves persistence hooks, context ownership/cleanup, and accepted/rejected behavior end to end.
