# Capability Coverage Ledger

Last updated: 2026-07-20

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
| `CAP-BAS-003` | Typed environment-aware feature flags | `BAS-03` | Platform | `O-00` | 2 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-BAS-004` | Runtime compatibility and upgrade decision | `BAS-04` | Platform | `O-00` | 1 | All applicable dimensions accepted; see `BAS-04` evidence | verified |
| `CAP-BAS-005` | Target-state implementation baseline | `BAS-05` | `V-01` through `V-24` | `O-00` | 2 | All applicable dimensions accepted; see `BAS-05` evidence | verified |
| `CAP-BAS-006` | Supported Node.js 24 and security bridge | `BAS-06` | Platform | `O-00` | 3 | All applicable dimensions accepted; see `BAS-06` evidence | verified |
| `CAP-BAS-007` | Supported Next.js 16 framework modernization | `BAS-07` | Platform | `O-00` | 5 | All applicable dimensions accepted; see `BAS-07` evidence | verified |
| `CAP-BAS-008` | Durable free-tier retrieval datastore | `BAS-08` | Platform, `V-10`, `V-11` | `O-00` | 3 | All applicable dimensions accepted; see `BAS-08` evidence | verified |
| `CAP-ARC-001` | Stable namespaced IDs and rename policy | `ARC-01` | `V-10`, `V-11` | `O-00` | 3 | All applicable dimensions accepted; see `ARC-01` and `BAS-08` evidence | verified |
| `CAP-ARC-002` | Shared depth, destination, discovery, AI, and project contracts | `ARC-02` | `V-03`, `V-10` | `O-00` | 5 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-ARC-003` | Validated destination registry and safe-state resolution | `ARC-03` | `V-07`, `V-10` | `O-00` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-ARC-004` | Typed cross-system actions without hidden global coupling | `ARC-04` | `V-01`, `V-03` | `O-00` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-ARC-005` | Runtime validation and persisted-state migrations | `ARC-05` | `V-05` | `O-00` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |

### CAP-BAS-001: Reproducible Technical And Performance Baseline

- Owner: Codex
- Lifecycle: reopened
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
- Last assessed: 2026-07-14 at `7b99008`

### CAP-BAS-004: Runtime Compatibility And Upgrade Decision

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: not-applicable; T: accepted; Q: not-applicable; R: accepted`
- Package: `BAS-04`
- Work item: `WI-BAS-04-01` (done)
- Works now: Official support constraints, effective Vercel runtime selection, the dated deployment risk, Node.js 22/24 compatibility, dependency-audit exposure, migration hotspots, package boundaries, and rollback are recorded.
- Named gaps: Implementation remains in `BAS-06` and `BAS-07`; this decision package intentionally changed no runtime, dependency, or production setting.
- Safe exposure: Documentation and read-only external inspection only.
- Evidence: `EV-BAS-04-01` through `EV-BAS-04-04`
- Next checkpoint: `BAS-06` Node.js 24 and security bridge rollout
- Last assessed: 2026-07-14 against production commit `a894aaf`

### CAP-BAS-005: Target-State Implementation Baseline

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: accepted; A: accepted; I: not-applicable; T: accepted; Q: accepted; R: not-applicable`
- Package: `BAS-05`
- Work item: `WI-BAS-05-01` (done)
- Works now: Current runtime, content, interaction, persistence, AI, project, About, living-state, quality, and rollout surfaces are reconciled against the approved target without treating legacy behavior as target acceptance.
- Named gaps: Target implementation remains intentionally distributed to its owning capabilities; this audit changes no visitor behavior.
- Safe exposure: Documentation, inspection, and work sequencing only.
- Evidence: `EV-BAS-05-01` through `EV-BAS-05-03`
- Next checkpoint: `ARC-01` completes canonical content identity and migration policy.
- Last assessed: 2026-07-14 at `4144bcc`

### CAP-BAS-008: Durable Free-Tier Retrieval Datastore

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: accepted`
- Package: `BAS-08`
- Work item: `WI-BAS-08-01` (done)
- Works now: Firestore native vector retrieval and deterministic canonical ingestion are live; the dedicated project reports free tier with billing disabled; least-privilege service access succeeds; 42 chunks cover 36 canonical IDs; the 768-dimensional index is ready; exact-commit Preview and Production retrieval/chat pass; all seven public routes are healthy; obsolete Supabase variables are removed.
- Named gaps: No package acceptance gap remains. Local credential-file deletion and inaccessible historical-key revocation are explicit security follow-ups outside runtime implementation.
- Safe exposure: Server-only credentials, deny-all client rules, no billing account, and retained Vercel rollback history.
- Evidence: `EV-BAS-08-01` through `EV-BAS-08-05` accepted.
- Next checkpoint: Preserve these constraints while `ARC-04` introduces typed action infrastructure.
- Last assessed: 2026-07-16 at `fe64bb6` and Production `dpl_3HGisq6kX91L3yKVh1d9Ae8DrHQW`.

### CAP-ARC-001: Stable Namespaced IDs And Rename Policy

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: accepted`
- Package: `ARC-01`
- Work item: `WI-ARC-01-01` (done)
- Works now: Canonical constructors, validators, aliases, inventory, deterministic Firestore ingestion, the 42-chunk managed corpus, Preview, and Production retrieval all share namespaced content identities.
- Named gaps: One separately edited misc record intentionally retains its validated fallback; recursive nested-post loading remains in `KG-01`; no real rename currently requires an alias entry.
- Safe exposure: Route slugs are unchanged, fallback replacement requires an explicit alias, and managed retrieval already uses canonical IDs.
- Evidence: `EV-ARC-01-01`, `EV-BAS-08-03`, `EV-BAS-08-04`, and `EV-BAS-08-05` accepted.
- Next checkpoint: `ARC-04` carries accepted identities and destination IDs through typed actions.
- Last assessed: 2026-07-16 at `fe64bb6`.

### CAP-ARC-002: Shared Depth, Destination, Discovery, AI, And Project Contracts

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `ARC-02`
- Works now: `portfolioContracts.ts` preserves strict content IDs while supporting ten graph-only namespaces, ordered depth, primitive safe state, the complete discovery vocabulary, AI context, archive cards, and project-experience manifests; the expanded fixture and 26-test/build gate are accepted.
- Named gaps: No acceptance gap remains in `ARC-02`. Concrete actions, runtime validators, persistence, graph records, and UI consumers remain in their named downstream packages.
- Safe exposure: Type-only infrastructure and tests; no visitor-facing behavior or persisted state changed.
- Evidence: `EV-ARC-02-01` and `EV-ARC-02-02` accepted.
- Work item: `WI-ARC-02-01` and `WI-ARC-02-02` (done).
- Next checkpoint: `ARC-04` consumes the accepted contracts through typed actions.
- Last assessed: 2026-07-16 after contract reconciliation.

