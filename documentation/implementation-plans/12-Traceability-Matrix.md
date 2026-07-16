# Vision Traceability And Dependency Matrix

Last updated: 2026-07-16

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `TRC` |
| Status | Active planning control |
| Upstream | Comprehensive Website Vision |
| Downstream | Roadmap, work packages, capability ledger, work items, evidence registry, and all workstream plans |
| Primary output | Proof that every confirmed vision item has an owner and validation path |

## Purpose

Connect product decisions to architecture, work packages, and acceptance evidence. This prevents attractive ideas from being lost between documents and prevents implementation tasks from appearing without a product reason.

## Vision Requirements

| ID | Confirmed requirement | Owning plan | Primary work packages | Acceptance evidence |
| --- | --- | --- | --- | --- |
| `V-01` | One cohesive experience | `00`, `02`, `05`, `06`, IA decision | `ARC-03`, `EXP-02`, `PRJ-03`, `ABT-02` | Durable routes and semantic destinations feel continuous across Home, one project subdomain, and one event while Back/deep links remain predictable |
| `V-02` | Exploration is primary | `02` | `EXP-02`, `EXP-05` | New visitor discovers and handles one object without forced tour |
| `V-03` | Increasing depth | `00`, `02`, `05` | `ARC-02`, `EXP-02`, `PRJ-03` | Signal through Understand works in first flagship |
| `V-04` | Products are experienced | `05` | `PRJ-02` through `PRJ-06` | Flagship product slices pass interaction QA |
| `V-05` | World remembers | `02` | `EXP-01`, `EXP-03`, `EXP-07` | Return visit restores semantic checkpoint and discoveries |
| `V-06` | One-time First Note | `02` | `EXP-03` | First visit wakes; later visits skip; audio denial safe |
| `V-07` | Non-linear guided tour | `02` | `EXP-04` | Destinations selectable in any order; no checklist |
| `V-08` | Free exploration has unique value | `02`, `05`, `06` | `EXP-06`, `PRJ-07`, `ABT-04` | Hidden discoveries absent from tour data |
| `V-09` | Quiet global AI | `04` | `AI-01` through `AI-05` | AI available across routes without repeated buttons |
| `V-10` | AI cards flow into site | `00`, `04` | `ARC-03`, `AI-03`, `AI-04` | Valid card opens exact destination and safe state |
| `V-11` | Knowledge graph is infrastructure | `03` | `KG-01` through `KG-06` | Reviewed subgraph powers at least three consumers |
| `V-12` | Semantic lighting | `03`, `02` | `KG-05`, `EXP-05` | Three reviewed edges render with explanations |
| `V-13` | About shows what events became | `06` | `ABT-01`, `ABT-02` | Five events reveal reviewed consequences |
| `V-14` | Projects are inspectable systems | `05` | `PRJ-01`, `PRJ-03`, `PRJ-04` | First exhibit supports full depth journey |
| `V-15` | Exploded case studies | `05` | `PRJ-04`, `PRJ-05`, `PRJ-06` | Behavior connects visibly to system and evidence |
| `V-16` | Dreamlife experiential case study | `05` | `PRJ-05` | Authored future-path interaction works |
| `V-17` | LifeInbox experiential case study | `05` | `PRJ-04` or `PRJ-05` | Synthetic entry autopsy works end to end |
| `V-18` | Sudoku computer participant | `05` | `PRJ-04` or `PRJ-06` | Valid deterministic collaborative slice works |
| `V-19` | Living project state | `07` | `LPS-01` through `LPS-05` | Every project classified; flagship state current |
| `V-20` | Meaningful easter eggs | `02`, `06`, `05` | `EXP-06`, `ABT-04`, `PRJ-07` | Three types reveal meaningful content, no score |
| `V-21` | Rare site feedback requests | `11` prototype | `PXP-03` | One bounded prototype receives explicit review |
| `V-22` | Stimulation spectrum | `02`, `08` | `EXP-05`, `QA-04` | Sound-off and lower-stimulation flows pass QA |
| `V-23` | New content as disturbance | `02`, `07` | `EXP-07`, `LPS-04` | Meaningful version produces one dismissible signal |
| `V-24` | Skill evidence prototype | `03`, `11` prototype | `PXP-01` | Prototype answers whether evidence view aids evaluation |
| `V-25` | Desktop first, mobile independent later | `10` | `LTR-01` architecture checks only | Shared contracts contain no desktop geometry assumptions |
| `V-26` | Ambient presence later | `10` | `LTR-03` later | No near-term acceptance requirement |
| `V-27` | Shared exploration later | `10` | `LTR-04` later | No near-term acceptance requirement |
| `V-28` | Musical identity later with Mark | `10` | `LTR-02` integration hooks only | No motif planned without collaboration |
| `V-29` | Studio waits for feedback | `09` | `STU-GATE-01` | No implementation beyond allowed preparation |
| `V-30` | Anti-Resume backlog only | `10` | None | Recorded only, no detailed tasks |

