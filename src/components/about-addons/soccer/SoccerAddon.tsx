'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { AddonCommonProps } from '../types';

interface BallState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  radius: number;
}

const PLATFORM_RADIUS = 2.4;
const PLATFORM_HEIGHT = 0.2;
const GRAVITY = -9.8;
const LINEAR_DAMPING = 0.06;
const RESTITUTION = 0.6;
const FRICTION = 0.985;
const CEILING_HEIGHT = 1.8; // maximum Y height the ball can reach

const GOAL_WIDTH = 1.6;
const GOAL_HEIGHT = 0.9;
const GOAL_DEPTH = 0.55;
const GOAL_FRONT_Z = -1.35;
const POST_RADIUS = 0.05; // visual thickness and collision proxy
const SIDE_THICKNESS = 0.02; // side wall logical thickness for collision

function useBallPhysics(initialPos: THREE.Vector3) {
  const ballRef = useRef<BallState>({ position: initialPos.clone(), velocity: new THREE.Vector3(), radius: 0.13 });

  const applyImpulse = useCallback((impulse: THREE.Vector3) => {
    ballRef.current.velocity.add(impulse);
  }, []);

  // Precompute goal-frame collision spheres (posts and crossbar)
  const goalSpheres = useMemo(() => {
    const centers: THREE.Vector3[] = [];
    const segsVertical = 8;
    const segsHorizontal = 10;
    // Left post
    for (let i = 0; i <= segsVertical; i++) {
      const t = i / segsVertical;
      centers.push(new THREE.Vector3(-GOAL_WIDTH / 2, t * GOAL_HEIGHT, GOAL_FRONT_Z));
    }
    // Right post
    for (let i = 0; i <= segsVertical; i++) {
      const t = i / segsVertical;
      centers.push(new THREE.Vector3(GOAL_WIDTH / 2, t * GOAL_HEIGHT, GOAL_FRONT_Z));
    }
    // Crossbar
    for (let i = 0; i <= segsHorizontal; i++) {
      const t = i / segsHorizontal;
      centers.push(new THREE.Vector3(-GOAL_WIDTH / 2 + t * GOAL_WIDTH, GOAL_HEIGHT, GOAL_FRONT_Z));
    }
    // Back net/plane posts (coarse) for some rebound
    for (let i = 0; i <= segsHorizontal; i++) {
      const t = i / segsHorizontal;
      centers.push(new THREE.Vector3(-GOAL_WIDTH / 2 + t * GOAL_WIDTH, GOAL_HEIGHT * 0.5, GOAL_FRONT_Z - GOAL_DEPTH));
    }
    return centers;
  }, []);

  useFrame((_, delta) => {
    const s = ballRef.current;
    // Gravity
    s.velocity.y += GRAVITY * delta;
    // Damping
    const d = Math.exp(-LINEAR_DAMPING * delta);
    s.velocity.multiplyScalar(d);
    // Integrate
    s.position.addScaledVector(s.velocity, delta);

    // Ground/platform
    if (s.position.y - s.radius < 0) {
      const radial = Math.hypot(s.position.x, s.position.z);
      if (radial <= PLATFORM_RADIUS + s.radius) {
        s.position.y = s.radius;
        if (s.velocity.y < 0) {
          s.velocity.y = -s.velocity.y * RESTITUTION;
          s.velocity.x *= FRICTION;
          s.velocity.z *= FRICTION;
        }
      }
    }

    // Platform rim soft wall
    const radial = Math.hypot(s.position.x, s.position.z);
    const maxRad = PLATFORM_RADIUS - 0.05;
    if (radial > maxRad) {
      const nx = s.position.x / radial;
      const nz = s.position.z / radial;
      const normal = new THREE.Vector3(nx, 0, nz);
      const penetration = radial - maxRad;
      s.position.addScaledVector(normal, -penetration);
      const vn = normal.dot(s.velocity);
      s.velocity.addScaledVector(normal, -vn * (1 + RESTITUTION));
    }

    // Ceiling bound
    if (s.position.y + s.radius > CEILING_HEIGHT) {
      s.position.y = CEILING_HEIGHT - s.radius;
      if (s.velocity.y > 0) {
        s.velocity.y = -s.velocity.y * RESTITUTION;
        s.velocity.x *= FRICTION;
        s.velocity.z *= FRICTION;
      }
    }

    // Goal frame collisions (posts, crossbar, hint of back)
    for (const c of goalSpheres) {
      const toBall = s.position.clone().sub(c);
      const minDist = s.radius + POST_RADIUS;
      const dist = toBall.length();
      if (dist < minDist) {
        const n = toBall.normalize();
        const pen = minDist - dist;
        s.position.addScaledVector(n, pen);
        const vn = n.dot(s.velocity);
        s.velocity.addScaledVector(n, -vn * (1 + RESTITUTION));
      }
    }

    // Back plane (net) bounce
    const backZ = GOAL_FRONT_Z - GOAL_DEPTH - 0.02;
    if (s.position.z - s.radius < backZ) {
      s.position.z = backZ + s.radius;
      if (s.velocity.z < 0) s.velocity.z = -s.velocity.z * 0.3;
    }

    // Side walls to prevent going around the goal posts
    // Treat as vertical planes located just outside each post.
    const insideGoalDepth = s.position.z <= GOAL_FRONT_Z + 0.01 && s.position.z >= backZ - 0.02;
    const belowCrossbar = s.position.y <= GOAL_HEIGHT + 0.1;
    if (insideGoalDepth && belowCrossbar) {
      const sideX = GOAL_WIDTH / 2 + POST_RADIUS; // plane position
      // Right wall (plane normal +X). If moving inward (vx < 0) and overlapping, bounce to the outside
      if (s.position.x + s.radius > sideX && s.velocity.x < 0) {
        s.position.x = sideX + s.radius; // keep outside of the wall
        s.velocity.x = -s.velocity.x * RESTITUTION;
        s.velocity.y *= FRICTION; s.velocity.z *= FRICTION;
      }
      // Left wall (plane normal -X). If moving inward (vx > 0) and overlapping, bounce to the outside
      if (s.position.x - s.radius < -sideX && s.velocity.x > 0) {
        s.position.x = -sideX - s.radius; // keep outside of the wall
        s.velocity.x = -s.velocity.x * RESTITUTION;
        s.velocity.y *= FRICTION; s.velocity.z *= FRICTION;
      }
    }
  });

  return [ballRef, applyImpulse] as const;
}

