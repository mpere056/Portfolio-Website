import { getProjects } from '@/lib/projects';
import { Project } from '@/lib/projects';
import ProjectsClient from '@/components/ProjectsClient';
import NavHomeIcon from '@/components/NavHomeIcon';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <NavHomeIcon />
      <ProjectsClient projects={projects as Project[]} />
    </>
  );
}
