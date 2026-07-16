# WI-ARC-05-01: Establish Runtime Validation And Migration Boundaries

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `ARC-05` |
| Capabilities | `CAP-ARC-005` |
| Requirements | `V-05`, `V-07`, `V-10`, `V-20` |
| Outcome | `O-00` |
| Milestone | Untrusted shared-contract inputs fail safely and versioned semantic state has explicit compatibility behavior before persistence or UI adoption |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

Inventory actual untrusted and persisted boundaries; implement dependency-light runtime validation for the accepted action and destination-request contracts; define a minimal versioned semantic-state envelope and explicit migration path without wiring localStorage; ignore unknown fields, preserve valid sections, and reset only invalid portions; prove current, old-version, unknown-version, and malformed fixtures; pass tests and production build; and leave Zustand persistence, reset UI, cookies, and feature adoption to `EXP-01` and downstream packages.

## Resume Packet

### Current Truth

- State in one sentence: Untrusted shared actions and destination requests now parse through structured validation, and semantic experience state has explicit current, migrated, partial-reset, and rejected outcomes.
- Works now: All seven actions validate IDs and invariants; destinations reuse registry policy; version 1 ignores unknown fields; flat version 0 migrates explicitly; corrupt sections reset independently; unknown versions fail to defaults.
- Incomplete or stubbed: No browser storage, Zustand persistence, reset UI, cookie handoff, or feature adapter consumes these contracts yet.
- Safe exposure: Pure parsing, migration, guards, defaults, and synthetic tests only; current visitor state and routes are unchanged.

### Known-Good Point

- Commit: `d5fca116729787c49725d38c58e6183ea2470428`; dependency baseline `55e6104e4fee32b5f4f004a0f171fe40c4af2ced`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test`, `npm run inventory:content`, and `npm run build` under Node.js 24.
- Verification result: 10 test files and 37 tests pass; inventory has 0 errors and 0 identity divergences; lint has 0 errors and 11 retained warnings; production build passes.
- Route/preview: `ARC-04` changes no visitor behavior; current production remains the visitor-safe baseline.

### Restart Here

- Next exact action: Begin `WI-EXP-01-01` by defining a dormant Zustand store and injectable storage adapter around the accepted semantic envelope.
- First files/symbols: `src/lib/portfolioValidation.ts`, persisted types in `portfolioContracts.ts`, existing `src/lib/store.ts`, and Zustand persist APIs.
- Expected observable result: Memory-adapter tests prove hydration, migration, per-origin keys, semantic checkpoints, and reset without mounting visitor UI.
- Only after that: Add first visitor-facing depth/discovery consumers through separate experience packages.

### Context That Must Survive

- TypeScript types do not validate untrusted runtime values.
- Destination resolution remains the authority for registry availability, safe-state allowlists, and fallback behavior.
- Migration must preserve semantic IDs, never raw component/camera/Three.js state.
- Unknown object fields are ignored; unknown schema versions fail safely; one invalid section must not erase unrelated valid state.
- No accounts, server visitor profiles, billing, or new service are needed.
- Preserve unrelated local changes and all secret/tooling files.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `ARC-02` | resolved | Shared payload and identity contracts accepted |
| Package | `ARC-03` | resolved | Destination availability and safe-state policy accepted |
| Package | `ARC-04` | resolved | Canonical action union and creators accepted |
| Downstream | `EXP-01` | ready | Adopt the accepted envelope through a dormant, testable browser-storage adapter |

## Implementation Checklist

- [x] Inventory untrusted and persisted contract boundaries.
- [x] Add malformed and old-version fixtures before implementation.
- [x] Implement structured action and destination-request validation.
- [x] Implement the minimal semantic-state envelope and explicit migration.
- [x] Prove partial preservation, selective reset, and unknown-version failure.
- [x] Run tests, inventory, lint, and production build.
- [x] Reconcile evidence, capability, package, dashboard, and resume records.

## Updates

### 2026-07-16 - Runtime compatibility foundation accepted

- State: in-progress -> done.
- Changed: Accepted structured action/destination validation, bounded version-1 semantic state, explicit flat-v0 migration, unknown-field tolerance, section-isolated reset, and unknown-version rejection.
- Verified: 10 test files and 37 tests pass; inventory has 0 errors and 0 identity divergences; lint has 0 errors; the production build typechecks and emits all 26 pages.
- Evidence: `EV-ARC-05-01` accepted.
- Next: `WI-EXP-01-01` dormant versioned exploration store and storage-adapter tests.
- Commit: `d5fca116729787c49725d38c58e6183ea2470428`.

### 2026-07-16 - Boundary inventory and fixtures started

- State: ready -> in-progress.
- Changed: Reviewed live and planned trust/storage boundaries and added canonical, malformed, current, corrupt-section, legacy-v0, and unknown-version fixtures.
- Boundary: Existing audio localStorage remains separate; no browser persistence, cookie, URL, or Zustand adapter is introduced.
- Next: Implement the dependency-light parser, semantic-state contracts, and explicit v0-to-v1 migration until the fixtures pass.
- Commit: worktree after `404f2f8`.

### 2026-07-16 - Runtime validation and migration fixture passes

- Changed: Added shared ID/version guards, seven-action runtime parsing, registry-backed destination validation, bounded semantic-state parsing, section-isolated reset, and explicit flat-v0 to sliced-v1 migration.
- Verified: Focused ARC-05 tests pass; the full suite reaches 10 files and 37 tests with 0 lint errors; inventory reports 0 errors and 0 identity divergences.
- Failures retained: Production typechecking found two inference gaps without runtime failures: project-prefix checking did not narrow to `ProjectNodeId`, and a generic destination-list failure branch widened success to `unknown`. Explicit type predicates/return types preserve the stricter contracts.
- Next: Re-run the production build, then reconcile package evidence and the `EXP-01` handoff.
- Commit: uncommitted.

### 2026-07-16 - Work item prepared

- State: planned -> ready.
- Changed: Bounded runtime validation and pure migration behavior separately from browser storage and feature adoption.
- Verified: Dependencies pass 29 tests, inventory, lint, and the production build.
- Next: Inventory trust/storage boundaries and write failing malformed/current/old-version fixtures.
- Commit: `55e6104e4fee32b5f4f004a0f171fe40c4af2ced`.

## Completion Summary

Complete. Untrusted contract inputs and versioned semantic state now have deterministic acceptance, rejection, migration, unknown-field tolerance, and section-isolated reset without browser-storage coupling.
