# Program Roadmap

Last updated: 2026-07-14

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

- Next.js 14 App Router pages.
- A Three.js and React Three Fiber home scene.
- 3D project models and project detail overlays.
- A fullscreen About timeline.
- MDX content loaders for projects, timeline events, and project blogs.
- RAG-backed AI chat using the Vercel AI SDK and Google Generative AI.
- Zustand state.
- Project subdomain middleware.
- Vercel deployment and custom domains.
- Vitest coverage for retrieval logic.

The program should extend these foundations rather than replace the entire application at once.

## Dependency Order

The critical dependency chain is:

1. Content schemas and reviewed relationships.
2. Shared context and discovery-state architecture.
3. Global AI shell and route/object context contract.
4. One-time First Note, persistence, tour, and stimulation controls.
5. One complete flagship project exhibit.
6. Reusable museum and exploded-case-study framework.
7. Remaining flagship exhibits.
8. About depth and memory prototype.
9. Experimental skill evidence and ambient presence.
10. Later mobile, musical, and shared-navigation work.

Semantic lighting depends on the relationship graph. AI cards depend on stable object and route identifiers. Living project state should exist before project exhibits claim to show current status.

## Critical Path And Safe Parallelism

| Point in program | Critical path | Work that may safely proceed in parallel |
| --- | --- | --- |
| Baseline | `BAS-01`, `BAS-02`, `BAS-04`, then `BAS-05` | Technical baseline, content inventory, and runtime decision may overlap; capability reconciliation follows the first two |
| Contracts | `ARC-01`, `ARC-02`, `ARC-03` | Quality harness design after shared types stabilize |
| Structural foundation | `KG-01` to `KG-04`, `EXP-01`, `AI-01`, `LPS-01` | Loader migration, persistence, AI context, lifecycle schema with contract coordination |
| Exploration shell | `EXP-02` to `EXP-05`, `AI-02`, `AI-03`, `KG-05` | First Note, tour, global shell, graph queries after their direct dependencies pass |
| First flagship | `PRJ-01` to `PRJ-04`, `AI-04`, `LPS-03`, `QA-02` | Asset preparation and reviewed About relationships, not another flagship implementation |
| Expansion | `PRJ-05` to `PRJ-08`, `ABT-01` to `ABT-04`, `LPS-04` | Remaining flagships and About can overlap only after museum and graph contracts are stable |

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
| Phase 0 | `BAS-01`, `BAS-02`, `BAS-04`, `BAS-05`, `ARC-01` |
| Phase 1 | `BAS-03`, `ARC-02` to `ARC-05`, `KG-01` to `KG-04`, `EXP-01`, `AI-01`, `LPS-01` |
| Phase 2 | `EXP-02` to `EXP-07`, `AI-02`, `AI-03`, `KG-05`, `QA-01` |
| Phase 3 | `PRJ-01` to `PRJ-04`, `AI-04`, `LPS-02`, `LPS-03`, `QA-02` |
| Phase 4 | `PRJ-05` to `PRJ-08`, `AI-05` |
| Phase 5 | `ABT-01` to `ABT-04` |
| Phase 6 | `LPS-04`, `LPS-05`, `QA-03` |
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

- Invalid IDs and broken relationships fail validation.
- Existing pages render from the extended schemas without regressions.
- Discovery state can persist and migrate a small test value.
- AI context can describe the current route and selected object without changing the chat UI yet.

## Phase 2: Exploration Shell

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
- New-content disturbance model using authored test data.

### Exit Criteria

- A first-time visitor can wake the world and start exploring.
- A returning visitor does not repeat the intro and retains meaningful state.
- The tour can recommend destinations in any order and be dismissed.
- The AI is globally reachable without repeated page buttons.
- Sound-off and lower-stimulation behavior are usable.

## Phase 3: First Flagship Vertical Slice

### Goal

Prove the full architecture through one project before generalizing.

### Candidate Selection Gate

Choose LifeInbox or Sudoku Together after a short feasibility spike.

LifeInbox is strong for demonstrating graph relationships, current state, and exploded architecture.

Sudoku Together is strong for demonstrating immediate product interaction with a computer participant.

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

## Phase 4: Museum Framework And Remaining Flagships

### Goals

- Extract stable reusable exhibit infrastructure from the first slice.
- Build Dreamlife, LifeInbox, and Sudoku Together to flagship depth.

### Work

- Define an exhibit registry and experience loader.
- Separate shared depth state from project-specific interaction code.
- Build missing flagship experiences.
- Add knowledge relationships, living state, AI cards, evidence, and easter eggs for each.
- Decide which smaller projects receive reduced-depth exhibits.

### Exit Criteria

- Three flagship exhibits are complete.
- Shared museum infrastructure does not erase their distinct product behavior.
- Smaller projects have a coherent lighter presentation.

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
