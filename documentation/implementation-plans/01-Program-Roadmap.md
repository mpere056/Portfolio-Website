# Program Roadmap

Last updated: 2026-07-19

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `RDM` |
| Status | Active program control |
| Upstream | [Vision](../Comprehensive-Website-Vision.md), [Architecture](00-System-Architecture-And-Interfaces.md), [Decisions](11-Decision-Register.md) |
| Downstream | Every active workstream and release milestone |
| Primary outputs | Phase order, phase gates, vertical-slice sequence |
| Execution source | [Work Packages](13-Execution-Work-Packages.md) |
| Traceability | [Vision Matrix](12-Traceability-Matrix.md) |
| Continuation control | [Tracking Model](14-Implementation-Tracking-Model.md), [Capability Ledger](15-Capability-Coverage-Ledger.md), [Dashboard](16-Progress-Dashboard.md), and [Resume Protocol](17-Work-Items-And-Resume-Protocol.md) |

## Objective

Evolve the existing portfolio into a persistent exploratory world while continuing to ship a usable website after every milestone.

## Current Baseline

The repository already provides:

- Next.js 16 App Router pages on Node.js 24.
- A Three.js and React Three Fiber home scene.
- 3D project models and project detail overlays.
- A fullscreen About timeline.
- MDX content loaders for projects, timeline events, and project blogs.
- RAG-backed AI chat using the Vercel AI SDK, Google Generative AI, and server-only Firestore vector retrieval.
- Zustand state.
- Project subdomain middleware.
- Vercel deployment and custom domains.
- Vitest coverage for retrieval logic.

The program should extend these foundations rather than replace the entire application at once.

Phase 3 implementation checkpoint: the complete first LifeInbox vertical slice is accepted and live at `4d56565`, production `dpl_61cYUeR8aYVkx6gYYjEbT74adrZc`. The museum, selected depth journey, global archive card, and all three flagship subdomains pass public verification; legacy Projects remains rollback code rather than the active presentation.

## Dependency Order

The critical dependency chain is:

1. Stable content/graph identities, destinations, and route/state contracts.
2. Content schemas, reviewed relationships, and shared context/discovery-state architecture.
3. Global AI shell and route/object context contract.
4. One-time First Note, persistence, tour, and stimulation controls.
5. One complete flagship project exhibit.
6. Reusable museum and exploded-case-study framework.
7. Remaining flagship exhibits.
8. About depth and memory prototype.
9. Experimental skill evidence and ambient presence.
10. Later mobile, musical, and shared-navigation work.

Semantic lighting depends on the relationship graph. AI cards depend on stable object and route identifiers. Living project state should exist before project exhibits claim to show current status. Production styling for a major surface depends on an accepted aesthetic art packet; shared visual infrastructure depends on representative packets rather than preceding them as a generic design system.

The approved information architecture is technically multi-route and experientially one world. `/` is the atrium, `/about` remains one chronology, `/projects` is the museum lobby, and flagship Enter/Understand states normally live on canonical project subdomains. Depth does not automatically create pages.

## Critical Path And Safe Parallelism

| Point in program | Critical path | Work that may safely proceed in parallel |
| --- | --- | --- |
| Baseline | `BAS-01`, `BAS-02`, `BAS-04`, `BAS-06`, `BAS-07`, then `BAS-05` | Runtime/security and supported-framework work complete before target capability reconciliation |
| Contracts | `ARC-01`, `ARC-02`, `ARC-03` | Quality harness design after shared types stabilize |
| Structural foundation | `KG-01` to `KG-04`, `EXP-01`, `AI-01`, `LPS-01` | Loader migration, persistence, AI context, lifecycle schema with contract coordination |
| Exploration shell | `QA-01`, `EXP-02` to `EXP-06`, `AI-02`, `AI-03`, `KG-05`, `KG-06` | Foundation flow, First Note, tour, global shell, and graph queries/retrieval after their direct dependencies pass |
| First flagship | `PRJ-02`, `PRJ-03`, `LPS-06`, `AI-04`, `PRJ-04`, `QA-02` after completed `PRJ-01` | Asset preparation and card-contract tests may proceed only at package boundaries; do not start a second flagship interaction |
| Expansion | `PRJ-05` to `PRJ-08`, `LPS-02`, `LPS-03`, then `ABT-01` to `ABT-04` | Remaining flagships and About can overlap only after the first slice and shared museum behavior are accepted |

