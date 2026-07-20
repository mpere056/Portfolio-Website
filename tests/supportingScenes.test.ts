import { describe, expect, it } from 'vitest';
import { ABOUT_SCENE_LAYERS, getAboutSceneFrame } from '@/lib/artDirection/aboutScene';
import { AI_SCENE_LAYERS, getAISceneFrame } from '@/lib/artDirection/aiScene';
import { getHomeSceneFrame, HOME_SCENE_LAYERS } from '@/lib/artDirection/homeScene';
import { getReadingSceneFrame, READING_SCENE_LAYERS } from '@/lib/artDirection/readingScene';

describe('supporting route scene models', () => {
  it('awakens Home only after the first-note threshold', () => {
    expect(getHomeSceneFrame('waiting', false)).toEqual({ threshold: 0, fragment: 0, notation: 0.08 });
    expect(getHomeSceneFrame('ready', false)).toEqual({ threshold: 1, fragment: 0.86, notation: 0.74 });
    expect(new Set(HOME_SCENE_LAYERS).size).toBe(HOME_SCENE_LAYERS.length);
  });

  it('maps the inspected About event to deterministic refraction', () => {
    expect(getAboutSceneFrame(0, 5)).toEqual({ progress: 0, refraction: 0, orbit: 0.38 });
    expect(getAboutSceneFrame(4, 5).progress).toBe(1);
    expect(getAboutSceneFrame(2, 5).refraction).toBeCloseTo(0.78);
    expect(new Set(ABOUT_SCENE_LAYERS).size).toBe(ABOUT_SCENE_LAYERS.length);
  });

  it('opens the AI aperture and makes response state visible', () => {
    expect(getAISceneFrame({ open: false, activity: 'idle', contextAvailable: false })).toEqual({
      aperture: 0,
      signal: 0.3,
      context: 0.28,
    });
    expect(getAISceneFrame({ open: true, activity: 'responding', contextAvailable: true })).toEqual({
      aperture: 1,
      signal: 1,
      context: 1,
    });
    expect(new Set(AI_SCENE_LAYERS).size).toBe(AI_SCENE_LAYERS.length);
  });

  it('keeps reading scroll-bound and calm under reduced motion', () => {
    expect(getReadingSceneFrame(-1).progress).toBe(0);
    expect(getReadingSceneFrame(2).progress).toBe(1);
    expect(getReadingSceneFrame(0.5).disturbance).toBeCloseTo(0.72);
    expect(getReadingSceneFrame(0.5, true)).toEqual({ progress: 0.5, disturbance: 0, trace: 0.22 });
    expect(new Set(READING_SCENE_LAYERS).size).toBe(READING_SCENE_LAYERS.length);
  });
});
