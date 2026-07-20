'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useExplorationWorld } from '@/components/experience/ExplorationWorldProvider';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';
import { createStimulationProfile } from '@/lib/experience/environment';
import { getDreamlifeLoopPath, getDreamlifeSceneFrame } from '@/lib/museum/dreamlifeScene';
import type { DepthStage } from '@/lib/portfolioContracts';
import styles from './FlagshipExperiences.module.css';

const PATHS = [
  { id: 'current', label: 'Current', detail: 'The life already forming if the present direction continues.' },
  { id: 'fallback', label: 'Fallback', detail: 'A viable path that preserves what matters while reducing risk.' },
  { id: 'wild', label: 'Wild Card', detail: 'A deliberately surprising future that exposes hidden desire.' },
] as const;

const LOOP = [
  { label: 'Vision', detail: 'Generate several futures so preference becomes visible through contrast.' },
  { label: 'Explore', detail: 'Collect daily reactions, highlights, friction, and tomorrow plans.' },
  { label: 'Refine', detail: 'Turn signal into a small edit or experiment, then return to the stories.' },
] as const;

export default function DreamlifeExperience({
  stage,
  onStageChange,
  projectHref,
}: {
  stage: DepthStage;
  onStageChange: (stage: DepthStage) => void;
  projectHref: string;
}) {
  const [path, setPath] = useState<(typeof PATHS)[number]['id']>('wild');
  const [reaction, setReaction] = useState('pull');
  const [visible, setVisible] = useState(true);
  const experienceRef = useRef<HTMLElement>(null);
  const { store, state: world } = useExplorationWorld();

  const stimulation = createStimulationProfile(world.stimulation.normalizedValue, {
    reducedMotionRequested: world.stimulation.reducedMotionRequested,
    soundEnabled: world.stimulation.soundEnabled,
  });
  const scene = getDreamlifeSceneFrame({
    path,
    reaction: reaction as 'resist' | 'curious' | 'pull',
    stage,
    stimulation: stimulation.normalizedValue,
    reducedMotion: world.stimulation.reducedMotionRequested,
    visible,
  });
  const sceneStyle = {
    '--dreamlife-energy': scene.energy,
    '--dreamlife-divergence': scene.divergence,
    '--dreamlife-refraction': scene.refraction,
    '--dreamlife-recombination': scene.recombination,
    '--dreamlife-evidence': scene.evidenceStrength,
    '--dreamlife-angle': `${scene.selectedAngle}deg`,
    '--dreamlife-x': `${scene.selectedX * 100}%`,
    '--dreamlife-y': `${scene.selectedY * 100}%`,
  } as CSSProperties;

  useEffect(() => {
    store.getState().applyDepthTransition('project:dreamlife', {
      destinationId: 'destination:museum-project-dreamlife',
      stage,
      safeState: { stage },
    });
  }, [stage, store]);

  useEffect(() => {
    const element = experienceRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { rootMargin: '160px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const selected = PATHS.find(item => item.id === path) ?? PATHS[2];

  return (
    <section
      ref={experienceRef}
      aria-label="Dreamlife depth experience"
      className={`${styles.experience} ${styles.dreamlife} ${styles.dreamlifeScene}`}
      data-path={path}
      data-reaction={reaction}
      data-depth-stage={stage}
      data-scene-settled={scene.settled}
      data-reduced-motion={world.stimulation.reducedMotionRequested}
      style={sceneStyle}
    >
      <div className={styles.experienceArtwork} aria-hidden="true" data-layer="dreamlife:matte">
        <Image src={ART_DIRECTION_ASSETS.dreamlife.src} alt="" fill sizes="(max-width: 900px) 100vw, 1200px" />
      </div>
      <div className={styles.dreamlifeFragments} aria-hidden="true">
        {(['current', 'fallback', 'wild'] as const).map(fragment => (
          <div key={fragment} className={styles.dreamlifeFragment} data-fragment={fragment} data-active={path === fragment} data-layer={`dreamlife:${fragment}`}>
            <Image src={ART_DIRECTION_ASSETS.dreamlife.src} alt="" fill sizes="(max-width: 900px) 100vw, 1200px" />
          </div>
        ))}
      </div>
      <svg className={styles.dreamlifeLoopField} viewBox="0 0 1020 600" aria-hidden="true" data-layer="dreamlife:loop">
        {[0, 1, 2].map(index => <path key={index} d={getDreamlifeLoopPath(index, scene.recombination)} data-active={index === PATHS.findIndex(item => item.id === path)} />)}
        <circle cx="510" cy="300" r="8" />
      </svg>
      <div className={styles.rail}>
        <div className={styles.depthMarks} aria-label="Exhibit depth">
          {(['handle', 'enter', 'understand'] as const).map(item => <span key={item} data-active={stage === item}>{item}</span>)}
        </div>
        <button type="button" className={styles.textButton} onClick={() => { setPath('wild'); setReaction('pull'); onStageChange('handle'); }}>Reset paths</button>
      </div>

      {stage === 'handle' ? (
        <div className={`${styles.stage} ${styles.futureField}`}>
          <div>
            <p className={styles.eyebrow}>Handle / three futures from one present</p>
            <h3 className={styles.title}>Preference appears through contrast.</h3>
            <p className={styles.intro}>Choose the future that creates the strongest reaction. Dreamlife treats that reaction as signal, not destiny, and turns it into something small enough to test.</p>
            <div className={styles.reactionScale} aria-label="Reaction to selected future">
              {['resist', 'curious', 'pull'].map(item => <button key={item} type="button" data-active={reaction === item} onClick={() => setReaction(item)}>{item}</button>)}
            </div>
            <div className={styles.actions}><button type="button" className={styles.primaryAction} onClick={() => onStageChange('enter')}>Prototype this signal</button></div>
          </div>
          <div className={styles.prism} aria-label="Dreamlife future prism" data-layer="dreamlife:reaction">
            <div className={styles.prismCore} aria-hidden="true" />
            {PATHS.map(item => (
              <button key={item.id} type="button" className={styles.pathButton} data-active={path === item.id} onClick={() => setPath(item.id)}>
                <strong>{item.label}</strong><span>{item.detail}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {stage === 'enter' ? (
        <div className={styles.stage}>
          <p className={styles.eyebrow}>Enter / a bounded experiment</p>
          <h3 className={styles.title}>Make the {selected.label} path one percent more observable.</h3>
          <p className={styles.intro}>The selected path produced <strong>{reaction}</strong>. A useful next move is not to choose a whole life; it is to collect better evidence this week.</p>
          <div className={styles.loopDiagram}>
            <div className={styles.loopNode}><strong>Signal</strong><p>{selected.detail}</p></div>
            <div className={styles.loopNode}><strong>Experiment</strong><p>Schedule one ninety-minute block that resembles this future, then record the actual reaction.</p></div>
            <div className={styles.loopNode}><strong>Return</strong><p>Bring the result back into the future stories and revise what no longer feels true.</p></div>
          </div>
          <div className={styles.actions}><button type="button" className={styles.primaryAction} onClick={() => onStageChange('understand')}>Open the product loop</button><a href={projectHref} className={styles.secondaryAction}>Enter Dreamlife</a></div>
        </div>
      ) : null}

      {stage === 'understand' ? (
        <div className={styles.stage}>
          <p className={styles.eyebrow}>Understand / vision, explore, refine</p>
          <h3 className={styles.title}>A life story becomes useful when it can change.</h3>
          <div className={styles.loopDiagram}>
            {LOOP.map(item => <div key={item.label} className={styles.loopNode}><strong>{item.label}</strong><p>{item.detail}</p></div>)}
          </div>
          <div className={styles.evidenceNotes} data-layer="dreamlife:evidence">
            <p className={styles.intro}>The prototype combined parallel future stories, daily reflection, highlighted signal, and conversational edits. Its product clarity was strong enough to lead to a six-figure build offer.</p>
            <a href="https://github.com/dreamlife-app/dreamlife-mobile">Source repository / mobile product implementation</a>
            <a href="https://dreamlife.marknperera.ca/blog/building-a-life-design-loop">Build note / the life-design loop</a>
            <a href={projectHref}>Continue through the Dreamlife prism</a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
