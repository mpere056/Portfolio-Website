import { describe, expect, it } from 'vitest';
import { createPortfolioAIContextStore } from '@/lib/ai/context';
import { loadKnowledgeGraph } from '@/lib/content/graph';
import { resolveDestination } from '@/lib/destinations';
import {
  createExplorationStore,
  type ExplorationStorage,
} from '@/lib/experience/store';

function createMemoryStorage() {
  const values = new Map<string, string>();
  const storage: ExplorationStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
  return storage;
}

describe('integrated portfolio foundation flow', () => {
  it('carries one reviewed project destination through graph, persistence, and nested AI context', async () => {
    const graph = await loadKnowledgeGraph();
    const destination = resolveDestination('destination:museum-project-dreamlife', {
      currentOrigin: 'main',
    });

    expect(graph.issues).toEqual([]);
    expect(destination).toMatchObject({
      usedFallback: false,
      navigationMode: 'same-origin',
      destination: { nodeId: 'project:dreamlife' },
    });

    const publicRelationships = graph.relationships.filter(relationship => (
      relationship.visibility === 'public'
      && relationship.status === 'reviewed'
      && (relationship.sourceId === destination.destination.nodeId
        || relationship.targetId === destination.destination.nodeId)
    ));
    expect(publicRelationships.length).toBeGreaterThan(0);
    expect(publicRelationships.every(relationship => relationship.explanation.trim())).toBe(true);

    const storage = createMemoryStorage();
    const firstVisit = createExplorationStore({ storage, origin: 'marknperera.ca' });
    await firstVisit.getState().hydrate();
    firstVisit.getState().recordDepth('project:dreamlife', 'handle');
    expect(firstVisit.getState().setCheckpoint({
      destinationId: destination.destination.id,
      stage: 'handle',
    })).toBe(true);
    firstVisit.getState().dispose();

    const returnVisit = createExplorationStore({ storage, origin: 'marknperera.ca' });
    await returnVisit.getState().hydrate();
    expect(returnVisit.getState().discovery.handledIds).toContain('project:dreamlife');
    expect(returnVisit.getState().discovery.lastCheckpoint).toEqual({
      destinationId: 'destination:museum-project-dreamlife',
      stage: 'handle',
    });

    const selectedRelationship = publicRelationships[0];
    const aiContext = createPortfolioAIContextStore({ route: '/projects' });
    aiContext.getState().pushContext('museum.dreamlife', {
      destinationId: destination.destination.id,
      nodeId: destination.destination.nodeId,
      depthStage: 'handle',
    });
    aiContext.getState().pushContext('museum.dreamlife.relationship', {
      selectedRelationshipId: selectedRelationship.id,
    });
    expect(aiContext.getState().activeContext).toMatchObject({
      route: '/projects',
      destinationId: 'destination:museum-project-dreamlife',
      nodeId: 'project:dreamlife',
      depthStage: 'handle',
      selectedRelationshipId: selectedRelationship.id,
    });

    aiContext.getState().popContext('museum.dreamlife.relationship');
    expect(aiContext.getState().activeContext.selectedRelationshipId).toBeUndefined();
    expect(aiContext.getState().activeContext.nodeId).toBe('project:dreamlife');

    expect(resolveDestination('destination:archive')).toMatchObject({
      usedFallback: true,
      reason: 'unavailable-destination',
      destination: { id: 'destination:home' },
    });
    expect(() => aiContext.getState().pushContext('unsafe', {
      route: 'https://example.com/private',
    })).toThrow('AI context route is invalid');

    returnVisit.getState().dispose();
  });
});
