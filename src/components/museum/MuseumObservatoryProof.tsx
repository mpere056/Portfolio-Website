'use client';

import { Canvas, useFrame } from '@react-three/fiber';
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
  MUSEUM_OBSERVATORY_PROOF_ASPECT,
  MUSEUM_OBSERVATORY_PROOF_ASSETS,
} from '@/lib/museum/observatoryProof';
import { toProofAttentionPoint } from '@/lib/museum/ambientProof';
import { getMuseumSceneFrame, type MuseumScenePoint } from '@/lib/museum/scene';
import MuseumParticleField from './MuseumParticleField';
import museumStyles from './MuseumShell.module.css';
import styles from './MuseumAmbientProof.module.css';

const PLANE_VERTEX = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
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
  vec2 rotateAround(vec2 uv, vec2 center, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c) * (uv - center) + center;
  }
  float annulus(vec2 uv, vec2 center, float radius, float width) {
    return 1.0 - smoothstep(width, width + 0.012, abs(distance(uv, center) - radius));
  }
`;

const STRUCTURE_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}

  vec4 rotatedAssembly(vec4 base, vec2 center, float radius, float width, float angle) {
    float mask = annulus(vUv, center, radius, width);
    vec4 turned = texture2D(uTexture, rotateAround(vUv, center, angle));
    return mix(base, turned, mask * 0.88);
  }

  void main() {
    float field = fbm(vUv * 4.2 + vec2(uTime * 0.009, -uTime * 0.006));
    vec2 stableUv = vUv + vec2(field - 0.5, 0.5 - field) * 0.0018;
    vec4 color = texture2D(uTexture, stableUv);

    float attendedSpeed = 1.0 + uAttention * 2.2;
    color = rotatedAssembly(color, vec2(0.645, 0.485), 0.108, 0.046, uTime * 0.14 * attendedSpeed);
    color = rotatedAssembly(color, vec2(0.775, 0.695), 0.072, 0.032, -uTime * 0.21 * attendedSpeed);
    color = rotatedAssembly(color, vec2(0.885, 0.465), 0.087, 0.035, uTime * 0.095 * attendedSpeed);

    vec2 lensCenter = vec2(0.645, 0.485);
    vec2 lensVector = vUv - lensCenter;
    float lensDistance = length(lensVector);
    float lensMask = 1.0 - smoothstep(0.085, 0.155, lensDistance);
    float lensNoise = fbm(vUv * 11.0 + vec2(uTime * 0.038, -uTime * 0.021));
    vec2 lensUv = lensCenter + lensVector * (0.985 + (lensNoise - 0.5) * (0.035 + uAttention * 0.03));
    float chroma = lensMask * (0.0025 + uAttention * 0.005);
    vec3 refracted = vec3(
      texture2D(uTexture, lensUv + lensVector * chroma).r,
      texture2D(uTexture, lensUv).g,
      texture2D(uTexture, lensUv - lensVector * chroma).b
    );
    color.rgb = mix(color.rgb, refracted, lensMask * 0.74);

    float observatoryMask = 1.0 - smoothstep(0.17, 0.46, distance(vUv, vec2(0.72, 0.51)));
    float sweepPosition = -0.12 + fract(uTime * 0.055) * 1.24;
    float travelingLight = exp(-abs(vUv.x - sweepPosition) * 18.0) * observatoryMask;
    float iris = pow(max(0.0, cos(atan(lensVector.y, lensVector.x) * 7.0 - uTime * 0.58)), 18.0)
      * lensMask * smoothstep(0.025, 0.12, lensDistance);
    float goldSweep = pow(max(0.0, sin((vUv.x * 0.74 + vUv.y) * 15.0 - uTime * 0.23 + field * 5.0)), 8.0);
    float cyanSweep = pow(max(0.0, sin((vUv.x - vUv.y * 0.42) * 19.0 + uTime * 0.17)), 10.0);
    float pointerDistance = distance(vUv, uPointer);
    float pointerLight = exp(-pointerDistance * 8.0) * uAttention;
    float lensPulse = exp(-lensDistance * 9.0) * (0.5 + 0.5 * sin(uTime * 0.37));
    color.rgb += vec3(0.95, 0.67, 0.28) * goldSweep * 0.09;
    color.rgb += vec3(0.08, 0.64, 0.72) * cyanSweep * 0.075;
    color.rgb += mix(vec3(0.18, 0.78, 0.84), vec3(1.0, 0.72, 0.34), vUv.x) * pointerLight * 0.38;
    color.rgb += vec3(0.55, 0.82, 0.86) * lensPulse * lensMask * 0.11;
    color.rgb += mix(vec3(0.16, 0.75, 0.82), vec3(1.0, 0.72, 0.32), sweepPosition) * travelingLight * 0.32;
    color.rgb += vec3(0.72, 0.94, 0.93) * iris * (0.16 + uAttention * 0.2);
    gl_FragColor = color;
  }
`;

