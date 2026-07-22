'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';
import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  MUSEUM_OBSERVATORY_FLOW_CONTROLS,
  MUSEUM_OBSERVATORY_FLOW_TIMING,
  MUSEUM_OBSERVATORY_PERFORMANCE,
  MUSEUM_OBSERVATORY_PROOF_ASPECT,
  MUSEUM_OBSERVATORY_PROOF_ASSETS,
  type MuseumObservatoryFlowTuning,
} from '@/lib/museum/observatoryProof';
import { toProofAttentionPoint } from '@/lib/museum/ambientProof';
import { getMuseumSceneFrame, type MuseumScenePoint } from '@/lib/museum/scene';
import MuseumParticleField from './MuseumParticleField';
import museumStyles from './MuseumShell.module.css';
import styles from './MuseumAmbientProof.module.css';

const OBSERVATORY_TUNING_STORAGE_KEY = 'museum-observatory-flow-tuning-v1';

type NumericFlowTuningKey = Exclude<keyof MuseumObservatoryFlowTuning, 'color'>;

const FLOW_TUNING_CONTROLS: ReadonlyArray<{
  key: NumericFlowTuningKey;
  label: string;
  min: number;
  max: number;
  step: number;
  precision: number;
}> = [
  { key: 'horizontalSizing', label: 'Horizontal sizing', min: 0.2, max: 2.5, step: 0.01, precision: 2 },
  { key: 'verticalSizing', label: 'Vertical sizing', min: 0.4, max: 4, step: 0.05, precision: 2 },
  { key: 'wispDensity', label: 'Wisp density', min: 0, max: 1, step: 0.01, precision: 2 },
  { key: 'wispSpeed', label: 'Wisp speed', min: 0, max: 3, step: 0.01, precision: 2 },
  { key: 'wispIntensity', label: 'Wisp intensity', min: 0, max: 6, step: 0.05, precision: 2 },
  { key: 'flowSpeed', label: 'Flow speed', min: 0, max: 4, step: 0.01, precision: 2 },
  { key: 'flowStrength', label: 'Flow strength', min: 0, max: 2.5, step: 0.01, precision: 2 },
  { key: 'fogIntensity', label: 'Fog intensity', min: 0, max: 1.5, step: 0.01, precision: 2 },
  { key: 'fogScale', label: 'Fog scale', min: 1, max: 12, step: 0.1, precision: 1 },
  { key: 'fogFallSpeed', label: 'Fog fall speed', min: 0, max: 2, step: 0.01, precision: 2 },
  { key: 'decay', label: 'Decay', min: 0.5, max: 4, step: 0.01, precision: 2 },
  { key: 'falloffStart', label: 'Falloff start', min: 0.25, max: 3, step: 0.01, precision: 2 },
];

function readStoredFlowTuning(): MuseumObservatoryFlowTuning {
  const defaults = { ...MUSEUM_OBSERVATORY_FLOW_CONTROLS };
  try {
    const stored = window.localStorage.getItem(OBSERVATORY_TUNING_STORAGE_KEY);
    if (!stored) return defaults;
    const parsed = JSON.parse(stored) as Partial<MuseumObservatoryFlowTuning>;
    if (typeof parsed.color === 'string' && /^#[0-9a-f]{6}$/i.test(parsed.color)) {
      defaults.color = parsed.color;
    }
    FLOW_TUNING_CONTROLS.forEach(({ key, min, max }) => {
      const value = parsed[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        defaults[key] = THREE.MathUtils.clamp(value, min, max);
      }
    });
  } catch {
    return defaults;
  }
  return defaults;
}

function buildFlowTuningPreset(edge: 'min' | 'max'): MuseumObservatoryFlowTuning {
  const preset = { ...MUSEUM_OBSERVATORY_FLOW_CONTROLS };
  FLOW_TUNING_CONTROLS.forEach(control => {
    preset[control.key] = control[edge];
  });
  return preset;
}

const PLANE_VERTEX = /* glsl */`
  varying vec2 vUv;
  uniform vec4 uUvBounds;
  void main() {
    vUv = mix(uUvBounds.xy, uUvBounds.zw, uv);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NOISE_GLSL = /* glsl */`
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 turn = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      value += amplitude * valueNoise(p);
      p = turn * p;
      amplitude *= 0.5;
    }
    return value;
  }
  float fbm3(vec2 p) {
    float value = 0.0;
    float amplitude = 0.55;
    mat2 turn = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 3; i++) {
      value += amplitude * valueNoise(p);
      p = turn * p;
      amplitude *= 0.48;
    }
    return value;
  }
  vec2 rotateAround(vec2 uv, vec2 center, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c) * (uv - center) + center;
  }
  float annulus(vec2 uv, vec2 center, float radius, float width) {
    return 1.0 - smoothstep(width, width + 0.012, abs(distance(uv, center) - radius));
  }
  float insideUv(vec2 uv) {
    return step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  }
  vec2 remapLayer(vec2 uv, vec2 anchor, float scale, vec2 offset) {
    return anchor + (uv - anchor - offset) / scale;
  }
`;

const LASER_FLOW_GLSL = /* glsl */`
  uniform vec3 uFlowColor;
  uniform float uHorizontalSizing;
  uniform float uVerticalSizing;
  uniform float uWispDensity;
  uniform float uWispSpeed;
  uniform float uWispIntensity;
  uniform float uFlowSpeed;
  uniform float uFlowStrength;
  uniform float uFogIntensity;
  uniform float uFogScale;
  uniform float uFogFallSpeed;
  uniform float uDecay;
  uniform float uFalloffStart;

  float tri01(float value) {
    float phase = fract(value);
    return 1.0 - abs(phase * 2.0 - 1.0);
  }

  float segmentGate(float value, float length) {
    float enter = smoothstep(0.015, 0.075, value);
    float leave = 1.0 - smoothstep(length, length + 0.11, value);
    return max(0.0, enter * leave);
  }

  float laserFlowModulation(float x, float time, float rate, float phase) {
    float flow = pow(tri01((x - time * rate) / (0.31 * max(uHorizontalSizing, 0.1)) + phase), 1.5);
    return mix(
      0.12,
      1.0 + uFlowStrength,
      smoothstep(0.08, 0.92, flow)
    );
  }

  float movingWisp(float x, float time, float phase, float seed) {
    float coordinate = (x - time * uWispSpeed + phase) * (6.4 / max(uHorizontalSizing, 0.1));
    float cell = floor(coordinate);
    float local = fract(coordinate);
    float cellSeed = hash21(vec2(cell + seed * 13.7, seed * 7.9));
    float length = mix(0.2, 0.68, cellSeed);
    float present = step(cellSeed, uWispDensity);
    return segmentGate(local, length) * present;
  }

  float flowFbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.56;
    mat2 turn = mat2(1.58, 1.12, -1.12, 1.58);
    for (int i = 0; i < ${MUSEUM_OBSERVATORY_PERFORMANCE.fogOctaves}; i++) {
      value += amplitude * valueNoise(p);
      p = turn * p;
      amplitude *= 0.48;
    }
    return value;
  }

  float advectedFlowFog(vec2 uv, float center, float time, float phase) {
    vec2 fogUv = vec2(
      (uv.x - time * uFogFallSpeed) * uFogScale / max(uHorizontalSizing, 0.1),
      (uv.y - center) * uFogScale * 5.0 / max(uVerticalSizing, 0.1)
    );
    float warp = flowFbm(fogUv * 0.48 + vec2(phase * 3.7, time * 0.11));
    float crossWarp = valueNoise(fogUv * 0.29 + vec2(-phase * 2.9, -time * 0.08));
    float fog = flowFbm(fogUv + vec2(warp, crossWarp) * 0.82 + phase * 5.0);
    float beamMask = exp(-abs(uv.y - center) * 17.0 * max(uFalloffStart, 0.05) / max(uVerticalSizing, 0.1));
    return smoothstep(0.34, 0.76, fog) * beamMask * uFogIntensity;
  }

  float flowProfile(float y, float center, float density) {
    float distanceFromFlow = abs(y - center)
      * max(uFalloffStart, 0.05)
      / max(uVerticalSizing, 0.1);
    return pow(exp(-distanceFromFlow * density), max(uDecay * 0.5, 0.1));
  }
