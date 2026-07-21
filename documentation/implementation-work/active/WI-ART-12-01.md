# WI-ART-12-01: Prove Pervasive Ambient Life In The Museum

## Properties

| Field | Value |
| --- | --- |
| State | in-review |
| Priority | high |
| Package | `ART-12` |
| Capabilities | `CAP-ART-013`, `CAP-ART-014` |
| Requirements | `V-22`, `V-31`, `V-32`, `V-33` |
| Outcome | `O-01`, `O-04` |
| Owner | Mark and Codex |
| Branch/worktree | `main` |
| Last update | 2026-07-21 |

## Current Truth

Production `fce50af` is the known-good functional and interaction baseline. The Museum fits one desktop viewport, exposes nine collision-free project signals, contains increasing depth, responds to pointer and graph state, and preserves semantic and stable fallbacks. It does not yet satisfy pervasive ambient-world acceptance: the dominant raster composition remains temporally inert while smaller overlays move.

The accepted correction is decomposition-first. Mark approved `1A, 2A, 3A`, accepted the produced material family for the proof, and requested more code-generated effects with the directional current generated procedurally. West-ecology revision 4 directly reuses the production Museum effect pipeline and is accepted. The second east-observatory proof has now reached revision 3: its dominant static crop and baked particle field are replaced by particle-free field, lattice, city, and portal plates with independently timed shaders and three procedural particle depths. Creative review remains open before integration.

## Resume Packet

- Planning source: [Pervasive Ambient Worlds Implementation Plan](../../implementation-plans/2026-07-20-Pervasive-Ambient-Worlds-Implementation-Plan.md).
- Known-good point: Production `fce50af`; 48 files/193 tests, content, TypeScript, zero-error lint, 35-page build, and public 1912x948 Museum geometry/interaction checks passed.
- Completed records: [ART-12A baseline](../../implementation-plans/2026-07-20-Museum-Ambient-Baseline.md) and [ART-12B atlas/ledger](../../implementation-plans/2026-07-20-Museum-Region-Atlas-And-Motion-Ledger.md).
- Material proof: [ART-12D/E proof package](../../art-direction/2026-07-20-museum-ambient-proof/README.md) contains retained working sources, separated plates, control maps, deterministic assembly, alpha diagnostics, and manifest.
- Compositor decision: [Hybrid Compositor Record](../../art-direction/2026-07-20-museum-ambient-proof/COMPOSITOR.md); the static current plate is explicitly excluded from runtime derivatives.
- Observatory packet: [East Observatory Proof](../../art-direction/2026-07-21-museum-observatory-proof/README.md) contains retained generated sources, three alpha masters, diagnostics, deterministic derivatives, and the runtime layer contract.
- Next exact action: let Mark review deployed observatory revision 3 at `/projects/observatory-proof`. If accepted, close `ART-12F` and define bounded `ART-12G` integration from both accepted proofs. Technical documents are optional.
- After approval: complete `ART-12F`, then begin `ART-12G` integration without treating either bounded proof as whole-Museum acceptance.
- Preserve: one-screen composition, all nine project destinations, graph-aware meaning, contained depth, semantic controls, stimulation behavior, reduced motion, failure poster, and current route/history behavior.
- Do not begin with: a universal renderer, whole-image warping, parallax strips, generic particles, or route-wide synchronized breathing.

## Ordered Milestones

