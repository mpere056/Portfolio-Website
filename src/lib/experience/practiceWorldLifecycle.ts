import type { PracticeId } from '@/lib/practices';

export type PracticeWorldPhase = 'neutral' | 'preview' | 'selected' | 'retreat';
export type PracticeAttentionSource = 'pointer' | 'focus';

export interface PracticeAttention {
  id: PracticeId;
  source: PracticeAttentionSource;
}

export interface PracticeWorldState {
  phase: PracticeWorldPhase;
  owner: PracticeId | null;
  attention: PracticeAttention | null;
  pendingOwner: PracticeId | null;
  transition: number;
}

export type PracticeWorldAction =
  | { type: 'attend'; id: PracticeId; source: PracticeAttentionSource }
  | { type: 'release'; id: PracticeId; source: PracticeAttentionSource }
  | { type: 'select'; id: PracticeId }
  | { type: 'retreat' }
  | { type: 'retreat-complete' };

export function createPracticeWorldState(): PracticeWorldState {
  return {
    phase: 'neutral',
    owner: null,
    attention: null,
    pendingOwner: null,
    transition: 0,
  };
}

function beginRetreat(
  state: PracticeWorldState,
  pendingOwner: PracticeId | null,
): PracticeWorldState {
  return {
    ...state,
    phase: 'retreat',
    attention: null,
    pendingOwner,
    transition: state.transition + 1,
  };
}

export function reducePracticeWorld(
  state: PracticeWorldState,
  action: PracticeWorldAction,
): PracticeWorldState {
  if (action.type === 'attend') {
    if (state.phase === 'selected' || state.phase === 'retreat') return state;
    return {
      ...state,
      phase: 'preview',
      owner: action.id,
      attention: { id: action.id, source: action.source },
      pendingOwner: null,
    };
  }

  if (action.type === 'release') {
    const releasesCurrentAttention = state.attention?.id === action.id
      && state.attention.source === action.source;
    if (!releasesCurrentAttention || state.phase !== 'preview') return state;
    return {
      ...state,
      phase: 'neutral',
      owner: null,
      attention: null,
      pendingOwner: null,
    };
  }

  if (action.type === 'select') {
    if (state.phase === 'selected') {
      return beginRetreat(
        state,
        state.owner === action.id ? null : action.id,
      );
    }
    if (state.phase === 'retreat') {
      return { ...state, pendingOwner: action.id };
    }
    return {
      ...state,
      phase: 'selected',
      owner: action.id,
      attention: null,
      pendingOwner: null,
      transition: state.transition + 1,
    };
  }

  if (action.type === 'retreat') {
    if (state.phase === 'selected') return beginRetreat(state, null);
    if (state.phase === 'preview') {
      return {
        ...state,
        phase: 'neutral',
        owner: null,
        attention: null,
        pendingOwner: null,
        transition: state.transition + 1,
      };
    }
    return state;
  }

  if (state.phase !== 'retreat') return state;
  if (state.pendingOwner) {
    return {
      ...state,
      phase: 'selected',
      owner: state.pendingOwner,
      pendingOwner: null,
      transition: state.transition + 1,
    };
  }
  return {
    ...state,
    phase: 'neutral',
    owner: null,
    attention: null,
    pendingOwner: null,
    transition: state.transition + 1,
  };
}

export interface PracticeWorldAnchors {
  instrument: string;
  piano: string;
  river: string;
  horizon: string;
}

export interface PracticeWorldBudget {
  maxDrawCalls: number;
  maxContinuousSchedulers: number;
  maxFullScreenPasses: number;
}

export interface PracticeWorldRuntimeContext {
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
}

export interface PracticeWorldRuntime {
  readonly id: PracticeId;
  setPhase(phase: 'preview' | 'selected'): void;
  retreat(): void | Promise<void>;
  dispose(): void;
}

export interface PracticeWorldModule {
  readonly id: PracticeId;
  readonly previewLayers: readonly string[];
  readonly selectedLayers: readonly string[];
  readonly anchors: PracticeWorldAnchors;
  readonly budget: PracticeWorldBudget;
  createRuntime(context: PracticeWorldRuntimeContext): PracticeWorldRuntime;
}

export interface PracticeWorldRuntimeHost {
  activeId(): PracticeId | null;
  runtimeCount(): 0 | 1;
  activate(
    module: PracticeWorldModule,
    context: PracticeWorldRuntimeContext,
    phase: 'preview' | 'selected',
  ): PracticeWorldRuntime;
  retreatAndDispose(id?: PracticeId): Promise<void>;
}

export function createPracticeWorldRuntimeHost(): PracticeWorldRuntimeHost {
  let active: PracticeWorldRuntime | null = null;

  return {
    activeId() {
      return active?.id ?? null;
    },
    runtimeCount() {
      return active ? 1 : 0;
    },
    activate(module, context, phase) {
      if (active && active.id !== module.id) {
        throw new Error(
          `Cannot activate ${module.id} while ${active.id} owns the practice world.`,
        );
      }
      if (!active) active = module.createRuntime(context);
      active.setPhase(phase);
      return active;
    },
    async retreatAndDispose(id) {
      if (!active || (id && active.id !== id)) return;

      const retiring = active;
      active = null;
      try {
        await retiring.retreat();
      } finally {
        retiring.dispose();
      }
    },
  };
}

export type PracticeWorldLoader = () => Promise<PracticeWorldModule>;
export type PracticeWorldLoadStatus = 'unavailable' | 'idle' | 'loading' | 'ready' | 'error';

export interface PracticeWorldRegistry {
  has(id: PracticeId): boolean;
  status(id: PracticeId): PracticeWorldLoadStatus;
  load(id: PracticeId): Promise<PracticeWorldModule | null>;
}

export function createPracticeWorldRegistry(
  loaders: Partial<Record<PracticeId, PracticeWorldLoader>> = {},
): PracticeWorldRegistry {
  const statuses = new Map<PracticeId, PracticeWorldLoadStatus>();
  const cached = new Map<PracticeId, Promise<PracticeWorldModule | null>>();

  return {
    has(id) {
      return Boolean(loaders[id]);
    },
    status(id) {
      if (!loaders[id]) return 'unavailable';
      return statuses.get(id) ?? 'idle';
    },
    load(id) {
      const loader = loaders[id];
      if (!loader) return Promise.resolve(null);
      const existing = cached.get(id);
      if (existing) return existing;

      statuses.set(id, 'loading');
      const request = loader()
        .then((module) => {
          if (module.id !== id) {
            throw new Error(`Practice world loader for ${id} returned ${module.id}.`);
          }
          statuses.set(id, 'ready');
          return module;
        })
        .catch((error: unknown) => {
          statuses.set(id, 'error');
          cached.delete(id);
          throw error;
        });
      cached.set(id, request);
      return request;
    },
  };
}

export const practiceWorldRegistry = createPracticeWorldRegistry();

export function practiceWorldDiagnosticsEnabled(
  environment: string | undefined,
  search: string,
): boolean {
  return environment === 'development'
    && new URLSearchParams(search).get('worldDebug') === '1';
}

export function practiceWorldDraftHref(id: PracticeId): string {
  return `/work/${id}`;
}
