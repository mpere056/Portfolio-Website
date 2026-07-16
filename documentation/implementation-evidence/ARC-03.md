# ARC-03 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `ARC-03` Destination registry |
| Lifecycle | complete |
| Capability | `CAP-ARC-003` |
| Work item | `WI-ARC-03-01` |
| Implementation commit | `6a24533742867e738dbce86f5cdb81c8b570f97c` |

## Accepted Evidence

### EV-ARC-03-01: Classified Destination Registry And Resolver

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test |
| Claim | Current and approved future portfolio places share one validated registry that resolves canonical and compatibility requests while safely rejecting unavailable or unsafe navigation state |
| Dimensions | `S`, `A`, `I`, `T` |
| Requirements | `V-01`, `V-05`, `V-07`, `V-09`, `V-10`, `V-14` |
| Date | 2026-07-16 |
| Reviewer | Codex |
| Commit | `6a24533742867e738dbce86f5cdb81c8b570f97c` |
| Environment | Local Node.js 24 and Next.js 16 production build |

#### Method

```powershell
npm test
npm run inventory:content
npm run build
```

#### Actual

- The reviewed destination inventory classifies canonical, legacy-alias, planned, internal-only, and feedback-gated route surfaces before registry implementation.
- `src/lib/destinations.ts` contains 27 definitions: 21 canonical, 1 legacy compatibility, 2 planned, 2 internal-only, and 1 feedback-gated.
- Every current project has a stable destination; every `PROJECT_SITES` entry has project-home and blog destinations; every current project article has a canonical post destination.
- Fallbacks, content/graph node IDs, target origins, project-subdomain hostnames, safe-state keys, and duplicate constraints validate with no registry issues.
- The resolver distinguishes same-origin from full-document navigation and preserves explicit legacy behavior without suggesting legacy, planned, internal, or gated destinations.
- Unknown IDs, unavailable destinations, unsupported keys, non-primitive state, and non-finite numeric state fall back with named reasons.
- 8 test files and 26 tests pass; lint has 0 errors and 11 retained warnings; inventory has 39 nodes, 0 errors, and 0 runtime/AI identity divergences; the production build passes.

#### Boundaries

- Existing links and navigation components are intentionally unchanged; `ARC-04` introduces typed actions before consumers migrate.
- Generic untrusted payload validation and persistence migration remain in `ARC-05`.
- Planned `/projects/[slug]`, `/archive`, and `/writing`, feedback-gated `/studio`, and internal template/demo routes are not made publicly resolvable by this package.
- Browser/production route behavior is unchanged because the registry is not yet wired into visitor navigation.

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-ARC-003` | `S: accepted; C: not-applicable; A: not-started; I: not-started; T: not-started; Q: not-applicable; R: not-started` | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified | on-track | high | `EV-ARC-03-01` accepted | `WI-ARC-03-01` done | `ARC-04` requests destinations without raw URLs |

## Completion Decision

Complete. The information architecture is represented by reviewed inventory, typed registry data, pure resolution, explicit fallback and origin policy, and passing parity/safety/build gates without prematurely changing visitor navigation.
