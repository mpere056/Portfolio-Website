# Home Practice Worlds And Transitions

Last updated: 2026-07-31

## Metadata

| Field | Value |
| --- | --- |
| Plan ID | `HOME-PRACTICE-WORLDS` |
| Status | Active companion to Plan `22`; architecture accepted for planning, visual packets not yet reviewed |
| Parent plan | [Piano Clearing Home World](22-Piano-Clearing-Home-World.md) |
| Work item | [WI-ART-16-01](../implementation-work/active/WI-ART-16-01.md) |
| Packages | `EXP-08`, `ART-16`, `PRJ-09`, `QA-07` |
| Capabilities | `CAP-ART-018`, `CAP-ART-019`, `CAP-PRJ-009` |
| Current release | `5313e93` accepted visual baseline; `b0018cb` verified transition foundation |
| Exact next gate | Produce and review one Music preview packet; no selected world yet |

## Purpose

Define how the accepted `Dusk Refrain` clearing becomes three cohesive 3D practice worlds without returning to the rejected full-proof compositor. This plan owns:

- the neutral, preview, selected, and retreat state grammar;
- the permanent clearing substrate shared by all worlds;
- the visual and behavioral brief for each practice;
- the boundary between reusable proof knowledge and rejected proof composition;
- runtime mounting, performance, calm, failure, routing, and return behavior;
- the handoff from environmental selection to project reveal.

It does not select final assets, approve final visual packets, replace `/projects`, or prescribe every route-specific shader before a bounded proof exists.

## Core Decision

The Home is one place with three latent interpretations. It is not four complete scenes crossfaded together, and it is not a neutral scene covered by a full-screen illustration.

The following remain spatially stable through neutral, preview, selection, and retreat:

- camera family and bounded pointer travel;
- foreground plateau, ravine silhouette, river corridor, opposite rise, and horizon depth;
- piano coordinate and pianist/About anchor;
- three practice-instrument coordinates and semantic controls;
- one scene clock, one renderer, one attention owner, and one navigation owner.

The following may transform by practice:

- terrain and grass material response;
- river behavior and reflected signal;
- sky, fog, light transport, and atmospheric particles;
- practice-specific vegetation, mechanisms, architecture, and distant landmarks;
- piano particle behavior without making the piano unrecognizable;
- project landmarks after `PRJ-09` begins.

This continuity makes selection feel like the same valley revealing another reality. It also avoids paying for three hidden open worlds.

## Meaning Of Open World

`Open world` here means a convincing continuous exterior environment with depth, distant life, multiple landmarks, and no visible stage boundary. It does not mean free walking, procedural terrain streaming, physics, a controllable avatar, or an unlimited map.

The camera remains authored. The world must suggest that it continues beyond the frame while rendering only the bounded portion needed by the Home composition.

## Interaction State Model

| State | Entry | Visual authority | Runtime rule | Exit |
| --- | --- | --- | --- | --- |
| neutral | no attention target | `Dusk Refrain` clearing owns the frame | no practice runtime mounted | proximity, focus, selection, or restored URL |
| approach | pointer enters a practice influence field | one distant signal and local atmospheric response | metadata and minimal shader uniforms only | move away or continue toward preview |
| preview | direct hover, keyboard focus, or sustained proximity | one practice influences the clearing locally and translucently | only the dominant practice preview may run | move away, blur, Escape, or select |
| selected | click, Enter, touch confirmation, tour action, or restored URL | one practice becomes the primary environment | one selected practice runtime; inactive worlds unmounted | Back, Escape, return control, or another explicit selection |
| retreat | selected world exits | transformed layers dissolve in causal reverse order | outgoing world remains mounted only through the bounded retreat | neutral or next selected world |

### Attention Rules

