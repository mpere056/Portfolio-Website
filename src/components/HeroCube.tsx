"use client";

import * as THREE from 'three'
import { memo, useRef, useMemo, useEffect, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, Instances, Instance, useGLTF, Stars, useTexture } from '@react-three/drei'
import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing'
import { RoundedBoxGeometry } from 'three-stdlib'
import { motion } from '@/components/FramerMotion';
import { easing } from 'maath'
import NavPointer from './NavPointer';
import { BufferGeometry } from 'three';
import { FirstNoteExperience } from './experience/FirstNoteExperience';
import type { FirstNotePresentation } from '@/lib/experience/firstNote';
import { usePortfolioAI } from './ai/PortfolioAIProvider';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';
import { getHomeSceneFrame } from '@/lib/artDirection/homeScene';
import supportingStyles from './SupportingScenes.module.css';

extend({ RoundedBoxGeometry })

export type HeroCubeVariant = 'home' | 'music-proof';

export default function HeroCube({
  firstNoteEnabled = false,
  variant = 'home',
}: {
  firstNoteEnabled?: boolean;
  variant?: HeroCubeVariant;
}) {
  const portfolioAI = usePortfolioAI();
  const [pageVisible, setPageVisible] = useState(true);
  const musicProof = variant === 'music-proof';

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState !== 'hidden');
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  return (
    <FirstNoteExperience enabled={firstNoteEnabled}>
      {({ state, presentation, wake, reset }) => (
        <div
          className="relative h-screen w-screen overflow-hidden bg-[#07070d]"
          data-home-threshold={presentation.illumination}
          data-home-variant={variant}
          data-home-layers="threshold-matte painted-presence awakened-fragment notation-orbit three-dimensional-instrument"
          style={{
            backgroundColor: '#07070d',
            '--home-threshold': getHomeSceneFrame(state.phase, state.reducedMotionRequested).threshold,
            '--home-fragment': getHomeSceneFrame(state.phase, state.reducedMotionRequested).fragment,
            '--home-notation': getHomeSceneFrame(state.phase, state.reducedMotionRequested).notation,
          } as CSSProperties}
        >
          <div aria-hidden="true" className={supportingStyles.homeMaterial}>
            <Image
              src={ART_DIRECTION_ASSETS.home.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="motion-safe:animate-[homePresence_14s_ease-in-out_infinite_alternate]"
            />
          </div>
          <div aria-hidden="true" className={supportingStyles.homeFragment}>
            <Image src={ART_DIRECTION_ASSETS.home.src} alt="" fill priority sizes="100vw" />
          </div>
          <svg aria-hidden="true" className={supportingStyles.homeNotation} viewBox="0 0 1200 700" fill="none">
            <ellipse cx="604" cy="372" rx="318" ry="124" stroke="currentColor" strokeWidth="1" strokeDasharray="2 16" />
            <ellipse cx="604" cy="372" rx="420" ry="188" stroke="currentColor" strokeWidth="0.7" strokeDasharray="1 22" />
            <path d="M176 412C330 302 447 522 602 372C764 214 855 478 1034 306" stroke="currentColor" strokeWidth="0.9" />
            <path d="M246 494C408 422 453 256 603 372C753 486 842 318 976 250" stroke="currentColor" strokeWidth="0.55" strokeDasharray="8 11" />
          </svg>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_56%,transparent_0,rgba(7,7,13,.12)_30%,rgba(7,7,13,.88)_86%)]" />
          <Canvas
            shadows
            frameloop={pageVisible && !state.reducedMotionRequested ? 'always' : 'demand'}
            gl={{ antialias: false }}
            camera={{ position: [-15, 10, 20], fov: 25 }}
            style={{ height: '100vh', width: '100vw', zIndex: 0 }}
          >
            <ResponsiveCamera />
            <color attach="background" args={['#07070d']} />
            <Stars radius={120} depth={50} count={200} factor={5} saturation={0} fade speed={state.reducedMotionRequested ? 0 : 0.5} />
            <AwakeningLights presentation={presentation} reducedMotion={state.reducedMotionRequested} />
            <HeroScaleGroup>
              {musicProof && !state.reducedMotionRequested ? <PianoResonanceField /> : null}
              <Particles count={10000} displacement={1} visibility={4.5} intensity={2} />
              <group>
                <mesh position={[0, -2.42, -0.5]} receiveShadow castShadow>
                  <cylinderGeometry args={[2.5, 2.5, 0.2, 64]} />
                  <meshStandardMaterial color="#191936" roughness={0.9} metalness={0.1} />
                </mesh>
                <mesh position={[0, -2.31, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[2.5, 2.53, 64]} />
                  <meshBasicMaterial color="#312f6b" transparent opacity={0.05} side={THREE.DoubleSide} />
                </mesh>
                <PlatformImage src="/images/me_logo.png" />
              </group>
            </HeroScaleGroup>
            <HeroPostProcessing />
            <OrbitControls autoRotate={!state.reducedMotionRequested} autoRotateSpeed={0.7} />
            <CursorLight />
            {presentation.navigationVisible && (
              <>
                <NavPointer text="About Me" path="/about" position={[-2, 1.5, 2]} />
                <NavPointer text="Projects" path="/projects" position={[2, -1.5, 2]} />
                <NavPointer
                  path="/?archive=open"
                  position={[-2, -1.5, -2]}
                  onActivate={portfolioAI.enabled ? portfolioAI.open : undefined}
                >
                  <span>Ask Me Anything </span>
                  <span className="bg-[linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6,#60a5fa)] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">[AI]</span>
                </NavPointer>
              </>
            )}
            {presentation.wakeControlVisible && <FirstNoteWakeControl onWake={wake} />}
          </Canvas>
          {firstNoteEnabled && state.phase === 'ready' && state.visitor !== 'bypass' && (
            <button
              type="button"
              onClick={reset}
              className="absolute bottom-5 left-5 z-20 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[11px] tracking-wide text-white/45 backdrop-blur-md transition hover:border-white/20 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Reset opening
            </button>
          )}
        </div>
      )}
    </FirstNoteExperience>
  )
}

