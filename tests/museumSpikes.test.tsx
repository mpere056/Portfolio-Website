import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LifeInboxSpike from '@/components/museum/spikes/LifeInboxSpike';
import SudokuSpike from '@/components/museum/spikes/SudokuSpike';
import {
  captureLifeInboxEntry,
  initialLifeInboxSpikeState,
  organizeLifeInboxEntry,
} from '@/lib/museum/spikes/lifeInboxSpike';
import {
  initialSudokuSpikeState,
  isLegalSudokuMove,
  placeComputerSudokuMove,
  placeVisitorSudokuMove,
} from '@/lib/museum/spikes/sudokuSpike';

describe('LifeInbox feasibility spike', () => {
  it('captures locally before the deterministic organization reveal', () => {
    const captured = captureLifeInboxEntry(initialLifeInboxSpikeState);
    expect(captured).toMatchObject({ stage: 'captured', localId: 'local:lifeinbox:drink-reminder' });
    expect(captured.destination).toBeUndefined();
    expect(organizeLifeInboxEntry(captured)).toMatchObject({
      stage: 'organized',
      destination: { kind: 'reminder', title: 'Make a drink', schedule: 'In 10 minutes' },
    });
  });

  it('ignores empty capture and renders the simulation boundary', () => {
    expect(captureLifeInboxEntry({ ...initialLifeInboxSpikeState, rawText: '  ' })).toEqual({
      ...initialLifeInboxSpikeState,
      rawText: '  ',
    });
    const html = renderToStaticMarkup(<LifeInboxSpike />);
    expect(html).toContain('Synthetic local demo');
    expect(html).toContain('Capture locally');
  });
});

describe('Sudoku Together feasibility spike', () => {
  it('accepts one legal visitor move and one deterministic computer move', () => {
    expect(isLegalSudokuMove(initialSudokuSpikeState.board, 0, 2, 4)).toBe(true);
    const visitor = placeVisitorSudokuMove(initialSudokuSpikeState, { row: 0, column: 2, value: 4 });
    expect(visitor).toMatchObject({ status: 'computer-ready' });
    expect(visitor.moves).toEqual([{ row: 0, column: 2, value: 4, participant: 'Visitor' }]);

    const computer = placeComputerSudokuMove(visitor);
    expect(computer.board[0][3]).toBe(6);
    expect(computer.moves.at(-1)).toEqual({ row: 0, column: 3, value: 6, participant: 'Computer' });
  });

  it('rejects conflicts and labels the computer as a local simulation', () => {
    expect(isLegalSudokuMove(initialSudokuSpikeState.board, 0, 2, 5)).toBe(false);
    const rejected = placeVisitorSudokuMove(initialSudokuSpikeState, { row: 0, column: 2, value: 5 });
    expect(rejected.board).toEqual(initialSudokuSpikeState.board);
    expect(rejected.message).toContain('conflicts');
    const html = renderToStaticMarkup(<SudokuSpike />);
    expect(html).toContain('Computer / local simulation');
  });
});
