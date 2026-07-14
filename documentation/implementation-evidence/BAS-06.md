# BAS-06 Evidence

Last updated: 2026-07-14

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `BAS-06` Supported runtime and security bridge |
| Lifecycle | complete |
| Capability | `CAP-BAS-006` |
| Implementation commit | `c0fb07734ae9a2429219f6086036873103f65aca` |
| Production deployment | `dpl_7FRQWihojVoVftNVmF5a7imVV55C` |

## Accepted Evidence

| Evidence | Type | Claim | Actual |
| --- | --- | --- | --- |
| `EV-BAS-06-01` | unit-test | Runtime policy and application behavior pass on Node.js 24 | Expected red policy test captured; final 3 files and 6 tests passed on Node.js `24.18.0` |
| `EV-BAS-06-02` | integration-test | The locked bridge produces the full application | Next.js `14.2.35` compiled, typechecked, and generated 24 of 24 pages; eight existing lint warnings remain |
| `EV-BAS-06-03` | privacy-security | The bounded bridge improves exposure without hiding major-migration risk | Production audit moved from 18 findings including 1 critical to 10 findings with 0 critical; remaining fixes require major Next.js or AI SDK work |
| `EV-BAS-06-04` | preview | A clean exact-commit preview uses Node.js 24 | Preview `dpl_2mydKQDCRRkyHfnt9qrYXRNSPGVt` was Ready; logs recorded cache/runtime change from `20.x` to `24.x` and 24 generated pages |
| `EV-BAS-06-05` | production | Git-triggered production and public routes are healthy | Production `dpl_7FRQWihojVoVftNVmF5a7imVV55C` was Ready; main, LifeInbox, Sudoku Together, and both blog routes returned HTTP 200 |

## Rollout And Residual Risk

- `package.json` and the Vercel project setting both select Node.js `24.x`.
- Next.js and `eslint-config-next` are pinned to `14.2.35`; the runtime policy test prevents drift.
- Production rollback remains the previously Ready deployment, but returning to Node.js 20 is temporary-only and not an accepted steady state.
- Next.js 14 and AI SDK 3 findings remain explicitly owned by `BAS-07` and the separately bounded AI modernization.
- Existing lint, Browserslist, edge-runtime, deprecated dependency, and non-fatal Husky install warnings remain visible rather than being folded into this bridge.

## Completion Decision

`BAS-06` is complete. Local, preview, production, live-route, security-delta, runtime-setting, and rollback gates are accepted.
