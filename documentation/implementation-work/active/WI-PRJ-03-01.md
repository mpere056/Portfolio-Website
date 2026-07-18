# WI-PRJ-03-01: Integrate Museum Signal And Approach

## Properties

| Field | Value |
| --- | --- |
| State | ready |
| Priority | high |
| Package | `PRJ-03` |
| Capabilities | `CAP-PRJ-004` |
| Requirements | `V-03`, `V-14` |
| Outcome | `O-03` |
| Owner | Codex |
| Last update | 2026-07-18 |

## Acceptance

The `/projects` server route loads canonical exhibit views and renders a lightweight, distinctive Signal/Approach museum behind `museumV2`; all nine anchors, authored identity, keyboard/pointer navigation, semantic fallback, lazy flagship boundaries, and legacy `ProjectsClient` rollback remain intact. Development and Preview may enable the path after tests; Production remains off until `QA-02` and a separate promotion decision.

## Resume Packet

- Last completed checkpoint: `PRJ-02` selected LifeInbox after equal deterministic candidate spikes.
- Current checkpoint: `loadMuseumExhibits()`, stable anchors, fallback components, graph response, and legacy route are accepted but not composed into a visitor shell.
- Next exact action: add a server-selected `museumV2` route branch and build the lightweight Signal/Approach client without importing flagship interaction modules.
- Files expected in scope: `src/app/projects/page.tsx`, `src/components/museum/*`, feature flags, museum tests, evidence, and tracking.
- Safety boundary: preserve exact anchors and the legacy path; do not start LifeInbox Handle/Enter/Understand in this package.
- Stop condition: flag-off parity and overview-to-Approach tests pass, Development/Preview policy is explicit, and fallback remains useful.

