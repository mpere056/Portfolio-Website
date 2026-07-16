# WI-EXP-01-01: Establish The Versioned Exploration Store

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `EXP-01` |
| Capabilities | `CAP-EXP-001`, `CAP-EXP-002` |
| Outcome | `O-01` |
| Owner | Codex |
| Last update | 2026-07-16 |

## Acceptance

A dormant Zustand store safely hydrates, migrates, checkpoints, isolates, and resets versioned semantic state without changing current visitor behavior.

## Completion Summary

- Final result: Per-origin keys, injectable storage, explicit hydration, v0 migration, partial recovery, semantic actions, invalid-checkpoint rejection, and reset are implemented.
- Verification: `tests/experienceStore.test.ts` passes 6 cases; the 61-test suite and production build pass.
- Evidence: `EV-EXP-01-01` in `implementation-evidence/EXP-01.md`.
- Safe boundary: Store remains unmounted; cookies, route history, audio migration, and First Note are excluded.
- Final implementation: `afa5f67`.
- Remaining work moved to: `EXP-02` for one controlled depth consumer.
