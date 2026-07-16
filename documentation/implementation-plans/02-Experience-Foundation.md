# Experience Foundation Plan

Last updated: 2026-07-16

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `EXP` |
| Status | Active |
| Upstream | [Architecture](00-System-Architecture-And-Interfaces.md), [Knowledge Graph](03-Knowledge-Graph-And-Content.md), [Quality](08-Platform-Quality-And-Rollout.md) |
| Downstream | Home, [Global AI](04-Global-AI-And-Talking-Archive.md), [Projects Museum](05-Projects-Museum-And-Case-Studies.md), [About](06-About-And-Memory-Depth.md) |
| Primary outputs | Depth controller, discovery store, First Note, tour, stimulation, disturbances |
| Execution packages | `EXP-01` through `EXP-07` in [Work Packages](13-Execution-Work-Packages.md) |
| Capability tracking | `CAP-EXP-*` in [Capability Ledger](15-Capability-Coverage-Ledger.md) |

## Scope

Phase 2 status: `QA-01` and `EXP-02` are complete through `852e14c`; `EXP-03` is ready. The versioned store, integrated foundation flow, transition grammar, atomic headless controller, AI ownership cleanup, and dormant React consumer boundary are accepted. Visitor-facing adoption begins with the one-time First Note and its first/return browser flow.

Implement the shared interaction system used by Home, Projects, About, AI navigation, and future experiences:

- Five-stage depth grammar.
- Discovery physics.
- One-time First Note.
- Persistent discovery.
- Non-linear guided tour.
- Progressive stimulation.
- Meaningful easter eggs.
- New-content disturbances.

## Existing Code To Build On

- `src/components/HeroCube.tsx` provides the current home scene.
- `src/components/NavPointer.tsx` provides spatial navigation labels.
- `src/components/ProjectsClient.tsx` and `ProjectSection.tsx` provide project navigation and expansion.
- `src/components/AboutClientPage.tsx` and `TimelineEntry.tsx` provide timeline navigation.
- `src/lib/store.ts` already uses Zustand.
- `src/components/GlobalAudio.tsx` and page audio components provide sound infrastructure.
- Framer Motion and React Three Fiber are already installed.

## Target State Architecture

Create one client-side experience store, split into clear slices rather than one untyped global object.

Suggested slices:

```ts
interface DiscoverySlice {
  schemaVersion: number;
  firstNoteCompleted: boolean;
  discoveredIds: string[];
  handledIds: string[];
  enteredIds: string[];
  understoodIds: string[];
  alteredObjects: Record<string, PersistedObjectState>;
  lastCheckpoint?: ExperienceCheckpoint;
  seenContentVersions: Record<string, string>;
}

interface TourSlice {
  enabled: boolean;
  role?: 'recruiter' | 'client' | 'builder' | 'explorer';
  suggestedDestinationIds: string[];
  visitedSuggestedIds: string[];
  dismissedHints: string[];
}

interface StimulationSlice {
  soundEnabled: boolean;
  stimulation: number;
  reducedMotionRequested: boolean;
}
```

Use stable semantic IDs such as `home:first-note`, `project:lifeinbox`, and `timeline:2016-discord-server-growth`. Do not persist React component state or raw scene object references.

## Persistence

### Storage

Start with versioned per-origin `localStorage` persistence through a Zustand persistence layer or a small dedicated adapter.

`localStorage` cannot cross from `marknperera.ca` to project subdomains. Use a small non-sensitive `.marknperera.ca` cookie only for approved global preferences and coarse return hints, and validated destination/return parameters for cross-subdomain handoff. Keep detailed discoveries and altered-object state local to each origin. Do not add accounts or server visitor profiles without a separate privacy decision.

### Versioning

- Store a schema version.
- Define explicit migrations.
- Ignore unknown object fields safely.
- Reset only invalid portions instead of clearing all discovery state.
- Provide a user-facing `Reset exploration` action.

Implementation note: `ARC-05` now provides the version-1 semantic envelope, structured validation, explicit flat-v0 migration, unknown-field tolerance, section-isolated reset, and unknown-version rejection as pure functions. `EXP-01` owns the first dormant Zustand/storage adoption and must use that parser during hydration.

### Checkpoints

Do not restore an exact camera matrix by default. Persist a semantic checkpoint:

- Route or subdomain.
- Area ID.
- Open exhibit ID.
- Depth stage.
- Optional safe scene state.

Each page converts the checkpoint into a clean, stable camera or layout state.

### Browser History

- Signal and ordinary Approach interactions do not create history entries.
- Meaningful Handle state may update a validated query or fragment.
- Enter and Understand push durable history only when the state is independently useful.
- Browser Back closes a meaningful depth layer before leaving the durable route.
- Direct links restore at a safe checkpoint and never begin with an unskippable animation.
- Cross-subdomain transitions carry only validated destination, return, and bounded safe state.

## Depth Grammar Components

Build reusable state primitives before visual primitives.

Depth primitives operate inside durable routes defined by `2026-07-16-Information-Architecture-And-Routing-Decision.md`; they do not create one route per depth stage.

Suggested modules:

- `src/lib/experience/types.ts`
- `src/lib/experience/store.ts`
- `src/lib/experience/persistence.ts`
- `src/components/experience/Discoverable.tsx`
- `src/components/experience/DepthController.tsx`
- `src/components/experience/InteractionHint.tsx`
- `src/components/experience/ExperiencePortal.tsx`

