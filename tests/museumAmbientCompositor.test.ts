import { stat } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSEUM_AMBIENT_PROOF_ASPECT,
  MUSEUM_AMBIENT_PROOF_ASSETS,
  MUSEUM_AMBIENT_PROOF_LAYERS,
  toProofScenePlacement,
} from '@/lib/museum/ambientProof';

describe('Museum ambient compositor proof', () => {
  it('uses code-generated motion where a static plate would limit material behavior', () => {
    expect(new Set(MUSEUM_AMBIENT_PROOF_LAYERS.map(layer => layer.id))).toHaveLength(MUSEUM_AMBIENT_PROOF_LAYERS.length);
    expect(MUSEUM_AMBIENT_PROOF_LAYERS.find(layer => layer.id === 'proof:current')?.medium).toBe('procedural-shader');
    expect(MUSEUM_AMBIENT_PROOF_LAYERS.find(layer => layer.id === 'proof:particles')?.medium).toBe('procedural-geometry');
    expect(MUSEUM_AMBIENT_PROOF_LAYERS.find(layer => layer.id === 'proof:fallback')?.medium).toBe('stable-fallback');
    expect(Object.keys(MUSEUM_AMBIENT_PROOF_ASSETS)).not.toContain('directionalCurrent');
  });

  it('maps authored pixel layouts into one stable orthographic scene', () => {
    expect(toProofScenePlacement({ x: 0, y: 0, width: 1402, height: 1122, z: 0 })).toEqual({
      position: [0, 0, 0],
      size: [MUSEUM_AMBIENT_PROOF_ASPECT * 2, 2],
    });
    const coral = toProofScenePlacement({ x: 0, y: 45, width: 820, height: 804, z: 0.45 });
    expect(coral.position[0]).toBeLessThan(0);
    expect(coral.size[0]).toBeGreaterThan(1);
    expect(coral.position[2]).toBe(0.45);
  });

  it('ships every declared derivative while keeping the animated set bounded', async () => {
    const publicRoot = path.join(process.cwd(), 'public');
    let animatedBytes = 0;
    for (const [key, source] of Object.entries(MUSEUM_AMBIENT_PROOF_ASSETS)) {
      const file = await stat(path.join(publicRoot, source));
      expect(file.size, source).toBeGreaterThan(0);
      if (key !== 'fallback') animatedBytes += file.size;
    }
    expect(animatedBytes).toBeLessThan(1.8 * 1024 * 1024);
  });
});
