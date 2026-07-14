# WI-BAS-07-01: Modernize The Supported Framework Stack

## Properties

| Field | Value |
| --- | --- |
| State | in-progress |
| Priority | high |
| Package | `BAS-07` |
| Capabilities | `CAP-BAS-007` |
| Requirements | Platform |
| Outcome | `O-00` |
| Milestone | Next.js 16 and the React 19 rendering ecosystem pass local, preview, browser, visual, API, and production gates |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-14 |
| Last update | 2026-07-14 |

## Acceptance

Next.js and `eslint-config-next` use `16.2.10`; React and React DOM use `19.2.7`; React Three Fiber, Drei, and postprocessing use their compatible current majors; dynamic route APIs, ESLint CLI, and proxy convention are migrated; tests and production build pass on Node.js 24; AI and edge routes are explicitly checked; representative 3D and project routes pass browser and visual review; and clean preview, production, live-route, and rollback evidence are accepted.

## Resume Packet

### Current Truth

- State in one sentence: The coordinated Next.js 16, React 19, and React Three Fiber migration passes local automated, browser, visual, API-boundary, and subdomain-rewrite gates; preview and production rollout remain.
- Works now: Node.js 24 runs Next.js `16.2.10`, React `19.2.7`, the compatible 3D package set, 6 passing tests, 24 generated pages, the proxy rewrite, and all representative visitor routes without browser application errors.
- Incomplete or stubbed: Clean Vercel preview, production promotion, public route checks, deployment rollback evidence, and final tracking reconciliation remain.
- Safe exposure: Production remains on the accepted `BAS-06` deployment until the clean exact-commit preview passes.

### Known-Good Point

- Commit: `dc22086`
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`, aligned with `origin/main` before this item.
- Verification result: Node.js 24 bridge accepted in production; 3 files and 6 tests pass; 24 of 24 pages build.
- Route/preview: Production deployment `dpl_7FRQWihojVoVftNVmF5a7imVV55C`; main, LifeInbox, Sudoku Together, and both blog routes returned HTTP 200.
- Feature flags: None; clean preview and production rollback control exposure.

### Restart Here

- Next exact action: Commit only the bounded `BAS-07` implementation, deploy that exact commit to a clean Vercel preview, and inspect build/runtime logs plus representative routes.
- First files/symbols: The focused `BAS-07` diff, `.vercel/project.json`, Vercel preview output, and `documentation/implementation-evidence/BAS-07.md`.
- Expected observable result: Vercel builds 24 pages on Node.js 24, recognizes the proxy and edge routes, and serves the main site plus all three project routes without application errors.
- Only after that: Promote through Git, verify the production deployment and public subdomains, record rollback readiness, then close and reconcile the package.

### Context That Must Survive

- Target set: Next.js / ESLint config `16.2.10`; React / React DOM `19.2.7`; R3F `9.6.1`; Drei `10.7.7`; postprocessing `3.0.4`.
- Decisions: Do not combine the global AI redesign with this package. Upgrade the AI SDK only if a verified framework blocker makes it inseparable.
- Known traps: Next.js 16 removes `next lint`, requires async request APIs, defaults to Turbopack, and deprecates middleware in favor of proxy; the 3D packages must move together.
- Uncommitted/external work: `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` are unrelated and must remain unstaged.

## Implementation Checklist

- [x] Verify current package targets and peer constraints.
- [x] Inventory dynamic route, lint, middleware, edge API, AI SDK, and 3D migration surfaces.
- [x] Migrate async route parameters.
- [x] Replace `next lint` and legacy ESLint config with supported ESLint CLI configuration.
- [x] Rename middleware to proxy and update the exported function.
- [x] Install the coordinated Next.js 16 / React 19 / 3D target set.
- [x] Update runtime policy tests for the supported framework contract.
- [x] Resolve type, build, 3D, and API compatibility failures.
- [ ] Run unit, build, browser, visual, preview, production, live-route, and rollback gates. Local unit, build, browser, visual, API-boundary, and rewrite gates pass; deployment gates remain.
- [ ] Record evidence and reconcile all tracking controls.

## Updates

### 2026-07-14 - Supported framework modernization started

- State: ready -> in-progress
- Changed: Opened the bounded package and verified current package targets plus source migration hotspots.
- Verified: `BAS-06` and GitHub `main` are aligned at `dc22086`; unrelated worktree changes remain outside scope.
- Remaining: Source migration, dependency install, compatibility repairs, all visitor-facing gates, rollout, and closeout.
- Next: Apply deterministic source migrations before changing the dependency graph.
- Commit: uncommitted

### 2026-07-14 - Local modernization checkpoint passed

- State: in-progress
- Changed: Upgraded Next.js, React, React DOM, R3F, Drei, postprocessing, ESLint, and type packages; migrated async route params, flat ESLint config, middleware to proxy, and React 19/3D types.
- Verified: Node.js 24 lint/tests pass with 3 files and 6 tests; the Turbopack production build generates 24 of 24 pages; all representative routes render; custom Host headers rewrite to Dreamlife, LifeInbox, and Sudoku Together; no browser application errors were observed.
- Boundaries: ESLint reports 14 non-blocking warnings; browser QA reports two non-blocking Three.js asset/shader warnings; the production audit reports 0 critical, 0 high, 4 moderate, and 6 low findings whose available remediations are separate major/upstream work.
- Remaining: Focused implementation commit, clean preview, production promotion, public route checks, rollback evidence, and tracking closeout.
- Next: Create the focused implementation commit and deploy that exact commit to preview.
- Commit: uncommitted

## Completion Summary

Complete this only for `done` or `canceled` items.
