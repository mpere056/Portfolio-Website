# Museum Ambient Baseline

Date: 2026-07-20
Stage: `ART-12A`
Status: complete regression baseline; no ambient implementation accepted
Implementation baseline: Production `fce50af`
Requirements: `V-22`, `V-31`, `V-32`, `V-33`

## Purpose

This record separates the behavior that must survive `ART-12` from the ambient behavior that is still missing. It is the regression contract for the Museum decomposition work, not evidence that pervasive ambient life already passes.

The current scene is a strong one-viewport interactive composition. Its dominant visual matter is still one fused raster. `ART-12B` and `ART-12C` may decompose that matter, but they may not casually change navigation, graph semantics, depth history, fallback behavior, or the accepted visual silhouette.

## Audited Sources

| Subject | Audited source | Result |
| --- | --- | --- |
| Production route | `https://www.marknperera.ca/projects` | Live at the known-good `fce50af` implementation |
| Scene component | `src/components/museum/MuseumShell.tsx` | One semantic Museum shell with Signal and contained Approach states |
| Scene styling | `src/components/museum/MuseumShell.module.css` | One-viewport desktop field; stable raster plus masked copies, SVG, Canvas, and DOM |
| Scene logic | `src/lib/museum/scene.ts` | Pointer, selected signal, stimulation, visibility, proximity, and relationship calculations |
| Particle owner | `src/components/museum/MuseumParticleField.tsx` | One Canvas loop, visibility suspension, deterministic particles |
| Artwork | `public/images/art-direction/museum-signal-ecology.webp` | `1672 x 941`, sRGB, three channels, no alpha, 384,548 bytes |
| Artwork checksum | SHA-256 | `7CB42FAFD2656BA4750EE6AEDF897A54ED64A72F0ED65814ACDAA52CB791CCAE` |

## Production Geometry Checksum

Measured in the live browser at `1912 x 948`, DPR `1`, standard motion:

| Region | Geometry or behavior |
| --- | --- |
| Document | `1912 x 948`; no horizontal or vertical document overflow |
| Museum main | `0,0` to `1912,948`; `overflow: hidden` |
| Project-signal field | `x 204`, `y 75.2`, `1504 x 849.1` |
| Ecology viewport | `x 204`, `y 237.3`, `1504 x 686` before image transform |
| Raster render | `x 185.2`, `y 228.8`, `1541.6 x 703.1` after `scale(1.025)` |
| Signal count | Nine visible semantic anchors; all have distinct project IDs and usable hit regions |
| Deep state | LifeInbox Approach remains inside the viewport; its own section scrolls (`852.3` visible height, `1276` content height) while the document remains `948` high |
| Console | No warnings or errors during lobby and direct LifeInbox Approach inspection |

The source is `1.7779:1`; the desktop ecology viewport is approximately `2.1924:1`. `object-fit: cover` therefore crops the source vertically. At the audited geometry the approximate visible source interval is `y 0.095` through `0.905`. Region work must preserve meaningful matter near those crop boundaries and must not assume the full source height is visible.

## Existing Layer Checksum

| Existing layer | Current owner | Current temporal participation | Preserve during `ART-12` |
| --- | --- | --- | --- |
| `museum:matte` | Next Image/raster | One `1.4s` arrival only; then static | Yes, as first frame, stable checksum, reduced-motion state, and renderer failure fallback |
| `museum:membrane` | CSS masked copy of the same raster | Pointer/focus drift; no idle animation | Preserve causal attention response, but replace fused-raster dominance with material-local layers |
| `museum:aperture` | CSS masked copy of the same raster | Selection-local emphasis; no idle animation | Preserve selected-project emphasis and calm settlement |
| `museum:membrane` mesh | CSS gradients | Pointer/focus drift; no independent idle clock | Preserve only if it remains subordinate to depicted materials |
| `museum:particles` | Canvas 2D | Continuous when visible and motion is allowed | Preserve the bounded role or absorb it into the selected compositor; particles cannot satisfy ambient acceptance alone |
| `museum:relationships` | SVG plus semantic DOM | Filament travel only when reviewed relationships are active | Preserve graph truth, path semantics, and readable static state |
| `museum:signals` | DOM/CSS | Proximity, hover, focus, and selection | Preserve nine destinations, focus behavior, project dialects, and collision-free layout |
| `museum:utilities` | DOM | Visitor-driven | Preserve tour, AI, sound, navigation, and recovery |

