# Implementation Evidence Registry

Last updated: 2026-07-17

## Purpose

This folder stores durable summaries proving implementation, verification, review, and rollout claims made by the portfolio implementation plans.

Evidence is not limited to passing tests. This project also requires factual content review, creative and interaction review, performance inspection, privacy checks, preview verification, and live route checks.

## Evidence IDs

Use:

```text
EV-{PACKAGE-ID}-{SEQUENCE}
```

Examples:

- `EV-BAS-01-01`
- `EV-EXP-03-02`
- `EV-PRJ-04-07`

## Phase 2 Exploration Shell

| Evidence ID | Package | Status | Durable record |
| --- | --- | --- | --- |
| `EV-QA-01-01` | `QA-01` | accepted | `QA-01.md` |
| `EV-EXP-02-01`, `EV-EXP-02-02` | `EXP-02` | accepted | `EXP-02.md` |
| `EV-EXP-03-01`, `EV-EXP-03-02` | `EXP-03` | accepted | `EXP-03.md` |
| `EV-KG-05-01` | `KG-05` | accepted | `KG-05.md` |
| `EV-KG-06-01`, `EV-KG-06-02` | `KG-06` | accepted | `KG-06.md` |
| `EV-AI-02-01`, `EV-AI-02-02` | `AI-02` | accepted | `AI-02.md` |
| `EV-AI-03-01` | `AI-03` | accepted | `AI-03.md` |
| `EV-EXP-04-01`, `EV-EXP-04-02` | `EXP-04` | accepted | `EXP-04.md` |
| `EV-EXP-05-01` through `EV-EXP-05-03` | `EXP-05` | accepted | `EXP-05.md` |
| `EV-EXP-06-01`, `EV-EXP-06-02` | `EXP-06` | accepted | `EXP-06.md` |

| `EV-QA-01-02` through `EV-QA-01-04` | Phase 2 aggregate | accepted | `QA-01.md` |

Aggregate local, protected Preview, and production-safe deployment records are complete in `QA-01.md`.

## Phase 3 First Flagship

| Evidence ID | Package | Status | Durable record |
| --- | --- | --- | --- |
| `EV-PRJ-01-01` through `EV-PRJ-01-03` | `PRJ-01` | accepted | `PRJ-01.md` |
| `EV-QA-06-01` | `QA-06` | accepted | `QA-06.md` |
| `EV-PRJ-02-01`, `EV-PRJ-02-02` | `PRJ-02` | accepted | `PRJ-02.md` |
| `EV-PRJ-03-01` through `EV-PRJ-03-03` | `PRJ-03` | accepted | `PRJ-03.md` |
| `EV-LPS-06-01`, `EV-LPS-06-02` | `LPS-06` | accepted | `LPS-06.md` |

Sequence numbers are two digits and are never reused. An evidence item may support several capabilities, but it belongs to the package that produced it.

## Evidence Status

| Status | Meaning |
| --- | --- |
| `candidate` | Collected but not yet reviewed against the named criterion |
| `accepted` | Reviewed and sufficient for the named claim |
| `failed` | Demonstrates that the criterion did not pass; retain it with next action |
| `superseded` | Was valid for an older contract, commit, content version, or release |
| `expired` | External artifact is unavailable and its durable summary is insufficient for reuse |

Never silently replace failed or superseded evidence. Add a new evidence ID and link the relationship.

## Evidence Types

| Type | Typical proof | Suitable dimensions |
| --- | --- | --- |
| `decision` | Approved record with alternatives and consequences | `S`, `A` |
| `content-review` | Reviewed source list, factual changes, and approval | `C`, `Q` |
| `contract` | Typecheck, fixtures, validators, and consumer proof | `A`, `T` |
| `unit-test` | Command, commit, result, and relevant test names | `I`, `T` |
| `integration-test` | Repeatable cross-system flow and result | `I`, `T` |
| `browser-flow` | Steps, environment, browser, result, screenshots/video where useful | `I`, `T`, `Q` |
| `visual-review` | Stable checkpoint images and review notes | `Q` |
| `creative-review` | Taste, pacing, mystery, discoverability, and accuracy decision | `Q` |
| `performance` | Baseline, target device, method, and comparison | `Q`, `R` |
| `privacy-security` | Threat or data-flow review and test result | `A`, `T`, `R` |
| `preview` | Deployment, commit, flags, routes, and gate result | `R` |
| `production` | Live route checks, monitoring, and rollback readiness | `R` |

