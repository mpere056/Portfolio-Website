# BAS-08 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `BAS-08` Durable free-tier retrieval datastore migration |
| Lifecycle | complete |
| Owner | Codex |
| Capabilities | `CAP-BAS-008`, supports `CAP-ARC-001` |
| Requirements | Platform, `V-10`, `V-11` |
| Branch/task | `main` |
| Work items | `WI-BAS-08-01` |
| Target environment | local, Firebase, Vercel production |
| Started | 2026-07-15 |
| Last assessed | 2026-07-16 at `fe64bb6`, Preview and Production accepted |

## Scope Delivered

The application now uses a server-only Firestore vector-store contract instead of Supabase in production. Current MDX remains the authoritative corpus, ingestion writes deterministic canonical chunks, direct client access is denied, and automated tests cover credentials, vector querying, retrieval mapping, and chat fallback.

## Accepted State

### Works Now

- Firestore `(default)` exists in `mark-portfolio-ai-mpere056`, region `nam5`, with `freeTier: true` and `billingEnabled: false`.
- One matching service-account JSON key exists outside the repository; the account has only `roles/datastore.user`.
- Local retrieval and ingestion code compiles and 17 tests pass.
- The Firestore service-account read succeeds; the 768-dimensional index is `READY`; 42 documents cover all 36 current canonical IDs.
- A real DreamLife retrieval returns canonical IDs and 4,635 context characters.
- Commit `fe64bb6` passed the exact-commit Preview and was promoted to production deployment `dpl_3HGisq6kX91L3yKVh1d9Ae8DrHQW`.
- The main domain, all three project subdomains, and all three project blog routes return HTTP 200.
- Production retrieval returns the same 4,635-character canonical context, and grounded chat returns HTTP 200 with substantive streamed output.
- Obsolete Supabase variables have been removed from Vercel; Firebase and Gemini variables remain encrypted.

### Residual Operations

- The active service-account JSON remains outside the repository in the user's Downloads folder. Deleting that local copy requires explicit user approval and is not a runtime dependency.
- A key created earlier in an inaccessible historical Google project should be revoked if access to that account is recovered. It is not referenced by this repository, Firebase project, or Vercel.
- The first production chat invocation was slow but completed successfully; future observability work should record cold-start and model-fallback latency without reopening this datastore migration.

### Safe Exposure

Firestore direct-client rules deny access, no public Firebase configuration was introduced, billing remains disabled, and Vercel production can roll back through its retained deployment history.

## Evidence Items

### EV-BAS-08-01: Firestore Retrieval Contract Tests

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | unit-test |
| Claim | Firebase credentials fail closed, vector queries use the expected 768-dimensional contract, retrieval preserves canonical IDs, and chat fallback remains grounded |
| Capabilities | `CAP-BAS-008`, `CAP-ARC-001` |
| Dimensions | `A`, `I`, `T` |
| Requirements | Platform, `V-10`, `V-11` |
| Date | 2026-07-15 |
| Reviewer | Codex |
| Commit | `fe64bb6` |
| Environment | Local Node.js 24 |

#### Method

```powershell
npm test
```

#### Expected

Lint has no errors and all focused repository tests pass.

#### Actual

- 6 test files and 17 tests passed.
- Firestore store tests cover newline-normalized private keys, missing-credential failure, deterministic document IDs, query construction, and result mapping.
- Retrieval tests cover empty results, canonical ID de-duplication, and embedding-shape rejection.
- Lint reported 0 errors and 11 retained warnings.
- The final Next.js 16 production build completed and regenerated both Node API routes.
- The content inventory reported 39 nodes, 0 errors, and 0 runtime/AI ID divergences.
- The production dependency audit reported 0 high and 0 critical findings.

#### Limitations

- This does not prove IAM, index readiness, real writes, Vercel configuration, or live production behavior.

#### Follow-Up

- Keep the suite as the regression gate for later retrieval changes.

### EV-BAS-08-02: Spark Firestore Foundation

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | privacy-security |
| Claim | The target database exists on the no-cost Spark plan with deny-all direct-client access, and the service credential matches the intended project and account |
| Capabilities | `CAP-BAS-008` |
| Dimensions | `S`, `A` |
| Requirements | Platform |
| Date | 2026-07-15 |
| Reviewer | Codex |
| Commit | External configuration represented by `fe64bb6` |
| Environment | Firebase project `mark-portfolio-ai-mpere056`, Firestore `(default)`, `nam5` |

#### Method

1. Inspect Firebase project billing and Firestore database settings.
2. Validate only non-secret JSON identity fields locally.
3. Attempt one read-only query with the service account.

#### Expected

The project remains on Spark, the credential identifies the intended service account, and access either succeeds or fails only at the named IAM boundary.

#### Actual

- Firestore reports `freeTier: true`; Cloud Billing reports `billingEnabled: false` and no billing account.
- The downloaded key identifies `mark-portfolio-ai-mpere056` and `portfolio-website-ai@mark-portfolio-ai-mpere056.iam.gserviceaccount.com`.
- IAM contains exactly the required `roles/datastore.user` binding for the runtime service account, and the read probe returns `FIRESTORE_READ_OK 0`.

