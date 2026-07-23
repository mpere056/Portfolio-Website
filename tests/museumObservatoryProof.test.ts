import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSEUM_OBSERVATORY_FLOW_CONTROLS,
  MUSEUM_OBSERVATORY_PERFORMANCE,
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
      'observatory:laser-flow-calibration',
      'observatory:atmosphere',
      'observatory:diagram',
      'observatory:particles',
      'observatory:attention',
      'observatory:fallback',
    ]));
    const laserFlowLayer = MUSEUM_OBSERVATORY_PROOF_LAYERS.find(
      layer => layer.id === 'observatory:laser-flow-calibration',
    );
    expect(laserFlowLayer?.medium).toBe('procedural-shader');
    expect(laserFlowLayer?.temporalJob).toContain('native LaserFlow');
    expect(laserFlowLayer?.temporalJob).toContain('segmented wisps');
    expect(laserFlowLayer?.temporalJob).toContain('five-octave fog');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:particles')?.medium)
      .toBe('procedural-geometry');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:orb')?.medium)
      .toBe('procedural-geometry');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:city')?.temporalJob)
      .toContain('excluding the foreground dome, podium, and steps');
  });

  it('starts from the native LaserFlow parameter defaults', () => {
    expect(MUSEUM_OBSERVATORY_FLOW_CONTROLS).toEqual({
      color: '#ff79c6',
      horizontalSizing: 0.5,
      verticalSizing: 2,
      wispDensity: 1,
      wispSpeed: 15,
      wispIntensity: 5,
      flowSpeed: 0.35,
      flowStrength: 0.25,
      fogIntensity: 0.45,
      fogScale: 0.3,
      fogFallSpeed: 0.6,
      decay: 1.1,
      falloffStart: 1.2,
    });
    expect(Object.keys(MUSEUM_OBSERVATORY_FLOW_CONTROLS)).toEqual([
      'color',
      'horizontalSizing',
      'verticalSizing',
      'wispDensity',
      'wispSpeed',
      'wispIntensity',
      'flowSpeed',
      'flowStrength',
      'fogIntensity',
      'fogScale',
      'fogFallSpeed',
      'decay',
      'falloffStart',
    ]);
  });

  it('bounds continuous rendering work without freezing the ambient scene', () => {
    expect(MUSEUM_OBSERVATORY_PERFORMANCE.renderDpr).toBeLessThanOrEqual(0.9);
    expect(MUSEUM_OBSERVATORY_PERFORMANCE.idleFps).toBeLessThanOrEqual(24);
    expect(MUSEUM_OBSERVATORY_PERFORMANCE.attentionFps).toBeLessThanOrEqual(36);
    expect(MUSEUM_OBSERVATORY_PERFORMANCE.attentionFps).toBeGreaterThan(MUSEUM_OBSERVATORY_PERFORMANCE.idleFps);
    expect(MUSEUM_OBSERVATORY_PERFORMANCE.fogOctaves).toBe(5);
    expect(MUSEUM_OBSERVATORY_PERFORMANCE.orbDetail).toBeLessThanOrEqual(3);
    expect(Object.values(MUSEUM_OBSERVATORY_PERFORMANCE.particles).reduce((total, count) => total + count, 0))
      .toBe(700);
    const croppedArea = Object.values(MUSEUM_OBSERVATORY_PERFORMANCE.bounds)
      .reduce((total, [minimumX, minimumY, maximumX, maximumY]) => (
        total + (maximumX - minimumX) * (maximumY - minimumY)
      ), 0);
    expect(croppedArea).toBeLessThan(3.5);
  });

  it('maps controls to the native LaserFlow equations instead of custom ribbon meanings', async () => {
    const [proofSource, laserSource] = await Promise.all([
      readFile(path.join(process.cwd(), 'src', 'components', 'museum', 'MuseumObservatoryProof.tsx'), 'utf8'),
      readFile(path.join(process.cwd(), 'src', 'components', 'museum', 'MuseumLaserFlowPlane.tsx'), 'utf8'),
    ]);
    expect(proofSource).toContain('<MuseumLaserFlowPlane tuning={flowTuning}');
    expect(proofSource).not.toContain('fragmentShader={LEGACY_FLOW_BACK_FRAGMENT}');
    expect(proofSource).not.toContain('fragmentShader={LEGACY_FLOW_FRONT_FRAGMENT}');
    expect(proofSource).toContain('museum-observatory-laser-flow-tuning-v2');
    expect(proofSource).toContain('Native LaserFlow controls');
    expect(laserSource).toContain('float flowPhase = normalizedY / max(FLOW_PERIOD, EPS) + uFlowTime * uFlowSpeed;');
    expect(laserSource).toContain('envelope *= mix(1.0 - uFlowStrength, 1.0, flow);');
    expect(laserSource).toContain('float flowCell = (y + uFlowTime * uWSpeed) / W_CELL;');
    expect(laserSource).toContain('return uWIntensity * sum * topFade * bottomGain * span;');
    expect(laserSource).toContain('vec2 fogUv = beamUv * uFogScale;');
    expect(laserSource).toContain('fogUv += uFogTime * uFogFallSpeed * fogDirection;');
    expect(laserSource).toContain('float basePhase = 1.5 * PI + uDecay * 0.5;');
    expect(laserSource).toContain('float falloff = power * uFalloffStart;');
    expect(laserSource).toContain('R_H * uHLenFactor');
    expect(laserSource).toContain('R_V * uVLenFactor');
    expect(laserSource).toContain('#define FOG_OCTAVES 5');
    expect(laserSource).toContain('uniforms.uFlowTime.value += clampedDelta;');
    expect(laserSource).toContain('uniforms.uFogTime.value += clampedDelta;');
    expect(proofSource).toContain("buildFlowTuningPreset('min')");
    expect(proofSource).toContain("buildFlowTuningPreset('max')");
    expect(proofSource).toContain('Values save in this browser.');
    expect(proofSource).toContain("frameloop={visible ? 'demand' : 'never'}");
    expect(proofSource).not.toContain('<animateMotion');
    expect(proofSource).not.toContain('observatoryFlowTracer');
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
