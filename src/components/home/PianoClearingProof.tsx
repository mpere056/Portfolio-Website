'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
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
        float territory = musicLandscapeMask(territoryLocal, uLandscapeMode)
          * elevatedMeadow * uLiquidWeight;
        float liquidTime = uTime * ${MUSIC_LIQUID_PROOF.travelSpeed} * uLiquidMotion;
        vec2 pressureUv = territoryLocal;
        pressureUv.x -= liquidTime * 0.11;
        pressureUv.y += sin(territoryLocal.x * 5.1 + liquidTime * 0.19) * 0.17;
        pressureUv.x += sin(territoryLocal.y * 6.7 - liquidTime * 0.13) * 0.09;
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
        float liquidState = territory * clamp(
          0.78 + pressureBody * 0.2 + crossPressure * 0.12
          + trailingMemory * 0.1 + localAttention * 0.16,
          0.0,
          1.0
        ) * (1.0 - harmonicMode) * (1.0 - fireMode);
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
        blade.y *= bladeHeight
          * (0.84 + clump * 0.24 + variation * 0.08)
          * mix(1.0, 1.18 + sin(uTime * 2.1 + phase * 2.4) * 0.16, fireMode)
          * mix(1.0, 0.045, liquidState);
        vec3 oriented = vec3(
          blade.x * angleCos,
          blade.y,
          blade.x * angleSin
        );
        oriented.x += breeze * uv.y * uv.y * uWind;
        oriented.x += fireMode * sin(uTime * 2.8 + phase * 3.1 + uv.y * 5.0)
          * 0.12 * uv.y * uv.y;
        oriented.z += fireMode * cos(uTime * 2.15 + phase * 2.3 + randomValue * 6.0)
          * 0.08 * uv.y * uv.y;
        oriented.z += (
          cos(uTime * 0.39 + phase) * 0.028
          + gust * 0.052
          + (randomValue - 0.5) * 0.035
        ) * uv.y * uWind;
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
        float fireMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 1.0));
        float flamePulse = 0.5 + 0.5 * sin(
          uTime * (2.1 + vVariation * 1.7) + vWorldRoot.x * 1.7 - vWorldRoot.y * 1.1
        );
        vec3 flameColor = mix(vec3(0.3, 0.015, 0.005), vec3(1.0, 0.16, 0.015), vUv.y);
        flameColor = mix(flameColor, vec3(1.0, 0.9, 0.32), smoothstep(0.64, 1.0, vUv.y));
        flameColor *= 0.78 + flamePulse * 0.52 * smoothstep(0.18, 1.0, vUv.y);
        color = mix(color, flameColor, fireMode * 0.96);
        float harmonicMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 4.0));
        float scoreA = sin(vWorldRoot.x * 0.72 + vWorldRoot.y * 0.17 - uTime * 1.25 * uLiquidMotion);
        float scoreB = sin(vWorldRoot.x * 0.27 - vWorldRoot.y * 0.61 - uTime * 0.82 * uLiquidMotion + 1.8);
        float scoreC = sin(length(vWorldRoot - vec2(7.0, 4.0)) * 1.18 - uTime * 1.48 * uLiquidMotion);
        float scoreLight = smoothstep(0.78, 0.99, scoreA * 0.48 + scoreB * 0.28 + scoreC * 0.34);
        vec3 scoreColor = mix(vec3(0.45, 0.28, 1.0), vec3(1.0, 0.62, 0.87), 0.5 + 0.5 * scoreB);
        scoreColor = mix(scoreColor, vec3(1.0, 0.84, 0.48), smoothstep(0.9, 1.0, scoreC));
        color = mix(color, scoreColor * 1.25, harmonicMode * scoreLight * (0.42 + vUv.y * 0.58));
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
            float amplitude = 0.56;
            for (int octave = 0; octave < 3; octave++) {
              value += liquidNoise(point) * amplitude;
              point = mat2(1.6, 1.2, -1.2, 1.6) * point + vec2(1.7, 3.1);
              amplitude *= 0.48;
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
            float amplitude = 0.56;
            for (int octave = 0; octave < 3; octave++) {
              value += liquidNoise(point) * amplitude;
              point = mat2(1.6, 1.2, -1.2, 1.6) * point + vec2(1.7, 3.1);
              amplitude *= 0.48;
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
            float territory = musicLandscapeMask(territoryLocal, uLandscapeMode)
              * elevatedMeadow * uLiquidWeight;
            float liquidTime = uTime * ${MUSIC_LIQUID_PROOF.travelSpeed} * uMotion;
            vec2 pressureUv = territoryLocal * vec2(2.15, 2.65);
            pressureUv += vec2(-liquidTime * 0.16, liquidTime * 0.035);
            vec2 warp = vec2(
              liquidFbm(pressureUv * 0.72 + vec2(0.0, liquidTime * 0.06)),
              liquidFbm(pressureUv * 0.72 + vec2(4.6, -liquidTime * 0.045))
            ) - 0.5;
            vec2 organicUv = pressureUv + warp * 1.05;
            float pressureField = liquidFbm(organicUv);
            float detailField = liquidFbm(organicUv * 1.9 + vec2(-liquidTime * 0.08, 7.3));
            float pressureBody = smoothstep(0.43, 0.77, pressureField * 0.76 + detailField * 0.24);
            float crossPressure = smoothstep(0.52, 0.82, liquidFbm(organicUv * 1.27 + vec2(8.1, -3.4)));
            float localAttention = uLiquidAttention
              * (1.0 - smoothstep(0.05, ${MUSIC_LIQUID_PROOF.attentionRadius}, distance(territoryLocal, uLiquidPointer)));
            float harmonicMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 4.0));
            float fireMode = 1.0 - smoothstep(0.08, 0.18, abs(uLandscapeMode - 1.0));
            float liquidState = territory * clamp(
              0.78 + pressureBody * 0.2 + crossPressure * 0.12 + localAttention * 0.18,
              0.0,
              1.0
            ) * (1.0 - harmonicMode) * (1.0 - fireMode);
            float emberVein = smoothstep(0.7, 0.96, liquidFbm(
              vWorld.xz * 0.34 + vec2(-uTime * 0.08 * uMotion, uTime * 0.035 * uMotion)
            ));
            vec3 emberGround = mix(vec3(0.035, 0.008, 0.006), vec3(0.92, 0.12, 0.018), emberVein);
            color = mix(color, emberGround, fireMode * (0.62 + emberVein * 0.3));
            vec3 liquidDeep = vec3(0.1, 0.16, 0.42);
            vec3 liquidNacre = vec3(0.42, 0.62, 0.82);
            vec3 liquidPearl = vec3(0.89, 0.66, 0.88);
            if (uLandscapeMode > 0.5 && uLandscapeMode < 1.5) {
              liquidDeep = vec3(0.22, 0.12, 0.35);
              liquidNacre = vec3(0.82, 0.58, 0.68);
              liquidPearl = vec3(1.0, 0.84, 0.68);
            } else if (uLandscapeMode > 1.5 && uLandscapeMode < 2.5) {
              liquidDeep = vec3(0.07, 0.22, 0.34);
              liquidNacre = vec3(0.28, 0.8, 0.75);
              liquidPearl = vec3(0.78, 0.76, 1.0);
            } else if (uLandscapeMode > 2.5 && uLandscapeMode < 3.5) {
              liquidDeep = vec3(0.08, 0.2, 0.38);
              liquidNacre = vec3(0.16, 0.78, 0.9);
              liquidPearl = vec3(1.0, 0.66, 0.36);
            } else if (uLandscapeMode > 3.5) {
              liquidDeep = vec3(0.2, 0.08, 0.44);
              liquidNacre = vec3(0.56, 0.34, 0.86);
              liquidPearl = vec3(0.98, 0.62, 0.88);
            }
            float liquidVein = 1.0 - abs(
              liquidFbm(organicUv * 2.35 + vec2(liquidTime * 0.06, -liquidTime * 0.1)) * 2.0 - 1.0
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
            vec3 terrainLitLiquid = color * 0.34 + liquidColor * 0.76;
            color = mix(color, terrainLitLiquid, liquidState * 0.72);
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
    blending: THREE.NormalBlending,
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
  const visible = landscape === 'nacre-terraces' || landscape === 'glass-delta';
  const fire = landscape === 'nacre-terraces';
  const count = fire ? 180 : 220;
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
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uMotion: { value: reducedMotion ? 0 : 1 },
      uFire: { value: fire ? 1 : 0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uMotion;
      uniform float uFire;
      attribute vec4 aSeed;
      varying float vLife;
      varying float vFire;
      varying float vTurn;
      void main() {
        vec3 transformed = position;
        float time = uTime * uMotion;
        if (uFire > 0.5) {
          float rise = fract(aSeed.w + time * mix(0.045, 0.11, aSeed.y));
          transformed.y += 0.2 + rise * mix(2.0, 7.0, aSeed.z);
          transformed.x += sin(time * 1.2 + aSeed.x * 31.0 + rise * 6.0) * (0.16 + rise * 0.55);
          transformed.z += cos(time * 0.8 + aSeed.y * 27.0) * 0.2;
          vLife = sin(rise * 3.14159265);
        } else {
          float drift = fract(aSeed.w + time * mix(0.018, 0.038, aSeed.y));
          transformed.x += drift * 13.0 - 6.5;
          transformed.y += 1.2 + sin(time * 0.34 + aSeed.x * 18.0) * 1.35 + aSeed.y * 5.0;
          transformed.z += sin(time * 0.21 + aSeed.z * 22.0 + drift * 4.0) * 2.1;
          vLife = smoothstep(0.0, 0.12, drift) * (1.0 - smoothstep(0.82, 1.0, drift));
        }
        vec4 viewPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        float projectedSize = mix(1.4, 4.2, aSeed.y) * (28.0 / max(4.0, -viewPosition.z));
        gl_PointSize = min(mix(14.0, 10.0, uFire), projectedSize);
        vFire = uFire;
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
  }), [fire, reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
    material.uniforms.uFire.value = fire ? 1 : 0;
  });

  if (!visible) return null;
  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={6}
      userData={{
        worldEcology: fire ? 'fire-embers' : 'spring-cherry-petals',
      }}
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
  const deltaCurves = useMemo(() => [
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(...landscapePoint(2.5, 4.2, 0.24)),
      new THREE.Vector3(...landscapePoint(8.2, 5.4, 0.3)),
      new THREE.Vector3(...landscapePoint(14.2, 6.7, 0.2)),
      new THREE.Vector3(...landscapePoint(22.8, 8.3, 0.28)),
    ]), 48, 0.065, 5, false),
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(...landscapePoint(5.2, 8.9, 0.21)),
      new THREE.Vector3(...landscapePoint(10.8, 7.6, 0.28)),
      new THREE.Vector3(...landscapePoint(15.4, 5.9, 0.22)),
      new THREE.Vector3(...landscapePoint(21.4, 3.8, 0.26)),
    ]), 48, 0.046, 5, false),
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(...landscapePoint(7.4, 1.8, 0.2)),
      new THREE.Vector3(...landscapePoint(11.8, 3.2, 0.25)),
      new THREE.Vector3(...landscapePoint(16.7, 4.6, 0.2)),
      new THREE.Vector3(...landscapePoint(24.2, 4.1, 0.24)),
    ]), 48, 0.038, 5, false),
  ], []);

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

  if (landscape === 'resonant-archipelago') {
    const islands = [
      [7.2, 5.6, 0.48, 0.74],
      [10.8, 2.8, 0.72, 1.04],
      [14.7, 7.4, 0.54, 0.82],
      [18.4, 4.1, 0.9, 1.28],
      [22.3, 7.9, 0.42, 0.64],
      [15.6, 10.8, 0.36, 0.56],
    ] as const;
    return (
      <group ref={group} userData={{ musicLandscapeAccent: 'resonant-archipelago' }}>
        {islands.map(([x, z, radius, lift], index) => (
          <group key={index} position={landscapePoint(x, z, lift)}>
            <mesh scale={[1.5, 0.52, 1.1]} renderOrder={3}>
              <sphereGeometry args={[radius, 24, 12]} />
              <meshBasicMaterial
                color={index % 2 === 0 ? '#73f4df' : '#bcb5ff'}
                transparent
                opacity={0.32}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={4}>
              <torusGeometry args={[radius * 1.2, 0.025, 6, 32]} />
              <meshBasicMaterial color="#d8fff8" transparent opacity={0.42} depthWrite={false} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (landscape === 'glass-delta') {
    return (
      <group
        ref={group}
        userData={{ musicLandscapeAccent: 'glass-delta' }}
      >
        {deltaCurves.map((geometry, index) => (
          <mesh key={index} geometry={geometry} renderOrder={4}>
            <meshBasicMaterial
              color={index === 0 ? '#c4e7ff' : index === 1 ? '#ffd0e7' : '#e2d5ff'}
              transparent
              opacity={index === 0 ? 0.58 : 0.38}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
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
  const deltaRoutes = useMemo(() => [
    musicWorldTube([[-24, 0.4, -47], [-15, -0.4, -30], [-3, 0.2, -16], [9, 1.1, -2], [25, 0.4, 12]], 0.18),
    musicWorldTube([[-16, 2.2, -43], [-7, 1.2, -27], [5, 0.7, -14], [16, 1.7, 1], [29, 1.1, 10]], 0.1),
    musicWorldTube([[26, 1.4, -42], [15, 0.4, -26], [8, 1.5, -13], [-4, 0.2, 2], [-18, -0.2, 11]], 0.12),
  ], []);
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

  if (landscape === 'tidal-meadow') {
    const blooms = Array.from({ length: 15 }, (_, index): WorldInstanceTransform & { palette: number } => {
      const angle = (index / 15) * Math.PI * 2;
      const radius = index < 8 ? 13 : 24;
      return {
        position: [
          Math.cos(angle) * radius + (index % 3) * 2,
          index < 8 ? 1.1 + (index % 2) * 0.7 : 4.2 + (index % 3),
          Math.sin(angle) * radius - 14,
        ],
        scale: [index < 8 ? 4.8 : 7.2, 0.28, (index < 8 ? 4.8 : 7.2) * 0.56],
        rotation: [0, angle, 0],
        palette: index % 3,
      };
    });
    const bloomPalette = [
      ['#f49ac5', '#b83c78'],
      ['#88d9dc', '#357ba1'],
      ['#8a78dc', '#357ba1'],
    ] as const;
    return (
      <group ref={group} userData={{ musicWorldForm: 'ocean-bloom' }}>
        <mesh position={[0, -0.7, -20]} rotation={[-Math.PI / 2, 0, 0]} scale={[58, 62, 1]}>
          <circleGeometry args={[1, 72]} />
          <meshStandardMaterial
            color="#315d9f"
            emissive="#294f91"
            emissiveIntensity={0.34}
            transparent
            opacity={0.32}
            roughness={0.16}
            metalness={0.08}
            depthWrite={false}
          />
        </mesh>
        {bloomPalette.map(([color, emissive], palette) => (
          <WorldInstances key={color} items={blooms.filter(bloom => bloom.palette === palette)}>
            <sphereGeometry args={[1, 20, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={emissive}
                emissiveIntensity={0.32}
                transparent
                opacity={0.42}
                roughness={0.34}
                depthWrite={false}
              />
          </WorldInstances>
        ))}
      </group>
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

  if (landscape === 'resonant-archipelago') {
    const islands = Array.from({ length: 14 }, (_, index) => {
      const scale = 2.4 + (index % 4) * 0.75;
      return {
        position: [-31 + (index % 7) * 10.5 + (index % 2) * 2.2, 2.5 + Math.floor(index / 7) * 7 + (index % 3) * 1.4, -18 - Math.floor(index / 7) * 25 - (index % 4) * 3] as [number, number, number],
        scale,
        palette: index % 2,
      };
    });
    const islandTops = islands.map(island => ({
      position: island.position,
      scale: [island.scale * 1.7, island.scale * 0.34, island.scale] as [number, number, number],
      palette: island.palette,
    }));
    const islandRoots = islands.map(island => ({
      position: [island.position[0], island.position[1] - island.scale * 0.8, island.position[2]] as [number, number, number],
      scale: [island.scale, island.scale * 1.6, island.scale * 0.7] as [number, number, number],
    }));
    const islandRings = islands.map(island => ({
      position: island.position,
      rotation: [Math.PI / 2, 0, 0] as [number, number, number],
      scale: [island.scale * 1.35, island.scale * 1.35, island.scale * 1.35] as [number, number, number],
    }));
    return (
      <group ref={group} userData={{ musicWorldForm: 'suspended-archipelago' }}>
        {[0, 1].map(palette => (
          <WorldInstances key={palette} items={islandTops.filter(item => item.palette === palette)}>
              <dodecahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color={palette ? '#58c8b0' : '#82d8ce'}
                emissive="#1b716f"
                emissiveIntensity={0.3}
                roughness={0.52}
              />
          </WorldInstances>
        ))}
        <WorldInstances items={islandRoots}>
              <coneGeometry args={[1, 1.7, 7]} />
              <meshToonMaterial color="#173d56" />
        </WorldInstances>
        <WorldInstances items={islandRings}>
              <torusGeometry args={[1, 0.026, 5, 32]} />
              <meshBasicMaterial color="#b9fff0" transparent opacity={0.62} depthWrite={false} />
        </WorldInstances>
      </group>
    );
  }

  if (landscape === 'glass-delta') {
    const spires = Array.from({ length: 20 }, (_, index) => ({
      x: -32 + (index % 10) * 7.2,
      y: -0.2 + (index % 3) * 0.7,
      z: -14 - Math.floor(index / 10) * 27 - (index % 4) * 2,
      height: 2.8 + (index % 5) * 1.7,
    }));
    const spireTransforms = spires.map((spire, index) => ({
      position: [spire.x, spire.y + spire.height / 2, spire.z] as [number, number, number],
      scale: [0.65, spire.height, 0.65] as [number, number, number],
      palette: index % 3,
    }));
    const spirePalette = [
      ['#5be9e5', '#176f9e'],
      ['#ff8c65', '#b43b24'],
      ['#8aa8ff', '#176f9e'],
    ] as const;
    return (
      <group ref={group} userData={{ musicWorldForm: 'prismatic-glass-delta' }}>
        {deltaRoutes.map((geometry, index) => (
          <mesh key={index} geometry={geometry}>
            <meshBasicMaterial
              color={index === 0 ? '#53f5ff' : index === 1 ? '#ff9a62' : '#a8f8ff'}
              transparent
              opacity={0.72}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
        {spirePalette.map(([color, emissive], palette) => (
          <WorldInstances key={color} items={spireTransforms.filter(item => item.palette === palette)}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={0.46}
              transparent
              opacity={0.68}
              roughness={0.18}
              metalness={0.22}
              depthWrite={false}
            />
          </WorldInstances>
        ))}
      </group>
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

function PianistAndBench({ reducedMotion }: { reducedMotion: boolean }) {
  const player = useRef<THREE.Group>(null);
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
    const leftTravel = layeredPlayingMotion(time, 2.15) * 0.105;
    const rightTravel = layeredPlayingMotion(time, 5.4) * 0.11;
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
      player.current.rotation.x = -0.055 + phrase * 0.005;
      player.current.position.y = -0.105 + breath * 0.12;
    }
    if (head.current) {
      head.current.rotation.x = 0.12 + layeredPlayingMotion(time, 1.2) * 0.014;
      head.current.rotation.y = layeredPlayingMotion(time, 4.3) * 0.016;
    }

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
        <mesh position={[0, 0.82, 1.25]} rotation={[-0.08, 0, 0]}>
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
}: {
  reducedMotion: boolean;
  profile: MusicWorldProfile;
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
      varying vec3 vWorld;

      float cloudWisp(float x, float y, float center, float width, float phase) {
        float drift = uTime * 0.006 * uMotion;
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
        float wisps = 0.0;
        wisps += cloudWisp(x, y, 0.29, 0.045, 0.12) * 0.46;
        wisps += cloudWisp(x, y, 0.36, 0.034, 0.52) * 0.34;
        wisps += cloudWisp(x, y, 0.43, 0.025, 0.91) * 0.24;
        float skyWindow = smoothstep(-0.72, -0.36, x) * (1.0 - smoothstep(0.48, 0.78, x));
        vec3 wispColor = mix(uWisp, uUpper, height);
        color = mix(color, wispColor, wisps * skyWindow * 0.28);

        vec3 sunDirection = normalize(vec3(-0.04, 0.16, -0.99));
        float sunFacing = max(dot(vWorld, sunDirection), 0.0);
        float halo = pow(sunFacing, 11.0);
        float disk = smoothstep(0.997, 0.999, sunFacing);
        color += uSun * halo * 0.28;
        color += vec3(1.0, 0.86, 0.94) * disk * 0.78;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  }), [profile, reducedMotion]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uMotion.value = reducedMotion ? 0 : 1;
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
          scale={cloud.scale * (profile.worldForm === 'terraces' ? 1.35 : profile.worldForm === 'islands' ? 0.76 : 1)}
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
    if (elapsed.current < 2) return;

    const fps = frames.current / elapsed.current;
    elapsed.current = 0;
    frames.current = 0;

    if (fps < 47 && tier.current < dprTiers.length - 1) {
      tier.current += 1;
      recoveryWindows.current = 0;
      setDpr(dprTiers[tier.current]);
      onQualityChange(tier.current >= 2 ? 'calm' : 'balanced');
      return;
    }

    if (fps > 57 && tier.current > 0) {
      recoveryWindows.current += 1;
      if (recoveryWindows.current >= 4) {
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
      <SkyDome reducedMotion={reducedMotion} profile={worldProfile} />
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
          {musicLandscape !== 'harmonic-dunes' && musicLandscape !== 'nacre-terraces' ? (
            <LiquidTerritorySurface
              reducedMotion={reducedMotion}
              musicLandscapeIndex={landscapeIndex}
              liquidRuntime={liquidRuntime}
            />
          ) : null}
          <MusicLandscapeAccents
            landscape={musicLandscape}
            reducedMotion={reducedMotion}
          />
          <WorldScaleMusicForms
            landscape={musicLandscape}
            profile={worldProfile}
            reducedMotion={reducedMotion}
          />
          <MusicWorldAirborneMatter
            landscape={musicLandscape}
            reducedMotion={reducedMotion}
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
      <PianistAndBench reducedMotion={reducedMotion} />
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
  const [musicLandscape, setMusicLandscape] = useState<MusicLiquidLandscapeId>('tidal-meadow');

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
        {musicLiquidProof ? 'Music world gallery MW1-A' : 'Environmental proof 84'}
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
