# WI-ARC-02-02: Reconcile Graph And Discovery Contracts

## Properties

| Field | Value |
| --- | --- |
| State | done |
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

- State in one sentence: Shared contracts now represent strict content IDs, reviewed graph-only IDs, and every approved discovery event, restoring `ARC-02` acceptance.
- Works now: Ten graph-only namespaces validate independently; `NodeId` covers content and graph references; `easter_egg_found` is present; the expanded suite passes 26 tests and the production build.
- Incomplete or stubbed: Graph content, relationships, generic payload validation, and persistence remain in their named downstream packages.
- Safe exposure: The corrected types are still foundation-only and introduce no visitor-facing behavior.

### Known-Good Point

- Commit: pending focused implementation commit.
- Implementation commit: `91e6d54735d14cfbf4084c2bb4763933dcfe0129`.
- Verification command: `npm test` and `npm run build` under Node.js 24.
- Verification result: 8 files and 26 tests pass; lint has 0 errors and 11 retained warnings; content inventory has 0 errors and 0 identity divergences; production build passes.
- Production: `dpl_Ai2hdKjwLugHNV8jPqbGnUz9vVPj` is Ready; all seven public routes, retrieval, and chat passed after the clean Firebase-only rebuild.

### Restart Here

- Next exact action: Continue through completed `WI-ARC-03-01`, then begin `WI-ARC-04-01` with typed cross-system actions.
- First files/symbols: `src/lib/portfolioContracts.ts`, `src/lib/destinations.ts`, and the system event vocabulary.
- Expected observable result: Typed actions request accepted destinations and carry shared depth/discovery/context payloads without raw global browser events.
- Only after that: Add runtime validators and persistence migrations in `ARC-05`.

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

- [x] Define graph-only namespaces without weakening `ContentNodeId`.
- [x] Expand `NodeId` for reviewed graph consumers.
- [x] Add `easter_egg_found` to the approved discovery vocabulary.
- [x] Update cross-consumer fixtures and contract documentation.
- [x] Run tests, inventory, lint, and production build.
- [x] Reconcile evidence, package, capability, dashboard, and resume records.

## Updates

### 2026-07-16 - Contract package reopened after routing review

- State: done baseline -> reopened with ready follow-up.
- Changed: Recorded the narrow `NodeId` and omitted `easter_egg_found` as explicit contract gaps discovered before destination implementation.
- Verified: The initial `91e6d54` contract evidence remains valid for its original claim; no visitor runtime consumes the missing shapes yet.
- Next: Correct the shared type vocabulary, then resume `ARC-03`.
- Commit: `d66c701173072cd7f653fe1a178ec7d222b1298d`.

### 2026-07-16 - Shared contract reconciliation accepted

- State: ready -> in-progress -> done.
- Changed: Added graph-only identity namespaces and guards, broadened `NodeId` without weakening content IDs, and added `easter_egg_found`.
- Verified: 8 test files and 26 tests pass; inventory has 0 errors and 0 identity divergences; lint has 0 errors; production build passes.
- Evidence: `EV-ARC-02-02` accepted.
- Next: `WI-ARC-04-01` after the destination registry checkpoint.
- Commit: pending focused implementation commit.

## Completion Summary

The shared contract vocabulary now covers current content identities, reviewed graph-only identities, primitive safe state, and every approved discovery event. `ARC-02` is complete again and downstream packages are unblocked.
