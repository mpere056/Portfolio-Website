import {
  isNodeId,
  type DestinationId,
  type ExperienceDestination,
  type SafeState,
  type SafeStateValue,
} from './portfolioContracts';

export const DESTINATION_STATUSES = [
  'canonical',
  'legacy-alias',
  'planned',
  'internal-only',
  'feedback-gated',
] as const;
export type DestinationStatus = (typeof DESTINATION_STATUSES)[number];

export const DESTINATION_KINDS = [
  'world',
  'about',
  'museum',
  'museum-exhibit',
  'project',
  'blog-index',
  'blog-post',
  'archive',
  'writing',
  'studio',
  'legacy',
  'internal',
] as const;
export type DestinationKind = (typeof DESTINATION_KINDS)[number];

export const DESTINATION_ORIGINS = ['main', 'dreamlife', 'lifeinbox', 'sudokutogether'] as const;
export type DestinationOrigin = (typeof DESTINATION_ORIGINS)[number];

export const CHECKPOINT_POLICIES = ['route', 'semantic', 'none'] as const;
export type CheckpointPolicy = (typeof CHECKPOINT_POLICIES)[number];

export interface DestinationDefinition extends Omit<ExperienceDestination, 'safeState'> {
  status: DestinationStatus;
  kind: DestinationKind;
  targetOrigin: DestinationOrigin;
  checkpointPolicy: CheckpointPolicy;
  fallbackDestinationId: DestinationId;
  allowedSafeStateKeys: readonly string[];
}

const HOME_ID = 'destination:home' as const;

