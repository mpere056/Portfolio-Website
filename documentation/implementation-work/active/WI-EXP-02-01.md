# WI-EXP-02-01: Establish The First Controlled Depth Primitive

## Properties

| Field | Value |
| --- | --- |
| State | in-progress |
| Priority | high |
| Package | `EXP-02` |
| Capabilities | `CAP-EXP-003`, `CAP-EXP-004` |
| Requirements | `V-01`, `V-02`, `V-03` |
| Outcome | `O-01` |
| Milestone | One controlled consumer applies the shared five-stage grammar to persistence and AI context without dictating project visuals |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

Build a headless controller around the accepted transition engine; apply accepted transitions to exploration depth/checkpoint state and source-owned AI context; expose current stage, expected next interaction, retreat/reset/restore, and cleanup; reject invalid transitions without store mutation; prove the behavior through a controlled consumer integration test; keep current routes and visuals unchanged.

## Resume Packet

### Current Truth

- Works now: Pure transition rules cover all five stages, reason-specific adjacent progression, one-step retreat, reset, semantic restore, typed action emission, checkpoint output, AI-context output, and rejection paths.
- Incomplete: No controller applies those outputs to stores; no mounted consumer or browser test exists; tour hints, history, visuals, keyboard/pointer behavior, and stimulation remain later increments.
- Safe exposure: `src/lib/experience/depth.ts` is dormant and has no current component imports.

### Known-Good Point

- Commit: `4c9b02acac37fbaf5fbf45e30588e3a96bc24eee`.
- Verification: 68 tests in 19 files, `npx tsc --noEmit`, content validation, and `npm run build` pass.
- Evidence: `EV-EXP-02-01` accepted for the pure transition contract.

### Restart Here

- Next exact action: Implement a headless controller that owns current `DepthState`, calls `transitionDepth`, records accepted depth/checkpoints in `createExplorationStore`, pushes one source-owned context into `createPortfolioAIContextStore`, and cleans that context on dispose.
- First files: `src/lib/experience/depth.ts`, `src/lib/experience/store.ts`, `src/lib/ai/context.ts`, and a new controlled integration fixture.
- Expected result: Accepted transitions update all three semantic surfaces once; rejected transitions update none; dispose removes controller-owned AI context.
- Only after that: Mount one lightweight controlled component and choose browser automation for pointer, keyboard, and history behavior.

## Dependencies And Boundaries

| Type | Reference | State | Consequence |
| --- | --- | --- | --- |
| Package | `QA-01` | resolved | Integrated foundations are accepted |
| Package | `EXP-01` | resolved | Versioned persistence and checkpoint store available |
| Package | `AI-01` | resolved | Source-owned nested context available |
| Scope | `EXP-05` stimulation | deferred | Do not invent final stimulation mapping here |
| Scope | `EXP-03` First Note | deferred | Do not couple the generic controller to the intro |

## Implementation Checklist

- [x] Define ordered stages and explicit transition reasons.
- [x] Reject skips, wrong reasons, and destination mismatches.
- [x] Emit typed action, checkpoint, and AI context from accepted transitions.
- [ ] Apply accepted outputs through a headless controller.
- [ ] Prove persistence/context synchronization and cleanup.
- [ ] Mount one controlled consumer without redesigning current pages.
- [ ] Add browser coverage once a user interaction exists.
- [ ] Complete package evidence and rollout decision.
