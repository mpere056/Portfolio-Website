# ARC-02 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `ARC-02` Shared contract types |
| Lifecycle | complete |
| Capability | `CAP-ARC-002` |
| Work items | `WI-ARC-02-01` and `WI-ARC-02-02` done |
| Implementation commit | `91e6d54735d14cfbf4084c2bb4763933dcfe0129` |

## Accepted Evidence

### EV-ARC-02-01: Shared Portfolio Contract Vocabulary

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | contract |
| Claim | Depth, destination, discovery, AI context, archive-card, and project-experience consumers share one canonical TypeScript vocabulary without introducing runtime or UI coupling |
| Dimensions | `S`, `A`, `I`, `T` |
| Requirements | `V-03`, `V-10` |
| Date | 2026-07-16 |
| Reviewer | Codex |
| Commit | `91e6d54735d14cfbf4084c2bb4763933dcfe0129` |
| Environment | Local Node.js 24 and Next.js 16 production build |

#### Method

```powershell
npm test
npm run build
```

#### Actual

- `src/lib/portfolioContracts.ts` is the single source for stable destination, experience, discovery, relationship, content-version, depth, safe-state, AI-context, archive-card, and project-experience manifest types.
- The contract reuses the accepted `ContentNodeId` rather than creating a second content identity format.
- `tests/portfolioContracts.test.ts` compiles one DreamLife destination through depth, discovery, AI context, archive card, and project experience consumers.
- 7 test files and 19 tests pass.
- Lint reports 0 errors and the same 11 retained warnings.
- The Next.js 16 production build compiles, typechecks, and emits all 26 static pages plus both Node API routes.

#### Boundaries

- `ARC-03` owns concrete destination data, safe fallbacks, and unknown-destination behavior.
- `ARC-04` owns typed cross-system actions.
- `ARC-05` owns runtime payload validators and persisted-state migrations.
- No visitor-facing component, navigation path, persisted state, or production API behavior changed.

### EV-ARC-02-02: Graph Identity And Discovery Reconciliation

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | contract |
| Claim | Shared contracts preserve strict current content IDs while supporting reviewed graph-only node namespaces and the complete approved discovery vocabulary |
| Dimensions | `A`, `I`, `T` |
| Requirements | `V-03`, `V-08`, `V-10`, `V-11`, `V-20` |
| Date | 2026-07-16 |
| Reviewer | Codex |
| Commit | pending focused implementation commit |
| Environment | Local Node.js 24 and Next.js 16 production build |

#### Actual

- `ContentNodeId` remains the strict type used by content loading and ingestion.
- `GraphOnlyNodeId` adds ten reviewed namespaces and validates one or more lowercase kebab-case scoped segments.
- `NodeId` accepts current content IDs plus graph-only IDs without weakening `isContentNodeId`.
- `DISCOVERY_EVENT_TYPES` now includes `easter_egg_found`.
- The contract fixture covers content, project-state, skill, offering, and scoped decision identities plus primitive-only safe state.
- The final suite passes with 8 test files and 26 tests, 0 lint errors, and 11 retained warnings; content inventory reports 0 errors and 0 runtime/AI identity divergences; the production build passes.

#### Boundaries

- Graph compilation and relationship records remain in `KG-*`.
- Generic untrusted payload validation and persisted-state migration remain in `ARC-05`.

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-ARC-002` | Original increment accepted, then reopened | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified | on-track | high | `EV-ARC-02-01`, `EV-ARC-02-02` accepted | `WI-ARC-02-02` done | `ARC-04` consumes the accepted contracts through typed actions |

## Completion Decision

Complete. The original increment remains accepted, the reopened graph/discovery gaps are corrected and tested, and downstream destination/action work can depend on the shared vocabulary.
