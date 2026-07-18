# PRJ-03 Evidence

Last updated: 2026-07-18

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `PRJ-03` Museum navigation and identity layers |
| Lifecycle | complete |
| Capability | `CAP-PRJ-004` |
| Work item | `WI-PRJ-03-01` |
| Exposure | Development and Preview on; Production off pending the complete `QA-02` gate |

## EV-PRJ-03-01: Server Views, Signals, Anchors, And Lazy Boundary

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration test |
| Claim | `/projects` can branch through `museumV2` to nine canonical lightweight signals and exact hash-driven Approach state without importing either candidate interaction into the lobby. |
| Evidence | `tests/museumShell.test.tsx`, `tests/featureFlags.test.ts`, and `tests/museumRegistry.test.ts` pass 13 focused cases; strict TypeScript passes. |

## EV-PRJ-03-02: Desktop, Direct-Entry, And Mobile Browser Review

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | browser-flow and visual-review |
| Environment | Local Development with `museumV2=true` |
| Claim | Signals reveal through hover/focus, `#lifeinbox` resolves and scrolls to its Approach panel, keyboard-safe links remain visible, mobile becomes a readable single-column field, and the project-world action resolves canonically. |
| Evidence | DOM and viewport review at desktop and 390x844; exact LifeInbox URL and approach region verified. |

## EV-PRJ-03-03: Rollback, Calm Path, And Build

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test and build |
| Claim | Production keeps `museumV2` disabled, the legacy `ProjectsClient` branch remains intact, muted exploration persists without a recurring autoplay prompt, and the repository builds successfully. |
| Evidence | Production flag assertion, source branch inspection, browser mute/reload flow, zero lint errors with ten pre-existing warnings, 49-node/19-edge validation, and successful Next.js 16.2.10 build. |

## Boundaries After Completion

- Signal and Approach are shared museum behavior; selected product manipulation still belongs to `PRJ-04`.
- The lobby imports no LifeInbox or Sudoku spike component.
- Generalized route/history ownership remains `PRJ-08`.
- Production promotion remains separate from implementation acceptance.

