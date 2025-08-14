'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioStore } from '@/lib/store';

interface AnalyzerHook {
  analyser: AnalyserNode | null;
  dataArray: Uint8Array<ArrayBuffer> | null;
}

function useAudioAnalyser(): AnalyzerHook {
  const audioEl = useAudioStore(s => s.audioEl);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const connectedRef = useRef(false);
  const outConnectedRef = useRef(false);

  useEffect(() => {
    if (!audioEl) return;
    let mounted = true;
    let cleanup: (() => void) | null = null;
    async function setup() {
      try {
        const ctx = ctxRef.current ?? new (window.AudioContext || (window as any).webkitAudioContext)();
        ctxRef.current = ctx;
        if (ctx.state !== 'running') await ctx.resume().catch(() => {});

        // Avoid multiple connections for the same element
        if (!sourceRef.current) {
          try { (audioEl as any).crossOrigin = 'anonymous'; } catch {}
          sourceRef.current = ctx.createMediaElementSource(audioEl as HTMLMediaElement);
        }

        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 2048; // 1024 bins for finer resolution
        analyserNode.smoothingTimeConstant = 0.65;

        // Connect graph: element -> analyser (for data) and element -> destination (audible)
        try {
          if (!connectedRef.current) {
            sourceRef.current.connect(analyserNode);
            connectedRef.current = true;
          }
          if (!outConnectedRef.current) {
            sourceRef.current.connect(ctx.destination);
            outConnectedRef.current = true;
          }
        } catch {}

        const bufferLength = analyserNode.frequencyBinCount;
        dataRef.current = new Uint8Array(bufferLength) as unknown as Uint8Array<ArrayBuffer>;
        if (mounted) setAnalyser(analyserNode);

        cleanup = () => {
          try { analyserNode.disconnect(); } catch {}
          try { if (sourceRef.current && outConnectedRef.current) { sourceRef.current.disconnect(); outConnectedRef.current = false; } } catch {}
        };
      } catch {
        // ignore
      }
    }
    setup();

    function resumeOnInteract() {
      const ctx = ctxRef.current;
      if (!ctx) return;
      if (ctx.state !== 'running') ctx.resume().catch(() => {});
    }
    const onPlay = () => resumeOnInteract();
    const onPointer = () => resumeOnInteract();
    const onKey = () => resumeOnInteract();
    audioEl.addEventListener('play', onPlay);
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', resumeOnInteract);
    return () => {
      mounted = false;
      audioEl.removeEventListener('play', onPlay);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', resumeOnInteract);
      if (cleanup) cleanup();
    };
  }, [audioEl]);

  return { analyser, dataArray: dataRef.current };
}

function ReactiveSphere() {
  const { analyser, dataArray } = useAudioAnalyser();
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, size } = useThree();
  const basePositionsRef = useRef<Float32Array | null>(null);
  const baseNormalsRef = useRef<Float32Array | null>(null);
  const ampRef = useRef(0);
  const baseScaleRef = useRef(1);
  const prevAmpRef = useRef(0);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geom = mesh.geometry as THREE.SphereGeometry;
    geom.computeVertexNormals();
    const pos = geom.attributes.position.array as Float32Array;
    const norm = geom.attributes.normal.array as Float32Array;
    basePositionsRef.current = new Float32Array(pos.length);
    basePositionsRef.current.set(pos);
    baseNormalsRef.current = new Float32Array(norm.length);
    baseNormalsRef.current.set(norm);
    // Initial scale to reach screen edges
    function updateScale() {
      if (!mesh) return;
      // Distance from camera to mesh z
      const dist = Math.abs(camera.position.z - mesh.position.z);
      const fovRad = (camera as THREE.PerspectiveCamera).fov * Math.PI / 180;
      const halfH = Math.tan(fovRad / 2) * dist;
      const halfW = halfH * (camera as THREE.PerspectiveCamera).aspect;
      const base = Math.max(halfH, halfW) * 1.05; // slightly overscan to touch edges
      mesh.scale.set(base, base, base);
      baseScaleRef.current = base;
    }
    updateScale();
    const onResize = () => updateScale();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || !analyser || !dataArray) return;
    analyser.getByteFrequencyData(dataArray);

    // Emphasize low-mid frequencies
    const startBin = 4;
    const endBin = Math.min(dataArray.length, 220);
    let sum = 0;
    for (let i = startBin; i < endBin; i++) sum += dataArray[i];
    const avg = sum / Math.max(1, endBin - startBin);
    const norm = avg / 255;
    const boosted = Math.pow(norm, 0.8);
    // Smooth amplitude
    ampRef.current = ampRef.current * 0.85 + boosted * 0.15;

    const geom = mesh.geometry as THREE.SphereGeometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const basePos = basePositionsRef.current;
    const baseNorm = baseNormalsRef.current;
    if (!basePos || !baseNorm) return;

    const time = state.clock.getElapsedTime();
    const maxDisplace = 0.25; // displacement in local (pre-scale) units, inward
    const len = pos.length;
    for (let i = 0; i < len; i += 3) {
      const vIdx = i / 3;
      // add a subtle traveling wave pattern around the sphere for variation
      const wave = 0.5 + 0.5 * Math.sin(vIdx * 0.07 + time * 1.4);
      const disp = ampRef.current * maxDisplace * wave;
      // Inward displacement toward center
      pos[i] = basePos[i] - baseNorm[i] * disp;
      pos[i + 1] = basePos[i + 1] - baseNorm[i + 1] * disp;
      pos[i + 2] = basePos[i + 2] - baseNorm[i + 2] * disp;
    }
    posAttr.needsUpdate = true;

    const mat = mesh.material as THREE.MeshStandardMaterial;
    // Visual intensity mapping with threshold and expanded dynamic range
    const vis = Math.min(1, Math.max(0, (ampRef.current - 0.08) / 0.92));
    const i = Math.pow(vis, 1.35);
    // Color ramp: deep purple → blue-cyan → near-white
    const hueStart = 0.95;
    const hueEnd = 0.58;
    const satStart = 0.95;
    const satEnd = 0.5;     // retain more color at peaks (less pure white)
    const lightStart = 0.12;
    const lightEnd = 0.4;   // slightly less bright at max
    const hue = hueStart + (hueEnd - hueStart) * i;
    const sat = satStart + (satEnd - satStart) * i;
    const lig = lightStart + (lightEnd - lightStart) * i;
    mat.color.setHSL(hue, sat, lig);
    // Emissive grows only with higher intensity; no strong glow at low volumes
    const glow = Math.max(0, i - 0.15);
    mat.emissive.setHSL(hueEnd, 0.3, 0.20 + glow * 0.45);
    mat.emissiveIntensity = glow * 0.70;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <sphereGeometry args={[1, 128, 96]} />
      <meshStandardMaterial metalness={0.35} roughness={0.25} wireframe />
    </mesh>
  );
}

function Scene() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, 5.5);
  }, [camera]);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 2]} intensity={0.6} />
      <ReactiveSphere />
    </>
  );
}

export default function ProjectsAudioVisualizer() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (!isDesktop) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-80">
      <Canvas gl={{ antialias: true }} frameloop="always">
        <Scene />
      </Canvas>
    </div>
  );
}


