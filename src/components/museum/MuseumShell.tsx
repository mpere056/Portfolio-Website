'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { MuseumExhibitView } from '@/lib/museum/types';
import type { DepthStage } from '@/lib/portfolioContracts';
import { ART_DIRECTION_ASSETS, getMuseumSignalPosition } from '@/lib/artDirection';
import { resolveMuseumHash, resolveMuseumStage } from '@/lib/museum/navigation';
import ExhibitFallback from './ExhibitFallback';
import ExhibitExperienceBoundary from './ExhibitExperienceBoundary';
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
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(initialSlug);
  const [selectedStage, setSelectedStage] = useState<DepthStage>('approach');
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

  const selected = exhibits.find(exhibit => exhibit.slug === selectedSlug);
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

  return (
    <main id="museum-lobby" aria-label="Project museum" className={styles.museum}>
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.field}>
        <header className={styles.intro}>
          <p className={styles.orientation}>Museum of working systems</p>
          <h1>Move toward<br />what catches light.</h1>
          <p>Nine projects wait as instruments, specimens, and historical traces. Each reveals a different kind of thinking when approached.</p>
        </header>

        <nav aria-label="Project signals" className={styles.signals}>
          <div className={styles.ecology} aria-hidden="true">
            <Image
              src={ART_DIRECTION_ASSETS.museum.src}
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1400px"
              className={styles.ecologyImage}
            />
            <span className={styles.ecologyVeil} />
          </div>
          <svg className={styles.sightLines} viewBox="0 0 1200 820" preserveAspectRatio="none" aria-hidden="true">
            <path d="M170 220 C360 120 430 400 610 330 S880 110 1040 250" />
            <path d="M250 620 C420 470 550 690 760 540 S960 520 1080 650" />
            <path d="M610 330 C620 430 650 470 760 540" />
          </svg>
          {exhibits.map((exhibit, index) => {
            if (exhibit.status === 'fallback') return <ExhibitFallback key={exhibit.projectId} exhibit={exhibit} />;
            const selectedSignal = exhibit.slug === selectedSlug;
            const position = getMuseumSignalPosition(exhibit.slug, index);
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
                } as React.CSSProperties}
                onClick={event => { event.preventDefault(); navigateToStage(exhibit, 'approach'); }}
              >
                <span className={styles.phenomenon} aria-hidden="true"><i /><i /><i /></span>
                <span className={styles.annotation}><small>{exhibit.year}</small><strong>{exhibit.name}</strong><em>{exhibit.headline}</em></span>
              </a>
            );
          })}
        </nav>

        <p className={styles.freeExplore}>Focus or hover to classify a signal. Deeper behavior is loaded only when invited.</p>

        {selected ? (
          <section ref={approachRef} aria-live="polite" aria-label={`${selected.name} approach`} className={styles.approach} data-dialect={DIALECTS[selected.slug] ?? 'archive'}>
            <MuseumSelectionContext exhibit={selected} stage={activeStage} />
            <button type="button" onClick={returnToSignals} className={styles.returnControl}>Return to the field</button>
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