`;

const FIELD_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    float terrain = 1.0 - smoothstep(0.22, 0.68, vUv.y);
    float drift = fbm3(vUv * vec2(5.5, 8.0) + vec2(-uTime * 0.035, uTime * 0.012));
    float cyanCaustic = pow(max(0.0, sin(vUv.x * 18.0 + drift * 7.0 - uTime * 0.24)), 15.0) * terrain;
    float goldCaustic = pow(max(0.0, sin((vUv.x + vUv.y * 0.45) * 14.0 - drift * 5.0 + uTime * 0.13)), 18.0) * terrain;
    float pointerLight = exp(-distance(vUv, uPointer) * 8.5) * uAttention * terrain;
    color.rgb *= 0.78;
    color.rgb += vec3(0.05, 0.46, 0.5) * cyanCaustic * 0.16;
    color.rgb += vec3(0.72, 0.43, 0.12) * goldCaustic * 0.11;
    color.rgb += mix(vec3(0.06, 0.52, 0.56), vec3(0.72, 0.45, 0.17), uPointer.x) * pointerLight * 0.19;
    float nearHaze = valueNoise(vUv * vec2(7.5, 3.7) + vec2(-uTime * 0.061, uTime * 0.014));
    float depthWindow = smoothstep(0.05, 0.55, vUv.y) * (1.0 - smoothstep(0.88, 1.0, vUv.y));
    float lowPassage = exp(-pow((vUv.y - (0.27 + sin(uTime * 0.09) * 0.08)) * 6.0, 2.0));
    float hazeDensity = (smoothstep(0.43, 0.77, drift) * 0.25
      + smoothstep(0.57, 0.84, nearHaze) * 0.13
      + lowPassage * (0.025 + drift * 0.05)) * depthWindow;
    color.rgb += mix(vec3(0.04, 0.23, 0.27), vec3(0.26, 0.17, 0.08), drift) * hazeDensity;
    gl_FragColor = vec4(color.rgb, 1.0);
  }
`;

const OBSERVATORY_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}

  void main() {
    vec2 sourceCenter = vec2(0.66, 0.49);
    vec2 offset = vec2(0.035, 0.07);
    vec2 sourceUv = remapLayer(vUv, sourceCenter, 0.79, offset);
    vec2 center = sourceCenter + offset;
    vec2 delta = vUv - center;
    vec2 sourceDelta = sourceUv - sourceCenter;
    float distanceFromLens = length(delta);
    float lensMask = 1.0 - smoothstep(0.036, 0.083, distanceFromLens);
    float lensNoise = fbm3(sourceUv * 15.0 + vec2(uTime * 0.04, -uTime * 0.027));
    vec2 lensUv = sourceCenter + sourceDelta * (0.972 + (lensNoise - 0.5) * (0.055 + uAttention * 0.035));
    float chroma = lensMask * (0.002 + uAttention * 0.005);
    vec4 base = texture2D(uTexture, sourceUv);
    base.a *= insideUv(sourceUv);
    float orbCutout = 1.0 - smoothstep(0.052, 0.071, length(sourceDelta));
    base.a *= 1.0 - orbCutout;
    vec4 lensSample = texture2D(uTexture, lensUv);
    vec3 refracted = vec3(
      texture2D(uTexture, lensUv + sourceDelta * chroma).r,
      lensSample.g,
      texture2D(uTexture, lensUv - sourceDelta * chroma).b
    );
    base.rgb = mix(base.rgb, refracted, lensMask * lensSample.a * 0.8);
    float sweepX = -0.15 + fract(uTime * 0.047) * 1.3;
    float nacreSweep = exp(-abs(vUv.x - sweepX) * 19.0) * base.a;
    float pearl = pow(max(0.0, sin((sourceUv.x * 0.7 + sourceUv.y) * 18.0 - uTime * 0.21)), 13.0) * base.a;
    float filamentTide = (0.5 + 0.5 * sin(sourceUv.y * 24.0 + sourceUv.x * 9.0 - uTime * 0.31)) * base.a;
    float localAttention = exp(-distance(vUv, uPointer) * 9.0) * uAttention * base.a;
    float lensPulse = lensMask * (0.5 + 0.5 * sin(uTime * 0.53)) * base.a;
    base.rgb *= 0.74;
    base.rgb += mix(vec3(0.24, 0.82, 0.84), vec3(1.0, 0.72, 0.38), sweepX) * nacreSweep * 0.52;
    base.rgb += vec3(0.92, 0.74, 0.56) * pearl * 0.19;
    base.rgb += vec3(0.24, 0.58, 0.6) * filamentTide * 0.07;
    base.rgb += mix(vec3(0.18, 0.9, 0.92), vec3(1.0, 0.56, 0.28), uPointer.x) * localAttention * 0.48;
    base.rgb += vec3(0.8, 0.98, 1.0) * lensPulse * (0.17 + uAttention * 0.24);
    gl_FragColor = vec4(base.rgb, base.a);
  }
`;

const CITY_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}

  float windowLevel(float value) {
    float dim = smoothstep(0.49, 0.55, value) * 0.24;
    float warm = smoothstep(0.72, 0.79, value) * 0.32;
    float bright = smoothstep(0.9, 0.96, value) * 0.44;
    return dim + warm + bright;
  }

  float towerZone(vec2 uv, vec2 minimum, vec2 maximum) {
    vec2 enter = smoothstep(minimum, minimum + vec2(0.018), uv);
    vec2 leave = 1.0 - smoothstep(maximum - vec2(0.018), maximum, uv);
    return enter.x * enter.y * leave.x * leave.y;
  }

  void main() {
    vec2 anchor = vec2(0.73, 0.35);
    vec2 offset = vec2(0.095, -0.075);
    vec2 sourceUv = remapLayer(vUv, anchor, 0.74, offset);
    vec4 color = texture2D(uTexture, sourceUv);
    color.a *= insideUv(sourceUv);
    float architecture = color.a;
    float towerBandA = exp(-abs(sourceUv.x - 0.62) * 25.0);
    float towerBandB = exp(-abs(sourceUv.x - 0.78) * 31.0);
    float towerBandC = exp(-abs(sourceUv.x - 0.91) * 38.0);
    float climbA = pow(max(0.0, sin(sourceUv.y * 16.0 - uTime * 0.42)), 13.0) * towerBandA;
    float climbB = pow(max(0.0, sin(sourceUv.y * 21.0 - uTime * 0.27 + 2.4)), 16.0) * towerBandB;
    float climbC = pow(max(0.0, sin(sourceUv.y * 13.0 - uTime * 0.19 + 4.1)), 12.0) * towerBandC;
    vec2 windowGrid = sourceUv * vec2(78.0, 70.0);
    vec2 windowCell = floor(windowGrid);
    vec2 windowLocal = fract(windowGrid);
    float windowSeed = hash21(windowCell + vec2(19.7, 41.3));
    float windowClock = uTime * mix(0.066, 0.108, windowSeed) + windowSeed * 13.0;
    float windowEpoch = floor(windowClock);
    float windowTransition = smoothstep(0.12, 0.88, fract(windowClock));
    float previousWindow = hash21(windowCell + vec2(windowEpoch * 7.13, windowEpoch * 2.91));
    float nextWindow = hash21(windowCell + vec2((windowEpoch + 1.0) * 7.13, (windowEpoch + 1.0) * 2.91));
    float windowState = mix(windowLevel(previousWindow), windowLevel(nextWindow), windowTransition);
    float windowShapeX = 1.0 - smoothstep(0.17, 0.31, abs(windowLocal.x - 0.5));
    float windowShapeY = 1.0 - smoothstep(0.2, 0.39, abs(windowLocal.y - 0.5));
    float westTowers = towerZone(sourceUv, vec2(0.515, 0.385), vec2(0.655, 0.635));
    float centralTowers = towerZone(sourceUv, vec2(0.615, 0.37), vec2(0.845, 0.775));
    float eastTowers = towerZone(sourceUv, vec2(0.79, 0.345), vec2(0.985, 0.66));
    float windowBounds = max(westTowers, max(centralTowers, eastTowers));
    float windowSignal = windowShapeX * windowShapeY * windowState * windowBounds;
    float windowTint = hash21(windowCell + vec2(83.1, 9.4));
    float slowBloom = 0.5 + 0.5 * sin(uTime * 0.23 + sourceUv.x * 8.0);
    float localAttention = exp(-distance(vUv, uPointer) * 10.0) * uAttention;
    color.rgb *= 0.72;
    color.rgb += vec3(0.28, 0.88, 0.9) * climbA * architecture * (0.34 + uAttention * 0.2);
    color.rgb += vec3(0.98, 0.55, 0.48) * climbB * architecture * (0.31 + uAttention * 0.22);
    color.rgb += vec3(0.96, 0.73, 0.35) * climbC * architecture * 0.32;
    vec3 windowColor = mix(vec3(0.31, 0.88, 0.89), vec3(1.0, 0.65, 0.4), smoothstep(0.28, 0.76, windowTint));
    color.rgb += windowColor * windowSignal * architecture * (0.28 + uAttention * 0.13);
    color.rgb += mix(vec3(0.13, 0.55, 0.58), vec3(0.65, 0.28, 0.22), vUv.x) * slowBloom * architecture * 0.08;
    color.rgb += vec3(0.45, 0.92, 0.91) * localAttention * architecture * 0.34;
    gl_FragColor = vec4(color.rgb, architecture);
  }
`;

