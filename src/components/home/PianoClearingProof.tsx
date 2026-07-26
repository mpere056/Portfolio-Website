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
  pianoClearingTerrainHeight,
} from '@/lib/artDirection/pianoClearing';
import styles from './PianoClearingProof.module.css';

const GROUND_Y = -1.48;

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createGroundGeometry() {
  const geometry = new THREE.PlaneGeometry(46, 34, 40, 30);
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const worldZ = -positions.getY(index);
    positions.setZ(index, pianoClearingTerrainHeight(x, worldZ));
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function createGrassGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array([
    -0.045, 0, 0, 0.045, 0, 0, 0.025, 0.74, 0, -0.02, 0.74, 0,
    0, 0, -0.045, 0, 0, 0.045, 0, 0.74, 0.025, 0, 0.74, -0.02,
  ]);
  const uvs = new Float32Array([
    0, 0, 1, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 1,
  ]);
  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
  ];

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function GrassField({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => createGrassGeometry(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: false,
    uniforms: {
      uTime: { value: 0 },
      uWind: { value: reducedMotion ? 0 : 1 },
      uFogColor: { value: new THREE.Color('#6e8174') },
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
        float phase = root.x * 0.43 + root.z * 0.31;
        float sway = sin(uTime * 0.72 + phase) * 0.07;
        sway += sin(uTime * 0.31 + phase * 1.8) * 0.035;
        blade.x += sway * uv.y * uv.y * uWind;
        blade.z += cos(uTime * 0.56 + phase) * 0.028 * uv.y * uWind;
        vec4 worldPosition = modelMatrix * instanceMatrix * vec4(blade, 1.0);
        vec4 viewPosition = viewMatrix * worldPosition;
        vFog = smoothstep(13.0, 31.0, -viewPosition.z);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uFogColor;
      varying vec2 vUv;
      varying float vFog;
      void main() {
        vec3 rootColor = vec3(0.075, 0.16, 0.07);
        vec3 tipColor = vec3(0.38, 0.53, 0.22);
        vec3 color = mix(rootColor, tipColor, vUv.y);
        color *= 0.82 + vUv.y * 0.28;
        color = mix(color, uFogColor, vFog * 0.72);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), [reducedMotion]);

  const transforms = useMemo(() => {
    const random = seededRandom(801);
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];

    while (matrices.length < PIANO_CLEARING_PERFORMANCE.grassInstances) {
      const x = (random() - 0.5) * 31;
      const z = (random() - 0.5) * 24;
      const clearingDistance = Math.sqrt((x * x) / 1.25 + z * z);
      if (clearingDistance < 3.25 || random() < 0.08) continue;

      dummy.position.set(
        x,
        GROUND_Y + pianoClearingTerrainHeight(x, z),
        z,
      );
      dummy.rotation.set(
        (random() - 0.5) * 0.08,
        random() * Math.PI,
        (random() - 0.5) * 0.08,
      );
      const scale = 0.5 + random() * 0.72;
      dummy.scale.set(0.72 + random() * 0.55, scale, 0.72 + random() * 0.55);
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
    <>
      <mesh geometry={geometry} position={[0, GROUND_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#52683a" roughness={1} metalness={0} flatShading />
      </mesh>
      <mesh position={[0.2, GROUND_Y + 0.035, 0.4]} rotation={[-Math.PI / 2, 0, -0.08]}>
        <circleGeometry args={[3.15, 48]} />
        <meshBasicMaterial color="#78805a" transparent opacity={0.34} depthWrite={false} />
      </mesh>
    </>
  );
}

function Piano() {
  const { scene } = useGLTF('/models/grand_piano/grand_piano_(GLB).gltf');
  const piano = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={[0, -0.18, 0.25]} rotation={[0, -0.34, 0]} scale={1.72}>
      <primitive object={piano} />
    </group>
  );
}

function PianoShadow() {
  return (
    <mesh position={[0.25, GROUND_Y + 0.055, 0.45]} rotation={[-Math.PI / 2, 0, -0.22]}>
      <circleGeometry args={[2.65, 48]} />
      <meshBasicMaterial
        color="#101813"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </mesh>
  );
}

function Horizon() {
  const trees = useMemo(() => {
    const random = seededRandom(1827);
    const values = [];
    for (let index = 0; index < PIANO_CLEARING_PERFORMANCE.horizonTrees; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const x = side * (8.5 + random() * 10);
      const z = -8 - random() * 10;
      values.push({
        x,
        z,
        scale: 0.65 + random() * 1.35,
        rotation: random() * Math.PI,
      });
    }
    return values;
  }, []);

  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    trees.forEach((tree, index) => {
      const y = GROUND_Y + pianoClearingTerrainHeight(tree.x, tree.z);
      dummy.position.set(tree.x, y + tree.scale * 0.72, tree.z);
      dummy.rotation.set(0, tree.rotation, 0);
      dummy.scale.set(tree.scale * 0.18, tree.scale * 0.9, tree.scale * 0.18);
      dummy.updateMatrix();
      trunks.current?.setMatrixAt(index, dummy.matrix);

      dummy.position.set(tree.x, y + tree.scale * 1.85, tree.z);
      dummy.scale.set(tree.scale * 0.78, tree.scale * 1.35, tree.scale * 0.78);
      dummy.updateMatrix();
      crowns.current?.setMatrixAt(index, dummy.matrix);
    });
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true;
    if (crowns.current) crowns.current.instanceMatrix.needsUpdate = true;
  }, [trees]);

  return (
    <>
      <group position={[0, -2.4, -15.5]}>
        <mesh position={[-9, 1.4, 0]} scale={[8, 2.2, 2.4]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshLambertMaterial color="#435d57" flatShading />
        </mesh>
        <mesh position={[0, 0.8, -1.5]} scale={[10, 2.4, 2.2]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshLambertMaterial color="#587068" flatShading />
        </mesh>
        <mesh position={[10, 1.55, 0.5]} scale={[8.5, 2.7, 2.6]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshLambertMaterial color="#3e5950" flatShading />
        </mesh>
      </group>
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]}>
        <cylinderGeometry args={[0.5, 0.68, 1.6, 5]} />
        <meshLambertMaterial color="#34412c" flatShading />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]}>
        <coneGeometry args={[1, 2.4, 7]} />
        <meshLambertMaterial color="#2f5539" flatShading />
      </instancedMesh>
    </>
  );
}

function SkyDome() {
  return (
    <mesh scale={42}>
      <sphereGeometry args={[1, 24, 14]} />
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
            float height = smoothstep(-0.18, 0.78, vWorld.y);
            vec3 horizon = vec3(0.64, 0.72, 0.65);
            vec3 zenith = vec3(0.24, 0.42, 0.58);
            vec3 color = mix(horizon, zenith, height);
            vec3 sunDirection = normalize(vec3(0.65, 0.42, -0.45));
            float sun = pow(max(dot(vWorld, sunDirection), 0.0), 42.0);
            color += vec3(1.0, 0.72, 0.32) * sun * 0.55;
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Clouds({ reducedMotion }: { reducedMotion: boolean }) {
  const first = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const time = clock.elapsedTime;
    if (first.current) first.current.position.x = -7 + Math.sin(time * 0.035) * 1.1;
    if (second.current) second.current.position.x = 8 + Math.sin(time * 0.028 + 2) * 1.4;
  });

  const cloud = (ref: React.RefObject<THREE.Group | null>, position: [number, number, number], scale: number) => (
    <group ref={ref} position={position} scale={scale}>
      {[
        [-1.2, 0, 0],
        [0, 0.2, 0],
        [1.25, -0.05, 0],
      ].map((offset, index) => (
        <mesh key={index} position={offset as [number, number, number]} scale={[1.8, 0.48, 0.55]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#e6ead9" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );

  return (
    <>
      {cloud(first, [-7, 7.2, -15], 1.2)}
      {cloud(second, [8, 8.5, -20], 1.5)}
    </>
  );
}

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, pointer } = useThree();
  const target = useMemo(
    () => new THREE.Vector3(...PIANO_CLEARING_CAMERA.target),
    [],
  );
  const base = useMemo(
    () => new THREE.Vector3(...PIANO_CLEARING_CAMERA.position),
    [],
  );

  useFrame(({ clock }, delta) => {
    const travel = reducedMotion ? 0 : PIANO_CLEARING_CAMERA.maxPointerTravel;
    const breath = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.18) * 0.045;
    const desiredX = base.x + pointer.x * travel;
    const desiredY = base.y + pointer.y * travel * 0.36 + breath;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 2.1, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 2.1, delta);
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
      <fogExp2 attach="fog" args={['#718477', 0.033]} />
      <hemisphereLight args={['#d8e2d0', '#243022', 1.75]} />
      <directionalLight position={[8, 11, 5]} color="#ffe1a8" intensity={2.35} />
      <Horizon />
      <Ground />
      <GrassField reducedMotion={reducedMotion} />
      <PianoShadow />
      <Piano />
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
      data-scene-budget={`${PIANO_CLEARING_PERFORMANCE.grassInstances}-grass/no-post`}
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
          far: 85,
        }}
      >
        <PianoClearingScene reducedMotion={reducedMotion} />
      </Canvas>
      <div aria-hidden="true" className={styles.atmosphere} />
      <div aria-hidden="true" className={styles.sunWash} />
      <div aria-hidden="true" className={styles.grain} />
      <p className={styles.proofLabel}>
        Environmental proof 01
        <strong>The piano clearing</strong>
      </p>
    </main>
  );
}

useGLTF.preload('/models/grand_piano/grand_piano_(GLB).gltf');
