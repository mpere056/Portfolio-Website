import type { ProjectExperienceManifest } from '../../portfolioContracts';

export const manifest = {
  id: 'experience:sudoku-together',
  projectId: 'project:discord-sudoku-activity',
  supportedStages: ['signal', 'approach', 'handle', 'enter', 'understand'],
  evidenceNodeIds: ['post:sudokutogether:why-discord-sudoku-needed-a-proxy'],
} as const satisfies ProjectExperienceManifest;

export default manifest;