### CAP-ARC-003: Validated Destination Registry And Safe-State Resolution

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `ARC-03`
- Works now: A reviewed 27-entry registry covers all nine projects, three project sites/blogs, current posts, route classes, safe-state allowlists, checkpoint and origin policy, deterministic resolution, and named fallback reasons.
- Named gaps: No acceptance gap remains in the initial registry. Existing UI links are intentionally not migrated; typed action transport belongs to `ARC-04`, with untrusted payload validation and migrations in `ARC-05`.
- Safe exposure: Pure data, resolution, validation, and tests only; current visitor navigation remains unchanged.
- Evidence: `EV-ARC-03-01` accepted.
- Work item: `WI-ARC-03-01` (done).
- Next checkpoint: `ARC-04` requests destinations by ID rather than carrying raw URLs.
- Last assessed: 2026-07-16 after destination-registry acceptance.

### CAP-ARC-004: Typed Cross-System Actions Without Hidden Global Coupling

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `ARC-04`
- Works now: Seven discriminated plain-object actions and focused creators carry stable IDs and bounded state; stimulation is normalized; exhaustive handling updates depth/AI context and resolves destinations through the accepted registry.
- Named gaps: No acceptance gap remains in `ARC-04`; `ARC-05` has accepted runtime validation and migration. Store, transition, AI, and feature adapters remain downstream.
- Safe exposure: Pure TypeScript contracts and tests only; no global browser events, visitor UI changes, persistence, or route changes.
- Evidence: `EV-ARC-04-01` accepted.
- Work item: `WI-ARC-04-01` (done).
- Next checkpoint: `EXP-01` adopts accepted actions and validation through a dormant versioned store.
- Last assessed: 2026-07-16 after action-contract acceptance.

### CAP-ARC-005: Runtime Validation And Persisted-State Migrations

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `ARC-05`
- Works now: Structured parsing validates every action and destination request; bounded version-1 semantic state ignores unknown fields, migrates flat version 0, resets corrupt sections independently, and rejects malformed roots/unknown versions to defaults.
- Named gaps: No acceptance gap remains in `ARC-05`. Browser storage, Zustand hydration, reset UI, and feature adapters remain in `EXP-01` and downstream packages.
- Safe exposure: Pure validators and migrations with synthetic fixtures only; current audio preferences, browser storage, routes, and visitor UI are unchanged.
- Evidence: `EV-ARC-05-01` accepted.
- Work item: `WI-ARC-05-01` (done).
- Next checkpoint: `EXP-01` adopts the accepted parser through a dormant per-origin store and memory-storage fixture.
- Last assessed: 2026-07-16 after runtime-validation and migration acceptance.

## Knowledge Graph And Content

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-KG-001` | Shared loader with current-output parity | `KG-01` | `V-11` | `O-00` | 2 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: accepted` | verified |
| `CAP-KG-002` | Validated project, event, post, and relationship schemas | `KG-02` | `V-11`, `V-19` | `O-00` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-KG-003` | Build-time graph compiler and visibility validator | `KG-03` | `V-11` | `O-00` | 5 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: accepted` | verified |
| `CAP-KG-004` | Reviewed flagship, event, skill, and post subgraph | `KG-04` | `V-11`, `V-13`, `V-24` | `O-00` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-KG-005` | Deterministic bounded graph-query API | `KG-05` | `V-11`, `V-12` | `O-01` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-KG-006` | Render adapters for related content and semantic edges | `KG-05` | `V-12`, `V-13` | `O-01` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-KG-007` | Graph-aware retrieval metadata and source descriptors | `KG-06` | `V-09`, `V-11` | `O-02` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: accepted` | verified |
| `CAP-KG-008` | Stable practice taxonomy and one primary practice per project | `KG-07` | `V-11`, `V-34` | `O-04` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified (`EV-KG-07-01`) |

### CAP-KG-007: Graph-Aware Retrieval Metadata And Sources

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: accepted`
- Package: `KG-06`
- Works now: New ingestion writes graph metadata; all 42 live chunks are backfilled and verified; retrieval accepts only public server-resolved context, caps graph influence at two rank positions, preserves legacy rows, and emits public destination-safe descriptors.
- Named gaps: No KG-06 gap remains; archive cards and `/chat` migration belong to `AI-04` and `AI-05`.
- Safe exposure: Existing context-free retrieval order remains unchanged; Firestore remains Spark/free and server-only.
- Evidence: `EV-KG-06-01`, `EV-KG-06-02`.
- Work item: `WI-KG-06-01` (done).
- Next checkpoint: `AI-04` may build validated archive cards on the accepted descriptors.
- Last assessed: 2026-07-16 at `7597c1b` and `aeff727` with 42-document readback.

### CAP-KG-005 And CAP-KG-006: Bounded Queries And Render Adapters

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `KG-05`
- Works now: Narrow APIs return deterministic reviewed/public connections, timeline consequences, skill evidence, explicit hidden discoveries, destination-safe related content and tour candidates, bounded AI neighborhoods, and at most three semantic edges.
- Named gaps: No package gap remains; broader project/About consumers belong to their owning later packages.
- Safe exposure: Pure build/server queries consumed by retrieval, tour, environmental response, and discovery adapters; every consumer remains bounded and visibility-safe.
- Evidence: `EV-KG-05-01`.
- Work item: `WI-KG-05-01` (done).
- Next checkpoint: `KG-06` attaches safe graph metadata and descriptors to Firestore retrieval.
- Last assessed: 2026-07-16 at `e14b103`.

### CAP-KG-001: Shared Loader With Current-Output Parity

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: accepted`
- Package: `KG-01`
- Works now: One recursive parser enumerates all 39 managed records; project, timeline, and nested-blog APIs preserve their shapes and ordering; ingestion includes nested posts with canonical IDs.
- Named gaps: Bounded graph queries and render adapters remain in `KG-05`, not this loader package.
- Safe exposure: Current route APIs are unchanged; only `src/content/**/*` is explicitly included in server output tracing.
- Evidence: `EV-KG-01-01`.
- Work item: `WI-KG-01-01` (done).
- Next checkpoint: `KG-05` consumes compiled graph data through deterministic bounded queries.
- Last assessed: 2026-07-16 at `afa5f67`.

