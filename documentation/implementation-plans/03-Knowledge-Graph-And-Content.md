# Knowledge Graph And Content Plan

Last updated: 2026-07-16

## Plan Metadata

| Field | Value |
| --- | --- |
| Plan ID | `KG` |
| Status | Active foundation |
| Upstream | [Architecture](00-System-Architecture-And-Interfaces.md), content inventory, [Living State](07-Living-Project-State.md) schema |
| Downstream | [Global AI](04-Global-AI-And-Talking-Archive.md), [Projects](05-Projects-Museum-And-Case-Studies.md), [About](06-About-And-Memory-Depth.md), semantic lighting, skill prototype |
| Primary outputs | Shared loaders, schemas, graph compiler, reviewed subgraph, bounded queries |
| Execution packages | `KG-01` through `KG-06` in [Work Packages](13-Execution-Work-Packages.md) |
| Capability tracking | `CAP-KG-*` in [Capability Ledger](15-Capability-Coverage-Ledger.md) |

## Scope

Expand the current MDX corpus into a validated, queryable relationship graph without abandoning authored files as the source of truth.

Current status: `KG-01` through `KG-06` are complete through `aeff727`. In addition to the shared 49-node/19-edge compiler and bounded queries, all 42 canonical Firestore chunks carry verified public graph metadata; retrieval supports bounded validated context, legacy compatibility, and destination-safe public source descriptors. `AI-03` will consume this server contract after the global shell.

## Existing Foundation

- `src/content/projects/*.mdx`
- `src/content/about/*.mdx`
- `src/content/sites/*/blog/*.mdx`
- `src/content/misc/*.mdx`
- `src/lib/projects.ts`
- `src/lib/timeline.ts`
- `src/lib/siteBlogs.ts`
- `src/lib/retriever.ts`
- `scripts/ingest.ts`

Project, timeline, and blog APIs now delegate parsing to `src/lib/content/loaders.ts` while preserving their existing output contracts. Cross-content validation and relationships compile through `src/lib/content/schemas.ts` and `src/lib/content/graph.ts`.

## Architecture Decision

Use a build-time graph assembled from authored content.

Do not begin with a graph database. The current corpus is small enough for static compilation, deterministic validation, and in-memory queries.

Suggested layout:

```text
src/content/
  about/
  projects/
  sites/
  misc/
  graph/
    relationships.json
src/lib/content/
  schemas.ts
  loaders.ts
  graph.ts
  queries.ts
  validate.ts
```

Use JSON or TypeScript for relationships unless a YAML dependency is deliberately added. Keep relationship explanations easy to review in diffs.

## Stable IDs

Recommended formats:

- `timeline:2001-piano-start`
- `project:dreamlife`
- `project:lifeinbox`
- `post:lifeinbox:local-first-capture-needs-trust`
- `misc:music-info`
- `skill:local-first-architecture`
- `decision:lifeinbox:reminder-runtime-vibration`
- `offering:ai-workflow-audit`

IDs must remain stable when display names change.

The graph does not require one public page per node or a dedicated constellation route. Visitor-facing nodes become navigable only through reviewed destinations, while other nodes remain evidence and relationship infrastructure.

## Core Types

```ts
type GraphNodeType =
  | 'timeline'
  | 'project'
  | 'project_state'
  | 'post'
  | 'misc'
  | 'skill'
  | 'decision'
  | 'problem'
  | 'lesson'
  | 'artifact'
  | 'offering';

interface GraphNode {
  id: string;
  type: GraphNodeType;
  title: string;
  summary: string;
  sourcePath?: string;
  visibility: 'public' | 'private' | 'draft';
  tags: string[];
}

interface GraphRelationship {
  id: string;
  sourceId: string;
  type: RelationshipType;
  targetId: string;
  explanation: string;
  evidenceNodeIds: string[];
  status: 'draft' | 'reviewed';
  visibility: 'public' | 'hidden_discovery' | 'internal';
}
```

## Relationship Types

Begin with a small controlled vocabulary:

- `inspired`
- `led_to`
- `demonstrates`
- `learned_from`
- `solved_in`
- `continued_in`
- `contrasts_with`
- `depends_on`
- `documented_in`
- `evidenced_by`
- `currently_exploring`

Add new types only when existing types cannot express a reviewed relationship clearly.

## Content Schema Migration

### Projects

Add:

- `lifecycle`
- `capabilities`
- `problemIds`
- `decisionIds`
- `lessonIds`
- `relatedTimelineIds`
- `relatedPostIds`
- `experienceId`
- `evidence`
- `hiddenDiscoveryIds`

### Timeline

Add:

- `developedCapabilityIds`
- `influencedProjectIds`
- `changedBeliefIds`
- `artifactIds`
- `memoryRoomId`
- `hiddenDiscoveryIds`

### Blog Posts

Add only fields with immediate use:

- `nodeId`
- `projectId`
- `decisionIds`
- `lessonIds`
- `seriesId` if a real series exists.

Avoid speculative frontmatter fields with no consumer.

## Loader Consolidation

Create shared parsing utilities for:

- Frontmatter type coercion.
- Stable ID generation.
- Visibility filtering.
- Source-path tracking.
- Error collection.

Existing public loader APIs can remain temporarily while delegating to the shared layer.

Migration order:

1. Introduce shared types and loaders with parity tests.
2. Migrate projects.
3. Migrate timeline.
4. Migrate site blogs.
5. Migrate retrieval ingestion.
6. Remove duplicate normalization code only after parity is verified.

## Validation

Create a validation script and Vitest suite.

Validate:

- Unique node IDs.
- Unique relationship IDs.
- Existing source and target nodes.
- Reviewed status for public relationships.
- Non-empty public explanations.
- Evidence nodes exist.
- No private nodes leak through public relationships.
- Valid lifecycle values.
- Valid experience and destination references.
- No graph cycle assumptions in queries that expect a DAG.
- Every skill shown publicly has evidence.

Run validation during tests and production builds once migration is stable.

## Query API

Provide narrow query functions rather than exposing raw graph traversal throughout components.

Examples:

```ts
getRelatedProjects(nodeId)
getConsequencesForTimelineEvent(eventId)
getEvidenceForSkill(skillId)
getPublicRelationships(nodeId)
getHiddenDiscoveries(nodeId, discoveryState)
getTourDestinations(role)
getAIContextSubgraph(nodeId, limits)
getSemanticLightingEdges(nodeId, maxEdges)
```

Query functions must enforce visibility and result limits.

## AI Integration

Update ingestion so graph metadata accompanies text chunks:

- Node ID.
- Node type.
- Project ID.
- Related reviewed node IDs.
- Visibility.
- Content freshness version.

Retrieval should use graph relationships to expand or rerank results, not blindly ingest relationship prose as factual content.

The AI response layer should receive public source descriptors for card creation and citation.

## Semantic Lighting Integration

Define a lightweight rendering contract:

```ts
interface SemanticEdgeView {
  relationshipId: string;
  sourceDestinationId: string;
  targetDestinationId: string;
  label: string;
  strength: 'primary' | 'secondary';
}
```

Only reviewed public relationships can become normal lighting edges. Hidden-discovery relationships require their discovery condition.

Limit initial output to three primary edges from one source.

## Skill Evidence Prototype Support

Skills should be graph nodes with `evidenced_by` relationships.

The prototype must be able to answer:

- What evidence supports this skill?
- Which project demonstrates it most strongly?
- Is it demonstrated or merely being explored?
- What did the visitor already inspect?

Do not encode skill scores.

## Initial Content Work Package

Start with a deliberately small reviewed subgraph:

- Dreamlife.
- LifeInbox.
- Sudoku Together.
- Five relevant timeline events.
- Ten to fifteen skills.
- Three blog posts.
- Ten to twenty high-value relationships.

Use this subgraph to validate AI, semantic lighting, About connections, project evidence, and the skill prototype before migrating all historical content.

## Testing

- Loader parity tests.
- Schema validation tests.
- Broken-reference tests.
- Visibility leakage tests.
- Query limit and ordering tests.
- Graph-assisted retrieval tests.
- Snapshot or fixture tests for the initial reviewed subgraph.

## Risks

- Treating tags as relationships will produce shallow or incorrect connections.
- Over-modeling can make authoring unpleasant.
- Graph-derived UI can expose private or draft material if visibility is inconsistent.
- Renaming IDs will break persistence and AI cards.
- A graph database would add operational complexity before it provides value.

## Cross-Plan Handoff

When the initial foundation is complete, downstream plans may assume:

- Public content nodes and reviewed relationships compile deterministically.
- Stable IDs resolve to source paths and public summaries.
- Bounded queries enforce visibility and reviewed status.
- The initial flagship subgraph is available for AI, projects, About, lighting, and skill evidence.
- Current project state can override older content through an explicit precedence rule.

Downstream components must not read raw relationship files or bypass query limits.

## Completion Criteria

- The initial reviewed subgraph validates during tests.
- Existing pages render through shared content loaders.
- AI can retrieve graph-aware context with public sources.
- About can query later consequences for an event.
- Projects can query skills, evidence, posts, and related memories.
- Semantic lighting receives a small, safe edge set.
