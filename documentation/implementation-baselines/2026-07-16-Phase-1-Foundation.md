# Phase 1 Structural Foundation Checkpoint

Date: 2026-07-16

Implementation commit: `afa5f6739459a03e7f47e6cfb0273cdd55170a76`

## Accepted Foundation

Phase 1 establishes dormant infrastructure without changing the current visitor experience:

- A typed environment-aware flag registry with development-only overrides and no URL activation path.
- A versioned per-origin exploration store with explicit hydration, v0 migration, partial recovery, semantic checkpoints, stimulation state, and reset.
- A nested AI context stack that tracks route and selected objects by source ownership and restores parent context when an experience closes.
- One recursive content loader shared by project, timeline, blog, inventory, and ingestion paths while preserving their existing output contracts.
- Strict optional frontmatter extensions and required-field validation for projects, timeline events, posts, and graph-aware references.
- A deterministic graph compiler with controlled relationship vocabulary, broken-reference checks, public-review requirements, and private-node leak prevention.
- An initial public subgraph containing 39 authored content nodes, 10 skill nodes, and 19 reviewed relationships centered on Dreamlife, LifeInbox, and Sudoku Together.
- A project lifecycle schema for evolving, maintained, complete, and archived states, with lifecycle-specific required sections. No project is classified until `LPS-02` receives Mark's review.

## Runtime Boundaries

- The exploration store and AI provider are not mounted in the current UI.
- Feature flags cannot enable new visitor behavior in production; the only enabled flag is the dormant foundation in development and preview.
- Stored exploration data contains semantic IDs and bounded safe state, never camera objects, raw scene state, or AI conversations.
- Public graph relationships must be reviewed and may reference only public nodes.
- Invalid graph/content data fails `npm run validate:content`, which is also the `prebuild` gate.
- `src/content/**/*` is explicitly included in server output tracing; injectable test paths are excluded from Turbopack's automatic tracing.

## Verification

| Gate | Result |
| --- | --- |
| `npm run validate:content` | Passed: 49 nodes, 19 relationships |
| `npx tsc --noEmit` | Passed |
| `npm test` | Passed: 17 files, 61 tests; 0 lint errors and 11 retained warnings |
| `npm run build` | Passed under Node.js 24 with content prebuild validation |

## Resume Point

Phase 2 begins with `QA-01`, which turns the growing unit/contract suite into one explicit foundation harness before visitor-facing depth work. After that gate, `EXP-02` may mount one controlled five-stage depth primitive against the dormant store. Do not start First Note, the global AI shell, or multiple project experiences before those two checkpoints are accepted.
