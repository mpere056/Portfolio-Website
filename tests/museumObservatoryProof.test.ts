import { stat } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSEUM_OBSERVATORY_PROOF_ASPECT,
  MUSEUM_OBSERVATORY_PROOF_ASSETS,
  MUSEUM_OBSERVATORY_PROOF_LAYERS,
} from '@/lib/museum/observatoryProof';

describe('Museum observatory compositor proof', () => {
  it('uses a bounded decomposed east-observatory stack', () => {
    expect(MUSEUM_OBSERVATORY_PROOF_ASPECT).toBeCloseTo(852 / 790);
    expect(Object.keys(MUSEUM_OBSERVATORY_PROOF_ASSETS)).toEqual([
      'field',
      'observatory',
      'city',
      'portal',
      'fallback',
    ]);
    expect(Object.values(MUSEUM_OBSERVATORY_PROOF_ASSETS).every(asset => asset.includes('museum-observatory-proof'))).toBe(true);
  });

  it('keeps architecture stable while giving temporal jobs to its surrounding systems', () => {
    const ids = MUSEUM_OBSERVATORY_PROOF_LAYERS.map(layer => layer.id);
    expect(new Set(ids)).toHaveLength(ids.length);
    expect(ids).toEqual(expect.arrayContaining([
      'observatory:field',
      'observatory:lattice',
      'observatory:refraction',
      'observatory:orb',
      'observatory:city',
      'observatory:portal',
      'observatory:currents',
      'observatory:atmosphere',
      'observatory:diagram',
      'observatory:particles',
      'observatory:attention',
      'observatory:fallback',
    ]));
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:currents')?.medium)
      .toBe('procedural-shader');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:particles')?.medium)
      .toBe('procedural-geometry');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:orb')?.medium)
      .toBe('procedural-geometry');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:city')?.temporalJob)
      .toContain('excluding the foreground dome, podium, and steps');
  });

  it('ships a bounded particle-free runtime stack', async () => {
    const files = await Promise.all(Object.values(MUSEUM_OBSERVATORY_PROOF_ASSETS).map(async asset => {
      const source = path.join(process.cwd(), 'public', asset);
      return stat(source);
    }));
    expect(files.every(file => file.size > 0)).toBe(true);
    expect(files.reduce((total, file) => total + file.size, 0)).toBeLessThan(650 * 1024);
  });
});
