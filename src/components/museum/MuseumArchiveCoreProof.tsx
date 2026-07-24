'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import Link from 'next/link';
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import * as THREE from 'three';
import {
  getArchivePageTurnSchedule,
  getArchivePageWorldIndex,
  getArchiveLocalAttention,
  MUSEUM_ARCHIVE_PROOF_PERFORMANCE,
} from '@/lib/museum/archiveProof';
import { toProofAttentionPoint } from '@/lib/museum/ambientProof';
import {
  getMuseumSceneFrame,
  type MuseumScenePoint,
} from '@/lib/museum/scene';
import styles from './MuseumArchiveCoreProof.module.css';

type PointerTarget = { current: THREE.Vector2 };
type ScalarTarget = { current: number };
type TowerSpec = {
  position: readonly [number, number, number];
  height: number;
  width: number;
  phase: number;
};

const BACKGROUND_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BACKGROUND_FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x),
    f.y
  );
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.018;
  float farMist = noise(vec2(uv.x * 2.3 + t, uv.y * 3.1 - t * 0.7));
  float nearMist = noise(vec2(uv.x * 5.0 - t * 1.7, uv.y * 4.0 + t));
  float basin = smoothstep(0.78, 0.16, abs(uv.y - 0.42 - (farMist - 0.5) * 0.12));
  float stars = step(0.993, hash(floor(uv * vec2(240.0, 130.0)) + floor(uTime * 0.05)));
  vec3 deep = vec3(0.004, 0.012, 0.016);
  vec3 cyan = vec3(0.025, 0.23, 0.25) * basin * (0.14 + nearMist * 0.22);
  vec3 amber = vec3(0.29, 0.16, 0.045) * smoothstep(0.7, 0.1, distance(uv, vec2(0.46, 0.45))) * 0.17;
  vec3 color = deep + cyan + amber + vec3(0.38, 0.54, 0.53) * stars * 0.32;
  gl_FragColor = vec4(color, 1.0);
}
`;

const PAGE_VERTEX = `
varying vec2 vUv;
uniform float uTime;
uniform float uSide;
uniform float uLayer;
uniform float uAttention;

