'use client';

import Link from 'next/link';
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import {
  getMusicCurrentEnergy,
  getMusicRegisterAttention,
  MUSEUM_MUSIC_PROOF_PERFORMANCE,
} from '@/lib/museum/musicProof';
import styles from './MuseumMusicProof.module.css';

const PIANO_MODEL = '/models/grand_piano/grand_piano_(GLB).gltf';

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPianoMatter(scene: THREE.Group) {
  scene.updateMatrixWorld(true);
  const vertices: THREE.Vector3[] = [];
  const point = new THREE.Vector3();

  scene.traverse(child => {
    if (!(child instanceof THREE.Mesh)) return;
    const position = child.geometry?.getAttribute('position');
    if (!position) return;
    for (let index = 0; index < position.count; index += 1) {
      point.fromBufferAttribute(position, index).applyMatrix4(child.matrixWorld);
      vertices.push(point.clone());
    }
  });

  const bounds = new THREE.Box3().setFromPoints(vertices);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const scale = 5.7 / Math.max(size.x, size.z, 0.001);
  const random = seededRandom(19880523);
  const registerPositions: number[][] = [[], [], []];

  for (let index = 0; index < MUSEUM_MUSIC_PROOF_PERFORMANCE.pianoPointCount; index += 1) {
    const source = vertices[Math.floor(random() * vertices.length)] ?? center;
    const x = (source.x - center.x) * scale;
    const y = (source.y - center.y) * scale;
    const z = (source.z - center.z) * scale;
    const normalizedRegister = THREE.MathUtils.clamp((x + 2.85) / 5.7, 0, 0.999);
    const registerIndex = Math.floor(normalizedRegister * 3);
    registerPositions[registerIndex].push(x, y, z);
  }

  const geometries = registerPositions.map(register => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(new Float32Array(register), 3),
    );
    geometry.computeBoundingSphere();
    return geometry;
  });

  const body = scene.clone(true);
  body.position.copy(center).multiplyScalar(-scale);
  body.scale.setScalar(scale);
  body.traverse(child => {
    if (!(child instanceof THREE.Mesh)) return;
    const material = new THREE.MeshStandardMaterial({
      color: '#080b10',
      emissive: '#07181c',
      emissiveIntensity: 0.24,
      roughness: 0.34,
      metalness: 0.72,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    child.material = material;
    child.castShadow = true;
    child.receiveShadow = true;
  });

  return { geometries, body };
}

function LivingPiano({ attentionActive }: { attentionActive: boolean }) {
  const group = useRef<THREE.Group>(null);
  const registerGroups = useRef<Array<THREE.Group | null>>([]);
  const registerMaterials = useRef<Array<THREE.PointsMaterial | null>>([]);
  const registerAttention = useRef([0, 0, 0]);
  const { scene } = useGLTF(PIANO_MODEL);
  const matter = useMemo(() => buildPianoMatter(scene), [scene]);
  const centers = [-0.56, 0, 0.56];
  const colors = ['#45d4d9', '#e4ac58', '#c9d8ff'];

  useEffect(() => () => {
    matter.geometries.forEach(geometry => geometry.dispose());
    matter.body.traverse(child => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(item => item.dispose());
      }
    });
  }, [matter]);

  useFrame(({ clock, pointer }, delta) => {
    centers.forEach((center, index) => {
      const local = getMusicRegisterAttention(pointer.x, center, 0.5, attentionActive);
      registerAttention.current[index] = THREE.MathUtils.damp(
        registerAttention.current[index],
        local,
        local > registerAttention.current[index] ? 5.2 : 2.4,
        delta,
      );
      const registerGroup = registerGroups.current[index];
      const registerMaterial = registerMaterials.current[index];
      const breath = 0.5 + 0.5 * Math.sin(clock.elapsedTime * (0.42 + index * 0.09) + index * 2.1);
      if (registerGroup) {
        registerGroup.position.y = breath * 0.012 + registerAttention.current[index] * 0.065;
        registerGroup.position.z = Math.sin(clock.elapsedTime * 0.24 + index * 1.8) * 0.018;
        registerGroup.scale.setScalar(1 + breath * 0.004 + registerAttention.current[index] * 0.018);
      }
      if (registerMaterial) {
        registerMaterial.opacity = 0.56 + breath * 0.18 + registerAttention.current[index] * 0.2;
        registerMaterial.size = 0.026 + breath * 0.006 + registerAttention.current[index] * 0.016;
      }
    });
    if (group.current) {
      group.current.rotation.y = -0.42 + Math.sin(clock.elapsedTime * 0.17) * 0.035;
      group.current.rotation.x = 0.035 + Math.sin(clock.elapsedTime * 0.13) * 0.012;
      group.current.position.y = -0.72 + Math.sin(clock.elapsedTime * 0.22) * 0.025;
    }
  });

  return (
    <group ref={group} rotation={[0.035, -0.42, 0]} position={[0, -0.72, 0]}>
      <primitive object={matter.body} />
      {matter.geometries.map((geometry, index) => (
        <group
          // Geometry order is a stable authored bass-to-treble partition.
          key={colors[index]}
          ref={node => {
            registerGroups.current[index] = node;
          }}
        >
          <points geometry={geometry} frustumCulled={false} renderOrder={6}>
            <pointsMaterial
              ref={node => {
                registerMaterials.current[index] = node;
              }}
              color={colors[index]}
              size={0.03}
              sizeAttenuation
              transparent
              opacity={0.68}
              depthWrite={false}
              depthTest={false}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>
      ))}
    </group>
  );
}

