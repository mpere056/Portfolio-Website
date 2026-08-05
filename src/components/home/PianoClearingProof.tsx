'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import {
  Component,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  PIANO_CLEARING_CAMERA,
  PIANO_CLEARING_PIANO,
  PIANO_CLEARING_PERFORMANCE,
  pianoClearingCameraFov,
  pianoClearingRiverCenterX,
  pianoClearingRiverWidth,
  pianoClearingTerrainHeight,
  pianoClearingTreeAllowed,
} from '@/lib/artDirection/pianoClearing';
import {
  MUSIC_ARCHIPELAGO_GRASS_PALETTE,
  MUSIC_LIQUID_LANDSCAPES,
  MUSIC_LIQUID_PROOF,
  MUSIC_WORLD_PROFILES,
  musicLiquidLandscapeIndex,
  musicLiquidInitialQuality,
  musicLiquidMotionScale,
  musicLiquidQualityWeight,
  musicLiquidTerritoryCoordinates,
  musicLiquidTerritoryMask,
  type MusicLiquidQuality,
  type MusicLiquidLandscapeId,
  type MusicWorldProfile,
} from '@/lib/artDirection/musicLiquidLandscape';
import {
  PRACTICE_DEFINITIONS,
  PRACTICE_IDS,
  type PracticeId,
} from '@/lib/practices';
import {
  createPracticeWorldState,
  practiceWorldDiagnosticsEnabled,
  practiceWorldRegistry,
  reducePracticeWorld,
  type PracticeWorldLoadStatus,
} from '@/lib/experience/practiceWorldLifecycle';
import styles from './PianoClearingProof.module.css';

const GROUND_Y = -1.45;
const PIANO_X = PIANO_CLEARING_PIANO.x;
const PIANO_Z = PIANO_CLEARING_PIANO.z;
const PIANO_POSITION = new THREE.Vector3(
  PIANO_X,
  GROUND_Y + pianoClearingTerrainHeight(PIANO_X, PIANO_Z) + 0.035,
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

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.sceneError} role="status">
          <strong>The landscape is regrouping.</strong>
          <span>{this.state.error.message}</span>
        </div>
      );
    }

    return this.props.children;
  }
}

const MUSIC_LANDSCAPE_MASK_GLSL = `
  float liquidBlob(vec2 point, vec2 center, vec2 scale, float softness) {
    float distanceFromCenter = length((point - center) / scale);
    return 1.0 - smoothstep(1.0 - softness, 1.0, distanceFromCenter);
  }
  float musicLandscapeMask(vec2 point, float mode) {
    float tidal = 1.0 - smoothstep(0.76, 1.0, length(point));
    float terraces = max(
      liquidBlob(point, vec2(-0.34, 0.06), vec2(0.5, 0.34), 0.24),
      max(
        liquidBlob(point, vec2(0.12, -0.08), vec2(0.52, 0.42), 0.24),
        liquidBlob(point, vec2(0.52, 0.12), vec2(0.31, 0.25), 0.24)
      )
    );
    float archipelago = max(
      liquidBlob(point, vec2(-0.5, 0.1), vec2(0.27, 0.24), 0.28),
      max(
        liquidBlob(point, vec2(-0.02, -0.22), vec2(0.32, 0.22), 0.28),
        max(
          liquidBlob(point, vec2(0.42, 0.18), vec2(0.25, 0.3), 0.28),
          liquidBlob(point, vec2(0.68, -0.2), vec2(0.16, 0.15), 0.3)
        )
      )
    );
    float deltaMain = 1.0 - smoothstep(
      0.075,
      0.2,
      abs(point.y - sin(point.x * 3.2 - 0.5) * 0.18)
    );
    float deltaUpper = 1.0 - smoothstep(
      0.045,
      0.14,
      abs(point.y - 0.24 - sin(point.x * 4.1 + 1.3) * 0.1)
    );
    float deltaLower = 1.0 - smoothstep(
      0.045,
      0.14,
      abs(point.y + 0.29 - sin(point.x * 3.6 - 0.7) * 0.09)
    );
    float delta = max(deltaMain, max(deltaUpper, deltaLower))
      * (1.0 - smoothstep(0.62, 0.98, abs(point.x)));
    float dunes = max(
      liquidBlob(point, vec2(-0.42, 0.06), vec2(0.42, 0.52), 0.3),
      max(
        liquidBlob(point, vec2(0.08, -0.12), vec2(0.48, 0.45), 0.3),
        liquidBlob(point, vec2(0.5, 0.16), vec2(0.36, 0.4), 0.3)
      )
    );
    if (mode > 4.5) return max(tidal, max(terraces, max(delta, dunes)));
    if (mode < 0.5) return tidal;
    if (mode < 1.5) return terraces;
    if (mode < 2.5) return archipelago;
    if (mode < 3.5) return delta;
    return dunes;
  }
`;

type MusicLiquidRuntime = {
  pointerLocal: THREE.Vector2;
  attention: number;
  pianoReply: number;
  riverReply: number;
  qualityWeight: number;
  motionScale: number;
};

function createMusicLiquidRuntime(): MusicLiquidRuntime {
  return {
    pointerLocal: new THREE.Vector2(99, 99),
    attention: 0,
    pianoReply: 0,
    riverReply: 0,
    qualityWeight: 1,
    motionScale: 1,
  };
}