## Persistent Exploration Foundation

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-EXP-001` | Versioned local discovery store with reset | `EXP-01` | `V-05` | `O-01` | 5 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-EXP-002` | Semantic checkpoint restore across refresh and return | `EXP-01` | `V-05` | `O-01` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-EXP-003` | Five-stage depth controller | `EXP-02` | `V-01`, `V-03` | `O-01` | 5 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-EXP-004` | Reusable proximity, handle, enter, and understand primitives | `EXP-02` | `V-02`, `V-03` | `O-01` | 5 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-EXP-005` | One-time First Note wake sequence | `EXP-03` | `V-06` | `O-01` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-EXP-006` | Returning-visitor resume after First Note | `EXP-03` | `V-05`, `V-06` | `O-01` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-EXP-007` | Role-aware tour entry with no time question | `EXP-04` | `V-07` | `O-01` | 2 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-EXP-008` | Non-linear destination recommendations and resume | `EXP-04` | `V-07` | `O-01` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-EXP-009` | Discovery physics rule engine and first reviewed rules | `EXP-05` | `V-02`, `V-12` | `O-01` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-EXP-010` | Graph-powered semantic lighting | `EXP-05` | `V-12` | `O-01` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-EXP-011` | Seamless stimulation and sound controls | `EXP-05`, `QA-04` | `V-22` | `O-01` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: planned` | verified-foundation |
| `CAP-EXP-012` | Meaningful hidden-discovery registry | `EXP-06` | `V-08`, `V-20` | `O-01` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-EXP-013` | Tour exclusion and no-score discovery behavior | `EXP-06` | `V-08`, `V-20` | `O-01` | 2 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-EXP-014` | Returning-visitor new-content disturbances | `EXP-07` | `V-23` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-EXP-015` | Continuous Home territory attention, hysteresis, and selected-state restore | `EXP-08` | `V-02`, `V-05`, `V-35` | `O-01` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-started` | implemented foundation (`EV-EXP-08-01`) |

### CAP-EXP-009 Through CAP-EXP-011: Environmental Response And Stimulation

- Owner: Codex
- Lifecycle: verified foundation; target-device rollout checks remain `QA-04`
- Health: on-track
- Confidence: high
- Dimension states: `CAP-EXP-009/010 S/C/A/I/T/Q accepted`; `CAP-EXP-011 S/A/I/T/Q accepted, R planned`
- Package: `EXP-05`
- Works now: One compact instrument applies the ordered proximity/handle/review grammar to at most three canonical graph relationships; visible copy accompanies semantic light; pointer and keyboard paths work; continuous persisted stimulation scales particles, motion, and glow; reduced motion clamps output and sound gain remains opt-in.
- Named gaps: Target-device frame-time and broader sound-control QA remain `QA-04`; final musical identity is later collaborative creative work.
- Safe exposure: Development and Preview defaults are on; Production default remains off; graph failure omits the instrument without affecting routes.
- Evidence: `EV-EXP-05-01`, `EV-EXP-05-02`, `EV-EXP-05-03`.
- Work item: `WI-EXP-05-01` (done).
- Next checkpoint: `QA-04` adds target-device stimulation checks without reopening the accepted rule engine.
- Last assessed: 2026-07-17 at `4276e6b`.

### CAP-EXP-012 And CAP-EXP-013: Meaningful Free-Exploration Discoveries

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S/C/A/I/T/Q accepted; R not-applicable`
- Package: `EXP-06`
- Works now: A validated registry contains exactly one personal artifact, technical lesson, and relational insight. Explicit route and interaction prerequisites unlock them without page-load completion; public node validation and canonical links fail closed; semantic IDs persist; pointer and keyboard paths work.
- Named gaps: No package gap remains. Additional project-specific discoveries belong to their owning exhibit or About packages and must satisfy the same contract.
- Safe exposure: Development and Preview defaults are on; Production remains off pending combined creative review.
- Evidence: `EV-EXP-06-01`, `EV-EXP-06-02`.
- Work item: `WI-EXP-06-01` (done).
- Next checkpoint: Phase 3 may add one exhibit-specific discovery only after its project experience earns it.
- Last assessed: 2026-07-17 at `51b2e7d`.

### CAP-EXP-007 And CAP-EXP-008: Role-Aware Non-Linear Tour

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable`
- Package: `EXP-04`
- Works now: A single purpose question chooses one of four authored lenses; three canonical destinations remain selectable in any order; dismiss/resume, lens change, route navigation, and independent reset persist correctly without time, progress, score, or hidden-discovery UI.
- Named gaps: Contextual first-interaction hints remain optional later refinement; Production promotion awaits combined creative review rather than additional package implementation.
- Safe exposure: Development and Preview defaults are on; Production default remains off.
- Evidence: `EV-EXP-04-01`, `EV-EXP-04-02`.
- Work item: `WI-EXP-04-01` (done).
- Next checkpoint: `EXP-05` proves environmental response without turning the tour into a checklist or revealing discoveries.
- Last assessed: 2026-07-16 at `4c80518`.

### CAP-EXP-005 And CAP-EXP-006: One-Time Wake And Return Resume

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable`
- Package: `EXP-03`
- Works now: The feature-flagged home hydrates semantic discovery, presents one dark wake control, reveals navigation independently from audio, persists completion only after readiness, skips the intro on refresh, restores a safe checkpoint, and exposes reset plus keyboard behavior.
- Named gaps: Production promotion still requires Mark's creative rollout review; origin-wide sharing across subdomains remains a later cookie decision rather than an `EXP-03` defect.
- Safe exposure: Development and Preview defaults are on; Production default remains off.
- Evidence: `EV-EXP-03-01`, `EV-EXP-03-02`.
- Work item: `WI-EXP-03-01` (done).
- Next checkpoint: `KG-05` provides bounded graph adapters before tour and semantic-environment consumers mount.
- Last assessed: 2026-07-16 at `27d2485`.

### CAP-EXP-001: Versioned Local Discovery Store With Reset

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `EXP-01`
- Works now: The dormant store derives per-origin keys, hydrates only validated state, rewrites v0 data, preserves valid siblings after partial corruption, persists semantic updates, rejects unsafe checkpoints, and resets its own origin.
- Named gaps: No UI consumes the store; cookie/global-preference sharing and First Note remain later scope.
- Safe exposure: Injectable and unmounted; current audio storage and route behavior remain unchanged.
- Evidence: `EV-EXP-01-01`.
- Work item: `WI-EXP-01-01` (done).
- Next checkpoint: `QA-01` integrated flow, then one `EXP-02` depth consumer.
- Last assessed: 2026-07-16 at `afa5f67`.

### CAP-EXP-002: Semantic Checkpoint Restore Across Refresh And Return

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `EXP-01`
- Works now: A semantic checkpoint action validates destination, depth, selected part, and bounded safe state, persists it, and restores it through explicit hydration; unsafe checkpoints fail without mutation.
- Named gaps: Visitor-facing route/history restoration is intentionally deferred to `EXP-02` and later routing packages.
- Safe exposure: Memory-backed tests prove the behavior before any browser UI depends on it.
- Evidence: `EV-EXP-01-01`.
- Work item: `WI-EXP-01-01` (done).
- Next checkpoint: Integrate checkpoint restoration with destination and context foundations in `QA-01`.
- Last assessed: 2026-07-16 at `afa5f67`.

### CAP-EXP-003 And CAP-EXP-004: Five-Stage Controller And Reusable Depth Primitives

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `EXP-02`
- Works now: Signal, Approach, Handle, Enter, and Understand have explicit transitions; the headless controller atomically synchronizes persistence, typed actions, AI context, and observers; disposal cleans owned context; a dormant React provider exposes stable snapshots.
- Named gaps: No package gap remains. Pointer, keyboard, history, and creative UI behavior belong to the visitor-facing consumers that adopt this foundation.
- Safe exposure: Dormant provider with no production route imports.
- Evidence: `EV-EXP-02-01`, `EV-EXP-02-02`.
- Work item: `WI-EXP-02-01` (done).
- Next checkpoint: `EXP-03` uses the controller for the one-time First Note and returning-visitor flow.
- Last assessed: 2026-07-16 at `852e14c`.

## Quiet Global AI

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-AI-001` | Route, object, project, timeline, and depth context stack | `AI-01` | `V-09` | `O-02` | 5 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-AI-002` | Context precedence, clearing, and privacy boundaries | `AI-01` | `V-09` | `O-02` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-AI-003` | Quiet global shell and unobtrusive state transitions | `AI-02` | `V-09` | `O-02` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-AI-004` | Lazy loading, error fallback, sound-off, and lower-stimulation AI behavior | `AI-02` | `V-09`, `V-22` | `O-02` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-AI-005` | Contextual graph retrieval with public source enforcement | `AI-03` | `V-09`, `V-11` | `O-02` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-AI-006` | Structured archive-card generation and validation | `AI-04` | `V-10` | `O-02` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified |
| `CAP-AI-007` | In-page, route, and cross-subdomain destination flow | `AI-04` | `V-10` | `O-02` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified-selected-slice |
| `CAP-AI-008` | Existing chat migration and deep-link compatibility | `AI-05` | `V-09`, `V-10` | `O-02` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-AI-05-01`) |

