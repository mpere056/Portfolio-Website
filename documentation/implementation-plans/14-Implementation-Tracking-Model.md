# Implementation Tracking Model

Last updated: 2026-07-13

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `TRK` |
| Status | Active execution control |
| Upstream | Vision, architecture, roadmap, work packages, and decisions |
| Downstream | Capability ledger, progress dashboard, evidence records, and releases |
| Primary output | A consistent way to represent partial implementation without overstating progress |

## Purpose

Large features will be incomplete in different ways at the same time. A project experience may have finished interaction code but incomplete content, missing failure behavior, no creative review, and no production rollout. A single `in progress` label or an unsupported percentage hides those differences.

This model tracks progress at four connected levels:

1. **Vision requirement:** the visitor outcome being protected.
2. **Work package:** the bounded execution unit with dependencies and exit evidence.
3. **Capability:** a stable, visitor-meaningful part of a package that can be assessed independently.
4. **Implementation task:** short-lived branch, issue, or session work that contributes to one or more capabilities.

The capability is the primary progress unit. Tasks may be reorganized freely without rewriting the product-level history.

## Sources Of Truth

| Question | Canonical location |
| --- | --- |
| Why does this exist? | `Comprehensive-Website-Vision.md` and `12-Traceability-Matrix.md` |
| What must the systems exchange? | `00-System-Architecture-And-Interfaces.md` |
| What is the delivery order? | `01-Program-Roadmap.md` |
| What package owns the work? | `13-Execution-Work-Packages.md` |
| What parts of the feature exist? | `15-Capability-Coverage-Ledger.md` |
| What is currently happening? | `16-Progress-Dashboard.md` |
| What proves a claim? | `documentation/implementation-evidence/` |
| What changed direction? | `11-Decision-Register.md` |

Do not maintain the same status independently in several documents. The capability ledger owns granular status. The dashboard summarizes it. Work packages own dependency and exit state.

## Seven Coverage Dimensions

Every active capability is assessed across seven dimensions.

| Code | Dimension | Question answered |
| --- | --- | --- |
| `S` | Specification | Is intended behavior, scope, and acceptance clear enough to build? |
| `C` | Content | Are required words, facts, relationships, media, and authored scenarios ready and reviewed? |
| `A` | Architecture and data | Are contracts, IDs, schemas, state ownership, migrations, and integration boundaries ready? |
| `I` | Implementation | Does the capability work in code across its intended happy path and fallbacks? |
| `T` | Automated verification | Do deterministic tests and repeatable browser checks cover the important behavior? |
| `Q` | Creative and manual QA | Has accuracy, taste, pacing, discoverability, stimulation, and failure behavior been reviewed? |
| `R` | Rollout | Is it available at the intended environment and protected by flags, monitoring, and rollback where needed? |

Use `-` only when a dimension genuinely does not apply. For example, a low-level TypeScript contract may not need authored content. Do not use `-` to avoid unfinished work.

## Dimension Levels

| Level | Meaning | Required interpretation |
| --- | --- | --- |
| `U` | Unassessed | Current state is unknown. It blocks a trustworthy rollup. |
| `0` | Not started | Assessed and no target-state work exists. |
| `1` | Drafted | Direction, spike, rough content, or scaffolding exists but is not dependable. |
| `2` | Partial | Useful target-state work exists, with named gaps or incomplete paths. |
| `3` | Implemented | The dimension appears complete, but final acceptance evidence is not yet approved. |
| `4` | Accepted | Required evidence exists and the relevant reviewer or gate has accepted it. |
| `-` | Not applicable | Excluded from the capability calculation with a written reason if non-obvious. |

A level describes the target architecture in these plans, not whether the current legacy site has a vaguely similar feature.

## Coverage Vector

Record capability coverage in this fixed order:

```text
S/C/A/I/T/Q/R
```

Examples:

| Vector | Honest interpretation |
| --- | --- |
| `2/1/2/0/0/0/0` | Partly designed, early content and architecture, no implementation yet |
| `4/3/4/3/2/1/1` | Built in development, but tests, creative review, and rollout remain incomplete |
| `4/-/4/4/4/4/3` | Accepted technical capability in preview; content is not applicable and production is pending |
| `U/U/U/U/U/U/U` | Baseline audit has not assessed this capability; do not publish a percentage |

Every `1` or `2` must have a short named gap in the ledger or linked evidence record. A vector is not useful if it only says that something is partial.

## Lifecycle State

The lifecycle state is a readable summary, not a replacement for the vector.

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

`blocked` and `paused` preserve the last coverage vector. They do not reset progress.

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

- `high`: recent evidence and direct inspection support the vector.
- `medium`: status is recent but some evidence is indirect or incomplete.
- `low`: status is stale, inferred, or awaiting a baseline audit.

## Progress Calculation

Percentages are summaries, never acceptance claims.

