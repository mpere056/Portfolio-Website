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
  pianoClearingCameraFov,
  pianoClearingRiverCenterX,
  pianoClearingRiverWidth,
  pianoClearingTerrainHeight,
  pianoClearingTreeAllowed,
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
const BRIDGE_Z = -17.2;
const BRIDGE_X = pianoClearingRiverCenterX(BRIDGE_Z);
const BRIDGE_WATER_Y = (
  GROUND_Y
  + pianoClearingTerrainHeight(BRIDGE_X, BRIDGE_Z)
  + 0.42
);
const BRIDGE_DECK_Y = BRIDGE_WATER_Y + 4.65;
const BRIDGE_LENGTH = 37.5;

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
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    -0.5, 0, 0,
    0.5, 0, 0,
    0.1, 0.72, 0,
    0, 1, 0,
  ], 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute([
    0, 0,
    1, 0,
    0.72, 0.72,
    0.5, 1,
  ], 2));
  geometry.setIndex([0, 1, 2, 0, 2, 3]);

  const bladeCount = PIANO_CLEARING_PERFORMANCE.grassInstances;
  const roots = new Float32Array(bladeCount * 3);
  const parameters = new Float32Array(bladeCount * 4);
  const random = seededRandom(801);
  let accepted = 0;

  while (accepted < bladeCount) {
    const x = (random() - 0.5) * 58;
    const z = 11 - random() * 48;
    const riverCenter = pianoClearingRiverCenterX(z);
    const riverWidth = pianoClearingRiverWidth(z);
    const streamGap = Math.abs(x - riverCenter);
    const height = pianoClearingTerrainHeight(x, z);
    const slopeX = Math.abs(
      pianoClearingTerrainHeight(x + 0.35, z)
      - pianoClearingTerrainHeight(x - 0.35, z),
    );
    const slopeZ = Math.abs(
      pianoClearingTerrainHeight(x, z + 0.35)
      - pianoClearingTerrainHeight(x, z - 0.35),
    );
    const steepRavineEdge = streamGap < riverWidth + 4.8 && slopeX + slopeZ > 0.92;
    if (
      streamGap < riverWidth + 1.08
      || steepRavineEdge
      || height < -1.8
    ) continue;

    const rootOffset = accepted * 3;
    roots[rootOffset] = x;
    roots[rootOffset + 1] = GROUND_Y + height;
    roots[rootOffset + 2] = z;

    const nearWeight = THREE.MathUtils.clamp((z + 35) / 45, 0, 1);
    const parameterOffset = accepted * 4;
    parameters[parameterOffset] = 0.009 + random() * 0.007;
    parameters[parameterOffset + 1] = (
      (0.26 + random() * 0.2)
      * THREE.MathUtils.lerp(1.03, 0.84, nearWeight)
    );
    parameters[parameterOffset + 2] = random() * Math.PI;
    parameters[parameterOffset + 3] = random();
    accepted += 1;
  }

  geometry.setAttribute('iRoot', new THREE.InstancedBufferAttribute(roots, 3));
  geometry.setAttribute('iParams', new THREE.InstancedBufferAttribute(parameters, 4));
  geometry.instanceCount = bladeCount;
  return geometry;
}

