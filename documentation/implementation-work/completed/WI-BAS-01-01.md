# WI-BAS-01-01: Capture The Technical Baseline

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `BAS-01` |
| Capabilities | `CAP-BAS-001` |
| Requirements | Platform |
| Outcome | `O-00` |
| Milestone | Current application build, tests, routes, assets, and warnings are reproducibly documented |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-14 |
| Last update | 2026-07-14 |

## Acceptance

A durable baseline records the current runtime and dependency environment, production build and route output, lint and test results, major static and 3D asset sizes, known warnings, and exact reproduction commands; the production build passes without modifying unrelated user work.

## Resume Packet

### Current Truth

- State in one sentence: The technical baseline is complete and supported by four accepted evidence records.
- Works now: Production build, lint, tests, route output, asset inventory, content-media integrity, and four public domains are documented and reproducible.
- Incomplete or stubbed: Frame-time, heap, model-load, AI-idle, and Vercel-build measurements need the later browser harness.
- Safe exposure: Documentation-only package; no visitor behavior changed.

### Known-Good Point

- Commit: `c924104d4785e152245570d1d3c219a579a65cf0`
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`
- Verification command: Portable-Node `npm run build`, `npm test`, asset inventory commands, and public-route HTTP checks recorded in the baseline.
- Verification result: Build passed; 24 static pages generated; one test file and two tests passed; all four public entry points returned `200` with distinct project content.
- Route/preview: `marknperera.ca`, LifeInbox, Sudoku Together, and Dreamlife production domains verified.
- Feature flags: None introduced.
- Browser/test data: Synthetic or public data only; no private values inspected.

### Restart Here

- Next exact action: Start `BAS-02` with a new work item and inventory authored content, routes, existing IDs, and missing IDs.
- First files/symbols: `src/content/`, `src/lib/projects.ts`, `src/lib/timeline.ts`, `src/lib/siteBlogs.ts`, and `src/lib/projectSites.ts`.
- Expected observable result: A reviewed content-node inventory that can support the stable-ID policy.
- Only after that: Begin `ARC-01` once the content inventory is complete.

### Context That Must Survive

- Decisions and rejected alternatives: Begin with measurement; do not mix runtime upgrades or feature implementation into `BAS-01`.
- Assumptions still unproven: Repeatable browser performance metrics and Vercel build timing require later harness work.
- Relevant plan sections: `08-Platform-Quality-And-Rollout.md`, `13-Execution-Work-Packages.md`, and `16-Progress-Dashboard.md`.
- Evidence: `EV-BAS-01-01` through `EV-BAS-01-04` in `documentation/implementation-evidence/BAS-01.md`.
- Known failures or traps: Portable Node must be prepended to `PATH`; existing unrelated worktree changes must not be staged, reverted, or overwritten.
- Uncommitted/external work: The unrelated paths listed in Known-Good Point are outside this work item.

## Dependencies And Blockers

| Type | Reference | State | Restart condition or consequence |
| --- | --- | --- | --- |
| Package | `BAS-01` | resolved | Baseline document, passing build, tests, asset inventory, and live-route evidence exist |

## Implementation Checklist

- [x] Record runtime, package-manager, framework, and dependency baseline.
- [x] Run and record a production build including route sizes and warnings.
- [x] Run and record lint and deterministic tests.
- [x] Inventory the largest static, image, audio, and 3D assets.
- [x] Record current route and subdomain architecture relevant to later checks.
- [x] Create durable baseline and evidence documents.
- [x] Reconcile capability, dashboard, registry, and package state.

## Files And Entry Points

| Path or symbol | Why it matters | Current state |
| --- | --- | --- |
| `package.json` | Scripts, engines, and dependency versions | inspected |
| `package-lock.json` | Reproducible dependency graph | inspected |
| `next.config.mjs` | Build and runtime configuration | inspected |
| `src/app/` | Route inventory | inspected |
| `public/` | Static and 3D asset inventory | inspected |

## Open Questions

- None blocking. The build passes with the unrelated content edit present and explicitly disclosed in the baseline.

## Updates

### 2026-07-14 - Baseline capture started

- State: ready -> in-progress
- Changed: Created the work item and bounded the baseline acceptance criteria.
- Verified: `main` matches `origin/main` at `c924104`; unrelated worktree changes identified.
- Remaining: Runtime, build, lint, tests, assets, warnings, and evidence.
- Decision: Keep runtime upgrades in `BAS-04`, not this package.
- Next: Record Node/npm versions and run the production build.
- Commit: uncommitted

### 2026-07-14 - Technical baseline accepted

- State: in-progress -> done
- Changed: Recorded runtime, dependencies, build routes, warnings, tests, static assets, models, content-media gaps, configuration surface, and production domains.
- Verified: `EV-BAS-01-01` through `EV-BAS-01-04`.
- Remaining: Browser frame-time, heap, model-load, AI-idle, and Vercel build timing move to `QA-01`/`QA-04`; warnings and missing media require separate work.
- Decision: Close `BAS-01` without mixing fixes or runtime upgrades into the measurement package.
- Next: Create the `BAS-02` content-inventory work item.
- Commit: baseline implementation commit pending

## Completion Summary

- Final result: Current technical behavior is reproducibly documented in `documentation/implementation-baselines/2026-07-14-Technical-Baseline.md`.
- Capability states changed: `CAP-BAS-001` moved from `unassessed` to `verified`; all applicable dimensions are accepted.
- Evidence IDs: `EV-BAS-01-01`, `EV-BAS-01-02`, `EV-BAS-01-03`, `EV-BAS-01-04`.
- Remaining work moved to: `QA-01`, `QA-04`, and future focused warning/media work items.
- Final commit/deployment: Documentation commit pending; no deployment needed.
- Closed by and date: Codex, 2026-07-14.
