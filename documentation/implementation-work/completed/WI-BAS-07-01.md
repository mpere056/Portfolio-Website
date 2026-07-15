# WI-BAS-07-01: Modernize The Supported Framework Stack

## Properties

| Field | Value |
| --- | --- |
| State | done |
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

Next.js and `eslint-config-next` use `16.2.10`; React and React DOM use `19.2.7`; React Three Fiber, Drei, and postprocessing use compatible current majors; dynamic route APIs, ESLint CLI, and proxy convention are migrated; tests and production build pass on Node.js 24; AI and edge routes are explicitly checked; representative 3D and project routes pass browser and visual review; and clean preview, production, live-route, and rollback evidence are accepted.

## Resume Packet

### Current Truth

- State in one sentence: The supported framework migration and the AI runtime repairs it exposed are accepted locally, in exact-commit preview, and across production domains.
- Works now: Node.js 24 runs Next.js `16.2.10`, React `19.2.7`, the compatible 3D set, migrated request APIs and proxy convention, 9 tests, the production build, 768-dimensional retrieval, and resilient grounded chat.
- Incomplete or stubbed: No `BAS-07` acceptance gap remains; retained lint, Three.js, and dependency warnings have explicit residual-risk ownership.
- Safe exposure: Production deployment `dpl_CfieGiesbhQnT2DKUa6x1iUvkURQ` is Ready and can roll back to `dpl_9RrqnJwgnKi1qkgUDw8KhWYv55PU`.

### Known-Good Point

- Commit: `64e8e00`
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`, pushed to `origin/main` before documentation closeout.
- Verification result: 4 files and 9 tests pass; the production build passes; lint reports 0 errors and 14 retained warnings.
- Route/preview: Exact-commit preview `dpl_BYMrYgS9ZBSDNCDbe9VhfYsXNEL9` and production `dpl_CfieGiesbhQnT2DKUa6x1iUvkURQ` pass retrieval, chat, and public-route checks.
- Feature flags: None; rollout used clean preview, Git-triggered production, and deployment rollback.

### Restart Here

- Next exact action: Begin `WI-BAS-05-01` and audit target-state capabilities against the supported production stack.
- First files/symbols: Capability ledger, requirement traceability, `src/app`, `src/components`, `src/content`, and `tests`.
- Expected observable result: Existing and next target capabilities receive evidence-based states and bounded gap owners.
- Only after that: Select the first architecture, testing, or knowledge-graph implementation item from confirmed dependencies.

### Context That Must Survive

- Target set: Next.js / ESLint config `16.2.10`; React / React DOM `19.2.7`; R3F `9.6.1`; Drei `10.7.7`; postprocessing `3.0.4`.
- AI repair: Queries and ingestion share `gemini-embedding-2` at 768 dimensions; generation uses `gemini-flash-latest` with a bounded flash-lite fallback for 404, 429, and 503 responses.
- External recovery: Replacement Google and Supabase resources remain free-tier with no billing enabled; credentials exist only in managed environment variables.
- Unrelated work: `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` remain outside this package.

## Implementation Checklist

- [x] Verify current package targets and peer constraints.
- [x] Inventory dynamic route, lint, middleware, edge API, AI SDK, and 3D migration surfaces.
- [x] Migrate async route parameters.
- [x] Replace `next lint` and legacy ESLint config with supported ESLint CLI configuration.
- [x] Rename middleware to proxy and update the exported function.
- [x] Install the coordinated Next.js 16 / React 19 / 3D target set.
- [x] Update runtime policy tests for the supported framework contract.
- [x] Resolve type, build, 3D, retrieval, generation, and API compatibility failures.
- [x] Run unit, build, browser, visual, preview, production, live-route, and rollback gates.
- [x] Record accepted and failed evidence and reconcile all tracking controls.

## Updates

### 2026-07-14 - Supported framework modernization started

- State: ready -> in-progress
- Changed: Opened the bounded package and verified package targets plus migration hotspots.
- Verified: `BAS-06` and GitHub `main` were aligned at `dc22086`; unrelated worktree changes remained outside scope.
- Next: Apply deterministic source migrations before changing the dependency graph.

### 2026-07-14 - Local modernization checkpoint passed

- Changed: Upgraded Next.js, React, React DOM, R3F, Drei, postprocessing, ESLint, and type packages; migrated async route params, flat ESLint config, middleware to proxy, and React 19/3D types.
- Verified: Node.js 24 lint/tests passed; the Turbopack build emitted the application; representative routes, Host rewrites, and 3D behavior passed browser review.
- Boundaries: 14 non-blocking ESLint warnings and two non-blocking Three.js warnings remained visible.
- Next: Commit the focused migration and deploy that exact commit to preview.

### 2026-07-14 - Preview failures drove bounded runtime repairs

- Changed: Previewed `5597390`, repaired the retired embedding model in `cdac921`, updated the retired chat model in `b8440f1`, and added bounded generation fallback in `64e8e00`.
- Verified: Failed deployments were retained as `EV-BAS-07-04` through `EV-BAS-07-07` rather than silently replaced.
- External recovery: Created free-only replacement Google and Supabase resources, rotated Vercel environment variables, rebuilt the vector schema, and re-ingested the committed corpus without storing secrets in Git.
- Next: Verify the final exact commit through retrieval and grounded chat before production promotion.

### 2026-07-14 - Preview and production accepted

- State: in-progress -> done
- Changed: Accepted exact-commit preview `dpl_BYMrYgS9ZBSDNCDbe9VhfYsXNEL9`, pushed all four implementation commits, and accepted production `dpl_CfieGiesbhQnT2DKUa6x1iUvkURQ`.
- Verified: Preview and production retrieval returned four relevant slugs and 3,481 context characters; grounded DreamLife chat returned HTTP 200; the main domain plus three project homes and three blog routes returned HTTP 200.
- Rollback: Previous Ready deployment `dpl_9RrqnJwgnKi1qkgUDw8KhWYv55PU` remains available.
- Evidence: `EV-BAS-07-01` through `EV-BAS-07-09`.
- Next: Start `WI-BAS-05-01` on the accepted supported stack.
- Commit: `64e8e00`

## Completion Summary

Next.js 16, React 19, the coordinated 3D ecosystem, async APIs, proxy convention, lint CLI, retrieval, resilient chat, clean preview, Git-triggered production, seven public routes, and rollback readiness are accepted. Four failed preview gates remain documented because each directly produced a verified repair.
