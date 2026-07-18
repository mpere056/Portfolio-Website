# Execution Work Packages

Last updated: 2026-07-17

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `EXE` |
| Status | Active planning control |
| Upstream | Roadmap, architecture contracts, workstream plans, decision register |
| Downstream | Work items, implementation branches, commits, previews, and release evidence |
| Primary output | Bounded packages that can be implemented and verified independently |

## Purpose

Convert the implementation plans into ordered units of work. A package is larger than a single coding task and smaller than a roadmap phase.

Every implementation session should name its package ID.

## Status Vocabulary

- `ready`: dependencies and decisions are resolved.
- `pending`: valid work, but an upstream package is incomplete.
- `in-progress`: at least one owned capability is actively being implemented.
- `implemented`: package deliverables exist, but verification or rollout evidence remains incomplete.
- `decision-gated`: requires a recorded decision.
- `feedback-gated`: requires Mark's feedback.
- `prototype`: deliberately bounded experiment.
- `later`: accepted but not near-term.
- `backlog`: recorded without implementation detail.
- `complete`: acceptance evidence exists.
- `reopened`: previously complete work no longer satisfies a current contract or criterion.

Capability dimension states, lifecycle, health, and confidence live in `15-Capability-Coverage-Ledger.md`. Active implementation and restart context live in `documentation/implementation-work/`. Package status must agree with them but does not replace them.

## Baseline Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Current status |
| --- | --- | --- | --- | --- | --- |
| `BAS-01` | Technical baseline | None | Build output, route sizes, warnings, model inventory, current test result | Baseline document and passing build | complete |
| `BAS-02` | Content inventory | None | Node candidate inventory across projects, About, posts, misc | Reviewed inventory with missing IDs identified | complete |
| `BAS-03` | Feature-flag convention | `ARC-02` | Typed flags, local/preview/production policy | Unit test and one dormant flag | complete |
| `BAS-04` | Runtime maintenance decision | None | Verified Node/Vercel/Next compatibility plan | Decision record and separate upgrade package if needed | complete |
| `BAS-05` | Target-state implementation audit | `BAS-01`, `BAS-02`, `BAS-06`, `BAS-07` | Reconcile retained baseline behavior plus the current and next capability set against code, content, tests, and live routes | Current and next capabilities have inspected states and restartable work items; distant unknowns remain explicit | complete |
| `BAS-06` | Supported runtime and security bridge | `BAS-04` | Node.js 24 engine and Vercel alignment, narrow Next.js 14 security update, bounded direct remediations, runtime policy test | Node.js 24 tests/build pass; audit delta reviewed; preview and production routes verified with rollback ready | complete |
| `BAS-07` | Supported framework modernization | `BAS-06` | Next.js 16 and React 19 ecosystem migration, async route APIs, ESLint CLI, middleware/proxy and edge review | Unit, integration, browser, visual, 3D, API, preview, and rollback gates pass | complete |
| `BAS-08` | Durable free-tier retrieval datastore migration | `BAS-07`, `ARC-01` canonical ingestion contract | Firestore native vector adapter, canonical re-indexing, deny-all client rules, Spark-plan guardrail, Vercel cutover | Local tests/build, real canonical retrieval, grounded live chat, public routes, and rollback evidence pass without billing | complete |

## Architecture Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Current status |
| --- | --- | --- | --- | --- | --- |
| `ARC-01` | Stable ID policy | `BAS-02` | Namespace rules, initial IDs, rename policy | Validation fixture, canonical managed corpus, and decision record | complete |
| `ARC-02` | Shared contract types | `ARC-01` | Canonical TypeScript types for depth, destinations, discovery, context | Typecheck and consumer fixture | complete |
| `ARC-03` | Destination registry | `ARC-02` | Validated registry for routes, areas, subdomains, safe state | Unit tests including unknown destination | complete |
| `ARC-04` | Cross-system actions | `ARC-02`, `ARC-03` | Typed actions for depth, context, destination, stimulation, errors | Integration fixture without global browser events | complete |
| `ARC-05` | Contract validation and migrations | `ARC-02`, `ARC-03`, `ARC-04` | Runtime validators, persisted-state migrations, compatibility rules | Old-version and invalid-payload tests | complete |

