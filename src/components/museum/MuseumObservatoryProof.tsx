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
    color = rotatedAssembly(color, vec2(0.645, 0.485), 0.108, 0.046, uTime * 0.025 * attendedSpeed);
    color = rotatedAssembly(color, vec2(0.775, 0.695), 0.072, 0.032, -uTime * 0.041 * attendedSpeed);
    color = rotatedAssembly(color, vec2(0.885, 0.465), 0.087, 0.035, uTime * 0.017 * attendedSpeed);

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

    float goldSweep = pow(max(0.0, sin((vUv.x * 0.74 + vUv.y) * 15.0 - uTime * 0.23 + field * 5.0)), 8.0);
    float cyanSweep = pow(max(0.0, sin((vUv.x - vUv.y * 0.42) * 19.0 + uTime * 0.17)), 10.0);
    float pointerDistance = distance(vUv, uPointer);
    float pointerLight = exp(-pointerDistance * 8.0) * uAttention;
    float lensPulse = exp(-lensDistance * 9.0) * (0.5 + 0.5 * sin(uTime * 0.37));
    color.rgb += vec3(0.95, 0.67, 0.28) * goldSweep * 0.09;
    color.rgb += vec3(0.08, 0.64, 0.72) * cyanSweep * 0.075;
    color.rgb += mix(vec3(0.18, 0.78, 0.84), vec3(1.0, 0.72, 0.34), vUv.x) * pointerLight * 0.38;
    color.rgb += vec3(0.55, 0.82, 0.86) * lensPulse * lensMask * 0.11;
    gl_FragColor = color;
  }
`;

const ATMOSPHERE_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  ${NOISE_GLSL}
  void main() {
    float farHaze = fbm(vUv * vec2(3.2, 4.8) + vec2(uTime * 0.018, -uTime * 0.011));
    float nearHaze = fbm(vUv * vec2(7.5, 3.7) + vec2(-uTime * 0.031, uTime * 0.008));
    float depthWindow = smoothstep(0.05, 0.55, vUv.y) * (1.0 - smoothstep(0.88, 1.0, vUv.y));
    float density = smoothstep(0.48, 0.79, farHaze) * 0.22 + smoothstep(0.62, 0.86, nearHaze) * 0.12;
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
      + sin(p.x * 10.0 + phase - uTime * speed) * (0.018 + localWake * 0.025)
      + sin(p.x * 23.0 - phase + uTime * speed * 0.61) * 0.007;
    float width = 0.0015 + localWake * 0.0012;
    return smoothstep(width * 3.4, width, abs(p.y - y));
  }

  void main() {
    float lines = 0.0;
    vec3 color = vec3(0.0);
    for (int i = 0; i < 10; i++) {
      float fi = float(i);
      float line = strand(vUv, (fi - 4.5) * 0.013, fi * 0.77, 0.12 + fi * 0.007 + uAttention * 0.14);
      float packet = pow(max(0.0, sin((vUv.x * 18.0 - uTime * (0.72 + fi * 0.025 + uAttention * 0.55) + fi) * 3.14159)), 14.0);
      vec3 tint = mix(vec3(0.16, 0.78, 0.86), vec3(0.94, 0.63, 0.29), smoothstep(5.0, 8.0, fi));
      color += tint * line * (0.28 + packet * (0.8 + uAttention * 0.75));
      lines += line;
    }
    float fade = smoothstep(0.02, 0.16, vUv.x) * (1.0 - smoothstep(0.93, 1.0, vUv.x));
    float vapor = fbm(vec2(vUv.x * 6.0 - uTime * 0.12, vUv.y * 17.0));
    color += vec3(0.06, 0.25, 0.28) * vapor * lines * 0.16;
    gl_FragColor = vec4(color, clamp(lines * fade * (0.42 + uAttention * 0.32), 0.0, 0.9));
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

  void main() {
    vec2 center = vec2(0.645, 0.485);
    float d = distance(vUv, center);
    float rings = annulus(vUv, center, 0.125, 0.0018)
      + annulus(vUv, center, 0.162, 0.0012)
      + annulus(vUv, vec2(0.775, 0.695), 0.09, 0.0015);
    float spokes = spoke(vUv, center, 14.0, uTime * (0.08 + uAttention * 0.16));
    float pointerDistance = distance(vUv, uPointer);
    float diffraction = pow(max(0.0, sin(pointerDistance * 118.0 - uTime * (0.8 + uAttention))), 16.0)
      * exp(-pointerDistance * 7.0) * uAttention;
    float orbitPacket = pow(max(0.0, sin(atan(vUv.y - center.y, vUv.x - center.x) * 4.0 - uTime * 0.5)), 18.0)
      * exp(-abs(d - 0.162) * 140.0);
    vec3 color = vec3(0.63, 0.88, 0.89) * (rings * 0.3 + spokes * 0.08);
    color += vec3(0.94, 0.7, 0.35) * orbitPacket * 0.45;
    color += mix(vec3(0.2, 0.86, 0.9), vec3(1.0, 0.61, 0.26), vUv.x) * diffraction * 0.68;
    float alpha = clamp(rings * 0.24 + spokes * 0.08 + orbitPacket * 0.38 + diffraction * 0.55, 0.0, 0.76);
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
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.035) * 0.04;
    pointsRef.current.position.x = Math.sin(clock.elapsedTime * 0.08) * 0.035;
    pointsRef.current.position.y = Math.cos(clock.elapsedTime * 0.047) * 0.02;
  });
  return (
    <points ref={pointsRef} renderOrder={5}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#b9edef"
        size={0.009}
        sizeAttenuation
        transparent
        opacity={0.55}
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

