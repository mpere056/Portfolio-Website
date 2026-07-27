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
    expect(PIANO_CLEARING_PERFORMANCE.grassInstances).toBeLessThanOrEqual(800);
    expect(PIANO_CLEARING_PERFORMANCE.pianoParticles).toBeLessThanOrEqual(6500);
    expect(PIANO_CLEARING_PERFORMANCE.maxDpr).toBeLessThanOrEqual(1.25);
    expect(PIANO_CLEARING_PERFORMANCE.horizonTrees).toBeLessThanOrEqual(24);
    expect(PIANO_CLEARING_PERFORMANCE.realtimeShadows).toBe(false);
    expect(PIANO_CLEARING_PERFORMANCE.postProcessing).toBe(false);
  });

  it('cuts a widening stream valley through a terrain shelf that falls toward the horizon', () => {
    const nearZ = 3;
    const farZ = -24;
    const nearCenter = pianoClearingStreamCenter(nearZ);
    const farCenter = pianoClearingStreamCenter(farZ);
    const nearValley = pianoClearingTerrainHeight(nearCenter, nearZ);
    const nearBank = pianoClearingTerrainHeight(nearCenter + 5, nearZ);
    const farValley = pianoClearingTerrainHeight(farCenter, farZ);

    expect(nearValley).toBeLessThan(nearBank);
    expect(farValley).toBeLessThan(nearValley);
    expect(pianoClearingStreamWidth(nearZ)).toBeGreaterThan(pianoClearingStreamWidth(farZ));
  });

  it('renders the existing piano as one bounded particle cloud in a fixed scenic world', async () => {
    const component = await readFile(
      path.join(root, 'src/components/home/PianoClearingProof.tsx'),
      'utf8',
    );

    expect(component).toContain("useGLTF('/models/grand_piano/grand_piano_(GLB).gltf')");
    expect(component).toContain('<ParticlePiano reducedMotion={reducedMotion} />');
    expect(component).toContain('<Stream reducedMotion={reducedMotion} />');
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
