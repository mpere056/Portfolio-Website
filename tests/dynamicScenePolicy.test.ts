import { describe, expect, it } from 'vitest';
import {
  auditDynamicScenePolicies,
  DYNAMIC_SCENE_POLICIES,
  type DynamicScenePolicy,
} from '@/lib/artDirection/dynamicScenePolicy';

describe('dynamic scene maturation policy', () => {
  it('keeps every representative route distinct, calm, and bounded', () => {
    expect(DYNAMIC_SCENE_POLICIES.map(policy => policy.id)).toEqual([
      'museum', 'lifeinbox', 'dreamlife', 'sudoku', 'home', 'about', 'ai', 'reading',
    ]);
    expect(auditDynamicScenePolicies()).toEqual([]);
  });

  it('allows continuous motion only behind one dominant scheduler', () => {
    const continuous = DYNAMIC_SCENE_POLICIES.filter(policy => policy.temporalMode === 'continuous');
    expect(continuous.map(policy => policy.id)).toEqual(['museum', 'lifeinbox', 'home']);
    expect(continuous.every(policy => policy.dominantSchedulers === 1 && policy.pausesWhenHidden)).toBe(true);
    expect(DYNAMIC_SCENE_POLICIES.find(policy => policy.id === 'reading')?.dominantSchedulers).toBe(0);
  });

  it('reports lifecycle, calm, repetition, and scheduler regressions', () => {
    const invalid: DynamicScenePolicy[] = [
      {
        ...DYNAMIC_SCENE_POLICIES[0],
        id: 'unsafe',
        layers: ['same', 'same', 'third', 'fourth'],
        dominantSchedulers: 2,
        pausesWhenHidden: false,
        reducedMotionSettles: false,
        stableFallback: false,
        namedCause: '',
      },
    ];

    expect(auditDynamicScenePolicies(invalid)).toEqual(expect.arrayContaining([
      'unsafe: requires at least five authored layers',
      'unsafe: duplicate layer id',
      'unsafe: missing named cause',
      'unsafe: more than one dominant scheduler',
      'unsafe: hidden scenes must pause or remain event-bound',
      'unsafe: reduced motion must settle',
      'unsafe: stable fallback required',
    ]));
  });

  it('rejects a continuous scheduler on passive reading progress', () => {
    const reading = DYNAMIC_SCENE_POLICIES.find(policy => policy.id === 'reading');
    expect(reading).toBeDefined();
    expect(auditDynamicScenePolicies([{ ...reading!, dominantSchedulers: 1 }])).toContain(
      'reading: passive scroll cannot own a continuous scheduler',
    );
  });
});
