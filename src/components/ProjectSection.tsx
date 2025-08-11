
'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/projects';
import ProjectModel from '@/components/ProjectModel';
import Image from 'next/image';

interface ProjectSectionProps {
  project: Project;
}

export default function ProjectSection({ project }: ProjectSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefetch, setPrefetch] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [fullScale, setFullScale] = useState(1.6);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Prefetch when the section is close to viewport using an IntersectionObserver
  useEffect(() => {
    // Eagerly render all models as requested: set prefetch true on mount
    setPrefetch(true);
  }, []);

  useEffect(() => {
    const el = document.getElementById(project.slug);
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting || Math.abs(entry.intersectionRatio) > 0) {
            setPrefetch(true);
          }
        }
      },
      {
        root: null,
        rootMargin: '600px 0px', // one section above/below roughly
        threshold: [0, 0.01],
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [project.slug]);

  // Phase control: after zoom-in completes, reveal backdrop; on close, hide backdrop then zoom out
  useEffect(() => {
    let timer: any;
    if (isExpanded) {
      timer = setTimeout(() => setShowBackdrop(true), 550); // reveal image backdrop slightly after zoom
    } else {
      setShowBackdrop(false);
    }
    return () => clearTimeout(timer);
  }, [isExpanded]);

  // When expanded, compute a scale factor that visually fills the viewport
  useEffect(() => {
    if (!isExpanded) return;
    function compute() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleX = vw / Math.max(1, rect.width);
      const scaleY = vh / Math.max(1, rect.height);
      const s = Math.max(scaleX, scaleY) * 1.02; // tiny overscan
      setFullScale(s);
    }
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [isExpanded]);

  function handleClose() {
    // hide backdrop first, then zoom out
    setShowBackdrop(false);
    setTimeout(() => setIsExpanded(false), 450);
  }

  return (
    <section
      id={project.slug}
      data-snap-section
      className="min-h-[80vh] md:min-h-[150vh] md:snap-start flex flex-col md:flex-row items-center justify-center relative overflow-hidden p-6 md:p-0"
    >
      
      <motion.div
        className="relative h-[48vh] md:h-[65vh] w-[88vw] md:w-[42%] max-w-[780px] cursor-pointer z-0"
        style={{ margin: '0 auto' }}
        ref={wrapperRef}
        onClick={() => setIsExpanded(prev => !prev)}
        animate={{ y: isExpanded ? 0 : -70, scale: isExpanded ? fullScale : 1, filter: isExpanded ? 'blur(1px)' : 'blur(0px)' }}
        transition={{ duration: 0.9, ease: [0.5, 1, 0.2, 1] }}
      >
        {project.heroModel ? (
          <Suspense fallback={<div className="text-white w-full h-full flex items-center justify-center">Loading 3D model...</div>}>
            <ProjectModel 
              modelName={project.heroModel} 
              cameraPosition={project.cameraPosition}
              modelRotation={project.modelRotation}
              modelOffset={project.modelOffset}
              enableZoom={false} 
              enablePan={false} 
              enableRotate={false} 
              focused={isExpanded}
              prefetch={prefetch}
            />
          </Suspense>
        ) : (
          <div className="w-full h-full bg-gray-800 flex justify-center items-center text-white">
            <p>No 3D model for this project</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showBackdrop && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Background image stage with themed backdrop color */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Base backdrop color close to the reference screenshot */}
              <div className="absolute inset-0 bg-[#111727]" />
              {/* Foreground image, slightly inset */}
              <Image
                src={`/images/${(project as any).heroModel || project.slug.replace(/-/g, '_')}.png`}
                alt={project.name}
                fill
                className="relative object-contain p-10 md:p-16 lg:p-24"
                priority
              />
            </div>

            {/* Content card */}
            <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 md:p-10">
              <motion.div
                className="relative w-full max-w-3xl text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Frame + glow */}
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-white/25 to-white/5 opacity-20 blur-sm" aria-hidden />
                <div className="relative rounded-2xl bg-black/45 backdrop-blur-xl border border-white/10 p-6 md:p-10 shadow-2xl max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] overflow-y-auto">
                  {/* Corner brackets */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-4 top-4 w-5 h-5 border-l border-t border-white/20" />
                    <div className="absolute right-4 top-4 w-5 h-5 border-r border-t border-white/20" />
                    <div className="absolute left-4 bottom-4 w-5 h-5 border-l border-b border-white/20" />
                    <div className="absolute right-4 bottom-4 w-5 h-5 border-r border-b border-white/20" />
                  </div>

                  {/* Sticky header with close */}
                  <div className="sticky top-0 -mx-6 md:-mx-10 px-6 md:px-10 py-3 bg-black/40 backdrop-blur border-b border-white/10 z-10 flex justify-end">
                    <button
                      className="text-xs md:text-sm uppercase tracking-widest text-white/80 hover:text-white px-2 py-0.5 rounded border border-white/15 bg-white/5 hover:bg-white/10"
                      onClick={handleClose}
                      aria-label="Close"
                    >
                      Close
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-3xl md:text-5xl font-bold text-center drop-shadow mb-3">
                    {project.name}
                  </h2>
                  <div className="mx-auto h-px w-24 bg-gradient-to-r from-white/0 via-white/40 to-white/0 mb-6" />

                  {/* Summary */}
                  <p className="font-mono text-[13px] md:text-sm leading-7 text-white/85 whitespace-pre-line text-center md:text-left">
                    {project.summary}
                  </p>

                  {/* Bullets */}
                  {project.moreInfo?.length > 0 && (
                    <ul className="mt-6 space-y-3 text-white/85">
                      {project.moreInfo.map((point, index) => (
                        <li key={index} className="flex gap-3 items-start text-sm md:text-base">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                          <span className="font-mono leading-7">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Sticky bottom close on mobile for reachability */}
                  <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-3 mt-6 bg-black/40 backdrop-blur border-t border-white/10 z-10 flex justify-center sm:hidden">
                    <button
                      className="text-xs uppercase tracking-widest text-white/80 hover:text-white px-3 py-1 rounded border border-white/15 bg-white/5 hover:bg-white/10"
                      onClick={handleClose}
                      aria-label="Close"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