Unsafe parallel work:

- Do not build multiple competing depth controllers.
- Do not create project-local destination formats while the registry is unsettled.
- Do not migrate `/chat` before card navigation and global state are reliable.
- Do not build all flagship experiences before learning from the first slice.
- Do not implement The Studio before its feedback gate exits.

## Phase Package Index

Detailed package definitions and statuses live in `13-Execution-Work-Packages.md`.

| Phase | Package groups |
| --- | --- |
| Phase 0 | `BAS-01`, `BAS-02`, `BAS-04`, `BAS-06`, `BAS-07`, `BAS-05`, `ARC-01` |
| Phase 1 | `BAS-03`, `ARC-02` to `ARC-05`, `KG-01` to `KG-04`, `EXP-01`, `AI-01`, `LPS-01` |
| Phase 2 | `QA-01`, `EXP-02` to `EXP-06`, `AI-02`, `AI-03`, `KG-05`, `KG-06` |
| Phase 3 | completed `PRJ-01`; then `PRJ-02`, `PRJ-03`, `LPS-06`, `AI-04`, `PRJ-04`, `QA-02` |
| Phase 4 | `PRJ-05` to `PRJ-08`, `AI-05`, `LPS-02`, `LPS-03` |
| Phase 5 | `ABT-01` to `ABT-04` |
| Phase 6 | `LPS-04`, `LPS-05`, `EXP-07`, `QA-03` |
| Experimental | `PXP-01`, `PXP-03`; `PXP-02` remains later |

`QA-06` runs across phases after `BAS-05`; it reconciles capability status, evidence, and dashboard summaries rather than forming a standalone release phase.

## Phase 0: Planning And Technical Baseline

### Goals

- Establish implementation documents and decision gates.
- Record current performance and behavior before large changes.
- Identify fragile or duplicated state and content loading paths.

### Work

- Capture baseline build output, route sizes, known warnings, and model-loading behavior.
- Inventory all project, timeline, blog, misc, and site content.
- Establish stable IDs for every content node that will participate in the graph.
- Identify existing global providers and decide where discovery, stimulation, and AI state will live.
- Document desktop browser targets for visual verification.
- Reconcile existing implementation against every active target capability without assuming similarity means completion.

### Exit Criteria

- Baseline build passes.
- Content inventory and ID policy are documented.
- State ownership and stable-ID decisions are recorded.
- Capabilities needed for the first structural slice have been assessed, every current gap has a clear state or work item, and distant unknowns remain visible.
- No visitor-facing behavior changes are required in this phase.

## Milestone Progress Gate

Every phase exit includes two views:

1. **Acceptance gate:** required visitor and platform criteria pass with evidence.
2. **Coverage snapshot:** named capability states expose remaining specification, content, architecture, implementation, test, creative QA, and rollout gaps.

A phase may ship a deliberately bounded outcome while later capabilities remain incomplete, but it may not hide required incomplete capabilities from the snapshot. Phase state is expressed through passed checkpoints, current work, named gaps, and gates rather than a percentage.

## Phase 1: Structural Foundation

### Goals

- Build the content and state infrastructure required by later experiences.

### Workstreams

- Extend project and timeline schemas.
- Add graph node and relationship definitions.
- Create build-time content validation.
- Add project lifecycle and living-state fields.
- Add a versioned local discovery-state store.
- Define the global AI context contract.
- Add stable destination descriptors for routes, objects, exhibits, and experience states.
- Add the typed feature-flag convention after shared contracts exist.

### Exit Criteria

- [x] Invalid IDs and broken relationships fail validation.
- [x] Existing pages render from the extended schemas without regressions.
- [x] Discovery state can persist and migrate a small test value.
- [x] AI context can describe the current route and selected object without changing the chat UI yet.

Implementation checkpoint: commits `afa5f67` and `1c7129b` complete the dormant Phase 1 foundation. The production build validates 49 graph nodes and 19 reviewed relationships before Next.js compiles; 62 tests cover contracts, migration, persistence, loaders, schemas, graph integrity including empty legacy records, lifecycle rules, feature flags, and AI context. Visitor-facing exploration and global-AI UI remain intentionally deferred to Phase 2.

## Phase 2: Exploration Shell

