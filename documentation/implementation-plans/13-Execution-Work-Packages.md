# Execution Work Packages

Last updated: 2026-07-13

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `EXE` |
| Status | Active planning control |
| Upstream | Roadmap, architecture contracts, workstream plans, decision register |
| Downstream | Implementation branches, commits, previews, and release evidence |
| Primary output | Bounded packages that can be implemented and verified independently |

## Purpose

Convert the implementation plans into ordered units of work. A package is larger than a single coding task and smaller than a roadmap phase.

Every implementation session should name its package ID.

## Status Vocabulary

- `ready`: dependencies and decisions are resolved.
- `pending`: valid work, but an upstream package is incomplete.
- `decision-gated`: requires a recorded decision.
- `feedback-gated`: requires Mark's feedback.
- `prototype`: deliberately bounded experiment.
- `later`: accepted but not near-term.
- `backlog`: recorded without implementation detail.
- `complete`: acceptance evidence exists.

## Baseline Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Initial status |
| --- | --- | --- | --- | --- | --- |
| `BAS-01` | Technical baseline | None | Build output, route sizes, warnings, model inventory, current test result | Baseline document and passing build | ready |
| `BAS-02` | Content inventory | None | Node candidate inventory across projects, About, posts, misc | Reviewed inventory with missing IDs identified | ready |
| `BAS-03` | Feature-flag convention | `ARC-02` | Typed flags, local/preview/production policy | Unit test and one dormant flag | pending |
| `BAS-04` | Runtime maintenance decision | None | Verified Node/Vercel/Next compatibility plan | Decision record and separate upgrade package if needed | ready |

## Architecture Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Initial status |
| --- | --- | --- | --- | --- | --- |
| `ARC-01` | Stable ID policy | `BAS-02` | Namespace rules, initial IDs, rename policy | Validation fixture and decision record | pending |
| `ARC-02` | Shared contract types | `ARC-01` | Canonical TypeScript types for depth, destinations, discovery, context | Typecheck and consumer fixture | pending |
| `ARC-03` | Destination registry | `ARC-02` | Validated registry for routes, areas, subdomains, safe state | Unit tests including unknown destination | pending |
| `ARC-04` | Cross-system actions | `ARC-02` | Typed actions for depth, context, destination, stimulation, errors | Integration fixture without global browser events | pending |
| `ARC-05` | Contract validation and migrations | `ARC-02`, `ARC-03` | Runtime validators, persisted-state migrations, compatibility rules | Old-version and invalid-payload tests | pending |

## Knowledge And Content Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Initial status |
| --- | --- | --- | --- | --- | --- |
| `KG-01` | Shared content loader parity | `ARC-01` | Shared parser used by one content type | Existing output parity tests | pending |
| `KG-02` | Content schemas | `KG-01`, `ARC-02` | Project, timeline, post, relationship schema | Invalid fixture failures | pending |
| `KG-03` | Graph compiler and validator | `KG-02` | Node compiler, relationship loader, visibility validation | Graph test suite | pending |
| `KG-04` | Initial reviewed subgraph | `KG-03`, `LPS-01` | Three flagships, five events, skills, posts, reviewed edges | Review sign-off and fixture snapshot | pending |
| `KG-05` | Bounded query and render adapters | `KG-04`, `ARC-03` | Related-content, About, evidence, tour, semantic-edge queries | Deterministic ordering and visibility tests | pending |
| `KG-06` | Graph-aware RAG metadata | `KG-04` | Ingestion metadata, expansion/reranking, public source descriptors | Retrieval tests with current context | pending |

## Experience Foundation Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Initial status |
| --- | --- | --- | --- | --- | --- |
| `EXP-01` | Versioned discovery store | `ARC-02`, `ARC-05` | Zustand slices, local persistence, reset, semantic checkpoints | Migration and refresh tests | pending |
| `EXP-02` | Depth-controller primitives | `ARC-02`, `ARC-04` | Stage transitions, hints, AI context emission, persistence hooks | Controlled-scene integration test | pending |
| `EXP-03` | One-time First Note | `EXP-01`, `EXP-02`, `QA-01` | Dark initial scene, wake interaction, returning behavior | First/return browser flow | pending |
| `EXP-04` | Non-linear guided tour | `ARC-03`, `EXP-01`, `KG-05` | Role selection, authored destinations, hints, dismiss/resume | Out-of-order tour browser flow | pending |
| `EXP-05` | Environmental response system | `EXP-02`, `KG-05` | Proximity/handle prototypes, semantic-light adapter, stimulation consumers | Three-rule prototype and review decision | pending |
| `EXP-06` | Meaningful discovery registry | `EXP-01`, `KG-04` | Easter-egg schema, three initial discoveries, no completion UI | Tour exclusion and discovery tests | pending |
| `EXP-07` | New-content disturbances | `EXP-01`, `LPS-04` | Version comparison, disturbance selector, seen behavior | Return-visitor integration test | pending |

