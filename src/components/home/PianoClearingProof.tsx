'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  PIANO_CLEARING_CAMERA,
  PIANO_CLEARING_PERFORMANCE,
  pianoClearingStreamCenter,
  pianoClearingStreamWidth,
  pianoClearingTerrainHeight,
} from '@/lib/artDirection/pianoClearing';
import styles from './PianoClearingProof.module.css';

const GROUND_Y = -1.45;
const PIANO_POSITION = new THREE.Vector3(-2.35, -0.12, 2.25);

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createGroundGeometry() {
  const geometry = new THREE.PlaneGeometry(64, 58, 58, 52);
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const worldZ = -positions.getY(index) - 9;
    positions.setZ(index, pianoClearingTerrainHeight(x, worldZ));
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function createGrassGeometry() {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    -0.045, 0, 0, 0.045, 0, 0, 0.025, 0.72, 0, -0.02, 0.72, 0,
    0, 0, -0.045, 0, 0, 0.045, 0, 0.72, 0.025, 0, 0.72, -0.02,
  ]), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
  ]), 2));
  geometry.setIndex([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
  ]);
  return geometry;
}

function GrassField({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => createGrassGeometry(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uWind: { value: reducedMotion ? 0 : 1 },
      uFogColor: { value: new THREE.Color('#b4c99b') },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uWind;
      varying vec2 vUv;
      varying float vFog;
      void main() {
        vUv = uv;
        vec3 blade = position;
        vec3 root = instanceMatrix[3].xyz;
        float phase = root.x * 0.41 + root.z * 0.29;
        float breeze = sin(uTime * 0.62 + phase) * 0.065;
        breeze += sin(uTime * 0.27 + phase * 1.7) * 0.035;
        blade.x += breeze * uv.y * uv.y * uWind;
        blade.z += cos(uTime * 0.45 + phase) * 0.025 * uv.y * uWind;
        vec4 worldPosition = modelMatrix * instanceMatrix * vec4(blade, 1.0);
        vec4 viewPosition = viewMatrix * worldPosition;
        vFog = smoothstep(18.0, 48.0, -viewPosition.z);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uFogColor;
      varying vec2 vUv;
      varying float vFog;
      void main() {
        vec3 rootColor = vec3(0.20, 0.34, 0.10);
        vec3 tipColor = vec3(0.70, 0.77, 0.28);
        vec3 color = mix(rootColor, tipColor, vUv.y);
        color = mix(color, uFogColor, vFog * 0.78);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), [reducedMotion]);

  const transforms = useMemo(() => {
    const random = seededRandom(801);
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];

    while (matrices.length < PIANO_CLEARING_PERFORMANCE.grassInstances) {
      const x = (random() - 0.5) * 40;
      const z = 7 - random() * 38;
      const streamGap = Math.abs(x - pianoClearingStreamCenter(z));
      const pianoGap = Math.hypot((x + 2.35) * 0.9, z - 2.25);
      if (streamGap < pianoClearingStreamWidth(z) + 1.15 || pianoGap < 3.25) continue;

      dummy.position.set(x, GROUND_Y + pianoClearingTerrainHeight(x, z), z);
      dummy.rotation.set(
        (random() - 0.5) * 0.06,
        random() * Math.PI,
        (random() - 0.5) * 0.06,
      );
      const scale = (0.48 + random() * 0.75) * (z < -12 ? 0.72 : 1);
      dummy.scale.set(0.72 + random() * 0.5, scale, 0.72 + random() * 0.5);
      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }

    return matrices;
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    transforms.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true;
  }, [transforms]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uWind.value = reducedMotion ? 0 : 1;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, transforms.length]}
      frustumCulled={false}
    />
  );
}

