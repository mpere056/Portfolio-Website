import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSEUM_OBSERVATORY_FLOW_CONTROLS,
  MUSEUM_OBSERVATORY_FLOW_TIMING,
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
      'observatory:flows-rear',
      'observatory:flows-front',
      'observatory:atmosphere',
      'observatory:diagram',
      'observatory:particles',
      'observatory:attention',
      'observatory:fallback',
    ]));
    const flowLayers = MUSEUM_OBSERVATORY_PROOF_LAYERS.filter(layer => layer.id.startsWith('observatory:flows-'));
    expect(flowLayers).toHaveLength(2);
    expect(flowLayers.every(layer => layer.medium === 'procedural-shader')).toBe(true);
    expect(flowLayers.every(layer => layer.temporalJob.includes('code-generated'))).toBe(true);
    expect(flowLayers.every(layer => layer.temporalJob.includes('visibly traverse'))).toBe(true);
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:particles')?.medium)
      .toBe('procedural-geometry');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:orb')?.medium)
      .toBe('procedural-geometry');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:city')?.temporalJob)
      .toContain('excluding the foreground dome, podium, and steps');
  });

  it('keeps directional flow legible at human viewing speed without synchronizing every family', () => {
    const timings = Object.values(MUSEUM_OBSERVATORY_FLOW_TIMING);
    expect(MUSEUM_OBSERVATORY_FLOW_TIMING.leadCrossingSeconds).toBeLessThanOrEqual(2.5);
    expect(MUSEUM_OBSERVATORY_FLOW_TIMING.coreCrossingSeconds).toBeLessThan(
      MUSEUM_OBSERVATORY_FLOW_TIMING.leadCrossingSeconds,
    );
    expect(MUSEUM_OBSERVATORY_FLOW_TIMING.copperCrossingSeconds).toBeGreaterThan(4);
    expect(MUSEUM_OBSERVATORY_FLOW_TIMING.ivoryCrossingSeconds).toBeGreaterThan(
      MUSEUM_OBSERVATORY_FLOW_TIMING.copperCrossingSeconds,
    );
    expect(new Set(timings)).toHaveLength(timings.length);
    expect(MUSEUM_OBSERVATORY_FLOW_CONTROLS.flowSpeed).toBeGreaterThan(1);
    expect(MUSEUM_OBSERVATORY_FLOW_CONTROLS.flowStrength).toBeGreaterThanOrEqual(0.8);
    expect(MUSEUM_OBSERVATORY_FLOW_CONTROLS.wispSpeed).toBeGreaterThan(0.5);
    expect(MUSEUM_OBSERVATORY_FLOW_CONTROLS.wispIntensity).toBeGreaterThan(1);
    expect(MUSEUM_OBSERVATORY_FLOW_CONTROLS.fogIntensity).toBeGreaterThan(0);
  });

  it('expresses flow inside shader material instead of overlaying marker heads', async () => {
    const source = await readFile(
      path.join(process.cwd(), 'src', 'components', 'museum', 'MuseumObservatoryProof.tsx'),
      'utf8',
    );
    expect(source).toContain('float leadTravel =');
    expect(source).toContain('float copperTravel =');
    expect(source).toContain('float ivoryTravel =');
    expect(source).toContain('float liquidBolus(');
    expect(source).toContain('float leadBolus = liquidBolus(');
    expect(source).toContain('float copperBolus = liquidBolus(');
    expect(source).toContain('float ivoryBolus = liquidBolus(');
    expect(source).toContain('float laserFlowModulation(');
    expect(source).toContain('float movingWisp(');
    expect(source).toContain('float advectedFlowFog(');
    expect(source).not.toContain('<animateMotion');
    expect(source).not.toContain('observatoryFlowTracer');
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
