# Phase 3 Production Promotion Decision

Date: 2026-07-18
Status: Approved for execution after final repository gate
Packages: `EXP-03` through `EXP-06`, `AI-02` through `AI-04`, `PRJ-03`, `LPS-06`, `PRJ-04`, `QA-02`

## Decision

Promote the accepted exploratory shell, museum, and selected LifeInbox experience together. Production enables `experienceFoundation`, `firstNote`, `guidedTour`, `globalAI`, `semanticLighting`, `meaningfulDiscoveries`, `museumV2`, and `lifeinboxExperience`; unimplemented flagship and prototype flags remain off.

This is the first visitor-facing promotion of the new portfolio architecture. It resolves the earlier state where substantial implementation was deployed but deliberately dormant, causing `marknperera.ca` and the project subdomains to appear unchanged.

## Evidence Basis

- Phase 2 shell packages passed local, Preview, and production-safe gates.
- Phase 3 passes 157 tests, strict TypeScript, 50-node/19-relationship validation, lint without errors, and the production build.
- Corrected Preview `dpl_BGDDAtggEihci1DMz4zj1r1vAS9X` proves the museum route and live Firebase/Gemini archive-card response.
- LifeInbox product depth is a separate 7,819-byte chunk and has explicit error, calm, and rollback behavior.

## Rollback

1. Disable `lifeinboxExperience` to retain the museum but reduce LifeInbox to Approach.
2. Disable `museumV2` to restore `ProjectsClient` without removing content or destinations.
3. Disable individual Phase 2 shell flags if a global system causes a production regression.
4. Redeploy the last accepted production commit; no datastore migration is required.

## Scope Boundaries

- Dreamlife and Sudoku remain at Signal/Approach until `PRJ-05` and `PRJ-06`.
- Generalized `/projects/[slug]` history and cross-origin state remain `PRJ-08`.
- `/chat` replacement remains `AI-05`.
- Production verification and deployment ID are appended to `QA-02.md` after promotion.

