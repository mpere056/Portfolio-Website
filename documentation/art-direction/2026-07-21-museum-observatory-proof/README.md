# Museum Observatory Proof

## Review Surface

- Route: `/projects/observatory-proof`
- Region: `MUS-R08`, with supporting material from `MUS-R05`, `MUS-R06`, `MUS-R09`, `MUS-R13`, and `MUS-R14`
- Question: does fixed architecture feel alive when its optics, current, refraction, atmosphere, particles, and illumination keep independent time?

## Runtime Composition

Revision 5 retains revision 4's separated territories and replaces the baked central lens with a true Three.js pearl instrument. Its asymmetric mineral surface, fixed scene lights, Fresnel edge, and unequal-axis rotation make volume legible without moving the surrounding lattice. City windows now ease independently between off, dim, and lit states on slow stochastic clocks instead of sharing one pulse. The 700-particle ecology, procedural currents, portal, atmosphere, optical diagram, and accepted production Museum attention stack remain intact.

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
- Revision 5 code commit `835b8ac` is live in Production deployment `dpl_EH1Ee33XXuXxRZKqEHr9LJ1gXKT6`. Public `1280 x 720` quiet and attended checks confirm two canvases, exact viewport/document dimensions, no overflow, and no console warnings or errors. Creative review remains open.
- Creative review remains open; this route does not yet authorize full east-side integration.
