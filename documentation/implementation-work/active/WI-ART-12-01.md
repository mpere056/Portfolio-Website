# WI-ART-12-01: Prove Pervasive Ambient Life In The Museum

## Properties

| Field | Value |
| --- | --- |
| State | ready |
| Priority | high |
| Package | `ART-12` |
| Capabilities | `CAP-ART-013`, `CAP-ART-014` |
| Requirements | `V-22`, `V-31`, `V-32`, `V-33` |
| Outcome | `O-01`, `O-04` |
| Owner | Mark and Codex |
| Branch/worktree | `main` |
| Last update | 2026-07-20 |

## Current Truth

Production `fce50af` is the known-good functional and interaction baseline. The Museum fits one desktop viewport, exposes nine collision-free project signals, contains increasing depth, responds to pointer and graph state, and preserves semantic and stable fallbacks. It does not yet satisfy pervasive ambient-world acceptance: the dominant raster composition remains temporally inert while smaller overlays move.

The accepted correction is decomposition-first. Structural anchors may remain spatially fixed, but every dominant region must participate through direct material movement or changing atmosphere, illumination, reflection, shadow, or occlusion. A generated transparent asset is an ingredient with a named material job, not a finished background.

## Resume Packet

- Planning source: [Pervasive Ambient Worlds Implementation Plan](../../implementation-plans/2026-07-20-Pervasive-Ambient-Worlds-Implementation-Plan.md).
- Known-good point: Production `fce50af`; 48 files/193 tests, content, TypeScript, zero-error lint, 35-page build, and public 1912x948 Museum geometry/interaction checks passed.
- Next exact action: create the Museum source-region atlas and motion coverage ledger before generating, extracting, or integrating any asset.
- After that: produce a reviewed contact sheet containing only the transparent plates, clean fills, masks/maps, vectors, or sprites required by named material behaviors.
- Preserve: one-screen composition, all nine project destinations, graph-aware meaning, contained depth, semantic controls, stimulation behavior, reduced motion, failure poster, and current route/history behavior.
- Do not begin with: a universal renderer, whole-image warping, parallax strips, generic particles, or route-wide synchronized breathing.

## Required Museum Region Classes

| Region class | Questions to answer before implementation |
| --- | --- |
| Structural anchors | Which buildings, instruments, labels, and geometry stay fixed, and which light/fog/shadow/occlusion crosses them? |
| Organic matter | Where are coral, tendrils, membranes, or reef forms rooted; how do their tips and bodies respond differently? |
| Atmosphere | Which gas, cloud, mist, and particulate volumes advect; at what depth and direction? |
| Flow | Which streams carry directional energy or matter, and how do speed, width, and emission vary? |
| Mechanisms | Which rings, apertures, gears, lenses, or contraptions rotate; what are their pivots, ratios, and pauses? |
| Illumination | Which sources flicker, travel, refract, pulse, or cast changing reflections and shadows? |
| Occlusion | Which foreground and background forms pass across focal regions to establish real depth? |

## Acceptance

- [ ] Source-region atlas accounts for every dominant Museum region and names unmapped gaps.
- [ ] Motion coverage ledger records direct or indirect participation, temporal band, stimulation behavior, fallback, and dead-zone status for every region.
- [ ] Asset contact sheet records provenance, scale, alpha/edge quality, renderer intent, budget, and rejected variants.
- [ ] One coordinated route clock drives independently phased atmosphere, organic, mechanical, flow, illumination, and occlusion channels as applicable.
- [ ] No-input capture runs for at least ten seconds and passes the idle-life and dead-zone diagnostics.
- [ ] Coral/organic roots, gaseous advection, directional streams, mechanical pivots, and architectural illumination/occlusion remain materially credible.
- [ ] Pointer, focus, project selection, relationship, and depth modulate existing ambient systems rather than launching unrelated effects.
- [ ] Stable, lower-stimulation, reduced-motion, hidden-tab, renderer-failure, and context-loss behavior pass.
- [ ] Museum remains a one-viewport desktop composition with all nine destinations usable and no horizontal overflow.
- [ ] Performance is measured in the fully animated idle state, not only from the stable poster.
- [ ] Aggregate tests/build, Preview or Production verification, and Mark creative review pass before `ART-13` begins.

## Chronological Updates

### 2026-07-20

- Mark clarified that every meaningful region should remain subtly alive, including coral sway, gaseous movement, stream flow, mechanism rotation, changing architectural light/fog, and foreground/background passage.
- Planning now separates interaction completeness from ambient-world completeness.
- `ART-12` is ready; implementation has not started.
