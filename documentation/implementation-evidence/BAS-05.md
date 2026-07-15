# BAS-05 Evidence

Last updated: 2026-07-14

## Package Snapshot

| Field | Value |
| --- | --- |
| Package | `BAS-05` Target-state implementation audit |
| Lifecycle | complete |
| Capability | `CAP-BAS-005` |
| Audited commit | `4144bcc2f252a211ce0c611328ffe6be6d51dd32` |
| Work item | `WI-BAS-05-01` |
| Production reference | `dpl_7NyMmtPT9GDU7YKYJoMVrJgyKgkG` |

## Accepted Evidence

| Evidence | Type | Claim | Actual |
| --- | --- | --- | --- |
| `EV-BAS-05-01` | integration-test | Current code, content, routes, state, AI, and test surfaces are directly inspected | Reviewed App Router routes, loaders, Zustand state, interaction components, ingestion/retrieval, subdomain proxy, project sites/blogs, and tests at the audited commit |
| `EV-BAS-05-02` | content-review | Retained legacy behavior is separated from target-compliant capability state | The matrix below records reusable behavior and consequential gaps without treating visual similarity or production exposure as target acceptance |
| `EV-BAS-05-03` | decision | The first implementation sequence follows confirmed dependencies | Stable content IDs are first through `ARC-01`, followed by shared contracts, a foundation harness, and shared-loader parity; distant and gated work remains unexpanded |

## Current Implementation Matrix

| Area | Dependable behavior now | Target-state gap | Primary owner |
| --- | --- | --- | --- |
| Content identity | Projects use slugs, About uses authored IDs, blogs use site plus slug, and inventory detects duplicates and fallbacks | No shared canonical constructor, rename migration, or cross-consumer identity resolution existed at the audited commit | `ARC-01` |
| Shared contracts | Local TypeScript interfaces exist for projects, timeline, retrieval, and project sites | Depth, destination, discovery, AI context, project state, and cross-system actions have no canonical shared contract | `ARC-02` through `ARC-05` |
| Knowledge corpus | 39 MDX nodes are inventoried; project, timeline, and blog loaders serve current routes; 36 nodes reach retrieval | Loaders are separate, relationships are not authored or compiled, About IDs diverge in ingestion, and three nested posts are skipped | `KG-01` through `KG-04` |
| Exploration | Home has spatial navigation; Projects supports cards, scrolling, model expansion, audio, and motion; About has timeline scrolling and interactive addons | No five-stage depth controller, discovery store, First Note, return checkpoint, tour, semantic lighting, or hidden-discovery registry | `EXP-01` through `EXP-07` |
| AI | A standalone `/chat` route retrieves MDX chunks and streams grounded Gemini answers with bounded model fallback | AI is not site-wide, receives no route/object/depth context, has no public graph enforcement, and cannot emit validated destination cards | `AI-01` through `AI-05` |
| Projects | `/projects` and three distinct subdomain sites/blogs are live; project metadata and host rewrites work | No typed exhibit registry, shared depth journey, exploded layers, or experiential flagship slices exist | `PRJ-01` through `PRJ-08` |
| About | Twenty chronological entries, media, textures, and bounded interactive addons render | Events lack reviewed consequence relationships, inspectable direct-link state, semantic links, and memory-depth decisions | `ABT-01` through `ABT-04` |
| Living state | Project descriptions and blog posts are authored in MDX | No lifecycle schema, current-state records, freshness workflow, content versions, or update disturbances exist | `LPS-01` through `LPS-05` |
| Quality and rollout | Unit tests, lint, builds, manual browser checks, exact-commit previews, public route checks, and rollback records exist | No reusable browser harness, vertical-slice creative gate, stimulation QA, or feature-flag promotion workflow exists | `QA-01` through `QA-06` |

## Inspection Method

- Ran `npm run inventory:content`: 39 nodes, 35 authored identifiers, 4 filename fallbacks, 20 runtime/retrieval divergences, 3 blog ingestion gaps, and 0 structural errors.
- Inspected `src/app`, `src/components`, `src/lib`, `scripts/ingest.ts`, `tests`, the capability ledger, traceability matrix, and architecture contracts.
- Confirmed the audited production deployment remained Ready and that prior `BAS-07` evidence covered current public routes, retrieval, and chat.
- Preserved unrelated local changes and treated them as neither evidence nor audit scope.

## Capability Reconciliation

- `CAP-BAS-005` is verified through this evidence record.
- `CAP-ARC-001` is the only newly active target capability and owns the first implementation work item.
- `CAP-ARC-002`, `CAP-KG-001`, and `CAP-QA-001` have inspected planned states and explicit dependency checkpoints.
- Other target capabilities remain unassessed until they approach execution; the implementation matrix preserves their current legacy context without inventing premature detail.

## Completion Decision

`BAS-05` is complete. The supported production implementation is understood well enough to avoid rebuilding existing foundations blindly, the first target-state gaps have honest named states, and `ARC-01` has one restartable implementation path.
