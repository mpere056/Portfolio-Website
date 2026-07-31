'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import HeroCube from '@/components/HeroCube';
import {
  createHomeWorldState,
  reduceHomeAttention,
  type HomeTerritoryId,
} from '@/lib/experience/homeAttention';
import {
  HOME_TERRITORY_ANCHORS,
  sampleHomeWorldProximities,
} from '@/lib/experience/homePracticeWorld';
import { MUSEUM_AMBIENT_PROOF_ASSETS } from '@/lib/museum/ambientProof';
import styles from './HomePracticeWorldNeutral.module.css';

const AmbientProof = dynamic(
  () => import('@/components/museum/MuseumAmbientProof'),
  { ssr: false },
);
const ArchiveProof = dynamic(
  () => import('@/components/museum/MuseumArchiveCoreProof'),
  { ssr: false },
);

type ProofTerritoryId = Extract<
  HomeTerritoryId,
  'play' | 'life-systems'
>;

const PROOF_TERRITORIES: readonly ProofTerritoryId[] = [
  'play',
  'life-systems',
];

const ACCENTS: Readonly<Record<HomeTerritoryId, string>> = {
  about: '#d9c8a5',
  music: '#aeb9ff',
  play: '#65d9cf',
  'life-systems': '#d98c6c',
};

function OrbitInstrument({ kind }: { kind: 'about' | 'music' }) {
  return (
    <span
      className={`${styles.instrument} ${styles.orbitInstrument}`}
      data-territory-visual={kind === 'about' ? 'memory-aperture' : 'piano-resonance'}
      aria-hidden="true"
    >
      <span className={styles.outerOrbit} />
      <span className={styles.innerOrbit} />
      <span className={styles.core} />
      <span className={styles.trace} />
    </span>
  );
}

function PlayInstrument() {
  return (
    <span
      className={`${styles.instrument} ${styles.proofInstrument} ${styles.playInstrument}`}
      data-territory-visual="ambient-coral"
      aria-hidden="true"
    >
      <span className={`${styles.proofPlate} ${styles.coralPlate}`}>
        <Image
          src={MUSEUM_AMBIENT_PROOF_ASSETS.coral}
          alt=""
          fill
          sizes="22vw"
        />
      </span>
      <span className={`${styles.proofPlate} ${styles.organismPlate}`}>
        <Image
          src={MUSEUM_AMBIENT_PROOF_ASSETS.organism}
          alt=""
          fill
          sizes="22vw"
        />
      </span>
      <span className={`${styles.proofPlate} ${styles.ringsPlate}`}>
        <Image
          src={MUSEUM_AMBIENT_PROOF_ASSETS.rings}
          alt=""
          fill
          sizes="22vw"
        />
      </span>
      <span className={styles.reefLight} />
      <span className={styles.reefMotes}>
        <i /><i /><i /><i /><i />
      </span>
    </span>
  );
}

function LifeInstrument() {
  return (
    <span
      className={`${styles.instrument} ${styles.bookInstrument}`}
      data-territory-visual="archive-book"
      aria-hidden="true"
    >
      <span className={styles.bookShadow} />
      <span className={`${styles.bookPage} ${styles.bookPageLeft}`}>
        <i /><i /><i />
      </span>
      <span className={`${styles.bookPage} ${styles.bookPageRight}`}>
        <i /><i /><i />
      </span>
      <span className={styles.bookLeaf} />
      <span className={styles.bookSpine} />
      <span className={styles.archiveCity}>
        <i /><i /><i /><i /><i />
      </span>
      <span className={styles.archiveOrbit}>
        <i /><i /><i />
      </span>
      <span className={styles.archiveGlow} />
    </span>
  );
}

function TerritoryInstrument({ id }: { id: HomeTerritoryId }) {
  if (id === 'play') return <PlayInstrument />;
  if (id === 'life-systems') return <LifeInstrument />;
  return <OrbitInstrument kind={id} />;
}

function isProofTerritory(id: HomeTerritoryId | null): id is ProofTerritoryId {
  return id !== null && PROOF_TERRITORIES.includes(id as ProofTerritoryId);
}

function revealStrength(proximity: number, selected: boolean) {
  if (selected) return 1;
  const normalized = Math.max(0, Math.min(1, (proximity - 0.04) / 0.82));
  return normalized * normalized * (3 - 2 * normalized);
}

function ProofWorld({
  id,
  active,
}: {
  id: ProofTerritoryId;
  active: boolean;
}) {
  if (id === 'play') return <AmbientProof embedded active={active} />;
  return <ArchiveProof embedded active={active} />;
}

