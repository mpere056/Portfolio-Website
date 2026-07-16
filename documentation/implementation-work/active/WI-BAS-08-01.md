# WI-BAS-08-01: Migrate Retrieval To Firestore

## Properties

| Field | Value |
| --- | --- |
| State | in-progress |
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

- State in one sentence: The free Firestore backend, canonical corpus, vector index, real retrieval, and Vercel credentials are ready; focused commit, preview, production verification, old-variable cleanup, and closeout remain.
- Works now: `ragStore.ts` provides lazy server credentials and 768-dimensional native vector queries; ingestion writes deterministic canonical chunks; the dedicated service account has only `Cloud Datastore User`; Firestore contains 42 chunks across all 36 current canonical IDs; the vector index is `READY`; a real DreamLife query returns canonical IDs; all Vercel targets have the new server variables; 6 test files and 17 tests plus the final production build pass.
- Incomplete or stubbed: The working tree is not committed or deployed; Preview and Production diagnostics/chat/routes have not yet been verified; obsolete Supabase Vercel variables remain as rollback data.
- Safe exposure: Production still runs the historical deployment. The new project has `freeTier: true`, `billingEnabled: false`, direct client access is not configured, and server access is least privilege.

### Known-Good Point

- Commit: `5d0765eca5f5869f1d64d6353ec5a233430d0a7b` before the uncommitted migration.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test`, `npm run inventory:content`, `npm run build` under Node.js 24.
- Verification result: 6 files and 17 tests pass; lint has 0 errors and 11 retained warnings; inventory has 39 nodes, 38 authored IDs, 1 explicit fallback, 0 runtime/AI divergences, and 0 errors; the final Next.js 16 production build passes and regenerates both Node API routes.
- External state: Firebase project `mark-portfolio-ai-mpere056`, Firestore `(default)` in `nam5`, `freeTier: true`, `billingEnabled: false`, service account `portfolio-website-ai@mark-portfolio-ai-mpere056.iam.gserviceaccount.com`, one active JSON key downloaded outside the repository, and one restricted Gemini key stored in Vercel.
- Secrets: The JSON key is outside the repository and must never be printed or staged.

### Restart Here

- Next exact action: Stage only migration files, run the secret scan, create the focused commit, and push that exact commit to `codex/firebase-rag-migration` for Vercel Preview.
- First files/symbols: `src/lib/ragStore.ts`, `scripts/ingest.ts`, `firestore.indexes.json`, Firebase IAM, and the Vercel project environment.
- Expected observable result: Vercel Preview reaches Ready; `/api/rag/diag` returns canonical Firestore results and `/api/chat` returns grounded output.
- Only after that: Promote the exact commit to `main`, verify production and public domains, remove Supabase variables, reconcile `ARC-01`, and accept evidence.

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
| Package | `ARC-01` canonical IDs | resolved for code | Canonical ingestion is implemented; acceptance waits for the new corpus |

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
- [ ] Re-run tests, inventory, audit, and production build.
- [ ] Deploy and verify diagnostics, chat, and all public domains.
- [ ] Remove obsolete Supabase runtime variables after successful cutover.
- [ ] Reconcile capability, evidence, dashboard, `ARC-01`, and resume records.
- [ ] Commit and push only the intended migration files.

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

## Completion Summary

Complete only after accepted production evidence proves the free-tier Firestore cutover and focused push.
