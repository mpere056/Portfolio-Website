# WI-ARC-02-01: Establish Shared Portfolio Contracts

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `ARC-02` |
| Capabilities | `CAP-ARC-002` |
| Requirements | `V-03`, `V-10` |
| Outcome | `O-00` |
| Milestone | Depth, destination, discovery, AI context, archive-card, and project-experience consumers compile from one shared type source |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

Create one canonical TypeScript module for the shared contracts already approved in the architecture plan; prove a representative destination flows through depth, discovery, AI, archive-card, and project-experience consumers; pass tests, lint, and the production build; and do not absorb destination registries, actions, runtime validators, persisted migrations, or UI implementation.

## Resume Packet

### Current Truth

- State in one sentence: The shared contract vocabulary is implemented and locally accepted without visitor-facing behavior changes.
- Works now: Stable template IDs, ordered depth stages, primitive-only safe state, destination references, discovery events, AI context, archive cards, and project-experience manifests share one module and one DreamLife fixture.
- Incomplete or stubbed: Concrete destination entries, fallback resolution, runtime validation, cross-system actions, and persisted migrations remain in `ARC-03` through `ARC-05`.
- Safe exposure: This is compile-time architecture only; existing pages, APIs, navigation, and local storage are unchanged.

### Known-Good Point

- Commit: pending focused contract commit.
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`.
- Verification command: `npm test` and `npm run build` under Node.js 24.
- Verification result: 7 files and 19 tests pass; lint has 0 errors and 11 retained warnings; the Next.js 16 production build passes.
- Route/preview: Not required for this type-only package; the preceding `BAS-08` production deployment remains healthy.
- Feature flags: None; no runtime consumer was activated.

### Restart Here

- Next exact action: Open `WI-ARC-03-01` and inventory the existing main, About, Projects, chat, project-subdomain, and blog destinations before authoring registry data.
- First files/symbols: `src/lib/portfolioContracts.ts`, `src/lib/projectSites.ts`, `src/app`, `src/components`, and proxy host rewrites.
- Expected observable result: Every initial registry entry validates to a known internal route and unknown IDs resolve to an explicit safe fallback.
- Only after that: Add a navigation adapter; do not introduce persisted migrations or a global browser event bus.

### Context That Must Survive

- `ContentNodeId` remains the source for content identity; do not duplicate its namespace rules.
- Safe state is intentionally limited to string, number, and boolean values.
- The five depth stages remain ordered as Signal, Approach, Handle, Enter, Understand.
- `ARC-03`, `ARC-04`, and `ARC-05` boundaries are explicit and must stay separate.
- Unrelated `.gitignore`, Husky, user-edited MDX, temporary repositories, and tooling remain unstaged.

## Implementation Checklist

- [x] Inventory approved cross-system contract shapes.
- [x] Reuse accepted content identity types.
- [x] Implement depth, destination, discovery, AI-context, card, and project-manifest contracts.
- [x] Add a representative cross-consumer fixture.
- [x] Run tests, lint, and the production build.
- [x] Reconcile capability, evidence, package, dashboard, and resume records.

## Updates

### 2026-07-16 - Shared contracts implemented and accepted

- State: ready -> in-progress -> done.
- Changed: Added `portfolioContracts.ts` and a DreamLife consumer fixture spanning destination, depth, discovery, AI context, archive card, and project manifest.
- Verified: 7 test files and 19 tests pass; lint has 0 errors and 11 retained warnings; the production build passes after allowing its existing Google Fonts requests.
- Boundary: No registry data, runtime validation, global actions, persistence, or UI behavior was introduced.
- Evidence: `EV-ARC-02-01` accepted.
- Next: `WI-ARC-03-01`.
- Commit: pending focused contract commit.

## Completion Summary

The portfolio now has one compile-time vocabulary for the cross-system concepts that exploration, AI, projects, and future navigation will share. The package is complete because its type and consumer gates pass without hiding later registry, action, validation, or migration work.
