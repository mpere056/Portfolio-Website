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
| Milestone | Selected Museum and LifeInbox art packets are concrete enough to hand off to runtime foundation and remediation packages without reconstructing intent |
| Owner | Mark and Codex |
| Branch/worktree | `main` |
| Created | 2026-07-18 |
| Last update | 2026-07-18 |

## Acceptance

Mark selects the portfolio-level direction and Museum composition; Museum and LifeInbox keyframes demonstrate distinct silhouette, material, hierarchy, and depth; complete art packets connect them to real content, semantic inputs, utility placement, calm/fallback behavior, and performance constraints; and at least one alternative is rejected explicitly before production styling resumes.

## Resume Packet

### Current Truth

- State in one sentence: Mark selected the Impossible Observatory of Living Instruments; its cross-plan integration, surface coverage, and delivery boundaries are documented; three real-content keyframe briefs are ready for visual production.
- Works now: `CAP-ART-001` has an accepted direction decision; Museum, LifeInbox Handle, and LifeInbox Understand have implementation-specific briefs; `ART-01` now ends at accepted art packets rather than hiding implementation and rollout inside one package.
- Incomplete or stubbed: rendered alternatives, rejection rationale, selected Museum composition, complete Museum/LifeInbox art packets, and Mark's packet review remain.
- Safe exposure: current Production remains functional; its aesthetic execution is explicitly under revision rather than treated as the final target.

### Known-Good Point

- Commit: `519dd47` integrates the selected Observatory, art packets, route coverage, and `ART-01` through `ART-06` delivery boundaries across the implementation program.
- Branch/worktree: `main`; unrelated local changes remain outside this work item.
- Verification command: `npm exec vitest run tests/planningIntegrity.test.ts` after all tracking updates.
- Verification result: all seven planning-integrity checks pass; 39 test files and 158 tests pass; strict TypeScript and 50-node/19-relationship content validation pass.
- Route/preview: `https://www.marknperera.ca/projects?stage=understand#lifeinbox`; direction-selection deployment `dpl_8pdvQ6fH9HDgoXaPm8gZs5KxwWxc` is Ready.
- Feature flags: current Phase 3 production flags remain on; no aesthetic prototype is exposed yet.
- Browser/test data: live desktop audit at LifeInbox Signal, Approach, and Understand states.

### Restart Here

- Next exact action: produce the three Museum Signal visual keyframes from `2026-07-18-First-Art-Direction-Keyframe-Briefs.md`, including one phenomenon-led, one artifact-led, and one painterly/diagrammatic composition.
- First files/symbols: the selection decision, first keyframe briefs, current museum production screenshot, `MuseumShell.module.css`, and `MuseumShell.tsx`.
- Expected observable result: three comparable full-desktop museum images using the same real project set and utility requirements, plus one explicit rejection rationale.
- Only after that: produce LifeInbox Handle/Understand keyframes, complete the art packets, review them with Mark, then hand implementation to `ART-02` and `ART-03`.

### Context That Must Survive

- Decisions and rejected alternatives: the Impossible Observatory is dominant; instruments provide causal precision; human artifacts provide warmth; equal card grids, nested dark panels, decorative glow, and universal pills cannot carry the primary composition.
- Assumptions still unproven: exact palette concentration, degree of organic unease, typography, and how much painterly texture each project can carry without losing clarity.
- Relevant plan sections: `18-Art-Direction-And-Aesthetic-Quality.md`, `19-Aesthetic-System-Integration-And-Delivery.md`, `05-Projects-Museum-And-Case-Studies.md`, `08-Platform-Quality-And-Rollout.md`.
- Evidence: `EV-ART-01-01` accepts direction selection; keyframe and packet evidence remains open.
- Known failures or traps: do not “improve” the current grid only with stronger colors, shadows, 3D tilt, or animation; do not start Dreamlife/Sudoku styling before their dialect keyframes.
- Uncommitted/external work: `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` are unrelated.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Feedback | Mark's aesthetic concern | resolved | Generic visual treatment is explicitly rejected. |
| Review | Impossible Observatory of Living Instruments | resolved | Mark selected the synthesis with a stronger abstract Observatory emphasis. |
| Downstream | `ART-02` aesthetic runtime foundation | waiting | Selected Museum/LifeInbox packets define which shared roles are real. |
| Downstream | `ART-03` and `QA-02` creative re-review | waiting | Accepted packets and runtime foundation must exist before remediation. |
| Downstream | `ART-04`, then `PRJ-05` to `PRJ-07` | waiting | Representative remediation must pass before remaining dialects multiply. |

## Implementation Checklist

- [x] Audit the live museum and LifeInbox aesthetic patterns.
- [x] Define non-negotiables and an explicit generic-pattern rejection list.
- [x] Define shared depth responsibilities and three project dialect starting points.
- [x] Prepare three coherent direction options and a recommended synthesis.
- [x] Record Mark's selected or refined direction.
- [x] Translate the selected direction into Museum, LifeInbox Handle, and LifeInbox Understand keyframe briefs.
- [ ] Produce three Museum alternatives and reject at least one explicitly.
- [ ] Select or revise one Museum composition with Mark.
- [ ] Produce LifeInbox Handle and Understand keyframes in the selected world.
- [ ] Complete Museum and LifeInbox art packets and register selection evidence.

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

### 2026-07-18 - Aesthetic direction integrated across delivery plans

- State: in-progress -> in-progress
- Changed: added the six-layer integration model, art-packet contract, route coverage matrix, and `ART-01` through `ART-06` package boundaries; aligned architecture, experience, graph, AI, projects, About, living state, QA, tracking, evidence, and later mobile preparation.
- Verified: seven planning-integrity checks, all 39 test files/158 tests, strict TypeScript, package counts, dependency resolution, route coverage, and changed-file whitespace pass.
- Remaining: rendered Museum alternatives, selection/rejection review, LifeInbox keyframes, and accepted packet evidence.
- Decision: `ART-01` ends at accepted packets; `ART-02` owns proven runtime roles; `ART-03` owns first-slice remediation and renewed creative QA.
- Next: produce three Museum Signal visual keyframes and reject one explicitly.
- Commit: `519dd47`