Implementation checkpoint: Phase 2 is complete. All ten packages pass the 123-test aggregate, strict typecheck, package browser flows, clean Preview deployment, live graph-aware AI request, production-safe deployment, and public route matrix. Development/Preview exposes the complete shell; Production deliberately keeps its visitor UI off pending combined creative review. Evidence is `EV-QA-01-02` through `EV-QA-01-04`.

### Goals

- Make the site feel like one persistent exploratory world before building deep project experiences.

### Workstreams

- One-time First Note.
- Remembered home and discovery state.
- Five-stage depth primitives.
- Non-linear guided quick tour.
- Global AI shell in dormant and contextual states.
- Stimulation and sound controls.
- Initial discovery physics rules.
- A bounded new-content disturbance prototype may use authored test data; final `EXP-07` integration remains with `LPS-04` in Phase 6.

### Exit Criteria

- [x] A first-time visitor can wake the world and start exploring.
- [x] A returning visitor does not repeat the intro and retains meaningful state.
- [x] The tour can recommend destinations in any order and be dismissed.
- [x] The AI is globally reachable without repeated page buttons.
- [x] Sound-off and lower-stimulation behavior are usable.

## Phase 3: First Flagship Vertical Slice

Implementation checkpoint: Phase 3 is complete. LifeInbox was selected after equal spikes; the museum, reviewed living state, validated archive door, Signal-to-Understand product journey, evidence handoff, lazy failure boundary, and corrected Preview have passed `QA-02`. The authoritative sequence remains in [the Phase 3 sequencing decision](2026-07-17-Phase-3-Vertical-Slice-Sequencing-Decision.md), and production exposure is governed by [the Phase 3 promotion decision](2026-07-18-Phase-3-Production-Promotion-Decision.md).

### Goal

Prove the full architecture through one project before generalizing.

### Candidate Selection Gate

Choose LifeInbox or Sudoku Together after a short feasibility spike.

LifeInbox is strong for demonstrating graph relationships, current state, and exploded architecture.

Sudoku Together is strong for demonstrating immediate product interaction with a computer participant.

Both spikes must use synthetic local state, deterministic reducers, the same evidence rubric, and the accepted `PRJ-01` fallback. Do not select on visual polish or implementation effort alone.

### Execution Sequence

1. `PRJ-02`: prove one capture-to-organization transition and one visitor-plus-computer Sudoku turn; record the decision.
2. `PRJ-03`: integrate registry-backed Signal/Approach behind `museumV2`, preserving anchors and legacy rollback.
3. `LPS-06`: review one lifecycle and minimum public state record for the selected flagship.
4. `AI-04`: validate card data first, then integrate one exact selected-destination transition.
5. `PRJ-04`: converge Handle, Enter, Understand, evidence, persistence, and selected-project subdomain handoff.
6. `QA-02`: run logic, browser, visual, performance, stimulation, creative, Preview, and rollback gates.

### Required Slice

- Museum signal and approach states.
- Project identity and problem.
- Minimal product demonstration.
- Project-specific handling.
- Exploded system layer.
- Evidence and living state.
- AI context and at least one navigable archive card.
- Discovery persistence.
- Semantic-lighting connection to one accurate related item.
- Calm behavior, loading, errors, and tests.

### Exit Criteria

- The project can be understood quickly and explored deeply.
- Product behavior is more convincing than a text-only explanation.
- The architecture reveal answers why the product behaves that way.
- The same core primitives appear reusable without forcing identical project interactions.
- The selected exhibit has truthful reviewed state without claiming portfolio-wide lifecycle completion.
- The legacy Projects route remains a tested rollback until a separate production promotion.

Exit status: accepted on 2026-07-18 through `EV-AI-04-01`/`02`, `EV-PRJ-04-01` through `03`, and `EV-QA-02-01` through `03`. Generalized routing and the remaining flagships correctly move to Phase 4 rather than expanding this slice.

## Phase 4: Museum Framework And Remaining Flagships

Implementation checkpoint, 2026-07-18: all Phase 4 functional code/content and the complete keyframe-first replacement across `ART-01` and `ART-03` through `ART-06` are live and publicly verified at `806841d`. Mark rejected the first creative candidate; the replacement preserves behavior, content, routes, lifecycle, and deployment foundations. The creative dimension of `QA-02` now waits only on Mark acceptance.

