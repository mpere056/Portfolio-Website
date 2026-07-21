'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  MUSEUM_AMBIENT_PROOF_ASPECT,
  MUSEUM_AMBIENT_PROOF_ASSETS,
  toProofScenePlacement,
  type ProofPlateLayout,
} from '@/lib/museum/ambientProof';
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
`;

const FIELD_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uPointer;
  ${NOISE_GLSL}
  void main() {
    vec3 base = texture2D(uTexture, vUv).rgb;
    float farFog = fbm(vUv * vec2(3.1, 2.2) + vec2(uTime * 0.014, -uTime * 0.009));
    farFog *= smoothstep(0.18, 0.82, 1.0 - vUv.y) * 0.16;
    float rockMask = smoothstep(0.28, 0.92, 1.0 - vUv.y);
    float wave = sin(vUv.x * 37.0 + fbm(vUv * 7.0) * 6.0 - uTime * 0.43);
    float caustic = pow(max(0.0, wave), 8.0) * rockMask;
    float pointerGlow = exp(-distance(vUv, uPointer) * 5.2);
    vec3 cyan = vec3(0.15, 0.68, 0.73);
    vec3 amber = vec3(0.84, 0.43, 0.18);
    base += cyan * farFog;
    base += mix(cyan, amber, vUv.x) * caustic * (0.035 + pointerGlow * 0.04);
    base += cyan * pointerGlow * 0.025;
    gl_FragColor = vec4(base, 1.0);
  }
`;

const CORAL_VERTEX = /* glsl */`
  varying vec2 vUv;
  uniform sampler2D uWeights;
  uniform float uTime;
  uniform float uAttention;
  void main() {
    vUv = uv;
    vec4 weights = texture2D(uWeights, uv);
    vec3 transformed = position;
    float branchPhase = uv.x * 8.0 + uv.y * 3.4;
    float tide = sin(uTime * 0.48 + branchPhase) * 0.72 + sin(uTime * 0.27 - branchPhase * 0.61) * 0.28;
    float bend = weights.r * 0.105 + weights.g * 0.036;
    transformed.x += tide * bend * (1.0 + uAttention * 0.48);
    transformed.y += cos(uTime * 0.36 + branchPhase) * weights.r * 0.018;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const CORAL_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uAttention;
  void main() {
    vec4 texel = texture2D(uTexture, vUv);
    float travelingLight = 0.5 + 0.5 * sin(vUv.y * 18.0 - uTime * 0.7 + vUv.x * 5.0);
    vec3 glow = mix(vec3(0.0), vec3(0.95, 0.31, 0.08), travelingLight * texel.r);
    texel.rgb += glow * (0.035 + uAttention * 0.045);
    gl_FragColor = texel;
  }
`;

const ORGANISM_VERTEX = /* glsl */`
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAttention;
  void main() {
    vUv = uv;
    vec3 transformed = position;
    float freeBody = smoothstep(0.02, 0.42, uv.y);
    transformed.x += sin(uTime * 0.31 + uv.y * 5.0) * 0.012 * freeBody;
    transformed.y += sin(uTime * 0.23 + uv.x * 4.0) * 0.006 * freeBody * (1.0 + uAttention);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const ORGANISM_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uAttention;
  ${NOISE_GLSL}
  void main() {
    vec4 anchor = texture2D(uTexture, vUv);
    float field = fbm(vUv * 8.0 + vec2(uTime * 0.06, -uTime * 0.035));
    vec2 refractUv = vUv + vec2(field - 0.5, 0.5 - field) * 0.006 * anchor.a;
    vec4 refracted = texture2D(uTexture, refractUv);
    float membrane = smoothstep(0.23, 0.82, refracted.b - refracted.r * 0.2);
    float pulse = 0.5 + 0.5 * sin(uTime * 0.72 + vUv.y * 11.0 + field * 4.0);
    refracted.rgb += vec3(0.03, 0.34, 0.42) * membrane * pulse * (0.15 + uAttention * 0.14);
    refracted.rgb += vec3(0.82, 0.22, 0.04) * refracted.r * (0.035 + pulse * 0.025);
    refracted.a = anchor.a;
    gl_FragColor = refracted;
  }
`;

