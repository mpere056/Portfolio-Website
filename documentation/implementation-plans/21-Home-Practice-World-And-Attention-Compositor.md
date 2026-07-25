# Home Practice World And Attention Compositor Plan

Last updated: 2026-07-24

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `HOME-WORLD` |
| Status | Active; full-world proximity compositor candidate in review |
| Upstream | [Homepage decision](2026-07-24-Homepage-Practice-World-And-Routing-Decision.md), [Architecture](00-System-Architecture-And-Interfaces.md), [Experience](02-Experience-Foundation.md), [Dynamic scenes](20-Dynamic-Scene-Composition-And-Layered-Materials.md) |
| Downstream | Home, About entry, project navigation, tour, AI cards, returning state, destination migration |
| Primary packages | `ARC-06`, `KG-07`, `EXP-08`, `ART-16`, `PRJ-09`, `QA-07` |
| Active work item | [WI-ART-16-01](../implementation-work/active/WI-ART-16-01.md) |

## Objective

Create one desktop Home world in which About and four project practices remain spatially present, one practice can become dominant on a continuous attention spectrum, and project depth emerges from the selected practice without a separate primary Projects lobby.

The implementation must preserve the accepted homepage piano identity and reuse the visual learning from the coral, observatory, and archive proofs without mounting those complete proof pages together.

## Fixed Territory Map

| Territory ID | Position | Anchor | Full dialect source | Durable destination |
| --- | --- | --- | --- | --- |
| `territory:about` | top | Memory portal/illuminated opening | New bounded proof after neutral shell works | `destination:about` |
| `territory:music` | center | Existing particle piano and portrait platform | `/projects/music-proof` and shared `HeroCube` | `destination:practice-music` |
| `territory:play` | left | Living coral ecology | `/projects/ambient-proof` | `destination:practice-play` |
| `territory:ai-futures` | right | East observatory | `/projects/observatory-proof` | `destination:practice-ai-futures` |
| `territory:life-systems` | bottom | Living archive/book | `/projects/archive-core-proof` | `destination:practice-life-systems` |

## State Model

The pure state layer owns semantic attention, not rendered pixels.

```ts
type TerritoryId =
  | 'about'
  | 'music'
  | 'play'
  | 'ai-futures'
  | 'life-systems';

type HomeWorldMode = 'neutral' | 'attending' | 'selected' | 'entered';

interface TerritoryAttention {
  id: TerritoryId;
  targetWeight: number;
  settledWeight: number;
  proximity: number;
  focused: boolean;
  selected: boolean;
}

interface HomeWorldState {
  mode: HomeWorldMode;
  dominantId: TerritoryId | null;
  previousDominantId: TerritoryId | null;
  territories: Record<TerritoryId, TerritoryAttention>;
  transitionReason: 'pointer' | 'focus' | 'selection' | 'route' | 'restore' | null;
}
```

Rules:

- Weights are normalized and bounded.
- `neutral` is a deliberate stable state, not the absence of initialized data.
- Dominance changes only after a threshold plus hysteresis.
- Focus and explicit selection outrank pointer proximity.
- Selection persists semantically; raw weights and animation phases do not.
- About participates in the same attention system but resolves to `/about`, not a practice collection.
- Reduced motion uses immediate or short crossfades while preserving the same semantic state.

## Composition Contract

Each territory provides:

| Output | Responsibility |
| --- | --- |
| `anchor` | Lightweight persistent object and semantic hit/focus region |
| `ambient` | Low-cost idle life visible when inactive |
| `field` | Broad atmospheric influence parameterized by settled weight |
| `attended` | Additional local materials and response at dominant weight |
| `selected` | Project reveal or About-entry behavior |
| `stableFrame` | Intentional neutral, attended, and selected checksum |
| `calmFrame` | Lower-stimulation/reduced-motion equivalent |
| `failureFrame` | Semantic and visual fallback |
| `budget` | Asset, renderer, particle, DPR, and lifecycle limits |

The shared compositor owns depth order, masks between fields, weight settlement, lifecycle, and one route clock. Territory dialects own their materials, choreography, and project metaphor.

## Melding Model

Melding uses overlapping fields rather than layout replacement:

