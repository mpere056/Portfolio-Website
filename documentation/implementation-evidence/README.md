# Implementation Evidence Registry

Last updated: 2026-07-16

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

Replace the placeholder row when the first evidence item is added. The detailed record belongs in a package file named after the package ID, such as `EXP-03.md`.

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
