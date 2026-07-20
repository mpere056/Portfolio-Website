# Implementation Continuation Dashboard

Last reconciled: 2026-07-20
Implementation commit baseline and latest verified Production: `fce50af`

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `DSH` |
| Status | Active summary; update whenever implementation or work-item state changes |
| Upstream | Work-item registry, capability ledger, work packages, evidence records, and decisions |
| Downstream | Session restart, work selection, milestone reviews, previews, and release decisions |
| Primary output | A concise view of current focus, last checkpoints, uncertainty, blockers, and exact next work |

## Current Program State

**The Phase 4 interaction candidate is live at `fce50af`; its geometry and interaction checks pass, and `ART-12` is now in progress through the representative-asset brief review gate.**

The original rollout proved route health, fallbacks, lifecycle policy, and renderer safety, but Mark's screenshots showed that `/projects` required scrolling and the direct project surfaces did not make their dynamics perceptible. Production `fce50af` fixed that first problem: it keeps the nine-project Museum lobby inside one desktop viewport, contains increasing depth, strengthens graph-aware response, and introduces distinct route-owned scenes on all three flagship subdomains. Mark's next observation correctly exposed a deeper issue: the dominant raster art still reads as static while smaller interaction layers move. `ART-12A` has now measured that baseline and `ART-12B` has accounted for every dominant region; `ART-12C` briefs the first bounded material stack. No production asset, compositor, or `V-33` ambient acceptance is claimed yet.

This distinction prevents two errors:

- Treating the existing site as though nothing has been built.
- Treating a visually similar legacy feature as complete under the new contracts and acceptance criteria.

## Outcome Dashboard

| Outcome | Current stage | Health | Last coherent checkpoint | Critical gate | Next proof point |
| --- | --- | --- | --- | --- | --- |
| `O-00` Measured foundation | Phase 1 complete | on-track | Contracts, flags, content, graph, state, context, harness, and planning-integrity controls accepted | Preserve boundaries and tracking integrity during integrated adoption | Keep `tests/planningIntegrity.test.ts` in every structural planning gate |
| `O-01` Persistent exploratory world | Phase 2 live | on-track | Complete shell and independent rollback flags pass public Production | Preserve stability through Phase 4 deployment | Review returning-visitor behavior after normal use |
| `O-02` Quiet global AI | Phase 4 migration live | on-track | Site-wide archive owns conversation and legacy `/chat` preserves prompts through redirect | Preserve regression coverage | Keep the global instrument quiet and contextual |
| `O-03` First flagship proof | ambient extension pending | watch | Direct-surface product interaction is live and known-good | Route-specific decomposed material packs and idle-life review | Complete the Museum ambient proof before beginning flagships sequentially |
| `O-04` Portfolio museum | ambient planning in-progress | watch | Live regression baseline and complete source-region/motion ledger preserve the one-viewport nine-signal Museum | Reviewed representative assets, then pervasive no-input material life without regression | Review `AB-MUS-01` through `AB-MUS-11`; after acceptance, produce the west/lower ecology stack |
| `O-05` About depth | not active | not-active | Target event-depth model documented | Reviewed event consequences | Five-event review plus one inspection flow |
| `O-06` Living portfolio operations | Phase 4 records complete | on-track | Nine validated lifecycle records and nine reviewed graph links render lifecycle-specific depth | Preserve correction paths during future edits | Later add version disturbances through `LPS-04` |

## Package Snapshot

| Package state | Count | Meaning now |
| --- | ---: | --- |
| `ready` | 0 | No package is waiting to start; the only primary package is already active |
| `in-progress` | 1 | `ART-12` has completed baseline/mapping and is at its asset-brief review gate |
| `implemented` | 10 | `ART-01`, `ART-03` through `ART-06`, and `ART-07` through `ART-11` are coded and public; their interaction evidence remains valid while ambient creative acceptance moves to `ART-12` through `ART-15` |
| `in-review` | 0 | Mark's review resolved the previous candidates as insufficient |
| `pending` | 11 | Phase 5+ and ambient route-expansion packages wait on their intended sequence or feedback gates |
| `reopened` | 1 | Renewed creative `QA-02` retains valid public/functional evidence and waits on the evolving creative acceptance path |
| `decision-gated` | 0 | Phase 4 lifecycle classification is recorded with correction paths |
| `prototype` | 3 | Bounded experiments, not committed product scope |
| `later` | 1 | Ambient presence is intentionally outside near-term delivery |
| `complete` | 46 | Functional packages remain accepted; only invalidated aesthetic dimensions were reopened |