const RINGS_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uAttention;
  vec2 rotateAround(vec2 uv, vec2 center, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c) * (uv - center) + center;
  }
  void main() {
    vec2 center = vUv.y > 0.5 ? vec2(0.5, 0.76) : vec2(0.5, 0.25);
    float direction = vUv.y > 0.5 ? 1.0 : -0.72;
    vec2 sampleUv = rotateAround(vUv, center, uTime * (0.13 + uAttention * 0.08) * direction);
    vec4 texel = texture2D(uTexture, sampleUv);
    float light = 0.86 + 0.14 * sin(uTime * 0.8 + vUv.y * 8.0);
    gl_FragColor = vec4(texel.rgb * light, texel.a);
  }
`;

const VAPOR_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uPhase;
  uniform float uAttention;
  ${NOISE_GLSL}
  void main() {
    vec2 flow = vec2(uTime * (0.018 + uPhase * 0.002), -uTime * 0.009);
    float coarse = fbm(vUv * vec2(3.2, 4.5) + flow + uPhase);
    vec2 warpedUv = vUv + vec2(coarse - 0.5, fbm(vUv * 5.0 - flow) - 0.5) * 0.028;
    vec4 plate = texture2D(uTexture, warpedUv);
    float dissolve = smoothstep(0.12, 0.72, coarse + plate.a * 0.72);
    plate.rgb += vec3(0.03, 0.23, 0.31) * coarse * (0.28 + uAttention * 0.18);
    plate.a *= dissolve * (0.48 + 0.16 * sin(uTime * 0.18 + uPhase));
    gl_FragColor = plate;
  }
`;

const CURRENT_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}
  float filament(vec2 p, float offset, float phase) {
    float y = 0.48 + offset
      + sin(p.x * 10.0 + phase + uTime * 0.18) * 0.045
      + sin(p.x * 23.0 - phase * 1.7 - uTime * 0.11) * 0.014;
    float width = 0.0018 + 0.0014 * (0.5 + 0.5 * sin(p.x * 12.0 - uTime * 0.9 + phase));
    return smoothstep(width * 3.2, width, abs(p.y - y));
  }
  void main() {
    vec2 p = vUv;
    float horizontalMask = smoothstep(0.30, 0.42, p.x) * (1.0 - smoothstep(0.94, 1.0, p.x));
    float verticalMask = smoothstep(0.22, 0.34, p.y) * (1.0 - smoothstep(0.72, 0.82, p.y));
    float pathMask = horizontalMask * verticalMask;
    float lines = 0.0;
    vec3 color = vec3(0.0);
    for (int i = 0; i < 9; i++) {
      float fi = float(i);
      float offset = (fi - 4.0) * 0.013;
      float line = filament(p, offset, fi * 0.91);
      float packet = pow(max(0.0, sin((p.x * 24.0 - uTime * (1.1 + fi * 0.035) + fi) * 3.14159)), 12.0);
      vec3 tint = mix(vec3(0.16, 0.86, 0.94), vec3(1.0, 0.53, 0.22), step(5.5, fi));
      color += tint * line * (0.34 + packet * 1.02);
      lines += line;
    }
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float nodeX = 0.43 + fi * 0.205;
      float nodeY = 0.48 + sin(nodeX * 10.0 + fi * 0.91 + uTime * 0.18) * 0.045;
      float radius = 0.018 + fract(uTime * 0.075 + fi * 0.37) * 0.055;
      float ring = smoothstep(0.006, 0.0012, abs(distance(p, vec2(nodeX, nodeY)) - radius));
      color += mix(vec3(0.15, 0.9, 1.0), vec3(1.0, 0.48, 0.18), fi / 2.0) * ring * 0.62;
      lines += ring;
    }
    float nearby = exp(-distance(p, uPointer) * 6.0);
    float mist = fbm(p * vec2(8.0, 16.0) - vec2(uTime * 0.16, 0.0));
    color += vec3(0.04, 0.25, 0.31) * mist * lines * 0.2;
    float alpha = clamp((lines * (0.46 + uAttention * 0.24 + nearby * 0.16)) * pathMask, 0.0, 0.94);
    gl_FragColor = vec4(color, alpha);
  }
