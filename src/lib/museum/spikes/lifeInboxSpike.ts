export const LIFEINBOX_SYNTHETIC_CAPTURE = 'Remind me to make a drink in 10 minutes.';

export type LifeInboxSpikeStage = 'empty' | 'captured' | 'organized';

export interface LifeInboxSpikeState {
  stage: LifeInboxSpikeStage;
  rawText: string;
  localId?: string;
  destination?: {
    kind: 'reminder';
    title: string;
    schedule: string;
  };
}

export const initialLifeInboxSpikeState: LifeInboxSpikeState = {
  stage: 'empty',
  rawText: LIFEINBOX_SYNTHETIC_CAPTURE,
};

export function captureLifeInboxEntry(
  state: LifeInboxSpikeState,
  rawText = state.rawText,
): LifeInboxSpikeState {
  const normalized = rawText.trim();
  if (!normalized) return state;

  return {
    stage: 'captured',
    rawText: normalized,
    localId: 'local:lifeinbox:drink-reminder',
  };
}

export function organizeLifeInboxEntry(state: LifeInboxSpikeState): LifeInboxSpikeState {
  if (state.stage !== 'captured') return state;

  return {
    ...state,
    stage: 'organized',
    destination: {
      kind: 'reminder',
      title: 'Make a drink',
      schedule: 'In 10 minutes',
    },
  };
}

