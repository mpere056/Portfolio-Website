# Piano Clearing Home Reset Decision

Date: 2026-07-26
Status: approved direction; first environmental proof in review
Supersedes: [2026-07-24 Homepage Practice World And Routing Decision](2026-07-24-Homepage-Practice-World-And-Routing-Decision.md) for Home composition and attention behavior
Retains at the time of decision: four project practices, separate `/about`, additive proof/release gates, and `/projects` rollback compatibility

> Superseded in part on 2026-07-30: Home now has three project practices. AI is cross-cutting rather than a fourth destination. See [Three-Practice Taxonomy](2026-07-30-Three-Practice-Taxonomy-Decision.md).
Packages: `ART-16`, `KG-07`, `PRJ-09`, `ARC-06`, `EXP-08`, `QA-07`

## Decision

Home becomes one authored outdoor clearing rather than five simultaneously visible proof worlds.

The clearing is an open-world aesthetic, not an open-world navigation system:

- the camera is cinematic and bounded;
- visitors do not walk, drive, orbit, or explore an infinite map;
- only the portion visible from the Home camera is built;
- the grand piano is the permanent spatial and emotional anchor;
- the terrain, horizon, grass, weather, and light form one coherent physical place.

The earlier five-anchor compositor and full proof-world takeover candidates are rejected. Their accepted project taxonomy and useful runtime lessons remain available, but their Home composition is not extended.

## Later Interaction Model

Later work happens only after the clearing is visually accepted.

1. A restrained animated figure sits at the piano. The figure represents Mark and links to `/about`.
2. Four diegetic UI screens occupy distinct positions above and around the piano. Each screen represents one project practice.
3. Proximity or hover gives one screen local emphasis and introduces a translucent environmental influence into the clearing.
4. Selection replaces the clearing's environmental state with that practice's authored environment while preserving spatial continuity where useful.
5. The selected practice reveals its projects and can hand off to existing project depth routes.

The screens are instruments inside the world, not a conventional four-card menu. Environmental previews must feel like light, weather, material, vegetation, particles, or distant structure entering the clearing. They must not look like rectangular screenshots pasted over the scene.

## Continuity Rules

- The piano remains recognizable through neutral, preview, and selected states.
- The camera and ground plane establish continuity; a category state may transform them but should not feel like an unrelated page cut.
- Hover preview is reversible and local.
- Click selection is durable and may own URL/history state later.
- About belongs to the pianist, not a fifth category screen.
- The four accepted practices remain the project taxonomy unless separately revised.

## Performance Rules

- One WebGL canvas owns the Home world.
- The visible terrain patch is finite and camera-authored.
- Grass uses instancing and shader motion, not one JavaScript update per blade.
- No physics, pathfinding, character controller, large world streaming, or real-time global illumination.
- No post-processing is added to the first proof.
- Device pixel ratio, object count, draw calls, and animation ownership are explicit budgets.
- Hidden tabs and reduced-motion mode stop autonomous work.
- Later environments are lazy, bounded state layers; four complete worlds never run simultaneously.

## First Review Boundary

The first review contains only:

- the fixed outdoor clearing;
- the existing grand piano;
- low-cost terrain, grass, horizon, clouds, lighting, and restrained camera breathing;
- performance and calm behavior.

It explicitly excludes the pianist, category screens, category hover previews, selected environments, project reveal, route migration, and public Home replacement.