`;

function configureTexture(texture: THREE.Texture, color = true) {
  texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
}

function useAttention(target: [number, number]) {
  const attention = useRef(0);
  return {
    attention,
    update(pointer: THREE.Vector2, delta: number) {
      const normalizedX = pointer.x * 0.5 + 0.5;
      const normalizedY = pointer.y * 0.5 + 0.5;
      const distance = Math.hypot(normalizedX - target[0], normalizedY - target[1]);
      attention.current = THREE.MathUtils.damp(attention.current, Math.max(0, 1 - distance * 2.1), 3.2, delta);
      return attention.current;
    },
  };
}

function FieldLayer() {
  const texture = useTexture(MUSEUM_AMBIENT_PROOF_ASSETS.cleanField);
  const [uniforms] = useState(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
  }));
  useEffect(() => configureTexture(texture), [texture]);
  useFrame(({ clock, pointer }) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uPointer.value.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
  });
  return (
    <mesh position={[0, 0, 0]} renderOrder={0}>
      <planeGeometry args={[MUSEUM_AMBIENT_PROOF_ASPECT * 2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={PLANE_VERTEX} fragmentShader={FIELD_FRAGMENT} depthWrite={false} />
    </mesh>
  );
}

function CoralLayer() {
  const [texture, weights] = useTexture([MUSEUM_AMBIENT_PROOF_ASSETS.coral, MUSEUM_AMBIENT_PROOF_ASSETS.coralDeformation]);
  const layout = toProofScenePlacement({ x: 0, y: 45, width: 820, height: 804, z: 0.45 });
  const attention = useAttention([0.27, 0.42]);
  const [uniforms] = useState(() => ({
    uTexture: { value: texture },
    uWeights: { value: weights },
    uTime: { value: 0 },
    uAttention: { value: 0 },
  }));
  useEffect(() => {
    configureTexture(texture);
    configureTexture(weights, false);
  }, [texture, weights]);
  useFrame(({ clock, pointer }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = attention.update(pointer, delta);
  });
  return (
    <mesh position={layout.position} renderOrder={4}>
      <planeGeometry args={[layout.size[0], layout.size[1], 64, 64]} />
      <shaderMaterial uniforms={uniforms} vertexShader={CORAL_VERTEX} fragmentShader={CORAL_FRAGMENT} transparent depthTest={false} depthWrite={false} />
    </mesh>
  );
}

function OrganismLayer() {
  const texture = useTexture(MUSEUM_AMBIENT_PROOF_ASSETS.organism);
  const layout = toProofScenePlacement({ x: 245, y: 150, width: 458, height: 900, z: 0.62 });
  const attention = useAttention([0.34, 0.47]);
  const [uniforms] = useState(() => ({ uTexture: { value: texture }, uTime: { value: 0 }, uAttention: { value: 0 } }));
  useEffect(() => configureTexture(texture), [texture]);
  useFrame(({ clock, pointer }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = attention.update(pointer, delta);
  });
  return (
    <mesh position={layout.position} renderOrder={6}>
      <planeGeometry args={[layout.size[0], layout.size[1], 28, 48]} />
      <shaderMaterial uniforms={uniforms} vertexShader={ORGANISM_VERTEX} fragmentShader={ORGANISM_FRAGMENT} transparent depthTest={false} depthWrite={false} />
    </mesh>
  );
}

function RingsLayer() {
  const texture = useTexture(MUSEUM_AMBIENT_PROOF_ASSETS.rings);
  const layout = toProofScenePlacement({ x: 690, y: 345, width: 161, height: 340, z: 0.7 });
  const attention = useAttention([0.56, 0.54]);
  const [uniforms] = useState(() => ({ uTexture: { value: texture }, uTime: { value: 0 }, uAttention: { value: 0 } }));
  useEffect(() => configureTexture(texture), [texture]);
  useFrame(({ clock, pointer }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = attention.update(pointer, delta);
  });
  return (
    <mesh position={layout.position} renderOrder={7}>
      <planeGeometry args={[layout.size[0], layout.size[1]]} />
      <shaderMaterial uniforms={uniforms} vertexShader={PLANE_VERTEX} fragmentShader={RINGS_FRAGMENT} transparent depthTest={false} depthWrite={false} />
    </mesh>
  );
}

function VaporLayer({ source, layout, phase, order }: { source: string; layout: ProofPlateLayout; phase: number; order: number }) {
  const texture = useTexture(source);
  const placement = toProofScenePlacement(layout);
  const attention = useAttention([0.4, 0.48]);
  const [uniforms] = useState(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uPhase: { value: phase },
    uAttention: { value: 0 },
  }));
  useEffect(() => configureTexture(texture), [texture]);
  useFrame(({ clock, pointer }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = attention.update(pointer, delta);
  });
  return (
    <mesh position={placement.position} renderOrder={order}>
      <planeGeometry args={[placement.size[0], placement.size[1]]} />
      <shaderMaterial uniforms={uniforms} vertexShader={PLANE_VERTEX} fragmentShader={VAPOR_FRAGMENT} transparent depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function ProceduralCurrent() {
  const attention = useAttention([0.65, 0.52]);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uAttention: { value: 0 },
  }));
  useFrame(({ clock, pointer }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uPointer.value.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    uniforms.uAttention.value = attention.update(pointer, delta);
  });
  return (
    <mesh position={[0, 0, 0.55]} renderOrder={5}>
      <planeGeometry args={[MUSEUM_AMBIENT_PROOF_ASPECT * 2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={PLANE_VERTEX} fragmentShader={CURRENT_FRAGMENT} transparent depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles] = useState(() => {
    const count = 84;
    const positions = new Float32Array(count * 3);
    const origins = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const seed = ((index * 73) % 101) / 101;
      const x = (seed * 2 - 1) * MUSEUM_AMBIENT_PROOF_ASPECT;
      const y = (((index * 47) % 97) / 97) * 2 - 1;
      positions.set([x, y, 0.8], index * 3);
      origins.set([x, y, 0.8], index * 3);
      seeds[index] = seed;
    }
    return { positions, origins, seeds, count };
  });
  useFrame(({ clock, pointer }) => {
    const attribute = pointsRef.current?.geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!attribute) return;
    const t = clock.elapsedTime;
    for (let index = 0; index < particles.count; index += 1) {
      const offset = index * 3;
      const seed = particles.seeds[index];
      particles.positions[offset] = particles.origins[offset] + Math.sin(t * (0.08 + seed * 0.05) + seed * 9) * 0.06;
      particles.positions[offset + 1] = particles.origins[offset + 1] + Math.cos(t * (0.11 + seed * 0.04) + seed * 13) * 0.045;
      const pointerDistance = Math.hypot(particles.positions[offset] / MUSEUM_AMBIENT_PROOF_ASPECT - pointer.x, particles.positions[offset + 1] - pointer.y);
      particles.positions[offset + 2] = 0.8 + Math.max(0, 1 - pointerDistance) * 0.08;
    }
    attribute.needsUpdate = true;
  });
  return (
    <points ref={pointsRef} renderOrder={9}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9debf0" size={2.1} sizeAttenuation={false} transparent opacity={0.5} depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function DriftingPlate({ source, layout, phase, order, opacity }: { source: string; layout: ProofPlateLayout; phase: number; order: number; opacity: number }) {
  const texture = useTexture(source);
  const placement = toProofScenePlacement(layout);
  const meshRef = useRef<THREE.Mesh>(null);
  useEffect(() => configureTexture(texture), [texture]);
  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.position.x = placement.position[0] + Math.sin(t * 0.09 + phase) * 0.075 + pointer.x * 0.012;
    meshRef.current.position.y = placement.position[1] + Math.cos(t * 0.07 + phase) * 0.035 + pointer.y * 0.008;
    meshRef.current.rotation.z = Math.sin(t * 0.055 + phase) * 0.012;
  });
  return (
    <mesh ref={meshRef} position={placement.position} renderOrder={order}>
      <planeGeometry args={[placement.size[0], placement.size[1]]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

function AmbientScene() {
  return (
    <>
      <FieldLayer />
      <VaporLayer source={MUSEUM_AMBIENT_PROOF_ASSETS.vaporBackground} layout={{ x: 30, y: 80, width: 690, height: 507, z: 0.18 }} phase={0.4} order={1} />
      <VaporLayer source={MUSEUM_AMBIENT_PROOF_ASSETS.vaporVertical} layout={{ x: 600, y: 5, width: 426, height: 650, z: 0.28 }} phase={2.1} order={2} />
      <VaporLayer source={MUSEUM_AMBIENT_PROOF_ASSETS.vaporBasin} layout={{ x: 250, y: 780, width: 838, height: 315, z: 0.35 }} phase={4.7} order={3} />
      <ProceduralCurrent />
      <CoralLayer />
      <OrganismLayer />
      <RingsLayer />
      <ParticleField />
      <DriftingPlate source={MUSEUM_AMBIENT_PROOF_ASSETS.occluderSpores} layout={{ x: 1010, y: 90, width: 290, height: 118, z: 0.9 }} phase={1.3} order={10} opacity={0.72} />
      <DriftingPlate source={MUSEUM_AMBIENT_PROOF_ASSETS.occluderShadowA} layout={{ x: -20, y: 835, width: 520, height: 225, z: 1.0 }} phase={3.5} order={11} opacity={0.28} />
      <DriftingPlate source={MUSEUM_AMBIENT_PROOF_ASSETS.occluderShadowB} layout={{ x: 720, y: 850, width: 650, height: 225, z: 1.05 }} phase={5.2} order={12} opacity={0.38} />
    </>
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
      src={MUSEUM_AMBIENT_PROOF_ASSETS.fallback}
      alt=""
      fill
      priority
      sizes="(max-aspect-ratio: 1402/1122) 100vw, calc(100vh * 1.24955)"
    />
  );
}

export default function MuseumAmbientProof() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);

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
    <main className={styles.proof} data-reduced-motion={reducedMotion}>
      <div className={styles.stage}>
        <StaticFallback />
        <ProofBoundary fallback={null}>
          {!reducedMotion ? (
            <Canvas
              aria-label="Animated lower-left Museum material compositor"
              dpr={[1, 1.5]}
              frameloop={visible ? 'always' : 'never'}
              orthographic
              camera={{
                left: -MUSEUM_AMBIENT_PROOF_ASPECT,
                right: MUSEUM_AMBIENT_PROOF_ASPECT,
                top: 1,
                bottom: -1,
                near: 0.1,
                far: 10,
                position: [0, 0, 5],
              }}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
              onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; }}
            >
              <Suspense fallback={null}><AmbientScene /></Suspense>
            </Canvas>
          ) : null}
        </ProofBoundary>
        <div className={styles.grain} aria-hidden="true" />
      </div>
      <header className={styles.caption}>
        <Link href="/projects">Return to the Museum</Link>
        <div>
          <p>Material proof 01 / west ecology</p>
          <h1>Nothing begins moving when you arrive. You only redirect what was already alive.</h1>
        </div>
      </header>
      <p className={styles.legend}>weighted coral / refractive membranes / procedural current / advecting vapor / caustic light / depth passage</p>
    </main>
  );
}

for (const source of Object.values(MUSEUM_AMBIENT_PROOF_ASSETS)) useTexture.preload(source);