- Practice influence is continuous, but world ownership is singular.
- Proximity may begin a preview before direct hover, but must not make the page flash while crossing empty space.
- Hovering one instrument cannot awaken all practices.
- Keyboard focus receives the same authored preview as pointer hover.
- Touch performs an explicit first-tap preview and second-tap selection, or an equivalent accessible confirmation pattern selected during implementation.
- Held or selected state outranks pointer proximity.
- Hysteresis prevents rapid dominant-practice switching near influence boundaries.
- Reduced motion preserves semantic state changes while replacing travel and material motion with short opacity, light, or color transitions.

## Spatial Melding Grammar

Preview is not a uniform opacity layer. It enters in authored spatial order:

1. **Signal:** the practice instrument emits a local change.
2. **Contact:** nearby grass, particles, light, or air responds.
3. **Path:** the response travels through terrain, river, sky, or an authored connection.
4. **Horizon:** one distant landmark or atmospheric consequence appears.
5. **Selection:** only an explicit selection allows the practice to reorganize the full scene.

Retreat reverses semantic consequences rather than merely playing the same animation backward. Project landmarks close first, then architecture and ecology settle, then paths dim, then local contact disappears.

## Renderer And Lifecycle Architecture

### Shared Runtime

One `Canvas` retains ownership. The clearing exposes stable adapters for:

- practice attention and selection;
- shared time and stimulation state;
- terrain/world coordinates;
- piano, river, horizon, and instrument anchors;
- shared fog, light, camera, and adaptive DPR;
- practice-layer mount, warm-up, settle, retreat, and disposal.

### Practice World Contract

Each world module must define:

| Contract field | Purpose |
| --- | --- |
| `id` | controlled `PracticeId` |
| `previewLayers` | bounded local response available before selection |
| `selectedLayers` | architecture, ecology, atmosphere, and project-landmark host |
| `anchors` | stable clearing coordinates the practice interprets |
| `paletteTransform` | material/light transformation that preserves depth and legibility |
| `motionJobs` | independent ambient responsibilities and temporal bands |
| `attentionAdapters` | local cursor/focus response without global synchronized motion |
| `calmState` | lower-stimulation and reduced-motion behavior |
| `fallback` | static or low-cost authored checksum that preserves meaning |
| `budget` | draw calls, instances, textures, shader cost, and continuous schedulers |
| `projectHost` | positions and reveal grammar reserved for `PRJ-09` |

### Mount Policy

- Neutral mounts no practice world.
- Approach may preload the dominant world's code and essential compressed assets after intent is stable.
- Preview mounts one lightweight world subset.
- Selected upgrades that same module rather than destroying preview and mounting an unrelated scene.
- Inactive worlds are unmounted and GPU resources disposed after retreat.
- The next likely world may be prefetched only when the current frame budget is healthy and the browser is idle.
- Context loss, asset failure, or low capability returns to the neutral clearing or the world's fallback without trapping navigation.

### Performance Boundary

The existing 260,000-blade clearing remains the baseline, so practice worlds must transform shared materials before adding geometry. The first implementation attempt for any effect should prefer, in order:

1. modifying an existing shared shader or instance attribute;
2. adding one instanced geometry family;
3. adding one bounded particle or line system;
4. loading compressed authored geometry;
5. adding another continuously rendered pass only when earlier methods cannot express the design.

No selected world may run three full-screen WebGL passes, mount another canvas, duplicate the grass field, or keep another selected world warm offscreen. Adaptive DPR remains available; geometry density is not silently reduced to hide an architectural regression.

## Historical Proof Reuse Boundary

| Proof | Retain | Do not reuse directly | Best destination |
| --- | --- | --- | --- |
| shared-home music | pearl piano particles, resonance timing, translucency relationships | its isolated proof-page composition | Music preview and selected piano behavior |
| archive core | unfolding information, page cadence, emergent structures, orbiting memory object | literal floating book as the entire Life world | Life project reveal, receiving structures, and knowledge growth |
| east observatory | procedural currents, rotating instruments, changing windows, nacre lattice, local hover energy | full observatory plate, old AI/Futures label, simultaneous current stack | Life infrastructure and distant mechanism language |
| coral ecology | independent organism motion, currents, local illumination, biological material response | dominant flat coral cutout and original proof framing | Play ecology, gathering structures, and communal signal behavior |

