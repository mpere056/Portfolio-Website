# WI-EXP-04-01: Build The Non-Linear Guided Tour

## Properties

| Field | Value |
| --- | --- |
| State | ready |
| Priority | high |
| Package | `EXP-04` |
| Capabilities | `CAP-EXP-007`, `CAP-EXP-008` |
| Requirements | `V-07` |
| Outcome | `O-01` |
| Owner | shared |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

Behind `guidedTour`, a visitor may briefly choose recruiter, client, builder, or explorer; the tour presents a small authored set of destination recommendations in any order, never asks about time, never shows progress/completion, persists role/dismissal/visited suggestions, offers contextual hints without exposing hidden discoveries, resumes after route changes, and can be dismissed or restarted without affecting free exploration.

## Resume Packet

### Current Truth

- Works now: Tour role/state fields exist in the exploration store contract; destination resolution and `KG-05` role-safe candidates are accepted; the global provider can preserve shell UI across routes.
- Incomplete: No authored tour profiles, recommendation selector, tour provider, UI, persistence actions, or route-resume behavior exists; `guidedTour` is disabled everywhere.
- Safe exposure: Development/Preview only; keep free exploration as the default and never present a completion checklist.

### Known-Good Point

- Commit: `aeb3152`.
- Verification: AI context/source fixtures and the prior 100-test Phase 2 checkpoint pass; final aggregate gate remains later.
- Dependencies: `ARC-03`, `EXP-01`, `KG-05`, `AI-02`, and `AI-03` are complete.

### Restart Here

- Next exact action: Define authored role profiles plus a pure recommendation/resume state model against `PersistedTourSlice`; prove any-order selection, visited/dismissed state, and hidden-discovery exclusion before mounting UI.
- First files: `src/lib/portfolioContracts.ts`, `src/lib/experience/store.ts`, `src/lib/content/queries.ts`, `src/lib/destinations.ts`, and feature flags.
- Expected result: Unit fixtures show role selection, deterministic recommendations, out-of-order visits, dismissal, reset, and safe destination resolution.
- Only after that: Add a brief non-literal guide surface to Home and global routes, then browser-test role, branch order, dismiss, and resume.

## Decisions And Boundaries

- Ask role only; never ask available time.
- Recommendations are a compass, not a checklist; no percentages, completion state, or linear lock.
- Hidden discoveries and easter eggs never enter tour profiles or hints.
- Recruiter requires no follow-up interest question; client may use the currently reviewed public project/product paths only.
- Dismissal hides guidance, not content, AI, or exploration state.

## Implementation Checklist

- [ ] Define authored role profiles and pure recommendation state.
- [ ] Add validated store actions for role, visited suggestions, hints, dismiss, and reset.
- [ ] Add brief role entry and non-linear recommendation surface.
- [ ] Route every recommendation through the destination registry.
- [ ] Persist and resume across route changes without completion UI.
- [ ] Keep hidden discoveries outside all tour metadata.
- [ ] Pass any-order, dismiss, resume, invalid-state, and browser flows.
- [ ] Reconcile evidence, capabilities, package status, and the next work item.
