import { getProjects } from '@/lib/projects';
import { Project } from '@/lib/projects';
import ProjectsClient from '@/components/ProjectsClient';
import NavHomeIcon from '@/components/NavHomeIcon';
import MuseumShell from '@/components/museum/MuseumShell';
import { resolveFeatureFlags } from '@/lib/featureFlags';
import { loadMuseumExhibits } from '@/lib/museum/loadExhibits';

export default async function ProjectsPage() {
  const projects = await getProjects();
  const flags = resolveFeatureFlags();

  if (flags.museumV2) {
    const { exhibits } = await loadMuseumExhibits();
    return (
      <>
        <NavHomeIcon />
        <MuseumShell exhibits={exhibits} />
      </>
    );
  }

  return (
    <>
      <NavHomeIcon />
      <ProjectsClient projects={projects as Project[]} />
    </>
  );
}
