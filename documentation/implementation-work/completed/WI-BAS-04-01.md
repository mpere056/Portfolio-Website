# WI-BAS-04-01: Decide The Runtime Maintenance Path

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `BAS-04` |
| Capabilities | `CAP-BAS-004` |
| Requirements | Platform |
| Outcome | `O-00` |
| Milestone | Current runtime support is verified and a bounded stay-or-upgrade path is recorded |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-14 |
| Last update | 2026-07-14 |

## Acceptance

Official Node.js, Next.js, and Vercel support constraints plus the linked project's actual runtime setting are recorded; the current build is probed against the safest supported target without modifying the production lockfile; and a reviewed decision names urgency, package boundaries, verification, and rollback.

## Resume Packet

### Current Truth

- State in one sentence: The runtime decision is accepted; Node.js 24 and a narrow security bridge are next, followed by a separate Next.js 16 migration.
- Works now: The existing lockfile passes tests and production builds under Node.js `22.23.1` and `24.18.0`; the effective Vercel Node.js 20 selection and dated failure warning are documented.
- Incomplete or stubbed: `BAS-06` and `BAS-07` implementation, preview, production promotion, and framework-level browser/visual verification remain.
- Safe exposure: Decision and test work only; do not alter the production dependency graph or Vercel setting in this package.

### Known-Good Point

- Commit: `a894aafb15853ba90957c5f1698c5059fb6f0434`
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`
- Verification command: Existing `npm test` and `npm run build` under isolated Node.js 22 and 24 runtimes.
- Verification result: Both runtimes pass 2 files and 5 tests; both generate 24 of 24 static pages without package or lockfile writes.
- Route/preview: Existing production domains from `BAS-01`; no runtime changes made.
- Feature flags: None.
- Browser/test data: Public repository and deployment metadata only.

### Restart Here

- Next exact action: No restart is required for this completed item; create `WI-BAS-06-01` from the accepted runtime decision.
- First files/symbols: `package.json#engines`, lockfile dependencies, Vercel Node setting, and a new runtime-policy test.
- Expected observable result: Node.js 24 tests/build pass after the narrow bridge, the audit delta is reviewed, and preview is ready for promotion.
- Only after that: Align production, verify live routes, and begin `BAS-07` separately.

### Context That Must Survive

- Decisions and rejected alternatives: Use Node.js 24, not 22; do not retain Node.js 20; do not combine the urgent bridge with the Next.js 16 / React 19 migration.
- Assumptions still unproven: Exact post-remediation audit exposure and Next.js 16 browser/3D behavior require their implementation packages.
- Relevant plan sections: `08-Platform-Quality-And-Rollout.md`, `13-Execution-Work-Packages.md`, and `16-Progress-Dashboard.md`.
- Evidence: `EV-BAS-04-01` through `EV-BAS-04-04` accepted.
- Known failures or traps: The repository engine overrides Vercel's dashboard setting; Node.js 20 builds fail on or after 2026-10-01; broad ecosystem upgrades need separate preview and rollback gates.
- Uncommitted/external work: `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` are unrelated and must remain unstaged.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `BAS-01` | resolved | Runtime and build baseline exists |
| External | Node.js / Next.js / Vercel support policies | resolved | Current official primary sources recorded |
| External | Linked Vercel project setting | resolved | Node.js `22.x` setting inspected; repository engine override confirmed |

## Implementation Checklist

- [x] Inspect local runtime, framework, dependency, and linked-project metadata.
- [x] Verify current official Node.js, Next.js, and Vercel support constraints.
- [x] Inspect the linked Vercel project's configured Node runtime.
- [x] Run a lockfile-preserving compatibility probe against the safest supported target.
- [x] Record stay/upgrade decision, urgency, package boundary, and rollback path.
- [x] Run current tests and production build as regression evidence.
- [x] Reconcile capability, evidence, dashboard, registry, and package state.

## Files And Entry Points

| Path or symbol | Why it matters | Current state |
| --- | --- | --- |
| `package.json` | Node engine and direct dependency policy | inspected |
| `package-lock.json` | Resolved dependency graph and lockfile format | inspected |
| `next.config.mjs` | Framework runtime configuration | inspected |
| `.vercel/project.json` | Linked Vercel project identity | inspected |
| `documentation/implementation-baselines/2026-07-14-Technical-Baseline.md` | Current passing runtime evidence | inspected |
| `documentation/implementation-baselines/2026-07-14-Runtime-Maintenance-Decision.md` | Accepted support, sequencing, and rollback decision | complete |
| `documentation/implementation-evidence/BAS-04.md` | Durable decision, compatibility, security, and production evidence | complete |

## Open Questions

- None for this package. Implementation discoveries belong to `BAS-06` or `BAS-07`.

## Updates

### 2026-07-14 - Runtime maintenance decision started

- State: ready -> in-progress
- Changed: Created the bounded decision work item and recorded the current local and linked-project configuration.
- Verified: Current `main` is `a894aaf`; unrelated worktree changes remain outside scope.
- Remaining: Official support matrix, Vercel setting, compatibility probe, decision, evidence, and tracking reconciliation.
- Decision: Keep any dependency/runtime migration in a separate package.
- Next: Verify current official support constraints.
- Commit: uncommitted

### 2026-07-14 - Runtime maintenance decision completed

- State: in-progress -> done
- Changed: Accepted Node.js 24 as the runtime target and split the urgent security bridge from the Next.js 16 ecosystem migration.
- Verified: Official support policies; linked Vercel setting and production logs; Node.js 22/24 tests and builds; production dependency audit and source migration hotspots.
- Remaining: Execute `BAS-06`, then `BAS-07`; no runtime or dependency setting changed in this package.
- Decision: `BAS-06` owns Node.js 24 plus the narrow security bridge; `BAS-07` owns Next.js 16, React 19, 3D, route, lint, middleware, API, browser, and visual migration gates.
- Next: Create `WI-BAS-06-01`.
- Commit: `624c57d811b427dfe3dce2735deb69128bfc9a11`

## Completion Summary

Completed with `EV-BAS-04-01` through `EV-BAS-04-04`. The package establishes an evidence-backed, rollback-safe path off unsupported production software without mixing the urgent bridge with the larger visitor-risking framework migration.
