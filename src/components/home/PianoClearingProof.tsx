'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import {
  memo,
  Suspense,
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
const PIANO_X = 5.2;
const PIANO_Z = 4.15;
const PIANO_POSITION = new THREE.Vector3(
  PIANO_X,
  GROUND_Y + pianoClearingTerrainHeight(PIANO_X, PIANO_Z) + 1.12,
  PIANO_Z,
);

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createGroundGeometry() {
  const geometry = new THREE.PlaneGeometry(78, 68, 72, 64);
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const worldZ = -positions.getY(index) - 10;
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
      uFogColor: { value: new THREE.Color('#d8cda4') },
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
        vec3 rootColor = vec3(0.16, 0.27, 0.09);
        vec3 tipColor = vec3(0.87, 0.77, 0.24);
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
      const x = (random() - 0.5) * 54;
      const z = 9.5 - random() * 44;
      const streamGap = Math.abs(z - pianoClearingStreamCenter(x));
      const pianoGap = Math.hypot((x - PIANO_POSITION.x) * 0.9, z - PIANO_POSITION.z);
      const steepCliff = z < 2.2 && z > -5.4;
      const ravineFloor = z <= -5.4 && z > -20;
      if (
        streamGap < pianoClearingStreamWidth(x) + 1.2
        || pianoGap < 3.15
        || steepCliff
        || ravineFloor
      ) continue;

      dummy.position.set(x, GROUND_Y + pianoClearingTerrainHeight(x, z), z);
      dummy.rotation.set(
        (random() - 0.5) * 0.06,
        random() * Math.PI,
        (random() - 0.5) * 0.06,
      );
      const scale = (0.48 + random() * 0.95) * (z < -14 ? 0.62 : 1);
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
    <mesh geometry={geometry} position={[0, GROUND_Y, -10]} rotation={[-Math.PI / 2, 0, 0]}>
      <shaderMaterial
        vertexShader={`
          varying float vHeight;
          varying float vSlope;
          varying float vDepth;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * worldPosition;
            vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
            vHeight = worldPosition.y;
            vSlope = 1.0 - abs(worldNormal.y);
            vDepth = -viewPosition.z;
            gl_Position = projectionMatrix * viewPosition;
          }
        `}
        fragmentShader={`
          varying float vHeight;
          varying float vSlope;
          varying float vDepth;
          void main() {
            vec3 valley = vec3(0.10, 0.24, 0.27);
            vec3 hillside = vec3(0.36, 0.50, 0.29);
            vec3 plateau = vec3(0.78, 0.70, 0.22);
            float middle = smoothstep(-4.8, -1.1, vHeight);
            float top = smoothstep(-0.5, 0.7, vHeight);
            vec3 color = mix(valley, hillside, middle);
            color = mix(color, plateau, top);
            color *= 1.0 - vSlope * 0.52;
            float bands = sin(vHeight * 8.0 + vSlope * 5.0) * 0.018;
            color += bands;
            float fog = smoothstep(31.0, 78.0, vDepth);
            color = mix(color, vec3(0.78, 0.75, 0.58), fog * 0.76);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function createStreamGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const segments = 72;

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    const x = -39 + progress * 78;
    const centerZ = pianoClearingStreamCenter(x);
    const width = pianoClearingStreamWidth(x);
    const y = GROUND_Y + pianoClearingTerrainHeight(x, centerZ) + 1.05;
    positions.push(x, y, centerZ - width, x, y, centerZ + width);
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
        vec3 deep = vec3(0.12, 0.35, 0.50);
        vec3 sun = vec3(0.78, 0.85, 0.73);
        vec3 color = mix(deep, sun, max(0.0, current) * 0.24 + max(0.0, fine) * 0.1);
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
  const ghost = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.material = new THREE.MeshStandardMaterial({
        color: '#273746',
        emissive: '#142331',
        emissiveIntensity: 0.24,
        metalness: 0.3,
        roughness: 0.58,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    });
    return clone;
  }, [scene]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
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
        gl_PointSize = (1.7 + aSeed * 1.55 + pulse * 0.18 * uMotion) * uDpr * (19.0 / max(2.0, -viewPosition.z));
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      varying float vSeed;
      varying float vPulse;
      void main() {
        vec2 centered = gl_PointCoord - 0.5;
        float circle = 1.0 - smoothstep(0.32, 0.5, length(centered));
        vec3 blue = vec3(0.16, 0.46, 0.72);
        vec3 ivory = vec3(0.94, 0.72, 0.29);
        vec3 color = mix(blue, ivory, smoothstep(0.42, 0.95, vSeed));
        float light = 0.62 + (vPulse * 0.5 + 0.5) * 0.24;
        gl_FragColor = vec4(color * light, circle * (0.52 + vSeed * 0.28));
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
      rotation={[0, -0.42, 0]}
      scale={1.42}
    >
      <primitive object={ghost} renderOrder={-1} />
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
    return Array.from({ length: PIANO_CLEARING_PERFORMANCE.horizonTrees }, () => ({
      x: -25 + random() * 50,
      z: -28 - random() * 12,
      scale: 0.3 + random() * 0.54,
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
      <group position={[0, -2.8, -49]}>
        <mesh position={[-25, 3.2, -3]} scale={[18, 4.6, 5]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshToonMaterial color="#8b9b78" />
        </mesh>
        <mesh position={[-6, 3.7, -7]} scale={[20, 5.1, 5.5]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshToonMaterial color="#9aa77f" />
        </mesh>
        <mesh position={[14, 3.35, -5]} scale={[18, 4.7, 5.2]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshToonMaterial color="#869975" />
        </mesh>
        <mesh position={[31, 2.7, -9]} scale={[16, 3.9, 4.8]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshToonMaterial color="#9aa67c" />
        </mesh>
      </group>
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]}>
        <cylinderGeometry args={[0.5, 0.62, 1.6, 5]} />
        <meshToonMaterial color="#5e6545" />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshToonMaterial color="#657a4d" />
      </instancedMesh>
    </>
  );
}

function ForegroundFraming({ reducedMotion }: { reducedMotion: boolean }) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const time = clock.elapsedTime;
    if (left.current) {
      left.current.rotation.z = Math.sin(time * 0.11) * 0.018;
      left.current.position.x = -11.2 + Math.sin(time * 0.07) * 0.09;
    }
    if (right.current) {
      right.current.rotation.z = Math.sin(time * 0.085 + 1.2) * 0.012;
      right.current.position.x = 10.8 + Math.sin(time * 0.055) * 0.07;
    }
  });

  const leftClusters = [
    [-1.5, 1.2, 0, 2.2],
    [0.3, 1.8, -0.2, 2.5],
    [1.9, 0.6, 0.1, 1.9],
    [-0.1, -0.2, 0.4, 2.25],
  ] as const;
  const rightClusters = [
    [-1.4, 0.4, 0, 1.75],
    [0.1, 1.4, -0.2, 2.15],
    [1.8, 1.1, 0.1, 1.8],
    [0.7, -0.4, 0.3, 1.65],
  ] as const;

  return (
    <>
      <group ref={left} position={[-11.2, 5.2, 2.2]} scale={[1.55, 1.7, 1]}>
        {leftClusters.map(([x, y, z, scale], index) => (
          <mesh key={index} position={[x, y, z]} scale={scale}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial
              color={index % 2 ? '#b497a7' : '#c4a8b1'}
              transparent
              opacity={0.17}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <group ref={right} position={[10.8, 8.9, 2.1]} scale={[1.8, 1.4, 1]}>
        {rightClusters.map(([x, y, z, scale], index) => (
          <mesh key={index} position={[x, y, z]} scale={scale}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial
              color={index % 2 ? '#517c55' : '#70955f'}
              transparent
              opacity={0.34}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

function ValleyDetails() {
  const rocksRef = useRef<THREE.InstancedMesh>(null);
  const rocks = useMemo(() => {
    const random = seededRandom(9317);
    return Array.from({ length: PIANO_CLEARING_PERFORMANCE.valleyRocks }, () => {
      const x = -22 + random() * 44;
      const centerZ = pianoClearingStreamCenter(x);
      const side = random() > 0.5 ? -1 : 1;
      const z = centerZ + side * (pianoClearingStreamWidth(x) + 0.7 + random() * 2.3);
      return {
        x,
        z,
        scale: 0.18 + random() * 0.48,
        rotation: random() * Math.PI,
      };
    });
  }, []);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    rocks.forEach((rock, index) => {
      const y = GROUND_Y + pianoClearingTerrainHeight(rock.x, rock.z);
      dummy.position.set(rock.x, y + rock.scale * 0.34, rock.z);
      dummy.rotation.set(
        rock.rotation * 0.12,
        rock.rotation,
        rock.rotation * 0.08,
      );
      dummy.scale.set(rock.scale * 1.2, rock.scale * 0.72, rock.scale);
      dummy.updateMatrix();
      rocksRef.current?.setMatrixAt(index, dummy.matrix);
    });
    if (rocksRef.current) rocksRef.current.instanceMatrix.needsUpdate = true;
  }, [rocks]);

  const flowers = useMemo(() => {
    const random = seededRandom(5401);
    const positions = new Float32Array(PIANO_CLEARING_PERFORMANCE.wildflowers * 3);
    const colors = new Float32Array(PIANO_CLEARING_PERFORMANCE.wildflowers * 3);
    const ivory = new THREE.Color('#fff3c8');
    const blue = new THREE.Color('#b7d7ef');

    for (let index = 0; index < PIANO_CLEARING_PERFORMANCE.wildflowers; index += 1) {
      let x = -17 + random() * 34;
      let z = 2.2 + random() * 6.2;
      if (Math.hypot(x - PIANO_POSITION.x, z - PIANO_POSITION.z) < 3.4) {
        x -= 5.5;
        z += 1.4;
      }
      const y = GROUND_Y + pianoClearingTerrainHeight(x, z) + 0.18 + random() * 0.12;
      const color = random() > 0.28 ? ivory : blue;
      positions.set([x, y, z], index * 3);
      colors.set([color.r, color.g, color.b], index * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  return (
    <>
      <instancedMesh ref={rocksRef} args={[undefined, undefined, rocks.length]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshToonMaterial color="#536855" />
      </instancedMesh>
      <points geometry={flowers} frustumCulled={false}>
        <pointsMaterial
          size={0.095}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.92}
          depthWrite={false}
        />
      </points>
    </>
  );
}

function RavineAccents() {
  const rocks = [
    { x: -12.7, z: -7.2, scale: 1.45, color: '#314b43' },
    { x: -11.1, z: -7.8, scale: 1.12, color: '#3c5748' },
    { x: -13.4, z: -8.6, scale: 0.94, color: '#263f3d' },
    { x: -9.8, z: -8.5, scale: 0.72, color: '#49604d' },
    { x: -12.1, z: -9.2, scale: 0.62, color: '#2b4540' },
  ];

  return (
    <group>
      {rocks.map((rock, index) => {
        const y = GROUND_Y + pianoClearingTerrainHeight(rock.x, rock.z);
        return (
          <mesh
            key={index}
            position={[rock.x, y + rock.scale * 0.5, rock.z]}
            rotation={[index * 0.13, index * 0.71, index * 0.08]}
            scale={[rock.scale * 1.25, rock.scale, rock.scale]}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshToonMaterial color={rock.color} />
          </mesh>
        );
      })}
    </group>
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
            vec3 horizon = vec3(0.96, 0.84, 0.60);
            vec3 zenith = vec3(0.67, 0.65, 0.72);
            vec3 color = mix(horizon, zenith, height);
            vec3 sunDirection = normalize(vec3(0.02, 0.14, -0.99));
            float sunFacing = max(dot(vWorld, sunDirection), 0.0);
            float halo = pow(sunFacing, 15.0);
            float disk = smoothstep(0.9974, 0.9991, sunFacing);
            color += vec3(1.0, 0.74, 0.38) * halo * 0.33;
            color += vec3(1.0, 0.95, 0.74) * disk * 0.92;
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
    { position: [-17, 9.1, -30] as const, scale: 1.8 },
    { position: [-5, 10.7, -41] as const, scale: 1.4 },
    { position: [7, 9.3, -35] as const, scale: 1.7 },
    { position: [18, 7.9, -32] as const, scale: 1.25 },
    { position: [28, 10.8, -46] as const, scale: 1.55 },
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
              <meshBasicMaterial color="#ffe6bf" transparent opacity={0.38} depthWrite={false} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

function AtmosphericMotes({ reducedMotion }: { reducedMotion: boolean }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
    },
    vertexShader: `
      attribute float aSeed;
      uniform float uTime;
      uniform float uMotion;
      varying float vSeed;
      void main() {
        vSeed = aSeed;
        vec3 transformed = position;
        transformed.x += sin(uTime * 0.16 + aSeed * 28.0) * 0.16 * uMotion;
        transformed.y += sin(uTime * (0.12 + aSeed * 0.08) + aSeed * 19.0) * 0.12 * uMotion;
        vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_PointSize = (1.2 + aSeed * 1.5) * (16.0 / max(3.0, -viewPosition.z));
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      varying float vSeed;
      void main() {
        float circle = 1.0 - smoothstep(0.2, 0.5, length(gl_PointCoord - 0.5));
        vec3 ivory = vec3(1.0, 0.92, 0.69);
        vec3 blue = vec3(0.61, 0.81, 0.82);
        gl_FragColor = vec4(mix(ivory, blue, step(0.72, vSeed)), circle * (0.28 + vSeed * 0.36));
      }
    `,
  }), [reducedMotion]);

  const geometry = useMemo(() => {
    const random = seededRandom(1471);
    const count = PIANO_CLEARING_PERFORMANCE.atmosphericMotes;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      positions.set([
        -24 + random() * 48,
        -2.5 + random() * 10,
        3 - random() * 39,
      ], index * 3);
      seeds[index] = random();
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return buffer;
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

function DistantSkyForms({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.07) * 0.07;
  });

  const forms = [
    [-9, 6.8, -43, 0.68],
    [2.5, 8.1, -50, 0.52],
    [12.5, 6.2, -46, 0.6],
    [20, 7.4, -53, 0.44],
  ] as const;

  return (
    <group ref={group}>
      {forms.map(([x, y, z, scale], index) => (
        <group key={index} position={[x, y, z]} scale={scale}>
          <mesh scale={[1.35, 0.72, 0.9]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#8d8d73" transparent opacity={0.19} depthWrite={false} />
          </mesh>
          <mesh position={[0, -0.82, 0]} scale={[0.48, 0.64, 0.48]}>
            <coneGeometry args={[1, 1.8, 5]} />
            <meshBasicMaterial color="#817f68" transparent opacity={0.16} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
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
      <directionalLight position={[-7, 12, 5]} color="#ffd995" intensity={2.35} />
      <DistantLandscape />
      <Ground />
      <Stream reducedMotion={reducedMotion} />
      <GrassField reducedMotion={reducedMotion} />
      <ValleyDetails />
      <RavineAccents />
      <PianoShadow />
      <Suspense fallback={null}>
        <ParticlePiano reducedMotion={reducedMotion} />
      </Suspense>
      <Clouds reducedMotion={reducedMotion} />
      <DistantSkyForms reducedMotion={reducedMotion} />
      <AtmosphericMotes reducedMotion={reducedMotion} />
      <ForegroundFraming reducedMotion={reducedMotion} />
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
        Environmental proof 04
        <strong>The valley piano</strong>
      </p>
    </main>
  );
}

useGLTF.preload('/models/grand_piano/grand_piano_(GLB).gltf');
