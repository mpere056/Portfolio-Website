# Capability Coverage Ledger

Last updated: 2026-07-14

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `CAP` |
| Status | Active granular status source |
| Upstream | Tracking model, work packages, traceability matrix, and workstream plans |
| Downstream | Work items, continuation dashboard, package completion decisions, and release gates |
| Primary output | Stable capability inventory with named dimension and lifecycle states |

## How To Read This Ledger

Each capability is inspected across `S/C/A/I/T/Q/R` from `14-Implementation-Tracking-Model.md`:

- Specification.
- Content.
- Architecture and data.
- Implementation.
- Automated verification.
- Creative and manual QA.
- Rollout.

All target-state capabilities begin as `U/U/U/U/U/U/U`, a compact initial marker meaning all seven dimensions are `unknown`. `BAS-05` performs the first audit. This is intentionally different from saying the existing site has no implementation.

When work starts, add a readable dimension-state map and detail record with lifecycle, health, confidence, evidence IDs, named gaps, current work-item ID, and next checkpoint. Do not replace named states with numbers and do not leave the detail only in the dashboard.

The `Scope signal` values are rough breadth warnings retained to help split capabilities into appropriately bounded work items. They are never summed, averaged, or used as a completion denominator. A `5` means the capability is likely to require several work items and checkpoints, not that it is more important or worth more progress.

Until a capability receives its own detail record, these defaults apply:

| Field | Initial value |
| --- | --- |
| Owner | `unassigned` |
| Health | `not-active` |
| Confidence | `low` |
| Evidence | none |
| Named gap | Target-state implementation has not been assessed |
| Next checkpoint | `BAS-05` reconciliation |
| Current work item | none |
| Last assessed | not yet assessed |

## Release Outcomes

| ID | Outcome | Visitor-visible meaning |
| --- | --- | --- |
| `O-00` | Measured foundation | The current site and target contracts are understood, testable, and safe to change |
| `O-01` | Persistent exploratory world | First Note, depth, discovery, tour, stimulation, and return behavior form one coherent shell |
| `O-02` | Quiet global AI | Contextual AI is reachable across the site and can open validated destinations |
| `O-03` | First flagship proof | One project communicates value through a complete experiential depth journey |
| `O-04` | Portfolio museum | Three flagship projects and smaller exhibits share infrastructure without becoming identical |
| `O-05` | About depth | Timeline events reveal accurate consequences and one bounded memory-room decision is made |
| `O-06` | Living portfolio operations | Project state and meaningful updates remain current through an editorial workflow |

## Baseline And Architecture

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-BAS-001` | Reproducible technical and performance baseline | `BAS-01` | Platform | `O-00` | 2 | All applicable dimensions accepted; see `BAS-01` evidence | verified |
| `CAP-BAS-002` | Reviewed content and route inventory | `BAS-02` | `V-11`, `V-19` | `O-00` | 2 | All dimensions accepted; see `BAS-02` evidence | verified |
| `CAP-BAS-003` | Typed environment-aware feature flags | `BAS-03` | Platform | `O-00` | 2 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-BAS-004` | Runtime compatibility and upgrade decision | `BAS-04` | Platform | `O-00` | 1 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-BAS-005` | Target-state implementation baseline | `BAS-05` | `V-01` through `V-24` | `O-00` | 2 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-ARC-001` | Stable namespaced IDs and rename policy | `ARC-01` | `V-10`, `V-11` | `O-00` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-ARC-002` | Shared depth, destination, discovery, AI, and project contracts | `ARC-02` | `V-03`, `V-10` | `O-00` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-ARC-003` | Validated destination registry and safe-state resolution | `ARC-03` | `V-07`, `V-10` | `O-00` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-ARC-004` | Typed cross-system actions without hidden global coupling | `ARC-04` | `V-01`, `V-03` | `O-00` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-ARC-005` | Runtime validation and persisted-state migrations | `ARC-05` | `V-05` | `O-00` | 3 | `U/U/U/U/U/U/U` | unassessed |

