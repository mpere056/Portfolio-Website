# WI-BAS-06-01: Ship The Supported Runtime And Security Bridge

## Properties

| Field | Value |
| --- | --- |
| State | in-progress |
| Priority | urgent |
| Package | `BAS-06` |
| Capabilities | `CAP-BAS-006` |
| Requirements | Platform |
| Outcome | `O-00` |
| Milestone | Production builds and runs on Node.js 24 with the narrow security bridge verified and rollback-ready |
| Owner | Codex |
| Branch/worktree | `main` |
| Created | 2026-07-14 |
| Last update | 2026-07-14 |

## Acceptance

The repository and Vercel project select Node.js 24; Next.js and its ESLint config use the reviewed 14.2.35 bridge; bounded direct dependency remediations are reviewed; a runtime-policy test, full tests, production build, audit comparison, preview inspection, production promotion, live routes, and rollback evidence pass without mixing in the Next.js 16 ecosystem migration.

## Resume Packet

### Current Truth

- State in one sentence: The Node.js 24 bridge passes locally and in a clean Vercel preview; production promotion, live checks, and closeout remain.
- Works now: The policy test and full suite pass under Node.js 24, all 24 pages build, non-breaking audit fixes are locked, and production audit findings fell from 18 to 10 with no critical findings.
- Incomplete or stubbed: Production promotion, live-domain checks, and accepted rollout evidence remain.
- Safe exposure: No production mutation until the repository changes pass locally and in preview.

### Known-Good Point

- Commit: `575456d59abc1bae16e1c004e926169f72ca83f6`
- Branch/worktree: `main` in `C:\Projects\Portfolio-Website`
- Verification result: After the bridge, 3 files and 6 tests pass and 24 of 24 pages build under Node.js `24.18.0`; eight pre-existing lint warnings remain.
- Route/preview: Preview `dpl_2mydKQDCRRkyHfnt9qrYXRNSPGVt` is Ready at `portfolio-website-rjzyd16l4-marks-projects-445b0eb9.vercel.app`; build logs confirm the Node.js cache changed from `20.x` to `24.x`.
- Feature flags: None; rollout is controlled by preview and deployment rollback.

### Restart Here

- Next exact action: Push the previewed commit to GitHub, inspect the resulting production deployment, and verify main plus project subdomain routes.
- First files/symbols: `package.json`, `package-lock.json`, `tests/runtimePolicy.test.ts`, Vercel project link.
- Expected observable result: GitHub and Vercel production use the previewed bridge and live routes remain healthy.
- Only after that: Record accepted rollout evidence and close the package.

### Context That Must Survive

- Decisions: Node.js 24 is selected; Next.js 16, React 19, 3D ecosystem, and AI SDK majors remain outside this package.
- Evidence: `BAS-04` is the accepted decision basis; create `EV-BAS-06-*` as implementation proceeds.
- Known traps: `package.json#engines` overrides the Vercel dashboard; the existing Vercel `prepare` warning is non-fatal; do not describe every audit advisory as application-reachable without review.
- Uncommitted/external work: `.gitignore`, `.husky/pre-commit`, `src/content/misc/ai-productivity-system.mdx`, `.tmp-repos/`, and `.tools/` are unrelated and must remain unstaged.

## Implementation Checklist

- [x] Create the bounded work item from the accepted decision.
- [x] Add a deterministic runtime-policy test.
- [x] Capture the expected red policy test.
- [x] Update engine and narrow dependency bridge under Node.js 24.
- [x] Run full tests and production build under Node.js 24.
- [x] Compare production dependency audit and review residual findings.
- [x] Deploy and inspect preview before production mutation.
- [ ] Align Vercel runtime, promote, and verify live domains.
- [ ] Record rollback readiness, evidence, and tracking reconciliation.

## Updates

### 2026-07-14 - Supported runtime bridge started

- State: ready -> in-progress
- Changed: Opened the bounded implementation item and added the runtime-policy test first.
- Verified: `BAS-04` and GitHub `main` are aligned at `575456d`.
- Remaining: Red test, package bridge, local verification, audit, preview, production, and closeout.
- Next: Capture the policy test failure before package edits.
- Commit: uncommitted

### 2026-07-14 - Local bridge verified

- State: in-progress
- Changed: Set Node.js `24.x`, upgraded Next.js and ESLint config to `14.2.35`, applied non-breaking audit fixes, and added the runtime-policy test.
- Verified: Expected red policy failure first; then 3 files and 6 tests passed and 24 of 24 pages built under Node.js `24.18.0`.
- Security: Production audit moved from 1 critical, 3 high, 8 moderate, 6 low to 0 critical, 1 high, 3 moderate, 6 low. Remaining fixes require major Next.js or AI SDK upgrades already outside this bridge.
- Remaining: Clean Vercel preview, effective Node.js 24 log proof, dashboard alignment, production promotion, live routes, evidence, and closeout.
- Next: Commit the local bridge and deploy that exact commit to preview.
- Commit: pending local bridge checkpoint

### 2026-07-14 - Clean Node.js 24 preview accepted

- State: in-progress
- Changed: Deployed a clean Git archive of `c0fb077` rather than the dirty working tree.
- Verified: Vercel switched build cache/runtime from Node.js `20.x` to `24.x`, detected Next.js `14.2.35`, built all 24 pages, and marked deployment `dpl_2mydKQDCRRkyHfnt9qrYXRNSPGVt` Ready.
- Remaining: Push, production deployment inspection, live domains, evidence, and closeout.
- Next: Push `c0fb077` and verify the Git-triggered production deployment.
- Commit: `c0fb07734ae9a2429219f6086036873103f65aca`

## Completion Summary

Complete this only for `done` or `canceled` items.
