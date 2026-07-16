# WI-ARC-01-01: Establish Stable Content Identities

## Properties

| Field | Value |
| --- | --- |
| State | done |
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

- State in one sentence: Canonical content identities are accepted across inventory, ingestion, managed Firestore retrieval, Preview, and Production.
- Works now: `project:`, `timeline:`, `misc:`, and `post:{site}:` IDs are deterministic and validated; one-level ingestion uses the same derivation; the 42-chunk managed corpus covers all 36 current canonical IDs; live retrieval returns canonical IDs.
- Incomplete or stubbed: One separately edited misc record intentionally keeps its validated fallback ID; nested posts remain correctly owned by `KG-01`; no real rename currently requires a production alias entry.
- Safe exposure: Route slugs remain unchanged, aliases are explicit and one-way, and future authored replacement of the fallback must preserve identity through a reviewed alias.

### Known-Good Point

- Commit: `fe64bb68443f9d48a758683f8968367ce1ebd98a`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`, pushed to `origin/main`.
- Verification result: 6 test files and 17 tests pass; inventory has 39 nodes, 0 errors, and 0 runtime/AI ID divergences; the production build passes; lint has 0 errors and 11 retained warnings.
- Evidence: `EV-ARC-01-01` plus `EV-BAS-08-03` through `EV-BAS-08-05` are accepted.
- Feature flags: None; no visitor-facing consumer uses the new IDs yet.

### Restart Here

- Next exact action: Begin `WI-ARC-02-01` and centralize the shared contract types defined by the architecture plan.
- First files/symbols: `00-System-Architecture-And-Interfaces.md`, existing project/timeline/retrieval interfaces, and a new shared contract module with tests.
- Expected observable result: One canonical type source and consumer fixture compile without changing visitor behavior.
- Only after that: Let `ARC-03` own destination data/validation and `ARC-04` own cross-system actions.

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
- [x] Commit, preview, re-index the managed corpus, and reconcile acceptance evidence.

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

### 2026-07-16 - Canonical corpus rollout accepted

- State: paused -> done.
- Changed: Re-indexed 42 Firestore chunks across all 36 canonical IDs and retained the separately edited misc file's deterministic fallback as its current canonical identity.
- Verified: Real local, Preview, and Production DreamLife retrieval returned namespaced canonical IDs; tests, inventory, lint, and build passed; route slugs were unchanged.
- Boundary: Recursive nested-post loading remains in `KG-01`; future authored replacement of the fallback requires an explicit alias migration.
- Evidence: `EV-ARC-01-01`, `EV-BAS-08-03`, `EV-BAS-08-04`, and `EV-BAS-08-05` accepted.
- Next: Begin `WI-ARC-02-01`.
- Commit: `fe64bb6`.

## Completion Summary

Inventory and ingestion now share strict namespaced IDs, rename behavior is explicit, every managed source has a validated canonical identity, the Firestore corpus and live retrieval use those identities, and accepted test/Preview/Production evidence records commit `fe64bb6`.
