'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useExplorationWorld } from '@/components/experience/ExplorationWorldProvider';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';
import type { DepthStage } from '@/lib/portfolioContracts';
import {
  captureLifeInboxEntry,
  initialLifeInboxSpikeState,
  organizeLifeInboxEntry,
} from '@/lib/museum/spikes/lifeInboxSpike';
import type { LifeInboxSpikeState } from '@/lib/museum/spikes/lifeInboxSpike';
import styles from './FlagshipExperiences.module.css';

const SYSTEM_STEPS = [
  { id: 'capture', label: 'Local capture', detail: 'SQLite accepts the thought before network or analysis.' },
  { id: 'sync', label: 'Private sync', detail: 'Dirty state can move through the owned server boundary.' },
  { id: 'enrich', label: 'Illustrative enrichment', detail: 'Organization is shown separately from what was stored.' },
  { id: 'resurface', label: 'Useful return', detail: 'A reminder becomes something the person can act on later.' },
] as const;

export default function LifeInboxExperience({
  stage,
  onStageChange,
  projectHref,
}: {
  stage: DepthStage;
  onStageChange: (stage: DepthStage) => void;
  projectHref: string;
}) {
  const [capture, setCapture] = useState<LifeInboxSpikeState>(initialLifeInboxSpikeState);
  const [selectedLayer, setSelectedLayer] = useState('capture');
  const { store } = useExplorationWorld();

  useEffect(() => {
    store.getState().applyDepthTransition('project:lifeinbox', {
      destinationId: 'destination:museum-project-lifeinbox',
      stage,
      safeState: { stage },
    });
  }, [stage, store]);

  const reset = () => {
    setCapture(initialLifeInboxSpikeState);
    setSelectedLayer('capture');
    onStageChange('handle');
  };
  const specimenLabel = capture.rawText || initialLifeInboxSpikeState.rawText;

  return (
    <section aria-label="LifeInbox depth experience" className={styles.experience}>
      <div className={styles.experienceArtwork} aria-hidden="true">
        <Image src={ART_DIRECTION_ASSETS.lifeinbox.src} alt="" fill sizes="(max-width: 900px) 100vw, 1200px" />
      </div>
      <div className={styles.rail}>
        <div className={styles.depthMarks} aria-label="Exhibit depth">
          {(['handle', 'enter', 'understand'] as const).map(item => (
            <span key={item} data-active={stage === item}>{item}</span>
          ))}
        </div>
        <button type="button" onClick={reset} className={styles.textButton}>Reset specimen</button>
      </div>

      {stage === 'handle' ? (
        <div className={`${styles.stage} ${styles.captureLayout}`}>
          <div>
            <p className={styles.eyebrow}>Handle / a synthetic thought</p>
            <h3 className={styles.title}>Trust begins before intelligence.</h3>
            <p className={styles.intro}>A thought becomes dependable the instant it crosses the local boundary. Nothing here sends personal information anywhere; organization remains visibly separate so this simulation never claims to run the private service.</p>
            <div className={styles.actions}>
              {capture.stage === 'empty' ? <button type="button" onClick={() => setCapture(current => captureLifeInboxEntry(current))} className={styles.primaryAction}>Settle locally</button> : null}
              {capture.stage === 'captured' ? <button type="button" onClick={() => setCapture(current => organizeLifeInboxEntry(current))} className={styles.primaryAction}>Open outer membrane</button> : null}
              {capture.stage === 'organized' ? <button type="button" onClick={() => onStageChange('enter')} className={styles.primaryAction}>Enter the boundaries</button> : null}
            </div>
          </div>

          <div className={styles.receiver} aria-live="polite">
            {capture.stage === 'empty' ? (
              <>
                <label htmlFor="lifeinbox-capture" className="sr-only">A messy thought</label>
                <textarea
                  id="lifeinbox-capture"
                  value={capture.rawText}
                  onChange={event => setCapture({ ...capture, rawText: event.target.value })}
                  className={styles.thoughtInput}
                />
              </>
            ) : (
              <div className={styles.specimen}><span>{specimenLabel}</span></div>
            )}
            {capture.stage !== 'empty' ? <p className={styles.notation}>verified local row<br />{capture.localId}<br />network not required</p> : null}
            {capture.stage === 'organized' ? (
              <div className={styles.orbit} aria-label="Illustrative organization membrane">
                <p className={styles.orbitLabel}>{capture.destination?.title}<br />{capture.destination?.schedule}<br />illustrative, outside the stored core</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {stage === 'enter' || stage === 'understand' ? (
        <div className={`${styles.stage} ${styles.boundaryField}`}>
          <div className={styles.shells} aria-label="LifeInbox trust boundaries">
            {SYSTEM_STEPS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Inspect ${item.label}`}
                data-active={selectedLayer === item.id}
                className={styles.layerButton}
                style={{ '--rotation': `${index % 2 ? 12 : -9}deg` } as React.CSSProperties}
                onClick={() => setSelectedLayer(item.id)}
              />
            ))}
            <div className={`${styles.specimen} ${styles.centralSpecimen}`}><span>{specimenLabel}</span></div>
          </div>

          <div>
            <p className={styles.eyebrow}>{stage} / one thought, four promises</p>
            <h3 className={styles.title}>{stage === 'enter' ? 'Open the system without losing the original.' : 'Every promise begins at a different boundary.'}</h3>
            <div className={styles.layerLegend}>
              {SYSTEM_STEPS.map((item, index) => (
                <button key={item.id} type="button" data-active={selectedLayer === item.id} onClick={() => setSelectedLayer(item.id)}>
                  <span>0{index + 1}</span>
                  <span><strong>{item.label}</strong><span>{item.detail}</span></span>
                </button>
              ))}
            </div>
            {stage === 'enter' ? (
              <div className={styles.actions}>
                <button type="button" onClick={() => onStageChange('understand')} className={styles.primaryAction}>Inspect the proof</button>
                <a href={projectHref} className={styles.secondaryAction}>Enter project world</a>
              </div>
            ) : (
              <div className={styles.evidenceNotes}>
                <p className={styles.intro}>Local SQLite proves the immediate save. Sync and enrichment are later boundaries, so the interface distinguishes what is stored now from what may happen next.</p>
                <a href="https://github.com/mpere056/LifeInbox-Option-B">Source repository / local-first implementation</a>
                <a href="https://lifeinbox.marknperera.ca/blog/local-first-capture-needs-trust">Field note / why capture needs trust</a>
                <a href={projectHref}>Continue through the LifeInbox instrument</a>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
