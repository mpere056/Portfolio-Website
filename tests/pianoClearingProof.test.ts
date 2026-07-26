import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PIANO_CLEARING_PERFORMANCE,
  pianoClearingTerrainHeight,
} from '@/lib/artDirection/pianoClearing';

const root = process.cwd();

describe('piano clearing Home proof', () => {
  it('keeps the first environmental proof deliberately bounded', () => {
    expect(PIANO_CLEARING_PERFORMANCE.grassInstances).toBeLessThanOrEqual(800);
    expect(PIANO_CLEARING_PERFORMANCE.maxDpr).toBeLessThanOrEqual(1.25);
    expect(PIANO_CLEARING_PERFORMANCE.horizonTrees).toBeLessThanOrEqual(20);
    expect(PIANO_CLEARING_PERFORMANCE.realtimeShadows).toBe(false);
    expect(PIANO_CLEARING_PERFORMANCE.postProcessing).toBe(false);
  });

  it('creates a shallow clearing around the piano rather than a flat infinite world', () => {
    const center = pianoClearingTerrainHeight(0, 0);
    const outer = pianoClearingTerrainHeight(9, 8);
    expect(center).toBeLessThan(outer);
    expect(Math.abs(center)).toBeLessThan(0.5);
    expect(Math.abs(outer)).toBeLessThan(0.5);
  });

  it('uses the existing piano in one fixed, non-explorable scene', async () => {
    const component = await readFile(
      path.join(root, 'src/components/home/PianoClearingProof.tsx'),
      'utf8',
    );

    expect(component).toContain("useGLTF('/models/grand_piano/grand_piano_(GLB).gltf')");
    expect(component).toContain('<GrassField reducedMotion={reducedMotion} />');
    expect(component).toContain('<CameraRig reducedMotion={reducedMotion} />');
    expect(component).not.toContain('OrbitControls');
    expect(component).not.toContain('EffectComposer');
    expect(component).not.toContain('category-screen');
    expect(component).not.toContain('piano-player');
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