type CurrentDefinition = {
  id: string;
  color: string;
  center: number;
  speed: number;
  energy: number;
  radius: number;
  points: [number, number, number][];
};

const CURRENT_DEFINITIONS: CurrentDefinition[] = [
  {
    id: 'bass-tide',
    color: '#3bc6d0',
    center: -0.56,
    speed: 0.12,
    energy: 0.56,
    radius: 0.052,
    points: [[-5.4, -1.15, -0.7], [-3.2, -0.92, 0.1], [-1.2, -1.22, 0.6], [1.2, -0.82, 0.2], [5.1, -1.0, -0.8]],
  },
  {
    id: 'middle-thread',
    color: '#e3ad58',
    center: 0,
    speed: 0.17,
    energy: 0.52,
    radius: 0.038,
    points: [[-4.9, 0.1, -1.2], [-2.8, 0.38, 0.2], [-0.6, 0.03, 0.8], [2.0, 0.32, 0.1], [5.0, 0.0, -1.0]],
  },
  {
    id: 'treble-filament',
    color: '#c5d8ff',
    center: 0.56,
    speed: 0.22,
    energy: 0.48,
    radius: 0.03,
    points: [[-4.7, 1.34, -1.1], [-2.2, 1.05, 0.1], [0.4, 1.42, 0.9], [2.8, 1.13, 0], [5.2, 1.45, -1.2]],
  },
  {
    id: 'counter-current',
    color: '#74d6cc',
    center: -0.1,
    speed: -0.09,
    energy: 0.34,
    radius: 0.023,
    points: [[-4.6, -1.8, -1.8], [-2.1, -1.45, -0.2], [0.1, -1.72, 0.7], [2.5, -1.44, -0.1], [4.7, -1.75, -1.6]],
  },
  {
    id: 'upper-harmonic',
    color: '#d78965',
    center: 0.24,
    speed: 0.08,
    energy: 0.3,
    radius: 0.021,
    points: [[-5.2, 2.0, -1.6], [-2.8, 1.72, -0.1], [-0.2, 2.04, 0.5], [2.4, 1.77, -0.2], [5.2, 2.08, -1.5]],
  },
];

