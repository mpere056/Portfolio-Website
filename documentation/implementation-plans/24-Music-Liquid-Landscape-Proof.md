# Music Liquid Landscape Proof Plan

Last updated: 2026-07-31

## Purpose

Prove that the selected Music world can feel like a landscape changing state without running a fluid simulation or rebuilding Home. The accepted prototype direction is **Liquid Landscape**: small territories of the existing meadow soften, flow, carry light, and reform while the piano, camera, valley, river, and navigation remain spatially continuous.

This is accepted for prototype only. It is not final creative acceptance of the full Music world.

## Core Illusion

The visitor should read one continuous transformation:

1. Grass leans toward an approaching boundary.
2. Individual blades lose definition inside that boundary.
3. The ground becomes a shallow, coherent liquid skin.
4. A broad pressure body travels through the skin like material moving through a vein, rather than a texture sliding sideways.
5. The region carries displaced highlights and restrained refraction.
6. The pressure leaves; blades reform behind it with a short memory delay.

The first proof happens beside the piano, not across the entire viewport. It must remain alive without audio or pointer input. Pointer attention may locally intensify the nearest territory. Future optional audio can modulate the same parameters, but audio is not a dependency.

## Non-Goals

- No Navier-Stokes, particle-fluid, voxel, or global height-field simulation.
- No full-screen post-processing pass.
- No duplicate Home canvas, terrain, grass field, river, piano, or frame scheduler.
- No liquid texture plate drifting over unchanged grass.
- No global synchronized pulse.
- No hover overlay before the selected-state material grammar is proven.
- No Life Systems, Play, project landmarks, or `/projects` migration in this package.

## Runtime Architecture

### Existing Systems Reused

- One React Three Fiber canvas and coordinated scene clock.
- Existing terrain, 260,000 instanced grass blades, river shader, piano particles, camera, fog, lighting, DPR governor, hidden-tab behavior, and reduced-motion boundary.
- Existing one-owner practice-world lifecycle from `ART-16E0`.

### New Music Module

One lazy `MusicLiquidLandscape` module owns:

- a compact territory descriptor buffer;
- shared metamorphosis uniforms;
- terrain and grass shader hooks;
- at most two sparse low-poly surface meshes for thickness, rim, and refraction cues;
- one optional low-resolution procedural lookup texture only if analytic masks are insufficient;
- diagnostics and deterministic disposal.

The module exposes one normalized `worldWeight` so the same implementation can later serve approach, preview, selected, retreat, calm, and reduced-motion states. The prototype initially drives only the selected proof.

### Territory Model

Each territory is an authored ellipse or spline segment with:

- world-space center, axes, rotation, and edge softness;
- independent phase and travel direction;
- liquid depth, pressure width, memory delay, and reform speed;
- highlight, refraction, and grass-response strengths;
- attention radius and local intensity ceiling.

The proof starts with one territory near the piano. The final world may use two or three unequal territories only after the first gate passes.

### Shader Responsibilities

| Layer | Responsibility | Explicit limit |
| --- | --- | --- |
| Grass vertex shader | bend toward boundary, compress blade height, then recover with delayed phase | no CPU per-blade updates |
| Grass fragment/color path | blend rose meadow into nacre/liquid edge colors without a hard ring | no global recolor |
| Terrain shader | shallow displacement illusion, moving pressure body, caustic response, and reform trace | no tessellation or simulation texture at first |
| Surface mesh | selective liquid thickness, rim highlights, and limited scene-color approximation | maximum two meshes and two draws |
| River shader | supply compatible travel rhythm and reflected color, not duplicate the territory | no new river geometry |
| Piano/lighting | local reflected response when a territory reaches the piano zone | no whole-scene pulse |

True screen-space refraction is optional and may only be added if the cheaper displaced-normal and environment-color approximation fails creative review.

## Silent World Score

The world animates from an authored silent score with independent clocks:

- `territoryTravel`: slow migration of the material boundary;
- `pressurePassage`: visibly faster broad bodies moving inside the liquid;
- `surfaceBreath`: low-amplitude thickness change;
- `highlightDrift`: directional light travel;
- `grassMemory`: delayed blade reformation;
- `riverReply`: occasional downstream response after a territory event.

