'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  getProjectWorldFrame,
  type ProjectWorld,
  type ProjectWorldPoint,
} from '@/lib/artDirection/projectWorldScene';
import styles from './ProjectWorldScene.module.css';

const PARTICLES = Array.from({ length: 18 }, (_, index) => index);

export default function ProjectWorldScene({
  world,
  src,
}: {
  world: ProjectWorld;
  src: string;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const point = useRef<ProjectWorldPoint>({ x: 0.5, y: 0.5 });
  const frameRequest = useRef<number | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateSettled = () => setSettled(media.matches || document.visibilityState === 'hidden');
    updateSettled();
    media.addEventListener('change', updateSettled);
    document.addEventListener('visibilitychange', updateSettled);
    return () => {
      media.removeEventListener('change', updateSettled);
      document.removeEventListener('visibilitychange', updateSettled);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const paint = () => {
      frameRequest.current = null;
      const frame = getProjectWorldFrame(world, point.current, settled);
      scene.style.setProperty('--world-x', `${frame.x * 100}%`);
      scene.style.setProperty('--world-y', `${frame.y * 100}%`);
      scene.style.setProperty('--world-intensity', `${frame.intensity}`);
      scene.style.setProperty('--world-shift-x', `${frame.primaryShiftX}%`);
      scene.style.setProperty('--world-shift-y', `${frame.primaryShiftY}%`);
      scene.style.setProperty('--world-shift-x-alt', `${frame.secondaryShiftX}%`);
      scene.style.setProperty('--world-shift-y-alt', `${frame.secondaryShiftY}%`);
      scene.style.setProperty('--world-row', `${frame.row}`);
      scene.style.setProperty('--world-column', `${frame.column}`);
    };

    const updatePointer = (event: PointerEvent) => {
      point.current = {
        x: event.clientX / Math.max(window.innerWidth, 1),
        y: event.clientY / Math.max(window.innerHeight, 1),
      };
      if (frameRequest.current === null) frameRequest.current = window.requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', updatePointer);
      if (frameRequest.current !== null) window.cancelAnimationFrame(frameRequest.current);
    };
  }, [settled, world]);

  return (
    <div
      ref={sceneRef}
      className={styles.scene}
      data-world-scene={world}
      data-scene-settled={settled}
      style={{ '--world-intensity': settled ? 0.22 : 0.72 } as CSSProperties}
      aria-hidden="true"
    >
      <Image className={styles.base} src={src} alt="" fill priority sizes="100vw" />
      <span className={`${styles.fragment} ${styles.fragmentPrimary}`}>
        <Image src={src} alt="" fill priority sizes="100vw" />
      </span>
      <span className={`${styles.fragment} ${styles.fragmentSecondary}`}>
        <Image src={src} alt="" fill priority sizes="100vw" />
      </span>

      {world === 'dreamlife' ? (
        <svg className={styles.dreamlifeField} viewBox="0 0 1200 800" preserveAspectRatio="none">
          <ellipse cx="710" cy="370" rx="310" ry="150" />
          <ellipse cx="710" cy="370" rx="430" ry="235" />
          <path d="M180 630 C420 470 420 220 710 370 C920 480 990 230 1170 180" />
          <path d="M240 170 C450 280 540 540 710 370 C870 210 990 540 1160 650" />
        </svg>
      ) : null}

      {world === 'lifeinbox' ? (
        <>
          <div className={styles.lifeInboxParticles}>
            {PARTICLES.map(index => (
              <i
                key={index}
                style={{
                  '--particle': index,
                  '--particle-x': `${42 + (index % 6) * 7}%`,
                  '--particle-y': `${24 + (index % 5) * 11}%`,
                } as CSSProperties}
              />
            ))}
          </div>
          <svg className={styles.lifeInboxField} viewBox="0 0 1200 800" preserveAspectRatio="none">
            <path d="M40 180 C260 120 330 460 610 410 C840 370 870 180 1180 230" />
            <path d="M40 680 C280 730 380 500 610 510 C830 520 920 730 1180 620" />
            <circle cx="785" cy="405" r="118" />
          </svg>
        </>
      ) : null}

      {world === 'sudoku' ? (
        <>
          <span className={styles.sudokuGrid} />
          <span className={styles.sudokuFocus} />
          <svg className={styles.sudokuField} viewBox="0 0 900 900" preserveAspectRatio="none">
            <path d="M20 450 C180 250 290 650 450 450 C610 250 720 650 880 450" />
            <path d="M450 20 C250 180 650 290 450 450 C250 610 650 720 450 880" />
          </svg>
        </>
      ) : null}

      <span className={styles.cursorLight} />
      <span className={styles.veil} />
    </div>
  );
}
