# Museum Music Proof

## Review Surface

- Route: `/projects/music-proof`
- Role: bounded bridge study between the Home threshold and the Project Museum
- Source scene: the existing homepage renderer
- Question: can the homepage instrument gain a small amount of musical life without changing its established aesthetic?

## Accepted Correction

Revision 1 was too far from the homepage. Although it retained the piano GLTF, it replaced the familiar dark particle instrument, circular portrait platform, painted threshold material, camera, lighting, navigation, and motion grammar with a separate cyan/amber chamber. Mark rejected that change in visual identity.

Revision 2 removes the separate chamber entirely. The proof now renders `HeroCube`, the same component used by `/`, with the same:

- `10,000` piano-surface particle instances;
- particle displacement and cursor response;
- dark violet circular platform and portrait texture;
- painted threshold material and notation layers;
- camera, stars, bloom, ambient light, cursor light, and auto-rotation;
- About, Projects, and site-wide AI pointers.

The only proof-specific addition is `PianoResonanceField`: three extremely faint platform-scale rings and three low-intensity, independently breathing lights. They remain behind the existing piano and use the homepage's blue-violet neutral palette. Reduced motion omits this optional addition and leaves the normal homepage scene unchanged.

## Boundaries

- `/` continues to use `HeroCube` with its default `home` variant.
- `/projects/music-proof` uses the same renderer with the `music-proof` variant.
- The proof introduces no alternate background, camera, piano model, particle language, navigation model, or color system.
- Home and Projects are not merged by this revision.
- If the added resonance is not an improvement, it can be removed without touching the shared homepage composition.

## Verification State

Revision 1 is retained in Git history at commit `4fc6cca` and is visually rejected. Revision 2 requires normal-browser creative review after release because the in-app review browser does not initialize the site's WebGL canvases, including the existing homepage Canvas.