- **Music:** notation dust, resonance rings, pressure waves, violet-blue spectral light.
- **Play:** coral tendrils, suspended spores, bioluminescent currents, warm cyan/orange ecology.
- **AI & Possible Futures:** nacre lattice, lenses, orbital diagrams, cyan-gold signals, refractive haze.
- **Life Systems & Tools:** page fibers, paths, turning leaves, miniature architecture light, amber memory matter.
- **About:** memory fragments, timeline traces, apertures, reflected consequences, quiet source light.

The compositor must support:

- Broad territory masks with soft, irregular edges.
- Per-territory color and luminance influence without applying a global color filter.
- Foreground and background participation.
- Cross-field occlusion and refraction where justified.
- Unequal timing and delayed settlement.
- One local attention field so the pointer intensifies nearby matter rather than every territory.

## Runtime Architecture

Target ownership:

```text
HomeWorldShell
  HomeWorldStateProvider       # pure semantic state and history bridge
  TerritoryAnchorLayer        # all five lightweight anchors and hit/focus regions
  AtmosphereCompositor         # shared masks, depth, settlement, and dominant field
  TerritoryRuntimeBoundary    # mounts at most the approved heavy dialects
  PracticeProjectLayer        # selected-practice project signals
  HomeWorldUtilities          # AI, tour, sound, recovery, orientation
```

Runtime guardrails:

- Do not mount four complete proof canvases.
- Prefer one dominant continuous GPU surface plus semantic DOM/SVG.
- Reuse the existing `HeroCube` piano renderer rather than recreating its identity.
- Keep inactive anchor animation cheap and independently phased.
- Preload only the likely next field after sustained attention.
- Abort or dispose abandoned lazy loads.
- Pause when hidden and cap DPR/particle density by capability tier.
- Keep navigation outside decorative canvas hit testing.

## Project Taxonomy And Graph Work

Add a controlled practice vocabulary:

```ts
type PracticeId =
  | 'music-performance'
  | 'ai-possible-futures'
  | 'life-systems-tools'
  | 'play-community';
```

Project content gains one required `primaryPracticeId`. Optional reviewed relationships represent secondary relevance; they do not duplicate a project across navigation groups.

Implementation sequence:

1. Add practice nodes and validated IDs.
2. Classify every current project.
3. Add bounded `projectsForPractice()` and `practiceForProject()` queries.
4. Add practice destinations and fallbacks.
5. Expose only public reviewed cross-practice links to semantic lighting and AI.
6. Add content validation requiring one current practice per project.

## Route And Destination Migration

Migration is additive until the final gate:

1. Add practice IDs and destination entries while `/projects` remains canonical.
2. Add `/work/[practice]` direct entry behind a feature flag or dormant resolver status.
3. Build neutral and selected Home states without changing existing project links.
4. Migrate tour doors, AI cards, project returns, and safe-state restoration to practice destinations.
5. Verify `/projects/[slug]` and flagship subdomain returns land in the correct practice.
6. Promote Home as the canonical work index.
7. Change `destination:projects` to a compatibility alias.
8. Redirect `/projects` only after route, metadata, Back, refresh, and production checks pass.

Rollback must restore the current `/projects` route without changing stable project IDs.

## Ordered Delivery

| Stage | Package owner | Deliverable | Gate |
| --- | --- | --- | --- |
| `A` Reconcile | `ART-16` | Canonical decision, plan, work item, and superseded Museum steps recorded | Planning integrity and Mark direction agree |
| `B` Taxonomy | `KG-07` | Practice nodes, project classification, graph queries, validators | Accepted: every project has one validated primary practice |
| `C` Contracts | `ARC-06`, `EXP-08` | Territory IDs, pure attention reducer, hysteresis, route/restore policy | Accepted foundation: deterministic tests cover neutral, locality, focus, selection, calm, restore, Back, and reduced motion; browser adoption remains Stage `H` |
| `D` Neutral shell | `ART-16` | Implemented private candidate: five fixed anchors, shared Home piano, semantic selection/return, no route migration | In review: neutral state remains one screen and mounts no expensive proof runtime |
| `E` Transition proof | `ART-16` | Implemented candidate: continuous proximity expands the complete Play world; Music remains the shared Home world | In review: fixed anchors, broad atmosphere, no panel resizing, click optional |
| `F` Territory integration | `ART-16` | `F1/F2` implemented candidate: complete AI/observatory and Life Systems/archive worlds; `F3` About remains not started | Each territory passes idle, local-attention, calm, lifecycle, and budget checks before acceptance |
| `G` Project reveal | `PRJ-09` | Selected-practice project instruments and individual project handoff | All current projects reachable without a card-grid fallback becoming primary |
| `H` Navigation migration | `ARC-06`, `EXP-08` | Tour, AI, return, restore, metadata, and `/projects` compatibility migration | Deep link, Back, refresh, and rollback matrix passes |
| `I` Release | `QA-07` | Preview, capability, performance, production, and Mark acceptance | Home promoted; `/projects` redirect only if separately approved by gate |

