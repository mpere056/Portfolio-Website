'use client';

import { Html, Line } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { useEffect, useMemo, useState } from 'react';

interface NavPointerProps {
  text?: string;
  path: string;
  position: [number, number, number];
  children?: React.ReactNode;
}

export default function NavPointer({ text, path, position, children }: NavPointerProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // This vector points from the text back towards the center of the scene
  const endPoint = useMemo(() => new THREE.Vector3().fromArray(position).multiplyScalar(-0.5), [position]);

  // Prefetch the target route to minimize navigation delay
  useEffect(() => {
    try {
      (router as any).prefetch?.(path);
    } catch {}
  }, [path, router]);

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
        <button
          type="button"
          onMouseEnter={() => { try { (router as any).prefetch?.(path); } catch {} }}
          onFocus={() => { try { (router as any).prefetch?.(path); } catch {} }}
          onClick={() => { setIsNavigating(true); router.push(path); }}
          aria-busy={isNavigating}
          aria-disabled={isNavigating}
          className={`inline-flex items-center gap-2 cursor-pointer text-white whitespace-nowrap select-none font-mono
                     px-2 py-1 md:px-3 md:py-1.5 lg:px-3 lg:py-1.5 xl:px-3.5 xl:py-2 2xl:px-3.5 2xl:py-2
                     text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl
                     rounded-lg border border-white/10 ${isNavigating ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}
                     backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-200
                     hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
        >
          {isNavigating ? (
            <>
              <span className="inline-block h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>{children ?? text}</>
          )}
        </button>
      </Html>
    </group>
  );
}
