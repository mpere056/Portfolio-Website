import { getProjects } from '@/lib/projects';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/lib/projects';
import ProjectModel from '@/components/ProjectModel';
import { Suspense } from 'react';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <header className="h-screen snap-start flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-8">Projects</h1>
        <div className="w-full max-w-4xl mx-auto overflow-x-auto snap-x snap-mandatory">
          <div className="flex space-x-8 p-8">
            {projects.map((project: Project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </header>
      <main>
        {projects.map((project: Project) => (
          <section key={project.slug} id={project.slug} className="h-screen snap-start flex justify-center items-center">
            <div className="w-1/2 h-full">
              {project.heroModel ? (
                <Suspense fallback={<div>Loading model...</div>}>
                  <ProjectModel modelName={project.heroModel} />
                </Suspense>
              ) : (
                <div className="w-full h-full bg-gray-800 flex justify-center items-center">
                  <p>No 3D model for this project</p>
                </div>
              )}
            </div>
            <div className="w-1/2 p-8">
              <h2 className="text-3xl font-bold">{project.name}</h2>
              <p>{project.summary}</p>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