Counts include only the 73 package rows in `13-Execution-Work-Packages.md`; feedback and collaboration markers are reported under Gates And Decisions rather than mixed into package totals. Counts organize workflow states only and do not measure feature completion.

## Current Execution Queue

| Order | Package | Purpose | Status | Start condition | Completion signal |
| ---: | --- | --- | --- | --- | --- |
| 1 | `BAS-01` | Technical baseline | complete | None | Build, route, warning, model, test, and live-domain evidence accepted |
| 2 | `BAS-02` | Content inventory | complete | None | Reviewed inventory with missing stable IDs identified |
| 3 | `BAS-04` | Runtime maintenance decision | complete | None | Node.js 24 bridge and separate Next.js 16 package accepted |
| 4 | `BAS-06` | Supported runtime and security bridge | complete | `BAS-04` | Node.js 24 tests/build, audit delta, preview, production, and rollback evidence |
| 5 | `BAS-07` | Supported framework modernization | complete | `BAS-06` | Next.js 16, React/3D ecosystem, API, browser, visual, preview, and production gates pass |
| 6 | `BAS-05` | Target-state implementation audit | complete | `BAS-01`, `BAS-02`, `BAS-06`, `BAS-07` | Current and next capabilities have inspected states and restartable work items |
| 7 | `BAS-08` | Durable free-tier retrieval datastore | complete | `BAS-07`, `ARC-01` ingestion contract | Real canonical retrieval, grounded live chat, routes, and rollback evidence |
| 8 | `ARC-01` | Stable ID policy | complete | `BAS-02`; rollout verified by `BAS-08` | Validation fixture, canonical managed corpus, and rename policy |
| 9 | `ARC-02` | Shared contracts | complete | `ARC-01` | Graph-only node identity and full discovery vocabulary accepted in the shared fixture |
| 10 | `ARC-03` | Destination registry | complete | `ARC-02` | Registry parity, unknown-ID fallback, safe-state, and cross-subdomain tests accepted |
| 11 | `ARC-04` | Cross-system actions | complete | `ARC-02`, `ARC-03` | Seven ID-first actions and exhaustive integration accepted without browser-global events |
| 12 | `ARC-05` | Contract validation and migrations | complete | `ARC-02`, `ARC-03`, `ARC-04` | Invalid/current/old/unknown-version fixtures and section-isolated reset accepted |
| 13 | `EXP-01` | Versioned exploration store | complete | `ARC-02`, `ARC-05` | Memory-backed hydration, migration, per-origin isolation, checkpoint, and reset tests |
| 14 | `KG-01` to `KG-04`, `BAS-03`, `AI-01`, `LPS-01` | Remaining structural foundation | complete | Phase 1 contracts | Recursive parity, schemas, graph gate/subgraph, flags, context, and lifecycle fixtures |
| 15 | `QA-01` | Foundation test harness | complete | `BAS-01`, `ARC-02`, Phase 1 checkpoint | One automated foundation flow |
| 16 | `EXP-02` | Depth-controller primitives | complete | `ARC-02`, `ARC-04`, `QA-01` | Atomic controller and controlled React consumer integration |
| 17 | `EXP-03` | One-time First Note | complete | `EXP-01`, `EXP-02`, `QA-01` | First/return/reset/audio-denied browser flow |
| 18 | `KG-05` | Bounded graph queries and render adapters | complete | `KG-04`, `ARC-03` | Deterministic ordering, limits, visibility, and adapter tests |
| 19 | `KG-06` | Graph-aware retrieval metadata | complete | `KG-04`, `KG-05` | Context metadata, source descriptor, privacy, and compatibility tests |
| 20 | `AI-02` | Quiet global AI shell | complete | `AI-01`, `BAS-03` | Cross-route lazy shell, failure isolation, and browser flow |
| 21 | `AI-03` | Graph-aware retrieval and sources | complete | `KG-06`, `AI-01`, `AI-02` | Identifier-only context and validated structured sources |
| 22 | `EXP-04` | Non-linear guided tour | complete | `EXP-01`, `EXP-02`, `ARC-03` | One role question, any-order doors, dismiss/resume, no discovery leakage |
| 23 | `EXP-05` | Environmental response system | complete | `EXP-02`, `KG-05` | Ordered interaction, semantic light, and stimulation prototype |
| 24 | `EXP-06` | Meaningful discovery registry | complete | `EXP-01`, `KG-04`, `EXP-04`, `EXP-05` | Three explicit discoveries with no score or tour exposure |
| 25 | Phase 2 aggregate release | complete | All Phase 2 packages | Build, Preview, production-safe deployment, routes, and live AI evidence accepted |
| 26 | `PRJ-01` | Exhibit registry and shell | complete | `EXP-02`, `KG-05`, `LPS-01` | Nine definitions, three lazy manifests, fallback shell, direct-entry tests, and build accepted |
| 27 | `QA-06` | Planning-integrity reconciliation | complete | `BAS-05`, current implementation and deployment evidence | Six structural checks and full repository gate accepted at `1286931` |
| 28 | `PRJ-02` | Equal-candidate flagship spikes | complete | `PRJ-01`, `QA-06` operational handoff | LifeInbox/Sudoku comparison and first-slice decision recorded |
| 29 | `PRJ-03` | Museum Signal/Approach shell | complete | `PRJ-01`, `EXP-05` | Flag-off parity, fallback integration, and overview-to-Approach browser flow |
| 30 | `LPS-06` | Selected flagship state seed | complete | `PRJ-02` selection | One source-reviewed lifecycle and current-state fixture accepted |
| 31 | `AI-04` | Archive cards and selected-destination flow | complete | `AI-03`, `ARC-03`, `PRJ-01` | Invalid cards fail closed and selected live card response passes |
| 32 | `PRJ-04` | First full flagship slice | complete | `PRJ-02`, `PRJ-03`, `LPS-06`, `AI-04` | Handle/Enter/Understand journey and minimum subdomain handoff accepted |
| 33 | `QA-02` | First vertical-slice quality gate | reopened | Functional, local, build, and public gates pass for the replacement | Mark acceptance without discarding valid evidence |
| 34 | `ART-01` | Direction and first keyframe selection | implemented | Observatory direction, studies, coverage, and keyframes exist | Mark reviews the selected/reassigned route result |
| 35 | `ART-02` | Aesthetic runtime foundation | complete | `ART-01` selected packets | CSS/SVG material, depth, calm, fallback, and capture roles pass build |
| 36 | `ART-03` | Museum and LifeInbox remediation | implemented | Phenomenon ecology and receiving-vessel materials pass local and public gates | Mark review |
| 37 | `ART-04` | Project and archive dialect packets | implemented | Nacre, diagram-organism, and historical landmarks are live | Mark review |
| 38 | `ART-05` | Supporting-route translation | implemented | Home, About, AI, subdomains, and reading are live | Mark review |
| 39 | `ART-06` | Whole-portfolio maturation | implemented | Registry, optimized derivatives, reduced motion, build, browser, and public matrix pass | Mark acceptance |
| 40 | `LPS-02`, `LPS-03` | Portfolio lifecycle and state corpus | complete | Lifecycle schema and delegated Phase 4 implementation | Nine records, correction paths, and graph relationships validate |
| 41 | `PRJ-05` | Dreamlife experience | complete | Flagship depth framework and reviewed state | Future prism, reaction, experiment, loop, and evidence pass |
| 42 | `PRJ-06` | Sudoku Together experience | complete | Flagship depth framework and reviewed state | Valid board, synthetic participant, and architecture pass |
| 43 | `PRJ-07` | Historical project depth | complete | Lifecycle set and archive dialect | Every smaller project has truthful complete/archive depth |
| 44 | `PRJ-08` | Canonical project routes | complete | Destination registry and museum framework | Nine static routes, metadata, refresh, compatibility, and handoffs pass |
| 45 | `AI-05` | Global AI migration | complete | Global archive and canonical routes | Primary links and legacy prompt-preserving redirect pass |
| 46 | `ART-07` | Dynamic scene contracts and Museum proof | implemented | Packet, seven layers, reducer, causal response, graph evidence, fallback, tests/build, and Production pass | Longer performance/context-loss observation and Mark review |
| 47 | `ART-08` | LifeInbox dynamic material transformation | implemented | Eight layers, deterministic capture/settlement/boundary/return response, fallback, tests/build, and Production pass | Sustained performance observation and Mark review |
| 48 | `ART-09` | Remaining flagship dynamic compositions | implemented | Distinct Dreamlife/Sudoku scenes, truthful board reducer, tests/build, and both public domains pass | Sustained performance observation and Mark review |
| 49 | `ART-10` | Supporting-route dynamic compositions | implemented | Home, About, AI, and reading use distinct causal layers; tests/build and public supporting routes pass | Mark review |
| 50 | `ART-11` | Dynamic scene maturation | implemented | Typed eight-route matrix, lifecycle corrections, 188 tests, build, and bounded route review pass | Sustained performance/context-loss observation, Production, and Mark review |
| 51 | `ART-12` | Ambient contract, decomposition, and Museum proof | in-progress | `ART-12A/B` complete; `ART-12C` briefs are review-ready and no production assets exist | Mark accepts or revises the briefs; then `12D-H` pass in order, with compositor selection waiting on `12E` asset approval |
| 52 | `ART-13` | Flagship ambient worlds | pending | `ART-12H` Museum gate accepted | LifeInbox, then Dreamlife, then Sudoku pass route-local mapping, asset, compositor, idle-life, interaction, Production, and Mark gates |
| 53 | `ABT-01` | Reviewed About consequences | pending | May prepare as content-only work during late `ART-13`; must finish before About `ART-14` integration | Five events and bounded reviewed consequences are ready for semantic ambient/inspection use |
| 54 | `ART-14` | Supporting ambient worlds | pending | `ART-13` accepted and `ABT-01` ready for About | Home, About, AI, and reading pass separate mapping-to-release pipelines and route-distinction gates |
| 55 | `QA-04` | Stimulation and capability QA | pending | Representative `ART-12` through `ART-14` checkpoints exist | Sound-off, reduced-motion, capability-tier, target-device, and fully animated frame behavior pass |
| 56 | `ART-15` | Pervasive motion maturation | pending | `ART-12` through `ART-14` and `QA-04` pass | No unexplained dominant dead zones; performance, capability, Production, and Mark review pass |
| 57 | `ABT-02` through `ABT-04` | About depth continuation | pending | `ABT-01`, ambient supporting-route baseline, and Phase 5 gate | Event inspection, one memory-room decision, and meaningful About discoveries pass |
| 58 | `LPS-04`, `LPS-05`, `EXP-07`, `QA-03` | Living operations | pending | Phase 5 continuation is stable | Versioned state, editorial precedence, and returning-visitor disturbances pass |

