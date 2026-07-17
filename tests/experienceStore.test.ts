import { describe, expect, it } from 'vitest';
import {
  createExplorationStore,
  getExplorationStorageKey,
  type ExplorationStorage,
} from '@/lib/experience/store';
import { DEFAULT_PERSISTED_EXPERIENCE_STATE } from '@/lib/portfolioValidation';

function createMemoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const storage: ExplorationStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
  return { storage, values };
}

describe('versioned exploration store', () => {
  it('starts from SSR-safe semantic defaults and derives per-origin keys', () => {
    const store = createExplorationStore();

    expect(store.getState()).toMatchObject(DEFAULT_PERSISTED_EXPERIENCE_STATE);
    expect(store.getState().hydration).toEqual({ status: 'idle', issues: [] });
    expect(getExplorationStorageKey('https://marknperera.ca:443')).toBe(
      'mark-portfolio:exploration:v1:marknperera.ca',
    );
    expect(getExplorationStorageKey('dreamlife.marknperera.ca')).not.toBe(
      getExplorationStorageKey('lifeinbox.marknperera.ca'),
    );
    store.getState().dispose();
  });

  it('hydrates and rewrites a legacy flat state through the accepted migration', async () => {
    const key = getExplorationStorageKey('marknperera.ca');
    const { storage, values } = createMemoryStorage({
      [key]: JSON.stringify({
        schemaVersion: 0,
        firstNoteCompleted: true,
        discoveredIds: ['home:first-note'],
        handledIds: [],
        enteredIds: [],
        understoodIds: [],
        tour: {
          enabled: false,
          suggestedDestinationIds: [],
          visitedSuggestedIds: [],
          dismissedHintIds: [],
        },
        stimulation: {
          soundEnabled: true,
          stimulation: 0.4,
          reducedMotionRequested: false,
        },
      }),
    });
    const store = createExplorationStore({ storage, origin: 'marknperera.ca' });

    const result = await store.getState().hydrate();

    expect(result?.status).toBe('migrated');
    expect(store.getState().discovery.firstNoteCompleted).toBe(true);
    expect(store.getState().stimulation.normalizedValue).toBe(0.4);
    expect(JSON.parse(values.get(key) ?? '{}')).toMatchObject({ schemaVersion: 1 });
    store.getState().dispose();
  });

  it('preserves valid sections and exposes partial-reset hydration issues', async () => {
    const key = getExplorationStorageKey('dreamlife.marknperera.ca');
    const { storage } = createMemoryStorage({
      [key]: JSON.stringify({
        schemaVersion: 1,
        discovery: {
          ...DEFAULT_PERSISTED_EXPERIENCE_STATE.discovery,
          firstNoteCompleted: true,
          discoveredIds: ['project:dreamlife'],
        },
        tour: { enabled: 'yes' },
        stimulation: {
          soundEnabled: false,
          normalizedValue: 0.2,
          reducedMotionRequested: true,
        },
      }),
    });
    const store = createExplorationStore({ storage, origin: 'dreamlife.marknperera.ca' });

    await store.getState().hydrate();

    expect(store.getState().hydration.status).toBe('partial-reset');
    expect(store.getState().discovery.firstNoteCompleted).toBe(true);
    expect(store.getState().tour).toEqual(DEFAULT_PERSISTED_EXPERIENCE_STATE.tour);
    expect(store.getState().stimulation.normalizedValue).toBe(0.2);
    store.getState().dispose();
  });

  it('records semantic depth and persists validated checkpoints', async () => {
    const key = getExplorationStorageKey('lifeinbox.marknperera.ca');
    const { storage, values } = createMemoryStorage();
    const store = createExplorationStore({ storage, origin: 'lifeinbox.marknperera.ca' });
    await store.getState().hydrate();

    store.getState().recordDepth('project:lifeinbox', 'understand');
    const accepted = store.getState().setCheckpoint({
      destinationId: 'destination:project-lifeinbox',
      stage: 'understand',
    });

    expect(accepted).toBe(true);
    expect(store.getState().discovery.understoodIds).toContain('project:lifeinbox');
    expect(store.getState().discovery.lastCheckpoint).toMatchObject({
      destinationId: 'destination:project-lifeinbox',
      stage: 'understand',
    });
    expect(JSON.parse(values.get(key) ?? '{}').discovery.lastCheckpoint).toBeDefined();
    store.getState().dispose();
  });

  it('applies depth and its checkpoint atomically or rejects both', async () => {
    const { storage } = createMemoryStorage();
    const store = createExplorationStore({ storage, origin: 'marknperera.ca' });
    await store.getState().hydrate();

    expect(store.getState().applyDepthTransition('project:dreamlife', {
      destinationId: 'destination:museum-project-dreamlife',
      stage: 'enter',
      selectedPartId: 'vision-loop',
    })).toBe(true);
    expect(store.getState().discovery.enteredIds).toContain('project:dreamlife');
    expect(store.getState().discovery.lastCheckpoint).toMatchObject({
      stage: 'enter',
      selectedPartId: 'vision-loop',
    });

    const acceptedState = store.getState().discovery;
    expect(store.getState().applyDepthTransition('project:lifeinbox', {
      destinationId: 'destination:about',
      stage: 'handle',
      safeState: { project: 'not-allowed' },
    })).toBe(false);
    expect(store.getState().discovery).toEqual(acceptedState);
    expect(store.getState().discovery.handledIds).not.toContain('project:lifeinbox');
    store.getState().dispose();
  });

  it('rejects unsafe checkpoints and reset removes only its origin key', async () => {
    const mainKey = getExplorationStorageKey('marknperera.ca');
    const projectKey = getExplorationStorageKey('sudokutogether.marknperera.ca');
    const { storage, values } = createMemoryStorage({ [projectKey]: '{"untouched":true}' });
    const store = createExplorationStore({ storage, origin: 'marknperera.ca' });
    await store.getState().hydrate();
    store.getState().setFirstNoteCompleted(true);

    expect(store.getState().setCheckpoint({
      destinationId: 'destination:about',
      stage: 'handle',
      safeState: { project: 'not-allowed-here' },
    })).toBe(false);
    expect(values.has(mainKey)).toBe(true);

    await store.getState().resetExploration();

    expect(store.getState().discovery.firstNoteCompleted).toBe(false);
    expect(values.has(mainKey)).toBe(false);
    expect(values.get(projectKey)).toBe('{"untouched":true}');
    store.getState().dispose();
  });

  it('falls back safely when stored JSON or its schema version is unusable', async () => {
    for (const serialized of ['not-json', JSON.stringify({ schemaVersion: 99 })]) {
      const key = getExplorationStorageKey('marknperera.ca');
      const { storage } = createMemoryStorage({ [key]: serialized });
      const store = createExplorationStore({ storage, origin: 'marknperera.ca' });

      await store.getState().hydrate();

      expect(store.getState().hydration.status).toBe('rejected');
      expect(store.getState()).toMatchObject(DEFAULT_PERSISTED_EXPERIENCE_STATE);
      store.getState().dispose();
    }
  });

  it('persists non-linear tour role, visits, dismissal, and reset independently', async () => {
    const { storage } = createMemoryStorage();
    const store = createExplorationStore({ storage, origin: 'marknperera.ca' });
    await store.getState().hydrate();
    store.getState().chooseTourRole('builder');
    const suggestions = store.getState().tour.suggestedDestinationIds;
    store.getState().recordTourVisit(suggestions[2]);
    store.getState().recordTourVisit(suggestions[0]);
    store.getState().dismissTourHint('home:tour-dreamlife-post');
    store.getState().setTourEnabled(false);
    expect(store.getState().tour).toMatchObject({
      enabled: false,
      role: 'builder',
      visitedSuggestedIds: [suggestions[2], suggestions[0]],
      dismissedHintIds: ['home:tour-dreamlife-post'],
    });
    store.getState().setTourEnabled(true);
    expect(store.getState().tour.enabled).toBe(true);
    store.getState().resetTour();
    expect(store.getState().tour).toEqual({
      enabled: false,
      suggestedDestinationIds: [],
      visitedSuggestedIds: [],
      dismissedHintIds: [],
    });
    expect(store.getState().discovery.firstNoteCompleted).toBe(false);
  });
});
