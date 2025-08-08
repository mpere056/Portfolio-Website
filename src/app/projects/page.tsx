import { getProjects } from '@/lib/projects';
import { Project } from '@/lib/projects';
import ProjectsClient from '@/components/ProjectsClient';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <ProjectsClient projects={projects as Project[]} />
  );
}
