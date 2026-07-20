# Supporting-Route Dynamic Scene Packet

Last updated: 2026-07-19

## Scope

This packet implements `ART-10` for Home, About, the global AI archive, and project reading surfaces. It deliberately does not create a shared supporting-route renderer. The four routes share only bounded numeric state; each owns its materials, choreography, and reason to move.

## Route Contracts

| Route | Named cause | Layer pack | Primary renderer | Stable/calm behavior |
| --- | --- | --- | --- | --- |
| Home | First Note phase | threshold matte, painted presence, awakened fragment, notation orbit, 3D instrument | DOM/CSS/SVG plus existing Three.js | dark threshold remains legible; reduced motion resolves directly to the selected phase |
| About | inspected timeline event | archive matte, illuminated manuscript, chronology prism, memory orbits, timeline content | existing Three.js background plus DOM/CSS/SVG | event state changes without an autonomous loop; timeline remains primary |
| AI | open, context, and request activity | quiet mark, archive vellum, context aperture, response signal, conversation surface | DOM/CSS/SVG | closed presence remains quiet; CSS reduction removes transitions without hiding context |
| Reading | deliberate page scroll | reading matte, project material, page fragment, margin trace, reading content | DOM/CSS/SVG | no autonomous motion; reduced motion removes fragment disturbance and transforms |

## Driver Matrix

| Driver | Home | About | AI | Reading |
| --- | --- | --- | --- | --- |
| Visitor action | plays/reset First Note | selects or scrolls to event | opens/closes/asks | scrolls article or index |
| Semantic state | illumination phase | canonical event ID and index | route/object context | project-site identity |
| Continuous input | none beyond existing 3D pointer | none | none | bounded scroll progress |
| Autonomous loop added here | none | none | none | none |

## Distinction Review

- Home reads as a dark musical threshold whose diagram wakes with the existing instrument.
- About reads as an illuminated chronology whose prism and orbit move to the inspected life event.
- AI reads as a translucent contextual aperture rather than a second destination or generic chat modal.
- Reading remains mostly still; its material shifts only as the visitor advances through the page.
- None copies Museum topology, LifeInbox settlement, Dreamlife refraction/recombination, or Sudoku ownership/version traces.

## Renderer And Performance Envelope

- No new Canvas, WebGL context, shader, dependency, image asset, or continuous scheduler is introduced.
- Home reuses its existing Three.js renderer; all new route layers are GPU-composited CSS/SVG.
- About reuses its existing background renderer and Zustand timeline state.
- AI layers exist only while the archive is open.
- Reading uses one passive scroll listener and at most one queued animation frame; cleanup cancels both.
- Existing optimized artwork remains the checksum, poster, and failure composition.

## Test And Capture Matrix

- Pure models cover threshold, inspected event, contextual aperture, bounded reading progress, and calm behavior.
- Browser proof covers Home dark-to-visible threshold, About birth-to-mmorpgs inspection, AI contextual opening, and the LifeInbox reading stable frame.
- Aggregate proof: 46 test files/184 tests, 58 nodes/28 relationships, TypeScript, lint with zero errors, and 35-page production build.
- Browser automation did not drive a document scroll for reading; the initial composition is browser-proven and scroll/reduced behavior is reducer-tested.

## Restart State

`ART-10` is locally implemented and in review. Production remains `806841d`. Continue with `ART-11` cross-route maturation; do not add motion merely to make every route equally active.
