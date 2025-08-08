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

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <section
      id={project.slug}
      className="min-h-[110vh] md:min-h-[120vh] snap-start flex flex-col md:flex-row items-center justify-center relative overflow-hidden p-8 md:p-0"
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
              enableZoom={false} 
              enablePan={false} 
              enableRotate={false} 
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
            className="relative z-10 w-full md:w-[40%] mt-8 md:mt-0 md:absolute md:right-[5%] md:top-1/2 md:-translate-y-[75%] text-white p-4 md:p-12 h-auto md:h-auto flex flex-col justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-center md:text-left">{project.name}</h2>
            <p className="text-gray-300 mb-6 text-center md:text-left">{project.summary}</p>
            <div className="prose prose-invert text-gray-400 text-center md:text-left">
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
