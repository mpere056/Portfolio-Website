'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAudioStore } from '@/lib/store';
import {
  getFirstNotePresentation,
  INITIAL_FIRST_NOTE_STATE,
  transitionFirstNote,
  type FirstNoteEvent,
  type FirstNotePresentation,
  type FirstNoteState,
} from '@/lib/experience/firstNote';
import type { ExperienceCheckpoint } from '@/lib/portfolioContracts';
import { useExplorationWorld } from './ExplorationWorldProvider';

export interface FirstNoteExperienceValue {
  state: FirstNoteState;
  presentation: FirstNotePresentation;
  restoredCheckpoint?: ExperienceCheckpoint;
  wake(): void;
  reset(): void;
}

function bypassState() {
  return transitionFirstNote(INITIAL_FIRST_NOTE_STATE, {
    type: 'hydrated',
    enabled: false,
    firstNoteCompleted: false,
    reducedMotionRequested: false,
    hasCheckpoint: false,
  }).state;
}

export function FirstNoteExperience({
  children,
  enabled,
  revealDurationMs = 1600,
}: {
  children: (value: FirstNoteExperienceValue) => ReactNode;
  enabled: boolean;
  revealDurationMs?: number;
}) {
  const audioEl = useAudioStore(state => state.audioEl);
  const {
    store: explorationStore,
    state: explorationState,
    ready: explorationReady,
  } = useExplorationWorld();
  const initialState = enabled ? INITIAL_FIRST_NOTE_STATE : bypassState();
  const stateRef = useRef(initialState);
  const [state, setState] = useState(initialState);
  const [restoredCheckpoint, setRestoredCheckpoint] = useState<ExperienceCheckpoint>();
  const revealTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const applyEvent = useCallback((event: FirstNoteEvent) => {
    const result = transitionFirstNote(stateRef.current, event);
    stateRef.current = result.state;
    setState(result.state);

    for (const effect of result.effects) {
      if (effect === 'persist-completion') {
        explorationStore.getState().applyDepthTransition('home:first-note', {
          destinationId: 'destination:home',
          stage: 'approach',
        });
        explorationStore.getState().setFirstNoteCompleted(true);
      } else if (effect === 'restore-checkpoint') {
        setRestoredCheckpoint(explorationStore.getState().discovery.lastCheckpoint);
      } else if (effect === 'reset-exploration') {
        setRestoredCheckpoint(undefined);
        void explorationStore.getState().resetExploration();
      }
    }
    return result;
  }, [explorationStore]);

  const wake = useCallback(() => {
    const result = applyEvent({ type: 'wake.requested' });
    if (result.state.phase === 'revealing') {
      clearTimeout(revealTimer.current);
      revealTimer.current = setTimeout(() => {
        applyEvent({ type: 'reveal.completed' });
      }, revealDurationMs);
    }

    if (!audioEl) {
      applyEvent({ type: 'audio.changed', audio: 'unavailable' });
      return;
    }
    void audioEl.play()
      .then(() => applyEvent({ type: 'audio.changed', audio: 'playing' }))
      .catch(() => applyEvent({ type: 'audio.changed', audio: 'blocked' }));
  }, [applyEvent, audioEl, revealDurationMs]);

  const reset = useCallback(() => {
    clearTimeout(revealTimer.current);
    applyEvent({ type: 'reset.requested' });
  }, [applyEvent]);

  useEffect(() => {
    if (!enabled || !explorationReady) return;
    const systemReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    applyEvent({
      type: 'hydrated',
      enabled: true,
      firstNoteCompleted: explorationState.discovery.firstNoteCompleted,
      reducedMotionRequested: explorationState.stimulation.reducedMotionRequested || systemReducedMotion,
      hasCheckpoint: Boolean(explorationState.discovery.lastCheckpoint),
    });
  }, [
    applyEvent,
    enabled,
    explorationReady,
    explorationState.discovery.firstNoteCompleted,
    explorationState.discovery.lastCheckpoint,
    explorationState.stimulation.reducedMotionRequested,
  ]);

  useEffect(() => {
    if (!enabled || state.phase !== 'waiting') return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, button, [contenteditable="true"]')) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        wake();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, state.phase, wake]);

  useEffect(() => () => {
    clearTimeout(revealTimer.current);
  }, []);

  return children({
    state,
    presentation: getFirstNotePresentation(state),
    ...(restoredCheckpoint ? { restoredCheckpoint } : {}),
    wake,
    reset,
  });
}