Phase 4 began with the `LPS-02` lifecycle set and `ART-01` direction selection. Lifecycle truth now drives current and historical depth, while the Observatory implementation remains a functional baseline rather than an accepted artistic result. The corrected path produces six material studies, all-nine-reference route accountability, real selected/rejected keyframes, and art packets before replacement runtime work.

### Phase 4A: Select The Representative World

- Complete `ART-01` Museum alternatives and LifeInbox Handle/Understand art packets using real production content.
- Record at least one rejected direction and why it fails the authored-aesthetic diagnostics.
- Keep the current production experience live; keyframe work does not disturb functional evidence.

### Phase 4B: Build The Minimum Runtime And Remediate The First Slice

- Implement only the semantic material, utility, stimulation, calm/fallback, and capture support required by accepted packets in `ART-02`.
- Implement the selected museum and LifeInbox composition in `ART-03` behind independent flags.
- Re-run functional, performance, route/history, fallback, and creative review; close only the reopened `QA-02` creative dimension.

### Phase 4C: Author The Remaining Project Dialects

- Resolve the relevant `LPS-02`/`LPS-03` truth before using current-state visual cues.
- Produce Dreamlife, Sudoku Together, and smaller-project archive packets in `ART-04`.
- Prove silhouette, material, and manipulation differences before starting their production styling.

### Phase 4D: Implement And Integrate The Remaining Project Worlds

- Build `PRJ-05`, then `PRJ-06`, then `PRJ-07` as separate code packages using their accepted packets.
- Complete generalized route, history, metadata, and cross-subdomain behavior through `PRJ-08` without binding transient effects to URLs.
- Keep one active code package and one coherent visitor journey at a time.

### Goals

- Extract stable reusable exhibit infrastructure from the first slice.
- Build Dreamlife, LifeInbox, and Sudoku Together to flagship depth.

### Work

- Select Museum/LifeInbox keyframes and complete their art packets from current production content.
- Build the minimum aesthetic runtime foundation, then re-art-direct the museum lobby and one LifeInbox depth flow before extracting broader visual primitives.
- Extend the accepted exhibit registry and loader only where the first slice proves a reusable need.
- Keep shared depth/destination state separate from project-specific interaction state.
- Build missing flagship experiences.
- Add knowledge relationships, living state, AI cards, evidence, and easter eggs for each.
- Decide which smaller projects receive reduced-depth exhibits.
- Complete portfolio-wide lifecycle classification and all three flagship state records without rewriting the selected seed.

### Exit Criteria

- Museum, LifeInbox, Dreamlife, and Sudoku pass the authored-aesthetic diagnostics in `18-Art-Direction-And-Aesthetic-Quality.md` and the integration gates in `19-Aesthetic-System-Integration-And-Delivery.md`.
- Three flagship exhibits are complete.
- Shared museum infrastructure does not erase their distinct product behavior.
- Smaller projects have a coherent lighter presentation.

### Phase 4E: Dynamic Scene Composition Follow-On

The reference-rich static material foundation remains live and valid. Mark's 2026-07-19 feedback promotes a new follow-on rather than reopening it as failed work: route artwork should be composed from independently addressable authored layers, and movement should respond to visitor or semantic state rather than drift as one flattened poster.

Current checkpoint: `ART-07` through `ART-11` are implemented in Production `fce50af`. The candidate fixes the scrolling Museum and makes direct project interaction visible, but Mark's longer observation exposed a deeper gap: the dominant raster compositions remain temporally inert whenever the pointer is still. Interaction completeness is preserved; ambient-world acceptance is not. `ART-12` through `ART-15` now own that correction. See `2026-07-20-Phase-4-Visual-Acceptance-Remediation.md` and `2026-07-20-Pervasive-Ambient-Worlds-Implementation-Plan.md`.

Execution order:

1. `ART-07` defines the bounded scene-driver/lifecycle contract and proves one Museum scene packet, layer pack, and causal interaction.
2. `ART-08` integrates LifeInbox product state with route-specific material transformation.
3. `ART-09` implements Dreamlife and Sudoku separately from their own packets, one active route at a time.
4. `ART-10` translates the model to Home, About, AI, and reading without forcing Museum behavior onto supporting routes.
5. `ART-11` matures renderer loading, calm/fallback behavior, temporal restraint, route distinction, and Production evidence.
6. `ART-12` defines the ambient participation contract, maps every Museum source region, produces reviewed decomposed material assets, and proves pervasive idle life in the one-viewport Museum.
7. `ART-13` implements Dreamlife, LifeInbox, and Sudoku Together sequentially from distinct transparent plates, masks/maps, temporal bands, and material behaviors.
8. `ART-14` gives Home, About, AI, and reading restrained route-specific ambient systems.
9. `ART-15` closes cross-route dead zones, synchronized loops, implausible material motion, fatigue, capability, and Production gaps.