function GrassField({ reducedMotion }: { reducedMotion: boolean }) {
  const geometry = useMemo(() => createGrassGeometry(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uWind: { value: reducedMotion ? 0 : 1 },
      uFogColor: { value: new THREE.Color('#c5c7ad') },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uWind;
      attribute vec3 iRoot;
      attribute vec4 iParams;
      varying vec2 vUv;
      varying float vFog;
      varying float vWarm;
      varying float vBend;
      varying float vVariation;
      varying float vPianoShade;
      void main() {
        vUv = uv;
        vec3 blade = position;
        vec3 root = iRoot;
        float bladeWidth = iParams.x;
        float bladeHeight = iParams.y;
        float bladeAngle = iParams.z;
        float randomValue = iParams.w;
        float rightField = smoothstep(0.5, 12.0, root.x);
        float nearField = smoothstep(-12.0, 8.0, root.z);
        vWarm = rightField * nearField * 0.9;
        float phase = root.x * 0.41 + root.z * 0.29;
        float clump = sin(root.x * 0.73 + sin(root.z * 0.41) * 1.7) * 0.5 + 0.5;
        float variation = mix(
          sin(root.x * 2.17 + root.z * 1.31) * 0.5 + 0.5,
          randomValue,
          0.58
        );
        float broadFront = sin(root.x * 0.22 + root.z * 0.47 - uTime * 0.72);
        float fineFront = sin(root.x * 0.58 - root.z * 0.16 - uTime * 1.08 + phase);
        float gust = smoothstep(0.28, 0.96, broadFront * 0.68 + fineFront * 0.32);
        float breeze = sin(uTime * 0.52 + phase) * 0.055;
        breeze += sin(uTime * 0.24 + phase * 1.7) * 0.028;
        breeze += gust * 0.115;
        blade.x *= bladeWidth;
        blade.y *= bladeHeight * (0.84 + clump * 0.24 + variation * 0.08);
        float angleCos = cos(bladeAngle);
        float angleSin = sin(bladeAngle);
        vec3 oriented = vec3(
          blade.x * angleCos,
          blade.y,
          blade.x * angleSin
        );
        oriented.x += breeze * uv.y * uv.y * uWind;
        oriented.z += (
          cos(uTime * 0.39 + phase) * 0.028
          + gust * 0.052
          + (randomValue - 0.5) * 0.035
        ) * uv.y * uWind;
        vBend = clamp(abs(breeze) * 4.4 + gust * 0.38, 0.0, 1.0);
        vVariation = variation;
        vPianoShade = 1.0 - smoothstep(
          0.55,
          2.05,
          distance(root.xz, vec2(${PIANO_X.toFixed(2)}, ${PIANO_Z.toFixed(2)}))
        );
        vec4 worldPosition = modelMatrix * vec4(root + oriented, 1.0);
        vec4 viewPosition = viewMatrix * worldPosition;
        vFog = smoothstep(13.0, 46.0, -viewPosition.z);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uFogColor;
      varying vec2 vUv;
      varying float vFog;
      varying float vWarm;
      varying float vBend;
      varying float vVariation;
      varying float vPianoShade;
      void main() {
        vec3 baseColor = vec3(0.205, 0.365, 0.318);
        vec3 lowColor = vec3(0.292, 0.463, 0.324);
        vec3 middleColor = vec3(0.424, 0.604, 0.278);
        vec3 upperColor = vec3(0.576, 0.722, 0.306);
        vec3 tipColor = vec3(0.776, 0.831, 0.420);
        vec3 dryColor = vec3(0.851, 0.753, 0.475);
        vec3 sheenColor = vec3(0.929, 0.941, 0.784);
        vec3 sunlitColor = vec3(0.84, 0.78, 0.3);
        vec3 color = mix(baseColor, lowColor, smoothstep(0.0, 0.26, vUv.y));
        color = mix(color, middleColor, smoothstep(0.2, 0.62, vUv.y));
        color = mix(color, upperColor, smoothstep(0.56, 0.84, vUv.y));
        color = mix(color, tipColor, smoothstep(0.8, 1.0, vUv.y));
        float dry = smoothstep(0.68, 0.98, vVariation) * smoothstep(0.44, 1.0, vUv.y);
        color = mix(color, dryColor, dry * (0.28 + vWarm * 0.3));
        color = mix(color, sunlitColor, vWarm * smoothstep(0.0, 0.72, vUv.y) * 0.78);
        color *= 0.88 + vVariation * 0.22;
        color = mix(color, sheenColor, vBend * smoothstep(0.18, 0.86, vUv.y) * 0.26);
        color *= mix(0.72, 1.0, pow(vUv.y, 0.55));
        color *= 1.0 - vPianoShade * 0.11;
        color = mix(color, uFogColor, vFog * 0.8);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), [reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uWind.value = reducedMotion ? 0 : 1;
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}

function Ground({ reducedMotion }: { reducedMotion: boolean }) {
  const geometry = useMemo(() => createGroundGeometry(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
    },
    vertexShader: `
          varying float vHeight;
          varying float vSlope;
          varying float vDepth;
          varying vec3 vWorld;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * worldPosition;
            vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
            vWorld = worldPosition.xyz;
            vHeight = worldPosition.y;
            vSlope = 1.0 - abs(worldNormal.y);
            vDepth = -viewPosition.z;
            gl_Position = projectionMatrix * viewPosition;
          }
        `,
    fragmentShader: `
          uniform float uTime;
          uniform float uMotion;
          varying float vHeight;
          varying float vSlope;
          varying float vDepth;
          varying vec3 vWorld;
          void main() {
            vec3 ravine = vec3(0.07, 0.19, 0.22);
            vec3 shadedGrass = vec3(0.208, 0.337, 0.31);
            vec3 field = vec3(0.416, 0.573, 0.31);
            vec3 sunField = vec3(0.7, 0.66, 0.25);
            float elevation = smoothstep(-4.9, 1.25, vHeight);
            vec3 color = mix(ravine, shadedGrass, elevation);
            color = mix(color, field, smoothstep(-0.3, 2.2, vHeight));
            float riverCenter = 0.7 - clamp((vWorld.z + 32.0) / 42.0, 0.0, 1.0) * 8.2;
            float nearField = smoothstep(-9.0, 7.0, vWorld.z);
            float rightField = smoothstep(riverCenter + 2.8, riverCenter + 13.0, vWorld.x) * nearField;
            color = mix(color, sunField, rightField * 0.9);
            color *= 1.0 - vSlope * 0.58;
            float brush = sin(vWorld.x * 0.42 + sin(vWorld.z * 0.21) * 2.0) * 0.024;
            brush += sin(vWorld.z * 0.58 + vWorld.x * 0.17) * 0.018;
            float meadow = sin(vWorld.x * 1.73 + sin(vWorld.z * 0.37) * 2.1);
            meadow *= sin(vWorld.z * 2.16 - vWorld.x * 0.28);
            color += smoothstep(0.63, 0.96, meadow) * vec3(0.045, 0.06, 0.018) * elevation;
            float swardA = sin(vWorld.x * 6.9 + vWorld.z * 1.6);
            float swardB = sin(vWorld.x * 18.7 + vWorld.z * 3.1 + sin(vWorld.z * 0.9));
            float sward = swardA * 0.5 + swardB * 0.5;
            color = mix(color, color * 1.18 + vec3(0.055, 0.075, 0.018), smoothstep(0.2, 0.94, sward) * elevation * 0.28);
            float windBand = sin(vWorld.x * 0.22 + vWorld.z * 0.47 - uTime * 0.72 * uMotion);
            windBand += sin(vWorld.x * 0.58 - vWorld.z * 0.16 - uTime * 1.08 * uMotion) * 0.42;
            float sheen = smoothstep(0.68, 1.18, windBand) * elevation;
            color = mix(color, vec3(0.78, 0.82, 0.53), sheen * 0.18);
            color += brush * (0.4 + elevation * 0.6);
            float fog = smoothstep(31.0, 78.0, vDepth);
            color = mix(color, vec3(0.78, 0.75, 0.58), fog * 0.76);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
  }), [reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, GROUND_Y, -10]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
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
    const z = 10 - progress * 47;
    const centerX = pianoClearingRiverCenterX(z);
    const width = pianoClearingRiverWidth(z);
    const y = GROUND_Y + pianoClearingTerrainHeight(centerX, z) + 0.42;
    positions.push(centerX - width, y, z, centerX + width, y, z);
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
      uniform float uTime;
      uniform float uMotion;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 transformed = position;
        float ripple = sin(uv.y * 64.0 + uTime * 1.45 * uMotion + uv.x * 4.0) * 0.028;
        ripple += sin(uv.y * 117.0 + uTime * 2.1 * uMotion) * 0.012;
        transformed.y += ripple;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uMotion;
      varying vec2 vUv;
      void main() {
        float time = uTime * uMotion;
        // Positive time moves wave fronts toward decreasing UV.y: distance to foreground.
        float downstream = vUv.y * 46.0 + time * 2.3;
        float broad = sin(downstream + sin(vUv.y * 8.0) * 1.25 + vUv.x * 1.8);
        float middle = sin(vUv.y * 93.0 + time * 3.5 + vUv.x * 8.0);
        float fine = sin(vUv.y * 181.0 + time * 5.1 - vUv.x * 11.0);
        float travellingPool = pow(max(0.0, sin(vUv.y * 18.0 + time * 1.75)), 4.0);
        float bank = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
        float bankFoam = pow(1.0 - abs(vUv.x * 2.0 - 1.0), 7.0);
        float depth = 1.0 - abs(vUv.x * 2.0 - 1.0);
        float plateA = smoothstep(0.14, 0.34, depth + broad * 0.05);
        float plateB = smoothstep(0.48, 0.74, depth + middle * 0.025);
        vec3 shallow = vec3(0.46, 0.66, 0.64);
        vec3 middleBlue = vec3(0.23, 0.49, 0.53);
        vec3 deep = vec3(0.08, 0.28, 0.36);
        vec3 sun = vec3(0.79, 0.78, 0.65);
        float light = max(0.0, broad) * 0.22 + max(0.0, middle) * 0.1;
        light += max(0.0, fine) * 0.045 + travellingPool * 0.18;
        vec3 color = mix(shallow, middleBlue, plateA);
        color = mix(color, deep, plateB);
        color = mix(color, sun, light * 0.58 + bankFoam * 0.045);
        float alpha = (0.9 + travellingPool * 0.08) * bank;
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

function DistantLandscape() {
  const trees = useMemo(() => {
    const random = seededRandom(1827);
    const accepted: {
      x: number;
      z: number;
      scale: number;
      rotation: number;
    }[] = [];
    let attempts = 0;

    while (
      accepted.length < PIANO_CLEARING_PERFORMANCE.horizonTrees
      && attempts < PIANO_CLEARING_PERFORMANCE.horizonTrees * 80
    ) {
      attempts += 1;
      const x = -25 + random() * 50;
      const z = -28 - random() * 12;
      if (!pianoClearingTreeAllowed(x, z)) continue;
      accepted.push({
        x,
        z,
        scale: 0.3 + random() * 0.54,
        rotation: random() * Math.PI,
      });
    }

    return accepted;
  }, []);
  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);
  const crownHighlights = useRef<THREE.InstancedMesh>(null);

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

      dummy.position.set(
        tree.x - tree.scale * 0.17,
        y + tree.scale * 1.45,
        tree.z + tree.scale * 0.04,
      );
      dummy.scale.set(tree.scale * 0.43, tree.scale * 0.54, tree.scale * 0.43);
      dummy.updateMatrix();
      crownHighlights.current?.setMatrixAt(index, dummy.matrix);
    });
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true;
    if (crowns.current) crowns.current.instanceMatrix.needsUpdate = true;
    if (crownHighlights.current) {
      crownHighlights.current.instanceMatrix.needsUpdate = true;
    }
  }, [trees]);

  return (
    <>
      <RidgeBand
        z={-66}
        baseY={-4.5}
        color="#a7ad93"
        opacity={0.72}
        heights={[3.3, 4.5, 4, 5.1, 4.15, 4.7, 3.6]}
      />
      <RidgeBand
        z={-55}
        baseY={-4.3}
        color="#899b78"
        opacity={0.78}
        heights={[2.4, 3.4, 2.8, 4, 3.15, 3.75, 2.55]}
      />
      <RidgeBand
        z={-45}
        baseY={-4.1}
        color="#718866"
        opacity={0.84}
        heights={[1.45, 2.4, 1.85, 2.9, 2.1, 2.5, 1.6]}
      />
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]}>
        <cylinderGeometry args={[0.5, 0.62, 1.6, 5]} />
        <meshToonMaterial color="#596346" />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshToonMaterial color="#526f50" />
      </instancedMesh>
      <instancedMesh ref={crownHighlights} args={[undefined, undefined, trees.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshToonMaterial color="#87975f" />
      </instancedMesh>
    </>
  );
}

function RidgeBand({
  z,
  baseY,
  color,
  opacity,
  heights,
}: {
  z: number;
  baseY: number;
  color: string;
  opacity: number;
  heights: number[];
}) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const indices: number[] = [];
    const span = 84;
    const subdivisions = 36;

    for (let index = 0; index <= subdivisions; index += 1) {
      const progress = index / subdivisions;
      const scaled = progress * (heights.length - 1);
      const left = Math.min(Math.floor(scaled), heights.length - 2);
      const blend = (1 - Math.cos((scaled - left) * Math.PI)) * 0.5;
      const height = THREE.MathUtils.lerp(heights[left], heights[left + 1], blend);
      const x = -span / 2 + progress * span;
      positions.push(x, baseY, 0, x, height, 0);
      if (index < subdivisions) {
        const offset = index * 2;
        indices.push(offset, offset + 2, offset + 1, offset + 1, offset + 2, offset + 3);
      }
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    buffer.setIndex(indices);
    return buffer;
  }, [baseY, heights]);

  return (
    <mesh geometry={geometry} position={[0, 0, z]}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function StoneViaduct() {
  const archSpacing = BRIDGE_LENGTH / PIANO_CLEARING_PERFORMANCE.bridgeArches;
  const leftEdge = -BRIDGE_LENGTH / 2;
  const stone = '#36434b';
  const sunStone = '#48535a';

  return (
    <group position={[BRIDGE_X, 0, BRIDGE_Z]}>
      <mesh position={[0, BRIDGE_DECK_Y, 0]} scale={[BRIDGE_LENGTH, 0.52, 1.15]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color={sunStone} fog={false} />
      </mesh>
      {Array.from({ length: 13 }, (_, index) => (
        <mesh
          key={`masonry-${index}`}
          position={[leftEdge + 1.45 + index * 2.88, BRIDGE_DECK_Y + 0.03, 0.584]}
          scale={[2.45, 0.055, 0.018]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#738087" transparent opacity={0.62} fog={false} />
        </mesh>
      ))}
      <mesh position={[0, BRIDGE_DECK_Y + 0.39, -0.49]} scale={[BRIDGE_LENGTH, 0.23, 0.14]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#626d72" fog={false} />
      </mesh>
      <mesh position={[0, BRIDGE_DECK_Y + 0.39, 0.49]} scale={[BRIDGE_LENGTH, 0.23, 0.14]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color="#313c44" fog={false} />
      </mesh>
      {Array.from({ length: PIANO_CLEARING_PERFORMANCE.bridgeArches + 1 }, (_, index) => {
        if (index === 0 || index === PIANO_CLEARING_PERFORMANCE.bridgeArches) return null;
        const x = leftEdge + index * archSpacing;
        const bankY = GROUND_Y + pianoClearingTerrainHeight(BRIDGE_X + x, BRIDGE_Z);
        const height = Math.max(1.2, BRIDGE_DECK_Y - bankY - 0.2);
        return (
          <mesh key={`pier-${index}`} position={[x, bankY + height / 2, 0]} scale={[0.62, height, 1.05]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color={index % 2 ? stone : '#3e4950'} fog={false} />
          </mesh>
        );
      })}
      {Array.from({ length: PIANO_CLEARING_PERFORMANCE.bridgeArches }, (_, index) => {
        const x = leftEdge + archSpacing * (index + 0.5);
        const radius = archSpacing * 0.43;
        return (
          <group key={`arch-${index}`} position={[x, BRIDGE_DECK_Y - radius - 0.23, 0]}>
            <mesh position={[0, 0, -0.53]}>
              <torusGeometry args={[radius, 0.27, 5, 22, Math.PI]} />
              <meshToonMaterial color="#566167" fog={false} />
            </mesh>
            <mesh position={[0, 0, 0.53]}>
              <torusGeometry args={[radius, 0.27, 5, 22, Math.PI]} />
              <meshToonMaterial color="#303b43" fog={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function PassingTrain({ reducedMotion }: { reducedMotion: boolean }) {
  const train = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!train.current) return;
    train.current.position.x = reducedMotion
      ? -5.4
      : -5.4 + Math.sin(clock.elapsedTime * 0.075) * 4.2;
  });

  return (
    <group
      ref={train}
      position={[0, BRIDGE_DECK_Y + 0.72, BRIDGE_Z]}
      rotation={[0, 0, 0]}
      scale={0.72}
    >
      <group position={[-2.45, 0, 0]}>
        <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 1.65, 10]} />
          <meshToonMaterial color="#29272e" />
        </mesh>
        <mesh position={[0.7, 0.18, 0]} scale={[0.78, 0.9, 0.8]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshToonMaterial color="#3c3133" />
        </mesh>
        <mesh position={[-0.45, 0.83, 0]}>
          <cylinderGeometry args={[0.13, 0.25, 0.58, 8]} />
          <meshToonMaterial color="#24232a" />
        </mesh>
      </group>
      {Array.from({ length: PIANO_CLEARING_PERFORMANCE.trainCars }, (_, index) => (
        <group key={index} position={[index * 1.7, 0.1, 0]}>
          <mesh scale={[1.45, 0.76, 0.86]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color={index % 2 ? '#594044' : '#65464a'} />
          </mesh>
          {[-0.42, 0, 0.42].map((x) => (
            <mesh key={x} position={[x, 0.08, 0.44]} scale={[0.2, 0.22, 0.02]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial color="#f1c878" toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
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
            vec3 horizon = vec3(0.94, 0.86, 0.70);
            vec3 upper = vec3(0.80, 0.80, 0.74);
            vec3 zenith = vec3(0.66, 0.72, 0.75);
            vec3 color = mix(horizon, zenith, height);
            color = mix(color, upper, smoothstep(0.14, 0.58, height) * 0.38);
            vec3 sunDirection = normalize(vec3(-0.04, 0.16, -0.99));
            float sunFacing = max(dot(vWorld, sunDirection), 0.0);
            float halo = pow(sunFacing, 11.0);
            float disk = smoothstep(0.997, 0.999, sunFacing);
            color += vec3(1.0, 0.77, 0.46) * halo * 0.34;
            color += vec3(1.0, 0.97, 0.82) * disk * 1.08;
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
    { position: [-19, 8.8, -31] as const, scale: 2.05 },
    { position: [-6.5, 10.1, -39] as const, scale: 1.5 },
    { position: [7, 9.5, -35] as const, scale: 1.85 },
    { position: [18.5, 7.8, -31] as const, scale: 1.35 },
    { position: [28, 10.5, -44] as const, scale: 1.65 },
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
            [-1.5, -0.05, 0, 1.35],
            [-0.65, 0.28, 0.02, 1.2],
            [0.18, 0.46, 0, 1.35],
            [1.05, 0.12, 0.04, 1.3],
            [1.7, -0.08, 0.08, 1.05],
            [-0.15, -0.23, 0.11, 1.55],
          ].map(([x, y, z, scale], index) => (
            <mesh key={index} position={[x, y, z]} scale={[scale * 1.35, scale * 0.58, scale * 0.66]}>
              <sphereGeometry args={[1, 10, 7]} />
              <meshBasicMaterial
                color={index === 5 ? '#a994b8' : index % 3 === 0 ? '#e6bfa4' : '#ffe8bd'}
                transparent
                opacity={index === 5 ? 0.3 : 0.5}
                depthWrite={false}
              />
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
  const { camera, pointer, size } = useThree();
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
    if (camera instanceof THREE.PerspectiveCamera) {
      const fittedFov = pianoClearingCameraFov(size.width / Math.max(size.height, 1));
      if (Math.abs(camera.fov - fittedFov) > 0.01) {
        camera.fov = fittedFov;
        camera.updateProjectionMatrix();
      }
    }
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
      <fogExp2 attach="fog" args={['#c7bea3', 0.017]} />
      <hemisphereLight args={['#fff0c8', '#475746', 2.18]} />
      <directionalLight position={[-9, 10, 4]} color="#ffd08a" intensity={2.65} />
      <DistantLandscape />
      <Ground reducedMotion={reducedMotion} />
      <Stream reducedMotion={reducedMotion} />
      <StoneViaduct />
      <PassingTrain reducedMotion={reducedMotion} />
      <GrassField reducedMotion={reducedMotion} />
      <ValleyDetails />
      <RavineAccents />
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
      data-river-flow="far-to-foreground"
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
          far: 145,
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
