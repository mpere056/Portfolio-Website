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
  const sourceRef = useRef<AudioNode | null>(null);
  const connectedRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!audioEl) {
      // Clean up if audio element is removed
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      return;
    }

    let mounted = true;
    
    async function setup() {
      try {
        console.log('[Visualizer] setup start, audio playing:', !audioEl?.paused, 'currentTime:', audioEl?.currentTime);
        
        // Create isolated AudioContext for this visualizer
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        ctxRef.current = ctx;
        
        // Resume context if needed
        if (ctx.state !== 'running') {
          await ctx.resume().catch(() => {});
        }

        let sourceNode: AudioNode | null = null;
        let usingMediaElementSource = false;

        // ALWAYS try captureStream first if available
        try {
          // Set crossOrigin to handle CORS issues
          (audioEl as any).crossOrigin = 'anonymous';
          
          // Use captureStream which creates a copy of the audio without interfering
          const stream = (audioEl as any).captureStream?.();
          if (stream && stream.getAudioTracks().length > 0) {
            // Check if the stream actually has audio
            const audioTracks = stream.getAudioTracks();
            if (audioTracks[0] && audioTracks[0].readyState === 'live') {
              sourceNode = ctx.createMediaStreamSource(stream);
              console.log('[Visualizer] source node created via MediaStreamAudioSourceNode');
            }
          }
        } catch (e) {
          console.log('[Visualizer] captureStream failed:', e);
        }

        // Only use MediaElementSource as last resort and only if audio is actually playing
        if (!sourceNode && !audioEl?.paused && (audioEl?.currentTime ?? 0) > 0) {
          try {
            sourceNode = ctx.createMediaElementSource(audioEl as HTMLMediaElement);
            usingMediaElementSource = true;
            console.log('[Visualizer] source node created via MediaElementAudioSourceNode');
            // IMPORTANT: When using MediaElementSource, we MUST connect to destination
            // otherwise the audio element won't play sound
            sourceNode.connect(ctx.destination);
          } catch (e) {
            console.log('[Visualizer] MediaElementSource creation failed:', e);
            return;
          }
        }

        if (!sourceNode) {
          console.log('[Visualizer] No source node could be created - waiting for audio to play');
          return;
        }

        sourceRef.current = sourceNode;

        // Create analyser
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 2048;
        analyserNode.smoothingTimeConstant = 0.65;

        // Connect source to analyser
        sourceNode.connect(analyserNode);
        connectedRef.current = true;
        console.log('[Visualizer] source connected to analyser, using MediaElementSource:', usingMediaElementSource);

        const bufferLength = analyserNode.frequencyBinCount;
        dataRef.current = new Uint8Array(bufferLength) as unknown as Uint8Array<ArrayBuffer>;
        
        if (mounted) {
          setAnalyser(analyserNode);
        }

        // Store cleanup function
        cleanupRef.current = () => {
          console.log('[Visualizer] cleanup: disconnecting nodes');
          try {
            analyserNode.disconnect();
          } catch {}
          try {
            if (sourceNode) {
              sourceNode.disconnect();
            }
          } catch {}
          try {
            if (ctx.state === 'running') {
              ctx.close();
            }
          } catch {}
          connectedRef.current = false;
          sourceRef.current = null;
          ctxRef.current = null;
        };

      } catch (error) {
        console.log('[Visualizer] Setup error:', error);
      }
    }

    // DON'T setup immediately - wait for audio to start playing
    // This prevents MediaElementSource from hijacking the audio element before it starts playing

    // Listen for audio events to setup when safe
    const onPlay = () => {
      console.log('[Visualizer] audio play event, connected:', connectedRef.current);
      // Always try to setup when audio starts playing
      if (!connectedRef.current) {
        console.log('[Visualizer] setting up on play event');
        setup();
      }
    };

    const onTimeUpdate = () => {
      // Also try when audio is progressing (backup for play event)
      if (!connectedRef.current && !audioEl?.paused && (audioEl?.currentTime ?? 0) > 0.1) {
        console.log('[Visualizer] setting up on timeupdate event');
        setup();
      }
    };

    // Add event listeners
    audioEl.addEventListener('play', onPlay);
    audioEl.addEventListener('timeupdate', onTimeUpdate);

    // If audio is already playing, setup immediately
    if (!audioEl?.paused && (audioEl?.currentTime ?? 0) > 0) {
      console.log('[Visualizer] audio already playing, setting up immediately');
      setup();
    }

    return () => {
      console.log('[Visualizer] unmount');
      mounted = false;
      
      // Remove event listeners
      audioEl.removeEventListener('play', onPlay);
      audioEl.removeEventListener('timeupdate', onTimeUpdate);
      
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
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
    
    // Debug: Check if we're getting audio data
    if (sum === 0 && Math.random() < 0.01) { // Log occasionally when no data
      console.log('[Visualizer] No audio data detected, sum:', sum, 'avg:', avg);
    }
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