void main() {
  vUv = uv;
  vec3 p = position;
  float fromSpine = uSide > 0.0 ? uv.x : 1.0 - uv.x;
  float edgeWeight = smoothstep(0.08, 1.0, fromSpine);
  float slowBreath = sin(uTime * (0.32 + uLayer * 0.013) + uLayer * 1.7);
  float traveling = sin(uv.y * 7.0 - uTime * (0.55 + uLayer * 0.02) + uLayer);
  p.z += pow(fromSpine, 1.55) * (0.39 + uLayer * 0.006);
  p.z += edgeWeight * (slowBreath * 0.032 + traveling * 0.012);
  p.z += edgeWeight * uAttention * sin(uv.y * 10.0 - uTime * 2.2) * 0.045;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const PAGE_FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uLayer;
uniform float uAttention;

void main() {
  float edge = smoothstep(0.0, 0.035, vUv.x) * smoothstep(0.0, 0.035, 1.0 - vUv.x)
    * smoothstep(0.0, 0.035, vUv.y) * smoothstep(0.0, 0.035, 1.0 - vUv.y);
  float rules = smoothstep(0.47, 0.5, abs(fract(vUv.y * 21.0 + uLayer * 0.13) - 0.5));
  float script = smoothstep(0.84, 0.98, sin(vUv.x * 33.0 + sin(vUv.y * 19.0) * 3.0));
  float passage = 0.5 + 0.5 * sin(vUv.x * 8.0 - uTime * 0.55 + uLayer);
  float cartography = smoothstep(0.91, 0.99, sin((vUv.x + vUv.y) * 42.0 + sin(vUv.y * 11.0)));
  vec3 paper = mix(vec3(0.13, 0.095, 0.045), vec3(0.76, 0.55, 0.25), vUv.y * 0.42);
  vec3 ink = vec3(0.045, 0.06, 0.055);
  vec3 color = mix(paper, ink, rules * script * 0.62);
  color += vec3(0.23, 0.72, 0.72) * cartography * 0.12;
  color += vec3(1.0, 0.67, 0.24) * pow(passage, 8.0) * (0.09 + uAttention * 0.12);
  gl_FragColor = vec4(color, edge * (0.78 - uLayer * 0.017));
}
`;

const TURNING_PAGE_VERTEX = `
varying vec2 vUv;
uniform float uTime;
uniform float uTurn;

void main() {
  vUv = uv;
  vec3 p = position;
  float turnArc = sin(uTurn * 3.14159265);
  float freeEdge = smoothstep(0.0, 1.0, uv.x);
  p.z += sin(uv.x * 3.14159265) * turnArc * 0.34;
  p.z += sin(uv.y * 8.0 - uTime * 1.4) * freeEdge * turnArc * 0.025;
  p.y += sin(uv.x * 3.14159265) * turnArc * 0.06;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const TURNING_PAGE_FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uTurn;

void main() {
  float edge = smoothstep(0.0, 0.025, vUv.x) * smoothstep(0.0, 0.025, 1.0 - vUv.x)
    * smoothstep(0.0, 0.025, vUv.y) * smoothstep(0.0, 0.025, 1.0 - vUv.y);
  float rules = smoothstep(0.47, 0.5, abs(fract(vUv.y * 24.0) - 0.5));
  float glyphs = smoothstep(0.88, 0.99, sin(vUv.x * 39.0 + sin(vUv.y * 17.0) * 4.0));
  float movingInk = pow(0.5 + 0.5 * sin(vUv.x * 11.0 - uTime * 0.75), 9.0);
  float rim = pow(sin(uTurn * 3.14159265), 2.0);
  vec3 paper = mix(vec3(0.18, 0.12, 0.055), vec3(0.83, 0.65, 0.34), vUv.y * 0.58);
  vec3 color = mix(paper, vec3(0.045, 0.065, 0.06), rules * glyphs * 0.68);
  color += vec3(0.16, 0.69, 0.7) * movingInk * 0.16;
  color += vec3(1.0, 0.62, 0.2) * rim * 0.22;
  gl_FragColor = vec4(color, edge * 0.96);
}
`;

const CURRENT_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const CURRENT_FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uPhase;
uniform float uAttention;

void main() {
  float lane = abs(vUv.y - 0.5) * 2.0;
  float body = pow(max(0.0, 1.0 - lane), 2.4);
  float flow = fract(vUv.x * 2.6 - uTime * 0.24 - uPhase);
  float pressure = exp(-pow((flow - 0.5) / 0.13, 2.0));
  float wake = exp(-pow((flow - 0.28) / 0.23, 2.0)) * 0.45;
  float shimmer = 0.68 + 0.32 * sin(vUv.x * 95.0 - uTime * 3.2 + uPhase * 20.0);
  vec3 color = uColor * body * (0.52 + pressure * 2.6 + wake * 1.2 + shimmer * 0.4);
  float alpha = body * (0.36 + pressure * 0.82 + wake * 0.3) * (1.0 + uAttention * 0.24);
  gl_FragColor = vec4(color * (1.0 + uAttention * 0.32), alpha);
}
`;

const PARTICLE_VERTEX = `
attribute float aPhase;
uniform float uTime;
uniform float uAttention;
varying float vLight;

void main() {
  vec3 p = position;
  p.x += sin(uTime * 0.17 + aPhase * 11.0 + position.y) * 0.12;
  p.y += sin(uTime * 0.23 + aPhase * 7.0 + position.x) * 0.08;
  p.z += cos(uTime * 0.13 + aPhase * 13.0) * 0.09;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.1 + 1.2 * sin(aPhase * 29.0 + uTime * 0.7) + uAttention) * (7.0 / max(1.0, -mv.z));
  vLight = 0.45 + 0.55 * sin(aPhase * 17.0 + uTime * 0.46);
}
`;

const PARTICLE_FRAGMENT = `
precision highp float;
varying float vLight;
uniform vec3 uColor;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.08, d) * (0.2 + vLight * 0.48);
  gl_FragColor = vec4(uColor * (0.52 + vLight), alpha);
}
`;

const TOWER_VERTEX = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const TOWER_FRAGMENT = `
precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
uniform float uPhase;
uniform vec3 uBase;
uniform vec3 uEmission;

float hash(float value) {
  return fract(sin(value * 91.173) * 43758.5453);
}

void main() {
  vec2 cells = vec2(vUv.x * 6.0, vUv.y * 18.0);
  vec2 cell = floor(cells);
  vec2 local = fract(cells);
  float inset = smoothstep(0.14, 0.22, local.x) * smoothstep(0.14, 0.22, local.y)
    * smoothstep(0.14, 0.22, 1.0 - local.x) * smoothstep(0.14, 0.22, 1.0 - local.y);
  float identity = hash(cell.x + cell.y * 17.0 + uPhase * 101.0);
  float rhythm = 0.5 + 0.5 * sin(uTime * (0.11 + identity * 0.1) + identity * 19.0);
  float windowLight = inset * smoothstep(0.48 + identity * 0.24, 0.8, rhythm);
  float edge = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
  float vertical = 0.7 + vUv.y * 0.45;
  vec3 color = uBase * vertical + uEmission * windowLight * (1.8 + identity * 1.7);
  color += mix(vec3(0.08, 0.36, 0.38), vec3(0.55, 0.27, 0.08), uPhase) * edge * 0.34;
  gl_FragColor = vec4(color, 0.94);
}
`;

function attentionAt(
  pointerTarget: PointerTarget,
  target: readonly [number, number],
  radius: number,
  active: boolean,
) {
  return getArchiveLocalAttention(
    [pointerTarget.current.x, pointerTarget.current.y],
    target,
    radius,
    active,
  );
}

function ArchiveField() {
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh position={[0, 0, -4]} scale={[15, 8.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={BACKGROUND_VERTEX}
        fragmentShader={BACKGROUND_FRAGMENT}
        uniforms={{ uTime: { value: 0 } }}
        depthWrite={false}
      />
    </mesh>
  );
}

function OrbitalCore({
  pointerActive,
  pointerTarget,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const group = useRef<THREE.Group>(null);
  const shellA = useRef<THREE.Mesh>(null);
  const shellB = useRef<THREE.Mesh>(null);
  const satelliteA = useRef<THREE.Group>(null);
  const satelliteB = useRef<THREE.Group>(null);
  const coreLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current || !shellA.current || !shellB.current) return;
    const attention = attentionAt(pointerTarget, [0.62, 0.73], 0.23, pointerActive);
    group.current.rotation.y += delta * (0.08 + attention * 0.12);
    shellA.current.rotation.x += delta * (0.13 + attention * 0.2);
    shellA.current.rotation.z -= delta * 0.08;
    shellB.current.rotation.y -= delta * (0.1 + attention * 0.16);
    shellB.current.rotation.z += delta * 0.055;
    if (satelliteA.current) satelliteA.current.rotation.z = clock.elapsedTime * (0.11 + attention * 0.08);
    if (satelliteB.current) satelliteB.current.rotation.x = clock.elapsedTime * -0.075;
    if (coreLight.current) {
      coreLight.current.intensity = 5.2 + Math.sin(clock.elapsedTime * 0.62) * 1.1 + attention * 3.5;
    }
  });

  return (
    <group ref={group} position={[1.4, 1.45, -0.45]} scale={0.92}>
      <pointLight ref={coreLight} color="#8ce7e8" intensity={5.2} distance={5} />
      <mesh>
        <icosahedronGeometry args={[0.62, 4]} />
        <meshPhysicalMaterial
          color="#8fc9c3"
          emissive="#1b7778"
          emissiveIntensity={1.4}
          transmission={0.55}
          thickness={0.7}
          roughness={0.18}
          metalness={0.12}
          transparent
          opacity={0.82}
        />
      </mesh>
      <mesh ref={shellA}>
        <icosahedronGeometry args={[0.87, 2]} />
        <meshBasicMaterial color="#e7cf91" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh ref={shellB} rotation={[0.4, 0.2, 0.7]}>
        <icosahedronGeometry args={[1.06, 1]} />
        <meshBasicMaterial color="#83dfe0" wireframe transparent opacity={0.16} />
      </mesh>
      <mesh rotation={[0.3, 0.75, 0.15]}>
        <torusKnotGeometry args={[0.91, 0.012, 160, 8, 2, 3]} />
        <meshBasicMaterial color="#f1d79b" transparent opacity={0.42} />
      </mesh>
      <mesh rotation={[-0.2, 0.25, 1.1]} scale={1.08}>
        <torusKnotGeometry args={[0.84, 0.009, 144, 7, 3, 4]} />
        <meshBasicMaterial color="#73dfe0" transparent opacity={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.28, 32, 24]} />
        <meshStandardMaterial
          color="#d9c5a6"
          emissive="#8f5532"
          emissiveIntensity={2.1}
          roughness={0.18}
          metalness={0.62}
        />
      </mesh>
      <mesh rotation={[1.2, 0.3, 0.2]}>
        <torusGeometry args={[0.91, 0.014, 5, 128]} />
        <meshBasicMaterial color="#e8ba62" transparent opacity={0.72} />
      </mesh>
      <mesh rotation={[0.2, 1.05, 0.55]}>
        <torusGeometry args={[1.13, 0.009, 5, 128]} />
        <meshBasicMaterial color="#79dfe3" transparent opacity={0.46} />
      </mesh>
      <group ref={satelliteA}>
        <mesh position={[1.17, 0.05, 0]}>
          <sphereGeometry args={[0.12, 20, 16]} />
          <meshStandardMaterial color="#edc67a" emissive="#a4621e" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[-0.88, 0.42, 0.32]}>
          <sphereGeometry args={[0.08, 16, 12]} />
          <meshStandardMaterial color="#7ad7d9" emissive="#1a7476" emissiveIntensity={1.6} />
        </mesh>
      </group>
      <group ref={satelliteB} rotation={[0.5, 0.2, 0.9]}>
        <mesh position={[0, 1.22, 0]}>
          <sphereGeometry args={[0.07, 16, 12]} />
          <meshBasicMaterial color="#f4e4b2" />
        </mesh>
      </group>
    </group>
  );
}

