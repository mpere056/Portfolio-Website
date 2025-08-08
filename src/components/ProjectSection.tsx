'use client';

import { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/projects';
import ProjectModel from '@/components/ProjectModel';

interface ProjectSectionProps {
  project: Project;
}

export default function ProjectSection({ project }: ProjectSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefetch, setPrefetch] = useState(false);

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

  return (
    <section
      id={project.slug}
      data-snap-section
      className="min-h-[80vh] md:min-h-[150vh] md:snap-start flex flex-col md:flex-row items-center justify-center relative overflow-hidden p-6 md:p-0"
    >
      
      <motion.div
        className="relative md:absolute h-[40vh] md:h-[60%] w-full md:w-[30%] cursor-pointer z-0"
        onClick={() => setIsExpanded(!isExpanded)}
        animate={
          isDesktop
            ? {
                left: isExpanded ? '5%' : '50%',
                x: isExpanded ? '0%' : '-50%',
                top: '50%',
                y: '-50%',
              }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        layout
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
        {isExpanded && (
          <motion.div
            className="relative z-10 w-full md:w-[40%] mt-4 md:mt-0 md:absolute md:right-[5%] md:top-1/2 md:-translate-y-[70%] text-white p-3 md:p-12 h-auto md:h-full md:grid md:grid-rows-[1fr_auto_1fr] md:items-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-center md:text-left md:row-start-2">{project.name}</h2>
            <div className="text-gray-300 mb-6 text-center md:text-left md:row-start-3">
              {project.summary}
            </div>
            <div className="prose prose-invert text-gray-400 text-center md:text-left md:row-start-3">
              <ul>
                {project.moreInfo.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
