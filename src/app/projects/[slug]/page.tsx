import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NavHomeIcon from '@/components/NavHomeIcon';
import MuseumShell from '@/components/museum/MuseumShell';
import { resolveFeatureFlags } from '@/lib/featureFlags';
import { loadMuseumExhibits } from '@/lib/museum/loadExhibits';

interface ProjectExhibitPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { exhibits } = await loadMuseumExhibits();
  return exhibits.map(exhibit => ({ slug: exhibit.slug }));
}

export async function generateMetadata({ params }: ProjectExhibitPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { exhibits } = await loadMuseumExhibits();
  const exhibit = exhibits.find(item => item.slug === slug);
  if (!exhibit) return { title: "Project not found | Mark Perera" };

  return {
    title: `${exhibit.name} | Mark Perera`,
    description: exhibit.summary,
    alternates: { canonical: `/projects/${exhibit.slug}` },
  };
}

export default async function ProjectExhibitPage({ params }: ProjectExhibitPageProps) {
  const { slug } = await params;
  const { exhibits } = await loadMuseumExhibits();
  if (!exhibits.some(exhibit => exhibit.slug === slug)) notFound();
  const flags = resolveFeatureFlags();

  return (
    <>
      <NavHomeIcon />
      <MuseumShell
        exhibits={exhibits}
        initialSlug={slug}
        enabledExperiences={{
          dreamlife: flags.dreamlifeExperience,
          lifeinbox: flags.lifeinboxExperience,
          sudoku: flags.sudokuExperience,
        }}
      />
    </>
  );
}
