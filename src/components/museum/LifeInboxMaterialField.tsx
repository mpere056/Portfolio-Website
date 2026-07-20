'use client';

import { useEffect, useRef } from 'react';
import type { LifeInboxScenePoint } from '@/lib/museum/lifeInboxScene';
import type { LifeInboxSpikeStage } from '@/lib/museum/spikes/lifeInboxSpike';
import styles from './FlagshipExperiences.module.css';

interface MaterialParticle {
  x: number;
  y: number;
  phase: number;
  radius: number;
  warmth: number;
}

function createMaterialParticles(count: number): MaterialParticle[] {
  return Array.from({ length: count }, (_, index) => ({
    x: ((index * 43 + 17) % 109) / 108,
    y: ((index * 67 + 11) % 113) / 112,
    phase: (index * 2.13) % (Math.PI * 2),
    radius: 0.5 + (index % 6) * 0.18,
    warmth: ((index * 29) % 100) / 100,
  }));
}

export default function LifeInboxMaterialField({
  target,
  energy,
  count,
  captureStage,
  reducedMotion,
}: {
  target: LifeInboxScenePoint;
  energy: number;
  count: number;
  captureStage: LifeInboxSpikeStage;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtime = useRef({ target, energy, count, captureStage });

  useEffect(() => {
    runtime.current = { target, energy, count, captureStage };
  }, [target, energy, count, captureStage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const particles = createMaterialParticles(64);
    let animationFrame = 0;
    let intersecting = true;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let previous = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const intersectionObserver = new IntersectionObserver(entries => {
      intersecting = entries[0]?.isIntersecting ?? false;
    }, { rootMargin: '120px' });
    intersectionObserver.observe(canvas);

    const draw = (now: number) => {
      animationFrame = window.requestAnimationFrame(draw);
      if (!intersecting || document.visibilityState === 'hidden') {
        previous = now;
        return;
      }

      const elapsed = Math.min(40, now - previous) / 1000;
      previous = now;
      const state = runtime.current;
      const activeCount = Math.min(state.count, particles.length);
      const isDiffuse = state.captureStage === 'empty';
      const isOrganized = state.captureStage === 'organized';
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      for (let index = 0; index < activeCount; index += 1) {
        const particle = particles[index];
        const orbit = particle.phase + now * 0.00011 * (0.55 + state.energy);
        const attraction = isDiffuse ? 0.002 : 0.032 + state.energy * 0.042;
        particle.x += (state.target.x - particle.x) * attraction * elapsed;
        particle.y += (state.target.y - particle.y) * attraction * elapsed;
        const spread = isDiffuse ? 0.085 : isOrganized ? 0.052 : 0.032;
        const x = (particle.x + Math.cos(orbit) * (spread + (index % 5) * 0.007)) * width;
        const y = (particle.y + Math.sin(orbit * 1.21) * (spread * 0.7 + (index % 7) * 0.005)) * height;
        const alpha = (isDiffuse ? 0.035 : 0.08) + state.energy * 0.2 * (1 - index / Math.max(activeCount, 1));

        context.beginPath();
        context.fillStyle = particle.warmth > 0.56
          ? `rgba(255, 193, 112, ${alpha})`
          : `rgba(112, 235, 216, ${alpha * 0.82})`;
        context.arc(x, y, particle.radius + state.energy * 0.8, 0, Math.PI * 2);
        context.fill();

        if (isOrganized && index % 9 === 0) {
          context.beginPath();
          context.strokeStyle = `rgba(147, 238, 219, ${alpha * 0.22})`;
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
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      context.clearRect(0, 0, width, height);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.lifeInboxMaterialField}
      aria-hidden="true"
      data-layer="lifeinbox:material"
    />
  );
}
