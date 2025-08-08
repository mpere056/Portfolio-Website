'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectSection from '@/components/ProjectSection';
import type { Project } from '@/lib/projects';

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return; // Only apply custom scroll on desktop
    const el = containerRef.current;
    if (!el) return;

    let deltaAccum = 0;
    const threshold = 180; // farther than a tiny nudge; tune as needed
    let isAnimating = false;

    const getSections = () => Array.from((containerRef.current ?? el).querySelectorAll<HTMLElement>('[data-snap-section]'));

    function currentIndex(): number {
      const container = containerRef.current ?? el;
      if (!container) return 0;
      const sections = getSections();
      const st = container.scrollTop;
      // choose the first section whose top is below or equal to current scrollTop + small epsilon
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (st + 10 < sections[i].offsetTop) break;
        idx = i;
      }
      return idx;
    }

    function snapTo(index: number) {
      const container = containerRef.current ?? el;
      if (!container) { isAnimating = false; return; }
      const sections = getSections();
      const clamped = Math.max(0, Math.min(index, sections.length - 1));
      const target = sections[clamped];
      if (!target) return;
      // custom smooth scroll with easing (speed ramp)
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const to = target.offsetTop;
      const from = container.scrollTop;
      const distance = to - from;
      if (Math.abs(distance) < 1) { isAnimating = false; return; }
      isAnimating = true;

      if (prefersReduced) {
        container.scrollTop = to;
        isAnimating = false;
        return;
      }

      const duration = 1500; // ms, smoother without feeling sluggish
      const startTime = performance.now();

      // EaseInOutCubic – slow start, speed up, slow end
      const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      let rafId = 0;

      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = easeInOutCubic(t);
        const c = containerRef.current ?? container;
        if (!c) { isAnimating = false; return; }
        c.scrollTop = from + distance * eased;
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          isAnimating = false;
        }
      };
      rafId = requestAnimationFrame(step);
    }

    const onWheel = (e: WheelEvent) => {
      if (!isDesktop) return;
      if (isAnimating) { e.preventDefault(); return; }
      // intercept wheel and only trigger when exceeding threshold
      e.preventDefault();
      deltaAccum += e.deltaY;
      if (Math.abs(deltaAccum) >= threshold) {
        const dir = deltaAccum > 0 ? 1 : -1;
        deltaAccum = 0;
        const cur = currentIndex();
        snapTo(cur + dir);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });

    // Prevent native key/page scroll jumps during animation
    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop) return;
      // Intercept PageUp/PageDown/Home/End and Arrow keys while animating
      const keys = ['PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp'];
      if (isAnimating && keys.includes(e.key)) e.preventDefault();
    };
    window.addEventListener('keydown', onKey, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as any);
  }, [isDesktop]);

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll bg-gray-900 text-white">
      <header className="min-h-screen flex flex-col justify-center items-center mb-16 md:mb-32" data-snap-section>
        <h1 className="text-4xl md:text-5xl font-serif mb-6 md:mb-8">Projects</h1>
        <div className="w-full max-w-6xl px-3 sm:px-6">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {projects.map((project: Project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
        <p className="mt-6 md:mt-8 text-gray-400 text-sm md:text-base">Click a project to jump to its details below</p>
      </header>
      <main className="space-y-12 md:space-y-32 pb-20">
        {projects.map((project: Project) => (
          <ProjectSection key={project.slug} project={project} />
        ))}
      </main>
    </div>
  );
}


