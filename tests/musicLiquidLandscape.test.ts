import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSIC_LIQUID_PROOF,
  musicLiquidInitialQuality,
  musicLiquidLocalAttention,
  musicLiquidMotionScale,
  musicLiquidPressurePhase,
  musicLiquidQualityWeight,
  musicLiquidTerritoryMask,
} from '@/lib/artDirection/musicLiquidLandscape';

const root = process.cwd();

describe('Music Liquid Landscape proof contract', () => {
  it('keeps the expanded review territory and renderer additions bounded', () => {
    expect(MUSIC_LIQUID_PROOF.axes[0]).toBeLessThanOrEqual(16);
    expect(MUSIC_LIQUID_PROOF.axes[1]).toBeLessThanOrEqual(7.5);
    expect(MUSIC_LIQUID_PROOF.preferredAddedDrawCalls).toBeLessThanOrEqual(3);
    expect(MUSIC_LIQUID_PROOF.maxAddedDrawCalls).toBeLessThanOrEqual(4);
    expect(MUSIC_LIQUID_PROOF.fullScreenPasses).toBe(0);
    expect(MUSIC_LIQUID_PROOF.cpuGrassUpdatesPerFrame).toBe(0);
    expect(MUSIC_LIQUID_PROOF.maxLookupTextureSize).toBeLessThanOrEqual(256);
    expect(MUSIC_LIQUID_PROOF.maxCompressedAssetBytes).toBeLessThan(1_000_001);
    expect(MUSIC_LIQUID_PROOF.attentionRadius).toBeLessThanOrEqual(0.5);
    expect(MUSIC_LIQUID_PROOF.riverResponseDamping)
      .toBeLessThan(MUSIC_LIQUID_PROOF.attentionDamping);
  });

  it('keeps attention local and strongest under the pointer', () => {
    expect(musicLiquidLocalAttention(0, 0, 0, 0, 1)).toBe(1);
    expect(musicLiquidLocalAttention(0, 0, 0.2, 0, 1)).toBeGreaterThan(0);
    expect(musicLiquidLocalAttention(0, 0, 0.2, 0, 1)).toBeLessThan(1);
    expect(musicLiquidLocalAttention(0, 0, 0.6, 0, 1)).toBe(0);
  });

  it('produces a soft bounded territory instead of a rectangular patch', () => {
    const [centerX, centerZ] = MUSIC_LIQUID_PROOF.center;
    expect(musicLiquidTerritoryMask(centerX, centerZ)).toBe(1);
    expect(musicLiquidTerritoryMask(centerX + MUSIC_LIQUID_PROOF.axes[0] * 0.9, centerZ))
      .toBeGreaterThan(0);
    expect(musicLiquidTerritoryMask(centerX + MUSIC_LIQUID_PROOF.axes[0] * 1.2, centerZ))
      .toBe(0);
  });

  it('uses a repeatable silent pressure clock and stable quality ladder', () => {
    expect(musicLiquidPressurePhase(0)).toBe(0);
    expect(musicLiquidPressurePhase(1 / MUSIC_LIQUID_PROOF.travelSpeed)).toBe(0);
    expect(musicLiquidQualityWeight('full')).toBeGreaterThan(
      musicLiquidQualityWeight('balanced'),
    );
    expect(musicLiquidQualityWeight('balanced')).toBeGreaterThan(
      musicLiquidQualityWeight('calm'),
    );
    expect(musicLiquidQualityWeight('failure')).toBe(0);
    expect(musicLiquidMotionScale('full')).toBe(1);
    expect(musicLiquidMotionScale('calm')).toBeLessThan(
      musicLiquidMotionScale('balanced'),
    );
    expect(musicLiquidMotionScale('reduced')).toBe(0);
  });

  it('selects a deterministic capability tier without reducing grass', () => {
    expect(musicLiquidInitialQuality({
      reducedMotion: false,
      webglAvailable: true,
      hardwareConcurrency: 12,
      deviceMemory: 16,
    })).toBe('full');
    expect(musicLiquidInitialQuality({
      reducedMotion: false,
      webglAvailable: true,
      hardwareConcurrency: 4,
      deviceMemory: 8,
    })).toBe('balanced');
    expect(musicLiquidInitialQuality({
      reducedMotion: true,
      webglAvailable: true,
    })).toBe('reduced');
    expect(musicLiquidInitialQuality({
      reducedMotion: false,
      webglAvailable: false,
    })).toBe('failure');
  });

  it('isolates the animated territory to a private no-index proof route', async () => {
    const [component, proofPage, homePage] = await Promise.all([
      readFile(path.join(root, 'src/components/home/PianoClearingProof.tsx'), 'utf8'),
      readFile(path.join(root, 'src/app/music-liquid-proof/page.tsx'), 'utf8'),
      readFile(path.join(root, 'src/app/page.tsx'), 'utf8'),
    ]);

    expect(proofPage).toContain('robots: { index: false, follow: false }');
    expect(proofPage).toContain('<PianoClearingProof musicLiquidProof />');
    expect(homePage).toContain('<PianoClearingProof />');
    expect(homePage).not.toContain('musicLiquidProof');
    expect(component).toContain('function LiquidTerritorySurface');
    expect(component).toContain('uLiquidMotion: { value: reducedMotion ? 0 : 1 }');
    expect(component).toContain('* uLiquidMotion');
    expect(component).toContain('<LiquidTerritorySurface');
    expect(component).toContain('function MusicLiquidInteractionController');
    expect(component).toContain('uniform float uLiquidAttention');
    expect(component).toContain('uniform float uLiquidReflection');
    expect(component).toContain('uniform float uLiquidReply');
    expect(component).toContain('runtime.riverReply = THREE.MathUtils.damp');
    expect(component).toContain('data-music-liquid-quality');
    expect(component).toContain("onQualityChange(tier.current >= 2 ? 'calm' : 'balanced')");
    expect(component).toContain("canvas.addEventListener('webglcontextlost'");
    expect(component).not.toContain('EffectComposer');
  });
});