For an assessed capability:

```text
capability progress = sum(applicable dimension levels) / (4 * applicable dimension count)
```

For a workstream or release outcome:

```text
rollup progress = sum(capability progress * capability weight) / sum(capability weights)
```

Rules:

- Do not publish a rollup while any included capability has `U` in a required dimension. Show `baseline incomplete` instead.
- Round to the nearest whole percent and always show assessed capability coverage, such as `18/22 assessed`.
- Weights are relative complexity and visitor importance: `1` small, `2` medium, `3` large, `5` critical or unusually broad.
- Never change a weight to make progress look better. Weight changes require a ledger note.
- A high percentage does not override a failed critical gate.
- `released` requires evidence even if the arithmetic reaches 100%.

## Critical Gates

These gates can prevent promotion regardless of percentage:

- Content accuracy and privacy for all public factual claims.
- Destination validation for AI cards and cross-domain navigation.
- Persistence migration and reset behavior before discovery state reaches production.
- Sound-off and lower-stimulation review for high-stimulation interactions.
- Failure fallback for AI, graph, 3D, and project demonstrations.
- Production build, preview review, live route verification, and rollback readiness.
- Mark's explicit approval for feedback-gated or taste-sensitive work.

## Package Rollup Rules

A package may contain several capabilities.

- `ready`: package dependencies and gates are satisfied; capability progress may still be `0`.
- `in-progress`: at least one owned capability is active.
- `implemented`: all package deliverables have target code/content, but some exit evidence is incomplete.
- `complete`: every required capability is accepted at the package's target environment and all package exit evidence is registered.
- `reopened`: previously complete evidence became invalid because of a regression, contract change, or scope change.

When reopening a package, retain its completion history and add the reason to the evidence record and dashboard.

## Partial Implementation Record

Every active capability with a `1` or `2` should answer:

- What works now?
- What does not work yet?
- Which visitor paths are safe to expose?
- Which paths are behind a flag or fallback?
- What is the next smallest coherent increment?
- What evidence would move the current dimension to the next level?
- Is any completed-looking surface still backed by placeholder content or behavior?

This record belongs in the capability ledger's note/evidence link, not only in a chat or commit message.

## Update Protocol

Update tracking at these moments:

### At Work Start

1. Name one primary package and the capability IDs being changed.
2. Confirm dependencies and decision gates.
3. Record lifecycle `in-progress`, owner, branch or task, and next checkpoint on the dashboard.
4. Preserve the current vector until work actually changes a dimension.

### During Implementation

1. Update a dimension when a durable increment lands, not for every edit.
2. Add a named gap for every partial dimension.
3. Register important decisions or contract changes immediately.
4. Keep unfinished visitor-facing behavior flagged or unreachable.

### At Merge Or Session End

1. Update affected vectors and capability notes.
2. Add evidence IDs and durable links.
3. Recalculate package and release rollups.
4. Record remaining gaps and the next coherent slice.
5. Update the dashboard's in-flight, blocked, and recently changed sections.

### At Preview Or Production Promotion

1. Record deployment URL and commit.
2. Run the named gate checklist.
3. Update `R` only for the environment actually verified.
4. Record rollback result or readiness.
5. Reopen any capability invalidated by live behavior.

## Staleness Rules

- Active capability updates older than 14 days receive `watch` health until reconfirmed.
- In-progress capabilities older than 30 days without evidence are treated as stale and reviewed for pause, split, or rescope.
- External preview links must have a durable summary because previews may expire.
- Evidence tied to a superseded contract or content version is marked `superseded`, not deleted.
- The dashboard carries a `last reconciled` date and commit.

## Scope Change Rules

When implementation reveals new scope:

1. Decide whether it is a gap in an existing capability, a new capability, or a new package.
2. Add the capability before counting its work in a rollup.
3. Update requirement and package mappings.
4. Record meaningful direction changes in the decision register.
5. Recalculate the rollup without rewriting historical snapshots.

Splitting a capability must preserve the parent ID as an alias or historical reference in the ledger.

## Tracking Anti-Patterns

- One percentage with no dimensions or evidence.
- Calling code complete when content or failure behavior is placeholder.
- Counting legacy behavior as target-state implementation without assessment.
- Marking a package complete because a branch merged.
- Treating a passing build as creative acceptance.
- Hiding blocked work inside `in-progress` for weeks.
- Deleting failed experiments or superseded evidence instead of recording the decision.
- Maintaining private status in chat that never reaches the repository.

## Completion Criteria

- Every active package maps to at least one capability.
- Every active capability has a package, requirement, weight, vector, lifecycle state, health, confidence, and next checkpoint.
- Every accepted dimension points to evidence appropriate to that dimension.
- Dashboard rollups can be reproduced from the capability ledger.
- Unknown implementation state is visible and is not represented as zero or complete.
- Partial features record both working behavior and named gaps.
