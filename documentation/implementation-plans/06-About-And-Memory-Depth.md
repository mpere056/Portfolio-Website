# About And Memory Depth Plan

Last updated: 2026-07-18

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `ABT` |
| Status | Active plus one bounded prototype |
| Upstream | [Architecture](00-System-Architecture-And-Interfaces.md), [Experience](02-Experience-Foundation.md), [Graph](03-Knowledge-Graph-And-Content.md), [AI](04-Global-AI-And-Talking-Archive.md) |
| Downstream | About route, tour destinations, skill evidence, semantic lighting |
| Primary outputs | Event inspection, five reviewed consequence sets, memory-room decision, About easter eggs |
| Execution packages | `ABT-01` through `ABT-04` in [Work Packages](13-Execution-Work-Packages.md) |
| Capability tracking | `CAP-ABT-*` in [Capability Ledger](15-Capability-Coverage-Ledger.md) |

## Scope

Extend the chronological About timeline with inspectable consequences, reviewed knowledge relationships, selected memory-room depth, and meaningful easter eggs.

Do not build a constellation view or reading-heavy parallel timeline.

## Existing Foundation

- `src/app/about/page.tsx`
- `src/components/AboutClientPage.tsx`
- `src/components/TimelineEntry.tsx`
- `src/components/TimelineIndicator.tsx`
- `src/components/Background.tsx`
- `src/components/about-addons/*`
- `src/content/about/*.mdx`
- `src/lib/timeline.ts`

The existing page already provides chronology, fullscreen sections, scroll audio, background textures, and selected interactive addons.

## Core Experience

Chronology remains the default surface.

An event can be inspected more deeply to answer:

- What began here?
- What capability developed?
- What belief or working habit changed?
- Which later project carries it forward?
- What evidence supports that connection?

The knowledge graph supplies these answers. The timeline does not invent connections from visual similarity.

## Aesthetic Translation

About belongs to the same Observatory but is not another project museum. Its dialect is a chronological archive of traces, consequences, and remembered artifacts.

- The distant composition preserves a legible sense of time before revealing connections.
- An inspected event changes local material, annotation, or sight lines; it does not open a generic detail card over the timeline.
- Reviewed `led_to`, `learned_from`, and `continued_in` relationships may become a few authored lines, refracted traces, or consequence marks.
- A memory room is a deeper material change centered on one real artifact, not a decorative 3D room or a duplicate project exhibit.
- AI remains the same quiet instrument but adapts to archive/reading context through `ART-05`.
- Sensitive, unavailable, or text-heavy events still receive a composed semantic fallback.
- The archive remains quietly alive before inspection: illumination migrates across paper and glass, dust or trace matter drifts at restrained density, and distant layers change through atmosphere without competing with chronology.
- Structural timeline marks may remain fixed, but they participate through changing light, refraction, shadow, or occlusion. The standard experience must not read as a static archive image beneath animated UI.
- Event inspection modulates the existing ambient field instead of starting an unrelated effect system; consequence traces can condense, align, or brighten from the same temporal material vocabulary.

Before broad visual implementation, `ART-05` produces one event-inspection packet and one memory-room packet using reviewed content. `ABT-02` and `ABT-03` own behavior and implementation; their creative dimension cannot be accepted from the museum packet alone.

## Content Schema

Extend timeline content with references rather than duplicating consequence prose everywhere.

Suggested fields:

- `developedCapabilityIds`
- `influencedProjectIds`
- `changedBeliefIds`
- `artifactIds`
- `memoryRoomId`
- `hiddenDiscoveryIds`

Relationship explanations remain in the graph relationship records.

## Event Inspection UI

### Entry

An event signals inspectability through one consistent visual cue after it reaches the active viewport.

### Open State

Inspection should preserve the event's place in chronology.

Possible desktop pattern:

- Timeline section remains visible.
- The central artifact or visual moves forward.
- Two or three reviewed consequences appear spatially around it.
- Selecting a consequence illuminates or previews the later project or capability.

Avoid opening a large text modal by default.

