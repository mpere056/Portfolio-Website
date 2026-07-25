'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';
import { Component, Suspense, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import {
  MUSEUM_AMBIENT_PROOF_ASPECT,
  MUSEUM_AMBIENT_PROOF_ASSETS,
  MUSEUM_AMBIENT_PROOF_RESPONSES,
  toProofAttentionPoint,
  toProofScenePlacement,
  type AmbientProofResponseProfile,
  type ProofPlateLayout,
} from '@/lib/museum/ambientProof';
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

type PointerTarget = { current: THREE.Vector2 };

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
  uniform float uAttention;
  ${NOISE_GLSL}
  void main() {
    float slowField = fbm(vUv * 3.8 + vec2(uTime * 0.011, -uTime * 0.008));
    vec2 pointerVector = vUv - uPointer;
    float pointerDistance = length(pointerVector);
    float pointerLens = exp(-pointerDistance * 8.2) * uAttention;
    float pointerRipple = sin(pointerDistance * 92.0 - uTime * 2.35) * pointerLens;
    vec2 pointerDirection = pointerVector / max(pointerDistance, 0.001);
    vec2 refractUv = vUv
      + vec2(slowField - 0.5, 0.5 - slowField) * 0.0028
      + pointerDirection * pointerRipple * 0.012;
    float chroma = pointerLens * 0.0065;
    vec3 base = vec3(
      texture2D(uTexture, refractUv + pointerDirection * chroma).r,
      texture2D(uTexture, refractUv).g,
      texture2D(uTexture, refractUv - pointerDirection * chroma).b
    );
    float farFog = fbm(vUv * vec2(3.1, 2.2) + vec2(uTime * 0.014, -uTime * 0.009));
    farFog *= smoothstep(0.18, 0.82, 1.0 - vUv.y) * 0.22;
    float rockMask = smoothstep(0.28, 0.92, 1.0 - vUv.y);
    float wave = sin(vUv.x * 37.0 + fbm(vUv * 7.0) * 6.0 - uTime * 0.31);
    float crossing = sin(vUv.y * 43.0 - vUv.x * 8.0 + uTime * 0.21);
    float caustic = pow(max(0.0, wave * crossing), 5.0) * rockMask;
    vec2 cyanPosition = vec2(0.32 + sin(uTime * 0.071) * 0.16, 0.62 + cos(uTime * 0.053) * 0.12);
    vec2 amberPosition = vec2(0.68 + cos(uTime * 0.047) * 0.13, 0.24 + sin(uTime * 0.061) * 0.09);
    float cyanPassage = exp(-distance(vUv, cyanPosition) * 7.4);
    float amberPassage = exp(-distance(vUv, amberPosition) * 8.8);
    float pointerGlow = exp(-distance(vUv, uPointer) * 13.0) * uAttention;
    vec3 cyan = vec3(0.15, 0.68, 0.73);
    vec3 amber = vec3(0.84, 0.43, 0.18);
    base += cyan * farFog;
    base += mix(cyan, amber, vUv.x) * caustic * 0.13;
    base += cyan * cyanPassage * 0.085 + amber * amberPassage * 0.07;
    base += mix(cyan, vec3(0.72, 0.91, 0.92), pointerGlow) * pointerGlow * 0.42;
    gl_FragColor = vec4(base, 1.0);
  }
`;

const CORAL_VERTEX = /* glsl */`
  varying vec2 vUv;
  uniform sampler2D uWeights;
  uniform float uTime;
  uniform float uPhase;
  uniform float uAttention;
  void main() {
    vUv = uv;
    vec4 weights = texture2D(uWeights, uv);
    vec3 transformed = position;
    float freedom = clamp(weights.r * 0.94 + weights.g * 0.26, 0.0, 1.0);
    float branchPhase = uv.x * 13.0 + uv.y * 5.7 + uPhase;
    float tide = sin(uTime * 0.57 + branchPhase) * 0.62
      + sin(uTime * 0.31 - branchPhase * 0.73) * 0.25
      + sin(uTime * 0.18 + uv.x * 29.0) * 0.13;
    float localWake = sin(uTime * 0.71 + uPhase + uv.y * 17.0) * uAttention;
    transformed.x += (tide * 0.126 + localWake * 0.066) * freedom;
    transformed.y += cos(uTime * 0.39 + branchPhase * 0.67) * weights.r * 0.041;
    transformed.x += (uv.x - 0.5) * sin(uTime * 0.27 + uPhase) * weights.g * 0.029;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const CORAL_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uWeights;
  uniform float uTime;
  uniform float uPhase;
  uniform float uAttention;
  ${NOISE_GLSL}
  void main() {
    vec3 weights = texture2D(uWeights, vUv).rgb;
    float detail = fbm(vUv * 9.0 + vec2(uTime * 0.017, -uTime * 0.013));
    float freedom = clamp(weights.r + weights.g * 0.25, 0.0, 1.0);
    vec2 sampleUv = vUv + vec2(
      sin(uTime * 0.46 + vUv.y * 15.0 + uPhase),
      cos(uTime * 0.32 + vUv.x * 11.0 - uPhase)
    ) * 0.0095 * freedom;
    vec4 texel = texture2D(uTexture, sampleUv);
    float amberSweep = pow(0.5 + 0.5 * sin(vUv.y * 14.0 - uTime * 0.92 + vUv.x * 4.0 + uPhase), 6.0);
    float cyanSweep = pow(0.5 + 0.5 * sin(vUv.x * 18.0 + uTime * 0.63 - vUv.y * 6.0), 8.0);
    vec2 poolCenter = vec2(0.38 + sin(uTime * 0.19 + uPhase) * 0.24, 0.58 + cos(uTime * 0.14) * 0.19);
    float lightPool = exp(-distance(vUv, poolCenter) * 7.0);
    float livingEdge = smoothstep(0.18, 0.82, texel.r - texel.b * 0.18 + detail * 0.24);
    texel.rgb += vec3(1.0, 0.22, 0.035) * amberSweep * livingEdge * (0.32 + uAttention * 0.38);
    texel.rgb += vec3(0.04, 0.72, 0.84) * cyanSweep * (0.14 + weights.g * 0.21 + uAttention * 0.22);
    texel.rgb += mix(vec3(1.0, 0.38, 0.08), vec3(0.12, 0.88, 0.94), detail) * lightPool * texel.a * 0.34;
    gl_FragColor = texel;
  }
`;

const ORGANISM_VERTEX = /* glsl */`
  varying vec2 vUv;
  uniform float uTime;
  uniform float uPhase;
  uniform float uAttention;
  void main() {
    vUv = uv;
    vec3 transformed = position;
    float freeBody = smoothstep(0.03, 0.5, uv.y);
    float upperBody = smoothstep(0.25, 0.9, uv.y);
    float segmented = sin(uv.y * 10.0 + uPhase) * 0.35 + sin(uv.y * 4.0 - uPhase) * 0.65;
    transformed.x += sin(uTime * 0.36 + uv.y * 5.0 + uPhase) * 0.044 * freeBody;
    transformed.x += segmented * sin(uTime * 0.23 + uPhase) * 0.028 * upperBody;
    transformed.y += sin(uTime * 0.29 + uv.x * 4.0 - uPhase) * 0.019 * freeBody;
    transformed.x += (uv.x - 0.5) * sin(uTime * 0.48 + uPhase) * 0.034 * upperBody;
    transformed.x += sin(uTime * 1.05 + uv.y * 9.0) * uAttention * 0.031 * freeBody;
    transformed.y += cos(uTime * 0.83 + uv.x * 12.0) * uAttention * 0.014 * upperBody;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const ORGANISM_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uPhase;
  uniform float uAttention;
  ${NOISE_GLSL}
  void main() {
    vec4 anchor = texture2D(uTexture, vUv);
    float field = fbm(vUv * 8.0 + vec2(uTime * 0.041, -uTime * 0.027) + uPhase);
    vec2 refractUv = vUv + vec2(field - 0.5, 0.5 - field) * (0.01 + uAttention * 0.018) * anchor.a;
    vec4 refracted = texture2D(uTexture, refractUv);
    float membrane = smoothstep(0.23, 0.82, refracted.b - refracted.r * 0.2);
    float pulse = pow(0.5 + 0.5 * sin(uTime * 0.81 + vUv.y * 11.0 + field * 4.0 + uPhase), 3.0);
    float verticalLight = exp(-abs(vUv.y - (0.52 + sin(uTime * 0.27 + uPhase) * 0.3)) * 7.0);
    float lens = exp(-distance(vUv, vec2(0.48 + sin(uTime * 0.21) * 0.12, 0.62 + cos(uTime * 0.16) * 0.18)) * 10.0);
    refracted.rgb += vec3(0.02, 0.56, 0.68) * membrane * pulse * (0.34 + uAttention * 0.42);
    refracted.rgb += vec3(0.92, 0.18, 0.025) * refracted.r * (0.1 + pulse * 0.12);
    refracted.rgb += mix(vec3(0.04, 0.76, 0.88), vec3(1.0, 0.34, 0.08), vUv.x) * (verticalLight * 0.26 + lens * 0.31) * anchor.a;
    float rootNoise = fbm(vec2(vUv.x * 7.0 - uTime * 0.028, vUv.y * 15.0 + uPhase));
    float rootedFog = 1.0 - smoothstep(0.03, 0.29, vUv.y + (rootNoise - 0.5) * 0.08);
    float rootDissolve = smoothstep(0.015, 0.28, vUv.y + (rootNoise - 0.5) * 0.12);
    refracted.rgb = mix(refracted.rgb, refracted.rgb * vec3(0.22, 0.43, 0.47), rootedFog * 0.72);
    refracted.rgb += vec3(0.035, 0.22, 0.24) * rootNoise * rootedFog * 0.16;
    refracted.a = anchor.a * mix(0.18, 1.0, rootDissolve);
    gl_FragColor = refracted;
  }
`;

const RINGS_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uRotation;
  uniform float uAttention;
  vec2 rotateAround(vec2 uv, vec2 center, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c) * (uv - center) + center;
  }
  void main() {
    vec2 center = vUv.y > 0.5 ? vec2(0.5, 0.76) : vec2(0.5, 0.25);
    float direction = vUv.y > 0.5 ? 1.0 : -0.72;
    vec2 sampleUv = rotateAround(vUv, center, uRotation * direction);
    vec4 texel = texture2D(uTexture, sampleUv);
    float light = 0.82 + 0.18 * sin(uTime * 0.71 + vUv.y * 8.0);
    texel.rgb *= light + uAttention * 0.34;
    texel.rgb += mix(vec3(0.05, 0.7, 0.82), vec3(1.0, 0.31, 0.06), vUv.y) * texel.a * (0.05 + uAttention * 0.26);
    gl_FragColor = texel;
  }
`;

const VAPOR_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uPhase;
  ${NOISE_GLSL}
  void main() {
    vec2 flow = vec2(uTime * (0.018 + uPhase * 0.002), -uTime * 0.009);
    float coarse = fbm(vUv * vec2(3.2, 4.5) + flow + uPhase);
    vec2 warpedUv = vUv + vec2(coarse - 0.5, fbm(vUv * 5.0 - flow) - 0.5) * 0.028;
    vec4 plate = texture2D(uTexture, warpedUv);
    float dissolve = smoothstep(0.12, 0.72, coarse + plate.a * 0.72);
    plate.rgb += mix(vec3(0.03, 0.23, 0.31), vec3(0.22, 0.08, 0.04), fract(uPhase * 0.37)) * coarse * 0.34;
    plate.a *= dissolve * (0.48 + 0.16 * sin(uTime * 0.18 + uPhase));
    gl_FragColor = plate;
  }
`;

const ILLUMINATION_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uAttention;
  ${NOISE_GLSL}
  void main() {
    vec2 amberPosition = vec2(0.2 + sin(uTime * 0.16) * 0.11, 0.38 + cos(uTime * 0.12) * 0.2);
    vec2 cyanPosition = vec2(0.47 + cos(uTime * 0.11) * 0.12, 0.53 + sin(uTime * 0.15) * 0.22);
    float amberRegion = exp(-distance(vUv, amberPosition) * 8.8) * smoothstep(0.66, 0.08, vUv.x);
    float cyanRegion = exp(-distance(vUv, cyanPosition) * 10.0) * smoothstep(0.78, 0.18, vUv.x);
    float ripple = pow(max(0.0, sin(distance(vUv, cyanPosition) * 92.0 - uTime * 0.82 + fbm(vUv * 7.0) * 4.0)), 10.0);
    float pointerDistance = distance(vUv, uPointer);
    float pointerLens = exp(-pointerDistance * 8.0) * uAttention;
    float aperture = (1.0 - smoothstep(0.17, 0.23, pointerDistance))
      * smoothstep(0.075, 0.125, pointerDistance) * uAttention;
    float halo = exp(-pow((pointerDistance - 0.13) * 24.0, 2.0)) * uAttention;
    float meshRing = pow(max(0.0, sin(pointerDistance * 128.0 - uTime * 1.35)), 14.0)
      * exp(-pointerDistance * 7.0) * uAttention;
    float diagonal = pow(max(0.0, sin((vUv.x + vUv.y) * 76.0 - uTime * 0.9)), 18.0)
      * exp(-pointerDistance * 8.0) * uAttention;
    vec3 color = vec3(1.0, 0.24, 0.04) * amberRegion * 0.22;
    color += vec3(0.04, 0.68, 0.82) * cyanRegion * 0.25;
    color += vec3(0.15, 0.77, 0.9) * ripple * cyanRegion * 0.18;
    vec3 attentionTint = mix(vec3(0.2, 0.83, 0.9), vec3(1.0, 0.46, 0.12), vUv.x);
    float innerAperture = exp(-pointerDistance * 21.0) * uAttention;
    color += attentionTint * (pointerLens * 0.4 + aperture * 0.92 + halo * 0.62 + meshRing * 0.58 + diagonal * 0.28);
    color += vec3(0.68, 0.96, 1.0) * innerAperture * 0.32;
    float alpha = clamp(
      amberRegion * 0.32 + cyanRegion * 0.34 + ripple * 0.2
      + pointerLens * 0.46 + aperture * 0.68 + halo * 0.52 + meshRing * 0.44 + innerAperture * 0.24,
      0.0,
      0.82
    );
    gl_FragColor = vec4(color, alpha);
  }
`;

const GROUND_FRAGMENT = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  ${NOISE_GLSL}
  void main() {
    float bottom = 1.0 - smoothstep(0.02, 0.38, vUv.y);
    float contact = exp(-pow((vUv.x - 0.34) * 5.8, 2.0) - pow((vUv.y - 0.055) * 15.0, 2.0));
    float drifting = fbm(vec2(vUv.x * 5.2 - uTime * 0.035, vUv.y * 13.0 + uTime * 0.018));
    float filaments = pow(max(0.0, sin(vUv.x * 43.0 + drifting * 8.0 - uTime * 0.22)), 7.0);
    float crossingFog = fbm(vec2(vUv.x * 3.8 + uTime * 0.022, vUv.y * 19.0 - uTime * 0.014));
    float fog = bottom * smoothstep(0.28, 0.82, drifting);
    vec3 color = vec3(0.005, 0.012, 0.014) * contact * 0.92;
    color += vec3(0.025, 0.14, 0.16) * fog * 0.44;
    color += vec3(0.08, 0.34, 0.36) * filaments * bottom * 0.11;
    color += vec3(0.018, 0.1, 0.12) * crossingFog * bottom * 0.24;
    float alpha = clamp(contact * 0.58 + fog * 0.34 + filaments * bottom * 0.1 + crossingFog * bottom * 0.12, 0.0, 0.66);
    gl_FragColor = vec4(color, alpha);
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
      + sin(p.x * 10.0 + phase + uTime * (0.18 + uAttention * 0.2)) * (0.045 + uAttention * 0.022)
      + sin(p.x * 23.0 - phase * 1.7 - uTime * (0.11 + uAttention * 0.13)) * (0.014 + uAttention * 0.009);
    float width = (0.0018 + 0.0014 * (0.5 + 0.5 * sin(p.x * 12.0 - uTime * (0.9 + uAttention) + phase)))
      * (1.0 + uAttention * 0.8);
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
      float packet = pow(max(0.0, sin((p.x * 24.0 - uTime * (1.1 + fi * 0.035 + uAttention * 0.8) + fi) * 3.14159)), 12.0);
      vec3 tint = mix(vec3(0.16, 0.86, 0.94), vec3(1.0, 0.53, 0.22), step(5.5, fi));
      color += tint * line * (0.34 + packet * (1.02 + uAttention * 1.1) + uAttention * 0.32);
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
    float alpha = clamp((lines * (0.46 + uAttention * 0.58 + nearby * 0.2)) * pathMask, 0.0, 0.96);
    gl_FragColor = vec4(color, alpha);
  }
`;

function configureTexture(texture: THREE.Texture, color = true) {
  texture.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
}

function useLocalAttention(profile: AmbientProofResponseProfile, enabled = true) {
  const attention = useRef(0);
  const laggedPointer = useRef(new THREE.Vector2(0.5, 0.5));
  return {
    attention,
    update(pointer: THREE.Vector2, delta: number) {
      laggedPointer.current.x = THREE.MathUtils.damp(laggedPointer.current.x, pointer.x, profile.pointerLag, delta);
      laggedPointer.current.y = THREE.MathUtils.damp(laggedPointer.current.y, pointer.y, profile.pointerLag, delta);
      const distance = Math.hypot(
        laggedPointer.current.x - profile.target[0],
        laggedPointer.current.y - profile.target[1],
      );
      const proximity = enabled ? THREE.MathUtils.smoothstep(profile.radius - distance, 0, profile.radius) : 0;
      const damping = proximity > attention.current ? profile.attack : profile.release;
      attention.current = THREE.MathUtils.damp(attention.current, proximity, damping, delta);
      return attention.current;
    },
    pointer: laggedPointer,
  };
}

function usePointerPresence(enabled: boolean) {
  const presence = useRef(0);
  const laggedPointer = useRef(new THREE.Vector2(0.5, 0.5));
  return {
    pointer: laggedPointer,
    update(pointer: THREE.Vector2, delta: number) {
      laggedPointer.current.x = THREE.MathUtils.damp(laggedPointer.current.x, pointer.x, 7.5, delta);
      laggedPointer.current.y = THREE.MathUtils.damp(laggedPointer.current.y, pointer.y, 7.5, delta);
      presence.current = THREE.MathUtils.damp(presence.current, enabled ? 1 : 0, enabled ? 7.2 : 1.8, delta);
      return presence.current;
    },
  };
}

function FieldLayer({ pointerActive, pointerTarget }: { pointerActive: boolean; pointerTarget: PointerTarget }) {
  const texture = useTexture(MUSEUM_AMBIENT_PROOF_ASSETS.cleanField);
  const pointerPresence = usePointerPresence(pointerActive);
  const [uniforms] = useState(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uAttention: { value: 0 },
  }));
  useEffect(() => configureTexture(texture), [texture]);
  useFrame(({ clock }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = pointerPresence.update(pointerTarget.current, delta);
    uniforms.uPointer.value.copy(pointerPresence.pointer.current);
  });
  return (
    <mesh position={[0, 0, 0]} renderOrder={0}>
      <planeGeometry args={[MUSEUM_AMBIENT_PROOF_ASPECT * 2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={PLANE_VERTEX} fragmentShader={FIELD_FRAGMENT} depthWrite={false} />
    </mesh>
  );
}

function CoralLayer({ pointerActive, pointerTarget }: { pointerActive: boolean; pointerTarget: PointerTarget }) {
  const [texture, weights] = useTexture([MUSEUM_AMBIENT_PROOF_ASSETS.coral, MUSEUM_AMBIENT_PROOF_ASSETS.coralDeformation]);
  const layout = toProofScenePlacement({ x: 0, y: 45, width: 820, height: 804, z: 0.45 });
  const rootRef = useRef<THREE.Group>(null);
  const local = useLocalAttention(MUSEUM_AMBIENT_PROOF_RESPONSES.coral, pointerActive);
  const [uniforms] = useState(() => ({
    uTexture: { value: texture },
    uWeights: { value: weights },
    uTime: { value: 0 },
    uPhase: { value: 0.73 },
    uAttention: { value: 0 },
  }));
  useEffect(() => {
    configureTexture(texture);
    configureTexture(weights, false);
  }, [texture, weights]);
  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    uniforms.uTime.value = time;
    uniforms.uAttention.value = local.update(pointerTarget.current, delta);
    if (rootRef.current) {
      rootRef.current.rotation.z = Math.sin(time * 0.24 + 0.7) * 0.015 + Math.sin(time * 0.51) * 0.004;
      rootRef.current.position.y = layout.position[1] - layout.size[1] / 2 + Math.sin(time * 0.17 + 1.8) * 0.004;
    }
  });
  return (
    <group ref={rootRef} position={[layout.position[0], layout.position[1] - layout.size[1] / 2, layout.position[2]]}>
      <mesh position={[0, layout.size[1] / 2, 0]} renderOrder={4}>
        <planeGeometry args={[layout.size[0], layout.size[1], 64, 64]} />
        <shaderMaterial uniforms={uniforms} vertexShader={CORAL_VERTEX} fragmentShader={CORAL_FRAGMENT} transparent depthTest={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

function OrganismLayer({ pointerActive, pointerTarget }: { pointerActive: boolean; pointerTarget: PointerTarget }) {
  const texture = useTexture(MUSEUM_AMBIENT_PROOF_ASSETS.organism);
  const layout = toProofScenePlacement({ x: 245, y: 150, width: 458, height: 900, z: 0.62 });
  const rootRef = useRef<THREE.Group>(null);
  const local = useLocalAttention(MUSEUM_AMBIENT_PROOF_RESPONSES.organism, pointerActive);
  const [uniforms] = useState(() => ({ uTexture: { value: texture }, uTime: { value: 0 }, uPhase: { value: 2.31 }, uAttention: { value: 0 } }));
  useEffect(() => configureTexture(texture), [texture]);
  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    uniforms.uTime.value = time;
    uniforms.uAttention.value = local.update(pointerTarget.current, delta);
    if (rootRef.current) {
      rootRef.current.rotation.z = Math.sin(time * 0.16 + 2.4) * 0.01 + Math.sin(time * 0.37 + 0.6) * 0.003;
      rootRef.current.position.x = layout.position[0] + Math.sin(time * 0.11 + 4.2) * 0.005;
    }
  });
  return (
    <group ref={rootRef} position={[layout.position[0], layout.position[1] - layout.size[1] / 2, layout.position[2]]}>
      <mesh position={[0, layout.size[1] / 2, 0]} renderOrder={6}>
        <planeGeometry args={[layout.size[0], layout.size[1], 28, 48]} />
        <shaderMaterial uniforms={uniforms} vertexShader={ORGANISM_VERTEX} fragmentShader={ORGANISM_FRAGMENT} transparent depthTest={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

function RingsLayer({ pointerActive, pointerTarget }: { pointerActive: boolean; pointerTarget: PointerTarget }) {
  const texture = useTexture(MUSEUM_AMBIENT_PROOF_ASSETS.rings);
  const layout = toProofScenePlacement({ x: 690, y: 345, width: 161, height: 340, z: 0.7 });
  const local = useLocalAttention(MUSEUM_AMBIENT_PROOF_RESPONSES.rings, pointerActive);
  const rotation = useRef(0);
  const [uniforms] = useState(() => ({ uTexture: { value: texture }, uTime: { value: 0 }, uRotation: { value: 0 }, uAttention: { value: 0 } }));
  useEffect(() => configureTexture(texture), [texture]);
  useFrame(({ clock }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    const attention = local.update(pointerTarget.current, delta);
    rotation.current += delta * (0.105 + attention * 0.24);
    uniforms.uRotation.value = rotation.current;
    uniforms.uAttention.value = attention;
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
  const [uniforms] = useState(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uPhase: { value: phase },
  }));
  useEffect(() => configureTexture(texture), [texture]);
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh position={placement.position} renderOrder={order}>
      <planeGeometry args={[placement.size[0], placement.size[1]]} />
      <shaderMaterial uniforms={uniforms} vertexShader={PLANE_VERTEX} fragmentShader={VAPOR_FRAGMENT} transparent depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function ProceduralCurrent({ pointerActive, pointerTarget }: { pointerActive: boolean; pointerTarget: PointerTarget }) {
  const local = useLocalAttention(MUSEUM_AMBIENT_PROOF_RESPONSES.current, pointerActive);
  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uAttention: { value: 0 },
  }));
  useFrame(({ clock }, delta) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uAttention.value = local.update(pointerTarget.current, delta);
    uniforms.uPointer.value.copy(local.pointer.current);
  });
  return (
    <mesh position={[0, 0, 0.55]} renderOrder={5}>
      <planeGeometry args={[MUSEUM_AMBIENT_PROOF_ASPECT * 2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={PLANE_VERTEX} fragmentShader={CURRENT_FRAGMENT} transparent depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function IlluminationLayer({ pointerActive, pointerTarget }: { pointerActive: boolean; pointerTarget: PointerTarget }) {
  const pointerPresence = usePointerPresence(pointerActive);
  const [uniforms] = useState(() => ({
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
    <mesh position={[0, 0, 0.76]} renderOrder={8}>
      <planeGeometry args={[MUSEUM_AMBIENT_PROOF_ASPECT * 2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={PLANE_VERTEX} fragmentShader={ILLUMINATION_FRAGMENT} transparent depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function GroundingLayer() {
  const [uniforms] = useState(() => ({ uTime: { value: 0 } }));
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh position={[0, 0, 0.82]} renderOrder={9}>
      <planeGeometry args={[MUSEUM_AMBIENT_PROOF_ASPECT * 2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={PLANE_VERTEX} fragmentShader={GROUND_FRAGMENT} transparent depthTest={false} depthWrite={false} />
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
  useFrame(({ clock }) => {
    const attribute = pointsRef.current?.geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!attribute) return;
    const t = clock.elapsedTime;
    for (let index = 0; index < particles.count; index += 1) {
      const offset = index * 3;
      const seed = particles.seeds[index];
      particles.positions[offset] = particles.origins[offset] + Math.sin(t * (0.08 + seed * 0.05) + seed * 9) * 0.06;
      particles.positions[offset + 1] = particles.origins[offset + 1] + Math.cos(t * (0.11 + seed * 0.04) + seed * 13) * 0.045;
      particles.positions[offset + 2] = 0.8 + Math.sin(t * (0.047 + seed * 0.031) + seed * 17) * 0.045;
    }
    attribute.needsUpdate = true;
  });
  return (
    <points ref={pointsRef} renderOrder={10}>
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
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.position.x = placement.position[0] + Math.sin(t * (0.061 + phase * 0.004) + phase) * 0.075;
    meshRef.current.position.y = placement.position[1] + Math.cos(t * (0.043 + phase * 0.003) + phase) * 0.035;
    meshRef.current.rotation.z = Math.sin(t * 0.055 + phase) * 0.012;
  });
  return (
    <mesh ref={meshRef} position={placement.position} renderOrder={order}>
      <planeGeometry args={[placement.size[0], placement.size[1]]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

function AmbientScene({ pointerActive, pointerTarget }: { pointerActive: boolean; pointerTarget: PointerTarget }) {
  return (
    <>
      <FieldLayer pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <VaporLayer source={MUSEUM_AMBIENT_PROOF_ASSETS.vaporBackground} layout={{ x: 30, y: 80, width: 690, height: 507, z: 0.18 }} phase={0.4} order={1} />
      <VaporLayer source={MUSEUM_AMBIENT_PROOF_ASSETS.vaporVertical} layout={{ x: 600, y: 5, width: 426, height: 650, z: 0.28 }} phase={2.1} order={2} />
      <VaporLayer source={MUSEUM_AMBIENT_PROOF_ASSETS.vaporBasin} layout={{ x: 250, y: 780, width: 838, height: 315, z: 0.35 }} phase={4.7} order={3} />
      <ProceduralCurrent pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <CoralLayer pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <OrganismLayer pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <RingsLayer pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <IlluminationLayer pointerActive={pointerActive} pointerTarget={pointerTarget} />
      <GroundingLayer />
      <ParticleField />
      <DriftingPlate source={MUSEUM_AMBIENT_PROOF_ASSETS.occluderSpores} layout={{ x: 1010, y: 90, width: 290, height: 118, z: 0.9 }} phase={1.3} order={11} opacity={0.72} />
      <DriftingPlate source={MUSEUM_AMBIENT_PROOF_ASSETS.occluderShadowA} layout={{ x: -20, y: 835, width: 520, height: 225, z: 1.0 }} phase={3.5} order={12} opacity={0.28} />
      <DriftingPlate source={MUSEUM_AMBIENT_PROOF_ASSETS.occluderShadowB} layout={{ x: 720, y: 850, width: 650, height: 225, z: 1.05 }} phase={5.2} order={13} opacity={0.38} />
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

export interface MuseumAmbientProofProps {
  embedded?: boolean;
  active?: boolean;
}

export default function MuseumAmbientProof({
  embedded = false,
  active = true,
}: MuseumAmbientProofProps = {}) {
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
    event.currentTarget.dataset.attentionX = x.toFixed(3);
    event.currentTarget.dataset.attentionY = y.toFixed(3);
    if (!pointerActive) setPointerActive(true);
  };

  const sceneVisible = visible && active;
  const sceneFrame = getMuseumSceneFrame({
    pointer: scenePointer,
    apertureTarget: pointerActive ? scenePointer : undefined,
    stimulation: 1,
    reducedMotion,
    visible: sceneVisible,
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
    <main
      className={`${styles.proof} ${embedded ? styles.embeddedProof : ''}`}
      data-reduced-motion={reducedMotion}
      data-attention-active={pointerActive}
      data-embedded={embedded}
    >
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
              aria-label="Animated lower-left Museum material compositor"
              dpr={[1, 1.5]}
              frameloop={sceneVisible ? 'always' : 'never'}
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
              <Suspense fallback={null}><AmbientScene pointerActive={pointerActive} pointerTarget={pointerTarget} /></Suspense>
            </Canvas>
          ) : null}
        </ProofBoundary>
        <div className={styles.museumEffects} aria-hidden="true">
          <span className={styles.sceneHalo} />
          <span
            className={museumStyles.ecologyMembrane}
            data-layer="museum:membrane"
            style={{ backgroundImage: `url(${MUSEUM_AMBIENT_PROOF_ASSETS.fallback})` }}
          />
          <span
            className={museumStyles.ecologyAperture}
            data-layer="museum:aperture"
            style={{ backgroundImage: `url(${MUSEUM_AMBIENT_PROOF_ASSETS.fallback})` }}
          />
          <span className={museumStyles.materialMesh} data-layer="museum:membrane" />
          <MuseumParticleField
            target={sceneFrame.aperture}
            energy={sceneFrame.energy}
            count={sceneFrame.particleCount}
            reducedMotion={reducedMotion || !sceneVisible}
          />
          <span className={museumStyles.ecologyVeil} />
        </div>
        <div className={styles.grain} aria-hidden="true" />
      </div>
      {!embedded ? (
        <>
          <header className={styles.caption}>
            <Link href="/projects">Return to the Museum</Link>
            <div>
              <p>Material proof 01 / west ecology</p>
              <h1>Watch before touching. Each material keeps its own time.</h1>
            </div>
          </header>
          <p className={styles.legend}>idle coral tide / migrating material light / local delayed attention / procedural current / depth passage</p>
        </>
      ) : null}
    </main>
  );
}

for (const source of Object.values(MUSEUM_AMBIENT_PROOF_ASSETS)) useTexture.preload(source);
