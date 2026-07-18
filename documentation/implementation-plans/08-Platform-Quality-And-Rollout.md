# Platform, Quality, And Rollout Plan

Last updated: 2026-07-17

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `QA` |
| Status | Active cross-cutting control |
| Upstream | [Architecture](00-System-Architecture-And-Interfaces.md) and every active workstream |
| Downstream | Preview deployments, production releases, rollback evidence |
| Primary outputs | Baseline, feature flags, test harness, quality gates, privacy and rollout controls |
| Execution packages | `BAS-*` and `QA-01` through `QA-06` in [Work Packages](13-Execution-Work-Packages.md) |
| Capability tracking | `CAP-BAS-*` and `CAP-QA-*` in [Capability Ledger](15-Capability-Coverage-Ledger.md) |

## Scope

Provide the technical guardrails that allow an ambitious 3D, AI, audio, persistence, and content-driven experience to ship safely.

## Architecture Boundaries

Keep these systems separate:

- Authored content and graph compilation.
- Client discovery and stimulation state.
- 3D scene state.
- AI conversation and server retrieval.
- Project-specific experience state.
- Visitor presence state if added later.

Do not place all of them in one Zustand store or React context.

## Suggested Ownership

| Concern | Owner |
| --- | --- |
| Public content and relationships | Server/build-time content layer |
| Discovery, tour, stimulation, checkpoint | Persisted client experience store |
| Current route/object AI context | Global AI provider, non-persistent by default |
| 3D object transforms during a visit | Local scene state, selectively serialized |
| Project demo state | Project experience module |
| Living project state | Authored content |
| Ambient presence | Separate later real-time client |

## Feature Flags

The typed registry is implemented in `src/lib/featureFlags.ts`. Current flags are:

- `experienceFoundation`
- `firstNote`
- `guidedTour`
- `globalAI`
- `semanticLighting`
- `meaningfulDiscoveries`
- `museumV2`
- `dreamlifeExperience`
- `lifeinboxExperience`
- `sudokuExperience`
- `memoryRoomPrototype`
- `skillEvidencePrototype`
- `ambientPresence`

Current policy supports:

- Local development overrides.
- Preview-deployment defaults.
- Production defaults.
- No visitor-controlled query parameter enabling sensitive unfinished content.

Remove flags after stable rollout rather than accumulating permanent branches.

## Runtime And Dependency Maintenance

`BAS-06` and `BAS-07` are complete. The repository and Vercel production now target Node.js 24 and Next.js 16.2.10 with React 19.2.7; the React Three Fiber ecosystem, AI routes, middleware/proxy behavior, Firestore retrieval, preview, and rollback gates have passed.

- Keep `package.json` engines, Vercel runtime, and local verification on Node.js 24.
- Treat future major framework/runtime changes as dedicated baseline packages, never as flagship work.
- Re-run route, AI, 3D, visual, Preview, and rollback checks after coordinated dependency changes.
- The current Browserslist-data warning is maintenance debt, not permission to mix dependency refresh into `PRJ-02` through `PRJ-04`.

## Performance Baseline

Record before Phase 1:

- Route bundle sizes.
- First load JS.
- Cold and warm model load times.
- Largest 3D assets and textures.
- Home frame rate on the target desktop machine.
- Memory use after visiting Home, Projects, About, and AI.
- AI shell idle cost.
- Current Vercel build duration.

Use the baseline to set budgets rather than choosing arbitrary numbers now.

## Performance Rules

- Load signal and approach states without the full product experience bundle.
- Lazy-load project-specific experiences.
- Use poster frames or lightweight silhouettes before model readiness.
- Do not mount every project Canvas simultaneously.
- Dispose scenes, textures, observers, audio, and animation frames correctly.
- Cap device pixel ratio and post-processing based on capability and stimulation.
- Keep dormant global AI lightweight.
- Compile graph data into bounded public payloads rather than shipping the full corpus to every route.
- Limit semantic-lighting edges.
- Avoid persisting large transcripts or scene snapshots.

## Capability Tiers

Detect capability without turning it into a user-facing mode screen.

Internal tiers may consider:

- WebGL availability.
- Reduced motion preference.
- Device memory and processor hints where available.
- Pointer precision.
- Viewport.
- Recent frame-time quality.

Use tiers to adjust:

- Particle count.
- Post-processing.
- Texture resolution.
- Model detail.
- Camera motion.
- Audio layering.

Do not remove essential navigation or factual content based on a heuristic.

## Error Boundaries

Add boundaries around:

- Global AI surface.
- Each project experience.
- Each 3D exhibit.
- Memory-room prototype.
- Graph-driven related content.

Fallbacks should preserve the current depth context where possible.

Examples:

- Model fails: show poster and project identity.
- Demo fails: show concise product explanation and retry.
- AI fails: keep ordinary navigation available.
- Relationship data fails: omit semantic lighting and show direct content.

## Testing Strategy

### Unit Tests

- Content schemas and graph queries.
- Discovery migrations and depth transitions.
- Tour recommendations.
- AI context and card validation.
- Project demo state machines.
- Sudoku validity.
- Living-state rules.
- Feature-flag behavior.

### Integration Tests

- First visit and return visit.
- Route and subdomain destination transitions.
- AI card navigation.
- Project depth restoration.
- Tour and free-exploration separation.
- Content-version disturbances.

### Browser Automation

Add Playwright or the project's chosen browser test tooling when the first interactive vertical slice requires repeatable checks.

Initial flows:

- Wake Home and enter a destination.
- Choose a tour role and visit destinations out of order.
- Open global AI and navigate through a card.
- Complete the first flagship demonstration.
- Refresh and verify discovery restoration.
- Use lower stimulation and sound off.

### Visual Regression

Capture stable checkpoints, not every animation frame.

- Home before and after First Note.
- Tour destination view.
- Each project depth stage.
- Exploded case-study selected layers.
- About event inspection.
- AI archive cards.
- Loading, error, empty, and semantic fallback states for each representative route class.
- Standard-stimulation and calm settled frames from the same destination and depth.

### Manual Creative QA

Automation cannot evaluate taste, mystery, pacing, or whether an interaction feels intuitive.

For every milestone, manually review:

- Does the next action feel discoverable?
- Is there too much explanation?
- Does the interaction reveal truth?
- Is the calm version still beautiful?
- Does the deeper layer feel earned?
- Are sound and lighting tasteful?

The 2026-07-18 aesthetic review showed that this checklist was too permissive: a milestone could answer these questions positively while still using an interchangeable dark-card visual system. Manual creative QA now requires the structured record in `18-Art-Direction-And-Aesthetic-Quality.md` and the art-packet, surface-coverage, and delivery gates in `19-Aesthetic-System-Integration-And-Delivery.md`.

For major visual surfaces, `Q: accepted` requires:

- A written emotional and interaction thesis.
- Selected Signal, Approach, and deep-state keyframes using real content.
- At least one rejected alternative with a reason.
- Silhouette, swap, crop, darkness, stillness, deepening, and furniture checks.
- A project-specific material and motion dialect.
- A complete art packet connecting real content, semantic inputs, utility placement, calm/fallback behavior, and performance constraints.
- Stable captures for loading, error, reduced-motion, and semantic fallback states where applicable.
- Mark's explicit review for the direction and representative implementation.

Automated visual regression proves stability, not taste. A stable screenshot of a generic composition is not creative acceptance.

## First Flagship Quality Gate

`QA-02` evaluates the converged `PRJ-04` journey, not isolated components. Its original 2026-07-18 evidence remains valid for contracts, logic, browser behavior, performance, stimulation, Preview, rollout, and rollback. Its creative dimension is reopened after Mark's direct feedback that the live museum and LifeInbox treatment feels too plain and average. `ART-01` supplies selected packets, `ART-02` supplies the minimum runtime foundation, and `ART-03` supplies representative remediation and renewed creative evidence; historical evidence is retained rather than erased.

| Gate | Required proof |
| --- | --- |
| Contract | Supported stages, destinations, state, evidence, and card payloads validate at runtime |
| Logic | Candidate reducer, stage transitions, safe-state parser, and fallback decisions are deterministic |
| Browser | Overview to Approach to Handle to Enter/Understand, Back, refresh, return, and exact fallback paths work |
| Visual | Signal, Approach, interaction, exploded layer, AI card, loading, and error checkpoints are reviewed at stable frames |
| Performance | Lobby does not download all flagship bundles; cold interaction loading and frame-time risks are measured on the target desktop |
| Stimulation | Sound-off, reduced motion, keyboard, pointer/trackpad, and lower-stimulation paths preserve meaning |
| Creative | Product truth, pacing, mystery, depth, distinct project identity, and explanation density receive explicit review |
| Preview | Exact commit is Ready with `museumV2` and only the selected experience enabled; representative main/subdomain routes pass |
| Rollback | Disabling the museum and selected-experience flags restores the legacy Projects path without content or destination loss |

Production promotion is not automatic when `QA-02` passes. Phase 3 satisfied this rule through the separate 2026-07-18 decision, clean commit `4d56565`, Ready production `dpl_61cYUeR8aYVkx6gYYjEbT74adrZc`, live aliases, and documented rollback.

## Stimulation And Input QA

Test:

- Sound off.
- Browser denies audio.
- Reduced motion.
- Keyboard-only core navigation.
- Pointer and trackpad.
- High-frequency wheel input.
- Window resize during experience.
- Tab backgrounding and resume.

Full text duplication of every visual experience is not required. Core routes, project identity, and essential controls must remain understandable.

## Privacy And Security

### Discovery

- Local by default.
- No account requirement.
- Reset control.
- Do not send full discovery history to AI or analytics.

### AI

- Public graph resolution server-side.
- Rate limiting.
- Destination validation.
- Safe output rendering.
- No hidden private nodes.

### Demonstrations

- Synthetic LifeInbox data.
- Deterministic local Sudoku computer participant.
- No production database access from demos.

### Ambient Presence Later

- Anonymous ephemeral session ID.
- No chat, identity, typed content, or exact history.
- Clear opt-out.
- Do not fake activity.

## Observability

Use minimal privacy-respecting events only when needed to answer product questions.

Candidate anonymous events:

- First Note completed.
- Tour started, role selected, dismissed.
- Depth stage reached by destination ID.
- Project demo started/completed.
- AI card opened.
- Experience error code.
- Lower-stimulation control used.

Do not record message content, private inputs, or detailed cursor paths.

Analytics is not required before the corresponding product question exists.

## Rollout Process

For each milestone:

1. Implement behind a flag.
2. Validate deterministic tests.
3. Run production build.
4. Deploy a preview.
5. Complete desktop visual and interaction QA.
6. Check cold-load and failure behavior.
7. Review content accuracy.
8. Enable production gradually where practical.
9. Verify live routes and subdomains.
10. Remove obsolete code after the new path is stable.

## Repository Hygiene

- Keep local toolchains and temporary repository clones out of commits and deployments.
- Do not rely on deleted or bypassed hooks as the only quality gate.
- Document the portable-tool fallback only if it remains necessary.
- Keep commits focused by workstream.
- Avoid committing generated `.next` or local Vercel state.

## Progress And Evidence Operations

`QA-06` keeps implementation status trustworthy while many features remain partially complete.

### At Package Start

- Create a package evidence file from `documentation/implementation-evidence/_Package-Evidence-Template.md`.
- Create or reopen a work item under `documentation/implementation-work/active/`.
- Name the package's capability IDs, owner, branch or worktree, safe exposure, and next checkpoint.
- Reconcile existing capability dimension states before changing them.

### At Every Durable Increment

- Update only dimensions actually changed by inspected work.
- Name remaining gaps for every level `1` or `2`.
- Register candidate or accepted evidence.
- Keep implementation, automated verification, creative QA, and rollout visibly separate.

### At Milestone Review

- Summarize each outcome by stage, last checkpoint, current work, named gaps, and next proof point.
- Do not calculate completion percentages.
- Check every accepted dimension against the evidence registry.
- Flag in-progress records older than 14 days for review.
- Reopen packages invalidated by regressions, contract changes, or content changes.
- Verify every unfinished active item has a reproducible known-good point and exact next action.
- Update the dashboard's reconciliation date and commit.

### Tracking Integrity Checks

- Every active package owns at least one capability.
- Every active capability maps to a requirement or platform criterion.
- Every evidence reference resolves to a registered item.
- Every production rollout claim names a deployed commit and live route.
- Every partial visitor-facing feature records its flag, fallback, and safe environment.
- Package completion agrees with capability dimension states and package exit evidence.
- Dashboard active states resolve to current work-item files.
- Package-state counts come only from package rows; feedback/later markers are reported separately.
- Every accepted evidence ID has one explicit canonical registry row; summary ranges do not substitute for registration.
- Every active work-item file appears exactly once in the active registry and every active registry row resolves to a file.
- Every package ID referenced by a capability exists in the package registry.

Run `npm exec vitest run tests/planningIntegrity.test.ts` at package closure and dashboard reconciliation. The test owns structural parity; human review still owns whether status and evidence claims are truthful.

Tracking quality is part of release quality. A feature whose true partial state cannot be explained is not ready for broader rollout.

## Cross-Plan Handoff

At each phase gate, this plan provides:

- The required test and review checklist.
- Named evidence locations.
- Performance comparison to baseline.
- Feature-flag and fallback verification.
- Privacy and content-accuracy review.
- Preview and production verification steps.

A workstream is not ready for downstream reliance merely because its code compiles; its named quality gate must also pass.

## Completion Criteria

- Architecture ownership is documented in code.
- Feature flags support safe previews.
- Baseline and budgets exist.
- Deterministic core logic is tested.
- One browser flow validates the vertical slice.
- Error fallbacks preserve navigation.
- Privacy boundaries are enforced.
- Production promotion has a repeatable checklist.
- Capability, package, evidence, and dashboard status remain reproducible and reconciled.