Old proof assets may enter a contact sheet or material experiment. They are not accepted production assets until perspective, lighting, depth, motion role, and performance are revalidated inside the clearing.

## Practice World Briefs

### Music & Performance: Resonant Meadow

**Thesis:** Performance changes the environment by transmitting felt structure through it.

**Permanent continuity:** The piano, pianist, foreground grass, river, bridge, valley, and open sky remain immediately recognizable.

**Preview sequence:**

- nearby piano particles become more coherent without simply becoming brighter;
- a restrained response travels through the closest grass in phrases rather than a circular cursor shockwave;
- river highlights repeat the phrase later, creating call and response;
- one distant acoustic form or light aperture becomes visible on the horizon.

**Selected world:**

- the meadow becomes an outdoor resonant landscape rather than a conventional concert stage;
- grass, river, clouds, and distant forms each carry a different musical timescale;
- translucent acoustic shells, suspended strings, or resonant apertures create depth without filling the view with notation;
- the pianist remains the emotional anchor and About entry;
- performances, arrangements, lessons, compositions, sound resources, and musical tools later occupy distinct landmarks.

**Avoid:** giant music notes, equalizer bars across the whole landscape, a nightclub palette, literal DAW chrome, or every object pulsing to one beat.

**Why first:** It changes the fewest structural assumptions, tests continuity around the accepted piano, and can validate the complete transition runtime before more geometrically ambitious worlds.

**Content gate:** The current project corpus contains no nodes classified under Music & Performance. Before `PRJ-09` adds Music landmarks, choose whether performances, arrangements, lessons, resources, and musical tools become first-class public content nodes or whether the practice initially opens a curated non-project depth surface.

### Life Systems & Tools: Living Systems Garden

**Thesis:** Useful systems receive complexity, make relationships visible, and return something dependable to everyday life.

**Permanent continuity:** The river becomes the primary receiving and routing metaphor; terrain terraces and distant mechanisms reinterpret the valley without turning it into a dashboard.

**Preview sequence:**

- a local receiving channel illuminates near the Life instrument;
- one signal enters the ground or river and separates into a small number of legible paths;
- a distant lens, archive aperture, or garden mechanism rotates into alignment;
- nearby grass and mist reveal connections, but no floating UI labels cover the landscape.

**Selected world:**

- cultivated terraces, translucent conduits, nacre mechanisms, lenses, receiving structures, and reflective gardens emerge from the terrain;
- information movement is expressed through flow, accumulation, refinement, and return;
- Dreamlife, LifeInbox, and Group Finder receive distinct landmarks grounded in their real product behavior;
- archive-core growth and observatory mechanics become supporting dialects inside one living workshop.

**Avoid:** generic futuristic city, enterprise dashboard, AI constellation, random pipes, file-folder metaphors, or treating all tools as one machine.

**Initial project landmarks:**

| Project | Environmental role |
| --- | --- |
| Dreamlife | reflective garden or horizon prism for life direction, experiments, and feedback loops |
| LifeInbox | receiving basin or capture structure where incoming streams become trusted local objects |
| Group Finder & Sudoku Solver | signal beacon that matches a need with a useful nearby connection |

### Play & Community: Lantern Ecology

**Thesis:** Play creates shared rules that let independent people affect one living world together.

**Permanent continuity:** The meadow remains spatially readable while its flora, gathering points, paths, and sky signals become more social and playful.

**Preview sequence:**

- one local organism, lantern, or game structure wakes near the Play instrument;
- a response travels to two or three independent neighbors with staggered timing;
- a distant communal landmark answers;
- the scene gains energy locally without recoloring the entire frame immediately.

**Selected world:**

