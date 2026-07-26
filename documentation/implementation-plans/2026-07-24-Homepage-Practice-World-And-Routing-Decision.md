# Homepage Practice World And Routing Decision

Date: 2026-07-24
Status: superseded for Home composition and attention behavior on 2026-07-26
Superseded by: [Piano Clearing Home Reset](2026-07-26-Piano-Clearing-Home-Reset-Decision.md)
Supersedes in part: [2026-07-16 Information Architecture And Routing Decision](2026-07-16-Information-Architecture-And-Routing-Decision.md)
Requirements: `V-01`, `V-02`, `V-03`, `V-08`, `V-11`, `V-14`, `V-31`, `V-32`, `V-33`, `V-34`, `V-35`, `V-36`
Packages: `ARC-06`, `KG-07`, `EXP-08`, `ART-16`, `PRJ-09`, `QA-07`

> Historical decision. The four-practice taxonomy and separate About route remain useful, but the five-territory layout and proof-world compositor are rejected. Do not resume implementation from this document.

## Decision

The main domain will no longer treat Home and the project Museum as two separate primary worlds. `/` becomes the canonical spatial index for Mark, his four practices, and their projects.

The desktop Home composition contains five persistent territories:

| Position | Territory | Anchor | Purpose |
| --- | --- | --- | --- |
| Top | About Me | Memory portal or illuminated opening | The source behind the four practices; links to the separate `/about` chronology |
| Center | Music & Performance | Existing particle piano and portrait platform | Performances, arrangements, teaching, production, sample packs, and future music tools |
| Left | Play & Community | Living coral ecology | Games, social experiments, Discord communities, and collaborative play |
| Right | AI & Possible Futures | East observatory | AI products, speculative systems, and future-facing experiments |
| Bottom | Life Systems & Tools | Living archive/book | Personal systems, utilities, automation, and practical tools |

The About territory is not another project category. It remains a distinct portal into `/about`.

## Attention Model

All five anchors remain spatially present. They are equal and restrained only in a neutral state. Attention then moves through a continuous, inertial spectrum:

1. `neutral`: no territory is dominant.
2. `candidate`: proximity, keyboard focus, or another approved signal raises one territory's weight.
3. `attended`: one territory is visually dominant while the others remain legible.
4. `selected`: an explicit action locks the territory and exposes its project collection.
5. `entered`: a durable category, About, or project destination owns the URL.

These names describe semantic checkpoints, not five abrupt animation presets. The compositor uses continuous weights, hysteresis, and settlement so tiny pointer movements do not cause flicker or simultaneous full-scene reactions.

At most one territory is dominant at a stable moment. Other territories may retain low-amplitude ambient life and secondary visual influence.

## Spatial And Material Behavior

Territory anchors do not travel to the center when attended. The piano stays central, coral stays left, observatory stays right, archive stays low, and About remains above.

Attention changes two things at different rates:

- **Anchor prominence:** bounded scale, local light, legibility, and detail.
- **Atmospheric territory:** much broader masks, fields, fog, particles, refraction, notation, currents, shadows, and occlusion that can occupy most of the viewport.

The second change is the primary one. This must feel like material dominance and environmental melding, not five rectangular panels resizing.

Boundaries are formed by light, masks, depth, refraction, fog, particle density, and occlusion. Neighboring dialects overlap during transitions. The dominant field gradually changes how shared space behaves while inactive anchors recede without disappearing.

## Performance And Renderer Boundary

Putting all practices on Home does not mean mounting every complete proof at once.

- Every territory has a lightweight persistent anchor representation.
- Only the neutral shell and the current dominant territory may run expensive continuous effects.
- A selected territory may lazily mount its full scene dialect.
- Leaving a territory settles and unmounts heavy effects after a bounded handoff.
- One coordinated scheduler owns visibility, reduced motion, capability tier, and stable-frame requests.
- The implementation should normally use one dominant WebGL/Canvas composition rather than four competing full-screen renderers.

The accepted coral, observatory, archive, and music proofs are source dialects and behavior evidence. They are not copied wholesale into Home.

## Content Taxonomy