These clocks must be phase-offset and locally scoped. Optional future audio maps beat, bass, melody, and harmonic density into these existing values; it never becomes a second animation system.

## Ordered Implementation

| Gate | State | Work | Stop condition |
| --- | --- | --- | --- |
| `ML0` Baseline capture | partial | Preserve canonical neutral Home and record source/runtime boundaries; formal renderer counts and sustained frame intervals still need capture on the proof and one slower device | Baseline is reproducible before performance acceptance |
| `ML1` Mask diagnostic | implemented; visual acceptance open | One private analytic territory exposes deterministic boundary, pressure body, and recovery tail through shared shader helpers; no separate false-color UI was added | Mask remains world-bound, deterministic, and absent from canonical Home |
| `ML2` Grass metamorphosis | accepted-for-sequencing | Existing blades compress into the traveling territory, adopt nacre color, and recover behind it without CPU blade updates | Mark confirmed the bounded liquid region looks nice and asked implementation to continue; this is not full-world acceptance |
| `ML3` Liquid material | accepted-for-sequencing | Existing ground plus one terrain-hugging transparent mesh share the same traveling pressure field, recovery memory, caustics, and restrained ripples | Mark accepted the material read for continued implementation; renderer metrics remain open |
| `ML4` Local response | candidate | Autonomous idle motion now gains territory-local pointer intensification, a restrained nacre piano reply, and a slower downstream river reply through shared mutable uniforms | Local browser QA shows no global pulse or runtime errors; Mark review remains |
| `ML5` Performance and calm | candidate; observation open | Existing DPR adaptation now also steps liquid motion through Full, Balanced, and Calm tiers; hidden tabs pause, reduced motion holds an authored stable boundary, and WebGL loss removes only the liquid territory. Grass count and scene composition remain unchanged | Sustained proof/neutral metrics and one slower-device observation remain before acceptance |
| `ML6` Creative review | revise | The first deployed review was materially too similar to `ML2/ML3`: its local response and calm-tier work were not a useful visible milestone. Mark requested a genuinely visible continuation rather than another infrastructure-only review | Revise the same one-draw territory into a broad foreground material state before asking for review again |
| `ML6-R1` Expanded material read | revise | The world-scale territory is now clearly visible and some calmer frames read well, but the dominant periodic pressure phase resolves into uniform parallel stripes at its bright extreme | Preserve the broad territory while replacing periodic bands with irregular currents |
| `ML6-R2` Organic current field | revise | Domain-warped cells removed the uniform stripes, but the expanded territory crossed the ravine, suppressed bridge-adjacent grass, and overwrote too much terrain shading, flattening the hill and bridge separation | Preserve organic currents while restoring the original world silhouette and depth cues |
| `ML6-R3` Terrain-conforming currents | candidate; review open | One shared elevated-near-meadow mask now clips grass compression, ground material, displacement, and surface alpha away from the ravine; liquid color inherits underlying terrain light instead of replacing it | Hill contour, ravine depth, and bridge separation remain legible throughout the liquid cycle |
| `MW1` Selected-world expansion | blocked by `ML6` | Expand to at most three territories and compose the full Music hierarchy | Selected world passes continuity, lifecycle, performance, and visual review |
| `MW2` Hover derivation | blocked by `MW1` | Derive the partial hover state from the accepted module and uniforms | Hover continues into selection without a visual restart |

## Performance Envelope

Measure against the same machine and viewport before and after each gate. Do not use a percentage-complete claim.

### Hard Prototype Budget

- One existing canvas and scheduler.
- No added work on neutral Home before the Music module is requested.
- `+3` draw calls preferred; `+4` maximum for the first proof.
- Zero new full-resolution render targets.
- Zero CPU iteration over grass instances per frame.
- Zero runtime geometry rebuilding during steady animation.
- At most one `256 x 256` lookup texture if required.
- Less than `1 MB` new compressed prototype assets.
- No material compile churn after the module settles.

### Quality Tiers

