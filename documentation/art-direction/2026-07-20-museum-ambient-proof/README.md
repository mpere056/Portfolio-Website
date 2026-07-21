# Museum Ambient Material Proof

Date: 2026-07-20
Stage: `ART-12F`
Status: animated compositor proof in review
Creative approval: `1A, 2A, 3A` from Mark on 2026-07-20

## Scope

This folder contains the bounded lower-left Museum material proof. The source crop is a comparison reference only. It must never be used as a moving rectangular runtime layer.

Approved direction:

- The current fused Museum image is loading, reduced-motion, and renderer-failure fallback only.
- The normal scene is composed from independently addressable material layers.
- The first proof begins with lower-left coral, organism, directional current, atmosphere, ground response, and foreground depth.
- Motion is quiet and pervasive at idle, then more expressive around attention.

## Production Sequence

1. Preserve the exact source crop and clean background reference.
2. Produce separate rooted coral, organism/mechanism, flow, atmosphere, and foreground ingredients.
3. Remove generation backgrounds, clean alpha edges, and retain working sources non-destructively.
4. Inspect each ingredient on black, white, checkerboard, and intended-scene backgrounds.
5. Assemble a contact sheet for `ART-12E` review before choosing or integrating a compositor.

## Asset State

| Asset | State | Notes |
| --- | --- | --- |
| Source crop | complete | Diagnostic reference only; manifest forbids runtime use |
| Clean field/basin | accepted for proof | Stable geometry receives procedural light, fog, and caustics |
| Receiver/rings | accepted for proof | Ring texture is rotated around two code-owned pivots |
| Rooted coral groups | accepted for proof | Shader uses root/body/tip deformation weights |
| Cyan organism-instrument | accepted for proof | Shader owns refraction, emission, and membrane settling |
| Lower current | reference-only | Mark rejected the static plate as the runtime solution; the compositor generates flow in code |
| Vapor volumes | accepted for proof | Alpha volumes seed separate shader advection bands |
| Near occluders | accepted for proof | Sparse plates traverse code-owned foreground paths |
| Control maps | accepted selectively | Coral weights are used; obsolete raster-current maps remain archival only |
| Contact sheet | accepted with current revision | Mark approved the material family and requested a procedural current |

## Review Result So Far

- `ART-12D/E` are complete for the bounded proof crop. They do not claim that the full Museum runtime is dynamic yet.
- Fine coral filaments, vapor edges, current detail, and occluder silhouettes remain legible on black, white, and checkerboard backgrounds.
- The intended-stack still proves that the pieces can reconstruct a coherent scene. It is a checksum, not a runtime background.
- A one-clock hybrid WebGL compositor is selected for the proof and implemented at `/projects/ambient-proof`; `/projects` remains unchanged. See [compositor record](COMPOSITOR.md).
- Mark's next review is the animated route itself, not another technical document.

## Reproduction And Provenance

- `asset-manifest.json` inventories generated outputs and encodes the reference-only source-crop rule.
- `scripts/build-museum-ambient-proof.mjs` deterministically trims plates, separates sprites, authors control maps, and rebuilds diagnostics.
- `PROMPTS.md` records the image-generation prompt set, keyed working sources, and cleanup method.
- Original chroma working sources are retained non-destructively; no rejected variant is being concealed by the composite.
