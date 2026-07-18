'use client';

import { useEffect, useState } from 'react';
import {
  initialSudokuSpikeState,
  placeComputerSudokuMove,
  placeVisitorSudokuMove,
} from '@/lib/museum/spikes/sudokuSpike';

export default function SudokuSpike() {
  const [state, setState] = useState(initialSudokuSpikeState);

  useEffect(() => {
    if (state.status !== 'computer-ready') return;
    const timeout = window.setTimeout(() => setState(placeComputerSudokuMove), 650);
    return () => window.clearTimeout(timeout);
  }, [state.status]);

  return (
    <section aria-label="Sudoku Together feasibility interaction" className="rounded-[2rem] border border-cyan-200/20 bg-[#07151a] p-6 text-stone-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-cyan-200/60">Synthetic local demo</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">One board. Two visible contributors.</h2>
        </div>
        <button type="button" onClick={() => setState(initialSudokuSpikeState)} className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/65">Reset</button>
      </div>

      <div className="mt-6 grid max-w-[22rem] grid-cols-9 overflow-hidden rounded-xl border-2 border-cyan-100/35 bg-black/35" aria-label="Sudoku board">
        {state.board.flatMap((row, rowIndex) => row.map((value, columnIndex) => {
          const interactive = rowIndex === 0 && columnIndex === 2 && state.status === 'visitor-turn';
          const move = state.moves.find(item => item.row === rowIndex && item.column === columnIndex);
          return (
            <button
              type="button"
              key={`${rowIndex}-${columnIndex}`}
              disabled={!interactive}
              aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}${value ? `, ${value}` : ''}`}
              onClick={() => setState(current => placeVisitorSudokuMove(current, { row: 0, column: 2, value: 4 }))}
              className={`aspect-square border border-white/10 text-sm font-semibold ${interactive ? 'animate-pulse bg-cyan-300/15 text-cyan-100' : 'disabled:cursor-default'} ${move?.participant === 'Computer' ? 'bg-amber-300/20 text-amber-100' : move ? 'bg-cyan-300/20 text-cyan-100' : value ? 'text-white/70' : 'text-white/20'} ${(columnIndex + 1) % 3 === 0 && columnIndex < 8 ? 'border-r-cyan-100/35' : ''} ${(rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-cyan-100/35' : ''}`}
            >
              {value || ''}
            </button>
          );
        }))}
      </div>

      <p className="mt-4 min-h-12 max-w-lg text-sm leading-6 text-white/60" aria-live="polite">{state.message}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-cyan-200/20 px-3 py-1.5 text-cyan-100/70">Visitor</span>
        <span className="rounded-full border border-amber-200/20 px-3 py-1.5 text-amber-100/70">Computer / local simulation</span>
      </div>
    </section>
  );
}

