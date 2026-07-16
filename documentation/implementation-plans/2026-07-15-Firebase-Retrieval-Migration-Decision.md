# Firebase Retrieval Migration Decision

Date: 2026-07-15; account/project target revised 2026-07-16
Status: approved and complete
Package: `BAS-08`
Capability: `CAP-BAS-008`

## Decision

Replace the portfolio AI retrieval store with Cloud Firestore native vector search in the dedicated `mark-portfolio-ai-mpere056` Firebase project owned by `mpere056@gmail.com`. Keep Gemini for embeddings and generation, Vercel for the Next.js deployment, and the current MDX corpus as the authoritative source for re-indexing.

The Firebase project must remain on the no-cost Spark plan. Do not enable billing, start a trial, or add a payment method for this migration.

## Why

- The previous Supabase project was paused for more than 90 days and can no longer be restored through its dashboard.
- The database backup preserves historical rows and vectors, but the current MDX corpus is newer and already participates in canonical content-ID validation.
- Firestore supports server-side vector search with the existing 768-dimensional Gemini embeddings.
- The current corpus is small enough for the Spark plan's storage and daily operation allowances, while application rules can deny all public client access.

## Architecture

| Concern | Decision |
| --- | --- |
| Authoritative content | Repository MDX under `src/content` |
| Embeddings | Gemini `text-embedding-004`, 768 dimensions |
| Vector store | Firestore `(default)` database, `rag_docs` collection |
| Retrieval | Server-only nearest-neighbor query using Euclidean distance |
| Document identity | Deterministic ID derived from canonical content ID and chunk index |
| Runtime credentials | `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` |
| Client access | Denied by `firestore.rules`; no Firebase browser SDK |
| Index | 768-dimensional flat vector index on `rag_docs.embedding` |
| Deployment | Node.js Vercel functions for retrieval and chat |

## Migration Method

1. Create Firestore in the existing Firebase project on Spark.
2. Create one dedicated service-account JSON key and keep it outside the repository.
3. Grant the service account only the data-plane access required by the Vercel runtime and ingestion script.
4. Create the vector index and retain deny-all public rules.
5. Re-index from current MDX using canonical IDs; do not import stale Supabase vectors.
6. Add server credentials to Vercel without exposing them to the client bundle.
7. Verify diagnostics, grounded chat, project subdomains, and rollback readiness before removing obsolete Supabase variables.

## Rejected Alternatives

- Restore into another Supabase project: rejected because it repeats the pause-risk the user asked to avoid.
- Import the SQL backup into Firestore: rejected because the schemas differ and the current repository corpus is the authoritative, canonical-ID-aware source.
- Firebase client SDK access: rejected because retrieval and ingestion are server concerns and public database access is unnecessary.
- Billing-backed Firebase features: rejected because the migration must remain completely free.

The first Firebase target, `mark-portfolio-ai`, was abandoned because it was not accessible to the user's selected `mpere056@gmail.com` account. No portfolio corpus or Vercel runtime was cut over to that project. Mark approved creating the dedicated replacement project under the selected account.

## Security And Operations

- Never commit the downloaded JSON key or place its contents in documentation, logs, screenshots, test fixtures, or client-prefixed environment variables.
- Keep Firestore rules deny-all for direct clients. The server service account bypasses client rules through IAM.
- Rotate the key if it is exposed and record the replacement without preserving the secret.
- The Supabase database and storage backups remain recovery artifacts, not runtime dependencies.
- Historical `BAS-07` evidence remains valid for its original deployment and is superseded only for the retrieval-backend contract by `BAS-08` evidence.

## Acceptance

`BAS-08` is complete only when the local suite and production build pass, Firestore contains the canonical corpus, a real vector query returns expected canonical IDs, Vercel uses the server-only Firebase credentials, live diagnostics and chat succeed, all public domains remain healthy, and a focused commit is pushed with accepted evidence.
