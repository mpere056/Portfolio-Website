'use client';
import { useFrame, useLoader } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useTimelineStore } from '@/lib/store';
import { easing } from 'maath';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

interface BackgroundProps {
    colors: (string | undefined)[];
    /**
     * Optional list of texture base names (without extension) matching timeline sections.
     * Each will be resolved to `/images/<name>.png`. If omitted or an entry is missing,
     * the default `world_cube` texture will be used.
     */
    textures?: (string | undefined)[];
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

export default function Background({ colors, textures }: BackgroundProps) {
    const groupRef = useRef<THREE.Group>(null!);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null!);

    const activeSection = useTimelineStore((state) => state.activeSection);
    const targetColor = useMemo(() => new THREE.Color(), []);
    // Resolve texture names to URLs and preload them
    const textureNames = useMemo(() => {
        const targetLength = Math.max(colors.length, 1);
        if (!textures || textures.length === 0) {
            return Array(targetLength).fill('world_cube');
        }
        const base = textures.map((name) => name && name.length > 0 ? name : 'world_cube');
        if (base.length < targetLength) {
            return base.concat(Array(targetLength - base.length).fill('world_cube'));
        }
        return base.slice(0, targetLength);
    }, [textures, colors.length]);
    const textureUrls = useMemo(() => textureNames.map((n) => `/images/${n}.png`), [textureNames]);
    const loadedTextures = useLoader(THREE.TextureLoader, textureUrls) as unknown as THREE.Texture[];
    const activeTexture = loadedTextures[activeSection % loadedTextures.length];

    // Derive fallback colors from textures if not explicitly provided
    const [derivedColors, setDerivedColors] = useState<(string | undefined)[]>(() => new Array(textureUrls.length).fill(undefined));

    useEffect(() => {
        function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h = 0, s = 0, l = (max + min) / 2;
            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max - min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h, s, l };
        }

        function toHex(r: number, g: number, b: number): string {
            const hr = r.toString(16).padStart(2, '0');
            const hg = g.toString(16).padStart(2, '0');
            const hb = b.toString(16).padStart(2, '0');
            return `#${hr}${hg}${hb}`;
        }

        function clamp01(v: number): number { return Math.max(0, Math.min(1, v)); }

        function mixWithBlack(r: number, g: number, b: number, factor = 0.7): [number, number, number] {
            const f = clamp01(factor);
            return [Math.round(r * (1 - f)), Math.round(g * (1 - f)), Math.round(b * (1 - f))];
        }

        function computeDominantColor(texture: THREE.Texture): string | undefined {
            const img = texture.image as HTMLImageElement | HTMLCanvasElement | ImageBitmap | undefined;
            if (!img) return undefined;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return undefined;

            const w = (img as any).width ?? (img as HTMLImageElement).naturalWidth ?? 0;
            const h = (img as any).height ?? (img as HTMLImageElement).naturalHeight ?? 0;
            if (!w || !h) return undefined;

            const targetSize = 32;
            canvas.width = targetSize;
            canvas.height = targetSize;
            // Draw scaled down image to reduce computation
            try {
                ctx.drawImage(img as any, 0, 0, targetSize, targetSize);
            } catch {
                return undefined;
            }

            const data = ctx.getImageData(0, 0, targetSize, targetSize).data;
            let sumR = 0, sumG = 0, sumB = 0, count = 0;
            let selR = 0, selG = 0, selB = 0, selCount = 0;

            for (let i = 0; i < data.length; i += 4) {
                const a = data[i + 3];
                if (a < 32) continue;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                sumR += r; sumG += g; sumB += b; count++;
                const { s, l } = rgbToHsl(r, g, b);
                if (s > 0.25 && l > 0.2 && l < 0.8) {
                    selR += r; selG += g; selB += b; selCount++;
                }
            }

            let r: number, g: number, b: number;
            if (selCount > 20) {
                r = Math.round(selR / selCount);
                g = Math.round(selG / selCount);
                b = Math.round(selB / selCount);
            } else if (count > 0) {
                r = Math.round(sumR / count);
                g = Math.round(sumG / count);
                b = Math.round(sumB / count);
            } else {
                return undefined;
            }

            // Darken to fit background aesthetic
            const [dr, dg, db] = mixWithBlack(r, g, b, 0.75);
            return toHex(dr, dg, db);
        }

        const next: (string | undefined)[] = new Array(loadedTextures.length);
        for (let i = 0; i < loadedTextures.length; i++) {
            const c = computeDominantColor(loadedTextures[i]);
            next[i] = c;
        }
        setDerivedColors(next);
        // We want to recompute when textures change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadedTextures]);

    useFrame((state, delta) => {
        if (materialRef.current) {
            const index = activeSection % Math.max(colors.length, 1);
            const fallback = derivedColors[index] ?? '#07070d';
            const activeHex = colors[index] ?? fallback;
            targetColor.set(activeHex);
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
                <meshBasicMaterial map={activeTexture} side={THREE.BackSide} transparent opacity={0.07} />
            </mesh>
            <Stars />
        </group>
    );
}
