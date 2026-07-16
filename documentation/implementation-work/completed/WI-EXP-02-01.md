# WI-EXP-02-01: Establish The First Controlled Depth Primitive

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `EXP-02` |
| Capabilities | `CAP-EXP-003`, `CAP-EXP-004` |
| Outcome | `O-01` |
| Owner | Codex |
| Last update | 2026-07-16 |

## Acceptance

A reusable controller owns the five-stage grammar, atomically synchronizes accepted transitions into persistence and source-owned AI context, rejects without mutation, cleans up on disposal, and exposes stable snapshots through a dormant React boundary without changing current routes.

## Completion Summary

- Final result: Pure transitions plus a headless controller support forward reasons, retreat, reset, restore, hints, typed actions, atomic discovery/checkpoint persistence, AI context, subscriptions, and idempotent cleanup.
- Controlled consumer: `DepthControllerProvider` and its hook render stable initial and transitioned snapshots in a server-controlled fixture.
- Test safety: Vitest now includes `.test.tsx`, so React consumer tests cannot be silently skipped.
- Verification: 75 tests in 21 files, strict typecheck, content validation, and production build pass.
- Evidence: `EV-EXP-02-01`, `EV-EXP-02-02`.
- Implementation: `4c9b02a`, `852e14c`.
- Safe exposure: No production route imports the provider; current visuals remain unchanged.
- Remaining work moved to: `WI-EXP-03-01` for the First Note and first visitor-facing browser flow.
