# WI-BAS-08-01: Migrate Retrieval To Firestore

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | urgent |
| Package | `BAS-08` |
| Capabilities | `CAP-BAS-008` |
| Requirements | Platform, `V-10`, `V-11` |
| Outcome | `O-00` |
| Milestone | Canonical portfolio retrieval and grounded chat operate from free-tier Firestore in production |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-15 |
| Last update | 2026-07-16 |

## Acceptance

Replace Supabase retrieval with server-only Firestore vector search; retain deny-all client rules and the Spark plan; re-index current MDX with canonical IDs; verify local tests/build, real retrieval, live diagnostics/chat, and public domains; remove obsolete runtime variables; and push accepted evidence without committing credentials or unrelated worktree changes.

## Resume Packet

### Current Truth

- State in one sentence: The free-tier Firestore migration is accepted in code, exact-commit Preview, Production, public domains, and GitHub.
- Works now: `ragStore.ts` provides lazy server credentials and 768-dimensional native vector queries; 42 chunks cover all 36 canonical IDs; retrieval and grounded chat pass locally, in Preview, and in Production; all seven public routes return HTTP 200; obsolete Supabase Vercel records are removed.
- Incomplete or stubbed: No package acceptance gap remains. Local credential deletion and revocation of an inaccessible historical-project key are explicit user-owned security follow-ups, not runtime dependencies.
- Safe exposure: Firebase remains free-tier with billing disabled, direct client rules deny all access, runtime IAM is least privilege, and Vercel retains prior Ready deployments for rollback.

### Known-Good Point