function PageLeaf({
  side,
  layer,
  pointerActive,
  pointerTarget,
}: {
  side: -1 | 1;
  layer: number;
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uAttention.value = attentionAt(
      pointerTarget,
      [0.43, 0.31],
      0.22,
      pointerActive,
    );
  });
  return (
    <mesh
      position={[side * 1.12, layer * 0.018, 0]}
      rotation={[-1.04, side * -0.055, side * -0.035]}
    >
      <planeGeometry
        args={[
          2.22,
          1.62,
          MUSEUM_ARCHIVE_PROOF_PERFORMANCE.pageSegments,
          10,
        ]}
      />
      <shaderMaterial
        ref={material}
        vertexShader={PAGE_VERTEX}
        fragmentShader={PAGE_FRAGMENT}
        uniforms={{
          uTime: { value: 0 },
          uSide: { value: side },
          uLayer: { value: layer },
          uAttention: { value: 0 },
        }}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function TurningPage({
  pointerActive,
  pointerTarget,
  turnProgress,
  onTurnAdvance,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
  turnProgress: ScalarTarget;
  onTurnAdvance: () => void;
}) {
  const pivot = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const waiting = useRef(0);
  const progress = useRef(0);
  const turning = useRef(false);
  const advanced = useRef(false);

  useFrame(({ clock }, delta) => {
    if (!pivot.current || !material.current) return;
    const attention = attentionAt(pointerTarget, [0.43, 0.31], 0.25, pointerActive);
    const schedule = getArchivePageTurnSchedule(attention);
    material.current.uniforms.uTime.value = clock.elapsedTime;

    if (!turning.current) {
      waiting.current += delta;
      turnProgress.current = 0;
      pivot.current.rotation.y = 0;
      material.current.uniforms.uTurn.value = 0;
      if (waiting.current >= schedule.delay) {
        waiting.current = 0;
        progress.current = 0;
        advanced.current = false;
        turning.current = true;
      }
      return;
    }

    progress.current = Math.min(1, progress.current + delta / schedule.duration);
    const eased = THREE.MathUtils.smootherstep(progress.current, 0, 1);
    turnProgress.current = eased;
    pivot.current.rotation.y = -Math.PI * eased;
    material.current.uniforms.uTurn.value = eased;

    if (!advanced.current && eased >= 0.5) {
      advanced.current = true;
      onTurnAdvance();
    }
    if (progress.current >= 1) {
      turning.current = false;
      progress.current = 0;
      turnProgress.current = 0;
      pivot.current.rotation.y = 0;
      material.current.uniforms.uTurn.value = 0;
    }
  });

  return (
    <group position={[0, 0.155, 0.03]} rotation={[-1.04, 0, 0]}>
      <group ref={pivot}>
        <mesh position={[1.11, 0, 0]} renderOrder={4}>
          <planeGeometry
            args={[
              2.22,
              1.62,
              MUSEUM_ARCHIVE_PROOF_PERFORMANCE.pageSegments,
              12,
            ]}
          />
          <shaderMaterial
            ref={material}
            vertexShader={TURNING_PAGE_VERTEX}
            fragmentShader={TURNING_PAGE_FRAGMENT}
            uniforms={{
              uTime: { value: 0 },
              uTurn: { value: 0 },
            }}
            side={THREE.DoubleSide}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function Tower({
  position,
  height,
  width,
  phase,
}: {
  position: readonly [number, number, number];
  height: number;
  width: number;
  phase: number;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const crown = useRef<THREE.MeshStandardMaterial>(null);
  const baseColor = useMemo(
    () => new THREE.Color(phase > 0.5 ? '#1d3432' : '#38231b'),
    [phase],
  );
  const emissionColor = useMemo(
    () => new THREE.Color(phase > 0.5 ? '#43d7d4' : '#e08a37'),
    [phase],
  );
  useFrame(({ clock }) => {
    const slowState = 0.5 + 0.5 * Math.sin(clock.elapsedTime * (0.16 + phase * 0.015) + phase * 5.7);
    const windowState = THREE.MathUtils.smoothstep(slowState, 0.38, 0.82);
    if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime;
    if (crown.current) crown.current.emissiveIntensity = 0.4 + windowState * 2.1;
  });
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, width]} />
        <shaderMaterial
          ref={material}
          vertexShader={TOWER_VERTEX}
          fragmentShader={TOWER_FRAGMENT}
          uniforms={{
            uTime: { value: 0 },
            uPhase: { value: phase },
            uBase: { value: baseColor },
            uEmission: { value: emissionColor },
          }}
          transparent
        />
      </mesh>
      <mesh position={[0, height + width * 0.45, 0]} rotation={[0, phase * 2, 0]}>
        <coneGeometry args={[width * 0.68, width * 0.9, 5]} />
        <meshStandardMaterial
          ref={crown}
          color="#bd9851"
          emissive="#d89432"
          emissiveIntensity={0.7}
          roughness={0.35}
          metalness={0.68}
        />
      </mesh>
    </group>
  );
}

function Doorway({
  pointerActive,
  pointerTarget,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const portal = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const attention = attentionAt(pointerTarget, [0.47, 0.37], 0.14, pointerActive);
    if (portal.current) {
      const breath = 1 + Math.sin(clock.elapsedTime * 0.71) * 0.04 + attention * 0.09;
      portal.current.scale.set(breath, breath, 1);
    }
    if (light.current) light.current.intensity = 3 + Math.sin(clock.elapsedTime * 0.54) + attention * 4;
  });
  return (
    <group position={[0.05, 0.35, -0.18]}>
      <pointLight ref={light} color="#e7a947" intensity={3} distance={3.6} />
      <mesh ref={portal}>
        <ringGeometry args={[0.18, 0.25, 48]} />
        <meshBasicMaterial color="#e8bd68" transparent opacity={0.82} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.015]}>
        <circleGeometry args={[0.18, 48]} />
        <meshBasicMaterial color="#58d3d6" transparent opacity={0.36} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, -0.28, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.42, 1.1, 32, 1, true]} />
        <meshBasicMaterial
          color="#dca957"
          transparent
          opacity={0.07}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function CrystalGarden({
  pointerActive,
  pointerTarget,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const garden = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const crystals = useMemo(
    () => [
      [-0.82, 0.18, -0.2, 0.48, '#6edbd8'],
      [-0.48, 0.12, 0.18, 0.72, '#e8b766'],
      [-0.12, 0.08, -0.14, 0.42, '#91e7dc'],
      [0.24, 0.14, 0.16, 0.82, '#d88c52'],
      [0.62, 0.1, -0.1, 0.58, '#7fdfe0'],
      [0.92, 0.17, 0.21, 0.38, '#efca78'],
    ] as const,
    [],
  );
  useFrame(({ clock }, delta) => {
    if (!garden.current) return;
    const attention = attentionAt(pointerTarget, [0.43, 0.31], 0.25, pointerActive);
    garden.current.rotation.y += delta * (0.08 + attention * 0.18);
    garden.current.position.y = 0.06 + Math.sin(clock.elapsedTime * 0.43) * 0.025;
    if (halo.current) {
      halo.current.rotation.z -= delta * (0.12 + attention * 0.2);
      const breath = 1 + Math.sin(clock.elapsedTime * 0.61) * 0.05;
      halo.current.scale.setScalar(breath);
    }
  });
  return (
    <group ref={garden}>
      <pointLight position={[0, 0.8, 0.1]} color="#6de3df" intensity={3.4} distance={3.4} />
      {crystals.map(([x, y, z, height, color], index) => (
        <mesh key={index} position={[x, y + height / 2, z]} rotation={[0, index * 0.72, 0]}>
          <coneGeometry args={[0.12 + index % 2 * 0.035, height, 5]} />
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.58}
            transmission={0.38}
            thickness={0.52}
            roughness={0.14}
            metalness={0.12}
            transparent
            opacity={0.84}
          />
        </mesh>
      ))}
      <mesh ref={halo} position={[0.05, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusKnotGeometry args={[0.58, 0.018, 112, 7, 2, 5]} />
        <meshBasicMaterial color="#e9c779" transparent opacity={0.56} />
      </mesh>
      <mesh position={[0.05, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.24, 64]} />
        <meshBasicMaterial
          color="#3dd2d2"
          transparent
          opacity={0.075}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function MemoryInstrument({
  pointerActive,
  pointerTarget,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const instrument = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, delta) => {
    if (!instrument.current) return;
    const attention = attentionAt(pointerTarget, [0.43, 0.31], 0.25, pointerActive);
    instrument.current.position.y = 0.03 + Math.sin(clock.elapsedTime * 0.37) * 0.03;
    instrument.current.rotation.y += delta * (0.05 + attention * 0.12);
    if (inner.current) {
      inner.current.rotation.x += delta * (0.16 + attention * 0.22);
      inner.current.rotation.z -= delta * 0.11;
    }
    if (outer.current) {
      outer.current.rotation.y -= delta * (0.1 + attention * 0.16);
      outer.current.rotation.z += delta * 0.07;
    }
  });
  return (
    <group ref={instrument}>
      <pointLight position={[0, 0.9, 0.1]} color="#edb766" intensity={3.8} distance={3.8} />
      <mesh position={[0, 0.58, 0]}>
        <octahedronGeometry args={[0.34, 2]} />
        <meshPhysicalMaterial
          color="#d7be8a"
          emissive="#aa662c"
          emissiveIntensity={1.2}
          transmission={0.5}
          thickness={0.62}
          roughness={0.16}
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh ref={inner} position={[0, 0.58, 0]}>
        <torusGeometry args={[0.62, 0.018, 6, 96]} />
        <meshBasicMaterial color="#69d9d8" transparent opacity={0.7} />
      </mesh>
      <mesh ref={outer} position={[0, 0.58, 0]} rotation={[0.75, 0.25, 0.4]}>
        <torusKnotGeometry args={[0.7, 0.012, 128, 7, 3, 4]} />
        <meshBasicMaterial color="#e5bd71" transparent opacity={0.54} />
      </mesh>
      {[-0.9, -0.55, 0.55, 0.9].map((x, index) => (
        <mesh key={x} position={[x, 0.22 + index % 2 * 0.08, 0.04]}>
          <cylinderGeometry args={[0.065, 0.1, 0.44 + index % 2 * 0.18, 6]} />
          <meshStandardMaterial
            color={index < 2 ? '#264a48' : '#553322'}
            emissive={index < 2 ? '#3dc9c8' : '#d17832'}
            emissiveIntensity={1.1}
            roughness={0.32}
            metalness={0.58}
          />
        </mesh>
      ))}
    </group>
  );
}

function PageWorlds({
  worldIndex,
  turnProgress,
  towers,
  pointerActive,
  pointerTarget,
}: {
  worldIndex: number;
  turnProgress: ScalarTarget;
  towers: readonly TowerSpec[];
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const city = useRef<THREE.Group>(null);
  const garden = useRef<THREE.Group>(null);
  const instrument = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const groups = [city.current, garden.current, instrument.current];
    const pagePresence = 1 - Math.sin(turnProgress.current * Math.PI);
    groups.forEach((group, index) => {
      if (!group) return;
      const target = index === worldIndex ? pagePresence : 0;
      const next = THREE.MathUtils.damp(group.scale.x, target, 7.5, delta);
      group.scale.setScalar(Math.max(0.001, next));
      group.position.y = THREE.MathUtils.damp(group.position.y, target * 0.02 - 0.08, 6, delta);
      group.visible = next > 0.008;
    });
  });

  return (
    <>
      <group ref={city}>
        {towers.map((tower, index) => (
          <Tower key={index} {...tower} />
        ))}
        <Doorway pointerActive={pointerActive} pointerTarget={pointerTarget} />
      </group>
      <group ref={garden} scale={0.001} visible={false}>
        <CrystalGarden pointerActive={pointerActive} pointerTarget={pointerTarget} />
      </group>
      <group ref={instrument} scale={0.001} visible={false}>
        <MemoryInstrument pointerActive={pointerActive} pointerTarget={pointerTarget} />
      </group>
    </>
  );
}

function LivingBook({
  pointerActive,
  pointerTarget,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const book = useRef<THREE.Group>(null);
  const turnProgress = useRef(0);
  const turnCount = useRef(0);
  const [worldIndex, setWorldIndex] = useState(0);
  const towers = useMemo(() => {
    let seed = 31;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    return Array.from({ length: MUSEUM_ARCHIVE_PROOF_PERFORMANCE.towerCount }, (_, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      return {
        position: [
          side * (0.18 + random() * 1.45),
          0.03,
          -0.42 + random() * 0.84,
        ] as const,
        height: 0.24 + random() * 0.72,
        width: 0.075 + random() * 0.08,
        phase: random(),
      };
    });
  }, []);
  const advancePageWorld = () => {
    turnCount.current += 1;
    setWorldIndex(getArchivePageWorldIndex(turnCount.current));
  };

  useFrame(({ clock }) => {
    if (!book.current) return;
    const attention = attentionAt(pointerTarget, [0.43, 0.31], 0.24, pointerActive);
    book.current.rotation.y = -0.08 + Math.sin(clock.elapsedTime * 0.12) * 0.018 + attention * 0.025;
    book.current.position.y = -1.18 + Math.sin(clock.elapsedTime * 0.28) * 0.018;
  });

  return (
    <group ref={book} position={[-0.6, -1.18, 0.15]} rotation={[0, -0.08, 0]}>
      <mesh position={[0, -0.13, 0]} rotation={[-1.04, 0, 0]}>
        <boxGeometry args={[4.72, 1.86, 0.12]} />
        <meshStandardMaterial color="#2a130f" roughness={0.6} metalness={0.2} />
      </mesh>
      {Array.from({ length: 7 }, (_, layer) => (
        <PageLeaf
          key={`left-${layer}`}
          side={-1}
          layer={layer}
          pointerActive={pointerActive}
          pointerTarget={pointerTarget}
        />
      ))}
      {Array.from({ length: 7 }, (_, layer) => (
        <PageLeaf
          key={`right-${layer}`}
          side={1}
          layer={layer}
          pointerActive={pointerActive}
          pointerTarget={pointerTarget}
        />
      ))}
      <mesh position={[0, 0.1, 0.02]}>
        <boxGeometry args={[0.08, 0.22, 1.55]} />
        <meshStandardMaterial color="#d7a94e" emissive="#9d5f1d" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0.05, 0.28, -0.08]} rotation={[Math.PI / 2, 0.12, 0]}>
        <torusGeometry args={[0.92, 0.012, 5, 112]} />
        <meshBasicMaterial color="#e6bc69" transparent opacity={0.38} />
      </mesh>
      <mesh position={[-0.08, 0.38, 0.02]} rotation={[Math.PI / 2, -0.24, 0]}>
        <torusGeometry args={[1.28, 0.008, 5, 128]} />
        <meshBasicMaterial color="#63d4d4" transparent opacity={0.22} />
      </mesh>
      <PageWorlds
        worldIndex={worldIndex}
        turnProgress={turnProgress}
        towers={towers}
        pointerActive={pointerActive}
        pointerTarget={pointerTarget}
      />
      <TurningPage
        pointerActive={pointerActive}
        pointerTarget={pointerTarget}
        turnProgress={turnProgress}
        onTurnAdvance={advancePageWorld}
      />
    </group>
  );
}

function ArchiveCurrent({
  points,
  color,
  phase,
  radius,
  pointerActive,
  pointerTarget,
}: {
  points: readonly THREE.Vector3[];
  color: string;
  phase: number;
  radius: number;
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const curve = useMemo(() => new THREE.CatmullRomCurve3([...points]), [points]);
  const parsedColor = useMemo(() => new THREE.Color(color), [color]);
  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uAttention.value = getArchiveLocalAttention(
      [pointerTarget.current.x, pointerTarget.current.y],
      [0.53, 0.5],
      0.26,
      pointerActive,
    );
  });
  return (
    <mesh>
      <tubeGeometry
        args={[
          curve,
          MUSEUM_ARCHIVE_PROOF_PERFORMANCE.currentSegments,
          radius,
          7,
          false,
        ]}
      />
      <shaderMaterial
        ref={material}
        vertexShader={CURRENT_VERTEX}
        fragmentShader={CURRENT_FRAGMENT}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: parsedColor },
          uPhase: { value: phase },
          uAttention: { value: 0 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ArchiveParticles({
  pointerActive,
  pointerTarget,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { positions, phases } = useMemo(() => {
    let seed = 73;
    const random = () => {
      seed = (seed * 48271) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const count = MUSEUM_ARCHIVE_PROOF_PERFORMANCE.particleCount;
    const nextPositions = new Float32Array(count * 3);
    const nextPhases = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      nextPositions[index * 3] = (random() - 0.5) * 10;
      nextPositions[index * 3 + 1] = (random() - 0.5) * 5.5;
      nextPositions[index * 3 + 2] = -2.4 + random() * 4.5;
      nextPhases[index] = random();
    }
    return { positions: nextPositions, phases: nextPhases };
  }, []);
  const color = useMemo(() => new THREE.Color('#9de5df'), []);

  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uAttention.value = getArchiveLocalAttention(
      [pointerTarget.current.x, pointerTarget.current.y],
      [0.53, 0.5],
      0.42,
      pointerActive,
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        uniforms={{
          uTime: { value: 0 },
          uAttention: { value: 0 },
          uColor: { value: color },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ArchiveAttentionLens({
  pointerActive,
  pointerTarget,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  const lens = useRef<THREE.Group>(null);
  const membrane = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }, delta) => {
    if (!lens.current) return;
    const targetScale = pointerActive ? 1 : 0;
    const scale = THREE.MathUtils.damp(lens.current.scale.x, targetScale, 7.5, delta);
    lens.current.scale.setScalar(Math.max(0.001, scale));
    lens.current.visible = scale > 0.008;
    lens.current.position.x = THREE.MathUtils.damp(
      lens.current.position.x,
      (pointerTarget.current.x - 0.5) * 9.1,
      8,
      delta,
    );
    lens.current.position.y = THREE.MathUtils.damp(
      lens.current.position.y,
      (pointerTarget.current.y - 0.5) * 5.15 + 0.15,
      8,
      delta,
    );
    if (membrane.current) {
      membrane.current.rotation.z = clock.elapsedTime * 0.14;
      membrane.current.rotation.x = Math.sin(clock.elapsedTime * 0.31) * 0.12;
    }
    if (light.current) {
      light.current.intensity = 0.65 + Math.sin(clock.elapsedTime * 1.3) * 0.18;
    }
  });

  return (
    <group ref={lens} position={[0, 0, 2.5]} scale={0.001} visible={false}>
      <pointLight ref={light} color="#7ce2df" intensity={0.65} distance={2.3} />
      <mesh scale={[1.25, 1, 0.22]}>
        <sphereGeometry args={[0.48, 32, 24]} />
        <meshPhysicalMaterial
          color="#9ae2d8"
          transmission={0.94}
          thickness={1.35}
          ior={1.42}
          roughness={0.04}
          metalness={0}
          attenuationColor="#68d8d4"
          attenuationDistance={1.7}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={membrane} scale={[1.38, 1.08, 1]}>
        <torusKnotGeometry args={[0.38, 0.006, 96, 5, 2, 5]} />
        <meshBasicMaterial
          color="#e8c57a"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={[1.48, 1.18, 1]}>
        <ringGeometry args={[0.42, 0.425, 80]} />
        <meshBasicMaterial
          color="#73dddc"
          transparent
          opacity={0.34}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

const CURRENT_PATHS = [
  {
    color: '#70e8e5',
    phase: 0.08,
    radius: 0.03,
    points: [
      new THREE.Vector3(2.8, 1.7, -0.25),
      new THREE.Vector3(1.25, 1.25, -0.05),
      new THREE.Vector3(0.35, 0.62, 0.2),
      new THREE.Vector3(-0.45, 0.22, 0.55),
    ],
  },
  {
    color: '#efbd66',
    phase: 0.42,
    radius: 0.022,
    points: [
      new THREE.Vector3(3.1, 0.95, -0.55),
      new THREE.Vector3(1.65, 0.76, -0.2),
      new THREE.Vector3(0.5, 0.38, 0.1),
      new THREE.Vector3(-0.1, 0.12, 0.45),
    ],
  },
  {
    color: '#dcebd9',
    phase: 0.71,
    radius: 0.016,
    points: [
      new THREE.Vector3(2.7, 2.35, -0.75),
      new THREE.Vector3(0.95, 1.7, -0.45),
      new THREE.Vector3(-0.35, 0.82, 0.02),
      new THREE.Vector3(-1.55, 0.18, 0.4),
    ],
  },
  {
    color: '#d87764',
    phase: 0.26,
    radius: 0.012,
    points: [
      new THREE.Vector3(-4.2, 0.2, -0.2),
      new THREE.Vector3(-2.8, 0.72, -0.05),
      new THREE.Vector3(-1.7, 0.55, 0.2),
      new THREE.Vector3(-0.65, 0.18, 0.52),
    ],
  },
  {
    color: '#55bbc2',
    phase: 0.88,
    radius: 0.015,
    points: [
      new THREE.Vector3(-4.4, -0.45, -0.55),
      new THREE.Vector3(-2.9, -0.05, -0.2),
      new THREE.Vector3(-1.6, 0.12, 0.15),
      new THREE.Vector3(-0.35, 0.2, 0.48),
    ],
  },
] as const;

function ArchiveScene({
  pointerActive,
  pointerTarget,
}: {
  pointerActive: boolean;
  pointerTarget: PointerTarget;
}) {
  return (
    <>
      <ArchiveField />
      <ambientLight intensity={0.28} />
      <directionalLight position={[-3, 5, 6]} color="#f2cf8a" intensity={1.4} />
      <directionalLight position={[4, 1, 3]} color="#78dadd" intensity={1.15} />
      <ArchiveParticles pointerActive={pointerActive} pointerTarget={pointerTarget} />
      {CURRENT_PATHS.map((current, index) => (
        <ArchiveCurrent
          key={index}
          {...current}
          pointerActive={pointerActive}
          pointerTarget={pointerTarget}
        />
      ))}
      <OrbitalCore pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <LivingBook pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <ArchiveAttentionLens pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <fog attach="fog" args={['#020708', 6.5, 13]} />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          mipmapBlur
          intensity={1.35}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.62}
          levels={5}
        />
        <Vignette eskil={false} offset={0.18} darkness={0.72} />
      </EffectComposer>
    </>
  );
}

class ProofBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
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
    <div className={styles.fallback} aria-hidden="true">
      <span className={styles.fallbackOrb} />
      <span className={styles.fallbackBook} />
      <span className={styles.fallbackDoor} />
    </div>
  );
}

export default function MuseumArchiveCoreProof() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pointerActive, setPointerActive] = useState(false);
  const [scenePointer, setScenePointer] = useState<MuseumScenePoint>({ x: 0.5, y: 0.5 });
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const pointerFrame = useRef<number | null>(null);
  const pendingScenePointer = useRef<MuseumScenePoint>({ x: 0.5, y: 0.5 });

  const updatePointerTarget = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const [x, y] = toProofAttentionPoint(event.clientX, event.clientY, bounds);
    pointerTarget.current.set(x, y);
    pendingScenePointer.current = { x, y: 1 - y };
    if (pointerFrame.current === null) {
      pointerFrame.current = window.requestAnimationFrame(() => {
        setScenePointer(pendingScenePointer.current);
        pointerFrame.current = null;
      });
    }
    if (!pointerActive) setPointerActive(true);
  };

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

  useEffect(() => () => {
    if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current);
  }, []);

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

  return (
    <main
      className={styles.proof}
      data-reduced-motion={reducedMotion}
      data-attention-active={pointerActive}
    >
      <div
        className={styles.stage}
        style={sceneStyle}
        data-scene-settled={sceneFrame.settled}
        onPointerEnter={updatePointerTarget}
        onPointerMove={updatePointerTarget}
        onPointerLeave={() => {
          if (pointerFrame.current !== null) {
            window.cancelAnimationFrame(pointerFrame.current);
            pointerFrame.current = null;
          }
          setPointerActive(false);
          setScenePointer({ x: 0.5, y: 0.5 });
        }}
      >
        <StaticFallback />
        <ProofBoundary fallback={null}>
          {reducedMotion ? null : (
            <Canvas
              aria-label="Animated central Museum archive compositor"
              dpr={MUSEUM_ARCHIVE_PROOF_PERFORMANCE.dpr}
              frameloop={visible ? 'always' : 'never'}
              camera={{ position: [0, 1.15, 7.7], fov: 43, near: 0.1, far: 30 }}
              gl={{
                alpha: true,
                antialias: true,
                depth: true,
                stencil: false,
                powerPreference: 'high-performance',
              }}
              onCreated={({ camera, gl }) => {
                camera.lookAt(0, 0, 0);
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.12;
              }}
            >
              <Suspense fallback={null}>
                <ArchiveScene pointerActive={pointerActive} pointerTarget={pointerTarget} />
              </Suspense>
            </Canvas>
          )}
        </ProofBoundary>
        <div className={styles.museumEffects} aria-hidden="true">
          <span className={styles.sceneHalo} />
          <span className={styles.proofAperture} />
          <span className={styles.proofMesh} />
          <span className={styles.proofVeil} />
        </div>
        <div className={styles.grain} aria-hidden="true" />
      </div>
      <header className={styles.caption}>
        <Link href="/projects">Return to the Museum</Link>
        <div>
          <p>Material proof 03 / archive core</p>
          <h1>Memory is not stored here. It keeps becoming.</h1>
        </div>
      </header>
      <p className={styles.legend}>
        deforming leaves / stochastic city light / orbital refraction / crossing currents / threshold mist
      </p>
    </main>
  );
}