- bioluminescent meadow organisms, coral-like gathering structures, game paths, shared lanterns, floating boards, and communal signal routes populate the valley;
- independent agents move on different clocks and occasionally affect shared structures;
- the atmosphere feels welcoming and surprising rather than alien or competitive;
- six current Play projects later receive landmarks with truthful historical/current lifecycle states.

**Avoid:** arcade iconography, a literal Discord UI, generic fantasy village, coral pasted onto grass, excessive saturated glow, or synchronized ambient motion.

**Initial landmark families:**

| Project family | Environmental role |
| --- | --- |
| Sudoku Together | collaborative grid pavilion with a visible non-human participant rhythm |
| Discord bots and messaging | signal gatherings, relays, and synchronized communal structures |
| Interactive Story Generator | world-seed portal that authors small changing scenes |
| Kitsune Karuta and CandyMod | historical play artifacts presented as quieter recovered structures |

## Project Reveal Handoff

Environmental selection and project reveal are separate gates.

Selected practice first establishes a coherent world with empty authored landmark positions. `PRJ-09` then populates those positions from validated graph queries. This prevents a category world from becoming a card grid and prevents project content from dictating an unreviewed environment.

Project reveal must:

- query by validated primary practice;
- distinguish current, evolving, complete, and archived projects through environmental behavior rather than status badges alone;
- preserve exact routes, subdomains, Back behavior, refresh, and return to the selected practice;
- expose keyboard and screen-reader equivalents for every diegetic landmark;
- keep cross-practice relationships secondary and explainable;
- fail closed to the selected world if project data is missing.

## Routing And Restoration

The preferred canonical selected-state family remains `/work/[practice]`, but the first implementation may use a validated query parameter while the visual and history behavior is still under review. Before public links are published, choose one canonical form and support compatibility redirects.

Required behavior:

- direct entry restores the selected practice without replaying a long neutral transition;
- browser Back retreats to the exact prior neutral or selected state;
- Escape retreats one semantic depth at a time;
- selecting another practice performs a bounded retreat before the next world takes ownership;
- refresh preserves selected practice and project depth when valid;
- an unknown practice fails to neutral Home;
- `/projects` remains available until every project and return path passes `PRJ-09` and `QA-07`.

## Implementation Sequence

| Step | State | Deliverable | Completion signal |
| --- | --- | --- | --- |
| `E0` Transition foundation | verified | practice-world contract, dominant-world lifecycle, semantic controls, URL draft, and diagnostic overlay behind development flag | 15 focused and 251 aggregate tests prove one owner, predictable retreat/disposal, no hidden runtimes, and unchanged neutral composition |
| `E1` Music preview packet | next | keyframe, layer inventory, motion jobs, contact/path/horizon preview, fallback, and budget | Mark accepts the local translucent influence before full selection work |
| `F1` Music selected world | not-started | complete Resonant Meadow selected state using the same preview module | continuity, Back/refresh, calm, failure, performance, and Mark review pass |
| `F2` Music content decision | waiting-for-feedback | first-class music content nodes or curated non-project depth decision | no empty or misleading project landmark surface |
| `G1` Life packet | not-started | Living Systems Garden preview and selected state | archive/observatory techniques feel native to the valley and three truthful landmark hosts exist |
| `G2` Play packet | not-started | Lantern Ecology preview and selected state | coral/ecology techniques feel native to the valley and project-family landmark hosts exist |
| `G3` Cross-world convergence | not-started | switching, disposal, palette continuity, stimulation, fallback, and sustained performance | one active runtime and no world leaks into another |
| `H1` Project reveal | blocked by accepted worlds | graph-driven native landmarks and exact project handoff | all projects reachable with lifecycle truth and exact return |
| `H2` About and global systems | blocked by transition foundation | pianist/About handoff, AI context, tour focus, discovery, and persistence | semantic context follows world/depth without visual clutter |
| `I` Release and migration | blocked by `H` | Preview, Production, rollback, and `/projects` migration decision | `QA-07` and explicit Mark acceptance |

## Tracking Matrix

