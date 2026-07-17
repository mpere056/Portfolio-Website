import { getDestinationDefinition } from '../destinations';
import {
  isRelationshipId,
  type DestinationId,
  type RelationshipId,
} from '../portfolioContracts';

export type EnvironmentalStage = 'dormant' | 'near' | 'handled' | 'connected';

export interface SemanticFieldSignal {
  relationshipId: RelationshipId;
  sourceDestinationId: DestinationId;
  sourceTitle: string;
  sourceHref: string;
  targetDestinationId: DestinationId;
  targetTitle: string;
  targetHref: string;
  explanation: string;
  strength: 'primary' | 'secondary';
}

export interface EnvironmentalState {
  stage: EnvironmentalStage;
  proximity: number;
  handleTravel: number;
  activeRelationshipId?: RelationshipId;
  availableRelationshipIds: readonly RelationshipId[];
}

export type EnvironmentalEvent =
  | { type: 'proximity'; normalizedDistance: number }
  | { type: 'focus' }
  | { type: 'handle'; travel: number }
  | { type: 'relationship-reviewed'; relationshipId: RelationshipId }
  | { type: 'reset' };

export interface StimulationProfile {
  normalizedValue: number;
  particleCount: number;
  motionScale: number;
  glowStrength: number;
  soundGain: number;
}

const MAX_SIGNALS = 3;
const NEAR_THRESHOLD = 0.42;
const HANDLE_THRESHOLD = 24;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
}

export function validateSemanticFieldSignals(signals: readonly SemanticFieldSignal[]) {
  if (signals.length === 0 || signals.length > MAX_SIGNALS) return false;
  const ids = new Set<string>();
  return signals.every(signal => {
    const source = getDestinationDefinition(signal.sourceDestinationId);
    const target = getDestinationDefinition(signal.targetDestinationId);
    const copyIsValid = Boolean(
      signal.sourceTitle.trim()
      && signal.targetTitle.trim()
      && signal.explanation.trim(),
    );
    const relationshipIsUnique = isRelationshipId(signal.relationshipId)
      && !ids.has(signal.relationshipId);
    ids.add(signal.relationshipId);
    return relationshipIsUnique
      && copyIsValid
      && source?.status === 'canonical'
      && target?.status === 'canonical'
      && source.href === signal.sourceHref
      && target.href === signal.targetHref
      && source.id !== target.id;
  });
}

export function createEnvironmentalState(
  signals: readonly SemanticFieldSignal[],
): EnvironmentalState {
  return {
    stage: 'dormant',
    proximity: 1,
    handleTravel: 0,
    availableRelationshipIds: validateSemanticFieldSignals(signals)
      ? signals.map(signal => signal.relationshipId)
      : [],
  };
}

export function reduceEnvironmentalState(
  state: EnvironmentalState,
  event: EnvironmentalEvent,
): EnvironmentalState {
  if (event.type === 'reset') {
    return {
      stage: 'dormant',
      proximity: 1,
      handleTravel: 0,
      availableRelationshipIds: state.availableRelationshipIds,
    };
  }

  if (event.type === 'focus') {
    return state.stage === 'dormant' ? { ...state, stage: 'near', proximity: 0 } : state;
  }

  if (event.type === 'proximity') {
    const proximity = clamp(event.normalizedDistance);
    return {
      ...state,
      proximity,
      stage: state.stage === 'dormant' && proximity <= NEAR_THRESHOLD ? 'near' : state.stage,
    };
  }

  if (event.type === 'handle') {
    if (state.stage === 'dormant' || state.stage === 'connected') return state;
    const handleTravel = clamp(state.handleTravel + Math.abs(event.travel), 0, 360);
    return {
      ...state,
      handleTravel,
      stage: handleTravel >= HANDLE_THRESHOLD ? 'handled' : state.stage,
    };
  }

  if (
    event.type === 'relationship-reviewed'
    && state.stage === 'handled'
    && state.availableRelationshipIds.includes(event.relationshipId)
  ) {
    return {
      ...state,
      stage: 'connected',
      activeRelationshipId: event.relationshipId,
    };
  }

  return state;
}

export function createStimulationProfile(
  value: number,
  options: { reducedMotionRequested: boolean; soundEnabled: boolean },
): StimulationProfile {
  const requested = clamp(value);
  const normalizedValue = options.reducedMotionRequested ? Math.min(requested, 0.18) : requested;
  return {
    normalizedValue,
    particleCount: options.reducedMotionRequested ? 0 : Math.round(2 + normalizedValue * 10),
    motionScale: options.reducedMotionRequested ? 0 : 0.2 + normalizedValue * 0.8,
    glowStrength: 0.22 + normalizedValue * 0.68,
    soundGain: options.soundEnabled ? normalizedValue * 0.3 : 0,
  };
}

