# EXP-08 Evidence

Last updated: 2026-07-24

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `EXP-08` Home attention and selected-practice behavior |
| Lifecycle | in-progress; pure contract accepted |
| Capabilities | `CAP-EXP-015`, supporting `CAP-ART-017` |
| Work item | `WI-ART-16-01` checkpoint `C` |
| Implementation | `2608c6b` |
| Exposure | Dormant pure state module; no React, route, or visual consumer yet |

## EV-EXP-08-01: Deterministic Territory Attention Contract

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | contract / unit-test |
| Claim | The Home world has deterministic equal neutral state, normalized local attention, one hysteretic dominant territory, focus and selection precedence, semantic restore, calm behavior, reduced-motion settlement, and predictable entered-to-selected-to-neutral retreat. |
| Evidence | `tests/homeAttention.test.ts` passes eight focused cases within the 55-file / 229-test suite; TypeScript and the production build pass. |

The model persists only selected territory and entered meaning. Raw weights, pointer proximity, and animation settlement are recreated, preventing fragile visual state from becoming navigation state.

## Named Gaps

- `HomeWorldStateProvider` and semantic DOM anchors do not consume the contract yet.
- Browser history, direct practice routes, AI cards, and tour doors remain Stage `H` with `ARC-06`.
- Runtime mount policy and visual weight interpretation remain `ART-16D-F`.

The pure contract is accepted. `EXP-08` remains in progress until its later route, tour, and AI adoption passes.
