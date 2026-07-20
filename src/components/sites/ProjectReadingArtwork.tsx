'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';
import { getReadingSceneFrame } from '@/lib/artDirection/readingScene';
import styles from './ProjectReadingArtwork.module.css';

const ASSETS = {
  dreamlife: ART_DIRECTION_ASSETS.dreamlife,
  lifeinbox: ART_DIRECTION_ASSETS.lifeinbox,
  sudokutogether: ART_DIRECTION_ASSETS.sudoku,
} as const;

export default function ProjectReadingArtwork({ site }: { site: keyof typeof ASSETS }) {
  const asset = ASSETS[site];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const available = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / available)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const sceneFrame = getReadingSceneFrame(progress);
  return (
    <div
      className={styles.artwork}
      data-site={site}
      data-reading-layers="reading-matte project-material page-fragment margin-trace reading-content"
      aria-hidden="true"
      style={{
        '--reading-progress': sceneFrame.progress,
        '--reading-disturbance': sceneFrame.disturbance,
        '--reading-trace': sceneFrame.trace,
      } as CSSProperties}
    >
      <Image className={styles.material} src={asset.src} alt="" fill priority sizes="100vw" />
      <div className={styles.fragment}>
        <Image src={asset.src} alt="" fill priority sizes="100vw" />
      </div>
      <svg className={styles.trace} viewBox="0 0 1200 700" fill="none">
        <path d="M-40 514C184 382 362 594 588 390C794 204 938 408 1240 172" stroke="currentColor" strokeWidth="0.8" />
        <path d="M18 574C242 438 416 612 612 430C822 236 972 448 1192 280" stroke="currentColor" strokeWidth="0.45" strokeDasharray="3 13" />
      </svg>
      <span className={styles.veil} />
    </div>
  );
}
