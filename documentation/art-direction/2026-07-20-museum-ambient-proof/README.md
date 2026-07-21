# Museum Ambient Material Proof

Date: 2026-07-20
Stage: `ART-12E`
Status: asset review in progress
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
| Clean field/basin | review-ready | Repaired fixed anchor behind moving matter |
| Receiver/rings | review-ready | Ring set isolated from the organism body for pivoted motion |
| Rooted coral groups | review-ready | Transparent root/body/tip geometry plus deformation weights |
| Cyan organism-instrument | review-ready | Transparent body and independently addressable rings |
| Lower current | review-ready | Transparent directional flow plus RGBA flow map |
| Vapor volumes | review-ready | Separate far, vertical, and basin depth bands |
| Near occluders | review-ready | Separate sparse sprites and two foreground shadow forms |
| Control maps | review-ready | Deformation, depth, flow/emission, and illumination inputs |
| Contact sheet | review-ready | Assets pass black, white, checkerboard, and intended-stack self-review |

## Review Result So Far

- `ART-12D` is complete for the bounded proof crop. It does not claim that the Museum runtime is dynamic yet.
- Fine coral filaments, vapor edges, current detail, and occluder silhouettes remain legible on black, white, and checkerboard backgrounds.
- The intended-stack still proves that the pieces can reconstruct a coherent scene. It is a checksum, not a runtime background.
- No compositor has been selected and no live route file has changed. Mark's short [review surface](REVIEW.md) gates `ART-12F`.

## Reproduction And Provenance

- `asset-manifest.json` inventories generated outputs and encodes the reference-only source-crop rule.
- `scripts/build-museum-ambient-proof.mjs` deterministically trims plates, separates sprites, authors control maps, and rebuilds diagnostics.
- `PROMPTS.md` records the image-generation prompt set, keyed working sources, and cleanup method.
- Original chroma working sources are retained non-destructively; no rejected variant is being concealed by the composite.