function Ground() {
  const geometry = useMemo(() => createGroundGeometry(), []);
  return (
    <mesh geometry={geometry} position={[0, GROUND_Y, -9]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshToonMaterial color="#89a94b" />
    </mesh>
  );
}

function createStreamGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const segments = 52;

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    const z = 6.5 - progress * 40;
    const center = pianoClearingStreamCenter(z);
    const width = pianoClearingStreamWidth(z);
    const y = GROUND_Y + pianoClearingTerrainHeight(center, z) + 0.18;
    positions.push(center - width, y, z, center + width, y, z);
    uvs.push(0, progress, 1, progress);
    if (index < segments) {
      const offset = index * 2;
      indices.push(offset, offset + 2, offset + 1, offset + 1, offset + 2, offset + 3);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

function Stream({ reducedMotion }: { reducedMotion: boolean }) {
  const geometry = useMemo(() => createStreamGeometry(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uMotion;
      varying vec2 vUv;
      void main() {
        float time = uTime * uMotion;
        float current = sin(vUv.y * 72.0 - time * 1.35 + sin(vUv.y * 13.0) * 1.2);
        float fine = sin(vUv.y * 155.0 - time * 2.1 + vUv.x * 7.0);
        float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
        vec3 deep = vec3(0.18, 0.49, 0.60);
        vec3 sun = vec3(0.86, 0.94, 0.72);
        vec3 color = mix(deep, sun, max(0.0, current) * 0.32 + max(0.0, fine) * 0.12);
        float alpha = (0.8 + max(0.0, current) * 0.16) * edge;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  }), [reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
  });

  return <mesh geometry={geometry} material={material} renderOrder={1} />;
}

function samplePianoGeometry(scene: THREE.Group) {
  scene.updateMatrixWorld(true);
  const vertices: THREE.Vector3[] = [];
  const point = new THREE.Vector3();

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const attribute = child.geometry.getAttribute('position');
    if (!attribute) return;
    for (let index = 0; index < attribute.count; index += 1) {
      point.fromBufferAttribute(attribute, index).applyMatrix4(child.matrixWorld);
      vertices.push(point.clone());
    }
  });

  const random = seededRandom(4219);
  const count = Math.min(PIANO_CLEARING_PERFORMANCE.pianoParticles, Math.max(1, vertices.length));
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    const vertex = vertices[Math.floor(random() * vertices.length)] ?? point.set(0, 0, 0);
    positions[index * 3] = vertex.x;
    positions[index * 3 + 1] = vertex.y;
    positions[index * 3 + 2] = vertex.z;
    seeds[index] = random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

function ParticlePiano({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF('/models/grand_piano/grand_piano_(GLB).gltf');
  const geometry = useMemo(() => samplePianoGeometry(scene), [scene]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uDpr: { value: 1 },
    },
    vertexShader: `
      attribute float aSeed;
      uniform float uTime;
      uniform float uMotion;
      uniform float uDpr;
      varying float vSeed;
      varying float vPulse;
      void main() {
        vSeed = aSeed;
        float pulse = sin(uTime * (0.36 + aSeed * 0.38) + aSeed * 31.0);
        vec3 transformed = position;
        transformed += normalize(position + vec3(0.001)) * pulse * 0.008 * uMotion;
        vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
        vPulse = pulse;
        gl_PointSize = (2.1 + aSeed * 1.9 + pulse * 0.25 * uMotion) * uDpr * (15.0 / max(2.0, -viewPosition.z));
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      varying float vSeed;
      varying float vPulse;
      void main() {
        vec2 centered = gl_PointCoord - 0.5;
        float circle = 1.0 - smoothstep(0.32, 0.5, length(centered));
        vec3 blue = vec3(0.48, 0.76, 0.95);
        vec3 ivory = vec3(1.0, 0.91, 0.62);
        vec3 color = mix(blue, ivory, smoothstep(0.42, 0.95, vSeed));
        float light = 0.72 + (vPulse * 0.5 + 0.5) * 0.28;
        gl_FragColor = vec4(color * light, circle * (0.7 + vSeed * 0.28));
      }
    `,
  }), [reducedMotion]);
  const { gl } = useThree();

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    material.uniforms.uDpr.value = Math.min(gl.getPixelRatio(), 1.25);
  });

  return (
    <group
      position={PIANO_POSITION}
      rotation={[0, -0.26, 0]}
      scale={1.78}
    >
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

function PianoShadow() {
  const y = GROUND_Y + pianoClearingTerrainHeight(PIANO_POSITION.x, PIANO_POSITION.z) + 0.055;
  return (
    <mesh
      position={[PIANO_POSITION.x + 0.3, y, PIANO_POSITION.z + 0.22]}
      rotation={[-Math.PI / 2, 0, -0.18]}
      scale={[2.7, 1.65, 1]}
    >
      <circleGeometry args={[1, 44]} />
      <meshBasicMaterial color="#334224" transparent opacity={0.34} depthWrite={false} />
    </mesh>
  );
}

function DistantLandscape() {
  const trees = useMemo(() => {
    const random = seededRandom(1827);
    return Array.from({ length: PIANO_CLEARING_PERFORMANCE.horizonTrees }, (_, index) => ({
      x: -18 + index * 1.7 + (random() - 0.5) * 1.1,
      z: -22 - random() * 7,
      scale: 0.5 + random() * 0.95,
      rotation: random() * Math.PI,
    }));
  }, []);
  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    trees.forEach((tree, index) => {
      const y = GROUND_Y + pianoClearingTerrainHeight(tree.x, tree.z);
      dummy.position.set(tree.x, y + tree.scale * 0.45, tree.z);
      dummy.rotation.set(0, tree.rotation, 0);
      dummy.scale.set(tree.scale * 0.12, tree.scale * 0.65, tree.scale * 0.12);
      dummy.updateMatrix();
      trunks.current?.setMatrixAt(index, dummy.matrix);

      dummy.position.set(tree.x, y + tree.scale * 1.22, tree.z);
      dummy.scale.set(tree.scale * 0.62, tree.scale * 0.9, tree.scale * 0.62);
      dummy.updateMatrix();
      crowns.current?.setMatrixAt(index, dummy.matrix);
    });
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true;
    if (crowns.current) crowns.current.instanceMatrix.needsUpdate = true;
  }, [trees]);

  return (
    <>
      <group position={[0, -4.1, -38]}>
        <mesh position={[-16, 4.8, -6]} scale={[19, 7.2, 6]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshToonMaterial color="#718c6d" />
        </mesh>
        <mesh position={[2, 3.9, -11]} scale={[24, 6.4, 7]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshToonMaterial color="#8fa27b" />
        </mesh>
        <mesh position={[20, 5.3, -7]} scale={[17, 8, 6]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshToonMaterial color="#667f6d" />
        </mesh>
      </group>
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]}>
        <cylinderGeometry args={[0.5, 0.62, 1.6, 5]} />
        <meshToonMaterial color="#54603d" />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshToonMaterial color="#587746" />
      </instancedMesh>
    </>
  );
}

