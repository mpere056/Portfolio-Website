'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useExplorationWorld } from '@/components/experience/ExplorationWorldProvider';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';
import { createStimulationProfile } from '@/lib/experience/environment';
import {
  getLifeInboxBoundaryPath,
  getLifeInboxSceneFrame,
} from '@/lib/museum/lifeInboxScene';
import type { DepthStage } from '@/lib/portfolioContracts';
import {
  captureLifeInboxEntry,
  initialLifeInboxSpikeState,
  organizeLifeInboxEntry,
} from '@/lib/museum/spikes/lifeInboxSpike';
import type { LifeInboxSpikeState } from '@/lib/museum/spikes/lifeInboxSpike';
import LifeInboxMaterialField from './LifeInboxMaterialField';
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
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [visible, setVisible] = useState(true);
  const experienceRef = useRef<HTMLElement>(null);
  const { store, state: world } = useExplorationWorld();

  const stimulation = createStimulationProfile(world.stimulation.normalizedValue, {
    reducedMotionRequested: world.stimulation.reducedMotionRequested,
    soundEnabled: world.stimulation.soundEnabled,
  });
  const scene = getLifeInboxSceneFrame({
    captureStage: capture.stage,
    depthStage: stage,
    selectedLayer,
    pointer,
    stimulation: stimulation.normalizedValue,
    reducedMotion: world.stimulation.reducedMotionRequested,
    visible,
  });
  const sceneStyle = {
    '--lifeinbox-pointer-x': `${scene.pointer.x * 100}%`,
    '--lifeinbox-pointer-y': `${scene.pointer.y * 100}%`,
    '--lifeinbox-target-x': `${scene.target.x * 100}%`,
    '--lifeinbox-target-y': `${scene.target.y * 100}%`,
    '--lifeinbox-energy': scene.energy,
    '--lifeinbox-ingress': scene.ingressStrength,
    '--lifeinbox-settlement': scene.settlementStrength,
    '--lifeinbox-membrane': scene.membraneStrength,
    '--lifeinbox-explosion': scene.explosionStrength,
    '--lifeinbox-evidence': scene.evidenceStrength,
    '--lifeinbox-return': scene.returnStrength,
  } as CSSProperties;

  useEffect(() => {
    store.getState().applyDepthTransition('project:lifeinbox', {
      destinationId: 'destination:museum-project-lifeinbox',
      stage,
      safeState: { stage },
    });
  }, [stage, store]);

  useEffect(() => {
    const element = experienceRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => {
      setVisible(entries[0]?.isIntersecting ?? false);
    }, { rootMargin: '160px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const reset = () => {
    setCapture(initialLifeInboxSpikeState);
    setSelectedLayer('capture');
    onStageChange('handle');
  };
  const specimenLabel = capture.rawText || initialLifeInboxSpikeState.rawText;

  return (
    <section
      ref={experienceRef}
      aria-label="LifeInbox depth experience"
      className={`${styles.experience} ${styles.lifeInboxScene}`}
      data-capture-state={capture.stage}
      data-depth-stage={stage}
      data-selected-layer={selectedLayer}
      data-scene-settled={scene.settled}
      data-reduced-motion={world.stimulation.reducedMotionRequested}
      style={sceneStyle}
      onPointerMove={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        setPointer({
          x: (event.clientX - bounds.left) / bounds.width,
          y: (event.clientY - bounds.top) / bounds.height,
        });
      }}
      onPointerLeave={() => setPointer({ x: 0.5, y: 0.5 })}
    >
      <div className={styles.experienceArtwork} aria-hidden="true" data-layer="lifeinbox:matte">
        <Image src={ART_DIRECTION_ASSETS.lifeinbox.src} alt="" fill sizes="(max-width: 900px) 100vw, 1200px" />
      </div>
      <div className={styles.lifeInboxArtworkEcho} aria-hidden="true" data-layer="lifeinbox:outer-membrane">
        <Image src={ART_DIRECTION_ASSETS.lifeinbox.src} alt="" fill sizes="(max-width: 900px) 100vw, 1200px" />
      </div>
      <div className={styles.lifeInboxIngress} aria-hidden="true" data-layer="lifeinbox:ingress" />
      <LifeInboxMaterialField
        target={scene.target}
        energy={scene.energy}
        count={scene.particleCount}
        captureStage={capture.stage}
        reducedMotion={world.stimulation.reducedMotionRequested || !visible}
      />
      <svg className={styles.lifeInboxPaths} viewBox="0 0 1040 620" aria-hidden="true" data-layer="lifeinbox:boundaries">
        {SYSTEM_STEPS.map((item, index) => (
          <path
            key={item.id}
            d={getLifeInboxBoundaryPath(index, scene.explosionStrength)}
            data-active={selectedLayer === item.id}
            className={styles.lifeInboxBoundaryPath}
          />
        ))}
        <path
          d="M804 144 C892 72 948 88 1008 34"
          className={styles.lifeInboxReturnPath}
          data-active={selectedLayer === 'resurface'}
          data-layer="lifeinbox:return"
        />
        <circle cx="1008" cy="34" r="7" className={styles.lifeInboxReturnNode} />
      </svg>
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

          <div className={styles.receiver} aria-live="polite" data-layer="lifeinbox:local-core">
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
              <div className={styles.orbit} aria-label="Illustrative organization membrane" data-layer="lifeinbox:outer-membrane">
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
            <div className={styles.evidenceNotes} data-layer="lifeinbox:evidence">
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
