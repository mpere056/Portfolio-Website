
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
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-10">
              <motion.div
                className="relative w-full max-w-3xl bg-black/60 border border-white/10 rounded-2xl p-6 md:p-10 text-white shadow-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  className="absolute top-4 right-4 text-white/60 hover:text-white text-sm md:text-base"
                  onClick={handleClose}
                  aria-label="Close"
                >
                  Close
                </button>
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-center">{project.name}</h2>
                <div className="text-gray-300 mb-6 text-center">
                  {project.summary}
                </div>
                <div className="prose prose-invert text-gray-400 mx-auto">
                  <ul>
                    {project.moreInfo.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
