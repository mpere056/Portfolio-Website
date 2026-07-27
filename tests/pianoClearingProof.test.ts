import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PIANO_CLEARING_PERFORMANCE,
  pianoClearingStreamCenter,
  pianoClearingStreamWidth,
  pianoClearingTerrainHeight,
} from '@/lib/artDirection/pianoClearing';

const root = process.cwd();

describe('piano clearing Home proof', () => {
  it('keeps the first environmental proof deliberately bounded', () => {
    expect(PIANO_CLEARING_PERFORMANCE.grassInstances).toBeLessThanOrEqual(1600);
    expect(PIANO_CLEARING_PERFORMANCE.pianoParticles).toBeLessThanOrEqual(9000);
    expect(PIANO_CLEARING_PERFORMANCE.maxDpr).toBeLessThanOrEqual(1.25);
    expect(PIANO_CLEARING_PERFORMANCE.horizonTrees).toBeLessThanOrEqual(48);
    expect(PIANO_CLEARING_PERFORMANCE.valleyRocks).toBeLessThanOrEqual(24);
    expect(PIANO_CLEARING_PERFORMANCE.wildflowers).toBeLessThanOrEqual(160);
    expect(PIANO_CLEARING_PERFORMANCE.atmosphericMotes).toBeLessThanOrEqual(200);
    expect(PIANO_CLEARING_PERFORMANCE.realtimeShadows).toBe(false);
    expect(PIANO_CLEARING_PERFORMANCE.postProcessing).toBe(false);
  });

  it('separates the piano plateau, steep descent, river floor, and opposite hillside', () => {
    const x = 0;
    const streamZ = pianoClearingStreamCenter(x);
    const plateau = pianoClearingTerrainHeight(x, 4);
    const cliffBottom = pianoClearingTerrainHeight(x, -6);
    const riverFloor = pianoClearingTerrainHeight(x, streamZ);
    const oppositeHill = pianoClearingTerrainHeight(x, -26);

    expect(plateau - cliffBottom).toBeGreaterThan(5);
    expect(plateau - riverFloor).toBeGreaterThan(5.5);
    expect(oppositeHill - riverFloor).toBeGreaterThan(3.5);
    expect(pianoClearingStreamWidth(x)).toBeGreaterThan(1.35);
    expect(pianoClearingStreamWidth(x)).toBeLessThan(1.7);
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
    expect(component).toContain('<ValleyDetails />');
    expect(component).toContain('new THREE.ShaderMaterial');
    expect(component).toContain('<GrassField reducedMotion={reducedMotion} />');
    expect(component).toContain('<CameraRig reducedMotion={reducedMotion} />');
    expect(component).not.toContain('<primitive object={piano}');
    expect(component).not.toContain('OrbitControls');
    expect(component).not.toContain('EffectComposer');
    expect(component).not.toContain('category-screen');
    expect(component).not.toContain('piano-player');
    expect(component).not.toContain('bridge');
    expect(component).not.toContain('train');
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