## Knowledge And Content Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Current status |
| --- | --- | --- | --- | --- | --- |
| `KG-01` | Shared content loader parity | `ARC-01` | Shared parser used by one content type | Existing output parity tests | complete |
| `KG-02` | Content schemas | `KG-01`, `ARC-02` | Project, timeline, post, relationship schema | Invalid fixture failures | complete |
| `KG-03` | Graph compiler and validator | `KG-02` | Node compiler, relationship loader, visibility validation | Graph test suite | complete |
| `KG-04` | Initial reviewed subgraph | `KG-03`, `LPS-01` | Three flagships, five events, skills, posts, reviewed edges | Review sign-off and fixture snapshot | complete |
| `KG-05` | Bounded query and render adapters | `KG-04`, `ARC-03` | Related-content, About, evidence, tour, semantic-edge queries | Deterministic ordering and visibility tests | complete |
| `KG-06` | Graph-aware RAG metadata | `KG-04`, `KG-05` | Ingestion metadata, expansion/reranking, public source descriptors | Retrieval tests with current context | complete |

## Experience Foundation Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Current status |
| --- | --- | --- | --- | --- | --- |
| `EXP-01` | Versioned discovery store | `ARC-02`, `ARC-05` | Zustand slices, local persistence, reset, semantic checkpoints | Migration and refresh tests | complete |
| `EXP-02` | Depth-controller primitives | `ARC-02`, `ARC-04` | Stage transitions, hints, AI context emission, persistence hooks | Controlled-scene integration test | complete |
| `EXP-03` | One-time First Note | `EXP-01`, `EXP-02`, `QA-01` | Dark initial scene, wake interaction, returning behavior | First/return browser flow | complete |
| `EXP-04` | Non-linear guided tour | `ARC-03`, `EXP-01`, `KG-05` | Role selection, authored destinations, hints, dismiss/resume | Out-of-order tour browser flow | complete |
| `EXP-05` | Environmental response system | `EXP-02`, `KG-05` | Proximity/handle prototypes, semantic-light adapter, stimulation consumers | Three-rule prototype and review decision | complete |
| `EXP-06` | Meaningful discovery registry | `EXP-01`, `KG-04` | Easter-egg schema, three initial discoveries, no completion UI | Tour exclusion and discovery tests | complete |
| `EXP-07` | New-content disturbances | `EXP-01`, `LPS-04` | Version comparison, disturbance selector, seen behavior | Return-visitor integration test | pending |

## Global AI Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Current status |
| --- | --- | --- | --- | --- | --- |
| `AI-01` | AI context provider | `ARC-02`, `ARC-04` | Context stack, route/object adapters | Nested context tests | complete |
| `AI-02` | Quiet global shell | `AI-01`, `BAS-03` | Dormant/context/listening/responding states, lazy surface | Cross-route manual and integration QA | complete |
| `AI-03` | Graph-aware retrieval and sources | `KG-06`, `AI-01`, `AI-02` | Context resolution, sources, visibility enforcement | Retrieval and privacy tests | complete |
| `AI-04` | Archive cards and selected-destination flow | `AI-03`, `ARC-03`, `PRJ-01` | Runtime card schema, public-source validation, client re-resolution, selected museum/subdomain transition | Invalid-card fixtures and one exact card navigation browser flow | pending |
| `AI-05` | Existing chat migration | `AI-02`, `AI-04` | Reusable chat surface, updated links, `/chat` decision | Deep-link and regression tests | pending |

