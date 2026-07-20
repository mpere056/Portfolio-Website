export type SudokuOwner = 'visitor' | 'computer';

export interface SudokuBoardState {
  board: number[];
  owners: Record<number, SudokuOwner>;
  changed: boolean;
}

export function placeSudokuNumber({
  board,
  owners,
  selected,
  number,
  given,
}: {
  board: readonly number[];
  owners: Readonly<Record<number, SudokuOwner>>;
  selected: number;
  number: number;
  given: boolean;
}): SudokuBoardState {
  if (given || board[selected] || number < 1 || number > 9) {
    return { board: [...board], owners: { ...owners }, changed: false };
  }
  return {
    board: board.map((value, index) => index === selected ? number : value),
    owners: { ...owners, [selected]: 'visitor' },
    changed: true,
  };
}

export function applySyntheticSudokuMove({
  board,
  owners,
  index,
  solution,
}: {
  board: readonly number[];
  owners: Readonly<Record<number, SudokuOwner>>;
  index: number;
  solution: readonly number[];
}): SudokuBoardState {
  if (index < 0 || index >= board.length || board[index] || !solution[index]) {
    return { board: [...board], owners: { ...owners }, changed: false };
  }
  return {
    board: board.map((value, cell) => cell === index ? solution[index] : value),
    owners: { ...owners, [index]: 'computer' },
    changed: true,
  };
}
