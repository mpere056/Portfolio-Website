import {
  DESTINATION_REGISTRY,
  type DestinationDefinition,
  type DestinationKind,
} from '../destinations';
import {
  TOUR_ROLES,
  type DestinationId,
  type NodeId,
  type RelationshipId,
  type TourRole,
} from '../portfolioContracts';
import {
  loadKnowledgeGraph,
  type CompiledKnowledgeGraph,
  type GraphNode,
  type GraphRelationship,
  type GraphRelationshipType,
} from './graph';
import {
  isPracticeId,
  practiceNodeId,
  type PracticeId,
} from '../practices';

export interface BoundedQueryOptions {
  limit?: number;
}

export interface GraphConnection {
  relationship: GraphRelationship;
  source: GraphNode;
  target: GraphNode;
  evidence: readonly GraphNode[];
}

export interface RelatedContentView {
  nodeId: NodeId;
  nodeType: string;
  title: string;
  summary: string;
  relationshipId: RelationshipId;
  relationshipType: GraphRelationshipType;
  explanation: string;
  destination: DestinationDefinition;
}

export interface PublicSourceDescriptor {
  nodeId: NodeId;
  nodeType: string;
  title: string;
  summary: string;
  destination?: Pick<DestinationDefinition, 'id' | 'href' | 'targetOrigin'>;
}

export interface TourDestinationCandidate {
  nodeId: NodeId;
  title: string;
  summary: string;
  destination: DestinationDefinition;
  reason: string;
}

export interface AIContextSubgraph {
  centerNode?: GraphNode;
  nodes: readonly GraphNode[];
  relationships: readonly GraphRelationship[];
  sourceDescriptors: readonly RelatedContentView[];
}

export interface AIContextSubgraphOptions {
  maxDepth?: number;
  nodeLimit?: number;
  relationshipLimit?: number;
}

export interface SemanticEdgeView {
  relationshipId: RelationshipId;
  sourceDestinationId: DestinationId;
  targetDestinationId: DestinationId;
  label: string;
  strength: 'primary' | 'secondary';
}

const DEFAULT_LIMIT = 6;
const MAX_RESULT_LIMIT = 20;
const MAX_CONTEXT_DEPTH = 2;
const MAX_CONTEXT_RELATIONSHIPS = 30;
const MAX_SEMANTIC_EDGES = 3;

const destinationKindRank: Readonly<Record<DestinationKind, number>> = {
  'museum-exhibit': 0,
  'blog-post': 1,
  project: 2,
  about: 3,
  museum: 4,
  'blog-index': 5,
  world: 6,
  archive: 7,
  writing: 8,
  studio: 9,
  legacy: 10,
  internal: 11,
};

const relationshipTypeRank: Readonly<Record<GraphRelationshipType, number>> = {
  led_to: 0,
  continued_in: 1,
  demonstrates: 2,
  evidenced_by: 3,
  documented_in: 4,
  inspired: 5,
  learned_from: 6,
  solved_in: 7,
  contrasts_with: 8,
  depends_on: 9,
  currently_exploring: 10,
};

function clampLimit(value: number | undefined, fallback = DEFAULT_LIMIT, maximum = MAX_RESULT_LIMIT) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(1, Math.min(maximum, Math.floor(value ?? fallback)));
}

function sortRelationships(left: GraphRelationship, right: GraphRelationship) {
  return relationshipTypeRank[left.type] - relationshipTypeRank[right.type]
    || left.id.localeCompare(right.id);
}

function sortNodes(left: GraphNode, right: GraphNode) {
  return left.title.localeCompare(right.title) || left.id.localeCompare(right.id);
}

function isPublicNode(node: GraphNode | undefined): node is GraphNode {
  return node?.visibility === 'public';
}

function isSafePublicRelationship(
  relationship: GraphRelationship,
  nodeMap: ReadonlyMap<NodeId, GraphNode>,
) {
  if (relationship.status !== 'reviewed' || relationship.visibility !== 'public') return false;
  return [relationship.sourceId, relationship.targetId, ...relationship.evidenceNodeIds]
    .every(id => isPublicNode(nodeMap.get(id)));
}

