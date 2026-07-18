# Decision Register

Last updated: 2026-07-17

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `DEC` |
| Status | Active planning control |
| Upstream | Mark's feedback, prototypes, implementation discoveries |
| Downstream | [Architecture](00-System-Architecture-And-Interfaces.md), [Roadmap](01-Program-Roadmap.md), [Traceability](12-Traceability-Matrix.md), workstream scope |
| Primary output | One authoritative record of confirmed, gated, later, backlog, and rejected decisions |

## Purpose

Track what is confirmed, what requires a prototype, what needs Mark's feedback, what belongs later, what remains backlog-only, and what is explicitly rejected.

## Confirmed Direction

| Decision | Status | Implementation consequence |
| --- | --- | --- |
| One cohesive experience | Confirmed | Do not create Story and Proof modes. |
| Exploration as primary interaction | Confirmed | Build reusable depth and discovery primitives. |
| Five-stage depth grammar | Confirmed | Use Signal, Approach, Handle, Enter, Understand across core exhibits. |
| One-time First Note | Confirmed | Persist completion locally and skip on later visits. |
| Persistent discovery | Confirmed | Create a versioned local state model. |
| Non-linear guided quick tour | Confirmed | Recommend multiple destinations; no fixed order or completion checklist. |
| Quiet global AI | Confirmed | Move from route-only chat toward a site-wide contextual shell. |
| AI cards flow into site content | Confirmed | Define stable destination and transition contracts. |
| Expand MDX corpus into relationship graph | Confirmed | Add reviewed nodes, relationships, validation, and query helpers. |
| Discovery physics | Confirmed at a bounded scale | Reuse proximity, handling, and reviewed-light rules without turning them into a universal visual gimmick. |
| Semantic lighting | Confirmed at a bounded, explainable scale | Render only a few reviewed relationships and keep text meaning available; do not create a constellation page. |
| Projects as inspectable systems | Confirmed | Create museum and depth architecture. |
| Experiential project communication | Confirmed | Build focused product slices for flagships. |
| Exploded case studies | Confirmed | Reveal product, system, evidence, and state layers. |
| Sudoku computer participant | Confirmed | Build deterministic minimal session, not ghost replay. |
| Living project state | Confirmed | Add lifecycle and edited state fields. |
| Meaningful easter eggs | Confirmed | Tie discoveries to real artifacts, decisions, and relationships. |
| Progressive stimulation | Confirmed | Start calm; allow richer optional immersion. |
| Desktop and mobile designed independently | Confirmed | Do not force one-to-one interaction parity. |
| New content as disturbance | Confirmed | Create authored update markers and persistent discovery comparison. |

## Implementation Decisions

| Date | Decision | Status | Consequence | Detailed record |
| --- | --- | --- | --- | --- |
| 2026-07-17 | Sequence Phase 3 around equal candidate spikes, feature-flagged museum integration, one selected-project state seed, validated AI cards, one converged slice, and a full quality gate | Confirmed | Portfolio-wide lifecycle review no longer blocks the first slice; selected-project handoff is bounded in `PRJ-04`; generalized route/history work remains `PRJ-08` | [Phase 3 Vertical-Slice Sequencing Decision](2026-07-17-Phase-3-Vertical-Slice-Sequencing-Decision.md) |
| 2026-07-16 | Use a technically multi-route portfolio that behaves as one continuous exploratory world | Confirmed | Durable routes provide loading/share/history boundaries; semantic destinations own depth; flagship subdomains own substantial Enter/Understand states; cross-origin state uses bounded cookie and URL handoff rather than shared local storage | [Information Architecture And Routing Decision](2026-07-16-Information-Architecture-And-Routing-Decision.md) |
| 2026-07-15 | Replace the unavailable Supabase retrieval store with server-only Firestore native vector search on the Spark plan | Confirmed and implemented | `BAS-08` accepted IAM, index, canonical re-indexing, Vercel cutover, and no-billing guardrails; current MDX remains authoritative | [Firebase Retrieval Migration Decision](2026-07-15-Firebase-Retrieval-Migration-Decision.md) |
| 2026-07-14 | Use canonical namespaced content IDs with explicit one-way aliases for genuine renames | Confirmed and implemented for content and reviewed graph-only identities | Projects, timeline events, misc knowledge, and posts retain strict stable identities; `WI-ARC-02-02` adds broader graph references without weakening ingestion | [Stable Content ID Decision](../implementation-baselines/2026-07-14-Stable-Content-ID-Decision.md) |
| 2026-07-14 | Use a Node.js 24 security bridge, then a separate Next.js 16 modernization | Confirmed | `BAS-06` handles urgent runtime/security rollout; `BAS-07` handles coordinated framework, React, 3D, route, lint, and middleware migration | [Runtime Maintenance Decision](../implementation-baselines/2026-07-14-Runtime-Maintenance-Decision.md) |

