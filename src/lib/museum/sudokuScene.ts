import type { DepthStage } from '../portfolioContracts';

export interface SudokuSceneFrame {
  energy: number;
  visitorStrength: number;
  computerStrength: number;
  syncStrength: number;
  boundaryStrength: number;
  evidenceStrength: number;
  selectedRow: number;
  selectedColumn: number;
  settled: boolean;
}

export const SUDOKU_SCENE_LAYERS = [
  { id: 'sudoku:matte', medium: 'raster', driver: 'none', meaning: 'Approved shared diagram-organism checksum.' },
  { id: 'sudoku:grid', medium: 'dom', driver: 'selected cell and board values', meaning: 'The playable board remains the central instrument.' },
  { id: 'sudoku:visitor-trace', medium: 'css', driver: 'visitor-owned cells', meaning: 'Coral intent records the local participant without implying another visitor.' },
  { id: 'sudoku:computer-trace', medium: 'css', driver: 'synthetic computer-owned cells', meaning: 'Mint presence reveals the deterministic participant.' },
  { id: 'sudoku:sync-wave', medium: 'svg', driver: 'ownership changes and joined state', meaning: 'Version propagation crosses the board as a precise trace.' },
  { id: 'sudoku:boundaries', medium: 'svg', driver: 'Enter and Understand', meaning: 'Discord, proxy, persistence, and polling separate spatially.' },
  { id: 'sudoku:evidence', medium: 'dom', driver: 'Understand', meaning: 'Architecture and source remain inspectable proof.' },
] as const;

function clamp(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function getSudokuSceneFrame({
  selectedCell,
  visitorMoves,
  computerMoves,
  computerJoined,
  stage,
  stimulation,
  reducedMotion,
  visible = true,
}: {
  selectedCell: number;
  visitorMoves: number;
  computerMoves: number;
  computerJoined: boolean;
  stage: DepthStage;
  stimulation: number;
  reducedMotion: boolean;
  visible?: boolean;
}): SudokuSceneFrame {
  const safeCell = Math.max(0, Math.min(80, Math.round(selectedCell)));
  const energy = reducedMotion || !visible ? 0 : 0.12 + clamp(stimulation) * 0.88;
  const moveTotal = Math.min(1, (visitorMoves + computerMoves) / 9);
  return {
    energy,
    visitorStrength: Math.min(1, 0.2 + visitorMoves * 0.16),
    computerStrength: computerJoined ? Math.min(1, 0.24 + computerMoves * 0.12) : 0,
    syncStrength: computerJoined ? 0.32 + moveTotal * 0.5 + energy * 0.18 : 0,
    boundaryStrength: stage === 'understand' ? 1 : stage === 'enter' ? 0.62 : 0,
    evidenceStrength: stage === 'understand' ? 1 : 0,
    selectedRow: Math.floor(safeCell / 9),
    selectedColumn: safeCell % 9,
    settled: reducedMotion || !visible,
  };
}

export function getSudokuSyncPath(row: number, column: number, strength: number) {
  const startX = 130 + Math.max(0, Math.min(8, column)) * 50;
  const startY = 90 + Math.max(0, Math.min(8, row)) * 50;
  const endX = startX + (780 - startX) * clamp(strength);
  return `M${startX} ${startY} C${(startX + 100).toFixed(1)} ${(startY - 70).toFixed(1)} ${(endX - 90).toFixed(1)} ${(startY + 65).toFixed(1)} ${endX.toFixed(1)} ${startY}`;
}
