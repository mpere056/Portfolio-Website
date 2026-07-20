# Museum Dynamic Scene Packet

Last updated: 2026-07-19

Status: implemented candidate under `ART-07`; local verification passes, Production and Mark acceptance remain.

## Scene Thesis

The Museum is not a poster with animated labels. It is a nocturnal ecology whose matter gathers around attention, opens around a selected project, and reveals only reviewed connections when the visitor chooses an instrument.

## Still Checksum

- Source: `/images/art-direction/museum-signal-ecology.webp`.
- Role: approved stable matte, first useful frame, loading poster, renderer fallback, reduced-motion composition, and visual comparison reference.
- Rule: dynamic layers may locally refract or illuminate the matte but may not erase its silhouette or move the complete image as one plane.

## Layer Inventory

The executable manifest is `MUSEUM_SCENE_LAYERS` in `src/lib/museum/scene.ts`.

| Layer | Medium | Role | Driver | Calm/failure state |
| --- | --- | --- | --- | --- |
| `museum:matte` | Optimized raster | Stable ecology and silhouette | None | Always visible |
| `museum:membrane` | Masked raster/CSS | Local refractive response | Pointer and active signal | Settles on the active signal; absent effects reveal the matte |
| `museum:particles` | Canvas 2D | Atmospheric matter gathering around attention | Active signal and stimulation | Zero particles under reduced motion/hidden state; missing context leaves the matte |
| `museum:aperture` | Masked raster/CSS | Project selection opens local material detail | Hover, focus, and selected project | Static local emphasis remains |
| `museum:relationships` | SVG plus semantic DOM | Reviewed graph connection becomes a filament and explanation | Selected exhibit with public reviewed relationship | Static filament/readout; absent relationships render nothing |
| `museum:signals` | Semantic DOM/CSS | Project instruments respond independently | Pointer proximity, focus, and selection | Immediate focus/selection response remains |
| `museum:utilities` | Semantic DOM | Tour, AI, navigation, sound, and recovery | Visitor actions | Unaffected by decorative renderers |

The Approach scene adds one project-specific material plate and caustic field while retaining the generic phenomenon only as a secondary instrument outline.

## Driver Matrix

| Trigger | Affected layers | Meaning | Settlement |
| --- | --- | --- | --- |
| Pointer position | Membrane, particles, nearby signals | The ecology notices attention before requiring a click | Returns toward the stable center when the pointer leaves |
| Signal hover/focus | Aperture, particles, signal phenomenon | One project resolves from the field | Active signal remains legible without continuous motion |
| Project selection | Aperture, SVG relationship, Approach material plate | The chosen project changes the world rather than only opening copy | Approach reaches a stable inspectable composition |
| Reviewed graph connection | Filament, relationship readout, Approach record | The visual connection corresponds to authored knowledge | No edge appears when no render-safe relationship exists |
| Stimulation | Particle count, membrane energy, glow amplitude | Visitor controls intensity without changing facts | Low stimulation keeps quiet motion and all meaning |
| Reduced motion or hidden tab | Canvas, membrane drift, SVG travel, caustic drift | Continuous work stops while state remains | Stable matte, selected aperture, semantic relationship, and controls remain |

## Renderer Decision

- **DOM/CSS:** correct for project signals, controls, typography, masks, blend behavior, and project-specific Approach composition.
- **SVG:** correct for precise reviewed-relationship filaments and stable scaling.
- **Canvas 2D:** correct for a bounded deterministic field of many small marks that gather around the active signal.
- **WebGL/shaders:** not selected for this proof. Fluid refraction or GPU feedback would add deployment and failure complexity before this interaction demonstrates a need.
- **3D:** not selected. The Museum remains a composed field rather than a camera-driven room.

Shared output is limited to the pure frame/proximity/path logic and layer manifest. The Museum retains choreography and visual ownership.

## Choreography

1. The stable ecology and semantic signals appear first.
2. Quiet atmospheric marks gather toward attention; nearby signals brighten without jumping.
3. Hover/focus creates a local aperture rather than moving the entire background.
4. Selection emphasizes only reviewed semantic filaments and transitions into a project-specific Approach plate.
5. The selected relationship becomes inspectable beside real lifecycle and technical material.

## Calm And Failure Matrix

| Condition | Result |
| --- | --- |
| Standard | Bounded particles, masked refraction, proximity, aperture, and filament travel |
| Low stimulation | Lower energy and particle count; the same content and selection behavior |
| Reduced motion | No Canvas loop, drift, or SVG travel; immediate static state changes remain |
| Hidden tab/offscreen | Canvas pauses or unmounts its loop; scene reconstructs from semantic state |
| Canvas context unavailable | Canvas returns without drawing; stable matte, CSS/SVG layers, signals, and controls remain |
| Graph unavailable | Exhibit loader retains authored project views; semantic connection arrays are empty |
| Optional assets fail | Existing semantic Museum fallback and project routes remain available |

## Performance Envelope

- One Canvas element in the lobby; its IntersectionObserver and document visibility checks prevent offscreen/hidden drawing.
- Maximum 52 deterministic particle records and 48 active particles from the current profile.
- Device-pixel ratio capped at `1.5`.
- One animation loop owned and cleaned up by the Canvas component.
- Existing optimized WebP is reused from the browser cache for masked material plates.
- No new runtime dependency, WebGL context, remote asset, or persistent frame state.

## Verification Matrix

- Pure scene tests cover input bounding, active aperture, proximity, filament paths, reduced motion, hidden state, and manifest completeness.
- Server render tests cover stable matte, membrane, Canvas, and graph-backed relationship markup.
- Graph-backed exhibit tests ensure each flagship receives reviewed serializable connections.
- Full repository result: 43 test files and 171 tests pass.
- Content result: 58 nodes and 28 relationships validate.
- Lint: zero errors; ten pre-existing warnings remain outside this slice.
- Production build: all 35 static/dynamic routes compile and generate.
- Local browser: lobby, LifeInbox selection, project-specific Approach material, reviewed relationship, return control, and no console warnings/errors pass.

## Dynamic Scene Ledger

| Route | Packet | Layer pack | Runtime | Drivers wired | Calm/fallback | Verification | Known-good point | Next exact action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/projects` Museum | implemented candidate | integrated from stable WebP, CSS masks, SVG, Canvas, and DOM | runtime-ready locally | pointer, focus/hover, selection, graph relationship, stimulation, reduced motion, visibility | implemented; explicit Production context-loss observation remains | unit, integration, type, lint, build, and local browser pass | local `WI-ART-07-01` candidate on 2026-07-19 | Collect Mark review, then Preview/Production verification before activating `ART-08` |

No percentage is assigned. Production rollout and Mark acceptance remain named separate gaps.