const ATMOSPHERE_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  ${NOISE_GLSL}
  void main() {
    float farHaze = fbm(vUv * vec2(3.2, 4.8) + vec2(uTime * 0.035, -uTime * 0.019));
    float nearHaze = fbm(vUv * vec2(7.5, 3.7) + vec2(-uTime * 0.061, uTime * 0.014));
    float depthWindow = smoothstep(0.05, 0.55, vUv.y) * (1.0 - smoothstep(0.88, 1.0, vUv.y));
    float lowPassage = exp(-pow((vUv.y - (0.27 + sin(uTime * 0.09) * 0.08)) * 6.0, 2.0));
    float density = smoothstep(0.43, 0.77, farHaze) * 0.34
      + smoothstep(0.57, 0.84, nearHaze) * 0.2
      + lowPassage * (0.035 + farHaze * 0.07);
    vec3 color = mix(vec3(0.04, 0.23, 0.27), vec3(0.26, 0.17, 0.08), farHaze);
    gl_FragColor = vec4(color, density * depthWindow);
  }
`;

const CURRENT_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}

  float strand(vec2 p, float offset, float phase, float speed) {
    float localWake = exp(-pow((p.x - uPointer.x) * 5.0, 2.0)) * uAttention;
    float y = 0.78 - p.x * 0.34 + offset
      + sin(p.x * 10.0 + phase - uTime * speed) * (0.024 + localWake * 0.03)
      + sin(p.x * 23.0 - phase + uTime * speed * 0.61) * 0.009;
    float width = 0.0024 + localWake * 0.0015;
    return smoothstep(width * 3.4, width, abs(p.y - y));
  }

  void main() {
    float lines = 0.0;
    vec3 color = vec3(0.0);
    float bodyY = 0.78 - vUv.x * 0.34;
    float bodyDistance = abs(vUv.y - bodyY);
    float bodyNoise = fbm(vec2(vUv.x * 5.5 - uTime * 0.24, vUv.y * 12.0 + uTime * 0.035));
    float fluidBody = exp(-bodyDistance * 24.0) * smoothstep(0.2, 0.82, bodyNoise);
    for (int i = 0; i < 10; i++) {
      float fi = float(i);
      float line = strand(vUv, (fi - 4.5) * 0.015, fi * 0.77, 0.24 + fi * 0.011 + uAttention * 0.18);
      float packet = pow(max(0.0, sin((vUv.x * 15.0 - uTime * (0.92 + fi * 0.03 + uAttention * 0.55) + fi) * 3.14159)), 12.0);
      vec3 tint = mix(vec3(0.16, 0.78, 0.86), vec3(0.94, 0.63, 0.29), smoothstep(5.0, 8.0, fi));
      color += tint * line * (0.42 + packet * (1.28 + uAttention * 0.85));
      lines += line;
    }
    float packetX = -0.08 + fract(uTime * (0.11 + uAttention * 0.055)) * 1.16;
    vec2 packetCenter = vec2(packetX, 0.78 - packetX * 0.34);
    float packetWake = exp(-pow(distance(vUv, packetCenter) * 34.0, 2.0));
    float wakeRing = exp(-pow((distance(vUv, packetCenter) - 0.045) * 80.0, 2.0));
    float fade = smoothstep(0.02, 0.16, vUv.x) * (1.0 - smoothstep(0.93, 1.0, vUv.x));
    float vapor = fbm(vec2(vUv.x * 6.0 - uTime * 0.12, vUv.y * 17.0));
    color += mix(vec3(0.02, 0.32, 0.38), vec3(0.35, 0.17, 0.04), bodyNoise) * fluidBody * 0.24;
    color += vec3(0.52, 0.96, 1.0) * packetWake * 1.45;
    color += vec3(0.98, 0.72, 0.34) * wakeRing * 0.72;
    color += vec3(0.06, 0.25, 0.28) * vapor * lines * 0.22;
    float alpha = lines * fade * (0.56 + uAttention * 0.34) + fluidBody * 0.12 + packetWake * 0.9 + wakeRing * 0.42;
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.96));
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
    vec2 center = vec2(0.645, 0.485);
    float d = distance(vUv, center);
    float rings = dashedOrbit(vUv, center, 0.125, uTime * (0.68 + uAttention * 0.4), 15.0)
      + dashedOrbit(vUv, center, 0.162, -uTime * (0.42 + uAttention * 0.28), 11.0)
      + dashedOrbit(vUv, vec2(0.775, 0.695), 0.09, uTime * (0.53 + uAttention * 0.34), 9.0)
      + dashedOrbit(vUv, vec2(0.885, 0.465), 0.105, -uTime * 0.31, 13.0);
    float spokes = spoke(vUv, center, 14.0, uTime * (0.34 + uAttention * 0.24));
    float pointerDistance = distance(vUv, uPointer);
    float diffraction = pow(max(0.0, sin(pointerDistance * 118.0 - uTime * (0.8 + uAttention))), 16.0)
      * exp(-pointerDistance * 7.0) * uAttention;
    float orbitPacket = pow(max(0.0, sin(atan(vUv.y - center.y, vUv.x - center.x) * 4.0 - uTime * 0.5)), 18.0)
      * exp(-abs(d - 0.162) * 140.0);
    float nodes = orbitNode(vUv, center, 0.125, uTime * 0.62)
      + orbitNode(vUv, center, 0.162, -uTime * 0.37 + 2.1)
      + orbitNode(vUv, vec2(0.775, 0.695), 0.09, uTime * 0.49 + 1.4);
    float wavefrontRadius = fract(uTime * 0.095) * 0.28;
    float wavefront = exp(-pow((d - wavefrontRadius) * 95.0, 2.0)) * (1.0 - wavefrontRadius / 0.28);
    vec3 color = vec3(0.63, 0.88, 0.89) * (rings * 0.52 + spokes * 0.13);
    color += vec3(0.94, 0.7, 0.35) * (orbitPacket * 0.52 + nodes * 1.15);
    color += vec3(0.21, 0.75, 0.82) * wavefront * 0.36;
    color += mix(vec3(0.2, 0.86, 0.9), vec3(1.0, 0.61, 0.26), vUv.x) * diffraction * 0.68;
    float alpha = clamp(rings * 0.42 + spokes * 0.12 + orbitPacket * 0.4 + nodes * 0.86 + wavefront * 0.28 + diffraction * 0.55, 0.0, 0.88);
    gl_FragColor = vec4(color, alpha);
  }
`;

