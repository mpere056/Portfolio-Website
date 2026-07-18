'use client';

import type { ResolvedArchiveCard } from '@/lib/ai/archiveCards';

export default function ArchiveCardDoor({
  card,
  onOpen,
}: {
  card: ResolvedArchiveCard;
  onOpen?: (card: ResolvedArchiveCard) => void;
}) {
  return (
    <a
      href={card.href}
      onClick={() => onOpen?.(card)}
      className="group mb-3 block rounded-2xl border border-amber-100/15 bg-[radial-gradient(circle_at_85%_20%,rgba(219,166,93,0.16),transparent_42%),rgba(22,18,12,0.92)] p-4 text-left transition hover:border-amber-100/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100/70"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-amber-100/45">Archive door / Handle</span>
      <span className="mt-2 block font-serif text-xl leading-tight text-stone-100">{card.title}</span>
      <span className="mt-2 block text-xs leading-5 text-stone-300/55">{card.summary}</span>
      <span className="mt-3 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-100/65 group-hover:text-amber-50">
        Open exact exhibit <span aria-hidden="true">-&gt;</span>
      </span>
    </a>
  );
}