The complete exploration shell and first LifeInbox slice are live in Production under the executed 2026-07-18 promotion decision, with independent shell, museum, and selected-experience rollback controls.

## Now And Next

The operational source is `documentation/implementation-work/README.md`.

| Focus | Work item | State | Package | Last known-good point | Next exact action | Last update |
| --- | --- | --- | --- | --- | --- | --- |
| Now | `WI-ART-12-01` | in-progress | `ART-12` | Live `ART-12A` regression baseline and complete `ART-12B` atlas/ledger; `ART-12C` briefs are review-ready | Mark reviews the bounded brief set; after acceptance, begin only `ART-12D` representative assets | 2026-07-20 |
| Next | not created | planned | `ART-13` | Waits on accepted `ART-12H` Museum gate | Create the LifeInbox work item only after Museum acceptance | 2026-07-20 |
| Later | not created | planned | `ART-14` | Waits on `ART-13` and reviewed `ABT-01` content | Create the Home work item when dependencies pass | 2026-07-20 |

Limit active implementation using the WIP rules in `17-Work-Items-And-Resume-Protocol.md`.

## Awaiting Review

| Work item | Review question | Reviewer | Evidence/preview | Waiting since | Next action |
| --- | --- | --- | --- | --- | --- |
| `WI-ART-12-01` | Does the west/lower ecology crop and `AB-MUS-01` through `AB-MUS-11` express the right first material proof without broadening into a full-scene rebuild? | Mark | `2026-07-20-Museum-Ambient-Asset-Briefs.md` plus linked baseline/atlas | 2026-07-20 | Accept or revise briefs before any `ART-12D` production |

