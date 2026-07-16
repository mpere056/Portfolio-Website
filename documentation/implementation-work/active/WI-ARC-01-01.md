# WI-ARC-01-01: Establish Stable Content Identities

## Properties

| Field | Value |
| --- | --- |
| State | paused |
| Priority | high |
| Package | `ARC-01` |
| Capabilities | `CAP-ARC-001` |
| Requirements | `V-10`, `V-11` |
| Outcome | `O-00` |
| Milestone | Every current content node has one validated canonical identity shared by inventory and ingestion, with explicit rename behavior |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-14 |
| Last update | 2026-07-15 |

## Acceptance

Confirm canonical namespace and segment rules; implement shared constructors, validation, and explicit legacy-alias resolution; make inventory and ingestion agree on canonical IDs; provide authored IDs for the initial corpus without folding in unrelated content edits; preserve route slugs; detect invalid and duplicate IDs in tests; record rename consequences; run tests and production build; and accept evidence before dependent shared contracts begin.

## Resume Packet

### Current Truth

- State in one sentence: Canonical content IDs are implemented locally, while managed re-indexing and acceptance are paused behind the active `BAS-08` Firestore cutover.
- Works now: `project:`, `timeline:`, `misc:`, and `post:{site}:` IDs are deterministic and reject unstable shapes; one-level ingestion uses the same derivation; three unaffected misc records have authored IDs; 5 test files and 13 tests plus the production build pass.
- Incomplete or stubbed: The managed retrieval corpus still contains legacy bare IDs, one separately edited misc record uses a filename fallback, nested posts remain outside later shared-loader ingestion, and no visitor-facing consumer resolves aliases.
- Safe exposure: Current changes affect internal utilities, tests, and inventory output only; routes, persisted visitor state, and production retrieval remain unchanged.

### Known-Good Point

- Commit: `4144bcc2f252a211ce0c611328ffe6be6d51dd32` before the uncommitted `ARC-01` increment.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification result: 5 test files and 13 tests pass; the production build passes; lint has 0 errors and 14 retained warnings.
- Evidence: `EV-ARC-01-01` is candidate pending ingestion and corpus migration.
- Feature flags: None; no visitor-facing consumer uses the new IDs yet.

### Restart Here

- Next exact action: Resume after `BAS-08` establishes Firestore IAM and its vector index, then run the canonical corpus ingest and verify retrieved IDs.
- First files/symbols: `src/lib/contentIds.ts`, `scripts/ingest.ts`, `src/lib/contentInventory.ts`, `tests/contentIds.test.ts`, and the Vercel preview.
- Expected observable result: The preview build passes without route changes; a later controlled re-index replaces bare retrieval IDs with canonical IDs and leaves grounded chat healthy.
- Only after that: Decide whether the one separately edited misc fallback can be migrated independently, accept evidence, and close `ARC-01` or retain the explicit gap.

### Context That Must Survive

- Canonical content formats and rename policy are recorded in `2026-07-14-Stable-Content-ID-Decision.md`.
- Route slugs are presentation/navigation values and must not change in this package.
- Recursive loading and nested-blog ingestion belong to `KG-01`; do not absorb that package here.
- Alias resolution is explicit and one-way; never silently lowercase or slugify an unknown client ID.
- `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` are unrelated and must remain unstaged.
- Supabase became unavailable after the original implementation checkpoint. `BAS-08` supersedes only the retrieval-backend rollout path; canonical ID rules and tests remain this package's contract.

## Implementation Checklist

- [x] Confirm canonical namespace, segment, and rename rules.
- [x] Implement constructors, validation, and explicit alias resolution.
- [x] Integrate canonical keys into deterministic inventory output.
- [x] Add focused validation and inventory fixtures.
- [x] Make current ingestion derive the same canonical IDs and remove legacy rows safely.
- [x] Add authored IDs to unaffected filename-fallback misc records.
- [x] Explicitly defer the separately edited productivity-system ID migration from this commit.
- [x] Run full tests, inventory, and production build.
- [ ] Commit, preview, re-index the managed corpus, and reconcile acceptance evidence.

## Updates

### 2026-07-14 - Stable content identity implementation started

- State: planned -> in-progress
- Changed: Confirmed `project`, `timeline`, `misc`, and site-scoped `post` formats; implemented strict constructors, canonical recognition, alias resolution, and inventory integration.
- Verified: 5 test files and 12 tests pass with 0 lint errors and 14 retained warnings.
- Boundaries: No routes, production consumers, authored content, or unrelated files changed.
- Remaining: Ingestion integration, unaffected corpus IDs, the separately edited misc record decision, build, evidence, and closeout.
- Next: Make current one-level ingestion derive the same canonical IDs without taking on recursive loader scope.
- Commit: uncommitted

### 2026-07-14 - Inventory and ingestion identity aligned

- Changed: Centralized path classification and authored-ID precedence, made ingestion store canonical IDs, delete canonical plus legacy rows only after vectors exist, and authored IDs for three untouched misc records.
- Verified: Inventory reports 39 nodes, 38 authored IDs, 1 fallback, 0 identity divergences, and 0 structural errors; 5 files and 13 tests pass; the production build compiles and typechecks.
- Boundary: Nested blog traversal remains in `KG-01`; the user's edited productivity-system file remains unstaged and uses a documented fallback.
- Remaining: Focused commit, exact-commit preview, managed retrieval re-index, chat verification, and evidence acceptance.
- Next: Commit and preview before mutating the managed retrieval corpus.
- Commit: uncommitted

### 2026-07-15 - Acceptance paused behind Firestore cutover

- State: in-progress -> paused.
- Changed: The canonical ingestion contract was adapted to deterministic Firestore document IDs as part of `BAS-08` after the Supabase project became unavailable.
- Verified: Canonical retrieval mapping is covered by the expanded 6-file, 17-test suite.
- Remaining: One fallback authored ID and accepted real-corpus/production evidence.
- Restart condition: `BAS-08` IAM and vector index are ready for canonical ingestion.
- Commit: uncommitted.

## Completion Summary

Complete this only after inventory and ingestion share canonical IDs, initial migrations are explicit, tests/build pass, and accepted evidence records the known-good commit.
