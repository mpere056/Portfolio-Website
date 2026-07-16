# Runtime Validation And Migration Boundary Inventory

Date: 2026-07-16
Package: `ARC-05`
Work item: `WI-ARC-05-01`
Status: reviewed implementation input

## Purpose

Identify values that can cross a trust or version boundary before introducing generic validators or browser persistence. This prevents pure local TypeScript actions from being mistaken for validated external data and prevents legacy UI preferences from silently becoming the exploration-state schema.

## Current Boundaries

| Boundary | Current data | Trust/version concern | ARC-05 treatment | Downstream owner |
| --- | --- | --- | --- | --- |
| Destination resolver input | Destination ID plus optional safe state | Callers can request unknown, unavailable, non-primitive, or unsupported state | Reuse registry resolution and expose structured rejection through the runtime action parser | Transition consumers |
| Chat request and model output | Free-form text and future structured cards/actions | Network values are untrusted even when TypeScript types exist locally | Validate future structured action/card payloads before dispatch; current text chat remains unchanged | `AI-03`, `AI-04` |
| URL and cross-subdomain handoff | Query parameters and planned destination/return context | User-editable strings cross route and origin boundaries | Parse IDs and bounded safe state before resolution; do not accept raw scene state | `PRJ-08`, `EXP-01` |
| Existing audio localStorage | `siteAudioMuted`, `siteAudioConsent` booleans encoded as strings | Existing component-local preferences have no shared schema | Leave unchanged; do not migrate them into semantic exploration state in ARC-05 | `EXP-05`, `QA-04` |
| Diagnostic query | `/api/rag/diag?q=...` free-form text | Server input is untrusted but is not a portfolio action or persisted state | Keep outside this package; endpoint-specific bounds remain its owner | AI/runtime maintenance |

## Planned Boundaries

| Boundary | Planned data | Required behavior before adoption | Owner after ARC-05 |
| --- | --- | --- | --- |
| Per-origin exploration localStorage | Discovery, tour, stimulation, checkpoint, and content-version slices | Version envelope, explicit migration, unknown-field tolerance, selective section reset, unknown-version rejection | `EXP-01` |
| AI archive cards and action tools | Destination, relationship, node, experience, and safe-state identifiers | Runtime shape and registry validation before any transition | `AI-03`, `AI-04` |
| Guided-tour recommendations | Authored destination IDs and role-aware progress | Reject unavailable destinations and malformed state without exposing raw hrefs | `EXP-04` |
| Future shared exploration/presence | Message or link payloads | Treat every payload as untrusted; validate version and semantic IDs | Later multiplayer package |

## Schema Decision For This Increment

`ARC-05` defines a pure version-1 semantic envelope with three sections:

- Discovery: First Note completion, semantic discovery/depth IDs, bounded altered-object state, semantic checkpoint, and reviewed content versions.
- Tour: enabled state, optional reviewed role, suggested/visited destination IDs, and dismissed semantic hint IDs.
- Stimulation: sound, normalized stimulation value, and reduced-motion preference.

The envelope deliberately excludes:

- React state, camera matrices, Three.js objects, animation progress, and puzzle edits.
- AI conversation text or private graph history.
- Accounts, server visitor profiles, analytics identifiers, and cross-device synchronization.
- Reads or writes to `localStorage`, cookies, URL history, or Zustand.

## Compatibility Policy

- Version `1` is parsed section by section. Unknown fields are ignored.
- Version `0` represents the earlier flat planning draft and migrates explicitly into the three version-1 sections.
- A malformed section resets only that section while valid sibling sections survive.
- A malformed root or unknown schema version is rejected and returns a clean default state.
- Registry availability and destination-specific safe-state allowlists remain owned by `resolveDestination`.
- Storage adoption, reset UI, cross-origin cookies, and refresh behavior remain blocked on `EXP-01`.

## Acceptance Inputs

- Canonical action produced by each of the seven approved creators.
- Malformed action type, ID, safe state, timestamp, content version, stimulation value, and failure code.
- Canonical version-1 state containing ignored unknown fields.
- Version-1 state with one corrupt section and two preserved sections.
- Flat version-0 state migrated to version 1.
- Unknown version and malformed root rejected to defaults.