#### Limitations

- Production rollout remains outside this infrastructure evidence.

#### Follow-Up

- Preserve the no-billing and least-privilege constraints for future changes.

### EV-BAS-08-03: Canonical Firestore Retrieval Integration

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test |
| Claim | The free Firestore backend contains the complete current corpus and the application retrieval path returns canonical, relevant results through the ready vector index |
| Capabilities | `CAP-BAS-008`, `CAP-ARC-001` |
| Dimensions | `A`, `I`, `T` |
| Requirements | Platform, `V-10`, `V-11` |
| Date | 2026-07-16 |
| Reviewer | Codex |
| Commit | `fe64bb6` |
| Environment | `mark-portfolio-ai-mpere056` Firestore and Gemini Developer API |

#### Method

1. Ingest current MDX with `npm run ingest` using in-memory managed credentials.
2. Count Firestore documents and unique `contentId` values.
3. Confirm the vector index state and dimension through the Firestore Admin API.
4. Run `fetchContext('What did Mark build with DreamLife and why was it valuable?', 4)` through `.tools/verify-retrieval.ts`.

#### Expected

All 36 current one-level sources are present, the index is ready at 768 dimensions, and retrieval returns useful context with canonical IDs.

#### Actual

- 42 chunk documents cover 36 unique canonical IDs.
- Vector index `CICAgOjXh4EK` is `READY` with 768 dimensions.
- The application returned 4,635 context characters and `timeline:dreamlife`, `project:dreamlife`, and `misc:more-app-info`.
- `gemini-embedding-2` returned 768 dimensions; the configured Flash Lite fallback produced the exact validation response during a primary-model `503` period.

#### Limitations

- This integration check does not measure model latency or long-term retrieval quality drift.

#### Follow-Up

- Use the preview and production records below for rollout acceptance.

### EV-BAS-08-04: Exact-Commit Preview Cutover

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | preview |
| Claim | The committed Firebase migration works through Vercel's managed environment before production promotion |
| Capabilities | `CAP-BAS-008`, `CAP-ARC-001` |
| Dimensions | `I`, `T`, `R` |
| Requirements | Platform, `V-10`, `V-11` |
| Date | 2026-07-16 |
| Reviewer | Codex |
| Commit | `fe64bb68443f9d48a758683f8968367ce1ebd98a` |
| Environment | Vercel Preview `dpl_DjW5r68niS2D9KP7uPq5g1io6atE` |

#### Method And Actual

- Used authenticated `vercel curl` protection bypass against the exact deployment.
- `/`, all three `/sites/{site}` pages, and all three `/sites/{site}/blog` pages returned HTTP 200.
- `/api/rag/diag` returned HTTP 200, `ok: true`, 4,635 context characters, and `timeline:dreamlife`, `project:dreamlife`, and `misc:more-app-info`.
- `/api/chat` returned HTTP 200 and 1,116 characters of streamed, grounded DreamLife output.

#### Limitations

- Preview authentication required Vercel CLI bypass, so custom-domain behavior is covered by production evidence.

### EV-BAS-08-05: Production Cutover And Public Domains

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | production |
| Claim | Firestore retrieval, grounded generation, and every public portfolio domain remain healthy after production cutover |
| Capabilities | `CAP-BAS-008`, `CAP-ARC-001` |
| Dimensions | `I`, `T`, `R` |
| Requirements | Platform, `V-10`, `V-11` |
| Date | 2026-07-16 |
| Reviewer | Codex |
| Commit | `fe64bb68443f9d48a758683f8968367ce1ebd98a` |
| Environment | Vercel Production `dpl_3HGisq6kX91L3yKVh1d9Ae8DrHQW` |

#### Method And Actual

- Promoted the accepted Preview and waited for Vercel status `Ready` with all four custom-domain aliases.
- `marknperera.ca`, each project subdomain home, and each project subdomain `/blog` route returned HTTP 200.
- Production `/api/rag/diag` returned 4,635 context characters and the expected canonical DreamLife IDs.
- Production `/api/chat` returned HTTP 200 and 1,052 characters of grounded streamed output.
- Removed all remaining Supabase environment records after successful cutover and confirmed only Firebase/Gemini runtime configuration remains.

#### Rollback

- Vercel retains the previously Ready production deployment in deployment history; Firestore direct-client access remains deny-all.

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-BAS-008` | unknown | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: accepted` | verified | on-track | high | `EV-BAS-08-01` through `EV-BAS-08-05` accepted | `WI-BAS-08-01` done | Preserve no-billing and deny-all guardrails |
| `CAP-ARC-001` | rollout not started | canonical IDs are accepted in code, the managed corpus, Preview, and Production | verified | on-track | high | `EV-ARC-01-01`, `EV-BAS-08-03` through `EV-BAS-08-05` accepted | `WI-ARC-01-01` done | Begin shared contracts in `ARC-02` |

## Completion Or Reopen Decision

Complete. Commit `fe64bb6` passed local verification, canonical Firestore integration, exact-commit Preview, grounded production chat, all seven public route checks, no-billing review, obsolete-variable cleanup, and focused GitHub push.