`DepthController` should support:

- Current depth stage.
- Allowed transitions.
- Transition reason.
- Persistence hooks.
- Tour hint integration.
- AI context emission.
- Stimulation response.

It should not dictate project-specific visuals.

## First Note

### Implementation Steps

1. Add a feature flag and first-visit check.
2. Define the dark initial scene state in `HeroCube`.
3. Create an accessible pointer and keyboard interaction for the musical object.
4. Trigger visual awakening independently from audio playback.
5. Mark `firstNoteCompleted` only after the reveal reaches a usable state.
6. Reveal core destinations without requiring the audio promise to resolve.
7. Skip the intro on later visits and restore the checkpoint.
8. Add a reset action for testing and user control.

### Acceptance Criteria

- First visit begins in the intended concealed state.
- Sound denial or browser autoplay restrictions do not block the reveal.
- Returning visits skip the intro.
- The user can navigate within seconds.
- Reduced motion uses a shorter non-camera reveal.

## Discovery Physics Prototype

Test three rules before expanding:

1. Proximity reveals outline and context.
2. Rotating or moving an object reveals hidden material.
3. A reviewed relationship sends light toward another destination.

Use one controlled scene with instrumented events.

Evaluate:

- Can a new visitor discover the interaction without instructions?
- Does the response communicate meaning or only spectacle?
- Does the rule remain understandable with sound off?
- Does the rule conflict with ordinary scrolling or camera controls?

Promote only successful rules into shared primitives.

## Guided Quick Tour

### Data Model

Define tours as authored recommendations, not hard-coded component sequences.

```ts
interface TourProfile {
  role: TourRole;
  label: string;
  destinations: TourDestination[];
  optionalBranch?: TourBranch;
}

interface TourDestination {
  destinationId: string;
  reason: string;
  hintIds: string[];
}
```

### Behavior

- Ask role once.
- Show several destination choices.
- Allow any order.
- Persist the role and dismissed state.
- Never show completion percentages.
- Let the visitor leave or resume guidance.
- Limit hints to controls and major public experiences.
- Keep hidden discoveries outside tour metadata.

### Delivery Steps

1. Build the tour data schema.
2. Implement role selection as a brief overlay or in-world prompt.
3. Implement a non-literal guide UI that points toward several destinations.
4. Add contextual hints for the first depth interaction.
5. Add resume and dismiss behavior.
6. Add destination integration with the global AI and router.

## Stimulation Control

Represent stimulation as a continuous internal value even if the UI uses simple controls.

Systems that consume it:

- Particle count and intensity.
- Camera movement.
- Bloom and post-processing.
- Sound layers and volume.
- Scroll snapping aggressiveness.
- Background movement.
- Semantic-lighting intensity.

Rules:

- Respect `prefers-reduced-motion` as an initial input.
- Do not silently turn sound on.
- Keep essential feedback visible without color or sound alone.
- Persist preferences.
- Avoid re-rendering full 3D scenes on every small control change.

## Meaningful Easter Eggs

Create an easter-egg registry with:

- Stable ID.
- Location.
- Discovery condition.
- Content type.
- Knowledge nodes revealed.
- Whether it may appear in a tour.
- Safety and privacy review status.

Do not build a collection screen or completion count.

First implementation should include no more than three easter eggs of different kinds:

- One personal artifact.
- One technical lesson.
- One relational connection.

## New-Content Disturbances

Add a `contentVersion` or meaningful-update ID to eligible nodes.

At startup:

1. Compare current versions to `seenContentVersions`.
2. Select at most one or two relevant disturbances.
3. Render a subtle signal in a familiar area.
4. Mark the update seen only after inspection, not merely page load.

Do not derive disturbances from raw Git commits.

## Testing

### Unit

- Depth transition rules.
- Persistence migrations.
- Tour recommendations.
- Checkpoint serialization.
- Content-version comparison.
- Stimulation value clamping.

### Integration

- First visit and return visit.
- Tour selection, reordering, dismissal, and resume.
- Discovery state across routes.
- Reset behavior.
- Sound-denied awakening.

### Visual And Manual

- Desktop pointer and keyboard.
- Low-stimulation behavior.
- Refresh during each depth stage.
- Corrupt and old local state.
- Browser back/forward behavior.

## Risks

- Persisting too much scene detail can make migrations fragile.
- Hidden interactions can become undiscoverable.
- Tour hints can accidentally reveal all free-exploration rewards.
- Global state can cause unnecessary 3D re-renders.
- An elaborate intro can harm repeat visits if the persistence check fails.

## Cross-Plan Handoff

When this plan is complete, downstream plans may assume:

- Stable depth stages and transition actions exist.
- Discovery and checkpoint persistence are versioned and tested.
- Tour destinations resolve through the shared destination registry.
- Stimulation values can be consumed without owning preference UI.
- AI context receives current destination and depth updates.
- Experiences can register meaningful discoveries and content disturbances.

This plan does not provide project-specific demo logic, graph facts, or AI responses.

## Completion Criteria

- Shared depth and discovery primitives are stable.
- First Note and return behavior work reliably.
- One scene validates the chosen discovery rules.
- Tour and free exploration remain meaningfully different.
- Stimulation controls affect all registered systems.
- Persistence has automated migration tests.