| Tier | Territory behavior | Surface cues | Update policy |
| --- | --- | --- | --- |
| Full | one territory, pressure passage, recovery memory, two surface meshes, local piano/river response | all bounded effects | every rendered frame |
| Balanced | same silhouette and metamorphosis, one surface mesh, cheaper highlights, no true refraction | preserve the idea, reduce optical cost | existing adaptive DPR plus throttled distant clocks |
| Calm | stable transformed territory with very slow pressure and recovery | no broad refraction or rapid highlight travel | low temporal amplitude |
| Reduced | authored stable liquid/grass boundary | no travel; semantic controls unchanged | static material state |
| Failure | neutral meadow plus subtle Music tint near the piano | no selected geometry | controls and retreat remain available |

The prototype is rejected on performance grounds if Balanced cannot preserve the readable grass-to-liquid-to-grass sequence without sustained interaction lag. If rejected, retain the territory grammar and replace the surface with a lighter material phase change rather than reducing grass density.

## Tests And Evidence

### Automated

- Territory masks remain bounded and deterministic for fixed time/input.
- Only Music can mount the module; only one practice runtime owns the scene.
- Neutral, invalid, failed-load, retreat, and disposal states leave no uniforms or geometry behind.
- Reduced motion disables travel while preserving selected semantics.
- Pointer energy decays smoothly and cannot affect territories outside its radius.
- Hidden tabs stop nonessential clocks.
- Quality tiers preserve the same state machine and territory identity.

### Browser And Visual

- Compare neutral Home before and after with Music inactive.
- Inspect first load, selection, idle for at least 30 seconds, local pointer attention, retreat, refresh, Back, and repeated entry.
- Confirm grass does not expose a rectangular patch, hard ring, or static matte.
- Confirm pressure visibly travels through the region and does not resemble UV scrolling.
- Confirm piano remains legible and visually grounded.
- Confirm no whole-world synchronized response.
- Review at desktop target size and on one previously laggy computer before expansion.

### Performance Record

For `ML0`, `ML3`, and `ML5`, record:

- viewport, DPR tier, browser, and device;
- draw calls, triangles/points, textures, and render-target count;
- average and worst sustained frame interval from the same observation window;
- idle and pointer-active behavior;
- resource state after retreat and re-entry;
- any tier downgrade and its trigger.

## Resume Ledger

| Field | Current value |
| --- | --- |
| Current gate | `MW1-A` five-landscape comparison gallery; creative review open |
| Known-good code | `b0018cb` transition foundation; `5313e93` optimized visual baseline |
| Safe public state | Canonical neutral Home unchanged; private no-index `/music-liquid-proof` mounts one selected study at a time; Music registry remains empty |
| Next exact action | Mark reviews Tidal Meadow, Nacre Terraces, Resonant Archipelago, Glass Delta, and Harmonic Dunes and labels each keep, revise, combine, or reject |
| Do not begin | Production selected-world registration, hover derivation, other practice worlds, or project landmarks before the comparison outcome |
| Review packet | One route with five compact selectors; no long document review required |

Update this ledger, `WI-ART-16-01`, Plans `22/23`, capability `CAP-ART-018/019`, dashboard, and `ART-16` evidence whenever a gate changes state.

## MW1-A Five-Landscape Review Gallery

The user requested a larger creative batch rather than another single incremental liquid revision. The private proof therefore exposes five deliberately different territory grammars through one shared scene and one active runtime:

| Study | Territory and motion grammar | Sparse landmark grammar |
| --- | --- | --- |
| Tidal Meadow | one broad breathing basin | nested tidal rings |
| Nacre Terraces | unequal stepped shelves | translucent pearlescent plates |
| Resonant Archipelago | separated answering pools | lifted islands and rings |
| Glass Delta | branching directional channels | terrain-projected luminous tributaries |
| Harmonic Dunes | overlapping fluid hills | slow translucent dune bodies |

The gallery is a comparison instrument, not five production worlds. Only one study mounts at a time; all reuse the existing canvas, terrain, grass, piano, bridge, camera, and runtime clocks. Every mask is clipped to the elevated near meadow so the ravine and bridge remain readable. Creative review determines which grammar or combination advances to the selected Music world.
