import { describe, expect, it } from 'vitest';
import {
  createEnvironmentalState,
  createStimulationProfile,
  reduceEnvironmentalState,
  validateSemanticFieldSignals,
  type SemanticFieldSignal,
} from '@/lib/experience/environment';

const signal: SemanticFieldSignal = {
  relationshipId: 'relationship:dreamlife-documented',
  sourceDestinationId: 'destination:museum-project-dreamlife',
  sourceTitle: 'Dreamlife',
  sourceHref: '/projects/dreamlife',
  targetDestinationId: 'destination:post-dreamlife-building-a-life-design-loop',
  targetTitle: 'Building a life-design loop',
  targetHref: 'https://dreamlife.marknperera.ca/blog/building-a-life-design-loop',
  explanation: 'The product loop is documented through its build note.',
  strength: 'primary',
};

describe('environmental response rules', () => {
  it('accepts only a bounded set of canonical graph-backed signals', () => {
    expect(validateSemanticFieldSignals([signal])).toBe(true);
    expect(validateSemanticFieldSignals([])).toBe(false);
    expect(validateSemanticFieldSignals(Array.from({ length: 4 }, (_, index) => ({
      ...signal,
      relationshipId: `relationship:bounded-${index}` as const,
    })))).toBe(false);
    expect(validateSemanticFieldSignals([{ ...signal, targetHref: 'https://evil.example' }])).toBe(false);
    expect(validateSemanticFieldSignals([{ ...signal, targetDestinationId: signal.sourceDestinationId }])).toBe(false);
  });

  it('requires proximity before handling and handling before semantic light', () => {
    const initial = createEnvironmentalState([signal]);
    const ignoredHandle = reduceEnvironmentalState(initial, { type: 'handle', travel: 40 });
    expect(ignoredHandle).toEqual(initial);

    const near = reduceEnvironmentalState(initial, { type: 'proximity', normalizedDistance: 0.2 });
    expect(near.stage).toBe('near');
    const handled = reduceEnvironmentalState(near, { type: 'handle', travel: 24 });
    expect(handled.stage).toBe('handled');
    const connected = reduceEnvironmentalState(handled, {
      type: 'relationship-reviewed',
      relationshipId: signal.relationshipId,
    });
    expect(connected).toMatchObject({
      stage: 'connected',
      activeRelationshipId: signal.relationshipId,
    });
  });

  it('rejects unreviewed relationships and resets without losing the reviewed set', () => {
    const handled = reduceEnvironmentalState(
      reduceEnvironmentalState(createEnvironmentalState([signal]), { type: 'focus' }),
      { type: 'handle', travel: 40 },
    );
    expect(reduceEnvironmentalState(handled, {
      type: 'relationship-reviewed',
      relationshipId: 'relationship:not-reviewed',
    })).toEqual(handled);
    expect(reduceEnvironmentalState(handled, { type: 'reset' })).toEqual({
      stage: 'dormant',
      proximity: 1,
      handleTravel: 0,
      availableRelationshipIds: [signal.relationshipId],
    });
  });

  it('maps continuous stimulation safely and keeps sound opt-in', () => {
    expect(createStimulationProfile(0.5, {
      reducedMotionRequested: false,
      soundEnabled: false,
    })).toEqual({
      normalizedValue: 0.5,
      particleCount: 7,
      motionScale: 0.6000000000000001,
      glowStrength: 0.56,
      soundGain: 0,
    });
    const reduced = createStimulationProfile(1, {
      reducedMotionRequested: true,
      soundEnabled: true,
    });
    expect(reduced).toMatchObject({ particleCount: 0, motionScale: 0, normalizedValue: 0.18 });
    expect(reduced.soundGain).toBeLessThanOrEqual(0.054);
    expect(createStimulationProfile(1, {
      reducedMotionRequested: false,
      soundEnabled: false,
    }).soundGain).toBe(0);
  });
});
