import { describe, expect, it } from 'vitest';
import {
  getFirstNotePresentation,
  INITIAL_FIRST_NOTE_STATE,
  transitionFirstNote,
  type FirstNoteState,
} from '@/lib/experience/firstNote';

function hydrate(options: {
  enabled?: boolean;
  firstNoteCompleted?: boolean;
  reducedMotionRequested?: boolean;
  hasCheckpoint?: boolean;
} = {}) {
  return transitionFirstNote(INITIAL_FIRST_NOTE_STATE, {
    type: 'hydrated',
    enabled: options.enabled ?? true,
    firstNoteCompleted: options.firstNoteCompleted ?? false,
    reducedMotionRequested: options.reducedMotionRequested ?? false,
    hasCheckpoint: options.hasCheckpoint ?? false,
  });
}

describe('First Note state model', () => {
  it('bypasses invisibly when the feature flag is disabled', () => {
    const result = hydrate({ enabled: false });

    expect(result).toMatchObject({
      state: { phase: 'ready', visitor: 'bypass' },
      effects: [],
    });
    expect(getFirstNotePresentation(result.state).navigationVisible).toBe(true);
  });

  it('keeps a first visit dark and usable through one clear wake control', () => {
    const result = hydrate();

    expect(result.state).toMatchObject({ phase: 'waiting', visitor: 'first' });
    expect(getFirstNotePresentation(result.state)).toEqual({
      illumination: 'dark',
      navigationVisible: false,
      wakeControlVisible: true,
      animateReveal: false,
    });
  });

  it('restores a returning visitor without replaying the reveal', () => {
    const result = hydrate({ firstNoteCompleted: true, hasCheckpoint: true });

    expect(result).toMatchObject({
      state: { phase: 'ready', visitor: 'returning' },
      effects: ['restore-checkpoint'],
    });
    expect(getFirstNotePresentation(result.state)).toMatchObject({
      illumination: 'visible',
      navigationVisible: true,
      animateReveal: false,
    });
  });

  it('persists completion only after the animated reveal becomes usable', () => {
    const waiting = hydrate().state;
    const waking = transitionFirstNote(waiting, { type: 'wake.requested' });

    expect(waking).toMatchObject({ state: { phase: 'revealing' }, effects: [] });
    expect(getFirstNotePresentation(waking.state).navigationVisible).toBe(false);

    const ready = transitionFirstNote(waking.state, { type: 'reveal.completed' });
    expect(ready).toMatchObject({
      state: { phase: 'ready' },
      effects: ['persist-completion'],
    });
    expect(transitionFirstNote(ready.state, { type: 'reveal.completed' }).effects).toEqual([]);
  });

  it('completes immediately for reduced motion without losing first-visit semantics', () => {
    const waiting = hydrate({ reducedMotionRequested: true }).state;
    const result = transitionFirstNote(waiting, { type: 'wake.requested' });

    expect(result).toMatchObject({
      state: { phase: 'ready', visitor: 'first', reducedMotionRequested: true },
      effects: ['persist-completion'],
    });
    expect(getFirstNotePresentation(result.state).animateReveal).toBe(false);
  });

  it('never lets playing, blocked, or unavailable audio control visual readiness', () => {
    let state: FirstNoteState = transitionFirstNote(hydrate().state, {
      type: 'wake.requested',
    }).state;

    for (const audio of ['playing', 'blocked', 'unavailable'] as const) {
      const result = transitionFirstNote(state, { type: 'audio.changed', audio });
      expect(result.state.phase).toBe('revealing');
      expect(result.effects).toEqual([]);
      state = result.state;
    }

    expect(transitionFirstNote(state, { type: 'reveal.completed' })).toMatchObject({
      state: { phase: 'ready', audio: 'unavailable' },
      effects: ['persist-completion'],
    });
  });

  it('resets a ready visit to the first-visit boundary exactly once', () => {
    const returning = hydrate({ firstNoteCompleted: true }).state;
    const reset = transitionFirstNote(returning, { type: 'reset.requested' });

    expect(reset).toMatchObject({
      state: { phase: 'waiting', visitor: 'first', audio: 'idle' },
      effects: ['reset-exploration'],
    });
    expect(getFirstNotePresentation(reset.state).wakeControlVisible).toBe(true);
  });
});
