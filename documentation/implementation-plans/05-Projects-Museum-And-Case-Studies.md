# Projects Museum And Case Studies Plan

Last updated: 2026-07-16

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `PRJ` |
| Status | Active after foundation |
| Upstream | [Architecture](00-System-Architecture-And-Interfaces.md), [Experience](02-Experience-Foundation.md), [Graph](03-Knowledge-Graph-And-Content.md), [AI](04-Global-AI-And-Talking-Archive.md), [Living State](07-Living-Project-State.md) |
| Downstream | Main projects route, project subdomains, guided tour, skill evidence |
| Primary outputs | Museum registry, first vertical slice, three flagship experiences, smaller-project tiers |
| Execution packages | `PRJ-01` through `PRJ-08` in [Work Packages](13-Execution-Work-Packages.md) |
| Capability tracking | `CAP-PRJ-*`, `CAP-LIB-*`, `CAP-SDK-*`, and `CAP-DRM-*` in [Capability Ledger](15-Capability-Coverage-Ledger.md) |

## Scope

Transform the existing project page and project subdomains into an inspectable museum of systems with increasing depth, focused product demonstrations, and project-specific exploded case studies.

## Existing Foundation

- `src/app/projects/page.tsx`
- `src/components/ProjectsClient.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/ProjectSection.tsx`
- `src/components/ProjectModel.tsx`
- `src/components/ProjectPreview.tsx`
- `src/components/ProjectsAudioVisualizer.tsx`
- `src/content/projects/*.mdx`
- `src/app/sites/[site]/page.tsx`
- Existing Dreamlife, LifeInbox, and Sudoku Together subdomains.

The current project experience already uses 3D models, scroll snapping, expanded detail overlays, and project MDX. The new system should replace monolithic project behavior gradually.

## Target Architecture

Separate shared exhibit orchestration from project-specific experiences.

Suggested structure:

```text
src/components/museum/
  MuseumShell.tsx
  Exhibit.tsx
  ExhibitSignal.tsx
  ExhibitIdentity.tsx
  ExhibitExperience.tsx
  ExplodedCaseStudy.tsx
  EvidenceLayer.tsx
  ExhibitTransition.tsx
src/experiences/
  registry.ts
  dreamlife/
  lifeinbox/
  sudoku-together/
src/lib/museum/
  types.ts
  registry.ts
  state.ts
```

The exhibit registry should map stable project IDs to:

- Model and visual assets.
- Supported depth stages.
- Product experience loader.
- Exploded-layer descriptors.
- Evidence and living-state source IDs.
- AI destination IDs.
- Discovery conditions and easter eggs.

## Shared Exhibit Contract

```ts
interface ProjectExhibitDefinition {
  projectId: string;
  destinationId: string;
  visualKey: string;
  stages: DepthStage[];
  experienceId?: string;
  layerIds: string[];
  evidenceNodeIds: string[];
  relatedNodeIds: string[];
  hiddenDiscoveryIds: string[];
}
```

Shared orchestration handles depth, persistence, tour hints, AI context, loading, and transitions. Project modules control the product-specific interaction and art direction.

## Museum Entry And Navigation

### Overview

- Preserve a fast project overview for direct visitors.
- Treat `/projects` as the museum lobby rather than the canonical full home of each flagship.
- Replace generic card-only browsing with exhibits that signal depth.
- Keep stable anchors and direct links for every project.
- Allow AI cards and the guided tour to open a project at a safe requested stage.
- Add `/projects/[slug]` as the planned stable direct-entry family; flagship entries transition or redirect to canonical project subdomains, while smaller projects may render in the museum shell.

### Depth Behavior

#### Signal

- Silhouette, model, motion, or sound.
- No heavy project bundle loaded yet.

#### Approach

- Name, problem, lifecycle, one-line significance.
- Preload the next stage after intent is clear.

#### Handle

- Project-specific manipulation begins.
- The exhibit teaches its interaction with minimal hints.

#### Enter

- Focused product demonstration.
- Scene or layout can become immersive.

#### Understand

- Exploded architecture, evidence, relationships, and living or final state.

## Flagship Selection Spike

Before building the reusable framework, create feasibility spikes for LifeInbox and Sudoku Together.

### LifeInbox Spike

Validate:

- Synthetic capture interaction.
- Animated local/server/enrichment pipeline.
- Layered phone and system reveal.
- Performance cost of combined 3D and UI.

### Sudoku Together Spike

Validate:

- Minimal playable grid.
- Deterministic valid computer moves.
- Presence timing.
- Transition from board to architecture beneath it.

Choose the first full vertical slice based on clarity, asset readiness, and implementation risk, not project prestige alone.

## Dreamlife Experience Plan

### Product Truth To Demonstrate

Reflection becomes several possible futures, and reactions to those futures become smaller experiments.

### Minimal Experience

1. Visitor selects one authored life tension.
2. Current, Fallback, and Wild Card paths unfold.
3. Visitor marks one element as resonant, wrong, or uncertain.
4. A scripted refinement turns that reaction into a small experiment.
5. The experience offers a deeper system reveal.

### Exploded Layers

- User tension and onboarding context.
- Three-path scenario generation.
- Highlight and reaction model.
- Explore and daily reflection input.
- Refine and conversational prototyping.
- Accepted changes returning to Vision.
- Product outcome and six-figure offer context.

### Constraints

- Use authored scenarios initially.
- Clearly identify illustrative product behavior.
- Do not imply the full mobile app is running in-browser.
- Keep the offer story accurate and not sensationalized.

## LifeInbox Experience Plan

### Product Truth To Demonstrate

