import { describe, expect, it } from 'vitest';
import { DREAMLIFE_SCENE_LAYERS, getDreamlifeLoopPath, getDreamlifeSceneFrame } from '@/lib/museum/dreamlifeScene';
import { getSudokuSceneFrame, getSudokuSyncPath, SUDOKU_SCENE_LAYERS } from '@/lib/museum/sudokuScene';
import { applySyntheticSudokuMove, placeSudokuNumber } from '@/lib/museum/sudokuBoard';

describe('remaining flagship dynamic scene models', () => {
  it('keeps Dreamlife divergence, reaction, and recombination causal', () => {
    expect(DREAMLIFE_SCENE_LAYERS).toHaveLength(7);
    const current = getDreamlifeSceneFrame({ path: 'current', reaction: 'resist', stage: 'handle', stimulation: 0.5, reducedMotion: false });
    const wild = getDreamlifeSceneFrame({ path: 'wild', reaction: 'pull', stage: 'understand', stimulation: 0.5, reducedMotion: false });
    expect(wild.divergence).toBeGreaterThan(current.divergence);
    expect(wild.refraction).toBeGreaterThan(current.refraction);
    expect(wild.recombination).toBe(1);
    expect(wild.evidenceStrength).toBe(1);
    expect(getDreamlifeLoopPath(2, 1)).toBe('M510 300 Q565 450 620.0 480.0');
  });

  it('preserves Dreamlife state while settling continuous energy', () => {
    const frame = getDreamlifeSceneFrame({ path: 'fallback', reaction: 'curious', stage: 'understand', stimulation: 1, reducedMotion: true });
    expect(frame.energy).toBe(0);
    expect(frame.recombination).toBe(1);
    expect(frame.selectedX).toBe(0.72);
    expect(frame.settled).toBe(true);
  });

  it('maps Sudoku ownership and room depth into precise presence state', () => {
    expect(SUDOKU_SCENE_LAYERS).toHaveLength(7);
    const absent = getSudokuSceneFrame({ selectedCell: 10, visitorMoves: 0, computerMoves: 0, computerJoined: false, stage: 'handle', stimulation: 0.5, reducedMotion: false });
    const joined = getSudokuSceneFrame({ selectedCell: 20, visitorMoves: 2, computerMoves: 4, computerJoined: true, stage: 'understand', stimulation: 0.5, reducedMotion: false });
    expect(absent.computerStrength).toBe(0);
    expect(joined.computerStrength).toBeGreaterThan(0);
    expect(joined.syncStrength).toBeGreaterThan(0.6);
    expect(joined.boundaryStrength).toBe(1);
    expect(joined.selectedRow).toBe(2);
    expect(joined.selectedColumn).toBe(2);
    expect(getSudokuSyncPath(2, 2, 1)).toBe('M230 190 C330.0 120.0 690.0 255.0 780.0 190');
  });

  it('stops Sudoku energy without erasing architecture depth', () => {
    const frame = getSudokuSceneFrame({ selectedCell: 80, visitorMoves: 1, computerMoves: 1, computerJoined: true, stage: 'enter', stimulation: 1, reducedMotion: false, visible: false });
    expect(frame.energy).toBe(0);
    expect(frame.boundaryStrength).toBe(0.62);
    expect(frame.syncStrength).toBeGreaterThan(0);
    expect(frame.settled).toBe(true);
  });

  it('keeps visitor ownership when the synthetic participant considers an occupied cell', () => {
    const visitorMove = placeSudokuNumber({ board: [0, 0, 0], owners: {}, selected: 1, number: 2, given: false });
    expect(visitorMove).toMatchObject({ board: [0, 2, 0], owners: { 1: 'visitor' }, changed: true });

    const occupiedComputerMove = applySyntheticSudokuMove({
      board: visitorMove.board,
      owners: visitorMove.owners,
      index: 1,
      solution: [1, 3, 2],
    });
    expect(occupiedComputerMove).toMatchObject({
      board: [0, 2, 0],
      owners: { 1: 'visitor' },
      changed: false,
    });

    const openComputerMove = applySyntheticSudokuMove({
      board: visitorMove.board,
      owners: visitorMove.owners,
      index: 2,
      solution: [1, 3, 4],
    });
    expect(openComputerMove).toMatchObject({ board: [0, 2, 4], owners: { 1: 'visitor', 2: 'computer' }, changed: true });
  });
});