Every public project receives one primary practice for navigation and composition. Secondary relationships remain in the knowledge graph and may appear as semantic links without duplicating the project.

Initial classification:

| Practice | Initial project/content ownership |
| --- | --- |
| Music & Performance | Music performances, arrangements, teaching, production, sample packs, and future music tools; new project records are authored when these become public |
| AI & Possible Futures | Dreamlife; Interactive Story Generator; future imaginative AI products |
| Life Systems & Tools | LifeInbox; Group Finder & Sudoku Solver; AI productivity and automation material |
| Play & Community | Sudoku Together; CandyMod; Kitsune Karuta; Discord bot; synchronized messaging; future games and social experiments |

This is an initial reviewed classification, not permission to invent missing public products. Authored MDX remains the source of factual project truth.

## Routes And History

| Route | Target role |
| --- | --- |
| `/` | Canonical neutral or restored five-territory Home world |
| `/about` | Canonical personal chronology and deeper memories |
| `/work/[practice]` | Durable, shareable selected-practice chamber within the same visual world |
| `/projects/[slug]` | Canonical individual project entry on the main domain when a subdomain is not canonical |
| Flagship subdomains | Canonical substantial project experiences, case studies, and writing |
| `/projects` | Compatibility route that redirects to `/` after destination, tour, AI, and Back/restore migration passes |

Transient proximity and hover do not change the URL. Explicit practice selection pushes `/work/[practice]`. Browser Back closes project depth, then selected practice, before leaving Home where practical.

Existing destination IDs remain stable. `destination:projects` becomes a compatibility alias to the Home work overview. New `destination:practice-*` IDs own the four durable practice states. Project destination IDs do not change.

## Project Reveal

Attending a territory reveals enough identity to understand the practice. Selecting it reveals its project artifacts without replacing the world with a conventional card grid.

The reveal should:

- Preserve the territory's anchor and atmosphere.
- Place projects as inspectable instruments, specimens, memories, or signals native to that practice.
- Support Signal, Approach, Handle, Enter, and Understand.
- Keep one primary project ownership while exposing reviewed cross-practice relationships.
- Let individual project selection use `/projects/[slug]` or a canonical subdomain.

## About Portal

The top portal is an origin/memory opening, not a portrait, résumé card, or fifth project collection. Neutral Home may show traces from the four practices converging toward it. Attention can reveal memory fragments and consequences. Selection enters `/about`.

The existing portrait platform beneath the piano remains part of the music/home identity and is not duplicated above.

## Migration Guardrails

- Do not remove or redirect `/projects` until all raw links, destination fallbacks, tour doors, AI cards, project returns, and tests have migrated.
- Do not run four proof renderers simultaneously.
- Do not turn territory weights into a horizontal carousel, dashboard, or responsive card layout.
- Do not make hover the only input; keyboard focus, touch-selected state, reduced motion, and direct routes need authored behavior.
- Do not let all territories react strongly to one pointer event.
- Do not encode continuous weights, pointer position, or animation phase in the URL.
- Do not duplicate flagship canonical content on Home.
- Do not begin mobile parity work; mobile receives a separate composition decision later.

## Acceptance

The architecture is implemented only when:

- Neutral Home makes all five territories perceptible in one desktop viewport.
- At least two different territory transitions prove anchored-object continuity and atmospheric melding.
- One territory can dominate without simply becoming a larger rectangle.
- Inactive territories remain quiet, identifiable, and independently alive.
- Only local or materially connected systems intensify near the pointer.
- Explicit selection is deep-linkable and Back/refresh behavior is predictable.
- Project classification is validated and every current project has one primary practice.
- Expensive renderers mount, pause, and unmount within the documented budget.
- Reduced-motion and renderer-failure states retain identity and navigation.
- `/projects` compatibility behavior is migrated only after automated and production evidence passes.

## Reversibility

The exact `/work/[practice]` slug names and transition techniques remain reversible before public deep links ship. The approved principles are not provisional: one Home world, four project practices, separate About, fixed anchors, one attention-dominant territory, continuous melding, and progressive project depth.
