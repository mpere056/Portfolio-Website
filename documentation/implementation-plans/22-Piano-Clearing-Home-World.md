# Piano Clearing Home World Plan

Last updated: 2026-07-31

## Metadata

| Field | Value |
| --- | --- |
| Plan ID | `PIANO-CLEARING-HOME` |
| Status | Active; clearing, pianist, three instruments, and transition foundation verified; Music preview packet is in review |
| Decision | [Three-Practice Taxonomy](2026-07-30-Three-Practice-Taxonomy-Decision.md) and [Piano Clearing Home Reset](2026-07-26-Piano-Clearing-Home-Reset-Decision.md) |
| Supersedes | [Plan 21](21-Home-Practice-World-And-Attention-Compositor.md) |
| Work item | [WI-ART-16-01](../implementation-work/active/WI-ART-16-01.md) |
| Practice-world companion | [Home Practice Worlds And Transitions](23-Home-Practice-Worlds-And-Transitions.md) |
| Review route | Canonical `/`; `/home-world-proof` retained for rollback/review |
| Public exposure | Provisional canonical Home by explicit request; `/projects` unchanged |

## Objective

Build a highly optimized, cinematic outdoor Home world centered on the particle grand piano. The accepted direction is a hand-painted pastoral overlook: the piano sits on a high foreground grass plateau, a steep slope falls into a valley, the river occupies the valley floor, and the opposite hillside and distant landscape remain low enough to preserve open sky and clouds. A bounded empty viaduct remains as a middle-distance depth cue, while a small moving bird flock gives the sky authored life; there is no walking or explorable map. The current sequence has added the restrained pianist, three practice instruments, and a tested one-owner transition foundation without changing neutral visuals. The next sequence reviews one Music preview packet, implements that bounded preview, then proceeds separately to the Music selected world, the remaining two practice worlds, and project depth. Detailed world briefs, runtime boundaries, and restart state live in Plan `23`.

## Scene Grammar

### Permanent Layer

The permanent layer makes every later state feel like the same place:

- fixed overlook footprint with an explicit foreground plateau, valley wall, valley floor, and opposite hillside;
- particle-built grand piano and its ground contact;
- authored camera and focal hierarchy;
- bounded sloping river-valley terrain and a long layered horizon;
- shared sky, fog, and light direction;
- one coordinated scene clock and lifecycle owner.

### Later Figure Layer

A deliberately simple pianist gives the piano purpose and will provide the About entry. The current candidate uses a seated dark silhouette with restrained, independently varied horizontal and vertical playing motion. The About handoff remains part of navigation depth rather than this visual checkpoint.

### Practice Instruments

Three screens are spatial instruments, not overlay cards. The current candidate uses three asymmetric translucent signal surfaces in a suspended arc above the piano. Their final form, position, material, and legibility remain feedback-gated. They must:

- remain readable without dominating the piano;
- establish one stable spatial position per practice;
- accept pointer, keyboard, and future tour focus;
- expose semantic HTML controls even if their surfaces are rendered in 3D;
- avoid requiring head movement, camera orbit, or scrolling.

### Later Environmental States

Each practice owns three levels:

| Level | Trigger | Environment behavior |
| --- | --- | --- |
| neutral | no practice target | clearing owns the scene |
| preview | proximity, hover, or focus | translucent local influence enters the clearing |
| selected | click, Enter, or restored URL state | practice environment becomes the primary world and reveals project depth |

Preview should modify atmosphere rather than scale the screen dramatically. Selected state may be visually extensive but still uses one runtime and preserves a coherent transition from the clearing. The terrain silhouette, river corridor, camera family, piano coordinate, pianist, and practice anchors remain stable; worlds transform materials, ecology, architecture, light, atmosphere, and later project landmarks.

Historical coral, observatory, archive, and music proofs are technique libraries only. Their motion systems, material relationships, and interaction lessons may be translated into native 3D layers, but their full compositions and flat plates may not be mounted as practice environments.

## First Proof Implementation

The current Checkpoint `B` implementation intentionally contains:

- one React Three Fiber canvas;
- one 78 by 68 unit displaced terrain patch authored as a high right foreground field, asymmetric dark ravine, path-carved river bed, and opposite rise;
- the existing grand piano sampled into at most 9,000 GPU points in one draw, with an `18%` translucent silhouette beneath it for readability;
- 260,000 independently distributed two-triangle grass blades in one instanced draw, including a denser foreground allocation around the piano, using custom root/width/height/angle/variation attributes, short hair-fine geometry, source-derived color bands, and shared shader gusts while remaining excluded from water and steep ravine edges;
- static blade shape, variation, and piano-shadow values authored once on the CPU and packed into normalized 16-bit instance attributes, so the GPU does not repeat invariant trigonometry and shadow-distance work for every blade vertex on every frame;
- 58 miniature low-poly horizon trees in two instanced draws;
- five fixed ravine rocks, 160 point-rendered wildflowers, and 180 atmospheric motes;
- three smoothed layered ridge silhouettes;
- five slow cloud groups, distant floating forms, and oversized translucent near foliage framing the left and upper-right edges;
- one path-aligned shader-driven water ribbon with painted depth plates and downstream travel;
- one dark empty five-arch viaduct as a middle-distance depth cue, plus seven restrained distant birds in one instanced draw;
- one sky shader, hemisphere light, directional light, fog, and shader-only piano grounding;
- fixed farther-right meadow overlook with modest off-axis valley angle, at most `0.08` world units of pointer travel, and restrained `46-49` degree aspect-aware field-of-view fitting;
- river-safe foreground piano coordinate projected near horizontal center and roughly one quarter viewport height above the bottom;
- geometry-aware piano normalization that recenters the sampled GLTF and aligns its true lowest vertex to the local terrain rather than using a guessed vertical offset;
- pearl and cool-white light particles over a restrained translucent silhouette, without saturated blue/gold point-cloud coloring;
- DPR capped at `1.25`, with a sustained-frame-pressure governor that steps through `1.0`, `0.88`, and `0.75` only when needed and recovers slowly after stable rendering;
- cursor-to-terrain raycasting suspended while the pointer response is fully idle, an unused stencil buffer disabled, and no reduction to grass, piano-particle, tree, flower, mote, cloud, or bird counts;
- no orbit controls, post-processing, real-time shadows, physics, or per-blade JavaScript animation.

## Ordered Checkpoints

| Checkpoint | State | Deliverable | Gate |
| --- | --- | --- | --- |
| `A` Direction reset | accepted | Decision, supersession, scene boundary, and later interaction contract | Plans and tracking agree |
| `B` Empty clearing | accepted-for-sequencing | Piano, terrain, grass, horizon, sky, light, wind, and fixed camera | Mark accepted the scene as sufficiently usable to proceed; later polish remains possible |
| `C` Pianist | accepted-for-sequencing | Minimal seated figure and restrained playing loop | Figure remains a later polish surface; About handoff is deferred to `H` |
| `D` Practice instruments | accepted-for-sequencing | Three screen forms and spatial arrangement | Three-practice taxonomy and semantic controls are stable enough to build transition behavior |
| `E0` Transition foundation | verified | Semantic attention controller, lazy world contract, lifecycle diagnostics, and neutral parity | One dominant owner, no hidden worlds, deterministic retreat/disposal, and unchanged neutral Home pass at `b0018cb` |
| `E1` Music preview state | in-review | Music influences the clearing through local contact, travelled response, and one horizon consequence | Quiet Phrase Fields packet receives `A/B/C` decision before runtime work |
| `F` Music selected state | not-started | Resonant Meadow becomes the primary environment using the same world module | Continuity, lifecycle, URL intent, content decision, and performance pass |
| `G` Three practices | not-started | Remaining two preview/selected environments | Distinct but cohesive; one active runtime |
| `H` Project and navigation depth | not-started | Project reveal, About handoff, AI/tour context, history, restore, and `/projects` compatibility | Deep links, Back, refresh, and exact return pass |
| `I` Release | not-started | Preview, performance, rollback, Production, and Mark acceptance | Public Home replacement is separately approved |

## Checkpoint B Acceptance

Mark reviews only a short list:

1. Does `Dusk Refrain` match the supplied blue-hour hierarchy: blue upper sky, pink horizon, violet depth, rose grass, and dark indigo structures?
2. Is the particle piano the right size, position, angle, density, and visual focus?
3. Does the piano unmistakably sit above a valley-floor river, with a visible descent, distant landscape, open sky, and a few clouds without suggesting a full explorable map?
4. Do water, grass, particles, clouds, and light make the scene alive enough while remaining calm?
5. Does it remain smooth on the computers that struggled with earlier proofs?

Checkpoint `B` advanced only after direct visual iteration. Checkpoints `C` and `D` are now implemented candidates, not final aesthetic acceptance.

## Performance Evidence

For every checkpoint record:

- DPR policy;
- draw-call and instance strategy;
- moving systems and their owner;
- hidden-tab and reduced-motion behavior;
- test and production-build results;
- browser frame behavior on at least one lower-capability machine before public migration.