### CAP-BAS-001: Reproducible Technical And Performance Baseline

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted`
- Package: `BAS-01`
- Work item: `WI-BAS-01-01` (done)
- Works now: Runtime, dependencies, production build, routes, warnings, tests, static assets, models, content-media integrity, and live domains are recorded.
- Named gaps: Repeatable frame-time, heap, model-load, AI-idle, and Vercel-build timing remain future `QA-01`/`QA-04` instrumentation.
- Safe exposure: Documentation-only baseline; no visitor behavior changed.
- Evidence: `EV-BAS-01-01` through `EV-BAS-01-04`
- Next checkpoint: `BAS-04` runtime compatibility decision
- Last assessed: 2026-07-14 at baseline implementation commit

### CAP-BAS-002: Reviewed Content And Route Inventory

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted`
- Package: `BAS-02`
- Work item: `WI-BAS-02-01` (done)
- Works now: A deterministic scanner and CLI inventory all 39 authored nodes, identifier provenance, runtime consumers, retrieval identity, and content destinations; fixture and repository tests protect the contract.
- Named gaps: Four miscellaneous files lack authored IDs, 20 About IDs diverge in AI ingestion, and three blog posts are excluded from retrieval; these are routed to `ARC-01`, `KG-01`, and `KG-02`.
- Safe exposure: Read-only platform tooling and documentation; no authored content, runtime route, or production behavior changed.
- Evidence: `EV-BAS-02-01` through `EV-BAS-02-03`
- Next checkpoint: `ARC-01` stable namespaced-ID and migration policy after the remaining baseline queue
- Last assessed: 2026-07-14 at `BAS-02` implementation commit

