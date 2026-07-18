# WI-LPS-02-01: Review Portfolio Project Lifecycles

## Properties

| Field | Value |
| --- | --- |
| State | in-review |
| Priority | normal |
| Package | `LPS-02` |
| Capabilities | `CAP-LPS-002` |
| Requirements | `V-19` |
| Outcome | `O-06` |
| Owner | Mark and Codex |
| Milestone | One concise nine-project lifecycle set is ready for explicit approval or correction |
| Branch/worktree | `main` |
| Created | 2026-07-18 |
| Last update | 2026-07-18 |

## Acceptance

Every project receives one reviewed lifecycle classification using the accepted schema, without turning inferred repository activity into a current-state claim. Mark approves or corrects the concise set before `LPS-03` authors the remaining flagship state records.

## Resume Packet

### Current Truth

- State in one sentence: a nine-project proposal is prepared and awaits Mark's explicit approval or corrections.
- Works now: each project has one proposed lifecycle, a short authored-content rationale, and one focused confirmation question.
- Incomplete or stubbed: classifications other than the already reviewed LifeInbox seed are not accepted and must not enter project-state content yet.
- Safe exposure: documentation review only; no public project claim changes.

### Known-Good Point

- Commit: `8434d5e` before this review document.
- Branch/worktree: `main`; unrelated local changes remain outside this work item.
- Verification command: `npm exec vitest run tests/planningIntegrity.test.ts` after registry updates.
- Verification result: 39 test files and 157 tests pass; strict TypeScript passes; content validation passes with 50 nodes and 19 relationships.
- Route/preview: Production `dpl_FH5HAHM1zXBf6t4PyoPthA4CSr1u` is Ready on all portfolio aliases.
- Feature flags: accepted Phase 3 flags remain unchanged.
- Browser/test data: no browser state is required for the classification review.

### Restart Here

- Next exact action: apply Mark's approval or corrections to the proposal table and record the resulting decision.
- First files/symbols: `2026-07-18-Portfolio-Lifecycle-Classification-Proposal.md`, this work item, `13-Execution-Work-Packages.md`, and `15-Capability-Coverage-Ledger.md`.
- Expected observable result: all nine projects have an explicitly reviewed lifecycle and `CAP-LPS-002` can be accepted.
- Only after that: close `LPS-02`, create the bounded `LPS-03` work item, and author the Dreamlife and Sudoku Together state records.

### Context That Must Survive

- Decisions and rejected alternatives: commit activity, repository age, and missing live links are not lifecycle evidence; detailed current-state wording is not part of this approval.
- Assumptions still unproven: active-work expectations, runtime usability, maintenance intent, and repository representativeness for eight projects.
- Relevant plan sections: `07-Living-Project-State.md`, `13-Execution-Work-Packages.md`, `15-Capability-Coverage-Ledger.md`.
- Evidence: the proposal is a review artifact, not acceptance evidence until Mark responds.
- Known failures or traps: do not silently treat a recommendation as approval or author evolving-only sections for a non-evolving project.
- Uncommitted/external work: `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` are unrelated.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `LPS-01` | resolved | Lifecycle vocabulary and validation are accepted. |
| Review | Mark lifecycle approval | open | Mark approves all proposals or supplies corrections. |
| Downstream | `LPS-03` | waiting | No remaining flagship state record is authored before approval. |

## Implementation Checklist

- [x] Inventory all nine canonical projects.
- [x] Prepare one concise proposed lifecycle and rationale per project.
- [x] Separate authored facts from confirmation questions.
- [x] Preserve the no-Git-activity-inference safety boundary.
- [ ] Record Mark's approval or corrections.
- [ ] Reconcile package, capability, evidence, dashboard, and resume records.

## Files And Entry Points

| Path or symbol | Why it matters | Current state |
| --- | --- | --- |
| `documentation/implementation-plans/2026-07-18-Portfolio-Lifecycle-Classification-Proposal.md` | Human review artifact | added |
| `src/content/projects/*.mdx` | Authored basis for recommendations | unchanged |
| `src/content/misc/lifeinbox-current-state.mdx` | Already reviewed lifecycle seed | unchanged |

## Open Questions

- Does Mark approve every proposed lifecycle, or which project values should change?

## Updates

### 2026-07-18 - Classification set prepared for review

- State: ready -> in-review
- Changed: added one concise, source-bounded proposal for every canonical project.
- Verified: planning integrity passes within the 157-test aggregate gate; strict TypeScript and content validation also pass.
- Remaining: Mark approval and acceptance reconciliation.
- Decision: none until Mark responds.
- Next: apply approval or corrections exactly as reviewed.
- Commit: uncommitted
