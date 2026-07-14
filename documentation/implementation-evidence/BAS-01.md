# BAS-01 Evidence

Last updated: 2026-07-14

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `BAS-01` Technical baseline |
| Lifecycle | complete |
| Owner | Codex |
| Capabilities | `CAP-BAS-001` |
| Requirements | Platform |
| Work items | `WI-BAS-01-01` |
| Baseline code | `c924104d4785e152245570d1d3c219a579a65cf0` plus disclosed unrelated worktree changes |
| Target environment | Local production build and public production routes |
| Started | 2026-07-14 |
| Last assessed | 2026-07-14 |

## Scope Delivered

Recorded the current runtime and dependency environment, production build and route output, lint and test results, warnings, model and static-asset inventory, content-media integrity, route architecture, live domains, and remaining measurement gaps in `documentation/implementation-baselines/2026-07-14-Technical-Baseline.md`.

## Evidence Items

### EV-BAS-01-01: Production Build

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test |
| Claim | The current application compiles, type-checks, statically generates, and produces a production build |
| Capabilities | `CAP-BAS-001` |
| Dimensions | `A`, `I`, `T` |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | `c924104d4785e152245570d1d3c219a579a65cf0` plus disclosed unrelated worktree changes |
| Environment | Windows, Node `20.20.2`, npm `10.8.2` |

#### Method

```powershell
$env:PATH=(Resolve-Path '.tools\node').Path+';'+$env:PATH
& '.tools\node\npm.cmd' run build
```

#### Actual

Exit code `0`; 24 of 24 static pages generated; route-size table captured; eight lint warnings and one edge-runtime warning recorded.

### EV-BAS-01-02: Lint And Tests

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | unit-test |
| Claim | The current lint and deterministic test command completes successfully |
| Capabilities | `CAP-BAS-001` |
| Dimensions | `T` |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | `c924104d4785e152245570d1d3c219a579a65cf0` plus disclosed unrelated worktree changes |
| Environment | Windows, Vitest `2.1.9` |

#### Actual

Exit code `0`; one test file and two tests passed; eight lint warnings and the Vite CJS deprecation warning recorded.

### EV-BAS-01-03: Asset And Model Inventory

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | performance |
| Claim | The current static and 3D asset footprint and largest files are reproducibly inventoried |
| Capabilities | `CAP-BAS-001` |
| Dimensions | `A`, `Q` |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Commit | `c924104d4785e152245570d1d3c219a579a65cf0` plus disclosed unrelated worktree changes |
| Environment | Repository filesystem |

#### Actual

Recorded 88 model files (`103.76 MiB`), 45 image files (`91.85 MiB`), 12 audio files (`30.41 MiB`), model-group totals, largest files, likely non-deployment assets, and four missing literal project media paths.

### EV-BAS-01-04: Public Route Verification

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | production |
| Claim | The root portfolio and three project subdomains are reachable and return distinct intended content |
| Capabilities | `CAP-BAS-001` |
| Dimensions | `Q`, `R` |
| Date | 2026-07-14 |
| Reviewer | Codex |
| Environment | Production |

#### Actual

`marknperera.ca`, `lifeinbox.marknperera.ca`, `sudokutogether.marknperera.ca`, and `dreamlife.marknperera.ca` returned HTTP `200`. Each project subdomain returned its own title and project marker.

## Known Gaps

- No repeatable frame-time, heap, model-load, AI-idle, or Vercel-build-duration harness exists yet.
- Existing warnings are recorded but not fixed in this baseline package.
- Missing project gallery assets are recorded but not repaired here.

These gaps are routed to later focused work and do not invalidate the package's required baseline evidence.

## Capability Reconciliation

| Capability | Before states | After states | Lifecycle | Health | Confidence | Evidence | Work item | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-BAS-001` | all unknown | `S: accepted; C: not-applicable; A: accepted; I: accepted; T: accepted; Q: accepted; R: accepted` | verified | on-track | high | `EV-BAS-01-01` through `EV-BAS-01-04` | `WI-BAS-01-01` | `BAS-02` content inventory |

## Completion Decision

`BAS-01` is complete. Its required production build passes and durable evidence records route sizes, warnings, model inventory, tests, and live public routes. Uninstrumented browser metrics remain named future work rather than fabricated baseline values.
