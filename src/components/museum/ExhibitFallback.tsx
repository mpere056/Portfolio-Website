import type { MuseumExhibitView } from '@/lib/museum/types';

interface ExhibitFallbackProps {
  exhibit: MuseumExhibitView;
}

export default function ExhibitFallback({ exhibit }: ExhibitFallbackProps) {
  return (
    <article
      id={exhibit.slug}
      data-exhibit-status={exhibit.status}
      className="rounded-[2rem] border border-white/15 bg-black/55 p-6 text-white shadow-2xl backdrop-blur-xl md:p-8"
    >
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
        {exhibit.year} / {exhibit.supportedStages.join(' / ')}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{exhibit.name}</h2>
      <p className="mt-2 text-lg text-white/75">{exhibit.headline}</p>
      <p className="mt-5 max-w-2xl leading-7 text-white/65">{exhibit.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2" aria-label={`${exhibit.name} technologies`}>
        {exhibit.tech.map(technology => (
          <span key={technology} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">
            {technology}
          </span>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href={exhibit.href}
          className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black"
        >
          Approach exhibit
        </a>
        {exhibit.projectHref !== exhibit.href ? (
          <a
            href={exhibit.projectHref}
            className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/75"
          >
            Open project world
          </a>
        ) : null}
      </div>
    </article>
  );
}