function MusicLiquidInteractionController({
  runtime,
  reducedMotion,
}: {
  runtime: MusicLiquidRuntime;
  reducedMotion: boolean;
}) {
  const pointerPlane = useMemo(() => {
    const height = (
      GROUND_Y
      + pianoClearingTerrainHeight(
        MUSIC_LIQUID_PROOF.center[0],
        MUSIC_LIQUID_PROOF.center[1],
      )
      + 0.06
    );
    return new THREE.Plane(new THREE.Vector3(0, 1, 0), -height);
  }, []);
  const pointerPoint = useRef(new THREE.Vector3());

  useFrame(({ camera, pointer, raycaster }, delta) => {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.ray.intersectPlane(pointerPlane, pointerPoint.current);
    let target = 0;

    if (hit) {
      const local = musicLiquidTerritoryCoordinates(hit.x, hit.z);
      runtime.pointerLocal.set(local.x, local.y);
      target = reducedMotion ? 0 : musicLiquidTerritoryMask(hit.x, hit.z);
    } else {
      runtime.pointerLocal.set(99, 99);
    }

    runtime.attention = THREE.MathUtils.damp(
      runtime.attention,
      target,
      MUSIC_LIQUID_PROOF.attentionDamping,
      delta,
    );
    runtime.pianoReply = THREE.MathUtils.damp(
      runtime.pianoReply,
      reducedMotion ? 0.1 : 0.12 + runtime.attention * MUSIC_LIQUID_PROOF.pianoReflectionScale,
      2.1,
      delta,
    );
    runtime.riverReply = THREE.MathUtils.damp(
      runtime.riverReply,
      reducedMotion ? 0 : runtime.attention,
      MUSIC_LIQUID_PROOF.riverResponseDamping,
      delta,
    );
  });

  return null;
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function toUnorm16(value: number): number {
  return Math.round(THREE.MathUtils.clamp(value, 0, 1) * 65535);
}

function createGroundGeometry() {
  const geometry = new THREE.PlaneGeometry(92, 96, 92, 96);
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const worldZ = -positions.getY(index) - 10;
    positions.setZ(index, pianoClearingTerrainHeight(x, worldZ));
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
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

  const fieldBladeCount = PIANO_CLEARING_PERFORMANCE.grassInstances;
  const foregroundBladeCount = PIANO_CLEARING_PERFORMANCE.foregroundGrassInstances;
  const bladeCount = fieldBladeCount + foregroundBladeCount;
  const roots = new Float32Array(bladeCount * 3);
  const parameters = new Uint16Array(bladeCount * 4);
  const staticValues = new Uint16Array(bladeCount * 4);
  const random = seededRandom(801);
  const shadowDirection = new THREE.Vector2(1, 0.32).normalize();
  const shadowCross = new THREE.Vector2(-shadowDirection.y, shadowDirection.x);
  let accepted = 0;

  while (accepted < bladeCount) {
    const isForegroundBlade = accepted >= fieldBladeCount;
    const foregroundAngle = random() * Math.PI * 2;
    const foregroundRadius = Math.pow(random(), 0.72);
    const x = isForegroundBlade
      ? PIANO_X + Math.cos(foregroundAngle) * foregroundRadius * 13.5
      : (random() - 0.5) * 58;
    const z = isForegroundBlade
      ? PIANO_Z + Math.sin(foregroundAngle) * foregroundRadius * 9.5
      : 24 - random() * 61;
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
    const bladeWidth = 0.009 + random() * 0.007;
    const bladeHeight = (
      (0.26 + random() * 0.2)
      * THREE.MathUtils.lerp(1.03, 0.84, nearWeight)
    );
    const bladeAngle = random() * Math.PI;
    const randomValue = random();
    const clump = Math.sin(x * 0.73 + Math.sin(z * 0.41) * 1.7) * 0.5 + 0.5;
    const variation = THREE.MathUtils.lerp(
      Math.sin(x * 2.17 + z * 1.31) * 0.5 + 0.5,
      randomValue,
      0.58,
    );
    const fromPianoX = x - PIANO_X;
    const fromPianoZ = z - PIANO_Z;
    const shadowAlong = fromPianoX * shadowDirection.x + fromPianoZ * shadowDirection.y;
    const shadowAcross = Math.abs(
      fromPianoX * shadowCross.x + fromPianoZ * shadowCross.y,
    );
    const contactDistance = Math.hypot(fromPianoX / 2.05, fromPianoZ / 1.18);
    const contactShadow = 1 - THREE.MathUtils.smoothstep(contactDistance, 0.24, 1);
    const tailLength = THREE.MathUtils.smoothstep(shadowAlong, -0.18, 0.28)
      * (1 - THREE.MathUtils.smoothstep(shadowAlong, 3.4, 5.8));
    const tailWidth = 1 - THREE.MathUtils.smoothstep(
      shadowAcross,
      0.42,
      1.42 + shadowAlong * 0.13,
    );
    const pianoShadow = THREE.MathUtils.clamp(
      contactShadow * 0.72 + tailLength * tailWidth * 0.7,
      0,
      1,
    ) * (0.82 + variation * 0.18);

    // These values never change after authorship. Packing and precomputing them
    // removes repeated trigonometry and shadow-distance work from every vertex.
    parameters[parameterOffset] = toUnorm16((bladeWidth - 0.009) / 0.007);
    parameters[parameterOffset + 1] = toUnorm16((bladeHeight - 0.21) / 0.27);
    parameters[parameterOffset + 2] = toUnorm16((Math.cos(bladeAngle) + 1) * 0.5);
    parameters[parameterOffset + 3] = toUnorm16(Math.sin(bladeAngle));
    staticValues[parameterOffset] = toUnorm16(clump);
    staticValues[parameterOffset + 1] = toUnorm16(variation);
    staticValues[parameterOffset + 2] = toUnorm16(randomValue);
    staticValues[parameterOffset + 3] = toUnorm16(pianoShadow);
    accepted += 1;
  }

  geometry.setAttribute(
    'iRoot',
    new THREE.InstancedBufferAttribute(roots, 3).setUsage(THREE.StaticDrawUsage),
  );
  geometry.setAttribute(
    'iParams',
    new THREE.InstancedBufferAttribute(parameters, 4, true).setUsage(THREE.StaticDrawUsage),
  );
  geometry.setAttribute(
    'iStatic',
    new THREE.InstancedBufferAttribute(staticValues, 4, true).setUsage(THREE.StaticDrawUsage),
  );
  geometry.instanceCount = bladeCount;
  return geometry;
}

function GrassField({
  reducedMotion,
  musicLiquidProof,
  musicLandscapeIndex,
  profile,
  liquidRuntime,
}: {
  reducedMotion: boolean;
  musicLiquidProof: boolean;
  musicLandscapeIndex: number;
  profile: MusicWorldProfile;
  liquidRuntime: MusicLiquidRuntime;
}) {
  const geometry = useMemo(() => createGrassGeometry(), []);
  const cursorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -GROUND_Y));
  const cursorPoint = useRef(new THREE.Vector3());
  const smoothedCursorPoint = useRef(new THREE.Vector3());
  const previousCursorPoint = useRef(new THREE.Vector3());
  const previousPointer = useRef(new THREE.Vector2());
  const cursorDirection = useRef(new THREE.Vector2(1, 0));
  const cursorDirectionTarget = useRef(new THREE.Vector2(1, 0));
  const cursorImpulse = useRef(0);
  const cursorInfluence = useRef(0);
  const cursorReady = useRef(false);
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uWind: { value: reducedMotion ? 0 : 0.34 },
      uCursor: { value: new THREE.Vector2(1000, 1000) },
      uCursorDirection: { value: new THREE.Vector2(1, 0) },
      uCursorInfluence: { value: 0 },
      uFogColor: { value: new THREE.Color(profile.fog) },
      uLiquidWeight: { value: musicLiquidProof ? 1 : 0 },
      uLiquidMotion: { value: reducedMotion ? 0 : 1 },
      uLiquidPointer: { value: liquidRuntime.pointerLocal.clone() },
      uLiquidAttention: { value: 0 },
      uLandscapeMode: { value: musicLandscapeIndex },
      uGrassLow: { value: new THREE.Color(profile.grass[0]) },
      uGrassMid: { value: new THREE.Color(profile.grass[1]) },
      uGrassHigh: { value: new THREE.Color(profile.grass[2]) },
      uGrassTip: { value: new THREE.Color(profile.grass[3]) },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uWind;
      uniform vec2 uCursor;
      uniform vec2 uCursorDirection;
      uniform float uCursorInfluence;
      uniform float uLiquidWeight;
      uniform float uLiquidMotion;
      uniform vec2 uLiquidPointer;
      uniform float uLiquidAttention;
      uniform float uLandscapeMode;
      attribute vec3 iRoot;
      attribute vec4 iParams;
      attribute vec4 iStatic;
      varying vec2 vUv;
      varying float vFog;
      varying float vWarm;
      varying float vBend;
      varying float vVariation;
      varying float vPianoShadow;
      varying float vLiquid;
      varying float vFire;
      varying float vHarmonic;
      varying float vCoolCurrent;
      varying vec2 vWorldRoot;
      ${MUSIC_LANDSCAPE_MASK_GLSL}
      void main() {
        vUv = uv;
        vec3 blade = position;
        vec3 root = iRoot;
        float bladeWidth = mix(0.009, 0.016, iParams.x);
        float bladeHeight = mix(0.21, 0.48, iParams.y);
        float angleCos = iParams.z * 2.0 - 1.0;
        float angleSin = iParams.w;
        float clump = iStatic.x;
        float variation = iStatic.y;
        float randomValue = iStatic.z;
        vec2 territoryOffset = root.xz - vec2(${MUSIC_LIQUID_PROOF.center[0]}, ${MUSIC_LIQUID_PROOF.center[1]});
        float territoryCos = ${Math.cos(MUSIC_LIQUID_PROOF.rotation).toFixed(6)};
        float territorySin = ${Math.sin(MUSIC_LIQUID_PROOF.rotation).toFixed(6)};
        vec2 territoryLocal = vec2(
          (territoryOffset.x * territoryCos - territoryOffset.y * territorySin) / ${MUSIC_LIQUID_PROOF.axes[0]},
          (territoryOffset.x * territorySin + territoryOffset.y * territoryCos) / ${MUSIC_LIQUID_PROOF.axes[1]}
        );
        float liquidRiverCenter = 0.7 - clamp((root.z + 32.0) / 42.0, 0.0, 1.0) * 8.2;
        float elevatedMeadow = smoothstep(liquidRiverCenter + 4.8, liquidRiverCenter + 8.6, root.x);
        float tidalMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode));
        float combinedMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 5.0));
        float authoredTerritory = musicLandscapeMask(territoryLocal, uLandscapeMode)
          * elevatedMeadow;
        // Tidal Meadow is a terrain material, not a puddle: every authored hill can liquefy.
        float territory = mix(authoredTerritory, 1.0, max(tidalMode, combinedMode)) * uLiquidWeight;
        float liquidTime = uTime * ${MUSIC_LIQUID_PROOF.travelSpeed} * uLiquidMotion;
        vec2 pressureUv = territoryLocal;
        pressureUv.x -= liquidTime * 0.24;
        pressureUv.y += sin(territoryLocal.x * 5.1 + liquidTime * 0.42) * 0.17;
        pressureUv.x += sin(territoryLocal.y * 6.7 - liquidTime * 0.31) * 0.09;
        float pressureField = sin(pressureUv.x * 4.3 + sin(pressureUv.y * 5.7) * 1.15) * 0.5;
        pressureField += sin(pressureUv.y * 7.1 - pressureUv.x * 2.4 + liquidTime * 0.17) * 0.3;
        pressureField += sin((pressureUv.x + pressureUv.y) * 10.9 - liquidTime * 0.09) * 0.2;
        float pressureBody = smoothstep(0.08, 0.72, pressureField);
        float crossPressure = smoothstep(0.16, 0.76, -pressureField + sin(pressureUv.x * 3.2) * 0.22);
        float trailingMemory = smoothstep(0.48, 0.86, abs(pressureField));
        float localAttention = uLiquidAttention
          * (1.0 - smoothstep(0.05, ${MUSIC_LIQUID_PROOF.attentionRadius}, distance(territoryLocal, uLiquidPointer)));
        float harmonicMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 4.0));
        float fireMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 1.0));
        float compositionTime = liquidTime * ${MUSIC_LIQUID_PROOF.combinedMaterialSpeed};
        float compositionNoise = sin(root.x * 0.105 - root.z * 0.073 - compositionTime * 0.42);
        compositionNoise += sin(root.x * 0.041 + root.z * 0.122 + compositionTime * 0.28) * 0.62;
        float combinedLiquid = combinedMode * smoothstep(0.3, 1.05, compositionNoise);
        float fireTerritory = smoothstep(0.08, 0.74,
          sin(root.x * 0.083 + root.z * 0.061 - 0.8 - compositionTime * 0.22)
          + sin(root.z * 0.17 - root.x * 0.035 + compositionTime * 0.16) * 0.42
        );
        fireTerritory *= 1.0 - smoothstep(-4.0, 7.0, root.z);
        float combinedFire = combinedMode * fireTerritory * (1.0 - combinedLiquid * 0.82);
        float harmonicTerritory = 0.45 + 0.55 * smoothstep(-0.5, 0.85,
          sin(root.x * 0.12 - root.z * 0.09 + 1.7 + compositionTime * 0.18)
        );
        float combinedHarmonic = combinedMode * harmonicTerritory * (1.0 - combinedFire * 0.74);
        float coolCurrent = combinedMode * smoothstep(0.2, 0.92,
          sin(root.x * 0.16 + root.z * 0.11 - compositionTime * 0.34)
        ) * (1.0 - combinedFire);
        fireMode = max(fireMode, combinedFire);
        harmonicMode = max(harmonicMode, combinedHarmonic);
        float liquidState = territory * clamp(
          0.78 + pressureBody * 0.2 + crossPressure * 0.12
          + trailingMemory * 0.1 + localAttention * 0.16,
          0.0,
          1.0
        ) * max(tidalMode, combinedLiquid);
        float rightField = smoothstep(-0.5, 10.5, root.x);
        float nearField = smoothstep(-14.0, 7.0, root.z);
        vWarm = rightField * nearField;
        float phase = root.x * 0.41 + root.z * 0.29;
        float broadFront = sin(root.x * 0.22 + root.z * 0.47 - uTime * 0.72);
        float fineFront = sin(root.x * 0.58 - root.z * 0.16 - uTime * 1.08 + phase);
        float gust = smoothstep(0.28, 0.96, broadFront * 0.68 + fineFront * 0.32);
        float breeze = sin(uTime * 0.52 + phase) * 0.055;
        breeze += sin(uTime * 0.24 + phase * 1.7) * 0.028;
        breeze += gust * 0.115;
        blade.x *= bladeWidth;
        float flameDomain = sin(
          root.x * 1.73
          + sin(root.z * 2.37 + uTime * 1.31) * 1.9
          + randomValue * 17.0
        );
        flameDomain += sin(
          root.z * 3.11
          - root.x * 0.83
          - uTime * 2.07
          + variation * 23.0
        ) * 0.55;
        float flameLick = 0.5 + 0.5 * sin(
          uTime * (3.2 + randomValue * 2.8)
          + flameDomain * 2.6
          + clump * 11.0
        );
        blade.y *= bladeHeight
          * (0.84 + clump * 0.24 + variation * 0.08)
          * mix(1.0, 0.82 + flameLick * 0.94, fireMode)
          * mix(1.0, 0.045, liquidState)
          * mix(1.0, 0.008, tidalMode);
        vec3 oriented = vec3(
          blade.x * angleCos,
          blade.y,
          blade.x * angleSin
        );
        oriented.x += breeze * uv.y * uv.y * uWind * (1.0 - fireMode);
        float flameTip = pow(uv.y, 1.55);
        oriented.y += fireMode * flameTip * (0.08 + flameLick * 0.23);
        oriented.x += fireMode * (
          sin(uTime * (3.4 + variation) + flameDomain * 1.8 + uv.y * 6.0)
          + sin(uTime * 5.7 + randomValue * 31.0 + uv.y * 11.0) * 0.42
        ) * 0.105 * flameTip;
        oriented.z += fireMode * (
          cos(uTime * (2.7 + clump) + flameDomain * 2.1 + randomValue * 19.0)
          + sin(uTime * 4.3 + variation * 29.0 + uv.y * 8.0) * 0.36
        ) * 0.08 * flameTip;
        oriented.z += (
          cos(uTime * 0.39 + phase) * 0.028
          + gust * 0.052
          + (randomValue - 0.5) * 0.035
        ) * uv.y * uWind * (1.0 - fireMode);
        oriented.x += territoryLocal.x * liquidState * uv.y * 0.055;
        oriented.z += territoryLocal.y * liquidState * uv.y * 0.045;
        float cursorDistance = distance(root.xz, uCursor);
        float cursorFalloff = 1.0 - smoothstep(0.15, 3.2, cursorDistance);
        float cursorBend = cursorFalloff * uCursorInfluence;
        float cursorLift = sin(cursorDistance * 2.8 - uTime * 4.2) * cursorBend;
        oriented.x += (
          uCursorDirection.x * 0.24
          + cursorLift * 0.045
        ) * uv.y * uv.y * cursorBend;
        oriented.z += (
          uCursorDirection.y * 0.24
          + cursorLift * 0.045
        ) * uv.y * uv.y * cursorBend;
        vBend = clamp(
          abs(breeze) * 4.4 * uWind
          + gust * 0.38 * uWind
          + cursorBend * 0.72,
          0.0,
          1.0
        );
        vVariation = variation;
        vPianoShadow = iStatic.w;
        vLiquid = liquidState;
        vFire = fireMode;
        vHarmonic = harmonicMode;
        vCoolCurrent = coolCurrent;
        vWorldRoot = root.xz;
        vec4 worldPosition = modelMatrix * vec4(root + oriented, 1.0);
        vec4 viewPosition = viewMatrix * worldPosition;
        vFog = smoothstep(13.0, 46.0, -viewPosition.z);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uFogColor;
      uniform vec3 uGrassLow;
      uniform vec3 uGrassMid;
      uniform vec3 uGrassHigh;
      uniform vec3 uGrassTip;
      varying vec2 vUv;
      varying float vFog;
      varying float vWarm;
      varying float vBend;
      varying float vVariation;
      varying float vPianoShadow;
      varying float vLiquid;
      varying float vFire;
      varying float vHarmonic;
      varying float vCoolCurrent;
      varying vec2 vWorldRoot;
      uniform float uTime;
      uniform float uLiquidMotion;
      uniform float uLandscapeMode;
      void main() {
        vec3 baseColor = uGrassLow * 0.72;
        vec3 lowColor = uGrassLow;
        vec3 middleColor = uGrassMid;
        vec3 upperColor = uGrassHigh;
        vec3 tipColor = uGrassTip;
        vec3 dryColor = vec3(0.76, 0.4, 0.64);
        vec3 sheenColor = vec3(0.9, 0.72, 0.92);
        vec3 sunlitColor = vec3(0.77, 0.4, 0.65);
        vec3 color = mix(baseColor, lowColor, smoothstep(0.0, 0.26, vUv.y));
        color = mix(color, middleColor, smoothstep(0.2, 0.62, vUv.y));
        color = mix(color, upperColor, smoothstep(0.56, 0.84, vUv.y));
        color = mix(color, tipColor, smoothstep(0.8, 1.0, vUv.y));
        float dry = smoothstep(0.68, 0.98, vVariation) * smoothstep(0.44, 1.0, vUv.y);
        color = mix(color, dryColor, dry * (0.28 + vWarm * 0.3));
        color = mix(color, sunlitColor, vWarm * smoothstep(0.0, 0.72, vUv.y) * 0.9);
        color *= 0.88 + vVariation * 0.22;
        color = mix(color, sheenColor, vBend * smoothstep(0.18, 0.86, vUv.y) * 0.26);
        color = mix(color, vec3(0.045, 0.04, 0.14), vPianoShadow * 0.7);
        color = mix(color, vec3(0.4, 0.68, 0.86), vLiquid * 0.7);
        float fireMode = vFire;
        float flamePulse = 0.5 + 0.5 * sin(
          uTime * (2.1 + vVariation * 1.7) + vWorldRoot.x * 1.7 - vWorldRoot.y * 1.1
        );
        vec3 flameColor = mix(vec3(0.3, 0.015, 0.005), vec3(1.0, 0.16, 0.015), vUv.y);
        flameColor = mix(flameColor, vec3(1.0, 0.9, 0.32), smoothstep(0.64, 1.0, vUv.y));
        flameColor *= 0.78 + flamePulse * 0.52 * smoothstep(0.18, 1.0, vUv.y);
        float flameBreakup = 0.5 + 0.5 * sin(
          vWorldRoot.x * 13.7 + vWorldRoot.y * 17.9
          + vUv.y * (11.0 + vVariation * 8.0)
          - uTime * (4.4 + vVariation * 2.8)
        );
        flameBreakup *= 0.58 + 0.42 * (0.5 + 0.5 * sin(
          vWorldRoot.x * 29.1 - vWorldRoot.y * 23.7
          + vUv.y * 21.0 + uTime * 2.7
        ));
        float flameDissolve = smoothstep(0.56, 1.0, vUv.y)
          * (0.3 + flamePulse * 0.76 + vVariation * 0.24);
        if (fireMode > 0.5 && flameBreakup < flameDissolve * 0.86) discard;
        color = mix(color, flameColor, fireMode * 0.96);
        vec3 coolLow = vec3(${new THREE.Color(MUSIC_ARCHIPELAGO_GRASS_PALETTE[0]).toArray().map(value => value.toFixed(4)).join(', ')});
        vec3 coolHigh = vec3(${new THREE.Color(MUSIC_ARCHIPELAGO_GRASS_PALETTE[3]).toArray().map(value => value.toFixed(4)).join(', ')});
        color = mix(color, mix(coolLow, coolHigh, vUv.y), vCoolCurrent * 0.52);
        float harmonicMode = vHarmonic;
        vec2 fromInstrument = vWorldRoot - vec2(${PIANO_X.toFixed(1)}, ${PIANO_Z.toFixed(1)});
        float scoreRadius = length(fromInstrument);
        float scoreAngle = atan(fromInstrument.y, fromInstrument.x);
        float outwardTime = uTime * 2.05 * uLiquidMotion;
        float scoreA = pow(0.5 + 0.5 * cos(scoreRadius * 1.42 - outwardTime), 12.0);
        float scoreB = pow(0.5 + 0.5 * cos(scoreRadius * 0.78 - outwardTime * 0.72 + scoreAngle * 3.0), 16.0);
        float scoreC = pow(0.5 + 0.5 * cos(scoreRadius * 2.16 - outwardTime * 1.24 - scoreAngle * 2.0), 20.0);
        float scoreReach = 1.0 - smoothstep(3.0, 31.0, scoreRadius);
        float scoreLight = clamp(scoreA * 0.78 + scoreB * 0.56 + scoreC * 0.42, 0.0, 1.0) * scoreReach;
        vec3 scoreColor = mix(vec3(0.38, 0.28, 1.0), vec3(1.0, 0.46, 0.9), scoreB);
        scoreColor = mix(scoreColor, vec3(1.0, 0.82, 0.44), scoreC * 0.78);
        color = mix(color, scoreColor * 1.48, harmonicMode * scoreLight * (0.58 + vUv.y * 0.42));
        color *= mix(0.72, 1.0, pow(vUv.y, 0.55));
        color = mix(color, uFogColor, vFog * 0.8);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), [liquidRuntime, musicLandscapeIndex, musicLiquidProof, profile, reducedMotion]);

  useFrame(({ clock, camera, pointer, raycaster }, delta) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uWind.value = reducedMotion ? 0 : 0.34;
    material.uniforms.uLiquidWeight.value = musicLiquidProof ? 1 : 0;
    material.uniforms.uLiquidMotion.value = reducedMotion ? 0 : liquidRuntime.motionScale;
    material.uniforms.uLiquidPointer.value.copy(liquidRuntime.pointerLocal);
    material.uniforms.uLiquidAttention.value = (
      liquidRuntime.attention * liquidRuntime.qualityWeight
    );
    material.uniforms.uLandscapeMode.value = musicLandscapeIndex;
    if (reducedMotion) {
      cursorImpulse.current = 0;
      cursorInfluence.current = 0;
      material.uniforms.uCursorInfluence.value = 0;
      return;
    }

    const pointerIsIdle = cursorReady.current
      && previousPointer.current.distanceToSquared(pointer) < 0.00000001
      && cursorImpulse.current < 0.001
      && cursorInfluence.current < 0.001;
    if (pointerIsIdle) {
      material.uniforms.uCursorInfluence.value = 0;
      return;
    }

    raycaster.setFromCamera(pointer, camera);
    cursorPlane.current.constant = -GROUND_Y;
    const hit = raycaster.ray.intersectPlane(cursorPlane.current, cursorPoint.current);

    if (hit) {
      // Refine the horizontal-plane hit against the authored terrain height.
      for (let pass = 0; pass < 2; pass += 1) {
        cursorPlane.current.constant = -(
          GROUND_Y + pianoClearingTerrainHeight(hit.x, hit.z)
        );
        raycaster.ray.intersectPlane(cursorPlane.current, cursorPoint.current);
      }

      if (!cursorReady.current) {
        smoothedCursorPoint.current.copy(hit);
        previousCursorPoint.current.copy(hit);
        previousPointer.current.copy(pointer);
        cursorReady.current = true;
      }

      smoothedCursorPoint.current.x = THREE.MathUtils.damp(
        smoothedCursorPoint.current.x,
        hit.x,
        8.5,
        delta,
      );
      smoothedCursorPoint.current.y = THREE.MathUtils.damp(
        smoothedCursorPoint.current.y,
        hit.y,
        8.5,
        delta,
      );
      smoothedCursorPoint.current.z = THREE.MathUtils.damp(
        smoothedCursorPoint.current.z,
        hit.z,
        8.5,
        delta,
      );

      const pointerDelta = previousPointer.current.distanceTo(pointer);
      const worldDeltaX = hit.x - previousCursorPoint.current.x;
      const worldDeltaZ = hit.z - previousCursorPoint.current.z;
      const worldDeltaLength = Math.hypot(worldDeltaX, worldDeltaZ);

      if (worldDeltaLength > 0.001) {
        cursorDirectionTarget.current.set(
          worldDeltaX / worldDeltaLength,
          worldDeltaZ / worldDeltaLength,
        );
        cursorDirection.current.lerp(
          cursorDirectionTarget.current,
          0.18,
        ).normalize();
      }

      const movementEnergy = THREE.MathUtils.clamp(pointerDelta * 34, 0, 1);
      cursorImpulse.current = Math.max(cursorImpulse.current, movementEnergy);
      cursorImpulse.current = THREE.MathUtils.damp(
        cursorImpulse.current,
        0,
        2.7,
        delta,
      );
      cursorInfluence.current = THREE.MathUtils.damp(
        cursorInfluence.current,
        cursorImpulse.current,
        7.5,
        delta,
      );

      material.uniforms.uCursor.value.set(
        smoothedCursorPoint.current.x,
        smoothedCursorPoint.current.z,
      );
      material.uniforms.uCursorDirection.value.copy(cursorDirection.current);
      material.uniforms.uCursorInfluence.value = cursorInfluence.current;
      previousCursorPoint.current.copy(hit);
      previousPointer.current.copy(pointer);
    } else {
      cursorImpulse.current = THREE.MathUtils.damp(
        cursorImpulse.current,
        0,
        2.7,
        delta,
      );
      cursorInfluence.current = THREE.MathUtils.damp(
        cursorInfluence.current,
        cursorImpulse.current,
        7.5,
        delta,
      );
      material.uniforms.uCursorInfluence.value = cursorInfluence.current;
    }
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}

