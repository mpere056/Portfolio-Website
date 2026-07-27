import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PIANO_CLEARING_PERFORMANCE,
  pianoClearingRiverCenterX,
  pianoClearingRiverWidth,
  pianoClearingTerrainHeight,
  pianoClearingTreeAllowed,
} from '@/lib/artDirection/pianoClearing';

const root = process.cwd();

describe('piano clearing Home proof', () => {
  it('keeps the first environmental proof deliberately bounded', () => {
    expect(PIANO_CLEARING_PERFORMANCE.grassInstances).toBeLessThanOrEqual(11000);
    expect(PIANO_CLEARING_PERFORMANCE.pianoParticles).toBeLessThanOrEqual(9000);
    expect(PIANO_CLEARING_PERFORMANCE.maxDpr).toBeLessThanOrEqual(1.25);
    expect(PIANO_CLEARING_PERFORMANCE.horizonTrees).toBeLessThanOrEqual(60);
    expect(PIANO_CLEARING_PERFORMANCE.valleyRocks).toBeLessThanOrEqual(24);
    expect(PIANO_CLEARING_PERFORMANCE.wildflowers).toBeLessThanOrEqual(160);
    expect(PIANO_CLEARING_PERFORMANCE.atmosphericMotes).toBeLessThanOrEqual(200);
    expect(PIANO_CLEARING_PERFORMANCE.bridgeArches).toBe(5);
    expect(PIANO_CLEARING_PERFORMANCE.trainCars).toBeLessThanOrEqual(3);
    expect(PIANO_CLEARING_PERFORMANCE.realtimeShadows).toBe(false);
    expect(PIANO_CLEARING_PERFORMANCE.postProcessing).toBe(false);
  });

  it('separates the piano plateau, steep descent, river floor, and opposite hillside', () => {
    const nearZ = 4;
    const farZ = -27;
    const nearCenter = pianoClearingRiverCenterX(nearZ);
    const farCenter = pianoClearingRiverCenterX(farZ);
    const riverFloor = pianoClearingTerrainHeight(nearCenter, nearZ);
    const rightPlateau = pianoClearingTerrainHeight(nearCenter + 12, nearZ);
    const leftPlateau = pianoClearingTerrainHeight(nearCenter - 12, nearZ);

    expect(rightPlateau - riverFloor).toBeGreaterThan(6);
    expect(leftPlateau - riverFloor).toBeGreaterThan(5);
    expect(nearCenter).toBeLessThan(farCenter);
    expect(pianoClearingRiverWidth(nearZ)).toBeGreaterThan(3.5);
    expect(pianoClearingRiverWidth(farZ)).toBeLessThan(2);
  });

  it('keeps horizon trees clear of the river and steep ravine walls', () => {
    for (const z of [-28, -32, -36, -40]) {
      const riverCenter = pianoClearingRiverCenterX(z);
      expect(pianoClearingTreeAllowed(riverCenter, z)).toBe(false);
      expect(pianoClearingTreeAllowed(riverCenter + 3, z)).toBe(false);
      expect(pianoClearingTreeAllowed(riverCenter - 3, z)).toBe(false);
      expect(
        pianoClearingTreeAllowed(
          riverCenter + pianoClearingRiverWidth(z) + 9,
          z,
        ),
      ).toBe(true);
    }
  });

  it('renders the existing piano as one bounded particle cloud in a fixed scenic world', async () => {
    const component = await readFile(
      path.join(root, 'src/components/home/PianoClearingProof.tsx'),
      'utf8',
    );

    expect(component).toContain("useGLTF('/models/grand_piano/grand_piano_(GLB).gltf')");
    expect(component).toContain('<ParticlePiano reducedMotion={reducedMotion} />');
    expect(component).toContain('<Suspense fallback={null}>');
    expect(component).toContain('opacity: 0.18');
    expect(component).toContain('<Stream reducedMotion={reducedMotion} />');
    expect(component).toContain('data-river-flow="far-to-foreground"');
    expect(component).toContain('vUv.y * 46.0 + time * 2.3');
    expect(component).toContain('<ValleyDetails />');
    expect(component).toContain('new THREE.ShaderMaterial');
    expect(component).toContain('<GrassField reducedMotion={reducedMotion} />');
    expect(component).toContain('pianoClearingTreeAllowed(x, z)');
    expect(component).toContain('ref={crownHighlights}');
    expect(component).toContain('<StoneViaduct />');
    expect(component).toContain('<PassingTrain reducedMotion={reducedMotion} />');
    expect(component).toContain('<CameraRig reducedMotion={reducedMotion} />');
    expect(component).not.toContain('<primitive object={piano}');
    expect(component).not.toContain('OrbitControls');
    expect(component).not.toContain('EffectComposer');
    expect(component).not.toContain('category-screen');
    expect(component).not.toContain('piano-player');
    expect(component).not.toContain('shadowMap');
  });

  it('keeps the proof private and leaves canonical Home unchanged', async () => {
    const [proofPage, homePage] = await Promise.all([
      readFile(path.join(root, 'src/app/home-world-proof/page.tsx'), 'utf8'),
      readFile(path.join(root, 'src/app/page.tsx'), 'utf8'),
    ]);

    expect(proofPage).toContain('robots: { index: false, follow: false }');
    expect(proofPage).toContain('<PianoClearingProof />');
    expect(homePage).not.toContain('PianoClearingProof');
  });
});