### CAP-AI-003 Through CAP-AI-005: Quiet Contextual Global AI

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S/A/I/T/Q/R accepted`; content is accepted where applicable
- Packages: `AI-02`, `AI-03`
- Works now: One lazy root-owned shell follows route and selected-object context, isolates errors, remains unobtrusive until opened or relevant, and preserves `/chat`. Requests send validated IDs rather than client claims; server retrieval enforces public graph context; native structured sources render only exact canonical destinations.
- Named gaps: The selected LifeInbox card is complete; expanded card composition and full `/chat` migration remain `AI-05` or later.
- Safe exposure: Development, Preview, and Production are on after `QA-02` and `QA-05`; malformed context degrades to context-free chat and individual flags remain rollback controls.
- Evidence: `EV-AI-02-01`, `EV-AI-02-02`, `EV-AI-03-01`, `EV-AI-04-01`, `EV-AI-04-02`.
- Work items: `WI-AI-02-01`, `WI-AI-03-01`, `WI-AI-04-01` (done).
- Next checkpoint: `AI-05` may address `/chat` reuse after the Phase 3 production release is stable.
- Last assessed: 2026-07-18 through corrected Preview `dpl_BGDDAtggEihci1DMz4zj1r1vAS9X`.

## Living Project State

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-LPS-001` | Lifecycle schema and section requirements | `LPS-01` | `V-19` | `O-06` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-LPS-002` | Reviewed classification for every project | `LPS-02` | `V-19` | `O-06` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified (`EV-LPS-02-01`) |
| `CAP-LPS-003` | Edited current-state records for three flagships | `LPS-03` | `V-19` | `O-03` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-LPS-03-01`) |
| `CAP-LPS-004` | Meaningful content-version and update metadata | `LPS-04` | `V-19`, `V-23` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LPS-005` | Editorial update, freshness, and review workflow | `LPS-05` | `V-19` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LPS-006` | AI precedence for edited current state over historical material | `LPS-05` | `V-09`, `V-19` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-LPS-007` | Reviewed selected-flagship state seed | `LPS-06` | `V-19` | `O-03` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |

### CAP-LPS-007: Reviewed Selected-Flagship State Seed

- Owner: Codex with explicit Mark correction path
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S/C/A/I/T/Q accepted; R not-applicable`
- Package: `LPS-06`
- Works now: One validated `evolving` LifeInbox record states the stable foundation, current trust question, latest meaningful reliability work, next validation, evidence links, content version, and review date; it attaches to the museum view and renders progressively.
- Named gaps: Portfolio-wide lifecycle review remains `LPS-02`; full three-flagship state remains `LPS-03`; Mark may correct this source-grounded wording without rewriting historical content.
- Safe exposure: Public repository facts only; no inference from Git dates and no commercial, user, or release claim.
- Evidence: `EV-LPS-06-01`, `EV-LPS-06-02`.
- Work item: `WI-LPS-06-01` (done).
- Next checkpoint: `AI-04` may target the validated LifeInbox destination and safe state.
- Last assessed: 2026-07-18 at the 50-node/19-edge content checkpoint.

