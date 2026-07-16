# WI-ARC-05-01: Establish Runtime Validation And Migration Boundaries

## Properties

| Field | Value |
| --- | --- |
| State | ready |
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

- State in one sentence: Compile-time contracts, destination resolution, and typed local actions are accepted, but JavaScript values crossing storage, URL, AI, or message boundaries are not generically validated or migrated.
- Works now: Destination resolution safely handles unknown IDs and unsafe state; action creators preserve trusted local invariants; experience planning defines semantic persistence and partial-reset rules.
- Incomplete or stubbed: There is no reusable runtime action parser, versioned semantic-state envelope, migration registry, issue result, or old/corrupt-state fixture.
- Safe exposure: Implement pure parsing and migration functions plus synthetic tests only; do not read or write browser storage in this work item.

### Known-Good Point

- Commit: pending focused implementation commit.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test`, `npm run inventory:content`, and `npm run build` under Node.js 24.
- Verification result: 9 test files and 29 tests pass; inventory has 0 errors and 0 identity divergences; lint has 0 errors and 11 retained warnings; production build passes.
- Route/preview: `ARC-04` changes no visitor behavior; current production remains the visitor-safe baseline.

### Restart Here

- Next exact action: Inventory every current and planned boundary that can supply untrusted actions, destination requests, or persisted semantic state, then write failing malformed/current/old-version fixtures.
- First files/symbols: `src/lib/portfolioActions.ts`, `src/lib/portfolioContracts.ts`, `src/lib/destinations.ts`, and `02-Experience-Foundation.md` persistence slices.
- Expected observable result: A parser accepts canonical action payloads, rejects malformed IDs/state with structured issues, and a pure migration preserves valid semantic sections while resetting only invalid portions.
- Only after that: Wire the accepted parser/migration into a versioned store in `EXP-01`.

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
| Downstream | `EXP-01` | waiting | Storage adoption begins only after validation/migration acceptance |

## Implementation Checklist

- [ ] Inventory untrusted and persisted contract boundaries.
- [ ] Add malformed and old-version fixtures before implementation.
- [ ] Implement structured action and destination-request validation.
- [ ] Implement the minimal semantic-state envelope and explicit migration.
- [ ] Prove partial preservation, selective reset, and unknown-version failure.
- [ ] Run tests, inventory, lint, and production build.
- [ ] Reconcile evidence, capability, package, dashboard, and resume records.

## Updates

### 2026-07-16 - Work item prepared

- State: planned -> ready.
- Changed: Bounded runtime validation and pure migration behavior separately from browser storage and feature adoption.
- Verified: Dependencies pass 29 tests, inventory, lint, and the production build.
- Next: Inventory trust/storage boundaries and write failing malformed/current/old-version fixtures.
- Commit: pending focused implementation commit.

## Completion Summary

Complete only after untrusted contract inputs and versioned semantic state have deterministic acceptance, rejection, migration, and partial-reset behavior without browser-storage coupling.
