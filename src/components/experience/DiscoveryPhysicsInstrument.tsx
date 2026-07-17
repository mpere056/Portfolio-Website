'use client';

import { useEffect, useReducer, useRef, useState, type PointerEvent } from 'react';
import { usePathname } from 'next/navigation';
import {
  createEnvironmentalState,
  createStimulationProfile,
  reduceEnvironmentalState,
  type SemanticFieldSignal,
} from '@/lib/experience/environment';
import { useExplorationWorld } from './ExplorationWorldProvider';

export default function DiscoveryPhysicsInstrument({
  signals,
}: {
  signals: readonly SemanticFieldSignal[];
}) {
  const pathname = usePathname() || '/';
  const { store, state: world, ready } = useExplorationWorld();
  const [open, setOpen] = useState(false);
  const [signalIndex, setSignalIndex] = useState(0);
  const [physics, dispatch] = useReducer(
    reduceEnvironmentalState,
    signals,
    createEnvironmentalState,
  );
  const objectRef = useRef<HTMLButtonElement>(null);
  const dragX = useRef<number | null>(null);
  const signal = signals[signalIndex] ?? signals[0];
  const stimulation = createStimulationProfile(world.stimulation.normalizedValue, {
    reducedMotionRequested: world.stimulation.reducedMotionRequested,
    soundEnabled: world.stimulation.soundEnabled,
  });

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    store.getState().setReducedMotionRequested(query.matches);
    const update = (event: MediaQueryListEvent) => {
      store.getState().setReducedMotionRequested(event.matches);
    };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [store]);

  if (!ready || !signal || pathname === '/chat') return null;
  if (pathname === '/' && !world.discovery.firstNoteCompleted) return null;

  const handlePanelPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (physics.stage !== 'dormant' || !objectRef.current) return;
    const bounds = objectRef.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY) / 220;
    dispatch({ type: 'proximity', normalizedDistance: distance });
  };

  const startHandling = (event: PointerEvent<HTMLButtonElement>) => {
    dragX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const continueHandling = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragX.current === null) return;
    const travel = event.clientX - dragX.current;
    dragX.current = event.clientX;
    dispatch({ type: 'handle', travel });
  };

  const stopHandling = () => {
    dragX.current = null;
  };

  const chooseNextSignal = () => {
    setSignalIndex(index => (index + 1) % signals.length);
    dispatch({ type: 'reset' });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group fixed right-4 top-4 z-[54] flex items-center gap-2 rounded-full border border-cyan-100/10 bg-[#071014]/65 px-3 py-2 text-cyan-50/35 shadow-[0_12px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 hover:border-cyan-100/25 hover:text-cyan-50/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100/30 motion-reduce:transition-none"
      >
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-cyan-200/55 shadow-[0_0_14px_rgba(165,243,252,0.8)] transition group-hover:scale-125 motion-reduce:transition-none"
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.16em]">A faint signal</span>
      </button>
    );
  }

  const near = physics.stage !== 'dormant';
  const materialVisible = physics.stage === 'handled' || physics.stage === 'connected';
  const connected = physics.stage === 'connected';

  return (
    <aside
      aria-label="Relationship instrument"
      onPointerMove={handlePanelPointerMove}
      className="fixed right-4 top-4 z-[64] w-[min(430px,calc(100vw-32px))] overflow-hidden rounded-[30px] border border-cyan-100/10 bg-[#061014]/95 p-4 text-cyan-50 shadow-[0_28px_100px_rgba(0,0,0,0.62)] backdrop-blur-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-100/30">Relationship instrument</p>
          <p className="mt-1 font-serif text-xl text-cyan-50/90">Meaning has a direction</p>
        </div>
        <button
          type="button"
          aria-label="Close relationship instrument"
          onClick={() => setOpen(false)}
          className="rounded-full px-2 text-xl text-cyan-50/30 hover:text-cyan-50/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100/30"
        >
          &times;
        </button>
      </div>

      <div className="relative mt-4 h-64 overflow-hidden rounded-[24px] border border-cyan-100/10 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.09),transparent_58%),linear-gradient(150deg,#071115,#030608)]">
        {Array.from({ length: stimulation.particleCount }, (_, index) => (
          <span
            key={index}
            aria-hidden
            className="absolute h-px w-px rounded-full bg-cyan-100"
            style={{
              left: `${12 + ((index * 29) % 76)}%`,
              top: `${14 + ((index * 41) % 70)}%`,
              opacity: 0.12 + stimulation.normalizedValue * 0.3,
              transform: `scale(${0.8 + (index % 3) * stimulation.motionScale})`,
              transition: world.stimulation.reducedMotionRequested ? 'none' : 'all 900ms ease',
            }}
          />
        ))}

        <div
          aria-hidden
          className="absolute left-[49%] top-[47%] h-px w-[31%] origin-left bg-gradient-to-r from-cyan-200/80 to-amber-100/70 transition-all duration-700 motion-reduce:transition-none"
          style={{
            opacity: connected ? stimulation.glowStrength : 0,
            transform: connected ? 'rotate(-22deg) scaleX(1)' : 'rotate(-22deg) scaleX(0)',
            boxShadow: connected ? `0 0 ${12 + stimulation.glowStrength * 24}px rgba(165,243,252,.8)` : 'none',
          }}
        />

        <button
          ref={objectRef}
          type="button"
          aria-label={`Inspect ${signal.sourceTitle}`}
          onFocus={() => dispatch({ type: 'focus' })}
          onPointerDown={startHandling}
          onPointerMove={continueHandling}
          onPointerUp={stopHandling}
          onPointerCancel={stopHandling}
          onKeyDown={event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              dispatch({ type: 'handle', travel: 24 });
            }
          }}
          className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border bg-[#09171b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100/45"
          style={{
            borderColor: near ? 'rgba(165,243,252,.5)' : 'rgba(165,243,252,.08)',
            boxShadow: near ? `0 0 ${18 + stimulation.glowStrength * 34}px rgba(34,211,238,.22), inset 0 0 24px rgba(165,243,252,.08)` : 'none',
            transform: `translate(-50%, -50%) rotate(${physics.handleTravel}deg)`,
            transition: dragX.current === null && !world.stimulation.reducedMotionRequested
              ? `border-color 400ms ease, box-shadow ${Math.round(900 / Math.max(stimulation.motionScale, 0.2))}ms ease`
              : 'none',
          }}
        >
          <span aria-hidden className="absolute inset-3 rounded-full border border-dashed border-cyan-100/20" />
          <span className="max-w-16 text-center font-mono text-[8px] uppercase tracking-[0.12em] text-cyan-50/55">
            {near ? signal.sourceTitle : 'nearer'}
          </span>
        </button>

        <div
          className="absolute right-5 top-10 max-w-36 text-right transition duration-700 motion-reduce:transition-none"
          style={{ opacity: connected ? 1 : 0.12 + stimulation.normalizedValue * 0.08 }}
        >
          <span className="block font-mono text-[8px] uppercase tracking-[0.14em] text-amber-100/35">Destination</span>
          <span className="mt-1 block font-serif text-sm text-amber-50/75">{connected ? signal.targetTitle : 'Unlit'}</span>
        </div>

        <div aria-live="polite" className="absolute bottom-4 left-4 right-4 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-cyan-50/35">
            {!near && 'Move closer'}
            {near && !materialVisible && 'Hold and turn. Arrow keys work too.'}
            {materialVisible && !connected && 'The material remembers a relationship.'}
            {connected && 'A reviewed connection becomes visible.'}
          </p>
        </div>
      </div>

      {materialVisible && (
        <div className="mt-3 rounded-2xl border border-cyan-100/10 bg-cyan-50/[0.025] p-3">
          <p className="text-xs leading-relaxed text-cyan-50/55">{signal.explanation}</p>
          {!connected ? (
            <button
              type="button"
              onClick={() => dispatch({
                type: 'relationship-reviewed',
                relationshipId: signal.relationshipId,
              })}
              className="mt-3 rounded-full border border-cyan-100/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.13em] text-cyan-50/55 transition hover:border-cyan-100/30 hover:text-cyan-50/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100/30 motion-reduce:transition-none"
            >
              Follow where it leads
            </button>
          ) : (
            <div className="mt-3 flex items-center justify-between gap-3">
              <a
                href={signal.targetHref}
                className="font-serif text-sm text-amber-50/80 underline decoration-amber-100/20 underline-offset-4 hover:text-amber-50"
              >
                Enter {signal.targetTitle}
              </a>
              {signals.length > 1 && (
                <button
                  type="button"
                  onClick={chooseNextSignal}
                  className="font-mono text-[8px] uppercase tracking-[0.12em] text-cyan-50/30 hover:text-cyan-50/65"
                >
                  Another signal
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Decrease environmental stimulation"
          onClick={() => store.getState().setStimulation(world.stimulation.normalizedValue - 0.2)}
          className="h-7 w-7 rounded-full border border-cyan-100/10 font-mono text-xs text-cyan-50/35 hover:border-cyan-100/25 hover:text-cyan-50/70"
        >
          &minus;
        </button>
        <label className="flex flex-1 items-center gap-3">
          <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-cyan-50/30">Still</span>
          <input
            aria-label="Environmental stimulation"
            type="range"
            min="0"
            max="100"
            value={Math.round(world.stimulation.normalizedValue * 100)}
            onChange={event => store.getState().setStimulation(Number(event.currentTarget.value) / 100)}
            className="h-px flex-1 cursor-pointer accent-cyan-100"
          />
          <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-cyan-50/30">Vivid</span>
        </label>
        <button
          type="button"
          aria-label="Increase environmental stimulation"
          onClick={() => store.getState().setStimulation(world.stimulation.normalizedValue + 0.2)}
          className="h-7 w-7 rounded-full border border-cyan-100/10 font-mono text-xs text-cyan-50/35 hover:border-cyan-100/25 hover:text-cyan-50/70"
        >
          +
        </button>
      </div>
    </aside>
  );
}
