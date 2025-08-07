'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Group } from 'three';

interface ProjectPreviewProps {
  modelName?: string;
  cameraPosition?: [number, number, number];
  className?: string;
}

function SpinningGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.6;
    ref.current.rotation.x = 0.2;
  });
  return <group ref={ref}>{children}</group>;
}

function GLTFPreview({ modelName }: { modelName: string }) {
  const { scene } = useGLTF(`/models/${modelName}/scene.gltf`);
  return (
    <SpinningGroup>
      <primitive object={scene} />
    </SpinningGroup>
  );
}

function FallbackPreview() {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.8;
    ref.current.rotation.x = 0.3;
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#9aa4b2" metalness={0.4} roughness={0.25} />
      </mesh>
    </group>
  );
}

export default function ProjectPreview({ modelName, cameraPosition = [3, 3, 4], className }: ProjectPreviewProps) {
  const [available, setAvailable] = useState<'checking' | 'yes' | 'no'>('checking');
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: '200px 0px' });

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!modelName) {
        if (!cancelled) setAvailable('no');
        return;
      }
      const url = `/models/${modelName}/scene.gltf`;
      try {
        const head = await fetch(url, { method: 'HEAD' });
        if (!cancelled && head.ok) return setAvailable('yes');
        const get = await fetch(url, { method: 'GET' });
        if (!cancelled) setAvailable(get.ok ? 'yes' : 'no');
      } catch {
        if (!cancelled) setAvailable('no');
      }
    }
    setAvailable('checking');
    check();
    return () => {
      cancelled = true;
    };
  }, [modelName]);

  const shouldRenderCanvas = inView || isHovered;

  return (
    <div ref={ref} className={className} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {shouldRenderCanvas ? (
        <Canvas dpr={[1, 2]} camera={{ position: cameraPosition, fov: 35 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 3, 2]} intensity={1} />
          <directionalLight position={[-3, -2, -2]} intensity={0.4} />
          <Suspense fallback={null}>
            {available === 'yes' ? (
              <GLTFPreview modelName={modelName!} />
            ) : (
              <FallbackPreview />
            )}
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-zinc-800/60 to-zinc-700/40" />
      )}
    </div>
  );
}


