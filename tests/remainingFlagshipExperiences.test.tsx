import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ExplorationWorldProvider } from '@/components/experience/ExplorationWorldProvider';
import DreamlifeExperience from '@/components/museum/DreamlifeExperience';
import SudokuTogetherExperience from '@/components/museum/SudokuTogetherExperience';

function renderExperience(experience: React.ReactNode) {
  return renderToStaticMarkup(<ExplorationWorldProvider>{experience}</ExplorationWorldProvider>);
}

describe('remaining flagship depth experiences', () => {
  it('gives Dreamlife one manipulation language across Handle, Enter, and Understand', () => {
    const handle = renderExperience(<DreamlifeExperience stage="handle" onStageChange={vi.fn()} projectHref="https://dreamlife.marknperera.ca/" />);
    expect(handle).toContain('three futures from one present');
    expect(handle).toContain('Current');
    expect(handle).toContain('Fallback');
    expect(handle).toContain('Wild Card');
    expect(handle).toContain('data-path="wild"');
    expect(handle).toContain('data-layer="dreamlife:matte"');
    expect(handle).toContain('data-layer="dreamlife:current"');
    expect(handle).toContain('data-layer="dreamlife:fallback"');
    expect(handle).toContain('data-layer="dreamlife:wild"');
    expect(handle).toContain('data-layer="dreamlife:reaction"');

    const understand = renderExperience(<DreamlifeExperience stage="understand" onStageChange={vi.fn()} projectHref="https://dreamlife.marknperera.ca/" />);
    expect(understand).toContain('vision, explore, refine');
    expect(understand).toContain('six-figure build offer');
    expect(understand).toContain('dreamlife-mobile');
    expect(understand).toContain('data-layer="dreamlife:loop"');
    expect(understand).toContain('data-layer="dreamlife:evidence"');
  });

  it('keeps Sudoku synthetic and exposes its actual architecture', () => {
    const handle = renderExperience(<SudokuTogetherExperience stage="handle" onStageChange={vi.fn()} projectHref="https://sudokutogether.marknperera.ca/" />);
    expect(handle).toContain('one board, two traces');
    expect(handle).toContain('Invite the computer');
    expect(handle).toContain('without pretending a real visitor is present');
    expect(handle).toContain('data-computer-joined="false"');
    expect(handle).toContain('data-layer="sudoku:matte"');
    expect(handle).toContain('data-layer="sudoku:sync-wave"');
    expect(handle).toContain('data-layer="sudoku:grid"');

    const understand = renderExperience(<SudokuTogetherExperience stage="understand" onStageChange={vi.fn()} projectHref="https://sudokutogether.marknperera.ca/" />);
    expect(understand).toContain('Multiplayer trust is a versioning problem');
    expect(understand).toContain('Discord SDK');
    expect(understand).toContain('Discord-Activity-Sudoku');
    expect(understand).toContain('data-layer="sudoku:evidence"');
  });
});
