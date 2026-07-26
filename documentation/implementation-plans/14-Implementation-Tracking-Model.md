# Implementation Tracking Model

Last updated: 2026-07-20

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `TRK` |
| Status | Active execution control |
| Upstream | Vision, architecture, roadmap, work packages, and decisions |
| Downstream | Capability ledger, work-item registry, continuation dashboard, evidence records, and releases |
| Primary output | A consistent way to represent partial implementation and resume it without reconstructing context |

## Purpose

Large features will be incomplete in different ways at the same time. A project experience may have finished interaction code but incomplete content, missing failure behavior, no creative review, and no production rollout. A single `in progress` label hides those differences, while a percentage invents a denominator that will change as the work becomes better understood.

This model tracks progress at four connected levels:

1. **Vision requirement:** the visitor outcome being protected.
2. **Work package:** the bounded execution unit with dependencies and exit evidence.
3. **Capability:** a stable, visitor-meaningful part of a package that can be assessed independently.
4. **Work item:** a bounded, restartable unit of implementation that contributes to one or more capabilities.

The capability is the stable product-level unit. The work item is the day-to-day continuation unit. Work items may be split, reordered, paused, or canceled without rewriting the capability history.

## Sources Of Truth

| Question | Canonical location |
| --- | --- |
| Why does this exist? | `Comprehensive-Website-Vision.md` and `12-Traceability-Matrix.md` |
| What must the systems exchange? | `00-System-Architecture-And-Interfaces.md` |
| What is the delivery order? | `01-Program-Roadmap.md` |
| What package owns the work? | `13-Execution-Work-Packages.md` |
| What parts of the feature exist? | `15-Capability-Coverage-Ledger.md` |
| What is currently happening? | `16-Progress-Dashboard.md` |
| Exactly where did unfinished work stop? | `17-Work-Items-And-Resume-Protocol.md` and `documentation/implementation-work/` |
| What proves a claim? | `documentation/implementation-evidence/` |
| What changed direction? | `11-Decision-Register.md` |

Do not maintain the same status independently in several documents. The capability ledger owns capability state. The work-item file owns active implementation and resume state. The dashboard points to current work. Work packages own dependency and exit state.

For layered ambient routes, the work-item resume packet also owns the current production-pipeline stage. Use the ordered states below; do not collapse them into “assets in progress” or a percentage.

| Pipeline state | Meaning | Required continuation record |
| --- | --- | --- |
| `baseline` | Existing route behavior and rollback point are being reconciled | Known-good commit, captures, tests, and protected behavior |
| `mapping` | Dominant regions, depth, occlusion, and temporal responsibilities are being authored | Region atlas, motion coverage ledger, and named dead zones |
| `briefing` | Each ingredient receives a preserve/extract/manual/procedural/generate decision | Asset brief, owner, intended stack, maps, budget, and fallback |
| `producing` | The smallest approved route-local plate/map/vector/sprite batch is being created | Asset provenance, variants, alpha cleanup, and no later-route production |
| `asset-review` | Ingredients are reviewed independently and in stack | Accepted/rejected contact sheet with reasons |
| `renderer-proof` | Approved assets test the smallest credible compositor | Renderer comparison, one-scheduler plan, capability/failure decision |
| `integrating` | Ambient and existing semantic/interaction systems are joined | Named drivers, tests, diagnostics, and current regressions |
| `release-review` | The complete route checkpoint is measured and reviewed | Local, Preview/Production, performance, rollback, and Mark evidence |
| `accepted` | The route gate passed | Durable evidence and authorization for the next route to begin production assets |

Production transparent assets may begin only in `producing`, after `mapping` and `briefing`. Later-route assets must not be produced speculatively while another route owns the active ambient work item.

## Seven Coverage Dimensions

Every active capability is assessed across seven dimensions.

| Code | Dimension | Question answered |
| --- | --- | --- |
| `S` | Specification | Is intended behavior, scope, and acceptance clear enough to build? |
| `C` | Content | Are required words, facts, relationships, media, and authored scenarios ready and reviewed? |
| `A` | Architecture and data | Are contracts, IDs, schemas, state ownership, migrations, and integration boundaries ready? |
| `I` | Implementation | Does the capability work in code across its intended happy path and fallbacks? |
| `T` | Automated verification | Do deterministic tests and repeatable browser checks cover the important behavior? |
| `Q` | Creative and manual QA | Have accuracy, interaction clarity, authored art direction, hierarchy, material, typography, pacing, distinctiveness, stimulation, and failure behavior been reviewed? |
| `R` | Rollout | Is it available at the intended environment and protected by flags, monitoring, and rollback where needed? |

Use `-` only when a dimension genuinely does not apply. For example, a low-level TypeScript contract may not need authored content. Do not use `-` to avoid unfinished work.

## Dimension States

Each dimension uses named states rather than numeric levels.

