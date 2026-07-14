'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useCursor, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface ClickState {
  name: string | null;
  at: number; // ms timestamp
}

interface NormalizedInfo {
  scaleVec: [number, number, number];
  innerPosition: [number, number, number];
  labelY: number;
  size: THREE.Vector3; // local size before scaling
  maxDim: number;
}

function useNormalized(scene: THREE.Object3D | undefined, targetMax = 1.6): NormalizedInfo | undefined {
  return useMemo(() => {
    if (!scene) return undefined;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = targetMax / maxDim;
    const inner = new THREE.Vector3(-center.x, -box.min.y, -center.z);
    const labelHeight = size.y * s + 0.12;
    return {
      scaleVec: [s, s, s],
      innerPosition: inner.toArray() as [number, number, number],
      labelY: labelHeight,
      size,
      maxDim,
    };
  }, [scene, targetMax]);
}

interface GuestItemProps {
  modelName: 'kitsune' | 'dino' | 'discord_bot';
  parentMaxDim: number; // life_app local max dimension (pre-scale)
  position: [number, number, number]; // in life_app local space (pre-scale)
  rotation?: [number, number, number];
  isSelected: boolean;
  onClick: (name: string) => void;
  scaleMultiplier?: number; // additional scale multiplier per model
  groupRef?: React.RefObject<THREE.Group | null>;
}

function GuestItem({ modelName, parentMaxDim, position, rotation = [0, 0, 0], isSelected, onClick, scaleMultiplier = 1, groupRef }: GuestItemProps) {
  const { scene } = useGLTF(`/models/${modelName}/scene.gltf`);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const norm = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const guestMax = Math.max(size.x, size.y, size.z) || 1;
    const targetLocalMax = parentMaxDim * 0.18; // 18% of life_app's max dimension
    const s = (targetLocalMax / guestMax) * scaleMultiplier;
    const inner = new THREE.Vector3(-center.x, -box.min.y, -center.z);
    const labelHeight = size.y * s + 0.06;
    return { scaleVec: [s, s, s] as [number, number, number], innerPosition: inner.toArray() as [number, number, number], labelY: labelHeight };
  }, [scene, parentMaxDim]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={norm.scaleVec}
      onClick={(e) => { e.stopPropagation(); onClick(modelName); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={scene} position={norm.innerPosition} />
      {isSelected && (
        <Html position={[0, norm.labelY, 0]} center style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,0.65)', color: 'white', padding: '4px 8px', borderRadius: 6, fontSize: 12, letterSpacing: 0.3 }}>
            {modelName}
          </div>
        </Html>
      )}
    </group>
  );
}

type ActiveKey = 'life_app' | 'kitsune' | 'dino' | 'discord_bot';

