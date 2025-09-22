'use client';

import * as THREE from 'three';
import { useRef, useMemo, useEffect, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

// --- Fluid, lava-lamp style shader ---
const lavaVertex = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lavaFragment = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uThink; // 0..1
  uniform vec3 uTint;   // target tint when thinking

  // Simple hash-based value noise and FBM
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5; mat2 m = mat2(1.6,1.2,-1.2,1.6);
    for(int i=0;i<5;i++){ v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }

  vec2 curl(vec2 p){
    float e = 0.02;
    float n1 = fbm(p + vec2(0.0, e));
    float n2 = fbm(p - vec2(0.0, e));
    float n3 = fbm(p + vec2(e, 0.0));
    float n4 = fbm(p - vec2(e, 0.0));
    return normalize(vec2(n1 - n2, -(n3 - n4)));
  }

  float fieldAt(vec2 p, vec2 c, float s){
    float d2 = dot(p - c, p - c);
    return s / (d2 + 0.06);
  }

  vec3 hsl2rgb(vec3 hsl){
    vec3 rgb = clamp(abs(mod(hsl.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return hsl.z + (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
  }

  void main(){
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    if(r > 1.0) discard;

    float t = uTime;

    // Advect sampling coords by curl-noise for smooth, liquid flow
    vec2 q = p;
    q += 0.25 * curl(q * 1.6 + t * 0.25);
    q += 0.12 * curl(q * 3.0 - t * 0.20);
    q += 0.06 * curl(q * 6.0 + t * 0.35);

    // Metaball centers, also advected so shapes meander and merge
    vec2 c0 = 0.55 * vec2(sin(t * 0.8), cos(t * 0.9));
    vec2 c1 = 0.60 * vec2(sin(-t * 0.6 + 1.2), cos(-t * 0.7 + 0.4));
    vec2 c2 = 0.50 * vec2(sin(t * 0.7 + 2.1), cos(t * 0.5 + 2.7));
    vec2 c3 = 0.58 * vec2(sin(-t * 0.9 + 3.0), cos(-t * 0.8 + 1.8));
    c0 += 0.15 * curl(c0 * 2.0 + t * 0.30);
    c1 += 0.15 * curl(c1 * 2.0 - t * 0.25);
    c2 += 0.15 * curl(c2 * 2.0 + t * 0.20);
    c3 += 0.15 * curl(c3 * 2.0 - t * 0.20);

    float f = 0.0;
    f += fieldAt(q, c0, 0.36);
    f += fieldAt(q, c1, 0.34);
    f += fieldAt(q, c2, 0.32);
    f += fieldAt(q, c3, 0.30);

    float iso = 1.35; // lower threshold so blobs appear reliably
    float soft = 1.6; // softer edge for smoother liquid
    float m = smoothstep(iso - soft, iso + soft, f);

    // Hue driven by FBM of advected coordinate to avoid pie slices
    float hue = mix(0.52, 0.83, fbm(q * 2.0 + t * 0.05));
    float sat = 0.85;
    float lit = 0.55 + 0.15 * fbm(q * 3.5 - t * 0.10);

    // Soft lighting from a fixed direction
    vec2 g;
    float e = 0.01;
    g.x = fbm(q + vec2(e, 0.0)) - fbm(q - vec2(e, 0.0));
    g.y = fbm(q + vec2(0.0, e)) - fbm(q - vec2(0.0, e));
    float light = dot(normalize(vec3(-g, 0.35)), normalize(vec3(-0.4, 0.7, 1.0))) * 0.5 + 0.5;

    vec3 col = hsl2rgb(vec3(hue, sat, lit)) * (0.65 + 0.55 * light);
    col *= 0.9 + 0.1 * (1.0 - r);
    // When thinking, shift toward uTint and gently pulse
    float pulse = 0.97 + 0.06 * sin(t * 3.0);
    vec3 target = mix(col, uTint, 0.40) * pulse;
    col = mix(col, target, 0.45 * clamp(uThink, 0.0, 1.0));
    float alpha = clamp(0.75 * m + 0.08 * (1.0 - r), 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

function LavaLamp({ isThinking = false, tint = '#ff8ea1'}: { isThinking?: boolean; tint?: THREE.ColorRepresentation }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uThink: { value: isThinking ? 1 : 0 },
    uTint: { value: new THREE.Color(tint) },
  }), []);
  const thinkTarget = useRef<number>(isThinking ? 1 : 0);

  useEffect(() => {
    thinkTarget.current = isThinking ? 1 : 0;
  }, [isThinking]);

  useEffect(() => {
    (uniforms.uTint.value as THREE.Color).set(tint as THREE.ColorRepresentation);
  }, [tint, uniforms]);

  useFrame(({ clock }, delta) => {
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uThink.value = THREE.MathUtils.damp(uniforms.uThink.value as number, thinkTarget.current, 5, delta);
  });

  return (
    <mesh>
      <planeGeometry args={[2.2, 2.2]} />
      <shaderMaterial ref={matRef} uniforms={uniforms as any} vertexShader={lavaVertex} fragmentShader={lavaFragment} transparent />
    </mesh>
  );
}

function createFibonacciSphere(count: number, radius: number, jitter = 0): Float32Array {
  const positions = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const j = jitter ? (Math.random() * 2 - 1) * jitter : 0;
    const scale = radius + j;
    positions[i * 3] = x * scale;
    positions[i * 3 + 1] = y * scale;
    positions[i * 3 + 2] = z * scale;
  }
  return positions;
}

function createColors(positions: Float32Array): Float32Array {
  const colors = new Float32Array((positions.length / 3) * 3);
  const color = new THREE.Color();
  const lightDir = new THREE.Vector3(-0.6, 0.7, 0.4).normalize();
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const n = new THREE.Vector3(x, y, z).normalize();
    const theta = Math.atan2(n.z, n.x); // -PI..PI
    const band = (Math.sin(theta * 2.5) * 0.5 + 0.5); // swirly band
    const hue = (0.55 + 0.25 * band) % 1; // cyan→purple
    const ndotl = Math.max(0, n.dot(lightDir));
    const lightness = 0.45 + ndotl * 0.35; // brighter where lit
    const saturation = 0.8;
    color.setHSL(hue, saturation, lightness);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }
  return colors;
}

function ParticleLayer({ count, radius, speed, size }:
  { count: number; radius: number; speed: number; size: number }) {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<any>(null!);
  const basePositions = useMemo(() => createFibonacciSphere(count, radius, 0.02), [count, radius]);
  const colors = useMemo(() => createColors(basePositions), [basePositions]);
  const seeds = useMemo(() => Float32Array.from({ length: count }, () => Math.random()), [count]);
  const basePhi = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = basePositions[i * 3];
      const z = basePositions[i * 3 + 2];
      arr[i] = Math.atan2(z, x);
    }
    return arr;
  }, [basePositions, count]);
  const baseY = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = basePositions[i * 3 + 1] / radius;
    return arr;
  }, [basePositions, count, radius]);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
    if (!ref.current) return;
    const geom = (ref.current as any).geometry as THREE.BufferGeometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const colAttr = geom.getAttribute('color') as THREE.BufferAttribute;
    const colArr = colAttr.array as Float32Array;
    const tmpColor = new THREE.Color();

    const t = state.clock.elapsedTime;
    const swirlFreq = 3.6; // number of flow bands
    const swirlAmp = 0.62; // angular offset amplitude
    const yModAmp = 0.11;  // vertical wobble amount
    const radModAmp = 0.10; // radial breathing
    const lightDir = new THREE.Vector3(-0.6, 0.7, 0.4).normalize();

    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const y0 = baseY[i];
      const phi0 = basePhi[i];

      const swirl = Math.sin(y0 * swirlFreq + t * (0.8 + s * 0.6) + s * Math.PI * 2) * swirlAmp;
      const yWobble = Math.sin(t * (0.9 + s) + phi0 * 2.0) * yModAmp;
      const y = THREE.MathUtils.clamp(y0 + yWobble, -0.98, 0.98);
      const rLat = Math.sqrt(1 - y * y);
      const phi = phi0 + swirl;

      const rBreath = 1 + Math.sin(t * 1.4 + s * 4.0) * radModAmp;
      const R = radius * rBreath;

      const x = Math.cos(phi) * rLat * R;
      const z = Math.sin(phi) * rLat * R;

      arr[i * 3] = x;
      arr[i * 3 + 1] = y * R;
      arr[i * 3 + 2] = z;

      // Dynamic color advection: hue flows along bands that move over time
      const nLen = 1 / Math.max(1e-6, Math.hypot(x, y * R, z));
      const nx = x * nLen;
      const ny = (y * R) * nLen;
      const nz = z * nLen;
      const phiNow = Math.atan2(nz, nx);
      const thetaNow = Math.acos(THREE.MathUtils.clamp(ny, -1, 1));
      const bandFlow = Math.sin(phiNow * 3.0 + t * (1.0 + s * 0.5) + thetaNow * 0.8)
                      + Math.sin(phiNow * 5.0 - t * (0.6 + s * 0.4));
      const hue = (0.55 + 0.18 * (0.5 + 0.5 * bandFlow)) % 1;
      const ndotl = Math.max(0, nx * lightDir.x + ny * lightDir.y + nz * lightDir.z);
      const lightness = 0.42 + ndotl * 0.38;
      tmpColor.setHSL(hue, 0.85, lightness);
      colArr[i * 3] = tmpColor.r;
      colArr[i * 3 + 1] = tmpColor.g;
      colArr[i * 3 + 2] = tmpColor.b;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    if (matRef.current) matRef.current.size = size + Math.sin(t * 1.2) * (size * 0.15);
  });
  return (
    <Points ref={ref} positions={basePositions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        ref={matRef}
        transparent
        vertexColors
        size={size}
        sizeAttenuation
        depthWrite={false}
        fog={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Lightweight dots layer that swirls around and adds sparkle over the fluid
function DotLayer({ count, radius, speed, size, color, thinking = false, thinkColor = '#ffb8d4', opacityBase = 1, opacityThink = 1 }:
  { count: number; radius: number; speed: number; size: number; color: string; thinking?: boolean; thinkColor?: string; opacityBase?: number; opacityThink?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<any>(null!);
  const base = useMemo(() => createFibonacciSphere(count, radius, 0.02), [count, radius]);
  const seeds = useMemo(() => Float32Array.from({ length: count }, () => Math.random()), [count]);
  const basePhi = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = Math.atan2(base[i * 3 + 2], base[i * 3]);
    return arr;
  }, [base, count]);
  const baseY = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = base[i * 3 + 1] / radius;
    return arr;
  }, [base, count, radius]);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const thinkTint = useMemo(() => new THREE.Color(thinkColor), [thinkColor]);
  const lerpColor = useRef(new THREE.Color());
  const colorTarget = useRef<number>(thinking ? 1 : 0);
  const colorProgress = useRef<number>(thinking ? 1 : 0);
  const opacityTarget = useRef<number>(thinking ? opacityThink : opacityBase);
  const opacityProgress = useRef<number>(thinking ? opacityThink : opacityBase);

  useEffect(() => { 
    colorTarget.current = thinking ? 1 : 0; 
    opacityTarget.current = thinking ? opacityThink : opacityBase;
  }, [thinking, opacityBase, opacityThink]);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
    if (!ref.current) return;
    const geom = (ref.current as any).geometry as THREE.BufferGeometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const y0 = baseY[i];
      const phi0 = basePhi[i];
      const swirl = Math.sin(y0 * 3.8 + t * (0.9 + s * 0.6) + s * 6.2831) * 0.55;
      const y = THREE.MathUtils.clamp(y0 + Math.sin(t * (1.0 + s) + phi0 * 2.0) * 0.10, -0.98, 0.98);
      const rLat = Math.sqrt(1.0 - y * y);
      const phi = phi0 + swirl;
      const R = radius * (1.0 + Math.sin(t * 1.6 + s * 4.0) * 0.08);
      arr[i * 3] = Math.cos(phi) * rLat * R;
      arr[i * 3 + 1] = y * R;
      arr[i * 3 + 2] = Math.sin(phi) * rLat * R;
    }
    posAttr.needsUpdate = true;

    // Smoothly lerp dot color toward thinking tint
    colorProgress.current = THREE.MathUtils.damp(colorProgress.current, colorTarget.current, 5, delta);
    lerpColor.current.copy(baseColor).lerp(thinkTint, colorProgress.current);
    if (matRef.current) matRef.current.color.copy(lerpColor.current);

    // Smoothly adjust opacity to reveal extra dots when thinking
    opacityProgress.current = THREE.MathUtils.damp(opacityProgress.current, opacityTarget.current, 5, delta);
    if (matRef.current) matRef.current.opacity = opacityProgress.current;
  });

  return (
    <Points ref={ref} positions={base} stride={3} frustumCulled={false}>
      <PointMaterial ref={matRef}
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function ChatOrbComponent({ isThinking = false }: { isThinking?: boolean }) {
  return (
    <div className="relative w-8 h-8 sm:w-9 sm:h-9 pointer-events-none rounded-full overflow-hidden">
      {/* Soft highlight and base shadow to match reference */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 30% 28%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%),
                      radial-gradient(80% 80% at 20% 110%, rgba(0,0,0,0.25), rgba(0,0,0,0) 55%)`
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 32 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1} />
        <group rotation={[0, 0, 0]}>
          <LavaLamp isThinking={isThinking} tint={'#ff8ea1'} />
          <DotLayer key="dots-1" count={200} radius={1.06} speed={0.30} size={0.012} color={'#dff2ff'} thinking={isThinking} thinkColor={'#ffb8d4'} opacityBase={0.9} opacityThink={1.0} />
          <DotLayer key="dots-2" count={130} radius={0.88} speed={-0.16} size={0.010} color={'#dff2ff'} thinking={isThinking} thinkColor={'#ffb8d4'} opacityBase={0.85} opacityThink={1.0} />
          <DotLayer key="dots-3" count={140} radius={1.00} speed={0.55} size={0.010} color={'#cfe9ff'} thinking={isThinking} thinkColor={'#ffc4de'} opacityBase={0.0} opacityThink={0.8} />
        </group>
      </Canvas>
    </div>
  );
}

export default memo(ChatOrbComponent);
