'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getDestinationDefinition } from '@/lib/destinations';
import {
  getAvailableMeaningfulDiscoveries,
  type MeaningfulDiscoveryDefinition,
} from '@/lib/experience/discoveries';
import { useExplorationWorld } from './ExplorationWorldProvider';

const HOLD_DURATION_MS = 750;

export default function HiddenDiscoveries({ enabled }: { enabled: boolean }) {
  const pathname = usePathname() || '/';
  const { store, state, ready } = useExplorationWorld();
  const [activeReveal, setActiveReveal] = useState<MeaningfulDiscoveryDefinition>();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const available = getAvailableMeaningfulDiscoveries(state.discovery, pathname)[0];

  if (!enabled || !ready || pathname === '/chat' || pathname === '/presentation') return null;
  if (pathname === '/' && !state.discovery.firstNoteCompleted) return null;

  const discover = (definition: MeaningfulDiscoveryDefinition) => {
    store.getState().recordDepth(definition.id, 'signal');
    setActiveReveal(definition);
  };

  const beginHold = (definition: MeaningfulDiscoveryDefinition) => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => discover(definition), HOLD_DURATION_MS);
  };

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  return (
    <>
      {available && !activeReveal && (
        <button
          type="button"
          aria-label={available.trigger === 'hold'
            ? `Hold to inspect: ${available.signal}`
            : `Inspect: ${available.signal}`}
          onPointerDown={available.trigger === 'hold' ? () => beginHold(available) : undefined}
          onPointerUp={available.trigger === 'hold' ? cancelHold : undefined}
          onPointerCancel={available.trigger === 'hold' ? cancelHold : undefined}
          onPointerLeave={available.trigger === 'hold' ? cancelHold : undefined}
          onKeyDown={available.trigger === 'hold'
            ? event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  cancelHold();
                  discover(available);
                }
              }
            : undefined}
          onClick={available.trigger === 'hold' ? undefined : () => discover(available)}
          className="group fixed bottom-4 left-1/2 z-[53] -translate-x-1/2 rounded-full border border-amber-100/10 bg-[#0b0a07]/60 px-4 py-2 text-amber-50/25 shadow-[0_10px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl transition duration-700 hover:border-amber-100/25 hover:text-amber-50/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100/30 motion-reduce:transition-none"
        >
          <span className="font-serif text-xs tracking-wide">{available.signal}</span>
          {available.trigger === 'hold' && (
            <span className="ml-2 font-mono text-[7px] uppercase tracking-[0.15em] text-amber-50/20 group-hover:text-amber-50/40">
              hold
            </span>
          )}
        </button>
      )}

      {activeReveal && (
        <aside
          aria-label="Discovered insight"
          className="fixed bottom-6 left-1/2 z-[68] w-[min(560px,calc(100vw-32px))] -translate-x-1/2 rounded-[30px] border border-amber-100/15 bg-[linear-gradient(145deg,rgba(25,20,12,.97),rgba(7,9,12,.98))] p-5 text-amber-50 shadow-[0_30px_120px_rgba(0,0,0,.7)] backdrop-blur-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-amber-100/35">{activeReveal.reveal.eyebrow}</p>
              <h2 className="mt-1 font-serif text-2xl text-amber-50/90">{activeReveal.reveal.title}</h2>
            </div>
            <button
              type="button"
              aria-label="Close discovered insight"
              onClick={() => setActiveReveal(undefined)}
              className="rounded-full px-2 text-xl text-amber-50/30 hover:text-amber-50/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100/30"
            >
              &times;
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-amber-50/55">{activeReveal.reveal.body}</p>
          {activeReveal.reveal.links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeReveal.reveal.links.map(link => {
                const destination = getDestinationDefinition(link.destinationId);
                if (!destination) return null;
                return (
                  <a
                    key={link.destinationId}
                    href={destination.href}
                    className="rounded-full border border-amber-100/15 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-amber-50/45 hover:border-amber-100/30 hover:text-amber-50/75"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          )}
        </aside>
      )}
    </>
  );
}