const PORTAL_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}

  void main() {
    vec2 sourceCenter = vec2(0.235, 0.41);
    vec2 offset = vec2(-0.06, -0.08);
    vec2 sourceUv = remapLayer(vUv, sourceCenter, 0.72, offset);
    vec2 center = sourceCenter + offset;
    vec2 delta = vUv - center;
    vec2 sourceDelta = sourceUv - sourceCenter;
    float d = length(delta);
    float glass = 1.0 - smoothstep(0.076, 0.126, d);
    float noise = fbm3(sourceUv * 13.0 + vec2(uTime * 0.055, -uTime * 0.034));
    vec2 refractedUv = sourceCenter + sourceDelta * (0.95 + (noise - 0.5) * (0.07 + uAttention * 0.04));
    vec4 body = texture2D(uTexture, sourceUv);
    body.a *= insideUv(sourceUv);
    vec4 lens = texture2D(uTexture, refractedUv);
    float chroma = glass * (0.003 + uAttention * 0.006);
    vec3 refracted = vec3(
      texture2D(uTexture, refractedUv + sourceDelta * chroma).r,
      lens.g,
      texture2D(uTexture, refractedUv - sourceDelta * chroma).b
    );
    body.rgb = mix(body.rgb, refracted, glass * lens.a * 0.86);
    float scan = exp(-abs(sourceUv.y - (0.22 + fract(uTime * 0.075) * 0.39)) * 65.0) * glass;
    float aperture = pow(max(0.0, cos(atan(delta.y, delta.x) * 9.0 - uTime * (0.4 + uAttention * 0.72))), 22.0)
      * glass * smoothstep(0.035, 0.14, d);
    float localAttention = exp(-distance(vUv, uPointer) * 10.0) * uAttention * body.a;
    float waveRadius = fract(uTime * 0.07) * 0.23;
    float idleWave = exp(-pow((d - waveRadius) * 78.0, 2.0)) * (1.0 - waveRadius / 0.23);
    body.rgb *= 0.77;
    body.rgb += vec3(0.36, 0.91, 0.92) * scan * body.a * 0.42;
    body.rgb += vec3(0.98, 0.72, 0.35) * aperture * body.a * (0.22 + uAttention * 0.32);
    body.rgb += mix(vec3(0.2, 0.84, 0.88), vec3(1.0, 0.55, 0.3), uPointer.y) * localAttention * 0.42;
    body.rgb += vec3(0.4, 0.86, 0.88) * idleWave * 0.16;
    gl_FragColor = vec4(body.rgb, max(body.a, idleWave * 0.12));
  }
`;

const FLOW_BACK_FRAGMENT = /* glsl */`
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}
  ${LASER_FLOW_GLSL}

  float flowLine(float y, float center, float width) {
    float tunedWidth = width * max(uVerticalSizing, 0.1);
    float glow = tunedWidth / (abs(y - center) * max(uFalloffStart, 0.05) + tunedWidth);
    return pow(max(glow, 0.0), max(uDecay, 0.1));
  }

  float directionalPulse(float x, float time, float speed, float phase) {
    float position = fract(x - time * speed + phase);
    float head = exp(-pow((position - 0.72) / 0.055, 2.0));
    float tail = smoothstep(0.16, 0.6, position) * (1.0 - smoothstep(0.6, 0.72, position));
    return head + tail * 0.24;
  }

  float liquidBolus(float x, float time, float speed, float phase, float width) {
    width *= max(uHorizontalSizing, 0.1);
    float center = fract(time * speed + phase);
    float offset = fract(x - center + 0.5) - 0.5;
    float pressure = exp(-pow(offset / width, 2.0));
    float trailingVolume = exp(-pow((offset + width * 1.35) / (width * 1.9), 2.0)) * 0.3;
    return clamp(pressure + trailingVolume, 0.0, 1.0);
  }

  void main() {
    float edgeFade = smoothstep(0.01, 0.13, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x));
    float attention = exp(-distance(vUv, uPointer) * 7.5) * uAttention;
    float flowClock = uTime * uFlowSpeed;
    vec3 color = vec3(0.0);
    float alpha = 0.0;

    float copperRate = ${String(1 / MUSEUM_OBSERVATORY_FLOW_TIMING.copperCrossingSeconds)};
    float copperTravel = vUv.x - flowClock * copperRate;
    float copperBolus = liquidBolus(vUv.x, flowClock, copperRate, 0.18, 0.11);
    float copperBodyY = 0.895 - vUv.x * 0.115
      + sin(copperTravel * 6.28318) * (0.008 + copperBolus * 0.022);
    float copperNoise = flowFbm(vec2(copperTravel * 7.0, vUv.y * 18.0 + flowClock * 0.08));
    float copperAurora = flowProfile(vUv.y, copperBodyY, 31.0)
      * smoothstep(0.34, 0.84, copperNoise) * edgeFade;
    float copperFront = directionalPulse(vUv.x, flowClock, copperRate, 0.19);
    float copperCorridor = flowProfile(vUv.y, copperBodyY, 42.0) * edgeFade;
    color += mix(vec3(0.38, 0.13, 0.09), vec3(0.86, 0.46, 0.27), copperNoise)
      * copperAurora * (0.16 + copperFront * 0.72);
    color += vec3(0.92, 0.47, 0.24) * copperCorridor * copperFront * 0.72;
    float copperPressure = flowProfile(vUv.y, copperBodyY, 23.0) * copperBolus * edgeFade;
    float copperFog = advectedFlowFog(vUv, copperBodyY, uTime, 0.17) * edgeFade;
    color += mix(vec3(0.74, 0.24, 0.15), vec3(1.0, 0.68, 0.36), copperNoise) * copperPressure * 0.46;
    color += vec3(0.72, 0.28, 0.16) * copperFog * 0.58;
    alpha += copperAurora * (0.08 + copperFront * 0.22);
    alpha += copperCorridor * copperFront * 0.2;
    alpha += copperPressure * 0.16;
    alpha += copperFog * 0.16;

    for (int i = 0; i < 9; i++) {
      float fi = float(i);
      float phase = fi * 0.83;
      float weave = sin(copperTravel * (14.0 + fi * 0.18) + phase) * (0.018 + copperBolus * 0.021 + attention * 0.01)
        + sin((vUv.x + flowClock * 0.065) * 35.0 - phase * 1.7) * 0.006;
      float center = copperBodyY + weave + (fi - 4.0) * 0.0039 * (1.0 + copperBolus * 0.72);
      float materialWave = pow(0.5 + 0.5 * sin(copperTravel * 18.8496 + phase * 0.72), 2.0);
      float line = flowLine(vUv.y, center, (0.00082 + materialWave * 0.00044 + copperBolus * 0.00125) + attention * 0.00058);
      float packet = directionalPulse(vUv.x, flowClock, copperRate + fi * 0.003 + attention * 0.035, fi * 0.117);
      float travelingShimmer = pow(0.5 + 0.5 * sin(copperTravel * 18.8496 + phase), 3.0);
      float flowModulation = laserFlowModulation(vUv.x, flowClock, copperRate, fi * 0.09);
      float wisp = movingWisp(vUv.x, uTime, fi * 0.071, fi + 3.0);
      vec3 tint = mix(vec3(0.72, 0.31, 0.21), vec3(0.78, 0.68, 0.49), smoothstep(3.0, 8.0, fi));
      float copperEnergy = (0.15 + copperBolus * 1.22 + materialWave * 0.22 + travelingShimmer * 0.72 + packet * 0.92)
        * flowModulation + wisp * uWispIntensity;
      color += tint * line * (copperEnergy + attention * 0.28) * edgeFade;
      alpha += line * (0.07 + copperEnergy * 0.34) * edgeFade;
    }

    float copperWisp = flowProfile(vUv.y, copperBodyY, 14.0)
      * movingWisp(vUv.x, uTime, 0.19, 71.0) * uWispIntensity * edgeFade;
    color += vec3(0.88, 0.38, 0.2) * copperWisp * 0.2;
    alpha += copperWisp * 0.09;

    float ivoryRate = ${String(1 / MUSEUM_OBSERVATORY_FLOW_TIMING.ivoryCrossingSeconds)};
    float ivoryTravel = vUv.x - flowClock * ivoryRate;
    float ivoryBolus = liquidBolus(vUv.x, flowClock, ivoryRate, 0.57, 0.1);
    float ivoryBodyY = 0.615 - vUv.x * 0.305
      + sin(ivoryTravel * 6.28318 + 0.8) * (0.01 + ivoryBolus * 0.025);
    float ivoryNoise = flowFbm(vec2(ivoryTravel * 5.2, vUv.y * 14.0 - flowClock * 0.055));
    float ivoryAurora = flowProfile(vUv.y, ivoryBodyY, 25.0)
      * smoothstep(0.37, 0.82, ivoryNoise) * edgeFade;
    float ivoryFront = directionalPulse(vUv.x, flowClock, ivoryRate, 0.57);
    float ivoryCorridor = flowProfile(vUv.y, ivoryBodyY, 34.0) * edgeFade;
    color += mix(vec3(0.18, 0.38, 0.42), vec3(0.57, 0.59, 0.54), ivoryNoise)
      * ivoryAurora * (0.17 + ivoryFront * 0.64);
    color += vec3(0.56, 0.86, 0.83) * ivoryCorridor * ivoryFront * 0.62;
    float ivoryPressure = flowProfile(vUv.y, ivoryBodyY, 21.0) * ivoryBolus * edgeFade;
    float ivoryFog = advectedFlowFog(vUv, ivoryBodyY, uTime, 0.61) * edgeFade;
    color += mix(vec3(0.22, 0.55, 0.61), vec3(0.9, 0.78, 0.55), ivoryNoise) * ivoryPressure * 0.38;
    color += vec3(0.3, 0.62, 0.66) * ivoryFog * 0.46;
    alpha += ivoryAurora * (0.08 + ivoryFront * 0.2);
    alpha += ivoryCorridor * ivoryFront * 0.18;
    alpha += ivoryPressure * 0.13;
    alpha += ivoryFog * 0.13;

    for (int i = 0; i < 11; i++) {
      float fi = float(i);
      float phase = fi * 0.61;
      float braid = sin(ivoryTravel * (11.0 + fi * 0.15) + phase) * (0.031 + ivoryBolus * 0.026 + attention * 0.013)
        + sin((vUv.x + flowClock * 0.045) * 27.0 - phase) * 0.009;
      float center = ivoryBodyY + braid + (fi - 5.0) * 0.0042 * (1.0 + ivoryBolus * 0.68);
      float materialWave = pow(0.5 + 0.5 * sin(ivoryTravel * 15.708 + phase * 0.78), 2.0);
      float line = flowLine(vUv.y, center, (0.00072 + materialWave * 0.0004 + ivoryBolus * 0.001) + attention * 0.00046);
      float packet = directionalPulse(vUv.x, flowClock, ivoryRate + fi * 0.0025 + attention * 0.028, fi * 0.083 + 0.31);
      float travelingShimmer = pow(0.5 + 0.5 * sin(ivoryTravel * 15.708 + phase), 3.0);
      float flowModulation = laserFlowModulation(vUv.x, flowClock, ivoryRate, fi * 0.067 + 0.24);
      float wisp = movingWisp(vUv.x, uTime, fi * 0.053 + 0.31, fi + 17.0);
      vec3 tint = mix(vec3(0.28, 0.63, 0.68), vec3(0.78, 0.74, 0.62), smoothstep(2.0, 10.0, fi));
      float ivoryEnergy = (0.13 + ivoryBolus * 0.94 + materialWave * 0.2 + travelingShimmer * 0.62 + packet * 0.78)
        * flowModulation + wisp * uWispIntensity * 0.82;
      color += tint * line * (ivoryEnergy + attention * 0.22) * edgeFade;
      alpha += line * (0.055 + ivoryEnergy * 0.32) * edgeFade;
    }

    float ivoryWisp = flowProfile(vUv.y, ivoryBodyY, 12.0)
      * movingWisp(vUv.x, uTime, 0.53, 83.0) * uWispIntensity * edgeFade;
    color += vec3(0.36, 0.78, 0.8) * ivoryWisp * 0.17;
    alpha += ivoryWisp * 0.08;

    float archRate = ${String(1 / MUSEUM_OBSERVATORY_FLOW_TIMING.archCrossingSeconds)};
    float archTravel = vUv.x - flowClock * archRate;
    float archBase = 0.965 - vUv.x * 0.14;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float arch = archBase + sin(archTravel * (8.0 + fi) + fi * 1.3) * (0.022 + fi * 0.005);
      float line = flowLine(vUv.y, arch, 0.00065);
      float packet = directionalPulse(vUv.x, flowClock, archRate + fi * 0.004, fi * 0.19 + 0.12);
      float flowModulation = laserFlowModulation(vUv.x, flowClock, archRate, fi * 0.17);
      float wisp = movingWisp(vUv.x, uTime, fi * 0.11, fi + 29.0);
      float archEnergy = (0.11 + packet * 0.78) * flowModulation + wisp * 0.72;
      color += mix(vec3(0.26, 0.48, 0.5), vec3(0.56, 0.43, 0.3), fi / 3.0) * line * archEnergy * edgeFade;
      alpha += line * (0.055 + archEnergy * 0.31) * edgeFade;
    }

    float strengthGain = uFlowStrength / ${String(MUSEUM_OBSERVATORY_FLOW_CONTROLS.flowStrength)};
    color *= strengthGain * mix(vec3(1.0), uFlowColor, 0.82);
    alpha *= strengthGain;
    float luminance = max(color.r, max(color.g, color.b));
    gl_FragColor = vec4(color * 1.22, clamp(max(alpha * 2.2, luminance * 0.64), 0.0, 0.82));
  }
