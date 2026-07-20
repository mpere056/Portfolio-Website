# Museum Ambient Asset Briefs

Date: 2026-07-20
Stage: `ART-12C`
Status: authored and review-ready; no production asset generation authorized until creative review
Representative crop: source `(0.000,0.390)-(0.430,1.000)`

## Production Intent

The first asset batch is a material-stack proof, not a replacement background. It must demonstrate that one ecology crop can become temporally credible while preserving the approved still checksum, project semantics, and one-viewport composition.

Every ingredient below has a named material job. No brief authorizes a complete alternate Museum image, a rectangular parallax strip, a generic particle pack, or assets for another route.

## Shared Art Direction

| Property | Requirement |
| --- | --- |
| Visual thesis | Nocturnal impossible observatory where organism, instrument, archive, and signal share one ecology |
| Camera | Fixed composite camera aligned exactly to the existing source; no new horizon, lens, or perspective drift |
| Palette anchors | Void `#020608`; petroleum `#07181c`; oxidized cyan `#3a8f99`; glass teal `#78ced1`; bone `#d1c5a4`; amber `#c78b54`; coral `#b24f3d`; blush `#d88a76`; nacre `#b5c8d4` |
| Lighting | Low-key nocturnal base; cyan and amber sources remain local; no baked global bloom or unrelated rim light |
| Texture | Fine filament, translucent membrane, mineral/metal detail, and painterly dark matter; avoid glossy stock-3D cleanliness |
| Motion implication | Roots remain planted, gas has volume, streams have direction, mechanisms have pivots, light belongs to surfaces |
| Edge standard | No matte-colored fringe, white halo, clipped glow rectangle, duplicated seam, or premultiplied-alpha contamination |
| Working exports | Lossless transparent PNG plus diagnostic black/white/checkerboard composites; preserve source color space metadata where available |
| Runtime hypothesis | Alpha WebP/AVIF or texture atlas derivative after approval; exact renderer and derivative format remain `ART-12F` decisions |
| Fallback | Original `museum-signal-ecology.webp` remains the first frame, reduced-motion composition, and renderer-failure checksum |

## Batch Budget

The representative crop targets no more than eight color-bearing runtime textures and four grayscale/RGBA control maps before atlas packing. Initial optional transfer should remain under approximately `1.8 MB`; estimated decoded material memory should remain under `24 MiB` at the target desktop derivative. These are spike budgets, not permission to degrade edges. `ART-12F` must measure real derivatives and can revise the numbers with evidence.

Large working masters may exceed runtime dimensions. Runtime derivatives should normally cap the crop axis at `1536px`, with lower-capability derivatives selected later. No image generation tool output enters `public/` directly: retain the source output, perform edge cleanup, inspect it independently, then export a named derivative only after acceptance.

## Asset Decision Register

| Brief | Region | Decision | Material job | Intended stack position | Owner/hypothesis |
| --- | --- | --- | --- | --- | --- |
| `AB-MUS-01` | `MUS-R01/R15` | Manually inpaint/extract from source | Clean west deep field, ground, and basin behind separable matter | Background | Raster plate; compositor-agnostic |
| `AB-MUS-02` | `MUS-R03` | Hybrid extraction and manual reconstruction | Fixed black-gold receiver plus separable rings | Background anchor | Raster plates with pivot metadata |
| `AB-MUS-03` | `MUS-R10` | Hybrid extraction plus generated continuation only where occluded | Three rooted coral/fan groups with clean deformation margins | Mid/foreground organic | Alpha plates; shader/mesh decision deferred |
| `AB-MUS-04` | `MUS-R11` | Hybrid extraction and manual repair | Cyan organism-instrument, bulbs, and one separable ring | Midground focal support | Alpha plates and local masks |
| `AB-MUS-05` | `MUS-R12` | Manually author from source path language | Lower cyan/red directional current | Interstitial flow | SVG/mesh/raster comparison deferred |
| `AB-MUS-06` | `MUS-R01/R02/R15` | Generate and manually art-direct transparent volumes | Background and interstitial vapor set | Far/back/mid atmosphere | Alpha volume plates or procedural texture source |
| `AB-MUS-07` | `MUS-R16` | Generate and manually curate | Sparse near spores, filaments, and reef silhouettes | Foreground occlusion | Alpha sprites/plates |
| `AB-MUS-08` | `MUS-R10/R11` | Manually author | Root, body, and tip deformation weights | Control maps | Shader/mesh input, not visible art |
| `AB-MUS-09` | `MUS-R01/R03/R10/R11/R12/R15/R16` | Manually author | Crop depth and occlusion relationships | Control maps | Renderer-neutral masks |
| `AB-MUS-10` | `MUS-R12/R15` | Manually author | Flow direction, width, emission, and basin response | Control maps | SVG/Canvas/WebGL comparison input |
| `AB-MUS-11` | `MUS-R02/R03/R10/R11/R15` | Manually author | Local illumination, shadow, emission, and caustic masks | Control maps | CSS/Canvas/WebGL comparison input |

