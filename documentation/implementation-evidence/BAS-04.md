# BAS-04 Evidence

Last updated: 2026-07-14

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `BAS-04` Runtime maintenance decision |
| Lifecycle | complete |
| Owner | Codex |
| Capabilities | `CAP-BAS-004` |
| Requirements | Platform |
| Work items | `WI-BAS-04-01` |
| Baseline code | `a894aafb15853ba90957c5f1698c5059fb6f0434` |
| Target environment | Local Node.js probes, linked Vercel project, and latest production deployment |
| Started | 2026-07-14 |
| Last assessed | 2026-07-14 |

## Scope Delivered

Verified official runtime and framework support, inspected the effective Vercel production runtime, tested the current lockfile under Node.js 22 and 24, reviewed the production dependency audit and migration surface, and selected a staged Node.js 24 bridge followed by a separate Next.js 16 modernization.

## Evidence Items

### EV-BAS-04-01: Official Support And Runtime Decision

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | decision |
| Claim | The selected path leaves unsupported software promptly while keeping the urgent runtime bridge separate from the high-churn framework migration |
| Capabilities | `CAP-BAS-004` |
| Dimensions | `S`, `A` |
| Requirements | Platform |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | Decision closeout commit |
| Environment | Official Node.js, Next.js, and Vercel support documentation |

#### Actual

Node.js 20 is end-of-life; Next.js 14 is unsupported; Vercel supports Node.js 24 and documents that package engines override project settings. `BAS-06` therefore targets Node.js 24 plus a narrow Next.js 14 security bridge, while `BAS-07` owns the coordinated Next.js 16 migration.

#### Artifact

- `documentation/implementation-baselines/2026-07-14-Runtime-Maintenance-Decision.md`

### EV-BAS-04-02: Effective Production Runtime Inspection

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | production |
| Claim | The linked Vercel project's effective runtime and dated failure risk are known without mutating production |
| Capabilities | `CAP-BAS-004` |
| Dimensions | `A`, `R` |
| Requirements | Platform |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | Production deployment `a894aafb15853ba90957c5f1698c5059fb6f0434` |
| Environment | Vercel project `portfolio-website`, production deployment inspection |

#### Method

Authenticated Vercel CLI inspection of project settings, deployment metadata, and production build logs.

#### Actual

The project dashboard is configured for Node.js `22.x`, but `package.json` engine `>=18.17 <21` overrides that setting and builds with Node.js 20. Vercel reports that Node.js 20 is deprecated and deployments created on or after 2026-10-01 will fail to build. The inspected production deployment is Ready and generated all 24 pages.

### EV-BAS-04-03: Lockfile-Preserving Runtime Compatibility Probe

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test |
| Claim | The current locked application can run its tests and production build on the selected Node.js 24 target before any dependency migration |
| Capabilities | `CAP-BAS-004` |
| Dimensions | `T` |
| Requirements | Platform |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | Code baseline `a894aafb15853ba90957c5f1698c5059fb6f0434` |
| Environment | Isolated Node.js `22.23.1` and `24.18.0`; current lockfile and installed dependencies |

#### Method

For each isolated runtime, execute the repository's existing `npm test` and `npm run build` commands without installing or writing dependencies.

#### Actual

Both Node.js versions passed 2 test files and 5 tests. Both production builds compiled, typechecked, and generated 24 of 24 pages. The same eight pre-existing lint warnings plus known Vite CJS and edge-runtime warnings remained.

### EV-BAS-04-04: Security And Migration Surface Review

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | privacy-security |
| Claim | Dependency exposure and high-churn migration hotspots are explicit enough to bound safe implementation packages |
| Capabilities | `CAP-BAS-004` |
| Dimensions | `S`, `A`, `R` |
| Requirements | Platform |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | Code baseline `a894aafb15853ba90957c5f1698c5059fb6f0434` |
| Environment | `npm audit --omit=dev --json`, package metadata, and repository source inspection |

#### Actual

The production dependency audit reports 18 findings: 1 critical, 3 high, 8 moderate, and 6 low. Direct findings include Next.js, glob, and the AI SDK. Source review identified synchronous dynamic-route parameters, `next lint`, middleware convention, edge API routes, legacy AI streaming APIs, and the React 18 / R3F 8 ecosystem as migration hotspots. Reachability of each advisory remains to be evaluated during remediation; the raw count is not used as a substitute for that review.

## Known Gaps

- `BAS-06` must implement, preview, promote, and verify the Node.js 24 and security bridge.
- `BAS-07` must implement the supported Next.js 16 and React 19 ecosystem migration.
- AI SDK major modernization remains separately bounded unless direct evidence makes it inseparable from `BAS-07`.
- The Vercel install log's existing `prepare` script Git warning remains a future hygiene item; it did not fail the deployment.

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-BAS-004` | `S/A/R: working; T: planned; others: not-applicable` | `S: accepted; C: not-applicable; A: accepted; I: not-applicable; T: accepted; Q: not-applicable; R: accepted` | verified | on-track | high | `EV-BAS-04-01` through `EV-BAS-04-04` | `WI-BAS-04-01` | `BAS-06` supported runtime and security bridge |

## Completion Decision

`BAS-04` is complete. The effective production state, current support constraints, compatibility target, urgency, package boundaries, verification gates, and rollback strategy are all explicit. No production configuration or dependency graph was changed in this decision package.
