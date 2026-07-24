# Museum Music Chamber Proof

## Review Surface

- Route: `/projects/music-proof`
- Role: bounded bridge study between the Home threshold and the Project Museum
- Source object: the existing grand-piano GLTF used by the homepage
- Question: can the homepage instrument become a materially alive Museum district without replacing its recognizable identity?

## Runtime Composition

The grand piano remains the stable focal form. Its real mesh is retained as a quiet, dark physical body, while `6,400` sampled surface points rebuild the instrument as three independently breathing register fields. Bass, middle, and treble have separate colors, clocks, pressure, and local pointer response.

Five code-generated tube currents cross the chamber at different depths. A generated alpha texture carries multiple luminous pressure packets along each current; runtime texture offsets provide unambiguous direction without fragment-noise cost. Three orbiting resonators respond only to their nearby register. `220` notation motes drift independently through the room. No static image is used by the animated composition.

## Interaction Contract

- Idle motion exists in every register, current, resonator, and mote field.
- Pointer attention is horizontal and local: bass, middle, and treble do not intensify together.
- The piano remains the visual anchor; currents describe sound leaving it rather than becoming a background poster.
- The route is exactly one viewport and does not scroll.
- Hidden tabs stop the frame loop.
- Reduced motion and renderer failure retain a stable, code-authored piano checksum.

## Performance Contract

- Canvas DPR is capped at `0.9`.
- Piano matter uses `6,400` point sprites rather than the homepage's `10,000` instanced spheres.
- Atmosphere is capped at `220` points and updated in one buffer.
- Five currents use `72`-segment tubes and small generated textures.
- Bloom uses zero multisampling; transparent effect materials do not write depth.

## Acceptance State

Archive-core revision 4 is accepted as the current authored-memory proof after its attended delay changed from `2.4s` to `1.5s` and attended turn duration changed from `1.45s` to `1.05s`. The slower `13.5s` autonomous rhythm is unchanged.

The music chamber is implemented in commit `4fc6cca` and live in Vercel Production deployment `dpl_53ZeqyWnwUXhBHGpfUZT1NydCBEb`. Public inspection confirms the canonical title, one Canvas, exact `1280 x 720` viewport/document geometry, no renderer-boundary error, and no console warnings or errors. The in-app review browser does not initialize the site's WebGL canvases, including the existing homepage Canvas, so Mark's normal-browser creative review remains the visual acceptance source.

This is a review proof only: it does not yet merge `/` and `/projects`, replace the homepage, or authorize `ART-12G` whole-Museum integration.
