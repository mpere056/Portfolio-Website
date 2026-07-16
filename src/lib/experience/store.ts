import { createStore, type StoreApi } from 'zustand/vanilla';
import { portfolioActions } from '../portfolioActions';
import type {
  DepthStage,
  ExperienceCheckpoint,
  PersistedExperienceState,
  SemanticExperienceId,
} from '../portfolioContracts';
import {
  DEFAULT_PERSISTED_EXPERIENCE_STATE,
  parsePersistedExperienceState,
  type PersistedExperienceStateResult,
  type ValidationIssue,
} from '../portfolioValidation';

export interface ExplorationStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): unknown | Promise<unknown>;
  removeItem(key: string): unknown | Promise<unknown>;
}

export const browserExplorationStorage: ExplorationStorage = {
  getItem(key) {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  },
  setItem(key, value) {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
  },
  removeItem(key) {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
  },
};

export type ExplorationHydrationStatus =
  | 'idle'
  | 'current'
  | 'migrated'
  | 'partial-reset'
  | 'rejected'
  | 'storage-error';

export interface ExplorationHydrationState {
  status: ExplorationHydrationStatus;
  issues: readonly ValidationIssue[];
}

export interface ExplorationStoreState extends PersistedExperienceState {
  hydration: ExplorationHydrationState;
  hydrate(): Promise<PersistedExperienceStateResult | undefined>;
  setFirstNoteCompleted(completed: boolean): void;
  recordDepth(id: SemanticExperienceId, stage: DepthStage): void;
  setCheckpoint(checkpoint?: ExperienceCheckpoint): boolean;
  applyDepthTransition(id: SemanticExperienceId, checkpoint: ExperienceCheckpoint): boolean;
  setStimulation(value: number): void;
  resetExploration(): Promise<void>;
  dispose(): void;
}

export interface CreateExplorationStoreOptions {
  storage?: ExplorationStorage;
  origin?: string;
}

const STORAGE_PREFIX = 'mark-portfolio:exploration:v1';

function normalizeOrigin(origin: string | undefined) {
  const fallback = typeof window === 'undefined' ? 'server' : window.location.hostname;
  const candidate = (origin ?? fallback).trim().toLowerCase();
  if (!candidate) return 'unknown';

  try {
    return candidate.includes('://') ? new URL(candidate).hostname : candidate.split(':')[0];
  } catch {
    return 'unknown';
  }
}

export function getExplorationStorageKey(origin?: string) {
  return `${STORAGE_PREFIX}:${normalizeOrigin(origin)}`;
}

function cloneSemanticState(state: PersistedExperienceState): PersistedExperienceState {
  return {
    schemaVersion: state.schemaVersion,
    discovery: {
      ...state.discovery,
      discoveredIds: [...state.discovery.discoveredIds],
      handledIds: [...state.discovery.handledIds],
      enteredIds: [...state.discovery.enteredIds],
      understoodIds: [...state.discovery.understoodIds],
      alteredObjects: Object.fromEntries(
        Object.entries(state.discovery.alteredObjects).map(([key, value]) => [key, { ...value }]),
      ),
      ...(state.discovery.lastCheckpoint
        ? {
          lastCheckpoint: {
            ...state.discovery.lastCheckpoint,
            ...(state.discovery.lastCheckpoint.safeState
              ? { safeState: { ...state.discovery.lastCheckpoint.safeState } }
              : {}),
          },
        }
        : {}),
      seenContentVersions: { ...state.discovery.seenContentVersions },
    },
    tour: {
      ...state.tour,
      suggestedDestinationIds: [...state.tour.suggestedDestinationIds],
      visitedSuggestedIds: [...state.tour.visitedSuggestedIds],
      dismissedHintIds: [...state.tour.dismissedHintIds],
    },
    stimulation: { ...state.stimulation },
  };
}

function semanticSnapshot(state: ExplorationStoreState): PersistedExperienceState {
  return cloneSemanticState({
    schemaVersion: state.schemaVersion,
    discovery: state.discovery,
    tour: state.tour,
    stimulation: state.stimulation,
  });
}

function withUnique(values: readonly SemanticExperienceId[], id: SemanticExperienceId) {
  return values.includes(id) ? values : [...values, id];
}

