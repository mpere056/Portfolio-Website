'use client';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTimelineStore } from '@/lib/store';
import { easing } from 'maath';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

interface BackgroundProps {
    colors: string[];
}

function Stars(props: any) {
    const ref = useRef<THREE.Points>(null!);
    const [sphere] = useMemo(() => random.inSphere(new Float32Array(20000), { radius: 14 }), []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 20;
            ref.current.rotation.y -= delta / 30;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
                <PointMaterial transparent color="#ffffff" size={0.05} sizeAttenuation={true} depthWrite={false} />
            </Points>
        </group>
    );
}

export default function Background({ colors }: BackgroundProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null!);

    const activeSection = useTimelineStore((state) => state.activeSection);
    const targetColor = useMemo(() => new THREE.Color(), []);
    const texture = useLoader(THREE.TextureLoader, '/images/world_cube.png');

    useFrame((state, delta) => {
        if (materialRef.current) {
            targetColor.set(colors[activeSection % colors.length]);
            easing.dampC(materialRef.current.color, targetColor, 0.5, delta);
        }
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {/* This sphere provides the solid, changing background color. */}
            <mesh>
                <sphereGeometry args={[15, 64, 64]} />
                <meshBasicMaterial ref={materialRef} side={THREE.BackSide} />
            </mesh>
            {/* This slightly smaller sphere overlays the transparent texture on top. */}
            <mesh>
                <sphereGeometry args={[14.9, 64, 64]} />
                <meshBasicMaterial map={texture} side={THREE.BackSide} transparent opacity={0.07} />
            </mesh>
            <Stars />
        </group>
    );
}
