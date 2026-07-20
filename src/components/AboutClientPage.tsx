'use client';

import HireMeDrawer from '@/components/HireMeDrawer';
import { TimelineEntry as TimelineEntryType } from '@/lib/timeline';
import TimelineEntry from '@/components/TimelineEntry';
import { Canvas } from '@react-three/fiber';
import Image from 'next/image';
import { Suspense, useMemo, useRef, useEffect, useState, type CSSProperties } from 'react';
import Background from '@/components/Background';
import TimelineIndicator from './TimelineIndicator';
import SmoothSnapScroll from './SmoothSnapScroll';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';
import { useTimelineStore } from '@/lib/store';
import { getAboutSceneFrame } from '@/lib/artDirection/aboutScene';
import supportingStyles from './SupportingScenes.module.css';

interface AboutClientPageProps {
  entries: TimelineEntryType[];
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function AboutClientPage({ entries }: AboutClientPageProps) {
  const colors = useMemo(() => entries.map(entry => entry.color as string | undefined), [entries]);
  const textures = useMemo(() => entries.map(entry => entry.texture as string | undefined), [entries]);
  const opacities = useMemo(() => entries.map(entry => entry.textureOpacity as number | undefined), [entries]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const downSfxRef = useRef<HTMLAudioElement | null>(null);
  const upSfxRef = useRef<HTMLAudioElement | null>(null);
  const durationMs = 1500;
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeSection = useTimelineStore((state) => state.activeSection);
  const sceneFrame = getAboutSceneFrame(activeSection, entries.length, reducedMotion);

  useEffect(() => {
    // Initialize audio effects once on mount
    if (!downSfxRef.current) {
      try {
        const el = new Audio('/audio/scroll.mp3');
        el.preload = 'auto';
        el.volume = 0.35;
        downSfxRef.current = el;
      } catch {}
    }
    if (!upSfxRef.current) {
      try {
        const el = new Audio('/audio/scroll_up.mp3');
        el.preload = 'auto';
        el.volume = 0.35;
        upSfxRef.current = el;
      } catch {}
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState !== 'hidden');
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  function playSfx(direction: number) {
    const primary = direction > 0 ? downSfxRef.current : upSfxRef.current;
    const fallback = downSfxRef.current;
    const el = primary || fallback;
    if (!el) return;
    try {
      el.currentTime = 0;
      el.play().catch(() => {});
    } catch {}
  }

  const animateTo = (targetTop: number, direction: number) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    playSfx(direction);

    const root = scrollRef.current;
    if (!root) {
      isAnimating.current = false;
      return;
    }
    const startTop = root.scrollTop;
    const delta = targetTop - startTop;
    if (reducedMotion) {
      root.scrollTop = targetTop;
      isAnimating.current = false;
      return;
    }
    const startTime = performance.now();
    const prevSnap = (root as HTMLElement).style.scrollSnapType;
    (root as HTMLElement).style.scrollSnapType = 'none';

    function step(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeInOutQuad(t);
      const curRoot = scrollRef.current;
      if (!curRoot) {
        isAnimating.current = false;
        return;
      }
      curRoot.scrollTop = startTop + delta * eased;
      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        (curRoot as HTMLElement).style.scrollSnapType = prevSnap;
        isAnimating.current = false;
        animationFrameRef.current = null;
      }
    }

    animationFrameRef.current = requestAnimationFrame(step);
  };

  const handleYearClick = (index: number) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const sections = Array.from(scrollContainer.querySelectorAll('section')) as HTMLElement[];
    if (sections[index]) {
      const currentScrollTop = scrollContainer.scrollTop;
      const targetScrollTop = sections[index].offsetTop;
      const direction = targetScrollTop > currentScrollTop ? 1 : -1;
      animateTo(targetScrollTop, direction);
    }
  };

  return (
    <div
      className="h-screen w-screen relative overflow-hidden bg-[#05070a]"
      data-about-moment={entries[activeSection]?.id ?? activeSection}
      data-about-layers="archive-matte illuminated-manuscript chronology-prism memory-orbits timeline-content"
      style={{
        '--about-progress': sceneFrame.progress,
        '--about-refraction': sceneFrame.refraction,
        '--about-orbit': sceneFrame.orbit,
      } as CSSProperties}
    >
      <div aria-hidden="true" className={supportingStyles.aboutMaterial}>
        <Image
          src={ART_DIRECTION_ASSETS.about.src}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 70vw"
        />
      </div>
      <div aria-hidden="true" className={supportingStyles.aboutPrism}>
        <Image src={ART_DIRECTION_ASSETS.about.src} alt="" fill sizes="70vw" />
      </div>
      <svg aria-hidden="true" className={supportingStyles.aboutOrbits} viewBox="0 0 900 760" fill="none">
        <ellipse cx="520" cy="360" rx="310" ry="116" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 13" />
        <ellipse cx="520" cy="360" rx="224" ry="256" stroke="currentColor" strokeWidth="0.6" />
        <path d="M90 542C247 372 324 522 520 360C684 224 738 331 868 156" stroke="currentColor" strokeWidth="0.8" />
        <circle cx={210 + sceneFrame.progress * 610} cy={476 - sceneFrame.progress * 262} r="5" fill="currentColor" />
      </svg>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(5,7,10,.9),transparent_42%,rgba(5,7,10,.4))]" />
      <Suspense fallback={null}>
        <Canvas frameloop={pageVisible && !reducedMotion ? 'always' : 'demand'}>
          <Background colors={colors} textures={textures} opacities={opacities} />
        </Canvas>
      </Suspense>

      <div className="hidden md:block">
        <TimelineIndicator entries={entries} onYearClick={handleYearClick} />
      </div>
      
      <div ref={scrollRef} className="absolute inset-0 md:left-[12rem] md:w-[calc(100%-12rem)] h-screen overflow-y-scroll snap-y snap-proximity md:snap-mandatory scrollbar-about">
        {entries.map((entry: TimelineEntryType, index) => (
          <TimelineEntry key={entry.id} entry={entry} index={index} />
        ))}
      </div>
      <SmoothSnapScroll containerRef={scrollRef as any} durationMs={1500} desktopMinWidth={1024} />
      
      <div
        className="fixed md:absolute left-1/2 -translate-x-1/2 z-20 md:bottom-8"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)' }}
      >
        <HireMeDrawer />
      </div>
    </div>
  );
}
