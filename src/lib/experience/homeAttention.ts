export const HOME_TERRITORY_IDS = [
  'about',
  'music',
  'play',
  'life-systems',
] as const;

export type HomeTerritoryId = (typeof HOME_TERRITORY_IDS)[number];
export type HomeWorldMode = 'neutral' | 'attending' | 'selected' | 'entered';
export type HomeAttentionReason = 'pointer' | 'focus' | 'selection' | 'route' | 'restore' | null;

export interface TerritoryAttention {
  id: HomeTerritoryId;
  targetWeight: number;
  settledWeight: number;
  proximity: number;
  focused: boolean;
  selected: boolean;
}

export interface HomeWorldState {
  mode: HomeWorldMode;
  dominantId: HomeTerritoryId | null;
  previousDominantId: HomeTerritoryId | null;
  territories: Record<HomeTerritoryId, TerritoryAttention>;
  transitionReason: HomeAttentionReason;
}

export type HomeAttentionAction =
  | {
    type: 'sample-proximity';
    proximities: Partial<Record<HomeTerritoryId, number>>;
  }
  | { type: 'focus'; id: HomeTerritoryId | null }
  | { type: 'select'; id: HomeTerritoryId | null }
  | { type: 'enter'; id: HomeTerritoryId }
  | { type: 'restore'; selectedId: HomeTerritoryId | null; entered?: boolean }
  | { type: 'back' }
  | { type: 'calm' }
  | { type: 'settle'; deltaMs: number; reducedMotion?: boolean };

export interface PersistedHomeAttention {
  selectedId: HomeTerritoryId | null;
  entered: boolean;
}

const POINTER_GAIN = 4;
const FOCUS_BOOST = 10;
const SELECTION_BOOST = 24;
const ACQUIRE_THRESHOLD = 0.34;
const RELEASE_THRESHOLD = 0.25;
const SWITCH_MARGIN = 0.12;
const SETTLE_DURATION_MS = 260;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function equalWeights() {
  return 1 / HOME_TERRITORY_IDS.length;
}

function normalizedScores(
  territories: HomeWorldState['territories'],
): Record<HomeTerritoryId, number> {
  const scores = Object.fromEntries(HOME_TERRITORY_IDS.map((id) => {
    const territory = territories[id];
    const score = 1
      + territory.proximity * POINTER_GAIN
      + (territory.focused ? FOCUS_BOOST : 0)
      + (territory.selected ? SELECTION_BOOST : 0);
    return [id, score];
  })) as Record<HomeTerritoryId, number>;
  const total = HOME_TERRITORY_IDS.reduce((sum, id) => sum + scores[id], 0);
  return Object.fromEntries(
    HOME_TERRITORY_IDS.map(id => [id, scores[id] / total]),
  ) as Record<HomeTerritoryId, number>;
}

function strongest(
  weights: Record<HomeTerritoryId, number>,
): [HomeTerritoryId, number, number] {
  const ordered = HOME_TERRITORY_IDS
    .map(id => [id, weights[id]] as const)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  return [ordered[0][0], ordered[0][1], ordered[1][1]];
}

function chooseDominant(
  state: HomeWorldState,
  weights: Record<HomeTerritoryId, number>,
) {
  const selected = HOME_TERRITORY_IDS.find(id => state.territories[id].selected);
  if (selected) return selected;
  const focused = HOME_TERRITORY_IDS.find(id => state.territories[id].focused);
  if (focused) return focused;

  const [candidateId, candidateWeight, runnerUpWeight] = strongest(weights);
  const currentId = state.dominantId;
  if (!currentId) {
    return candidateWeight >= ACQUIRE_THRESHOLD
      && candidateWeight - runnerUpWeight >= SWITCH_MARGIN
      ? candidateId
      : null;
  }
  if (currentId === candidateId) {
    return candidateWeight >= RELEASE_THRESHOLD ? currentId : null;
  }
  const currentWeight = weights[currentId];
  if (
    candidateWeight >= ACQUIRE_THRESHOLD
    && candidateWeight - currentWeight >= SWITCH_MARGIN
  ) return candidateId;
  return currentWeight >= RELEASE_THRESHOLD ? currentId : null;
}

