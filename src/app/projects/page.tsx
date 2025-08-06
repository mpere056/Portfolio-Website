import { getProjects } from '@/lib/projects';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/lib/projects';
import ProjectSection from '@/components/ProjectSection';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-gray-900 text-white">
      <header className="h-screen snap-start flex flex-col justify-center items-center">
        <h1 className="text-5xl font-serif mb-8">Projects</h1>
        <div className="w-full max-w-4xl">
          <div className="flex space-x-8 p-8 overflow-x-auto">
            {projects.map((project: Project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
        <p className="mt-8 text-gray-400">Scroll down to see more details</p>
      </header>
      <main>
        {projects.map((project: Project) => (
          <ProjectSection key={project.slug} project={project} />
        ))}
      </main>
    </div>
  );
}
