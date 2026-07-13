# PACKAGE-ID Evidence

Last updated: YYYY-MM-DD

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `PACKAGE-ID` Package name |
| Lifecycle | ready / in-progress / implemented / complete / reopened |
| Owner | Name or `unassigned` |
| Capabilities | `CAP-XXX-000` |
| Requirements | `V-00` or Platform |
| Branch/task | Reference |
| Target environment | local / preview / production |
| Started | YYYY-MM-DD |
| Last assessed | YYYY-MM-DD at commit |

## Scope Delivered

Describe the smallest coherent visitor or platform outcome delivered by this package. Separate current behavior from planned behavior.

## Partial State

### Works Now

- Dependable behavior that has been directly inspected.

### Named Gaps

| Capability | Dimension | Gap | Exposure | Next evidence needed |
| --- | --- | --- | --- | --- |
| `CAP-XXX-000` | `I` | Missing behavior | Flagged/off/preview/live | Specific proof |

### Safe Exposure

Record flags, fallbacks, unreachable paths, placeholder warnings, and environments where this work may safely appear.

## Evidence Items

### EV-PACKAGE-ID-01: Evidence Name

| Field | Value |
| --- | --- |
| Status | candidate / accepted / failed / superseded / expired |
| Type | decision / content-review / contract / unit-test / integration-test / browser-flow / visual-review / creative-review / performance / privacy-security / preview / production |
| Claim | Exact claim this evidence supports |
| Capabilities | `CAP-XXX-000` |
| Dimensions | `S`, `C`, `A`, `I`, `T`, `Q`, or `R` |
| Requirements | `V-00` or Platform |
| Date | YYYY-MM-DD |
| Reviewer | Name |
| Commit | Full or short commit hash |
| Environment | Local, preview URL, or production route |
| Flags | Relevant feature flags and values |
| Browser/device | If relevant |

#### Method

```text
Exact command or repeatable review steps
```

#### Expected

State the criterion before reporting the result.

#### Actual

Record observable output, behavior, metrics, screenshots, or review decision.

#### Artifacts

- Repository path, screenshot, report, CI run, preview, or external artifact.

#### Limitations

- Untested paths, environment differences, known flakiness, or scope boundaries.

#### Follow-Up

- Next evidence, fix, superseding ID, rollback, or `none`.

## Capability Reconciliation

| Capability | Before | After | Lifecycle | Health | Confidence | Evidence | Next checkpoint |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CAP-XXX-000` | `U/U/U/U/U/U/U` | `2/1/2/1/0/0/0` | in-progress | on-track | medium | `EV-PACKAGE-ID-01` | Observable increment |

## Package Exit Checklist

- Deliverables match `13-Execution-Work-Packages.md`.
- Every owned capability is reconciled.
- Partial dimensions have named gaps.
- Accepted dimensions have accepted evidence.
- Contract changes are documented.
- Content claims are reviewed.
- Fallback and flag behavior is recorded.
- Automated checks and manual QA are recorded.
- Preview or production evidence matches the claimed rollout level.
- Dashboard, traceability, and decisions are updated.

## Completion Or Reopen Decision

Record who made the decision, when, why the exit evidence is sufficient, or why a previously complete package was reopened.
