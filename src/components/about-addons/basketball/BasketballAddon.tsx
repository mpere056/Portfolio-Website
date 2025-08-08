'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { AddonCommonProps } from '../types';

interface BallState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  radius: number;
}

const PLATFORM_RADIUS = 2.2;
const PLATFORM_HEIGHT = 0.2;
const GRAVITY = -9.8; // m/s^2 in scene units
const LINEAR_DAMPING = 0.05; // per second
const RESTITUTION = 0.65; // bounciness
const FRICTION = 0.98; // horizontal friction on bounce

const RIM_RADIUS = 0.23;
const RIM_THICKNESS = 0.04; // visual tube thickness
const RIM_SEGMENTS = 12; // collision proxy spheres
const RIM_HEIGHT = 1.2;
const RIM_Z = -1.2;
const BACKBOARD_Z = RIM_Z - 0.12;

function useBallPhysics(initialPos: THREE.Vector3): [React.MutableRefObject<BallState>, (impulse: THREE.Vector3) => void] {
  const ballRef = useRef<BallState>({ position: initialPos.clone(), velocity: new THREE.Vector3(), radius: 0.12 });

  const applyImpulse = useCallback((impulse: THREE.Vector3) => {
    const state = ballRef.current;
    state.velocity.add(impulse);
  }, []);

  useFrame((_, delta) => {
    const state = ballRef.current;
    // Integrate gravity
    state.velocity.y += GRAVITY * delta;

    // Apply linear damping
    const damping = Math.exp(-LINEAR_DAMPING * delta);
    state.velocity.multiplyScalar(damping);

    // Integrate position
    state.position.addScaledVector(state.velocity, delta);

    // Collisions: Platform top at y=0 within disc radius
    if (state.position.y - state.radius < 0) {
      // Check if above platform disc
      const radial = Math.hypot(state.position.x, state.position.z);
      if (radial <= PLATFORM_RADIUS + state.radius) {
        state.position.y = state.radius;
        if (state.velocity.y < 0) {
          state.velocity.y = -state.velocity.y * RESTITUTION;
          state.velocity.x *= FRICTION;
          state.velocity.z *= FRICTION;
        }
      }
    }

    // Collisions: backboard (vertical plane at z = BACKBOARD_Z)
    if (state.position.z - state.radius < BACKBOARD_Z) {
      state.position.z = BACKBOARD_Z + state.radius;
      if (state.velocity.z < 0) state.velocity.z = -state.velocity.z * RESTITUTION;
    }

    // Collisions: rim approximated by spheres along a circle
    const rimCenter = new THREE.Vector3(0, RIM_HEIGHT, RIM_Z);
    for (let i = 0; i < RIM_SEGMENTS; i++) {
      const theta = (i / RIM_SEGMENTS) * Math.PI * 2;
      const cx = rimCenter.x + Math.cos(theta) * RIM_RADIUS;
      const cz = rimCenter.z + Math.sin(theta) * RIM_RADIUS;
      const cy = rimCenter.y;
      const center = new THREE.Vector3(cx, cy, cz);
      const toBall = state.position.clone().sub(center);
      const minDist = state.radius + RIM_THICKNESS * 0.5;
      const dist = toBall.length();
      if (dist < minDist) {
        // push out
        const normal = toBall.normalize();
        const penetration = minDist - dist;
        state.position.addScaledVector(normal, penetration);
        const vn = normal.dot(state.velocity);
        // reflect component along normal
        const reflected = normal.clone().multiplyScalar(-vn * (1 + RESTITUTION));
        state.velocity.add(reflected);
      }
    }

    // Soft walls to keep ball on platform area
    const radial = Math.hypot(state.position.x, state.position.z);
    const maxRad = PLATFORM_RADIUS - 0.05;
    if (radial > maxRad) {
      const nx = state.position.x / radial;
      const nz = state.position.z / radial;
      const normal = new THREE.Vector3(nx, 0, nz);
      const penetration = radial - maxRad;
      state.position.addScaledVector(normal, -penetration);
      const vn = normal.dot(state.velocity);
      state.velocity.addScaledVector(normal, -vn * (1 + RESTITUTION));
    }
  });

  return [ballRef, applyImpulse];
}

