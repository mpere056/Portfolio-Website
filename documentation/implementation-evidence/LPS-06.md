# LPS-06 Evidence

Last updated: 2026-07-18

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `LPS-06` Selected flagship state seed |
| Lifecycle | complete |
| Capability | `CAP-LPS-007` |
| Work item | `WI-LPS-06-01` |
| Exposure | Public selected-exhibit state; explicit Mark correction path retained |

## EV-LPS-06-01: Source-Grounded Lifecycle Contract

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | content-review and contract |
| Claim | LifeInbox is represented as `evolving` with every required section grounded in the public repository's Current Shape, What Works, and Known Priority Risks rather than commit timestamps. |
| Evidence | `src/content/misc/lifeinbox-current-state.mdx`; loader and lifecycle validation pass; content validation compiles 50 nodes and 19 reviewed relationships. |

## EV-LPS-06-02: Museum Attachment And Correction Path

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | integration-test and browser-flow |
| Claim | The state attaches only to `project:lifeinbox`, renders stable/open/change/next depth with public evidence, and visibly invites Mark correction without changing historical writing. |
| Evidence | `tests/projectStates.test.tsx` passes two cases; local direct-entry DOM review verifies the living-state region and links. |

## Boundaries After Completion

- This is one selected-project seed, not portfolio-wide lifecycle classification.
- Source review supports the current public record; Mark may correct lifecycle or wording through the named correction path.
- The record makes no user, revenue, release-readiness, or future-delivery claim.