function isSafeHiddenRelationship(
  relationship: GraphRelationship,
  nodeMap: ReadonlyMap<NodeId, GraphNode>,
  unlockedIds: ReadonlySet<string>,
) {
  if (
    relationship.status !== 'reviewed'
    || relationship.visibility !== 'hidden-discovery'
    || !unlockedIds.has(relationship.id)
  ) return false;
  return [relationship.sourceId, relationship.targetId, ...relationship.evidenceNodeIds]
    .every(id => isPublicNode(nodeMap.get(id)));
}

function destinationForNode(nodeId: NodeId): DestinationDefinition | undefined {
  return (Object.values(DESTINATION_REGISTRY) as readonly DestinationDefinition[])
    .filter(destination => destination.status === 'canonical' && destination.nodeId === nodeId)
    .sort((left, right) => {
      const originRank = Number(left.targetOrigin !== 'main') - Number(right.targetOrigin !== 'main');
      return originRank
        || destinationKindRank[left.kind] - destinationKindRank[right.kind]
        || left.id.localeCompare(right.id);
    })[0];
}

function toConnection(
  relationship: GraphRelationship,
  nodeMap: ReadonlyMap<NodeId, GraphNode>,
): GraphConnection {
  return {
    relationship,
    source: nodeMap.get(relationship.sourceId)!,
    target: nodeMap.get(relationship.targetId)!,
    evidence: relationship.evidenceNodeIds.map(id => nodeMap.get(id)!),
  };
}

function otherNode(connection: GraphConnection, nodeId: NodeId) {
  return connection.source.id === nodeId ? connection.target : connection.source;
}

function uniqueNodes(nodes: readonly GraphNode[]) {
  return [...new Map(nodes.map(node => [node.id, node])).values()];
}

function uniqueRelationships(relationships: readonly GraphRelationship[]) {
  return [...new Map(relationships.map(relationship => [relationship.id, relationship])).values()];
}

function relatedView(
  node: GraphNode,
  relationship: GraphRelationship,
): RelatedContentView | undefined {
  const destination = destinationForNode(node.id);
  if (!destination) return undefined;
  return {
    nodeId: node.id,
    nodeType: node.type,
    title: node.title,
    summary: node.summary,
    relationshipId: relationship.id,
    relationshipType: relationship.type,
    explanation: relationship.explanation,
    destination,
  } satisfies RelatedContentView;
}