## Living Project State Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Current status |
| --- | --- | --- | --- | --- | --- |
| `LPS-01` | Lifecycle schema | `ARC-01`, `KG-02` | Lifecycle types, required-section rules | Schema tests | complete |
| `LPS-02` | Project classification review | `LPS-01` | Reviewed lifecycle for every project | Mark approval recorded | decision-gated |
| `LPS-03` | Flagship state files | `LPS-02` | Edited state for active flagships | Content review and rendered fixture | pending |
| `LPS-04` | Content versions and disturbance metadata | `LPS-03` | Meaningful version policy and compiled update records | Version comparison tests | pending |
| `LPS-05` | Editorial workflow and AI precedence | `LPS-03`, `KG-06` | Update checklist, current-state retrieval precedence | Conflict fixture resolves to current state | pending |
| `LPS-06` | Selected flagship state seed | `LPS-01`, `PRJ-02` | One Mark-reviewed lifecycle and minimum current/final state for the selected first flagship | Approval record, lifecycle validation, public evidence links, and rendered fallback fixture | pending |

## Project Museum Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Current status |
| --- | --- | --- | --- | --- | --- |
| `PRJ-01` | Exhibit registry and shell | `EXP-02`, `KG-05`, `LPS-01` | Shared exhibit contract, lazy registry, fallback shell | Registry and direct-link tests | complete |
| `PRJ-02` | Flagship feasibility spikes | `PRJ-01` | LifeInbox and Sudoku interaction spikes | Selection decision for first slice | ready |
| `PRJ-03` | Museum navigation and identity layers | `PRJ-01`, `EXP-05` | Server exhibit-view adoption behind `museumV2`, lightweight Signal, authored Approach, exact anchors, legacy rollback | Flag-off parity, fallback integration, and overview-to-Approach browser flow | ready |
| `PRJ-04` | First full flagship slice | `PRJ-02`, `PRJ-03`, `AI-04`, `LPS-06` | Selected Handle/Enter/Understand journey, one exploded layer, evidence, state, persistence, minimum subdomain handoff | Phase 3 vertical-slice evidence | pending |
| `PRJ-05` | Dreamlife experience | `PRJ-04` framework | Future paths, reaction, experiment, exploded layers | Authored scenario and interaction QA | pending |
| `PRJ-06` | Remaining non-Dreamlife flagship | `PRJ-04` framework | LifeInbox or Sudoku experience not selected first | Product and architecture QA | pending |
| `PRJ-07` | Smaller projects and hidden depth | `PRJ-04`, `EXP-06` | Standard/archive/related tiers and selected easter eggs | Every project assigned a tier | pending |
| `PRJ-08` | Generalized direct routes and subdomain integration | `PRJ-04`, `ARC-03` | `/projects/[slug]`, all-project canonical metadata, compatibility redirects, reusable URL/history and cross-origin state rules | Back/refresh/redirect tests and live Preview route matrix | pending |

## About Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Current status |
| --- | --- | --- | --- | --- | --- |
| `ABT-01` | Reviewed event consequences | `KG-04` | Five events, max three primary consequences each | Content review | pending |
| `ABT-02` | Event inspection | `ABT-01`, `EXP-02`, `AI-01` | Open/close state, consequence UI, AI context | Timeline remains usable and deep links work | pending |
| `ABT-03` | Memory-room prototype | `ABT-02`, `EXP-05` | One event, one object, one return transition | Keep/revise/remove decision | prototype |
| `ABT-04` | About easter eggs and semantic links | `ABT-02`, `EXP-06` | Personal, relational, and optional musical discovery | Tour exclusion and privacy review | pending |

## Quality And Rollout Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Current status |
| --- | --- | --- | --- | --- | --- |
| `QA-01` | Foundation test harness | `BAS-01`, `ARC-02` | Unit fixtures, browser-tool decision, preview checklist | One automated foundation flow | complete |
| `QA-02` | First vertical-slice quality gate | `PRJ-04` | Logic, browser, visual, performance, creative review | Signed milestone checklist | pending |
| `QA-03` | Content and editorial production gate | `KG-03`, `LPS-05` | Build validation, freshness checks, live route checklist | Production-like content validation | pending |
| `QA-04` | Stimulation and capability QA | `EXP-05` | Sound-off, reduced motion, capability tier, frame-time checks | Target-device review evidence | pending |
| `QA-05` | Release flag and rollback workflow | `BAS-03` | Preview/prod flags, rollback steps, error boundaries | Flagged feature promoted and rolled back in preview | pending |
| `QA-06` | Tracking integrity and evidence reconciliation | `BAS-05` | Capability/package/work-item consistency checks, stale-status review, dashboard reconciliation | Audit finds no missing mappings, unsupported accepted states, or stale active work without a resume path | in-progress |

