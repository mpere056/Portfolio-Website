import { ABOUT_SCENE_LAYERS } from './aboutScene';
import { AI_SCENE_LAYERS } from './aiScene';
import { HOME_SCENE_LAYERS } from './homeScene';
import { READING_SCENE_LAYERS } from './readingScene';
import { DREAMLIFE_SCENE_LAYERS } from '../museum/dreamlifeScene';
import { LIFEINBOX_SCENE_LAYERS } from '../museum/lifeInboxScene';
import { MUSEUM_SCENE_LAYERS } from '../museum/scene';
import { SUDOKU_SCENE_LAYERS } from '../museum/sudokuScene';

export type SceneTemporalMode = 'continuous' | 'event-bounded' | 'state-transition' | 'passive-scroll';
export type SceneRenderer = 'canvas-2d' | 'css' | 'dom' | 'raster' | 'svg' | 'webgl';

export interface DynamicScenePolicy {
  id: string;
  routeClass: 'world' | 'flagship' | 'supporting' | 'reading';
  layers: readonly string[];
  renderers: readonly SceneRenderer[];
  temporalMode: SceneTemporalMode;
  dominantSchedulers: number;
  pausesWhenHidden: boolean;
  reducedMotionSettles: boolean;
  stableFallback: boolean;
  namedCause: string;
}

type LayerEntry = string | { id: string };

function layerIds(entries: readonly LayerEntry[]) {
  return entries.map(entry => typeof entry === 'string' ? entry : entry.id);
}

export const DYNAMIC_SCENE_POLICIES = [
  {
    id: 'museum',
    routeClass: 'world',
    layers: layerIds(MUSEUM_SCENE_LAYERS),
    renderers: ['raster', 'css', 'canvas-2d', 'svg', 'dom'],
    temporalMode: 'continuous',
    dominantSchedulers: 1,
    pausesWhenHidden: true,
    reducedMotionSettles: true,
    stableFallback: true,
    namedCause: 'pointer proximity, selection, graph relationships, and stimulation',
  },
  {
    id: 'lifeinbox',
    routeClass: 'flagship',
    layers: layerIds(LIFEINBOX_SCENE_LAYERS),
    renderers: ['raster', 'css', 'canvas-2d', 'svg', 'dom'],
    temporalMode: 'continuous',
    dominantSchedulers: 1,
    pausesWhenHidden: true,
    reducedMotionSettles: true,
    stableFallback: true,
    namedCause: 'capture, settlement, trust boundary, depth, and reminder return',
  },
  {
    id: 'dreamlife',
    routeClass: 'flagship',
    layers: layerIds(DREAMLIFE_SCENE_LAYERS),
    renderers: ['raster', 'css', 'svg', 'dom'],
    temporalMode: 'state-transition',
    dominantSchedulers: 0,
    pausesWhenHidden: true,
    reducedMotionSettles: true,
    stableFallback: true,
    namedCause: 'selected future, reaction, and depth',
  },
  {
    id: 'sudoku',
    routeClass: 'flagship',
    layers: layerIds(SUDOKU_SCENE_LAYERS),
    renderers: ['raster', 'css', 'svg', 'dom'],
    temporalMode: 'state-transition',
    dominantSchedulers: 0,
    pausesWhenHidden: true,
    reducedMotionSettles: true,
    stableFallback: true,
    namedCause: 'truthful board ownership, participant arrival, sync, and depth',
  },
  {
    id: 'home',
    routeClass: 'supporting',
    layers: layerIds(HOME_SCENE_LAYERS),
    renderers: ['raster', 'css', 'svg', 'webgl', 'dom'],
    temporalMode: 'continuous',
    dominantSchedulers: 1,
    pausesWhenHidden: true,
    reducedMotionSettles: true,
    stableFallback: true,
    namedCause: 'the visitor playing the First Note',
  },
  {
    id: 'about',
    routeClass: 'supporting',
    layers: layerIds(ABOUT_SCENE_LAYERS),
    renderers: ['raster', 'css', 'svg', 'webgl', 'dom'],
    temporalMode: 'event-bounded',
    dominantSchedulers: 1,
    pausesWhenHidden: true,
    reducedMotionSettles: true,
    stableFallback: true,
    namedCause: 'the inspected timeline moment',
  },
  {
    id: 'ai',
    routeClass: 'supporting',
    layers: layerIds(AI_SCENE_LAYERS),
    renderers: ['raster', 'css', 'svg', 'dom'],
    temporalMode: 'state-transition',
    dominantSchedulers: 0,
    pausesWhenHidden: true,
    reducedMotionSettles: true,
    stableFallback: true,
    namedCause: 'archive visibility, route context, and response activity',
  },
  {
    id: 'reading',
    routeClass: 'reading',
    layers: layerIds(READING_SCENE_LAYERS),
    renderers: ['raster', 'css', 'svg', 'dom'],
    temporalMode: 'passive-scroll',
    dominantSchedulers: 0,
    pausesWhenHidden: true,
    reducedMotionSettles: true,
    stableFallback: true,
    namedCause: 'bounded deliberate reading progress',
  },
] as const satisfies readonly DynamicScenePolicy[];

export function auditDynamicScenePolicies(
  policies: readonly DynamicScenePolicy[] = DYNAMIC_SCENE_POLICIES,
) {
  const issues: string[] = [];
  const routeIds = new Set<string>();
  const signatures = new Map<string, string>();

  for (const policy of policies) {
    if (routeIds.has(policy.id)) issues.push(`${policy.id}: duplicate route id`);
    routeIds.add(policy.id);

    if (policy.layers.length < 5) issues.push(`${policy.id}: requires at least five authored layers`);
    if (new Set(policy.layers).size !== policy.layers.length) issues.push(`${policy.id}: duplicate layer id`);
    if (!policy.namedCause.trim()) issues.push(`${policy.id}: missing named cause`);
    if (policy.dominantSchedulers > 1) issues.push(`${policy.id}: more than one dominant scheduler`);
    if (!policy.pausesWhenHidden) issues.push(`${policy.id}: hidden scenes must pause or remain event-bound`);
    if (!policy.reducedMotionSettles) issues.push(`${policy.id}: reduced motion must settle`);
    if (!policy.stableFallback) issues.push(`${policy.id}: stable fallback required`);
    if (policy.temporalMode === 'passive-scroll' && policy.dominantSchedulers !== 0) {
      issues.push(`${policy.id}: passive scroll cannot own a continuous scheduler`);
    }

    const signature = policy.layers.map(layer => layer.replace(`${policy.id}:`, '')).sort().join('|');
    const duplicateRoute = signatures.get(signature);
    if (duplicateRoute) issues.push(`${policy.id}: duplicates ${duplicateRoute} layer signature`);
    signatures.set(signature, policy.id);
  }

  return issues;
}