## Knowledge Graph And Content

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-KG-001` | Shared loader with current-output parity | `KG-01` | `V-11` | `O-00` | 2 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-KG-002` | Validated project, event, post, and relationship schemas | `KG-02` | `V-11`, `V-19` | `O-00` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-KG-003` | Build-time graph compiler and visibility validator | `KG-03` | `V-11` | `O-00` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-KG-004` | Reviewed flagship, event, skill, and post subgraph | `KG-04` | `V-11`, `V-13`, `V-24` | `O-00` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-KG-005` | Deterministic bounded graph-query API | `KG-05` | `V-11`, `V-12` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-KG-006` | Render adapters for related content and semantic edges | `KG-05` | `V-12`, `V-13` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-KG-007` | Graph-aware retrieval metadata and source descriptors | `KG-06` | `V-09`, `V-11` | `O-02` | 3 | `U/U/U/U/U/U/U` | unassessed |

## Persistent Exploration Foundation

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-EXP-001` | Versioned local discovery store with reset | `EXP-01` | `V-05` | `O-01` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-002` | Semantic checkpoint restore across refresh and return | `EXP-01` | `V-05` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-003` | Five-stage depth controller | `EXP-02` | `V-01`, `V-03` | `O-01` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-004` | Reusable proximity, handle, enter, and understand primitives | `EXP-02` | `V-02`, `V-03` | `O-01` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-005` | One-time First Note wake sequence | `EXP-03` | `V-06` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-006` | Returning-visitor resume after First Note | `EXP-03` | `V-05`, `V-06` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-007` | Role-aware tour entry with no time question | `EXP-04` | `V-07` | `O-01` | 2 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-008` | Non-linear destination recommendations and resume | `EXP-04` | `V-07` | `O-01` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-009` | Discovery physics rule engine and first reviewed rules | `EXP-05` | `V-02`, `V-12` | `O-01` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-010` | Graph-powered semantic lighting | `EXP-05` | `V-12` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-011` | Seamless stimulation and sound controls | `EXP-05`, `QA-04` | `V-22` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-012` | Meaningful hidden-discovery registry | `EXP-06` | `V-08`, `V-20` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-013` | Tour exclusion and no-score discovery behavior | `EXP-06` | `V-08`, `V-20` | `O-01` | 2 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-014` | Returning-visitor new-content disturbances | `EXP-07` | `V-23` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |

## Quiet Global AI

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-AI-001` | Route, object, project, timeline, and depth context stack | `AI-01` | `V-09` | `O-02` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-002` | Context precedence, clearing, and privacy boundaries | `AI-01` | `V-09` | `O-02` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-003` | Quiet global shell and unobtrusive state transitions | `AI-02` | `V-09` | `O-02` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-004` | Lazy loading, error fallback, sound-off, and lower-stimulation AI behavior | `AI-02` | `V-09`, `V-22` | `O-02` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-005` | Contextual graph retrieval with public source enforcement | `AI-03` | `V-09`, `V-11` | `O-02` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-006` | Structured archive-card generation and validation | `AI-04` | `V-10` | `O-02` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-007` | In-page, route, and cross-subdomain destination flow | `AI-04` | `V-10` | `O-02` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-008` | Existing chat migration and deep-link compatibility | `AI-05` | `V-09`, `V-10` | `O-02` | 3 | `U/U/U/U/U/U/U` | unassessed |

## Living Project State

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-LPS-001` | Lifecycle schema and section requirements | `LPS-01` | `V-19` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LPS-002` | Reviewed classification for every project | `LPS-02` | `V-19` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LPS-003` | Edited current-state records for three flagships | `LPS-03` | `V-19` | `O-03` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LPS-004` | Meaningful content-version and update metadata | `LPS-04` | `V-19`, `V-23` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LPS-005` | Editorial update, freshness, and review workflow | `LPS-05` | `V-19` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LPS-006` | AI precedence for edited current state over historical material | `LPS-05` | `V-09`, `V-19` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |

## Museum And Shared Case-Study System

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-PRJ-001` | Typed exhibit registry, loader, and fallback shell | `PRJ-01` | `V-14` | `O-03` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-PRJ-002` | Direct-linkable exhibit and depth state | `PRJ-01`, `PRJ-08` | `V-10`, `V-14` | `O-03` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-PRJ-003` | LifeInbox and Sudoku feasibility spikes with selection record | `PRJ-02` | `V-17`, `V-18` | `O-03` | 2 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-PRJ-004` | Museum signal and approach navigation | `PRJ-03` | `V-03`, `V-14` | `O-03` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-PRJ-005` | Shared Handle, Enter, and Understand integration | `PRJ-04` | `V-03`, `V-14`, `V-15` | `O-03` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-PRJ-006` | Exploded system layers connected to behavior and evidence | `PRJ-04` | `V-15` | `O-03` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-PRJ-007` | Smaller-project exhibit tiers and hidden depth | `PRJ-07` | `V-08`, `V-14`, `V-20` | `O-04` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-PRJ-008` | Canonical project routes, metadata, and subdomain transitions | `PRJ-08` | `V-10`, `V-14` | `O-04` | 3 | `U/U/U/U/U/U/U` | unassessed |

## Flagship Product Experiences

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-LIB-001` | Synthetic LifeInbox entry and local-first input interaction | `PRJ-04` or `PRJ-06` | `V-17` | `O-03` or `O-04` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LIB-002` | LifeInbox routing, relationship, and organization autopsy | `PRJ-04` or `PRJ-06` | `V-15`, `V-17` | `O-03` or `O-04` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LIB-003` | LifeInbox evidence, privacy, errors, and living state | `PRJ-04` or `PRJ-06` | `V-17`, `V-19` | `O-03` or `O-04` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-SDK-001` | Minimal valid single-player Sudoku interaction | `PRJ-04` or `PRJ-06` | `V-18` | `O-03` or `O-04` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-SDK-002` | Clearly labeled deterministic computer participant | `PRJ-04` or `PRJ-06` | `V-18` | `O-03` or `O-04` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-SDK-003` | Sudoku collaboration architecture, validity, evidence, and fallback | `PRJ-04` or `PRJ-06` | `V-15`, `V-18` | `O-03` or `O-04` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-DRM-001` | Authored Dreamlife future-path scenario | `PRJ-05` | `V-16` | `O-04` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-DRM-002` | Dreamlife reaction, refinement, and experiment interaction | `PRJ-05` | `V-04`, `V-16` | `O-04` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-DRM-003` | Dreamlife exploded system, evidence, and living state | `PRJ-05` | `V-15`, `V-16`, `V-19` | `O-04` | 3 | `U/U/U/U/U/U/U` | unassessed |