function SceneContent() {
  const { viewport } = useThree();
  const [scored, setScored] = useState(false);
  const [ballRef, applyImpulse] = useBallPhysics(new THREE.Vector3(0, 0.12, 0.9));
  const ballMesh = useRef<THREE.Mesh>(null!);

  // Scoring detection: crossing through rim plane near center
  const lastYRef = useRef(ballRef.current.position.y);
  useFrame(() => {
    const pos = ballRef.current.position;
    if (ballMesh.current) {
      ballMesh.current.position.copy(pos);
    }
    const wasAbove = lastYRef.current > RIM_HEIGHT;
    const isBelow = pos.y <= RIM_HEIGHT;
    const horizDist = Math.hypot(pos.x - 0, pos.z - RIM_Z);
    if (!scored && wasAbove && isBelow && horizDist < RIM_RADIUS - 0.04) {
      setScored(true);
      setTimeout(() => setScored(false), 1500);
    }
    lastYRef.current = pos.y;
  });

  // Click handling: invisible plane above platform to compute impulse direction
  const planeRef = useRef<THREE.Mesh>(null);
  const tempV = useMemo(() => new THREE.Vector3(), []);

  const onPlaneDown = useCallback((e: any) => {
    e.stopPropagation();
    const p = e.point as THREE.Vector3; // intersection on plane
    const ballPos = ballRef.current.position;
    const toBall = tempV.copy(ballPos).sub(p);
    // Only if click is near the ball
    const distance = toBall.length();
    if (distance > 1.0) return;

    // Impulse magnitude scales with closeness; always add upward component
    const dir = toBall.normalize();
    const horizontal = new THREE.Vector3(dir.x, 0, dir.z).normalize();
    const strength = THREE.MathUtils.clamp(2.2 / Math.max(0.2, distance), 1.2, 5);
    const upward = 1.8 + (1.0 - Math.min(distance, 1.0)) * 1.4;
    const impulse = new THREE.Vector3().copy(horizontal).multiplyScalar(strength);
    impulse.y = upward;
    applyImpulse(impulse);
  }, [applyImpulse, tempV, ballRef]);

  const ballColor = '#ff7a1a';

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={0.9} castShadow />

      {/* Platform */}
      <mesh position={[0, -PLATFORM_HEIGHT / 2, 0]} receiveShadow>
        <cylinderGeometry args={[PLATFORM_RADIUS, PLATFORM_RADIUS, PLATFORM_HEIGHT, 48]} />
        <meshStandardMaterial color="#6b5df0" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Backboard and pole */}
      <mesh position={[0, RIM_HEIGHT + 0.2, RIM_Z - 0.05]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#e6e1ff" />
      </mesh>
      <mesh position={[0, RIM_HEIGHT - 0.4, RIM_Z - 0.05]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#6b5df0" />
      </mesh>

      {/* Rim (visual) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, RIM_HEIGHT, RIM_Z]}>
        <torusGeometry args={[RIM_RADIUS, RIM_THICKNESS / 2, 12, 64]} />
        <meshStandardMaterial color="#ff8f2b" metalness={0.2} roughness={0.4} />
      </mesh>

      {/* Ball */}
      <mesh ref={ballMesh} castShadow position={[0, 0.12, 0.9]}>
        <sphereGeometry args={[ballRef.current.radius, 32, 32]} />
        <meshStandardMaterial color={ballColor} />
      </mesh>

      {/* Invisible interaction plane slightly above platform */}
      <mesh
        ref={planeRef}
        position={[0, ballRef.current.radius * 0.9, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={onPlaneDown}
        visible={false}
      >
        <planeGeometry args={[PLATFORM_RADIUS * 2.2, PLATFORM_RADIUS * 2.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Score label */}
      {scored && (
        <mesh position={[0, RIM_HEIGHT + 0.6, RIM_Z]}>
          <planeGeometry args={[1.2, 0.3]} />
          <meshBasicMaterial color="#00ff8b" transparent opacity={0.75} />
        </mesh>
      )}
    </group>
  );
}

export default function BasketballAddon(_: AddonCommonProps) {
  return (
    <div className="mx-auto w-full max-w-[520px]">
      <div className="h-[380px] w-full overflow-hidden rounded-xl bg-transparent shadow-xl backdrop-blur">
        <Canvas shadows gl={{ alpha: true, antialias: true }} camera={{ position: [5, 5, 4.2], fov: 45 }}>
          <SceneContent />
        </Canvas>
      </div>
      <div className="mt-2 text-xs text-gray-400">Click near the ball to flick it toward the hoop.</div>
    </div>
  );
}