export default function HomePracticeWorldNeutral() {
  const [state, dispatch] = useReducer(
    reduceHomeAttention,
    undefined,
    createHomeWorldState,
  );
  const pointerFrame = useRef<number | null>(null);
  const pendingPointer = useRef({ x: 0.5, y: 0.5 });
  const [proofLayers, setProofLayers] = useState<ProofTerritoryId[]>([]);
  const dominantProofId = isProofTerritory(state.dominantId)
    ? state.dominantId
    : null;

  useEffect(() => {
    if (!dominantProofId) return;
    setProofLayers(current => [
      dominantProofId,
      ...current.filter(id => id !== dominantProofId),
    ].slice(0, 2));
    const prune = window.setTimeout(() => {
      setProofLayers(current => (
        current.includes(dominantProofId) ? [dominantProofId] : current
      ));
    }, 1400);
    return () => window.clearTimeout(prune);
  }, [dominantProofId]);

  useEffect(() => () => {
    if (pointerFrame.current !== null) {
      window.cancelAnimationFrame(pointerFrame.current);
    }
  }, []);

  const samplePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pendingPointer.current = {
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    };
    if (pointerFrame.current !== null) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      dispatch({
        type: 'sample-proximity',
        proximities: sampleHomeWorldProximities(pendingPointer.current),
      });
      pointerFrame.current = null;
    });
  };

  const worldFocus = Math.max(
    ...HOME_TERRITORY_ANCHORS.map(({ id }) => revealStrength(
      state.territories[id].proximity,
      state.territories[id].selected,
    )),
  );

  return (
    <div
      className={styles.world}
      style={{ '--world-focus': worldFocus } as CSSProperties}
      data-home-world-mode={state.mode}
      data-dominant-territory={state.dominantId ?? 'none'}
      onPointerMove={samplePointer}
      onPointerLeave={() => dispatch({ type: 'calm' })}
    >
      <HeroCube variant="practice-neutral" />
      <div className={styles.worldCompositor} aria-hidden="true">
        {proofLayers.map((id, index) => {
          const territory = state.territories[id];
          const strength = revealStrength(
            territory.proximity,
            territory.selected,
          );
          const anchor = HOME_TERRITORY_ANCHORS.find(item => item.id === id)!;
          return (
            <div
              className={styles.worldLayer}
              data-proof-world={id}
              data-active={index === 0 && strength > 0.02}
              key={id}
              style={{
                '--proof-strength': strength,
                '--proof-origin-x': `${anchor.position.x}%`,
                '--proof-origin-y': `${anchor.position.y}%`,
                zIndex: proofLayers.length - index,
              } as CSSProperties}
            >
              <ProofWorld id={id} active={strength > 0.02} />
            </div>
          );
        })}
      </div>
      <section
        className={styles.anchorLayer}
        aria-label="Explore Mark's practices and story"
      >
        <h1 className="sr-only">Mark Perera practice world</h1>
        {HOME_TERRITORY_ANCHORS.map((anchor) => {
          const territory = state.territories[anchor.id];
          const selected = territory.selected;
          return (
            <button
              key={anchor.id}
              type="button"
              className={`${styles.anchor} ${styles[anchor.id]}`}
              style={{
                '--anchor-x': `${anchor.position.x}%`,
                '--anchor-y': `${anchor.position.y}%`,
                '--territory-accent': ACCENTS[anchor.id],
                '--territory-weight': territory.targetWeight,
                '--territory-proximity': revealStrength(
                  territory.proximity,
                  territory.selected,
                ),
              } as CSSProperties}
              aria-pressed={selected}
              aria-label={`${anchor.label}: ${anchor.signal}`}
              data-territory={anchor.id}
              data-practice={anchor.practiceId}
              onFocus={() => dispatch({ type: 'focus', id: anchor.id })}
              onBlur={() => dispatch({ type: 'focus', id: null })}
              onClick={() => dispatch({
                type: 'select',
                id: selected ? null : anchor.id,
              })}
              onKeyDown={(event) => {
                if (event.key === 'Escape') dispatch({ type: 'back' });
              }}
            >
              <TerritoryInstrument id={anchor.id} />
              <span className={styles.copy}>
                <span className={styles.signal}>{anchor.signal}</span>
                <span className={styles.label}>{anchor.label}</span>
              </span>
            </button>
          );
        })}
      </section>
      <p className={styles.status} aria-live="polite">
        {state.dominantId
          ? `${state.territories[state.dominantId].selected ? 'Selected' : 'Attending'}: ${
            HOME_TERRITORY_ANCHORS.find(anchor => anchor.id === state.dominantId)?.label
          }`
          : 'All five territories are in balance.'}
      </p>
      {state.mode === 'selected' ? (
        <button
          type="button"
          className={styles.returnControl}
          onClick={() => dispatch({ type: 'back' })}
        >
          Return to balance
        </button>
      ) : null}
    </div>
  );
}