### AI Context

Opening an event sets AI context to the event node. Selecting a consequence adds the relationship ID.

Suggested questions can be available inside the AI, not as repeated page buttons.

## Initial Relationship Work Package

Select five events with strong documented consequences.

Candidate categories:

- Piano practice and discipline.
- Game/worldbuilding interests.
- Discord community creation and growth.
- Reset or recovery period.
- Pinterest/AI and the transition into current products.

For each event, author no more than three primary consequences initially.

## Memory Room Prototype

Memory rooms remain a prototype candidate.

### Prototype Scope

- One timeline event.
- One central object.
- One real or accurately reconstructed artifact.
- One short authored story.
- Two reviewed later consequences.
- One clear return transition to chronology.

### Candidate Selection

Choose an event with:

- Strong visual or audio material.
- Clear later consequences.
- Low privacy risk.
- An object that can be manipulated meaningfully.

The piano-start or Discord-community era may be stronger first candidates than a difficult personal period.

### Evaluation

- Does the room deepen understanding?
- Does it interrupt timeline flow too much?
- Is the central object meaningful or decorative?
- Does the visitor understand how to return?
- Is the additional build cost justified?

If not, retain event inspection without expanding memory rooms.

## Easter Eggs

Initial About easter eggs should be real and varied:

- One hidden artifact.
- One lesser-known later connection.
- One optional audio or musical discovery.

Do not hide information necessary to understand a difficult or important life event.

## Semantic Lighting

Use a restricted relationship set:

- Event to later project.
- Event to demonstrated skill.
- Event to another event when the causal link is authored.

Lighting should preview direction and relationship, while inspection provides the explanation.

## Scroll And Depth Interaction

Current custom scroll snapping can conflict with nested inspection.

Implementation requirements:

- Pause custom snap animation while an event is open.
- Prevent wheel events from accidentally closing or skipping the event.
- Restore the exact timeline section after close.
- Keep browser back behavior predictable for deep-linked events.
- Avoid mounting every heavy addon or memory asset at once.

## Deep Linking

Support a stable event query or fragment:

```text
/about?event=2016-discord-server-growth
```

Optional deeper state can use additional safe parameters or local destination state.

Direct links should open at Approach or Handle, not launch an unskippable memory-room animation.

Chronology remains one durable `/about` route. Do not create one page per timeline event. Event selection, consequences, and ordinary inspection use validated route state so browser Back closes inspection before leaving About. A memory room receives a dedicated route only if the prototype is retained and proves independent loading or sharing value.

## Sensitive Content

- Review personal artifacts before publication.
- Do not infer emotions or beliefs from source chronology.
- Author changed-belief text directly with Mark.
- Keep difficult periods meaningful without turning vulnerability into spectacle.
- Do not let the AI expose private supporting content.

## Testing

- Timeline order remains stable.
- Event deep links.
- Event open/close with scroll snapping.
- Relationship visibility.
- AI context restoration.
- Hidden discoveries remain outside guided tour.
- Memory-room asset failure returns safely to timeline.
- Keyboard navigation through events and consequences.
- Ten-to-thirty-second no-input observation confirms restrained ambient life without harming reading.
- Timeline anchors remain legible while illumination, trace matter, and depth occlusion use independent temporal bands.
- Reduced motion and stable-frame modes preserve the same authored archive hierarchy.

## Cross-Plan Handoff

When event inspection is complete, other systems may assume:

- Five timeline events expose reviewed consequence relationships.
- About deep links resolve to stable event destinations.
- Selected event and relationship context can be sent to AI and semantic lighting.
- Hidden About discoveries are registered separately from tour-visible content.

The memory-room prototype adds no reusable requirement until its keep, revise, or remove decision is recorded.

## Completion Criteria

- Five events support reviewed consequence inspection.
- Chronology remains easy to use without inspection.
- AI and semantic lighting use the same relationship records.
- One memory room is evaluated and explicitly kept, revised, or removed.
- Easter eggs deepen the story without becoming required content.
