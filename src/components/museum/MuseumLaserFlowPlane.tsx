'use client';

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useState, type MutableRefObject } from 'react';
import {
  MUSEUM_OBSERVATORY_PROOF_ASPECT,
  type MuseumObservatoryFlowTuning,
} from '@/lib/museum/observatoryProof';

const LASER_FLOW_VERTEX = /* glsl */`
  precision highp float;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// This is the React Bits LaserFlow material, adapted only for transparent
// compositing inside the Museum's existing React Three Fiber renderer.
const LASER_FLOW_FRAGMENT = /* glsl */`
  precision highp float;
  precision mediump int;

  uniform float iTime;
  uniform vec3 iResolution;
  uniform vec4 iMouse;
  uniform float uWispDensity;
  uniform float uTiltScale;
  uniform float uFlowTime;
  uniform float uFogTime;
  uniform float uBeamXFrac;
  uniform float uBeamYFrac;
  uniform float uFlowSpeed;
  uniform float uVLenFactor;
  uniform float uHLenFactor;
  uniform float uFogIntensity;
  uniform float uFogScale;
  uniform float uWSpeed;
  uniform float uWIntensity;
  uniform float uFlowStrength;
  uniform float uDecay;
  uniform float uFalloffStart;
  uniform float uFogFallSpeed;
  uniform vec3 uColor;
  uniform float uFade;

  #define PI 3.14159265359
  #define TWO_PI 6.28318530718
  #define EPS 1e-6
  #define EDGE_SOFT (DT_LOCAL * 4.0)
  #define DT_LOCAL 0.0038
  #define TAP_RADIUS 6
  #define R_H 150.0
  #define R_V 150.0
  #define FLARE_HEIGHT 16.0
  #define FLARE_AMOUNT 8.0
  #define FLARE_EXP 2.0
  #define TOP_FADE_START 0.1
  #define TOP_FADE_EXP 1.0
  #define FLOW_PERIOD 0.5
  #define FLOW_SHARPNESS 1.5

  #define W_BASE_X 1.5
  #define W_LAYER_GAP 0.25
  #define W_LANES 10
  #define W_SIDE_DECAY 0.5
  #define W_HALF 0.01
  #define W_AA 0.15
  #define W_CELL 20.0
  #define W_SEG_MIN 0.01
  #define W_SEG_MAX 0.55
  #define W_CURVE_AMOUNT 15.0
  #define W_CURVE_RANGE (FLARE_HEIGHT - 3.0)
  #define W_BOTTOM_EXP 10.0

  #define FOG_CONTRAST 1.2
  #define FOG_OCTAVES 5
  #define FOG_BOTTOM_BIAS 0.8
  #define FOG_TILT_MAX_X 0.35
  #define FOG_TILT_SHAPE 1.5
  #define FOG_BEAM_MIN 0.0
  #define FOG_BEAM_MAX 0.75
  #define FOG_MASK_GAMMA 0.5
  #define FOG_EXPAND_SHAPE 12.2
  #define FOG_EDGE_MIX 0.5

  #define HFOG_EDGE_START 0.20
  #define HFOG_EDGE_END 0.98
  #define HFOG_EDGE_GAMMA 1.4
  #define HFOG_Y_RADIUS 25.0
  #define HFOG_Y_SOFT 60.0

  #define EDGE_X0 0.22
  #define EDGE_X1 0.995
  #define EDGE_X_GAMMA 1.25
  #define EDGE_LUMA_T0 0.0
  #define EDGE_LUMA_T1 2.0
  #define DITHER_STRENGTH 1.0

  float gammaEncode(float x) {
    return x <= 0.00031308 ? 12.92 * x : 1.055 * pow(x, 1.0 / 2.4) - 0.055;
  }

  float beamSample(vec2 p, vec2 q, float power) {
    float distanceFromSample = distance(p, q);
    float falloff = power * uFalloffStart;
    float inverseSquare = (falloff * falloff) / (distanceFromSample * distanceFromSample + EPS);
    return power * min(1.0, inverseSquare);
  }

  float anisotropicBeamSample(vec2 p, vec2 q, float power, vec2 scale) {
    vec2 delta = p - q;
    float distanceSquared = (delta.x * delta.x) / (scale.x * scale.x)
      + (delta.y * delta.y) / (scale.y * scale.y);
    float falloff = power * uFalloffStart;
    float inverseSquare = (falloff * falloff) / (distanceSquared + EPS);
    return power * min(1.0, inverseSquare);
  }

  float triangleWave(float value) {
    float phase = fract(value);
    return 1.0 - abs(phase * 2.0 - 1.0);
  }

  float samplingWindow(float value, float minimum, float maximum) {
    float enter = smoothstep(minimum, minimum + EDGE_SOFT, value);
    float leave = 1.0 - smoothstep(maximum - EDGE_SOFT, maximum, value);
    return max(0.0, enter * leave);
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 34.123);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 cell = floor(p);
    vec2 local = fract(p);
    float a = hash21(cell);
    float b = hash21(cell + vec2(1.0, 0.0));
    float c = hash21(cell + vec2(0.0, 1.0));
    float d = hash21(cell + vec2(1.0, 1.0));
    vec2 blend = local * local * (3.0 - 2.0 * local);
    return mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
  }

  float fogFbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.6;
    mat2 turn = mat2(0.86, 0.5, -0.5, 0.86);
    for (int index = 0; index < FOG_OCTAVES; index++) {
      value += amplitude * valueNoise(p);
      p = turn * p * 2.03 + 17.1;
      amplitude *= 0.52;
    }
    return value;
  }

  float segmentGate(float value, float length) {
    float enter = smoothstep(0.0, W_AA, value);
    float leave = 1.0 - smoothstep(length, length + W_AA, value);
    return max(0.0, enter * leave);
  }

  float flareY(float y) {
    float t = clamp(1.0 - clamp(y, 0.0, FLARE_HEIGHT) / max(FLARE_HEIGHT, EPS), 0.0, 1.0);
    return pow(t, FLARE_EXP);
  }

  float verticalWisps(vec2 uv, float topFade) {
    float y = uv.y;
    float flowCell = (y + uFlowTime * uWSpeed) / W_CELL;
    float rawDensity = clamp(uWispDensity, 0.0, 2.0);
    float density = rawDensity <= 0.0 ? 1.0 : rawDensity;
    float laneCountFloat = floor(float(W_LANES) * min(density, 1.0) + 0.5);
    int laneCount = int(max(1.0, laneCountFloat));
    float primaryPresence = min(density, 1.0);
    float extraPresence = max(density - 1.0, 0.0);
    float flare = flareY(max(y, 0.0));
    float rangeMask = clamp(1.0 - y / max(W_CURVE_RANGE, EPS), 0.0, 1.0);
    float curve = flare * rangeMask;
    float spread = 1.0 + FLARE_AMOUNT * W_CURVE_AMOUNT * 0.05 * curve;
    float normalizedY = clamp(y / R_V, 0.0, 1.0);
    float bottomGain = pow(1.0 - normalizedY, W_BOTTOM_EXP);
    float sum = 0.0;

    for (int side = 0; side < 2; side++) {
      float signValue = side == 0 ? -1.0 : 1.0;
      for (int lane = 0; lane < W_LANES; lane++) {
        if (lane >= laneCount) break;
        float offset = W_BASE_X + float(lane) * W_LAYER_GAP;
        float centerX = signValue * offset * spread;
        float distanceX = abs(uv.x - centerX);
        float lateral = 1.0 - smoothstep(W_HALF, W_HALF + W_AA, distanceX);
        float amplitude = exp(-offset * W_SIDE_DECAY);
        float seed = hash21(vec2(offset, signValue * 17.0));
        float seededCell = flowCell + seed * 7.0;
        float cellIndex = floor(seededCell);
        float local = fract(seededCell);
        float segmentLength = mix(W_SEG_MIN, W_SEG_MAX, hash21(vec2(cellIndex, offset * 2.3)));
        float randomPresence = hash21(vec2(cellIndex, offset + signValue * 31.0));
        float segment = segmentGate(local, segmentLength) * step(randomPresence, primaryPresence);
        if (extraPresence > 0.0) {
          float extraRandom = hash21(vec2(cellIndex * 3.1 + 7.0, offset * 5.3 + signValue * 13.0));
          float shiftedLocal = fract(local + 0.5);
          segment += segmentGate(shiftedLocal, segmentLength * 0.9) * step(extraRandom, extraPresence);
        }
        sum += amplitude * lateral * segment;
      }
    }

    float span = smoothstep(-3.0, 0.0, y) * (1.0 - smoothstep(R_V - 6.0, R_V, y));
    return uWIntensity * sum * topFade * bottomGain * span;
  }

  void main() {
    vec2 center = iResolution.xy * 0.5;
    float inverseHalfWidth = 1.0 / max(center.x, 1.0);
    vec2 coordinateScale = (512.0 / iResolution.xy) * 0.4;
    vec2 uv = (gl_FragCoord.xy - center) * coordinateScale;
    vec2 beamOffset = vec2(
      uBeamXFrac * iResolution.x * coordinateScale.x,
      uBeamYFrac * iResolution.y * coordinateScale.y
    );
    vec2 beamUv = uv - beamOffset;

    float horizontalBeam = 0.0;
    float verticalBeam = 0.0;
    float basePhase = 1.5 * PI + uDecay * 0.5;
    float phaseMinimum = basePhase - uDecay;
    float phaseMaximum = basePhase;

    float horizontalCoordinate = clamp(beamUv.x / (R_H * uHLenFactor), -1.0, 1.0);
    float horizontalPhase = clamp(TWO_PI - acos(horizontalCoordinate), phaseMinimum, phaseMaximum);
    for (int tap = -TAP_RADIUS; tap <= TAP_RADIUS; tap++) {
      float samplePhase = horizontalPhase + float(tap) * DT_LOCAL;
      float weight = samplingWindow(samplePhase, phaseMinimum, phaseMaximum);
      if (weight <= 0.0) continue;
      float speed = max(abs(sin(samplePhase)), 0.02);
      float progress = clamp((basePhase - samplePhase) / max(uDecay, EPS), 0.0, 1.0);
      float envelope = pow(1.0 - abs(progress * 2.0 - 1.0), 0.8);
      vec2 samplePoint = vec2(R_H * uHLenFactor * cos(samplePhase), 0.0);
      horizontalBeam += weight * beamSample(beamUv, samplePoint, envelope * speed);
    }

    float yPixels = beamUv.y;
    float verticalCoordinate = clamp(-yPixels / (R_V * uVLenFactor), -1.0, 1.0);
    float verticalPhase = clamp(TWO_PI - acos(verticalCoordinate), phaseMinimum, phaseMaximum);
    for (int tap = -TAP_RADIUS; tap <= TAP_RADIUS; tap++) {
      float samplePhase = verticalPhase + float(tap) * DT_LOCAL;
      float weight = samplingWindow(samplePhase, phaseMinimum, phaseMaximum);
      if (weight <= 0.0) continue;
      float baseY = -R_V * cos(samplePhase);
      float normalizedY = clamp(baseY / R_V, 0.0, 1.0);
      float speed = max(abs(sin(samplePhase)), 0.02);
      float envelope = pow(1.0 - normalizedY, 0.6) * speed;
      float cap = pow(1.0 - smoothstep(TOP_FADE_START, 1.0, normalizedY), TOP_FADE_EXP);
      envelope *= cap;
      float flowPhase = normalizedY / max(FLOW_PERIOD, EPS) + uFlowTime * uFlowSpeed;
      float flow = pow(triangleWave(flowPhase), FLOW_SHARPNESS);
      envelope *= mix(1.0 - uFlowStrength, 1.0, flow);
      float sampleY = -R_V * uVLenFactor * cos(samplePhase);
      float flare = pow(smoothstep(FLARE_HEIGHT, 0.0, sampleY), FLARE_EXP);
      vec2 anisotropicScale = vec2(1.0 + FLARE_AMOUNT * flare, 1.0);
      float positiveMask = step(0.0, sampleY);
      verticalBeam += weight * anisotropicBeamSample(
        beamUv,
        vec2(0.0, sampleY),
        positiveMask * envelope,
        anisotropicScale
      );
    }

    float normalizedY = clamp(yPixels / R_V, 0.0, 1.0);
    float topFade = pow(1.0 - smoothstep(TOP_FADE_START, 1.0, normalizedY), TOP_FADE_EXP);
    float beamLight = horizontalBeam + verticalBeam * topFade;
    float wisps = verticalWisps(vec2(beamUv.x, yPixels), topFade);

    vec2 fogUv = beamUv * uFogScale;
    float mouseActive = step(1.0, length(iMouse.xy));
    float normalizedMouseX = ((iMouse.x - center.x) * inverseHalfWidth) * mouseActive;
    float mouseMagnitude = abs(normalizedMouseX);
    float shapedTilt = mix(mouseMagnitude, pow(mouseMagnitude, FOG_TILT_SHAPE), 0.35);
    float tilt = clamp(sign(normalizedMouseX) * shapedTilt * uTiltScale, -FOG_TILT_MAX_X, FOG_TILT_MAX_X);
    vec2 fogDirection = normalize(vec2(tilt, 1.0));
    fogUv += uFogTime * uFogFallSpeed * fogDirection;
    vec2 perpendicular = vec2(-fogDirection.y, fogDirection.x);
    fogUv += perpendicular * (0.08 * sin(dot(beamUv, perpendicular) * 0.08 + uFogTime * 0.9));
    float fogNoise = fogFbm(
      fogUv + vec2(fogFbm(fogUv + vec2(7.3, 2.1)), fogFbm(fogUv + vec2(-3.7, 5.9))) * 0.6
    );
    fogNoise = pow(clamp(fogNoise, 0.0, 1.0), FOG_CONTRAST);
    float pixelWidth = 1.0 / max(iResolution.y, 1.0);
    float beamDerivative = max(fwidth(beamLight), pixelWidth);
    float beamMaskBase = pow(
      smoothstep(FOG_BEAM_MIN - beamDerivative, FOG_BEAM_MAX + beamDerivative, beamLight),
      FOG_MASK_GAMMA
    );
    float beamMask = 1.0 - pow(1.0 - beamMaskBase, FOG_EXPAND_SHAPE);
    beamMask = mix(beamMask * beamMaskBase, beamMask, FOG_EDGE_MIX);
    float verticalFogPresence = 1.0 - smoothstep(HFOG_Y_RADIUS, HFOG_Y_RADIUS + HFOG_Y_SOFT, abs(yPixels));
    float edgeDistance = abs((gl_FragCoord.x - center.x) * inverseHalfWidth);
    float horizontalEdge = pow(
      clamp(1.0 - smoothstep(HFOG_EDGE_START, HFOG_EDGE_END, edgeDistance), 0.0, 1.0),
      HFOG_EDGE_GAMMA
    );
    float horizontalWeight = mix(1.0, horizontalEdge, clamp(verticalFogPresence, 0.0, 1.0));
    float bottomBias = mix(1.0, 1.0 - normalizedY, FOG_BOTTOM_BIAS);
    float radialFade = 1.0 - smoothstep(0.0, 0.7, length(beamUv) / 120.0);
    float fog = fogNoise * (uFogIntensity * 1.8) * bottomBias * beamMask * horizontalWeight * radialFade;

    float lightAndFog = beamLight + fog;
    float dither = (hash21(gl_FragCoord.xy) - 0.5) * (DITHER_STRENGTH / 255.0);
    float tone = gammaEncode(lightAndFog + wisps);
    vec3 color = tone * uColor + dither;
    float alpha = clamp(gammaEncode(beamLight + wisps * 0.6) + dither * 0.6, 0.0, 1.0);
    float horizontalFade = pow(
      clamp(1.0 - smoothstep(EDGE_X0, EDGE_X1, edgeDistance), 0.0, 1.0),
      EDGE_X_GAMMA
    );
    float sceneLight = lightAndFog + max(0.0, wisps) * 0.5;
    float highlight = smoothstep(EDGE_LUMA_T0, EDGE_LUMA_T1, sceneLight);
    float edgeMask = mix(horizontalFade, 1.0, highlight);
    color *= edgeMask * uFade;
    alpha *= edgeMask * uFade;
    gl_FragColor = vec4(color, alpha);
  }