`;

const FLOW_FRONT_FRAGMENT = /* glsl */`
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}
  ${LASER_FLOW_GLSL}

  float flowLine(float y, float center, float width) {
    float tunedWidth = width * max(uVerticalSizing, 0.1);
    float glow = tunedWidth / (abs(y - center) * max(uFalloffStart, 0.05) + tunedWidth);
    return pow(max(glow, 0.0), max(uDecay, 0.1));
  }

  float directionalPulse(float x, float time, float speed, float phase) {
    float position = fract(x - time * speed + phase);
    float head = exp(-pow((position - 0.72) / 0.065, 2.0));
    float tail = smoothstep(0.1, 0.58, position) * (1.0 - smoothstep(0.58, 0.72, position));
    return head + tail * 0.3;
  }

  float liquidBolus(float x, float time, float speed, float phase, float width) {
    width *= max(uHorizontalSizing, 0.1);
    float center = fract(time * speed + phase);
    float offset = fract(x - center + 0.5) - 0.5;
    float pressure = exp(-pow(offset / width, 2.0));
    float trailingVolume = exp(-pow((offset + width * 1.35) / (width * 1.9), 2.0)) * 0.32;
    return clamp(pressure + trailingVolume, 0.0, 1.0);
  }

  void main() {
    float edgeFade = smoothstep(0.015, 0.12, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x));
    float attention = exp(-distance(vUv, uPointer) * 7.8) * uAttention;
    float flowClock = uTime * uFlowSpeed;
    float leadRate = ${String(1 / MUSEUM_OBSERVATORY_FLOW_TIMING.leadCrossingSeconds)};
    float leadTravel = vUv.x - flowClock * leadRate;
    float leadBolus = liquidBolus(vUv.x, flowClock, leadRate, 0.08, 0.14);
    float bodyY = 0.81 - vUv.x * 0.355
      + sin(leadTravel * 6.28318) * (0.011 + leadBolus * 0.034);
    float bodyNoise = flowFbm(vec2(leadTravel * 6.0, vUv.y * 17.0 + flowClock * 0.18));
    float aurora = flowProfile(vUv.y, bodyY, 26.0) * smoothstep(0.28, 0.82, bodyNoise) * edgeFade;
    float bodySurge = directionalPulse(vUv.x, flowClock, leadRate + attention * 0.12, 0.18);
    float sweepX = fract(flowClock * (leadRate + attention * 0.11) + 0.08);
    float sweepProfile = leadBolus;
    float sweepCorridor = flowProfile(vUv.y, bodyY, 21.0) * edgeFade;
    vec3 sweepColor = mix(vec3(0.18, 0.94, 1.0), vec3(1.0, 0.7, 0.3), smoothstep(0.52, 0.88, sweepX));
    vec3 color = mix(vec3(0.015, 0.22, 0.26), vec3(0.33, 0.2, 0.055), smoothstep(0.56, 0.8, bodyNoise))
      * aurora * (0.22 + bodySurge * 1.24);
    color += sweepColor * sweepCorridor * sweepProfile * 0.78;
    float leadFog = advectedFlowFog(vUv, bodyY, uTime, 0.08) * edgeFade;
    color += mix(vec3(0.08, 0.68, 0.76), vec3(0.75, 0.49, 0.18), smoothstep(0.45, 0.88, vUv.x))
      * leadFog * 0.72;
    float alpha = aurora * (0.08 + bodySurge * 0.38);
    alpha += sweepCorridor * sweepProfile * 0.48;
    alpha += leadFog * 0.2;

    for (int i = 0; i < 10; i++) {
      float fi = float(i);
      float phase = fi * 0.76;
      float localRate = leadRate + fi * 0.0028 + attention * 0.065;
      float localTravel = vUv.x - flowClock * localRate;
      float localWave = sin(localTravel * (9.3 + fi * 0.12) + phase) * (0.026 + leadBolus * 0.036 + attention * 0.024)
        + sin((vUv.x + flowClock * 0.09) * 23.0 - phase * 1.4) * 0.009;
      float center = bodyY + localWave + (fi - 4.5) * 0.0084 * (1.0 + leadBolus * 0.76);
      float materialWave = pow(0.5 + 0.5 * sin(localTravel * 18.8496 + phase * 0.74), 2.0);
      float line = flowLine(vUv.y, center, (0.00118 + materialWave * 0.00058 + leadBolus * 0.00265) + attention * 0.00092);
      float packet = directionalPulse(vUv.x, flowClock, localRate + attention * 0.08, 0.15 + fi * 0.009);
      float travelingShimmer = pow(0.5 + 0.5 * sin(localTravel * 18.8496 + phase), 3.0);
      float flowModulation = laserFlowModulation(vUv.x, flowClock, localRate, fi * 0.077);
      float wisp = movingWisp(vUv.x, uTime, fi * 0.061, fi + 41.0);
      float goldMix = smoothstep(5.7, 8.7, fi);
      vec3 tint = mix(vec3(0.12, 0.82, 0.88), vec3(0.95, 0.65, 0.29), goldMix);
      float knotSuppression = 1.0 - exp(-pow((vUv.x - 0.55) * 18.0, 2.0)) * 0.72;
      float leadEnergy = (0.16 * knotSuppression + leadBolus * 1.42 + materialWave * 0.24
        + travelingShimmer * 0.82 + packet * (1.15 + attention * 0.82)) * flowModulation
        + wisp * uWispIntensity;
      color += tint * line * (leadEnergy + attention * 0.18) * edgeFade;
      alpha += line * (0.07 + leadEnergy * 0.38 + attention * 0.08) * edgeFade;
    }

    float coreSpeed = ${String(1 / MUSEUM_OBSERVATORY_FLOW_TIMING.coreCrossingSeconds)} + attention * 0.095;
    float coreTravel = vUv.x - flowClock * coreSpeed;
    float coreWave = sin(coreTravel * 11.0) * (0.022 + attention * 0.014);
    float coreY = bodyY + coreWave;
    float core = flowLine(vUv.y, coreY, 0.00235 + attention * 0.001);
    float corePacket = directionalPulse(vUv.x, flowClock, coreSpeed, 0.18);
    float coreFlow = laserFlowModulation(vUv.x, flowClock, coreSpeed, 0.18);
    float coreWisp = movingWisp(vUv.x, uTime, 0.23, 59.0);
    color += mix(vec3(0.34, 0.98, 1.0), vec3(1.0, 0.78, 0.4), smoothstep(0.52, 0.88, vUv.x))
      * core * ((0.34 + corePacket * 1.35) * coreFlow + coreWisp * 1.5) * edgeFade;
    alpha += core * (0.18 + corePacket * 0.45 + coreWisp * 0.52) * edgeFade;

    float wispLane = abs((vUv.y - bodyY) / (0.12 * max(uVerticalSizing, 0.1)));
    float wispCell = fract(vUv.x * 4.0 / max(uHorizontalSizing, 0.1)
      - uTime * (uWispSpeed + attention * 0.32) + floor(wispLane * 7.0) * 0.37);
    float wispSegment = smoothstep(0.02, 0.12, wispCell) * (1.0 - smoothstep(0.34, 0.58, wispCell));
    float wispPresence = smoothstep(1.0 - uWispDensity, 1.0, valueNoise(vec2(floor(vUv.x * 9.0), 19.0)));
    float wisp = exp(-wispLane * 3.8 * max(uFalloffStart, 0.05)) * wispSegment
      * wispPresence * smoothstep(0.18, 0.78, bodyNoise) * edgeFade * uWispIntensity;
    color += mix(vec3(0.23, 0.79, 0.84), vec3(0.86, 0.62, 0.32), step(0.52, bodyNoise))
      * wisp * (0.28 + attention * 0.25);
    alpha += wisp * 0.18;

    float spectrumY = 0.61 + sin(vUv.x * 7.0 - flowClock * 0.72) * 0.007;
    float spectrumLine = flowLine(vUv.y, spectrumY, 0.0008);
    float spikeCell = pow(0.5 + 0.5 * sin(vUv.x * 175.0 - flowClock * 14.0), 18.0);
    float spikeHeight = (0.005 + spikeCell * 0.045) * (0.55 + 0.45 * sin(vUv.x * 23.0 + flowClock * 0.13));
    float spike = (1.0 - smoothstep(spikeHeight, spikeHeight + 0.006, abs(vUv.y - spectrumY)))
      * pow(0.5 + 0.5 * sin(vUv.x * 340.0 - flowClock * 18.0), 26.0) * edgeFade;
    float spectrumPacket = directionalPulse(vUv.x, flowClock, 0.092 + attention * 0.04, 0.64);
    color += vec3(0.9, 0.69, 0.36) * (spectrumLine * (0.3 + spectrumPacket * 0.82) + spike * 0.62) * (0.7 + attention * 0.35);
    alpha += spectrumLine * (0.1 + spectrumPacket * 0.28) + spike * 0.22;

    float strengthGain = uFlowStrength / ${String(MUSEUM_OBSERVATORY_FLOW_CONTROLS.flowStrength)};
    color *= strengthGain * mix(vec3(1.0), uFlowColor, 0.82);
    alpha *= strengthGain;
    float luminance = max(color.r, max(color.g, color.b));
    gl_FragColor = vec4(color * 1.18, clamp(max(alpha * 1.8, luminance * 0.58), 0.0, 0.96));
  }