## Blocked Or Paused

No work item is blocked. Earlier aesthetic work items are intentionally paused because their implemented foundations are preserved while final route-level creative acceptance moves into `ART-12` through `ART-15`.

| Work item | State | Reason | Restart condition | Last known-good point | Last update |
| --- | --- | --- | --- | --- | --- |
| `WI-ART-01-02`, `WI-ART-03-01` through `WI-ART-06-01` | paused | Static keyframes, packets, and production foundations remain valid; standalone review is superseded | Resume only from a named packet, silhouette, or coherence mismatch found by an active ambient route | Production `fce50af` plus retained packet/evidence records | 2026-07-20 |
| `WI-ART-07-01` through `WI-ART-11-01` | paused | Interactive dynamic foundations remain valid; ambient completeness is separate work | Resume only from a named interaction, state, lifecycle, or renderer-policy regression found by `ART-12` through `ART-15` | Production `fce50af`; 48 files/193 tests and 35-page build | 2026-07-20 |

## Partial Implementation Watchlist

No Phase 2 or Phase 3 functional package is partial. Phase 4's functional and interaction work remains live. Ambient-world completeness is explicitly new work rather than hidden inside earlier candidate evidence.

| Capability | Work item | What works | Named gaps | Safe exposure | Next exact action | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| `CAP-ART-002/004/005/006` | paused `WI-ART-01-02`, `03-01` through `06-01` | Keyframes, art packets, route dialects, registry, optimized assets, calm paths, and public compositions exist | Their final route-level creative criterion is superseded by pervasive ambient acceptance | Preserve source packets and Production `fce50af`; reopen only a named mismatch | No standalone action; active route packets consume these inputs | Candidate packet evidence remains retained |
| `CAP-ART-007` through `012` | paused `WI-ART-07-01` through `11-01` | Route-owned interaction, semantic drivers, fallback, lifecycle policy, one-viewport geometry, tests/build, and Production `fce50af` exist | Dominant regions remain too static during normal idle; final ambient review is not satisfied | Preserve all interaction/state behavior and use `fce50af` as rollback | Feed these contracts into `ART-12A/B`; reopen only a named regression | `EV-ART-11-02` accepted rollout plus retained candidate/failed review evidence |
| `CAP-ART-013/014` | `WI-ART-12-01` | `12A` measured baseline and `12B` complete region/motion mapping pass; `12C` eleven-brief set is review-ready | Mark review, `12D/E` asset production/review, `12F` compositor, `12G/H` integration/release | Preserve Production `fce50af`; do not produce assets until briefs are accepted | Review the briefs, then produce only the representative crop in `ART-12D` | No `V-33` implementation evidence yet |
| `CAP-ART-015/016` | no work items yet | Scope and dependency order are documented | All route-local implementation, capability QA, and final maturation remain | No speculative asset production | Create each work item only when its preceding route/package gate passes | No implementation evidence yet |

