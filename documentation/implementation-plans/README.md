# Portfolio Implementation Plans

Last updated: 2026-07-12

## Purpose

This folder turns `documentation/Comprehensive-Website-Vision.md` into coordinated implementation plans.

The comprehensive vision remains the product and design source of truth. These documents describe sequencing, architecture, work breakdown, dependencies, validation, and decision gates.

## Scope Classification

Every planned idea belongs to one of five classes.

### Active

Confirmed direction. These plans contain detailed implementation work.

### Prototype Candidate

Promising but not yet proven. These plans define only the smallest prototype needed to evaluate the idea.

### Feedback-Gated

Important and potentially near-term, but further planning pauses until Mark provides more direction.

### Later

Accepted direction that should be considered architecturally now but implemented after the core single-person experience is stable. Plans are intentionally brief.

### Backlog

An idea to revisit later. It is recorded without detailed implementation planning.

## Document Index

| Document | Primary angle | Scope |
| --- | --- | --- |
| `01-Program-Roadmap.md` | Milestones, dependencies, sequencing, releases | Active |
| `02-Experience-Foundation.md` | Depth grammar, discovery, persistence, tour, stimulation, easter eggs | Active |
| `03-Knowledge-Graph-And-Content.md` | Content schemas, relationships, validation, graph access | Active |
| `04-Global-AI-And-Talking-Archive.md` | Site-wide AI, context, cards, RAG, navigation | Active |
| `05-Projects-Museum-And-Case-Studies.md` | Museum system, project experiences, exploded layers | Active |
| `06-About-And-Memory-Depth.md` | Timeline inspection, knowledge connections, memory-room prototype | Active plus prototype |
| `07-Living-Project-State.md` | Project lifecycle and edited current state | Active |
| `08-Platform-Quality-And-Rollout.md` | State, performance, testing, privacy, observability, releases | Active |
| `09-Studio-Feedback-Gate.md` | Services, learning, and products requiring more feedback | Feedback-Gated |
| `10-Later-And-Backlog.md` | Mobile, music, multiplayer, shared exploration, backlog | Later and Backlog |
| `11-Decision-Register.md` | Confirmed, unresolved, deferred, and rejected decisions | All classes |

## How To Use The Plans

Before starting an implementation phase:

1. Read `01-Program-Roadmap.md` for dependencies.
2. Read the relevant workstream document.
3. Check `11-Decision-Register.md` for unresolved gates.
4. Create a focused branch or worktree for one milestone.
5. Implement the smallest coherent vertical slice.
6. Validate against the acceptance criteria in the workstream plan.
7. Update project documentation and the decision register when reality changes the plan.

## Shared Implementation Rules

- Do not build multiple flagship experiences simultaneously.
- Prefer one complete depth journey over many partially interactive objects.
- Keep authored MDX as the factual source; generated content may assist but must not silently replace authored facts.
- Build the relationship graph before relying on semantic lighting or graph-driven AI navigation.
- Treat desktop as the active design target and preserve an architectural boundary for a future independent mobile experience.
- Feature-flag expensive, experimental, or unfinished interactions.
- Persist anonymous discovery locally before considering accounts or cloud synchronization.
- Do not expose private repository, personal, production, or visitor data in demonstrations.
- Avoid fake activity, fake visitors, fake metrics, or demos that could be mistaken for live behavior.
- Keep unrelated local worktree changes out of implementation commits.

## Definition Of A Vertical Slice

A vertical slice includes the complete visitor journey through one narrow feature:

- Content and schema.
- Interaction and visual state.
- AI and graph context where relevant.
- Persistence where relevant.
- Calm and sound-off behavior.
- Loading, error, and fallback behavior.
- Automated tests for deterministic logic.
- Manual desktop validation.
- Documentation and rollout notes.

## Plan Maintenance

These plans are expected to change after prototypes and implementation discoveries.

When updating them:

- Record changed decisions in `11-Decision-Register.md`.
- Keep backlog items brief until promoted.
- Do not expand feedback-gated sections without Mark's input.
- Move completed milestone details into durable architecture or operations documentation instead of leaving the implementation plans as the only source.
