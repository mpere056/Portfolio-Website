'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useEffect, useState } from 'react';
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
  prefetch = false 
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
         <Canvas dpr={[1, 2]} camera={{ position: cameraPosition, fov: 30 }} style={{ touchAction: 'pan-y', pointerEvents: canHover ? 'auto' : 'none' }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <group rotation={modelRotation} position={modelOffset}>
            <Model modelName={modelName} />
          </group>
           {canHover && (
             <OrbitControls 
              enableZoom={enableZoom} 
              enablePan={enablePan} 
              enableRotate={enableRotate} 
              autoRotate 
              autoRotateSpeed={0.5}
            />
           )}
        </Canvas>
      )}
    </div>
  );
}
