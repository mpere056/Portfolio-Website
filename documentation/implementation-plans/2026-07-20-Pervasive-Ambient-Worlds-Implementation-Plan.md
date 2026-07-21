# Pervasive Ambient Worlds Implementation Plan

Date: 2026-07-20
Status: implementation in progress; `ART-12A-E` complete and isolated `ART-12F` in-review
Requirements: `V-31`, `V-32`, `V-33`
Packages: `ART-12` through `ART-15`
Capabilities: `CAP-ART-013` through `CAP-ART-016`

## Planning Correction

The current Phase 4 candidate responds to pointer and semantic state, but the dominant raster still behaves as a poster. Overlay particles and moving masks do not make a scene feel alive when the largest visible regions remain unchanged during idle observation.

The corrected target is **pervasive temporal participation**:

- every dominant visible material has an authored ambient behavior;
- structurally fixed objects may remain spatially anchored, but changing light, atmosphere, reflection, shadow, occlusion, or nearby matter must keep them temporally involved;
- movement belongs to the depicted material: coral bends, gas curls, streams flow, mechanisms turn, glass refracts, paper flexes, light migrates, and foreground matter traverses depth;
- ambient behavior exists before interaction, while pointer, focus, depth, graph, product, AI, and discovery state redirect or amplify it;
- no route is accepted because a static background has animated decoration placed above it.

This does not require every DOM element or word to move. Semantic text, controls, architecture, and stable evidence can remain spatial anchors. The **visual world around and across them** must remain alive.

## Four Concurrent Temporal Systems

Every major scene composes four systems at once:

| System | Purpose | Examples |
| --- | --- | --- |
| Ambient life | Prevent idle poster behavior | breathing light, coral sway, gas advection, rotating assemblies, flowing notation, drifting occluders |
| Visitor response | Make exploration causally legible | proximity bends a stream, focus aligns an aperture, drag changes flow direction |
| Semantic state | Express reviewed meaning | graph edge carries light, evolving project leaves an unsettled boundary, selected evidence clarifies one mechanism |
| Transition choreography | Recompose depth rather than append UI | layers separate, occlusion changes, scale rules shift, evidence emerges from the instrument |

Ambient life is mandatory for the dominant scene. The other systems remain route- and state-specific.

## Motion Coverage Ledger

Each route packet gains one row for every visually significant object or material region. Progress is tracked by named rows, never by a percentage.

| Field | Required record |
| --- | --- |
| Region ID and description | Stable local name such as `museum:coral-west` or `dreamlife:nacre-lens` |
| Depth band | far atmosphere, background anchor, midground system, focal object, foreground occluder, semantic overlay |
| Structural role | What must remain spatially stable and why |
| Temporal channels | Position, deformation, flow, rotation, light, reflection, shadow, density, opacity, refraction, or occlusion |
| Idle behavior | Material-specific autonomous behavior and its independent time scale |
| Visitor response | Pointer, focus, drag, scroll, or proximity modulation |
| Semantic response | Depth, graph, lifecycle, evidence, AI, discovery, or project-state modulation |
| Asset ingredients | Matte, transparent plate, mask, depth map, flow map, displacement map, normal map, vector path, sprite, or procedural field |
| Renderer and owner | CSS, SVG, Canvas, WebGL, 3D, and the route module that owns it |
| Calm behavior | Lower-stimulation, reduced-motion, hidden-tab, and stable-frame result |
| Verification | Idle-change capture, interaction proof, failure fallback, performance observation, and creative review |
| Current state | missing, asset-producing, material-ready, integrating, runtime-ready, verified, or accepted |

A dominant region with no temporal channel is a named gap. It cannot disappear inside an aggregate route status.

## Decomposed Asset Production Pipeline

Static source artwork remains valuable, but it becomes an anchor and fallback rather than the final visible output.

