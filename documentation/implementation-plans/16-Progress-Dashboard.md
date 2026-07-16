# Implementation Continuation Dashboard

Last reconciled: 2026-07-16
Implementation commit baseline: pending focused implementation commit

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `DSH` |
| Status | Active summary; update whenever implementation or work-item state changes |
| Upstream | Work-item registry, capability ledger, work packages, evidence records, and decisions |
| Downstream | Session restart, work selection, milestone reviews, previews, and release decisions |
| Primary output | A concise view of current focus, last checkpoints, uncertainty, blockers, and exact next work |

## Current Program State

**Phase 0 implementation baseline and initial navigation contracts are established; typed cross-system actions are next.**

`BAS-08` replaced the unavailable Supabase backend with accepted free-tier Firestore retrieval, `ARC-01` accepted canonical identities through the managed corpus, and `ARC-02` now covers strict content IDs plus reviewed graph identities and the full discovery vocabulary. `ARC-03` adds the reviewed 27-entry destination registry and pure resolver. `WI-ARC-04-01` is the single ready implementation item.

This distinction prevents two errors:

- Treating the existing site as though nothing has been built.
- Treating a visually similar legacy feature as complete under the new contracts and acceptance criteria.

## Outcome Dashboard

| Outcome | Current stage | Health | Last coherent checkpoint | Critical gate | Next proof point |
| --- | --- | --- | --- | --- | --- |
| `O-00` Measured foundation | Typed action preparation | on-track | Free Firestore production, canonical IDs, reconciled contracts, 27 destinations, 26 tests, and passing build | Establish action semantics without hidden global coupling | Complete `WI-ARC-04-01` |
| `O-01` Persistent exploratory world | planned | not-active | Legacy spatial navigation and project expansion assessed | Architecture, graph queries, discovery migrations | One controlled depth and persistence fixture |
| `O-02` Quiet global AI | planned | not-active | Standalone RAG chat and its target gaps assessed | Context contract, public retrieval, destination validation | Nested context plus safe card-navigation fixture |
| `O-03` First flagship proof | not active | not-active | Candidate experiences documented | First-flagship selection and complete vertical slice | LifeInbox or Sudoku feasibility decision |
| `O-04` Portfolio museum | not active | not-active | Target flagship set documented | Stable first flagship framework | Three distinct flagship exhibits pass their gates |
| `O-05` About depth | not active | not-active | Target event-depth model documented | Reviewed event consequences | Five-event review plus one inspection flow |
| `O-06` Living portfolio operations | not active | not-active | Lifecycle direction documented | Project lifecycle classification | Every project classified and three flagship states reviewed |

## Package Snapshot

| Package state | Count | Meaning now |
| --- | ---: | --- |
| `ready` | 1 | `ARC-04` has accepted dependencies and a bounded work item |
| `in-progress` | 0 | No package is partially active between coherent checkpoints |
| `implemented` | 0 | Implemented packages have either passed acceptance or remain pending |
| `pending` | 40 | Valid packages waiting on accepted upstream work or sequencing |
| `reopened` | 0 | No accepted package currently has an unresolved contract regression |
| `decision-gated` | 1 | Project lifecycle classification needs Mark's approval |
| `prototype` | 4 | Bounded experiments, not committed product scope |
| `feedback-gated` | 1 | Studio scope waits for Mark's feedback |
| `later` | 5 | Accepted direction intentionally outside near-term delivery |
| `complete` | 10 | Seven baseline packages plus `ARC-01`, `ARC-02`, and `ARC-03` have accepted exit evidence |

Counts organize workflow states only. They do not measure feature completion. Recalculate this table whenever package rows change.

## Current Execution Queue

| Order | Package | Purpose | Status | Start condition | Completion signal |
| ---: | --- | --- | --- | --- | --- |
| 1 | `BAS-01` | Technical baseline | complete | None | Build, route, warning, model, test, and live-domain evidence accepted |
| 2 | `BAS-02` | Content inventory | complete | None | Reviewed inventory with missing stable IDs identified |
| 3 | `BAS-04` | Runtime maintenance decision | complete | None | Node.js 24 bridge and separate Next.js 16 package accepted |
| 4 | `BAS-06` | Supported runtime and security bridge | complete | `BAS-04` | Node.js 24 tests/build, audit delta, preview, production, and rollback evidence |
| 5 | `BAS-07` | Supported framework modernization | complete | `BAS-06` | Next.js 16, React/3D ecosystem, API, browser, visual, preview, and production gates pass |
| 6 | `BAS-05` | Target-state implementation audit | complete | `BAS-01`, `BAS-02`, `BAS-06`, `BAS-07` | Current and next capabilities have inspected states and restartable work items |
| 7 | `BAS-08` | Durable free-tier retrieval datastore | complete | `BAS-07`, `ARC-01` ingestion contract | Real canonical retrieval, grounded live chat, routes, and rollback evidence |
| 8 | `ARC-01` | Stable ID policy | complete | `BAS-02`; rollout verified by `BAS-08` | Validation fixture, canonical managed corpus, and rename policy |
| 9 | `ARC-02` | Shared contracts | complete | `ARC-01` | Graph-only node identity and full discovery vocabulary accepted in the shared fixture |
| 10 | `ARC-03` | Destination registry | complete | `ARC-02` | Registry parity, unknown-ID fallback, safe-state, and cross-subdomain tests accepted |
| 11 | `ARC-04` | Cross-system actions | ready | `ARC-02`, using `ARC-03` destinations | Exhaustive action fixture resolves destinations by ID without browser-global events |
| 12 | `QA-01` | Foundation test harness | pending | `BAS-01`, `ARC-02` | One automated foundation flow |
| 13 | `KG-01` | Shared loader parity | pending | `ARC-01` | Existing content output parity tests |