function Ground({
  reducedMotion,
  musicLiquidProof,
  musicLandscapeIndex,
  profile,
  liquidRuntime,
}: {
  reducedMotion: boolean;
  musicLiquidProof: boolean;
  musicLandscapeIndex: number;
  profile: MusicWorldProfile;
  liquidRuntime: MusicLiquidRuntime;
}) {
  const geometry = useMemo(() => createGroundGeometry(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uLiquidWeight: { value: musicLiquidProof ? 1 : 0 },
      uLiquidPointer: { value: liquidRuntime.pointerLocal.clone() },
      uLiquidAttention: { value: 0 },
      uLandscapeMode: { value: musicLandscapeIndex },
      uGroundRavine: { value: new THREE.Color(profile.ground[0]) },
      uGroundShade: { value: new THREE.Color(profile.ground[1]) },
      uGroundField: { value: new THREE.Color(profile.ground[2]) },
      uGroundSun: { value: new THREE.Color(profile.ground[3]) },
      uWorldFog: { value: new THREE.Color(profile.fog) },
    },
    vertexShader: `
          varying float vHeight;
          varying float vSlope;
          varying float vDepth;
          varying vec3 vWorld;
          float liquidHash(vec2 point) {
            return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
          }
          float liquidNoise(vec2 point) {
            vec2 cell = floor(point);
            vec2 local = fract(point);
            vec2 curve = local * local * (3.0 - 2.0 * local);
            return mix(
              mix(liquidHash(cell), liquidHash(cell + vec2(1.0, 0.0)), curve.x),
              mix(liquidHash(cell + vec2(0.0, 1.0)), liquidHash(cell + vec2(1.0)), curve.x),
              curve.y
            );
          }
          float liquidFbm(vec2 point) {
            float value = 0.0;
            float amplitude = 0.62;
            for (int octave = 0; octave < 2; octave++) {
              value += liquidNoise(point) * amplitude;
              point = mat2(1.6, 1.2, -1.2, 1.6) * point + vec2(1.7, 3.1);
              amplitude *= 0.44;
            }
            return value;
          }
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
          uniform float uLiquidWeight;
          uniform vec2 uLiquidPointer;
          uniform float uLiquidAttention;
          uniform float uLandscapeMode;
          uniform vec3 uGroundRavine;
          uniform vec3 uGroundShade;
          uniform vec3 uGroundField;
          uniform vec3 uGroundSun;
          uniform vec3 uWorldFog;
          varying float vHeight;
          varying float vSlope;
          varying float vDepth;
          varying vec3 vWorld;
          float liquidHash(vec2 point) {
            return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
          }
          float liquidNoise(vec2 point) {
            vec2 cell = floor(point);
            vec2 local = fract(point);
            vec2 curve = local * local * (3.0 - 2.0 * local);
            return mix(
              mix(liquidHash(cell), liquidHash(cell + vec2(1.0, 0.0)), curve.x),
              mix(liquidHash(cell + vec2(0.0, 1.0)), liquidHash(cell + vec2(1.0)), curve.x),
              curve.y
            );
          }
          float liquidFbm(vec2 point) {
            float value = 0.0;
            float amplitude = 0.62;
            for (int octave = 0; octave < 2; octave++) {
              value += liquidNoise(point) * amplitude;
              point = mat2(1.6, 1.2, -1.2, 1.6) * point + vec2(1.7, 3.1);
              amplitude *= 0.44;
            }
            return value;
          }
          ${MUSIC_LANDSCAPE_MASK_GLSL}
          void main() {
            vec3 ravine = uGroundRavine;
            vec3 shadedGrass = uGroundShade;
            vec3 field = uGroundField;
            vec3 sunField = uGroundSun;
            float elevation = smoothstep(-4.9, 1.25, vHeight);
            vec3 color = mix(ravine, shadedGrass, elevation);
            color = mix(color, field, smoothstep(-0.3, 2.2, vHeight));
            float riverCenter = 0.7 - clamp((vWorld.z + 32.0) / 42.0, 0.0, 1.0) * 8.2;
            float nearField = smoothstep(-9.0, 7.0, vWorld.z);
            float rightField = smoothstep(riverCenter + 2.8, riverCenter + 13.0, vWorld.x) * nearField;
            color = mix(color, sunField, rightField * 0.96);
            color *= 1.0 - vSlope * 0.58;
            float brush = sin(vWorld.x * 0.42 + sin(vWorld.z * 0.21) * 2.0) * 0.024;
            brush += sin(vWorld.z * 0.58 + vWorld.x * 0.17) * 0.018;
            float meadow = sin(vWorld.x * 1.73 + sin(vWorld.z * 0.37) * 2.1);
            meadow *= sin(vWorld.z * 2.16 - vWorld.x * 0.28);
            color += smoothstep(0.63, 0.96, meadow) * vec3(0.055, 0.025, 0.08) * elevation;
            float swardA = sin(vWorld.x * 6.9 + vWorld.z * 1.6);
            float swardB = sin(vWorld.x * 18.7 + vWorld.z * 3.1 + sin(vWorld.z * 0.9));
            float sward = swardA * 0.5 + swardB * 0.5;
            color = mix(color, color * 1.17 + vec3(0.075, 0.035, 0.095), smoothstep(0.2, 0.94, sward) * elevation * 0.28);
            float windBand = sin(vWorld.x * 0.22 + vWorld.z * 0.47 - uTime * 0.72 * uMotion);
            windBand += sin(vWorld.x * 0.58 - vWorld.z * 0.16 - uTime * 1.08 * uMotion) * 0.42;
            float sheen = smoothstep(0.68, 1.18, windBand) * elevation;
            color = mix(color, vec3(0.82, 0.61, 0.88), sheen * 0.2);
            color += brush * (0.4 + elevation * 0.6);
            vec2 fromPiano = vWorld.xz - vec2(${PIANO_X.toFixed(1)}, ${PIANO_Z.toFixed(1)});
            vec2 shadowDirection = normalize(vec2(1.0, 0.32));
            vec2 shadowCross = vec2(-shadowDirection.y, shadowDirection.x);
            float shadowAlong = dot(fromPiano, shadowDirection);
            float shadowAcross = abs(dot(fromPiano, shadowCross));
            float contactDistance = length(vec2(fromPiano.x / 2.05, fromPiano.y / 1.18));
            float contactShadow = 1.0 - smoothstep(0.22, 1.0, contactDistance);
            float tailLength = smoothstep(-0.18, 0.28, shadowAlong)
              * (1.0 - smoothstep(3.4, 5.8, shadowAlong));
            float tailWidth = 1.0 - smoothstep(0.42, 1.42 + shadowAlong * 0.13, shadowAcross);
            float breakup = 0.9 + sin(vWorld.x * 3.7 + vWorld.z * 2.4) * 0.1;
            float pianoShadow = clamp(
              contactShadow * 0.68 + tailLength * tailWidth * 0.64,
              0.0,
              1.0
            ) * breakup;
            color = mix(color, vec3(0.04, 0.035, 0.13), pianoShadow * 0.68);
            vec2 territoryOffset = vWorld.xz - vec2(${MUSIC_LIQUID_PROOF.center[0]}, ${MUSIC_LIQUID_PROOF.center[1]});
            float territoryCos = ${Math.cos(MUSIC_LIQUID_PROOF.rotation).toFixed(6)};
            float territorySin = ${Math.sin(MUSIC_LIQUID_PROOF.rotation).toFixed(6)};
            vec2 territoryLocal = vec2(
              (territoryOffset.x * territoryCos - territoryOffset.y * territorySin) / ${MUSIC_LIQUID_PROOF.axes[0]},
              (territoryOffset.x * territorySin + territoryOffset.y * territoryCos) / ${MUSIC_LIQUID_PROOF.axes[1]}
            );
            float elevatedMeadow = smoothstep(riverCenter + 4.8, riverCenter + 8.6, vWorld.x)
              * smoothstep(-1.5, 1.2, vHeight);
            float tidalMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode));
            float combinedMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 5.0));
            float authoredTerritory = musicLandscapeMask(territoryLocal, uLandscapeMode)
              * elevatedMeadow;
            float hillMaterial = smoothstep(-3.4, -0.15, vHeight);
            // Preserve the ravine while allowing every visible hill to become painted liquid.
            float territory = mix(authoredTerritory, hillMaterial, max(tidalMode, combinedMode)) * uLiquidWeight;
            float liquidTime = uTime * ${MUSIC_LIQUID_PROOF.travelSpeed} * uMotion;
            vec2 pressureUv = territoryLocal * vec2(2.15, 2.65);
            pressureUv += vec2(-liquidTime * 0.3, liquidTime * 0.075);
            float flowPrimary = liquidFbm(
              pressureUv * 0.72 + vec2(0.0, liquidTime * 0.14)
            );
            float flowSecondary = liquidFbm(
              pressureUv * 1.18 + vec2(4.6, -liquidTime * 0.11)
            );
            vec2 warp = vec2(flowPrimary, flowSecondary) - 0.5;
            vec2 organicUv = pressureUv + warp * 1.05;
            float pressureField = liquidFbm(organicUv);
            float detailField = mix(flowSecondary, pressureField, 0.38);
            float pressureBody = smoothstep(0.43, 0.77, pressureField * 0.76 + detailField * 0.24);
            float crossPressure = smoothstep(0.18, 0.72, 1.0 - abs(flowPrimary - flowSecondary));
            float localAttention = uLiquidAttention
              * (1.0 - smoothstep(0.05, ${MUSIC_LIQUID_PROOF.attentionRadius}, distance(territoryLocal, uLiquidPointer)));
            float harmonicMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 4.0));
            float fireMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 1.0));
            float compositionTime = liquidTime * ${MUSIC_LIQUID_PROOF.combinedMaterialSpeed};
            float compositionNoise = sin(vWorld.x * 0.105 - vWorld.z * 0.073 - compositionTime * 0.42);
            compositionNoise += sin(vWorld.x * 0.041 + vWorld.z * 0.122 + compositionTime * 0.28) * 0.62;
            float combinedLiquid = combinedMode * smoothstep(0.3, 1.05, compositionNoise);
            float fireTerritory = smoothstep(0.08, 0.74,
              sin(vWorld.x * 0.083 + vWorld.z * 0.061 - 0.8 - compositionTime * 0.22)
              + sin(vWorld.z * 0.17 - vWorld.x * 0.035 + compositionTime * 0.16) * 0.42
            );
            fireTerritory *= 1.0 - smoothstep(-4.0, 7.0, vWorld.z);
            float combinedFire = combinedMode * fireTerritory * (1.0 - combinedLiquid * 0.82);
            float harmonicTerritory = 0.45 + 0.55 * smoothstep(-0.5, 0.85,
              sin(vWorld.x * 0.12 - vWorld.z * 0.09 + 1.7 + compositionTime * 0.18)
            );
            float combinedHarmonic = combinedMode * harmonicTerritory * (1.0 - combinedFire * 0.74);
            float coolCurrent = combinedMode * smoothstep(0.2, 0.92,
              sin(vWorld.x * 0.16 + vWorld.z * 0.11 - compositionTime * 0.34)
            ) * (1.0 - combinedFire);
            fireMode = max(fireMode, combinedFire);
            harmonicMode = max(harmonicMode, combinedHarmonic);
            float liquidState = territory * clamp(
              0.78 + pressureBody * 0.2 + crossPressure * 0.12 + localAttention * 0.18,
              0.0,
              1.0
            ) * max(tidalMode, combinedLiquid);
            liquidState = mix(liquidState, hillMaterial, tidalMode);
            // Fire belongs to the animated blades and airborne ecology, not a red
            // light band travelling through the terrain beneath them.
            vec3 charredGround = color * vec3(0.34, 0.29, 0.42);
            color = mix(color, charredGround, fireMode * 0.48);
            vec3 coolGround = mix(
              vec3(${new THREE.Color(MUSIC_ARCHIPELAGO_GRASS_PALETTE[0]).toArray().map(value => value.toFixed(4)).join(', ')}),
              vec3(${new THREE.Color(MUSIC_ARCHIPELAGO_GRASS_PALETTE[2]).toArray().map(value => value.toFixed(4)).join(', ')}),
              smoothstep(-1.4, 1.2, vHeight)
            );
            color = mix(color, coolGround, coolCurrent * 0.46);
            vec3 liquidDeep = vec3(0.1, 0.16, 0.42);
            vec3 liquidNacre = vec3(0.42, 0.62, 0.82);
            vec3 liquidPearl = vec3(0.89, 0.66, 0.88);
            if (uLandscapeMode > 0.5 && uLandscapeMode < 1.5) {
              liquidDeep = vec3(0.22, 0.12, 0.35);
              liquidNacre = vec3(0.82, 0.58, 0.68);
              liquidPearl = vec3(1.0, 0.84, 0.68);
            } else if (uLandscapeMode > 2.5 && uLandscapeMode < 3.5) {
              liquidDeep = vec3(0.08, 0.2, 0.38);
              liquidNacre = vec3(0.16, 0.78, 0.9);
              liquidPearl = vec3(1.0, 0.66, 0.36);
            } else if (uLandscapeMode > 3.5) {
              liquidDeep = mix(vec3(0.08, 0.18, 0.4), vec3(0.08, 0.3, 0.34), combinedMode * 0.55);
              liquidNacre = mix(vec3(0.56, 0.34, 0.86), vec3(0.28, 0.76, 0.74), combinedMode * 0.44);
              liquidPearl = vec3(0.98, 0.62, 0.88);
            }
            float liquidVein = 1.0 - abs(
              mix(detailField, flowPrimary, 0.42) * 2.0 - 1.0
            );
            vec3 liquidColor = mix(
              liquidDeep,
              liquidNacre,
              pressureBody * 0.7 + crossPressure * 0.34
            );
            liquidColor = mix(
              liquidColor,
              liquidPearl,
              smoothstep(0.78, 0.98, liquidVein)
                * (pressureBody * 0.34 + crossPressure * 0.2)
                + localAttention * 0.26
            );
            vec2 terrainFlowUv = vWorld.xz * vec2(0.095, 0.13);
            terrainFlowUv += vec2(-liquidTime * 0.09, liquidTime * 0.035);
            vec2 terrainWarp = vec2(flowPrimary, flowSecondary) - 0.5;
            float terrainCurrent = liquidFbm(terrainFlowUv + terrainWarp * 1.2);
            float terrainCaustic = pow(1.0 - abs(terrainCurrent * 2.0 - 1.0), 5.5);
            float movingPearl = smoothstep(0.58, 0.94, terrainCurrent)
              * (0.42 + terrainCaustic * 0.58);
            liquidColor = mix(liquidColor, liquidPearl, movingPearl * tidalMode * 0.52);
            vec3 terrainLitLiquid = color * 0.34 + liquidColor * 0.76;
            terrainLitLiquid += liquidPearl * terrainCaustic * tidalMode * hillMaterial * 0.14;
            color = mix(color, terrainLitLiquid, liquidState * mix(0.72, 0.96, tidalMode));
            vec2 scoreFromPiano = vWorld.xz - vec2(${PIANO_X.toFixed(1)}, ${PIANO_Z.toFixed(1)});
            float scoreRadius = length(scoreFromPiano);
            float scoreRing = pow(0.5 + 0.5 * cos(
              scoreRadius * 1.12 - uTime * 1.7 * uMotion
            ), 15.0) * (1.0 - smoothstep(4.0, 34.0, scoreRadius));
            vec3 scoreColor = mix(vec3(0.38, 0.35, 1.0), vec3(1.0, 0.5, 0.83),
              0.5 + 0.5 * sin(scoreRadius * 0.24));
            color += scoreColor * scoreRing * harmonicMode * 0.42;
            float fog = smoothstep(31.0, 78.0, vDepth);
            color = mix(color, uWorldFog, fog * 0.78);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
  }), [liquidRuntime, musicLandscapeIndex, musicLiquidProof, profile, reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : liquidRuntime.motionScale;
    material.uniforms.uLiquidWeight.value = musicLiquidProof ? 1 : 0;
    material.uniforms.uLiquidPointer.value.copy(liquidRuntime.pointerLocal);
    material.uniforms.uLiquidAttention.value = (
      liquidRuntime.attention * liquidRuntime.qualityWeight
    );
    material.uniforms.uLandscapeMode.value = musicLandscapeIndex;
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

function createLiquidTerritoryGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const localCoordinates: number[] = [];
  const meadowMasks: number[] = [];
  const indices: number[] = [];
  const rings = 18;
  const segments = 72;
  const cosine = Math.cos(MUSIC_LIQUID_PROOF.rotation);
  const sine = Math.sin(MUSIC_LIQUID_PROOF.rotation);

  for (let ring = 0; ring <= rings; ring += 1) {
    const radius = ring / rings;
    const count = ring === 0 ? 1 : segments;
    for (let segment = 0; segment < count; segment += 1) {
      const angle = ring === 0 ? 0 : (segment / segments) * Math.PI * 2;
      const localX = Math.cos(angle) * radius;
      const localY = Math.sin(angle) * radius;
      const dx = localX * MUSIC_LIQUID_PROOF.axes[0] * cosine
        + localY * MUSIC_LIQUID_PROOF.axes[1] * sine;
      const dz = -localX * MUSIC_LIQUID_PROOF.axes[0] * sine
        + localY * MUSIC_LIQUID_PROOF.axes[1] * cosine;
      const x = MUSIC_LIQUID_PROOF.center[0] + dx;
      const z = MUSIC_LIQUID_PROOF.center[1] + dz;
      const terrainHeight = pianoClearingTerrainHeight(x, z);
      const riverEdge = pianoClearingRiverCenterX(z) + pianoClearingRiverWidth(z);
      const meadowDistance = x - riverEdge;
      const meadowMask = THREE.MathUtils.smoothstep(meadowDistance, 2.4, 7.2)
        * THREE.MathUtils.smoothstep(terrainHeight, -1.5, 1.2);
      const y = GROUND_Y + terrainHeight + 0.045;
      positions.push(x, y, z);
      localCoordinates.push(localX, localY);
      meadowMasks.push(meadowMask);
    }
  }

  const ringStart = (ring: number) => 1 + (ring - 1) * segments;
  for (let segment = 0; segment < segments; segment += 1) {
    indices.push(0, ringStart(1) + segment, ringStart(1) + ((segment + 1) % segments));
  }
  for (let ring = 1; ring < rings; ring += 1) {
    const inner = ringStart(ring);
    const outer = ringStart(ring + 1);
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      indices.push(
        inner + segment,
        outer + segment,
        outer + next,
        inner + segment,
        outer + next,
        inner + next,
      );
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aTerritory', new THREE.Float32BufferAttribute(localCoordinates, 2));
  geometry.setAttribute('aMeadowMask', new THREE.Float32BufferAttribute(meadowMasks, 1));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function LiquidTerritorySurface({
  reducedMotion,
  musicLandscapeIndex,
  liquidRuntime,
}: {
  reducedMotion: boolean;
  musicLandscapeIndex: number;
  liquidRuntime: MusicLiquidRuntime;
}) {
  const geometry = useMemo(() => createLiquidTerritoryGeometry(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uPointer: { value: liquidRuntime.pointerLocal.clone() },
      uAttention: { value: 0 },
      uLandscapeMode: { value: musicLandscapeIndex },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uMotion;
      uniform vec2 uPointer;
      uniform float uAttention;
      uniform float uLandscapeMode;
      attribute vec2 aTerritory;
      attribute float aMeadowMask;
      varying vec2 vTerritory;
      varying float vRipple;
      varying float vMeadowMask;
      varying float vLandscapeMask;
      ${MUSIC_LANDSCAPE_MASK_GLSL}
      void main() {
        vTerritory = aTerritory;
        vMeadowMask = aMeadowMask;
        vLandscapeMask = musicLandscapeMask(aTerritory, uLandscapeMode);
        vec3 transformed = position;
        float travel = aTerritory.x * 8.0 - uTime * ${MUSIC_LIQUID_PROOF.travelSpeed * 3.2} * uMotion;
        float ripple = sin(travel + sin(aTerritory.y * 8.0) * 0.8);
        ripple += sin(travel * 1.73 - aTerritory.y * 10.0) * 0.36;
        float localAttention = uAttention
          * (1.0 - smoothstep(0.05, ${MUSIC_LIQUID_PROOF.attentionRadius}, distance(aTerritory, uPointer)));
        float edge = 1.0 - smoothstep(0.7, 1.0, length(aTerritory));
        float slowSwell = sin(
          aTerritory.y * 4.2 + aTerritory.x * 2.0
          - uTime * ${MUSIC_LIQUID_PROOF.travelSpeed * 1.1} * uMotion
        );
        float terraceLift = floor((1.0 - length(aTerritory)) * 4.0) * 0.038;
        float islandLift = sin(aTerritory.x * 9.0) * sin(aTerritory.y * 8.0) * 0.055;
        float deltaLift = sin(aTerritory.x * 12.0 - uTime * 0.42 * uMotion) * 0.026;
        float duneLift = (
          sin(aTerritory.x * 5.2 - uTime * 0.2 * uMotion)
          + sin(aTerritory.y * 4.4 + uTime * 0.16 * uMotion)
        ) * 0.11;
        float authoredLift = 0.0;
        if (uLandscapeMode > 0.5 && uLandscapeMode < 1.5) authoredLift = terraceLift;
        else if (uLandscapeMode > 1.5 && uLandscapeMode < 2.5) authoredLift = islandLift;
        else if (uLandscapeMode > 2.5 && uLandscapeMode < 3.5) authoredLift = deltaLift;
        else if (uLandscapeMode > 3.5) authoredLift = duneLift;
        transformed.y += (
          ripple * (0.075 + localAttention * 0.1)
          + slowSwell * 0.045
          + authoredLift
        ) * edge * aMeadowMask * vLandscapeMask;
        vRipple = ripple;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uMotion;
      uniform vec2 uPointer;
      uniform float uAttention;
      uniform float uLandscapeMode;
      varying vec2 vTerritory;
      varying float vRipple;
      varying float vMeadowMask;
      varying float vLandscapeMask;
      float liquidHash(vec2 point) {
        return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float liquidNoise(vec2 point) {
        vec2 cell = floor(point);
        vec2 local = fract(point);
        vec2 curve = local * local * (3.0 - 2.0 * local);
        return mix(
          mix(liquidHash(cell), liquidHash(cell + vec2(1.0, 0.0)), curve.x),
          mix(liquidHash(cell + vec2(0.0, 1.0)), liquidHash(cell + vec2(1.0)), curve.x),
          curve.y
        );
      }
      float liquidFbm(vec2 point) {
        float value = 0.0;
        float amplitude = 0.56;
        for (int octave = 0; octave < 3; octave++) {
          value += liquidNoise(point) * amplitude;
          point = mat2(1.6, 1.2, -1.2, 1.6) * point + vec2(1.7, 3.1);
          amplitude *= 0.48;
        }
        return value;
      }
      void main() {
        float distanceFromCenter = length(vTerritory);
        float edge = vLandscapeMask * vMeadowMask;
        float liquidTime = uTime * ${MUSIC_LIQUID_PROOF.travelSpeed} * uMotion;
        vec2 pressureUv = vTerritory * vec2(2.15, 2.65);
        pressureUv += vec2(-liquidTime * 0.16, liquidTime * 0.035);
        vec2 warp = vec2(
          liquidFbm(pressureUv * 0.72 + vec2(0.0, liquidTime * 0.06)),
          liquidFbm(pressureUv * 0.72 + vec2(4.6, -liquidTime * 0.045))
        ) - 0.5;
        vec2 organicUv = pressureUv + warp * 1.05;
        float pressureField = liquidFbm(organicUv);
        float detailField = liquidFbm(organicUv * 1.9 + vec2(-liquidTime * 0.08, 7.3));
        float pressure = smoothstep(0.43, 0.77, pressureField * 0.76 + detailField * 0.24);
        float crossPressure = smoothstep(0.52, 0.82, liquidFbm(organicUv * 1.27 + vec2(8.1, -3.4)));
        float recovery = smoothstep(0.6, 0.86, detailField);
        float vein = 1.0 - abs(
          liquidFbm(organicUv * 2.35 + vec2(liquidTime * 0.06, -liquidTime * 0.1)) * 2.0 - 1.0
        );
        float caustic = smoothstep(0.78, 0.98, vein)
          * (pressure * 0.46 + crossPressure * 0.26);
        float localAttention = uAttention
          * (1.0 - smoothstep(0.05, ${MUSIC_LIQUID_PROOF.attentionRadius}, distance(vTerritory, uPointer)));
        float attentionVein = smoothstep(0.38, 0.98, sin(
          organicUv.y * 8.0 + organicUv.x * 5.0 - liquidTime * 0.38
        )) * localAttention;
        vec3 deep = vec3(0.08, 0.15, 0.38);
        vec3 nacre = vec3(0.32, 0.72, 0.84);
        vec3 pearl = vec3(0.94, 0.68, 0.9);
        if (uLandscapeMode > 0.5 && uLandscapeMode < 1.5) {
          deep = vec3(0.24, 0.1, 0.34);
          nacre = vec3(0.84, 0.48, 0.64);
          pearl = vec3(1.0, 0.86, 0.68);
        } else if (uLandscapeMode > 1.5 && uLandscapeMode < 2.5) {
          deep = vec3(0.04, 0.2, 0.31);
          nacre = vec3(0.22, 0.78, 0.72);
          pearl = vec3(0.76, 0.78, 1.0);
        } else if (uLandscapeMode > 2.5 && uLandscapeMode < 3.5) {
          deep = vec3(0.04, 0.18, 0.36);
          nacre = vec3(0.12, 0.82, 0.92);
          pearl = vec3(1.0, 0.62, 0.3);
        } else if (uLandscapeMode > 3.5) {
          deep = vec3(0.19, 0.06, 0.42);
          nacre = vec3(0.57, 0.32, 0.9);
          pearl = vec3(1.0, 0.6, 0.87);
        }
        vec3 color = mix(deep, nacre, pressure * 0.72 + crossPressure * 0.38);
        color = mix(
          color,
          pearl,
          caustic * 0.7 + max(vRipple, 0.0) * 0.08 + attentionVein * 0.46
        );
        float boundary = smoothstep(0.08, 0.3, edge)
          * (1.0 - smoothstep(0.3, 0.58, edge));
        color = mix(color, pearl, boundary * 0.3);
        float alpha = edge * (
          0.42 + pressure * 0.4 + crossPressure * 0.22
          + recovery * 0.12 + localAttention * 0.2
        );
        gl_FragColor = vec4(color, alpha);
      }
    `,
  }), [liquidRuntime, musicLandscapeIndex, reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : liquidRuntime.motionScale;
    material.uniforms.uPointer.value.copy(liquidRuntime.pointerLocal);
    material.uniforms.uAttention.value = (
      liquidRuntime.attention * liquidRuntime.qualityWeight
    );
    material.uniforms.uLandscapeMode.value = musicLandscapeIndex;
  });

  return <mesh geometry={geometry} material={material} renderOrder={2} />;
}