## Art Direction And Aesthetic Quality

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-ART-001` | Selected portfolio art direction and starting material dialects | `ART-01` | `V-31` | `O-01`, `O-04` | 3 | `S: accepted; C: accepted; A: not-applicable; I: not-applicable; T: not-applicable; Q: accepted; R: not-applicable` | verified |
| `CAP-ART-002` | Museum/LifeInbox keyframes and accepted art packets | `ART-01` | `V-03`, `V-04`, `V-31` | `O-03`, `O-04` | 3 | `S: accepted; C: implemented; A: accepted; I: not-applicable; T: accepted; Q: in-review; R: not-applicable` | implemented (`EV-ART-01-02`) |
| `CAP-ART-003` | Semantic aesthetic runtime, utility, calm, fallback, and capture foundation | `ART-02` | `V-04`, `V-22`, `V-31` | `O-01`, `O-04` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-ART-02-01`) |
| `CAP-ART-004` | Museum/LifeInbox representative aesthetic remediation | `ART-03` | `V-03`, `V-04`, `V-31` | `O-03`, `O-04` | 5 | `S: accepted; C: implemented; A: accepted; I: accepted; T: accepted; Q: in-review; R: accepted` | implemented (`EV-ART-03-02`) |
| `CAP-ART-005` | Distinct project and archive dialect packets | `ART-04` | `V-03`, `V-14`, `V-31` | `O-04` | 5 | `S: accepted; C: implemented; A: accepted; I: accepted; T: accepted; Q: in-review; R: accepted` | implemented (`EV-ART-04-02`) |
| `CAP-ART-006` | Supporting-route translation and whole-portfolio coherence | `ART-05`, `ART-06` | `V-04`, `V-05`, `V-09`, `V-31` | `O-01`, `O-02`, `O-04`, `O-05` | 5 | `S: accepted; C: implemented; A: accepted; I: accepted; T: accepted; Q: in-review; R: accepted` | implemented (`EV-ART-05-01`, `EV-ART-06-01`) |
| `CAP-ART-007` | Bounded dynamic scene driver, lifecycle, and packet contract | `ART-07` | `V-02`, `V-03`, `V-22`, `V-32` | `O-01`, `O-04` | 3 | `S: accepted; C: implemented; A: accepted; I: accepted; T: accepted; Q: in-review; R: not-started` | implemented (`EV-ART-07-01`) |
| `CAP-ART-008` | Authored layered material packs and production manifests | `ART-07` through `ART-10` | `V-31`, `V-32` | `O-01`, `O-03`, `O-04`, `O-05` | 5 | `S: accepted; C: implemented; A: accepted; I: implemented; T: implemented; Q: in-review; R: not-started` | implemented (`EV-ART-07-01`, `EV-ART-08-01`, `EV-ART-09-01`, `EV-ART-10-01`) |
| `CAP-ART-009` | Museum dynamic composition proof | `ART-07` | `V-02`, `V-03`, `V-12`, `V-14`, `V-32` | `O-01`, `O-04` | 5 | `S: accepted; C: implemented; A: accepted; I: accepted; T: accepted; Q: in-review; R: not-started` | implemented (`EV-ART-07-01`) |
| `CAP-ART-010` | LifeInbox state-driven dynamic material transformation | `ART-08` | `V-03`, `V-04`, `V-15`, `V-17`, `V-32` | `O-03`, `O-04` | 5 | `S: accepted; C: implemented; A: accepted; I: accepted; T: accepted; Q: in-review; R: not-started` | implemented (`EV-ART-08-01`) |
| `CAP-ART-011` | Distinct flagship and supporting-route dynamic compositions | `ART-09`, `ART-10` | `V-01`, `V-04`, `V-09`, `V-13`, `V-16`, `V-18`, `V-32` | `O-01`, `O-02`, `O-04`, `O-05` | 8 | `S: accepted; C: implemented; A: accepted; I: implemented; T: implemented; Q: in-review; R: not-started` | implemented (`EV-ART-09-01`, `EV-ART-10-01`) |
| `CAP-ART-012` | Dynamic scene calm, failure, performance, and production maturity | `ART-07` through `ART-11` | `V-22`, `V-25`, `V-31`, `V-32` | `O-01`, `O-03`, `O-04`, `O-05` | 5 | `S: accepted; C: implemented; A: accepted; I: implemented; T: accepted; Q: in-review; R: accepted` | implemented (`EV-ART-11-03`, `EV-ART-11-04`) |
| `CAP-ART-013` | Ambient participation contract, motion coverage ledger, and coordinated scene clock | `ART-12` | `V-22`, `V-31`, `V-32`, `V-33` | `O-01`, `O-04` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified proof foundation |
| `CAP-ART-014` | Decomposed material production pipeline and bounded Museum dialect proofs | `ART-12` | `V-14`, `V-31`, `V-32`, `V-33` | `O-04` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified proof foundation |
| `CAP-ART-015` | Route-specific flagship and supporting ambient worlds | `ART-13`, `ART-14` | `V-01`, `V-04`, `V-09`, `V-13`, `V-16`, `V-17`, `V-18`, `V-31`, `V-33` | `O-01`, `O-02`, `O-03`, `O-04`, `O-05` | 8 | `S: accepted; C: not-started; A: not-started; I: not-started; T: not-started; Q: not-started; R: not-started` | planned |
| `CAP-ART-016` | Pervasive ambient quality, performance, and production maturity | `ART-15` | `V-22`, `V-25`, `V-31`, `V-33` | `O-01`, `O-03`, `O-04`, `O-05` | 5 | `S: accepted; C: not-started; A: not-started; I: not-started; T: not-started; Q: not-started; R: not-started` | planned |
| `CAP-ART-017` | Five-anchor neutral Home composition and shared attention compositor | `ART-16` | `V-31`, `V-32`, `V-34`, `V-35`, `V-36` | `O-01`, `O-04` | 5 | `S: accepted; C: implemented; A: implemented; I: implemented; T: accepted; Q: in-review; R: not-started` | in-review (`EV-ART-16-01`) |
| `CAP-ART-018` | Fixed-anchor atmospheric melding and local territory response | `ART-16` | `V-31`, `V-33`, `V-35`, `V-36` | `O-01`, `O-04` | 5 | `S: accepted; C: not-started; A: not-started; I: not-started; T: not-started; Q: not-started; R: not-started` | planned |
| `CAP-ART-019` | Home territory runtime lifecycle, calm/failure, and performance budget | `ART-16`, `QA-07` | `V-22`, `V-25`, `V-32`, `V-34` | `O-01`, `O-04` | 5 | `S: accepted; C: not-started; A: not-started; I: not-started; T: not-started; Q: not-started; R: not-started` | planned |

### CAP-ART-001: Selected Portfolio Art Direction

- Owner: Mark and Codex
- Lifecycle: verified
- Health: watch
- Confidence: high
- Dimension states: `S/C/Q accepted; A/I/T/R not-applicable`
- Package: `ART-01`
- Works now: Mark selected the Impossible Observatory of Living Instruments with an abstract Observatory emphasis; nine references are translated into material, color, composition, motion, project, and anti-copy guardrails.
- Named gaps: no direction-selection gap remains. Exact rendering decisions move to `CAP-ART-002` keyframes.
- Safe exposure: documentation only; current Production remains functional and explicitly under aesthetic revision.
- Evidence: `EV-ART-01-01`.
- Work item: `WI-ART-01-01` (done).
- Next checkpoint: preserve the accepted direction while `ART-12B/C` translates it into region and production-asset briefs.
- Last assessed: 2026-07-20 during ambient-sequence reconciliation.

### CAP-ART-002: Museum And LifeInbox Keyframes And Art Packets

- Owner: Codex with Mark creative review
- Lifecycle: implemented foundation; standalone review paused
- Health: watch
- Confidence: high on content, direction, and implementation; creative acceptance pending
- Dimension states: `S/A accepted; C implemented; T accepted; Q in-review; I/R not-applicable`
- Package: `ART-01`
- Works now: six original material studies, all-reference coverage, three real Museum alternatives, one selected/reassigned decision, production asset assignments, and stable project coordinates are committed and implemented.
- Named gaps: no separate packet approval is actionable; final route-level creative acceptance moves through `ART-12` to `ART-15`. Musical identity and mobile-specific composition remain later.
- Safe exposure: design documentation only; current release stays live while visual inputs are selected.
- Evidence: `EV-ART-01-02` is candidate evidence; `EV-ART-01-01` remains accepted direction evidence.
- Work item: `WI-ART-01-01` is done; `WI-ART-01-02` is paused and reopens only from a named active-route packet mismatch.
- Next checkpoint: consume the Museum packet during `ART-12B/C`; do not request standalone review.
- Last assessed: 2026-07-20.

