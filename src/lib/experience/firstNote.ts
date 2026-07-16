export const FIRST_NOTE_PHASES = ['uninitialized', 'waiting', 'revealing', 'ready'] as const;
export type FirstNotePhase = (typeof FIRST_NOTE_PHASES)[number];

export const FIRST_NOTE_AUDIO_STATES = ['idle', 'playing', 'blocked', 'unavailable'] as const;
export type FirstNoteAudioState = (typeof FIRST_NOTE_AUDIO_STATES)[number];

export type FirstNoteVisitor = 'unknown' | 'first' | 'returning' | 'bypass';

export interface FirstNoteState {
  phase: FirstNotePhase;
  visitor: FirstNoteVisitor;
  audio: FirstNoteAudioState;
  reducedMotionRequested: boolean;
}

export type FirstNoteEvent =
  | {
    type: 'hydrated';
    enabled: boolean;
    firstNoteCompleted: boolean;
    reducedMotionRequested: boolean;
    hasCheckpoint: boolean;
  }
  | { type: 'wake.requested' }
  | { type: 'reveal.completed' }
  | { type: 'audio.changed'; audio: FirstNoteAudioState }
  | { type: 'reset.requested' };

export type FirstNoteEffect =
  | 'persist-completion'
  | 'restore-checkpoint'
  | 'reset-exploration';

export interface FirstNoteTransition {
  state: FirstNoteState;
  effects: readonly FirstNoteEffect[];
}

export interface FirstNotePresentation {
  illumination: 'dark' | 'awakening' | 'visible';
  navigationVisible: boolean;
  wakeControlVisible: boolean;
  animateReveal: boolean;
}

export const INITIAL_FIRST_NOTE_STATE: FirstNoteState = {
  phase: 'uninitialized',
  visitor: 'unknown',
  audio: 'idle',
  reducedMotionRequested: false,
};

function unchanged(state: FirstNoteState): FirstNoteTransition {
  return { state, effects: [] };
}

export function transitionFirstNote(
  state: FirstNoteState,
  event: FirstNoteEvent,
): FirstNoteTransition {
  switch (event.type) {
    case 'hydrated': {
      if (!event.enabled) {
        return {
          state: {
            phase: 'ready',
            visitor: 'bypass',
            audio: state.audio,
            reducedMotionRequested: event.reducedMotionRequested,
          },
          effects: [],
        };
      }
      if (event.firstNoteCompleted) {
        return {
          state: {
            phase: 'ready',
            visitor: 'returning',
            audio: state.audio,
            reducedMotionRequested: event.reducedMotionRequested,
          },
          effects: event.hasCheckpoint ? ['restore-checkpoint'] : [],
        };
      }
      return {
        state: {
          phase: 'waiting',
          visitor: 'first',
          audio: state.audio,
          reducedMotionRequested: event.reducedMotionRequested,
        },
        effects: [],
      };
    }

    case 'wake.requested': {
      if (state.phase !== 'waiting') return unchanged(state);
      if (state.reducedMotionRequested) {
        return {
          state: { ...state, phase: 'ready' },
          effects: ['persist-completion'],
        };
      }
      return {
        state: { ...state, phase: 'revealing' },
        effects: [],
      };
    }

    case 'reveal.completed': {
      if (state.phase !== 'revealing') return unchanged(state);
      return {
        state: { ...state, phase: 'ready' },
        effects: ['persist-completion'],
      };
    }

    case 'audio.changed':
      return {
        state: { ...state, audio: event.audio },
        effects: [],
      };

    case 'reset.requested':
      return {
        state: {
          phase: 'waiting',
          visitor: 'first',
          audio: 'idle',
          reducedMotionRequested: state.reducedMotionRequested,
        },
        effects: ['reset-exploration'],
      };
  }
}

export function getFirstNotePresentation(state: FirstNoteState): FirstNotePresentation {
  return {
    illumination: state.phase === 'ready'
      ? 'visible'
      : state.phase === 'revealing'
        ? 'awakening'
        : 'dark',
    navigationVisible: state.phase === 'ready',
    wakeControlVisible: state.phase === 'waiting',
    animateReveal: state.phase === 'revealing' && !state.reducedMotionRequested,
  };
}
