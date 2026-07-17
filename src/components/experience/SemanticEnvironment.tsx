import { getDestinationDefinition } from '@/lib/destinations';
import { loadKnowledgeGraph } from '@/lib/content/graph';
import { createKnowledgeGraphQueries } from '@/lib/content/queries';
import {
  validateSemanticFieldSignals,
  type SemanticFieldSignal,
} from '@/lib/experience/environment';
import DiscoveryPhysicsInstrument from './DiscoveryPhysicsInstrument';

const REVIEWED_CENTERS = [
  'project:dreamlife',
  'project:lifeinbox',
  'project:discord-sudoku-activity',
] as const;

export default async function SemanticEnvironment({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;

  let signals: SemanticFieldSignal[];
  try {
    const graph = await loadKnowledgeGraph();
    const queries = createKnowledgeGraphQueries(graph);
    const nodes = new Map(graph.nodes.map(node => [node.id, node]));
    signals = REVIEWED_CENTERS
      .flatMap(nodeId => queries.getSemanticLightingEdges(nodeId, { limit: 1 }))
      .map((edge): SemanticFieldSignal | undefined => {
        const source = getDestinationDefinition(edge.sourceDestinationId);
        const target = getDestinationDefinition(edge.targetDestinationId);
        const sourceNode = source?.nodeId ? nodes.get(source.nodeId) : undefined;
        const targetNode = target?.nodeId ? nodes.get(target.nodeId) : undefined;
        if (!source || !target || !sourceNode || !targetNode) return undefined;
        return {
          ...edge,
          sourceTitle: sourceNode.title,
          sourceHref: source.href,
          targetTitle: targetNode.title,
          targetHref: target.href,
          explanation: edge.label,
        };
      })
      .filter((signal): signal is SemanticFieldSignal => Boolean(signal));

  } catch {
    // Relationship data is an enhancement; ordinary routes must remain available.
    return null;
  }

  return validateSemanticFieldSignals(signals)
    ? <DiscoveryPhysicsInstrument signals={signals} />
    : null;
}