export const DESTINATION_REGISTRY = {
  [HOME_ID]: {
    id: HOME_ID,
    href: '/',
    status: 'canonical',
    kind: 'world',
    targetOrigin: 'main',
    checkpointPolicy: 'route',
    fallbackDestinationId: HOME_ID,
    allowedSafeStateKeys: [],
  },
  'destination:about': {
    id: 'destination:about',
    href: '/about',
    status: 'canonical',
    kind: 'about',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: HOME_ID,
    allowedSafeStateKeys: ['event'],
  },
  'destination:projects': {
    id: 'destination:projects',
    href: '/projects',
    status: 'canonical',
    kind: 'museum',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: HOME_ID,
    allowedSafeStateKeys: ['project'],
  },
  'destination:project-dreamlife': {
    id: 'destination:project-dreamlife',
    href: 'https://dreamlife.marknperera.ca/',
    nodeId: 'project:dreamlife',
    status: 'canonical',
    kind: 'project',
    targetOrigin: 'dreamlife',
    checkpointPolicy: 'route',
    fallbackDestinationId: 'destination:museum-project-dreamlife',
    allowedSafeStateKeys: [],
  },
  'destination:project-lifeinbox': {
    id: 'destination:project-lifeinbox',
    href: 'https://lifeinbox.marknperera.ca/',
    nodeId: 'project:lifeinbox',
    status: 'canonical',
    kind: 'project',
    targetOrigin: 'lifeinbox',
    checkpointPolicy: 'route',
    fallbackDestinationId: 'destination:museum-project-lifeinbox',
    allowedSafeStateKeys: [],
  },
  'destination:project-sudokutogether': {
    id: 'destination:project-sudokutogether',
    href: 'https://sudokutogether.marknperera.ca/',
    nodeId: 'project:discord-sudoku-activity',
    status: 'canonical',
    kind: 'project',
    targetOrigin: 'sudokutogether',
    checkpointPolicy: 'route',
    fallbackDestinationId: 'destination:museum-project-sudokutogether',
    allowedSafeStateKeys: [],
  },
  'destination:museum-project-dreamlife': {
    id: 'destination:museum-project-dreamlife',
    href: '/projects#dreamlife',
    nodeId: 'project:dreamlife',
    status: 'canonical',
    kind: 'museum-exhibit',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: 'destination:projects',
    allowedSafeStateKeys: [],
  },
  'destination:museum-project-lifeinbox': {
    id: 'destination:museum-project-lifeinbox',
    href: '/projects#lifeinbox',
    nodeId: 'project:lifeinbox',
    status: 'canonical',
    kind: 'museum-exhibit',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: 'destination:projects',
    allowedSafeStateKeys: [],
  },
  'destination:museum-project-sudokutogether': {
    id: 'destination:museum-project-sudokutogether',
    href: '/projects#discord-sudoku-activity',
    nodeId: 'project:discord-sudoku-activity',
    status: 'canonical',
    kind: 'museum-exhibit',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: 'destination:projects',
    allowedSafeStateKeys: [],
  },
  'destination:project-story-app': {
    id: 'destination:project-story-app',
    href: '/projects#story-app',
    nodeId: 'project:story-app',
    status: 'canonical',
    kind: 'project',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: 'destination:projects',
    allowedSafeStateKeys: [],
  },
  'destination:project-discord-bot': {
    id: 'destination:project-discord-bot',
    href: '/projects#discord-bot',
    nodeId: 'project:discord-bot',
    status: 'canonical',
    kind: 'project',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: 'destination:projects',
    allowedSafeStateKeys: [],
  },
  'destination:project-discord-sync-messaging': {
    id: 'destination:project-discord-sync-messaging',
    href: '/projects#discord-sync-messaging',
    nodeId: 'project:discord-sync-messaging',
    status: 'canonical',
    kind: 'project',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: 'destination:projects',
    allowedSafeStateKeys: [],
  },
  'destination:project-game-mod': {
    id: 'destination:project-game-mod',
    href: '/projects#game-mod',
    nodeId: 'project:game-mod',
    status: 'canonical',
    kind: 'project',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: 'destination:projects',
    allowedSafeStateKeys: [],
  },
  'destination:project-group-finder': {
    id: 'destination:project-group-finder',
    href: '/projects#group-finder',
    nodeId: 'project:group-finder',
    status: 'canonical',
    kind: 'project',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: 'destination:projects',
    allowedSafeStateKeys: [],
  },
  'destination:project-kitsune-karuta': {
    id: 'destination:project-kitsune-karuta',
    href: '/projects#kitsune-karuta',
    nodeId: 'project:kitsune-karuta',
    status: 'canonical',
    kind: 'project',
    targetOrigin: 'main',
    checkpointPolicy: 'semantic',
    fallbackDestinationId: 'destination:projects',
    allowedSafeStateKeys: [],
  },
  'destination:project-dreamlife-blog': {
    id: 'destination:project-dreamlife-blog',
    href: 'https://dreamlife.marknperera.ca/blog',
    nodeId: 'project:dreamlife',
    status: 'canonical',
    kind: 'blog-index',
    targetOrigin: 'dreamlife',
    checkpointPolicy: 'route',
    fallbackDestinationId: 'destination:project-dreamlife',
    allowedSafeStateKeys: [],
  },
  'destination:project-lifeinbox-blog': {
    id: 'destination:project-lifeinbox-blog',
    href: 'https://lifeinbox.marknperera.ca/blog',
    nodeId: 'project:lifeinbox',
    status: 'canonical',
    kind: 'blog-index',
    targetOrigin: 'lifeinbox',
    checkpointPolicy: 'route',
    fallbackDestinationId: 'destination:project-lifeinbox',
    allowedSafeStateKeys: [],
  },
  'destination:project-sudokutogether-blog': {
    id: 'destination:project-sudokutogether-blog',
    href: 'https://sudokutogether.marknperera.ca/blog',
    nodeId: 'project:discord-sudoku-activity',
    status: 'canonical',
    kind: 'blog-index',
    targetOrigin: 'sudokutogether',
    checkpointPolicy: 'route',
    fallbackDestinationId: 'destination:project-sudokutogether',
    allowedSafeStateKeys: [],
  },
  'destination:post-dreamlife-building-a-life-design-loop': {
    id: 'destination:post-dreamlife-building-a-life-design-loop',
    href: 'https://dreamlife.marknperera.ca/blog/building-a-life-design-loop',
    nodeId: 'post:dreamlife:building-a-life-design-loop',
    status: 'canonical',
    kind: 'blog-post',
    targetOrigin: 'dreamlife',
    checkpointPolicy: 'route',
    fallbackDestinationId: 'destination:project-dreamlife-blog',
    allowedSafeStateKeys: [],
  },
  'destination:post-lifeinbox-local-first-capture-needs-trust': {
    id: 'destination:post-lifeinbox-local-first-capture-needs-trust',
    href: 'https://lifeinbox.marknperera.ca/blog/local-first-capture-needs-trust',
    nodeId: 'post:lifeinbox:local-first-capture-needs-trust',
    status: 'canonical',
    kind: 'blog-post',
    targetOrigin: 'lifeinbox',
    checkpointPolicy: 'route',
    fallbackDestinationId: 'destination:project-lifeinbox-blog',
    allowedSafeStateKeys: [],
  },
  'destination:post-sudokutogether-why-discord-sudoku-needed-a-proxy': {
    id: 'destination:post-sudokutogether-why-discord-sudoku-needed-a-proxy',
    href: 'https://sudokutogether.marknperera.ca/blog/why-discord-sudoku-needed-a-proxy',
    nodeId: 'post:sudokutogether:why-discord-sudoku-needed-a-proxy',
    status: 'canonical',
    kind: 'blog-post',
    targetOrigin: 'sudokutogether',
    checkpointPolicy: 'route',
    fallbackDestinationId: 'destination:project-sudokutogether-blog',
    allowedSafeStateKeys: [],
  },
  'destination:chat-legacy': {
    id: 'destination:chat-legacy',
    href: '/chat',
    status: 'legacy-alias',
    kind: 'legacy',
    targetOrigin: 'main',
    checkpointPolicy: 'route',
    fallbackDestinationId: HOME_ID,
    allowedSafeStateKeys: ['prompt'],
  },
  'destination:archive': {
    id: 'destination:archive',
    href: '/archive',
    status: 'planned',
    kind: 'archive',
    targetOrigin: 'main',
    checkpointPolicy: 'none',
    fallbackDestinationId: HOME_ID,
    allowedSafeStateKeys: [],
  },
  'destination:writing': {
    id: 'destination:writing',
    href: '/writing',
    status: 'planned',
    kind: 'writing',
    targetOrigin: 'main',
    checkpointPolicy: 'none',
    fallbackDestinationId: HOME_ID,
    allowedSafeStateKeys: [],
  },
  'destination:studio': {
    id: 'destination:studio',
    href: '/studio',
    status: 'feedback-gated',
    kind: 'studio',
    targetOrigin: 'main',
    checkpointPolicy: 'none',
    fallbackDestinationId: HOME_ID,
    allowedSafeStateKeys: [],
  },
  'destination:demo-internal': {
    id: 'destination:demo-internal',
    href: '/demo',
    status: 'internal-only',
    kind: 'internal',
    targetOrigin: 'main',
    checkpointPolicy: 'none',
    fallbackDestinationId: HOME_ID,
    allowedSafeStateKeys: [],
  },
  'destination:templates-internal': {
    id: 'destination:templates-internal',
    href: '/templates',
    status: 'internal-only',
    kind: 'internal',
    targetOrigin: 'main',
    checkpointPolicy: 'none',
    fallbackDestinationId: HOME_ID,
    allowedSafeStateKeys: [],
  },
} as const satisfies Readonly<Record<DestinationId, DestinationDefinition>>;

