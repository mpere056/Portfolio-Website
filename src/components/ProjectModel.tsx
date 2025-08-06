'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Group } from 'three';

interface ProjectModelProps {
  modelName: string;
  cameraPosition?: [number, number, number];
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
}

function Model({ modelName }: { modelName: string }) {
  const { scene } = useGLTF(`/models/${modelName}/scene.gltf`);
  return <primitive object={scene} />;
}

export default function ProjectModel({ 
  modelName, 
  cameraPosition = [20, 20, 15], 
  enableZoom = true, 
  enablePan = true, 
  enableRotate = true 
}: ProjectModelProps) {
  return (
    <Canvas camera={{ position: cameraPosition, fov: 30 }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <group rotation={[0.2, 0.5, 0]}>
        <Model modelName={modelName} />
      </group>
      <OrbitControls 
        enableZoom={enableZoom} 
        enablePan={enablePan} 
        enableRotate={enableRotate} 
        autoRotate 
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
