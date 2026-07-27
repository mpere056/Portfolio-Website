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

Mark reviewed the first Checkpoint `B` clearing and requested a more specific composition: restore the original particle-built piano; look outward across a grassy overlook toward a visible stream, distant landscape, open sky, and a few clouds; use a warm hand-painted pastoral animation language; and include no bridge or train.

Mark found the deployed five-band candidate better but still unlike the supplied reference. In particular, its grass remained sparse/coarse and the river read as a horizontal strip with an unrealistic left-to-right current. That deployment is now revision-requested.

The current local Checkpoint `B` candidate replaces independent bands with one shared perspective river path. The same centerline carves the ravine, bends and widens the water from distant center to lower foreground, excludes grass from water and steep banks, and orients shader travel downstream. Both high fields use 7,200 fine tapered grass clumps in one instanced draw; the particle piano remains on the right field. It retains one canvas, capped DPR, moving grass/water/clouds/motes, restrained camera breathing, and no post-processing, real-time shadows, orbit controls, bridge, train, or game-world navigation.

Canonical `/` and `/projects` remain unchanged. The pianist, practice screens, environment preview, selected states, project reveal, and navigation migration do not exist.

## Resume Packet

- Known-good deployed commit: `e654881` on `main`; technically stable but revision-requested.
- Current implementation: path-carved Checkpoint `B` replacement is verified locally and awaits commit/deployment.
- Review route: `https://www.marknperera.ca/home-world-proof`.
- Verification: focused lint, TypeScript, all 57 test files / 237 tests, the 40-route production build, and local `1280 x 720` browser inspection pass; one canvas renders with zero local console warnings/errors, and frames `1.4s` apart show downstream water motion.
- Performance boundary: one canvas, DPR at most `1.25`, at most 9,000 piano points in one draw, 7,200 three-blade grass clumps in one instanced draw, 46 trees in two draws, five fixed rocks, 160 wildflower points, 180 motes, one water shader, no post-processing or real-time shadows, animation paused for hidden/reduced-motion states.
- Safe exposure: no-index proof only; canonical Home and Projects remain unchanged.
- Deployment: previous candidate `dpl_42cLHfRnkFoEDBY92CrZKLpMNd7u` is Ready but revision-requested; replacement pending.
- Loading correction: the piano now owns an isolated Suspense boundary, so a slow GLTF no longer blanks the environmental world.
- Next exact action: commit and deploy the path-carved replacement, then collect only composition, grass, river direction, aliveness, and target-machine smoothness review.

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
- Focused lint, TypeScript, all 57 test files / 237 tests, the 40-route production build, and local browser inspection pass. Production verification remains pending.