A messy capture can become useful without sacrificing immediate local reliability or trust.

### Minimal Experience

1. Visitor enters or chooses a synthetic capture.
2. Entry appears locally immediately.
3. Structured kinds and privacy behavior appear.
4. Sync and enrichment progress through visible layers.
5. The entry resurfaces as a task, reminder, shopping item, journal item, person, or project connection.
6. Visitor opens the entry autopsy.

### Recommended First Scenario

`Remind me to make a drink in 10 minutes.`

### Exploded Layers

- React Native Android surface.
- SQLite local row.
- Privacy precheck.
- Dirty-flag sync.
- Fastify request handling.
- PostgreSQL record.
- AI enrichment and parsing.
- Reminder bridge and recovery.
- Due polling.
- Alarm category and runtime vibration.
- Timestamp and expiry safeguards.

### Constraints

- All data must be synthetic.
- Do not connect the demo to the production VPS.
- Differentiate documented current behavior from planned behavior.
- Keep technical detail understandable through progressive disclosure.

## Sudoku Together Experience Plan

### Product Truth To Demonstrate

The visitor and another participant can contribute to the same Sudoku board inside the product's Discord-inspired interaction model.

### Minimal Experience

1. Start a small deterministic puzzle.
2. A participant labeled `Computer` joins.
3. Visitor places numbers and optional pencil marks.
4. Computer periodically fills a valid cell.
5. Presence and update feedback make shared contribution visible.
6. A compact completion or progression moment appears.

### Computer Behavior

- Use a deterministic schedule or seeded strategy.
- Never enter invalid values.
- Pause while the visitor is actively editing.
- Expose a clear reset.
- Avoid pretending the computer is a human or remote user.

### Exploded Layers

- Discord Activity context.
- Embedded App SDK and identity boundary.
- React game state.
- Shared-session state.
- CSP-safe Vercel proxy route.
- Supabase persistence.
- Version-checked polling.
- Daily puzzle and progression systems.

### Constraints

- The portfolio demo can run locally without live Supabase.
- Label simulation clearly.
- Preserve the real architecture explanation separately from simulated demo internals.

## Smaller Project Strategy

Classify non-flagship projects into:

- `standard`: Signal, Approach, Handle, Understand.
- `archive`: Signal, Approach, final retrospective.
- `related`: appears mainly through graph relationships and grouped exhibits.

Do not build bespoke product demos for every project.

## Exploded Case Study Framework

Each layer definition should include:

```ts
interface CaseStudyLayer {
  id: string;
  question: string;
  title: string;
  summary: string;
  graphNodeIds: string[];
  visualKey: string;
  evidenceNodeIds: string[];
  revealAfter?: string[];
}
```

The visual implementation can differ per project. Shared code manages ordering, selected layer, AI context, evidence links, and persistence.

## Direct Routes And Subdomains

- Maintain direct project anchors on `/projects`.
- Preserve current anchors as compatibility inputs while canonical destinations move toward `/projects/[slug]`.
- Preserve project subdomains as canonical flagship project worlds and deep product destinations.
- Museum Signal and Approach remain on `/projects`; lightweight Handle may begin there; substantial Enter and Understand normally transition to the project subdomain.
- Allow in-place flagship Enter only when a bounded prototype proves the cross-subdomain transition materially harms the experience.
- Start each subdomain with one coherent project shell. Add `/experience/[id]` or a case-study route only when the state deserves independent loading, sharing, history, or search value.
- Keep `/blog` and `/blog/[slug]` canonical on each project subdomain.
- Ensure every subdomain can return to its exact museum exhibit and preserve a validated return destination.
- Use canonical metadata to avoid duplicate search indexing if the same content appears in multiple routes.
- AI destinations must support both main-domain and subdomain contexts.

## Asset Plan

For each flagship:

- Inventory current 3D models, screenshots, icons, and copy.
- List missing interaction assets.
- Define low-cost placeholder assets for logic prototypes.
- Replace placeholders only after interaction proves itself.
- Produce static poster frames for loading and lower stimulation.

## Testing

### Logic

- Exhibit registry validation.
- Allowed depth transitions.
- Deterministic Dreamlife scenario state.
- LifeInbox pipeline state machine.
- Sudoku board validity and computer moves.
- Case-study layer dependencies.

### Integration

- Direct link into each exhibit.
- AI card opens requested stage.
- Tour opens project without exposing hidden material.
- Refresh and return restore safe state.
- Subdomain navigation preserves intended destination.

### Visual And Interaction

- Desktop pointer and keyboard.
- Loading on cold cache.
- Lower stimulation.
- Model or asset failure.
- Long text and narrow viewport stress tests.

## Risks

- A generic framework can flatten project identity.
- Building all flagship experiences in parallel will create inconsistent unfinished systems.
- 3D asset ambition can block product logic.
- Simulated demos can be mistaken for live systems.
- The museum can become slower than the current project page.

## Cross-Plan Handoff

After the first flagship vertical slice, the program may assume:

- Exhibit registration and lazy loading are stable.
- Shared depth orchestration works with one truly project-specific interaction.
- Product behavior can transition into exploded system and evidence layers.
- AI, graph, living state, persistence, and direct destinations function together.
- The quality gate has produced reusable performance and creative-review evidence.

Only after that handoff should the remaining flagship experiences proceed in parallel or sequence.

## Completion Criteria

- One flagship validates all five depth stages first.
- Three flagships later communicate product behavior through experience.
- Exploded layers connect behavior to architecture and evidence.
- Smaller projects remain coherent without bespoke complexity.
- Direct links, subdomains, tour, AI cards, persistence, and calm behavior all work.