`;

type PointerTarget = { current: THREE.Vector2 };

function parseHexColor(hex: string, target: THREE.Vector3) {
  const normalized = hex.replace('#', '').padEnd(6, 'f').slice(0, 6);
  const value = Number.parseInt(normalized, 16);
  target.set(
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  );
}

export default function MuseumLaserFlowPlane({
  tuningRef,
  pointerActive,
  pointerTarget,
}: {
  tuningRef: MutableRefObject<MuseumObservatoryFlowTuning>;
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const { gl, size } = useThree();
  const initialTuning = tuningRef.current;
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [uniforms] = useState(() => ({
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3(1, 1, 1) },
    iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
    uWispDensity: { value: initialTuning.wispDensity },
    uTiltScale: { value: 0.01 },
    uFlowTime: { value: 0 },
    uFogTime: { value: 0 },
    uBeamXFrac: { value: 0.1 },
    uBeamYFrac: { value: 0 },
    uFlowSpeed: { value: initialTuning.flowSpeed },
    uVLenFactor: { value: initialTuning.verticalSizing },
    uHLenFactor: { value: initialTuning.horizontalSizing },
    uFogIntensity: { value: initialTuning.fogIntensity },
    uFogScale: { value: initialTuning.fogScale },
    uWSpeed: { value: initialTuning.wispSpeed },
    uWIntensity: { value: initialTuning.wispIntensity },
    uFlowStrength: { value: initialTuning.flowStrength },
    uDecay: { value: initialTuning.decay },
    uFalloffStart: { value: initialTuning.falloffStart },
    uFogFallSpeed: { value: initialTuning.fogFallSpeed },
    uColor: { value: new THREE.Vector3(1, 1, 1) },
    uFade: { value: 1 },
  }));

  useFrame(({ clock }, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const liveUniforms = material.uniforms;
    const current = tuningRef.current;
    const dpr = gl.getPixelRatio();
    const width = size.width * dpr;
    const height = size.height * dpr;
    const clampedDelta = Math.min(0.033, Math.max(0.001, delta));

    liveUniforms.iTime.value = clock.elapsedTime;
    liveUniforms.iResolution.value.set(width, height, dpr);
    liveUniforms.uFlowTime.value += clampedDelta;
    liveUniforms.uFogTime.value += clampedDelta;
    if (pointerActive) {
      liveUniforms.iMouse.value.set(pointerTarget.current.x * width, pointerTarget.current.y * height, 0, 0);
    } else {
      liveUniforms.iMouse.value.set(0, 0, 0, 0);
    }
    liveUniforms.uWispDensity.value = current.wispDensity;
    liveUniforms.uFlowSpeed.value = current.flowSpeed;
    liveUniforms.uVLenFactor.value = current.verticalSizing;
    liveUniforms.uHLenFactor.value = current.horizontalSizing;
    liveUniforms.uFogIntensity.value = current.fogIntensity;
    liveUniforms.uFogScale.value = current.fogScale;
    liveUniforms.uWSpeed.value = current.wispSpeed;
    liveUniforms.uWIntensity.value = current.wispIntensity;
    liveUniforms.uFlowStrength.value = current.flowStrength;
    liveUniforms.uDecay.value = current.decay;
    liveUniforms.uFalloffStart.value = current.falloffStart;
    liveUniforms.uFogFallSpeed.value = current.fogFallSpeed;
    parseHexColor(current.color, liveUniforms.uColor.value);
  });

  return (
    <mesh position={[0, 0, 0.0735]} renderOrder={7.35}>
      <planeGeometry args={[MUSEUM_OBSERVATORY_PROOF_ASPECT * 2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={LASER_FLOW_VERTEX}
        fragmentShader={LASER_FLOW_FRAGMENT}
        transparent
        premultipliedAlpha={false}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
