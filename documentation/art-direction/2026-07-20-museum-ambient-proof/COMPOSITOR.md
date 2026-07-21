# Hybrid Compositor Record

Stage: `ART-12F`
State: revision 4 implemented locally; awaiting redeploy and Mark review

## Decision

Use one route-owned WebGL canvas and clock for the representative ecology. Authored plates retain material detail; code owns deformation, refraction, flow, illumination, atmospheric advection, particles, and traversal. The generated directional-current plate is reference-only and is not exported to the runtime set.

Mark rejected revision 1 because the dominant coral still read as a static poster, clustered systems answered the pointer together, and the accepted Museum's richer lighting language had been lost. Revision 2 established credible quiet idle life. Revision 3 added grounding and a more legible attended state, but Mark correctly found that its approximation still did not reproduce the stronger `/projects` distortion and lighting. Revision 4 removes that approximation and directly reuses the production Museum scene frame, duplicated-artwork membrane, plus-lighter aperture, material mesh, halo, veil, and attracted particle field over the animated proof compositor.

## Runtime Systems

| System | Implementation |
| --- | --- |
| Stable terrain | Clean plate with shader-driven fog, migrating light, and ground caustics |
| Coral | Root-pivoted plate plus RGB root/body/tip mesh deformation, local phases, refracted detail, and traveling bioluminescence |
| Organism | Independently root-pivoted plate with segmented bending, refracted sampling, membrane movement, and traveling emission |
| Rings | Two opposed UV rotations around isolated receiver pivots |
| Current | Pure fragment shader with directional filaments, traveling packets, and expanding rings |
| Atmosphere | Three authored alpha volumes with independent procedural advection and density |
| Illumination | Independent amber/cyan passages and caustic pools at idle; attended state directly reuses the `/projects` duplicated-artwork membrane, plus-lighter aperture, mesh, halo, veil, and particle pipeline |
| Grounding | Animated contact shadow, teal fog, filaments, and noise-shaped alpha dissolve integrate the organism root with the field |
| Particles | Deterministic procedural point geometry with sparse independent drift |
| Foreground | Authored translucent plates on slow code-owned traversal paths |
| Fallback | Accepted still only for reduced motion, WebGL failure, and capture |

## Local Gate

- Dedicated route: `/projects/ambient-proof`; the public Museum renderer is untouched.
- One WebGL canvas in normal mode; zero canvases in reduced motion.
- Animated derivatives excluding fallback total less than `1.8 MiB`; no directional-current texture ships.
- Focused compositor/material/policy tests pass `16/16`; the aggregate suite passes `201/201`, TypeScript passes, content validation passes, and lint reports zero errors.
- The production build passes and prerenders `/projects/ambient-proof` as a static route.
- Browser at `1912 x 948` loads every declared derivative with no shader error. A 3.2-second idle comparison changes about `4%` of the full viewport while the scene occupies about `62%` of it.
- Atmosphere and occluders ignore pointer input. Coral, organism, rings, and current retain distinct local response profiles while the exact shared Museum effects frame drives membrane drift, aperture lighting, mesh, halo, and particles from the same top-down coordinate.
- A stable five-second browser comparison changes about `12.9/255` mean RGB in the focal region, with material change above five levels across about `54%` of that region; the root remains anchored.

This proves the selected arrangement, not full-Museum performance or `V-33` acceptance. `ART-12G` still owns integration with nine signals, graph state, depth, stimulation, and production geometry.