function LifeAppWithGuests({ activeKey, clicked, onClick }: { activeKey: ActiveKey; clicked: string | null; onClick: (name: string) => void }) {
  const { scene: lifeScene } = useGLTF('/models/life_app_scene/scene.gltf');
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const hostRef = useRef<THREE.Group>(null);
  const lifeGltfRef = useRef<THREE.Group>(null);
  const norm = useNormalized(lifeScene, 2.2); // make the room a bit larger as the host
  const lifeMax = norm?.maxDim ?? 1;
  const lifeSize = norm?.size ?? new THREE.Vector3(1, 1, 1);

  const [anchorBath, setAnchorBath] = useState<THREE.Vector3 | null>(null);
  const [anchorDoor, setAnchorDoor] = useState<THREE.Vector3 | null>(null);
  const [anchorOpen, setAnchorOpen] = useState<THREE.Vector3 | null>(null);

  // Refs for guests to allow camera focusing
  const kitsuneRef = useRef<THREE.Group>(null);
  const dinoRef = useRef<THREE.Group>(null);
  const discordBotRef = useRef<THREE.Group>(null);

  // Resolve anchors to host-local coordinates
  useEffect(() => {
    if (!lifeScene || !hostRef.current) return;

    const gather = () => {
      hostRef.current!.updateWorldMatrix(true, true);
      lifeScene.updateWorldMatrix(true, true);

      const bath = lifeScene.getObjectByName('Anchor_bath') ?? null;
      const door = lifeScene.getObjectByName('Anchor_near_door') ?? null;
      const open = lifeScene.getObjectByName('Anchor_open') ?? null;

      const toLocal = (obj?: THREE.Object3D | null) => {
        if (!obj) return null;
        const wp = new THREE.Vector3();
        obj.getWorldPosition(wp);
        return hostRef.current!.worldToLocal(wp);
      };

      setAnchorBath(toLocal(bath));
      setAnchorDoor(toLocal(door));
      setAnchorOpen(toLocal(open));
    };

    // Wait a tick to ensure matrices are settled
    const raf = requestAnimationFrame(gather);
    return () => cancelAnimationFrame(raf);
  }, [lifeScene]);

  if (!norm) return null;

  // Fallbacks (approximate) if anchors are missing
  const floorY = Math.max(0.02 * lifeMax, 0.02);
  const fallbackKitsune: [number, number, number] = [lifeSize.x * -0.08, floorY, lifeSize.z * 0.04];
  const fallbackDino: [number, number, number] = [lifeSize.x * 0.2, floorY, lifeSize.z * -0.02];
  const fallbackDiscordBot: [number, number, number] = [lifeSize.x * 0.42, floorY, lifeSize.z * 0.02];

  const getPosition = (anchor: THREE.Vector3 | null, fallback: [number, number, number], offset: { x?: number; y?: number; z?: number } = {}): [number, number, number] => {
    const base = anchor ? [anchor.x, anchor.y, anchor.z] : fallback;
    return [base[0] + (offset.x ?? 0), base[1] + (offset.y ?? 0), base[2] + (offset.z ?? 0)];
  };

  return (
    <group
      ref={hostRef}
      scale={norm.scaleVec}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick('life_app'); }}
    >
      <group ref={lifeGltfRef} position={norm.innerPosition}>
        <primitive object={lifeScene} />
      </group>
      {clicked === 'life_app' && (
        <Html position={[0, norm.labelY, 0]} center style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,0.65)', color: 'white', padding: '4px 8px', borderRadius: 6, fontSize: 12, letterSpacing: 0.3 }}>life_app</div>
        </Html>
      )}

      {/* Guests bound to anchors */}
      <GuestItem
        modelName="kitsune"
        parentMaxDim={lifeMax}
        position={getPosition(anchorBath, fallbackKitsune, { y: 0.06 })}
        rotation={[0, Math.PI * 0.75, 0]}
        isSelected={clicked === 'kitsune'}
        onClick={onClick}
        groupRef={kitsuneRef}
      />
      <GuestItem
        modelName="dino"
        parentMaxDim={lifeMax}
        position={getPosition(anchorOpen, fallbackDino)}
        rotation={[0, -Math.PI * 0.3, 0]}
        isSelected={clicked === 'dino'}
        onClick={onClick}
        scaleMultiplier={0.6}
        groupRef={dinoRef}
      />
      <GuestItem
        modelName="discord_bot"
        parentMaxDim={lifeMax}
        position={getPosition(anchorDoor, fallbackDiscordBot, { x: 0.15 })}
        rotation={[0, Math.PI * 0.95, 0]}
        isSelected={clicked === 'discord_bot'}
        onClick={onClick}
        groupRef={discordBotRef}
      />

      <FocusRig
        active={activeKey}
        lifeRef={lifeGltfRef}
        kitsuneRef={kitsuneRef}
        dinoRef={dinoRef}
        discordBotRef={discordBotRef}
      />
    </group>
  );
}