`;

const DIAGRAM_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}

  float spoke(vec2 uv, vec2 center, float count, float phase) {
    vec2 delta = uv - center;
    float angle = atan(delta.y, delta.x);
    return pow(max(0.0, cos(angle * count + phase)), 38.0) * smoothstep(0.18, 0.04, length(delta));
  }

  float dashedOrbit(vec2 uv, vec2 center, float radius, float phase, float count) {
    vec2 delta = uv - center;
    float angle = atan(delta.y, delta.x);
    float ring = exp(-pow((length(delta) - radius) * 150.0, 2.0));
    float dash = smoothstep(0.42, 0.88, 0.5 + 0.5 * sin(angle * count + phase));
    return ring * dash;
  }

  float orbitNode(vec2 uv, vec2 center, float radius, float angle) {
    vec2 node = center + vec2(cos(angle), sin(angle)) * radius;
    return exp(-pow(distance(uv, node) * 115.0, 2.0));
  }

  void main() {
    vec2 center = vec2(0.695, 0.56);
    float d = distance(vUv, center);
    float rings = dashedOrbit(vUv, center, 0.099, uTime * (0.68 + uAttention * 0.4), 15.0)
      + dashedOrbit(vUv, center, 0.128, -uTime * (0.42 + uAttention * 0.28), 11.0)
      + dashedOrbit(vUv, vec2(0.786, 0.722), 0.071, uTime * (0.53 + uAttention * 0.34), 9.0)
      + dashedOrbit(vUv, vec2(0.873, 0.54), 0.083, -uTime * 0.31, 13.0);
    float spokes = spoke(vUv, center, 14.0, uTime * (0.34 + uAttention * 0.24));
    float pointerDistance = distance(vUv, uPointer);
    float diffraction = pow(max(0.0, sin(pointerDistance * 118.0 - uTime * (0.8 + uAttention))), 16.0)
      * exp(-pointerDistance * 7.0) * uAttention;
    float orbitPacket = pow(max(0.0, sin(atan(vUv.y - center.y, vUv.x - center.x) * 4.0 - uTime * 0.5)), 18.0)
      * exp(-abs(d - 0.128) * 140.0);
    float nodes = orbitNode(vUv, center, 0.099, uTime * 0.62)
      + orbitNode(vUv, center, 0.128, -uTime * 0.37 + 2.1)
      + orbitNode(vUv, vec2(0.786, 0.722), 0.071, uTime * 0.49 + 1.4);
    float wavefrontRadius = fract(uTime * 0.095) * 0.22;
    float wavefront = exp(-pow((d - wavefrontRadius) * 95.0, 2.0)) * (1.0 - wavefrontRadius / 0.22);
    vec3 color = vec3(0.63, 0.88, 0.89) * (rings * 0.52 + spokes * 0.13);
    color += vec3(0.94, 0.7, 0.35) * (orbitPacket * 0.52 + nodes * 1.15);
    color += vec3(0.21, 0.75, 0.82) * wavefront * 0.36;
    color += mix(vec3(0.2, 0.86, 0.9), vec3(1.0, 0.61, 0.26), vUv.x) * diffraction * 0.68;
    float alpha = clamp(rings * 0.42 + spokes * 0.12 + orbitPacket * 0.4 + nodes * 0.86 + wavefront * 0.28 + diffraction * 0.55, 0.0, 0.88);
    gl_FragColor = vec4(color, alpha);
  }
`;

