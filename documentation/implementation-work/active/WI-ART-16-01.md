# WI-ART-16-01: Build The Piano Clearing Home World

## Properties

| Field | Value |
| --- | --- |
| State | in-review |
| Priority | high |
| Package | `ART-16` |
| Supporting packages | `ARC-06`, `KG-07`, `EXP-08`, `PRJ-09`, `QA-07` |
| Capabilities | `CAP-ART-017`, `CAP-ART-018`, `CAP-ART-019`, `CAP-KG-008`, `CAP-PRJ-009` |
| Created | 2026-07-24 |
| Last update | 2026-07-27 |
| Decision | [Piano Clearing Home Reset](../../implementation-plans/2026-07-26-Piano-Clearing-Home-Reset-Decision.md) |
| Execution plan | [Piano Clearing Home](../../implementation-plans/22-Piano-Clearing-Home-World.md) |

## Current Truth

Mark rejected the full proof-world compositor in `EV-ART-16-02` and requested a drastic reset. Home now targets one bounded outdoor clearing centered on the grand piano. The four project practices remain valid taxonomy, but they will later appear as four diegetic screens. About will later be represented by a simple pianist rather than a fifth territory.

Mark reviewed the first Checkpoint `B` clearing and requested a more specific composition: restore the original particle-built piano; look outward across a grassy overlook toward a visible stream, distant landscape, open sky, and a few clouds; and use a warm hand-painted pastoral animation language. He later supplied the original HTML and explicitly allowed the bridge and train when they improved source parity.

Mark found the deployed five-band candidate better but still unlike the supplied reference. In particular, its grass remained sparse/coarse and the river read as a horizontal strip with an unrealistic left-to-right current. That deployment is now revision-requested.

Mark found the 32,000-clump meadow closer to the source but still visibly clumped and unlike its continuous grass field; he also identified a large grassless piano patch. The next deployed revision replaced clumps with 220,000 independent blades and removed the piano clearance/contact-shadow geometry. Mark then requested a farther camera and closer source framing/styling. The first response widened a centered ravine view, which Mark rejected because the requested move was physical: change the angle modestly and move the eye back along the grass field. After the elevated right-meadow revision, Mark requested still farther-right travel and a lower-center piano that visibly rests on grass instead of overlapping the ravine. The current candidate uses GLTF-bounds grounding at a river-safe foreground meadow coordinate, replaces saturated blue/gold piano points with pearl/cool-white light, and extends the existing blade distribution through the bottom viewport edge.

Canonical `/` and `/projects` remain unchanged. The pianist, practice screens, environment preview, selected states, project reveal, and navigation migration do not exist.

## Resume Packet

- Current implementation commit: `a2eaaff` on `main`; creative review and target-machine performance review remain.
- Current implementation: farther-right independent-blade viaduct view with a geometry-grounded lower-center pearl particle piano is fully verified technically.
- Review route: `https://www.marknperera.ca/home-world-proof`.
- Verification: focused lint, TypeScript, all 57 test files / 240 tests, content validation, the clean 40-route production build, and local `1080 x 894` browser inspection pass.
- Performance boundary: one canvas, DPR at most `1.25`, at most 9,000 piano points in one draw, 220,000 independent two-triangle grass blades in one instanced draw, 58 trees in three instanced draws, five fixed rocks, 160 wildflower points, 180 motes, five bridge arches, seven distant birds in one instanced draw, one water shader, no post-processing or real-time shadows, animation paused for hidden/reduced-motion states.
- Safe exposure: no-index proof only; canonical Home and Projects remain unchanged.
- Deployment: Git-connected Production for `48ef8ba`.
- Loading correction: the piano now owns an isolated Suspense boundary, so a slow GLTF no longer blanks the environmental world.
- Next exact action: collect only farther-right camera placement, piano terrain contact/lower-center framing, pale particle readability, and target-machine smoothness review.

## Ordered Checkpoints

