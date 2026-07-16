import { describe, expect, it } from 'vitest';
import { createPortfolioAIContextStore } from '@/lib/ai/context';

describe('portfolio AI context stack', () => {
  it('restores parent route and object context after nested experiences close', () => {
    const store = createPortfolioAIContextStore({ route: '/projects' });
    store.getState().pushContext('museum.dreamlife', {
      destinationId: 'destination:museum-project-dreamlife',
      nodeId: 'project:dreamlife',
      depthStage: 'approach',
    });
    store.getState().pushContext('experience.future-paths', {
      experienceId: 'experience:dreamlife-future-paths',
      depthStage: 'understand',
      selectedRelationshipId: 'relationship:dreamlife-to-life-design',
    });

    expect(store.getState().activeContext).toMatchObject({
      route: '/projects',
      destinationId: 'destination:museum-project-dreamlife',
      nodeId: 'project:dreamlife',
      experienceId: 'experience:dreamlife-future-paths',
      depthStage: 'understand',
    });

    store.getState().popContext('experience.future-paths');
    expect(store.getState().activeContext).toEqual({
      route: '/projects',
      destinationId: 'destination:museum-project-dreamlife',
      nodeId: 'project:dreamlife',
      depthStage: 'approach',
    });
  });

  it('updates route ownership without losing nested selected context', () => {
    const store = createPortfolioAIContextStore();
    store.getState().pushContext('about.event', {
      destinationId: 'destination:about',
      nodeId: 'timeline:discord-server-growth',
    });
    store.getState().setRoute('/about');

    expect(store.getState().activeContext).toEqual({
      route: '/about',
      destinationId: 'destination:about',
      nodeId: 'timeline:discord-server-growth',
    });
  });

  it('moves a repeated source to the top and restores lower ownership on pop', () => {
    const store = createPortfolioAIContextStore();
    store.getState().pushContext('project', { nodeId: 'project:lifeinbox' });
    store.getState().pushContext('detail', { depthStage: 'handle' });
    store.getState().pushContext('project', { nodeId: 'project:dreamlife' });

    expect(store.getState().entries.map(entry => entry.sourceId)).toEqual(['detail', 'project']);
    expect(store.getState().activeContext.nodeId).toBe('project:dreamlife');
    store.getState().popContext('project');
    expect(store.getState().activeContext).toEqual({ route: '/', depthStage: 'handle' });
  });

  it('rejects invalid identifiers, external routes, and source names', () => {
    const store = createPortfolioAIContextStore();
    expect(() => store.getState().pushContext('Bad Source', {})).toThrow(TypeError);
    expect(() => store.getState().pushContext('object', {
      nodeId: 'not-a-node',
    } as never)).toThrow(TypeError);
    expect(() => store.getState().setRoute('https://example.com')).toThrow(TypeError);
  });

  it('clears all nested context back to the current base route', () => {
    const store = createPortfolioAIContextStore({ route: '/about' });
    store.getState().pushContext('event', { nodeId: 'timeline:dreamlife' });
    store.getState().clearContexts();
    expect(store.getState().activeContext).toEqual({ route: '/about' });
  });
});
