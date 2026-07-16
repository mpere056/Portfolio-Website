# Information Architecture And Routing Decision

Date: 2026-07-16
Status: approved
Requirements: `V-01`, `V-03`, `V-05`, `V-07`, `V-09`, `V-10`, `V-14`
Packages: `ARC-02`, `ARC-03`, `ARC-05`, `EXP-01`, `EXP-02`, `AI-02`, `AI-04`, `PRJ-01`, `PRJ-08`

## Decision

The portfolio is technically multi-route and experientially one continuous world.

Routes represent durable, independently useful places. Semantic destinations represent meaningful states inside or across those places. Transient visual manipulation remains local interaction state. This preserves exploration while retaining direct links, browser history, search indexing, performance boundaries, error isolation, and predictable recovery.

The site will not become either:

- One literal client page containing the entire portfolio.
- A conventional collection of disconnected content pages.

Shared transitions, AI, discovery state, stimulation controls, semantic lighting, and orientation make routes feel like connected areas of the same authored world.

## Main-Domain Structure

| Route | Role | Canonical status |
| --- | --- | --- |
| `/` | World atrium, First Note, return checkpoint, quiet orientation, tour entry, and major portals | canonical |
| `/about` | Chronological personal environment with inspectable events and optional deeper memory states | canonical |
| `/projects` | Museum lobby and overview for all projects | canonical |
| `/projects/[slug]` | Stable direct project entry; flagship entries transition or redirect to their canonical subdomain, while smaller projects may render in the museum shell | planned canonical route family |
| `/archive` | Optional expanded state of the global AI when the archive experience is ready | planned, not a primary navigation requirement |
| `/chat` | Existing compatibility route during global-AI migration | legacy alias; do not remove until replacement deep links and failure handling pass |
| `/writing` | Optional future aggregate index after enough public writing exists | deferred; canonical articles remain on project subdomains |
| `/studio` | Future commercial/services area | feedback-gated; do not create before `STU-GATE-01` resolves |

`/templates` and its children are not part of the target information architecture because full website-template sales are no longer the intended direction. Preserve them only until a separate removal, archival, or redirect decision is verified. `/demo` is development/reference surface, not a visitor destination.

## Project Museum And Subdomains

The main `/projects` route is the museum lobby. It supports fast overview and the early depth stages for all projects.

For flagship projects with subdomains:

- Signal and Approach belong in the main museum.
- Handle may begin in the museum as a lightweight preview.
- Enter normally transitions into the canonical project subdomain.
- Understand normally lives on the project subdomain through product behavior, exploded system, evidence, and living or final state.
- A project may remain in place only when a prototype proves that cross-subdomain transition harms the experience more than it helps.

The canonical flagship project homes are:

- `dreamlife.marknperera.ca`
- `lifeinbox.marknperera.ca`
- `sudokutogether.marknperera.ca`

Each subdomain starts with one coherent project shell rather than many empty pages. Add a dedicated experience or case-study route only when the content earns independent loading, sharing, browser history, or search value.

| Subdomain route | Role |
| --- | --- |
| `/` | Project identity, current/final state, premise, and entry into deeper interaction |
| `/experience/[id]` | Optional substantial product demonstration |
| `/case-study` or reviewed equivalent | Optional independently useful exploded system/evidence surface |
| `/blog` | Project writing index |
| `/blog/[slug]` | Canonical project article |

Every subdomain must return to its exact museum exhibit, not only to a generic portfolio homepage. Related memories, projects, articles, and AI cards use the same destination registry.

## Depth, URLs, And Browser History

Depth stages are not synonymous with pages.

| State | URL/history policy |
| --- | --- |
| Signal | Transient; no history entry |
| Approach | Usually transient; direct links may restore here as a safe default |
| Handle | Selected-object state may use a validated query or fragment; push history only when opening is meaningful |
| Enter | Push a durable state or navigate to a dedicated route when the experience is independently useful or heavy |
| Understand | Deep-linkable through a validated destination, route state, or stable anchor |

Temporary pointer position, camera movement, object rotation, puzzle edits, animation progress, and unreviewed free-form state do not belong in URLs.

Browser Back should close the current meaningful depth state before leaving its durable place. Direct links must never launch an unskippable animation; they restore at a safe checkpoint.

## State Ownership

State is divided by durability and origin boundary:

- URL/destination state: current durable place, selected object, requested depth, and bounded shareable safe state.
- Domain-wide lightweight state: First Note completion, tour role/dismissal, stimulation preferences, and a coarse return hint where appropriate.
- Per-origin local state: detailed discoveries, altered objects, local project-demo state, and semantic checkpoints.
- Session state: AI conversation and temporary cards where practical.
- Server content: factual graph, evidence, project state, visibility, and public source resolution.

`localStorage` is origin-scoped and cannot by itself share state between `marknperera.ca` and project subdomains. Near-term cross-subdomain continuity uses:

- A small non-sensitive first-party cookie scoped to `.marknperera.ca` for approved global preferences only.
- Validated destination and return context in URL handoff.
- Separate versioned local storage for detailed state on each origin.

Do not introduce Firebase accounts or persistent server visitor profiles merely to synchronize anonymous exploration. Any richer cross-device or cross-origin persistence requires a separate privacy decision.

## Global Orientation And AI

Environmental navigation is primary, but it must not trap visitors. A quiet universal orientation control remains available across durable places and through keyboard access. It need not look like a conventional navbar, literal compass, or checklist.

AI remains globally available as one contextual system. `/archive` may expose a larger view of that same system; it is not a separate assistant. `/chat` remains a compatibility route until the global shell reliably handles reload, deep link, error, and cross-subdomain behavior.

The guided tour, AI cards, semantic lighting, About consequences, project links, returning checkpoints, and future shared-state links all resolve through the same destination registry.

## Graph And Experimental Views

The knowledge graph does not receive a dedicated constellation page in the confirmed architecture. It becomes visible through explainable connections, semantic lighting, AI cards, About consequences, project evidence, and the bounded skill-evidence prototype.

The skill tree/evidence map remains a prototype, not a primary route. Memory rooms remain deeper About states unless the prototype proves that a dedicated route is necessary.

## Canonical And Legacy Behavior

- Existing route fragments such as `/projects#slug` remain compatibility inputs until canonical destination resolution and redirects are verified.
- Flagship duplicate content uses canonical metadata pointing to the project subdomain.
- Project articles remain canonical on their subdomain even if a future `/writing` index aggregates them.
- Old `/chat` links remain valid during migration.
- Historical template and demo routes are excluded from tour, AI-card, graph-navigation, and persistence registries.

## Consequences

Positive:

- Exploration can be rich without sacrificing direct access or recovery.
- Pages can load and fail independently.
- Subdomains become meaningful project worlds instead of duplicate landing pages.
- Tour, AI, graph, history, and returning state share one navigation model.
- The site can remain useful before every ambitious interaction is implemented.

Costs:

- Cross-subdomain transitions require explicit state handoff.
- Browser-history behavior must be designed and tested per depth transition.
- Canonical metadata and legacy aliases need maintenance.
- The global shell must survive route changes and gracefully restart across origin changes.

## Rejected Alternatives

### One Literal Page

Rejected because it creates poor load boundaries, brittle browser history, difficult deep links, weak error isolation, and an oversized client runtime.

### Conventional Independent Pages

Rejected because it loses persistent discovery, environmental navigation, shared AI context, semantic transitions, and the intended feeling of one world.

### One Page Per Depth Stage

Rejected because it turns interaction grammar into route sprawl and makes minor manipulation feel like document navigation.

### One Shared Local-Storage Store Across All Subdomains

Rejected because browser origin isolation makes it technically false without a server or cookie handoff.

## Implementation Guardrails

- Do not add a route merely because a depth state exists.
- Do not encode arbitrary scene state in URLs.
- Do not duplicate flagship canonical content between `/projects` and subdomains.
- Do not remove legacy routes before redirects and production evidence exist.
- Do not wire tours, AI cards, or graph links to raw URLs; use destination IDs.
- Do not add global visitor persistence beyond non-sensitive approved fields without privacy review.

## Implementation Checkpoint

The architecture prerequisites and initial destination foundation are complete:

1. [x] Reconcile the shared contract vocabulary with the approved architecture.
2. [x] Distinguish current `ContentNodeId` from broader reviewed graph-only identities.
3. [x] Add the approved `easter_egg_found` discovery event.
4. [x] Keep `safeState` primitive-only and enforce destination-specific allowlists.
5. [x] Inventory canonical, planned, legacy-alias, internal-only, and feedback-gated routes.
6. [x] Implement and test the initial classified destination registry and resolver.

Next, `ARC-04` introduces typed cross-system actions that request destination IDs rather than raw URLs. `ARC-05` then owns untrusted payload validation and persisted-state migrations before visitor-facing consumers migrate.