| Stage | State | Deliverable | Gate to continue |
| --- | --- | --- | --- |
| `ART-12A` Baseline | complete | Regression record for geometry, navigation, depth, interaction, semantics, calm/fallback, and measured runtime | Passed: known-good behavior and capture method are explicit |
| `ART-12B` Mapping | complete | Museum source-region atlas, motion coverage ledger, depth/occlusion relationships, and named dead zones | Passed: every dominant region has a proposed temporal responsibility |
| `ART-12C` Briefs | complete | Preserve/extract/manual/procedural/generate decision and production brief for each representative ingredient | Passed: Mark approved `1A, 2A, 3A` |
| `ART-12D` Production | complete | Small transparent/mask/map/vector/sprite batch for one representative ecology crop | Passed: alpha cleanup and deterministic diagnostics complete; no later-route assets generated |
| `ART-12E` Asset review | complete | Accepted/rejected contact sheet over diagnostic backgrounds and intended stack | Passed with revision: materials accepted for proof; directional-current plate is reference-only |
| `ART-12F` Compositor | in-review | Hybrid one-clock WebGL proofs with plate shaders and procedural systems | West ecology revision 4 is accepted; decomposed east-observatory revision 3 awaits deployed creative review |
| `ART-12G` Integration | not-started | Coordinated ambient Museum preserving all existing interactive and semantic behavior | Local aggregate, idle-life, dead-zone, calm, failure, and performance checks pass |
| `ART-12H` Release | not-started | Preview/Production captures, measurements, rollback record, and Mark review | `ART-13` may begin; otherwise record the failed gate and exact correction |

Production transparent-background assets are generated only during `ART-12D`. Concept frames may inform `ART-12B/C`, but they are not production plates and cannot advance the work to `ART-12E/F`.

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

- [x] Source-region atlas accounts for every dominant Museum region and names unmapped gaps.
- [x] Motion coverage ledger records direct or indirect participation, temporal band, stimulation behavior, fallback, and dead-zone status for every region.
- [x] Every production asset has a reviewed `ART-12C` brief before generation or extraction begins.
- [x] Asset contact sheet records provenance, scale, alpha/edge quality, renderer intent, budget, and rejected variants.
- [x] No production asset for a later route is generated during the Museum proof.
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
- `ART-12A` audited live Production at `1912 x 948`: one-viewport document geometry, nine signal rectangles, contained LifeInbox depth, one Canvas, no console warning/error, source dimensions/checksum, and the ten-second idle limitation are recorded.
- `ART-12B` maps `MUS-R01` through `MUS-R16`, their depth/occlusion order, independent temporal bands, direct/indirect participation, and the bounded west/lower proof crop.
- `ART-12C` defines `AB-MUS-01` through `AB-MUS-11`, shared art direction, alpha/diagnostic rules, budgets, and explicit no-bulk-generation boundaries.
- Mark clarified that the static checksum is not a creative-review target and that the technical documents are too long for review. A short three-decision creative approval surface now owns the gate; the static image is stated as fallback-only.
- Mark approved `1A, 2A, 3A`, completing `ART-12C` and authorizing only the bounded material proof.
- `ART-12D` produced separate coral, organism, ring, current, atmosphere, foreground, deformation, flow, depth, and illumination ingredients. Black/white/checkerboard diagnostics and the intended-stack checksum pass local visual review.
- The proof package has deterministic assembly and manifest tests. Focused proof and planning integrity checks pass `9/9`; focused ESLint passes. No production renderer or live route changed. `ART-12E` is in-review through two images and one `A/B` decision.
- Mark accepted the material family for testing and requested shader/code-generated effects, especially a purely procedural directional current.
- `ART-12E` completed with the generated current plate demoted to archival reference. Runtime derivatives deliberately omit it.
- `ART-12F` now runs at `/projects/ambient-proof` with one WebGL clock, weighted coral deformation, organism refraction/emission, opposed ring pivots, procedural current, advecting vapor, caustic light, procedural particles, and moving occluders. Normal/reduced-motion browser modes, bounded transfer, `13/13` focused tests, the `198/198` aggregate suite, TypeScript, zero-error lint, and the production build pass. The public Museum remains unchanged pending review.

### 2026-07-21