function landscapePoint(x: number, z: number, lift = 0.18): [number, number, number] {
  return [x, GROUND_Y + pianoClearingTerrainHeight(x, z) + lift, z];
}

function MusicWorldAirborneMatter({
  landscape,
  reducedMotion,
}: {
  landscape: MusicLiquidLandscapeId;
  reducedMotion: boolean;
}) {
  const combined = landscape === 'combined-world';
  const visible = combined || landscape === 'nacre-terraces' || landscape === 'glass-delta';
  const fire = landscape === 'nacre-terraces';
  const count = fire ? 160 : combined ? 168 : 200;
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let index = 0; index < count; index += 1) {
      const seed = (index * 0.61803398875) % 1;
      const crossSeed = (index * 0.41421356237 + 0.17) % 1;
      const depthSeed = (index * 0.73205080756 + 0.31) % 1;
      const x = -7 + seed * 39;
      const z = -8 + depthSeed * 28;
      positions.set([x, GROUND_Y + pianoClearingTerrainHeight(x, z), z], index * 3);
      seeds.set([seed, crossSeed, depthSeed, (index * 0.27182818284) % 1], index * 4);
    }
    result.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    result.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
    return result;
  }, [count]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uFire: { value: fire ? 1 : 0 },
      uCombined: { value: combined ? 1 : 0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uMotion;
      uniform float uFire;
      uniform float uCombined;
      attribute vec4 aSeed;
      varying float vLife;
      varying float vFire;
      varying float vTurn;
      void main() {
        vec3 transformed = position;
        float time = uTime * uMotion * ${MUSIC_LIQUID_PROOF.airborneSpeed};
        float particleFire = max(uFire, uCombined * step(0.62, aSeed.x));
        if (particleFire > 0.5) {
          float rise = fract(aSeed.w + time * mix(0.052, 0.105, aSeed.y));
          transformed.y += 0.2 + rise * mix(2.0, 7.0, aSeed.z);
          transformed.x += sin(time * 1.2 + aSeed.x * 31.0 + rise * 6.0) * (0.16 + rise * 0.55);
          transformed.z += cos(time * 0.8 + aSeed.y * 27.0) * 0.2;
          vLife = sin(rise * 3.14159265);
        } else {
          float drift = fract(aSeed.w + time * mix(0.035, 0.068, aSeed.y));
          transformed.x += drift * 13.0 - 6.5;
          transformed.y += 1.2 + sin(time * 0.34 + aSeed.x * 18.0) * 1.35 + aSeed.y * 5.0;
          transformed.z += sin(time * 0.21 + aSeed.z * 22.0 + drift * 4.0) * 2.1;
          vLife = smoothstep(0.0, 0.12, drift) * (1.0 - smoothstep(0.82, 1.0, drift));
        }
        vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        float projectedSize = mix(1.4, 4.2, aSeed.y) * (28.0 / max(4.0, -viewPosition.z));
        gl_PointSize = min(mix(14.0, 10.0, particleFire), projectedSize);
        vFire = particleFire;
        vTurn = fract(aSeed.x + time * mix(0.18, 0.46, aSeed.z));
      }
    `,
    fragmentShader: `
      varying float vLife;
      varying float vFire;
      varying float vTurn;
      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float angle = vTurn * 6.2831853;
        mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        vec2 turned = rotation * point;
        float petal = 1.0 - smoothstep(0.16, 0.5, length(turned * vec2(0.72, 1.75)));
        float ember = 1.0 - smoothstep(0.05, 0.48, length(point));
        float shape = mix(petal, ember, vFire);
        vec3 petalColor = mix(vec3(1.0, 0.55, 0.72), vec3(1.0, 0.9, 0.96), vTurn);
        vec3 emberColor = mix(vec3(1.0, 0.08, 0.0), vec3(1.0, 0.82, 0.2), vTurn);
        gl_FragColor = vec4(mix(petalColor, emberColor, vFire), shape * vLife * 0.76);
      }
    `,
  }), [combined, fire, reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    material.uniforms.uFire.value = fire ? 1 : 0;
    material.uniforms.uCombined.value = combined ? 1 : 0;
  });

  if (!visible) return null;
  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={6}
      userData={{
        worldEcology: combined
          ? 'combined-petals-and-embers'
          : fire ? 'fire-embers' : 'spring-cherry-petals',
      }}
    />
  );
}

function DistantFireSmoke({
  visible,
  reducedMotion,
  combined = false,
}: {
  visible: boolean;
  reducedMotion: boolean;
  combined?: boolean;
}) {
  const count = 72;
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    const sources = [
      [-18, -29],
      [-3, -34],
      [14, -31],
      [27, -38],
    ] as const;
    for (let index = 0; index < count; index += 1) {
      const source = sources[index % sources.length];
      const seed = (index * 0.61803398875) % 1;
      const crossSeed = (index * 0.41421356237 + 0.17) % 1;
      const depthSeed = (index * 0.73205080756 + 0.31) % 1;
      const sourceY = GROUND_Y + pianoClearingTerrainHeight(source[0], source[1]);
      positions.set([
        source[0] + (crossSeed - 0.5) * 4.2,
        sourceY + 1.8 + depthSeed * 2.4,
        source[1] + (seed - 0.5) * 3.2,
      ], index * 3);
      seeds.set([seed, crossSeed, depthSeed, (index * 0.27182818284) % 1], index * 4);
    }
    result.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    result.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
    return result;
  }, []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uCombined: { value: combined ? 1 : 0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uMotion;
      uniform float uCombined;
      attribute vec4 aSeed;
      varying float vLife;
      varying float vShade;
      void main() {
        float time = uTime * uMotion;
        float rise = fract(aSeed.w + time * mix(0.012, 0.025, aSeed.y));
        float ecologyScale = mix(1.0, 0.55, uCombined);
        vec3 transformed = position;
        transformed.y += rise * mix(14.0, 25.0, aSeed.z) * ecologyScale;
        transformed.x += sin(time * 0.17 + rise * 5.4 + aSeed.x * 19.0) * (0.45 + rise * 4.6) * mix(1.0, 0.32, uCombined);
        transformed.z += cos(time * 0.11 + rise * 3.2 + aSeed.y * 17.0) * (0.2 + rise * 1.5);
        vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        float pointScale = mix(1.0, 0.46, uCombined);
        gl_PointSize = min(58.0, mix(24.0, 48.0, aSeed.x) * pointScale * (42.0 / max(8.0, -viewPosition.z)));
        vLife = sin(rise * 3.14159265) * (1.0 - smoothstep(0.68, 1.0, rise));
        vShade = aSeed.z;
      }
    `,
    fragmentShader: `
      varying float vLife;
      varying float vShade;
      uniform float uCombined;
      void main() {
        vec2 point = gl_PointCoord - 0.5;
        float radial = length(point * vec2(0.82, 1.0));
        float body = 1.0 - smoothstep(0.12, 0.5, radial);
        float softNoise = 0.78 + sin(point.x * 18.0 + point.y * 13.0 + vShade * 21.0) * 0.12;
        vec3 smoke = mix(vec3(0.055, 0.035, 0.06), vec3(0.2, 0.09, 0.08), vShade);
        float ecologyOpacity = mix(0.52, 0.13, uCombined);
        gl_FragColor = vec4(smoke, body * softNoise * vLife * ecologyOpacity);
      }
    `,
  }), [combined, reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    material.uniforms.uCombined.value = combined ? 1 : 0;
  });

  if (!visible) return null;
  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={2}
      userData={{ worldEcology: 'distant-wildfire-smoke' }}
    />
  );
}