function SkyDome() {
  return (
    <mesh scale={72}>
      <sphereGeometry args={[1, 28, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        vertexShader={`
          varying vec3 vWorld;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorld = normalize(world.xyz);
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `}
        fragmentShader={`
          varying vec3 vWorld;
          void main() {
            float height = smoothstep(-0.12, 0.78, vWorld.y);
            vec3 horizon = vec3(0.91, 0.81, 0.61);
            vec3 zenith = vec3(0.39, 0.68, 0.83);
            vec3 color = mix(horizon, zenith, height);
            vec3 sunDirection = normalize(vec3(-0.56, 0.38, -0.58));
            float halo = pow(max(dot(vWorld, sunDirection), 0.0), 18.0);
            float disk = smoothstep(0.997, 0.9993, dot(vWorld, sunDirection));
            color += vec3(1.0, 0.77, 0.38) * halo * 0.38;
            color += vec3(1.0, 0.92, 0.66) * disk;
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Clouds({ reducedMotion }: { reducedMotion: boolean }) {
  const groups = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const time = clock.elapsedTime;
    groups.forEach((group, index) => {
      if (!group.current) return;
      group.current.position.x += Math.sin(time * (0.018 + index * 0.004) + index) * 0.0009;
      group.current.rotation.z = Math.sin(time * 0.025 + index * 1.7) * 0.015;
    });
  });

  const cloudData = [
    { position: [-11, 8.4, -22] as const, scale: 1.5 },
    { position: [3, 10.5, -31] as const, scale: 1.9 },
    { position: [14, 7.4, -25] as const, scale: 1.25 },
  ];

  return (
    <>
      {cloudData.map((cloud, cloudIndex) => (
        <group
          key={cloudIndex}
          ref={groups[cloudIndex]}
          position={[...cloud.position]}
          scale={cloud.scale}
        >
          {[
            [-1.3, 0, 0],
            [-0.2, 0.32, 0],
            [1.1, 0.06, 0],
            [0.35, -0.18, 0.12],
          ].map((offset, index) => (
            <mesh key={index} position={offset as [number, number, number]} scale={[1.8, 0.62, 0.72]}>
              <icosahedronGeometry args={[1, 1]} />
              <meshBasicMaterial color="#fff8dc" transparent opacity={0.54} depthWrite={false} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(...PIANO_CLEARING_CAMERA.target), []);
  const base = useMemo(() => new THREE.Vector3(...PIANO_CLEARING_CAMERA.position), []);

  useFrame(({ clock }, delta) => {
    const travel = reducedMotion ? 0 : PIANO_CLEARING_CAMERA.maxPointerTravel;
    const breath = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.16) * 0.035;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, base.x + pointer.x * travel, 2, delta);
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      base.y + pointer.y * travel * 0.32 + breath,
      2,
      delta,
    );
    camera.lookAt(target);
  });

  return null;
}

const PianoClearingScene = memo(function PianoClearingScene({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <>
      <SkyDome />
      <fogExp2 attach="fog" args={['#b8c8a5', 0.021]} />
      <hemisphereLight args={['#fff3ce', '#526043', 2.05]} />
      <directionalLight position={[-11, 13, 6]} color="#ffe2a0" intensity={2.7} />
      <DistantLandscape />
      <Ground />
      <Stream reducedMotion={reducedMotion} />
      <GrassField reducedMotion={reducedMotion} />
      <PianoShadow />
      <ParticlePiano reducedMotion={reducedMotion} />
      <Clouds reducedMotion={reducedMotion} />
      <CameraRig reducedMotion={reducedMotion} />
    </>
  );
});

export default function PianoClearingProof() {
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState !== 'hidden');
    updateMotion();
    updateVisibility();
    motion.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      motion.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return (
    <main
      className={styles.world}
      data-piano-clearing-proof=""
      data-scene-budget={`${PIANO_CLEARING_PERFORMANCE.grassInstances}-grass/${PIANO_CLEARING_PERFORMANCE.pianoParticles}-piano-points/no-post`}
    >
      <Canvas
        className={styles.canvas}
        dpr={[0.75, PIANO_CLEARING_PERFORMANCE.maxDpr]}
        frameloop={pageVisible && !reducedMotion ? 'always' : 'demand'}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: [...PIANO_CLEARING_CAMERA.position],
          fov: PIANO_CLEARING_CAMERA.fov,
          near: 0.1,
          far: 110,
        }}
      >
        <PianoClearingScene reducedMotion={reducedMotion} />
      </Canvas>
      <div aria-hidden="true" className={styles.atmosphere} />
      <div aria-hidden="true" className={styles.sunWash} />
      <div aria-hidden="true" className={styles.grain} />
      <p className={styles.proofLabel}>
        Environmental proof 02
        <strong>The riverside piano</strong>
      </p>
    </main>
  );
}

useGLTF.preload('/models/grand_piano/grand_piano_(GLB).gltf');