function FocusRig({ active, lifeRef, kitsuneRef, dinoRef, discordBotRef }: { active: ActiveKey; lifeRef: React.RefObject<THREE.Group | null>; kitsuneRef: React.RefObject<THREE.Group | null>; dinoRef: React.RefObject<THREE.Group | null>; discordBotRef: React.RefObject<THREE.Group | null> }) {
  const { camera } = useThree();
  const dir = useMemo(() => new THREE.Vector3(1, 0.32, -1).normalize(), []);
  const tmpBox = useMemo(() => new THREE.Box3(), []);
  const tmpSphere = useMemo(() => new THREE.Sphere(), []);
  const target = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const obj = active === 'life_app' ? lifeRef.current : active === 'kitsune' ? kitsuneRef.current : active === 'dino' ? dinoRef.current : discordBotRef.current;
    if (!obj) return;
    tmpBox.setFromObject(obj);
    tmpBox.getBoundingSphere(tmpSphere);
    target.current.copy(tmpSphere.center);

    const fov = (camera as THREE.PerspectiveCamera).fov;
    const dist = (tmpSphere.radius / Math.sin(THREE.MathUtils.degToRad(fov / 2))) * 1.2;
    desired.current.copy(target.current).addScaledVector(dir, dist);

    camera.position.lerp(desired.current, 1 - Math.exp(-dt * 3));
    camera.lookAt(target.current);
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  });

  return null;
}

function ScrollIndicator() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'sans-serif',
        fontSize: 12,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
      }}
    >
      <style>{`
        @keyframes bounce-indicator {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }
      `}</style>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: 'bounce-indicator 2s infinite',
        }}
      >
        <path d="M19.5 9L12 16.5L4.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Scroll</span>
    </div>
  );
}

