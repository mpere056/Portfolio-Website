# Museum Region Atlas And Motion Ledger

Date: 2026-07-20
Stage: `ART-12B`
Status: mapping complete; production and runtime work not started
Source checksum: `7CB42FAFD2656BA4750EE6AEDF897A54ED64A72F0ED65814ACDAA52CB791CCAE`

## Coordinate Contract

The source image is `1672 x 941`. Atlas coordinates are source-normalized values from `0.000` to `1.000`, expressed as `(x0,y0)-(x1,y1)`. Pixel bounds are rounded working references, not segmentation masks.

Regions overlap intentionally. Atmosphere sits behind and between structural matter; streams cross several anchors; illumination and occlusion are responsibilities that traverse material boundaries. A production mask must follow the depicted edge, not the rectangular atlas box.

At the audited desktop geometry, `object-fit: cover` exposes approximately source `y 0.095-0.905`. The full source still governs fallback composition and responsive derivatives.

## Source-Region Atlas

| ID | Source bounds | Dominant matter | Depth band | Structural responsibility | Current ambient status |
| --- | --- | --- | --- | --- | --- |
| `MUS-R00` | `(0.000,0.000)-(1.000,1.000)` / `(0,0)-(1672,941)` | Approved fused ecology checksum | fallback only | First useful frame and complete silhouette | Static by design; cannot be the standard dominant scene |
| `MUS-R01` | `(0.140,0.000)-(1.000,0.920)` / `(234,0)-(1672,866)` | Deep nocturnal void, distant haze, sparse stars | far atmosphere | Carries negative space and depth continuity behind every system | Dead zone; only global overlays change above it |
| `MUS-R02` | `(0.000,0.035)-(0.205,0.475)` / `(0,33)-(343,447)` | Cyan gaseous vessel and crystalline plume | background/midground | Establishes receiving-vessel material and the left atmospheric inlet | Dead zone; plume and local light are fused |
| `MUS-R03` | `(0.155,0.130)-(0.355,0.610)` / `(259,122)-(594,574)` | Black-gold receiver, rings, lens, and orbit marks | background anchor | Fixed mechanism near LifeInbox signal | Dead zone; mechanism and illumination are fused |
| `MUS-R04` | `(0.305,0.030)-(0.590,0.420)` / `(510,28)-(986,395)` | Nacre orbital core with nested spheres and wire cage | background/focal anchor | Upper central mass and Dreamlife bridge | Dead zone; nested parts do not rotate or refract independently |
| `MUS-R05` | `(0.475,0.045)-(0.965,0.390)` / `(794,42)-(1613,367)` | Upper coral-gold ribbon network | mid/far flow | Connects central core to east observatory | Dead zone; reads as a frozen waveform |
| `MUS-R06` | `(0.430,0.235)-(0.790,0.535)` / `(719,221)-(1321,503)` | Cyan midstream ribbon | midground flow | Carries energy across book, Sudoku, and observatory regions | Dead zone; no directional transport |
| `MUS-R07` | `(0.330,0.330)-(0.575,0.700)` / `(552,311)-(961,659)` | Illuminated book-city and portal | focal anchor | Central authored-memory landmark | Dead zone; architecture may stay fixed but light, page, fog, and shadow do not change |
| `MUS-R08` | `(0.635,0.055)-(0.955,0.725)` / `(1062,52)-(1597,682)` | Ivory orbital observatory and lens lattice | background/focal anchor | Largest east-side structure and Sudoku landmark | Dead zone; all rings, apertures, and reflections are fused |
| `MUS-R09` | `(0.760,0.205)-(1.000,0.585)` / `(1271,193)-(1672,550)` | East waveform, spires, and distant city light | far/background | Extends world beyond the observatory | Dead zone; architecture and waveform remain inert |
| `MUS-R10` | `(0.000,0.405)-(0.330,1.000)` / `(0,381)-(552,941)` | West coral fans, fronds, and rooted reef | foreground/midground organic | Primary proof of material-local deformation | Dead zone; roots and tips are fused into the matte |
| `MUS-R11` | `(0.055,0.545)-(0.330,0.995)` / `(92,513)-(552,936)` | Cyan/red organism-instrument and bulb membranes | midground organic/mechanism | Bridges coral and technical instrument languages | Dead zone; membranes, bulbs, and local glow are fused |
| `MUS-R12` | `(0.255,0.535)-(0.640,0.930)` / `(426,503)-(1070,875)` | Lower cyan/red current and ring traces | midground flow | Moves energy through historical signals toward the portal device | Dead zone; no coherent flow or independent wave phase |
| `MUS-R13` | `(0.480,0.515)-(0.745,0.995)` / `(803,485)-(1246,936)` | Black camera-like portal device and circular view | focal anchor | Historical-project lens and strong central-lower mass | Dead zone; aperture, internal light, and crossing atmosphere are fused |
| `MUS-R14` | `(0.705,0.500)-(1.000,1.000)` / `(1179,471)-(1672,941)` | Pink crystal city, steps, and east foreground matter | background/foreground anchor | Right-side historical destination and depth terminus | Dead zone; buildings can stay fixed but illumination and foreground passage are absent |
| `MUS-R15` | `(0.180,0.675)-(0.800,1.000)` / `(301,635)-(1338,941)` | Dark basin, reflections, low mist, and connecting ground | midground ground/reflective field | Makes independent systems share one physical world | Dead zone; reflection and mist do not evolve |
| `MUS-R16` | `(0.000,0.790)-(1.000,1.000)` / `(0,743)-(1672,941)` | Near rock, reef silhouettes, and edge occluders | foreground occlusion | Establishes camera depth and protects lower crop edge | Dead zone; no sparse near-field traversal or shadow passage |

