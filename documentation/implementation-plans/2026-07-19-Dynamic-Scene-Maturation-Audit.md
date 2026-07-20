# Dynamic Scene Maturation Audit

Date: 2026-07-19
Package: `ART-11`
Status: locally implemented candidate

## Purpose

This audit closes the implementation portion of the Phase 4 dynamic scene sequence without turning its route-owned compositions into one generic engine. Shared policy is limited to lifecycle, temporal restraint, calm behavior, fallback safety, and distinction checks. Materials, silhouettes, drivers, and rendering choices remain owned by each route packet.

## Representative Matrix

| Route | Temporal language | Dominant scheduler | Named cause | Calm and fallback contract |
| --- | --- | ---: | --- | --- |
| Museum | continuous field | 1 Canvas loop | pointer proximity, project selection, graph evidence, stimulation | intersection/visibility pause, reduced-motion still, approved matte |
| LifeInbox | continuous material transformation | 1 Canvas loop | capture, settlement, trust boundary, depth, return | intersection/visibility pause, reduced-motion still, vessel matte |
| Dreamlife | state transitions | 0 | selected future, reaction, depth | CSS/SVG settles; nacre matte remains |
| Sudoku Together | state transitions plus product timer | 0 visual schedulers | truthful ownership, participant arrival, sync, depth | product timer is not ornamental animation; diagram matte remains |
| Home | continuous 3D instrument | 1 React Three Fiber loop | playing the First Note | hidden pages suspend; reduced motion uses demand rendering and no auto-rotation |
| About | event-bounded archive | 1 React Three Fiber loop while active | inspected timeline moment | hidden pages suspend; reduced motion uses demand rendering and instant scroll; rAF cancels on cleanup |
| Global AI | state transitions | 0 | archive open state, context, response activity | stable translucent shell; motion settles under preference |
| Reading | passive scroll | 0 | bounded deliberate reading progress | one rAF maximum per scroll burst, cleanup, no autonomous loop, stable project art |

Sudoku's synthetic participant interval is product behavior: it produces truthful board state and is already cleaned up by its owning effect. It is not counted as a visual scheduler.

## Executable Guardrail

`src/lib/artDirection/dynamicScenePolicy.ts` imports the eight route manifests into a read-only audit matrix. It verifies:

- unique route and layer identities;
- at least five authored layers per representative composition;
- one or fewer dominant visual schedulers;
- hidden-page pause or event-bound behavior;
- reduced-motion settlement and a stable fallback;
- a named product, content, or visitor cause;
- no continuous scheduler on passive reading progress;
- no duplicated full layer signature between routes.

The guardrail audits contracts only. It does not render, normalize, or stylistically merge the scenes.

## Deliberate Distinctions

- Canvas particles belong only to Museum ecology and LifeInbox material settlement.
- WebGL is retained where the pre-existing Home instrument and About archive genuinely benefit from spatial depth; it is not spread across project pages.
- Dreamlife uses refracted choices, while Sudoku uses a legible shared board and version traces.
- AI responds to context and activity without becoming a decorative ambient object.
- Reading remains the quietest class and cannot acquire an autonomous animation loop.

## Verification Boundary

Local deterministic, content, type, lint, aggregate test, production build, and bounded browser route checks can establish an implementation candidate. They do not establish sustained frame-time quality, cross-browser context-loss recovery, public deployment, or creative acceptance. Those remain rollout/review gates and must be recorded against the deployed commit.