function TimelineNav({ active, onJump }: { active: ActiveKey; onJump: (key: ActiveKey) => void }) {
  const items: { key: ActiveKey; label: string }[] = [
    { key: 'life_app', label: 'Life App' },
    { key: 'kitsune', label: 'Kitsune' },
    { key: 'dino', label: 'Dino' },
    { key: 'discord_bot', label: 'Discord Bot' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '10px 12px',
        background: 'linear-gradient(180deg, rgba(20,20,20,0.7), rgba(20,20,20,0.35))',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 6px 30px rgba(0,0,0,0.35)',
      }}
    >
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onJump(it.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              width: 180,
              color: 'white',
              background: isActive ? 'linear-gradient(90deg, rgba(99,179,237,0.35), rgba(56,189,248,0.25))' : 'transparent',
              border: '1px solid ' + (isActive ? 'rgba(146, 205, 255, 0.55)' : 'rgba(255,255,255,0.08)'),
              borderRadius: 10,
              cursor: 'pointer',
              opacity: isActive ? 1 : 0.8,
              transition: 'opacity 160ms ease, background 160ms ease, border 160ms ease',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: isActive ? '#8ec5ff' : 'rgba(255,255,255,0.35)',
                boxShadow: isActive ? '0 0 8px #8ec5ff' : 'none',
              }}
            />
            <span style={{ fontSize: 13, letterSpacing: 0.35 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function DemoPage() {
  const [clicked, setClicked] = useState<ClickState>({ name: null, at: 0 });
  const [active, setActive] = useState<ActiveKey>('life_app');
  const [hasScrolled, setHasScrolled] = useState(false);

  // Scroll sections observers
  const { ref: sLife, inView: vLife } = useInView({ threshold: 0.7 });
  const { ref: sKitsune, inView: vKitsune } = useInView({ threshold: 0.7 });
  const { ref: sDino, inView: vDino } = useInView({ threshold: 0.7 });
  const { ref: sDiscordBot, inView: vDiscordBot } = useInView({ threshold: 0.7 });

  // Keep element refs to programmatically scroll
  const lifeSectionRef = useRef<HTMLDivElement | null>(null);
  const kitsuneSectionRef = useRef<HTMLDivElement | null>(null);
  const dinoSectionRef = useRef<HTMLDivElement | null>(null);
  const discordBotSectionRef = useRef<HTMLDivElement | null>(null);

  // Compose refs (observer + our DOM ref)
  const setLifeRef = useCallback((node: HTMLDivElement | null) => { lifeSectionRef.current = node; (sLife as any)(node); }, [sLife]);
  const setKitsuneRef = useCallback((node: HTMLDivElement | null) => { kitsuneSectionRef.current = node; (sKitsune as any)(node); }, [sKitsune]);
  const setDinoRef = useCallback((node: HTMLDivElement | null) => { dinoSectionRef.current = node; (sDino as any)(node); }, [sDino]);
  const setDiscordBotRef = useCallback((node: HTMLDivElement | null) => { discordBotSectionRef.current = node; (sDiscordBot as any)(node); }, [sDiscordBot]);

  useEffect(() => {
    if (vLife) setActive('life_app');
    else if (vKitsune) setActive('kitsune');
    else if (vDino) setActive('dino');
    else if (vDiscordBot) setActive('discord_bot');
  }, [vLife, vKitsune, vDino, vDiscordBot]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
        window.removeEventListener('scroll', onScroll);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true });
      if (window.scrollY > 20) setHasScrolled(true);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  const scrollToKey = useCallback((key: ActiveKey) => {
    const node = key === 'life_app'
      ? lifeSectionRef.current
      : key === 'kitsune'
        ? kitsuneSectionRef.current
        : key === 'dino'
          ? dinoSectionRef.current
          : discordBotSectionRef.current;
    node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Auto-clear label after a short duration
  useEffect(() => {
    if (!clicked.name) return;
    const t = setTimeout(() => setClicked({ name: null, at: 0 }), 1500);
    return () => clearTimeout(t);
  }, [clicked]);

  return (
    <div style={{ width: '100%', minHeight: '100dvh', background: 'black' }}>
      <div style={{ position: 'fixed', inset: 0 }}>
        <Canvas dpr={[1, 2]} camera={{ position: [3.5, 2.1, 5.5], fov: 50 }} style={{ touchAction: 'pan-y' }}>
        <color attach="background" args={[0x111111]} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        <directionalLight position={[-5, 2, -3]} intensity={0.4} />

          <Suspense fallback={null}>
            <LifeAppWithGuests activeKey={active} clicked={clicked.name} onClick={(n) => setClicked({ name: n, at: Date.now() })} />
          </Suspense>
        </Canvas>
      </div>

      {/* HUD label */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '6px 10px',
          borderRadius: 8,
          fontSize: 13,
          color: 'white',
          background: 'rgba(0,0,0,0.4)',
          transition: 'background 180ms ease',
          pointerEvents: 'none',
          letterSpacing: 0.3,
        }}
      >
        {active}
      </div>

      {/* Left timeline nav */}
      <div style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2, pointerEvents: 'auto' }}>
        <TimelineNav active={active} onJump={scrollToKey} />
      </div>

      {/* Scroll Indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          zIndex: 10,
          transition: 'opacity 400ms ease, transform 400ms ease',
          opacity: hasScrolled ? 0 : 1,
          transform: `translateX(-50%) translateY(${hasScrolled ? '10px' : '0px'})`,
          pointerEvents: 'none',
        }}
      >
        <ScrollIndicator />
      </div>

      {/* Scroll timeline overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '400dvh',
          scrollSnapType: 'y mandatory',
          overscrollBehavior: 'contain',
          pointerEvents: 'none',
        }}
      >
        <section ref={setLifeRef} style={{ height: '100dvh', scrollSnapAlign: 'start' }} />
        <section ref={setKitsuneRef} style={{ height: '100dvh', scrollSnapAlign: 'start' }} />
        <section ref={setDinoRef} style={{ height: '100dvh', scrollSnapAlign: 'start' }} />
        <section ref={setDiscordBotRef} style={{ height: '100dvh', scrollSnapAlign: 'start' }} />
      </div>
    </div>
  );
}

// Preload assets for snappier entry
useGLTF.preload('/models/dino/scene.gltf');
useGLTF.preload('/models/kitsune/scene.gltf');
useGLTF.preload('/models/life_app_scene/scene.gltf');
useGLTF.preload('/models/discord_bot/scene.gltf');


