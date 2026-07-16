# WI-ARC-03-01: Build The Destination Registry

## Properties

| Field | Value |
| --- | --- |
| State | paused |
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

- State in one sentence: The information architecture is approved and destination scope is clear, but implementation is paused while `WI-ARC-02-02` reconciles two shared-contract omissions.
- Works now: Existing main-site and project-subdomain routes are live, `ProjectSite` maps subdomains to projects, proxy rewrites hosts, and `ExperienceDestination` defines the target shape.
- Incomplete or stubbed: There is no canonical registry, unknown-ID fallback, safe-state allowlist, checkpoint policy, or reusable cross-subdomain resolver; broader graph-node IDs and the full discovery vocabulary are not yet represented in code.
- Safe exposure: The package begins as data and pure functions; existing links remain authoritative until parity tests pass.

### Known-Good Point

- Commit: `f1b35b59bcfdcf04440d18ebe17d0043bf6f00e8`; shared-contract implementation began at `91e6d54`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test` and `npm run build` under Node.js 24.
- Verification result: 7 files and 19 tests pass; production build passes; `BAS-08` live domains remain healthy.
- Route/preview: Production `dpl_Ai2hdKjwLugHNV8jPqbGnUz9vVPj` is the current visitor-safe baseline; all seven public routes, retrieval, and grounded chat passed.
- Feature flags: None; do not wire the registry into navigation until registry parity and fallbacks pass.

### Restart Here

- Next exact action: Resume only after `WI-ARC-02-02` restores shared-contract acceptance, then produce the route-classified destination inventory approved by the information-architecture decision.
- First files/symbols: `src/lib/portfolioContracts.ts`, `src/lib/projectSites.ts`, `src/proxy.ts`, route links, and project-site blog helpers.
- Expected observable result: A reviewed table maps stable destination IDs to canonical internal or cross-subdomain hrefs before implementation begins.
- Only after that: Implement a pure resolver and unknown-destination tests; defer navigation transitions and actions.

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
| Package | `ARC-02` | resolved | Shared destination contracts accepted |
| Package correction | `WI-ARC-02-02` | open | Resume after graph-node and discovery-event contracts pass tests/build |
| Package boundary | `ARC-04`, `ARC-05` | resolved | Do not absorb actions, generic validators, or migrations |

## Implementation Checklist

- [ ] Inventory current internal and cross-subdomain destinations.
- [ ] Record initial registry scope and fallback policy.
- [ ] Implement typed registry data and pure lookup/resolution.
- [ ] Add unknown-ID, unsupported-state, fallback, and cross-subdomain tests.
- [ ] Run tests, inventory, lint, and production build.
- [ ] Reconcile capability, evidence, dashboard, and resume records.

## Files And Entry Points

| Path or symbol | Why it matters | Current state |
| --- | --- | --- |
| `src/lib/portfolioContracts.ts` | Accepted destination and safe-state types | implemented |
| `src/lib/projectSites.ts` | Current project/subdomain mapping | unchanged |
| `src/proxy.ts` | Host-to-route rewrite behavior | unchanged |
| `src/app` and route links | Current destination inventory | inspect next |
| `tests` | Pure resolver and parity fixtures | planned |

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

## Completion Summary

Complete only after the registry and resolver pass parity, unknown-ID, safe-state, fallback, and cross-subdomain tests without changing existing navigation behavior.
