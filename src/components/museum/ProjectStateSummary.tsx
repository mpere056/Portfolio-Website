import type { ReviewedProjectState } from '@/lib/content/projectStates';

interface ProjectStateSummaryProps {
  state: ReviewedProjectState;
}

export default function ProjectStateSummary({ state }: ProjectStateSummaryProps) {
  return (
    <aside aria-label="Current project state" className="mt-10 rounded-[1.6rem] border border-[#d9bc8f]/15 bg-[#d9bc8f]/[0.045] p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.26em] text-[#d9bc8f]/60">Living state / {state.lifecycle}</p>
        <span className="text-xs text-[#f4efe5]/30">Reviewed {state.updatedAt}</span>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#f4efe5]/60">{state.summary}</p>
      <details className="mt-4 border-t border-[#f4efe5]/10 pt-4">
        <summary className="cursor-pointer text-sm text-[#ead6b5]">What is stable and what is still open?</summary>
        <dl className="mt-5 grid gap-5 text-sm md:grid-cols-2">
          <div><dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/35">Stable foundation</dt><dd className="mt-2 leading-6 text-white/58">{state.sections.stableFoundation}</dd></div>
          <div><dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/35">Current question</dt><dd className="mt-2 leading-6 text-white/58">{state.sections.currentQuestion}</dd></div>
          <div><dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/35">Latest meaningful change</dt><dd className="mt-2 leading-6 text-white/58">{state.sections.latestMeaningfulChange}</dd></div>
          <div><dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/35">Next validation</dt><dd className="mt-2 leading-6 text-white/58">{state.sections.nextExperiment}</dd></div>
        </dl>
      </details>
      <div className="mt-5 flex flex-wrap gap-3">
        {state.evidence.map(link => <a key={link.href} href={link.href} className="text-xs text-[#d9bc8f]/70 underline decoration-[#d9bc8f]/25 underline-offset-4 hover:text-[#ead6b5]">{link.label}</a>)}
      </div>
      <p className="mt-4 text-[0.68rem] leading-5 text-white/28">{state.correctionNote}</p>
    </aside>
  );
}

