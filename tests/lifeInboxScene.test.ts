import { describe, expect, it } from 'vitest';
import {
  getLifeInboxBoundaryPath,
  getLifeInboxSceneFrame,
  LIFEINBOX_SCENE_LAYERS,
} from '@/lib/museum/lifeInboxScene';

describe('LifeInbox dynamic scene model', () => {
  it('declares a complete route-owned layer pack with calm behavior', () => {
    expect(LIFEINBOX_SCENE_LAYERS.map(layer => layer.id)).toEqual([
      'lifeinbox:matte',
      'lifeinbox:ingress',
      'lifeinbox:material',
      'lifeinbox:local-core',
      'lifeinbox:outer-membrane',
      'lifeinbox:boundaries',
      'lifeinbox:return',
      'lifeinbox:evidence',
    ]);
    expect(LIFEINBOX_SCENE_LAYERS.every(layer => layer.meaning && layer.calmBehavior)).toBe(true);
  });

  it('turns diffuse capture into local settlement and a separate organization membrane', () => {
    const empty = getLifeInboxSceneFrame({
      captureStage: 'empty',
      depthStage: 'handle',
      selectedLayer: 'capture',
      pointer: { x: 1.4, y: -0.3 },
      stimulation: 0.5,
      reducedMotion: false,
    });
    const captured = getLifeInboxSceneFrame({
      captureStage: 'captured',
      depthStage: 'handle',
      selectedLayer: 'capture',
      pointer: { x: 0.1, y: 0.2 },
      stimulation: 0.5,
      reducedMotion: false,
    });
    const organized = getLifeInboxSceneFrame({
      captureStage: 'organized',
      depthStage: 'handle',
      selectedLayer: 'capture',
      pointer: { x: 0.1, y: 0.2 },
      stimulation: 0.5,
      reducedMotion: false,
    });

    expect(empty.pointer).toEqual({ x: 1, y: 0 });
    expect(empty.settlementStrength).toBe(0);
    expect(empty.ingressStrength).toBeGreaterThan(captured.ingressStrength);
    expect(captured.target).toEqual({ x: 0.5, y: 0.52 });
    expect(captured.settlementStrength).toBeGreaterThan(0.8);
    expect(organized.membraneStrength).toBeGreaterThan(captured.membraneStrength);
    expect(organized.particleCount).toBeGreaterThan(captured.particleCount);
  });

  it('expands trust boundaries with depth and activates the reminder return only on resurface', () => {
    const enter = getLifeInboxSceneFrame({
      captureStage: 'organized',
      depthStage: 'enter',
      selectedLayer: 'sync',
      pointer: { x: 0.5, y: 0.5 },
      stimulation: 0.4,
      reducedMotion: false,
    });
    const understand = getLifeInboxSceneFrame({
      captureStage: 'organized',
      depthStage: 'understand',
      selectedLayer: 'resurface',
      pointer: { x: 0.5, y: 0.5 },
      stimulation: 0.4,
      reducedMotion: false,
    });

    expect(enter.explosionStrength).toBe(0.58);
    expect(enter.returnStrength).toBe(0);
    expect(understand.explosionStrength).toBe(1);
    expect(understand.evidenceStrength).toBe(1);
    expect(understand.target).toEqual({ x: 0.78, y: 0.24 });
    expect(understand.returnStrength).toBeGreaterThan(0.8);
    expect(getLifeInboxBoundaryPath(3, 1)).toBe('M520 310 C616.6 364.0 724.5 121.3 804.0 144.0');
  });

  it('stops continuous material for reduced motion and hidden scenes without erasing state', () => {
    for (const options of [
      { reducedMotion: true, visible: true },
      { reducedMotion: false, visible: false },
    ]) {
      const frame = getLifeInboxSceneFrame({
        captureStage: 'organized',
        depthStage: 'understand',
        selectedLayer: 'resurface',
        pointer: { x: 0.2, y: 0.8 },
        stimulation: 1,
        ...options,
      });
      expect(frame.energy).toBe(0);
      expect(frame.particleCount).toBe(0);
      expect(frame.settled).toBe(true);
      expect(frame.explosionStrength).toBe(1);
      expect(frame.evidenceStrength).toBe(1);
      expect(frame.returnStrength).toBeGreaterThan(0);
    }
  });
});