function withRecordedDepth(
  discovery: PersistedExperienceState['discovery'],
  id: SemanticExperienceId,
  stage: DepthStage,
): PersistedExperienceState['discovery'] {
  const next = {
    ...discovery,
    discoveredIds: withUnique(discovery.discoveredIds, id),
  };
  if (stage === 'handle' || stage === 'enter' || stage === 'understand') {
    next.handledIds = withUnique(discovery.handledIds, id);
  }
  if (stage === 'enter' || stage === 'understand') {
    next.enteredIds = withUnique(discovery.enteredIds, id);
  }
  if (stage === 'understand') {
    next.understoodIds = withUnique(discovery.understoodIds, id);
  }
  return next;
}

export function createExplorationStore(
  options: CreateExplorationStoreOptions = {},
): StoreApi<ExplorationStoreState> {
  const storageKey = getExplorationStorageKey(options.origin);
  let persistenceEnabled = false;
  let persistenceSuppressed = false;
  let unsubscribe = () => {};

  const store = createStore<ExplorationStoreState>((set, get) => ({
    ...cloneSemanticState(DEFAULT_PERSISTED_EXPERIENCE_STATE),
    hydration: { status: 'idle', issues: [] },

    async hydrate() {
      if (!options.storage) return undefined;

      let result: PersistedExperienceStateResult;
      try {
        const serialized = await options.storage.getItem(storageKey);
        const candidate = serialized === null ? DEFAULT_PERSISTED_EXPERIENCE_STATE : JSON.parse(serialized);
        result = parsePersistedExperienceState(candidate);
      } catch {
        result = {
          status: 'rejected',
          value: cloneSemanticState(DEFAULT_PERSISTED_EXPERIENCE_STATE),
          resetSections: [],
          issues: [{
            path: '',
            code: 'storage-read-failed',
            message: 'Exploration storage could not be read',
          }],
        };
      }

      persistenceSuppressed = true;
      set({
        ...cloneSemanticState(result.value),
        hydration: { status: result.status, issues: result.issues },
      });
      persistenceSuppressed = false;
      persistenceEnabled = true;

      if (result.status === 'migrated' || result.status === 'partial-reset') {
        await options.storage.setItem(storageKey, JSON.stringify(result.value));
      }
      return result;
    },

    setFirstNoteCompleted(completed) {
      set(state => ({
        discovery: { ...state.discovery, firstNoteCompleted: completed },
      }));
    },

    recordDepth(id, stage) {
      set(state => ({ discovery: withRecordedDepth(state.discovery, id, stage) }));
    },

    setCheckpoint(checkpoint) {
      const current = semanticSnapshot(get());
      const candidate = {
        ...current,
        discovery: {
          ...current.discovery,
          ...(checkpoint ? { lastCheckpoint: checkpoint } : { lastCheckpoint: undefined }),
        },
      };
      const parsed = parsePersistedExperienceState(candidate);
      if (parsed.resetSections.includes('discovery')) return false;
      set({ discovery: parsed.value.discovery });
      return true;
    },

    applyDepthTransition(id, checkpoint) {
      const current = semanticSnapshot(get());
      const candidate = {
        ...current,
        discovery: {
          ...withRecordedDepth(current.discovery, id, checkpoint.stage),
          lastCheckpoint: checkpoint,
        },
      };
      const parsed = parsePersistedExperienceState(candidate);
      if (parsed.resetSections.includes('discovery')) return false;
      set({ discovery: parsed.value.discovery });
      return true;
    },

    setStimulation(value) {
      const normalizedValue = portfolioActions.stimulationChanged(value).payload.normalizedValue;
      set(state => ({
        stimulation: { ...state.stimulation, normalizedValue },
      }));
    },

    async resetExploration() {
      persistenceSuppressed = true;
      set({
        ...cloneSemanticState(DEFAULT_PERSISTED_EXPERIENCE_STATE),
        hydration: { status: 'current', issues: [] },
      });
      if (options.storage) await options.storage.removeItem(storageKey);
      persistenceSuppressed = false;
      persistenceEnabled = Boolean(options.storage);
    },

    dispose() {
      unsubscribe();
    },
  }));

  unsubscribe = store.subscribe((state) => {
    if (!options.storage || !persistenceEnabled || persistenceSuppressed) return;
    void Promise.resolve(
      options.storage.setItem(storageKey, JSON.stringify(semanticSnapshot(state))),
    ).catch(() => undefined);
  });

  return store;
}