The foundation now establishes the supported production stack, durable retrieval, content identity, shared vocabulary, and semantic destination resolution. `ARC-04` is the next controlled bridge toward tours, AI cards, depth, stimulation, and graph navigation; visitor UI migration remains out of scope for this increment.

## Now And Next

The operational source is `documentation/implementation-work/README.md`.

| Focus | Work item | State | Package | Last known-good point | Next exact action | Last update |
| --- | --- | --- | --- | --- | --- | --- |
| Now | `WI-ARC-04-01` | ready | `ARC-04` | Reconciled contracts and destination registry pass 26 tests, inventory, lint, and build | Define the action union and exhaustive destination/depth/context fixture | 2026-07-16 |
| Next | `ARC-05` package preparation | pending | `ARC-05` | Runtime-validation boundaries are recorded and excluded from `ARC-04` | Prepare a bounded work item after the action contract is accepted | 2026-07-16 |

Limit active implementation using the WIP rules in `17-Work-Items-And-Resume-Protocol.md`.

## Awaiting Review

No work items are currently `in-review`.

| Work item | Review question | Reviewer | Evidence/preview | Waiting since | Next action |
| --- | --- | --- | --- | --- | --- |
| None | - | - | - | - | - |

## Blocked Or Paused

No work item is currently blocked or paused.

| Work item | State | Reason | Restart condition | Last known-good point | Last update |
| --- | --- | --- | --- | --- | --- |
| None | - | - | - | - | - |

## Partial Implementation Watchlist

No current capability is in a partial implementation state between coherent checkpoints.

| Capability | Work item | What works | Named gaps | Safe exposure | Next exact action | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| None | - | - | - | - | - | - |

This section is intentionally selective. The capability ledger remains the complete granular source.

## Gates And Decisions

| Gate | Affects | State | Needed next |
| --- | --- | --- | --- |
| Runtime and framework compatibility | Baseline and future deployments | resolved | No action; `BAS-06` and `BAS-07` are accepted |
| Firestore service-account data access | `BAS-08`, `ARC-01` | resolved | `Cloud Datastore User` verified; index and canonical corpus ready |
| Information architecture and routing | `ARC-02`, `ARC-03`, `EXP-*`, `AI-*`, `PRJ-*` | resolved | Multi-route/one-world model, route classes, subdomain roles, depth/history, and state ownership approved |
| Shared graph/discovery vocabulary | `ARC-02`, `ARC-03` | resolved | Accepted graph identities, discovery vocabulary, destination registry, and resolver are available to `ARC-04` |
| Project lifecycle classification | `LPS-02` and living state | decision-gated | Present a concise classification set for Mark's approval |
| First flagship selection | `PRJ-04` | waits on prototype | Compare LifeInbox and Sudoku spikes using visitor value, risk, and reuse evidence |
| Memory-room continuation | About expansion | waits on prototype | Keep, revise, or remove after one bounded room |
| Skill evidence presentation | Experimental | waits on prototype | Test whether evidence improves understanding without becoming a generic skill tree |
| Studio scope | Studio | feedback-gated | Wait for Mark's offerings, audience, readiness, and transaction feedback |
| Musical identity | Later experience | collaboration-gated | Plan only integration hooks until close taste collaboration begins |

## Risks To Watch

| Risk | Early indicator | Mitigation | Owner package |
| --- | --- | --- | --- |
| Implementation appears more finished than visitor readiness | Code is present while content, QA, or rollout remains unfinished | Show named dimension states, gaps, and gates | `QA-06` |
| Broad packages stay partial indefinitely | No coherent checkpoint or evidence for 14 days | Split into capability-sized increments or pause explicitly | Owning package |
| Graph, AI, and navigation IDs diverge | Local string formats or unresolved destinations appear | Enforce `ARC-01` through `ARC-05` before dependent UI | `ARC-*` |
| Several flagship demos start before one finishes | Multiple project branches without `O-03` evidence | Stop expansion and complete the selected first slice | `PRJ-04` |
| Creative ambition outpaces loading and fallbacks | Main path depends on all heavy assets and services | Preserve staged loading, flags, posters, and error boundaries | `QA-02`, `QA-04` |
| Resume context becomes stale | Active work item unchanged for 14 days | Mark stale, verify known-good point, and refresh next exact action | `QA-06` |
| Unsupported runtime or framework reaches deployment cutoff | Vercel continues selecting Node.js 20 or bridge work stalls | Prioritize `BAS-06`; preserve `BAS-07` as a separate follow-on with rollback to the bridge | `BAS-06`, `BAS-07` |
| Replacement datastore accidentally requires billing or exposes client access | Billing/trial prompt appears or rules permit public reads | Stop; retain Spark, deny-all rules, server-only credentials, and current production rollback | `BAS-08` |

