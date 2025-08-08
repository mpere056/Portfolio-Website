'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Project } from '@/lib/projects';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover)');
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  const scrollToProject = () => {
    const element = document.getElementById(project.slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  function hashToHue(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) hash = (hash << 5) - hash + input.charCodeAt(i);
    return Math.abs(hash) % 360;
  }

  const hue = hashToHue(`${project.slug}-${project.name}`);
  const glowColor = `hsla(${hue}, 90%, 60%, 0.45)`;
  const baseShadow = '0 10px 40px -15px rgba(0,0,0,0.6)';
  const hoverShadow = `${baseShadow}, 0 18px 70px -12px ${glowColor}`;

  return (
    <motion.button
      onClick={scrollToProject}
      className="group w-full aspect-[4/5] sm:aspect-[5/6] bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)] cursor-pointer p-3 sm:p-4 flex flex-col gap-3 border border-white/10 hover:border-white/20 transition-colors"
      whileHover={{ scale: 1.03, rotateX: -6, rotateY: 6, boxShadow: hoverShadow }}
      style={{ transformStyle: 'preserve-3d', boxShadow: baseShadow }}
    >
      <div className="relative rounded-lg overflow-hidden border border-white/10" style={{ flexBasis: '58%' }}>
        <Image
          src={`/images/${project.heroModel ?? 'world_cube'}.png`}
          alt={`${project.name} preview`}
          fill
          className={`object-cover ${canHover ? 'opacity-90 group-hover:opacity-100' : ''} transition-opacity duration-300`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={false}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>
      <div className="flex-1 flex flex-col items-start text-left filter-none group-hover:filter-none" style={{ transform: 'translateZ(20px)' }}>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight leading-tight">{project.name}</h3>
        <p className="text-[11px] sm:text-xs md:text-sm text-gray-400 mt-1 line-clamp-2">{project.headline}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.tech.slice(0, 3).map((tech) => (
            <span key={tech} className="px-2 py-0.5 bg-zinc-700/60 text-[10px] sm:text-[11px] md:text-xs rounded-full">
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 bg-zinc-700/60 text-[10px] sm:text-[11px] md:text-xs rounded-full">+{project.tech.length - 3}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
