# Museum Observatory Proof

## Review Surface

- Route: `/projects/observatory-proof`
- Region: `MUS-R08`, with supporting material from `MUS-R05`, `MUS-R06`, `MUS-R09`, `MUS-R13`, and `MUS-R14`
- Question: does fixed architecture feel alive when its optics, current, refraction, atmosphere, particles, and illumination keep independent time?

## Runtime Composition

Revision 11 keeps the marker-free curved ribbons and adds the three motion systems that make the supplied LaserFlow reference legible: high-contrast triangular flow modulation, independently seeded elongated wisps, and warped fog advection masked to each beam. One centralized control object now owns `flowSpeed`, `flowStrength`, `fogIntensity`, `fogScale`, `fogFallSpeed`, `wispDensity`, `wispSpeed`, and `wispIntensity`. Current tuning uses a `1.55x` flow multiplier, `0.9` flow strength, wisps moving `0.72` stage-widths per second at `1.65` intensity, and fog advecting at `0.42`. Pressure volumes and smaller baseline strands remain. Rejected markers and the vertical ellipse remain absent.

The structures themselves do not wobble. Reduced motion removes WebGL and preserves the particle-free fallback. Hidden tabs stop the render loop. The proof remains one viewport and is isolated from `/projects` and `/projects/ambient-proof`.

## Decomposed Asset Stack

| Runtime file | Source/alpha master | Job |
| --- | --- | --- |
| `field.webp` | `sources/empty-field-source.png` | Particle-free terrain and sky receiving procedural atmosphere and caustics |
| `observatory.webp` | `masters/observatory-alpha.png` | Fixed ivory lattice receiving refractive and migrating nacre light |
| `city.webp` | `masters/city-alpha.png` | Fixed crystal architecture receiving independent tower illumination |
| `portal.webp` | `masters/portal-alpha.png` | Fixed device body with independently refracted aperture and scan light |
| `fallback.webp` | `sources/composite-reference-source.png` | Particle-free, low-emission reduced-motion and renderer checksum |

Retained chroma sources are in `sources/`; transparent masters are in `masters/`; checkerboard and frozen-stack review images are in `diagnostics/`. Rebuild deterministic runtime derivatives with `node scripts/build-observatory-assets.mjs`.

The deterministic builder owns the same spacing transform used by the runtime and applies it to the fallback checksum. This keeps the production Museum hover distortion aligned with the revised, less crowded scene instead of reintroducing the earlier stacked composition during attention.

## Generation Record

Built-in image generation was used in edit/generation mode for five bounded outputs: a clean particle-free composite, an observatory-only magenta-key plate, an empty terrain field, a city-only green-key plate, and a portal-only magenta-key plate. Every prompt prohibited stars, dust, sparks, signal ribbons, waveforms, bloom, and floating particles; transparent plates were keyed locally with a soft matte, despill, and one-pixel edge contraction. No generated asset supplies runtime particle motion.

## Local Gate

