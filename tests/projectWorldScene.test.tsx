import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ProjectWorldScene from '@/components/sites/ProjectWorldScene';
import { getProjectWorldFrame } from '@/lib/artDirection/projectWorldScene';

describe('project subdomain dynamic scenes', () => {
  it.each(['dreamlife', 'lifeinbox', 'sudoku'] as const)('renders a route-owned %s scene', (world) => {
    const html = renderToStaticMarkup(<ProjectWorldScene world={world} src={`/images/${world}.webp`} />);
    expect(html).toContain(`data-world-scene="${world}"`);
    expect(html).toContain('data-scene-settled="false"');
  });

  it('uses distinct amplitudes and addresses the Sudoku grid from pointer state', () => {
    const point = { x: 0.82, y: 0.24 };
    expect(getProjectWorldFrame('dreamlife', point).primaryShiftX).toBeGreaterThan(
      getProjectWorldFrame('sudoku', point).primaryShiftX,
    );
    expect(getProjectWorldFrame('lifeinbox', point).intensity).toBeGreaterThan(
      getProjectWorldFrame('dreamlife', point).intensity,
    );
    expect(getProjectWorldFrame('sudoku', point)).toMatchObject({ row: 2, column: 7 });
  });

  it('settles every route without losing its addressed state', () => {
    expect(getProjectWorldFrame('dreamlife', { x: 0.8, y: 0.2 }, true)).toMatchObject({
      x: 0.8,
      y: 0.2,
      intensity: 0.22,
      primaryShiftX: 0,
      primaryShiftY: 0,
    });
  });
});
