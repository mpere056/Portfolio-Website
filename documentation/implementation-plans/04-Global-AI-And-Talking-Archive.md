# Global AI And Talking Archive Plan

Last updated: 2026-07-16

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `AI` |
| Status | Active |
| Upstream | [Architecture](00-System-Architecture-And-Interfaces.md), [Knowledge Graph](03-Knowledge-Graph-And-Content.md), [Experience](02-Experience-Foundation.md) context |
| Downstream | Home, [Projects](05-Projects-Museum-And-Case-Studies.md), [About](06-About-And-Memory-Depth.md), tour navigation |
| Primary outputs | Global shell, context resolution, sources, archive cards, destination flow |
| Execution packages | `AI-01` through `AI-05` in [Work Packages](13-Execution-Work-Packages.md) |
| Capability tracking | `CAP-AI-*` in [Capability Ledger](15-Capability-Coverage-Ledger.md) |

## Scope

Replace the assumption that AI lives mainly on `/chat` with one quiet, contextual AI presence available throughout the site.

Current status: `AI-01` and `AI-02` are complete through `3dfef6b`. The source-owned context stack is mounted in one root provider; a quiet CSS-only presence and lazy conversation surface work across routes while preserving `/chat`, sound-off navigation, and page state. `AI-03` is active for validated request context and visible trusted sources.

This plan covers:

- Global AI shell.
- Page and object context.
- Archive cards.
- Navigation transitions.
- Expanded archive state.
- Retrieval and source trust.
- Migration from the existing chat page.

## Existing Foundation

- `src/app/chat/page.tsx`
- `src/components/ChatUI.tsx`
- `src/components/ChatOrb.tsx`
- `src/app/api/chat/route.ts`
- `src/lib/retriever.ts`
- `src/app/api/rag/diag/route.ts`
- Vercel AI SDK `useChat`.
- Google Generative AI.
- Firestore native vector retrieval through a server-only adapter.

The previous Supabase retrieval contract is historical. `BAS-08` accepted the free-tier Firestore migration, so later global AI work can depend on the server-only production retrieval contract.

The current UI already provides streaming chat and an animated orb. The next architecture should preserve working retrieval while changing where and how conversation appears.

## Product Behavior

### Dormant

- AI presence is visible but quiet.
- It does not pulse repeatedly or display unsolicited prompts.
- Context changes may cause a very subtle visual response.

### Context Available

- The visitor has selected an object or entered a meaningful area.
- Opening AI starts with that context attached.
- The interface may show one concise context label, such as `LifeInbox reminder flow`.

### Active Conversation

- Conversation appears as an overlay, drawer, spatial panel, or scene layer without destroying the underlying page state.
- The user can collapse it and continue interacting.

### Guiding

- Responses can include destination cards.
- Selecting a card transitions to the corresponding route, exhibit, memory, or experience state.
- The AI does not auto-navigate without a visitor action.

## Context Contract

Create one serializable context type shared by pages and the API.

```ts
interface PortfolioAIContext {
  route: string;
  subdomain?: string;
  destinationId?: string;
  nodeId?: string;
  projectId?: string;
  timelineEventId?: string;
  experienceId?: string;
  depthStage?: 'signal' | 'approach' | 'handle' | 'enter' | 'understand';
  selectedRelationshipId?: string;
  discoveredNodeIds?: string[];
}
```

The client sends only identifiers and non-sensitive public state. The server resolves factual context from the validated graph.

Do not send full local discovery history unless a specific feature requires it.

## Context Ownership

Pages and exhibits publish context through a small API:

```ts
setAIContext(context)
clearAIContext(sourceId)
pushAIContext(context)
popAIContext(sourceId)
```

Use stack or ownership semantics so closing a nested experience restores the parent context correctly.

Suggested files:

- `src/lib/ai/context.ts`
- `src/lib/ai/cards.ts`
- `src/components/ai/PortfolioAIProvider.tsx`
- `src/components/ai/GlobalAIPresence.tsx`
- `src/components/ai/AIConversationSurface.tsx`
- `src/components/ai/ArchiveCard.tsx`

## Archive Card Contract

Cards must be structured data, not links parsed from arbitrary model prose.

```ts
interface ArchiveCard {
  id: string;
  type: 'project' | 'timeline' | 'post' | 'architecture' | 'experience' | 'skill' | 'offering';
  title: string;
  summary: string;
  sourceNodeIds: string[];
  destination: ExperienceDestination;
  visualKey?: string;
}
```

The server may select cards through reviewed tool calls or validated structured output. The client validates every card against known destinations before rendering it.

## Navigation And Transition Contract

Define destinations independently from cards:

