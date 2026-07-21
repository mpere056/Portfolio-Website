# Museum Observatory Proof

## Review Surface

- Route: `/projects/observatory-proof`
- Region: `MUS-R08`, with supporting material from `MUS-R05`, `MUS-R06`, `MUS-R09`, `MUS-R13`, and `MUS-R14`
- Question: does fixed architecture feel alive when its optics, current, refraction, atmosphere, particles, and illumination keep independent time?

## Runtime Composition

Revision 3 replaces the dominant runtime crop with a particle-free five-file stack. The dark field, ivory lattice, crystal city, and portal device are separate plates; the fifth file is a low-emission fallback only. Normal motion is code-generated: terrain caustics migrate, lattice nacre light travels, tower illumination climbs on unequal clocks, portal glass refracts, cyan and gold packets follow procedural currents, two haze depths advect, diagram rings respond near attention, and three Three.js particle depths cross the scene. The accepted production Museum membrane, aperture, mesh, halo, veil, and particle response are reused exactly above the route-local compositor.

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
- Creative review remains open; this route does not yet authorize full east-side integration.
