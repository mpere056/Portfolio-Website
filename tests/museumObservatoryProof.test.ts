import { stat } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSEUM_OBSERVATORY_PROOF_ASPECT,
  MUSEUM_OBSERVATORY_PROOF_ASSETS,
  MUSEUM_OBSERVATORY_PROOF_LAYERS,
} from '@/lib/museum/observatoryProof';

describe('Museum observatory compositor proof', () => {
  it('uses a bounded east-observatory crop', () => {
    expect(MUSEUM_OBSERVATORY_PROOF_ASPECT).toBeCloseTo(852 / 790);
    expect(MUSEUM_OBSERVATORY_PROOF_ASSETS.crop).toContain('museum-observatory-proof');
  });

  it('keeps architecture stable while giving temporal jobs to its surrounding systems', () => {
    const ids = MUSEUM_OBSERVATORY_PROOF_LAYERS.map(layer => layer.id);
    expect(new Set(ids)).toHaveLength(ids.length);
    expect(ids).toEqual(expect.arrayContaining([
      'observatory:structure',
      'observatory:refraction',
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
  });

  it('ships a compact fallback derivative', async () => {
    const source = path.join(process.cwd(), 'public', MUSEUM_OBSERVATORY_PROOF_ASSETS.crop);
    const file = await stat(source);
    expect(file.size).toBeGreaterThan(0);
    expect(file.size).toBeLessThan(350 * 1024);
  });
});

