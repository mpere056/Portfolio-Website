'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { usePortfolioAI } from './PortfolioAIProvider';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';

const GlobalAIConversation = dynamic(() => import('./GlobalAIConversation'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-mono text-xs tracking-[0.16em] text-white/35">
      OPENING THE ARCHIVE
    </div>
  ),
});

class AISurfaceBoundary extends Component<
  { children: ReactNode; onError(): void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center text-white/55">
          <p className="font-serif text-xl text-white/80">The archive stayed quiet.</p>
          <p className="max-w-xs text-sm leading-relaxed">The rest of the portfolio is still available. Close this panel and keep exploring.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function QuietMark({ activity }: { activity: string }) {
  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#090b10] shadow-[0_0_35px_rgba(93,175,255,0.08)]">
      <span className={`absolute inset-1 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(202,235,255,0.35),rgba(55,115,152,0.12)_35%,transparent_70%)] ${activity === 'responding' ? 'animate-pulse' : ''}`} />
      <span className="relative font-serif text-sm text-white/80">M</span>
    </span>
  );
}

export default function GlobalAIPresence() {
  const ai = usePortfolioAI();
  if (!ai.enabled || ai.context.route === '/chat') return null;
  if (!ai.shell.open && ai.context.route === '/') return null;

  if (!ai.shell.open) {
    return (
      <button
        type="button"
        onClick={ai.open}
        aria-label={ai.presentation.presenceLabel}
        aria-expanded="false"
        className="group fixed bottom-20 right-4 z-[60] flex items-center gap-2 rounded-full border border-white/10 bg-[#07090d]/78 p-1.5 pr-3 text-left text-white/55 shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-500 hover:border-white/20 hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/40 motion-reduce:transition-none sm:right-5"
      >
        <QuietMark activity={ai.presentation.activity} />
        <span className="hidden max-w-40 sm:block">
          <span className="block font-serif text-sm leading-none text-white/75">The archive</span>
          <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.13em] text-white/30">
            {ai.presentation.statusLabel}
          </span>
        </span>
      </button>
    );
  }

  return (
    <aside
      aria-label="Portfolio AI archive"
      className="fixed inset-y-3 right-3 z-[70] isolate flex w-[min(460px,calc(100vw-24px))] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#080a0f]/95 text-white shadow-[0_30px_120px_rgba(0,0,0,0.72)] backdrop-blur-2xl sm:inset-y-4 sm:right-4"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[45%] opacity-20 mix-blend-screen [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <Image src={ART_DIRECTION_ASSETS.about.src} alt="" fill sizes="460px" className="object-cover object-[55%_45%] saturate-75 contrast-125 brightness-75" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_65%_12%,rgba(136,209,255,.09),transparent_38%),linear-gradient(to_bottom,rgba(8,10,15,.35),rgba(8,10,15,.96)_38%)]" />
      <header className="relative z-10 flex items-center gap-3 border-b border-white/8 px-4 py-3">
        <QuietMark activity={ai.presentation.activity} />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg leading-none text-white/90">Mark&apos;s archive</p>
          <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
            {ai.presentation.statusLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={ai.clearConversation}
          className="rounded-full px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/30 transition hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={ai.close}
          aria-label="Close portfolio AI"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-lg text-white/45 transition hover:border-white/20 hover:text-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          &times;
        </button>
      </header>
      <div className="relative z-10 min-h-0 flex-1">
        <AISurfaceBoundary onError={() => ai.reportRequestState('error')}>
          <GlobalAIConversation />
        </AISurfaceBoundary>
      </div>
    </aside>
  );
}