type PointerTarget = { current: THREE.Vector2 };

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
  blending = THREE.NormalBlending,
}: {
  fragmentShader: string;
  order: number;
  pointerActive: boolean;
  pointerTarget: PointerTarget;
  texture?: THREE.Texture;
  blending?: THREE.Blending;
}) {
  const pointerPresence = usePointerPresence(pointerActive);
  const [uniforms] = useState(() => ({
    uTexture: { value: texture ?? null },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uAttention: { value: 0 },
  }));
  useFrame(({ clock }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = pointerPresence.update(pointerTarget.current, delta);
    uniforms.uPointer.value.copy(pointerPresence.pointer.current);
  });
  return (
    <mesh position={[0, 0, order * 0.01]} renderOrder={order}>
      <planeGeometry args={[MUSEUM_OBSERVATORY_PROOF_ASPECT * 2, 2]} />
      <shaderMaterial
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

function SignalParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const [positions] = useState(() => {
    const values = new Float32Array(84 * 3);
    for (let index = 0; index < 84; index += 1) {
      const seed = index * 12.9898;
      values[index * 3] = (Math.sin(seed) * 0.5 + 0.5) * MUSEUM_OBSERVATORY_PROOF_ASPECT * 2 - MUSEUM_OBSERVATORY_PROOF_ASPECT;
      values[index * 3 + 1] = Math.sin(seed * 1.71 + 2.3);
      values[index * 3 + 2] = 0.22 + (index % 7) * 0.008;
    }
    return values;
  });
  useFrame(({ clock }, delta) => {
    if (!pointsRef.current || !geometryRef.current) return;
    for (let index = 0; index < positions.length / 3; index += 1) {
      const offset = index * 3;
      const speed = 0.018 + (index % 7) * 0.0045;
      positions[offset] += delta * speed;
      if (positions[offset] > MUSEUM_OBSERVATORY_PROOF_ASPECT + 0.08) {
        positions[offset] = -MUSEUM_OBSERVATORY_PROOF_ASPECT - 0.08;
      }
      positions[offset + 1] += Math.sin(clock.elapsedTime * (0.22 + (index % 5) * 0.035) + index) * delta * 0.0014;
    }
    const attribute = geometryRef.current.getAttribute('position') as THREE.BufferAttribute;
    attribute.needsUpdate = true;
    pointsRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.047) * 0.018;
  });
  return (
    <points ref={pointsRef} renderOrder={5}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#b9edef"
        size={0.013}
        sizeAttenuation
        transparent
        opacity={0.68}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ObservatoryScene({ pointerActive, pointerTarget }: { pointerActive: boolean; pointerTarget: PointerTarget }) {
  const texture = useTexture(MUSEUM_OBSERVATORY_PROOF_ASSETS.crop);
  useEffect(() => configureTexture(texture), [texture]);
  return (
    <>
      <FullPlane fragmentShader={STRUCTURE_FRAGMENT} order={0} pointerActive={pointerActive} pointerTarget={pointerTarget} texture={texture} />
      <FullPlane fragmentShader={ATMOSPHERE_FRAGMENT} order={1} pointerActive={false} pointerTarget={pointerTarget} blending={THREE.AdditiveBlending} />
      <FullPlane fragmentShader={CURRENT_FRAGMENT} order={2} pointerActive={pointerActive} pointerTarget={pointerTarget} blending={THREE.AdditiveBlending} />
      <FullPlane fragmentShader={DIAGRAM_FRAGMENT} order={3} pointerActive={pointerActive} pointerTarget={pointerTarget} blending={THREE.AdditiveBlending} />
      <SignalParticles />
    </>
  );
}

function ObservatoryKineticOverlay() {
  const mainCurrent = 'M -45 184 C 152 154 286 244 448 303 C 612 364 718 430 902 463';
  const upperCurrent = 'M -40 126 C 164 121 292 204 446 274 C 620 352 732 376 900 414';
  const lowerCurrent = 'M -35 248 C 130 218 268 296 438 352 C 602 406 728 472 906 493';
  return (
    <svg
      className={styles.observatoryKinetics}
      viewBox="0 0 852 790"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="observatory-cyan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#62edf1" stopOpacity="0" />
          <stop offset="0.32" stopColor="#78f7f4" stopOpacity="0.75" />
          <stop offset="0.72" stopColor="#9ffbff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#64dbe3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="observatory-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#eab863" stopOpacity="0" />
          <stop offset="0.46" stopColor="#ffe1a0" stopOpacity="0.78" />
          <stop offset="1" stopColor="#c88735" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="observatory-lens">
          <stop offset="0" stopColor="#fff8d8" stopOpacity="0.92" />
          <stop offset="0.22" stopColor="#efd38d" stopOpacity="0.42" />
          <stop offset="0.58" stopColor="#72dce0" stopOpacity="0.16" />
          <stop offset="1" stopColor="#72dce0" stopOpacity="0" />
        </radialGradient>
        <filter id="observatory-soft-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="observatory-line-glow" x="-30%" y="-80%" width="160%" height="260%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g className={styles.observatoryFogBack} filter="url(#observatory-soft-glow)">
        <ellipse cx="260" cy="488" rx="250" ry="54" fill="#2fabb1" opacity="0.12" />
        <ellipse cx="664" cy="184" rx="218" ry="48" fill="#c99b57" opacity="0.1" />
      </g>

      <g className={styles.observatoryCurrents} filter="url(#observatory-line-glow)">
        <path className={styles.observatoryCurrentCyan} d={mainCurrent} stroke="url(#observatory-cyan)" />
        <path className={styles.observatoryCurrentGold} d={upperCurrent} stroke="url(#observatory-gold)" />
        <path className={styles.observatoryCurrentFine} d={lowerCurrent} stroke="#73e5e7" />
        <circle className={styles.observatoryPacketCyan} r="5.5" fill="#c6ffff">
          <animateMotion dur="7.8s" repeatCount="indefinite" path={mainCurrent} />
        </circle>
        <circle className={styles.observatoryPacketGold} r="4.5" fill="#ffe3a0">
          <animateMotion dur="10.6s" begin="-4.1s" repeatCount="indefinite" path={upperCurrent} />
        </circle>
        <circle className={styles.observatoryPacketFine} r="3.2" fill="#8ffaff">
          <animateMotion dur="12.9s" begin="-7.3s" repeatCount="indefinite" path={lowerCurrent} />
        </circle>
      </g>

      <g className={styles.observatoryOptics}>
        <g className={styles.observatoryRingA}>
          <circle cx="550" cy="407" r="92" />
          <circle cx="550" cy="407" r="119" />
          <path d="M 550 282 L 550 313 M 675 407 L 644 407 M 550 532 L 550 501 M 425 407 L 456 407" />
        </g>
        <g className={styles.observatoryRingB}>
          <circle cx="660" cy="241" r="72" />
          <path d="M 660 160 L 660 184 M 741 241 L 717 241 M 660 322 L 660 298 M 579 241 L 603 241" />
        </g>
        <g className={styles.observatoryRingC}>
          <circle cx="754" cy="423" r="78" />
          <circle cx="754" cy="423" r="101" />
        </g>
        <circle className={styles.observatoryLensGlow} cx="550" cy="407" r="74" fill="url(#observatory-lens)" />
        <circle className={styles.observatoryWavefront} cx="550" cy="407" r="68" />
        <circle className={`${styles.observatoryWavefront} ${styles.observatoryWavefrontDelayed}`} cx="550" cy="407" r="68" />
      </g>

      <g className={styles.observatoryLightSweep} filter="url(#observatory-soft-glow)">
        <ellipse cx="0" cy="390" rx="90" ry="310" fill="#ffe1a2" opacity="0.16" />
        <ellipse cx="28" cy="390" rx="46" ry="280" fill="#91f3f2" opacity="0.12" />
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
      src={MUSEUM_OBSERVATORY_PROOF_ASSETS.crop}
      alt=""
      fill
      priority
      sizes="(max-aspect-ratio: 852/790) 100vw, calc(100vh * 1.07848)"
    />
  );
}

export default function MuseumObservatoryProof() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pointerActive, setPointerActive] = useState(false);
  const [scenePointer, setScenePointer] = useState<MuseumScenePoint>({ x: 0.5, y: 0.5 });
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));

  const updatePointerTarget = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const [x, y] = toProofAttentionPoint(event.clientX, event.clientY, bounds);
    pointerTarget.current.set(x, y);
    setScenePointer({ x, y: 1 - y });
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

  return (
    <main className={`${styles.proof} ${styles.observatoryProof}`} data-reduced-motion={reducedMotion} data-attention-active={pointerActive}>
      <div
        className={styles.stage}
        style={sceneStyle}
        data-scene-settled={sceneFrame.settled}
        onPointerEnter={updatePointerTarget}
        onPointerMove={updatePointerTarget}
        onPointerLeave={() => {
          setPointerActive(false);
          setScenePointer({ x: 0.5, y: 0.5 });
        }}
      >
        <StaticFallback />
        <ProofBoundary fallback={null}>
          {!reducedMotion ? (
            <Canvas
              aria-label="Animated eastern Museum observatory compositor"
              dpr={[1, 1.5]}
              frameloop={visible ? 'always' : 'never'}
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
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
              onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; }}
            >
              <Suspense fallback={null}>
                <ObservatoryScene pointerActive={pointerActive} pointerTarget={pointerTarget} />
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
            style={{ backgroundImage: `url(${MUSEUM_OBSERVATORY_PROOF_ASSETS.crop})` }}
          />
          <span
            className={museumStyles.ecologyAperture}
            data-layer="museum:aperture"
            style={{ backgroundImage: `url(${MUSEUM_OBSERVATORY_PROOF_ASSETS.crop})` }}
          />
          <span className={museumStyles.materialMesh} data-layer="museum:membrane" />
          <MuseumParticleField
            target={sceneFrame.aperture}
            energy={sceneFrame.energy}
            count={sceneFrame.particleCount}
            reducedMotion={reducedMotion || !visible}
          />
          <span className={museumStyles.ecologyVeil} />
        </div>
        <div className={styles.grain} aria-hidden="true" />
      </div>
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

useTexture.preload(MUSEUM_OBSERVATORY_PROOF_ASSETS.crop);
