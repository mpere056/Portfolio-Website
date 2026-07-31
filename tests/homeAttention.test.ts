import { describe, expect, it } from 'vitest';
import {
  HOME_TERRITORY_IDS,
  createHomeWorldState,
  persistedHomeAttention,
  reduceHomeAttention,
} from '@/lib/experience/homeAttention';

function targetTotal(state: ReturnType<typeof createHomeWorldState>) {
  return HOME_TERRITORY_IDS.reduce(
    (sum, id) => sum + state.territories[id].targetWeight,
    0,
  );
}

describe('Home territory attention model', () => {
  it('starts in a deliberate equal neutral state', () => {
    const state = createHomeWorldState();

    expect(state.mode).toBe('neutral');
    expect(state.dominantId).toBeNull();
    expect(targetTotal(state)).toBeCloseTo(1);
    expect(HOME_TERRITORY_IDS.map(id => state.territories[id].targetWeight))
      .toEqual(HOME_TERRITORY_IDS.map(() => 0.25));
  });

  it('turns a local proximity sample into one dominant territory', () => {
    const state = reduceHomeAttention(createHomeWorldState(), {
      type: 'sample-proximity',
      proximities: { play: 1, music: 0.1 },
    });

    expect(state.mode).toBe('attending');
    expect(state.dominantId).toBe('play');
    expect(state.territories.play.targetWeight)
      .toBeGreaterThan(state.territories.music.targetWeight);
    expect(state.territories.about.proximity).toBe(0);
    expect(targetTotal(state)).toBeCloseTo(1);
  });

  it('uses hysteresis to prevent a near-tie from flickering dominance', () => {
    const playDominant = reduceHomeAttention(createHomeWorldState(), {
      type: 'sample-proximity',
      proximities: { play: 1 },
    });
    const nearTie = reduceHomeAttention(playDominant, {
      type: 'sample-proximity',
      proximities: { play: 0.75, 'life-systems': 0.82 },
    });
    const clearSwitch = reduceHomeAttention(nearTie, {
      type: 'sample-proximity',
      proximities: { play: 0.1, 'life-systems': 1 },
    });

    expect(nearTie.dominantId).toBe('play');
    expect(clearSwitch.dominantId).toBe('life-systems');
    expect(clearSwitch.previousDominantId).toBe('play');
  });

  it('gives keyboard focus and explicit selection precedence over pointer proximity', () => {
    const pointer = reduceHomeAttention(createHomeWorldState(), {
      type: 'sample-proximity',
      proximities: { play: 1 },
    });
    const focused = reduceHomeAttention(pointer, { type: 'focus', id: 'about' });
    const selected = reduceHomeAttention(focused, { type: 'select', id: 'music' });

    expect(focused.dominantId).toBe('about');
    expect(selected.dominantId).toBe('music');
    expect(selected.mode).toBe('selected');
    expect(selected.territories.about.focused).toBe(false);
  });

  it('calms transient attention without discarding semantic selection', () => {
    const selected = reduceHomeAttention(createHomeWorldState(), {
      type: 'select',
      id: 'life-systems',
    });
    const attended = reduceHomeAttention(selected, {
      type: 'sample-proximity',
      proximities: { play: 1 },
    });
    const calm = reduceHomeAttention(attended, { type: 'calm' });

    expect(calm.mode).toBe('selected');
    expect(calm.dominantId).toBe('life-systems');
    expect(calm.territories['life-systems'].selected).toBe(true);
    expect(HOME_TERRITORY_IDS.every(id => calm.territories[id].proximity === 0)).toBe(true);
  });

  it('persists semantic selection, restores entered state, and not raw weights', () => {
    const entered = reduceHomeAttention(createHomeWorldState(), {
      type: 'enter',
      id: 'life-systems',
    });
    const animated = reduceHomeAttention(entered, { type: 'settle', deltaMs: 80 });
    const restored = createHomeWorldState(persistedHomeAttention(animated));

    expect(restored.mode).toBe('entered');
    expect(restored.dominantId).toBe('life-systems');
    expect(restored.territories['life-systems'].settledWeight).toBe(0.25);
  });

  it('retreats from entered to selected to neutral predictably', () => {
    const entered = reduceHomeAttention(createHomeWorldState(), {
      type: 'enter',
      id: 'play',
    });
    const selected = reduceHomeAttention(entered, { type: 'back' });
    const neutral = reduceHomeAttention(selected, { type: 'back' });

    expect(selected.mode).toBe('selected');
    expect(selected.dominantId).toBe('play');
    expect(neutral.mode).toBe('neutral');
    expect(neutral.dominantId).toBeNull();
    expect(persistedHomeAttention(neutral).selectedId).toBeNull();
  });

  it('settles inertially normally and immediately for reduced motion', () => {
    const target = reduceHomeAttention(createHomeWorldState(), {
      type: 'sample-proximity',
      proximities: { music: 1 },
    });
    const inertial = reduceHomeAttention(target, { type: 'settle', deltaMs: 16 });
    const reduced = reduceHomeAttention(target, {
      type: 'settle',
      deltaMs: 16,
      reducedMotion: true,
    });

    expect(inertial.territories.music.settledWeight)
      .toBeLessThan(target.territories.music.targetWeight);
    expect(reduced.territories.music.settledWeight)
      .toBe(target.territories.music.targetWeight);
  });
});
