'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { MuseumExhibitView } from '@/lib/museum/types';
import type { DepthStage } from '@/lib/portfolioContracts';
import { resolveMuseumHash, resolveMuseumStage } from '@/lib/museum/navigation';
import ExhibitFallback from './ExhibitFallback';
import ExhibitExperienceBoundary from './ExhibitExperienceBoundary';
import MuseumSelectionContext from './MuseumSelectionContext';
import ProjectStateSummary from './ProjectStateSummary';
import styles from './MuseumShell.module.css';

const SIGNAL_COLORS = ['#c98b57', '#78aaa0', '#d2b66e', '#8a9fc4', '#c77968', '#87a578'];
const LifeInboxExperience = dynamic(() => import('./LifeInboxExperience'), {
  ssr: false,
  loading: () => <div className="mt-8 rounded-[2rem] border border-amber-100/10 bg-[#100e0a] p-8 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-amber-100/45">Opening the local trust boundary...</div>,
});

interface MuseumShellProps {
  exhibits: readonly MuseumExhibitView[];
  lifeInboxExperienceEnabled: boolean;
}

export default function MuseumShell({ exhibits, lifeInboxExperienceEnabled }: MuseumShellProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>();
  const [selectedStage, setSelectedStage] = useState<DepthStage>('approach');
  const approachRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const syncLocation = () => {
      const slug = resolveMuseumHash(window.location.hash, exhibits);
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
  }, [exhibits]);

  useEffect(() => {
    if (!selectedSlug || !approachRef.current) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    approachRef.current.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, [selectedSlug, selectedStage]);

  const selected = exhibits.find(exhibit => exhibit.slug === selectedSlug);
  const activeStage = selected?.projectId === 'project:lifeinbox'
    && !lifeInboxExperienceEnabled
    && ['handle', 'enter', 'understand'].includes(selectedStage)
    ? 'approach'
    : selectedStage;
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
    url.searchParams.delete('stage');
    url.hash = 'museum-lobby';
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setSelectedSlug(undefined);
    setSelectedStage('approach');
    document.getElementById('museum-lobby')?.scrollIntoView({ block: 'start' });
  };

  return (
    <main id="museum-lobby" aria-label="Project museum" className={styles.museum}>
      <div className={styles.field}>
        <header className="max-w-4xl pt-8">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-[#d8b98c]/55">Museum of working systems</p>
          <h1 className="mt-5 font-serif text-5xl font-medium leading-[0.92] tracking-[-0.045em] text-[#f4efe5] md:text-8xl">
            Move toward<br />what catches light.
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-[#f4efe5]/48 md:text-base">
            Nine projects begin as signals. Hover, focus, or choose one to let its problem and shape emerge. Deeper product behavior loads only after you enter it.
          </p>
        </header>

        <nav aria-label="Project signals" className={styles.signals}>
          {exhibits.map((exhibit, index) => {
            if (exhibit.status === 'fallback') {
              return <ExhibitFallback key={exhibit.projectId} exhibit={exhibit} />;
            }
            const selectedSignal = exhibit.slug === selectedSlug;
            return (
              <a
                id={exhibit.slug}
                key={exhibit.projectId}
                href={`#${exhibit.slug}`}
                aria-current={selectedSignal ? 'location' : undefined}
                data-selected={selectedSignal}
                className={styles.signal}
                style={{ '--signal-color': SIGNAL_COLORS[index % SIGNAL_COLORS.length], animationDelay: `${Math.min(index * 70, 420)}ms` } as React.CSSProperties}
                onClick={(event) => { event.preventDefault(); navigateToStage(exhibit, 'approach'); }}
              >
                <span className={styles.signalIndex}>{String(index + 1).padStart(2, '0')}</span>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-[#f4efe5]/35">{exhibit.year} / Signal</p>
                <h2 className="mt-12 max-w-[13rem] font-serif text-3xl font-medium leading-none tracking-[-0.025em] md:text-4xl">{exhibit.name}</h2>
                <p className={`${styles.signalHeadline} mt-5 text-sm leading-6 text-[#f4efe5]/55`}>{exhibit.headline}</p>
              </a>
            );
          })}
        </nav>

        {selected ? (
          <section ref={approachRef} aria-live="polite" aria-label={`${selected.name} approach`} className={styles.approach}>
            <MuseumSelectionContext exhibit={selected} stage={activeStage} />
            <div className={styles.approachGrid}>
              <div>
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-[#d8b98c]/55">Approach / {selected.year}</p>
                <h2 className="mt-4 max-w-3xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.035em] md:text-7xl">{selected.headline}</h2>
                <p className="mt-7 max-w-2xl text-base leading-8 text-[#f4efe5]/58">{selected.summary}</p>
                {selected.projectState ? <ProjectStateSummary state={selected.projectState} /> : null}
              </div>
              <div>
                <div className={styles.tech} aria-label={`${selected.name} technologies`}>
                  {selected.tech.map(technology => <span key={technology}>{technology}</span>)}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  {selected.projectId === 'project:lifeinbox' && activeStage === 'approach' && lifeInboxExperienceEnabled ? (
                    <button type="button" onClick={() => navigateToStage(selected, 'handle')} className="rounded-full bg-[#ead6b5] px-5 py-2.5 text-sm font-semibold text-[#17130f] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ead6b5]">
                      Handle a thought
                    </button>
                  ) : null}
                  <a href={selected.projectHref} className={selected.projectId === 'project:lifeinbox' ? 'rounded-full border border-[#f4efe5]/15 px-5 py-2.5 text-sm text-[#f4efe5]/60 transition hover:border-[#f4efe5]/35 hover:text-[#f4efe5]' : 'rounded-full bg-[#ead6b5] px-5 py-2.5 text-sm font-semibold text-[#17130f] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ead6b5]'}>
                    Enter project world
                  </a>
                  <button type="button" onClick={returnToSignals} className="rounded-full border border-[#f4efe5]/15 px-5 py-2.5 text-sm text-[#f4efe5]/60 transition hover:border-[#f4efe5]/35 hover:text-[#f4efe5]">
                    Return to signals
                  </button>
                </div>
              </div>
            </div>
            {selected.projectId === 'project:lifeinbox' && lifeInboxExperienceEnabled && ['handle', 'enter', 'understand'].includes(activeStage) ? (
              <ExhibitExperienceBoundary projectHref={selected.projectHref}>
                <LifeInboxExperience stage={activeStage} onStageChange={stage => navigateToStage(selected, stage)} projectHref={selected.projectHref} />
              </ExhibitExperienceBoundary>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
