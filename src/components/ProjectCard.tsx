'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const scrollToProject = () => {
    const element = document.getElementById(project.slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      onClick={scrollToProject}
      className="w-80 h-96 bg-gray-800 rounded-lg shadow-lg flex-shrink-0 cursor-pointer p-6 flex flex-col justify-between"
      whileHover={{ scale: 1.05, rotateX: -3, rotateY: 3 }}
    >
      <div>
        <h3 className="text-2xl font-bold">{project.name}</h3>
        <p className="text-gray-400 mt-2">{project.headline}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span key={tech} className="px-2 py-1 bg-gray-700 text-sm rounded-full">
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
