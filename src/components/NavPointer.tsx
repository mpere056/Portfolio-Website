'use client';

import { Html, Line } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

interface NavPointerProps {
  text?: string;
  path: string;
  position: [number, number, number];
  children?: React.ReactNode;
}

export default function NavPointer({ text, path, position, children }: NavPointerProps) {
  const router = useRouter();

  // This vector points from the text back towards the center of the scene
  const endPoint = new THREE.Vector3().fromArray(position).multiplyScalar(-0.5);

  return (
    <group position={position}>
      <Line
        points={[[0, 0, 0], endPoint]}
        color="white"
        lineWidth={0.5}
        transparent
        opacity={0.5}
      />
      <Html center>
        <div
          onClick={() => router.push(path)}
          className="cursor-pointer text-white p-2 whitespace-nowrap hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          style={{ fontFamily: 'monospace', fontSize: '16px' }}
        >
          {children ?? text}
        </div>
      </Html>
    </group>
  );
}
