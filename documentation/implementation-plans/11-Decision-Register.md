# Decision Register

Last updated: 2026-07-15

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
| Semantic lighting | Confirmed for prototype and likely use | Start with a few reviewed relationships. |
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
| 2026-07-15 | Replace the unavailable Supabase retrieval store with server-only Firestore native vector search on the Spark plan | Confirmed and in implementation | `BAS-08` owns IAM, index, canonical re-indexing, Vercel cutover, and no-billing guardrails; current MDX remains authoritative | [Firebase Retrieval Migration Decision](2026-07-15-Firebase-Retrieval-Migration-Decision.md) |
| 2026-07-14 | Use canonical namespaced content IDs with explicit one-way aliases for genuine renames | Confirmed and in implementation | Projects, timeline events, misc knowledge, and posts receive stable identities independent from labels, filenames, and routes | [Stable Content ID Decision](../implementation-baselines/2026-07-14-Stable-Content-ID-Decision.md) |
| 2026-07-14 | Use a Node.js 24 security bridge, then a separate Next.js 16 modernization | Confirmed | `BAS-06` handles urgent runtime/security rollout; `BAS-07` handles coordinated framework, React, 3D, route, lint, and middleware migration | [Runtime Maintenance Decision](../implementation-baselines/2026-07-14-Runtime-Maintenance-Decision.md) |

## Prototype Candidates

| Idea | Question prototype must answer | Maximum initial scope |
| --- | --- | --- |
| Evidence-backed skill tree | Does it clarify capability and evidence better than project filters? | Static or lightly interactive prototype using 8 to 12 nodes. |
| Memory room | Does one object deepen a timeline event without slowing chronology? | One event, one object, one return transition. |
| Discovery physics | Which physical rules feel intuitive? | Three rules in one controlled scene. |
| Semantic lighting | Can relationships be noticed and understood without visual noise? | Three source nodes and six reviewed links. |
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

1. Choose the state owner and versioning policy for discovery persistence.
2. Extend the confirmed content-ID policy to destination and experience registries after `ARC-01`.
3. Decide whether content validation runs during build, tests, or both.
4. Choose the global AI shell's inactive visual form.
5. Finalize quick-tour role labels.
6. Choose the first flagship vertical slice after feasibility spikes.
7. Define the minimum semantic-lighting prototype.
8. Select the first About event for a memory-room prototype.
9. Decide whether the skill experiment is called a skill tree or evidence map after seeing it.

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
