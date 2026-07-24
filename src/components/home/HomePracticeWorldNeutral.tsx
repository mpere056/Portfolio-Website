'use client';

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
import styles from './HomePracticeWorldNeutral.module.css';

const ACCENTS: Readonly<Record<HomeTerritoryId, string>> = {
  about: '#d9c8a5',
  music: '#aeb9ff',
  play: '#65d9cf',
  'ai-futures': '#f0c778',
  'life-systems': '#d98c6c',
};

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
              <span className={styles.instrument} aria-hidden="true">
                <span className={styles.outerOrbit} />
                <span className={styles.innerOrbit} />
                <span className={styles.core} />
                <span className={styles.trace} />
              </span>
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