## Registry

| Evidence ID | Package | Capabilities | Type | Status | Commit/environment | Recorded | File |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `EV-BAS-01-01` | `BAS-01` | `CAP-BAS-001` | integration-test | accepted | `c924104` local production build | 2026-07-14 | `BAS-01.md` |
| `EV-BAS-01-02` | `BAS-01` | `CAP-BAS-001` | unit-test | accepted | `c924104` local tests | 2026-07-14 | `BAS-01.md` |
| `EV-BAS-01-03` | `BAS-01` | `CAP-BAS-001` | performance | accepted | `c924104` repository assets | 2026-07-14 | `BAS-01.md` |
| `EV-BAS-01-04` | `BAS-01` | `CAP-BAS-001` | production | accepted | Live production routes | 2026-07-14 | `BAS-01.md` |
| `EV-BAS-02-01` | `BAS-02` | `CAP-BAS-002` | unit-test | accepted | `7b99008` local tests | 2026-07-14 | `BAS-02.md` |
| `EV-BAS-02-02` | `BAS-02` | `CAP-BAS-002` | content-review | accepted | Repository content and routes | 2026-07-14 | `BAS-02.md` |
| `EV-BAS-02-03` | `BAS-02` | `CAP-BAS-002` | integration-test | accepted | `7b99008` local production build | 2026-07-14 | `BAS-02.md` |
| `EV-BAS-05-01` | `BAS-05` | `CAP-BAS-005` | integration-test | accepted | `4144bcc` source and runtime inspection | 2026-07-14 | `BAS-05.md` |
| `EV-BAS-05-02` | `BAS-05` | `CAP-BAS-005` | content-review | accepted | Target-state implementation matrix | 2026-07-14 | `BAS-05.md` |
| `EV-BAS-05-03` | `BAS-05` | `CAP-BAS-005` | decision | accepted | Dependency-ordered implementation sequence | 2026-07-14 | `BAS-05.md` |
| `EV-BAS-04-01` | `BAS-04` | `CAP-BAS-004` | decision | accepted | Official support policies and decision record | 2026-07-14 | `BAS-04.md` |
| `EV-BAS-04-02` | `BAS-04` | `CAP-BAS-004` | production | accepted | Vercel deployment `a894aaf` and build logs | 2026-07-14 | `BAS-04.md` |
| `EV-BAS-04-03` | `BAS-04` | `CAP-BAS-004` | integration-test | accepted | Node.js 22/24 isolated probes at `a894aaf` | 2026-07-14 | `BAS-04.md` |
| `EV-BAS-04-04` | `BAS-04` | `CAP-BAS-004` | privacy-security | accepted | Production dependency audit and source review | 2026-07-14 | `BAS-04.md` |
| `EV-BAS-06-01` | `BAS-06` | `CAP-BAS-006` | unit-test | accepted | Node.js 24, 3 files and 6 tests | 2026-07-14 | `BAS-06.md` |
| `EV-BAS-06-02` | `BAS-06` | `CAP-BAS-006` | integration-test | accepted | Node.js 24, 24-page production build | 2026-07-14 | `BAS-06.md` |
| `EV-BAS-06-03` | `BAS-06` | `CAP-BAS-006` | privacy-security | accepted | Production audit comparison | 2026-07-14 | `BAS-06.md` |
| `EV-BAS-06-04` | `BAS-06` | `CAP-BAS-006` | preview | accepted | Vercel `dpl_2mydKQDCRRkyHfnt9qrYXRNSPGVt` | 2026-07-14 | `BAS-06.md` |
| `EV-BAS-06-05` | `BAS-06` | `CAP-BAS-006` | production | accepted | Vercel `dpl_7FRQWihojVoVftNVmF5a7imVV55C` and live routes | 2026-07-14 | `BAS-06.md` |
| `EV-BAS-07-01` | `BAS-07` | `CAP-BAS-007` | unit-test | accepted | `64e8e00`, 4 files and 9 tests | 2026-07-14 | `BAS-07.md` |
| `EV-BAS-07-02` | `BAS-07` | `CAP-BAS-007` | integration-test | accepted | `64e8e00` local production build | 2026-07-14 | `BAS-07.md` |
| `EV-BAS-07-03` | `BAS-07` | `CAP-BAS-007` | browser-flow | accepted | Local representative routes, rewrites, 3D, and API boundaries | 2026-07-14 | `BAS-07.md` |
| `EV-BAS-07-04` | `BAS-07` | `CAP-BAS-007` | preview | failed | Vercel `dpl_GajydSx74TwzDNS78GDW6gbtFNLP` | 2026-07-14 | `BAS-07.md` |
| `EV-BAS-07-05` | `BAS-07` | `CAP-BAS-007` | preview | failed | Vercel `dpl_FsZPpagxLkpke94vzsmvn3XN6QPG` | 2026-07-14 | `BAS-07.md` |
| `EV-BAS-07-06` | `BAS-07` | `CAP-BAS-007` | preview | failed | Vercel `dpl_CzuQ4DPYks78feKbEUNVu6ZAwMh5` | 2026-07-14 | `BAS-07.md` |
| `EV-BAS-07-07` | `BAS-07` | `CAP-BAS-007` | preview | failed | Vercel `dpl_Dd24f231s4ivduZGfwhhQ4JFfP3w` | 2026-07-14 | `BAS-07.md` |
| `EV-BAS-07-08` | `BAS-07` | `CAP-BAS-007` | preview | accepted | Vercel `dpl_BYMrYgS9ZBSDNCDbe9VhfYsXNEL9` | 2026-07-14 | `BAS-07.md` |
| `EV-BAS-07-09` | `BAS-07` | `CAP-BAS-007` | production | accepted | Vercel `dpl_CfieGiesbhQnT2DKUa6x1iUvkURQ` and live routes | 2026-07-14 | `BAS-07.md` |
| `EV-BAS-08-01` | `BAS-08` | `CAP-BAS-008`, `CAP-ARC-001` | unit-test | accepted | `fe64bb6`, 6 files and 17 tests | 2026-07-15 | `BAS-08.md` |
| `EV-BAS-08-02` | `BAS-08` | `CAP-BAS-008` | privacy-security | accepted | Spark Firestore foundation and IAM boundary | 2026-07-15 | `BAS-08.md` |
| `EV-BAS-08-03` | `BAS-08` | `CAP-BAS-008`, `CAP-ARC-001` | integration-test | accepted | 42 chunks, 36 canonical IDs, ready vector index, real retrieval | 2026-07-16 | `BAS-08.md` |
| `EV-BAS-08-04` | `BAS-08` | `CAP-BAS-008`, `CAP-ARC-001` | preview | accepted | `fe64bb6`, Vercel `dpl_DjW5r68niS2D9KP7uPq5g1io6atE` | 2026-07-16 | `BAS-08.md` |
| `EV-BAS-08-05` | `BAS-08` | `CAP-BAS-008`, `CAP-ARC-001` | production | accepted | `fe64bb6`, Vercel `dpl_3HGisq6kX91L3yKVh1d9Ae8DrHQW` and live routes | 2026-07-16 | `BAS-08.md` |
| `EV-ARC-01-01` | `ARC-01` | `CAP-ARC-001` | unit-test | accepted | `fe64bb6`, 6 files and 17 tests | 2026-07-16 | `ARC-01.md` |
| `EV-ARC-02-01` | `ARC-02` | `CAP-ARC-002` | contract | accepted | `91e6d54`, 7 files and 19 tests | 2026-07-16 | `ARC-02.md` |
| `EV-ARC-02-02` | `ARC-02` | `CAP-ARC-002` | contract | accepted | `6a24533`, 8 files and 26 tests | 2026-07-16 | `ARC-02.md` |
| `EV-ARC-03-01` | `ARC-03` | `CAP-ARC-003` | integration-test | accepted | `6a24533`, registry/build gate | 2026-07-16 | `ARC-03.md` |
| `EV-ARC-04-01` | `ARC-04` | `CAP-ARC-004` | integration-test | accepted | `55e6104`, 9 files and 29 tests | 2026-07-16 | `ARC-04.md` |
| `EV-ARC-05-01` | `ARC-05` | `CAP-ARC-005` | integration-test | accepted | `d5fca11`, 10 files and 37 tests | 2026-07-16 | `ARC-05.md` |
| `EV-BAS-03-01` | `BAS-03` | `CAP-BAS-003` | contract | accepted | `afa5f67`, feature-flag fixtures | 2026-07-16 | `BAS-03.md` |
| `EV-EXP-01-01` | `EXP-01` | `CAP-EXP-001`, `CAP-EXP-002` | integration-test | accepted | `afa5f67`, persistence fixtures | 2026-07-16 | `EXP-01.md` |
| `EV-AI-01-01` | `AI-01` | `CAP-AI-001`, `CAP-AI-002` | integration-test | accepted | `afa5f67`, nested-context fixtures | 2026-07-16 | `AI-01.md` |
| `EV-KG-01-01` | `KG-01` | `CAP-KG-001` | integration-test | accepted | `afa5f67`, loader parity fixtures | 2026-07-16 | `KG-01.md` |
| `EV-KG-02-01` | `KG-02` | `CAP-KG-002` | contract | accepted | `afa5f67`, schema fixtures | 2026-07-16 | `KG-02.md` |
| `EV-KG-03-01` | `KG-03` | `CAP-KG-003` | integration-test | accepted | `afa5f67` + `1c7129b`, prebuild graph gate | 2026-07-16 | `KG-03.md` |
| `EV-KG-04-01` | `KG-04` | `CAP-KG-004` | content-review | accepted | `afa5f67`, 49-node/19-edge fixture | 2026-07-16 | `KG-04.md` |
| `EV-LPS-01-01` | `LPS-01` | `CAP-LPS-001` | contract | accepted | `afa5f67`, lifecycle fixtures | 2026-07-16 | `LPS-01.md` |
| `EV-QA-01-01` | `QA-01` | Foundation flow | integration-test | accepted | `4c9b02a`, integrated contract fixture | 2026-07-16 | `QA-01.md` |
| `EV-EXP-02-01` | `EXP-02` | `CAP-EXP-003`, `CAP-EXP-004` | contract | accepted | `4c9b02a`, depth transition fixture | 2026-07-16 | `EXP-02.md` |
| `EV-EXP-02-02` | `EXP-02` | `CAP-EXP-003`, `CAP-EXP-004` | integration-test | accepted | `852e14c`, atomic controller and React boundary | 2026-07-16 | `EXP-02.md` |
| `EV-EXP-03-01` | `EXP-03` | `CAP-EXP-005`, `CAP-EXP-006` | integration-test | accepted | `27d2485`, 82-test/type/build gate | 2026-07-16 | `EXP-03.md` |
| `EV-EXP-03-02` | `EXP-03` | `CAP-EXP-005`, `CAP-EXP-006` | browser-flow | accepted | `27d2485`, local Development | 2026-07-16 | `EXP-03.md` |
| `EV-KG-05-01` | `KG-05` | `CAP-KG-005`, `CAP-KG-006` | integration-test | accepted | `e14b103`, 88-test/type/build gate | 2026-07-16 | `KG-05.md` |
| `EV-KG-06-01` | `KG-06` | `CAP-KG-007` | integration-test | accepted | `7597c1b`, 93-test/type/build gate | 2026-07-16 | `KG-06.md` |
| `EV-KG-06-02` | `KG-06` | `CAP-KG-007` | integration-test | accepted | `aeff727`, 42-document free Firestore backfill | 2026-07-16 | `KG-06.md` |
| `EV-AI-02-01` | `AI-02` | `CAP-AI-003`, `CAP-AI-004` | integration-test | accepted | `3dfef6b`, shell/provider/flag gate | 2026-07-16 | `AI-02.md` |
| `EV-AI-02-02` | `AI-02` | `CAP-AI-003`, `CAP-AI-004` | browser-flow | accepted | `3dfef6b`, local Development | 2026-07-16 | `AI-02.md` |
| `EV-AI-03-01` | `AI-03` | `CAP-AI-005` | privacy-security | accepted | `aeb3152`, request/source/retrieval fixtures | 2026-07-16 | `AI-03.md` |
| `EV-EXP-04-01` | `EXP-04` | `CAP-EXP-007`, `CAP-EXP-008` | integration-test | accepted | `4c80518`, focused tour/state/flag gate | 2026-07-17 | `EXP-04.md` |
| `EV-EXP-04-02` | `EXP-04` | `CAP-EXP-007`, `CAP-EXP-008` | browser-flow | accepted | `4c80518`, local Development | 2026-07-17 | `EXP-04.md` |
| `EV-EXP-05-01` | `EXP-05` | `CAP-EXP-009`, `CAP-EXP-010`, `CAP-EXP-011` | integration-test | accepted | `4276e6b`, focused environment/store/graph gate | 2026-07-17 | `EXP-05.md` |
| `EV-EXP-05-02` | `EXP-05` | `CAP-EXP-009`, `CAP-EXP-010`, `CAP-EXP-011` | browser-flow | accepted | `4276e6b`, local Development | 2026-07-17 | `EXP-05.md` |
| `EV-EXP-05-03` | `EXP-05` | `CAP-EXP-009`, `CAP-EXP-010`, `CAP-EXP-011` | integration-test | accepted | `4276e6b`, local production build | 2026-07-17 | `EXP-05.md` |
| `EV-EXP-06-01` | `EXP-06` | `CAP-EXP-012`, `CAP-EXP-013` | integration-test | accepted | `51b2e7d`, focused discovery/store/tour gate | 2026-07-17 | `EXP-06.md` |
| `EV-EXP-06-02` | `EXP-06` | `CAP-EXP-012`, `CAP-EXP-013` | browser-flow | accepted | `51b2e7d`, local Development | 2026-07-17 | `EXP-06.md` |
| `EV-QA-01-02` | `QA-01` | `CAP-QA-001` | integration-test | accepted | Phase 2 aggregate recorded at `3de7c3c` | 2026-07-17 | `QA-01.md` |
| `EV-QA-01-03` | `QA-01` | `CAP-QA-001` | preview | accepted | Vercel `dpl_4nL6kUcQjAfUjKdkNdCrDw4giwv9` | 2026-07-17 | `QA-01.md` |
| `EV-QA-01-04` | `QA-01` | `CAP-QA-001` | production | accepted | Vercel `dpl_51xD2i8nQU8zEgjFiHnvNCvB2JqA` and public routes | 2026-07-17 | `QA-01.md` |
| `EV-PRJ-01-01` | `PRJ-01` | `CAP-PRJ-001`, `CAP-PRJ-002` | contract | accepted | `e462080`, 134-test local gate | 2026-07-17 | `PRJ-01.md` |
| `EV-PRJ-01-02` | `PRJ-01` | `CAP-PRJ-001`, `CAP-PRJ-002` | integration-test | accepted | `e462080`, local production build | 2026-07-17 | `PRJ-01.md` |
| `EV-PRJ-01-03` | `PRJ-01` | `CAP-PRJ-001`, `CAP-PRJ-002` | production | accepted | Vercel `dpl_9DeyQkjizoRc91163TcF6TuumEbL`, public route smoke | 2026-07-17 | `PRJ-01.md` |
| `EV-QA-06-01` | `QA-06` | `CAP-QA-006` | integration-test | accepted | `1286931`, 6 integrity checks and full repository gate | 2026-07-17 | `QA-06.md` |
| `EV-PRJ-02-01` | `PRJ-02` | `CAP-PRJ-003`, `CAP-LIB-001`, `CAP-SDK-001`, `CAP-SDK-002` | integration-test | accepted | local focused tests and strict typecheck | 2026-07-18 | `PRJ-02.md` |
| `EV-PRJ-02-02` | `PRJ-02` | `CAP-PRJ-003` | decision | accepted | first flagship selection record | 2026-07-18 | `PRJ-02.md` |
| `EV-PRJ-03-01` | `PRJ-03` | `CAP-PRJ-004` | integration-test | accepted | local museum/flag/registry gate | 2026-07-18 | `PRJ-03.md` |
| `EV-PRJ-03-02` | `PRJ-03` | `CAP-PRJ-004` | browser-flow | accepted | local Development desktop and mobile | 2026-07-18 | `PRJ-03.md` |
| `EV-PRJ-03-03` | `PRJ-03` | `CAP-PRJ-004`, `CAP-EXP-011` | integration-test | accepted | full local gate, rollback, calm path, and build | 2026-07-18 | `PRJ-03.md` |
| `EV-LPS-06-01` | `LPS-06` | `CAP-LPS-007` | content-review | accepted | public source review and lifecycle validation | 2026-07-18 | `LPS-06.md` |
| `EV-LPS-06-02` | `LPS-06` | `CAP-LPS-007` | integration-test | accepted | museum attachment, render fixture, and local browser flow | 2026-07-18 | `LPS-06.md` |

