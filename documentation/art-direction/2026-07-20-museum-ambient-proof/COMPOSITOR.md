# Hybrid Compositor Record

Stage: `ART-12F`
State: revision 2 implemented locally; awaiting redeploy and Mark review

## Decision

Use one route-owned WebGL canvas and clock for the representative ecology. Authored plates retain material detail; code owns deformation, refraction, flow, illumination, atmospheric advection, particles, and traversal. The generated directional-current plate is reference-only and is not exported to the runtime set.

Mark rejected revision 1 because the dominant coral still read as a static poster, clustered systems answered the pointer together, and the accepted Museum's richer lighting language had been lost. Revision 2 therefore treats idle life, local attention, and material-bound light as separate responsibilities.

## Runtime Systems

| System | Implementation |
| --- | --- |
| Stable terrain | Clean plate with shader-driven fog, migrating light, and ground caustics |
| Coral | Root-pivoted plate plus RGB root/body/tip mesh deformation, local phases, refracted detail, and traveling bioluminescence |
| Organism | Independently root-pivoted plate with segmented bending, refracted sampling, membrane movement, and traveling emission |
| Rings | Two opposed UV rotations around isolated receiver pivots |
| Current | Pure fragment shader with directional filaments, traveling packets, and expanding rings |
| Atmosphere | Three authored alpha volumes with independent procedural advection and density |
| Illumination | Independent amber/cyan passages and caustic pools crossing the authored materials at idle; pointer adds only a narrow delayed lens |
| Particles | Deterministic procedural point geometry with sparse independent drift |
| Foreground | Authored translucent plates on slow code-owned traversal paths |
| Fallback | Accepted still only for reduced motion, WebGL failure, and capture |

## Local Gate

- Dedicated route: `/projects/ambient-proof`; the public Museum renderer is untouched.
- One WebGL canvas in normal mode; zero canvases in reduced motion.
- Animated derivatives excluding fallback total less than `1.8 MiB`; no directional-current texture ships.
- Focused compositor/material tests pass `6/6`; the aggregate suite passes `199/199`, TypeScript passes, and lint reports zero errors.
- The production build passes and prerenders `/projects/ambient-proof` as a static route.
- Browser at `1912 x 948` loads every declared derivative with no shader error. A 3.2-second idle comparison changes about `4%` of the full viewport while the scene occupies about `62%` of it.
- Atmosphere, particles, and occluders ignore pointer input. Coral, organism, rings, current, and lens use different local radii, lag, attack, and release values.
- A stable five-second browser comparison changes about `12.9/255` mean RGB in the focal region, with material change above five levels across about `54%` of that region; the root remains anchored.

This proves the selected arrangement, not full-Museum performance or `V-33` acceptance. `ART-12G` still owns integration with nine signals, graph state, depth, stimulation, and production geometry.