| Checkpoint | State | Acceptance |
| --- | --- | --- |
| `A` Direction reset | accepted | New decision, single-clearing architecture, supersession, and future contracts are recorded |
| `B` Empty clearing | in-review | Piano, grass, terrain, horizon, sky, light, calm life, and performance are visually accepted |
| `C` Pianist | not-started | Simple seated player fits the scene and owns the About handoff |
| `D` Practice instruments | not-started | Four screens fit around the piano and remain accessible without becoming cards |
| `E` One environmental preview | not-started | One local hover/focus influence melds translucently into the clearing |
| `F` One selected environment | not-started | Selection transforms the environment with continuity and bounded lifecycle |
| `G` Four practices | not-started | All four categories have distinct, cohesive preview and selected states |
| `H` Project/navigation depth | not-started | Project reveal, routes, history, return, AI, and tour pass |
| `I` Release | not-started | Performance, rollback, Production, and Mark acceptance pass |

## Named Acceptance

- [x] One physical outdoor clearing replaces simultaneous proof worlds.
- [x] The piano remains the permanent anchor.
- [x] Open-world styling does not imply walking or an explorable map.
- [x] About moves to the future pianist instead of a fifth screen.
- [x] Four project practices remain the later category structure.
- [x] Checkpoint `B` has an explicit performance budget.
- [ ] Clearing composition and aesthetics are accepted.
- [ ] Piano framing and visibility are accepted.
- [ ] Smoothness is accepted on a previously slower computer.
- [ ] Pianist design is accepted.
- [ ] Practice-screen design is accepted.
- [ ] Preview and selected environment transitions are accepted.
- [ ] Project/navigation depth and public migration pass.

## Restart Procedure

1. Read this file and Plan `22`; do not resume Plan `21`.
2. Inspect repository status and preserve unrelated user changes.
3. Review only the current checkpoint.
4. Do not begin the pianist or screens before Checkpoint `B` acceptance.
5. Run focused tests, TypeScript, lint, content validation, then the aggregate suite/build when behavior changes.
6. Update Current Truth, the checkpoint table, known-good point, and next exact action before ending.

## Chronological Updates

### 2026-07-24

- Four practices, project classifications, and a pure attention reducer were implemented.
- Generic anchors, proof-derived landmarks, and then complete proximity-weighted proof worlds were tried on the private route.
- `EV-ART-16-01` records the rejected landmark candidate.
- `EV-ART-16-02` records the rejected full-world compositor candidate deployed in `dpl_CLa1FpfccCtbQcNMKMYHHYahxQib`.

### 2026-07-27 Source-Guided Revision

- `EV-ART-16-07` moved to revision-requested after Mark supplied the original HTML and requested closer source parity.
- Commit `d6e9a26` restores the bridge and train as bounded depth cues while preserving the particle piano and path-carved downstream river.
- Git-connected Production deployment `dpl_HKewBJwbWmHgkLJky4bGJHUFVUxe` is Ready.
- All 57 test files / 237 tests, TypeScript, focused lint, the 40-route build, and live one-screen browser verification pass.

### 2026-07-27 River-Safe Pastoral Revision

- Mark found the source-guided viaduct version better, but identified trees rooted in the river and requested stronger warm hand-painted pastoral styling.
- Commit `98a1dca` makes tree eligibility derive from river clearance, terrain height, and local slope; adds one instanced canopy highlight; warms the sunlit grass field and clouds; and restores color separation without post-processing or shadows.
- Focused lint, TypeScript, all 57 test files / 238 tests, the clean 40-route build, and local one-screen visual review pass.
- Production deployment `dpl_4EQ9StMdGVpuuJ9LxgjdnMypLvxw` is Ready. Checkpoint `B` remains in review.

### 2026-07-27 Dense Meadow Revision

