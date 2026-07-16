# ARC-02 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `ARC-02` Shared contract types |
| Lifecycle | complete |
| Capability | `CAP-ARC-002` |
| Work item | `WI-ARC-02-01` |
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

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-ARC-002` | `S: accepted; C: not-applicable; A: not-started; I: not-started; T: not-started; Q: not-applicable; R: not-started` | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified | on-track | high | `EV-ARC-02-01` accepted | `WI-ARC-02-01` done | `ARC-03` validates concrete destinations against these types |

## Completion Decision

Complete. One shared type source and one cross-consumer fixture pass tests and the production build, with destination data, runtime validation, global actions, and UI behavior left to their named packages.
