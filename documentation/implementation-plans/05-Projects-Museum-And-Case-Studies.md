# Projects Museum And Case Studies Plan

Last updated: 2026-07-19

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `PRJ` |
| Status | Active; `PRJ-01` complete, `PRJ-02` ready |
| Upstream | [Architecture](00-System-Architecture-And-Interfaces.md), [Experience](02-Experience-Foundation.md), [Graph](03-Knowledge-Graph-And-Content.md), [AI](04-Global-AI-And-Talking-Archive.md), [Living State](07-Living-Project-State.md) |
| Downstream | Main projects route, project subdomains, guided tour, skill evidence |
| Primary outputs | Museum registry, first vertical slice, three flagship experiences, smaller-project tiers |
| Execution packages | `PRJ-01` through `PRJ-08` in [Work Packages](13-Execution-Work-Packages.md) |
| Capability tracking | `CAP-PRJ-*`, `CAP-LIB-*`, `CAP-SDK-*`, and `CAP-DRM-*` in [Capability Ledger](15-Capability-Coverage-Ledger.md) |

## Scope

Transform the existing project page and project subdomains into an inspectable museum of systems with increasing depth, focused product demonstrations, and project-specific exploded case studies.

Art-direction correction: the 2026-07-18 live audit found that the accepted functional shell is too dependent on a uniform rounded-card grid and that the first LifeInbox depth layer reads like a conventional dark application panel. These are working implementation foundations, not the final aesthetic target. All Phase 4 visual work follows `18-Art-Direction-And-Aesthetic-Quality.md`.

Production review correction: the first remediation improved silhouettes and removed the most obvious card-grid treatment but still failed to visibly realize most of Mark's supplied reference qualities. Museum, LifeInbox, Dreamlife, Sudoku Together, and historical-project visual work now follows the explicit route assignments, material studies, original-asset strategy, scene stack, and keyframe-first gates in `2026-07-18-Visual-Reference-Coverage-And-Route-Art-Direction.md`. Existing product behavior and content truth remain valid baselines, not accepted final art direction.

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
- `src/lib/museum/types.ts`
- `src/lib/museum/registry.ts`
- `src/lib/museum/experienceLoaders.ts`
- `src/lib/museum/loadExhibits.ts`
- `src/components/museum/ExhibitFallback.tsx`
- `src/components/museum/MuseumFallbackShell.tsx`

The current project experience already uses 3D models, scroll snapping, expanded detail overlays, and project MDX. The new system should replace monolithic project behavior gradually.

`PRJ-01` is complete at `e462080`. All nine project records now derive one canonical exhibit definition; three flagship manifests lazy-load behind runtime validation; graph or module failures preserve semantic copy and links. Deployment `dpl_9DeyQkjizoRc91163TcF6TuumEbL` is Ready, but the new shell remains dormant and the visible route still uses `ProjectsClient`.

## Target Architecture

Separate shared exhibit orchestration from project-specific experiences. Preserve the implemented boundary and add visitor behavior around it rather than moving the same concepts into a second registry.

Implemented and planned structure:

```text
src/components/museum/
  ExhibitFallback.tsx              # implemented semantic fallback
  MuseumFallbackShell.tsx          # implemented server-safe shell
  MuseumShell.tsx                  # PRJ-03 visitor orchestration
  ExhibitSignal.tsx                # PRJ-03
  ExhibitApproach.tsx              # PRJ-03
  ExhibitExperienceBoundary.tsx    # PRJ-04 loading/error boundary
  ExplodedCaseStudy.tsx            # PRJ-04
src/lib/museum/
  types.ts                          # implemented serializable contracts
  registry.ts                       # implemented canonical derivation/validation
  experienceLoaders.ts              # implemented lazy manifest registry
  loadExhibits.ts                   # implemented graph-backed server adapter
  experiences/                      # implemented lightweight manifests
  state.ts                          # add only after PRJ-02 proves runtime state needs
  transitions.ts                    # add with PRJ-03/PRJ-04 destination integration
```

The exhibit registry maps stable project IDs to:

- Model and visual assets.
- Supported depth stages.
- Optional product experience ID and lazy manifest loader.
- Exploded-layer descriptors.
- Evidence and living-state source IDs.
- Museum and canonical project destination IDs.
- Discovery conditions and easter eggs.

