import { describe, expect, it } from 'vitest';
import {
  MUSEUM_SCENE_LAYERS,
  getMuseumFilamentPath,
  getMuseumSceneFrame,
  getMuseumSignalProximity,
  normalizeMuseumScenePoint,
} from '@/lib/museum/scene';

describe('Museum dynamic scene model', () => {
  it('keeps every layer independently named with a calm behavior', () => {
    expect(MUSEUM_SCENE_LAYERS.map(layer => layer.id)).toEqual([
      'museum:matte',
      'museum:membrane',
      'museum:particles',
      'museum:aperture',
      'museum:relationships',
      'museum:signals',
      'museum:utilities',
    ]);
    expect(new Set(MUSEUM_SCENE_LAYERS.map(layer => layer.id))).toHaveLength(MUSEUM_SCENE_LAYERS.length);
    expect(MUSEUM_SCENE_LAYERS.every(layer => layer.calmBehavior.trim())).toBe(true);
  });

  it('bounds pointer input and maps the active signal to a stable aperture', () => {
    expect(normalizeMuseumScenePoint({ x: -2, y: 5 })).toEqual({ x: 0, y: 1 });
    const frame = getMuseumSceneFrame({
      pointer: { x: 0.8, y: 0.7 },
      activeSlug: 'lifeinbox',
      selectedSlug: 'lifeinbox',
      stimulation: 0.75,
      reducedMotion: false,
    });

    expect(frame.aperture).toEqual({ x: 0.13, y: 0.38 });
    expect(frame.energy).toBeGreaterThan(0.7);
    expect(frame.drift.x).toBeGreaterThan(0);
    expect(frame.drift.y).toBeGreaterThan(0);
    expect(frame.apertureStrength).toBeGreaterThan(0.7);
    expect(frame.filamentStrength).toBeGreaterThan(0.7);
    expect(frame.particleCount).toBeGreaterThan(30);
    expect(frame.settled).toBe(false);
  });

  it('settles continuous layers for reduced motion and hidden scenes', () => {
    const reduced = getMuseumSceneFrame({
      pointer: { x: 0.95, y: 0.95 },
      activeSlug: 'dreamlife',
      selectedSlug: 'dreamlife',
      stimulation: 1,
      reducedMotion: true,
    });
    expect(reduced.energy).toBe(0);
    expect(reduced.particleCount).toBe(0);
    expect(reduced.pointer).toEqual(reduced.aperture);
    expect(reduced.settled).toBe(true);

    const hidden = getMuseumSceneFrame({
      pointer: { x: 0.2, y: 0.3 },
      stimulation: 1,
      reducedMotion: false,
      visible: false,
    });
    expect(hidden.energy).toBe(0);
    expect(hidden.particleCount).toBe(0);
    expect(hidden.settled).toBe(true);
  });

  it('creates bounded proximity and deterministic reviewed-relationship paths', () => {
    expect(getMuseumSignalProximity({ x: 0.13, y: 0.38 }, 'lifeinbox', 0)).toBe(1);
    expect(getMuseumSignalProximity({ x: 1, y: 1 }, 'lifeinbox', 0)).toBe(0);
    expect(getMuseumFilamentPath('lifeinbox', 0)).toBe('M156.0 311.6 C525.4 201.6 855.8 147.9 1128.0 98.4');
  });
});
