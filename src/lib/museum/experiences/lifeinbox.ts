import type { ProjectExperienceManifest } from '../../portfolioContracts';

export const manifest = {
  id: 'experience:lifeinbox',
  projectId: 'project:lifeinbox',
  supportedStages: ['signal', 'approach'],
  evidenceNodeIds: ['post:lifeinbox:local-first-capture-needs-trust'],
} as const satisfies ProjectExperienceManifest;

export default manifest;
