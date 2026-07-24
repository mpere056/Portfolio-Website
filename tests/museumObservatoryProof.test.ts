import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  MUSEUM_OBSERVATORY_FLOW_COMPOSITION_CONTROLS,
  MUSEUM_OBSERVATORY_FLOW_CONTROLS,
  MUSEUM_OBSERVATORY_FLOW_FAMILIES,
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
      'observatory:laser-flow-composition',
      'observatory:atmosphere',
      'observatory:diagram',
      'observatory:particles',
      'observatory:attention',
      'observatory:fallback',
    ]));
    const laserFlowLayer = MUSEUM_OBSERVATORY_PROOF_LAYERS.find(
      layer => layer.id === 'observatory:laser-flow-composition',
    );
    expect(laserFlowLayer?.medium).toBe('procedural-shader');
    expect(laserFlowLayer?.temporalJob).toContain('native LaserFlow');
    expect(laserFlowLayer?.temporalJob).toContain('six cropped');
    expect(laserFlowLayer?.temporalJob).toContain('segmented wisps');
    expect(laserFlowLayer?.temporalJob).toContain('five-octave fog');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:particles')?.medium)
      .toBe('procedural-geometry');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:orb')?.medium)
      .toBe('procedural-geometry');
    expect(MUSEUM_OBSERVATORY_PROOF_LAYERS.find(layer => layer.id === 'observatory:city')?.temporalJob)
      .toContain('excluding the foreground dome, podium, and steps');
  });

  it('composes six independently phased and spatially bounded native currents', () => {
    expect(MUSEUM_OBSERVATORY_FLOW_FAMILIES.map(family => family.id)).toEqual([
      'copper-canopy',
      'nacre-arch',
      'ivory-undertow',
      'cyan-lead',
      'gold-companion',
      'spectral-thread',
    ]);
    expect(Object.keys(MUSEUM_OBSERVATORY_FLOW_COMPOSITION_CONTROLS).sort()).toEqual(
      MUSEUM_OBSERVATORY_FLOW_FAMILIES.map(family => family.id).sort(),
    );
    expect(new Set(MUSEUM_OBSERVATORY_FLOW_FAMILIES.map(family => family.timeOffset))).toHaveLength(6);
    expect(MUSEUM_OBSERVATORY_FLOW_FAMILIES.every(family => family.verticalContribution === 1)).toBe(true);
    expect(MUSEUM_OBSERVATORY_FLOW_FAMILIES.every(family => family.horizontalContribution <= 0.04)).toBe(true);
    expect(MUSEUM_OBSERVATORY_FLOW_FAMILIES.every(family => family.filamentCount >= 3)).toBe(true);
    expect(MUSEUM_OBSERVATORY_FLOW_FAMILIES.every(family => family.filamentCount <= 10)).toBe(true);
    expect(MUSEUM_OBSERVATORY_FLOW_FAMILIES.every(family => family.filamentWidth <= 0.18)).toBe(true);
    const croppedArea = MUSEUM_OBSERVATORY_FLOW_FAMILIES.reduce(
      (total, family) => total
        + (family.crop[2] - family.crop[0]) * (family.crop[3] - family.crop[1]),
      0,
    );
    expect(croppedArea).toBeLessThan(1.9);
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
    expect(proofSource).toContain('MUSEUM_OBSERVATORY_FLOW_FAMILIES.map(family =>');
    expect(proofSource).toContain('tuningRef={flowCompositionRef}');
    expect(proofSource).not.toContain('fragmentShader={LEGACY_FLOW_BACK_FRAGMENT}');
    expect(proofSource).not.toContain('fragmentShader={LEGACY_FLOW_FRONT_FRAGMENT}');
    expect(proofSource).toContain('museum-observatory-laser-flow-composition-v4');
    expect(proofSource).toContain('Observatory current controls');
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
    expect(laserSource).toContain('liveUniforms.uFlowTime.value += clampedDelta;');
    expect(laserSource).toContain('liveUniforms.uFogTime.value += clampedDelta;');
    expect(proofSource).toContain('flowCompositionRef.current = nextComposition;');
    expect(laserSource).toContain('const current = tuningRef.current[family.id];');
    expect(laserSource).toContain('const liveUniforms = material.uniforms;');
    expect(laserSource).toContain('beamUv = mat2(rotationCos, -rotationSin, rotationSin, rotationCos) * beamUv;');
    expect(laserSource).toContain('horizontalBeam * uHorizontalContribution');
    expect(laserSource).toContain('const [minimumX, minimumY, maximumX, maximumY] = family.crop;');
    expect(laserSource).toContain('float cropMask = smoothstep(0.0, 0.045, vUv.x)');
    expect(laserSource).toContain('const attention = pointerActive ? Math.exp(-distance * 5.5) : 0;');
    expect(laserSource).toContain('liveUniforms.uHLenFactor.value = current.horizontalSizing;');
    expect(laserSource).toContain('current.flowStrength + attention * 0.12');
    expect(laserSource).toContain('float filaments = filamentBundle(beamUv, beamLight + wisps * 0.12);');
    expect(laserSource).toContain('float pressure = exp(-pow(pressureDistance / 0.105, 2.0));');
    expect(laserSource).toContain('uFilamentCount');
    expect(laserSource).toContain('ref={materialRef}');
    expect(proofSource).toContain("buildFlowTuningPreset('min', tuning)");
    expect(proofSource).toContain("buildFlowTuningPreset('max', tuning)");
    expect(proofSource).toContain('Current family');
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
