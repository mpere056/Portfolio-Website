'use client';

import { useEffect, useRef } from 'react';

interface SmoothSnapScrollProps {
  containerRef: React.RefObject<HTMLElement>;
  durationMs?: number;
  desktopMinWidth?: number;
}

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function SmoothSnapScroll({
  containerRef,
  durationMs = 800,
  desktopMinWidth = 768,
}: SmoothSnapScrollProps) {
  const downSfxRef = useRef<HTMLAudioElement | null>(null);
  const upSfxRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isAnimating = false;
    // Initialize once on mount
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

    function playSfx(direction: number) {
      if (window.innerWidth < desktopMinWidth) return;
      const primary = direction > 0 ? downSfxRef.current : upSfxRef.current;
      const fallback = downSfxRef.current;
      const el = primary || fallback;
      if (!el) return;
      try {
        el.currentTime = 0;
        // Attempt to play tied to user gesture (wheel/key handlers trigger this path)
        el.play().catch(() => {});
      } catch {}
    }

    function getSections(): HTMLElement[] {
      return Array.from(container.querySelectorAll('section')) as HTMLElement[];
    }

    function getCurrentIndex(): number {
      const sections = getSections();
      const pos = container.scrollTop;
      let bestIdx = 0;
      let bestDist = Infinity;
      sections.forEach((s, i) => {
        const d = Math.abs(s.offsetTop - pos);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      return bestIdx;
    }

    function animateTo(targetTop: number, direction: number) {
      if (isAnimating) return;
      isAnimating = true;
      playSfx(direction);

      const startTop = container.scrollTop;
      const delta = targetTop - startTop;
      const startTime = performance.now();
      const prevSnap = (container as HTMLElement).style.scrollSnapType;
      (container as HTMLElement).style.scrollSnapType = 'none';

      function step(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / durationMs);
        const eased = easeInOutQuad(t);
        container.scrollTop = startTop + delta * eased;
        if (t < 1) requestAnimationFrame(step);
        else {
          (container as HTMLElement).style.scrollSnapType = prevSnap;
          isAnimating = false;
        }
      }

      requestAnimationFrame(step);
    }

    function handleWheel(e: WheelEvent) {
      if (window.innerWidth < desktopMinWidth) return; // mobile uses native snapping
      // Prevent native wheel-driven snap
      e.preventDefault();
      if (isAnimating) return;
      const sections = getSections();
      if (!sections.length) return;
      const current = getCurrentIndex();
      const direction = e.deltaY > 0 ? 1 : -1;
      const next = Math.min(Math.max(current + direction, 0), sections.length - 1);
      if (next === current) return;
      animateTo(sections[next].offsetTop, direction);
    }

    function handleKey(e: KeyboardEvent) {
      if (window.innerWidth < desktopMinWidth) return;
      // Common navigation keys
      const keys = ['ArrowDown', 'PageDown', ' ', 'Spacebar', 'ArrowUp', 'PageUp'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      if (isAnimating) return;
      const sections = getSections();
      if (!sections.length) return;
      const current = getCurrentIndex();
      const direction = (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Spacebar') ? 1 : -1;
      const next = Math.min(Math.max(current + direction, 0), sections.length - 1);
      if (next === current) return;
      animateTo(sections[next].offsetTop, direction);
    }

    const opts: AddEventListenerOptions & { passive?: boolean } = { passive: false };
    container.addEventListener('wheel', handleWheel, opts);
    container.addEventListener('keydown', handleKey, opts);

    return () => {
      container.removeEventListener('wheel', handleWheel as any);
      container.removeEventListener('keydown', handleKey as any);
    };
  }, [containerRef, durationMs, desktopMinWidth]);

  return null;
}