- Commit: `fe64bb68443f9d48a758683f8968367ce1ebd98a`.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`, pushed to `origin/main`.
- Verification command: `npm test`, `npm run inventory:content`, `npm run build` under Node.js 24.
- Verification result: 6 files and 17 tests pass; lint has 0 errors and 11 retained warnings; inventory has 39 nodes, 38 authored IDs, 1 explicit fallback, 0 runtime/AI divergences, and 0 errors; the final Next.js 16 production build passes and regenerates both Node API routes.
- Route/preview: Preview `dpl_DjW5r68niS2D9KP7uPq5g1io6atE` and Production `dpl_3HGisq6kX91L3yKVh1d9Ae8DrHQW` passed retrieval, chat, and route checks.
- External state: Firebase project `mark-portfolio-ai-mpere056`, Firestore `(default)` in `nam5`, `freeTier: true`, `billingEnabled: false`, service account `portfolio-website-ai@mark-portfolio-ai-mpere056.iam.gserviceaccount.com`, one active JSON key downloaded outside the repository, and one restricted Gemini key stored in Vercel.
- Secrets: The JSON key is outside the repository and must never be printed or staged.

### Restart Here

- Next exact action: Begin `WI-ARC-02-01` from the accepted Phase 0 foundation.
- First files/symbols: Shared contract plan, current local interfaces, `src/lib`, and focused contract tests.
- Expected observable result: Canonical depth, destination, discovery, and AI-context types compile from one shared source and one consumer fixture passes.
- Only after that: Start the destination registry or cross-system actions; do not combine them into the first contract increment.

### Context That Must Survive

- Approved decision: `2026-07-15-Firebase-Retrieval-Migration-Decision.md`.
- Do not enable billing, a free trial, or a payment method.
- Do not grant the service account project-wide Editor/Owner. Use the narrow Firestore data role; use the signed-in human account to create indexes.
- Current MDX is authoritative. The downloaded Supabase SQL backup is an audit/recovery artifact; the storage zip is empty.
- Keep direct client rules deny-all and use no `NEXT_PUBLIC_` Firebase credential.
- Preserve unrelated changes to `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/`.
- Historical `BAS-07` evidence must not be rewritten; add superseding `BAS-08` evidence.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| External permission | Firestore IAM role for portfolio service account | resolved | `roles/datastore.user`; read probe succeeds |
| External configuration | Firestore vector index | resolved | 768-dimensional `rag_docs.embedding` index is `READY` |
| External secret | Vercel Firebase environment variables | resolved | Production/Preview sensitive; Development encrypted |
| Package | `ARC-01` canonical IDs | resolved | Canonical ingestion and managed-corpus acceptance are complete |

## Implementation Checklist

- [x] Audit the Supabase database and storage backups without exposing data.
- [x] Choose and document the Spark-compatible Firestore architecture.
- [x] Implement Firestore retrieval, canonical ingestion, diagnostics, rules, and index config.
- [x] Add unit and integration-contract tests.
- [x] Create the Spark Firestore database and one service-account key.
- [x] Grant least-privilege Firestore data access and verify credentials.
- [x] Create and wait for the vector index.
- [x] Re-index the canonical repository corpus and run a real vector query.
- [x] Configure Vercel server-only Firebase variables.
- [x] Re-run tests, inventory, audit, and production build.
- [x] Deploy and verify diagnostics, chat, and all public domains.
- [x] Remove obsolete Supabase runtime variables after successful cutover.
- [x] Reconcile capability, evidence, dashboard, `ARC-01`, and resume records.
- [x] Commit and push only the intended migration files.

## Files And Entry Points

| Path or symbol | Why it matters | Current state |
| --- | --- | --- |
| `src/lib/ragStore.ts` | Server credentials and vector-query adapter | implemented, locally tested |
| `src/lib/retriever.ts` | Gemini embedding to Firestore retrieval flow | migrated, locally tested |
| `scripts/ingest.ts` | Canonical MDX chunk replacement and vector writes | migrated, locally tested contract |
| `src/app/api/chat/route.ts` | Node.js grounded generation route | migrated, locally tested |
| `src/app/api/rag/diag/route.ts` | Safe configuration and retrieval diagnostics | migrated, locally tested |
| `firestore.rules` | Deny-all direct-client access | created, matches console mode |
| `firestore.indexes.json` | 768-dimensional vector index contract | created, not yet applied |
| `tests/ragStore.test.ts` | Credential and query contract coverage | 4 passing tests |

## Updates

### 2026-07-15 - Migration implementation and Firebase foundation

- State: planned -> in-progress.
- Changed: Replaced the Supabase runtime adapter with Firestore native vector retrieval, rewrote ingestion for deterministic canonical chunk replacement, added server credential validation, switched AI routes to Node.js, and versioned deny-all rules plus the vector index.
- Verified: 6 test files and 17 tests pass; lint has 0 errors and 11 retained warnings; inventory reports no errors or identity divergences; the final production build passes; the production audit has 0 high and 0 critical findings; the intended migration files contain no private-key or API-key patterns.
- External: Firebase was added to the existing Google project; Firestore `(default)` was created in `nam5` on Spark; one matching service-account JSON key was downloaded outside the repository.
- Blocker: The key authenticates but receives `PERMISSION_DENIED` because no Firestore data role is assigned.
- Next: Obtain action-time approval, grant `Cloud Datastore User`, and repeat the read probe.
- Commit: uncommitted.

### 2026-07-16 - Dedicated free project and managed integration ready

- Changed: Created `mark-portfolio-ai-mpere056` under `mpere056@gmail.com`, added Firebase, created Firestore Native in `nam5`, assigned one least-privilege service account, created the vector index, ingested the canonical corpus, and configured all Vercel targets.
- Verified: Firestore reports `freeTier: true` and `billingEnabled: false`; service read succeeds; index is `READY`; 42 documents cover 36 canonical IDs; a real DreamLife query returns `timeline:dreamlife`, `project:dreamlife`, and `misc:more-app-info`; fallback generation returns `portfolio-ready`.
- Security: A Gemini key echoed by Google's create command was immediately deleted. Its replacement is service-account-bound, restricted to the Generative Language API, and was never printed. Vercel received the approved secrets only after explicit confirmation.
- Remaining: Focused commit, Preview, Production, Supabase variable removal, evidence reconciliation, and push verification.
- Next: Commit the bounded migration and push it to the preview branch.
- Commit: uncommitted.

### 2026-07-16 - Preview and production cutover accepted

- State: in-progress -> done.
- Changed: Committed the bounded migration as `fe64bb6`, pushed an exact-commit Preview, promoted the accepted deployment to Production, and removed all obsolete Supabase Vercel records.
- Verified: Preview and Production retrieval each returned 4,635 context characters and canonical DreamLife IDs; grounded chat returned HTTP 200; the main site plus three project homes and three blog routes returned HTTP 200.
- Security: Firebase remains free-tier with billing disabled, direct client rules deny all, runtime IAM remains `roles/datastore.user`, and staged secret scanning passed.
- Evidence: `EV-BAS-08-01` through `EV-BAS-08-05` accepted.
- Next: Begin `WI-ARC-02-01` on the accepted Phase 0 foundation.
- Commit: `fe64bb6`.

## Completion Summary

The unavailable Supabase backend has been replaced by a server-only, deny-all-client, least-privilege Firestore vector store on the free tier. Canonical ingestion, retrieval, resilient chat, exact-commit Preview, Production, seven public routes, environment cleanup, and the focused GitHub push are accepted.