export function createKnowledgeGraphQueries(graph: CompiledKnowledgeGraph) {
  const nodeMap = new Map(graph.nodes.map(node => [node.id, node]));
  const publicRelationships = graph.relationships
    .filter(relationship => isSafePublicRelationship(relationship, nodeMap))
    .sort(sortRelationships);

  function getPublicRelationships(nodeId: NodeId, options: BoundedQueryOptions = {}) {
    return publicRelationships
      .filter(relationship => relationship.sourceId === nodeId || relationship.targetId === nodeId)
      .slice(0, clampLimit(options.limit))
      .map(relationship => toConnection(relationship, nodeMap));
  }

  function getRelatedProjects(nodeId: NodeId, options: BoundedQueryOptions = {}) {
    const projects = getPublicRelationships(nodeId, { limit: MAX_RESULT_LIMIT })
      .flatMap(connection => [
        otherNode(connection, nodeId),
        ...connection.evidence,
      ].map(node => ({ node, relationship: connection.relationship })))
      .filter(({ node }) => node.type === 'project' && node.id !== nodeId);
    return [...new Map(projects.map(item => [item.node.id, item])).values()]
      .sort((left, right) => sortNodes(left.node, right.node))
      .slice(0, clampLimit(options.limit));
  }

  function getPractice(practiceId: PracticeId) {
    const node = nodeMap.get(practiceNodeId(practiceId));
    return node?.type === 'practice' && isPublicNode(node) ? node : undefined;
  }

  function practiceForProject(projectId: NodeId) {
    const project = nodeMap.get(projectId);
    if (
      project?.type !== 'project'
      || !project.primaryPracticeId
      || !isPracticeId(project.primaryPracticeId)
    ) return undefined;
    return getPractice(project.primaryPracticeId);
  }

  function projectsForPractice(
    practiceId: PracticeId,
    options: BoundedQueryOptions = {},
  ) {
    if (!getPractice(practiceId)) return [];
    return graph.nodes
      .filter(node => (
        node.type === 'project'
        && node.primaryPracticeId === practiceId
        && isPublicNode(node)
      ))
      .sort(sortNodes)
      .slice(0, clampLimit(options.limit, MAX_RESULT_LIMIT));
  }

  function getConsequencesForTimelineEvent(nodeId: NodeId, options: BoundedQueryOptions = {}) {
    const allowedTypes = new Set<GraphRelationshipType>([
      'led_to',
      'continued_in',
      'inspired',
      'demonstrates',
      'learned_from',
    ]);
    return getPublicRelationships(nodeId, { limit: MAX_RESULT_LIMIT })
      .filter(connection => connection.relationship.sourceId === nodeId)
      .filter(connection => allowedTypes.has(connection.relationship.type))
      .slice(0, clampLimit(options.limit));
  }

  function getEvidenceForSkill(nodeId: NodeId, options: BoundedQueryOptions = {}) {
    const nodes = getPublicRelationships(nodeId, { limit: MAX_RESULT_LIMIT })
      .filter(connection => (
        connection.relationship.type === 'evidenced_by'
        || connection.relationship.type === 'demonstrates'
      ))
      .flatMap(connection => [otherNode(connection, nodeId), ...connection.evidence])
      .filter(node => node.id !== nodeId);
    return uniqueNodes(nodes)
      .sort(sortNodes)
      .slice(0, clampLimit(options.limit));
  }

  function getHiddenDiscoveries(
    nodeId: NodeId,
    unlockedIds: ReadonlySet<string>,
    options: BoundedQueryOptions = {},
  ) {
    return graph.relationships
      .filter(relationship => isSafeHiddenRelationship(relationship, nodeMap, unlockedIds))
      .filter(relationship => relationship.sourceId === nodeId || relationship.targetId === nodeId)
      .sort(sortRelationships)
      .slice(0, clampLimit(options.limit))
      .map(relationship => toConnection(relationship, nodeMap));
  }

  function getRelatedContent(nodeId: NodeId, options: BoundedQueryOptions = {}) {
    const views = getPublicRelationships(nodeId, { limit: MAX_RESULT_LIMIT })
      .map(connection => relatedView(otherNode(connection, nodeId), connection.relationship))
      .filter((view): view is RelatedContentView => Boolean(view));
    return [...new Map(views.map(view => [view.nodeId, view])).values()]
      .sort((left, right) => left.title.localeCompare(right.title) || left.nodeId.localeCompare(right.nodeId))
      .slice(0, clampLimit(options.limit));
  }

  function getPublicSourceDescriptor(nodeId: NodeId): PublicSourceDescriptor | undefined {
    const node = nodeMap.get(nodeId);
    if (!isPublicNode(node)) return undefined;
    const destination = destinationForNode(nodeId);
    return {
      nodeId: node.id,
      nodeType: node.type,
      title: node.title,
      summary: node.summary,
      ...(destination ? {
        destination: {
          id: destination.id,
          href: destination.href,
          targetOrigin: destination.targetOrigin,
        },
      } : {}),
    };
  }

  function getTourDestinationCandidates(role: TourRole, options: BoundedQueryOptions = {}) {
    if (!TOUR_ROLES.includes(role)) return [];
    const typeRanks: Readonly<Record<TourRole, Readonly<Record<string, number>>>> = {
      recruiter: { project: 0, post: 1 },
      client: { project: 0, post: 1 },
      builder: { post: 0, project: 1 },
      explorer: { project: 0, post: 0 },
    };
    const ranks = typeRanks[role];
    return graph.nodes
      .filter(isPublicNode)
      .map(node => ({ node, destination: destinationForNode(node.id) }))
      .filter((item): item is { node: GraphNode; destination: DestinationDefinition } => (
        Boolean(item.destination) && item.node.type in ranks
      ))
      .sort((left, right) => (
        (ranks[left.node.type] ?? 99) - (ranks[right.node.type] ?? 99)
        || sortNodes(left.node, right.node)
      ))
      .slice(0, clampLimit(options.limit))
      .map(({ node, destination }) => ({
        nodeId: node.id,
        title: node.title,
        summary: node.summary,
        destination,
        reason: role === 'builder'
          ? 'Inspect the implementation and the reasoning behind it.'
          : role === 'recruiter'
            ? 'See a concrete product and the capability it demonstrates.'
            : role === 'client'
              ? 'Explore a finished product direction and the thinking behind it.'
              : 'Follow a public doorway into the portfolio world.',
      } satisfies TourDestinationCandidate));
  }

  function getAIContextSubgraph(nodeId: NodeId, options: AIContextSubgraphOptions = {}): AIContextSubgraph {
    const centerNode = nodeMap.get(nodeId);
    if (!isPublicNode(centerNode)) return { nodes: [], relationships: [], sourceDescriptors: [] };
    const maxDepth = Math.max(0, Math.min(MAX_CONTEXT_DEPTH, Math.floor(options.maxDepth ?? 1)));
    const nodeLimit = clampLimit(options.nodeLimit, 8);
    const relationshipLimit = clampLimit(
      options.relationshipLimit,
      12,
      MAX_CONTEXT_RELATIONSHIPS,
    );
    const visited = new Set<NodeId>([nodeId]);
    const distance = new Map<NodeId, number>([[nodeId, 0]]);
    let frontier: NodeId[] = [nodeId];
    const selectedRelationships: GraphRelationship[] = [];

    for (let depth = 0; depth < maxDepth && frontier.length && visited.size < nodeLimit; depth += 1) {
      const nextFrontier: NodeId[] = [];
      for (const currentId of frontier.sort()) {
        const adjacent = publicRelationships.filter(relationship => (
          relationship.sourceId === currentId || relationship.targetId === currentId
        ));
        for (const relationship of adjacent) {
          if (selectedRelationships.length < relationshipLimit) selectedRelationships.push(relationship);
          const candidateId = relationship.sourceId === currentId
            ? relationship.targetId
            : relationship.sourceId;
          if (!visited.has(candidateId) && visited.size < nodeLimit) {
            visited.add(candidateId);
            distance.set(candidateId, depth + 1);
            nextFrontier.push(candidateId);
          }
        }
      }
      frontier = nextFrontier;
    }

    const nodes = [...visited]
      .map(id => nodeMap.get(id)!)
      .sort((left, right) => (
        (distance.get(left.id) ?? 0) - (distance.get(right.id) ?? 0)
        || sortNodes(left, right)
      ));
    const relationships = uniqueRelationships(selectedRelationships)
      .sort(sortRelationships)
      .slice(0, relationshipLimit);
    const sourceDescriptors = relationships
      .flatMap(relationship => [
        relatedView(nodeMap.get(relationship.sourceId)!, relationship),
        relatedView(nodeMap.get(relationship.targetId)!, relationship),
      ])
      .filter((view): view is RelatedContentView => Boolean(view))
      .filter(view => view.nodeId !== nodeId);

    return {
      centerNode,
      nodes,
      relationships,
      sourceDescriptors: [...new Map(sourceDescriptors.map(view => [view.nodeId, view])).values()]
        .slice(0, nodeLimit),
    };
  }

  function getSemanticLightingEdges(nodeId: NodeId, options: BoundedQueryOptions = {}) {
    const maximum = clampLimit(options.limit, MAX_SEMANTIC_EDGES, MAX_SEMANTIC_EDGES);
    return getPublicRelationships(nodeId, { limit: MAX_RESULT_LIMIT })
      .map((connection): SemanticEdgeView | undefined => {
        const source = destinationForNode(connection.source.id);
        const target = destinationForNode(connection.target.id);
        if (!source || !target) return undefined;
        return {
          relationshipId: connection.relationship.id,
          sourceDestinationId: source.id,
          targetDestinationId: target.id,
          label: connection.relationship.explanation,
          strength: 'secondary' as const,
        };
      })
      .filter((edge): edge is SemanticEdgeView => Boolean(edge))
      .slice(0, maximum)
      .map((edge, index) => ({ ...edge, strength: index === 0 ? 'primary' as const : 'secondary' as const }));
  }

  return {
    getPublicRelationships,
    getRelatedProjects,
    getPractice,
    practiceForProject,
    projectsForPractice,
    getConsequencesForTimelineEvent,
    getEvidenceForSkill,
    getHiddenDiscoveries,
    getRelatedContent,
    getPublicSourceDescriptor,
    getTourDestinationCandidates,
    getAIContextSubgraph,
    getSemanticLightingEdges,
  };
}

export async function loadKnowledgeGraphQueries() {
  return createKnowledgeGraphQueries(await loadKnowledgeGraph());
}
