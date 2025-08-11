'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EffectComposer, ChromaticAberration, Noise, Vignette, Glitch, Bloom, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useInView } from 'react-intersection-observer';

interface ProjectModelProps {
  modelName: string;
  cameraPosition?: [number, number, number];
  modelRotation?: [number, number, number];
  modelOffset?: [number, number, number];
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  prefetch?: boolean;
  focused?: boolean;
  interactiveTilt?: boolean;
}

function Model({ modelName }: { modelName: string }) {
  const { scene } = useGLTF(`/models/${modelName}/scene.gltf`);
  return <primitive object={scene} />;
}

export default function ProjectModel({ 
  modelName, 
  cameraPosition = [20, 20, 15], 
  modelRotation = [0.2, 0.5, 0],
  modelOffset = [0, 0, 0],
  enableZoom = true, 
  enablePan = true, 
  enableRotate = true,
  prefetch = false,
  focused = false,
  interactiveTilt = true
}: ProjectModelProps) {
  const [availability, setAvailability] = useState<'checking' | 'available' | 'missing'>('checking');
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: '200px 0px' });
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover)');
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const modelUrl = `/models/${modelName}/scene.gltf`;

    async function check(): Promise<void> {
      try {
        const headResponse = await fetch(modelUrl, { method: 'HEAD' });
        if (!isCancelled && headResponse.ok) {
          setAvailability('available');
          return;
        }
        // Fallback to GET if HEAD is not supported or returns non-OK
        const getResponse = await fetch(modelUrl, { method: 'GET' });
        if (!isCancelled && getResponse.ok) {
          setAvailability('available');
        } else if (!isCancelled) {
          setAvailability('missing');
        }
      } catch {
        if (!isCancelled) setAvailability('missing');
      }
    }

    setAvailability('checking');
    check();
    return () => {
      isCancelled = true;
    };
  }, [modelName]);

  const shouldRender = availability === 'available' && (prefetch || inView);

  return (
    <div ref={ref} className="w-full h-full" style={{ touchAction: 'pan-y' }}>
      {availability === 'checking' && (
        <div className="w-full h-full flex items-center justify-center text-gray-300/70 bg-black/20 rounded-md">
          Loading preview...
        </div>
      )}
      {availability === 'missing' && (
        <div className="w-full h-full flex items-center justify-center text-gray-300/70 border border-white/10 rounded-md bg-gradient-to-br from-zinc-900/60 to-zinc-800/30">
          3D preview coming soon
        </div>
      )}
      {shouldRender && (
         <Canvas dpr={[1, 2]} camera={{ position: cameraPosition, fov: 26 }} style={{ touchAction: 'pan-y', pointerEvents: canHover ? 'auto' : 'none' }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
           <FocusController focused={focused} basePosition={cameraPosition} />
           <TiltGroup baseRotation={modelRotation} position={modelOffset} enabled={interactiveTilt && canHover}>
             <Model modelName={modelName} />
           </TiltGroup>
           {canHover && (
             <OrbitControls 
              enableZoom={enableZoom} 
              enablePan={enablePan} 
              enableRotate={enableRotate} 
              autoRotate 
              autoRotateSpeed={0.5}
            />
           )}
           {focused && (
             <EffectComposer>
               {/* Stronger chroma split */}
               <ChromaticAberration offset={new THREE.Vector2(0.01, 0.01)} radialModulation modulationOffset={0.15} />
               {/* Subtle bloom to lift highlights */}
               <Bloom intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.7} />
               {/* Mild film grain */}
               <Noise premultiply opacity={0.25} />
               {/* Optional camera DOF hint */}
               <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={1.5} />
               {/* Gentle continuous glitch shimmer */}
               <Glitch delay={new THREE.Vector2(0.1, 0.2)} duration={new THREE.Vector2(0.6, 1.0)} strength={new THREE.Vector2(0.1, 0.2)} />
               <Vignette eskil={false} offset={0.1} darkness={0.75} />
             </EffectComposer>
           )}
        </Canvas>
      )}
    </div>
  );
}

function FocusController({ focused, basePosition }: { focused: boolean; basePosition: [number, number, number] }) {
  const { camera } = useThree()
  useFrame((_, dt) => {
    const targetFov = focused ? 10 : 26 // much tighter when focused
    const t = Math.min(1, dt * 3.5)
    // Lerp FOV
    ;(camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
      (camera as THREE.PerspectiveCamera).fov,
      targetFov,
      t
    )
    // Move slightly closer when focused
    const base = new THREE.Vector3(...basePosition)
    const focusedPos = base.clone().multiplyScalar(0.45)
    camera.position.lerp(focused ? focusedPos : base, t)
    ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
  })
  return null
}

function TiltGroup({ children, baseRotation, position, enabled }: { children: React.ReactNode; baseRotation: [number, number, number]; position?: [number, number, number]; enabled: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const { size, viewport, mouse } = useThree()
  const base = useMemo(() => new THREE.Euler(baseRotation[0], baseRotation[1], baseRotation[2]), [baseRotation])
  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    // Target small tilt based on mouse position in NDC
    const maxTilt = 0.15 // radians (~8.6deg)
    const tx = enabled ? THREE.MathUtils.clamp(mouse.y * -maxTilt, -maxTilt, maxTilt) : 0
    const ty = enabled ? THREE.MathUtils.clamp(mouse.x * maxTilt, -maxTilt, maxTilt) : 0
    const targetX = base.x + tx
    const targetY = base.y + ty
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, Math.min(1, dt * 4))
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, Math.min(1, dt * 4))
  })
  return (
    <group ref={ref} rotation={base} position={position}>
      {children}
    </group>
  )
}
