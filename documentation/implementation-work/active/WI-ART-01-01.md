# WI-ART-01-01: Establish Portfolio Art Direction

## Properties

| Field | Value |
| --- | --- |
| State | in-progress |
| Priority | high |
| Package | `ART-01` |
| Capabilities | `CAP-ART-001`, `CAP-ART-002` |
| Requirements | `V-03`, `V-04`, `V-22`, `V-31` |
| Outcome | `O-01`, `O-03`, `O-04` |
| Milestone | One selected direction can generate museum and LifeInbox keyframes that no longer read as a generic portfolio UI |
| Owner | Mark and Codex |
| Branch/worktree | `main` |
| Created | 2026-07-18 |
| Last update | 2026-07-18 |

## Acceptance

Mark selects or refines the portfolio-level direction; museum and LifeInbox keyframes demonstrate distinct silhouette, material, hierarchy, and depth; and the renewed creative gate rejects interchangeable card-grid or dashboard treatment before production styling resumes.

## Resume Packet

### Current Truth

- State in one sentence: Mark selected the Impossible Observatory of Living Instruments, the reference language is documented, and three real-content keyframe briefs are ready for visual production.
- Works now: `CAP-ART-001` has an accepted direction decision; museum, LifeInbox Handle, and LifeInbox Understand each have implementation-specific visual briefs while existing functionality remains live.
- Incomplete or stubbed: visual keyframes, a rejected alternative, representative remediation, browser captures, and renewed `QA-02` creative acceptance are not implemented.
- Safe exposure: current Production remains functional; its aesthetic execution is explicitly under revision rather than treated as the final target.

### Known-Good Point

- Commit: `36daf70` before the direction-selection documentation.
- Branch/worktree: `main`; unrelated local changes remain outside this work item.
- Verification command: `npm exec vitest run tests/planningIntegrity.test.ts` after all tracking updates.
- Verification result: planning integrity passes; 39 test files and 157 tests pass; strict TypeScript and 50-node/19-relationship content validation pass.
- Route/preview: `https://www.marknperera.ca/projects?stage=understand#lifeinbox`; current deployment `dpl_9DmzR6FFGnvn6tkyNjPH6pnzEzye` is Ready.
- Feature flags: current Phase 3 production flags remain on; no aesthetic prototype is exposed yet.
- Browser/test data: live desktop audit at LifeInbox Signal, Approach, and Understand states.

### Restart Here

- Next exact action: produce the three Museum Signal visual keyframes from `2026-07-18-First-Art-Direction-Keyframe-Briefs.md`, including one phenomenon-led, one artifact-led, and one painterly/diagrammatic composition.
- First files/symbols: the selection decision, first keyframe briefs, current museum production screenshot, `MuseumShell.module.css`, and `MuseumShell.tsx`.
- Expected observable result: three comparable full-desktop museum images using the same real project set and utility requirements, plus one explicit rejection rationale.
- Only after that: produce LifeInbox Handle/Understand keyframes from the selected museum world, review with Mark, implement one representative flow, and rerun creative `QA-02`.

### Context That Must Survive

- Decisions and rejected alternatives: the Impossible Observatory is dominant; instruments provide causal precision; human artifacts provide warmth; equal card grids, nested dark panels, decorative glow, and universal pills cannot carry the primary composition.
- Assumptions still unproven: exact palette concentration, degree of organic unease, typography, and how much painterly texture each project can carry without losing clarity.
- Relevant plan sections: `18-Art-Direction-And-Aesthetic-Quality.md`, `05-Projects-Museum-And-Case-Studies.md`, `08-Platform-Quality-And-Rollout.md`.
- Evidence: `EV-ART-01-01` accepts direction selection; remediation evidence remains open.
- Known failures or traps: do not “improve” the current grid only with stronger colors, shadows, 3D tilt, or animation; do not start Dreamlife/Sudoku styling before their dialect keyframes.
- Uncommitted/external work: `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` are unrelated.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Feedback | Mark's aesthetic concern | resolved | Generic visual treatment is explicitly rejected. |
| Review | Impossible Observatory of Living Instruments | resolved | Mark selected the synthesis with a stronger abstract Observatory emphasis. |
| Downstream | `QA-02` creative re-review | waiting | Museum/LifeInbox keyframes and remediation must exist first. |
| Downstream | `PRJ-05`, `PRJ-06`, `PRJ-07` | waiting | Each needs an accepted project dialect before visual expansion. |

## Implementation Checklist

- [x] Audit the live museum and LifeInbox aesthetic patterns.
- [x] Define non-negotiables and an explicit generic-pattern rejection list.
- [x] Define shared depth responsibilities and three project dialect starting points.
- [x] Prepare three coherent direction options and a recommended synthesis.
- [x] Record Mark's selected or refined direction.
- [x] Translate the selected direction into Museum, LifeInbox Handle, and LifeInbox Understand keyframe briefs.
- [ ] Produce museum and LifeInbox keyframes plus one rejected alternative.
- [ ] Implement one representative remediation flow.
- [ ] Re-run renewed creative QA and register evidence.

## Open Questions

- How much organic unease can the first keyframes carry while preserving warmth and trust?
- Which museum composition best balances abstract phenomena with unmistakable project identity?

## Updates

### 2026-07-18 - Aesthetic quality promoted to a first-class gate

- State: planned -> in-review
- Changed: audited the live visual language, authored the art-direction plan, prepared three directions, and reopened the insufficient creative gate.
- Verified: planning integrity, full tests, strict TypeScript, and content validation pass; changed-file whitespace check passes.
- Remaining: Mark direction review, keyframes, representative remediation, and creative acceptance.
- Decision: current functional release remains live; aesthetic treatment is not the final target.
- Next: record Mark's direction response.
- Commit: uncommitted

### 2026-07-18 - Impossible Observatory selected and translated into briefs

- State: in-review -> in-progress
- Changed: recorded Mark's abstract-leaning synthesis, analyzed nine references into reusable qualities and guardrails, and authored three real-content keyframe briefs.
- Verified: `EV-ART-01-01` registered and all six planning-integrity checks pass after coordinated registry, capability, dashboard, evidence, and work-item updates.
- Remaining: actual keyframes, selection/rejection review, representative remediation, and renewed creative QA.
- Decision: Impossible Observatory of Living Instruments.
- Next: produce three Museum Signal visual keyframes.
- Commit: uncommitted
