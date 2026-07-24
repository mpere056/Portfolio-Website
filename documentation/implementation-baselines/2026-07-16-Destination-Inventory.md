# Destination Inventory

Date: 2026-07-16
Status: reviewed input for `ARC-03`
Decision: `../implementation-plans/2026-07-16-Information-Architecture-And-Routing-Decision.md`
Work item: `../implementation-work/active/WI-ARC-03-01.md`

> **2026-07-24 amendment:** This remains the accepted inventory of existing IDs and routes. [Homepage Practice World And Routing Decision](../implementation-plans/2026-07-24-Homepage-Practice-World-And-Routing-Decision.md) changes the target architecture: add four practice destinations, promote `/` as the work index, and make `destination:projects` plus `/projects` compatibility surfaces only after `ARC-06`/`QA-07` pass. Stable project IDs do not change.

## Purpose

Classify the current, planned, compatibility, internal, and gated route surfaces before authoring destination-registry data. This inventory records visitor navigation truth; API routes, framework assets, and error pages are not destinations.

## Classification Rules

| Class | Meaning | Resolver behavior | Tour/AI suggestion |
| --- | --- | --- | --- |
| `canonical` | Current public place or semantic entry that visitors may intentionally navigate to | resolve | allowed when contextually appropriate |
| `legacy-alias` | Current compatibility surface retained while a canonical replacement is built | resolve for explicit requests | excluded |
| `planned` | Approved future place whose route or experience is not ready | fall back safely | excluded until promoted |
| `internal-only` | Development, template-history, or rewrite implementation path | fall back safely | excluded |
| `feedback-gated` | Direction depends on unresolved Mark feedback | fall back safely | excluded |

Destination status describes whether the semantic entry is usable. A canonical destination may temporarily resolve to a compatibility href, such as a smaller project using `/projects#slug`, while its stable destination ID remains unchanged.

## Main-Domain Route Inventory

| Surface | Current behavior | Class | Initial destination | Notes |
| --- | --- | --- | --- | --- |
| `/` | Live world/home route; target five-territory work index | canonical | `destination:home` | Safe global fallback and future work overview |
| `/about` | Live chronological About route | canonical | `destination:about` | Allows reviewed `event` safe state |
| `/work/[practice]` | Not implemented | planned | `destination:practice-*` family | Durable selected-practice state |
| `/projects` | Live project overview during migration | current canonical; target compatibility | `destination:projects` | Do not redirect before migration gate |
| `/projects#slug` | Live project section anchors | compatibility href | Stable project and museum destination IDs | Preserve until `/projects/[slug]` parity/redirect exists |
| `/projects/[slug]` | Not implemented | planned | Route family, not directly resolvable yet | Flagships will transition/redirect to subdomains |
| `/archive` | Not implemented | planned | `destination:archive` | Expanded state of global AI |
| `/chat` | Live standalone AI page | legacy-alias | `destination:chat-legacy` | Allows `prompt`; excluded from recommendations |
| `/writing` | Not implemented | planned | `destination:writing` | Add only after enough public writing exists |
| `/studio` | Not implemented and scope unresolved | feedback-gated | `destination:studio` | Wait for `STU-GATE-01` |
| `/demo` | Live development/reference route | internal-only | `destination:demo-internal` | Never suggested publicly |
| `/templates` and children | Live historical template surfaces | internal-only | `destination:templates-internal` | Await separate archive/removal decision |
| `/sites/[site]` | Internal rewrite target | internal-only | none | Public identity is the project subdomain |
| `/404`, `/_not-found`, API routes | Error or machine surface | excluded | none | Not destination-registry entries |

## Project Destination Inventory

