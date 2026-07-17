import type { MuseumExhibitView } from '@/lib/museum/types';
import ExhibitFallback from './ExhibitFallback';

interface MuseumFallbackShellProps {
  exhibits: readonly MuseumExhibitView[];
}

export default function MuseumFallbackShell({ exhibits }: MuseumFallbackShellProps) {
  return (
    <main aria-label="Project museum" className="min-h-screen bg-[#05080a] px-4 py-24 md:px-10">
      <header className="mx-auto mb-12 max-w-5xl text-white">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-emerald-200/55">Project museum</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
          Systems you can approach before you enter.
        </h1>
      </header>
      <div className="mx-auto grid max-w-5xl gap-6">
        {exhibits.map(exhibit => <ExhibitFallback key={exhibit.projectId} exhibit={exhibit} />)}
      </div>
    </main>
  );
}