## Shared Exhibit Contract

```ts
interface ProjectExhibitDefinition {
  projectId: ProjectNodeId;
  slug: string;
  destinationId: DestinationId;
  projectDestinationId: DestinationId;
  visual: ExhibitVisualDescriptor;
  supportedStages: readonly DepthStage[];
  experienceId?: ExperienceId;
  layerIds: readonly string[];
  evidenceNodeIds: readonly NodeId[];
  relatedNodeIds: readonly NodeId[];
  hiddenDiscoveryIds: readonly DiscoveryId[];
}
```

Shared orchestration handles depth, persistence, tour hints, AI context, loading, and transitions. Project modules control the product-specific interaction and art direction.

`supportedStages` is present-tense capability, not aspiration. Current exhibits and manifests advertise only Signal and Approach. A selected flagship may add Handle, Enter, or Understand only in the package that implements and tests that stage.

## Museum Entry And Navigation

### Overview

- Preserve a fast project overview for direct visitors.
- Treat `/projects` as the museum lobby rather than the canonical full home of each flagship.
- Replace generic card-only browsing with exhibits that signal depth.
- Give each project or coherent historical cluster a distinct silhouette and material/behavior signal; accent color and title are insufficient identity.
- Let project relationships affect composition, sight lines, or neighboring signals rather than adding equal decorative glow to every card.
- Consolidate tour, AI, sound, and navigation furniture into a clear utility hierarchy that does not compete with exhibits.
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

## Legacy-To-Museum Migration

`PRJ-03` is an adapter migration, not a rewrite of every project surface.

1. The server route loads `loadMuseumExhibits()` and passes serializable views to the new shell.
2. `museumV2` chooses the new path; the current `ProjectsClient` remains the rollback path.
3. Both paths preserve the nine exact existing anchors and canonical destination IDs.
4. Signal renders without loading a project interaction module or every 3D model.
5. Approach uses authored identity plus reviewed selected-project state when available.
6. A registry, graph, model, or project-module failure renders `ExhibitFallback` rather than an empty scene.
7. Browser Back and direct-entry behavior remain unchanged until the new path explicitly owns them.

`museumV2` and `lifeinboxExperience` are enabled in Development, Preview, and Production after `QA-02` and the executed 2026-07-18 release decision. Either flag can independently restore Approach-only or the complete legacy Projects path.

## Flagship Selection Spike

Before building a full interactive runtime, create equal feasibility spikes for LifeInbox and Sudoku Together. Each spike is an isolated local state machine rendered through the same lightweight harness; neither may call a private backend, require authentication, or claim to be the full product.

### LifeInbox Spike

Validate:

- One authored synthetic capture enters a local inbox immediately.
- A deterministic action transforms it into one structured destination without calling AI.
- The UI distinguishes immediate local trust from illustrative later sync/enrichment.
- Reset returns the exact initial fixture and a module failure returns the authored exhibit fallback.

### Sudoku Together Spike

Validate:

- One fixed 9x9 puzzle accepts a legal visitor move and rejects an illegal move.
- A participant labeled `Computer` makes one deterministic legal move only after visitor input settles.
- The reducer never pretends that the computer is remote or human.
- Reset returns the exact puzzle fixture and a module failure returns the authored exhibit fallback.

### Equal Decision Rubric

Record evidence under the same headings without percentages or aggregate scores:

| Criterion | Question | Required evidence |
| --- | --- | --- |
| Visitor value | Does one interaction communicate the product faster than a paragraph? | Observed interaction path and resulting product understanding |
| Product truth | Is the spike representative without implying unavailable live behavior? | Source-to-spike mapping and explicit simulation boundary |
| Depth potential | Can the interaction lead naturally to one architecture/evidence reveal? | Named Handle-to-Understand bridge |
| Asset readiness | Are copy, visual assets, and source facts sufficient for a coherent slice? | Ready assets and named missing assets |
| Implementation risk | Can deterministic logic, fallback, and performance be bounded? | Test result, loading boundary, and largest unknown |
| Reuse learning | Will the slice teach a shared museum primitive without flattening project identity? | One likely reusable lesson and one project-specific boundary |