const HeroPostProcessing = memo(function HeroPostProcessing() {
  return (
    <EffectComposer>
      <N8AO aoRadius={1} intensity={1} />
      <Bloom mipmapBlur luminanceThreshold={0.3} levels={5} intensity={2} />
    </EffectComposer>
  );
});

function AwakeningLights({
  presentation,
  reducedMotion,
}: {
  presentation: FirstNotePresentation;
  reducedMotion: boolean;
}) {
  const ambient = useRef<THREE.AmbientLight>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const visible = presentation.illumination !== 'dark';

  useFrame((_, delta) => {
    const ambientTarget = visible ? 0.18 : 0.012;
    const spotTarget = visible ? 2 : 0.08;
    if (ambient.current) {
      ambient.current.intensity = reducedMotion
        ? ambientTarget
        : THREE.MathUtils.damp(ambient.current.intensity, ambientTarget, 3.2, delta);
    }
    if (spot.current) {
      spot.current.intensity = reducedMotion
        ? spotTarget
        : THREE.MathUtils.damp(spot.current.intensity, spotTarget, 2.4, delta);
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={visible ? 0.18 : 0.012} />
      <spotLight ref={spot} position={[-10, 20, 20]} angle={0.15} penumbra={3} decay={0} intensity={visible ? 2 : 0.08} castShadow />
    </>
  );
}

function FirstNoteWakeControl({ onWake }: { onWake: () => void }) {
  return (
    <Html center position={[0, -0.35, 2.4]} zIndexRange={[30, 20]}>
      <button
        type="button"
        onClick={onWake}
        className="group min-w-52 rounded-2xl border border-white/15 bg-[#08080d]/80 px-5 py-4 text-left text-white shadow-[0_18px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl transition duration-500 hover:border-white/30 hover:bg-[#10101a]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Play the first note and reveal the portfolio"
      >
        <span className="block font-serif text-lg tracking-wide text-white/90">Play the first note</span>
        <span className="mt-1.5 flex items-center justify-between gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 group-hover:text-white/55">
          <span>Wake the world</span>
          <kbd className="rounded border border-white/10 px-1.5 py-0.5">Enter</kbd>
        </span>
      </button>
    </Html>
  );
}

interface ParticlesProps {
  count: number;
  displacement?: number;
  visibility?: number;
  intensity?: number;
}

function Particles({ count, displacement = 3, visibility = 6, intensity = 1 }: ParticlesProps) {
  const cursor = new THREE.Vector3()
  const oPos = new THREE.Vector3()
  const vec = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const ref = useRef<any>(null)
  const { scene } = useGLTF('/models/grand_piano/grand_piano_(GLB).gltf')

  const positions = useMemo(() => {
    const allVertices: number[][] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof BufferGeometry) {
        const temp = child.geometry.attributes.position.array;
        if (temp) {
          for (let i = 0; i < temp.length; i += 3) {
            allVertices.push([
              temp[i] * 2,
              (temp[i + 1] * 2) - 1,
              temp[i + 2] * 2
            ]);
          }
        }
      }
    });

    const sampledPositions = [];
    for (let i = 0; i < count; i++) {
      sampledPositions.push(allVertices[Math.floor(Math.random() * allVertices.length)]);
    }

    return sampledPositions;
  }, [scene, count]);

  useFrame(({ pointer, camera, clock }, delta) => {
    cursor.set(pointer.x, pointer.y, 0.5).unproject(camera)
    dir.copy(cursor).sub(camera.position).normalize()
    cursor.add(dir.multiplyScalar(camera.position.length()))
    let count = 0
    if (ref.current) {
        for (let child of ref.current.children) {
            const position = positions[count];
            if (position) {
              oPos.set(position[0], position[1], position[2])
              dir.copy(oPos).sub(cursor).normalize()
              const dist = oPos.distanceTo(cursor)
              const distInv = displacement - dist
              
              const visibilityDistInv = visibility - dist;
              const col = Math.max(0, Math.min(1, 0.5 + visibilityDistInv / 2));
              
              const mov = 1 + Math.sin(clock.elapsedTime * 2 + 1000 * count)
              easing.dampC(child.color, dist > visibility * 1.1 ? '#101010' : new THREE.Color(col, col, col), 0.1, delta);
              easing.damp3(
                child.position,
                dist > displacement ? oPos : vec.copy(oPos).add(dir.multiplyScalar(distInv * intensity + mov / 4)),
                0.2,
                delta
              )
              easing.damp3(child.scale, dist > visibility ? 0.04 : Math.max(0.04, 0.1 - visibilityDistInv * 0.02), 0.2, delta);
            }
            count++;
        }
    }
  })

  return (
    <Instances limit={positions.length} castShadow receiveShadow frames={Infinity} ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshLambertMaterial />
      {positions.map((pos, i) => (
        <Instance key={i} position={pos as [number, number, number]} />
      ))}
    </Instances>
  )
}

