export type ProjectWorld = 'dreamlife' | 'lifeinbox' | 'sudoku';

export interface ProjectWorldPoint {
  x: number;
  y: number;
}

export interface ProjectWorldFrame extends ProjectWorldPoint {
  intensity: number;
  primaryShiftX: number;
  primaryShiftY: number;
  secondaryShiftX: number;
  secondaryShiftY: number;
  row: number;
  column: number;
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0.5));
}

export function getProjectWorldFrame(
  world: ProjectWorld,
  point: ProjectWorldPoint,
  settled = false,
): ProjectWorldFrame {
  const x = clamp(point.x);
  const y = clamp(point.y);
  const horizontal = settled ? 0 : x - 0.5;
  const vertical = settled ? 0 : y - 0.5;
  const amplitude = world === 'dreamlife' ? 8 : world === 'lifeinbox' ? 6 : 4;

  return {
    x,
    y,
    intensity: settled ? 0.22 : world === 'lifeinbox' ? 0.88 : world === 'dreamlife' ? 0.78 : 0.72,
    primaryShiftX: horizontal * amplitude,
    primaryShiftY: vertical * amplitude * 0.72,
    secondaryShiftX: horizontal * amplitude * -0.62,
    secondaryShiftY: vertical * amplitude * -0.48,
    row: Math.min(8, Math.floor(y * 9)),
    column: Math.min(8, Math.floor(x * 9)),
  };
}
