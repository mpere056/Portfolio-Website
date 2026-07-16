# WI-EXP-01-01: Establish The Versioned Exploration Store

## Properties

| Field | Value |
| --- | --- |
| State | ready |
| Priority | high |
| Package | `EXP-01` |
| Capabilities | `CAP-EXP-001`, `CAP-EXP-002` |
| Requirements | `V-05`, `V-20`, `V-23` |
| Outcome | `O-01` |
| Milestone | A dormant per-origin exploration store hydrates, migrates, checkpoints, and resets semantic state safely before visitor-facing depth features depend on it |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

Implement a dedicated Zustand exploration store around the accepted version-1 semantic envelope; inject storage so deterministic memory tests cover SSR-safe defaults, current hydration, v0 migration, corrupt-section recovery, unknown-version fallback, per-origin key derivation, semantic checkpoint updates, and full reset; expose focused store actions without importing components or Three.js state; keep the store dormant and leave First Note, depth-controller UI, cookies, history, and current audio-preference migration to their owning packages; pass tests and production build.

## Resume Packet

### Current Truth

- State in one sentence: Semantic state validation and migration are accepted as pure functions, but no client store or storage adapter uses them.
- Works now: Version-1 defaults/types, structured parse outcomes, v0 migration, partial section reset, and destination-safe checkpoints pass 37 tests.
- Incomplete or stubbed: There is no exploration Zustand store, storage key policy, hydration adapter, reset action, or memory-storage integration fixture.
- Safe exposure: Build a dormant module and tests first; do not mount it in the current portfolio UI.

### Known-Good Point

- Commit: pending focused implementation commit.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test`, `npm run inventory:content`, and `npm run build` under Node.js 24.
- Verification result: 10 test files and 37 tests pass; inventory has 0 errors and 0 identity divergences; lint has 0 errors and 11 retained warnings; production build passes.
- Route/preview: `ARC-05` changes no visitor behavior; current production remains the visitor-safe baseline.

### Restart Here

- Next exact action: Inspect Zustand 4 persist/vanilla APIs and write a memory-storage fixture for defaults, v0 hydration, partial reset, checkpoint update, and reset.
- First files/symbols: `src/lib/portfolioValidation.ts`, persisted contracts in `src/lib/portfolioContracts.ts`, `src/lib/store.ts`, and Zustand `createStore`/`persist` APIs.
- Expected observable result: A fresh store is SSR-safe, a supplied per-origin adapter hydrates only accepted state, and reset returns the exact canonical defaults.
- Only after that: Mount the store through First Note or one controlled depth primitive in later work items.

### Context That Must Survive

- Use one dedicated exploration module; do not merge audio elements or timeline scroll state into the semantic store.
- Storage keys must be versioned and origin-specific; cross-origin global preferences still require a later approved cookie adapter.
- Persist semantic IDs and bounded safe state only, never camera matrices, React state, Three.js objects, or AI conversation text.
- Hydration must call `parsePersistedExperienceState`; do not trust Zustand's generic type assertion.
- Current `siteAudioMuted` and `siteAudioConsent` values remain unchanged.
- Preserve unrelated local changes and all secret/tooling files.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `ARC-02` | resolved | Shared state contracts accepted |
| Package | `ARC-05` | resolved | Runtime parsing and migration accepted |
| Boundary | Cross-origin cookie | resolved | Explicitly excluded from this dormant per-origin store |
| Downstream | `EXP-02`, `EXP-03` | waiting | Depth and First Note consumers wait for store acceptance |

## Implementation Checklist

- [ ] Confirm Zustand vanilla/persist integration seam.
- [ ] Add injectable memory-storage fixtures before implementation.
- [ ] Implement versioned per-origin storage-key policy.
- [ ] Implement dormant store, hydration, checkpoint, and reset actions.
- [ ] Prove v0 migration, partial reset, unknown-version fallback, and SSR defaults.
- [ ] Run tests, inventory, lint, and production build.
- [ ] Reconcile evidence, capability, package, dashboard, and resume records.

## Updates

### 2026-07-16 - Work item prepared

- State: planned -> ready.
- Changed: Bounded the first exploration increment around dormant, injectable, versioned state infrastructure rather than visitor UI.
- Verified: `ARC-05` dependencies pass 37 tests and the production build.
- Next: Write memory-storage fixtures around Zustand vanilla/persist behavior.
- Commit: pending focused implementation commit.

## Completion Summary

Complete only after the dormant store proves deterministic hydration, migration, per-origin isolation, semantic checkpoints, and reset without changing current visitor behavior.