function SceneContent() {
  const [scored, setScored] = useState(false);
  const [ballRef, applyImpulse] = useBallPhysics(new THREE.Vector3(0.0, 0.13, 0.9));
  const meshRef = useRef<THREE.Mesh>(null!);
  const lastZ = useRef(ballRef.current.position.z);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  // Confetti state
  const CONFETTI_COUNT = 140;
  const confettiPositions = useRef<Float32Array>(new Float32Array(CONFETTI_COUNT * 3));
  const confettiVelocities = useRef<Float32Array>(new Float32Array(CONFETTI_COUNT * 3));
  const confettiLife = useRef<Float32Array>(new Float32Array(CONFETTI_COUNT));
  const confettiColors = useRef<Float32Array>(new Float32Array(CONFETTI_COUNT * 3));
  const confettiActive = useRef(false);
  const confettiRef = useRef<THREE.Points>(null!);
  const scoreLockRef = useRef(false);

  function triggerConfetti(origin: THREE.Vector3) {
    const colorPalette = [
      new THREE.Color('#ff4d4d'),
      new THREE.Color('#ffd24d'),
      new THREE.Color('#4dff88'),
      new THREE.Color('#4dc3ff'),
      new THREE.Color('#b64dff'),
    ];
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      // small spawn volume near the goal mouth
      const ox = (Math.random() - 0.5) * (GOAL_WIDTH * 0.6);
      const oy = Math.random() * (GOAL_HEIGHT * 0.8);
      const oz = (Math.random() * -0.1); // slightly behind front plane
      confettiPositions.current[i * 3 + 0] = origin.x + ox;
      confettiPositions.current[i * 3 + 1] = origin.y + oy;
      confettiPositions.current[i * 3 + 2] = origin.z + oz;

      // velocity – outward and upward burst
      const theta = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 1.6;
      confettiVelocities.current[i * 3 + 0] = Math.cos(theta) * speed;
      confettiVelocities.current[i * 3 + 1] = 1.8 + Math.random() * 1.6;
      confettiVelocities.current[i * 3 + 2] = -Math.abs(Math.sin(theta) * speed) * 0.6; // bias into goal

      confettiLife.current[i] = 0.8 + Math.random() * 0.7;
      const c = colorPalette[(Math.random() * colorPalette.length) | 0];
      confettiColors.current[i * 3 + 0] = c.r;
      confettiColors.current[i * 3 + 1] = c.g;
      confettiColors.current[i * 3 + 2] = c.b;
    }
    confettiActive.current = true;
    if (confettiRef.current) confettiRef.current.visible = true;
    // mark attributes for update on next frame
    const geo = confettiRef.current.geometry as THREE.BufferGeometry;
    (geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (geo.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
  }

  // scoring detection (requires being within mouth horizontally/vertically)
  useFrame(() => {
    const p = ballRef.current.position;
    if (meshRef.current) meshRef.current.position.copy(p);

    const r = ballRef.current.radius;
    const pastPlaneNow = p.z <= GOAL_FRONT_Z - Math.max(0.005, r * 0.15);
    const crossedFront = lastZ.current > GOAL_FRONT_Z && pastPlaneNow;
    const insideMouthNow =
      Math.abs(p.x) <= (GOAL_WIDTH / 2 - r - POST_RADIUS * 0.2) &&
      p.y <= (GOAL_HEIGHT - r * 0.6);
    if (!scoreLockRef.current && !scored && insideMouthNow && (crossedFront || pastPlaneNow)) {
      scoreLockRef.current = true;
      setScored(true);
      // trigger confetti from goal mouth and reset ball shortly after
      triggerConfetti(new THREE.Vector3(0, GOAL_HEIGHT * 0.4, GOAL_FRONT_Z - 0.02));
      setTimeout(() => {
        const s = ballRef.current;
        s.position.set(0, 0.7, 0.8); // drop a bit farther from the goal
        s.velocity.set(0, 0, 0);
      }, 600);
      setTimeout(() => {
        setScored(false);
        scoreLockRef.current = false;
      }, 700);
    }
    lastZ.current = p.z;
  });

  // update confetti
  useFrame((_, dt) => {
    if (!confettiActive.current || !confettiRef.current) return;
    const drag = Math.exp(-1.5 * dt);
    let alive = 0;
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      let life = confettiLife.current[i];
      if (life <= 0) continue;
      life -= dt;
      confettiLife.current[i] = life;
      if (life <= 0) continue;
      alive++;
      const ix = i * 3;
      // velocity with gravity
      confettiVelocities.current[ix + 1] += GRAVITY * 0.6 * dt;
      confettiVelocities.current[ix + 0] *= drag;
      confettiVelocities.current[ix + 1] *= drag;
      confettiVelocities.current[ix + 2] *= drag;

      confettiPositions.current[ix + 0] += confettiVelocities.current[ix + 0] * dt;
      confettiPositions.current[ix + 1] += confettiVelocities.current[ix + 1] * dt;
      confettiPositions.current[ix + 2] += confettiVelocities.current[ix + 2] * dt;
    }
    const geo = confettiRef.current.geometry as THREE.BufferGeometry;
    (geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    if (alive === 0) {
      confettiActive.current = false;
      confettiRef.current.visible = false;
    }
  });

  const onPlaneDown = useCallback((e: any) => {
    e.stopPropagation();
    const click = e.point as THREE.Vector3;
    const ballPos = ballRef.current.position;
    tmp.copy(ballPos).sub(click);
    const dist = tmp.length();
    if (dist > 1.2) return;

    const dir = tmp.normalize();
    const horiz = new THREE.Vector3(dir.x, 0, dir.z).normalize();
    const strength = THREE.MathUtils.clamp(2.0 / Math.max(0.25, dist), 1.0, 4.2);
    const upward = 1.0 + (1.0 - Math.min(1.0, dist)) * 0.8;
    const impulse = new THREE.Vector3().copy(horiz).multiplyScalar(strength);
    impulse.y = upward;
    applyImpulse(impulse);
  }, [applyImpulse, tmp]);

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={0.9} castShadow />

      {/* Platform */}
      <mesh position={[0, -PLATFORM_HEIGHT / 2, 0]} receiveShadow>
        <cylinderGeometry args={[PLATFORM_RADIUS, PLATFORM_RADIUS, PLATFORM_HEIGHT, 48]} />
        <meshStandardMaterial color="#2f855a" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Goal frame */}
      <mesh position={[-GOAL_WIDTH / 2, GOAL_HEIGHT / 2, GOAL_FRONT_Z]}>
        <boxGeometry args={[POST_RADIUS * 2, GOAL_HEIGHT, POST_RADIUS * 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[GOAL_WIDTH / 2, GOAL_HEIGHT / 2, GOAL_FRONT_Z]}>
        <boxGeometry args={[POST_RADIUS * 2, GOAL_HEIGHT, POST_RADIUS * 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, GOAL_HEIGHT, GOAL_FRONT_Z]}>
        <boxGeometry args={[GOAL_WIDTH + POST_RADIUS * 2, POST_RADIUS * 2, POST_RADIUS * 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Back net */}
      <mesh position={[0, GOAL_HEIGHT / 2.2, GOAL_FRONT_Z - GOAL_DEPTH]}>
        <boxGeometry args={[GOAL_WIDTH, GOAL_HEIGHT * 0.8, 0.02]} />
        <meshStandardMaterial color="#d9e8ff" transparent opacity={0.25} />
      </mesh>

      {/* Ball */}
      <mesh ref={meshRef} castShadow position={[0, 0.13, 0.9]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Confetti (points) */}
      <points ref={confettiRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={confettiPositions.current}
            count={CONFETTI_COUNT}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={confettiColors.current}
            count={CONFETTI_COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors depthWrite={false} transparent opacity={0.95} />
      </points>

      {/* Interaction plane */}
      <mesh
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={onPlaneDown}
        visible={false}
      >
        <planeGeometry args={[PLATFORM_RADIUS * 2.2, PLATFORM_RADIUS * 2.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Score label */}
      {scored && (
        <mesh position={[0, GOAL_HEIGHT + 0.5, GOAL_FRONT_Z - GOAL_DEPTH / 2]}>
          <planeGeometry args={[1.2, 0.3]} />
          <meshBasicMaterial color="#00ff8b" transparent opacity={0.75} />
        </mesh>
      )}
    </group>
  );
}

export default function SoccerAddon(_: AddonCommonProps) {
  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="h-[380px] w-full overflow-hidden rounded-xl bg-transparent shadow-xl backdrop-blur">
        <Canvas shadows gl={{ alpha: true, antialias: true }} camera={{ position: [2, 3, 5], fov: 45 }}>
          <SceneContent />
        </Canvas>
      </div>
      <div className="mt-2 text-xs text-gray-400">Click near the ball to kick it into the goal.</div>
    </div>
  );
}


