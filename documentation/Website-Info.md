<Task>
I want to create a portfolio website. 
I want it to have a Hero "Igloo" Scene to start (like from this website https://www.igloo.inc/) - except instead of an igloo it would be a cube in a softly lit void. The cube is made up of many mini cubes, and hovering the mouse around the cube would make the mini cubes be displaced and light up and stuff, I'll provide the code for this for your reference. This page shouldn't be scrollable, but around the cube there should be a few buttons that can be clicked on to take the user to places - About Me, Projects, and AI Chat. 
I want it to user Motion (previously called Framer Motion) for animations. And Three.js for certain things. The whole website needs to be responsive, so it'll work on Desktop or Mobile devices.
</Task>

<About Me>
If they click on About Me, this is where they will see a timeline that they can scroll through, so it'll show a timeline of my life and stuff. At various parts of the timeline, there can be various graphics and animations and stuff to make it interesting, and references to projects which they can see more info on if they click on it to go to the Projects section. And at the bottom of this About Me page, there should be a Hire Me button. Clicking on Hire Me would open up something that displays my email address, as well as my Discord name, and X (Twitter) handle, where they can click on one of these and it'll copy it to their clipboard, like it would copy my email address to clipboard or my Discord name or my X handle. 
</About Me>

<Projects>
You can scroll through the page to see the projects.
At the top is a slide show with hover cards with previews for the projects, where clicking on a card will scroll you down to that section on the page.
Each project has its own 3d image/object associated with it, where the image/object rotates slightly based on mouse position, and clicking on it moves the image/object to the left a bit instead of being in the center of the page, and on the width is displayed more info with the project, where there's text and possibly a gif/video or with image(s), etc, or it could even be interactive and something the user can click on and do something on. Then clicking to the left of that info, where the 3d image/object would be would hide the extra info and the image/object would be on the center of the screen again and the user can continue scrolling to see more projects.
</Projects>

<AI Chat>
I'll give AI context on information on myself, so that when it's asked a question about me, it'll be able to answer. Like if it's asked about my skills in a certain area or why I would be good to hire for a certain position, or what I did during a certain point in my life, etc. This AI Chat is something anyone that goes to my website can use for free to find out more info on me.
</AI Chat>

<Cube code>
// https://discourse.threejs.org/t/meshes-push-away-from-mouse-hover/68397

import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { OrbitControls, Instances, Instance } from '@react-three/drei'
import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing'
import { RoundedBoxGeometry } from 'three-stdlib'
import { easing } from 'maath'

extend({ RoundedBoxGeometry })

export default function App() {
  return (
    <Canvas shadows gl={{ antialias: false }} camera={{ position: [15, 15, 15], fov: 25 }}>
      <color attach="background" args={['#151520']} />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[-10, 20, 20]} angle={0.15} penumbra={1} decay={0} intensity={2} castShadow />
      <Cubes gap={0.1} stride={4} displacement={3} intensity={1} />
      <EffectComposer>
        <N8AO aoRadius={1} intensity={1} />
        <Bloom mipmapBlur luminanceThreshold={1} levels={7} intensity={1} />
      </EffectComposer>
      <OrbitControls />
    </Canvas>
  )
}

function Cubes({ gap = 0.1, stride = 4, displacement = 3, intensity = 1 }) {
  const cursor = new THREE.Vector3()
  const oPos = new THREE.Vector3()
  const vec = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const ref = useRef()

  const positions = useMemo(() => {
    const temp = []
    const center = stride / 2 - stride * gap + gap
    for (let x = 0; x < stride; x++)
      for (let y = 0; y < stride; y++)
        for (let z = 0; z < stride; z++) temp.push([x + x * gap - center, y + y * gap - center, z + z * gap - center])
    return temp
  }, [stride, gap])

  useFrame(({ pointer, camera, clock }, delta) => {
    cursor.set(pointer.x, pointer.y, 0.5).unproject(camera)
    dir.copy(cursor).sub(camera.position).normalize()
    cursor.add(dir.multiplyScalar(camera.position.length()))
    let count = 0
    for (let child of ref.current.children) {
      oPos.set(...positions[count++])
      dir.copy(oPos).sub(cursor).normalize()
      const dist = oPos.distanceTo(cursor)
      const distInv = displacement - dist
      const col = Math.max(0.5, distInv) / 1.5
      const mov = 1 + Math.sin(clock.elapsedTime * 2 + 1000 * count)
      easing.dampC(child.color, dist > displacement * 1.1 ? 'white' : [col / 2, col * 2, col * 4], 0.1, delta)
      easing.damp3(
        child.position,
        dist > displacement ? oPos : vec.copy(oPos).add(dir.multiplyScalar(distInv * intensity + mov / 4)),
        0.2,
        delta
      )
    }
  })

  return (
    <Instances key={stride} limit={stride * stride * stride} castShadow receiveShadow frames={Infinity} ref={ref}>
      <roundedBoxGeometry args={[1, 1, 1, 2, 0.15]} />
      <meshLambertMaterial />
      {Array.from({ length: stride * stride * stride }, (v, n) => (
        <Instance key={n} position={positions[n]} />
      ))}
    </Instances>
  )
}
</Cube code>