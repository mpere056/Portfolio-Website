# Capability Coverage Ledger

Last updated: 2026-07-16

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
| `CAP-KG-005` | Deterministic bounded graph-query API | `KG-05` | `V-11`, `V-12` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-KG-006` | Render adapters for related content and semantic edges | `KG-05` | `V-12`, `V-13` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-KG-007` | Graph-aware retrieval metadata and source descriptors | `KG-06` | `V-09`, `V-11` | `O-02` | 3 | `U/U/U/U/U/U/U` | unassessed |

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
| `CAP-AI-003` | Quiet global shell and unobtrusive state transitions | `AI-02` | `V-09` | `O-02` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-004` | Lazy loading, error fallback, sound-off, and lower-stimulation AI behavior | `AI-02` | `V-09`, `V-22` | `O-02` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-005` | Contextual graph retrieval with public source enforcement | `AI-03` | `V-09`, `V-11` | `O-02` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-006` | Structured archive-card generation and validation | `AI-04` | `V-10` | `O-02` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-007` | In-page, route, and cross-subdomain destination flow | `AI-04` | `V-10` | `O-02` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-AI-008` | Existing chat migration and deep-link compatibility | `AI-05` | `V-09`, `V-10` | `O-02` | 3 | `U/U/U/U/U/U/U` | unassessed |

## Living Project State

| Capability ID | Capability | Package | Requirements | Outcome | Scope signal | Dimension state | Lifecycle |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `CAP-LPS-001` | Lifecycle schema and section requirements | `LPS-01` | `V-19` | `O-06` | 3 | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: not-applicable; R: not-applicable` | verified |
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
| `CAP-QA-001` | Foundation unit and browser test harness | `QA-01` | Platform | `O-00` | 3 | `S: accepted; C: not-applicable; A: not-started; I: not-started; T: not-started; Q: not-started; R: not-started` | planned |
| `CAP-QA-002` | Vertical-slice functional, visual, performance, and creative gate | `QA-02` | `V-04`, `V-22` | `O-03` | 5 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-003` | Content validation, freshness, and production editorial gate | `QA-03` | `V-11`, `V-19`, `V-23` | `O-06` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-004` | Stimulation, sound, capability-tier, and frame-time QA | `QA-04` | `V-22` | `O-01` | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-005` | Feature promotion, live verification, and rollback workflow | `QA-05` | Platform | All active outcomes | 3 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-QA-006` | Tracking integrity and evidence reconciliation | `QA-06` | Platform | All active outcomes | 2 | `U/U/U/U/U/U/U` | unassessed |
| `CAP-PXP-001` | Evidence-backed skill map prototype and decision | `PXP-01` | `V-24` | Experimental | 2 | `U/U/U/U/U/U/U` | deferred |
| `CAP-PXP-002` | Rare site-help request prototype and decision | `PXP-03` | `V-21` | Experimental | 1 | `U/U/U/U/U/U/U` | deferred |

### CAP-QA-001: Foundation Unit And Browser Test Harness

- Owner: unassigned
- Lifecycle: planned
- Health: not-active
- Confidence: high
- Dimension states: `S: accepted; C: not-applicable; A: not-started; I: not-started; T: not-started; Q: not-started; R: not-started`
- Package: `QA-01`
- Works now: Vitest covers inventory, runtime policy, retrieval, chat generation fallback, and canonical content IDs; browser and production checks have repeatable written evidence.
- Named gaps: The target reusable harness does not yet automate one foundation browser journey, visual checkpoint, or preview gate.
- Safe exposure: Existing tests remain required; the later harness adds coverage without replacing them blindly.
- Evidence: `EV-BAS-05-01`, existing baseline package test evidence.
- Work item: none; waits for `ARC-02`.
- Next checkpoint: One automated foundation flow consumes shared contracts and runs in the supported toolchain.
- Last assessed: 2026-07-14 at `4144bcc`

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