### CAP-ART-004: Reopened Museum And LifeInbox Remediation

- Owner: Codex with Mark creative review
- Lifecycle: implemented foundation; standalone review paused
- Health: watch
- Confidence: high on function and local integration; creative acceptance pending
- Dimension states: `S/A/I/T/R accepted; C implemented; Q in-review`
- Package: `ART-03`
- Works now: the replacement Museum uses a phenomenon-led ecology with nine semantic coordinates; LifeInbox carries a spectral receiving vessel through the existing trust-boundary experience; local tests, build, and browser review pass.
- Named gaps: pervasive Museum/LifeInbox material participation remains in `ART-12` and `ART-13`; no standalone review remains.
- Safe exposure: current Production remains the known-good functional baseline; aesthetic work proceeds behind existing rollback boundaries.
- Evidence: `EV-ART-03-01` preserves the failed comparison; `EV-ART-03-02` records the replacement candidate.
- Work item: `WI-ART-03-01` (paused).
- Next checkpoint: preserve this composition through `ART-12`, reopening only a named mismatch.
- Last assessed: 2026-07-20 after master-sequence reconciliation.

### CAP-ART-005: Reopened Project And Archive Dialects

- Owner: Codex with Mark creative review
- Lifecycle: implemented foundation; standalone review paused
- Health: watch
- Confidence: high on distinct composition and local integration; creative acceptance pending
- Dimension states: `S/A/I/T/R accepted; C implemented; Q in-review`
- Package: `ART-04`
- Works now: Dreamlife uses liquid nacre/pearl refraction; Sudoku uses diagram-organism depth; historical projects occupy distinct ecological, aperture, folio, waveform, camera, and crystalline landmarks.
- Named gaps: pervasive flagship and archive temporal participation remains in `ART-13`/`14`; no standalone review remains.
- Safe exposure: existing worlds remain live and functional until replacement packets pass review.
- Evidence: `EV-ART-04-01` remains accepted for basic swap distinction; `EV-ART-04-02` records the reference-rich candidate.
- Work item: `WI-ART-04-01` (paused).
- Next checkpoint: consume each dialect from its active `ART-13`/`14` route packet, reopening only a named mismatch.
- Last assessed: 2026-07-20 after master-sequence reconciliation.

### CAP-ART-006: Supporting Routes And Whole-Portfolio Coherence

- Owner: Codex with Mark creative review
- Lifecycle: implemented foundation; standalone review paused
- Health: on-track
- Confidence: high on local integration; public and creative acceptance pending
- Dimension states: `S/A/I/T/R accepted; C implemented; Q in-review`
- Packages: `ART-05`, `ART-06`
- Works now: Home, About, the global AI archive, all three project worlds, and project reading surfaces receive explicit related-but-not-templated materials from one tested asset registry. Optimized runtime assets remain separate from full-resolution decision evidence, and reduced-motion disables autonomous art drift.
- Named gaps: route-specific ambient participation and final portfolio acceptance remain in `ART-14`/`15`. Mobile-specific art direction and musical identity remain explicit later work.
- Safe exposure: all artwork is subordinate to semantic HTML, route truth, failure isolation, and existing rollback boundaries.
- Evidence: `EV-ART-05-01` and `EV-ART-06-01` are candidate evidence.
- Work items: `WI-ART-05-01`, `WI-ART-06-01` (paused).
- Next checkpoint: preserve these translations until their route-local `ART-14` packets become active.
- Last assessed: 2026-07-20 after master-sequence reconciliation.

### CAP-ART-007 Through CAP-ART-009: Dynamic Scene Contract And Museum Proof

- Owner: Codex with Mark creative review
- Lifecycle: implemented interaction foundation; `WI-ART-07-01` is paused
- Health: on-track
- Confidence: high in local architecture, implementation, and verification; creative and rollout acceptance remain
- Dimension states: `S/A/I/T accepted; C implemented; Q in-review; R not-started` for `CAP-ART-007/009`; `CAP-ART-008` is working across later route scope
- Package: `ART-07`
- Works now: the Museum has an executable seven-layer manifest; bounded frame/proximity/path logic; masked membrane and aperture; one visibility-aware Canvas field; reviewed graph filaments/readouts; project-specific Approach material; stimulation/reduced-motion handling; and stable semantic fallback.
- Named gaps: pervasive no-input Museum participation, updated fully animated performance observation, and final ambient acceptance remain in `ART-12`.
- Safe exposure: Production `fce50af` is live; Canvas/SVG/CSS failure leaves the existing matte and semantic project controls.
- Evidence: `EV-ART-07-01` candidate evidence.
- Work item: `WI-ART-07-01` (paused).
- Next checkpoint: feed this interaction contract into `ART-12A/B`; reopen only if ambient integration causes a named regression.
- Last assessed: 2026-07-20 after master-sequence reconciliation.

### CAP-ART-010 Through CAP-ART-012: Route Expansion And Dynamic Maturity

- Owner: Codex with Mark creative review
- Lifecycle: deployed interaction foundation; standalone review paused
- Health: on-track
- Confidence: high in implementation, aggregate verification, and public geometry/interaction; Mark acceptance and longer observation remain
- Dimension states: `CAP-ART-010 C/I/T implemented and Q in-review; CAP-ART-011 I/T implemented and Q in-review; CAP-ART-012 I implemented, T/R accepted, and Q in-review`
- Packages: `ART-08` through `ART-11`
- Works now: Production `fce50af` provides a one-viewport Museum with collision-free signals and contained increasing depth. Dreamlife, LifeInbox, and Sudoku Together place distinct pointer-driven scenes on their direct landing surfaces while preserving route behavior, evidence, calm state, and still fallback.
- Named gaps: sustained performance observation, Mark acceptance, and the newly explicit pervasive ambient requirement. The interactive layers work, but dominant raster regions remain too inert during normal idle.
- Safe exposure: Production `fce50af` is live. Renderer failure leaves each route's matte, semantic controls, product state, and evidence.
- Evidence: `EV-ART-11-03` records the failed public creative review; `EV-ART-11-04` records the local corrective candidate.
- Work items: `WI-ART-08-01` through `WI-ART-11-01` are paused as retained foundations.
- Next checkpoint: preserve their contracts during `ART-12`; reopen only a named interaction, state, lifecycle, or renderer regression.
- Last assessed: 2026-07-20.

