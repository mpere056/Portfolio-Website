'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

interface ProjectModelProps {
  modelName: string;
}

function Model({ modelName }: { modelName: string }) {
  const { scene } = useGLTF(`/models/${modelName}/scene.gltf`);
  return <primitive object={scene} />;
}

export default function ProjectModel({ modelName }: ProjectModelProps) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Model modelName={modelName} />
      <OrbitControls />
    </Canvas>
  );
}