Use named states only: `not-started`, `designing`, `prototype`, `in-review`, `revision-requested`, `accepted`, `implemented`, `verified`, `blocked`, or `superseded`.

| Surface | Neutral | Preview | Selected | Calm/failure | Performance | Creative review | Resume note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shared clearing | verified | n/a | n/a | implemented | verified | accepted-for-sequencing | preserve `5313e93` visual parity |
| Transition foundation | verified | verified controller | verified controller | verified disposal contract | verified zero added runtime | n/a | `b0018cb`; keep registry empty until an accepted packet has a module |
| Music | verified piano anchor | designing | not-started | not-started | budget pending | not-started | produce preview packet before implementing the bounded preview runtime |
| Life Systems | verified instrument anchor | not-started | not-started | not-started | not-started | not-started | reuse proof techniques only after Music validates runtime |
| Play & Community | verified instrument anchor | not-started | not-started | not-started | not-started | not-started | rebuild ecology as native 3D, not a coral plate |
| Project landmarks | compatibility routes only | n/a | blocked | not-started | not-started | not-started | resolve Music content model and accept three worlds first |

## Required Evidence Per Practice

Before a practice moves from `prototype` to `in-review`, record:

- one approved still keyframe and one short idle-life capture;
- layer inventory with renderer, driver, temporal band, and disposal owner;
- preview contact/path/horizon capture;
- selected-state capture from the same camera;
- neutral-to-preview, preview-to-selected, selected-to-retreat, and cross-practice recordings;
- reduced-motion, low-stimulation, asset-failure, and WebGL/context-loss behavior;
- draw calls, instances, texture memory estimate, DPR behavior, and sustained frame observation;
- keyboard, touch, direct-entry, Back, Escape, and refresh behavior;
- Mark review result and exact next revision.

## Testing Strategy

### Contract tests

- exactly three controlled world modules;
- no module can mount without becoming dominant;
- preview cannot report selected project depth;
- invalid world IDs return neutral state;
- selected and retreat transitions are deterministic.

### Runtime tests

- one canvas and one scheduler owner;
- inactive world resources dispose after retreat;
- hidden tabs and reduced motion stop nonessential animation;
- adaptive DPR and context recovery preserve semantic state;
- asset rejection falls back without losing controls.

### Browser tests

- pointer proximity, direct hover, keyboard focus, and touch confirmation;
- click/Enter selection, Escape retreat, Back, forward, refresh, and direct link;
- switch Music to Life to Play without stale layers;
- preserve selected practice through project entry and exact return;
- confirm all semantic controls work before WebGL finishes loading.

### Visual tests

- neutral remains visually identical when no practice is active;
- preview begins locally and reaches the horizon causally;
- selected world fills the composition without reading as a flat overlay;
- piano, landscape depth, and instrument coordinates remain recognizable;
- no old proof plate, generic card grid, or synchronized everything-at-once motion appears.

## Decisions Still Requiring Mark

These are feedback gates for `E1` and later work:

- final Music content model: project nodes versus curated music depth;
- first Music preview keyframe and dominant gesture;
- whether selected practice canonical URLs ship first as `/work/[practice]` or a temporary query-backed state;
- final visual packets for Life Systems and Play after the Music runtime proves the grammar;
- eventual `/projects` compatibility or redirect behavior after all project paths pass.

## Exact Resume Point

Checkpoint `E0` is verified at `b0018cb`. Do not build a complete practice world yet.

1. Preserve the empty production registry and exact neutral Home while preparing `E1`.
2. Create one Music preview keyframe showing local contact at the piano, a travelled response through grass/river, and one restrained horizon consequence.
3. Record the layer/motion inventory, ownership, renderer, fallback, reduced-motion behavior, and explicit performance budget.
4. Review that two-page-at-most packet with Mark and revise it before runtime work.
5. Only after acceptance, register one lazy Music module and implement preview behavior; do not implement the selected Resonant Meadow in the same checkpoint.