Rate each criterion `strong`, `acceptable`, or `weak` with a sentence of evidence. Select the first slice through a written tradeoff decision, not a numeric winner. If both are weak on product truth or visitor value, revise the spike scope instead of forcing a selection.

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

## First Slice Convergence Contract

`PRJ-04` starts only when `PRJ-02`, `PRJ-03`, `LPS-06`, and `AI-04` have accepted their inputs. It combines exactly one selected project into a complete journey:

| Boundary | Minimum accepted behavior |
| --- | --- |
| Signal | Lightweight identity is visible without the interaction bundle |
| Approach | Problem, significance, and reviewed lifecycle/current or final state are accurate |
| Handle | The selected deterministic interaction teaches itself with bounded hints |
| Enter | A meaningful focused state opens, normally on the canonical project subdomain |
| Understand | One behavior connects to one system layer, one evidence source, and the reviewed state record |
| AI | One validated archive card opens an exact selected-project destination and safe state |
| Persistence | Shared semantic depth/checkpoint persists; transient demo edits remain local |
| Failure | Graph, AI, model, and project-module failures retain identity, evidence links, and navigation |
| Calm path | Sound-off, reduced motion, keyboard, and lower stimulation preserve understanding |

Do not add a second product scenario, full project feature parity, generalized all-project routing, multiple exploded layers, or project-specific easter eggs before this journey passes `QA-02`.

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

Responsibility split:

- `PRJ-04` proves one selected museum-to-canonical-subdomain transition and exact return using existing destinations.
- `PRJ-08` implements the generalized `/projects/[slug]` family, all-project canonical metadata, compatibility redirects, reusable history rules, and cross-origin handoff validation.
- Existing `/projects#slug` URLs remain compatibility inputs until `PRJ-08` Preview evidence accepts redirects and browser Back behavior.

## Asset Plan

For each flagship:

- Inventory current 3D models, screenshots, icons, and copy.
- List missing interaction assets.
- Define low-cost placeholder assets for logic prototypes.
- Replace placeholders only after interaction proves itself.
- Produce static poster frames for loading and lower stimulation.
- Produce Signal, Approach, and one deepest-state keyframe before production styling for each flagship.
- Preserve at least one rejected composition and the written reason it failed the art-direction diagnostics.
- Extend accepted keyframes into route-specific layer material packs: stable matte, transparent depth/focal plates, masks or maps, vector traces, optional particle sprites, and one flattened checksum/fallback.
- Record every layer's role, provenance, intended renderer, driver, calm behavior, and performance tier before runtime integration.
- Do not mechanically cut a flattened image into parallax strips; independently addressable materials need compositional or semantic jobs.
- Create a source-region atlas before generation or extraction: identify structural anchors, organic matter, atmosphere, flow fields, mechanisms, illumination zones, and foreground/background occluders.
- Produce transparent plates, clean background fills, alpha masks, depth maps, flow maps, displacement maps, emission maps, and occlusion masks only where the material behavior needs them.
- Review generated transparent assets at full scale for edge halos, baked shadows, incompatible perspective, repeated texture, false translucency, and loop seams before integration.
- Maintain a motion coverage ledger for every dominant region. Record whether it moves directly or participates through changing atmosphere, light, reflection, shadow, or occlusion; record the temporal band, stimulation behavior, fallback, and remaining dead zone.

## Aesthetic Acceptance

Project modules own an art-direction thesis, focal artifact, material dialect, one dominant gesture, and depth-specific visual transformation. Shared orchestration must not impose a universal card, panel, pill, heading, or animation treatment.

The required aesthetic art packet is defined in `19-Aesthetic-System-Integration-And-Delivery.md`. It binds the scene to real project truth, reviewed graph/state inputs, utility placement, calm/fallback behavior, and a performance envelope. A keyframe without those links is reference material, not an accepted implementation input.

Package ownership is explicit:

- `ART-01` selects the Museum and LifeInbox packets.
- `ART-02` supplies only the proven shared runtime roles.
- `ART-03` implements Museum/LifeInbox remediation and renews `QA-02` creative acceptance.
- `ART-04` supplies Dreamlife, Sudoku Together, and archive packets.
- `PRJ-05` through `PRJ-07` own product behavior and production implementation from those packets.
- `ART-07` proves the dynamic-scene contract and first Museum layered response.
- `ART-08` through `ART-10` add route-owned dynamic compositions without reopening accepted product behavior or copying the Museum renderer.
- `ART-11` owns cross-route dynamic maturity, performance, fallback, and creative acceptance.
- `ART-12` corrects the matte-first model by defining the ambient participation contract, decomposed-asset pipeline, coordinated scene clock, and Museum proof.
- `ART-13` builds LifeInbox, Dreamlife, and Sudoku ambient worlds sequentially from route-specific material packs and repeats the route-local map/brief/produce/approve/compositor/integrate/accept gate.
- `ART-14` gives Home, About, AI, and reading their own restrained ambient systems without copying flagship density.
- `ART-15` closes dead zones, temporal synchronization, material credibility, performance, and production acceptance across the portfolio.

Each dynamic route receives the packet extension defined in `20-Dynamic-Scene-Composition-And-Layered-Materials.md`: still checksum, layer inventory, driver matrix, dominant gesture, choreography, renderer decision, semantic adapters, calm/failure matrices, budget, tests, and resume state. Exact implementations are planned one route at a time.

Each route also receives the ambient extension in `2026-07-20-Pervasive-Ambient-Worlds-Implementation-Plan.md`: source-region atlas, motion coverage ledger, decomposed asset contact sheet, temporal-band map, idle-life capture, dead-zone findings, and one exact next material increment. Interaction completeness does not imply ambient-world completeness.

Before implementation expands, review each flagship against:

- The silhouette, swap, crop, darkness, stillness, deepening, and furniture tests in `18-Art-Direction-And-Aesthetic-Quality.md`.
- One calm keyframe and one standard-stimulation keyframe using real content.
- One visual explanation of how Handle becomes Enter and Understand rather than merely appending sections.
- One explicit list of generic patterns rejected for that project.
- Loading, error, empty, semantic fallback, AI-door, tour, and return-state placement inside the same visual hierarchy.

Creative acceptance requires Mark's review. Passing interaction and route tests cannot substitute for authored visual identity.

## Testing

### Logic

- Exhibit registry validation.
- Allowed depth transitions.
- Deterministic Dreamlife scenario state.
- LifeInbox pipeline state machine.
- Sudoku board validity and computer moves.
- Case-study layer dependencies.
- Manifest stage claims cannot exceed implemented exhibit stages.
- Candidate reducers are deterministic and reset to exact fixtures.
- Route scene reducers map bounded drivers to deterministic material state.
- Reduced-motion, visibility, context-loss, and renderer-failure policies settle to known states.

### Integration

- Direct link into each exhibit.
- AI card opens requested stage.
- Tour opens project without exposing hidden material.
- Refresh and return restore safe state.
- Subdomain navigation preserves intended destination.
- `museumV2` off preserves the legacy route; Development-on uses server exhibit views.
- Unknown, malformed, or unsupported requested depth returns to a safe registered state.

### Visual And Interaction

- Desktop pointer and keyboard.
- Selected and rejected keyframes at stable frames.
- Project silhouette with names and accent colors suppressed.
- Swap test proving the composition is not interchangeable with another flagship.
- Utility-control hierarchy without floating-widget competition.
- Loading on cold cache.
- Lower stimulation.
- Model or asset failure.
- Long text and narrow viewport stress tests.
- Independently addressable layer response rather than whole-poster drift.
- Pointer/focus, project selection, one reviewed relationship, settlement, hidden-tab pause, and stable-frame capture for the Museum proof.
- Ten-to-thirty-second idle-life capture with no pointer input.
- Dead-zone inspection across the complete one-viewport Museum field.
- Material-credibility review for coral sway, gaseous advection, directional flow, mechanical pivots, and changing architectural illumination/occlusion where present.
- Temporal-independence review proving that unrelated materials do not breathe in one synchronized loop.
- Foreground/background passage review proving that depth is produced by more than scale and parallax.

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

Only after the representative remediation and renewed creative gate should the remaining flagship experiences proceed, one active code package at a time.

## Completion Criteria

- One flagship validates all five depth stages first.
- Three flagships later communicate product behavior through experience.
- Exploded layers connect behavior to architecture and evidence.
- Smaller projects remain coherent without bespoke complexity.
- Direct links, subdomains, tour, AI cards, persistence, and calm behavior all work.