## Required Evidence Fields

Every evidence item records:

- Evidence ID.
- Claim being supported.
- Package and capability IDs.
- Vision requirement or platform criterion.
- Evidence type and status.
- Date and reviewer.
- Commit hash.
- Environment, route, feature flags, browser, and device when relevant.
- Exact command or repeatable manual steps.
- Expected and actual result.
- Artifact links or repository paths.
- Known limitations and uncovered paths.
- Follow-up, superseding, or rollback relationship.

## Acceptance Rules

- A passing command without the tested behavior named is insufficient.
- A screenshot alone cannot prove interaction correctness.
- A preview link alone is not durable evidence; summarize what was checked.
- Creative acceptance must name what was reviewed, not only say it looks good.
- Production evidence must identify the deployed commit and live routes.
- Factual content acceptance names the source material or reviewer.
- One evidence item may advance several dimensions only when it genuinely proves each claim.
- Capability state `accepted` requires at least one accepted evidence item for that dimension.

## Storage Rules

- Keep concise durable summaries in this folder.
- Keep small stable screenshots under `documentation/implementation-evidence/assets/` when they add review value.
- Do not commit large videos, raw build caches, `.next`, local browser profiles, secrets, or private data.
- Link external CI, Vercel, or video artifacts, but include enough summary for the record to remain useful if the link expires.
- Use synthetic data for product demonstrations.
- Redact tokens, account identifiers, private repository material, and visitor data.

## Workflow

1. Copy `_Package-Evidence-Template.md` to `{PACKAGE-ID}.md` when a package starts producing evidence.
2. Add evidence items in sequence.
3. Add each item to the registry table above.
4. Link evidence IDs from capability detail records.
5. Update dimension states only after reviewing sufficiency.
6. Reconcile package status, dashboard, and release outcome.
7. Refresh the current work-item resume packet and update history.
8. Preserve failed and superseded items as implementation history.

## Integrity Audit

`QA-06` periodically checks:

- Every referenced evidence ID exists.
- Every `accepted` dimension has accepted evidence.
- Evidence package and capability IDs are valid.
- Production evidence identifies a commit and route.
- Preview-only proof is not represented as production rollout.
- Superseded contracts trigger capability reassessment.
- External links have durable summaries.