## Requirement To Capability Control

`15-Capability-Coverage-Ledger.md` is the granular implementation layer beneath this matrix. Every capability row identifies one or more requirement IDs, `Platform`, or `Prototype`.

Traceability is complete only when:

- Every active requirement maps to at least one active capability.
- Every active capability maps back to a requirement or a named platform necessity.
- Capability scope signals do not imply requirement priority or completion; they only warn when work likely needs splitting.
- Requirement acceptance uses the combined evidence of all critical mapped capabilities, not arithmetic progress.
- Later, feedback-gated, and backlog requirements remain outside active workflow until promoted.
- A requirement cannot be accepted while a critical mapped capability is blocked, unassessed, or missing required evidence.

## Workstream Dependency Matrix

Legend: `R` means row requires column. `P` means partial or prototype dependency.

| Workstream | ARC | EXP | KG | AI | PRJ | ABT | LPS | QA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ARC` Interfaces | - | | | | | | | |
| `EXP` Experience | R | - | P | P | | | | R |
| `KG` Knowledge | R | | - | | | | P | R |
| `AI` Global AI | R | P | R | - | | | P | R |
| `PRJ` Museum | R | R | R | P | - | | R | R |
| `ABT` About | R | R | R | P | | - | | R |
| `LPS` Project state | R | | R | | | | - | R |
| `QA` Quality | R | | | | | | | - |

## Phase To Work-Package Traceability

| Roadmap phase | Required packages | Gate to exit |
| --- | --- | --- |
| Phase 0 Baseline | `BAS-01`, `BAS-02`, `BAS-04`, `BAS-06`, `BAS-07`, `BAS-05`, `BAS-08`, `ARC-01` | Baseline, supported runtime/framework, durable retrieval, target-state capability audit, and stable-ID decisions recorded |
| Phase 1 Structural foundation | `BAS-03`, `ARC-02` to `ARC-05`, `KG-01` to `KG-04`, `LPS-01`, `EXP-01`, `AI-01` | Flags, schemas, graph, persistence, context validate |
| Phase 2 Exploration shell | `EXP-02` to `EXP-07`, `AI-02`, `AI-03`, `KG-05`, `QA-01` | First Note, tour, AI shell, lighting prototype work together |
| Phase 3 First flagship | `PRJ-01` to `PRJ-04`, `AI-04`, `QA-02` | One full vertical slice passes acceptance |
| Phase 4 Remaining flagships | `PRJ-05` to `PRJ-08`, `AI-05`, `LPS-02` | Three flagship experiences and lighter projects coherent |
| Phase 5 About | `ABT-01` to `ABT-04` | Five events inspectable; memory prototype decided |
| Phase 6 Living operations | `LPS-03` to `LPS-05`, `QA-03` | Project states reviewed and disturbances reliable |
| Experimental | `PXP-01`, `PXP-03` | Each active prototype gets keep, revise, or remove decision; `PXP-02` remains later |

## Acceptance Evidence Types

| Evidence type | Stored as | Used for |
| --- | --- | --- |
| Unit test | Test file and passing output | Deterministic contracts and state |
| Integration test | Test file and passing output | Cross-system behavior |
| Browser flow | Automated or documented run | Visitor journey |
| Visual checkpoint | Screenshot or preview link | Composition and state |
| Content validation | Script output | IDs, graph, lifecycle, visibility |
| Manual creative review | Review checklist | Taste, discoverability, pacing |
| Live verification | Route/status notes | Production and subdomains |
| Decision record | `11-Decision-Register.md` | Prototype and scope gates |
| Capability reconciliation | `15-Capability-Coverage-Ledger.md` | Named partial implementation states |
| Work-item resume packet | `documentation/implementation-work/active/{WORK-ITEM-ID}.md` | Exact restart context and chronological updates |
| Package evidence record | `documentation/implementation-evidence/{PACKAGE-ID}.md` | Durable acceptance and release proof |

## Orphan Checks

Before a milestone starts:

- Every work package must trace to a vision requirement or platform requirement.
- Every confirmed vision requirement must have at least one package or an explicit later classification.
- Every cross-system package must reference an interface contract.
- Every prototype must name the decision it will enable.
- Every acceptance criterion must name evidence that can actually be collected.
- Every active package must own at least one capability.
- Every accepted capability dimension must point to accepted evidence.
- Every partial capability must name its remaining gaps and next coherent increment.

## Change Process

When the vision changes:

1. Update `Comprehensive-Website-Vision.md`.
2. Update `11-Decision-Register.md`.
3. Update this requirement row.
4. Add, remove, or change execution packages.
5. Re-evaluate phase gates and downstream plans.
6. Reconcile capability inventory, dimension states, work items, and checkpoints before reporting the new state.
