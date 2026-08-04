import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSIC_LIQUID_LANDSCAPES,
  MUSIC_LIQUID_PROOF,
  MUSIC_WORLD_PROFILES,
  musicLiquidInitialQuality,
  musicLiquidLandscapeIndex,
  musicLiquidLocalAttention,
  musicLiquidMotionScale,
  musicLiquidPressurePhase,
  musicLiquidQualityWeight,
  musicLiquidTerritoryMask,
} from '@/lib/artDirection/musicLiquidLandscape';

const root = process.cwd();

describe('Music Liquid Landscape proof contract', () => {
  it('offers five ordered landscape grammars through one active review runtime', () => {
    expect(MUSIC_LIQUID_LANDSCAPES.map(landscape => landscape.id)).toEqual([
      'tidal-meadow',
      'nacre-terraces',
      'resonant-archipelago',
      'glass-delta',
      'harmonic-dunes',
    ]);
    expect(new Set(MUSIC_LIQUID_LANDSCAPES.map(landscape => landscape.id)).size).toBe(5);
    expect(musicLiquidLandscapeIndex('tidal-meadow')).toBe(0);
    expect(musicLiquidLandscapeIndex('harmonic-dunes')).toBe(4);
  });

  it('assigns every study a unique full-world profile and world form', () => {
    const ids = MUSIC_LIQUID_LANDSCAPES.map(landscape => landscape.id);
    const profiles = ids.map(id => MUSIC_WORLD_PROFILES[id]);

    expect(profiles.map(profile => profile.id)).toEqual(ids);
    expect(new Set(profiles.map(profile => profile.worldForm)).size).toBe(5);
    expect(new Set(profiles.map(profile => profile.sky.join('|'))).size).toBe(5);
    expect(new Set(profiles.map(profile => profile.ground.join('|'))).size).toBe(5);
    expect(new Set(profiles.map(profile => profile.grass.join('|'))).size).toBe(5);
  });

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
    expect(component).toContain('function MusicLandscapeReview');
    expect(component).toContain('function WorldScaleMusicForms');
    expect(component).toContain("musicWorldForm: 'terrain-wide-tidal-material'");
    expect(component).toContain("musicWorldForm: 'monumental-nacre-terraces'");
    expect(component).toContain("musicWorldForm: 'suspended-archipelago'");
    expect(component).toContain("musicWorldForm: 'spring-petal-field'");
    expect(component).toContain("musicWorldForm: 'harmonic-wave-cathedral'");
    expect(component).toContain('<WorldScaleMusicForms');
    expect(component).toContain('profile={worldProfile}');
    expect(component).toContain('data-music-landscape={musicLiquidProof ? musicLandscape : \'off\'}');
    expect(component).toContain("musicLandscapeAccent: 'nacre-terraces'");
    expect(component).toContain("musicLandscapeAccent: 'resonant-archipelago'");
    expect(component).toContain("musicLandscapeAccent: 'spring-petal-study'");
    expect(component).toContain("musicLandscapeAccent: 'harmonic-dunes'");
    expect(component).toContain('function MusicWorldAirborneMatter');
    expect(component).toContain("fire-embers");
    expect(component).toContain("spring-cherry-petals");
    expect(component).toContain('float scoreA = pow');
    expect(component).toContain('float scoreC = pow');
    expect(component).toContain('vec3 flameColor = mix');
    expect(component).toContain('float flameDissolve = smoothstep');
    expect(component).toContain("worldEcology: 'distant-wildfire-smoke'");
    expect(component).not.toContain("musicWorldForm: 'reflective-glass-sculpture'");
    expect(component).not.toContain('transmission={0.72}');
    expect(component).toContain('vec2 fromInstrument = vWorldRoot');
    expect(component).toContain('vec3 chromaticRefraction = vec3');
    expect(component).toContain('float spatialLens = pow');
    expect(component).toContain('uLiquidMotion: { value: reducedMotion ? 0 : 1 }');
    expect(component).toContain('* uLiquidMotion');
    expect(component).toContain('function LiquidTerritorySurface');
    expect(component).not.toContain('<LiquidTerritorySurface');
    expect(component).toContain('every authored hill can liquefy');
    expect(component).toContain('float hillMaterial = smoothstep');
    expect(component).toContain('function MusicLiquidInteractionController');
    expect(component).toContain('uniform float uLiquidAttention');
    expect(component).toContain('uniform float uLiquidReflection');
    expect(component).toContain('uniform float uLiquidReply');
    expect(component).toContain('float liquidFbm(vec2 point)');
    expect(component).toContain('vec2 organicUv = pressureUv + warp * 1.05');
    expect(component).toContain('float liquidVein = 1.0 - abs(');
    expect(component).toContain('attribute float aMeadowMask');
    expect(component).toContain('float elevatedMeadow = smoothstep');
    expect(component).toContain('vec3 terrainLitLiquid = color * 0.34 + liquidColor * 0.76');
    expect(component).not.toContain('float pressurePhase = fract');
    expect(component).toContain('runtime.riverReply = THREE.MathUtils.damp');
    expect(component).toContain('data-music-liquid-quality');
    expect(component).toContain("onQualityChange(tier.current >= 2 ? 'calm' : 'balanced')");
    expect(component).toContain("canvas.addEventListener('webglcontextlost'");
    expect(component).not.toContain('EffectComposer');
  });
});