The union of `MUS-R01` through `MUS-R16` accounts for every dominant source region. Tiny embedded ornaments inherit the motion responsibility of their containing region until `ART-12D` segmentation reveals a visually significant independent object. Such an object must receive a new stable ID before integration; it cannot remain an unnamed exception.

## Depth And Occlusion Order

| Order | Band | Regions | Required relationship |
| ---: | --- | --- | --- |
| 0 | Stable fallback | `MUS-R00` | Visible before optional material layers and on any compositor failure |
| 1 | Far field | `MUS-R01`, distant parts of `MUS-R09` | Behind all anchors; slowest atmosphere and light migration |
| 2 | Background anchors | `MUS-R02`, `MUS-R03`, `MUS-R04`, `MUS-R07`, `MUS-R08`, `MUS-R09`, `MUS-R14` | Spatially fixed masses with internal or crossing temporal participation |
| 3 | Interstitial flow | `MUS-R05`, `MUS-R06`, `MUS-R12`, atmosphere from `MUS-R01` | Must pass behind some anchors and in front of others; one flat overlay is invalid |
| 4 | Reflective ground | `MUS-R15` | Receives changing color/light from nearby systems without mirror-perfect simulation |
| 5 | Rooted near ecology | `MUS-R10`, `MUS-R11` | Roots remain fixed; bodies and tips can cross signals only within controlled masks |
| 6 | Focal portal | `MUS-R13` | Can occlude lower flow and receive foreground atmosphere; its architecture does not wobble |
| 7 | Near occlusion | `MUS-R16` plus sparse generated spores/filaments | Crosses the camera infrequently; never blocks navigation or labels |
| 8 | Semantic surface | Signals, relationship SVG, labels, controls | Remains legible and interactive above visual matter except intentional non-interactive mist/light |

## Coordinated Temporal Bands

One future Museum clock supplies deterministic phase channels. These bands are intentionally non-harmonic enough to avoid a shared breath.

| Channel | Nominal period/range | Material rule | Stimulation behavior | Reduced-motion result |
| --- | --- | --- | --- | --- |
| `deep-advection` | `47-83s` | Large far haze changes density and drifts laterally with no obvious reset | Density and distance vary, direction does not reverse | Stable authored haze |
| `local-vapor` | `19-37s` | Vessel plumes curl, detach softly, and dissipate upward | More visible curls, not faster boiling | One resolved plume shape |
| `organic-tide-a/b/c` | `7-17s` | Rooted fans use separate base, body, and tip weights with phase offsets | Small amplitude range; roots always fixed | Selected complete silhouette |
| `upper-flow` | `16-31s` | Coral-gold energy travels eastward with changing width/emission | Higher visibility and local deflection near attention | Static readable current |
| `cyan-flow` | `10-23s` | Midstream and lower currents transport energy continuously, never oscillate in place | Pointer/graph state bends or concentrates ongoing flow | Static path plus semantic emphasis |
| `mechanism-ratio-a/b/c` | `13s`, `29s`, `47s` with authored pauses | Rings rotate around measured pivots at related, unequal ratios | Focus aligns or slows a local assembly | Stable aligned mechanism |
| `illumination-migration` | `11-41s` | Interior light, refraction, shadow, and reflection travel across fixed anchors | Selected regions clarify; others remain alive but quiet | One materially complete light state |
| `surface-response` | `18-44s` | Basin reflections and caustics lag source light and flow | Amplitude only | Stable reflective ground |
| `near-passage` | irregular `23-61s` events | Sparse occluders cross short paths at varied depth and then remain absent | Event frequency changes, not speed alone | No traversal; one balanced foreground state |
| `semantic` | state-bound | Reviewed relationships join existing currents and project matter | Meaning changes amplitude, direction, or clarity | Immediate static semantic state |
| `visitor` | continuous input | Pointer/focus modulates current phases without replacing ambient life | Scaled by stimulation | Immediate local state without interpolation |

## Motion Coverage Ledger

