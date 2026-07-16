# WI-EXP-03-01: Build The One-Time First Note

## Properties

| Field | Value |
| --- | --- |
| State | done |
| Priority | high |
| Package | `EXP-03` |
| Capabilities | `CAP-EXP-005`, `CAP-EXP-006` |
| Requirements | `V-05`, `V-06`, `V-22` |
| Outcome | `O-01` |
| Owner | Codex |
| Last update | 2026-07-16 |

## Acceptance

Behind the `firstNote` flag, a first visitor wakes the dark home world through one pointer or keyboard action; visual readiness never depends on audio; completion persists only after a usable reveal; returning visitors skip the intro and restore the safe checkpoint; reset and reduced-motion behavior remain available.

## Completion Summary

- Final result: A pure four-phase state model, browser-backed controller, and existing-piano composition implement first, revealing, returning, bypass, and reset behavior.
- Interaction: The initial navigation remains concealed until click, Enter, or Space wakes the scene; audio may play but blocked or unavailable audio cannot prevent reveal.
- Persistence: The accepted exploration store records `home:first-note`, marks completion after reveal, restores on refresh, and resets only portfolio exploration state.
- Stability: The static post-processing subtree is memoized so state changes do not reconstruct its WebGL composer; React development remounts no longer dispose the store subscription prematurely.
- Verification: 82 tests in 22 files, repository lint with 10 pre-existing warnings and no errors, strict typecheck, 49-node/19-relationship content validation, and the 26-route production build pass.
- Browser proof: Clean first visit, click wake, persisted return, reset, and keyboard wake pass locally in the in-app browser.
- Evidence: `EV-EXP-03-01`, `EV-EXP-03-02`.
- Implementation: `27d2485`.
- Safe exposure: Enabled by default only in Development and Preview; Production remains false until creative review and rollout approval.
- Remaining work moved to: `WI-KG-05-01` for bounded graph queries required by tour and semantic response packages.