## Global AI Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Initial status |
| --- | --- | --- | --- | --- | --- |
| `AI-01` | AI context provider | `ARC-02`, `ARC-04` | Context stack, route/object adapters | Nested context tests | pending |
| `AI-02` | Quiet global shell | `AI-01`, `BAS-03` | Dormant/context/listening/responding states, lazy surface | Cross-route manual and integration QA | pending |
| `AI-03` | Graph-aware retrieval and sources | `KG-06`, `AI-01` | Context resolution, sources, visibility enforcement | Retrieval and privacy tests | pending |
| `AI-04` | Archive cards and destination flow | `AI-03`, `ARC-03` | Structured cards, validation, transitions, cross-subdomain behavior | Card navigation browser flow | pending |
| `AI-05` | Existing chat migration | `AI-02`, `AI-04` | Reusable chat surface, updated links, `/chat` decision | Deep-link and regression tests | pending |

## Living Project State Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Initial status |
| --- | --- | --- | --- | --- | --- |
| `LPS-01` | Lifecycle schema | `ARC-01`, `KG-02` | Lifecycle types, required-section rules | Schema tests | pending |
| `LPS-02` | Project classification review | `LPS-01` | Reviewed lifecycle for every project | Mark approval recorded | decision-gated |
| `LPS-03` | Flagship state files | `LPS-02` | Edited state for active flagships | Content review and rendered fixture | pending |
| `LPS-04` | Content versions and disturbance metadata | `LPS-03` | Meaningful version policy and compiled update records | Version comparison tests | pending |
| `LPS-05` | Editorial workflow and AI precedence | `LPS-03`, `KG-06` | Update checklist, current-state retrieval precedence | Conflict fixture resolves to current state | pending |

## Project Museum Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Initial status |
| --- | --- | --- | --- | --- | --- |
| `PRJ-01` | Exhibit registry and shell | `EXP-02`, `KG-05`, `LPS-01` | Shared exhibit contract, lazy registry, fallback shell | Registry and direct-link tests | pending |
| `PRJ-02` | Flagship feasibility spikes | `PRJ-01` | LifeInbox and Sudoku interaction spikes | Selection decision for first slice | prototype |
| `PRJ-03` | Museum navigation and identity layers | `PRJ-01`, `EXP-05` | Signal/Approach presentation and stable anchors | Overview-to-approach browser flow | pending |
| `PRJ-04` | First full flagship slice | `PRJ-02`, `PRJ-03`, `AI-04`, `LPS-03` | Handle, Enter, Understand, evidence, persistence | Phase 3 vertical-slice evidence | pending |
| `PRJ-05` | Dreamlife experience | `PRJ-04` framework | Future paths, reaction, experiment, exploded layers | Authored scenario and interaction QA | pending |
| `PRJ-06` | Remaining non-Dreamlife flagship | `PRJ-04` framework | LifeInbox or Sudoku experience not selected first | Product and architecture QA | pending |
| `PRJ-07` | Smaller projects and hidden depth | `PRJ-04`, `EXP-06` | Standard/archive/related tiers and selected easter eggs | Every project assigned a tier | pending |
| `PRJ-08` | Direct routes and subdomain integration | `PRJ-04`, `ARC-03` | Canonical destinations, metadata, cross-domain state | Live preview route verification | pending |

## About Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Initial status |
| --- | --- | --- | --- | --- | --- |
| `ABT-01` | Reviewed event consequences | `KG-04` | Five events, max three primary consequences each | Content review | pending |
| `ABT-02` | Event inspection | `ABT-01`, `EXP-02`, `AI-01` | Open/close state, consequence UI, AI context | Timeline remains usable and deep links work | pending |
| `ABT-03` | Memory-room prototype | `ABT-02`, `EXP-05` | One event, one object, one return transition | Keep/revise/remove decision | prototype |
| `ABT-04` | About easter eggs and semantic links | `ABT-02`, `EXP-06` | Personal, relational, and optional musical discovery | Tour exclusion and privacy review | pending |

## Quality And Rollout Packages

| ID | Package | Depends on | Deliverables | Exit evidence | Initial status |
| --- | --- | --- | --- | --- | --- |
| `QA-01` | Foundation test harness | `BAS-01`, `ARC-02` | Unit fixtures, browser-tool decision, preview checklist | One automated foundation flow | pending |
| `QA-02` | First vertical-slice quality gate | `PRJ-04` | Logic, browser, visual, performance, creative review | Signed milestone checklist | pending |
| `QA-03` | Content and editorial production gate | `KG-03`, `LPS-05` | Build validation, freshness checks, live route checklist | Production-like content validation | pending |
| `QA-04` | Stimulation and capability QA | `EXP-05` | Sound-off, reduced motion, capability tier, frame-time checks | Target-device review evidence | pending |
| `QA-05` | Release flag and rollback workflow | `BAS-03` | Preview/prod flags, rollback steps, error boundaries | Flagged feature promoted and rolled back in preview | pending |

## Prototype Packages

| ID | Prototype | Depends on | Decision enabled | Initial status |
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

## First Recommended Execution Queue

Start only with packages that reduce uncertainty for everything else:

1. `BAS-01` Technical baseline.
2. `BAS-02` Content inventory.
3. `BAS-04` Runtime maintenance decision.
4. `ARC-01` Stable ID policy.
5. `ARC-02` Shared contract types.
6. `QA-01` Foundation test harness.
7. `KG-01` Shared content loader parity.

Do not begin First Note visuals, global AI UI, museum redesign, or project demos before the shared identifiers and baseline are stable.

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
- Commit and deployment scope remain focused.

## Backlog Rule

The Anti-Resume remains recorded only in `10-Later-And-Backlog.md`. It does not receive a work-package ID until Mark promotes it.