1. **Source audit:** identify focal objects, atmosphere, material families, depth bands, occlusion relationships, and regions that are already visually fused.
2. **Semantic segmentation:** create reviewed masks for architecture, coral/organic matter, clouds/gas/fog, streams, mechanisms, luminous interiors, ground, and foreground occluders.
3. **Transparent asset generation:** create missing foreground, midground, and atmospheric elements with transparent backgrounds when the source does not contain enough separable matter. Generated material must match the accepted palette, camera, lighting, and local detail without copying references.
4. **Alpha cleanup:** remove halos, repair edges, preserve premultiplied-alpha behavior, and inspect assets over black, white, and route backgrounds.
5. **Motion maps:** author flow, displacement, depth, occlusion, normal, roughness, emission, and caustic maps only for effects the runtime will actually use.
6. **Vector and sprite production:** create route-specific filaments, notation, stream paths, particle sprites, spores, droplets, sparks, fragments, or mechanical marks.
7. **Contact-sheet review:** inspect every plate independently and in the intended stack before runtime integration.
8. **Optimization:** export appropriate dimensions and formats, record color space and blend intent, and add production derivatives to the asset registry.
9. **Still checksum:** retain one flattened approved frame that exactly represents the composed fallback and capture state.

Do not mechanically cut the background into rectangular parallax strips. A layer exists because it has a material, depth, occlusion, or semantic responsibility.

### Production Asset Generation Gate

Transparent-background generation is neither the first design step nor a bulk pre-production activity. It begins only when all of the following are true for the active route or representative crop:

- the source-region atlas accounts for the composition and identifies fused or missing matter;
- the motion coverage ledger names the material behavior and depth/occlusion responsibility of the requested asset;
- an asset brief records preserve/extract/manual/procedural/generate choice, palette, camera, perspective, lighting, alpha edge, scale range, blend intent, required maps, performance budget, and fallback;
- the accepted still checksum establishes the target composition;
- the asset has an intended owner and integration hypothesis, without prematurely committing to a renderer.

Generate only the smallest representative batch needed to evaluate the material stack. Do not generate complete packs for Dreamlife, LifeInbox, Sudoku, Home, About, AI, or reading during the Museum proof. Later routes repeat the same gate from their own packets after the preceding route reaches its known-good checkpoint.

Generation is followed by alpha cleanup and contact-sheet review before compositor selection. An asset rejected in isolation or in stack does not enter the registry, renderer spike, or runtime. Compositor implementation must not become a way to conceal weak plate edges, baked shadows, mismatched lighting, perspective errors, or missing occlusion logic.

## Coordinated Scene Clock

Each active route owns one temporal coordinator. It supplies deterministic phase channels to CSS variables, SVG attributes, Canvas state, and shader uniforms without forcing those renderers to share a composition.

Suggested channels:

- `breath`: slow asymmetric expansion and light variation;
- `tide`: organic bending and return;
- `advection`: directional gas, fog, or liquid travel;
- `rotation`: independent mechanism cycles;
- `flow`: continuous travel along authored paths;
- `spark`: sparse bounded micro-events;
- `occlusion`: foreground traversal and shadow passage;
- `semantic`: validated state-controlled emphasis;
- `visitor`: pointer/focus modulation;
- `transition`: bounded depth choreography.

Routes choose their own periods, amplitudes, phase offsets, easing, and material mapping. Nothing persists frame values or clock phase. Hidden scenes pause; returning scenes reconstruct an intentional state without synchronized restart. Reduced motion removes continuous deformation and traversal while retaining immediate semantic changes and a materially complete still frame.

## Temporal Independence

The world must not pulse as one organism unless a specific transition intentionally synchronizes it.

- Far atmosphere evolves on the longest time scale.
- Background illumination and shadow move independently of atmosphere.
- Organic systems use several phase offsets so adjacent forms do not sway together.
- Mechanical parts use related ratios, not identical rotations.
- Streams maintain directional continuity rather than oscillating in place.
- Foreground matter crosses depth sparsely and at irregular intervals.
- Visitor response bends or redirects ongoing motion instead of replacing it with a separate hover animation.

## Route Decomposition Briefs

### Project Museum

The Museum is the first full proof because its current ecology contains the clearest static-matte problem.

- Architecture and large instruments remain anchored while local lights, apertures, reflections, and shadow bands move.
- Coral and fan-like organisms receive masked local deformation with separate roots and tips.
- Space gas and fog use slow advection and density change behind and between artifacts.
- Ribbon streams visibly transport energy and react to nearby project signals.
- Contraptions split into independently rotating, oscillating, and occasionally coupled assemblies.
- Foreground spores, fragments, and translucent organisms cross in front of and behind selected signals.
- Graph relationships join existing flows rather than appearing as a disconnected line overlay.
- Signal dialects gain material-specific idle behavior: vessel settling, prism refraction, lattice addressing, folio flex, caliper sweep, specter interference, echo propagation, coral sway, and archive illumination.

