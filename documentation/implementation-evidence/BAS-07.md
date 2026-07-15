# BAS-07 Evidence

Last updated: 2026-07-14

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `BAS-07` Supported framework modernization |
| Lifecycle | complete |
| Capability | `CAP-BAS-007` |
| Implementation commits | `5597390`, `cdac921`, `b8440f1`, `64e8e00` |
| Accepted preview | `dpl_BYMrYgS9ZBSDNCDbe9VhfYsXNEL9` |
| Production deployment | `dpl_CfieGiesbhQnT2DKUa6x1iUvkURQ` |
| Rollback deployment | `dpl_9RrqnJwgnKi1qkgUDw8KhWYv55PU` |

## Accepted Evidence

| Evidence | Type | Claim | Actual |
| --- | --- | --- | --- |
| `EV-BAS-07-01` | unit-test | Framework, runtime policy, retrieval, and chat fallback behavior are covered | On Node.js 24, 4 files and 9 tests passed, including primary-model generation and 503 fallback behavior |
| `EV-BAS-07-02` | integration-test | The supported dependency set produces the complete application | Next.js `16.2.10` with React `19.2.7` compiled, typechecked, and emitted its production artifacts; lint reported 0 errors and 14 retained warnings |
| `EV-BAS-07-03` | browser-flow | Representative main, project, 3D, rewrite, and API surfaces survive the coordinated migration | Local browser and visual checks rendered the representative routes, subdomain host rewrites, and 3D scene without application errors; two non-blocking Three.js warnings remain |
| `EV-BAS-07-08` | preview | The exact final commit serves routes, retrieval, and grounded chat with replacement infrastructure | Preview was Ready; `/api/rag/diag?q=projects` returned `ok: true`, 3,481 context characters, and four relevant slugs; a fixture chat request returned HTTP 200 and a grounded DreamLife response |
| `EV-BAS-07-09` | production | The Git-triggered production release is healthy and rollback-ready | Production was Ready; main, three project homes, and three project blog routes returned HTTP 200; production retrieval and grounded chat returned HTTP 200 |

## Retained Failed Evidence

| Evidence | Deployment | Failure | Repair relationship |
| --- | --- | --- | --- |
| `EV-BAS-07-04` | `dpl_GajydSx74TwzDNS78GDW6gbtFNLP` | The retired `text-embedding-004` model caused retrieval diagnostics to return HTTP 500 | Superseded by shared `gemini-embedding-2` query and ingestion policy in `cdac921` |
| `EV-BAS-07-05` | `dpl_FsZPpagxLkpke94vzsmvn3XN6QPG` | The preview environment still referenced an invalid prior Google credential | Superseded by the restricted replacement credential and rotated Vercel variables; no credential value is stored here |
| `EV-BAS-07-06` | `dpl_CzuQ4DPYks78feKbEUNVu6ZAwMh5` | Retrieval was repaired, but the retired chat model prevented the complete AI gate from passing | Superseded by `gemini-flash-latest` in `b8440f1` |
| `EV-BAS-07-07` | `dpl_Dd24f231s4ivduZGfwhhQ4JFfP3w` | A real transient Gemini capacity response exposed the lack of generation resilience | Superseded by the bounded `gemini-flash-lite-latest` fallback in `64e8e00` |

## Free Infrastructure Recovery

- Google Cloud project `mark-portfolio-ai` was created without a billing account or paid trial.
- The replacement Google API credential is restricted to the Gemini API and bound to the portfolio service account. Its secret is stored only in Vercel environment variables.
- Supabase project `rsrehghovmawqrrclzkd` was created on the existing Free organization because the previous project had been paused beyond dashboard recovery.
- The replacement Supabase project contains the 768-dimensional `docs` vector store, HNSW index, row-level access policy, and `match_docs` function.
- The committed content corpus was re-embedded before rollout; direct retrieval returned four relevant rows with 768-dimensional vectors.
- Production, Preview, and Development environment values were rotated independently in Vercel. Sensitive values are not committed or reproduced in evidence.

## Production Route Gate

The following public routes returned HTTP 200 after production promotion:

- `https://marknperera.ca/`
- `https://dreamlife.marknperera.ca/`
- `https://dreamlife.marknperera.ca/blog`
- `https://lifeinbox.marknperera.ca/`
- `https://lifeinbox.marknperera.ca/blog`
- `https://sudokutogether.marknperera.ca/`
- `https://sudokutogether.marknperera.ca/blog`

## Rollout And Residual Risk

- The fallback is intentionally limited to Google responses `404`, `429`, and `503`; unrelated application failures are not hidden.
- The final production release can roll back to Ready deployment `dpl_9RrqnJwgnKi1qkgUDw8KhWYv55PU` while the replacement external resources remain available.
- ESLint's 14 warnings, two non-blocking Three.js warnings, and the reviewed moderate/low dependency findings remain visible for later bounded work.
- The AI recovery validates the existing chat surface only. The planned quiet site-wide AI redesign remains separate target-state work.

## Completion Decision

`BAS-07` is complete. Framework, React/3D ecosystem, async APIs, proxy convention, lint CLI, local tests, build, browser behavior, retrieval, resilient chat, exact-commit preview, production, public routes, and rollback gates are accepted.
