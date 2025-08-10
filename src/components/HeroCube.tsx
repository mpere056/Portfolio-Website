'use client';

import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Instances, Instance, useGLTF, Stars } from '@react-three/drei'
import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing'
import { RoundedBoxGeometry } from 'three-stdlib'
import { motion } from "framer-motion";
import { easing } from 'maath'
import NavPointer from './NavPointer';
import { BufferGeometry } from 'three';

extend({ RoundedBoxGeometry })

export default function HeroCube() {
  return (
    <Canvas shadows gl={{ antialias: false }} camera={{ position: [-15, 10, 20], fov: 25 }} style={{ height: '100vh', width: '100vw' }}>
      <color attach="background" args={['#07070d']} />
      {/* Subtle star field for space vibe */}
      <Stars radius={120} depth={50} count={200} factor={5} saturation={0} fade speed={0.5} />
      <ambientLight intensity={0.18} />
      <spotLight position={[-10, 20, 20]} angle={0.15} penumbra={3} decay={0} intensity={2} castShadow />
      <Particles count={10000} displacement={1} visibility={4.5} intensity={2} />
      <EffectComposer>
        <N8AO aoRadius={1} intensity={1} />
        <Bloom mipmapBlur luminanceThreshold={0.3} levels={5} intensity={2} />
      </EffectComposer>
      <OrbitControls autoRotate autoRotateSpeed={0.7} />
      <CursorLight />
      {/* Platform under the hero model */}
      <group>
        <mesh position={[0, -2.42, -0.5]} receiveShadow castShadow>
          <cylinderGeometry args={[2.5, 2.5, 0.2, 64]} />
          <meshStandardMaterial color="#191936" roughness={0.9} metalness={0.1} />
        </mesh>
        <mesh position={[0, -2.31, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.53, 64]} />
          <meshBasicMaterial color="#312f6b" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <NavPointer text="About Me" path="/about" position={[-2, 1.5, 2]} />
      <NavPointer text="Projects" path="/projects" position={[2, -1.5, 2]} />
      <NavPointer path="/chat" position={[-2, -1.5, -2]}>
        <span>Ask Me Anything </span>
        <span className="bg-[linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6,#60a5fa)] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">[AI]</span>
      </NavPointer>
    </Canvas>
  )
}

interface ParticlesProps {
  count: number;
  displacement?: number;
  visibility?: number;
  intensity?: number;
}

function Particles({ count, displacement = 3, visibility = 6, intensity = 1 }: ParticlesProps) {
  const cursor = new THREE.Vector3()
  const oPos = new THREE.Vector3()
  const vec = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const ref = useRef<any>()
  const { scene } = useGLTF('/models/grand_piano/grand_piano_(GLB).gltf')

  const positions = useMemo(() => {
    const allVertices: number[][] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof BufferGeometry) {
        const temp = child.geometry.attributes.position.array;
        if (temp) {
          for (let i = 0; i < temp.length; i += 3) {
            allVertices.push([
              temp[i] * 2,
              (temp[i + 1] * 2) - 1,
              temp[i + 2] * 2
            ]);
          }
        }
      }
    });

    const sampledPositions = [];
    for (let i = 0; i < count; i++) {
      sampledPositions.push(allVertices[Math.floor(Math.random() * allVertices.length)]);
    }

    return sampledPositions;
  }, [scene, count]);

  useFrame(({ pointer, camera, clock }, delta) => {
    cursor.set(pointer.x, pointer.y, 0.5).unproject(camera)
    dir.copy(cursor).sub(camera.position).normalize()
    cursor.add(dir.multiplyScalar(camera.position.length()))
    let count = 0
    if (ref.current) {
        for (let child of ref.current.children) {
            const position = positions[count];
            if (position) {
              oPos.set(position[0], position[1], position[2])
              dir.copy(oPos).sub(cursor).normalize()
              const dist = oPos.distanceTo(cursor)
              const distInv = displacement - dist
              
              const visibilityDistInv = visibility - dist;
              const col = Math.max(0, Math.min(1, 0.5 + visibilityDistInv / 2));
              
              const mov = 1 + Math.sin(clock.elapsedTime * 2 + 1000 * count)
              easing.dampC(child.color, dist > visibility * 1.1 ? '#101010' : new THREE.Color(col, col, col), 0.1, delta);
              easing.damp3(
                child.position,
                dist > displacement ? oPos : vec.copy(oPos).add(dir.multiplyScalar(distInv * intensity + mov / 4)),
                0.2,
                delta
              )
              easing.damp3(child.scale, dist > visibility ? 0.04 : Math.max(0.04, 0.1 - visibilityDistInv * 0.02), 0.2, delta);
            }
            count++;
        }
    }
  })

  return (
    <Instances limit={positions.length} castShadow receiveShadow frames={Infinity} ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshLambertMaterial />
      {positions.map((pos, i) => (
        <Instance key={i} position={pos as [number, number, number]} />
      ))}
    </Instances>
  )
}

function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const cursor = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const platformCenter = new THREE.Vector3(0, -2.42, -0.5)

  useFrame(({ pointer, camera }) => {
    // Project cursor into world space similar to particles
    cursor.set(pointer.x, pointer.y, 0.5).unproject(camera)
    dir.copy(cursor).sub(camera.position).normalize()
    cursor.add(dir.multiplyScalar(camera.position.length()))
    if (lightRef.current) {
      lightRef.current.position.set(cursor.x, cursor.y + 0.6, cursor.z)
      // Stronger falloff relative to platform center distance
      const d = cursor.distanceTo(platformCenter)
      const intensity = THREE.MathUtils.clamp(18 / (0.4 + (d * d * 1.2)), 0.01, 12) // near → very bright, far → nearly off
      lightRef.current.intensity = intensity
    }
  })

  // Point light behaves like a soft spotlight; distance+decay makes farther regions darker
  return <pointLight ref={lightRef} intensity={8} distance={3.8} decay={2.6} color={'#cfd6ff'} />
}