No production transparent asset pack for the About portal is generated before Stage `D` establishes its real size, crop, depth role, and neighboring fields.

## Testing

### Unit

- Project-to-practice validation and stable IDs.
- Attention normalization, dominance threshold, hysteresis, and settlement.
- Pointer locality and focus/selection precedence.
- Restore and direct-route mapping.
- Reduced-motion and lower-stimulation policy.
- Runtime mount/unmount decisions and delayed disposal.

### Integration

- Neutral Home exposes five semantic destinations.
- Pointer/focus affects the intended territory only.
- Explicit selection reveals the correct project set.
- Direct `/work/[practice]` restores an authored selected state.
- Project, subdomain, AI card, and tour returns restore the correct practice.
- Browser Back closes project depth and practice selection predictably.
- Legacy `/projects` remains usable until its migration gate.

### Visual And Runtime

- Exact one-viewport desktop composition at reviewed widths and heights.
- Neutral, Music-attended, Play-attended, AI-attended, Life-attended, and About-attended stable captures.
- Recorded transitions prove atmospheric spread rather than rectangle scaling.
- Idle footage proves independent temporal behavior.
- Local hover capture proves unrelated territories do not surge together.
- Renderer count, frame pacing, DPR, memory, hidden-tab pause, and context-loss fallback.
- Sound-off, lower stimulation, reduced motion, keyboard, and direct-load review.

## Tracking Without Percentages

Track each stage with:

- State: `not-started`, `ready`, `in-progress`, `in-review`, `accepted`, `blocked`, or `superseded`.
- Known-good point: commit, route, fixture, or approved artifact.
- Accepted evidence: tests, captures, deployment, and Mark review listed separately.
- Named gaps: observable missing behavior, never “polish remaining.”
- Next exact action: one bounded action that another session can execute.

Territory integration has one row per territory. A territory cannot be called complete because its anchor exists; anchor, ambient, field, attention, selected state, calm/failure, performance, and review are separate named checkpoints.

## Current Resume Point

- Known-good implementation: `ae8c6a2` on `main`; current public Home and project routes remain unchanged.
- Accepted proof inputs: coral west ecology revision 4, east observatory selected tuning, archive-core page cycle, and shared-home music proof with the piano silhouette at `40%`.
- Architecture decision: approved five-territory Home with About above, Music center, Play left, AI right, and Life Systems below.
- Accepted non-visual foundation: four practices, nine project classifications, bounded graph queries, and a pure five-territory attention reducer pass the aggregate suite and production build.
- Current candidate: `/home-world-proof` keeps five fixed semantic anchors but uses them only as spatial affordances. Global cursor proximity continuously weights all territories; the complete accepted Play, AI/observatory, and Life Systems/archive runtimes expand through viewport masks and atmosphere instead of enlarging proxy icons. Music retains the shared `HeroCube`; click only locks a selection.
- Runtime boundary: only the dominant expensive proof runtime remains active, one outgoing runtime may remain briefly for a real crossfade, and invisible canvases pause. The neutral state mounts no expensive proof runtime.
- Revision history: Mark rejected both the generic-glyph candidate and the proof-derived landmark-only candidate at `51fb4ec`. Implementation `ae8c6a2` replaces the latter with full-world composition and fades duplicate landmark art as its complete world arrives.
- Verification: 56 files / 233 tests, TypeScript, focused lint, and the 40-page production build pass. Local browser review confirmed neutral no-runtime behavior, continuous intermediate proximity, and full Play-world takeover without clicking.
- Review artifact: `https://www.marknperera.ca/home-world-proof` in Vercel Production `dpl_CLa1FpfccCtbQcNMKMYHHYahxQib`.
- Current gap: Mark has not accepted full-world proximity, cross-world melding, or territory balance. About production treatment, React/history adoption, project reveal, and route migration remain absent.
- Next exact action: collect a short visual review of takeover range, overlap, and fixed-anchor composition; then revise only named issues before starting the About portal.
