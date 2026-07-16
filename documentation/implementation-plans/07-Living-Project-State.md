# Living Project State Plan

Last updated: 2026-07-16

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `LPS` |
| Status | Active |
| Upstream | [Architecture](00-System-Architecture-And-Interfaces.md), [Graph schemas](03-Knowledge-Graph-And-Content.md), Mark's lifecycle review |
| Downstream | [Projects Museum](05-Projects-Museum-And-Case-Studies.md), [Global AI](04-Global-AI-And-Talking-Archive.md), disturbances, tour reasons |
| Primary outputs | Lifecycle schema, reviewed classifications, state files, version policy, editorial workflow |
| Execution packages | `LPS-01` through `LPS-05` in [Work Packages](13-Execution-Work-Packages.md) |
| Capability tracking | `CAP-LPS-*` in [Capability Ledger](15-Capability-Coverage-Ledger.md) |

## Scope

Represent evolving, maintained, complete, and archived projects honestly and consistently across project pages, AI answers, blogs, guided tours, and returning-visitor disturbances.

Phase 1 status: `LPS-01` is complete at `afa5f67`. Lifecycle-specific required sections, content-version/date validation, and evolving-only constraints are tested. No real project has been classified; `LPS-02` remains explicitly decision-gated on Mark's review.

## Existing Foundation

Project frontmatter currently includes name, year, headline, summary, details, tech, media, repository, live URL, and 3D model configuration.

Project blogs exist for Dreamlife, LifeInbox, and Sudoku Together, but the project pages do not have a normalized lifecycle or edited current-state model.

## Lifecycle Model

```ts
type ProjectLifecycle = 'evolving' | 'maintained' | 'complete' | 'archived';
```

### Evolving

Product direction or major capability is still changing.

Required state:

- Stable foundation.
- Current question.
- Latest meaningful change.
- Next experiment.

### Maintained

The project is stable and receives practical improvements without active product reinvention.

Required state:

- Stable role.
- Current maintenance focus, if any.
- Latest meaningful maintenance change.

### Complete

The project reached its intended stopping point and is presented as a finished historical case study.

Required state:

- Final outcome.
- Final meaningful state.
- Main lesson.
- Later work influenced.

### Archived

The project is preserved for history but is not current work and may no longer run.

Required state:

- Archive reason.
- Historical importance.
- Last verified state.

## Content Structure

Keep the main project MDX concise. Store richer living state in a dedicated file when needed.

Suggested layout:

```text
src/content/projects/dreamlife.mdx
src/content/project-state/dreamlife.mdx
```

Suggested frontmatter:

```yaml
projectId: project:dreamlife
lifecycle: evolving
contentVersion: 2026-07-12-a
updatedAt: 2026-07-12
```

Suggested authored sections:

```md
## Stable Foundation

## Current Question

## Latest Meaningful Change

## Next Experiment
```

Complete and archived projects use lifecycle-appropriate sections instead.

## Classification Pass

Do not infer lifecycle only from Git activity.

For every project, Mark should confirm:

- Is active work expected?
- Is the project usable now?
- Is maintenance likely?
- Is the repository representative?
- Is the live link valid?
- What is the last state worth showing?

Create a migration table during implementation, but do not assign final lifecycle values without review.

## Meaningful Change Standard

A meaningful change affects at least one of:

- Product capability.
- Reliability or trust.
- Architecture.
- User experience.
- Deployment or operability.
- Understanding of the product problem.

Do not surface:

- Dependency-only updates.
- Formatting changes.
- Routine commits.
- Unverified plans.
- Raw commit counts.

## Editorial Workflow

1. A project change occurs.
2. Decide whether it changes the public story.
3. Update project state if meaningful.
4. Add or update graph relationships if required.
5. Write a longer blog post only when the decision deserves explanation.
6. Increment `contentVersion` when returning visitors should see a disturbance.
7. Run content validation.
8. Preview project, AI answer, and related content before publishing.

## Page Presentation

### Approach Layer

Show lifecycle in plain language without noisy badges.

Examples:

- `Actively evolving`
- `Maintained`
- `Completed in 2024`
- `Archived project`

### Understand Layer

Show lifecycle-specific state using a concise edited composition rather than a feed.

The visitor can open deeper posts or evidence if desired.

## AI Integration

The AI should receive:

- Lifecycle.
- Updated date.
- Stable/current/final sections.
- Public freshness version.

Prompt rules:

- Do not call an archived project active.
- Distinguish current behavior from planned experiments.
- Mention update date when recency matters.
- Prefer current-state content over older blog text when they conflict.

## Blog Integration

Blog posts remain long-form editorial evidence.

Add structured links from a state entry to relevant posts. Do not automatically list every post as a project update.

Project state may summarize a post, but the summary must be authored or reviewed.

## New-Content Disturbances

Only `contentVersion` changes intentionally marked as meaningful should trigger a disturbance.

Disturbance metadata can include:

- Project ID.
- Short private implementation note.
- Public signal type.
- Destination depth.
- Expiry or superseding version.

Do not show update badges or counts by default.

## Validation

- Every project has a lifecycle.
- Required sections exist for that lifecycle.
- Dates are valid.
- Content versions are unique per meaningful state.
- Current questions and next experiments appear only for evolving projects.
- Archived projects do not advertise broken live links without warning.
- Graph relationships reference existing project-state nodes.

## Testing

- Lifecycle parser and required fields.
- Precedence of current state over older content in AI context.
- Meaningful-version comparison.
- Page rendering for all lifecycle types.
- Missing state fallback.
- Direct links to related blog posts.

## Risks

- State becomes stale and harms trust.
- Too-frequent updates turn it into a changelog.
- Automated GitHub data can imply progress without product meaning.
- Plans can be presented as shipped behavior.

## Cross-Plan Handoff

When lifecycle and flagship state work is complete, consumers may assume:

- Every project has a reviewed lifecycle.
- Flagship projects expose one current or final source of truth.
- Meaningful content versions are distinct from Git activity.
- AI can resolve current truth before older writing.
- Disturbance selection can compare reviewed versions safely.

Consumers must not infer lifecycle or current state from repository timestamps.

## Completion Criteria

- Every project is reviewed and classified.
- Flagship active projects have edited state files.
- Historical projects have honest final or archive context.
- AI, pages, and disturbances use the same state source.
- Updating a meaningful state is documented and low-friction.