## About And Memory Depth

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-ABT-001` | Five reviewed events with bounded consequences | `ABT-01` | `V-13` | `O-05` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-ABT-002` | Timeline event inspection and direct-link state | `ABT-02` | `V-03`, `V-13` | `O-05` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-ABT-003` | About semantic links, lighting, and AI context | `ABT-02` | `V-09`, `V-12`, `V-13` | `O-05` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-ABT-004` | One-event, one-object memory-room prototype | `ABT-03` | Prototype | `O-05` | 2 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-ABT-005` | Personal and relational About discoveries with privacy review | `ABT-04` | `V-08`, `V-20` | `O-05` | 2 | `U/U/U/U/U/U/U` | unassessed |

## Quality, Release, And Experimental Decisions

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-QA-001` | Foundation unit and browser test harness | `QA-01` | Platform | `O-00` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-002` | Vertical-slice functional, visual, performance, and creative gate | `QA-02` | `V-04`, `V-22` | `O-03` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-003` | Content validation, freshness, and production editorial gate | `QA-03` | `V-11`, `V-19`, `V-23` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-004` | Stimulation, sound, capability-tier, and frame-time QA | `QA-04` | `V-22` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-005` | Feature promotion, live verification, and rollback workflow | `QA-05` | Platform | All active outcomes | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-006` | Tracking integrity and evidence reconciliation | `QA-06` | Platform | All active outcomes | 2 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-PXP-001` | Evidence-backed skill map prototype and decision | `PXP-01` | `V-24` | Experimental | 2 | `U/U/U/U/U/U/U` | deferred |
| `CAP-PXP-002` | Rare site-help request prototype and decision | `PXP-03` | `V-21` | Experimental | 1 | `U/U/U/U/U/U/U` | deferred |

## Per-Capability Detail Record

When a row becomes active, add a short detail block below the relevant table or in its package evidence file:

```markdown
### CAP-XXX-000: Capability Name

- Owner: name or `unassigned`
- Lifecycle: in-progress
- Health: on-track
- Confidence: medium
- Dimension states: `S: accepted; C: working; A: ready-for-review; I: working; T: not-started; Q: not-started; R: not-started`
- Active package: `XXX-00`
- Branch/task: reference
- Works now: concise tested behavior
- Named gaps: concise missing paths by dimension
- Feature flag/exposure: flag and environment
- Evidence: `EV-XXX-00-01`, `EV-XXX-00-02`
- Work item: `WI-XXX-00-01`
- Next checkpoint: observable increment and target date if committed
- Last assessed: YYYY-MM-DD at commit
```

## Ledger Integrity Rules

- Capability IDs never change after implementation begins.
- Every active work package maps to at least one capability.
- Every capability maps to a package or an explicit deferred marker.
- Every capability maps to at least one vision requirement, `Platform`, or `Prototype`.
- Every `accepted` dimension has an evidence ID.
- Every `working` dimension has a named gap and active or paused work item.
- Every `blocked` state names the blocking condition and restart trigger.
- Every changed dimension state updates `last assessed` in its detail record.
- Every package completion reconciles all owned capability rows.

## Initial Reconciliation

`BAS-05` inspects current code, content, tests, deployments, and live routes for `O-00`, retained behavior, and the capabilities approaching execution. It replaces their `U` values with named states and creates work items for actionable gaps. Distant capabilities may remain `unknown` until they enter the current or next queue.

Until that audit covers the current queue, the dashboard must say `baseline incomplete` and identify the next capability to inspect. It must not calculate implementation percentages afterward either.
