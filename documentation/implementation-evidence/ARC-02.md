# ARC-02 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `ARC-02` Shared contract types |
| Lifecycle | reopened |
| Capability | `CAP-ARC-002` |
| Work items | `WI-ARC-02-01` done; `WI-ARC-02-02` ready |
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
| `CAP-ARC-002` | Original increment accepted | `S: accepted; C: not-applicable; A: working; I: working; T: working; Q: not-applicable; R: not-applicable` | reopened | on-track | high | `EV-ARC-02-01` accepted for original claim; follow-up pending | `WI-ARC-02-02` ready | Graph-only IDs and full discovery vocabulary pass tests/build |

## Completion Decision

The original increment and `EV-ARC-02-01` remain accepted for their named claim. Package-level completion is reopened because the approved architecture requires graph-only node identities and `easter_egg_found`, neither of which is represented by the current implementation. `WI-ARC-02-02` owns the bounded correction before `ARC-03` resumes.