| State | Meaning | Required interpretation |
| --- | --- | --- |
| `unknown` | Current target-state coverage has not been inspected | Requires baseline or direct inspection before planning from it |
| `not-started` | Assessed and no dependable target-state work exists | The existing site may still contain legacy behavior |
| `working` | Useful work exists but named paths or acceptance needs remain | Must link to an active or paused work item with explicit gaps |
| `ready-for-review` | Work appears complete for this dimension | Awaiting the named evidence or reviewer |
| `accepted` | Required evidence exists and the relevant gate accepted it | Evidence ID is mandatory |
| `not-applicable` | The dimension genuinely does not apply | Give a reason when that is not obvious |

Record the dimensions as a readable state map:

```text
S: accepted
C: working
A: accepted
I: working
T: not-started
Q: not-started
R: not-started
```

This says exactly what kind of work remains without implying that the capability is a calculable fraction complete. The compact `U/U/U/U/U/U/U` entries in the initial ledger mean all seven dimensions are `unknown`; active capabilities should replace that shorthand with a detail record.

## Lifecycle State

The lifecycle state is a readable summary, not a replacement for the dimension map.

| State | Use when |
| --- | --- |
| `unassessed` | Any required dimension is `U` and no reliable summary exists |
| `planned` | Scope is accepted enough to schedule but implementation has not started |
| `in-progress` | At least one required dimension is actively moving and target implementation is incomplete |
| `implemented` | Intended target behavior exists, but verification or rollout remains incomplete |
| `verified` | Required acceptance evidence has passed in a production-like environment |
| `released` | Intended production exposure is complete and live verification has passed |
| `blocked` | Progress cannot continue until a named dependency, decision, or external condition changes |
| `paused` | Valid work is intentionally not active; a restart condition is named |
| `deferred` | Classified as prototype, feedback-gated, later, or backlog rather than active delivery |

`blocked` and `paused` preserve the last dimension states and resume packet. They do not reset history.

## Health And Confidence

Track delivery health separately from completion.

| Health | Meaning |
| --- | --- |
| `on-track` | No known issue threatens the next named exit criterion |
| `watch` | A risk exists, but the team can continue productively |
| `at-risk` | A likely issue threatens scope, quality, or sequence |
| `blocked` | A named condition prevents meaningful progress |
| `not-active` | No current delivery commitment |

Track confidence as `high`, `medium`, or `low`.

- `high`: recent evidence and direct inspection support the recorded states.
- `medium`: status is recent but some evidence is indirect or incomplete.
- `low`: status is stale, inferred, or awaiting a baseline audit.

## No Completion Percentages

The program does not calculate capability, package, outcome, milestone, or phase completion percentages.

Instead, every summary answers:

- What state is the work in?
- What coherent checkpoint was last reached?
- What works now?
- What remains incomplete?
- What is actively being worked on?
- What is blocked, paused, or awaiting review?
- What is the next exact action?
- What evidence supports the current claim?

Counts may be used for inventory, such as the number of work items in each state, but never as a claim that a large feature is a certain fraction complete. Milestones are named visitor or platform checkpoints, not arithmetic progress markers.

## Critical Gates

These gates prevent promotion regardless of how much surrounding work appears finished:

- Content accuracy and privacy for all public factual claims.
- Destination validation for AI cards and cross-domain navigation.
- Persistence migration and reset behavior before discovery state reaches production.
- Sound-off and lower-stimulation review for high-stimulation interactions.
- Failure fallback for AI, graph, 3D, and project demonstrations.
- Production build, preview review, live route verification, and rollback readiness.
- Mark's explicit approval for feedback-gated or taste-sensitive work.

For major visual surfaces, `Q` is two inseparable checks: experiential clarity and authored aesthetic quality. Passing usability, route, or screenshot-stability review cannot accept the aesthetic check. The required creative record and anti-generic diagnostics are defined in `18-Art-Direction-And-Aesthetic-Quality.md`; the art-packet checkpoints and delivery boundaries are defined in `19-Aesthetic-System-Integration-And-Delivery.md`.

Track aesthetic work by named artifacts rather than `designing`, `styling`, or `polish`: thesis/content inventory, alternatives, selected packet, runtime dependencies, representative implementation, calm/fallback/support states, regression verification, stable creative captures, Mark review, and rollout. A work item names the last completed artifact and one next observable artifact so another session can resume without reconstructing taste decisions.

When Mark's direct feedback invalidates an accepted taste claim, reopen only the affected package/dimension. Preserve still-valid implementation and rollout evidence, name the aesthetic debt, and create a restartable remediation item rather than pretending all work is either complete or discarded.

## Package State Rules

A package may contain several capabilities.

- `ready`: package dependencies and gates are satisfied; implementation may still be `not-started`.
- `in-progress`: at least one owned capability is active.
- `implemented`: all package deliverables have target code/content, but some exit evidence is incomplete.
- `complete`: every required capability is accepted at the package's target environment and all package exit evidence is registered.
- `reopened`: previously complete evidence became invalid because of a regression, contract change, or scope change.

When reopening a package, retain its completion history and add the reason to the evidence record and dashboard.

Package counts are derived only from package rows in `13-Execution-Work-Packages.md`. Feedback gates and later markers are separate controls and must not be blended into package-state counts.

