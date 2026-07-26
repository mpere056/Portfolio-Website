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

Checkpoint `B` is implemented locally on the private `/home-world-proof` route. It uses one fixed React Three Fiber scene with a finite terrain patch, the existing piano model, 760 shader-swayed grass instances, 18 low-poly horizon trees, two cloud groups, restrained camera breathing, capped DPR, no post-processing, no real-time shadows, no orbit controls, and no game-world navigation.

Canonical `/` and `/projects` remain unchanged. The pianist, practice screens, environment preview, selected states, project reveal, and navigation migration do not exist.

## Resume Packet

- Known-good deployed commit: `3d60173` on `main`.
- Current implementation: Checkpoint `B` candidate is committed, pushed, and deployed.
- Review route: `https://www.marknperera.ca/home-world-proof`.
- Verification: focused lint, TypeScript, content validation, all 57 test files / 237 tests, the 40-route production build, and live `200` smoke checks pass.
- Performance boundary: one canvas, DPR at most `1.25`, 760 grass instances in one draw, 18 trees in two draws, no post-processing or real-time shadows, animation paused for hidden/reduced-motion states.
- Safe exposure: no-index proof only; canonical Home and Projects remain unchanged.
- Deployment: `dpl_3zdgVT65tW7z3XENPRCMn4Ec1T3d`.
- Next exact action: collect only the clearing composition, style, aliveness, framing, and target-machine smoothness review.

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
