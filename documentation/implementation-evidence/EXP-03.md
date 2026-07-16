# EXP-03 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `EXP-03` One-time First Note |
| Lifecycle | complete |
| Capabilities | `CAP-EXP-005`, `CAP-EXP-006` |
| Work item | `WI-EXP-03-01` |
| Implementation | `27d2485` |
| Exposure | Development and Preview on; Production off pending creative rollout review |

## EV-EXP-03-01: Deterministic First Note Contract

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | unit-test and integration-test |
| Claim | First, revealing, ready, returning, bypass, reset, reduced-motion, and audio-denied semantics are deterministic; completion occurs only after a usable reveal. |
| Evidence | `tests/firstNote.test.ts` passes 7 focused cases within the 82-test suite; strict typecheck, content validation, and production build pass. |

The controller hydrates the accepted semantic store, persists a safe `home:first-note` checkpoint, keeps audio state observational, and leaves Production disabled through the typed environment flag policy.

## EV-EXP-03-02: Browser First, Return, Reset, And Keyboard Flow

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | browser-flow |
| Environment | Local Development, in-app browser, `firstNote=true` |
| Claim | A clean visitor sees one wake control and no destinations; wake reveals all three destinations; refresh skips the intro; reset restores it; Enter wakes it again without WebGL failure. |
| Evidence | Repeated DOM-backed browser flow against `http://localhost:3000/` after a clean dev restart. |

The first attempted wake exposed a post-processing reconstruction crash; memoizing the static composer fixed it. The return test then exposed premature persistence disposal under React development remounting; retaining the component-owned store subscription fixed refresh behavior. Both failures were re-tested through the complete flow.

## Boundaries After Completion

- Production behavior is unchanged because `firstNote` remains false there.
- Creative pacing and final visual review are promotion gates, not hidden implementation gaps.
- Cross-subdomain completion sharing remains a later explicitly approved cookie decision; current persistence is origin-local.
- The in-app screenshot path does not reliably capture WebGL drawing buffers, so behavior was accepted from DOM-backed state transitions plus the clean visible opening review rather than a post-wake screenshot alone.

Package complete. `KG-05` is next because tour recommendations and semantic response require bounded graph adapters.
