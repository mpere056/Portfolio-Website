'use client';

import { useState } from 'react';
import {
  captureLifeInboxEntry,
  initialLifeInboxSpikeState,
  organizeLifeInboxEntry,
} from '@/lib/museum/spikes/lifeInboxSpike';

export default function LifeInboxSpike() {
  const [state, setState] = useState(initialLifeInboxSpikeState);

  return (
    <section aria-label="LifeInbox feasibility interaction" className="rounded-[2rem] border border-amber-200/20 bg-[#17130d] p-6 text-stone-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-amber-200/60">Synthetic local demo</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Capture first. Organize second.</h2>
        </div>
        <button type="button" onClick={() => setState(initialLifeInboxSpikeState)} className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/65">Reset</button>
      </div>

      <label className="mt-6 block text-sm text-white/55" htmlFor="lifeinbox-spike-capture">A messy thought</label>
      <textarea
        id="lifeinbox-spike-capture"
        value={state.rawText}
        disabled={state.stage !== 'empty'}
        onChange={event => setState({ ...state, rawText: event.target.value })}
        className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/35 p-4 text-base outline-none transition focus:border-amber-200/45 disabled:text-white/65"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        {state.stage === 'empty' ? (
          <button type="button" onClick={() => setState(current => captureLifeInboxEntry(current))} className="rounded-full bg-amber-200 px-5 py-2.5 text-sm font-semibold text-stone-950">Capture locally</button>
        ) : null}
        {state.stage === 'captured' ? (
          <button type="button" onClick={() => setState(organizeLifeInboxEntry)} className="rounded-full bg-amber-200 px-5 py-2.5 text-sm font-semibold text-stone-950">Reveal organization</button>
        ) : null}
      </div>

      {state.stage !== 'empty' ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200/20 bg-emerald-950/20 p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-emerald-200/65">Available immediately</p>
            <p className="mt-2 font-medium">Saved on this device</p>
            <p className="mt-1 text-sm leading-6 text-white/55">The portfolio simulation stops here until you choose the illustrative organization step.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/45">Illustrative later layer</p>
            {state.destination ? (
              <>
                <p className="mt-2 font-medium">Reminder / {state.destination.title}</p>
                <p className="mt-1 text-sm text-amber-100/70">{state.destination.schedule}</p>
              </>
            ) : <p className="mt-2 text-sm leading-6 text-white/50">Sync and enrichment have not been implied yet.</p>}
          </div>
        </div>
      ) : null}
    </section>
  );
}

