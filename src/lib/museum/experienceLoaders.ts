import {
  DEPTH_STAGES,
  isDepthStage,
  isExperienceId,
  isNodeId,
  type ExperienceId,
  type ProjectExperienceManifest,
} from '../portfolioContracts';
import type { MuseumExhibitDefinition } from './types';

export interface ProjectExperienceModule {
  manifest: ProjectExperienceManifest;
}

export type ProjectExperienceLoader = () => Promise<ProjectExperienceModule>;
export type ProjectExperienceLoaderMap = Partial<Record<ExperienceId, ProjectExperienceLoader>>;

export type ExperienceLoadResult =
  | { status: 'available'; module: ProjectExperienceModule }
  | { status: 'missing' | 'failed' | 'invalid' };

const DEFAULT_EXPERIENCE_LOADERS: ProjectExperienceLoaderMap = {
  'experience:dreamlife': () => import('./experiences/dreamlife'),
  'experience:lifeinbox': () => import('./experiences/lifeinbox'),
  'experience:sudoku-together': () => import('./experiences/sudokuTogether'),
};

function isOrderedStageSequence(stages: readonly string[]) {
  return stages.length > 0
    && stages[0] === 'signal'
    && new Set(stages).size === stages.length
    && stages.every((stage, index) => (
      isDepthStage(stage)
      && (index === 0 || DEPTH_STAGES.indexOf(stage) > DEPTH_STAGES.indexOf(stages[index - 1] as typeof stage))
    ));
}

function isManifest(value: unknown): value is ProjectExperienceManifest {
  if (!value || typeof value !== 'object') return false;
  const manifest = value as Partial<ProjectExperienceManifest>;
  return typeof manifest.id === 'string'
    && isExperienceId(manifest.id)
    && typeof manifest.projectId === 'string'
    && isNodeId(manifest.projectId)
    && manifest.projectId.startsWith('project:')
    && Array.isArray(manifest.supportedStages)
    && manifest.supportedStages.every(stage => typeof stage === 'string')
    && isOrderedStageSequence(manifest.supportedStages as string[])
    && Array.isArray(manifest.evidenceNodeIds)
    && manifest.evidenceNodeIds.every(id => typeof id === 'string' && isNodeId(id));
}

export function createExperienceLoaderRegistry(
  loaders: ProjectExperienceLoaderMap = DEFAULT_EXPERIENCE_LOADERS,
) {
  return {
    has(experienceId: ExperienceId) {
      return typeof loaders[experienceId] === 'function';
    },
    async load(exhibit: MuseumExhibitDefinition): Promise<ExperienceLoadResult> {
      if (!exhibit.experienceId) return { status: 'missing' };
      const loader = loaders[exhibit.experienceId];
      if (!loader) return { status: 'missing' };

      try {
        const loadedExperience = await loader();
        if (
          !isManifest(loadedExperience.manifest)
          || loadedExperience.manifest.id !== exhibit.experienceId
          || loadedExperience.manifest.projectId !== exhibit.projectId
          || loadedExperience.manifest.supportedStages.some(stage => !exhibit.supportedStages.includes(stage))
        ) {
          return { status: 'invalid' };
        }
        return { status: 'available', module: loadedExperience };
      } catch {
        return { status: 'failed' };
      }
    },
  };
}

export const experienceLoaderRegistry = createExperienceLoaderRegistry();
