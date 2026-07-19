import type { ProjectExperienceManifest } from '../../portfolioContracts';

export const manifest = {
  id: 'experience:dreamlife',
  projectId: 'project:dreamlife',
  supportedStages: ['signal', 'approach', 'handle', 'enter', 'understand'],
  evidenceNodeIds: ['post:dreamlife:building-a-life-design-loop'],
} as const satisfies ProjectExperienceManifest;

export default manifest;
