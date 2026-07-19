import type { ReviewedProjectState } from '@/lib/content/projectStates';

interface ProjectStateSummaryProps {
  state: ReviewedProjectState;
}

export default function ProjectStateSummary({ state }: ProjectStateSummaryProps) {
  const sectionLabels = state.lifecycle === 'evolving'
    ? [
        ['stableFoundation', 'Stable foundation'],
        ['currentQuestion', 'Current question'],
        ['latestMeaningfulChange', 'Latest meaningful change'],
        ['nextExperiment', 'Next validation'],
      ] as const
    : state.lifecycle === 'maintained'
      ? [
          ['stableRole', 'Stable role'],
          ['latestMeaningfulMaintenanceChange', 'Latest maintenance change'],
        ] as const
      : state.lifecycle === 'complete'
        ? [
            ['finalOutcome', 'Final outcome'],
            ['finalMeaningfulState', 'Final meaningful state'],
            ['mainLesson', 'Main lesson'],
            ['laterWorkInfluenced', 'Later work influenced'],
          ] as const
        : [
            ['archiveReason', 'Why it rests'],
            ['historicalImportance', 'Historical importance'],
            ['lastVerifiedState', 'Last verified state'],
          ] as const;

  return (
    <aside aria-label="Current project state" className="mt-10 border-l border-[#d9bc8f]/25 bg-[linear-gradient(90deg,rgba(217,188,143,0.045),transparent)] p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-mono text-[0.64rem] uppercase tracking-[0.26em] text-[#d9bc8f]/60">Living state / {state.lifecycle}</p>
        <span className="text-xs text-[#f4efe5]/30">Reviewed {state.updatedAt}</span>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#f4efe5]/60">{state.summary}</p>
      <details className="mt-4 border-t border-[#f4efe5]/10 pt-4">
        <summary className="cursor-pointer text-sm text-[#ead6b5]">Inspect the reviewed state</summary>
        <dl className="mt-5 grid gap-5 text-sm md:grid-cols-2">
          {sectionLabels.map(([key, label]) => (
            <div key={key}>
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/35">{label}</dt>
              <dd className="mt-2 leading-6 text-white/58">{state.sections[key]}</dd>
            </div>
          ))}
        </dl>
      </details>
      <div className="mt-5 flex flex-wrap gap-3">
        {state.evidence.map(link => <a key={link.href} href={link.href} className="text-xs text-[#d9bc8f]/70 underline decoration-[#d9bc8f]/25 underline-offset-4 hover:text-[#ead6b5]">{link.label}</a>)}
      </div>
      <p className="mt-4 text-[0.68rem] leading-5 text-white/28">{state.correctionNote}</p>
    </aside>
  );
}
