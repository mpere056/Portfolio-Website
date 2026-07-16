# BAS-08 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `BAS-08` Durable free-tier retrieval datastore migration |
| Lifecycle | in-progress |
| Owner | Codex |
| Capabilities | `CAP-BAS-008`, supports `CAP-ARC-001` |
| Requirements | Platform, `V-10`, `V-11` |
| Branch/task | `main` |
| Work items | `WI-BAS-08-01` |
| Target environment | local, Firebase, Vercel production |
| Started | 2026-07-15 |
| Last assessed | 2026-07-16, uncommitted |

## Scope Delivered

The local application now uses a server-only Firestore vector-store contract instead of Supabase. Current MDX remains the authoritative corpus, ingestion writes deterministic canonical chunks, direct client access is denied, and automated tests cover credentials, vector querying, retrieval mapping, and chat fallback.

## Partial State

### Works Now

- Firestore `(default)` exists in `mark-portfolio-ai-mpere056`, region `nam5`, with `freeTier: true` and `billingEnabled: false`.
- One matching service-account JSON key exists outside the repository; the account has only `roles/datastore.user`.
- Local retrieval and ingestion code compiles and 17 tests pass.
- The Firestore service-account read succeeds; the 768-dimensional index is `READY`; 42 documents cover all 36 current canonical IDs.
- A real DreamLife retrieval returns canonical IDs and 4,635 context characters.

### Named Gaps

| Capability | Dimension | Gap | Exposure | Next evidence needed |
| --- | --- | --- | --- | --- |
| `CAP-BAS-008` | `R` | Vercel credentials exist, but the migration commit is not deployed | historical backend remains live | Exact-commit preview and production checks |
| `CAP-ARC-001` | `R` | Canonical retrieval IDs are not deployed | internal only | Real vector query returns canonical IDs |

### Safe Exposure

The migration is uncommitted and undeployed. Firestore direct-client rules deny access, and no public Firebase configuration has been introduced.

## Evidence Items

### EV-BAS-08-01: Firestore Retrieval Contract Tests

| Field | Value |
| --- | --- |
| Status | candidate |
| Type | unit-test |
| Claim | Firebase credentials fail closed, vector queries use the expected 768-dimensional contract, retrieval preserves canonical IDs, and chat fallback remains grounded |
| Capabilities | `CAP-BAS-008`, `CAP-ARC-001` |
| Dimensions | `A`, `I`, `T` |
| Requirements | Platform, `V-10`, `V-11` |
| Date | 2026-07-15 |
| Reviewer | Codex |
| Commit | uncommitted |
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

- Add integration, preview, and production evidence after the external configuration is complete.

### EV-BAS-08-02: Spark Firestore Foundation

| Field | Value |
| --- | --- |
| Status | candidate |
| Type | privacy-security |
| Claim | The target database exists on the no-cost Spark plan with deny-all direct-client access, and the service credential matches the intended project and account |
| Capabilities | `CAP-BAS-008` |
| Dimensions | `S`, `A` |
| Requirements | Platform |
| Date | 2026-07-15 |
| Reviewer | Codex |
| Commit | external configuration before commit |
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

- Reconcile as accepted after the focused commit records this configuration.

### EV-BAS-08-03: Canonical Firestore Retrieval Integration

| Field | Value |
| --- | --- |
| Status | candidate |
| Type | integration-test |
| Claim | The free Firestore backend contains the complete current corpus and the application retrieval path returns canonical, relevant results through the ready vector index |
| Capabilities | `CAP-BAS-008`, `CAP-ARC-001` |
| Dimensions | `A`, `I`, `T` |
| Requirements | Platform, `V-10`, `V-11` |
| Date | 2026-07-16 |
| Reviewer | Codex |
| Commit | uncommitted |
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

- Preview and production API behavior are not yet included.

#### Follow-Up

- Add Preview and Production evidence for the committed deployment.

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-BAS-008` | unknown | `S: accepted; C: not-applicable; A: ready-for-review; I: ready-for-review; T: ready-for-review; Q: not-applicable; R: working` | in-progress | on-track | high | `EV-BAS-08-01` through `EV-BAS-08-03` candidate | `WI-BAS-08-01` | Exact-commit Preview passes |
| `CAP-ARC-001` | rollout not started | managed corpus and real canonical retrieval now work; acceptance waits on rollout | in-progress | on-track | high | `EV-BAS-08-03`, `EV-ARC-01-01` candidate | `WI-ARC-01-01` paused | Preview and Production return canonical IDs |

## Completion Or Reopen Decision

Open. Do not complete until the exact deployed commit passes real Firestore retrieval, grounded chat, and public-domain verification.
