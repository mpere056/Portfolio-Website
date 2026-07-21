# Hybrid Compositor Record

Stage: `ART-12F`
State: implemented proof; awaiting Mark review

## Decision

Use one route-owned WebGL canvas and clock for the representative ecology. Authored plates retain material detail; code owns deformation, refraction, flow, illumination, atmospheric advection, particles, and traversal. The generated directional-current plate is reference-only and is not exported to the runtime set.

## Runtime Systems

| System | Implementation |
| --- | --- |
| Stable terrain | Clean plate with shader-driven fog, migrating light, and ground caustics |
| Coral | Segmented mesh with RGB root/body/tip deformation weights |
| Organism | Plate shader with refracted sampling, membrane movement, and traveling emission |
| Rings | Two opposed UV rotations around isolated receiver pivots |
| Current | Pure fragment shader with directional filaments, traveling packets, and expanding rings |
| Atmosphere | Three authored alpha volumes with independent procedural advection and density |
| Particles | Deterministic procedural point geometry with sparse independent drift |
| Foreground | Authored translucent plates on slow code-owned traversal paths |
| Fallback | Accepted still only for reduced motion, WebGL failure, and capture |

## Local Gate

- Dedicated route: `/projects/ambient-proof`; the public Museum renderer is untouched.
- One WebGL canvas in normal mode; zero canvases in reduced motion.
- Animated derivatives excluding fallback total less than `1.8 MiB`; no directional-current texture ships.
- Focused compositor/material/scene tests pass `13/13`; the aggregate suite passes `198/198`, TypeScript passes, and lint reports zero errors.
- The production build passes and prerenders `/projects/ambient-proof` as a static route.
- Browser at `1912 x 948` loads every declared derivative with no shader error. A 3.2-second idle comparison changes about `4%` of the full viewport while the scene occupies about `62%` of it.
- Pointer attention intensifies ongoing systems; it does not start a separate animation.

This proves the selected arrangement, not full-Museum performance or `V-33` acceptance. `ART-12G` still owns integration with nine signals, graph state, depth, stimulation, and production geometry.
