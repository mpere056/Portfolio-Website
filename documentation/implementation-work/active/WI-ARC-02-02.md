# WI-ARC-02-02: Reconcile Graph And Discovery Contracts

## Properties

| Field | Value |
| --- | --- |
| State | ready |
| Priority | high |
| Package | `ARC-02` |
| Capabilities | `CAP-ARC-002` |
| Requirements | `V-03`, `V-08`, `V-10`, `V-11`, `V-20` |
| Outcome | `O-00` |
| Milestone | Shared contracts represent current content identities plus future graph nodes and every approved discovery event before destination work resumes |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

Separate current `ContentNodeId` from a broader validated graph-node type; add the approved `easter_egg_found` discovery event; align safe-state documentation and fixtures around primitive string, number, and boolean values; preserve existing contract consumers; pass tests and the production build; and restore `ARC-02` acceptance before `ARC-03` starts registry implementation.

## Resume Packet

### Current Truth

- State in one sentence: The initial shared contracts are implemented and tested, but the information-architecture audit exposed two omitted requirements that make the package incomplete for graph and discovery consumers.
- Works now: Destination, experience, discovery, relationship, content-version, depth, safe-state, AI-context, archive-card, and project-experience manifest types share one module; 19 tests and the production build passed at `91e6d54`.
- Incomplete or stubbed: `NodeId` currently equals `ContentNodeId`, so skill, offering, project-state, feature, decision, and other graph-only nodes cannot type-check; `easter_egg_found` is approved in architecture but absent from `DISCOVERY_EVENT_TYPES`.
- Safe exposure: The current types are not yet wired into visitor navigation or persistence, so correction is low-risk and should happen before dependent runtime work.

### Known-Good Point

- Commit: `f1b35b59bcfdcf04440d18ebe17d0043bf6f00e8` on `main` and GitHub.
- Implementation commit: `91e6d54735d14cfbf4084c2bb4763933dcfe0129`.
- Verification command: `npm test` and `npm run build` under Node.js 24.
- Verification result: 7 files and 19 tests pass; lint has 0 errors and 11 retained warnings; production build passes.
- Production: `dpl_Ai2hdKjwLugHNV8jPqbGnUz9vVPj` is Ready; all seven public routes, retrieval, and chat passed after the clean Firebase-only rebuild.

### Restart Here

- Next exact action: Define the graph-only namespace union beside `ContentNodeId`, update `NodeId`, add `easter_egg_found`, and expand the existing contract fixture before touching destination registry code.
- First files/symbols: `src/lib/portfolioContracts.ts`, `src/lib/contentIds.ts`, `tests/portfolioContracts.test.ts`, and `00-System-Architecture-And-Interfaces.md`.
- Expected observable result: Existing content IDs and representative skill/offering/project-state IDs all satisfy `NodeId`, and the discovery vocabulary test includes `easter_egg_found`.
- Only after that: Re-run all gates, accept follow-up evidence, return `ARC-02` to complete, and resume `WI-ARC-03-01`.

### Context That Must Survive

- Content loaders and Firestore ingestion continue to use the narrower `ContentNodeId`.
- The broader `NodeId` is for graph, AI-card, relationship, and destination references; it must not weaken content-ingestion validation.
- Safe state remains primitive-only and destination-specific; generic runtime validation remains `ARC-05`.
- Information architecture is approved in `2026-07-16-Information-Architecture-And-Routing-Decision.md`.
- Preserve unrelated local changes and all secret/tooling files.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Decision | Information Architecture And Routing | resolved | Approved route/state model defines required contract consumers |
| Package | `ARC-01` | resolved | Existing content identity remains authoritative |
| Downstream | `ARC-03` | waiting | Destination implementation resumes only after this work item is done |

## Implementation Checklist

- [ ] Define graph-only namespaces without weakening `ContentNodeId`.
- [ ] Expand `NodeId` for reviewed graph consumers.
- [ ] Add `easter_egg_found` to the approved discovery vocabulary.
- [ ] Update cross-consumer fixtures and contract documentation.
- [ ] Run tests, inventory, lint, and production build.
- [ ] Reconcile evidence, package, capability, dashboard, and resume records.

## Updates

### 2026-07-16 - Contract package reopened after routing review

- State: done baseline -> reopened with ready follow-up.
- Changed: Recorded the narrow `NodeId` and omitted `easter_egg_found` as explicit contract gaps discovered before destination implementation.
- Verified: The initial `91e6d54` contract evidence remains valid for its original claim; no visitor runtime consumes the missing shapes yet.
- Next: Correct the shared type vocabulary, then resume `ARC-03`.
- Commit: documentation update pending.

## Completion Summary

Complete only after the broader graph identity and full approved discovery vocabulary pass tests/build and `ARC-03` is unblocked.