### CAP-ART-013 Through CAP-ART-019: Ambient Proofs And Home-World Integration

- Owner: Codex with Mark creative review
- Lifecycle: `CAP-ART-013/014` verified proof foundations; `CAP-ART-015/016` remain planned route-maturation work; `CAP-ART-017` has a Stage `D` candidate in review; `CAP-ART-018/019` planned
- Health: on-track
- Confidence: high in the accepted contracts and additive implementation; neutral creative acceptance and transition quality remain open
- Works now: Public `/` and `/projects` remain unchanged. Four controlled practices, nine required project classifications, bounded graph queries, and the pure attention contract pass validation. The private `/home-world-proof` composes five fixed semantic anchors in one desktop viewport, reuses the actual Home piano renderer, supports selected/return behavior, and mounts no complete Museum proof runtime.
- Named gaps: Mark has not accepted the neutral composition. React/history adoption, Music/Play melding, remaining territory runtimes, About portal, project reveal, route migration, and integrated performance evidence do not exist.
- Safe exposure: only the no-index proof route contains the integrated shell; canonical routes and rollback surfaces are unchanged.
- Evidence: `EV-ART-16-01` records 56 files / 232 tests, TypeScript, focused lint, content validation, the 40-page build, and local `1440 x 900` browser review.
- Work item: `WI-ART-16-01` is in review at checkpoint `D`. `WI-ART-12-01` is superseded after preserving its accepted proof results.
- Next checkpoint: deploy and collect Mark's neutral-shell review; begin Stage `E` only after acceptance.
- Last assessed: 2026-07-24 at `557c7fb`.

## Project Depth And Practice-Reveal System

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-PRJ-001` | Typed exhibit registry, loader, and fallback shell | `PRJ-01` | `V-14` | `O-03` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-PRJ-002` | Stable exhibit anchors and depth-fallback resolution | `PRJ-01` | `V-10`, `V-14` | `O-03` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-PRJ-003` | LifeInbox and Sudoku feasibility spikes with selection record | `PRJ-02` | `V-17`, `V-18` | `O-03` | 2 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified |
| `CAP-PRJ-004` | Museum signal and approach navigation | `PRJ-03` | `V-03`, `V-14` | `O-03` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: planned` | verified-foundation |
| `CAP-PRJ-005` | Shared Handle, Enter, and Understand integration | `PRJ-04` | `V-03`, `V-14`, `V-15` | `O-03` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified-first-slice |
| `CAP-PRJ-006` | Exploded system layers connected to behavior and evidence | `PRJ-04` | `V-15` | `O-03` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified-first-slice |
| `CAP-PRJ-007` | Smaller-project exhibit tiers and hidden depth | `PRJ-07` | `V-08`, `V-14`, `V-20` | `O-04` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable` | verified (`EV-PRJ-07-01`) |
| `CAP-PRJ-008` | Generalized project routes, URL/history state, metadata, and subdomain transitions | `PRJ-08` | `V-10`, `V-14` | `O-04` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-PRJ-08-01`) |
| `CAP-PRJ-009` | Practice-territory project grouping, reveal, and exact return | `PRJ-09` | `V-03`, `V-14`, `V-34` | `O-04` | 5 | `S: accepted; C: not-started; A: not-started; I: not-started; T: not-started; Q: not-started; R: not-started` | planned |

### CAP-PRJ-001: Typed Exhibit Registry, Loader, And Fallback Shell

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `PRJ-01`
- Works now: All nine authored projects derive typed definitions from canonical content and destinations; three flagship manifests lazy-load behind runtime ownership/depth validation; graph and module failures preserve semantic project copy and links.
- Named gaps: None within `PRJ-01`; the shell is intentionally not the final art direction or mounted museum navigation.
- Safe exposure: Additive server/library/component foundation only; the existing visitor route remains unchanged.
- Evidence: `EV-PRJ-01-01`, `EV-PRJ-01-02`.
- Work item: `WI-PRJ-01-01` (done).
- Next checkpoint: `PRJ-02` proves two bounded product interactions against the same contract.
- Last assessed: 2026-07-17 at `e462080`.

### CAP-PRJ-002: Stable Exhibit Anchors And Depth-Fallback Resolution

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `PRJ-01`
- Works now: Every current project resolves by slug or canonical project ID to one stable museum anchor; unsupported requested depth falls back to Signal without losing the exhibit; unknown exhibits return to the museum lobby.
- Named gaps: None within this bounded capability. Generalized URL/history state, route metadata, and project-subdomain transitions are separately tracked by `CAP-PRJ-008` and `PRJ-08`.
- Safe exposure: Existing route anchors continue to work; no new URL or history behavior is exposed.
- Evidence: `EV-PRJ-01-01`, `EV-PRJ-01-02`, `EV-PRJ-01-03`.
- Work item: `WI-PRJ-01-01` (done).
- Next checkpoint: `PRJ-03` consumes stable anchors without inventing a second destination format.
- Last assessed: 2026-07-17 at `e462080`.

