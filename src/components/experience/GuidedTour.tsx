'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  getActiveTourRecommendations,
  TOUR_PROFILES,
} from '@/lib/experience/tour';
import { TOUR_ROLES, type TourRole } from '@/lib/portfolioContracts';
import { getDestinationDefinition } from '@/lib/destinations';
import { useExplorationWorld } from './ExplorationWorldProvider';

export default function GuidedTour({ enabled }: { enabled: boolean }) {
  const pathname = usePathname() || '/';
  const { store, state, ready } = useExplorationWorld();
  const [choosingRole, setChoosingRole] = useState(false);

  if (!enabled || !ready || pathname === '/chat') return null;
  const canOffer = state.discovery.firstNoteCompleted || pathname !== '/';
  if (!canOffer) return null;

  const chooseRole = (role: TourRole) => {
    store.getState().chooseTourRole(role);
    setChoosingRole(false);
  };

  if (choosingRole || (state.tour.enabled && !state.tour.role)) {
    return (
      <aside
        aria-label="Choose a quick tour"
        className="fixed bottom-20 left-4 z-[65] w-[min(390px,calc(100vw-32px))] rounded-[26px] border border-white/10 bg-[#090b10]/94 p-4 text-white shadow-[0_24px_90px_rgba(0,0,0,0.58)] backdrop-blur-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-serif text-xl text-white/90">What brings you here?</p>
            <p className="mt-1 text-xs leading-relaxed text-white/40">Choose a lens, not a route. Every doorway stays open.</p>
          </div>
          <button
            type="button"
            onClick={() => setChoosingRole(false)}
            aria-label="Close role selection"
            className="text-lg text-white/35 hover:text-white/75"
          >
            &times;
          </button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {TOUR_ROLES.map(role => {
            const profile = TOUR_PROFILES[role];
            return (
              <button
                type="button"
                key={role}
                onClick={() => chooseRole(role)}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-left transition duration-300 hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 motion-reduce:transition-none"
              >
                <span className="block font-serif text-sm text-white/80">{profile.label}</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-white/35">{profile.description}</span>
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  if (!state.tour.enabled) {
    return (
      <button
        type="button"
        onClick={() => {
          if (state.tour.role) store.getState().setTourEnabled(true);
          else setChoosingRole(true);
        }}
        className="fixed bottom-20 left-4 z-[55] rounded-full border border-white/10 bg-[#080a0f]/75 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 shadow-xl backdrop-blur-xl transition duration-500 hover:border-white/20 hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 motion-reduce:transition-none"
      >
        {state.tour.role ? 'Resume quick tour' : 'Quick tour'}
      </button>
    );
  }

  const recommendations = getActiveTourRecommendations(state.tour);
  return (
    <aside
      aria-label="Quick tour recommendations"
      className="fixed bottom-20 left-4 z-[65] w-[min(410px,calc(100vw-32px))] rounded-[26px] border border-white/10 bg-[#090b10]/94 p-4 text-white shadow-[0_24px_90px_rgba(0,0,0,0.58)] backdrop-blur-2xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
            {TOUR_PROFILES[state.tour.role!].label}
          </p>
          <p className="mt-1 font-serif text-xl text-white/90">Choose any doorway</p>
        </div>
        <button
          type="button"
          onClick={() => store.getState().setTourEnabled(false)}
          aria-label="Dismiss quick tour"
          className="rounded-full px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/30 hover:text-white/70"
        >
          Dismiss
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        {recommendations.map(recommendation => {
          const destination = getDestinationDefinition(recommendation.destinationId);
          if (!destination) return null;
          return (
            <a
              key={recommendation.destinationId}
              href={destination.href}
              onClick={() => store.getState().recordTourVisit(recommendation.destinationId)}
              className="group rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-2.5 transition duration-300 hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 motion-reduce:transition-none"
            >
              <span className="flex items-center justify-between gap-3 font-serif text-sm text-white/80">
                {recommendation.title}
                <span aria-hidden className="text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/60">&rarr;</span>
              </span>
              <span className="mt-1 block text-[11px] leading-relaxed text-white/35">{recommendation.reason}</span>
            </a>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setChoosingRole(true)}
        className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/25 hover:text-white/60"
      >
        Change lens
      </button>
    </aside>
  );
}
