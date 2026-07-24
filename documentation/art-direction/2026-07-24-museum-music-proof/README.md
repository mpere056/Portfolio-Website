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

Revision 3 adds a second proof-only element beneath the particles: `PianoGhost`, a dark translucent rendering of the same grand-piano geometry. It uses the particle sampler's exact scale and vertical offset, so the solid and particulate forms stay registered while the shared camera rotates. Its low-opacity physical surface and nearly imperceptible wireframe clarify the piano silhouette without becoming a brighter focal object than the particles.

## Boundaries

- `/` continues to use `HeroCube` with its default `home` variant.
- `/projects/music-proof` uses the same renderer with the `music-proof` variant.
- The proof introduces no alternate background, camera, piano model, particle language, navigation model, or color system.
- The translucent body uses the existing piano asset and is rendered only in the proof variant; the homepage remains unchanged.
- Home and Projects are not merged by this revision.
- If the added resonance is not an improvement, it can be removed without touching the shared homepage composition.

## Verification State

Revision 1 is retained in Git history at commit `4fc6cca` and is visually rejected. Revision 2 is implemented in commit `20a047a` and live in Vercel Production deployment `dpl_E9ZRonBn2X9tUYgL5rijQdztsSga`.

Public inspection of revision 2 confirms the corrected route exposes the exact same `threshold-matte painted-presence awakened-fragment notation-orbit three-dimensional-instrument` layer contract as Home, renders one Canvas in an exact `1280 x 720` document, and reports the `music-proof` variant. The normal homepage continues to report the `home` variant. Revision 3's aligned translucent body awaits release and visual verification.
