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
| Last update | 2026-07-26 |
| Decision | [Piano Clearing Home Reset](../../implementation-plans/2026-07-26-Piano-Clearing-Home-Reset-Decision.md) |
| Execution plan | [Piano Clearing Home](../../implementation-plans/22-Piano-Clearing-Home-World.md) |

## Current Truth

Mark rejected the full proof-world compositor in `EV-ART-16-02` and requested a drastic reset. Home now targets one bounded outdoor clearing centered on the grand piano. The four project practices remain valid taxonomy, but they will later appear as four diegetic screens. About will later be represented by a simple pianist rather than a fifth territory.

Mark reviewed the first Checkpoint `B` clearing and requested a more specific composition: restore the original particle-built piano; look outward across a grassy overlook toward a visible stream, distant landscape, open sky, and a few clouds; use a warm hand-painted pastoral animation language; and include no bridge or train.

The revised Checkpoint `B` candidate is implemented locally on the private `/home-world-proof` route. It uses one fixed React Three Fiber scene with a 64 by 58 unit sloping river valley, at most 6,200 piano points in one draw, a shader-driven moving stream, 720 shader-swayed grass instances, 22 low-poly horizon trees, three hill masses, three cloud groups, restrained camera breathing, capped DPR, and no opaque piano, post-processing, real-time shadows, orbit controls, bridge, train, or game-world navigation.

Canonical `/` and `/projects` remain unchanged. The pianist, practice screens, environment preview, selected states, project reveal, and navigation migration do not exist.

## Resume Packet

- Known-good deployed commit: `3d60173` on `main`; creative revision requested.
- Current implementation: revised riverside-overlook Checkpoint `B` candidate is local and verified; commit and deployment pending.
- Review route: `https://www.marknperera.ca/home-world-proof`.
- Verification: focused lint, TypeScript, eight focused tests, and the 40-route production build pass.
- Performance boundary: one canvas, DPR at most `1.25`, at most 6,200 piano points in one draw, 720 grass instances in one draw, 22 trees in two draws, one water shader, no post-processing or real-time shadows, animation paused for hidden/reduced-motion states.
- Safe exposure: no-index proof only; canonical Home and Projects remain unchanged.
- Previous deployment: `dpl_3zdgVT65tW7z3XENPRCMn4Ec1T3d`.
- Next exact action: commit and deploy the revision, then collect only the vista, particle-piano, pastoral-style, aliveness, and target-machine smoothness review.

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
