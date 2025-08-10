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
          className="cursor-pointer text-white whitespace-nowrap select-none font-mono
                     px-2 py-1 md:px-3 md:py-1.5 lg:px-3 lg:py-1.5 xl:px-3.5 xl:py-2 2xl:px-3.5 2xl:py-2
                     text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl
                     rounded-lg border border-white/10 bg-white/0 hover:bg-white/10
                     backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-200
                     hover:-translate-y-0.5"
        >
          {children ?? text}
        </div>
      </Html>
    </group>
  );
}