function createCurrentTexture() {
  const width = 256;
  const height = 4;
  const data = new Uint8Array(width * height * 4);
  for (let x = 0; x < width; x += 1) {
    const position = x / (width - 1);
    const primary = Math.exp(-Math.pow((position - 0.34) * 7.2, 2));
    const secondary = Math.exp(-Math.pow((position - 0.78) * 11, 2));
    const alpha = Math.round(18 + primary * 224 + secondary * 118);
    for (let y = 0; y < height; y += 1) {
      const offset = (y * width + x) * 4;
      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      data[offset + 3] = alpha;
    }
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(3.2, 1);
  texture.needsUpdate = true;
  return texture;
}

function HarmonicCurrent({
  definition,
  attentionActive,
}: {
  definition: CurrentDefinition;
  attentionActive: boolean;
}) {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const attention = useRef(0);
  const texture = useMemo(() => createCurrentTexture(), []);
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      definition.points.map(point => new THREE.Vector3(...point)),
      false,
      'catmullrom',
      0.42,
    );
    return new THREE.TubeGeometry(
      curve,
      MUSEUM_MUSIC_PROOF_PERFORMANCE.currentSegments,
      definition.radius,
      6,
      false,
    );
  }, [definition]);

  useEffect(() => () => {
    geometry.dispose();
    texture.dispose();
  }, [geometry, texture]);

  useFrame(({ clock, pointer }, delta) => {
    const local = getMusicRegisterAttention(pointer.x, definition.center, 0.5, attentionActive);
    attention.current = THREE.MathUtils.damp(attention.current, local, 4.5, delta);
    if (material.current) {
      const energy = getMusicCurrentEnergy(definition.energy, attention.current);
      material.current.opacity = 0.28 + energy * 0.72;
      material.current.map!.offset.x = -clock.elapsedTime * definition.speed;
    }
    if (mesh.current) {
      mesh.current.position.y = Math.sin(clock.elapsedTime * (0.13 + definition.energy * 0.08) + definition.center * 4) * 0.045;
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry} frustumCulled={false} renderOrder={4}>
      <meshBasicMaterial
        ref={material}
        map={texture}
        color={definition.color}
        opacity={0.28 + definition.energy * 0.72}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function RegisterResonator({
  position,
  color,
  center,
  phase,
  attentionActive,
}: {
  position: [number, number, number];
  color: string;
  center: number;
  phase: number;
  attentionActive: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const attention = useRef(0);

  useFrame(({ clock, pointer }, delta) => {
    const local = getMusicRegisterAttention(pointer.x, center, 0.48, attentionActive);
    attention.current = THREE.MathUtils.damp(attention.current, local, 4.8, delta);
    if (!group.current) return;
    const time = clock.elapsedTime;
    const pulse = 1 + Math.sin(time * 0.48 + phase) * 0.045 + attention.current * 0.18;
    group.current.scale.setScalar(pulse);
    group.current.rotation.x = time * (0.08 + phase * 0.005);
    group.current.rotation.y = -time * (0.11 + phase * 0.004);
    group.current.position.y = position[1] + Math.sin(time * 0.22 + phase) * 0.08;
  });

  return (
    <group ref={group} position={position}>
      <mesh rotation={[Math.PI / 2.7, 0.2, phase]}>
        <torusGeometry args={[0.42, 0.008, 6, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.62} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[0.4, phase, 0.2]}>
        <torusGeometry args={[0.29, 0.006, 6, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.42} toneMapped={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.075, 2]} />
        <meshBasicMaterial color={color} transparent opacity={0.92} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={1.1} distance={2.2} decay={2.4} />
    </group>
  );
}

function ChamberMotes() {
  const points = useRef<THREE.Points>(null);
  const matter = useMemo(() => {
    const random = seededRandom(7182);
    const positions = new Float32Array(MUSEUM_MUSIC_PROOF_PERFORMANCE.atmospherePointCount * 3);
    const basePositions = new Float32Array(positions.length);
    const seeds = new Float32Array(MUSEUM_MUSIC_PROOF_PERFORMANCE.atmospherePointCount);
    for (let index = 0; index < MUSEUM_MUSIC_PROOF_PERFORMANCE.atmospherePointCount; index += 1) {
      positions[index * 3] = (random() - 0.5) * 11;
      positions[index * 3 + 1] = (random() - 0.5) * 5.8;
      positions[index * 3 + 2] = -2.8 + random() * 4.6;
      seeds[index] = random();
    }
    basePositions.set(positions);
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    result.computeBoundingSphere();
    return { geometry: result, basePositions, seeds };
  }, []);

  useEffect(() => () => matter.geometry.dispose(), [matter]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const position = matter.geometry.getAttribute('position') as THREE.BufferAttribute;
    const values = position.array as Float32Array;
    for (let index = 0; index < matter.seeds.length; index += 1) {
      const seed = matter.seeds[index];
      values[index * 3] = matter.basePositions[index * 3] + Math.sin(time * 0.19 + seed * 8) * 0.09;
      values[index * 3 + 1] = matter.basePositions[index * 3 + 1]
        + Math.sin(time * (0.16 + seed * 0.08) + seed * 13) * 0.16;
      values[index * 3 + 2] = matter.basePositions[index * 3 + 2]
        + Math.cos(time * 0.13 + seed * 9) * 0.08;
    }
    position.needsUpdate = true;
    if (points.current) points.current.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.035;
  });

  return (
    <points ref={points} geometry={matter.geometry} frustumCulled={false} renderOrder={2}>
      <pointsMaterial
        color="#7bdad7"
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.52}
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function MusicScene({ attentionActive }: { attentionActive: boolean }) {
  return (
    <>
      <ambientLight intensity={0.14} color="#b9c5db" />
      <spotLight position={[-5, 7, 6]} intensity={18} angle={0.28} penumbra={0.82} color="#7adce1" />
      <spotLight position={[5, 3, 4]} intensity={12} angle={0.35} penumbra={0.9} color="#d99a51" />
      <ChamberMotes />
      {CURRENT_DEFINITIONS.map(definition => (
        <HarmonicCurrent
          key={definition.id}
          definition={definition}
          attentionActive={attentionActive}
        />
      ))}
      <RegisterResonator
        position={[-3.25, 0.45, -0.7]}
        color="#45cbd3"
        center={-0.56}
        phase={0.4}
        attentionActive={attentionActive}
      />
      <RegisterResonator
        position={[0.05, 1.72, -1.1]}
        color="#e5ae59"
        center={0}
        phase={2.1}
        attentionActive={attentionActive}
      />
      <RegisterResonator
        position={[3.18, 0.75, -0.8]}
        color="#c8d8ff"
        center={0.56}
        phase={4.2}
        attentionActive={attentionActive}
      />
      <LivingPiano attentionActive={attentionActive} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.18} luminanceSmoothing={0.62} intensity={1.15} />
        <Vignette eskil={false} offset={0.12} darkness={0.82} />
      </EffectComposer>
    </>
  );
}

function StaticFallback() {
  return (
    <div className={styles.fallback} aria-hidden="true">
      <span className={styles.fallbackLid} />
      <span className={styles.fallbackBody} />
      <span className={styles.fallbackKeyboard} />
      <span className={styles.fallbackCurrent} />
    </div>
  );
}

class MusicProofBoundary extends Component<
  { children: ReactNode },
  { failed: boolean; message: string }
> {
  state = { failed: false, message: '' };

  static getDerivedStateFromError(error: Error) {
    return { failed: true, message: error.message };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // The stable fallback remains visible behind the failed WebGL layer.
  }

  render() {
    return this.state.failed
      ? <span hidden data-music-render-error={this.state.message} />
      : this.props.children;
  }
}

export default function MuseumMusicProof() {
  const stage = useRef<HTMLDivElement>(null);
  const [attentionActive, setAttentionActive] = useState(false);
  const [register, setRegister] = useState<'bass' | 'middle' | 'treble'>('middle');
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

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const y = THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    event.currentTarget.style.setProperty('--music-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--music-y', `${y * 100}%`);
    const nextRegister = x < 0.38 ? 'bass' : x > 0.62 ? 'treble' : 'middle';
    if (nextRegister !== register) setRegister(nextRegister);
  };

  return (
    <main
      className={styles.proof}
      data-attention-active={attentionActive}
      data-music-register={register}
      data-reduced-motion={reducedMotion}
    >
      <div
        ref={stage}
        className={styles.stage}
        style={{ '--music-x': '50%', '--music-y': '52%' } as CSSProperties}
        onPointerEnter={event => {
          setAttentionActive(true);
          updatePointer(event);
        }}
        onPointerMove={updatePointer}
        onPointerLeave={() => setAttentionActive(false)}
      >
        <StaticFallback />
        <MusicProofBoundary>
          {reducedMotion ? null : (
            <Canvas
              aria-label="Animated grand piano resonance chamber"
              dpr={MUSEUM_MUSIC_PROOF_PERFORMANCE.dpr}
              frameloop={visible ? 'always' : 'never'}
              camera={{ position: [0, 0.7, 8.8], fov: 42, near: 0.1, far: 40 }}
              gl={{
                alpha: true,
                antialias: false,
                depth: true,
                stencil: false,
                powerPreference: 'high-performance',
              }}
              onCreated={({ camera, gl }) => {
                camera.lookAt(0, -0.05, 0);
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.12;
              }}
            >
              <Suspense fallback={null}>
                <MusicScene attentionActive={attentionActive} />
              </Suspense>
            </Canvas>
          )}
        </MusicProofBoundary>
        <div className={styles.attentionField} aria-hidden="true">
          <span className={styles.localHalo} />
          <span className={styles.harmonicMesh} />
        </div>
        <div className={styles.grain} aria-hidden="true" />
      </div>
      <header className={styles.caption}>
        <div className={styles.navigation}>
          <Link href="/">Return to the threshold</Link>
          <Link href="/projects">Open the Museum</Link>
        </div>
        <div>
          <p>Material proof 04 / resonance chamber</p>
          <h1>Sound leaves architecture in the air.</h1>
        </div>
      </header>
      <p className={styles.registerLabel} aria-live="polite">
        {register} register / move closer to increase pressure
      </p>
      <p className={styles.legend}>
        living instrument / traveling pressure / independent registers / local resonance / quiet notation matter
      </p>
    </main>
  );
}

useGLTF.preload(PIANO_MODEL);