function MusicLandscapeAccents({
  landscape,
  reducedMotion,
}: {
  landscape: MusicLiquidLandscapeId;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;
    const time = clock.elapsedTime;
    group.current.position.y = Math.sin(time * 0.42) * 0.035;
    group.current.rotation.y = Math.sin(time * 0.17) * 0.012;
  });

  if (landscape === 'nacre-terraces') {
    const terraces = [
      { position: landscapePoint(7.8, 6.2, 0.16), scale: [3.8, 0.08, 2.3] as const },
      { position: landscapePoint(13.4, 5.2, 0.26), scale: [4.6, 0.1, 2.7] as const },
      { position: landscapePoint(19.1, 7.3, 0.38), scale: [3.2, 0.12, 2.1] as const },
    ];
    return (
      <group ref={group} userData={{ musicLandscapeAccent: 'nacre-terraces' }}>
        {terraces.map((terrace, index) => (
          <mesh key={index} position={terrace.position} scale={terrace.scale} renderOrder={3}>
            <cylinderGeometry args={[1, 1.08, 1, 48, 1]} />
            <meshBasicMaterial
              color={index === 1 ? '#ff3918' : '#ffb02e'}
              transparent
              opacity={0.24}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    );
  }

  if (landscape === 'combined-world') {
    return (
      <group
        ref={group}
        userData={{ musicLandscapeAccent: 'combined-material-ecology' }}
      />
    );
  }

  if (landscape === 'glass-delta') {
    return (
      <group
        ref={group}
        userData={{ musicLandscapeAccent: 'spring-petal-study' }}
      />
    );
  }

  if (landscape === 'harmonic-dunes') {
    const dunes = [
      [6.8, 5.2, 2.8, 0.5],
      [11.6, 7.8, 3.7, 0.68],
      [16.2, 4.8, 3.2, 0.82],
      [20.8, 8.2, 2.8, 0.6],
    ] as const;
    return (
      <group ref={group} userData={{ musicLandscapeAccent: 'harmonic-dunes' }}>
        {dunes.map(([x, z, width, height], index) => (
          <mesh
            key={index}
            position={landscapePoint(x, z, height * 0.48)}
            scale={[width, height, width * 0.72]}
            renderOrder={3}
          >
            <sphereGeometry args={[1, 28, 14]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? '#8d63e8' : '#f28fcb'}
              transparent
              opacity={0.19}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group ref={group} userData={{ musicLandscapeAccent: 'tidal-meadow' }}>
      {[0.74, 1.06, 1.38].map((radius, index) => (
        <mesh
          key={radius}
          position={landscapePoint(14.8, 6.1, 0.2 + index * 0.02)}
          rotation={[Math.PI / 2, 0, -0.18]}
          scale={[7.4, 3.5, 1]}
          renderOrder={3}
        >
          <torusGeometry args={[radius, 0.012, 5, 48]} />
          <meshBasicMaterial color="#83e9ef" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function musicWorldTube(
  points: [number, number, number][],
  radius: number,
  closed = false,
) {
  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)), closed),
    72,
    radius,
    6,
    closed,
  );
}

type WorldInstanceTransform = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
};

function WorldInstances({
  items,
  children,
}: {
  items: WorldInstanceTransform[];
  children: ReactNode;
}) {
  const instances = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    items.forEach((item, index) => {
      dummy.position.set(...item.position);
      dummy.rotation.set(...(item.rotation ?? [0, 0, 0]));
      dummy.scale.set(...item.scale);
      dummy.updateMatrix();
      instances.current?.setMatrixAt(index, dummy.matrix);
    });
    if (instances.current) instances.current.instanceMatrix.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh
      ref={instances}
      args={[undefined, undefined, items.length]}
      frustumCulled={false}
    >
      {children}
    </instancedMesh>
  );
}

function WorldScaleMusicForms({
  landscape,
  profile,
  reducedMotion,
}: {
  landscape: MusicLiquidLandscapeId;
  profile: MusicWorldProfile;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const skyWaves = useMemo(() => [
    musicWorldTube([[-38, 14, -47], [-18, 18, -52], [2, 13, -48], [22, 19, -55], [42, 15, -50]], 0.22),
    musicWorldTube([[-42, 10, -52], [-20, 13, -48], [0, 9, -54], [21, 14, -49], [45, 11, -55]], 0.12),
  ], []);

  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;
    const time = clock.elapsedTime;
    group.current.position.y = Math.sin(time * 0.16) * 0.11;
    group.current.rotation.y = Math.sin(time * 0.075) * 0.012;
  });

  if (landscape === 'combined-world') {
    return (
      <group
        ref={group}
        userData={{ musicWorldForm: 'combined-living-score' }}
      />
    );
  }

  if (landscape === 'tidal-meadow') {
    return (
      <group ref={group} userData={{ musicWorldForm: 'terrain-wide-tidal-material' }} />
    );
  }

  if (landscape === 'nacre-terraces') {
    const shelves = [
      [-22, 0.2, -35, 17, 1.1, 8], [-3, 2.2, -42, 18, 1.4, 10], [20, 5.4, -45, 15, 1.2, 9],
      [-19, 7.7, -55, 13, 0.9, 8], [8, 10.4, -58, 16, 1.1, 9], [31, 13.2, -62, 12, 0.8, 7],
      [13, -0.2, -12, 11, 0.82, 7],
    ] as const;
    const shelfTransforms = shelves.map(([x, y, z, width, height, depth], index) => ({
      position: [x, y, z] as [number, number, number],
      rotation: [0.03, index * 0.17, index % 2 ? -0.05 : 0.04] as [number, number, number],
      scale: [width, height, depth] as [number, number, number],
      palette: index % 2,
    }));
    const rootTransforms = shelves.map(([x, y, z, width, height, depth], index) => ({
      position: [x, y - height * 1.4, z] as [number, number, number],
      rotation: [0.03, index * 0.17, index % 2 ? -0.05 : 0.04] as [number, number, number],
      scale: [width * 0.82, height * 3.2, depth * 0.76] as [number, number, number],
      palette: index % 2,
    }));
    return (
      <group ref={group} userData={{ musicWorldForm: 'monumental-nacre-terraces' }}>
        {[0, 1].map(palette => (
          <WorldInstances key={palette} items={shelfTransforms.filter(item => item.palette === palette)}>
              <cylinderGeometry args={[1, 1.12, 1, 32, 1]} />
              <meshStandardMaterial
                color={palette ? '#ffb598' : '#e8a5c4'}
                emissive={palette ? '#9d3f5c' : '#704074'}
                emissiveIntensity={0.28}
                roughness={0.28}
                metalness={0.16}
                transparent
                opacity={0.88}
              />
          </WorldInstances>
        ))}
        {[0, 1].map(palette => (
          <WorldInstances key={`root-${palette}`} items={rootTransforms.filter(item => item.palette === palette)}>
              <coneGeometry args={[1, 1.8, 32, 1, true]} />
              <meshBasicMaterial color="#7f3e68" transparent opacity={0.2} depthWrite={false} />
          </WorldInstances>
        ))}
      </group>
    );
  }

  if (landscape === 'glass-delta') {
    return (
      <group ref={group} userData={{ musicWorldForm: 'spring-petal-field' }} />
    );
  }

  const dunes = [
    [-26, 0.3, -23, 15, 3.4, 8], [-3, 1.8, -31, 20, 4.4, 10], [23, 3.4, -36, 17, 5.2, 9],
    [-22, 7.8, -53, 18, 4, 9], [8, 10.2, -58, 22, 5.4, 10], [34, 8.6, -55, 15, 3.6, 8],
  ] as const;
  const duneTransforms = dunes.map(([x, y, z, width, height, depth], index) => ({
    position: [x, y, z] as [number, number, number],
    rotation: [0, index * 0.11, index % 2 ? 0.12 : -0.08] as [number, number, number],
    scale: [width, height, depth] as [number, number, number],
    palette: index % 2,
  }));
  return (
    <group ref={group} userData={{ musicWorldForm: 'harmonic-wave-cathedral' }}>
      {[0, 1].map(palette => (
        <WorldInstances key={palette} items={duneTransforms.filter(item => item.palette === palette)}>
          <sphereGeometry args={[1, 24, 10]} />
          <meshStandardMaterial
            color={palette ? '#ad45a7' : '#6339a2'}
            emissive={palette ? '#7f1f79' : '#392276'}
            emissiveIntensity={0.38}
            roughness={0.36}
            transparent
            opacity={0.78}
          />
        </WorldInstances>
      ))}
      {skyWaves.map((geometry, index) => (
        <mesh key={`sky-wave-${index}`} geometry={geometry}>
          <meshBasicMaterial
            color={index ? '#f98bc8' : '#9e74ff'}
            transparent
            opacity={0.42}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function pianoPortalOutlinePoint(around: number) {
  const front = Math.max(0, Math.sin(around));
  const tail = Math.max(0, -Math.sin(around));
  const outlineRadiusX = 1.48 + front * 0.08 - tail * 0.3;
  const outlineRadiusZ = front * 0.62 + tail * 1.08;
  const localX = Math.cos(around) * outlineRadiusX + tail * 0.14;
  const localZ = Math.sin(around) * outlineRadiusZ + front * 0.04;
  const rotation = -0.42;

  return new THREE.Vector2(
    localX * Math.cos(rotation) - localZ * Math.sin(rotation),
    localX * Math.sin(rotation) + localZ * Math.cos(rotation),
  );
}

function createPianoPortalOutlineGeometry() {
  const positions: number[] = [];
  const segments = 64;
  for (let segment = 0; segment < segments; segment += 1) {
    const around = (segment / segments) * Math.PI * 2;
    const point = pianoPortalOutlinePoint(around);
    positions.push(
      PIANO_POSITION.x + point.x,
      PIANO_POSITION.y + 0.56,
      PIANO_POSITION.z + point.y,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function createRefractiveScoreGeometry() {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const origin = new THREE.Vector3(
    PIANO_POSITION.x,
    PIANO_POSITION.y + 0.48,
    PIANO_POSITION.z,
  );
  const canopyCenter = new THREE.Vector3(origin.x - 1.2, origin.y + 12.5, origin.z - 14.5);

  const trunkRings = 34;
  const trunkSides = 32;
  for (let ring = 0; ring <= trunkRings; ring += 1) {
    const progress = ring / trunkRings;
    const pianoOutline = 1 - THREE.MathUtils.smoothstep(progress, 0, 0.04);
    const canopyTravel = THREE.MathUtils.smoothstep(progress, 0.2, 1);
    const bloom = THREE.MathUtils.smoothstep(progress, 0.42, 1);
    const radiusX = 0.24
      + progress * 0.3
      + Math.pow(bloom, 1.45) * 8.8;
    const radiusZ = 0.17
      + progress * 0.18
      + Math.pow(bloom, 1.55) * 3.55;
    const centerX = THREE.MathUtils.lerp(origin.x, canopyCenter.x, canopyTravel)
      + Math.sin(progress * 8.3) * (0.08 + progress * 0.42);
    const centerZ = THREE.MathUtils.lerp(origin.z, canopyCenter.z, Math.pow(canopyTravel, 1.18))
      + Math.sin(progress * 5.2 + 0.7) * canopyTravel * 0.38;
    for (let side = 0; side <= trunkSides; side += 1) {
      const around = (side / trunkSides) * Math.PI * 2;
      const twist = around + progress * 6.4;
      const lobe = 1 + Math.sin(around * 3 - progress * 11) * (0.06 + bloom * 0.12);
      const outline = pianoPortalOutlinePoint(around);
      const neckX = Math.cos(twist) * radiusX * lobe;
      const neckZ = Math.sin(twist) * radiusZ * lobe;
      positions.push(
        centerX + THREE.MathUtils.lerp(neckX, outline.x, pianoOutline),
        origin.y + progress * 12.5 + Math.sin(around * 2 + progress * 9) * bloom * 0.28,
        centerZ + THREE.MathUtils.lerp(neckZ, outline.y, pianoOutline),
      );
      uvs.push(side / trunkSides, progress);
    }
  }
  for (let ring = 0; ring < trunkRings; ring += 1) {
    for (let side = 0; side < trunkSides; side += 1) {
      const row = trunkSides + 1;
      const a = ring * row + side;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const canopyOffset = positions.length / 3;
  const canopyRings = 14;
  const canopySides = 56;
  for (let ring = 0; ring <= canopyRings; ring += 1) {
    const progress = ring / canopyRings;
    const radiusX = progress * 18.5;
    const radiusZ = progress * 8.5;
    for (let side = 0; side <= canopySides; side += 1) {
      const around = (side / canopySides) * Math.PI * 2;
      const ripple = Math.sin(around * 3 + progress * 8) * progress * 0.52;
      positions.push(
        canopyCenter.x + Math.cos(around) * radiusX + Math.sin(around * 2) * progress * 0.7,
        canopyCenter.y + 1.05 - Math.pow(progress, 1.35) * 1.85 + ripple,
        canopyCenter.z + Math.sin(around) * radiusZ,
      );
      uvs.push(side / canopySides, 1 + progress);
    }
  }
  for (let ring = 0; ring < canopyRings; ring += 1) {
    for (let side = 0; side < canopySides; side += 1) {
      const row = canopySides + 1;
      const a = canopyOffset + ring * row + side;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createScoreFlowMask() {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / (size - 1);
      const v = y / (size - 1);
      const warpedU = u + Math.sin(v * Math.PI * 4.1) * 0.085;
      const warpedV = v + Math.sin(u * Math.PI * 3.3) * 0.07;
      const broad = Math.sin((warpedU * 2.1 + warpedV * 1.35) * Math.PI * 2);
      const cross = Math.sin((warpedU * 1.25 - warpedV * 2.7) * Math.PI * 2 + 1.4);
      const cells = Math.sin((warpedU * 4.2 + warpedV * 3.1) * Math.PI * 2) * 0.22;
      const field = broad * 0.52 + cross * 0.32 + cells;
      const alpha = THREE.MathUtils.smoothstep(Math.abs(field), 0.08, 0.78);
      const offset = (y * size + x) * 4;
      pixels[offset] = 255;
      pixels[offset + 1] = Math.round(alpha * 255);
      pixels[offset + 2] = 255;
      pixels[offset + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createMirroredWorldEchoGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  const center = new THREE.Vector3(
    PIANO_POSITION.x - 1.2,
    PIANO_POSITION.y + 11.8,
    PIANO_POSITION.z - 15,
  );
  const echoColors = {
    terrain: new THREE.Color('#83ccef'),
    river: new THREE.Color('#e3f7ff'),
    architecture: new THREE.Color('#45336f'),
    piano: new THREE.Color('#db91d5'),
    fire: new THREE.Color('#ff7b46'),
    teal: new THREE.Color('#4ee6e0'),
    petal: new THREE.Color('#ff9ee1'),
    harmonic: new THREE.Color('#c9b7ff'),
  };
  const addTriangle = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3,
    color: THREE.Color,
  ) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    for (let vertex = 0; vertex < 3; vertex += 1) {
      colors.push(color.r, color.g, color.b);
    }
  };
  const addQuad = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3,
    d: THREE.Vector3,
    color: THREE.Color,
  ) => {
    addTriangle(a, b, c, color);
    addTriangle(a, c, d, color);
  };

  // Three unequal contour bands make the canopy read as the valley reflected overhead.
  const contourBands = [
    { y: 1.85, z: -2.1, depth: 0.42, amplitude: 0.92, phase: 0.2 },
    { y: 1.15, z: -0.7, depth: 0.34, amplitude: 0.72, phase: 1.5 },
    { y: 0.48, z: 0.8, depth: 0.28, amplitude: 0.54, phase: 2.7 },
  ];
  contourBands.forEach((band, bandIndex) => {
    const segments = 40;
    for (let segment = 0; segment < segments; segment += 1) {
      const left = segment / segments;
      const right = (segment + 1) / segments;
      const sampleY = (progress: number) => (
        center.y + band.y
        - Math.sin(progress * Math.PI) * band.amplitude
        - Math.sin(progress * Math.PI * 3.2 + band.phase) * 0.18
        - Math.cos(progress * Math.PI * 5.1 - band.phase) * 0.07
      );
      const xLeft = center.x + THREE.MathUtils.lerp(-17.5, 17.5, left);
      const xRight = center.x + THREE.MathUtils.lerp(-17.5, 17.5, right);
      const yLeft = sampleY(left);
      const yRight = sampleY(right);
      const depth = band.depth * (0.72 + Math.sin(left * Math.PI) * 0.28);
      addQuad(
        new THREE.Vector3(xLeft, yLeft, center.z + band.z),
        new THREE.Vector3(xRight, yRight, center.z + band.z),
        new THREE.Vector3(xRight, yRight - depth, center.z + band.z),
        new THREE.Vector3(xLeft, yLeft - depth, center.z + band.z),
        echoColors.terrain.clone().lerp(echoColors.piano, bandIndex * 0.12),
      );
    }
  });

  // A pale current follows the reflected valley instead of crossing it as a straight stripe.
  const riverSegments = 30;
  for (let segment = 0; segment < riverSegments; segment += 1) {
    const start = segment / riverSegments;
    const end = (segment + 1) / riverSegments;
    const riverPoint = (progress: number, side: number) => {
      const y = center.y + 0.18 - progress * 2.7;
      const x = center.x - 1.8 + Math.sin(progress * 5.4 + 0.45) * (0.65 + progress * 1.9);
      const width = 0.1 + progress * 0.2;
      return new THREE.Vector3(x + width * side, y, center.z + 1.2);
    };
    addQuad(
      riverPoint(start, -1),
      riverPoint(end, -1),
      riverPoint(end, 1),
      riverPoint(start, 1),
      echoColors.river,
    );
  }

  // Chromatic currents carry the four material states through the narrow neck,
  // so the reflected world remains legible between the piano and canopy.
  const currentColors = [
    echoColors.teal,
    echoColors.fire,
    echoColors.petal,
    echoColors.harmonic,
  ];
  currentColors.forEach((color, currentIndex) => {
    const segments = 34;
    const phase = currentIndex * 1.73;
    for (let segment = 0; segment < segments; segment += 1) {
      const start = segment / segments;
      const end = (segment + 1) / segments;
      const currentPoint = (progress: number, side: number) => {
        const travel = THREE.MathUtils.smoothstep(progress, 0.06, 1);
        const neck = Math.sin(progress * Math.PI);
        const sourceBloom = 1 - THREE.MathUtils.smoothstep(progress, 0.02, 0.22);
        const canopyBloom = THREE.MathUtils.smoothstep(progress, 0.62, 1);
        const centerX = THREE.MathUtils.lerp(PIANO_POSITION.x - 0.15, center.x, travel)
          + Math.sin(progress * 9.2 + phase) * (0.12 + neck * 0.42);
        const centerY = THREE.MathUtils.lerp(PIANO_POSITION.y + 0.52, center.y + 0.82, progress);
        const centerZ = THREE.MathUtils.lerp(PIANO_POSITION.z + 0.34, center.z + 0.3, travel)
          + Math.cos(progress * 7.4 + phase) * neck * 0.3;
        const width = 0.035 + sourceBloom * 0.18 + canopyBloom * (0.34 + currentIndex * 0.035);
        return new THREE.Vector3(centerX + side * width, centerY, centerZ);
      };
      addQuad(
        currentPoint(start, -1),
        currentPoint(end, -1),
        currentPoint(end, 1),
        currentPoint(start, 1),
        color,
      );
    }
  });

  // The viaduct is echoed as a filled architectural silhouette with recognizable arches.
  const bridgeY = center.y + 0.92;
  const bridgeZ = center.z - 0.15;
  const bridgeLeft = center.x - 11.6;
  const bridgeRight = center.x + 1.8;
  addQuad(
    new THREE.Vector3(bridgeLeft, bridgeY, bridgeZ),
    new THREE.Vector3(bridgeRight, bridgeY, bridgeZ),
    new THREE.Vector3(bridgeRight, bridgeY - 0.27, bridgeZ),
    new THREE.Vector3(bridgeLeft, bridgeY - 0.27, bridgeZ),
    echoColors.architecture,
  );
  const archCount = 3;
  const archSpacing = (bridgeRight - bridgeLeft) / archCount;
  for (let arch = 0; arch < archCount; arch += 1) {
    const archCenter = bridgeLeft + archSpacing * (arch + 0.5);
    const outerRadius = archSpacing * 0.46;
    const innerRadius = outerRadius * 0.78;
    const arcSegments = 12;
    for (let segment = 0; segment < arcSegments; segment += 1) {
      const start = (segment / arcSegments) * Math.PI;
      const end = ((segment + 1) / arcSegments) * Math.PI;
      const arcPoint = (angle: number, radius: number) => new THREE.Vector3(
        archCenter + Math.cos(angle) * radius,
        bridgeY - 0.19 - Math.sin(angle) * radius,
        bridgeZ,
      );
      addQuad(
        arcPoint(start, outerRadius),
        arcPoint(end, outerRadius),
        arcPoint(end, innerRadius),
        arcPoint(start, innerRadius),
        echoColors.architecture,
      );
    }
  }

  // A small inverted grand piano anchors the echo to the object producing the score.
  const pianoX = center.x + 7.7;
  const pianoY = center.y + 1.5;
  const pianoZ = center.z - 0.45;
  addQuad(
    new THREE.Vector3(pianoX - 2.7, pianoY, pianoZ),
    new THREE.Vector3(pianoX + 2.2, pianoY + 0.12, pianoZ),
    new THREE.Vector3(pianoX + 1.45, pianoY - 0.85, pianoZ),
    new THREE.Vector3(pianoX - 2.25, pianoY - 0.67, pianoZ),
    echoColors.piano,
  );
  addQuad(
    new THREE.Vector3(pianoX - 2.55, pianoY - 0.7, pianoZ),
    new THREE.Vector3(pianoX + 1.5, pianoY - 0.86, pianoZ),
    new THREE.Vector3(pianoX + 1.48, pianoY - 1.02, pianoZ),
    new THREE.Vector3(pianoX - 2.58, pianoY - 0.86, pianoZ),
    echoColors.river,
  );
  [-1.7, 0.95].forEach((legOffset) => {
    addQuad(
      new THREE.Vector3(pianoX + legOffset - 0.08, pianoY - 0.82, pianoZ),
      new THREE.Vector3(pianoX + legOffset + 0.08, pianoY - 0.82, pianoZ),
      new THREE.Vector3(pianoX + legOffset + 0.12, pianoY - 2.1, pianoZ),
      new THREE.Vector3(pianoX + legOffset - 0.12, pianoY - 2.1, pianoZ),
      echoColors.piano,
    );
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function MirroredScoreCanopy({ reducedMotion }: { reducedMotion: boolean }) {
  const flowGeometry = useMemo(() => createRefractiveScoreGeometry(), []);
  const pianoOutlineGeometry = useMemo(() => createPianoPortalOutlineGeometry(), []);
  const flowMask = useMemo(() => createScoreFlowMask(), []);
  const worldEchoGeometry = useMemo(() => createMirroredWorldEchoGeometry(), []);
  const particleGeometry = useMemo(() => {
    const source = flowGeometry.getAttribute('position');
    const count = Math.min(1050, source.count);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const sourceIndex = (index * 17) % source.count;
      positions.set([
        source.getX(sourceIndex),
        source.getY(sourceIndex),
        source.getZ(sourceIndex),
      ], index * 3);
      seeds.set([
        (index * 0.61803398875) % 1,
        (index * 0.41421356237 + 0.21) % 1,
        (index * 0.73205080756 + 0.47) % 1,
      ], index * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
    geometry.computeBoundingSphere();
    return geometry;
  }, [flowGeometry]);
  const flowRef = useRef<THREE.Mesh>(null);
  const worldEchoRef = useRef<THREE.Mesh>(null);
  const worldEchoMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
    vertexColors: true,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uMotion;
      varying vec3 vColor;
      varying vec3 vWorldPosition;
      varying float vFacing;
      void main() {
        vec3 transformed = position;
        float time = uTime * uMotion;
        transformed.x += sin(time * 0.28 + position.y * 0.43 + position.z * 0.18) * 0.035;
        vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
        vec3 viewNormal = normalize(normalMatrix * normal);
        vec3 viewDirection = normalize(-(modelViewMatrix * vec4(transformed, 1.0)).xyz);
        vFacing = 1.0 - abs(dot(viewNormal, viewDirection));
        vColor = color;
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uMotion;
      varying vec3 vColor;
      varying vec3 vWorldPosition;
      varying float vFacing;
      void main() {
        float time = uTime * uMotion;
        float slowSheen = 0.5 + 0.5 * sin(vWorldPosition.y * 1.15 + vWorldPosition.x * 0.24 - time * 0.72);
        float fineSheen = pow(0.5 + 0.5 * sin(vWorldPosition.z * 2.4 - vWorldPosition.x * 0.7 + time * 0.38), 5.0);
        float edge = pow(clamp(vFacing, 0.0, 1.0), 1.7);
        float luminance = dot(vColor, vec3(0.2126, 0.7152, 0.0722));
        float silhouette = 1.0 - smoothstep(0.16, 0.4, luminance);
        float reflectionLight = fineSheen * 0.38 + edge * 0.2;
        vec3 spectral = mix(vColor, vec3(0.86, 0.95, 1.0), reflectionLight * (1.0 - silhouette * 0.74));
        spectral *= mix(0.62 + slowSheen * 0.38, 0.72 + slowSheen * 0.12, silhouette);
        float alpha = 0.18 + slowSheen * 0.13 + fineSheen * 0.1 + edge * 0.08 + silhouette * 0.34;
        gl_FragColor = vec4(spectral, alpha);
      }
    `,
  }), [reducedMotion]);
  const wispMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uMotion;
      varying vec2 vUv;
      varying float vFresnel;
      void main() {
        vec3 transformed = position;
        float time = uTime * uMotion;
        float altitude = smoothstep(${(PIANO_POSITION.y + 2).toFixed(2)}, ${(PIANO_POSITION.y + 14).toFixed(2)}, transformed.y);
        transformed.x += sin(time * 0.42 + transformed.y * 0.28 + uv.x * 6.283) * (0.035 + altitude * 0.13);
        transformed.z += cos(time * 0.31 + transformed.x * 0.17) * (0.025 + altitude * 0.09);
        vec3 viewNormal = normalize(normalMatrix * normal);
        vec3 viewDirection = normalize(-(modelViewMatrix * vec4(transformed, 1.0)).xyz);
        vFresnel = pow(1.0 - abs(dot(viewNormal, viewDirection)), 1.8);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uMotion;
      varying vec2 vUv;
      varying float vFresnel;
      void main() {
        float time = uTime * uMotion;
        float broadCurrent = 0.5 + 0.5 * sin(vUv.y * 10.0 - time * 1.35 + sin(vUv.x * 6.283 + time * 0.22) * 2.2);
        float crossCurrent = 0.5 + 0.5 * sin(vUv.x * 12.566 + vUv.y * 4.3 + time * 0.56);
        float wisp = smoothstep(0.58, 0.96, broadCurrent * 0.78 + crossCurrent * 0.22);
        vec3 cyan = vec3(0.2, 0.78, 1.0);
        vec3 magenta = vec3(1.0, 0.3, 0.86);
        vec3 color = mix(cyan, magenta, 0.5 + 0.5 * sin(vUv.y * 4.0 - time * 0.32));
        float alpha = wisp * 0.18 + vFresnel * 0.16;
        gl_FragColor = vec4(color * (0.52 + wisp * 0.65), alpha);
      }
    `,
  }), [reducedMotion]);
  const particleMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uMotion;
      attribute vec3 aSeed;
      varying float vLife;
      varying vec3 vColor;
      void main() {
        float time = uTime * uMotion;
        vec3 transformed = position;
        float travel = fract(aSeed.x + time * mix(0.055, 0.13, aSeed.y));
        transformed.y += sin(time * 0.7 + aSeed.x * 31.0) * 0.12;
        transformed.x += sin(time * 0.43 + aSeed.z * 19.0) * 0.16;
        vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        gl_PointSize = min(6.5, mix(1.4, 4.8, aSeed.z) * (35.0 / max(6.0, -viewPosition.z)));
        vLife = 0.28 + pow(0.5 + 0.5 * sin(travel * 6.2831853), 4.0) * 0.72;
        vColor = mix(vec3(0.28, 0.8, 1.0), vec3(1.0, 0.38, 0.92), aSeed.y);
      }
    `,
    fragmentShader: `
      varying float vLife;
      varying vec3 vColor;
      void main() {
        float core = 1.0 - smoothstep(0.05, 0.5, length(gl_PointCoord - 0.5));
        gl_FragColor = vec4(vColor * (0.75 + vLife), core * vLife * 0.86);
      }
    `,
  }), [reducedMotion]);

  useFrame(({ clock }) => {
    wispMaterial.uniforms.uTime.value = clock.elapsedTime;
    wispMaterial.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    particleMaterial.uniforms.uTime.value = clock.elapsedTime;
    particleMaterial.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    worldEchoMaterial.uniforms.uTime.value = clock.elapsedTime;
    worldEchoMaterial.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    if (flowRef.current && !reducedMotion) {
      flowRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.16) * 0.018;
    }
    if (worldEchoRef.current && !reducedMotion) {
      worldEchoRef.current.position.x = Math.sin(clock.elapsedTime * 0.19) * 0.1;
      worldEchoRef.current.position.y = Math.sin(clock.elapsedTime * 0.14 + 0.8) * 0.07;
    }
  });

  useEffect(() => () => {
    flowGeometry.dispose();
    pianoOutlineGeometry.dispose();
    flowMask.dispose();
    worldEchoGeometry.dispose();
    particleGeometry.dispose();
    wispMaterial.dispose();
    particleMaterial.dispose();
    worldEchoMaterial.dispose();
  }, [flowGeometry, flowMask, particleGeometry, particleMaterial, pianoOutlineGeometry, worldEchoGeometry, worldEchoMaterial, wispMaterial]);

  return (
    <group userData={{ musicWorldForm: 'mirrored-score-canopy' }}>
      <lineLoop geometry={pianoOutlineGeometry} frustumCulled={false} renderOrder={6}>
        <lineBasicMaterial
          color="#dff7ff"
          transparent
          opacity={0.78}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineLoop>
      <mesh
        ref={flowRef}
        geometry={flowGeometry}
        frustumCulled={false}
        renderOrder={3}
      >
        <MeshTransmissionMaterial
          color="#b5ddff"
          transmission={1}
          roughness={0.035}
          thickness={0.82}
          ior={1.24}
          reflectivity={0.78}
          chromaticAberration={0.13}
          anisotropicBlur={0.08}
          distortion={0.68}
          distortionScale={0.84}
          temporalDistortion={reducedMotion ? 0 : 0.34}
          samples={3}
          resolution={256}
          backside={false}
          side={THREE.DoubleSide}
          alphaMap={flowMask}
          alphaTest={0.08}
          transparent
          opacity={0.42}
        />
      </mesh>
      <mesh
        geometry={flowGeometry}
        material={wispMaterial}
        frustumCulled={false}
        renderOrder={4}
      />
      <points
        geometry={particleGeometry}
        material={particleMaterial}
        frustumCulled={false}
        renderOrder={5}
      />
      <mesh
        ref={worldEchoRef}
        geometry={worldEchoGeometry}
        frustumCulled={false}
        renderOrder={5}
        userData={{ reflectedWorld: 'terrain-river-viaduct-piano-fire-petal-harmonic-currents' }}
        material={worldEchoMaterial}
      />
    </group>
  );
}

function createStreamGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const segments = 96;

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    const z = 12 - progress * 68;
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

function Stream({
  reducedMotion,
  liquidRuntime,
  musicLiquidProof,
}: {
  reducedMotion: boolean;
  liquidRuntime: MusicLiquidRuntime;
  musicLiquidProof: boolean;
}) {
  const geometry = useMemo(() => createStreamGeometry(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uLiquidReply: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uMotion;
      uniform float uLiquidReply;
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
      uniform float uLiquidReply;
      varying vec2 vUv;
      void main() {
        float time = uTime * uMotion;
        // Positive time moves wave fronts toward decreasing UV.y: distance to foreground.
        float downstream = vUv.y * 46.0 + time * 2.3;
        float broad = sin(downstream + sin(vUv.y * 8.0) * 1.25 + vUv.x * 1.8);
        float middle = sin(vUv.y * 93.0 + time * 3.5 + vUv.x * 8.0);
        float fine = sin(vUv.y * 181.0 + time * 5.1 - vUv.x * 11.0);
        float travellingPool = pow(max(0.0, sin(vUv.y * 18.0 + time * 1.75)), 4.0);
        float liquidReply = pow(max(0.0, sin(vUv.y * 16.0 + time * 1.2 - 1.8)), 8.0)
          * uLiquidReply;
        float bank = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
        float bankFoam = pow(1.0 - abs(vUv.x * 2.0 - 1.0), 7.0);
        float depth = 1.0 - abs(vUv.x * 2.0 - 1.0);
        float plateA = smoothstep(0.14, 0.34, depth + broad * 0.05);
        float plateB = smoothstep(0.48, 0.74, depth + middle * 0.025);
        vec3 shallow = vec3(0.31, 0.4, 0.7);
        vec3 middleBlue = vec3(0.15, 0.2, 0.52);
        vec3 deep = vec3(0.035, 0.045, 0.2);
        vec3 sun = vec3(0.76, 0.54, 0.82);
        float light = max(0.0, broad) * 0.22 + max(0.0, middle) * 0.1;
        light += max(0.0, fine) * 0.045 + travellingPool * 0.18;
        vec3 color = mix(shallow, middleBlue, plateA);
        color = mix(color, deep, plateB);
        color = mix(color, sun, light * 0.58 + bankFoam * 0.045);
        color = mix(color, vec3(0.46, 0.78, 0.9), liquidReply * 0.62);
        float farFade = 1.0 - smoothstep(0.72, 0.94, vUv.y);
        float alpha = (0.9 + travellingPool * 0.08) * bank * farFade;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  }), [reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    material.uniforms.uLiquidReply.value = musicLiquidProof
      ? liquidRuntime.riverReply * liquidRuntime.qualityWeight
      : 0;
  });

  return <mesh geometry={geometry} material={material} renderOrder={1} />;
}

function samplePianoGeometry(scene: THREE.Group, modelOffset: THREE.Vector3) {
  scene.updateMatrixWorld(true);
  const vertices: THREE.Vector3[] = [];
  const point = new THREE.Vector3();

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const attribute = child.geometry.getAttribute('position');
    if (!attribute) return;
    for (let index = 0; index < attribute.count; index += 1) {
      point
        .fromBufferAttribute(attribute, index)
        .applyMatrix4(child.matrixWorld)
        .add(modelOffset);
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

function ParticlePiano({
  reducedMotion,
  musicLiquidProof,
  liquidRuntime,
}: {
  reducedMotion: boolean;
  musicLiquidProof: boolean;
  liquidRuntime: MusicLiquidRuntime;
}) {
  const { scene } = useGLTF('/models/grand_piano/grand_piano_(GLB).gltf');
  const modelOffset = useMemo(() => {
    scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(scene);
    const center = bounds.getCenter(new THREE.Vector3());
    return new THREE.Vector3(-center.x, -bounds.min.y, -center.z);
  }, [scene]);
  const geometry = useMemo(
    () => samplePianoGeometry(scene, modelOffset),
    [modelOffset, scene],
  );
  const ghost = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.material = new THREE.MeshStandardMaterial({
        color: '#171830',
        emissive: '#33285f',
        emissiveIntensity: 0.32,
        metalness: 0.3,
        roughness: 0.58,
        transparent: true,
        opacity: 0.3,
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
      uLiquidReflection: { value: 0 },
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
        gl_PointSize = (1.15 + aSeed * 0.95 + pulse * 0.12 * uMotion) * uDpr * (19.0 / max(2.0, -viewPosition.z));
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform float uLiquidReflection;
      varying float vSeed;
      varying float vPulse;
      void main() {
        vec2 centered = gl_PointCoord - 0.5;
        float radius = length(centered);
        float core = 1.0 - smoothstep(0.1, 0.3, radius);
        float halo = 1.0 - smoothstep(0.2, 0.5, radius);
        vec3 pearl = vec3(1.0, 0.84, 0.94);
        vec3 coolLight = vec3(0.67, 0.78, 1.0);
        vec3 color = mix(pearl, coolLight, smoothstep(0.72, 0.98, vSeed) * 0.38);
        float liquidGrain = smoothstep(0.42, 0.98, sin(vSeed * 71.0 + vPulse * 1.7) * 0.5 + 0.5);
        vec3 liquidNacre = mix(vec3(0.34, 0.8, 0.92), vec3(0.98, 0.67, 0.9), liquidGrain);
        color = mix(color, liquidNacre, uLiquidReflection * (0.2 + liquidGrain * 0.28));
        float light = 0.78 + (vPulse * 0.5 + 0.5) * 0.16 + uLiquidReflection * liquidGrain * 0.24;
        float alpha = core * 0.5 + halo * (0.14 + uLiquidReflection * 0.045);
        gl_FragColor = vec4(color * light, alpha * (0.4 + vSeed * 0.16));
      }
    `,
  }), [reducedMotion]);
  const { gl } = useThree();

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    material.uniforms.uDpr.value = Math.min(gl.getPixelRatio(), 1.25);
    material.uniforms.uLiquidReflection.value = musicLiquidProof
      ? liquidRuntime.pianoReply * liquidRuntime.qualityWeight
      : 0;
  });

  return (
    <group
      position={PIANO_POSITION}
      rotation={[0, -0.42, 0]}
      scale={1.42}
    >
      <primitive object={ghost} position={modelOffset} renderOrder={-1} />
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

function placeLimb(
  mesh: THREE.Mesh | null,
  start: THREE.Vector3,
  end: THREE.Vector3,
) {
  if (!mesh) return;
  const direction = end.clone().sub(start);
  mesh.position.copy(start).addScaledVector(direction, 0.5);
  mesh.scale.y = direction.length();
  mesh.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize(),
  );
}

function layeredPlayingMotion(time: number, seed: number) {
  return (
    Math.sin(time * 0.37 + seed) * 0.52
    + Math.sin(time * 0.71 + seed * 1.73) * 0.3
    + Math.sin(time * 0.19 + seed * 2.41) * 0.18
  );
}

function PianistAndBench({
  reducedMotion,
  musicWorldActive,
}: {
  reducedMotion: boolean;
  musicWorldActive: boolean;
}) {
  const player = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const leftUpperArm = useRef<THREE.Mesh>(null);
  const leftForearm = useRef<THREE.Mesh>(null);
  const rightUpperArm = useRef<THREE.Mesh>(null);
  const rightForearm = useRef<THREE.Mesh>(null);
  const leftHand = useRef<THREE.Mesh>(null);
  const rightHand = useRef<THREE.Mesh>(null);

  const joints = useMemo(() => ({
    leftShoulder: new THREE.Vector3(-0.19, 1.04, 1.2),
    rightShoulder: new THREE.Vector3(0.19, 1.04, 1.2),
    leftElbow: new THREE.Vector3(-0.3, 0.86, 0.93),
    rightElbow: new THREE.Vector3(0.3, 0.86, 0.93),
    leftWrist: new THREE.Vector3(-0.27, 0.79, 0.7),
    rightWrist: new THREE.Vector3(0.27, 0.79, 0.7),
  }), []);

  useFrame(({ clock }) => {
    const time = reducedMotion ? 0 : clock.elapsedTime;
    const phrase = layeredPlayingMotion(time, 0.8);
    const musicArmRange = musicWorldActive ? 1.38 : 1;
    const leftTravel = layeredPlayingMotion(time, 2.15) * 0.105 * musicArmRange;
    const rightTravel = layeredPlayingMotion(time, 5.4) * 0.11 * musicArmRange;
    const leanPhrase = THREE.MathUtils.smoothstep(
      layeredPlayingMotion(time * 0.68, 6.7),
      -0.28,
      0.72,
    );
    const secondaryLean = 0.5 + 0.5 * layeredPlayingMotion(time * 0.31, 9.2);
    const performerLean = musicWorldActive && !reducedMotion
      ? leanPhrase * (0.026 + secondaryLean * 0.038)
      : 0;
    const leftPress = (
      Math.sin(time * 2.64 + Math.sin(time * 0.43) * 1.35) * 0.006
      + Math.sin(time * 1.31 + 2.2) * 0.0035
    );
    const rightPress = (
      Math.sin(time * 2.87 + 1.4 + Math.sin(time * 0.39 + 0.7) * 1.5) * 0.0065
      + Math.sin(time * 1.47 + 0.4) * 0.0035
    );
    const breath = Math.sin(time * 0.58) * 0.007;

    if (player.current) {
      player.current.rotation.x = -0.055;
      player.current.position.y = -0.105 + breath * 0.12;
      player.current.position.z = 0;
    }
    if (torso.current) {
      torso.current.rotation.x = -0.08 - performerLean * 1.35 + phrase * 0.004;
      torso.current.position.y = 0.82 - performerLean * 0.12;
      torso.current.position.z = 1.25 - performerLean * 0.72;
    }
    if (head.current) {
      head.current.rotation.x = 0.12 + layeredPlayingMotion(time, 1.2) * 0.014;
      head.current.rotation.y = layeredPlayingMotion(time, 4.3) * 0.016;
      head.current.position.y = 1.28 - performerLean * 0.18;
      head.current.position.z = 1.2 - performerLean * 0.82;
    }

    joints.leftShoulder.y = 1.04 - performerLean * 0.14;
    joints.leftShoulder.z = 1.2 - performerLean * 0.7;
    joints.rightShoulder.y = 1.04 - performerLean * 0.14;
    joints.rightShoulder.z = 1.2 - performerLean * 0.7;
    joints.leftElbow.x = -0.3 + leftTravel * 0.42;
    joints.leftElbow.y = 0.86 + leftPress * 0.42;
    joints.leftWrist.x = -0.27 + leftTravel;
    joints.leftWrist.y = 0.79 + leftPress;
    joints.rightElbow.x = 0.3 + rightTravel * 0.42;
    joints.rightElbow.y = 0.86 + rightPress * 0.4;
    joints.rightWrist.x = 0.27 + rightTravel;
    joints.rightWrist.y = 0.79 + rightPress;

    placeLimb(leftUpperArm.current, joints.leftShoulder, joints.leftElbow);
    placeLimb(leftForearm.current, joints.leftElbow, joints.leftWrist);
    placeLimb(rightUpperArm.current, joints.rightShoulder, joints.rightElbow);
    placeLimb(rightForearm.current, joints.rightElbow, joints.rightWrist);
    leftHand.current?.position.copy(joints.leftWrist);
    rightHand.current?.position.copy(joints.rightWrist);
  });

  return (
    <group
      position={PIANO_POSITION}
      rotation={[0, -0.42, 0]}
      scale={1.42}
      userData={{ role: 'piano-player' }}
    >
      <group position={[0, 0, 1.27]}>
        <mesh position={[0, 0.39, 0]} castShadow={false}>
          <boxGeometry args={[0.78, 0.12, 0.34]} />
          <meshStandardMaterial
            color="#111020"
            emissive="#322346"
            emissiveIntensity={0.16}
            roughness={0.72}
          />
        </mesh>
        {[-0.29, 0.29].flatMap((x) => [-0.1, 0.1].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.19, z]} rotation={[0, 0, x * 0.08]}>
            <cylinderGeometry args={[0.035, 0.045, 0.4, 6]} />
            <meshStandardMaterial color="#121126" roughness={0.8} />
          </mesh>
        )))}
      </group>

      <group ref={player}>
        <mesh ref={torso} position={[0, 0.82, 1.25]} rotation={[-0.08, 0, 0]}>
          <capsuleGeometry args={[0.13, 0.38, 4, 8]} />
          <meshStandardMaterial
            color="#151225"
            emissive="#4d3158"
            emissiveIntensity={0.22}
            roughness={0.82}
            flatShading
          />
        </mesh>
        <mesh position={[0, 0.6, 1.25]} scale={[1.12, 0.72, 0.9]}>
          <sphereGeometry args={[0.16, 8, 6]} />
          <meshStandardMaterial
            color="#121020"
            emissive="#3b2847"
            emissiveIntensity={0.18}
            roughness={0.86}
            flatShading
          />
        </mesh>
        <group ref={head} position={[0, 1.28, 1.2]}>
          <mesh>
            <sphereGeometry args={[0.17, 9, 7]} />
            <meshBasicMaterial
              color="#171222"
            />
          </mesh>
          <mesh scale={1.075}>
            <sphereGeometry args={[0.17, 9, 7]} />
            <meshBasicMaterial
              color="#ba78b2"
              transparent
              opacity={0.2}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
        </group>

        <mesh ref={leftUpperArm}>
          <cylinderGeometry args={[0.052, 0.058, 1, 7]} />
          <meshStandardMaterial
            color="#171326"
            emissive="#50305a"
            emissiveIntensity={0.2}
            roughness={0.84}
            flatShading
          />
        </mesh>
        <mesh ref={rightUpperArm}>
          <cylinderGeometry args={[0.052, 0.058, 1, 7]} />
          <meshStandardMaterial
            color="#171326"
            emissive="#50305a"
            emissiveIntensity={0.2}
            roughness={0.84}
            flatShading
          />
        </mesh>
        <mesh ref={leftForearm}>
          <cylinderGeometry args={[0.038, 0.05, 1, 7]} />
          <meshStandardMaterial
            color="#1b1528"
            emissive="#67405f"
            emissiveIntensity={0.2}
            roughness={0.9}
            flatShading
          />
        </mesh>
        <mesh ref={rightForearm}>
          <cylinderGeometry args={[0.038, 0.05, 1, 7]} />
          <meshStandardMaterial
            color="#1b1528"
            emissive="#67405f"
            emissiveIntensity={0.2}
            roughness={0.9}
            flatShading
          />
        </mesh>
        <mesh ref={leftHand} scale={[1.3, 0.55, 1.55]}>
          <sphereGeometry args={[0.055, 7, 5]} />
          <meshStandardMaterial
            color="#37233b"
            emissive="#a76083"
            emissiveIntensity={0.32}
            roughness={0.92}
            flatShading
          />
        </mesh>
        <mesh ref={rightHand} scale={[1.3, 0.55, 1.55]}>
          <sphereGeometry args={[0.055, 7, 5]} />
          <meshStandardMaterial
            color="#37233b"
            emissive="#a76083"
            emissiveIntensity={0.32}
            roughness={0.92}
            flatShading
          />
        </mesh>

        {[-0.13, 0.13].map((x) => (
          <group key={x}>
            <mesh
              position={[x, 0.52, 1.08]}
              rotation={[Math.PI / 2.7, 0, x * 0.3]}
            >
              <capsuleGeometry args={[0.065, 0.28, 3, 7]} />
              <meshStandardMaterial
                color="#121020"
                emissive="#35243f"
                emissiveIntensity={0.16}
                roughness={0.88}
                flatShading
              />
            </mesh>
            <mesh position={[x, 0.25, 0.88]} rotation={[0.08, 0, x * 0.24]}>
              <capsuleGeometry args={[0.052, 0.3, 3, 7]} />
              <meshStandardMaterial
                color="#100f1d"
                emissive="#302039"
                emissiveIntensity={0.14}
                roughness={0.9}
                flatShading
              />
            </mesh>
            <mesh position={[x, 0.075, 0.7]} scale={[0.85, 0.55, 1.5]}>
              <sphereGeometry args={[0.085, 7, 5]} />
              <meshStandardMaterial color="#111024" roughness={0.9} flatShading />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function DistantLandscape({ profile }: { profile: MusicWorldProfile }) {
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
        color={profile.ridge[0]}
        opacity={0.72}
        heights={[3.3, 4.5, 4, 5.1, 4.15, 4.7, 3.6]}
      />
      <RidgeBand
        z={-55}
        baseY={-4.3}
        color={profile.ridge[1]}
        opacity={0.78}
        heights={[2.4, 3.4, 2.8, 4, 3.15, 3.75, 2.55]}
      />
      <RidgeBand
        z={-45}
        baseY={-4.1}
        color={profile.ridge[2]}
        opacity={0.84}
        heights={[1.45, 2.4, 1.85, 2.9, 2.1, 2.5, 1.6]}
      />
      <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]}>
        <cylinderGeometry args={[0.5, 0.62, 1.6, 5]} />
        <meshToonMaterial color={profile.bridge[0]} />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshToonMaterial color={profile.ridge[2]} />
      </instancedMesh>
      <instancedMesh ref={crownHighlights} args={[undefined, undefined, trees.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshToonMaterial color={profile.ridge[0]} />
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
    const span = 160;
    const subdivisions = 72;

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

function StoneViaduct({ profile }: { profile: MusicWorldProfile }) {
  const archSpacing = BRIDGE_LENGTH / PIANO_CLEARING_PERFORMANCE.bridgeArches;
  const leftEdge = -BRIDGE_LENGTH / 2;
  const stone = profile.bridge[0];
  const sunStone = profile.bridge[1];

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
          <meshBasicMaterial color={profile.keyLight} transparent opacity={0.5} fog={false} />
        </mesh>
      ))}
      <mesh position={[0, BRIDGE_DECK_Y + 0.39, -0.49]} scale={[BRIDGE_LENGTH, 0.23, 0.14]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color={profile.bridge[1]} fog={false} />
      </mesh>
      <mesh position={[0, BRIDGE_DECK_Y + 0.39, 0.49]} scale={[BRIDGE_LENGTH, 0.23, 0.14]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshToonMaterial color={profile.bridge[0]} fog={false} />
      </mesh>
      {Array.from({ length: PIANO_CLEARING_PERFORMANCE.bridgeArches + 1 }, (_, index) => {
        if (index === 0 || index === PIANO_CLEARING_PERFORMANCE.bridgeArches) return null;
        const x = leftEdge + index * archSpacing;
        const bankY = GROUND_Y + pianoClearingTerrainHeight(BRIDGE_X + x, BRIDGE_Z);
        const height = Math.max(1.2, BRIDGE_DECK_Y - bankY - 0.2);
        return (
          <mesh key={`pier-${index}`} position={[x, bankY + height / 2, 0]} scale={[0.62, height, 1.05]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshToonMaterial color={index % 2 ? stone : sunStone} fog={false} />
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
              <meshToonMaterial color={profile.bridge[1]} fog={false} />
            </mesh>
            <mesh position={[0, 0, 0.53]}>
              <torusGeometry args={[radius, 0.27, 5, 22, Math.PI]} />
              <meshToonMaterial color={profile.bridge[0]} fog={false} />
            </mesh>
          </group>
        );
      })}
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
      left.current.position.x = -15.5 + Math.sin(time * 0.07) * 0.09;
    }
    if (right.current) {
      right.current.rotation.z = Math.sin(time * 0.085 + 1.2) * 0.012;
      right.current.position.x = 23.5 + Math.sin(time * 0.055) * 0.07;
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
      <group ref={left} position={[-15.5, 5.2, 2.2]} scale={[1.38, 1.52, 1]}>
        {leftClusters.map(([x, y, z, scale], index) => (
          <mesh key={index} position={[x, y, z]} scale={scale}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial
              color={index % 2 ? '#b380c1' : '#cf9bcf'}
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <group ref={right} position={[23.5, 9.8, 3.8]} scale={[1.42, 1.18, 1]}>
        {rightClusters.map(([x, y, z, scale], index) => (
          <mesh key={index} position={[x, y, z]} scale={scale}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial
              color={index % 2 ? '#54569b' : '#6c65ad'}
              transparent
              opacity={0.22}
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
    const ivory = new THREE.Color('#ffd7ee');
    const blue = new THREE.Color('#b8c7ff');

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
    { x: -12.7, z: -7.2, scale: 1.45, color: '#252852' },
    { x: -11.1, z: -7.8, scale: 1.12, color: '#343768' },
    { x: -13.4, z: -8.6, scale: 0.94, color: '#1b1d43' },
    { x: -9.8, z: -8.5, scale: 0.72, color: '#454479' },
    { x: -12.1, z: -9.2, scale: 0.62, color: '#20234d' },
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

function SkyDome({
  reducedMotion,
  profile,
  landscapeIndex,
}: {
  reducedMotion: boolean;
  profile: MusicWorldProfile;
  landscapeIndex: number;
}) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uHorizon: { value: new THREE.Color(profile.sky[0]) },
      uUpper: { value: new THREE.Color(profile.sky[1]) },
      uZenith: { value: new THREE.Color(profile.sky[2]) },
      uWisp: { value: new THREE.Color(profile.cloud[0]) },
      uSun: { value: new THREE.Color(profile.keyLight) },
      uLandscapeMode: { value: landscapeIndex },
    },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = normalize(world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
       uniform float uTime;
       uniform float uMotion;
       uniform vec3 uHorizon;
       uniform vec3 uUpper;
       uniform vec3 uZenith;
       uniform vec3 uWisp;
       uniform vec3 uSun;
       uniform float uLandscapeMode;
      varying vec3 vWorld;

      float cloudWisp(float x, float y, float center, float width, float phase) {
        float drift = uTime * 0.014 * uMotion;
        float bend = sin((x + phase + drift) * 8.0) * 0.018
          + sin((x * 17.0) - drift * 0.7 + phase) * 0.006;
        float band = 1.0 - smoothstep(width * 0.16, width, abs(y - center - bend));
        float broken = 0.58 + 0.42 * sin((x + phase + drift) * 15.0);
        return band * broken;
      }

      void main() {
        float height = smoothstep(-0.12, 0.78, vWorld.y);
        vec3 color = mix(uHorizon, uZenith, height);
        color = mix(color, uUpper, smoothstep(0.14, 0.58, height) * 0.38);

        float x = atan(vWorld.x, -vWorld.z) / 3.14159265;
        float y = vWorld.y;
        float combinedMode = 1.0 - smoothstep(
          0.08,
          0.18,
          abs(uLandscapeMode - 5.0)
        );
        float musicalTime = uTime * uMotion;
        float cobaltPhrase = 0.5 + 0.5 * sin(
          x * 4.8 - musicalTime * 0.62 + sin(musicalTime * 0.21) * 1.7
        );
        float tealPhrase = 0.5 + 0.5 * sin(
          x * -3.2 + y * 6.4 + musicalTime * 0.48
        );
        float warmPhrase = 0.5 + 0.5 * sin(
          x * 7.1 - y * 4.2 - musicalTime * 0.36 + 1.8
        );
        float scorePulse = pow(
          0.5 + 0.5 * sin(
            x * 8.4 - y * 5.6 - musicalTime * 0.82
            + sin(musicalTime * 0.27) * 1.4
          ),
          2.0
        );
        vec3 cobalt = vec3(0.16, 0.29, 0.88);
        vec3 teal = vec3(0.08, 0.72, 0.76);
        vec3 violet = vec3(0.58, 0.22, 0.86);
        vec3 peach = vec3(1.0, 0.46, 0.48);
        vec3 musicalColor = mix(cobalt, teal, smoothstep(0.12, 0.88, tealPhrase));
        musicalColor = mix(musicalColor, violet, smoothstep(0.22, 0.92, cobaltPhrase) * 0.58);
        musicalColor = mix(musicalColor, peach, pow(warmPhrase, 3.0) * 0.42);
        float musicalSkyWeight = combinedMode * (0.2 + scorePulse * 0.3);
        color = mix(color, musicalColor, musicalSkyWeight);
        color += mix(teal, violet, cobaltPhrase)
          * combinedMode
          * scorePulse
          * (0.045 + height * 0.045);
        float travelingPhrase = pow(0.5 + 0.5 * sin(
          x * 13.0 + y * 8.0 - musicalTime * 1.06
          + sin(x * 4.0 + musicalTime * 0.31) * 1.8
        ), 6.0);
        color += mix(teal, peach, warmPhrase)
          * combinedMode
          * travelingPhrase
          * (0.055 + height * 0.085);
        float wisps = 0.0;
        wisps += cloudWisp(x, y, 0.29, 0.045, 0.12) * 0.46;
        wisps += cloudWisp(x, y, 0.36, 0.034, 0.52) * 0.34;
        wisps += cloudWisp(x, y, 0.43, 0.025, 0.91) * 0.24;
        float skyWindow = smoothstep(-0.72, -0.36, x) * (1.0 - smoothstep(0.48, 0.78, x));
        vec3 wispColor = mix(uWisp, uUpper, height);
        color = mix(color, wispColor, wisps * skyWindow * 0.28);

        float harmonicMode = max(
          1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 4.0)),
          (1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 5.0))) * 0.72
        );
        float auroraCenter = 0.43
          + sin(x * 7.0 - uTime * 0.2 * uMotion) * 0.07
          + sin(x * 15.0 + uTime * 0.13 * uMotion) * 0.025;
        float auroraBand = exp(-pow((y - auroraCenter) * 7.6, 2.0));
        float auroraCurtain = 0.46 + 0.54 * sin(
          x * 29.0 + sin(x * 8.0 - uTime * 0.16 * uMotion) * 2.2
        );
        auroraCurtain = smoothstep(0.12, 0.94, auroraCurtain);
        float auroraVeil = auroraBand * (0.38 + auroraCurtain * 0.62) * skyWindow;
        vec3 auroraColor = mix(
          vec3(0.16, 0.68, 0.9),
          vec3(0.94, 0.28, 0.86),
          0.5 + 0.5 * sin(x * 8.0 + uTime * 0.09 * uMotion)
        );
        // Three phase-shifted lenses create atmospheric refraction without a full-screen pass.
        float refractiveWarp = sin(x * 17.0 - uTime * 0.27 * uMotion)
          * sin(y * 13.0 + uTime * 0.16 * uMotion);
        float lensR = exp(-pow((y - auroraCenter - refractiveWarp * 0.035) * 9.2, 2.0));
        float lensG = exp(-pow((y - auroraCenter) * 9.2, 2.0));
        float lensB = exp(-pow((y - auroraCenter + refractiveWarp * 0.035) * 9.2, 2.0));
        vec3 chromaticRefraction = vec3(lensR, lensG, lensB)
          * (0.18 + auroraCurtain * 0.34) * skyWindow;
        float spatialLens = pow(0.5 + 0.5 * sin(
          x * 22.0 + sin(y * 10.0 - uTime * 0.15 * uMotion) * 2.8
        ), 8.0);
        color += auroraColor * auroraVeil * harmonicMode * 0.34;
        color += chromaticRefraction * harmonicMode * (0.5 + spatialLens * 0.58);
        color = mix(
          color,
          color.brg * vec3(0.82, 0.9, 1.08),
          harmonicMode * spatialLens * 0.075
        );

        vec3 sunDirection = normalize(vec3(-0.04, 0.16, -0.99));
        float sunFacing = max(dot(vWorld, sunDirection), 0.0);
        float halo = pow(sunFacing, 11.0);
        float disk = smoothstep(0.997, 0.999, sunFacing);
        color += uSun * halo * 0.28;
        color += vec3(1.0, 0.86, 0.94) * disk * 0.78;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), [landscapeIndex, profile, reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    material.uniforms.uLandscapeMode.value = landscapeIndex;
  });

  return (
    <mesh scale={72} material={material}>
      <sphereGeometry args={[1, 28, 16]} />
    </mesh>
  );
}

function Clouds({
  reducedMotion,
  profile,
}: {
  reducedMotion: boolean;
  profile: MusicWorldProfile;
}) {
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
          scale={cloud.scale * (profile.worldForm === 'terraces' ? 1.35 : 1)}
        >
          {[
            [-1.5, -0.05, 0, 1.35],
            [-0.65, 0.28, 0.02, 1.2],
            [0.18, 0.46, 0, 1.35],
            [1.05, 0.12, 0.04, 1.3],
            [1.7, -0.08, 0.08, 1.05],
            [-0.15, -0.23, 0.11, 1.55],
          ].map(([x, y, z, scale], index) => (
            <mesh
              key={index}
              position={[x, y, z]}
              scale={[scale * 1.35, scale * 0.58, scale * 0.66]}
              renderOrder={2}
            >
              <sphereGeometry args={[1, 10, 7]} />
              <meshBasicMaterial
                color={index === 5 ? profile.cloud[1] : profile.cloud[0]}
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

function DistantBirds({ reducedMotion }: { reducedMotion: boolean }) {
  const birds = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const birdData = useMemo(() => {
    const random = seededRandom(9184);
    return Array.from(
      { length: PIANO_CLEARING_PERFORMANCE.distantBirds },
      (_, index) => ({
        x: -3.5 + index * 3.3 + (random() - 0.5) * 1.2,
        y: 8.2 + random() * 2.8,
        z: -22 - random() * 11,
        phase: random() * Math.PI * 2,
        scale: 0.58 + random() * 0.24,
        travel: 1.6 + random() * 2,
      }),
    );
  }, []);
  const geometry = useMemo(() => {
    const bird = new THREE.BufferGeometry();
    bird.setAttribute('position', new THREE.Float32BufferAttribute([
      -0.62, 0.02, 0,
      -0.08, 0, 0,
      -0.34, 0.22, 0,
      0.08, 0, 0,
      0.62, 0.02, 0,
      0.34, 0.22, 0,
    ], 3));
    bird.computeVertexNormals();
    return bird;
  }, []);

  useFrame(({ clock }) => {
    if (!birds.current) return;
    const time = reducedMotion ? 0 : clock.elapsedTime;

    birdData.forEach((bird, index) => {
      const glide = Math.sin(time * 0.075 + bird.phase);
      const lift = Math.sin(time * 0.16 + bird.phase * 1.7);
      const flap = reducedMotion
        ? 0.72
        : 0.7 + Math.sin(time * (1.4 + index * 0.06) + bird.phase) * 0.24;
      dummy.position.set(
        bird.x + glide * bird.travel,
        bird.y + lift * 0.18,
        bird.z,
      );
      dummy.rotation.set(0, 0, glide * 0.055);
      dummy.scale.set(bird.scale, bird.scale * flap, bird.scale);
      dummy.updateMatrix();
      birds.current?.setMatrixAt(index, dummy.matrix);
    });
    birds.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={birds}
      args={[geometry, undefined, PIANO_CLEARING_PERFORMANCE.distantBirds]}
      frustumCulled={false}
    >
      <meshBasicMaterial
        color="#34345f"
        transparent
        opacity={0.68}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
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
        vec3 ivory = vec3(1.0, 0.71, 0.87);
        vec3 blue = vec3(0.57, 0.7, 1.0);
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
            <meshBasicMaterial color="#746da9" transparent opacity={0.19} depthWrite={false} />
          </mesh>
          <mesh position={[0, -0.82, 0]} scale={[0.48, 0.64, 0.48]}>
            <coneGeometry args={[1, 1.8, 5]} />
            <meshBasicMaterial color="#655f9b" transparent opacity={0.16} depthWrite={false} />
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

function CanvasLifecycle({
  onContextLost,
  onContextRestored,
}: {
  onContextLost: () => void;
  onContextRestored: () => void;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
    };
  }, [gl, onContextLost, onContextRestored]);

  return null;
}

function AdaptivePixelRatio({
  enabled,
  onQualityChange,
}: {
  enabled: boolean;
  onQualityChange: (quality: MusicLiquidQuality) => void;
}) {
  const { setDpr } = useThree();
  const tier = useRef(0);
  const elapsed = useRef(0);
  const frames = useRef(0);
  const recoveryWindows = useRef(0);
  const dprTiers = useMemo(() => {
    const nativeDpr = Math.min(
      typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1,
      PIANO_CLEARING_PERFORMANCE.maxDpr,
    );
    return [nativeDpr, Math.min(nativeDpr, 1), 0.88, 0.75]
      .filter((value, index, values) => (
        value <= nativeDpr && values.indexOf(value) === index
      ));
  }, []);

  useFrame((_state, delta) => {
    if (!enabled) return;
    // Ignore long pauses caused by tab switches and devtools breakpoints.
    if (delta > 0.2) return;
    elapsed.current += delta;
    frames.current += 1;
    if (elapsed.current < 1.25) return;

    const fps = frames.current / elapsed.current;
    elapsed.current = 0;
    frames.current = 0;

    if (fps < 53 && tier.current < dprTiers.length - 1) {
      tier.current += 1;
      recoveryWindows.current = 0;
      setDpr(dprTiers[tier.current]);
      onQualityChange(tier.current >= 2 ? 'calm' : 'balanced');
      return;
    }

    if (fps > 58 && tier.current > 0) {
      recoveryWindows.current += 1;
      if (recoveryWindows.current >= 8) {
        tier.current -= 1;
        recoveryWindows.current = 0;
        setDpr(dprTiers[tier.current]);
        onQualityChange(tier.current === 0 ? 'full' : 'balanced');
      }
      return;
    }

    recoveryWindows.current = 0;
  });

  return null;
}

const PianoClearingScene = memo(function PianoClearingScene({
  reducedMotion,
  musicLiquidProof,
  musicLandscape,
  liquidQuality,
  onLiquidQualityChange,
  onContextLost,
  onContextRestored,
}: {
  reducedMotion: boolean;
  musicLiquidProof: boolean;
  musicLandscape: MusicLiquidLandscapeId;
  liquidQuality: MusicLiquidQuality;
  onLiquidQualityChange: (quality: MusicLiquidQuality) => void;
  onContextLost: () => void;
  onContextRestored: () => void;
}) {
  const liquidRuntime = useMemo(() => createMusicLiquidRuntime(), []);
  const liquidEnabled = musicLiquidProof && liquidQuality !== 'failure';
  const landscapeIndex = musicLiquidLandscapeIndex(musicLandscape);
  const worldProfile = MUSIC_WORLD_PROFILES[musicLandscape];

  useEffect(() => {
    liquidRuntime.qualityWeight = musicLiquidQualityWeight(liquidQuality);
    liquidRuntime.motionScale = musicLiquidMotionScale(liquidQuality);
    if (!liquidEnabled) {
      liquidRuntime.attention = 0;
      liquidRuntime.pianoReply = 0;
      liquidRuntime.riverReply = 0;
    }
  }, [liquidEnabled, liquidQuality, liquidRuntime]);

  return (
    <>
      <CanvasLifecycle
        onContextLost={onContextLost}
        onContextRestored={onContextRestored}
      />
      {liquidEnabled ? (
        <MusicLiquidInteractionController
          runtime={liquidRuntime}
          reducedMotion={reducedMotion}
        />
      ) : null}
      <SkyDome
        reducedMotion={reducedMotion}
        profile={worldProfile}
        landscapeIndex={landscapeIndex}
      />
      <fogExp2 attach="fog" args={[worldProfile.fog, 0.017]} />
      <hemisphereLight args={[worldProfile.sky[1], worldProfile.ground[0], 1.88]} />
      <directionalLight position={[-9, 10, 4]} color={worldProfile.keyLight} intensity={2.7} />
      <pointLight
        position={[10.5, 8.8, -1.5]}
        color={worldProfile.keyLight}
        intensity={1.35}
        distance={28}
        decay={1.7}
      />
      <DistantLandscape profile={worldProfile} />
      <Ground
        reducedMotion={reducedMotion}
        musicLiquidProof={liquidEnabled}
        musicLandscapeIndex={landscapeIndex}
        profile={worldProfile}
        liquidRuntime={liquidRuntime}
      />
      {liquidEnabled ? (
        <>
          <MusicLandscapeAccents
            landscape={musicLandscape}
            reducedMotion={reducedMotion}
          />
          <WorldScaleMusicForms
            landscape={musicLandscape}
            profile={worldProfile}
            reducedMotion={reducedMotion}
          />
          {musicLandscape === 'combined-world' ? (
            <MirroredScoreCanopy reducedMotion={reducedMotion} />
          ) : null}
          <MusicWorldAirborneMatter
            landscape={musicLandscape}
            reducedMotion={reducedMotion}
          />
          <DistantFireSmoke
            visible={musicLandscape === 'nacre-terraces' || musicLandscape === 'combined-world'}
            reducedMotion={reducedMotion}
            combined={musicLandscape === 'combined-world'}
          />
        </>
      ) : null}
      <Stream
        reducedMotion={reducedMotion}
        liquidRuntime={liquidRuntime}
        musicLiquidProof={liquidEnabled}
      />
      <StoneViaduct profile={worldProfile} />
      <GrassField
        reducedMotion={reducedMotion}
        musicLiquidProof={liquidEnabled}
        musicLandscapeIndex={landscapeIndex}
        profile={worldProfile}
        liquidRuntime={liquidRuntime}
      />
      <ValleyDetails />
      <RavineAccents />
      <Suspense fallback={null}>
        <ParticlePiano
          reducedMotion={reducedMotion}
          musicLiquidProof={liquidEnabled}
          liquidRuntime={liquidRuntime}
        />
      </Suspense>
      <PianistAndBench
        reducedMotion={reducedMotion}
        musicWorldActive={musicLiquidProof && musicLandscape === 'combined-world'}
      />
      <Clouds reducedMotion={reducedMotion} profile={worldProfile} />
      <DistantBirds reducedMotion={reducedMotion} />
      <DistantSkyForms reducedMotion={reducedMotion} />
      <AtmosphericMotes reducedMotion={reducedMotion} />
      <ForegroundFraming reducedMotion={reducedMotion} />
      <CameraRig reducedMotion={reducedMotion} />
      <AdaptivePixelRatio
        enabled={!reducedMotion}
        onQualityChange={onLiquidQualityChange}
      />
    </>
  );
});

function PracticeGlyph({ practice }: { practice: PracticeId }) {
  if (practice === 'music-performance') {
    return (
      <svg viewBox="0 0 96 38" role="presentation">
        <path d="M2 23 C13 8 20 34 32 19 S51 8 62 21 S80 31 94 13" />
        <path d="M2 29 C16 19 25 33 38 24 S61 15 73 25 S87 25 94 21" />
        <circle cx="32" cy="19" r="2.4" />
        <circle cx="62" cy="21" r="2.4" />
      </svg>
    );
  }

  if (practice === 'life-systems-tools') {
    return (
      <svg viewBox="0 0 96 38" role="presentation">
        <path d="M9 27 H30 L39 18 H58 L67 10 H88" />
        <path d="M9 12 H24 L34 22 H53 L63 29 H88" />
        <rect x="5" y="23" width="8" height="8" rx="1" />
        <rect x="44" y="14" width="8" height="8" rx="1" />
        <rect x="83" y="6" width="8" height="8" rx="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 38" role="presentation">
      <path d="M19 9 L38 19 L19 29 M77 9 L58 19 L77 29 M38 19 H58" />
      <circle cx="18" cy="9" r="4" />
      <circle cx="18" cy="29" r="4" />
      <circle cx="78" cy="9" r="4" />
      <circle cx="78" cy="29" r="4" />
      <circle cx="48" cy="19" r="4.5" />
    </svg>
  );
}

function PracticeInstruments() {
  const [worldState, dispatchWorld] = useReducer(
    reducePracticeWorld,
    undefined,
    createPracticeWorldState,
  );
  const [moduleStatus, setModuleStatus] = useState<PracticeWorldLoadStatus>('unavailable');
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const activePractice = worldState.owner;

  useEffect(() => {
    const localDevelopmentHost = window.location.hostname === 'localhost'
      || window.location.hostname === '127.0.0.1';
    setShowDiagnostics(practiceWorldDiagnosticsEnabled(
      localDevelopmentHost ? 'development' : process.env.NODE_ENV,
      window.location.search,
    ));
  }, []);

  useEffect(() => {
    if (worldState.phase !== 'retreat') return;
    const frame = window.requestAnimationFrame(() => {
      dispatchWorld({ type: 'retreat-complete' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [worldState.phase, worldState.transition]);

  useEffect(() => {
    const owner = worldState.owner;
    if (!owner || worldState.phase === 'neutral' || worldState.phase === 'retreat') {
      setModuleStatus(owner ? practiceWorldRegistry.status(owner) : 'unavailable');
      return;
    }
    if (!practiceWorldRegistry.has(owner)) {
      setModuleStatus('unavailable');
      return;
    }

    let active = true;
    setModuleStatus('loading');
    practiceWorldRegistry.load(owner)
      .then(() => {
        if (active) setModuleStatus(practiceWorldRegistry.status(owner));
      })
      .catch(() => {
        if (active) setModuleStatus('error');
      });
    return () => {
      active = false;
    };
  }, [worldState.owner, worldState.phase]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || worldState.phase === 'neutral') return;
      event.preventDefault();
      dispatchWorld({ type: 'retreat' });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [worldState.phase]);

  return (
    <>
      <nav
        className={styles.practiceField}
        aria-label="Project practices"
        data-category-screens="three-practice-instruments"
        data-active-practice={activePractice ?? 'neutral'}
        data-world-phase={worldState.phase}
        data-world-owner={worldState.owner ?? 'none'}
        data-world-runtime-count="0"
      >
        {PRACTICE_IDS.map((practice, index) => {
          const definition = PRACTICE_DEFINITIONS[practice];
          const active = activePractice === practice;
          const selected = worldState.phase === 'selected'
            && worldState.owner === practice;
          return (
            <div
              className={styles.instrumentSlot}
              data-practice-position={practice}
              key={practice}
            >
              <button
                className={styles.practiceInstrument}
                type="button"
                aria-label={`${definition.title}. ${definition.summary}`}
                aria-pressed={selected}
                data-practice-screen={practice}
                data-active={active ? 'true' : 'false'}
                onClick={() => dispatchWorld({ type: 'select', id: practice })}
                onFocus={() => dispatchWorld({
                  type: 'attend',
                  id: practice,
                  source: 'focus',
                })}
                onBlur={() => dispatchWorld({
                  type: 'release',
                  id: practice,
                  source: 'focus',
                })}
                onPointerEnter={() => dispatchWorld({
                  type: 'attend',
                  id: practice,
                  source: 'pointer',
                })}
                onPointerLeave={() => dispatchWorld({
                  type: 'release',
                  id: practice,
                  source: 'pointer',
                })}
              >
                <span className={styles.instrumentTopline}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{active ? 'signal held' : 'practice signal'}</span>
                </span>
                <span className={styles.instrumentGlyph} aria-hidden="true">
                  <PracticeGlyph practice={practice} />
                </span>
                <strong>{definition.title}</strong>
                <span className={styles.instrumentPulse} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </nav>
      {showDiagnostics ? (
        <output className={styles.worldDiagnostics} data-world-diagnostics="">
          <span>world {worldState.phase}</span>
          <span>owner {worldState.owner ?? 'none'}</span>
          <span>module {moduleStatus}</span>
          <span>runtimes 0</span>
        </output>
      ) : null}
    </>
  );
}

function MusicLandscapeReview({
  active,
  onChange,
}: {
  active: MusicLiquidLandscapeId;
  onChange: (landscape: MusicLiquidLandscapeId) => void;
}) {
  const activeLandscape = MUSIC_LIQUID_LANDSCAPES.find(landscape => landscape.id === active)
    ?? MUSIC_LIQUID_LANDSCAPES[0];

  return (
    <section className={styles.landscapeReview} aria-label="Music landscape review selector">
      <header>
        <span>Music world studies</span>
        <strong>{activeLandscape.title}</strong>
        <small>{activeLandscape.note}</small>
      </header>
      <div className={styles.landscapeChoices}>
        {MUSIC_LIQUID_LANDSCAPES.map((landscape, index) => (
          <button
            key={landscape.id}
            type="button"
            data-active={landscape.id === active}
            onClick={() => onChange(landscape.id)}
            aria-pressed={landscape.id === active}
            aria-label={`Show ${landscape.title}`}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {landscape.title}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function PianoClearingProof({
  musicLiquidProof = false,
}: {
  musicLiquidProof?: boolean;
}) {
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [liquidQuality, setLiquidQuality] = useState<MusicLiquidQuality>('full');
  const [musicLandscape, setMusicLandscape] = useState<MusicLiquidLandscapeId>('combined-world');

  const handleContextLost = useCallback(() => setLiquidQuality('failure'), []);
  // Keep the expensive optional territory disabled after a context recovery.
  // A refresh can opt back in after the browser has returned to a stable state.
  const handleContextRestored = useCallback(() => setLiquidQuality('failure'), []);
  const handleLiquidQualityChange = useCallback((quality: MusicLiquidQuality) => {
    setLiquidQuality(current => current === 'failure' ? current : quality);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      setReducedMotion(motion.matches);
      if (!motion.matches) {
        const deviceMemory = (
          navigator as Navigator & { deviceMemory?: number }
        ).deviceMemory;
        setLiquidQuality(current => current === 'failure' ? current : musicLiquidInitialQuality({
          reducedMotion: false,
          webglAvailable: true,
          hardwareConcurrency: navigator.hardwareConcurrency,
          deviceMemory,
        }));
      }
    };
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

  const effectiveLiquidQuality: MusicLiquidQuality = reducedMotion
    ? 'reduced'
    : liquidQuality;

  return (
    <main
      className={styles.world}
      data-piano-clearing-proof=""
      data-music-liquid-proof={musicLiquidProof ? 'terrain-conforming-organic' : 'off'}
      data-music-landscape={musicLiquidProof ? musicLandscape : 'off'}
      data-music-liquid-quality={musicLiquidProof ? effectiveLiquidQuality : 'off'}
      data-river-flow="far-to-foreground"
      data-grass-wind="0.34"
      data-cloud-streaks="procedural-wisps"
      data-piano-shadow="terrain-authored-dusk"
      data-grass-cursor="terrain-local-3.2"
      data-distant-birds={PIANO_CLEARING_PERFORMANCE.distantBirds}
      data-color-script="dusk-refrain"
      data-scene-budget={`${PIANO_CLEARING_PERFORMANCE.grassInstances}+${PIANO_CLEARING_PERFORMANCE.foregroundGrassInstances}-grass/${PIANO_CLEARING_PERFORMANCE.pianoParticles}-piano-points/no-post`}
    >
      <SceneErrorBoundary>
        <Canvas
          className={styles.canvas}
          dpr={[0.75, PIANO_CLEARING_PERFORMANCE.maxDpr]}
          frameloop={pageVisible && !reducedMotion ? 'always' : 'demand'}
          gl={{
            antialias: false,
            alpha: false,
            stencil: false,
            powerPreference: 'high-performance',
          }}
          camera={{
            position: [...PIANO_CLEARING_CAMERA.position],
            fov: PIANO_CLEARING_CAMERA.fov,
            near: 0.1,
            far: 145,
          }}
        >
          <PianoClearingScene
            reducedMotion={reducedMotion}
            musicLiquidProof={musicLiquidProof}
            musicLandscape={musicLandscape}
            liquidQuality={effectiveLiquidQuality}
            onLiquidQualityChange={handleLiquidQualityChange}
            onContextLost={handleContextLost}
            onContextRestored={handleContextRestored}
          />
        </Canvas>
      </SceneErrorBoundary>
      <div aria-hidden="true" className={styles.cloudStreaks} />
      <div aria-hidden="true" className={styles.atmosphere} />
      <div aria-hidden="true" className={styles.dramaticLight} />
      <div aria-hidden="true" className={styles.sunWash} />
      <div aria-hidden="true" className={styles.grain} />
      <PracticeInstruments />
      {musicLiquidProof ? (
        <MusicLandscapeReview active={musicLandscape} onChange={setMusicLandscape} />
      ) : null}
      <p className={styles.proofLabel}>
        {musicLiquidProof ? 'Music world composition MW1-C' : 'Environmental proof 84'}
        <strong>
          {musicLiquidProof
            ? MUSIC_LIQUID_LANDSCAPES.find(landscape => landscape.id === musicLandscape)?.title
            : 'Dusk Refrain'}
        </strong>
      </p>
    </main>
  );
}

useGLTF.preload('/models/grand_piano/grand_piano_(GLB).gltf');
