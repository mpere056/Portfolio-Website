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

Mark reviewed the first riverside candidate and found that its piano, grass, and water read at nearly one elevation, the distant mass obscured the sky, and the piano was not framed as the high foreground anchor. The current local Checkpoint `B` candidate therefore rebuilds the scene as an explicit terraced composition: an 8,200-point piano on a high right-foreground plateau, a steep valley wall, a lateral river on the valley floor, a lower opposite hillside and horizon, four cloud groups, 1,100 grass instances, 34 distant trees, 18 riverbank rocks, and 120 wildflower points. It retains one canvas, capped DPR, moving grass and water, restrained camera breathing, and no opaque piano, post-processing, real-time shadows, orbit controls, bridge, train, or game-world navigation.

Canonical `/` and `/projects` remain unchanged. The pianist, practice screens, environment preview, selected states, project reveal, and navigation migration do not exist.

## Resume Packet

- Known-good deployed commit: `cd0b673` on `main`; creative review requested a new elevation composition.
- Current implementation: elevated valley Checkpoint `B` candidate is local and verified; commit, push, and deployment remain.
- Review route: `https://www.marknperera.ca/home-world-proof`.
- Verification: focused lint, TypeScript, all 57 test files / 237 tests, content validation at 62 nodes / 28 relationships, and the 40-route production build pass; deployment checks remain.
- Performance boundary: one canvas, DPR at most `1.25`, at most 8,200 piano points in one draw, 1,100 grass instances in one draw, 34 trees in two draws, 18 instanced rocks, 120 wildflower points, one water shader, no post-processing or real-time shadows, animation paused for hidden/reduced-motion states.
- Safe exposure: no-index proof only; canonical Home and Projects remain unchanged.
- Deployment: previous candidate `dpl_BGi4QF3NKGdn9UBR6vRSnC79vGiA`; replacement pending.
- Headless caveat: software-WebGL does not finish the shared piano GLTF on either this route or the existing music proof; review in a normal target browser.
- Next exact action: commit, push, and deploy the elevated valley candidate, then collect only the elevation, particle-piano framing, pastoral-style, aliveness, and target-machine smoothness review.

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
