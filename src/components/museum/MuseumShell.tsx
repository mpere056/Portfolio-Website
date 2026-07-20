'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useExplorationWorld } from '@/components/experience/ExplorationWorldProvider';
import { createStimulationProfile } from '@/lib/experience/environment';
import type { MuseumExhibitView } from '@/lib/museum/types';
import type { DepthStage } from '@/lib/portfolioContracts';
import { ART_DIRECTION_ASSETS, getMuseumSignalPosition } from '@/lib/artDirection';
import { resolveMuseumHash, resolveMuseumStage } from '@/lib/museum/navigation';
import {
  getMuseumFilamentPath,
  getMuseumSceneFrame,
  getMuseumSignalProximity,
  type MuseumScenePoint,
} from '@/lib/museum/scene';
import ExhibitFallback from './ExhibitFallback';
import ExhibitExperienceBoundary from './ExhibitExperienceBoundary';
import MuseumParticleField from './MuseumParticleField';
import MuseumSelectionContext from './MuseumSelectionContext';
import ProjectStateSummary from './ProjectStateSummary';
import styles from './MuseumShell.module.css';

const LifeInboxExperience = dynamic(() => import('./LifeInboxExperience'), { ssr: false, loading: () => <ExperienceLoading label="Receiving the local specimen" /> });
const DreamlifeExperience = dynamic(() => import('./DreamlifeExperience'), { ssr: false, loading: () => <ExperienceLoading label="Refracting possible futures" /> });
const SudokuTogetherExperience = dynamic(() => import('./SudokuTogetherExperience'), { ssr: false, loading: () => <ExperienceLoading label="Tuning the shared board" /> });

const DIALECTS: Record<string, string> = {
  lifeinbox: 'receiver',
  dreamlife: 'prism',
  'discord-sudoku-activity': 'lattice',
  'story-app': 'folio',
  'group-finder': 'caliper',
  'discord-bot': 'specter',
  'discord-sync-messaging': 'echo',
  'game-mod': 'coral',
  'kitsune-karuta': 'archive',
};

function getApproachArtwork(slug: string) {
  if (slug === 'lifeinbox') return ART_DIRECTION_ASSETS.lifeinbox.src;
  if (slug === 'dreamlife') return ART_DIRECTION_ASSETS.dreamlife.src;
  if (slug === 'discord-sudoku-activity') return ART_DIRECTION_ASSETS.sudoku.src;
  return ART_DIRECTION_ASSETS.museum.src;
}

function ExperienceLoading({ label }: { label: string }) {
  return <div className={styles.experienceLoading}><span />{label}...</div>;
}

interface MuseumShellProps {
  exhibits: readonly MuseumExhibitView[];
  initialSlug?: string;
  enabledExperiences: {
    dreamlife: boolean;
    lifeinbox: boolean;
    sudoku: boolean;
  };
}

