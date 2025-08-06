'use client';

import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { OrbitControls, Instances, Instance, useGLTF } from '@react-three/drei'
import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing'
import { RoundedBoxGeometry } from 'three-stdlib'
import { motion } from "framer-motion";
import { easing } from 'maath'
import NavPointer from './NavPointer';
import { BufferGeometry } from 'three';

extend({ RoundedBoxGeometry })

export default function HeroCube() {
  return (
    <div className="relative w-screen h-screen">
      <Canvas shadows gl={{ antialias: false }} camera={{ position: [15, 15, 15], fov: 25 }} style={{ height: '100vh', width: '100vw' }}>
        <color attach="background" args={['#151520']} />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[-10, 20, 20]} angle={0.15} penumbra={1} decay={0} intensity={2} castShadow />
        <Particles count={5000} displacement={1.5} visibility={6} intensity={2} />
        <EffectComposer>
          <N8AO aoRadius={1} intensity={1} />
          <Bloom mipmapBlur luminanceThreshold={1} levels={7} intensity={1} />
        </EffectComposer>
        <OrbitControls autoRotate autoRotateSpeed={0.2} />
        <NavPointer text="About Me" path="/about" position={[-4, 3, 4]} />
        <NavPointer text="Projects" path="/projects" position={[4, -2, 4]} />
        <NavPointer text="AI Chat" path="/chat" position={[-4, -2, -4]} />
      </Canvas>
    </div>
  )
}

function Particles({ count, displacement = 3, visibility = 6, intensity = 1 }) {
  const cursor = new THREE.Vector3()
  const oPos = new THREE.Vector3()
  const vec = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const ref = useRef<any>()
  const { scene } = useGLTF('/models/dino/scene.gltf')

  const positions = useMemo(() => {
    const allVertices = [];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof BufferGeometry) {
        const temp = child.geometry.attributes.position.array;
        if (temp) {
          for (let i = 0; i < temp.length; i += 3) {
            allVertices.push([
              temp[i] * 0.18,
              (temp[i + 1] * 0.18) - 1,
              temp[i + 2] * 0.18
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
            if (positions[count]) {
              oPos.set(...positions[count])
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
