'use client';

import { useEffect, useRef, useState } from 'react';
import type { MuseumExhibitView } from '@/lib/museum/types';
import { resolveMuseumHash } from '@/lib/museum/navigation';
import ExhibitFallback from './ExhibitFallback';
import styles from './MuseumShell.module.css';

const SIGNAL_COLORS = ['#c98b57', '#78aaa0', '#d2b66e', '#8a9fc4', '#c77968', '#87a578'];

interface MuseumShellProps {
  exhibits: readonly MuseumExhibitView[];
}

export default function MuseumShell({ exhibits }: MuseumShellProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>();
  const approachRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const syncHash = () => setSelectedSlug(resolveMuseumHash(window.location.hash, exhibits));
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [exhibits]);

  useEffect(() => {
    if (!selectedSlug || !approachRef.current) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    approachRef.current.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, [selectedSlug]);

  const selected = exhibits.find(exhibit => exhibit.slug === selectedSlug);

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
                onClick={() => setSelectedSlug(exhibit.slug)}
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
            <div className={styles.approachGrid}>
              <div>
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-[#d8b98c]/55">Approach / {selected.year}</p>
                <h2 className="mt-4 max-w-3xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.035em] md:text-7xl">{selected.headline}</h2>
                <p className="mt-7 max-w-2xl text-base leading-8 text-[#f4efe5]/58">{selected.summary}</p>
              </div>
              <div>
                <div className={styles.tech} aria-label={`${selected.name} technologies`}>
                  {selected.tech.map(technology => <span key={technology}>{technology}</span>)}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={selected.projectHref} className="rounded-full bg-[#ead6b5] px-5 py-2.5 text-sm font-semibold text-[#17130f] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ead6b5]">
                    Enter project world
                  </a>
                  <a href="#museum-lobby" onClick={() => setSelectedSlug(undefined)} className="rounded-full border border-[#f4efe5]/15 px-5 py-2.5 text-sm text-[#f4efe5]/60 transition hover:border-[#f4efe5]/35 hover:text-[#f4efe5]">
                    Return to signals
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