- TypeScript and focused ESLint pass.
- Browser check at `1912 x 948` reports two canvases, four production Museum effect layers, no document overflow, and a live attention state.
- Revision 1 failed creative review because the dominant crop still read as static. A six-second stage comparison changed only about `0.3%` of color channels by more than four levels.
- Revision 2 adds a separate SVG/DOM kinetic layer: three unequal optical rotations, animated current dashes, three traveling signal packets, repeated lens wavefronts, a cross-architecture light sweep, and independently translating near/far fog. WebGL continues to own sampled mechanism motion, refraction, fluid body light, and particles beneath it.
- A `4.2s` revision-2 stage comparison changes about `13.6%` of color channels by more than four levels, with a mean channel change of about `2.26/255`. The two sampled frames retain the same fixed architectural silhouette.
- Production commit `154d331` passes the same no-attention check at `1912 x 948`: a `4.2s` comparison changes about `16.6%` of stage channels by more than four levels, with no viewport overflow or console errors.
- Revision 3 removes the static-particle source image from normal rendering and introduces four independently shaded structural plates plus three procedural particle depths. Code commit `bc3c071` is live in Production deployment `dpl_AzJAAJf6hbwv2wusYgJjdrMVA87y`. Public `1912 x 900` inspection confirms materially different idle frames, a stronger localized attention state, two canvases, exact viewport/document dimensions, completed media, and no console warnings or errors.
- Mark's revision-3 review found the structural layers too crowded and the no-input material life too quiet despite liking the hover effects. Revision 4 separates the three anchors, reduces duplicated current density, increases the procedural particle ecology to 700 independently twinkling points, strengthens idle architectural light, rotates only optical interiors, adds portal wavefronts, and preserves the accepted hover pipeline.
- Revision 4 code commit `235a8c8` is live in Production deployment `dpl_2hTedQpmVNX8NUKiAoVP9vKYrq31`. Public `1280 x 720` review confirms a settled no-input state with moving particles and material light, a stronger attended state, two canvases, exact viewport/document dimensions, and no console warnings or errors. Mark's creative review remains open.
- Mark approved revision 4's spacing and ambient improvement, then requested real 3D rotation for the central sphere and slow unsynchronized window life. Revision 5 cuts the raster sphere from the lattice plate, inserts a procedural icosphere at the same optical pivot, and gives every city window cell its own eased `9-15s` state rhythm and cyan-to-amber bias.
- Mark found the first revision-5 window mask spreading onto the foreground building and stairs. The corrected mask uses three feathered tower-only zones with an explicit lower cutoff, preserving random light only on skyscraper façades.
- Corrected revision-5 code commit `804d530` is live in Production deployment `dpl_FaCHcKD1chcBvUa5vgPQXcjJ4ag4`. Public `1280 x 720` quiet inspection confirms the foreground exclusion, two canvases, exact viewport/document dimensions, no overflow, and no console warnings or errors. Creative review remains open.
- Mark requested that the cyan-gold current and the original copper, ivory, arch, and spectral flow families be generated in code rather than supplied by static imagery. Revision 6 uses Strands-like independent wave phases, Soft-Aurora-like noise bodies, and Laser-Flow-like traveling cores inside the existing Three.js renderer; it does not add a second WebGL runtime or `ogl` dependency.
- Revision-6 code commit `85a2d2a` is live in Production deployment `dpl_9wM1fHTzt7iq4rBDxE5gKnPaTQZp`. Public `1280 x 720` inspection confirms exact one-screen geometry, two canvases, changing idle frames, a distinct local attention frame, completed media, and no console warnings or shader errors. The runtime asset stack remains particle- and ribbon-free.
- Mark found revision 6 technically animated but perceptually static. Revision 7 adds explicit crossing-time contracts, coherent light fronts, elongated traveling bands, a comet wake, and sparse curve-bound signal carriers so direction is readable without pointer input.
- Revision-7 code commit `d2f1bf8` is live in Production deployment `dpl_B5va9mV176oJBDcKf543DGAaLzSt`. It passes `205/205` tests, content validation, TypeScript, zero-error lint, and the 37-page build. Public `1280 x 720` inspection confirms changing short-interval frames, exact one-screen geometry, two canvases, and no console warnings or shader errors.
- Mark still could not perceive revision 7's flow and rejected the large traveling elliptical light/fog sweep. Revision 8 shortens every crossing clock, increases geometric undulation and moving-front contrast, and adds explicit path-bound tracer segments and signal heads. The rejected ellipse and its animation are deleted rather than restyled.
- Revision-8 code commit `06e23c6` is live in Production deployment `dpl_5gQ1cdZQmcadNdQ9BrCwovzYD69Z`. It passes `205/205` tests, content validation, TypeScript, zero-error lint, and the 37-page build. Public `1280 x 720` frames separated by `0.9s` show clearly displaced cyan and ivory tracer segments and signal heads, exact one-screen geometry, and no reappearance of the removed ellipse.
- Mark rejected revision 8's circles and short rods because they were visible markers rather than flow, and the underlying ribbons still read as static at page scale. Revision 9 deletes the entire tracer layer and all dot-like shader carriers, then synchronizes the ribbons' geometry, thickness, crossings, broad crests, and internal light texture to faster material clocks.
- Revision-9 code commit `cce1085` is live in Production deployment `dpl_Ehm7eWET5nuUtrfSwk8YS4Dr1e2i`. The aggregate suite, content validation, TypeScript, zero-error lint, and 37-page build pass. Production inspection finds zero tracer or `animateMotion` marker nodes and preserves the one-screen composition.
- Mark found revision 9 only slightly more legible and rejected its globally enlarged ribbon scale. Revision 10 restores slender default strands and replaces the broad stationary-looking thickening with localized moving pressure volumes that expand and contract the entire ribbon cross-section.
- Revision-10 code commit `1cec136` is live in Production deployment `dpl_6HEh1ETqoMB8Fdw12uybjDVzoqgM`. The aggregate suite, content validation, TypeScript, zero-error lint, and 37-page build pass. Public `1280 x 720` inspection confirms two canvases, exact one-screen width, normal motion mode, and zero marker nodes.
- Mark still found revision 10's movement difficult to perceive and resupplied the LaserFlow implementation as the required behavioral reference. Revision 11 adopts its separate modulation, segmented-wisp, and beam-fog mechanisms while retaining the observatory composition and centralizing all motion controls for direct tuning.
- Revision-11 code commit `69bd1c9` is live in Production deployment `dpl_DpXjzHrHe8MNurdtPmCy5k67xSLB`. The aggregate suite, content validation, TypeScript, zero-error lint, and 37-page build pass. Local WebGL compilation and public `1280 x 720` inspection confirm both flow canvases, exact one-screen width, normal motion mode, and zero markers.
- Creative review remains open; this route does not yet authorize full east-side integration.
