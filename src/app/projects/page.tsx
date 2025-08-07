import { getProjects } from '@/lib/projects';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/lib/projects';
import ProjectSection from '@/components/ProjectSection';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-gray-900 text-white">
      <header className="min-h-screen snap-start flex flex-col justify-center items-center mb-24 md:mb-40">
        <h1 className="text-5xl font-serif mb-8">Projects</h1>
        <div className="w-full max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.map((project: Project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
        <p className="mt-8 text-gray-400">Click a project to jump to its details below</p>
      </header>
      <main className="space-y-24 md:space-y-40 pb-24">
        {projects.map((project: Project) => (
          <ProjectSection key={project.slug} project={project} />
        ))}
      </main>
    </div>
  );
}