## `AB-MUS-01`: Clean West Field And Basin

- **Goal:** reconstruct only the matter hidden behind extracted coral, receiver, organism, and flow so independent layers do not reveal holes.
- **Preserve:** source camera, dark value structure, distant cyan haze, and basin continuity.
- **Do not add:** new landmarks, stars, textural focal points, or obvious cloned repeats.
- **Alpha:** opaque clean plate; one full crop and one overscan derivative.
- **Scale:** working master at source crop resolution or larger; target derivative up to `1536px` on the long axis.
- **Acceptance:** extracted layers can move within their approved amplitudes without exposing seams; frozen stack matches the source crop closely.

## `AB-MUS-02`: Receiver Anchor And Ring Set

- **Goal:** keep the black-gold receiver spatially fixed while allowing two or three nested ring/lens parts to turn around measured pivots.
- **Deliverables:** one fixed body plate, up to three ring/lens plates, pivot coordinates in source-normalized crop space, one local occlusion mask, and one restrained emission mask.
- **Lighting:** preserve amber metal and cyan environmental reflections; remove only lighting that must move independently.
- **Alpha:** retain fine orbit marks without dark fringe; no opaque rectangular shadow.
- **Acceptance:** rings can rotate without revealing missing body matter or making the object look mechanically disconnected.

## `AB-MUS-03`: Rooted Coral Groups

- **Goal:** produce three independently addressable coral/fan groups that can bend locally while remaining planted.
- **Grouping:** large west fan; central amber/cyan frond cluster; lower/edge reef forms. Do not split every filament into a sprite.
- **Generation rule:** use the image-generation workflow only to continue genuinely hidden tendrils or repair insufficient source matter. Generated forms must be original, transparent, camera-aligned, and subordinate to the source composition.
- **Deformation margin:** include enough transparent overscan around tips for the approved `7-17s` sway bands.
- **Alpha:** preserve hairline filaments and translucent fan membranes over black, white, checkerboard, and route-background diagnostics.
- **Acceptance:** root pixels remain fixed; bodies flex less than tips; adjacent groups do not share one phase; no rubber-sheet wobble.

## `AB-MUS-04`: Cyan Organism-Instrument

- **Goal:** separate the cyan/red organism-instrument from neighboring coral and ground without losing its hybrid biological/mechanical identity.
- **Deliverables:** fixed/root body, translucent bulb/membrane plate, one ring plate with pivot, local refraction/emission mask, and repair patch behind the ring.
- **Motion implication:** membrane settling and refraction may be continuous; the ring rotates slowly; the rooted body does not drift.
- **Acceptance:** it reads as one connected specimen at rest and as several causally related materials in motion.

## `AB-MUS-05`: Lower Directional Current

- **Goal:** author a clean current that transports cyan and coral-red energy from west toward the center instead of oscillating in place.
- **Source fidelity:** follow the existing path family and local widths; do not trace project labels or bake graph relationships into the base current.
- **Deliverables:** centerline/path, width profile, alpha or mesh texture, red/cyan phase separation, and occlusion split for behind/in-front relationships.
- **Acceptance:** speed, width, and emission can vary independently while direction remains coherent; a reviewed graph edge can join the current without looking pasted on.

