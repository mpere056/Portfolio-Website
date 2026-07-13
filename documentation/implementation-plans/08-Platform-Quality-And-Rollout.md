# Platform, Quality, And Rollout Plan

Last updated: 2026-07-14

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

Add a typed feature registry.

Candidate flags:

- `experienceFoundation`
- `firstNote`
- `guidedTour`
- `globalAI`
- `semanticLighting`
- `museumV2`
- `dreamlifeExperience`
- `lifeinboxExperience`
- `sudokuExperience`
- `memoryRoomPrototype`
- `skillEvidencePrototype`
- `ambientPresence`

Support:

- Local development overrides.
- Preview-deployment defaults.
- Production defaults.
- No visitor-controlled query parameter enabling sensitive unfinished content.

Remove flags after stable rollout rather than accumulating permanent branches.

## Runtime And Dependency Maintenance

The repository currently targets Node `>=18.17 <21` and Next.js 14.2.3.

Before the implementation program grows:

- Reconfirm the supported Vercel Node runtime.
- Plan the previously warned Node runtime upgrade before the hosting deadline.
- Verify Next.js, AI SDK, React Three Fiber, Three.js, and Supabase compatibility together.
- Upgrade through a dedicated maintenance change, not inside a flagship-experience branch.
- Capture build and visual baselines before and after dependency upgrades.

Do not mix major framework upgrades with the first museum vertical slice.

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

### Manual Creative QA

Automation cannot evaluate taste, mystery, pacing, or whether an interaction feels intuitive.

For every milestone, manually review:

- Does the next action feel discoverable?
- Is there too much explanation?
- Does the interaction reveal truth?
- Is the calm version still beautiful?
- Does the deeper layer feel earned?
- Are sound and lighting tasteful?

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
