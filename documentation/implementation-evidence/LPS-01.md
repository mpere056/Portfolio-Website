# LPS-01 Evidence

Last updated: 2026-07-16

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `LPS-01` Lifecycle schema |
| Lifecycle | complete |
| Capabilities | `CAP-LPS-001` |
| Work item | `WI-LPS-01-01` |
| Implementation | `afa5f67` |

## EV-LPS-01-01: Lifecycle Rules

| Field | Value |
| --- | --- |
| Status | accepted |
| Type | contract |
| Claim | Evolving, maintained, complete, and archived states require distinct authored sections, valid content versions/dates, and reject evolving-only claims on historical states. |
| Evidence | `tests/lifecycle.test.ts` passes valid fixtures for all four states plus invalid-section/version/date cases. |
| Safe exposure | No real project is classified; `LPS-02` remains decision-gated on Mark's review. |

Package complete without pre-empting project classification.
