'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/projects';
import ProjectModel from '@/components/ProjectModel';

interface ProjectSectionProps {
  project: Project;
}

export default function ProjectSection({ project }: ProjectSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id={project.slug} className="h-screen snap-start flex items-center justify-center relative overflow-hidden">
      
      <motion.div
        className="absolute h-[60%] top-[10%] cursor-pointer w-[30%]"
        onClick={() => setIsExpanded(!isExpanded)}
        animate={{
          left: isExpanded ? '5%' : '50%',
          x: isExpanded ? '0%' : '-50%',
        }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        {project.heroModel ? (
          <Suspense fallback={<div className="text-white w-full h-full flex items-center justify-center">Loading 3D model...</div>}>
            <ProjectModel 
              modelName={project.heroModel} 
              cameraPosition={project.cameraPosition}
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
            className="absolute w-[40%] p-12 text-white right-[5%] h-full flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-serif text-5xl font-bold mb-4">{project.name}</h2>
            <p className="text-gray-300 mb-6">{project.summary}</p>
            <div className="prose prose-invert text-gray-400">
              <p>{project.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
