# ART-11 Evidence

## EV-ART-11-01: Dynamic Scene Maturation Candidate

Status: candidate.

The complete representative matrix now covers Museum, LifeInbox, Dreamlife, Sudoku Together, Home, About, the global AI, and reading. A typed audit enforces route distinction, named causality, one dominant scheduler or fewer, hidden-page behavior, reduced-motion settlement, stable fallbacks, and passive-reading restraint without introducing a shared renderer.

Implementation corrections:

- Home explicitly suspends its React Three Fiber loop while hidden and uses demand rendering with no star drift or auto-rotation under reduced motion.
- About explicitly suspends while hidden, uses demand rendering and instant event navigation under reduced motion, and cancels its event-bounded animation frame during cleanup.
- Existing Museum and LifeInbox Canvas renderers retain intersection, document visibility, reduced-motion, observer, frame, and drawing cleanup.
- The Sudoku participant interval remains classified as product behavior rather than ornamental visual motion and retains owning-effect cleanup.

Verification:

- The typed eight-route matrix and deliberately invalid fixtures pass.
- The focused dynamic/supporting scene gate passes eight tests.
- Aggregate content, TypeScript, lint, test, build, and bounded route-swap results are recorded in the work item after execution.

Not claimed: Preview, Production, sustained frame-time observation, cross-browser WebGL/context-loss recovery, or Mark acceptance.

## EV-ART-11-02: Phase 4 Dynamic Production Promotion

Status: accepted for rollout.

Commit `9c3a743b4702314701b745b4a942d570d2696176` was pushed to GitHub `mpere056/Portfolio-Website` on `main`. Vercel Git deployment `dpl_3yZjFfqRdZQe5S1PnrHXSCRVq8yv` reached `READY` and `PROMOTED` on the Hobby plan with Node.js 24.

Public browser verification passed:

- `https://marknperera.ca/` serves the Home scene marker.
- `https://marknperera.ca/about` serves the About scene marker.
- `https://marknperera.ca/projects` serves the project Museum.
- `https://dreamlife.marknperera.ca/` serves Dreamlife.
- `https://lifeinbox.marknperera.ca/` serves LifeInbox.
- `https://sudokutogether.marknperera.ca/` serves Sudoku Together.

Not claimed: sustained frame-time observation, cross-browser WebGL/context-loss recovery, or Mark creative acceptance.