export default function MuseumShell({ exhibits, initialSlug, enabledExperiences }: MuseumShellProps) {
  const { state: world } = useExplorationWorld();
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(initialSlug);
  const [selectedStage, setSelectedStage] = useState<DepthStage>('approach');
  const [hoveredSlug, setHoveredSlug] = useState<string>();
  const [pointer, setPointer] = useState<MuseumScenePoint>({ x: 0.5, y: 0.5 });
  const [sceneVisible, setSceneVisible] = useState(true);
  const approachRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const syncLocation = () => {
      const slug = resolveMuseumHash(window.location.hash, exhibits)
        ?? (exhibits.some(item => item.slug === initialSlug) ? initialSlug : undefined);
      const exhibit = exhibits.find(item => item.slug === slug);
      setSelectedSlug(slug);
      setSelectedStage(resolveMuseumStage(window.location.search, exhibit));
    };
    syncLocation();
    window.addEventListener('hashchange', syncLocation);
    window.addEventListener('popstate', syncLocation);
    return () => {
      window.removeEventListener('hashchange', syncLocation);
      window.removeEventListener('popstate', syncLocation);
    };
  }, [exhibits, initialSlug]);

  useEffect(() => {
    if (!selectedSlug || !approachRef.current) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    approachRef.current.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, [selectedSlug, selectedStage]);

  useEffect(() => {
    const updateVisibility = () => setSceneVisible(document.visibilityState !== 'hidden');
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  const selected = exhibits.find(exhibit => exhibit.slug === selectedSlug);
  const stimulation = createStimulationProfile(world.stimulation.normalizedValue, {
    reducedMotionRequested: world.stimulation.reducedMotionRequested,
    soundEnabled: world.stimulation.soundEnabled,
  });
  const activeSceneSlug = hoveredSlug ?? selectedSlug;
  const sceneFrame = getMuseumSceneFrame({
    pointer,
    activeSlug: activeSceneSlug,
    selectedSlug,
    stimulation: stimulation.normalizedValue,
    reducedMotion: world.stimulation.reducedMotionRequested,
    visible: sceneVisible,
  });
  const experienceEnabled = selected?.projectId === 'project:lifeinbox' ? enabledExperiences.lifeinbox
    : selected?.projectId === 'project:dreamlife' ? enabledExperiences.dreamlife
      : selected?.projectId === 'project:discord-sudoku-activity' ? enabledExperiences.sudoku
        : false;
  const activeStage = selected && !experienceEnabled && ['handle', 'enter', 'understand'].includes(selectedStage) ? 'approach' : selectedStage;

  const navigateToStage = (exhibit: MuseumExhibitView, stage: DepthStage) => {
    const url = new URL(window.location.href);
    url.hash = exhibit.slug;
    if (stage === 'approach') url.searchParams.delete('stage');
    else url.searchParams.set('stage', stage);
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setSelectedSlug(exhibit.slug);
    setSelectedStage(stage);
  };

  const returnToSignals = () => {
    const url = new URL(window.location.href);
    url.pathname = '/projects';
    url.searchParams.delete('stage');
    url.hash = 'museum-lobby';
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setSelectedSlug(undefined);
    setSelectedStage('approach');
    document.getElementById('museum-lobby')?.scrollIntoView({ block: 'start' });
  };

  const updateScenePointer = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    setPointer({
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    });
  };

  const sceneStyle = {
    '--scene-x': `${sceneFrame.pointer.x * 100}%`,
    '--scene-y': `${sceneFrame.pointer.y * 100}%`,
    '--aperture-x': `${sceneFrame.aperture.x * 100}%`,
    '--aperture-y': `${sceneFrame.aperture.y * 100}%`,
    '--scene-energy': sceneFrame.energy,
    '--scene-drift-x': `${sceneFrame.drift.x}px`,
    '--scene-drift-y': `${sceneFrame.drift.y}px`,
    '--mesh-drift-x': `${sceneFrame.drift.x * -0.35}px`,
    '--mesh-drift-y': `${sceneFrame.drift.y * -0.35}px`,
    '--aperture-strength': sceneFrame.apertureStrength,
    '--filament-strength': sceneFrame.filamentStrength,
  } as React.CSSProperties;

  return (
    <main id="museum-lobby" aria-label="Project museum" className={styles.museum}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.field}>
        <header className={styles.intro}>
          <p className={styles.orientation}>Museum of working systems</p>
          <h1>Move toward<br />what catches light.</h1>
          <p>Nine projects wait as instruments, specimens, and historical traces. Each reveals a different kind of thinking when approached.</p>
        </header>

        <nav
          aria-label="Project signals"
          className={styles.signals}
          style={sceneStyle}
          data-scene-settled={sceneFrame.settled}
          data-reduced-motion={world.stimulation.reducedMotionRequested}
          data-active-signal={activeSceneSlug}
          onPointerMove={updateScenePointer}
          onPointerLeave={() => {
            setHoveredSlug(undefined);
            setPointer({ x: 0.5, y: 0.5 });
          }}
        >
          <div className={styles.ecology} aria-hidden="true">
            <Image
              src={ART_DIRECTION_ASSETS.museum.src}
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1400px"
              className={styles.ecologyImage}
              data-layer="museum:matte"
            />
            <span
              className={styles.ecologyMembrane}
              data-layer="museum:membrane"
              style={{ backgroundImage: `url(${ART_DIRECTION_ASSETS.museum.src})` }}
            />
            <span
              className={styles.ecologyAperture}
              data-layer="museum:aperture"
              style={{ backgroundImage: `url(${ART_DIRECTION_ASSETS.museum.src})` }}
            />
            <span className={styles.materialMesh} data-layer="museum:membrane" />
            <MuseumParticleField
              target={sceneFrame.aperture}
              energy={sceneFrame.energy}
              count={sceneFrame.particleCount}
              reducedMotion={world.stimulation.reducedMotionRequested || !sceneVisible}
            />
            <span className={styles.ecologyVeil} />
          </div>
          <svg className={styles.sightLines} viewBox="0 0 1200 820" preserveAspectRatio="none" aria-hidden="true">
            <g className={styles.ambientFilaments}>
              <path d="M170 220 C360 120 430 400 610 330 S880 110 1040 250" />
              <path d="M250 620 C420 470 550 690 760 540 S960 520 1080 650" />
              <path d="M610 330 C620 430 650 470 760 540" />
            </g>
            {selected?.semanticConnections.map((connection, index) => (
              <g key={connection.relationshipId} className={styles.semanticFilament} data-strength={connection.strength}>
                <path
                  d={getMuseumFilamentPath(selected.slug, index)}
                  style={{ '--filament-order': index } as React.CSSProperties}
                />
                <circle
                  cx={[1128, 1080, 984][index % 3]}
                  cy={[98, 426, 738][index % 3]}
                  r={connection.strength === 'primary' ? 4 : 2.5}
                />
              </g>
            ))}
          </svg>
          {exhibits.map((exhibit, index) => {
            if (exhibit.status === 'fallback') return <ExhibitFallback key={exhibit.projectId} exhibit={exhibit} />;
            const selectedSignal = exhibit.slug === selectedSlug;
            const position = getMuseumSignalPosition(exhibit.slug, index);
            const proximity = getMuseumSignalProximity(sceneFrame.pointer, exhibit.slug, index);
            return (
              <a
                id={exhibit.slug}
                key={exhibit.projectId}
                href={`#${exhibit.slug}`}
                aria-current={selectedSignal ? 'location' : undefined}
                data-selected={selectedSignal}
                data-dialect={DIALECTS[exhibit.slug] ?? 'archive'}
                data-align={position.align}
                className={styles.signal}
                style={{
                  '--signal-order': index,
                  '--x': `${position.x}%`,
                  '--y': `${position.y}%`,
                  '--proximity': proximity,
                } as React.CSSProperties}
                onPointerEnter={() => setHoveredSlug(exhibit.slug)}
                onFocus={() => setHoveredSlug(exhibit.slug)}
                onBlur={() => setHoveredSlug(undefined)}
                onClick={event => { event.preventDefault(); navigateToStage(exhibit, 'approach'); }}
              >
                <span className={styles.phenomenon} aria-hidden="true"><i /><i /><i /></span>
                <span className={styles.annotation}><small>{exhibit.year}</small><strong>{exhibit.name}</strong><em>{exhibit.headline}</em></span>
              </a>
            );
          })}
          {selected?.semanticConnections[0] ? (
            <aside className={styles.relationshipReadout} data-relationship={selected.semanticConnections[0].relationshipId}>
              <p>Reviewed connection</p>
              <strong>{selected.semanticConnections[0].title}</strong>
              <span>{selected.semanticConnections[0].explanation}</span>
              <a href={selected.semanticConnections[0].href}>Follow the record</a>
            </aside>
          ) : null}
        </nav>

        <p className={styles.freeExplore}>Focus or hover to classify a signal. Deeper behavior is loaded only when invited.</p>

        {selected ? (
          <section
            ref={approachRef}
            aria-live="polite"
            aria-label={`${selected.name} approach`}
            className={styles.approach}
            data-dialect={DIALECTS[selected.slug] ?? 'archive'}
            data-reduced-motion={world.stimulation.reducedMotionRequested}
            style={sceneStyle}
          >
            <MuseumSelectionContext exhibit={selected} stage={activeStage} />
            <button type="button" onClick={returnToSignals} className={styles.returnControl}>Return to the field</button>
            <div className={styles.approachMaterial} aria-hidden="true">
              <span
                className={styles.approachMaterialPlate}
                style={{ backgroundImage: `url(${getApproachArtwork(selected.slug)})` }}
              />
              <span className={styles.approachCaustic} />
            </div>
            <div className={styles.approachPhenomenon} aria-hidden="true"><i /><i /><i /></div>
            <div className={styles.approachCopy}>
              <p className={styles.orientation}>Approach / {selected.year}</p>
              <h2>{selected.headline}</h2>
              <p>{selected.summary}</p>
              {selected.projectState ? <ProjectStateSummary state={selected.projectState} /> : null}
            </div>
            <aside className={styles.approachNotes}>
              <p>material record</p>
              <ul>{selected.tech.map(technology => <li key={technology}>{technology}</li>)}</ul>
              {selected.semanticConnections[0] ? (
                <div className={styles.approachRelationship} data-relationship={selected.semanticConnections[0].relationshipId}>
                  <span>What this instrument connects to</span>
                  <strong>{selected.semanticConnections[0].title}</strong>
                  <p>{selected.semanticConnections[0].explanation}</p>
                  <a href={selected.semanticConnections[0].href}>Inspect the reviewed record</a>
                </div>
              ) : null}
              <div className={styles.approachActions}>
                {experienceEnabled && activeStage === 'approach' ? <button type="button" onClick={() => navigateToStage(selected, 'handle')}>Handle the instrument</button> : null}
                <a href={selected.projectHref}>Enter project world</a>
              </div>
            </aside>

            {experienceEnabled && ['handle', 'enter', 'understand'].includes(activeStage) ? (
              <ExhibitExperienceBoundary projectHref={selected.projectHref}>
                {selected.projectId === 'project:lifeinbox' ? <LifeInboxExperience stage={activeStage} onStageChange={stage => navigateToStage(selected, stage)} projectHref={selected.projectHref} /> : null}
                {selected.projectId === 'project:dreamlife' ? <DreamlifeExperience stage={activeStage} onStageChange={stage => navigateToStage(selected, stage)} projectHref={selected.projectHref} /> : null}
                {selected.projectId === 'project:discord-sudoku-activity' ? <SudokuTogetherExperience stage={activeStage} onStageChange={stage => navigateToStage(selected, stage)} projectHref={selected.projectHref} /> : null}
              </ExhibitExperienceBoundary>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