const registryById: Readonly<Record<string, DestinationDefinition>> = DESTINATION_REGISTRY;
const resolvableStatuses: readonly DestinationStatus[] = ['canonical', 'legacy-alias'];

export type DestinationResolutionReason =
  | 'unknown-destination'
  | 'unavailable-destination'
  | 'unsupported-safe-state'
  | 'invalid-safe-state';

export type DestinationNavigationMode = 'same-origin' | 'full-document';

export interface DestinationResolution {
  requestedId: string;
  destination: DestinationDefinition;
  href: string;
  safeState: SafeState;
  navigationMode: DestinationNavigationMode;
  usedFallback: boolean;
  reason?: DestinationResolutionReason;
}

export interface ResolveDestinationOptions {
  safeState?: Readonly<Record<string, unknown>>;
  allowLegacy?: boolean;
  currentOrigin?: DestinationOrigin;
}

function getFallback(definition?: DestinationDefinition) {
  const fallbackId = definition?.fallbackDestinationId ?? HOME_ID;
  return registryById[fallbackId] ?? registryById[HOME_ID];
}

export function getDestinationNavigationMode(
  destination: DestinationDefinition,
  currentOrigin: DestinationOrigin = 'main',
): DestinationNavigationMode {
  return destination.targetOrigin === currentOrigin ? 'same-origin' : 'full-document';
}