## Prototype Packages

| ID | Prototype | Depends on | Decision enabled | Current status |
| --- | --- | --- | --- | --- |
| `PXP-01` | Skill tree or evidence map | `KG-04`, `EXP-01` | Keep, revise presentation, or remove | prototype |
| `PXP-02` | Ambient presence | Stable single-person core | Is subtle real presence valuable? | later |
| `PXP-03` | Site asks for help | `LPS-03` | Is rare visitor feedback useful and tasteful? | prototype |

## Feedback-Gated And Later Markers

| ID | Item | Required before promotion | Status |
| --- | --- | --- | --- |
| `STU-GATE-01` | Studio scope | Mark confirms offerings, readiness, audience, transaction model | feedback-gated |
| `LTR-01` | Independent mobile design | Stable desktop content and contracts | later |
| `LTR-02` | Musical identity | Close collaboration with Mark | later |
| `LTR-03` | Ambient multi-visitor presence | Stable single-person experience | later |
| `LTR-04` | Shared exploration | Presence/share-state value established | later |

## Current Phase 3 Execution Queue

Completed foundation packages remain in their tables and evidence files. Current delivery order is:

1. Close `QA-06` documentation reconciliation and restore `WI-PRJ-02-01` to the Now slot.
2. Implement `PRJ-02` equal deterministic LifeInbox/Sudoku spikes and record one selection.
3. Implement `PRJ-03` registry-backed Signal/Approach behind `museumV2`; keep legacy rollback.
4. Complete `LPS-06` with Mark's review of the selected flagship only.
5. Implement `AI-04` card validation, then one selected-destination transition.
6. Converge the selected interaction and shared systems in `PRJ-04`.
7. Run `QA-02`; promote no production flag without its separate release decision.

`PRJ-02` and `PRJ-03` are both `ready` because their dependencies pass. Ready status permits selection, not simultaneous implementation; the one-active-code-package WIP rule prevents competing unfinished surfaces.

## Package Completion Checklist

For every active package:

- Scope is still aligned with the owning plan.
- Dependencies are complete or explicitly stubbed.
- Contract changes are reflected in `00-System-Architecture-And-Interfaces.md`.
- Deterministic logic has tests.
- Visitor-facing behavior has manual or browser evidence.
- Content is reviewed where factual claims changed.
- Feature flags and fallback behavior exist where needed.
- Decision register is updated if a gate was resolved.
- Traceability matrix points to the collected evidence.
- Every owned capability has reconciled dimension states, lifecycle, health, confidence, and next checkpoint.
- Every working dimension has a named gap and work item; every accepted dimension has accepted evidence.
- The package evidence file records what works, what remains, and safe exposure.
- The progress dashboard reflects package status, blockers, risks, and outcome impact.
- Commit and deployment scope remain focused.

## Package Execution Record

When a package starts, create `documentation/implementation-evidence/{PACKAGE-ID}.md` from the package evidence template and record:

- Owned capability IDs.
- Owner and branch or task reference.
- Start date and next observable checkpoint.
- Current behavior and named gaps.
- Feature flag and safe-exposure state.
- Evidence IDs as proof accumulates.
- Capability dimension states before and after each durable increment.
- Work-item IDs and current resume packets.
- Completion, reopen, or pause decision.

Package completion is a gate decision based on capabilities and evidence, not an automatic result of merging code.

## Backlog Rule

The Anti-Resume remains recorded only in `10-Later-And-Backlog.md`. It does not receive a work-package ID until Mark promotes it.