Recommended renderer: one WebGL compositor for masked deformation, atmosphere, lighting, and depth-aware plates; SVG for reviewed streams and graph traces; DOM for signals and semantics; optional Canvas only if WebGL cannot own the required particles without a second scheduler.

### Dreamlife

- The nacre world continuously refracts and recombines rather than moving one background plane.
- Separate liquid layers use independent flow fields and changing specular light.
- Translucent future fragments drift through focal depth and reassemble around validated choices.
- Background void, midground lens, foreground droplets, and editorial marks occupy different temporal bands.

### LifeInbox

- Matter continually arrives, classifies, settles, crosses trust boundaries, and returns.
- The vessel stays anchored while paper, amber light, ledger traces, intake atmosphere, and mechanical gates move independently.
- Ambient motion suggests readiness, not fake live activity; semantic capture events temporarily organize the existing flow.

### Sudoku Together

- The board remains spatially precise while constraint light, participant traces, addressed cells, synchronization waves, and surrounding diagram matter remain active.
- Background organism structures breathe subtly without bending the grid itself.
- Computer-participant timing creates authored contributions, never fake human presence.

### Home

- The principal instrument remains anchored while dust, reflected light, notation, strings/keys, surrounding architecture, and threshold darkness evolve.
- Returning state begins already alive rather than replaying the First Note.

### About

- The chronology remains readable while paper light, archival dust, memory halos, consequences, and semantic connections move at restrained independent rates.
- Inspection gathers ambient traces around the selected event rather than starting a generic overlay animation.

### AI And Reading

- The archive has a quiet dormant metabolism: subtle refraction, breathing illumination, and contextual material shift.
- Active AI concentrates movement around streaming, source arrival, and destination doors.
- Reading text remains still. The page environment participates through paper grain, marginal light, distant dust, restrained diagrams, and project-return disturbances without causing fatigue.

## Acceptance Diagnostics

### Idle-Life Test

Observe a scene without moving the pointer. Each dominant material region must reveal a material-appropriate change over its authored interval. Two time-separated captures plus a short recording document the change; decorative particles alone cannot pass the test.

### Dead-Zone Test

Temporarily hide semantic UI and micro-particles. Review the remaining scene by named region. Every dominant region must either change itself or be crossed by changing light, atmosphere, shadow, reflection, or occluding matter.

### Material-Credibility Test

Motion must preserve attachment and physical implication: coral roots remain planted, stream direction remains coherent, gears rotate around credible pivots, architecture does not wobble, and light responds to surfaces rather than sliding as an unrelated gradient.

### Temporal-Independence Test

At least three visible material systems use observably different temporal patterns. The scene fails if everything drifts, breathes, or pulses together.

### Foreground/Background Test

The scene contains authored temporal behavior on both sides of the focal object, producing real occlusion and depth rather than a flat overlay.

### Interaction-Continuity Test

Pointer, focus, depth, and semantic state modulate the ambient system already in progress. They do not stop one animation and launch an unrelated effect.

### Freeze Test

Freezing all motion leaves the accepted still checksum, legible semantics, and complete navigation. Reduced motion remains intentionally composed, not empty.

### Fatigue Test

Normal use over several minutes shows no synchronized looping, constant high-frequency motion, repeated foreground interruption, or competition with reading and controls.

### Performance Test

Record first useful frame, asset transfer, decoded texture memory, steady-state frame behavior, main-thread work, GPU/context behavior, hidden-tab suspension, and capability-tier fallback for every continuously rendered route.

## Execution Sequence

### `ART-12`: Ambient Contract, Asset Decomposition, And Museum Proof

Execution artifacts:

- `ART-12A`: [Museum Ambient Baseline](2026-07-20-Museum-Ambient-Baseline.md).
- `ART-12B`: [Museum Region Atlas And Motion Ledger](2026-07-20-Museum-Region-Atlas-And-Motion-Ledger.md).
- `ART-12C`: [Museum Ambient Asset Briefs](2026-07-20-Museum-Ambient-Asset-Briefs.md).

