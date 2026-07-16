# ARC-05 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `ARC-05` Contract validation and migrations |
| Lifecycle | complete |
| Capability | `CAP-ARC-005` |
| Work item | `WI-ARC-05-01` |
| Implementation commit | `d5fca116729787c49725d38c58e6183ea2470428` |

## Accepted Evidence

### EV-ARC-05-01: Runtime Validation And Semantic-State Migration

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test |
| Claim | Untrusted portfolio actions and semantic state have bounded runtime validation, registry-backed destination policy, explicit version migration, and section-isolated recovery before browser persistence adoption |
| Dimensions | `S`, `A`, `I`, `T` |
| Requirements | `V-05`, `V-07`, `V-10`, `V-20` |
| Date | 2026-07-16 |
| Reviewer | Codex |
| Commit | `d5fca116729787c49725d38c58e6183ea2470428` |
| Environment | Local Node.js 24 and Next.js 16 production build |

#### Method

```powershell
npm test
npm run inventory:content
npm run build
```

#### Actual

- A reviewed boundary inventory separates current audio preferences from planned exploration storage, URL handoffs, AI cards/actions, tours, and later shared-presence payloads.
- Shared runtime guards cover destination, experience, discovery, relationship, content-version, depth-stage, discovery-type, and semantic experience IDs.
- `parsePortfolioAction` validates every approved action discriminant and payload with structured path/code/message issues.
- Destination requests ignore unknown fields, never consume raw hrefs, and reuse registry availability and destination-specific safe-state policy.
- Version-1 semantic state contains bounded discovery, tour, stimulation, checkpoint, altered-object, and content-version sections without component, camera, account, or conversation state.
- Unknown fields are ignored, one corrupt section resets without erasing valid siblings, flat version 0 migrates explicitly, and malformed roots or unknown versions return clean defaults.
- 10 test files and 37 tests pass; lint has 0 errors and 11 retained warnings; inventory has 39 nodes, 0 errors, and 0 runtime/AI identity divergences; the production build typechecks and emits all 26 pages.

#### Retained Typecheck Feedback

- The first build found that generic content-ID validation plus a prefix check did not narrow to `ProjectNodeId`; an explicit predicate preserved the stricter creator signature.
- The second build found that a generic list failure branch widened successful destination IDs to `unknown`; an explicit `ValidationResult<DestinationId[]>` return preserved section typing.
- Both were compile-time inference gaps without runtime test failures; the final build passes without casts that weaken public contracts.

#### Boundaries

- Existing `GlobalAudio` localStorage values are unchanged and are not represented as migrated exploration state.
- No localStorage, cookie, URL-history, Zustand, route, component, or production API integration is introduced.
- `EXP-01` owns storage hydration/reset; AI, tour, transition, and project packages own their adapters.

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-ARC-005` | `S: accepted; C: not-applicable; A: not-started; I: not-started; T: not-started; Q: not-applicable; R: not-applicable` | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified | on-track | high | `EV-ARC-05-01` accepted | `WI-ARC-05-01` done | `EXP-01` adopts validation through a versioned per-origin store |

## Completion Decision

Complete. Runtime action/destination validation and semantic-state compatibility behavior are accepted with deterministic malformed, current, legacy, partial-reset, and unknown-version evidence, without prematurely persisting visitor data.
