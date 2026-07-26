# Piano Clearing Home World Plan

Last updated: 2026-07-26

## Metadata

| Field | Value |
| --- | --- |
| Plan ID | `PIANO-CLEARING-HOME` |
| Status | Active; first environmental proof in review |
| Decision | [Piano Clearing Home Reset](2026-07-26-Piano-Clearing-Home-Reset-Decision.md) |
| Supersedes | [Plan 21](21-Home-Practice-World-And-Attention-Compositor.md) |
| Work item | [WI-ART-16-01](../implementation-work/active/WI-ART-16-01.md) |
| Review route | `/home-world-proof` |
| Public exposure | None; canonical `/` and `/projects` remain unchanged |

## Objective

Build a highly optimized, cinematic outdoor Home world centered on the existing grand piano. Establish the place first. Add the pianist, category instruments, environmental preview, selected category states, and project depth only through later accepted checkpoints.

## Scene Grammar

### Permanent Layer

The permanent layer makes every later state feel like the same place:

- fixed clearing footprint;
- grand piano and its ground contact;
- authored camera and focal hierarchy;
- bounded terrain and horizon;
- shared sky, fog, and light direction;
- one coordinated scene clock and lifecycle owner.

### Later Figure Layer

A deliberately simple pianist gives the piano purpose and provides the About entry. The figure should communicate posture, timing, and presence with very few bones or shapes. It is not built until the empty clearing is accepted.

### Later Practice Instruments

Four screens are spatial instruments, not overlay cards. Their exact form, position, material, and legibility are feedback-gated. They must:

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

Preview should modify atmosphere rather than scale the screen dramatically. Selected state may be visually extensive but still uses one runtime and preserves a coherent transition from the clearing.

## First Proof Implementation

The initial implementation intentionally contains:

- one React Three Fiber canvas;
- one 46 by 34 unit displaced terrain patch;
- the existing grand piano model;
- 760 instanced crossed grass blades in one draw;
- 18 low-poly horizon trees in two instanced draws;
- three low-poly horizon masses;
- two slow cloud groups;
- one sky shader, hemisphere light, directional light, fog, and a fake piano contact shadow;
- fixed camera with at most `0.24` world units of pointer travel;
- DPR capped at `1.25`;
- no orbit controls, post-processing, real-time shadows, physics, or per-blade JavaScript animation.

## Ordered Checkpoints

| Checkpoint | State | Deliverable | Gate |
| --- | --- | --- | --- |
| `A` Direction reset | accepted | Decision, supersession, scene boundary, and later interaction contract | Plans and tracking agree |
| `B` Empty clearing | in-review | Piano, terrain, grass, horizon, sky, light, wind, and fixed camera | Mark accepts composition, style, visibility, atmosphere, and smoothness |
| `C` Pianist | not-started | Minimal seated figure and restrained playing loop | Figure reads clearly, fits the style, and links to About without stealing focus |
| `D` Practice instruments | not-started | Four screen forms and spatial arrangement | One-screen readability, keyboard semantics, and piano hierarchy pass |
| `E` One preview state | not-started | One practice influences the clearing translucently on local attention | Reversible, local, tasteful, and smooth |
| `F` One selected state | not-started | The same practice becomes the primary environment on selection | Continuity, lifecycle, URL intent, and performance pass |
| `G` Four practices | not-started | Remaining three preview/selected environments | Distinct but cohesive; one active runtime |
| `H` Project and navigation depth | not-started | Project reveal, About handoff, AI/tour context, history, restore, and `/projects` compatibility | Deep links, Back, refresh, and exact return pass |
| `I` Release | not-started | Preview, performance, rollback, Production, and Mark acceptance | Public Home replacement is separately approved |

## Checkpoint B Acceptance

Mark reviews only a short list:

1. Does this feel like the right outdoor world?
2. Is the piano the right size, position, angle, and visual focus?
3. Do grass, terrain, horizon, sky, and lighting feel cohesive rather than like primitives?
4. Is the scene alive enough while remaining calm?
5. Does it remain smooth on the computers that struggled with earlier proofs?

Checkpoint `B` is not accepted merely because it builds or performs well. Visual acceptance is required before the pianist or screens begin.

## Performance Evidence

For every checkpoint record:

- DPR policy;
- draw-call and instance strategy;
- moving systems and their owner;
- hidden-tab and reduced-motion behavior;
- test and production-build results;
- browser frame behavior on at least one lower-capability machine before public migration.

If performance degrades, reduce world detail before adding adaptive complexity. This Home should feel authored because of composition, light, timing, and material relationships, not because it contains many objects.

## Resume Point

- Checkpoint `B` is implemented locally on the no-index proof route.
- Focused lint, TypeScript, content validation, eight focused tests, and the 40-route production build pass.
- Mark has not reviewed the rendered clearing.
- Exact next action: deploy the private proof and collect only the five Checkpoint `B` answers.