```ts
interface ExperienceDestination {
  id: string;
  href: string;
  areaId?: string;
  exhibitId?: string;
  experienceState?: Record<string, string>;
  requestedDepth?: DepthStage;
}
```

Transition steps:

1. Validate destination.
2. Persist the current checkpoint.
3. Collapse or transform the AI surface.
4. Navigate using Next router or subdomain URL.
5. Restore the requested area and safe experience state.
6. Mark the card opened for local continuity.

Cross-subdomain cards need ordinary navigation and cannot assume shared in-memory React state. Encode safe destination state in the URL or local storage keyed by destination.

## Retrieval Changes

### Request

Extend the chat API request body with validated context identifiers.

### Server

- Resolve current node and reviewed related nodes.
- Retrieve text chunks using the current retriever.
- Rerank with current graph context.
- Enforce public visibility.
- Produce source descriptors.
- Optionally invoke card-selection tools.

### Response

Stream answer text while delivering cards and sources through supported structured annotations or a companion response channel.

Choose the exact AI SDK mechanism during implementation based on the installed version. Do not invent a custom text marker protocol unless structured streaming is unavailable.

## Expanded Talking Archive

The expanded state should be the same AI system with more room for sources and exploration.

When this state earns a durable route, use `/archive`. It remains the expanded state of the global AI rather than a separate assistant or primary navigation requirement.

It can show:

- Active conversation.
- Source cards.
- Related reviewed relationships.
- Previously opened cards in the current session.
- Suggested questions grounded in the current graph neighborhood.

It should not expose hidden chain-of-thought. Show sources, concise rationale, and uncertainty instead.

## Existing `/chat` Route Migration

1. Extract chat state and UI from `ChatUI` into reusable global components.
2. Mount the global provider in the root layout.
3. Add the quiet presence to main portfolio pages.
4. Keep `/chat` as a compatibility entry point during migration; later redirect or resolve it to `/archive` only after reload, deep-link, error, and cross-subdomain behavior pass.
5. Update internal links to open the global AI where appropriate.
6. After validation, preserve `/chat` as a legacy alias or redirect to the canonical `/archive` state.

Do not remove the working route before global conversation handles reloads, deep links, and errors reliably.

## Conversation Persistence

Near-term:

- Preserve conversation while navigating within the same tab where practical.
- Do not persist full transcripts indefinitely by default.
- Allow an explicit clear action.
- Keep route/object context separate from message history.

Future persistence requires a separate privacy decision.

## Safety And Trust

- Resolve facts server-side from public graph nodes.
- Never let client-provided context override source content.
- Validate card destinations.
- Rate-limit chat endpoints.
- Escape and render model output safely.
- Make sources visible.
- State uncertainty when evidence is insufficient.
- Do not include private visitor discovery state in prompts unnecessarily.
- Do not allow visitor-provided workflow or business information to enter public content.

## Error And Offline Behavior

- AI failure must not block site navigation.
- Preserve typed input when a request fails.
- Cards already resolved locally should remain usable.
- Show a restrained retry action.
- If context resolution fails, fall back to general public portfolio context.

## Testing

### Unit

- Context-stack behavior.
- Context serialization.
- Card validation.
- Destination validation.
- Graph-context expansion limits.
- Source visibility.

### Integration

- Ask from Home, About, Projects, and a subdomain.
- Navigate through a card.
- Restore parent context after closing an experience.
- Cross-subdomain card navigation.
- AI unavailable while site remains usable.
- Malformed or unknown card rejected safely.

### Retrieval

- Current object improves relevant result ordering.
- Unrelated context does not overwhelm direct user intent.
- Sources correspond to answer claims.
- Private or draft nodes never appear.

## Performance

- Lazy-load the full conversation surface.
- Keep dormant presence lightweight.
- Do not initialize 3D AI visuals separately on every page.
- Limit source cards and graph expansion.
- Avoid re-running retrieval when merely collapsing and reopening the panel.

## Cross-Plan Handoff

When this plan is complete, pages and experiences may assume:

- A global AI presence can be opened without losing page state.
- Context identifiers are resolved server-side against public graph data.
- Answers include validated public sources.
- Archive cards use the destination registry and reject unknown states.
- Cross-subdomain navigation has a safe transition path.
- AI failure leaves ordinary exploration intact.

Project and About plans remain responsible for publishing accurate current context.

## Completion Criteria

- AI is available globally without repeated buttons.
- Current object and depth context are resolved server-side.
- Answers show trusted sources.
- Validated cards navigate into precise site states.
- The current page remains intact when conversation opens and closes.
- `/chat` migration preserves existing deep links until a final route decision is made.
- AI failure never prevents ordinary exploration.