The rendering medium is selected inside each route packet. DOM, SVG, masks, Canvas, WebGL, shaders, and existing 3D are available tools, not portfolio-wide requirements. The detailed model and resumable route ledger live in `20-Dynamic-Scene-Composition-And-Layered-Materials.md`.

Exit criteria:

- Representative routes use independently addressable layers with named interaction or semantic causes.
- Approved static compositions remain strong stable frames and fallbacks.
- Shared code owns drivers and lifecycle only; route modules retain composition, material response, and choreography.
- Standard, lower-stimulation, reduced-motion, renderer-failure, and hidden-tab paths pass route-specific QA.
- Expansion beyond the Museum proof occurs only after its packet, runtime, performance, and Mark review establish a known-good pattern.
- At standard stimulation, every dominant visual region participates over time through direct material motion or changing atmosphere, illumination, reflection, shadow, or occlusion.
- Ten-to-thirty-second no-input captures pass idle-life, dead-zone, material-credibility, temporal-independence, and foreground/background diagnostics.
- Static posters remain loading, capture, reduced-motion, and failure assets rather than the perceived standard scene.

## Phase 5: About Depth

### Goals

- Connect chronology to later consequences without creating a reading-heavy interface.

### Work

- Add event inspection state.
- Add `What did this become?` relationships.
- Integrate AI context and semantic lighting.
- Prototype one memory room with one central object.
- Add a small set of real personal and relational easter eggs.

### Exit Criteria

- Timeline chronology remains clear.
- An inspected event reveals a few accurate later consequences.
- The memory-room prototype earns further use or is removed.

## Phase 6: Living Portfolio And Editorial Operations

### Goals

- Make evolving projects feel current without becoming changelog feeds.

### Work

- Complete lifecycle migration for every project.
- Add editorial workflows for meaningful updates.
- Surface new-content disturbances for returning visitors.
- Feed living state into AI and related content.
- Add content freshness checks.

### Exit Criteria

- Active and historical projects are clearly distinguished.
- No completed project pretends to be current.
- Meaningful updates propagate consistently.

## Parallel Feedback Gate: The Studio

Detailed Studio planning does not begin until Mark provides more feedback on offerings, readiness, and positioning. This gate can open at any point and is not inherently a late phase. Its implementation sequence should be decided after the feedback resolves scope and readiness.

Only preparatory work allowed before the gate:

- Remove assumptions that website templates remain the commercial direction.
- Preserve existing routes until a migration decision is made.
- Keep the content architecture capable of representing services, learning, and products.

See `09-Studio-Feedback-Gate.md`.

## Phase 7: Experimental Systems

### Prototype Candidates

- Evidence-backed skill tree or evidence map.
- Ambient anonymous visitor presence.
- Rare visitor-feedback invitations.
- Additional discovery-physics rules.

Each candidate receives a narrow prototype and an explicit keep, revise, or remove decision.

## Later Phases

- Independent mobile experience.
- Closely co-designed musical identity.
- Shared exploration and state links.
- Other items listed in `10-Later-And-Backlog.md`.

## Release Strategy

- Ship behind flags when a feature changes the site's main interaction model.
- Use preview deployments for every visual milestone.
- Promote one coherent visitor journey at a time.
- Keep the current portfolio accessible until the new path is demonstrably better.
- Avoid long-running branches that combine content migration, 3D redesign, AI changes, and project demos in one release.

## Program Success Criteria

- Visitors can understand the main navigation without external instruction.
- Free exploration produces meaningful discoveries beyond the guided tour.
- A flagship project communicates its value through interaction.
- Returning visitors experience continuity.
- AI context and cards navigate accurately.
- Knowledge relationships are explainable and source-backed.
- The site remains stable with sound off and lower stimulation.
- Build, deterministic tests, and selected desktop browser checks pass before production promotion.