## Prototype Candidates

| Idea | Question prototype must answer | Maximum initial scope |
| --- | --- | --- |
| Evidence-backed skill tree | Does it clarify capability and evidence better than project filters? | Static or lightly interactive prototype using 8 to 12 nodes. |
| Memory room | Does one object deepen a timeline event without slowing chronology? | One event, one object, one return transition. |
| Ambient visitor presence | Does anonymity feel alive rather than distracting or creepy? | One opt-in/opt-out visual signal with no identity. |
| Site asks for help | Can rare feedback requests feel thoughtful? | One evolving project and one explicit response action. |

Prototype candidates do not become roadmap commitments until reviewed.

## Feedback-Gated

### The Studio

Further planning pauses until Mark clarifies:

- Which offerings should exist first.
- Which are services, lessons, commissions, or products.
- Which are currently ready.
- Preferred positioning and naming.
- Whether payments, bookings, waitlists, or inquiries should be supported initially.
- How music and AI offerings should coexist without feeling unfocused.

See `09-Studio-Feedback-Gate.md`.

## Later, Not Backlog

These are accepted directions, but implementation detail remains intentionally light.

- Independent mobile experience.
- Ambient anonymous multi-visitor presence after core single-user stability.
- Shared state links and later guided shared navigation.
- Expanded musical identity, which is also close-collaboration-gated.

See `10-Later-And-Backlog.md`.

## Backlog Only

These remain recorded without detailed planning.

- Anti-Resume deep layer.

## Deferred And Unresolved

- Full public graph visualization, only if graph-driven interactions prove its value.

## Explicitly Rejected Or Removed

- Story Mode and Proof Mode.
- Required Resonance Engine metaphor.
- Dream Inbox metaphor.
- Reading-heavy polyphonic timeline.
- Repeated `Ask about this` buttons.
- AI accessible only through a separate chat route.
- Fixed linear guided tour.
- Time-availability onboarding question.
- Website-template sales as the Studio's purpose.
- Separate creative Lab duplicating project exhibits.
- Portfolio Album as global structure.
- Literal compass UI.
- Collectible badges, scores, or completion percentages.
- Self-rated skill levels.
- Fake live presence or activity.
- Full text duplicate for every visual explanation.
- Seamless scale changes as a core rule.

## Near-Term Decisions Required

Resolve these in order as implementation approaches them.

1. Choose the first flagship vertical slice after the equal LifeInbox and Sudoku feasibility spikes.
2. Confirm the selected flagship lifecycle and minimum public current/final state for `LPS-06`.
3. Select the first About event for a memory-room prototype when Phase 5 approaches.
4. Decide whether the skill experiment is called a skill tree or evidence map after seeing it.

## Decision Record Template

When a new decision is made, record:

- Date.
- Decision.
- Context.
- Alternatives considered.
- Reason.
- Consequences.
- Documents and code affected.
- Whether the decision is reversible.
