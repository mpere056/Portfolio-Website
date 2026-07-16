# ARC-04 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `ARC-04` Cross-system actions |
| Lifecycle | complete |
| Capability | `CAP-ARC-004` |
| Work item | `WI-ARC-04-01` |
| Implementation commit | `55e6104e4fee32b5f4f004a0f171fe40c4af2ced` |

## Accepted Evidence

### EV-ARC-04-01: Typed Actions And Exhaustive Integration Fixture

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test |
| Claim | Approved cross-system semantics share one exhaustive ID-first action contract that can update depth and AI context and request validated destinations without raw URLs or a browser-global event bus |
| Dimensions | `S`, `A`, `I`, `T` |
| Requirements | `V-01`, `V-03`, `V-05`, `V-09`, `V-10`, `V-12` |
| Date | 2026-07-16 |
| Reviewer | Codex |
| Commit | `55e6104e4fee32b5f4f004a0f171fe40c4af2ced` |
| Environment | Local Node.js 24 and Next.js 16 production build |

#### Method

```powershell
npm test
npm run inventory:content
npm run build
```

#### Actual

- `src/lib/portfolioActions.ts` defines all seven approved action discriminants and a matching union.
- Focused creators carry destination, relationship, project, discovery, and experience IDs rather than raw routes or factual content.
- Destination requests contain a `DestinationId` and optional primitive safe state; transition consumers resolve them through `resolveDestination`.
- Trusted local stimulation values are finite and normalized to `0..1` at the creator boundary.
- An exhaustive integration fixture handles every action, updates depth and AI context, resolves an allowlisted About destination, and records project state, discovery, stimulation, and experience failure outputs.
- 9 test files and 29 tests pass; lint has 0 errors and 11 retained warnings; inventory has 39 nodes, 0 errors, and 0 runtime/AI identity divergences; the production build typechecks and emits all 26 pages.

#### Boundaries

- No current Zustand store, component, route, persistence adapter, or production API consumes these actions yet.
- `ARC-05` owns untrusted runtime validation, compatibility rules, and version migrations.
- Experience, AI, transition, and project packages own incremental adapters after validation is accepted.

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-ARC-004` | `S: accepted; C: not-applicable; A: not-started; I: not-started; T: not-started; Q: not-applicable; R: not-applicable` | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified | on-track | high | `EV-ARC-04-01` accepted | `WI-ARC-04-01` done | `ARC-05` validates untrusted action and persisted-state inputs |

## Completion Decision

Complete. The action vocabulary, ID-first payloads, creator invariants, exhaustive handling, destination integration, and build gates are accepted without prematurely changing visitor behavior.
