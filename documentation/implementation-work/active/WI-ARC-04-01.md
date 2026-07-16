# WI-ARC-04-01: Establish Typed Cross-System Actions

## Properties

| Field | Value |
| --- | --- |
| State | ready |
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

- State in one sentence: Stable IDs, shared contracts, and the destination resolver are accepted; event semantics exist only in planning tables and local component behavior.
- Works now: `portfolioContracts.ts` defines payload types, `destinations.ts` resolves requested destinations, and current Zustand/component actions provide implementation examples.
- Incomplete or stubbed: There is no canonical action union, creator API, integration fixture, or transport-independent consumer boundary.
- Safe exposure: Begin with pure TypeScript data/functions and tests; do not wire visitor UI until the action contract is accepted.

### Known-Good Point

- Commit: `6a24533742867e738dbce86f5cdb81c8b570f97c`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test`, `npm run inventory:content`, and `npm run build` under Node.js 24.
- Verification result: 8 test files and 26 tests pass; inventory has 0 errors; lint has 0 errors and 11 retained warnings; production build passes.
- Route/preview: No route behavior changed in `ARC-02`/`ARC-03`; current production remains the visitor-safe baseline.

### Restart Here

- Next exact action: Translate the architecture event table into a minimal discriminated union, then identify the smallest reducer/handler fixture that proves destination requests use `resolveDestination`.
- First files/symbols: `src/lib/portfolioContracts.ts`, `src/lib/destinations.ts`, `src/lib/store.ts`, and `00-System-Architecture-And-Interfaces.md` Cross-System Events.
- Expected observable result: Exhaustive TypeScript handling covers every approved action and a destination request cannot carry an arbitrary href.
- Only after that: Decide adapter boundaries for Zustand, AI context, and transition control; defer runtime payload validation and persisted migration to `ARC-05`.

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
| Boundary | `ARC-05` | resolved | Do not absorb runtime validators or persistence migrations |

## Implementation Checklist

- [ ] Define the minimal discriminated action union.
- [ ] Add focused creators or constructors.
- [ ] Prove exhaustive handling in an integration fixture.
- [ ] Prove destination requests resolve by ID, not raw URL.
- [ ] Run tests, inventory, lint, and production build.
- [ ] Reconcile evidence, capability, package, dashboard, and resume records.

## Updates

### 2026-07-16 - Work item prepared

- State: planned -> ready.
- Changed: Bounded action work around shared semantics and pure integration, excluding UI migration and persistence.
- Verified: Dependencies pass 26 tests and the production build.
- Next: Implement the union and one exhaustive destination/depth/context fixture.
- Commit: `6a24533742867e738dbce86f5cdb81c8b570f97c`.

## Completion Summary

Complete only after the action vocabulary and integration fixture pass tests/build without global browser events or hidden runtime coupling.