## Ten-Second Idle Observation

Two viewport captures taken ten seconds apart had different hashes because the Canvas field and other bounded overlays continued to render. Computed layer styles confirmed that the matte, membrane, aperture, and material mesh had no idle animation after arrival. The same fused WebP remained the dominant unchanged visual information in all three raster uses.

This is the exact acceptance gap:

- **Works:** the scene is not literally frame-identical because particles and filaments can move.
- **Does not work:** coral, gas, streams, mechanisms, architecture, water, and foreground matter do not own independent temporal behavior.
- **Conclusion:** adding more global particles, whole-image drift, or another masked duplicate would not close `V-33`.

## Interaction And Semantic Contract

The ambient implementation must preserve all of the following:

| Contract | Required behavior |
| --- | --- |
| Pointer proximity | Nearby signals and local matter respond without requiring a click |
| Keyboard focus | The same project can be resolved without pointer-only discovery |
| Selection | The selected project opens a local material and semantic emphasis, not unrelated decoration |
| Knowledge graph | Only reviewed render-safe relationships become visual paths or explanations |
| Depth/history | Hash and `stage` history remain refreshable and reversible |
| Increasing depth | Signal, Approach, Handle, Enter, and Understand remain bounded by truthful project availability |
| Stimulation | Intensity changes amplitude and density without changing facts or hiding navigation |
| AI context | The archive remains quietly aware of the Museum or selected project |
| One-screen lobby | The nine-signal overview does not require page scrolling on the accepted desktop target |

## Calm, Failure, And Runtime Contract

| Condition | Baseline to preserve |
| --- | --- |
| Lower stimulation | Same material world and semantics at quieter amplitude/density |
| Reduced motion | No continuous Canvas loop, drift, or SVG travel; complete stable composition remains |
| Hidden tab | Continuous drawing pauses and state reconstructs intentionally on return |
| Canvas unavailable | Raster, CSS/SVG semantics, signals, and controls remain usable |
| Graph unavailable | No invented edge; authored project destinations remain available |
| Optional asset failure | Approved still checksum appears before or instead of decomposed layers |
| Context loss | Future GPU compositor must fail back without losing navigation, selection, or project content |

## Current Performance Envelope

- One Canvas and one active animation scheduler in the lobby.
- Fifty-two deterministic particle records; the current standard profile exposes at most forty-eight active records.
- Canvas DPR capped at `1.5`.
- One optimized 384,548-byte WebP reused by the matte and CSS masks.
- Hidden-tab and offscreen checks exist for the Canvas.
- No WebGL context is currently created by the Museum.

These are baseline observations, not the final `ART-12G` budget. The fully decomposed candidate must measure transfer size, decoded texture memory, scheduler ownership, frame behavior, context loss, and hidden-tab suspension again.

## Capture Protocol For Later Gates

Use the following invariant procedure at `ART-12E`, `ART-12G`, and `ART-12H`:

1. Open `/projects` at `1912 x 948`, DPR `1`, standard stimulation, sound irrelevant, and no active signal.
2. Record viewport/document geometry and all nine signal rectangles.
3. Capture the first materially complete frame.
4. Capture idle frames at `0s`, `5s`, `10s`, and `20s`; record a short no-input video for long bands.
5. Repeat with semantic overlays and micro-particles hidden for the dead-zone diagnostic.
6. Verify one keyboard-focused signal, one pointer-local response, one reviewed relationship, and one selected Approach state.
7. Repeat the still capture in low stimulation, reduced motion, and forced renderer-failure modes.
8. Record console output, transferred asset bytes, decoded texture estimate, scheduler/context count, and visible frame behavior.

## `ART-12A` Exit

`ART-12A` is complete. The regression baseline is explicit, reproducible, source-addressed, and separated from the missing ambient criterion. `ART-12B` owns the material-region mapping; `ART-12C` owns asset decisions. Neither authorizes production assets before the brief review gate.
