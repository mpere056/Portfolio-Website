'use client';

import { useEffect, useState } from 'react';
import { useExplorationWorld } from '@/components/experience/ExplorationWorldProvider';
import type { DepthStage } from '@/lib/portfolioContracts';
import {
  captureLifeInboxEntry,
  initialLifeInboxSpikeState,
  organizeLifeInboxEntry,
} from '@/lib/museum/spikes/lifeInboxSpike';
import type { LifeInboxSpikeState } from '@/lib/museum/spikes/lifeInboxSpike';

const SYSTEM_STEPS = [
  { id: 'capture', label: 'Local capture', detail: 'SQLite accepts the thought before network or analysis.' },
  { id: 'sync', label: 'Private sync', detail: 'Dirty state can move through the owned server boundary.' },
  { id: 'enrich', label: 'Illustrative enrichment', detail: 'Organization is shown separately from what was actually stored.' },
  { id: 'resurface', label: 'Useful return', detail: 'The reminder becomes something the person can act on later.' },
] as const;

export default function LifeInboxExperience({
  stage,
  onStageChange,
  projectHref,
}: {
  stage: DepthStage;
  onStageChange: (stage: DepthStage) => void;
  projectHref: string;
}) {
  const [capture, setCapture] = useState<LifeInboxSpikeState>(initialLifeInboxSpikeState);
  const [selectedLayer, setSelectedLayer] = useState('capture');
  const { store } = useExplorationWorld();

  useEffect(() => {
    store.getState().applyDepthTransition('project:lifeinbox', {
      destinationId: 'destination:museum-project-lifeinbox',
      stage,
      safeState: { stage },
    });
  }, [stage, store]);

  const captureLocally = () => setCapture(current => captureLifeInboxEntry(current));
  const revealOrganization = () => setCapture(current => organizeLifeInboxEntry(current));

  return (
    <section aria-label="LifeInbox depth experience" className="mt-8 overflow-hidden rounded-[2rem] border border-amber-100/15 bg-[#100e0a] text-stone-100 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-4 sm:px-7">
        <div className="flex flex-wrap gap-2" aria-label="Exhibit depth">
          {(['handle', 'enter', 'understand'] as const).map((item, index) => (
            <span key={item} className={stage === item ? 'font-mono text-[0.62rem] uppercase tracking-[0.2em] text-amber-100' : 'font-mono text-[0.62rem] uppercase tracking-[0.2em] text-white/28'}>
              {index + 3}. {item}
            </span>
          ))}
        </div>
        <button type="button" onClick={() => { setCapture(initialLifeInboxSpikeState); onStageChange('handle'); }} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:text-white">Reset experiment</button>
      </div>

      {stage === 'handle' ? (
        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-amber-100/50">Handle / a synthetic thought</p>
            <h3 className="mt-3 font-serif text-4xl leading-none">Trust begins before intelligence.</h3>
            <p className="mt-4 text-sm leading-7 text-stone-300/55">This small simulation separates the verified local save from the later illustrative organization. Nothing here sends personal information anywhere.</p>
          </div>
          <div>
            <label htmlFor="lifeinbox-capture" className="text-xs text-stone-300/50">A messy thought</label>
            <textarea id="lifeinbox-capture" value={capture.rawText} disabled={capture.stage !== 'empty'} onChange={event => setCapture({ ...capture, rawText: event.target.value })} className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/35 p-4 outline-none focus:border-amber-100/40 disabled:text-white/60" />
            <div className="mt-3 flex flex-wrap gap-3">
              {capture.stage === 'empty' ? <button type="button" onClick={captureLocally} className="rounded-full bg-amber-100 px-5 py-2.5 text-sm font-semibold text-stone-950">Capture locally</button> : null}
              {capture.stage === 'captured' ? <button type="button" onClick={revealOrganization} className="rounded-full bg-amber-100 px-5 py-2.5 text-sm font-semibold text-stone-950">Reveal organization</button> : null}
              {capture.stage === 'organized' ? <button type="button" onClick={() => onStageChange('enter')} className="rounded-full bg-amber-100 px-5 py-2.5 text-sm font-semibold text-stone-950">Enter the system</button> : null}
            </div>
            {capture.stage !== 'empty' ? (
              <div aria-live="polite" className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200/15 bg-emerald-950/20 p-4"><p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-emerald-100/55">Verified boundary</p><p className="mt-2 text-sm">Saved locally as <span className="text-emerald-100">{capture.localId}</span></p></div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-white/40">Illustrative result</p><p className="mt-2 text-sm">{capture.destination ? `${capture.destination.title} / ${capture.destination.schedule}` : 'Not organized yet'}</p></div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {stage === 'enter' || stage === 'understand' ? (
        <div className="p-5 sm:p-7">
          <div className="max-w-2xl">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-amber-100/50">{stage} / exploded behavior</p>
            <h3 className="mt-3 font-serif text-4xl leading-none">One thought, four different promises.</h3>
            <p className="mt-4 text-sm leading-7 text-stone-300/55">Move across the system. The brighter boundary is the one this exhibit can prove most directly.</p>
          </div>
          <div className="mt-7 grid gap-3 lg:grid-cols-4">
            {SYSTEM_STEPS.map((item, index) => (
              <button key={item.id} type="button" onClick={() => setSelectedLayer(item.id)} className={selectedLayer === item.id ? 'rounded-2xl border border-amber-100/35 bg-amber-100/[0.08] p-4 text-left' : 'rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-left hover:border-white/20'}>
                <span className="font-mono text-[0.58rem] text-white/30">0{index + 1}</span>
                <strong className="mt-8 block font-serif text-xl font-medium">{item.label}</strong>
                <span className="mt-2 block text-xs leading-5 text-white/45">{item.detail}</span>
              </button>
            ))}
          </div>
          {stage === 'enter' ? (
            <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => onStageChange('understand')} className="rounded-full bg-amber-100 px-5 py-2.5 text-sm font-semibold text-stone-950">Inspect the trust boundary</button><a href={projectHref} className="rounded-full border border-white/12 px-5 py-2.5 text-sm text-white/60 hover:text-white">Continue to project world</a></div>
          ) : (
            <div className="mt-6 grid gap-5 rounded-2xl border border-emerald-100/15 bg-emerald-950/15 p-5 lg:grid-cols-[1fr_auto]">
              <div><p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-emerald-100/55">Understand / local trust layer</p><h4 className="mt-2 font-serif text-2xl">Fast capture is an architectural claim.</h4><p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">Local SQLite makes the initial save independent of connectivity. Sync and AI enrichment are later boundaries, so the interface must distinguish what is stored now from what may happen next. The demo mirrors that distinction instead of pretending to run the production service.</p></div>
              <div className="flex flex-col items-start gap-2 lg:items-end"><a href="https://github.com/mpere056/LifeInbox-Option-B" className="text-sm text-emerald-100/75 underline decoration-emerald-100/25 underline-offset-4">Source repository</a><a href="https://lifeinbox.marknperera.ca/blog/local-first-capture-needs-trust" className="text-sm text-emerald-100/75 underline decoration-emerald-100/25 underline-offset-4">Trust field note</a><a href={projectHref} className="mt-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-950">Enter LifeInbox</a></div>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