This section is intentionally selective. The capability ledger remains the complete granular source.

## Gates And Decisions

| Gate | Affects | State | Needed next |
| --- | --- | --- | --- |
| Runtime and framework compatibility | Baseline and future deployments | resolved | No action; `BAS-06` and `BAS-07` are accepted |
| Firestore service-account data access | `BAS-08`, `ARC-01` | resolved | `Cloud Datastore User` verified; index and canonical corpus ready |
| Information architecture and routing | `ARC-02`, `ARC-03`, `EXP-*`, `AI-*`, `PRJ-*` | resolved | Multi-route/one-world model, route classes, subdomain roles, depth/history, and state ownership approved |
| Shared graph/discovery vocabulary | `ARC-02`, `ARC-03` | resolved | Accepted graph identities, discovery vocabulary, destination registry, and resolver are available to `ARC-04` |
| Typed cross-system actions | `ARC-04`, `ARC-05` | resolved | Seven ID-first action semantics and exhaustive handling are accepted |
| Runtime trust and state compatibility | `ARC-05`, `EXP-01` | resolved | Structured action validation and current/v0/corrupt/unknown state behavior are accepted for store adoption |
| Dormant exploration-store adoption | `EXP-01` | resolved | Accepted by six memory-backed persistence fixtures; first UI consumer remains in `EXP-02` |
| Phase 2 dependency alignment | `AI-03`, `KG-06`, `EXP-07`, `LPS-04` | resolved | `KG-06` now precedes `AI-03`; final disturbances move with `LPS-04` to Phase 6 |
| Project lifecycle classification | `LPS-02` and living state | resolved | Nine records are implemented with explicit correction paths |
| Portfolio aesthetic direction | `ART-01` through `ART-06`, renewed `QA-02`, Phase 4+ styling | resolved | Impossible Observatory selected; art-packet selection is active and downstream gates are explicitly sequenced |
| Dynamic scene architecture | `ART-07` through `ART-15`, `V-32`, `V-33` | resolved at general level | Route-owned layered scenes, bounded shared drivers/lifecycle, pervasive ambient participation, decomposition-first asset production, one coordinated route clock, and Museum-first sequence are approved; exact route techniques remain intentionally local |
| First flagship selection | `PRJ-04` | resolved | LifeInbox selected; Sudoku spike retained for `PRJ-06` |
| Memory-room continuation | About expansion | waits on prototype | Keep, revise, or remove after one bounded room |
| Skill evidence presentation | Experimental | waits on prototype | Test whether evidence improves understanding without becoming a generic skill tree |
| Studio scope | Studio | feedback-gated | Wait for Mark's offerings, audience, readiness, and transaction feedback |
| Musical identity | Later experience | collaboration-gated | Plan only integration hooks until close taste collaboration begins |