When one capability name combines an accepted foundation with substantial later visitor behavior, split or narrow the capability rather than marking the whole behavior accepted. For example, stable exhibit-anchor resolution and generalized URL/history/subdomain integration have different package and evidence boundaries.

An accepted evidence range in a phase summary is not registration. Every evidence ID requires its own canonical row in `documentation/implementation-evidence/README.md` and must resolve to a durable package file containing that ID.

## Partial Implementation Record

For the piano-clearing Home, track these checkpoints separately:

- Permanent clearing composition and performance.
- Pianist/About entry.
- Four practice-screen forms and semantic controls.
- One local preview environment.
- One selected environment.
- Remaining three practice environments.
- Project reveal and handoff.
- Direct route and restore behavior.
- Lower-stimulation, reduced-motion, and failure state.
- Renderer lifecycle and measured budget.
- Mark creative review at every visual checkpoint.

An accepted clearing is not an accepted screen system. An accepted preview is not a completed selected environment. A visually accepted environment is not a completed navigation migration. A passing route migration is not proof that runtime budgets are accepted.

Every capability with a `working`, `blocked`, or `paused` dimension should answer:

- What works now?
- What does not work yet?
- Which visitor paths are safe to expose?
- Which paths are behind a flag or fallback?
- What is the next smallest coherent increment?
- What evidence would move the current dimension to the next state?
- Is any completed-looking surface still backed by placeholder content or behavior?
- Which work-item file contains the latest resume packet?
- What was the last known-good commit and verification command?

This record belongs in the capability ledger's note/evidence link, not only in a chat or commit message.

## Update Protocol

Update tracking at these moments:

### At Work Start

1. Name one primary package and the capability IDs being changed.
2. Confirm dependencies and decision gates.
3. Create or reopen one work item and put it in `ready` or `in-progress`.
4. Read and verify its resume packet before editing.
5. Record owner, branch, last known-good commit, next checkpoint, and next exact action.
6. Preserve current dimension states until inspected work actually changes them.

### During Implementation

1. Update a dimension when a durable increment lands, not for every edit.
2. Add a named gap for every `working` dimension.
3. Register important decisions or contract changes immediately.
4. Keep unfinished visitor-facing behavior flagged or unreachable.
5. Append a short work-item update when the next action, blocker, scope, or known-good point changes.

### At Merge Or Session End

1. Update affected dimension states and capability notes.
2. Add evidence IDs and durable links.
3. Refresh the work item's resume packet, even when the work is still incomplete.
4. Record remaining gaps and one next exact action.
5. Record the last known-good commit, commands, routes, flags, and important files.
6. Move the work item to `in-review`, `blocked`, `paused`, or `done` as appropriate.
7. Update the dashboard's now, next, blocked, review, and recently changed sections.
8. Run `npm exec vitest run tests/planningIntegrity.test.ts` when package, capability, evidence, work-item, or dashboard structure changed.

### At Preview Or Production Promotion

1. Record deployment URL and commit.
2. Run the named gate checklist.
3. Update rollout state only for the environment actually verified.
4. Record rollback result or readiness.
5. Reopen any capability invalidated by live behavior.

## Staleness Rules

- Active capability updates older than 14 days receive `watch` health until reconfirmed.
- In-progress capabilities older than 30 days without evidence are treated as stale and reviewed for pause, split, or rescope.
- External preview links must have a durable summary because previews may expire.
- Evidence tied to a superseded contract or content version is marked `superseded`, not deleted.
- Active work items with no update for 14 days are marked stale on the dashboard.
- The dashboard carries a `last reconciled` date and implementation commit.

## Scope Change Rules

When implementation reveals new scope:

1. Decide whether it is a gap in an existing capability, a new capability, or a new package.
2. Add the capability before attaching work items or making completion claims.
3. Update requirement and package mappings.
4. Record meaningful direction changes in the decision register.
5. Update current state without rewriting chronological work-item updates.

Splitting a capability must preserve the parent ID as an alias or historical reference in the ledger.

## Tracking Anti-Patterns

- Any completion percentage for a capability, package, milestone, outcome, or phase.
- Calling code complete when content or failure behavior is placeholder.
- Counting legacy behavior as target-state implementation without assessment.
- Marking a package complete because a branch merged.
- Treating a passing build as creative acceptance.
- Hiding blocked work inside `in-progress` for weeks.
- Deleting failed experiments or superseded evidence instead of recording the decision.
- Maintaining private status in chat that never reaches the repository.
- Ending a work session without a restart-ready next action and known-good point.
- Using a branch name or commit history as the only record of unfinished intent.

## Completion Criteria

- Every active package maps to at least one capability.
- Every active capability has a package, requirement, dimension states, lifecycle state, health, confidence, and next checkpoint.
- Every active or paused work item has a current resume packet.
- Every accepted dimension points to evidence appropriate to that dimension.
- The dashboard can be reproduced from work-item and capability states without arithmetic progress.
- Unknown implementation state is visible and is not represented as zero or complete.
- Partial features record both working behavior and named gaps.
