# WI-EXP-03-01: Build The One-Time First Note

## Properties

| Field | Value |
| --- | --- |
| State | ready |
| Priority | high |
| Package | `EXP-03` |
| Capabilities | `CAP-EXP-005`, `CAP-EXP-006` |
| Requirements | `V-05`, `V-06`, `V-22` |
| Outcome | `O-01` |
| Milestone | A first visitor wakes the dark world once; a returning visitor resumes a usable semantic checkpoint without replaying the intro |
| Owner | shared |
| Branch/worktree | `main` |
| Created | 2026-07-16 |
| Last update | 2026-07-16 |

## Acceptance

Behind the `firstNote` flag, compose a dark first-visit home state around the existing particle piano; provide one clear pointer and keyboard wake interaction; reveal the usable home destinations independently from whether audio playback succeeds; set `firstNoteCompleted` only after the usable reveal; skip the intro and restore a safe semantic checkpoint on later visits; provide reset for testing/user control; support sound-off and reduced-motion behavior; pass first/return/reset/audio-denied browser flows and creative review before production enablement.

## Resume Packet

### Current Truth

- Works now: The home already contains a dark particle piano, cursor illumination, navigation labels, global audio, the accepted exploration store, and the reusable depth controller.
- Incomplete: No home experience provider is mounted; `firstNote` is disabled everywhere; labels appear immediately; GlobalAudio independently attempts autoplay; no wake sequence, completion timing, return behavior, or reset UI exists.
- Safe exposure: Implement behind `firstNote`; keep production default false until browser and creative review pass.

### Known-Good Point

- Commit: `852e14c3a6f99a3327793ef7d62bb79ec82a08ac`.
- Verification: 75 tests in 21 files, strict typecheck, content validation, and production build pass.
- Dependencies: `EXP-01`, `EXP-02`, and `QA-01` are complete.

### Restart Here

- Next exact action: Extract a pure First Note state model with `uninitialized`, `waiting`, `revealing`, and `ready` states; define completion/reset/return rules before changing `HeroCube`.
- First files: `src/components/HeroCube.tsx`, `src/components/NavPointer.tsx`, `src/components/GlobalAudio.tsx`, `src/lib/experience/store.ts`, and `src/lib/featureFlags.ts`.
- Expected result: Unit fixtures prove first visit, returning visit, reset, reduced motion, and audio-denied completion semantics without 3D timing flakiness.
- Only after that: Mount a lightweight home provider and author the visual wake sequence with Mark's creative review.

## Decisions And Boundaries

- The existing particle piano is the initial object; do not introduce a competing concept before review.
- Audio may enrich the wake interaction but never gates the visual reveal or site usability.
- Do not merge legacy `siteAudioMuted` storage into the exploration store in this item.
- Do not reveal hidden discoveries through the intro or turn the intro into a linear tour.
- Do not enable production through query parameters or before creative/browser acceptance.

## Implementation Checklist

- [ ] Define deterministic First Note state transitions and tests.
- [ ] Add feature-flagged home composition and store hydration boundary.
- [ ] Add pointer and keyboard wake interaction.
- [ ] Keep visual completion independent from audio success.
- [ ] Add reduced-motion and sound-off behavior.
- [ ] Prove first visit, return visit, reset, and corrupt-state recovery.
- [ ] Run browser, visual, creative, and production rollout gates.