If performance degrades, reduce world detail before adding adaptive complexity. This Home should feel authored because of composition, light, timing, and material relationships, not because it contains many objects.

The accepted optimization order for this composition is now: remove repeated invariant work, suspend idle CPU work, reduce unused framebuffer cost, then adapt raster density under sustained pressure. Geometry or grass density may not be reduced merely to satisfy a faster machine profile because foreground continuity is part of the accepted composition.

## Resume Point

- On 2026-07-31 commit `5313e93` deployed the no-detail-removal optimization to Vercel Production while retaining all 260,000 grass blades and every other scene count. It precomputes and packs invariant grass shape/variation/shadow data, avoids idle cursor raycasts, disables stencil, and introduces a hysteretic DPR governor for slower devices. All 58 test files / 243 tests, TypeScript, whole-project lint with no errors, 61-node / 28-relationship content validation, the 41-page Production build, local browser rendering, a zero-warning console, Vercel status, and public `200` checks pass. Slower-device observation remains.
- On 2026-07-30 Mark reduced the project taxonomy to three practices. Dreamlife moved to Life Systems & Tools, Interactive Story Generator moved to Play & Community, and AI became a cross-cutting capability. The public graph now contains 61 nodes and 28 relationships.
- The Home candidate now renders three fully legible instruments in a balanced arc: Music & Performance at left, Life Systems & Tools centered above, and Play & Community at right. The compact grid centers its third instrument.
- Focused tests, all 58 test files / 243 tests, TypeScript, focused lint, content validation, the 41-page production build, and local production-render visual review pass.
- The first enclosed clearing at `3d60173` received revision feedback: restore the particle piano and expose a much longer pastoral view.
- The first riverside-overlook candidate at `cd0b673` / `dpl_BGi4QF3NKGdn9UBR6vRSnC79vGiA` received revision feedback because its river, grass, and piano read at nearly one level, its horizon blocked the sky, and its piano was not framed as the foreground anchor.
- Mark found `8dce371` much better but still unlike the supplied screenshot because it retained a broad-meadow read and undersized foreground ridge.
- Commits `f4d47c9` and `e654881` rebuild the image as five explicit depth bands matching the reference: framed pale sky and centered sun, miniature far ridge, steep dark ravine, broad visible valley-floor water, and a large diagonal golden right ridge carrying the piano. The implementation adds the reference's pink/green near foliage, distant floating forms, low-left boulders, atmospheric motes, and a faint piano silhouette while retaining one canvas and bounded runtime.
- Focused lint, TypeScript, all 57 test files / 237 tests, content validation at 62 nodes / 28 relationships, and the 40-route production build pass.
- A piano-only Suspense boundary prevents the model load from blanking the rest of the world. Local and Production `1280 x 720` browser inspection confirms the composition and zero console warnings/errors.
- Production deployment `dpl_42cLHfRnkFoEDBY92CrZKLpMNd7u` is Ready at `/home-world-proof`.
- Mark found that deployment still too different from the supplied screenshot: its grass was sparse/coarse and its river/current read horizontally instead of following the valley toward the viewer.
- Commit `31a2ad8` uses one shared path to carve the ravine, bend and widen the water from distant center to foreground, exclude vegetation from water and steep banks, and orient shader travel downstream. It increases visual grass density to 7,200 tapered three-blade clumps while retaining one instanced draw.
- Mark found that path geometry better but still requested closer parity, supplied the original HTML, and allowed the bridge and train.
- Commit `d6e9a26` translates the source's visual hierarchy into the bounded proof: lower source-guided camera, 11,000-clump meadow, painted downstream river, smooth ridge layers, warm/lavender clouds, dark five-arch viaduct, visible three-car train, and retained particle piano.
- Focused lint, TypeScript, all 57 test files / 237 tests, the clean 40-route production build, local visual review, and Production browser verification pass. Production has one canvas, one-screen geometry, `far-to-foreground` flow, and zero console warnings/errors. No numerical frame-rate claim is made.
- Production deployment `dpl_HKewBJwbWmHgkLJky4bGJHUFVUxe` is Ready.
- Mark found that source-guided revision better, but requested river-safe tree placement and a warmer hand-painted pastoral animation treatment.
- Commit `98a1dca` derives distant-tree eligibility from the river/ravine terrain model, adds one low-cost canopy-highlight instance layer, and refines grass, cloud, fog, lighting, and final color separation.
- Mark found the river-safe composition improved but rejected the sparse, tall grass treatment as unlike the supplied source.
- Commit `d5b9c4e` rebuilds the meadow as 32,000 seven-blade clumps with shorter hair-fine geometry, source-derived teal/green/yellow/straw color bands, synchronized ground-and-blade gusts, a straw-gold near bank, stronger distance haze, and restrained final softening.
- Mark found that clumped revision closer but still unlike the source and identified a large grassless patch beneath the piano.
- Commits `bd037b7`, `cfbfee2`, and `c819200` replace the clumps with 220,000 independent single-blade instances, remove the piano clearance/contact-shadow geometry, and retain a subtle blade-color shade for contact. Approximate vertex workload remains comparable to the prior renderer.
- Focused lint, TypeScript, all 57 test files / 238 tests, the clean 40-route production build, and Production one-screen visual review pass. Production `dpl_GDFwxrnJHvGsLRvKJqLDzCc4xiKd` is Ready.
- Mark found the independent grass better, then requested a farther camera and closer source composition/styling.
- Commits `c5f1fa4` and `c539899` move the overlook back; preserve the wide source frame on tall browser windows through bounded lens fitting; warm and soften the sky, fog, and final atmosphere; and strengthen the golden-right/cool-left meadow hierarchy.
- Focused lint, TypeScript, all 57 test files / 239 tests, the clean 40-route Production build, and live one-screen browser review pass. Git-connected Production for `c539899` is live.
- Mark clarified that this still did not match: the camera needed to change angle modestly and move physically back along the grass field rather than widen a centered ravine view.
- Commit `de4596d` moves the eye to an elevated right-meadow overlook, keeps the viaduct broad and approximately horizontal, places the river below it, retains golden foreground and open sky, and moves translucent edge foliage out of the center.
- Focused lint, TypeScript, all 57 test files / 239 tests, content validation, the clean 40-route Production build, and local/Production `1080 x 894` browser review pass. Git-connected Production for `de4596d` is live.
- Mark requested farther-right camera travel, a lower-center piano physically resting on the meadow, and pale light particles instead of saturated blue/gold dots.
- Commit `48ef8ba` moves the eye and piano farther into the right meadow, projects the piano into the lower-center foreground, grounds its true GLTF bottom to sampled terrain, and replaces the saturated point palette with pearl/cool-white light.
- Commit `5718cd8` removes the artificial piano grass patch, extends/smooths terrain and water through the valley throat, fades the stream before its mesh endpoint, pushes widened ridge edges beyond the oblique frustum, and adds the requested slight leftward camera yaw.
- Commit `223d226` extends the existing independent-blade distribution through the camera-facing terrain edge, eliminating the final bare foreground strip without increasing the 220,000-blade budget or draw count.
- Commit `406634a` quiets idle blade wind to `0.52`, smooths both the terrain hit and movement-energy envelope so nearby grass wakes without snapping, and increases bounded camera pointer travel from `0.08` to `0.18`; the response remains shader-only and disabled by reduced-motion.
- Commit `a2eaaff` removes the train while retaining the viaduct, contracts the cursor wake from `4.2` to `3.2` world units, and adds seven independently phased distant birds in one instanced draw.
- Commit `b85ed5e` preserves that geometry, camera, interaction, and animation state while translating sky, fog, lights, landscape, vegetation, water, bridge, piano, particles, and page atmosphere into the supplied dusk palette.
- Focused lint, TypeScript, all 57 test files / 240 tests, content validation, the clean 40-route Production build, and local `1080 x 894` browser review pass.
- Commits `16d9331`, `2cbbda9`, and `b03334f` add the bench and seated silhouette pianist, refine its scene fit, and give its hands restrained independently varied horizontal and vertical playing motion.
- The original Checkpoint `D` candidate exposed four practices. The 2026-07-30 taxonomy decision removes AI as a peer destination, reclassifies Dreamlife and Interactive Story Generator, and reduces Home to three practice instruments. Hover and keyboard focus expose local attention; click/Enter holds one signal. No environmental takeover or route change is introduced before Checkpoints `E` and `F`.
- Commit `b0018cb` replaces presentational hover ownership with a tested semantic preview/selection/retreat controller, defines the lazy module and performance contract, guarantees singular runtime ownership and deterministic disposal, and adds opt-in local diagnostics. The production registry remains empty, so neutral Home mounts no additional runtime or visual layer.
- The [Quiet Phrase Fields packet](../art-direction/2026-07-31-music-preview-packet/REVIEW.md) isolates one causal preview direction, implementation ownership, fallback behavior, and a `+1` draw-call / zero-pass / zero-texture budget.
- Exact next action: collect Mark's `A/B/C` packet decision, revise if needed, then implement only the accepted contact/path/horizon preview. Do not build a complete selected world or start Life/Play runtime work yet.