- Mark rejected compositor revision 1: the dominant coral read as static, mouse movement made clustered systems answer together, and the prior Museum's lighting/distortion quality was absent.
- Revision 2 removes pointer input from atmosphere, particles, and occluders; assigns distinct local lag/attack/release profiles to the remaining systems; adds root-pivoted coral and organism motion; and restores moving amber/cyan illumination across the material pixels.
- A stable five-second desktop comparison records focal-region mean RGB change of about `12.9/255`, with change above five levels across about `54%` of that region. This is a local creative gate, not Mark acceptance.
- Mark accepted that revision 2 felt more alive, then identified an ungrounded organism root, an imperceptible hover state, and missing Museum aperture/distortion effects.
- Revision 3 adds noise-shaped root dissolve, moving contact fog/filaments, reliable stage-normalized pointer coordinates, separate local acceleration signatures, WebGL lens/refraction, and a code-generated radial aperture/diffraction membrane. The one-viewport and reduced-motion contracts remain unchanged.
- Revision 3 passes `11/11` focused tests and the `200/200` aggregate suite, TypeScript, content validation, zero-error lint, and the production build. Browser checks at `1912 x 948` confirm no document overflow and a visible attention membrane that follows the normalized stage coordinate.
- Mark found that revision 3's custom attention membrane still lacked the exact `/projects` distortion and lighting character.
- Revision 4 removes the custom CSS approximation and reuses `getMuseumSceneFrame`, `MuseumParticleField`, and the production `ecologyMembrane`, `ecologyAperture`, `materialMesh`, and `ecologyVeil` styles. The proof supplies its animated fallback checksum to the same duplicated-artwork masks while its WebGL material systems continue independently underneath.
- Revision 4 passes `16/16` focused tests and the `201/201` aggregate suite, TypeScript, content validation, and zero-error lint. Local browser inspection confirms two canvases, four registered Museum effect layers, exact membrane mask/transform values, `plus-lighter` aperture blending, and zero viewport overflow.
- Mark accepted revision 4 as substantially better and asked for another Museum-region proof.
- `/projects/observatory-proof` now isolates `MUS-R08` and adjacent east-side material. It preserves architecture while three optical zones rotate at unequal ratios; code-generated cyan/gold current, refraction, haze, diagram geometry, particles, and migrating light keep independent time. The exact accepted production Museum attention pipeline remains above the route-local compositor.
- Local browser verification at `1912 x 948` confirms two canvases, four Museum effect layers, active pointer attention, and no document overflow. Creative review remains open before full east-side integration.
- Mark rejected observatory revision 1 because its technically continuous shader changes remained visually dominated by the static crop. A measured six-second comparison confirmed the problem: fewer than `0.3%` of stage channels changed by more than four levels.
- Revision 2 adds a clearly legible kinetic layer without moving the building: three optical assemblies rotate at unequal ratios; dashes and three signal packets travel through the current; lens wavefronts expand; light migrates across the architecture; and near/far fog translate independently. A `4.2s` comparison now changes about `13.6%` of stage channels by more than four levels while preserving the fixed silhouette.
- Revision 2 shipped in `154d331`. The live custom-domain route passes a no-attention `4.2s` comparison with about `16.6%` of stage channels changing visibly, one-viewport geometry, and no console errors.
- Mark identified revision 2's remaining static source particles and baked lighting as incompatible with the dynamic-scene goal. Revision 3 removes the dominant crop from normal rendering and generates a clean field plus isolated lattice, city, and portal plates. The runtime now owns every ambient particle, two haze depths, terrain caustics, signal flow, tower-light climbs, nacre migration, portal scanning/refraction, diagrams, and attention response. Architecture stays fixed while light and optical behavior cross it.
- Revision 3 passes `204/204` aggregate tests, content validation, TypeScript, zero-error lint, and the 37-page production build. Code commit `bc3c071` is live in Vercel Production deployment `dpl_AzJAAJf6hbwv2wusYgJjdrMVA87y`. Public inspection at `1912 x 900` confirms distinct idle and attended frames, two canvases, exact viewport/document dimensions, completed media, and no console warnings or errors.