- Mark accepted the improved tree placement but rejected the meadow grass as visually unlike the source.
- Commit `d5b9c4e` replaces 11,000 coarse three-blade clumps with 32,000 short seven-blade clumps, adapts the source grass palette, synchronizes ground/blade gusts, warms the near bank, and softens distance contrast.
- Focused lint, TypeScript, all 57 test files / 238 tests, the clean 40-route production build, and local `1280 x 720` visual review pass.
- Production deployment `dpl_HFTY1xG4qMWH47EeqBzyyA9xr1vW` is Ready. Checkpoint `B` remains in review.

### 2026-07-27 Independent-Blade Meadow Revision

- Mark found the clumped meadow closer but still unlike the source and identified a large grassless patch beneath the piano.
- Commits `bd037b7`, `cfbfee2`, and `c819200` replace clumps with 220,000 independently distributed blades, remove the piano clearance/contact-shadow mesh, and retain only subtle shader-based blade shading beneath the piano.
- All 57 test files / 238 tests, TypeScript, focused lint, the clean 40-route production build, and Production `1280 x 720` one-screen review pass.
- Production deployment `dpl_GDFwxrnJHvGsLRvKJqLDzCc4xiKd` is Ready. Checkpoint `B` remains in review.

### 2026-07-27 Aspect-Safe Source-Framing Revision

- Mark found the independent grass better, then requested a farther camera and closer parity with the original composition and styling.
- Commits `c5f1fa4` and `c539899` move the overlook back, preserve the source's wide horizontal field through bounded aspect-aware lens fitting, warm and soften the sky/fog/final treatment, and strengthen the golden-right/cool-left meadow split.
- All 57 test files / 239 tests, TypeScript, focused lint, the clean 40-route Production build, and live `1280 x 720` browser review pass.
- Git-connected Production for `c539899` is live. Mark rejected its centered widened camera framing.

### 2026-07-28 Oblique Meadow-Overlook Revision

- Mark clarified that the camera should change angle modestly and move physically back along the grass field, not widen a centered ravine view.
- Commit `de4596d` moves the eye to an elevated right-meadow position, aims across and down into the valley, restrains the lens to `46-49` degrees, and moves oversized translucent foliage back to the frame edges.
- All 57 test files / 239 tests, TypeScript, focused lint, content validation, the clean 40-route Production build, and local/Production `1080 x 894` browser review pass.
- Git-connected Production for `de4596d` is live. Checkpoint `B` remains in review.

### 2026-07-28 Grounded Meadow-Piano Revision

- Mark requested farther-right camera travel, a lower-center piano firmly on the grass, and removal of the saturated blue/gold dots.
- Commit `48ef8ba` moves the camera and piano farther into the right meadow, derives the model's terrain contact from its true GLTF bounds, and replaces the saturated point palette with fine pearl/cool-white light.
- All 57 test files / 240 tests, TypeScript, focused lint, content validation, the clean 40-route Production build, and local `1080 x 894` browser review pass.
- Mark found the result almost usable and identified a remaining artificial grass patch, visible distant ridge edges, a bright valley-throat wedge, and a need for slightly more leftward camera rotation.
- Commit `5718cd8` removes piano-local grass darkening, extends and smooths the ground/water through the valley, fog-tapers the river before its endpoint, widens/refines ridge bands beyond the oblique frustum, and yaws the camera slightly left without moving the piano from its lower-center meadow position.
- Commit `223d226` fixes the final bare foreground strip by extending the same 220,000-blade distribution from world `z=11` to `z=24`; it adds no blades, draw calls, or new runtime system. Local `1080 x 894` review confirms continuous grass through the bottom edge.
- Commit `406634a` reduces ambient grass sway to `0.52`, smooths the terrain-projected cursor position and movement-energy envelope, and increases bounded camera pointer travel from `0.08` to `0.18`.
- Commit `a2eaaff` contracts the cursor wake from `4.2` to `3.2` world units, removes the train without changing the viaduct, and adds seven independently phased distant birds in one instanced draw.
- Checkpoint `B` remains in review; no pianist or practice-screen work begins before acceptance.

### 2026-07-28 Dusk Refrain Color-Script Revision

