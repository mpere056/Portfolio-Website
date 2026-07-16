# WI-ARC-03-01: Build The Destination Registry

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `ARC-03` |
| Capabilities | `CAP-ARC-003` |
| Requirements | `V-07`, `V-10` |
| Outcome | `O-00` |
| Milestone | Known destinations resolve to validated routes and safe state while unknown requests fall back predictably |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

Inventory the current portfolio and project-subdomain destinations; implement a typed data-only registry and resolver with explicit fallback, checkpoint, and cross-subdomain policies; reject unknown IDs and unsupported safe-state keys in focused tests; preserve every existing route; and keep navigation UI, global actions, persistence migrations, and graph-driven destinations outside this increment.

## Resume Packet

### Current Truth

- State in one sentence: The approved information architecture now has a reviewed inventory, typed 27-entry registry, pure resolver, safe fallback policy, and passing parity/safety/build gates.
- Works now: Every current project/site/blog post has a stable destination; canonical and compatibility requests resolve; unavailable and unsafe requests fall back; navigation mode is explicit across origins.
- Incomplete or stubbed: Existing UI links do not consume the registry yet; typed action transport belongs to `ARC-04`, and generic runtime validation/persistence belongs to `ARC-05`.
- Safe exposure: The registry is foundation-only, so current visitor navigation remains unchanged while consumers migrate incrementally.

### Known-Good Point

- Commit: `6a24533742867e738dbce86f5cdb81c8b570f97c`; shared-contract implementation began at `91e6d54`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test` and `npm run build` under Node.js 24.
- Verification result: 8 files and 26 tests pass; inventory has 0 errors; lint has 0 errors and 11 retained warnings; production build passes.
- Route/preview: Production `dpl_Ai2hdKjwLugHNV8jPqbGnUz9vVPj` is the current visitor-safe baseline; all seven public routes, retrieval, and grounded chat passed.
- Feature flags: None; do not wire the registry into navigation until registry parity and fallbacks pass.

### Restart Here

- Next exact action: Begin `WI-ARC-04-01` and define typed cross-system actions that carry destination IDs rather than raw hrefs.
- First files/symbols: `src/lib/portfolioContracts.ts`, `src/lib/destinations.ts`, the event vocabulary in the architecture plan, and focused integration fixtures.
- Expected observable result: Depth, destination, relationship, discovery, stimulation, AI context, project state, and experience-failure actions share one discriminated union without a global browser event bus.
- Only after that: `ARC-05` adds runtime validators and persisted-state migrations before UI consumers rely on untrusted data.

### Context That Must Survive

- Destination IDs are stable identifiers, not labels or raw URLs.
- All client-provided identifiers eventually require server/runtime validation; generic payload validation remains `ARC-05`.
- Every entry needs a safe fallback route, checkpoint-restoration policy, and cross-subdomain behavior.
- Safe state must remain primitive-only and destination-specific.
- AI cards and tours will consume this registry later, but neither is implemented here.
- Unrelated local changes and all secret/tooling files remain outside scope.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `ARC-01` | resolved | Canonical content identities accepted |
| Package | `ARC-02` | resolved | Shared content/graph/discovery contracts accepted |
| Package correction | `WI-ARC-02-02` | resolved | Graph-node and discovery-event contracts pass tests/build |
| Package boundary | `ARC-04`, `ARC-05` | resolved | Do not absorb actions, generic validators, or migrations |

## Implementation Checklist

- [x] Inventory current internal and cross-subdomain destinations.
- [x] Record initial registry scope and fallback policy.
- [x] Implement typed registry data and pure lookup/resolution.
- [x] Add unknown-ID, unsupported-state, fallback, and cross-subdomain tests.
- [x] Run tests, inventory, lint, and production build.
- [x] Reconcile capability, evidence, dashboard, and resume records.

## Files And Entry Points

| Path or symbol | Why it matters | Current state |
| --- | --- | --- |
| `src/lib/portfolioContracts.ts` | Accepted destination and safe-state types | implemented |
| `src/lib/projectSites.ts` | Current project/subdomain mapping | covered by registry parity tests |
| `src/proxy.ts` | Host-to-route rewrite behavior | unchanged |
| `src/app` and route links | Current destination inventory | reviewed and classified |
| `src/lib/destinations.ts` | Registry, resolver, navigation mode, and validation | implemented |
| `tests/destinations.test.ts` | Pure resolver and parity fixtures | passing |

## Updates

### 2026-07-16 - Work item prepared

- State: planned -> ready.
- Changed: Bounded the first registry increment around inventory, pure data/resolution, fallbacks, and tests.
- Verified: Dependency package `ARC-02` passes 19 tests and the production build.
- Remaining: All destination inventory and implementation work.
- Next: Create the reviewed destination inventory before editing runtime navigation.
- Commit: `91e6d54`.

### 2026-07-16 - Paused for shared-contract reconciliation

- State: ready -> paused.
- Changed: Approved the multi-route/one-world information architecture and clarified museum/subdomain, URL-depth, browser-history, legacy-route, and cross-origin-state policy.
- Gap found: The shared `NodeId` is too narrow for planned graph nodes and `easter_egg_found` is absent from the implemented discovery vocabulary.
- Restart condition: `WI-ARC-02-02` passes tests/build and returns `ARC-02` to complete.
- Next: Inventory canonical, planned, legacy-alias, internal-only, and feedback-gated destinations.
- Commit: `d66c701173072cd7f653fe1a178ec7d222b1298d`.

### 2026-07-16 - Destination registry accepted

- State: paused -> in-progress -> done.
- Changed: Reviewed the route inventory, implemented 27 classified destinations, explicit origins/checkpoints/fallbacks, allowlisted state, pure resolution, suggestion filtering, and registry validation.
- Verified: All nine projects, three project sites/blogs, and three current posts have destinations; 8 test files and 26 tests pass; inventory and production build pass.
- Failure retained: The first production build exposed an exact-object-union typecheck issue in the validation loop; widening the loop to the declared contract fixed it without changing behavior.
- Evidence: `EV-ARC-03-01` accepted.
- Next: `WI-ARC-04-01`.
- Commit: `6a24533742867e738dbce86f5cdb81c8b570f97c`.

## Completion Summary

The initial destination registry is complete: semantic IDs, route classes, current project/blog parity, safe state, fallbacks, origin transitions, suggestion policy, and production typechecking are accepted without changing current visitor navigation.