function fallbackResolution(
  requestedId: string,
  reason: DestinationResolutionReason,
  currentOrigin: DestinationOrigin,
  source?: DestinationDefinition,
) {
  const destination = getFallback(source);
  return {
    requestedId,
    destination,
    href: destination.href,
    safeState: {},
    navigationMode: getDestinationNavigationMode(destination, currentOrigin),
    usedFallback: true,
    reason,
  } satisfies DestinationResolution;
}

function isSafeStateValue(value: unknown): value is SafeStateValue {
  return typeof value === 'string'
    || (typeof value === 'number' && Number.isFinite(value))
    || typeof value === 'boolean';
}

function withSafeState(href: string, safeState: SafeState) {
  const absolute = /^https:\/\//.test(href);
  const url = new URL(href, 'https://marknperera.ca');
  Object.entries(safeState)
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return absolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
}

export function getDestinationDefinition(id: string) {
  return registryById[id];
}

export function getSuggestibleDestinations() {
  return Object.values(DESTINATION_REGISTRY).filter(destination => destination.status === 'canonical');
}

export function resolveDestination(
  requestedId: string,
  options: ResolveDestinationOptions = {},
): DestinationResolution {
  const currentOrigin = options.currentOrigin ?? 'main';
  const destination = registryById[requestedId];
  if (!destination) return fallbackResolution(requestedId, 'unknown-destination', currentOrigin);

  const allowLegacy = options.allowLegacy ?? true;
  const resolvable = resolvableStatuses.includes(destination.status)
    && (destination.status !== 'legacy-alias' || allowLegacy);
  if (!resolvable) {
    return fallbackResolution(requestedId, 'unavailable-destination', currentOrigin, destination);
  }

  const entries = Object.entries(options.safeState ?? {});
  if (entries.some(([, value]) => !isSafeStateValue(value))) {
    return fallbackResolution(requestedId, 'invalid-safe-state', currentOrigin, destination);
  }
  if (entries.some(([key]) => !destination.allowedSafeStateKeys.includes(key))) {
    return fallbackResolution(requestedId, 'unsupported-safe-state', currentOrigin, destination);
  }

  const safeState = Object.fromEntries(entries) as SafeState;
  return {
    requestedId,
    destination,
    href: withSafeState(destination.href, safeState),
    safeState,
    navigationMode: getDestinationNavigationMode(destination, currentOrigin),
    usedFallback: false,
  };
}

export interface DestinationRegistryIssue {
  destinationId: string;
  code: string;
}

export function validateDestinationRegistry(): DestinationRegistryIssue[] {
  const issues: DestinationRegistryIssue[] = [];

  const entries = Object.entries(DESTINATION_REGISTRY) as [string, DestinationDefinition][];
  for (const [key, destination] of entries) {
    if (key !== destination.id) issues.push({ destinationId: key, code: 'key-id-mismatch' });
    if (destination.nodeId && !isNodeId(destination.nodeId)) {
      issues.push({ destinationId: key, code: 'invalid-node-id' });
    }

    const fallback = registryById[destination.fallbackDestinationId];
    if (!fallback) issues.push({ destinationId: key, code: 'missing-fallback' });
    else if (fallback.status !== 'canonical') issues.push({ destinationId: key, code: 'noncanonical-fallback' });

    if (new Set(destination.allowedSafeStateKeys).size !== destination.allowedSafeStateKeys.length) {
      issues.push({ destinationId: key, code: 'duplicate-safe-state-key' });
    }

    const absolute = /^https:\/\//.test(destination.href);
    if (destination.targetOrigin === 'main' && absolute) {
      issues.push({ destinationId: key, code: 'main-origin-must-be-relative' });
    }
    if (destination.targetOrigin !== 'main') {
      const expectedHost = `${destination.targetOrigin}.marknperera.ca`;
      if (!absolute || new URL(destination.href).hostname !== expectedHost) {
        issues.push({ destinationId: key, code: 'project-origin-href-mismatch' });
      }
    }
  }

  return issues;
}