## Evidence Summary

| Evidence status | Count | Notes |
| --- | ---: | --- |
| Accepted | 33 | Includes the reconciled `ARC-02` contract and initial `ARC-03` destination-registry evidence |
| Candidate | 0 | No collected evidence currently waits for acceptance review |
| Superseded | 0 | Preserve historical evidence when contracts or behavior change |
| Failed | 4 | Retained preview failures drove embedding, credential, model, and resilience repairs |

The evidence registry lives in `documentation/implementation-evidence/README.md`.

## Recently Changed

| Date | Change | Affected controls | Result |
| --- | --- | --- | --- |
| 2026-07-16 | Accepted shared-contract reconciliation and initial destination registry | `ARC-02`, `ARC-03`, `ARC-04`, `CAP-ARC-002`, `CAP-ARC-003`, `WI-ARC-04-01`, `O-00` | Strict content plus graph identities, full discovery vocabulary, and 27 validated destinations pass 26 tests and build; typed actions are next |
| 2026-07-16 | Approved information architecture and reopened shared-contract acceptance | `ARC-02`, `ARC-03`, `WI-ARC-02-02`, `WI-ARC-03-01`, `CAP-ARC-002`, `O-00` | Multi-route/one-world model recorded; two contract omissions bounded before destination implementation |
| 2026-07-16 | Completed the first shared-contract increment | `BAS-08`, `ARC-01`, `ARC-02`, `CAP-BAS-008`, `CAP-ARC-001`, `CAP-ARC-002`, `O-00` | Free Firestore and canonical IDs are accepted; the initial contracts pass 19 tests/build; later review created bounded follow-up `WI-ARC-02-02` |
| 2026-07-16 | Established dedicated free Firestore backend under `mpere056@gmail.com` | `BAS-08`, `CAP-BAS-008`, `WI-BAS-08-01`, `ARC-01`, `O-00` | Billing disabled; 42 chunks/36 canonical IDs; index ready; real retrieval and Vercel credentials verified; Preview remains |
| 2026-07-15 | Began free-tier Firestore retrieval migration after Supabase became unavailable | `BAS-08`, `CAP-BAS-008`, `WI-BAS-08-01`, `ARC-01`, `O-00` | Local adapter, ingestion, rules, Spark database, service key, and 17 tests exist; IAM/index/cutover remain explicit |
| 2026-07-14 | Completed target-state audit and began stable content identities | `BAS-05`, `ARC-01`, `CAP-BAS-005`, `CAP-ARC-001`, `WI-ARC-01-01`, `O-00` | Current implementation reconciled; shared inventory/ingestion IDs, alias policy, safe legacy replacement, and 13 tests pass |
| 2026-07-14 | Completed supported framework modernization and AI runtime recovery | `BAS-07`, `CAP-BAS-007`, `WI-BAS-07-01`, `O-00` | Next.js 16/React 19, retrieval, chat fallback, preview, production, public routes, and rollback evidence accepted; `BAS-05` is ready |
| 2026-07-14 | Completed the runtime maintenance decision | `BAS-04`, `CAP-BAS-004`, `WI-BAS-04-01`, `O-00` | Node.js 24 bridge and separate Next.js 16 migration accepted; `BAS-06` is ready |
| 2026-07-14 | Completed the content and route inventory | `BAS-02`, `CAP-BAS-002`, `WI-BAS-02-01`, `O-00` | 39 nodes inventoried; identity and ingestion gaps have named downstream owners |
| 2026-07-14 | Completed the first implementation package | `BAS-01`, `CAP-BAS-001`, `WI-BAS-01-01`, `O-00` | Technical baseline accepted; `BAS-02` is next |

Retain only the most recent ten meaningful entries here. Durable history belongs in Git and package evidence files.

## Reconciliation Checklist

Run this checklist at least at package start, merge, preview, production promotion, and milestone review:

- Capability dimension states match the latest inspected implementation.
- Every `working` state has named gaps and a work item.
- Every `accepted` state has evidence.
- Package status agrees with owned capability states and exit evidence.
- Dashboard package counts match the work-package registry.
- Outcome stages name their last checkpoint and next proof point.
- New scope has been added before attaching work or claiming completion.
- Blockers name an owner and restart condition.
- Active work items have a current known-good point and next exact action.
- `Now`, `Next`, review, blocked, and paused entries match the work registry.
- Decision and feedback gates remain respected.
- Reconciled date and implementation baseline commit are current once `BAS-05` begins.

## Next Dashboard Update

The next update occurs after the first of these events:

- `ARC-04` reaches an accepted action-contract checkpoint or changes scope.
- `ARC-05` becomes ready after action acceptance.
- A gate or dependency changes.
- Target implementation code lands.