## `AB-MUS-06`: Vapor Volume Set

- **Goal:** create three quiet atmospheric volumes: far field haze, vessel-adjacent cyan plume, and low basin mist.
- **Generation rule:** transparent background only; no scenic background, architecture, particles, or hard-edged smoke stock effect.
- **Depth:** each volume must have a named far/back/mid placement and may not all travel at one speed.
- **Alpha:** inspect gradients for banding, clipped borders, and dark premultiplication.
- **Acceptance:** volumes can advect and change density without obvious loops, boiling, or crossing semantic text at high opacity.

## `AB-MUS-07`: Near Occluder Set

- **Goal:** establish foreground depth through rare spores, short filaments, translucent reef fragments, and one or two soft shadow forms.
- **Frequency:** designed for irregular `23-61s` events with long absent periods.
- **Exclusions:** no human-like presence, fake visitor indicator, confetti, generic dust storm, or constant screen-wide traffic.
- **Acceptance:** individual paths are short, sparse, and non-repeating; navigation and labels stay readable; reduced motion uses a balanced still foreground or omits traversal.

## `AB-MUS-08`: Organic Deformation Weights

- **Goal:** encode fixed root, restrained body, and flexible tip zones for `AB-MUS-03` and membrane-specific weights for `AB-MUS-04`.
- **Deliverables:** grayscale or packed RGBA weights, documented channel meanings, and diagnostic color composite.
- **Acceptance:** zero-weight roots are visible in diagnostics; no deformation crosses an unrelated plate or pulls the ground.

## `AB-MUS-09`: Depth And Occlusion Maps

- **Goal:** encode the crop's far field, anchor, flow, rooted ecology, reflective ground, and near occluder relationships.
- **Deliverables:** coarse depth map, explicit binary/soft occlusion masks for receiver/coral/organism/flow, and a stack-order diagram.
- **Acceptance:** the lower current can pass behind the receiver and in front of selected background matter; vapor and near forms can occupy more than one depth band.

## `AB-MUS-10`: Flow And Emission Controls

- **Goal:** separate directional travel from brightness and from basin response.
- **Deliverables:** two-channel flow direction, width/density control, cyan/red emission masks, and one lagged basin-response mask.
- **Acceptance:** the current still reads when emission is disabled; changing light does not fake flow by sliding an unrelated gradient.

## `AB-MUS-11`: Illumination And Caustic Controls

- **Goal:** make fixed matter participate through local moving light, shadow, reflection, and refraction.
- **Deliverables:** receiver metal catchlight mask, vessel/plume emission mask, coral translucency mask, organism bulb mask, basin caustic mask, and one broad shadow gobo.
- **Acceptance:** illumination follows depicted surfaces, remains local, and creates no route-wide synchronized pulse.

## Diagnostic Contact Sheet Requirements

`ART-12E` must show each color-bearing asset:

1. On black, white, 50% gray, checkerboard, and the clean crop background.
2. At `100%`, `50%`, and intended runtime scale.
3. With alpha edges enlarged enough to identify halos and clipped glow.
4. In the intended stack at the stable checksum frame.
5. In one exaggerated deformation/rotation/flow diagnostic that exposes missing margins or seams.
6. Beside rejected variants with a short rejection reason.

The sheet records provenance as `source extraction`, `manual`, `procedural`, or `generated`, plus source file, working master, derivative, dimensions, color space, alpha mode, intended owner, and budget contribution.

## Review Gate And Next Action

`ART-12C` has produced a complete reviewable brief set. It is not creative acceptance by itself. Mark should review the representative crop and `AB-MUS-01` through `AB-MUS-11` before any image generation, extraction, or runtime integration begins.

After that review, `ART-12D` produces only this batch, performs alpha cleanup, and prepares the diagnostic contact sheet. Compositor selection remains blocked until `ART-12E` accepts the real assets.