const PARTICLE_VERTEX = /* glsl */`
  attribute float aSeed;
  uniform float uTime;
  uniform float uAttention;
  uniform float uPointSize;
  uniform float uSpeed;
  uniform float uPhase;
  uniform float uAspect;
  uniform vec2 uPointer;
  varying float vParticleAlpha;

  void main() {
    float particleSpeed = uSpeed * (0.72 + fract(aSeed * 7.0) * 0.54) * (1.0 + uAttention * 1.25);
    float travel = mod(position.x + uAspect + uTime * particleSpeed, uAspect * 2.0) - uAspect;
    float normalizedX = (travel + uAspect) / (uAspect * 2.0);
    float pointerDistance = distance(vec2(normalizedX, position.y * 0.5 + 0.5), uPointer);
    float localWake = exp(-pointerDistance * 8.0) * uAttention;
    float drift = sin(uTime * (0.18 + uPhase * 0.07 + aSeed * 0.16) + aSeed * 31.0)
      * (0.006 + localWake * 0.022);
    float twinkle = 0.58 + 0.42 * sin(uTime * (0.34 + aSeed * 0.7) + aSeed * 19.0);
    vParticleAlpha = (0.56 + twinkle * 0.7) * (1.0 + uAttention * 0.22);
    gl_PointSize = uPointSize * (0.62 + fract(aSeed * 13.73) * 0.8) * (1.0 + uAttention * 0.18);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(travel, position.y + drift, position.z, 1.0);
  }
`;

const PARTICLE_FRAGMENT = /* glsl */`
  precision highp float;
  uniform vec3 uColor;
  varying float vParticleAlpha;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float halo = 1.0 - smoothstep(0.12, 0.5, d);
    float core = 1.0 - smoothstep(0.0, 0.14, d);
    float alpha = (halo * 0.52 + core) * vParticleAlpha;
    if (alpha < 0.015) discard;
    gl_FragColor = vec4(uColor * (0.62 + core * 0.72), alpha);
  }
`;

const ORB_VERTEX = /* glsl */`
  varying vec3 vObjectPosition;
  varying vec3 vViewNormal;
  varying vec3 vViewDirection;

  void main() {
    vObjectPosition = position;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vViewNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const ORB_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec3 vObjectPosition;
  varying vec3 vViewNormal;
  varying vec3 vViewDirection;
  uniform float uTime;
  uniform float uAttention;
  uniform vec2 uPointer;

  void main() {
    vec3 p = normalize(vObjectPosition);
    vec3 normal = normalize(vViewNormal);
    vec3 viewDirection = normalize(vViewDirection);
    vec3 warmLight = normalize(vec3(-0.55, 0.72, 0.8));
    vec3 coolLight = normalize(vec3(0.74, -0.34, 0.68));
    float warm = max(0.0, dot(normal, warmLight));
    float cool = max(0.0, dot(normal, coolLight));
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDirection)), 2.35);

    float faultA = abs(sin(p.x * 17.0 + p.y * 9.0 + sin(p.z * 11.0) * 2.4));
    float faultB = abs(sin(p.y * 21.0 - p.z * 13.0 + sin(p.x * 8.0) * 2.1));
    float faultC = abs(sin(p.z * 19.0 + p.x * 12.0 - sin(p.y * 10.0) * 1.8));
    float fissure = 1.0 - smoothstep(0.025, 0.105, min(faultA, min(faultB, faultC)));
    float mineral = 0.5 + 0.5 * sin(p.x * 5.2 - p.y * 3.7 + p.z * 6.1);
    float tide = 0.5 + 0.5 * sin(uTime * 0.19 + p.y * 4.0);

    vec3 pearl = mix(vec3(0.33, 0.38, 0.37), vec3(0.78, 0.73, 0.59), warm);
    pearl = mix(pearl, vec3(0.31, 0.66, 0.68), cool * (0.22 + mineral * 0.2));
    pearl += vec3(0.18, 0.38, 0.4) * fresnel * (0.46 + uAttention * 0.2);
    pearl += vec3(0.78, 0.58, 0.3) * tide * warm * 0.08;
    pearl = mix(pearl, vec3(0.055, 0.07, 0.07), fissure * 0.78);
    pearl += vec3(0.72, 0.94, 0.92) * smoothstep(0.66, 0.98, cool) * (0.18 + uAttention * 0.2);
    pearl += mix(vec3(0.16, 0.72, 0.75), vec3(0.96, 0.58, 0.29), uPointer.x)
      * fresnel * uAttention * 0.12;

    gl_FragColor = vec4(pearl, 1.0);
  }
`;

type PointerTarget = { current: THREE.Vector2 };
type PlaneBounds = readonly [number, number, number, number];

const FULL_PLANE_BOUNDS = [0, 0, 1, 1] as const satisfies PlaneBounds;

function configureTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
}

function usePointerPresence(enabled: boolean) {
  const presence = useRef(0);
  const laggedPointer = useRef(new THREE.Vector2(0.5, 0.5));
  return {
    pointer: laggedPointer,
    update(pointer: THREE.Vector2, delta: number) {
      laggedPointer.current.x = THREE.MathUtils.damp(laggedPointer.current.x, pointer.x, 6.4, delta);
      laggedPointer.current.y = THREE.MathUtils.damp(laggedPointer.current.y, pointer.y, 6.4, delta);
      presence.current = THREE.MathUtils.damp(presence.current, enabled ? 1 : 0, enabled ? 5.6 : 1.2, delta);
      return presence.current;
    },
  };
}

function FullPlane({
  fragmentShader,
  order,
  pointerActive,
  pointerTarget,
  texture,
  bounds = FULL_PLANE_BOUNDS,
  blending = THREE.NormalBlending,
  flowTuning,
}: {
  fragmentShader: string;
  order: number;
  pointerActive: boolean;
  pointerTarget: PointerTarget;
  texture?: THREE.Texture;
  bounds?: PlaneBounds;
  blending?: THREE.Blending;
  flowTuning?: MuseumObservatoryFlowTuning;
}) {
  const pointerPresence = usePointerPresence(pointerActive);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const invalidate = useThree(state => state.invalidate);
  const [minimumX, minimumY, maximumX, maximumY] = bounds;
  const width = (maximumX - minimumX) * MUSEUM_OBSERVATORY_PROOF_ASPECT * 2;
  const height = (maximumY - minimumY) * 2;
  const positionX = (minimumX + maximumX - 1) * MUSEUM_OBSERVATORY_PROOF_ASPECT;
  const positionY = minimumY + maximumY - 1;
  const [uniforms] = useState(() => ({
    uTexture: { value: texture ?? null },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uAttention: { value: 0 },
    uUvBounds: { value: new THREE.Vector4(minimumX, minimumY, maximumX, maximumY) },
    uFlowColor: { value: new THREE.Color(MUSEUM_OBSERVATORY_FLOW_CONTROLS.color) },
    uHorizontalSizing: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.horizontalSizing },
    uVerticalSizing: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.verticalSizing },
    uWispDensity: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.wispDensity },
    uWispSpeed: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.wispSpeed },
    uWispIntensity: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.wispIntensity },
    uFlowSpeed: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.flowSpeed },
    uFlowStrength: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.flowStrength },
    uFogIntensity: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.fogIntensity },
    uFogScale: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.fogScale },
    uFogFallSpeed: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.fogFallSpeed },
    uDecay: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.decay },
    uFalloffStart: { value: MUSEUM_OBSERVATORY_FLOW_CONTROLS.falloffStart },
  }));
  useEffect(() => {
    if (!flowTuning) return;
    uniforms.uFlowColor.value.set(flowTuning.color);
    uniforms.uHorizontalSizing.value = flowTuning.horizontalSizing;
    uniforms.uVerticalSizing.value = flowTuning.verticalSizing;
    uniforms.uWispDensity.value = flowTuning.wispDensity;
    uniforms.uWispSpeed.value = flowTuning.wispSpeed;
    uniforms.uWispIntensity.value = flowTuning.wispIntensity;
    uniforms.uFlowSpeed.value = flowTuning.flowSpeed;
    uniforms.uFlowStrength.value = flowTuning.flowStrength;
    uniforms.uFogIntensity.value = flowTuning.fogIntensity;
    uniforms.uFogScale.value = flowTuning.fogScale;
    uniforms.uFogFallSpeed.value = flowTuning.fogFallSpeed;
    uniforms.uDecay.value = flowTuning.decay;
    uniforms.uFalloffStart.value = flowTuning.falloffStart;
    if (materialRef.current) {
      materialRef.current.uniformsNeedUpdate = true;
    }
    invalidate();
  }, [flowTuning, invalidate, uniforms]);
  useFrame(({ clock }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = pointerPresence.update(pointerTarget.current, delta);
    uniforms.uPointer.value.copy(pointerPresence.pointer.current);
  });
  return (
    <mesh position={[positionX, positionY, order * 0.01]} renderOrder={order}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={PLANE_VERTEX}
        fragmentShader={fragmentShader}
        transparent={order > 0}
        depthTest={false}
        depthWrite={false}
        blending={blending}
      />
    </mesh>
  );
}