- Mark supplied a blue-hour target and requested that the existing valley retain its composition while adopting the target's blue sky, pink horizon, violet depth, rose meadow, and dark indigo structures.
- Commit `b85ed5e` retunes every visible scene layer rather than applying one global tint; topology, motion, interaction, camera, and performance budgets remain unchanged.
- All 57 test files / 240 tests, TypeScript, focused lint, content validation, and the clean 40-route build pass.
- Exact resume point: deploy and collect a direct visual review of sky/horizon separation, meadow saturation, piano readability, and structure contrast. Do not begin Checkpoint `C` before Checkpoint `B` is accepted.

### 2026-07-26

- Mark rejected the full-world compositor and selected a single outdoor piano clearing as the new Home foundation.
- The five-territory layout and proof-world takeover mechanism are superseded; the four-practice taxonomy remains.
- The first local clearing proof implements only the environment and piano with bounded geometry, instancing, shader wind, fixed camera, and no later interface layers.
- Focused lint, TypeScript, content validation, eight focused tests, and the 40-route production build pass.
- Mark requested a scenic revision: particle piano, visible stream, long-distance hills, sky, and clouds in a warm hand-painted pastoral language, without a bridge or train.
- The local revision replaces the opaque piano with one GPU point cloud and rebuilds the terrain, water, horizon, sky, clouds, palette, and camera while preserving the strict runtime boundary.
- Commit `cd0b673` and Production deployment `dpl_BGi4QF3NKGdn9UBR6vRSnC79vGiA` release the revision to the private route; 237 tests, content validation, local/Vercel builds, and live route smoke checks pass.

### 2026-07-27

- Mark found that the first riverside candidate remained effectively flat, obscured too much sky, and did not keep the piano on the high foreground grass field.
- The replacement candidate introduces explicit plateau, cliff, valley-floor river, opposite hillside, low horizon, and right-foreground piano zones rather than relying on a shallow height variation.
- The detail budget increases to 8,200 piano points, 1,100 grass instances, 34 trees, 18 rocks, 120 wildflowers, and four cloud groups while retaining one canvas, capped DPR, and no post-processing or shadows.
- Focused lint, TypeScript, all 57 test files / 237 tests, content validation at 62 nodes / 28 relationships, and the 40-route production build pass.
- Commit `8dce371` is pushed to `main`; Git-connected Production deployment `dpl_3qCEWbjFJ3XectpdsR7bWPhJaDHU` is Ready, and `/`, `/projects`, and `/home-world-proof` return `200`.
- Mark found that deployment much better but requested the supplied screenshot's composition and styling exactly, without its bridge and train.
- The new local candidate rebuilds five explicit depth bands, enlarges the golden right ridge, clears grass from the ravine, widens the visible water, adds near foliage / far forms / boulders / motes, and clarifies the particle piano with an `18%` translucent silhouette.
- Local browser inspection, focused lint, TypeScript, 237 tests, content validation, and the 40-route build pass.
- Commits `f4d47c9` and `e654881` ship the five-band rebuild and final river-depth correction; Production deployment `dpl_42cLHfRnkFoEDBY92CrZKLpMNd7u` is Ready.
- Production browser inspection confirms the proof marker, one live canvas, the broad river / ravine / ridge hierarchy, and no console warnings or errors.
- Mark found the five-band deployment still too different from the supplied screenshot, with sparse/coarse grass and a horizontal river/current.
- The local replacement defines one distance-oriented river centerline, carves terrain around it, widens it toward the foreground, excludes grass from water/steep banks, and moves water bands downstream. Fine grass density increases to 7,200 clumps without increasing draw count.
- Focused lint, TypeScript, all 57 test files / 237 tests, the 40-route production build, and local browser inspection passed before deployment.
- Commit `31a2ad8` is pushed to `main`; Git-connected Production deployment `dpl_2ghDZVTNW5C88BYcsuKudfgqNoFA` is Ready.
- Production `1280 x 720` inspection confirms the downstream marker, one canvas, no page overflow, and zero console warnings/errors.
