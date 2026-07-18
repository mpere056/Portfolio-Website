export type SudokuGrid = readonly (readonly number[])[];

export interface SudokuMove {
  row: number;
  column: number;
  value: number;
  participant: 'Visitor' | 'Computer';
}

export interface SudokuSpikeState {
  board: SudokuGrid;
  moves: readonly SudokuMove[];
  status: 'visitor-turn' | 'computer-ready' | 'visitor-turn-after-computer';
  message: string;
}

export const SUDOKU_PUZZLE: SudokuGrid = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export const initialSudokuSpikeState: SudokuSpikeState = {
  board: SUDOKU_PUZZLE,
  moves: [],
  status: 'visitor-turn',
  message: 'Place 4 in the highlighted cell.',
};

function replaceCell(board: SudokuGrid, row: number, column: number, value: number): SudokuGrid {
  return board.map((line, rowIndex) => (
    rowIndex === row ? line.map((cell, columnIndex) => columnIndex === column ? value : cell) : [...line]
  ));
}

export function isLegalSudokuMove(board: SudokuGrid, row: number, column: number, value: number) {
  if (row < 0 || row > 8 || column < 0 || column > 8 || value < 1 || value > 9) return false;
  if (board[row]?.[column] !== 0) return false;
  if (board[row].includes(value)) return false;
  if (board.some(line => line[column] === value)) return false;

  const boxRow = Math.floor(row / 3) * 3;
  const boxColumn = Math.floor(column / 3) * 3;
  for (let rowIndex = boxRow; rowIndex < boxRow + 3; rowIndex += 1) {
    for (let columnIndex = boxColumn; columnIndex < boxColumn + 3; columnIndex += 1) {
      if (board[rowIndex][columnIndex] === value) return false;
    }
  }
  return true;
}

export function placeVisitorSudokuMove(
  state: SudokuSpikeState,
  move: Pick<SudokuMove, 'row' | 'column' | 'value'>,
): SudokuSpikeState {
  if (state.status !== 'visitor-turn' || !isLegalSudokuMove(state.board, move.row, move.column, move.value)) {
    return { ...state, message: 'That move conflicts with the row, column, or box.' };
  }

  return {
    board: replaceCell(state.board, move.row, move.column, move.value),
    moves: [...state.moves, { ...move, participant: 'Visitor' }],
    status: 'computer-ready',
    message: 'Visitor placed 4. Computer is checking the shared board.',
  };
}

export function placeComputerSudokuMove(state: SudokuSpikeState): SudokuSpikeState {
  const move = { row: 0, column: 3, value: 6 } as const;
  if (state.status !== 'computer-ready' || !isLegalSudokuMove(state.board, move.row, move.column, move.value)) return state;

  return {
    board: replaceCell(state.board, move.row, move.column, move.value),
    moves: [...state.moves, { ...move, participant: 'Computer' }],
    status: 'visitor-turn-after-computer',
    message: 'Computer placed 6. This participant is a deterministic local simulation.',
  };
}