| Project | Content node | Canonical destination | Current href | Museum-return destination |
| --- | --- | --- | --- | --- |
| Dreamlife | `project:dreamlife` | `destination:project-dreamlife` | `https://dreamlife.marknperera.ca/` | `destination:museum-project-dreamlife` -> `/projects#dreamlife` |
| LifeInbox | `project:lifeinbox` | `destination:project-lifeinbox` | `https://lifeinbox.marknperera.ca/` | `destination:museum-project-lifeinbox` -> `/projects#lifeinbox` |
| Sudoku Together | `project:discord-sudoku-activity` | `destination:project-sudokutogether` | `https://sudokutogether.marknperera.ca/` | `destination:museum-project-sudokutogether` -> `/projects#discord-sudoku-activity` |
| Story App | `project:story-app` | `destination:project-story-app` | `/projects#story-app` | same destination until direct route exists |
| Discord Bot | `project:discord-bot` | `destination:project-discord-bot` | `/projects#discord-bot` | same destination until direct route exists |
| Discord Sync Messaging | `project:discord-sync-messaging` | `destination:project-discord-sync-messaging` | `/projects#discord-sync-messaging` | same destination until direct route exists |
| Game Mod | `project:game-mod` | `destination:project-game-mod` | `/projects#game-mod` | same destination until direct route exists |
| Group Finder | `project:group-finder` | `destination:project-group-finder` | `/projects#group-finder` | same destination until direct route exists |
| Kitsune Karuta | `project:kitsune-karuta` | `destination:project-kitsune-karuta` | `/projects#kitsune-karuta` | same destination until direct route exists |

Stable destination IDs survive future href migration. Current anchors are implementation compatibility, not identity.

## Planned Practice Destinations

| Practice | Destination | Target href | Fallback before implementation |
| --- | --- | --- | --- |
| Music & Performance | `destination:practice-music` | `/work/music-performance` | `destination:home` |
| AI & Possible Futures | `destination:practice-ai-futures` | `/work/ai-possible-futures` | `destination:home` |
| Life Systems & Tools | `destination:practice-life-systems` | `/work/life-systems-tools` | `destination:home` |
| Play & Community | `destination:practice-play` | `/work/play-community` | `destination:home` |

`ARC-06` promotes these only after route and safe-state validation exists. Existing project and museum-return IDs remain stable; their hrefs migrate to the project's primary practice context later.

## Project Writing Inventory

| Project | Blog destination | Post destination | Canonical href |
| --- | --- | --- | --- |
| Dreamlife | `destination:project-dreamlife-blog` | `destination:post-dreamlife-building-a-life-design-loop` | `https://dreamlife.marknperera.ca/blog` and `/blog/building-a-life-design-loop` |
| LifeInbox | `destination:project-lifeinbox-blog` | `destination:post-lifeinbox-local-first-capture-needs-trust` | `https://lifeinbox.marknperera.ca/blog` and `/blog/local-first-capture-needs-trust` |
| Sudoku Together | `destination:project-sudokutogether-blog` | `destination:post-sudokutogether-why-discord-sudoku-needed-a-proxy` | `https://sudokutogether.marknperera.ca/blog` and `/blog/why-discord-sudoku-needed-a-proxy` |

Post fallbacks point to their project blog index; blog-index fallbacks point to the project home; project-home fallbacks point to the museum.

## Initial Safe-State Policy

| Destination | Allowed keys | Reason |
| --- | --- | --- |
| `destination:about` | `event` | Restore a reviewed timeline event |
| `destination:projects` | `project` | Restore a selected museum exhibit while direct routes are pending |
| `destination:chat-legacy` | `prompt` | Preserve current compatibility deep links |
| All other initial destinations | none | Add only when a consumer and validator exist |

Unsupported keys cause safe fallback rather than silent partial restoration. Generic untrusted-payload and value validation remains `ARC-05`; this package validates registry membership, allowed keys, primitive values, and destination availability.

## Checkpoint And Origin Policy

| Target kind | Checkpoint | Target origin | Navigation |
| --- | --- | --- | --- |
| Home | route | main | same-origin when already on main; full document from subdomain |
| About/Projects/museum exhibit | semantic | main | same-origin when already on main; full document from subdomain |
| Flagship project home | route | project subdomain | full document when origin changes |
| Blog index/post | route | project subdomain | same-origin inside its project; full document otherwise |
| Planned/gated/internal | none | declared target | unavailable through public resolver |

Detailed local exploration is not transferred between origins. Only approved global preferences and validated destination/return state cross the boundary.

## Registry Acceptance Inputs

- Every `PROJECT_SITES` entry has a canonical project home and blog destination.
- Every current project has one stable project destination.
- Every current project blog post has one canonical post destination.
- Every fallback references an existing registry destination.
- Canonical targets are suggestible; legacy, planned, internal, and gated targets are not.
- Unknown IDs, unavailable statuses, invalid primitive state, and unsupported keys resolve to `destination:home` with a named reason.
- Registry validation reports no duplicate keys, invalid node IDs, invalid origin/href combinations, missing fallbacks, or duplicate safe-state keys.
