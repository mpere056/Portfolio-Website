import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSIC_LIQUID_PROOF,
  musicLiquidPressurePhase,
  musicLiquidQualityWeight,
  musicLiquidTerritoryMask,
} from '@/lib/artDirection/musicLiquidLandscape';

const root = process.cwd();

describe('Music Liquid Landscape proof contract', () => {
  it('keeps the first territory and renderer additions bounded', () => {
    expect(MUSIC_LIQUID_PROOF.axes[0]).toBeLessThanOrEqual(6);
    expect(MUSIC_LIQUID_PROOF.axes[1]).toBeLessThanOrEqual(3.5);
    expect(MUSIC_LIQUID_PROOF.preferredAddedDrawCalls).toBeLessThanOrEqual(3);
    expect(MUSIC_LIQUID_PROOF.maxAddedDrawCalls).toBeLessThanOrEqual(4);
    expect(MUSIC_LIQUID_PROOF.fullScreenPasses).toBe(0);
    expect(MUSIC_LIQUID_PROOF.cpuGrassUpdatesPerFrame).toBe(0);
    expect(MUSIC_LIQUID_PROOF.maxLookupTextureSize).toBeLessThanOrEqual(256);
    expect(MUSIC_LIQUID_PROOF.maxCompressedAssetBytes).toBeLessThan(1_000_001);
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
    expect(component).toContain('musicLiquidProof ? <LiquidTerritorySurface');
    expect(component).not.toContain('EffectComposer');
  });
});
