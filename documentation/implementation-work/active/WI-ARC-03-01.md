# WI-ARC-03-01: Build The Destination Registry

## Properties

| Field | Value |
| --- | --- |
| State | ready |
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

- State in one sentence: Shared destination types are accepted; concrete destination data and resolution behavior have not started.
- Works now: Existing main-site and project-subdomain routes are live, `ProjectSite` maps subdomains to projects, proxy rewrites hosts, and `ExperienceDestination` defines the target shape.
- Incomplete or stubbed: There is no canonical registry, unknown-ID fallback, safe-state allowlist, checkpoint policy, or reusable cross-subdomain resolver.
- Safe exposure: The package begins as data and pure functions; existing links remain authoritative until parity tests pass.

### Known-Good Point

- Commit: `91e6d54735d14cfbf4084c2bb4763933dcfe0129`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test` and `npm run build` under Node.js 24.
- Verification result: 7 files and 19 tests pass; production build passes; `BAS-08` live domains remain healthy.
- Route/preview: Production `dpl_3HGisq6kX91L3yKVh1d9Ae8DrHQW` is the current visitor-safe baseline.
- Feature flags: None; do not wire the registry into navigation until registry parity and fallbacks pass.

### Restart Here

- Next exact action: Produce a destination inventory from `src/app`, `src/lib/projectSites.ts`, and proxy host behavior, then choose the smallest initial registry covering Home, About, Projects, Chat, and the three project homes/blogs.
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

## Completion Summary

Complete only after the registry and resolver pass parity, unknown-ID, safe-state, fallback, and cross-subdomain tests without changing existing navigation behavior.