## Risks To Watch

| Risk | Early indicator | Mitigation | Owner package |
| --- | --- | --- | --- |
| Implementation appears more finished than visitor readiness | Code is present while content, QA, or rollout remains unfinished | Show named dimension states, gaps, and gates | `QA-06` |
| Broad packages stay partial indefinitely | No coherent checkpoint or evidence for 14 days | Split into capability-sized increments or pause explicitly | Owning package |
| Graph, AI, and navigation IDs diverge | Local string formats or unresolved destinations appear | Enforce `ARC-01` through `ARC-05` before dependent UI | `ARC-*` |
| Several flagship demos start before one finishes | Multiple project branches without `O-03` evidence | Stop expansion and complete the selected first slice | `PRJ-04` |
| Creative ambition outpaces loading and fallbacks | Main path depends on all heavy assets and services | Preserve staged loading, flags, posters, and error boundaries | `QA-02`, `QA-04` |
| A shared visual system erases project identity | New surfaces inherit the same silhouette, panel, or transition | Share semantic roles only after two accepted scenes; keep composition in owning packets | `ART-02`, `ART-04`, `ART-06` |
| Dynamic ambition becomes generic spectacle or a performance trap | The same shader appears everywhere, motion lacks a named cause, or multiple loops run while hidden | Require route packets, causal driver matrices, one dominant scheduler, still/failure frames, capability tiers, and route-swap review | `ART-07` through `ART-15` |
| Dominant artwork remains a static poster beneath animated decoration | Idle recordings show unchanged major regions while only particles, labels, or cursor effects move | Require source-region atlases, motion coverage ledgers, decomposed plates/maps, no-input diagnostics, and direct or indirect temporal participation for every dominant region | `ART-12` through `ART-15` |
| Resume context becomes stale | Active work item unchanged for 14 days | Mark stale, verify known-good point, and refresh next exact action | `QA-06` |
| Unsupported runtime or framework reaches deployment cutoff | Vercel continues selecting Node.js 20 or bridge work stalls | Prioritize `BAS-06`; preserve `BAS-07` as a separate follow-on with rollback to the bridge | `BAS-06`, `BAS-07` |
| Replacement datastore accidentally requires billing or exposes client access | Billing/trial prompt appears or rules permit public reads | Stop; retain Spark, deny-all rules, server-only credentials, and current production rollback | `BAS-08` |

## Evidence Summary

