# EXP-05 Evidence

Last updated: 2026-07-17

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `EXP-05` Environmental response system |
| Lifecycle | complete |
| Capabilities | `CAP-EXP-009`, `CAP-EXP-010`, `CAP-EXP-011` |
| Work item | `WI-EXP-05-01` |
| Implementation | `4276e6b` |
| Exposure | Development and Preview on; Production off pending combined creative review |

## EV-EXP-05-01: Three-Rule And Stimulation Contract

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | unit and integration tests |
| Claim | Canonical signals are bounded; proximity, handling, and reviewed light occur in order; invalid relationships fail closed; continuous stimulation clamps safely and sound remains opt-in. |
| Evidence | `tests/environment.test.ts`, `tests/experienceStore.test.ts`, `tests/featureFlags.test.ts`, and `tests/knowledgeGraphQueries.test.ts` pass 22 focused cases; strict typecheck and touched-file lint pass. |

## EV-EXP-05-02: Pointer, Keyboard, Light, And Persistence Flow

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | browser and visual review |
| Environment | Local Development, `/projects`, `semanticLighting=true` |
| Claim | The dormant signal opens one instrument; focus reveals Dreamlife; ArrowRight exposes the material; review lights and links the canonical build note; stimulation changes through an explicit control and survives reload. |
| Evidence | DOM-backed browser flow and viewport visual review against `http://localhost:3000/projects`. |

## EV-EXP-05-03: Production Build

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | build |
| Claim | Server graph loading, client boundaries, all static routes, and the dynamic chat route compile together. |
| Evidence | `npm run build` completed after content validation reported 49 nodes and 19 relationships; 26 static pages generated. |

## Boundaries After Completion

- This is a controlled relationship instrument, not a constellation page or replacement navigation model.
- A later creative review may revise placement, copy, and visual language without invalidating the rule engine.
- Musical motifs and full target-device stimulation QA remain their explicitly later packages.

Package complete. `EXP-06` is next for three meaningful, non-collectible hidden discoveries.