function recalculate(
  state: HomeWorldState,
  reason: Exclude<HomeAttentionReason, null>,
  requestedMode?: HomeWorldMode,
): HomeWorldState {
  const weights = normalizedScores(state.territories);
  const selectedId = HOME_TERRITORY_IDS.find(id => state.territories[id].selected);
  const hasTransientAttention = HOME_TERRITORY_IDS.some(id => (
    state.territories[id].focused || state.territories[id].proximity > 0.05
  ));
  const mode = requestedMode
    ?? (selectedId ? 'selected' : hasTransientAttention ? 'attending' : 'neutral');
  const dominantId = mode === 'neutral' && !hasTransientAttention
    ? null
    : chooseDominant(state, weights);
  return {
    ...state,
    mode,
    dominantId,
    previousDominantId: dominantId !== state.dominantId ? state.dominantId : state.previousDominantId,
    territories: Object.fromEntries(HOME_TERRITORY_IDS.map(id => [
      id,
      { ...state.territories[id], targetWeight: weights[id] },
    ])) as HomeWorldState['territories'],
    transitionReason: reason,
  };
}

export function createHomeWorldState(
  restored?: Partial<PersistedHomeAttention>,
): HomeWorldState {
  const selectedId = restored?.selectedId ?? null;
  const weight = equalWeights();
  const state: HomeWorldState = {
    mode: 'neutral',
    dominantId: null,
    previousDominantId: null,
    territories: Object.fromEntries(HOME_TERRITORY_IDS.map(id => [
      id,
      {
        id,
        targetWeight: weight,
        settledWeight: weight,
        proximity: 0,
        focused: false,
        selected: id === selectedId,
      },
    ])) as HomeWorldState['territories'],
    transitionReason: null,
  };
  if (!selectedId) return state;
  return recalculate(
    state,
    'restore',
    restored?.entered ? 'entered' : 'selected',
  );
}

export function reduceHomeAttention(
  state: HomeWorldState,
  action: HomeAttentionAction,
): HomeWorldState {
  if (action.type === 'settle') {
    const alpha = action.reducedMotion
      ? 1
      : 1 - Math.exp(-Math.max(0, action.deltaMs) / SETTLE_DURATION_MS);
    return {
      ...state,
      territories: Object.fromEntries(HOME_TERRITORY_IDS.map(id => {
        const territory = state.territories[id];
        return [
          id,
          {
            ...territory,
            settledWeight: territory.settledWeight
              + (territory.targetWeight - territory.settledWeight) * alpha,
          },
        ];
      })) as HomeWorldState['territories'],
    };
  }

  if (action.type === 'sample-proximity') {
    const territories = Object.fromEntries(HOME_TERRITORY_IDS.map(id => [
      id,
      {
        ...state.territories[id],
        proximity: clamp01(action.proximities[id] ?? 0),
      },
    ])) as HomeWorldState['territories'];
    return recalculate({ ...state, territories }, 'pointer');
  }

  if (action.type === 'focus') {
    const territories = Object.fromEntries(HOME_TERRITORY_IDS.map(id => [
      id,
      { ...state.territories[id], focused: id === action.id },
    ])) as HomeWorldState['territories'];
    return recalculate({ ...state, territories }, 'focus');
  }

  if (action.type === 'select' || action.type === 'enter') {
    const selectedId = action.id;
    const territories = Object.fromEntries(HOME_TERRITORY_IDS.map(id => [
      id,
      {
        ...state.territories[id],
        selected: id === selectedId,
        focused: false,
        proximity: 0,
      },
    ])) as HomeWorldState['territories'];
    return recalculate(
      { ...state, territories },
      action.type === 'enter' ? 'route' : 'selection',
      action.type === 'enter' ? 'entered' : selectedId ? 'selected' : 'neutral',
    );
  }

  if (action.type === 'restore') {
    return createHomeWorldState({
      selectedId: action.selectedId,
      entered: action.entered,
    });
  }

  if (action.type === 'back') {
    if (state.mode === 'entered') {
      return recalculate(state, 'route', 'selected');
    }
    if (state.mode === 'selected') {
      return reduceHomeAttention(state, { type: 'select', id: null });
    }
  }

  const territories = Object.fromEntries(HOME_TERRITORY_IDS.map(id => [
    id,
    { ...state.territories[id], proximity: 0, focused: false },
  ])) as HomeWorldState['territories'];
  return recalculate(
    { ...state, territories },
    'pointer',
    HOME_TERRITORY_IDS.some(id => territories[id].selected)
      ? state.mode === 'entered' ? 'entered' : 'selected'
      : 'neutral',
  );
}

export function persistedHomeAttention(state: HomeWorldState): PersistedHomeAttention {
  const selectedId = HOME_TERRITORY_IDS.find(id => state.territories[id].selected) ?? null;
  return { selectedId, entered: state.mode === 'entered' };
}