| Evidence status | Count | Notes |
| --- | ---: | --- |
| Accepted | 95 | Functional evidence, selected direction, and Phase 4 production rollout are valid; final creative acceptance remains open |
| Candidate | 11 | Retained packet and interaction evidence supports the known-good foundation; no candidate is being treated as final `V-33` ambient acceptance |
| Superseded | 0 | Preserve historical evidence when contracts or behavior change |
| Failed | 7 | Retained infrastructure and creative failures now include the explicit `ART-11` production visual-acceptance rejection |

The evidence registry lives in `documentation/implementation-evidence/README.md`.

## Recently Changed

| Date | Change | Affected controls | Result |
| --- | --- | --- | --- |
| 2026-07-20 | Reconciled the master ambient sequence and tracking state | Vision, roadmap, `ART-12` through `15`, `WI-ART-01-02` through `12-01`, dashboard | One actionable work item; generation begins only after mapping/briefing; old standalone reviews are paused with explicit restart conditions |
| 2026-07-19 | Promoted the complete Phase 4 dynamic scene sequence | `ART-07` through `ART-11`, `CAP-ART-008/011/012`, `EV-ART-11-02` | Commit `9c3a743`, Vercel `dpl_3yZjFfqRdZQe5S1PnrHXSCRVq8yv`, and six public surfaces pass; creative review remains |
| 2026-07-19 | Completed the local dynamic scene maturation pass | `ART-11`, `CAP-ART-008/011/012`, `WI-ART-11-01`, `EV-ART-11-01` | Eight-route policy, Home/About lifecycle corrections, 188 tests, build, and bounded route review pass; rollout and acceptance remain |
| 2026-07-19 | Implemented supporting-route dynamic compositions | `ART-10`, `CAP-ART-008/011/012`, `WI-ART-10-01`, `EV-ART-10-01` | Home threshold, About chronology, AI context/activity, and passive reading layers pass 184 tests, build, and browser checks |
| 2026-07-19 | Implemented distinct Dreamlife and Sudoku dynamic compositions | `ART-09`, `CAP-ART-008/011/012`, `WI-ART-09-01`, `EV-ART-09-01` | Route-owned refraction/loop and presence/version scenes, truthful ownership correction, 180 tests, build, and browser flows pass |
| 2026-07-19 | Implemented and locally verified the LifeInbox dynamic material transformation | `ART-08`, `CAP-ART-008/010/012`, `WI-ART-08-01`, `EV-ART-08-01` | Eight-layer state-driven scene, calm fallback, 175 tests, build, and complete browser flow pass; rollout and acceptance remain |
| 2026-07-19 | Implemented and locally verified the first dynamic Museum scene | `ART-07`, `CAP-ART-007/008/009/012`, `WI-ART-07-01`, `EV-ART-07-01` | Seven-layer CSS/SVG/Canvas scene, graph-backed evidence, calm/fallback behavior, 171 tests, build, and browser review pass; deployment and acceptance remain |
| 2026-07-19 | Promoted layered dynamic scene composition as the next aesthetic workstream | `V-32`, Plan `20`, `ART-07` through `ART-11`, `CAP-ART-007` through `012`, `WI-ART-07-01` | Static art remains valid as checksum/poster/fallback; Museum-first route-owned dynamics are ready without preselecting a universal renderer |
| 2026-07-18 | Promoted the complete reference-rich visual sequence | `ART-01`, `ART-03` through `ART-06`, renewed `QA-02` | `806841d` is live; main Museum and all three project domains return `200` with their assigned art markers |
| 2026-07-18 | Implemented the full reference-rich visual replacement sequence locally | `ART-01`, `ART-03` through `ART-06`, `CAP-ART-002/004/005/006`, renewed `QA-02` | Original assets, selected/reassigned keyframes, typed registry, major-route translations, tests/build, and local browser matrix are candidate-ready |
| 2026-07-18 | Reopened visual production after reference-coverage review | `ART-01`, `ART-03`, `ART-04`, renewed `QA-02`, `CAP-ART-002/004/005` | All nine references now have route ownership; material studies and real keyframes precede replacement implementation |
| 2026-07-18 | Integrated art direction across the implementation program | `ART-01` through `ART-06`, `CAP-ART-001` through `006`, `V-31`, route and quality plans | Six-layer model, art-packet contract, route coverage, package gates, and partial-work checkpoints prevent aesthetics from becoming a detached or vague polish pass |
| 2026-07-18 | Selected Impossible Observatory of Living Instruments | `ART-01`, `CAP-ART-001`, `V-31`, renewed `QA-02` | Nine references translated into accepted material, color, motion, project, and anti-copy constraints; first keyframe briefs ready |
| 2026-07-18 | Promoted Phase 3 to Production | `QA-05`, `CAP-QA-005`, `O-01` through `O-03` | `dpl_61cYUeR8aYVkx6gYYjEbT74adrZc` Ready; public museum, subdomains, AI card, Handle route, and rollback pass |
| 2026-07-18 | Completed and accepted Phase 3 first flagship | `AI-04`, `PRJ-04`, `QA-02`, `O-02`, `O-03` | Validated archive door, LifeInbox full depth, 157-test/build gate, lazy chunk, and corrected live Preview pass |
| 2026-07-17 | Reconciled post-Phase-2 implementation truth and strengthened Phase 3 sequencing | `QA-06`, package registry, capability ledger, evidence registry, decisions, architecture, roadmap | Missing evidence and stale status/dependency claims resolved; six integrity checks and the 140-test aggregate gate pass at `1286931` |
| 2026-07-17 | Began Phase 3 and completed shared exhibit foundation | `PRJ-01`, `CAP-PRJ-001`, `CAP-PRJ-002`, `O-03`, `WI-PRJ-02-01` | Nine canonical exhibits, three lazy manifests, stable anchors, semantic fallback, 134 tests, and build pass; equal candidate spikes are ready |
| 2026-07-17 | Completed Phase 2 release | `QA-01`, `O-01`, `O-02`, `WI-QA-01-02` | 123 tests/build, protected Preview, live structured sources, production-safe deployment, and all public routes pass |
| 2026-07-17 | Completed meaningful hidden discoveries | `EXP-06`, `CAP-EXP-012`, `CAP-EXP-013`, `O-01`, `WI-QA-01-02` | Three explicit discoveries persist without tour, score, count, or page-load completion; aggregate release is active |
| 2026-07-17 | Completed environmental response | `EXP-05`, `CAP-EXP-009` to `CAP-EXP-011`, `O-01` | Ordered interaction, graph light, text explanation, and continuous stimulation pass |
| 2026-07-16 | Completed non-linear guided tour | `EXP-04`, `CAP-EXP-007`, `CAP-EXP-008`, `O-01` | One role question, three any-order doors, dismiss/resume, persistence, and discovery exclusion pass |
| 2026-07-16 | Completed contextual global AI | `AI-02`, `AI-03`, `CAP-AI-003` to `CAP-AI-005`, `O-02` | Quiet lazy shell, validated ID context, public retrieval, and native source links pass |
| 2026-07-16 | Completed graph-aware retrieval metadata | `KG-06`, `CAP-KG-007`, `O-02`, `WI-AI-02-01` | 93 tests/build and 42-document Firestore backfill/readback pass; quiet global shell is ready |
| 2026-07-16 | Completed bounded graph queries and render adapters | `KG-05`, `CAP-KG-005`, `CAP-KG-006`, `O-01`, `WI-KG-06-01` | 88 tests and build accept visibility, limits, cycles, destinations, AI neighborhoods, and semantic edges; retrieval metadata is ready |

Retain only the most recent ten meaningful entries here. Durable history belongs in Git and package evidence files.

## Reconciliation Checklist

Run this checklist at least at package start, merge, preview, production promotion, and milestone review:

- Capability dimension states match the latest inspected implementation.
- Every `working` state has named gaps and a work item.
- Every `accepted` state has evidence.
- Package status agrees with owned capability states and exit evidence.
- Dashboard package counts match the work-package registry.
- Outcome stages name their last checkpoint and next proof point.
- New scope has been added before attaching work or claiming completion.
- Blockers name an owner and restart condition.
- Active work items have a current known-good point and next exact action.
- `Now`, `Next`, review, blocked, and paused entries match the work registry.
- Decision and feedback gates remain respected.
- Reconciled date and implementation baseline commit are current once `BAS-05` begins.

## Next Dashboard Update

The next update occurs after the Museum keyframe has a named layer inventory and first driver matrix, or if a production regression changes the known-good baseline.