function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const cursor = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const platformCenter = new THREE.Vector3(0, -2.42, -0.5)

  useFrame(({ pointer, camera }) => {
    // Project cursor into world space similar to particles
    cursor.set(pointer.x, pointer.y, 0.5).unproject(camera)
    dir.copy(cursor).sub(camera.position).normalize()
    cursor.add(dir.multiplyScalar(camera.position.length()))
    if (lightRef.current) {
      lightRef.current.position.set(cursor.x, cursor.y + 0.6, cursor.z)
      // Stronger falloff relative to platform center distance
      const d = cursor.distanceTo(platformCenter)
      const intensity = THREE.MathUtils.clamp(18 / (0.4 + (d * d * 1.2)), 0.01, 12) // near → very bright, far → nearly off
      lightRef.current.intensity = intensity
    }
  })

  // Point light behaves like a soft spotlight; distance+decay makes farther regions darker
  return <pointLight ref={lightRef} intensity={8} distance={3.8} decay={2.6} color={'#cfd6ff'} />
}

function PianoResonanceField() {
  const low = useRef<THREE.Mesh>(null);
  const middle = useRef<THREE.Mesh>(null);
  const high = useRef<THREE.Mesh>(null);
  const lowLight = useRef<THREE.PointLight>(null);
  const middleLight = useRef<THREE.PointLight>(null);
  const highLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const rings = [low.current, middle.current, high.current];
    rings.forEach((ring, index) => {
      if (!ring) return;
      ring.rotation.z = time * (index === 1 ? -0.035 : 0.024 + index * 0.012);
      const breath = 1 + Math.sin(time * (0.24 + index * 0.07) + index * 2.1) * 0.012;
      ring.scale.set(breath, breath * (0.78 + index * 0.05), 1);
    });

    if (lowLight.current) lowLight.current.intensity = 0.34 + Math.sin(time * 0.43) * 0.12;
    if (middleLight.current) middleLight.current.intensity = 0.38 + Math.sin(time * 0.37 + 2.1) * 0.14;
    if (highLight.current) highLight.current.intensity = 0.32 + Math.sin(time * 0.51 + 4.2) * 0.11;
  });

  return (
    <group position={[0, -2.27, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={low}>
        <torusGeometry args={[2.72, 0.008, 6, 128]} />
        <meshBasicMaterial color="#7779a8" transparent opacity={0.055} depthWrite={false} />
      </mesh>
      <mesh ref={middle} rotation={[0, 0, 0.7]}>
        <torusGeometry args={[3.08, 0.006, 6, 144]} />
        <meshBasicMaterial color="#9ca7d2" transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <mesh ref={high} rotation={[0, 0, 1.3]}>
        <torusGeometry args={[3.42, 0.005, 6, 160]} />
        <meshBasicMaterial color="#c4c8dc" transparent opacity={0.025} depthWrite={false} />
      </mesh>
      <pointLight ref={lowLight} position={[-1.35, 0.2, 0.8]} color="#8e9ee8" distance={2.1} decay={2.4} />
      <pointLight ref={middleLight} position={[0, -0.1, 0.9]} color="#d8d8f2" distance={2} decay={2.5} />
      <pointLight ref={highLight} position={[1.3, 0.15, 0.8]} color="#9ebce8" distance={2.1} decay={2.4} />
    </group>
  );
}

interface PlatformImageProps { src: string }
function PlatformImage({ src }: PlatformImageProps) {
  const texture = useTexture(src)
  const radius = 2.45
  const segments = 128
  return (
    <mesh position={[0, -2.319, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[radius, segments]} />
      <meshStandardMaterial map={texture} transparent opacity={0.05} roughness={1} metalness={0} />
    </mesh>
  )
}

function ResponsiveCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    const w = size.width
    const h = size.height
    let fov = 25
    let pos: [number, number, number] = [-15, 10, 20]

    if (w >= 1440) {
      // Large desktops: zoom in a bit for presence
      fov = 22
      pos = [-12, 8, 16]
    } else if (w >= 1024) {
      // Desktops: slightly closer than default
      fov = 24
      pos = [-14, 9, 18]
    } else if (w < 640) {
      // Small phones: zoom out to ensure labels fit
      fov = 32
      pos = [-20, 12, 26]
    } else if (w < 768) {
      // Phones/tablets: modest zoom out
      fov = 28
      pos = [-17, 11, 23]
    }

    const persp = camera as THREE.PerspectiveCamera
    if (persp && typeof (persp as any).isPerspectiveCamera !== 'undefined') {
      persp.fov = fov
      persp.position.set(pos[0], pos[1], pos[2])
      persp.updateProjectionMatrix()
    } else {
      camera.position.set(pos[0], pos[1], pos[2])
    }
  }, [camera, size.width, size.height])
  return null
}

function HeroScaleGroup({ children }: { children: React.ReactNode }) {
  const { size } = useThree()
  // Scale up the hero/platform slightly on smaller screens without changing label positions
  // Keep scale at 1 on desktops to preserve composition
  let scale = 1
  if (size.width < 640) scale = 1.50
  else if (size.width < 768) scale = 1.25
  else if (size.width < 1024) scale = 1.06
  else scale = 1

  return <group scale={scale}>{children}</group>
}
