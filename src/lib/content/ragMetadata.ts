import { isNodeId, type NodeId } from '../portfolioContracts';
import type { CompiledKnowledgeGraph } from './graph';
import {
  createKnowledgeGraphQueries,
  type PublicSourceDescriptor,
} from './queries';

export interface RagGraphMetadata {
  nodeId: NodeId;
  nodeType: string;
  projectId?: NodeId;
  relatedNodeIds: readonly NodeId[];
  visibility: 'public';
  source: PublicSourceDescriptor;
}

export function createRagGraphMetadataIndex(graph: CompiledKnowledgeGraph) {
  const queries = createKnowledgeGraphQueries(graph);
  const output = new Map<NodeId, RagGraphMetadata>();

  for (const node of graph.nodes) {
    const source = queries.getPublicSourceDescriptor(node.id);
    if (!source) continue;
    const neighborhood = queries.getAIContextSubgraph(node.id, {
      maxDepth: 1,
      nodeLimit: 8,
      relationshipLimit: 12,
    });
    const relatedNodeIds = neighborhood.nodes
      .map(candidate => candidate.id)
      .filter(candidateId => candidateId !== node.id)
      .slice(0, 7);
    const projectId = node.type === 'project'
      ? node.id
      : neighborhood.nodes.find(candidate => candidate.type === 'project')?.id;

    output.set(node.id, {
      nodeId: node.id,
      nodeType: node.type,
      ...(projectId && isNodeId(projectId) ? { projectId } : {}),
      relatedNodeIds,
      visibility: 'public',
      source,
    });
  }

  return output;
}
