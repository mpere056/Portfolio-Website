# Runtime Maintenance Decision - 2026-07-14

## Decision

Adopt a two-stage maintenance path:

1. `BAS-06` moves production to Node.js `24.x`, applies the narrow supported Next.js 14 security bridge, measures the dependency-audit delta, and verifies preview plus production rollout.
2. `BAS-07` performs the coordinated Next.js 16 and React 19 ecosystem migration with its route, lint, middleware, AI, 3D, browser, and visual changes isolated from the urgent runtime cutover.

Do not keep the current Node.js 20 / Next.js 14.2.3 deployment, stop at Node.js 22, or combine the entire framework migration with the runtime bridge.

## Current State

| Concern | Observed state | Consequence |
| --- | --- | --- |
| Repository engine | `>=18.17 <21` | Overrides the Vercel project setting and selects Node.js 20 |
| Local baseline | Node.js `20.20.2`, npm `10.8.2` | Passing but outside supported maintenance |
| Vercel project setting | Node.js `22.x` | Not effective while the repository engine excludes Node.js 22 |
| Latest production deployment | Commit `a894aaf`, Ready | Built with Node.js 20 despite the dashboard setting |
| Production build warning | Node.js 20 builds fail on or after 2026-10-01 | Requires a runtime change before that date |
| Framework | Next.js `14.2.3` | Next.js 14 is outside the current support policy |
| Production dependency audit | 18 reported findings: 1 critical, 3 high, 8 moderate, 6 low | Requires remediation and an explicit residual-risk record |

The audit result describes dependency advisories, not a claim that every advisory is reachable through this application.

## Authoritative Constraints

- Node.js marks version 20 end-of-life as 2026-03-24; versions 22 and 24 are maintained LTS lines.
- Next.js currently lists version 16 as Active LTS and version 15 as Maintenance LTS; version 14 is unsupported.
- Vercel supports Node.js 24, 22, and 20, defaults new projects to 24, and lets `package.json#engines` override the dashboard setting.
- Next.js 16 requires Node.js 20.9 or newer and includes migration work for asynchronous request APIs, ESLint CLI usage, middleware naming, and Turbopack defaults.

Sources:

- https://nodejs.org/en/about/eol
- https://nodejs.org/en/about/previous-releases
- https://nextjs.org/support-policy
- https://nextjs.org/docs/app/guides/upgrading/version-16
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions

## Compatibility Probe

The current lockfile and installed dependency graph were tested without writing package or lockfile changes.

| Runtime | Tests | Production build | Result |
| --- | --- | --- | --- |
| Node.js `22.23.1` | 2 files, 5 tests passed | 24 of 24 pages generated | Compatible with current locked stack |
| Node.js `24.18.0` | 2 files, 5 tests passed | 24 of 24 pages generated | Compatible with current locked stack |

Both probes retained the eight pre-existing lint warnings and the known Vite CJS and edge-runtime warnings. Node.js 24 is selected because it passes the same probe, matches Vercel's recommended target, and has the longer support runway.

## Package Boundaries

### BAS-06: Supported Runtime And Security Bridge

In scope:

- Change the repository engine to Node.js `24.x` and align Vercel's project setting.
- Upgrade Next.js and `eslint-config-next` to the narrow supported 14.2.x bridge.
- Apply bounded direct dependency remediations that do not require an architectural rewrite.
- Add a deterministic runtime-policy test.
- Compare before/after production dependency audits without presenting advisory count as the only security criterion.
- Run tests, production build, preview inspection, production promotion, and live-route checks.

Out of scope:

- Next.js 16, React 19, React Three Fiber 9, AI SDK redesign, and visitor-facing redesign.

### BAS-07: Supported Framework Modernization

In scope:

- Upgrade to the supported Next.js 16 line and coordinate React 19, React Three Fiber 9, Drei 10, and postprocessing 3.
- Convert synchronous dynamic-route parameters to asynchronous request APIs.
- Replace `next lint` with the ESLint CLI and review the middleware-to-proxy migration.
- Reassess edge-runtime API routes, Turbopack behavior, Three.js rendering, and browser-visible output.
- Keep the AI SDK major migration separately bounded unless the framework migration proves it inseparable.

## Known Migration Surface

| Surface | Current hotspot | BAS-07 concern |
| --- | --- | --- |
| Dynamic route parameters | `src/app/sites/[site]` route family | Async request API conversion |
| Lint command | `package.json` uses `next lint` | Removed in Next.js 16 |
| Middleware | `src/middleware.ts` | Proxy convention review |
| Edge routes | `/api/chat`, `/api/rag/diag` | Runtime compatibility and dependencies |
| AI SDK | `ai/react` and legacy stream helpers | High-churn major migration; keep separately bounded |
| 3D stack | React 18 / R3F 8 / Drei 9 | Coordinated React 19 ecosystem upgrade |

## Rollback

- `BAS-06`: deploy from a preview first. If verification fails, revert the bridge commit and restore the previous Vercel deployment while correcting the failure. Node.js 20 rollback is temporary only because its Vercel build deadline remains.
- `BAS-07`: preserve the accepted `BAS-06` production deployment as the rollback target. Do not promote the framework migration until route, API, 3D, browser, and visual gates pass.
- Never mutate production runtime settings before the matching repository commit and preview evidence exist.

## Rejected Alternatives

| Alternative | Reason rejected |
| --- | --- |
| Remain on Node.js 20 and Next.js 14.2.3 | Node.js 20 is end-of-life, Vercel has a dated build failure warning, Next.js 14 is unsupported, and the audit reports material exposure |
| Change only the Vercel dashboard to Node.js 22 | The repository engine overrides it, and Node.js 24 passed the same compatibility probe with a longer runway |
| Move to Node.js 22 in the repository | Safe but shorter-lived than Node.js 24 without reducing current migration work |
| Upgrade directly to Next.js 16 in one package | Mixes urgent runtime/security remediation with high-churn React, 3D, route, lint, middleware, and AI compatibility work |

## Reversibility

The staged sequencing is reversible at each deployment boundary. The decision to leave Node.js 20 and unsupported Next.js 14 is not treated as optional; only the exact patch composition and timing within the bounded packages may change in response to test evidence.
