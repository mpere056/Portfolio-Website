'use client';

import Image from 'next/image';
import {
  useReducer,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import HeroCube from '@/components/HeroCube';
import {
  createHomeWorldState,
  reduceHomeAttention,
  type HomeTerritoryId,
} from '@/lib/experience/homeAttention';
import { HOME_TERRITORY_ANCHORS } from '@/lib/experience/homePracticeWorld';
import { MUSEUM_AMBIENT_PROOF_ASSETS } from '@/lib/museum/ambientProof';
import { MUSEUM_OBSERVATORY_PROOF_ASSETS } from '@/lib/museum/observatoryProof';
import styles from './HomePracticeWorldNeutral.module.css';

const ACCENTS: Readonly<Record<HomeTerritoryId, string>> = {
  about: '#d9c8a5',
  music: '#aeb9ff',
  play: '#65d9cf',
  'ai-futures': '#f0c778',
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

function AiInstrument() {
  return (
    <span
      className={`${styles.instrument} ${styles.proofInstrument} ${styles.aiInstrument}`}
      data-territory-visual="east-observatory"
      aria-hidden="true"
    >
      <span className={`${styles.proofPlate} ${styles.portalPlate}`}>
        <Image
          src={MUSEUM_OBSERVATORY_PROOF_ASSETS.portal}
          alt=""
          fill
          sizes="24vw"
        />
      </span>
      <span className={`${styles.proofPlate} ${styles.observatoryPlate}`}>
        <Image
          src={MUSEUM_OBSERVATORY_PROOF_ASSETS.observatory}
          alt=""
          fill
          sizes="24vw"
        />
      </span>
      <span className={`${styles.proofPlate} ${styles.cityPlate}`}>
        <Image
          src={MUSEUM_OBSERVATORY_PROOF_ASSETS.city}
          alt=""
          fill
          sizes="24vw"
        />
      </span>
      <span className={`${styles.signalCurrent} ${styles.signalCurrentCyan}`} />
      <span className={`${styles.signalCurrent} ${styles.signalCurrentGold}`} />
      <span className={styles.observatoryLight} />
      <span className={styles.observatoryMotes}>
        <i /><i /><i /><i />
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
  if (id === 'ai-futures') return <AiInstrument />;
  if (id === 'life-systems') return <LifeInstrument />;
  return <OrbitInstrument kind={id} />;
}

export default function HomePracticeWorldNeutral() {
  const [state, dispatch] = useReducer(
    reduceHomeAttention,
    undefined,
    createHomeWorldState,
  );

  const attend = (
    id: HomeTerritoryId,
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.pointerType === 'touch') return;
    dispatch({ type: 'sample-proximity', proximities: { [id]: 1 } });
  };

  return (
    <div
      className={styles.world}
      data-home-world-mode={state.mode}
      data-dominant-territory={state.dominantId ?? 'none'}
    >
      <HeroCube variant="practice-neutral" />
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
              } as CSSProperties}
              aria-pressed={selected}
              aria-label={`${anchor.label}: ${anchor.signal}`}
              data-territory={anchor.id}
              data-practice={anchor.practiceId}
              onPointerEnter={event => attend(anchor.id, event)}
              onPointerLeave={() => dispatch({ type: 'calm' })}
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