| Region | Direct temporal responsibility | Indirect participation | Visitor/semantic modulation | Required ingredients | Dead-zone state |
| --- | --- | --- | --- | --- | --- |
| `MUS-R01` | Multi-depth haze advection and density evolution | Receives migrating cyan/amber light | Active signal locally clears or gathers haze | Clean field plate, two vapor plates or procedural volumes, depth mask | Mapped; assets/runtime missing |
| `MUS-R02` | Plume curls and crystalline emission variation | Shadow/light from west coral passes across vessel | LifeInbox proximity gathers vapor toward receiver | Clean plate, plume alpha layers, emission mask, local depth mask | Mapped; assets/runtime missing |
| `MUS-R03` | Nested rings rotate at unequal ratios; lens aperture settles | Vapor crosses behind/front; metal catches moving light | LifeInbox focus aligns one ring and warms receiver | Transparent anchor, ring plates, pivot metadata, occlusion/emission masks | Mapped; assets/runtime missing |
| `MUS-R04` | Inner spheres drift/rotate subtly; nacre refraction migrates | Upper streams pass behind cage and in front of void | Dreamlife focus changes refraction and stream convergence | Core/cage plates, sphere plates, depth/refraction/emission masks | Mapped; assets/runtime missing |
| `MUS-R05` | Directional eastward coral-gold transport | Haze partially occludes distant sections | Graph edges can merge into a reviewed branch | Authored paths, width/emission map, foreground split mask | Mapped; assets/runtime missing |
| `MUS-R06` | Directional cyan transport with independent width and phase | Casts light into basin and book mist | Sudoku or selected east signal bends concentration | Flow path/mesh, flow map, emission and occlusion masks | Mapped; assets/runtime missing |
| `MUS-R07` | Page edge flex, interior light migration, doorway mist | Streams and foreground dust cross at different depths | Story focus clarifies page/portal without moving architecture | Fixed book-city plate, page mask, light/gobo map, mist layer | Mapped; assets/runtime missing |
| `MUS-R08` | Rings/apertures rotate around credible pivots; glass catches changing light | Cyan stream and east haze cross through lattice depth | Sudoku focus addresses one lattice path | Split mechanism plates, pivots, depth/occlusion/refraction/emission maps | Mapped; assets/runtime missing |
| `MUS-R09` | Waveform travels; distant lights vary asymmetrically | Far haze passes between spires | East historical signal increases local legibility | Far city plate, SVG/texture waveform, atmosphere and emission masks | Mapped; assets/runtime missing |
| `MUS-R10` | Rooted coral sway with independently weighted fans and fronds | Local fog/light and foreground spores cross it | Nearby signals bias direction slightly; no hover-only start | Three or more rooted alpha plates, deformation weights, root masks | Mapped; representative `ART-12D` target |
| `MUS-R11` | Membranes settle, bulbs refract, small rings turn | Coral and lower stream partially occlude it | Group Finder focus performs a restrained caliper-like sweep | Organism plates, membrane mask, ring pivot, emission/refraction masks | Mapped; representative `ART-12D` target |
| `MUS-R12` | Lower current travels laterally with separate red/cyan phases | Reflects in basin and passes behind portal device | Historical relationships join, branch, or clarify existing current | Flow vectors, alpha ribbon, flow/emission/occlusion maps | Mapped; representative `ART-12D` target |
| `MUS-R13` | Internal aperture rotates/settles and portal light changes | Lower current passes behind; near mist passes in front | Discord bot focus tunes aperture and reveals reviewed evidence | Fixed device plate, aperture plate/pivot, portal emission, depth mask | Mapped; assets/runtime missing |
| `MUS-R14` | Crystal/interior illumination migrates; edge shadows change | East haze and rare foreground matter cross architecture | Game-mod focus raises local crystal signal | Fixed architecture plate, emission/gobo masks, atmosphere/occluders | Mapped; assets/runtime missing |
| `MUS-R15` | Reflection, caustic, and mist evolve with delayed response | Receives color from all nearby flow/illumination systems | Selection creates local clarity, not a new global glow | Ground plate, reflection/caustic map, shallow mist, depth mask | Mapped; representative `ART-12D` target |
| `MUS-R16` | Sparse near-field passage and shadow movement | Occludes limited portions of anchors and flow | Stimulation changes frequency; semantics do not fake visitors | Foreground alpha silhouettes/sprites, short paths, exclusion masks | Mapped; representative `ART-12D` target |

## Representative Proof Crop

`ART-12D` is limited to source `(0.000,0.390)-(0.430,1.000)`, approximately `(0,367)-(719,941)`. This west/lower ecology crop is selected because it tests the hardest reusable material problems in one bounded area:

- rooted coral with separate base/body/tip deformation;
- a partially mechanical cyan organism;
- background and interstitial vapor;
- directional lower flow;
- moving illumination and basin response;
- sparse foreground occlusion;
- fixed project-signal semantics above all of it.

It deliberately excludes full-scene observatory decomposition, Dreamlife core production, and east-side architecture. Success authorizes a compositor decision, not bulk production.

## `ART-12B` Exit

All dominant Museum regions have stable IDs, source bounds, depth ownership, temporal responsibilities, calm behavior, and named implementation gaps. No unexplained dominant dead zone is hidden in a route-level status. The representative proof crop is bounded. Asset production remains gated by the `ART-12C` briefs.
