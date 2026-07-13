# Portfolio Implementation Plans

Last updated: 2026-07-14

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
| `00-System-Architecture-And-Interfaces.md` | Shared contracts, ownership, data and event flow | Active foundation |
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
| `12-Traceability-Matrix.md` | Vision-to-plan-to-package-to-evidence mapping | Active planning control |
| `13-Execution-Work-Packages.md` | Ordered packages, dependencies, deliverables, exit evidence | Active execution control |
| `14-Implementation-Tracking-Model.md` | Named dimension states, partial-state rules, health, and update protocol | Active tracking control |
| `15-Capability-Coverage-Ledger.md` | Granular target capabilities and multidimensional status | Active status source |
| `16-Progress-Dashboard.md` | Current focus, checkpoints, gaps, gates, risks, and next work | Active summary |
| `17-Work-Items-And-Resume-Protocol.md` | Workflow states, milestones, WIP, updates, and restart-ready handoffs | Active continuation control |
| `../implementation-work/README.md` | Operational registry for active, paused, review, and recently closed work | Active work source |
| `../implementation-evidence/README.md` | Evidence registry, acceptance rules, and package record template | Active evidence control |

## Start With The Question You Need To Answer

| Question | Read first | Then read |
| --- | --- | --- |
| What should we build next? | `13-Execution-Work-Packages.md` | `01-Program-Roadmap.md` |
| Why are we building it? | `12-Traceability-Matrix.md` | Comprehensive Website Vision |
| How do systems exchange data and state? | `00-System-Architecture-And-Interfaces.md` | Owning workstream plan |
| What decisions are unresolved? | `11-Decision-Register.md` | Relevant gated plan |
| What does done mean for a feature? | Owning workstream plan | `08-Platform-Quality-And-Rollout.md` |
| Which parts of a large feature are actually done? | `15-Capability-Coverage-Ledger.md` | `14-Implementation-Tracking-Model.md` |
| What is in progress, partial, blocked, or next? | `16-Progress-Dashboard.md` | `13-Execution-Work-Packages.md` |
| Where exactly did unfinished work stop? | `../implementation-work/README.md` | Its linked work-item resume packet |
| What proves an implementation or release claim? | `../implementation-evidence/README.md` | Owning package evidence file |
| What belongs later or only in backlog? | `10-Later-And-Backlog.md` | `11-Decision-Register.md` |
| What can we plan for The Studio? | `09-Studio-Feedback-Gate.md` | Wait for Mark's feedback |

## Planning Layers

The documents form five connected layers:

1. **Vision and decisions:** Comprehensive Website Vision and `11-Decision-Register.md`.
2. **Architecture and workstreams:** `00` plus plans `02` through `10`.
3. **Sequencing and traceability:** `01` and `12`.
4. **Execution:** `13`, implementation branches, tests, and previews.
5. **Continuation and proof:** `14` through `17`, `documentation/implementation-work/`, and `documentation/implementation-evidence/`.

Changes should flow downward through these layers. Implementation discoveries can flow upward as decision updates.

## How To Use The Plans

Before starting an implementation phase:

1. Select a `ready` package from `13-Execution-Work-Packages.md`.
2. Confirm its vision requirement in `12-Traceability-Matrix.md`.
3. Read its owning workstream and shared contracts in `00-System-Architecture-And-Interfaces.md`.
4. Check `11-Decision-Register.md` for unresolved gates.
5. Create a focused branch or worktree for that package.
6. Create or reopen a work item with a current resume packet and one exact next action.
7. Implement the smallest coherent slice and collect named exit evidence.
8. Refresh dimension states, named gaps, resume packet, update history, and dashboard before stopping.
9. Update traceability, decisions, and durable architecture when reality changes the plan.

## Tracking Partial Implementation

Large features must not be represented by one optimistic status.

- Use the seven named `S/C/A/I/T/Q/R` dimension states in `15-Capability-Coverage-Ledger.md`.
- Keep uninspected target behavior as `unknown`, not `not-started` or complete.
- Name what works and what remains for every partial capability.
- Treat implemented, verified, and released as different states.
- Link accepted dimensions to durable evidence records.
- Do not publish completion percentages for capabilities, packages, milestones, outcomes, or phases.
- Keep every unfinished active item restartable from its repository resume packet.
- Keep the dashboard concise; keep granular truth in capability, work-item, and evidence files.

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
- Update package status and exit evidence in `13-Execution-Work-Packages.md`.
- Update vision ownership and acceptance evidence in `12-Traceability-Matrix.md`.
- Update capability dimension states and named gaps in `15-Capability-Coverage-Ledger.md`.
- Update current focus, outcome checkpoints, blockers, and reconciliation date in `16-Progress-Dashboard.md`.
- Update work-item resume packets and chronological updates under `documentation/implementation-work/`.
- Register durable proof under `documentation/implementation-evidence/`.
- Update shared contracts before changing incompatible workstream assumptions.
- Move completed milestone details into durable architecture or operations documentation instead of leaving the implementation plans as the only source.
