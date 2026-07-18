# WI-ART-01-01: Establish Portfolio Art Direction

## Properties

| Field | Value |
| --- | --- |
| State | in-review |
| Priority | high |
| Package | `ART-01` |
| Capabilities | `CAP-ART-001`, `CAP-ART-002` |
| Requirements | `V-03`, `V-04`, `V-22` |
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

- State in one sentence: the live aesthetic debt is audited, an actionable art-direction plan exists, and three coherent directions await Mark's review.
- Works now: contracts, exploration, museum content, LifeInbox interaction, deployment, and rollback remain live and verified.
- Incomplete or stubbed: no direction is selected; museum and LifeInbox keyframes and remediation are not implemented.
- Safe exposure: current Production remains functional; its aesthetic execution is explicitly under revision rather than treated as the final target.

### Known-Good Point

- Commit: `b5fe180` before the art-direction documentation.
- Branch/worktree: `main`; unrelated local changes remain outside this work item.
- Verification command: `npm exec vitest run tests/planningIntegrity.test.ts` after all tracking updates.
- Verification result: planning integrity passes; 39 test files and 157 tests pass; strict TypeScript and 50-node/19-relationship content validation pass.
- Route/preview: `https://www.marknperera.ca/projects?stage=understand#lifeinbox`; current deployment `dpl_GrUZykoAFe7Vcw6L12FUU5vsrS8n` is Ready.
- Feature flags: current Phase 3 production flags remain on; no aesthetic prototype is exposed yet.
- Browser/test data: live desktop audit at LifeInbox Signal, Approach, and Understand states.

### Restart Here

- Next exact action: record Mark's chosen direction or synthesis and translate it into three museum/LifeInbox static keyframe briefs using current production content.
- First files/symbols: `18-Art-Direction-And-Aesthetic-Quality.md`, `2026-07-18-Aesthetic-Direction-Review.md`, `MuseumShell.module.css`, `MuseumShell.tsx`, and `LifeInboxExperience.tsx`.
- Expected observable result: one selected world and three deliberately different composition briefs are ready for visual keyframing.
- Only after that: produce keyframes, choose one with Mark, implement one representative flow, and rerun the creative portion of `QA-02`.

### Context That Must Survive

- Decisions and rejected alternatives: art direction is now a build input; equal card grids, nested dark panels, decorative glow, and universal pills cannot carry the primary composition.
- Assumptions still unproven: final warmth, surrealism, material balance, typography, and how cinematic the world should feel.
- Relevant plan sections: `18-Art-Direction-And-Aesthetic-Quality.md`, `05-Projects-Museum-And-Case-Studies.md`, `08-Platform-Quality-And-Rollout.md`.
- Evidence: live browser audit and Mark's 2026-07-18 feedback; no acceptance evidence yet.
- Known failures or traps: do not “improve” the current grid only with stronger colors, shadows, 3D tilt, or animation; do not start Dreamlife/Sudoku styling before their dialect keyframes.
- Uncommitted/external work: `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` are unrelated.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Feedback | Mark's aesthetic concern | resolved | Generic visual treatment is explicitly rejected. |
| Review | Direction A, B, C, or synthesis | open | Mark selects or adjusts the starting direction. |
| Downstream | `QA-02` creative re-review | waiting | Museum/LifeInbox keyframes and remediation must exist first. |
| Downstream | `PRJ-05`, `PRJ-06`, `PRJ-07` | waiting | Each needs an accepted project dialect before visual expansion. |

## Implementation Checklist

- [x] Audit the live museum and LifeInbox aesthetic patterns.
- [x] Define non-negotiables and an explicit generic-pattern rejection list.
- [x] Define shared depth responsibilities and three project dialect starting points.
- [x] Prepare three coherent direction options and a recommended synthesis.
- [ ] Record Mark's selected or refined direction.
- [ ] Produce museum and LifeInbox keyframes plus one rejected alternative.
- [ ] Implement one representative remediation flow.
- [ ] Re-run renewed creative QA and register evidence.

## Open Questions

- Which direction or synthesis should anchor the first keyframes?
- Where should the world sit on the precision/surrealism, pristine/human, warm/cool, and intimate/cinematic axes?

## Updates

### 2026-07-18 - Aesthetic quality promoted to a first-class gate

- State: planned -> in-review
- Changed: audited the live visual language, authored the art-direction plan, prepared three directions, and reopened the insufficient creative gate.
- Verified: planning integrity, full tests, strict TypeScript, and content validation pass; changed-file whitespace check passes.
- Remaining: Mark direction review, keyframes, representative remediation, and creative acceptance.
- Decision: current functional release remains live; aesthetic treatment is not the final target.
- Next: record Mark's direction response.
- Commit: uncommitted