The first five gates are complete. Mark approved `1A, 2A, 3A`, accepted the bounded material family for testing, and requested a shader/procedural emphasis with the directional current generated in code. Mark rejected `ART-12F` revision 1 because its focal material still read as static, pointer responses synchronized, and the prior Museum's lighting language was lost. Revision 2 uses anchored focal motion, material-bound illumination, and distinct local response profiles; it still awaits approval before `ART-12G` touches the Museum.

#### `ART-12A`: Preserve The Baseline

- Reconcile the existing dynamic packet with pervasive temporal participation.
- Record the `fce50af` geometry, interactions, semantics, fallback, and performance behavior that must not regress.

#### `ART-12B`: Map The World

- Build and review the Museum source-region atlas, motion coverage ledger, depth bands, occlusion relationships, and material-specific temporal responsibilities.
- Name every dominant dead zone rather than hiding it in a route-level status.

#### `ART-12C`: Brief The Assets

- Decide per region whether to preserve, extract, manually author, procedurally render, or generate.
- Record palette, camera, lighting, alpha, scale, blend, maps, budget, fallback, and intended stack position before production.

#### `ART-12D`: Produce A Representative Material Stack

- Generate or extract transparent foreground, midground, and atmospheric plates only for one representative Museum ecology crop.
- Perform alpha cleanup and author only the masks, depth/flow/displacement/emission/occlusion maps, vectors, and sprites required by the approved behaviors.

#### `ART-12E`: Approve The Assets

- Review every asset independently over black, white, and route backgrounds and together in the intended stack.
- Record accepted and rejected variants with reasons; only accepted production derivatives enter the registry.

#### `ART-12F`: Select The Compositor

- Spike the smallest credible renderer arrangement using the approved stack.
- Compare CSS/SVG, Canvas, and WebGL needs against deformation, depth, occlusion, particles, memory, failure, and one-scheduler constraints before recording the route decision.

#### `ART-12G`: Integrate The Museum

- Implement one coordinated Museum clock with independent material bands and no dominant dead zone.
- Modulate ongoing ambient behavior through existing pointer, focus, project, graph, depth, and stimulation state.
- Preserve one-screen navigation, depth containment, semantic graph behavior, calm state, and fallback.

#### `ART-12H`: Accept And Release

- Pass idle-life, dead-zone, material, temporal-independence, foreground/background, interaction-continuity, freeze, fatigue, performance, capability, aggregate, and Production gates.
- Collect Mark's review before beginning production assets for the first flagship.

### `ART-13`: Flagship Ambient Worlds

- Author and implement LifeInbox, Dreamlife, and Sudoku separately, in that order.
- LifeInbox goes first because its mature product-state reducer and existing material transformation provide the safest proof that the Museum pipeline transfers to a canonical subdomain.
- Dreamlife follows to expand the proven system into liquid refraction and translucent recombination.
- Sudoku follows to prove that the approach also supports precise geometric and diagram-organism behavior without copying fluid motion.
- Repeat `Map -> Brief -> Produce -> Approve -> Select compositor -> Integrate -> Accept` for each route.
- Complete one route and its creative/performance gate before generating production assets for the next.
- Share the scene clock and lifecycle only where the Museum proof demonstrates a real common need.

### `ART-14`: Supporting Ambient Worlds

- Apply route-specific ambient systems to Home, About, AI, and reading, in that order; `ABT-01` reviewed consequence content is the gate before About production integration.
- Repeat the route-local mapping and asset gate. Do not reuse leftover flagship plates merely because they already exist.
- Keep semantics and reading spatially stable while their environments remain temporally alive.
- Treat mobile composition and musical identity as their existing later decisions.

### `ART-15`: Pervasive Motion Maturation

- Run the dead-zone, material, independence, foreground/background, freeze, fatigue, capability, and performance matrix.
- Remove repetitive or ornamental motion and repair regions that still read as a poster.
- Collect exact Production recordings/captures and Mark creative acceptance.

## Resume Point

Production `fce50af` remains the functional and public visual baseline. `ART-12A-E` are complete without changing it. The next exact action is deployment and Mark review of `/projects/ambient-proof` revision 2, first at idle and then near each local system. Acceptance completes `ART-12F` and authorizes bounded `ART-12G` integration; it does not declare the full Museum ambient-complete.