function FrameScheduler({ enabled, attentionActive }: { enabled: boolean; attentionActive: boolean }) {
  const invalidate = useThree(state => state.invalidate);

  useEffect(() => {
    if (!enabled) return;
    const fps = attentionActive
      ? MUSEUM_OBSERVATORY_PERFORMANCE.attentionFps
      : MUSEUM_OBSERVATORY_PERFORMANCE.idleFps;
    const interval = 1000 / fps;
    let frame = 0;
    let previous = 0;

    const schedule = (now: number) => {
      if (now - previous >= interval) {
        previous = now;
        invalidate();
      }
      frame = window.requestAnimationFrame(schedule);
    };

    frame = window.requestAnimationFrame(schedule);
    return () => window.cancelAnimationFrame(frame);
  }, [attentionActive, enabled, invalidate]);

  return null;
}

function SignalParticles({
  count,
  color,
  size,
  speed,
  phase,
  order,
  pointerActive,
  pointerTarget,
}: {
  count: number;
  color: string;
  size: number;
  speed: number;
  phase: number;
  order: number;
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const pointerPresence = usePointerPresence(pointerActive);
  const [positions] = useState(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const seed = (index + phase * 101) * 12.9898;
      values[index * 3] = (Math.sin(seed) * 0.5 + 0.5) * MUSEUM_OBSERVATORY_PROOF_ASPECT * 2 - MUSEUM_OBSERVATORY_PROOF_ASPECT;
      values[index * 3 + 1] = Math.sin(seed * 1.71 + phase) * 0.94;
      values[index * 3 + 2] = order * 0.01 + (index % 7) * 0.001;
    }
    return values;
  });
  const [seeds] = useState(() => {
    const values = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      values[index] = ((index + 1) * 0.61803398875 + phase * 0.137) % 1;
    }
    return values;
  });
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uAttention: { value: 0 },
    uPointSize: { value: size },
    uColor: { value: new THREE.Color(color) },
    uSpeed: { value: speed },
    uPhase: { value: phase },
    uAspect: { value: MUSEUM_OBSERVATORY_PROOF_ASPECT },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
  }));
  useFrame(({ clock }, delta) => {
    const attention = pointerPresence.update(pointerTarget.current, delta);
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = attention;
    uniforms.uPointer.value.copy(pointerPresence.pointer.current);
  });
  return (
    <points renderOrder={order}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ObservatoryOrb({
  pointerActive,
  pointerTarget,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointerPresence = usePointerPresence(pointerActive);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uAttention: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
  }));

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const attention = pointerPresence.update(pointerTarget.current, delta);
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = attention;
    uniforms.uPointer.value.copy(pointerPresence.pointer.current);
    meshRef.current.rotation.x += delta * (0.023 + attention * 0.047);
    meshRef.current.rotation.y += delta * (0.039 + attention * 0.073);
    meshRef.current.rotation.z += delta * (0.008 + attention * 0.016);
  });

  return (
    <mesh
      ref={meshRef}
      position={[0.42, 0.12, 0.075]}
      rotation={[0.18, -0.42, 0.08]}
      renderOrder={7.5}
    >
      <icosahedronGeometry args={[0.112, MUSEUM_OBSERVATORY_PERFORMANCE.orbDetail]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={ORB_VERTEX}
        fragmentShader={ORB_FRAGMENT}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function ObservatoryScene({
  pointerActive,
  pointerTarget,
  flowTuning,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
  flowTuning: MuseumObservatoryFlowTuning;
}) {
  const textures = useTexture([
    MUSEUM_OBSERVATORY_PROOF_ASSETS.field,
    MUSEUM_OBSERVATORY_PROOF_ASSETS.observatory,
    MUSEUM_OBSERVATORY_PROOF_ASSETS.city,
    MUSEUM_OBSERVATORY_PROOF_ASSETS.portal,
  ]);
  useEffect(() => textures.forEach(configureTexture), [textures]);
  const [field, observatory, city, portal] = textures;
  return (
    <>
      <FullPlane fragmentShader={FIELD_FRAGMENT} order={0} pointerActive={pointerActive} pointerTarget={pointerTarget} texture={field} />
      <FullPlane fragmentShader={FLOW_BACK_FRAGMENT} order={2} pointerActive={pointerActive} pointerTarget={pointerTarget} bounds={MUSEUM_OBSERVATORY_PERFORMANCE.bounds.rearFlow} blending={THREE.AdditiveBlending} flowTuning={flowTuning} />
      <SignalParticles count={MUSEUM_OBSERVATORY_PERFORMANCE.particles.far} color="#668b8c" size={1.65} speed={0.008} phase={0.4} order={3} pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <FullPlane fragmentShader={PORTAL_FRAGMENT} order={4} pointerActive={pointerActive} pointerTarget={pointerTarget} texture={portal} bounds={MUSEUM_OBSERVATORY_PERFORMANCE.bounds.portal} />
      <FullPlane fragmentShader={OBSERVATORY_FRAGMENT} order={5} pointerActive={pointerActive} pointerTarget={pointerTarget} texture={observatory} bounds={MUSEUM_OBSERVATORY_PERFORMANCE.bounds.observatory} />
      <FullPlane fragmentShader={CITY_FRAGMENT} order={6} pointerActive={pointerActive} pointerTarget={pointerTarget} texture={city} bounds={MUSEUM_OBSERVATORY_PERFORMANCE.bounds.city} />
      <SignalParticles count={MUSEUM_OBSERVATORY_PERFORMANCE.particles.middle} color="#87d7d8" size={1.95} speed={0.014} phase={1.2} order={7} pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <FullPlane fragmentShader={FLOW_FRONT_FRAGMENT} order={7.35} pointerActive={pointerActive} pointerTarget={pointerTarget} bounds={MUSEUM_OBSERVATORY_PERFORMANCE.bounds.frontFlow} blending={THREE.AdditiveBlending} flowTuning={flowTuning} />
      <ObservatoryOrb pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <FullPlane fragmentShader={DIAGRAM_FRAGMENT} order={8} pointerActive={pointerActive} pointerTarget={pointerTarget} bounds={MUSEUM_OBSERVATORY_PERFORMANCE.bounds.diagram} blending={THREE.AdditiveBlending} />
      <SignalParticles count={MUSEUM_OBSERVATORY_PERFORMANCE.particles.near} color="#efbd72" size={2.35} speed={0.022} phase={2.1} order={9} pointerActive={pointerActive} pointerTarget={pointerTarget} />
    </>
  );
}

function ObservatoryKineticOverlay() {
  return (
    <svg
      className={styles.observatoryKinetics}
      viewBox="0 0 852 790"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="observatory-lens">
          <stop offset="0" stopColor="#fff8d8" stopOpacity="0.92" />
          <stop offset="0.22" stopColor="#efd38d" stopOpacity="0.42" />
          <stop offset="0.58" stopColor="#72dce0" stopOpacity="0.16" />
          <stop offset="1" stopColor="#72dce0" stopOpacity="0" />
        </radialGradient>
        <filter id="observatory-soft-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <g className={styles.observatoryFogBack} filter="url(#observatory-soft-glow)">
        <ellipse cx="260" cy="488" rx="250" ry="54" fill="#2fabb1" opacity="0.12" />
        <ellipse cx="664" cy="184" rx="218" ry="48" fill="#c99b57" opacity="0.1" />
      </g>

      <g className={styles.observatoryOptics}>
        <g className={styles.observatoryRingA}>
          <circle cx="592" cy="348" r="73" />
          <circle cx="592" cy="348" r="94" />
          <path d="M 592 249 L 592 274 M 691 348 L 666 348 M 592 447 L 592 422 M 493 348 L 518 348" />
        </g>
        <g className={styles.observatoryRingB}>
          <circle cx="670" cy="220" r="57" />
          <path d="M 670 156 L 670 175 M 734 220 L 715 220 M 670 284 L 670 265 M 606 220 L 625 220" />
        </g>
        <g className={styles.observatoryRingC}>
          <circle cx="744" cy="363" r="62" />
          <circle cx="744" cy="363" r="80" />
        </g>
        <circle className={styles.observatoryLensGlow} cx="592" cy="348" r="58" fill="url(#observatory-lens)" />
        <circle className={styles.observatoryWavefront} cx="592" cy="348" r="54" />
        <circle className={`${styles.observatoryWavefront} ${styles.observatoryWavefrontDelayed}`} cx="592" cy="348" r="54" />
      </g>

      <g className={styles.observatoryFogFront} filter="url(#observatory-soft-glow)">
        <ellipse cx="426" cy="650" rx="310" ry="46" fill="#69d8da" opacity="0.09" />
      </g>
    </svg>
  );
}

class ProofBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function StaticFallback() {
  return (
    <Image
      className={styles.fallback}
      src={MUSEUM_OBSERVATORY_PROOF_ASSETS.fallback}
      alt=""
      fill
      priority
      sizes="(max-aspect-ratio: 852/790) 100vw, calc(100vh * 1.07848)"
    />
  );
}

function ObservatoryTuningPanel({
  tuning,
  onChange,
  onReset,
}: {
  tuning: MuseumObservatoryFlowTuning;
  onChange: (next: MuseumObservatoryFlowTuning) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <details
      className={styles.observatoryTuning}
      data-testid="observatory-flow-tuning"
      open={open}
      onToggle={event => setOpen(event.currentTarget.open)}
    >
      <summary>
        <span>Flow controls</span>
        <span>{open ? 'Close' : 'Tune'}</span>
      </summary>
      <div className={styles.observatoryTuningBody}>
        <label className={styles.observatoryColorControl} htmlFor="observatory-flow-color">
          <span>Color</span>
          <span className={styles.observatoryColorValue}>
            <input
              id="observatory-flow-color"
              aria-label="Flow color"
              type="color"
              value={tuning.color}
              onChange={event => onChange({ ...tuning, color: event.target.value })}
            />
            <output>{tuning.color}</output>
          </span>
        </label>
        {FLOW_TUNING_CONTROLS.map(control => (
          <label
            className={styles.observatoryRangeControl}
            htmlFor={`observatory-${control.key}`}
            key={control.key}
          >
            <span>
              {control.label}
              <output>{tuning[control.key].toFixed(control.precision)}</output>
            </span>
            <input
              id={`observatory-${control.key}`}
              aria-label={control.label}
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={tuning[control.key]}
              onChange={event => onChange({
                ...tuning,
                [control.key]: Number(event.target.value),
              })}
            />
          </label>
        ))}
        <div className={styles.observatoryTuningFooter}>
          <p>Values save in this browser.</p>
          <div className={styles.observatoryTuningActions}>
            <button type="button" onClick={() => onChange(buildFlowTuningPreset('min'))}>All minimum</button>
            <button type="button" onClick={() => onChange(buildFlowTuningPreset('max'))}>All maximum</button>
            <button type="button" onClick={onReset}>Reset defaults</button>
          </div>
        </div>
      </div>
    </details>
  );
}

export default function MuseumObservatoryProof() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pointerActive, setPointerActive] = useState(false);
  const [scenePointer, setScenePointer] = useState<MuseumScenePoint>({ x: 0.5, y: 0.5 });
  const [flowTuning, setFlowTuning] = useState<MuseumObservatoryFlowTuning>({
    ...MUSEUM_OBSERVATORY_FLOW_CONTROLS,
  });
  const [tuningReady, setTuningReady] = useState(false);
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const pointerStateFrame = useRef<number | null>(null);
  const pendingScenePointer = useRef<MuseumScenePoint>({ x: 0.5, y: 0.5 });

  const updatePointerTarget = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const [x, y] = toProofAttentionPoint(event.clientX, event.clientY, bounds);
    pointerTarget.current.set(x, y);
    pendingScenePointer.current = { x, y: 1 - y };
    if (pointerStateFrame.current === null) {
      pointerStateFrame.current = window.requestAnimationFrame(() => {
        setScenePointer(pendingScenePointer.current);
        pointerStateFrame.current = null;
      });
    }
    if (!pointerActive) setPointerActive(true);
  };

  const sceneFrame = getMuseumSceneFrame({
    pointer: scenePointer,
    apertureTarget: pointerActive ? scenePointer : undefined,
    stimulation: 1,
    reducedMotion,
    visible,
  });
  const sceneStyle = {
    '--scene-x': `${sceneFrame.pointer.x * 100}%`,
    '--scene-y': `${sceneFrame.pointer.y * 100}%`,
    '--aperture-x': `${sceneFrame.aperture.x * 100}%`,
    '--aperture-y': `${sceneFrame.aperture.y * 100}%`,
    '--scene-energy': sceneFrame.energy,
    '--scene-drift-x': `${sceneFrame.drift.x}px`,
    '--scene-drift-y': `${sceneFrame.drift.y}px`,
    '--mesh-drift-x': `${sceneFrame.drift.x * -0.35}px`,
    '--mesh-drift-y': `${sceneFrame.drift.y * -0.35}px`,
    '--aperture-strength': sceneFrame.apertureStrength,
    '--filament-strength': sceneFrame.filamentStrength,
  } as CSSProperties;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setVisible(document.visibilityState !== 'hidden');
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    setFlowTuning(readStoredFlowTuning());
    setTuningReady(true);
  }, []);

  useEffect(() => {
    if (!tuningReady) return;
    const save = window.setTimeout(() => {
      try {
        window.localStorage.setItem(OBSERVATORY_TUNING_STORAGE_KEY, JSON.stringify(flowTuning));
      } catch {
        // Private browsing policies can disable storage; live tuning should still work.
      }
    }, 180);
    return () => window.clearTimeout(save);
  }, [flowTuning, tuningReady]);

  useEffect(() => () => {
    if (pointerStateFrame.current !== null) {
      window.cancelAnimationFrame(pointerStateFrame.current);
    }
  }, []);

  return (
    <main className={`${styles.proof} ${styles.observatoryProof}`} data-reduced-motion={reducedMotion} data-attention-active={pointerActive}>
      <div
        className={styles.stage}
        style={sceneStyle}
        data-scene-settled={sceneFrame.settled}
        onPointerEnter={updatePointerTarget}
        onPointerMove={updatePointerTarget}
        onPointerLeave={() => {
          if (pointerStateFrame.current !== null) {
            window.cancelAnimationFrame(pointerStateFrame.current);
            pointerStateFrame.current = null;
          }
          pendingScenePointer.current = { x: 0.5, y: 0.5 };
          setPointerActive(false);
          setScenePointer({ x: 0.5, y: 0.5 });
        }}
      >
        <StaticFallback />
        <ProofBoundary fallback={null}>
          {!reducedMotion ? (
            <Canvas
              aria-label="Animated eastern Museum observatory compositor"
              dpr={MUSEUM_OBSERVATORY_PERFORMANCE.renderDpr}
              frameloop={visible ? 'demand' : 'never'}
              orthographic
              camera={{
                left: -MUSEUM_OBSERVATORY_PROOF_ASPECT,
                right: MUSEUM_OBSERVATORY_PROOF_ASPECT,
                top: 1,
                bottom: -1,
                near: 0.1,
                far: 10,
                position: [0, 0, 5],
              }}
              gl={{ alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' }}
              onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; }}
            >
              <FrameScheduler enabled={visible} attentionActive={pointerActive} />
              <Suspense fallback={null}>
                <ObservatoryScene
                  pointerActive={pointerActive}
                  pointerTarget={pointerTarget}
                  flowTuning={flowTuning}
                />
              </Suspense>
            </Canvas>
          ) : null}
        </ProofBoundary>
        {!reducedMotion ? <ObservatoryKineticOverlay /> : null}
        <div className={styles.museumEffects} aria-hidden="true">
          <span className={styles.sceneHalo} />
          <span
            className={museumStyles.ecologyMembrane}
            data-layer="museum:membrane"
            style={{ backgroundImage: `url(${MUSEUM_OBSERVATORY_PROOF_ASSETS.fallback})` }}
          />
          <span
            className={museumStyles.ecologyAperture}
            data-layer="museum:aperture"
            style={{ backgroundImage: `url(${MUSEUM_OBSERVATORY_PROOF_ASSETS.fallback})` }}
          />
          <span className={museumStyles.materialMesh} data-layer="museum:membrane" />
          <MuseumParticleField
            target={sceneFrame.aperture}
            energy={sceneFrame.energy}
            count={sceneFrame.particleCount}
            reducedMotion={reducedMotion || !visible}
            maxDpr={0.8}
            maxFps={24}
          />
          <span className={museumStyles.ecologyVeil} />
        </div>
        <div className={styles.grain} aria-hidden="true" />
      </div>
      <ObservatoryTuningPanel
        tuning={flowTuning}
        onChange={setFlowTuning}
        onReset={() => {
          try {
            window.localStorage.removeItem(OBSERVATORY_TUNING_STORAGE_KEY);
          } catch {
            // Keep reset functional even when browser storage is unavailable.
          }
          setFlowTuning({ ...MUSEUM_OBSERVATORY_FLOW_CONTROLS });
        }}
      />
      <header className={styles.caption}>
        <Link href="/projects">Return to the Museum</Link>
        <div>
          <p>Material proof 02 / east observatory</p>
          <h1>The architecture holds still. Its instruments do not.</h1>
        </div>
      </header>
      <p className={styles.legend}>unequal optical ratios / migrating nacre light / directional signal current / local refraction / layered haze</p>
    </main>
  );
}

useTexture.preload([
  MUSEUM_OBSERVATORY_PROOF_ASSETS.field,
  MUSEUM_OBSERVATORY_PROOF_ASSETS.observatory,
  MUSEUM_OBSERVATORY_PROOF_ASSETS.city,
  MUSEUM_OBSERVATORY_PROOF_ASSETS.portal,
]);