### CAP-PRJ-003: Equal Feasibility Spikes And Selection Record

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: not-applicable`
- Package: `PRJ-02`
- Works now: Equal local-only state machines prove LifeInbox capture/organization and Sudoku legal visitor/computer contribution; both disclose simulation boundaries and reset deterministically. The reviewed rubric selects LifeInbox for the first full slice.
- Named gaps: Neither spike is a full exhibit. LifeInbox depth belongs to `PRJ-04`; the retained Sudoku spike belongs to later `PRJ-06` convergence.
- Safe exposure: Both spikes remain local, deterministic, synthetic, and outside the mounted visitor route until the selection record is accepted.
- Evidence: `EV-PRJ-02-01`, `EV-PRJ-02-02`.
- Work item: `WI-PRJ-02-01` (done).
- Next checkpoint: `PRJ-03` integrates the museum shell, then `LPS-06` supplies reviewed LifeInbox state.
- Last assessed: 2026-07-18 after focused tests and selection review.

### CAP-PRJ-004: Museum Signal And Approach Navigation

- Owner: Codex
- Lifecycle: verified foundation
- Health: on-track
- Confidence: high
- Dimension states: `S/C/A/I/T/Q accepted; R planned`
- Package: `PRJ-03`
- Works now: A server-selected museum path renders nine light-weight signals, exact hash anchors, an authored Approach panel, canonical project-world actions, responsive layout, useful fallbacks, and reduced-motion-aware transitions without importing product interaction bundles.
- Named gaps: Production exposure remains off until `QA-02`; Handle/Enter/Understand remain selected-LifeInbox `PRJ-04` scope; generalized URL/history behavior remains `PRJ-08`.
- Safe exposure: Development and Preview on; Production keeps the complete legacy `ProjectsClient` rollback.
- Evidence: `EV-PRJ-03-01` through `EV-PRJ-03-03`.
- Work item: `WI-PRJ-03-01` (done).
- Next checkpoint: `LPS-06` supplies truthful selected-LifeInbox state before product depth is composed.
- Last assessed: 2026-07-18 after 146 tests, build, and browser review.

## Flagship Product Experiences

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-LIB-001` | Synthetic LifeInbox entry and local-first input interaction | `PRJ-04` | `V-17` | `O-03` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified |
| `CAP-LIB-002` | LifeInbox routing, relationship, and organization autopsy | `PRJ-04` | `V-15`, `V-17` | `O-03` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified-first-layer |
| `CAP-LIB-003` | LifeInbox evidence, privacy, errors, and living state | `PRJ-04` | `V-17`, `V-19` | `O-03` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified |
| `CAP-SDK-001` | Minimal valid single-player Sudoku interaction | `PRJ-06` | `V-18` | `O-04` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-PRJ-06-01`) |
| `CAP-SDK-002` | Clearly labeled deterministic computer participant | `PRJ-06` | `V-18` | `O-04` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-PRJ-06-01`) |
| `CAP-SDK-003` | Sudoku collaboration architecture, validity, evidence, and fallback | `PRJ-04` or `PRJ-06` | `V-15`, `V-18` | `O-03` or `O-04` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-PRJ-06-01`) |
| `CAP-DRM-001` | Authored Dreamlife future-path scenario | `PRJ-05` | `V-16` | `O-04` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-PRJ-05-01`) |
| `CAP-DRM-002` | Dreamlife reaction, refinement, and experiment interaction | `PRJ-05` | `V-04`, `V-16` | `O-04` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-PRJ-05-01`) |
| `CAP-DRM-003` | Dreamlife exploded system, evidence, and living state | `PRJ-05` | `V-15`, `V-16`, `V-19` | `O-04` | 3 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified (`EV-PRJ-05-01`) |

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
| `CAP-QA-001` | Foundation unit and browser test harness | `QA-01` | Platform | `O-00` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified |
| `CAP-QA-002` | Vertical-slice functional, visual, performance, and creative gate | `QA-02` | `V-04`, `V-22`, `V-31` | `O-03` | 5 | `S: accepted; C: accepted; A: accepted; I: accepted; T: accepted; Q: working; R: accepted` | reopened (`EV-QA-02-04` failed creative gate) |
| `CAP-QA-003` | Content validation, freshness, and production editorial gate | `QA-03` | `V-11`, `V-19`, `V-23` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-004` | Stimulation, sound, capability-tier, and frame-time QA | `QA-04` | `V-22` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-005` | Feature promotion, live verification, and rollback workflow | `QA-05` | Platform | All active outcomes | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified |
| `CAP-QA-006` | Tracking integrity and evidence reconciliation | `QA-06` | Platform | All active outcomes | 2 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
| `CAP-PXP-001` | Evidence-backed skill map prototype and decision | `PXP-01` | `V-24` | Experimental | 2 | `U/U/U/U/U/U/U` | deferred |
| `CAP-PXP-002` | Rare site-help request prototype and decision | `PXP-03` | `V-21` | Experimental | 1 | `U/U/U/U/U/U/U` | deferred |

### CAP-QA-002: Reopened First-Slice Creative Gate

- Owner: Codex with Mark creative acceptance
- Lifecycle: reopened
- Health: watch
- Confidence: high
- Dimension states: `S/C/A/I/T/R accepted; Q working`
- Package: `QA-02`
- Works now: the 157-test aggregate, strict types, validated content, browser depth flow, sound-off/reduced-motion behavior, lazy loading, Preview, Production, and rollback evidence remain valid.
- Named gaps: the first remediation removed the most obvious card-grid failure but still did not visibly realize most reference families. `V-31` now requires the six material studies, all-nine-reference route accountability, selected/rejected keyframes, original authored forms and surfaces, distinct depth transformations, stable close-detail captures, and Mark acceptance.
- Safe exposure: the functional release remains live under independent rollback flags while remediation is developed and reviewed in Preview.
- Evidence: `EV-QA-02-01` and `EV-QA-02-03` remain sufficient; `EV-QA-02-02` remains sufficient for browser/stimulation claims but not the renewed aesthetic claim.
- Work item: historical `WI-QA-02-01` remains done; `WI-ART-01-02` owns the missing visual inputs and `WI-ART-03-01` owns the replacement runtime candidate.
- Next checkpoint: `CAP-ART-002` accepts actual material studies and keyframes; `CAP-ART-004` then produces a new reference-rich candidate before this creative dimension receives new evidence.
- Last assessed: 2026-07-18 after Mark's direct live feedback.

### CAP-QA-001: Foundation Unit And Browser Test Harness

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted`
- Package: `QA-01`
- Works now: Vitest covers the shared contracts, graph, exploration, AI, exhibit runtime, retrieval, content identity, and regression surfaces; the reusable Playwright harness covers foundation journeys and screenshots; Preview and Production checks have repeatable evidence.
- Named gaps: No `QA-01` acceptance gap remains. Feature-specific creative, performance, stimulation, and rollout gates remain in `QA-02` through `QA-05`.
- Safe exposure: Unit, integration, browser, build, Preview, and Production evidence are additive and preserve explicit feature flags and rollback routes.
- Evidence: `EV-QA-01-01`, `EV-QA-01-02`, `EV-QA-01-03`, `EV-QA-01-04`.
- Work item: `WI-QA-01-01` (done).
- Next checkpoint: `QA-02` applies the accepted harness to the first complete flagship vertical slice.
- Last assessed: 2026-07-17 after the 134-test aggregate gate and current Production smoke.

### CAP-QA-006: Tracking Integrity And Evidence Reconciliation

- Owner: Codex
- Lifecycle: verified
- Health: on-track
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable`
- Package: `QA-06`
- Works now: Package, capability, work-item, evidence, decision, and dashboard records are reconciled against the repository and live deployment; six automated checks fail on package-count, package-reference, active-work, durable-evidence, capability-evidence, or dashboard drift.
- Named gaps: No `QA-06` acceptance gap remains. The test cannot replace package-specific functional or creative evidence and must continue to run whenever structural planning records change.
- Safe exposure: Documentation and test infrastructure only; no visitor behavior or production configuration changes.
- Evidence: `EV-QA-06-01`.
- Work item: `WI-QA-06-01` (done).
- Next checkpoint: Keep the integrity test in the repository gate while `WI-PRJ-02-01` executes.
- Last assessed: 2026-07-17 at `1286931` with the 140-test aggregate gate.

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
