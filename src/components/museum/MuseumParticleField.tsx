'use client';

import { useEffect, useRef } from 'react';
import type { MuseumScenePoint } from '@/lib/museum/scene';
import styles from './MuseumShell.module.css';

interface Particle {
  x: number;
  y: number;
  phase: number;
  radius: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    x: ((index * 47) % 101) / 100,
    y: ((index * 71 + 13) % 103) / 102,
    phase: (index * 1.618) % (Math.PI * 2),
    radius: 0.45 + (index % 5) * 0.16,
  }));
}

export default function MuseumParticleField({
  target,
  energy,
  count,
  reducedMotion,
  maxDpr = 1.5,
  maxFps = 60,
}: {
  target: MuseumScenePoint;
  energy: number;
  count: number;
  reducedMotion: boolean;
  maxDpr?: number;
  maxFps?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtime = useRef({ target, energy, count });

  useEffect(() => {
    runtime.current = { target, energy, count };
  }, [target, energy, count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const particles = createParticles(52);
    let frame = 0;
    let visible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let previous = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
    }, { rootMargin: '120px' });
    observer.observe(canvas);

    const draw = (now: number) => {
      frame = window.requestAnimationFrame(draw);
      if (!visible || document.visibilityState === 'hidden') {
        previous = now;
        return;
      }

      if (now - previous < 1000 / maxFps) return;

      const elapsed = Math.min(40, now - previous) / 1000;
      previous = now;
      const state = runtime.current;
      const activeCount = Math.min(particles.length, state.count);
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      for (let index = 0; index < activeCount; index += 1) {
        const particle = particles[index];
        const attraction = 0.48 + state.energy * 0.82;
        const orbit = now * 0.00008 * (0.6 + state.energy) + particle.phase;
        particle.x += (state.target.x - particle.x) * attraction * elapsed;
        particle.y += (state.target.y - particle.y) * attraction * elapsed;
        const x = (particle.x + Math.cos(orbit) * (0.025 + (index % 7) * 0.006)) * width;
        const y = (particle.y + Math.sin(orbit * 1.17) * (0.02 + (index % 5) * 0.007)) * height;
        const alpha = 0.14 + state.energy * 0.42 * (1 - index / Math.max(activeCount, 1));

        context.beginPath();
        context.fillStyle = index % 4 === 0
          ? `rgba(255, 190, 144, ${alpha})`
          : `rgba(151, 227, 239, ${alpha})`;
        context.arc(x, y, particle.radius + state.energy * 1.35, 0, Math.PI * 2);
        context.fill();

        if (index % 8 === 0) {
          context.beginPath();
          context.strokeStyle = `rgba(177, 235, 241, ${alpha * 0.28})`;
          context.moveTo(x, y);
          context.lineTo(state.target.x * width, state.target.y * height);
          context.stroke();
        }
      }
      context.globalCompositeOperation = 'source-over';
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      context.clearRect(0, 0, width, height);
    };
  }, [maxDpr, maxFps, reducedMotion]);

  return <canvas ref={canvasRef} className={styles.particleField} aria-hidden="true" data-layer="museum:particles" />;
}
