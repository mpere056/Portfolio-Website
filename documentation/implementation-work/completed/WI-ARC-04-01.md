# WI-ARC-04-01: Establish Typed Cross-System Actions

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `ARC-04` |
| Capabilities | `CAP-ARC-004` |
| Requirements | `V-01`, `V-03`, `V-05`, `V-09`, `V-10`, `V-12` |
| Outcome | `O-00` |
| Milestone | Depth, destinations, relationships, discovery, stimulation, AI context, project state, and experience failures share typed actions without a global browser event bus |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

Define one discriminated union and focused action creators for the approved cross-system event vocabulary; carry destination and node IDs rather than raw URLs or factual content; prove one integration fixture can update depth/AI context and request a validated destination without browser-global events; preserve transport independence; pass tests and production build; and leave persistent migrations and UI-store adoption to later packages.

## Resume Packet

### Current Truth

- State in one sentence: Seven approved cross-system semantics now share one typed, transport-independent action union and focused creator API.
- Works now: Plain action objects carry stable IDs and bounded state; creators preserve local invariants; an exhaustive fixture updates depth/AI context and resolves destinations without arbitrary URLs or browser-global events.
- Incomplete or stubbed: Runtime validation and migration remain in `ARC-05`; UI/store adapters remain in their owning experience and AI packages.
- Safe exposure: Foundation-only TypeScript and tests; no visitor-facing component, persisted state, or production route behavior changed.

### Known-Good Point

- Commit: pending focused implementation commit; dependency baseline `6a24533742867e738dbce86f5cdb81c8b570f97c`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test`, `npm run inventory:content`, and `npm run build` under Node.js 24.
- Verification result: 9 test files and 29 tests pass; inventory has 0 errors and 0 identity divergences; lint has 0 errors and 11 retained warnings; production build passes.
- Route/preview: No route behavior changed in `ARC-02`/`ARC-03`; current production remains the visitor-safe baseline.

### Restart Here

- Next exact action: Begin `WI-ARC-05-01` by inventorying untrusted and persisted contract boundaries before defining runtime validators.
- First files/symbols: `src/lib/portfolioActions.ts`, `src/lib/portfolioContracts.ts`, `src/lib/destinations.ts`, and persistence guidance in `02-Experience-Foundation.md`.
- Expected observable result: Invalid and old-version inputs fail or migrate predictably without weakening compile-time contracts.
- Only after that: Add store, AI, transition, or persistence adapters in their owning packages.

### Context That Must Survive

- The action table defines semantics, not a mandatory event-emitter implementation.
- Prefer typed functions, reducers, or store actions over `window.dispatchEvent`.
- Actions carry IDs and bounded primitive state; server/build systems resolve facts.
- `ARC-05` owns untrusted runtime validation and compatibility migrations.
- Existing components continue to work until adapters are tested.
- Preserve unrelated local changes and all secret/tooling files.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `ARC-02` | resolved | Shared payload contracts accepted |
| Package | `ARC-03` | resolved | Destination IDs resolve safely |
| Downstream | `ARC-05` | ready | Validate untrusted action/state inputs and define compatibility behavior without wiring storage |

## Implementation Checklist

- [x] Define the minimal discriminated action union.
- [x] Add focused creators or constructors.
- [x] Prove exhaustive handling in an integration fixture.
- [x] Prove destination requests resolve by ID, not raw URL.
- [x] Run tests, inventory, lint, and production build.
- [x] Reconcile evidence, capability, package, dashboard, and resume records.

## Updates

### 2026-07-16 - Typed action foundation accepted

- State: in-progress -> done.
- Changed: Added seven discriminated actions, typed ID-first payloads, focused creators, finite `0..1` stimulation normalization, and an exhaustive integration fixture.
- Verified: 9 test files and 29 tests pass; inventory reports 0 errors and 0 identity divergences; lint has 0 errors; the production build emits all 26 pages.
- Evidence: `EV-ARC-04-01` accepted.
- Next: `WI-ARC-05-01` runtime validation and migration boundaries.
- Commit: pending focused implementation commit.

### 2026-07-16 - Action contract implementation started

- State: ready -> in-progress.
- Changed: Began the pure discriminated action union, creator API, and exhaustive integration fixture without wiring visitor UI.
- Safe boundary: Runtime payload validation and persistence remain in `ARC-05`; no global browser events are introduced.
- Next: Run the focused tests, then the full inventory/lint/build gates.
- Commit: worktree after `4bc76c3`.

### 2026-07-16 - Work item prepared

- State: planned -> ready.
- Changed: Bounded action work around shared semantics and pure integration, excluding UI migration and persistence.
- Verified: Dependencies pass 26 tests and the production build.
- Next: Implement the union and one exhaustive destination/depth/context fixture.
- Commit: `6a24533742867e738dbce86f5cdb81c8b570f97c`.

## Completion Summary

Complete. The approved event vocabulary now has a canonical typed representation and focused creators, and the exhaustive integration fixture proves destination/depth/context behavior without global browser events or hidden runtime coupling.
