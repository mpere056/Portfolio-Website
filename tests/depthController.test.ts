import { describe, expect, it, vi } from 'vitest';
import { createPortfolioAIContextStore } from '@/lib/ai/context';
import { createDepthController } from '@/lib/experience/controller';
import {
  createExplorationStore,
  type ExplorationStorage,
} from '@/lib/experience/store';

function createMemoryStorage() {
  const values = new Map<string, string>();
  const writes: string[] = [];
  const storage: ExplorationStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => {
      writes.push(value);
      values.set(key, value);
    },
    removeItem: key => values.delete(key),
  };
  return { storage, writes };
}

async function createFixture() {
  const { storage, writes } = createMemoryStorage();
  const explorationStore = createExplorationStore({ storage, origin: 'marknperera.ca' });
  await explorationStore.getState().hydrate();
  const aiContextStore = createPortfolioAIContextStore({ route: '/projects' });
  aiContextStore.getState().pushContext('global.selection', {
    nodeId: 'skill:product-strategy',
  });
  const onAction = vi.fn();
  const controller = createDepthController({
    initialState: {
      destinationId: 'destination:museum-project-dreamlife',
      stage: 'signal',
    },
    context: {
      route: '/projects',
      destinationId: 'destination:museum-project-dreamlife',
      nodeId: 'project:dreamlife',
      experienceId: 'experience:dreamlife',
    },
    semanticId: 'project:dreamlife',
    sourceId: 'depth.museum.dreamlife',
    explorationStore,
    aiContextStore,
    onAction,
  });
  return { aiContextStore, controller, explorationStore, onAction, writes };
}

describe('headless depth controller', () => {
  it('atomically applies one accepted transition to persistence, context, actions, and observers', async () => {
    const fixture = await createFixture();
    const listener = vi.fn();
    fixture.controller.subscribe(listener);

    const result = fixture.controller.transition({ stage: 'approach', reason: 'proximity' });

    expect(result.accepted).toBe(true);
    expect(fixture.controller.getSnapshot()).toMatchObject({
      state: { stage: 'approach' },
      nextStage: 'handle',
      expectedReason: 'interaction',
      disposed: false,
    });
    expect(fixture.explorationStore.getState().discovery).toMatchObject({
      discoveredIds: ['project:dreamlife'],
      lastCheckpoint: {
        destinationId: 'destination:museum-project-dreamlife',
        stage: 'approach',
      },
    });
    expect(fixture.aiContextStore.getState().activeContext).toMatchObject({
      route: '/projects',
      nodeId: 'project:dreamlife',
      depthStage: 'approach',
    });
    expect(fixture.onAction).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(fixture.writes).toHaveLength(1);
    fixture.controller.dispose();
    fixture.explorationStore.getState().dispose();
  });

  it('rejects invalid transitions and checkpoints without mutating any surface', async () => {
    const fixture = await createFixture();
    const initialDiscovery = fixture.explorationStore.getState().discovery;
    const initialContext = fixture.aiContextStore.getState().activeContext;

    expect(fixture.controller.transition({
      stage: 'handle',
      reason: 'interaction',
    })).toMatchObject({ accepted: false, code: 'transition-not-allowed' });
    expect(fixture.controller.transition({
      stage: 'approach',
      reason: 'proximity',
      safeState: { panel: 'not-allowed' },
    })).toMatchObject({ accepted: false, code: 'checkpoint-rejected' });

    expect(fixture.controller.getSnapshot().state.stage).toBe('signal');
    expect(fixture.explorationStore.getState().discovery).toEqual(initialDiscovery);
    expect(fixture.aiContextStore.getState().activeContext).toEqual(initialContext);
    expect(fixture.onAction).not.toHaveBeenCalled();
    expect(fixture.writes).toHaveLength(0);
    fixture.controller.dispose();
    fixture.explorationStore.getState().dispose();
  });

  it('supports restore, retreat, reset, and destination-safe restoration', async () => {
    const fixture = await createFixture();

    expect(fixture.controller.restore({
      destinationId: 'destination:museum-project-dreamlife',
      stage: 'enter',
    })).toMatchObject({ accepted: true, next: { stage: 'enter' } });
    expect(fixture.controller.retreat()).toMatchObject({ accepted: true, next: { stage: 'handle' } });
    expect(fixture.controller.reset()).toMatchObject({ accepted: true, next: { stage: 'signal' } });
    expect(fixture.controller.restore({
      destinationId: 'destination:about',
      stage: 'understand',
    })).toMatchObject({ accepted: false, code: 'destination-mismatch' });
    fixture.controller.dispose();
    fixture.explorationStore.getState().dispose();
  });

  it('disposes idempotently, removes only owned context, and rejects later work', async () => {
    const fixture = await createFixture();
    expect(fixture.aiContextStore.getState().activeContext.nodeId).toBe('project:dreamlife');

    fixture.controller.dispose();
    fixture.controller.dispose();

    expect(fixture.controller.getSnapshot().disposed).toBe(true);
    expect(fixture.aiContextStore.getState().activeContext).toMatchObject({
      route: '/projects',
      nodeId: 'skill:product-strategy',
    });
    expect(fixture.controller.transition({
      stage: 'approach',
      reason: 'proximity',
    })).toMatchObject({ accepted: false, code: 'controller-disposed' });
    expect(fixture.onAction).not.toHaveBeenCalled();
    fixture.explorationStore.getState().dispose();
  });
});
