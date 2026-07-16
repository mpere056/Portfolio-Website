import { isContentNodeId } from './contentIds';
import { resolveDestination } from './destinations';
import {
  PORTFOLIO_ACTION_TYPES,
  portfolioActions,
  type DestinationRequestedAction,
  type PortfolioAction,
  type ProjectNodeId,
} from './portfolioActions';
import {
  EXPERIENCE_STATE_SCHEMA_VERSION,
  TOUR_ROLES,
  isContentVersion,
  isDepthStage,
  isDestinationId,
  isDiscoveryEventType,
  isDiscoveryId,
  isExperienceId,
  isNodeId,
  isRelationshipId,
  isSemanticExperienceId,
  type ContentVersion,
  type DepthState,
  type DestinationId,
  type DiscoveryEvent,
  type ExperienceCheckpoint,
  type PersistedDiscoverySlice,
  type PersistedExperienceState,
  type PersistedStimulationSlice,
  type PersistedTourSlice,
  type SafeState,
  type SafeStateValue,
  type SemanticExperienceId,
  type TourRole,
} from './portfolioContracts';

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T; issues: [] }
  | { ok: false; issues: ValidationIssue[] };

export type PersistedStateSection = 'discovery' | 'tour' | 'stimulation';
export type PersistedStateStatus = 'current' | 'migrated' | 'partial-reset' | 'rejected';

export interface PersistedExperienceStateResult {
  status: PersistedStateStatus;
  sourceVersion?: number;
  value: PersistedExperienceState;
  resetSections: PersistedStateSection[];
  issues: ValidationIssue[];
}

const SAFE_STATE_MAX_KEYS = 16;
const SAFE_STATE_MAX_STRING_LENGTH = 256;
const STATE_LIST_MAX_ITEMS = 500;
const STATE_RECORD_MAX_KEYS = 100;
const SHORT_ID_MAX_LENGTH = 160;
const SIMPLE_CODE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const defaultDiscovery = (): PersistedDiscoverySlice => ({
  firstNoteCompleted: false,
  discoveredIds: [],
  handledIds: [],
  enteredIds: [],
  understoodIds: [],
  alteredObjects: {},
  seenContentVersions: {},
});

const defaultTour = (): PersistedTourSlice => ({
  enabled: false,
  suggestedDestinationIds: [],
  visitedSuggestedIds: [],
  dismissedHintIds: [],
});

const defaultStimulation = (): PersistedStimulationSlice => ({
  soundEnabled: false,
  normalizedValue: 0,
  reducedMotionRequested: false,
});

function createDefaultState(): PersistedExperienceState {
  return {
    schemaVersion: EXPERIENCE_STATE_SCHEMA_VERSION,
    discovery: defaultDiscovery(),
    tour: defaultTour(),
    stimulation: defaultStimulation(),
  };
}

export const DEFAULT_PERSISTED_EXPERIENCE_STATE = createDefaultState();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isProjectNodeId(value: unknown): value is ProjectNodeId {
  return typeof value === 'string'
    && isContentNodeId(value)
    && value.startsWith('project:');
}

function issue(path: string, code: string, message: string): ValidationIssue {
  return { path, code, message };
}

function success<T>(value: T): ValidationResult<T> {
  return { ok: true, value, issues: [] };
}

function failure<T>(...issues: ValidationIssue[]): ValidationResult<T> {
  return { ok: false, issues };
}

function prefixIssues(prefix: string, issues: ValidationIssue[]) {
  return issues.map(item => ({
    ...item,
    path: item.path ? `${prefix}.${item.path}` : prefix,
  }));
}

function isSafeStateValue(value: unknown): value is SafeStateValue {
  return typeof value === 'boolean'
    || (typeof value === 'number' && Number.isFinite(value))
    || (typeof value === 'string' && value.length <= SAFE_STATE_MAX_STRING_LENGTH);
}

function parseSafeState(value: unknown, path = 'safeState'): ValidationResult<SafeState | undefined> {
  if (value === undefined) return success(undefined);
  if (!isRecord(value)) {
    return failure(issue(path, 'invalid-safe-state', 'Safe state must be an object'));
  }

  const entries = Object.entries(value);
  if (entries.length > SAFE_STATE_MAX_KEYS) {
    return failure(issue(path, 'invalid-safe-state', 'Safe state has too many fields'));
  }

  for (const [key, entryValue] of entries) {
    if (!SIMPLE_CODE.test(key) || key.length > 64 || !isSafeStateValue(entryValue)) {
      return failure(issue(path, 'invalid-safe-state', `Invalid safe-state field: ${key}`));
    }
  }

  return success(Object.fromEntries(entries) as SafeState);
}

export function parseDestinationRequest(
  input: unknown,
): ValidationResult<DestinationRequestedAction['payload']> {
  if (!isRecord(input)) {
    return failure(issue('', 'invalid-type', 'Destination request must be an object'));
  }
  if (typeof input.destinationId !== 'string' || !isDestinationId(input.destinationId)) {
    return failure(issue('destinationId', 'invalid-destination-id', 'Destination ID is invalid'));
  }

  const safeState = parseSafeState(input.safeState);
  if (!safeState.ok) return safeState;

  const resolution = resolveDestination(input.destinationId, { safeState: safeState.value });
  if (resolution.usedFallback) {
    const safeStateReason = resolution.reason === 'invalid-safe-state'
      || resolution.reason === 'unsupported-safe-state';
    return failure(issue(
      safeStateReason ? 'safeState' : 'destinationId',
      resolution.reason ?? 'invalid-destination',
      `Destination request was rejected: ${resolution.reason ?? 'invalid-destination'}`,
    ));
  }

  return success({ destinationId: input.destinationId, safeState: safeState.value });
}

function parseDepthState(input: unknown): ValidationResult<DepthState> {
  if (!isRecord(input)) return failure(issue('', 'invalid-type', 'Depth payload must be an object'));

  const destination = parseDestinationRequest({
    destinationId: input.destinationId,
    safeState: input.safeState,
  });
  if (!destination.ok) return failure(...destination.issues);
  if (typeof input.stage !== 'string' || !isDepthStage(input.stage)) {
    return failure(issue('stage', 'invalid-depth-stage', 'Depth stage is invalid'));
  }
  if (input.selectedPartId !== undefined
    && (typeof input.selectedPartId !== 'string'
      || !input.selectedPartId
      || input.selectedPartId.length > SHORT_ID_MAX_LENGTH)) {
    return failure(issue('selectedPartId', 'invalid-selected-part', 'Selected part ID is invalid'));
  }

  return success({
    destinationId: destination.value.destinationId,
    stage: input.stage,
    ...(input.selectedPartId === undefined ? {} : { selectedPartId: input.selectedPartId }),
    ...(destination.value.safeState === undefined ? {} : { safeState: destination.value.safeState }),
  });
}

function isCanonicalTimestamp(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value;
}

function parseDiscoveryEvent(input: unknown): ValidationResult<DiscoveryEvent> {
  if (!isRecord(input)) return failure(issue('', 'invalid-type', 'Discovery payload must be an object'));
  if (typeof input.id !== 'string' || !input.id || input.id.length > SHORT_ID_MAX_LENGTH) {
    return failure(issue('id', 'invalid-event-id', 'Discovery event ID is invalid'));
  }
  if (typeof input.type !== 'string' || !isDiscoveryEventType(input.type)) {
    return failure(issue('type', 'invalid-discovery-type', 'Discovery type is invalid'));
  }
  if (typeof input.discoveryId !== 'string' || !isDiscoveryId(input.discoveryId)) {
    return failure(issue('discoveryId', 'invalid-discovery-id', 'Discovery ID is invalid'));
  }
  const destination = parseDestinationRequest({ destinationId: input.destinationId });
  if (!destination.ok) return failure(...destination.issues);
  if (!isCanonicalTimestamp(input.occurredAt)) {
    return failure(issue('occurredAt', 'invalid-timestamp', 'Timestamp must be canonical ISO-8601'));
  }
  if (input.contentVersion !== undefined
    && (typeof input.contentVersion !== 'string' || !isContentVersion(input.contentVersion))) {
    return failure(issue('contentVersion', 'invalid-content-version', 'Content version is invalid'));
  }

  return success({
    id: input.id,
    type: input.type,
    discoveryId: input.discoveryId,
    destinationId: destination.value.destinationId,
    occurredAt: input.occurredAt,
    ...(input.contentVersion === undefined ? {} : { contentVersion: input.contentVersion }),
  });
}

export function parsePortfolioAction(input: unknown): ValidationResult<PortfolioAction> {
  if (!isRecord(input)) return failure(issue('', 'invalid-type', 'Action must be an object'));
  if (typeof input.type !== 'string'
    || !PORTFOLIO_ACTION_TYPES.includes(input.type as PortfolioAction['type'])) {
    return failure(issue('type', 'invalid-action-type', 'Action type is invalid'));
  }

  switch (input.type as PortfolioAction['type']) {
    case 'depth.changed': {
      const payload = parseDepthState(input.payload);
      return payload.ok
        ? success(portfolioActions.depthChanged(payload.value))
        : failure(...prefixIssues('payload', payload.issues));
    }
    case 'destination.requested': {
      const payload = parseDestinationRequest(input.payload);
      return payload.ok
        ? success(portfolioActions.destinationRequested(payload.value.destinationId, payload.value.safeState))
        : failure(...prefixIssues('payload', payload.issues));
    }
    case 'relationship.selected': {
      if (!isRecord(input.payload)
        || typeof input.payload.relationshipId !== 'string'
        || !isRelationshipId(input.payload.relationshipId)) {
        return failure(issue('payload.relationshipId', 'invalid-relationship-id', 'Relationship ID is invalid'));
      }
      return success(portfolioActions.relationshipSelected(input.payload.relationshipId));
    }
    case 'project_state.updated': {
      if (!isRecord(input.payload)) {
        return failure(issue('payload', 'invalid-type', 'Project-state payload must be an object'));
      }
      if (!isProjectNodeId(input.payload.projectId)) {
        return failure(issue('payload.projectId', 'invalid-project-id', 'Project ID is invalid'));
      }
      if (typeof input.payload.contentVersion !== 'string'
        || !isContentVersion(input.payload.contentVersion)) {
        return failure(issue('payload.contentVersion', 'invalid-content-version', 'Content version is invalid'));
      }
      return success(portfolioActions.projectStateUpdated(
        input.payload.projectId,
        input.payload.contentVersion,
      ));
    }
    case 'discovery.recorded': {
      const payload = parseDiscoveryEvent(input.payload);
      return payload.ok
        ? success(portfolioActions.discoveryRecorded(payload.value))
        : failure(...prefixIssues('payload', payload.issues));
    }
    case 'stimulation.changed': {
      if (!isRecord(input.payload)
        || typeof input.payload.normalizedValue !== 'number'
        || !Number.isFinite(input.payload.normalizedValue)
        || input.payload.normalizedValue < 0
        || input.payload.normalizedValue > 1) {
        return failure(issue('payload.normalizedValue', 'invalid-stimulation', 'Stimulation must be between 0 and 1'));
      }
      return success(portfolioActions.stimulationChanged(input.payload.normalizedValue));
    }
    case 'experience.failed': {
      if (!isRecord(input.payload)
        || typeof input.payload.experienceId !== 'string'
        || !isExperienceId(input.payload.experienceId)) {
        return failure(issue('payload.experienceId', 'invalid-experience-id', 'Experience ID is invalid'));
      }
      if (typeof input.payload.code !== 'string'
        || !SIMPLE_CODE.test(input.payload.code)
        || input.payload.code.length > 80) {
        return failure(issue('payload.code', 'invalid-failure-code', 'Failure code is invalid'));
      }
      return success(portfolioActions.experienceFailed(input.payload.experienceId, input.payload.code));
    }
  }
}

function parseSemanticIdList(
  input: unknown,
  path: string,
): ValidationResult<SemanticExperienceId[]> {
  if (!Array.isArray(input) || input.length > STATE_LIST_MAX_ITEMS) {
    return failure(issue(path, 'invalid-list', 'Semantic ID list is invalid'));
  }

  const values: SemanticExperienceId[] = [];
  for (const value of input) {
    if (typeof value !== 'string' || !isSemanticExperienceId(value)) {
      return failure(issue(path, 'invalid-semantic-id', 'Semantic ID list contains an invalid value'));
    }
    if (!values.includes(value)) values.push(value);
  }
  return success(values);
}

function parseDestinationIdList(
  input: unknown,
  path: string,
): ValidationResult<DestinationId[]> {
  if (!Array.isArray(input) || input.length > STATE_LIST_MAX_ITEMS) {
    return failure<DestinationId[]>(
      issue(path, 'invalid-list', 'Destination ID list is invalid'),
    );
  }

  const values: DestinationId[] = [];
  for (const value of input) {
    const parsed = parseDestinationRequest({ destinationId: value });
    if (!parsed.ok) return failure(...prefixIssues(path, parsed.issues));
    if (!values.includes(parsed.value.destinationId)) values.push(parsed.value.destinationId);
  }
  return success(values);
}

function parseCheckpoint(input: unknown): ValidationResult<ExperienceCheckpoint | undefined> {
  if (input === undefined) return success(undefined);
  if (!isRecord(input)) return failure(issue('lastCheckpoint', 'invalid-checkpoint', 'Checkpoint is invalid'));

  const destination = parseDestinationRequest({
    destinationId: input.destinationId,
    safeState: input.safeState,
  });
  if (!destination.ok) return failure(...prefixIssues('lastCheckpoint', destination.issues));
  if (typeof input.stage !== 'string' || !isDepthStage(input.stage)) {
    return failure(issue('lastCheckpoint.stage', 'invalid-depth-stage', 'Checkpoint stage is invalid'));
  }
  if (input.selectedPartId !== undefined
    && (typeof input.selectedPartId !== 'string'
      || !input.selectedPartId
      || input.selectedPartId.length > SHORT_ID_MAX_LENGTH)) {
    return failure(issue('lastCheckpoint.selectedPartId', 'invalid-selected-part', 'Checkpoint selected part is invalid'));
  }

  return success({
    destinationId: destination.value.destinationId,
    stage: input.stage,
    ...(input.selectedPartId === undefined ? {} : { selectedPartId: input.selectedPartId }),
    ...(destination.value.safeState === undefined ? {} : { safeState: destination.value.safeState }),
  });
}

function parseAlteredObjects(input: unknown): ValidationResult<Record<string, SafeState>> {
  if (!isRecord(input) || Object.keys(input).length > STATE_RECORD_MAX_KEYS) {
    return failure(issue('alteredObjects', 'invalid-record', 'Altered objects record is invalid'));
  }

  const output: Record<string, SafeState> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!isSemanticExperienceId(key)) {
      return failure(issue('alteredObjects', 'invalid-semantic-id', `Invalid altered object ID: ${key}`));
    }
    const parsed = parseSafeState(value, `alteredObjects.${key}`);
    if (!parsed.ok || parsed.value === undefined) {
      return parsed.ok
        ? failure(issue(`alteredObjects.${key}`, 'invalid-safe-state', 'Altered object state is invalid'))
        : parsed;
    }
    output[key] = parsed.value;
  }
  return success(output);
}

function parseContentVersions(input: unknown): ValidationResult<Record<string, ContentVersion>> {
  if (!isRecord(input) || Object.keys(input).length > STATE_RECORD_MAX_KEYS) {
    return failure(issue('seenContentVersions', 'invalid-record', 'Content-version record is invalid'));
  }

  const output: Record<string, ContentVersion> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!isNodeId(key) || typeof value !== 'string' || !isContentVersion(value)) {
      return failure(issue('seenContentVersions', 'invalid-content-version', `Invalid content version: ${key}`));
    }
    output[key] = value;
  }
  return success(output);
}

function parseDiscoverySlice(input: unknown): ValidationResult<PersistedDiscoverySlice> {
  if (!isRecord(input)) return failure(issue('', 'invalid-type', 'Discovery section must be an object'));
  if (typeof input.firstNoteCompleted !== 'boolean') {
    return failure(issue('firstNoteCompleted', 'invalid-boolean', 'First Note state is invalid'));
  }

  const discoveredIds = parseSemanticIdList(input.discoveredIds, 'discoveredIds');
  const handledIds = parseSemanticIdList(input.handledIds, 'handledIds');
  const enteredIds = parseSemanticIdList(input.enteredIds, 'enteredIds');
  const understoodIds = parseSemanticIdList(input.understoodIds, 'understoodIds');
  const alteredObjects = parseAlteredObjects(input.alteredObjects);
  const checkpoint = parseCheckpoint(input.lastCheckpoint);
  const contentVersions = parseContentVersions(input.seenContentVersions);
  const results = [
    discoveredIds,
    handledIds,
    enteredIds,
    understoodIds,
    alteredObjects,
    checkpoint,
    contentVersions,
  ];
  const failed = results.find(result => !result.ok);
  if (failed && !failed.ok) return failure(...failed.issues);

  return success({
    firstNoteCompleted: input.firstNoteCompleted,
    discoveredIds: discoveredIds.ok ? discoveredIds.value : [],
    handledIds: handledIds.ok ? handledIds.value : [],
    enteredIds: enteredIds.ok ? enteredIds.value : [],
    understoodIds: understoodIds.ok ? understoodIds.value : [],
    alteredObjects: alteredObjects.ok ? alteredObjects.value : {},
    ...(checkpoint.ok && checkpoint.value ? { lastCheckpoint: checkpoint.value } : {}),
    seenContentVersions: contentVersions.ok ? contentVersions.value : {},
  });
}

function parseTourSlice(input: unknown): ValidationResult<PersistedTourSlice> {
  if (!isRecord(input)) return failure(issue('', 'invalid-type', 'Tour section must be an object'));
  if (typeof input.enabled !== 'boolean') {
    return failure(issue('enabled', 'invalid-boolean', 'Tour enabled state is invalid'));
  }
  if (input.role !== undefined
    && (typeof input.role !== 'string' || !TOUR_ROLES.includes(input.role as TourRole))) {
    return failure(issue('role', 'invalid-tour-role', 'Tour role is invalid'));
  }

  const suggested = parseDestinationIdList(input.suggestedDestinationIds, 'suggestedDestinationIds');
  const visited = parseDestinationIdList(input.visitedSuggestedIds, 'visitedSuggestedIds');
  const dismissed = parseSemanticIdList(input.dismissedHintIds, 'dismissedHintIds');
  if (!suggested.ok) return suggested;
  if (!visited.ok) return visited;
  if (!dismissed.ok) return dismissed;

  return success({
    enabled: input.enabled,
    ...(input.role === undefined ? {} : { role: input.role as TourRole }),
    suggestedDestinationIds: suggested.value,
    visitedSuggestedIds: visited.value,
    dismissedHintIds: dismissed.value,
  });
}

function parseStimulationSlice(input: unknown): ValidationResult<PersistedStimulationSlice> {
  if (!isRecord(input)) return failure(issue('', 'invalid-type', 'Stimulation section must be an object'));
  if (typeof input.soundEnabled !== 'boolean'
    || typeof input.reducedMotionRequested !== 'boolean') {
    return failure(issue('', 'invalid-boolean', 'Stimulation preferences are invalid'));
  }
  if (typeof input.normalizedValue !== 'number'
    || !Number.isFinite(input.normalizedValue)
    || input.normalizedValue < 0
    || input.normalizedValue > 1) {
    return failure(issue('normalizedValue', 'invalid-stimulation', 'Stimulation must be between 0 and 1'));
  }

  return success({
    soundEnabled: input.soundEnabled,
    normalizedValue: input.normalizedValue,
    reducedMotionRequested: input.reducedMotionRequested,
  });
}

function assembleState(
  sourceVersion: 0 | 1,
  discovery: ValidationResult<PersistedDiscoverySlice>,
  tour: ValidationResult<PersistedTourSlice>,
  stimulation: ValidationResult<PersistedStimulationSlice>,
): PersistedExperienceStateResult {
  const sections = { discovery, tour, stimulation };
  const resetSections = (Object.entries(sections) as [PersistedStateSection, ValidationResult<unknown>][])
    .filter(([, result]) => !result.ok)
    .map(([section]) => section);
  const issues = (Object.entries(sections) as [PersistedStateSection, ValidationResult<unknown>][])
    .flatMap(([section, result]) => result.ok
      ? []
      : [
        ...prefixIssues(section, result.issues),
        issue(section, 'section-reset', `Invalid ${section} section was reset`),
      ]);

  return {
    status: sourceVersion === 0
      ? 'migrated'
      : resetSections.length > 0 ? 'partial-reset' : 'current',
    sourceVersion,
    resetSections,
    issues,
    value: {
      schemaVersion: EXPERIENCE_STATE_SCHEMA_VERSION,
      discovery: discovery.ok ? discovery.value : defaultDiscovery(),
      tour: tour.ok ? tour.value : defaultTour(),
      stimulation: stimulation.ok ? stimulation.value : defaultStimulation(),
    },
  };
}

function parseVersionZero(input: Record<string, unknown>): PersistedExperienceStateResult {
  const discoveryInput: Record<string, unknown> = {
    firstNoteCompleted: input.firstNoteCompleted ?? false,
    discoveredIds: input.discoveredIds ?? [],
    handledIds: input.handledIds ?? [],
    enteredIds: input.enteredIds ?? [],
    understoodIds: input.understoodIds ?? [],
    alteredObjects: input.alteredObjects ?? {},
    seenContentVersions: input.seenContentVersions ?? {},
    ...(input.lastCheckpoint === undefined ? {} : { lastCheckpoint: input.lastCheckpoint }),
  };
  const tourInput = input.tour ?? defaultTour();
  const stimulationInput = input.stimulation === undefined
    ? defaultStimulation()
    : isRecord(input.stimulation)
      ? {
        soundEnabled: input.stimulation.soundEnabled ?? false,
        normalizedValue: input.stimulation.stimulation ?? 0,
        reducedMotionRequested: input.stimulation.reducedMotionRequested ?? false,
      }
      : input.stimulation;

  return assembleState(
    0,
    parseDiscoverySlice(discoveryInput),
    parseTourSlice(tourInput),
    parseStimulationSlice(stimulationInput),
  );
}

export function parsePersistedExperienceState(input: unknown): PersistedExperienceStateResult {
  if (!isRecord(input)) {
    return {
      status: 'rejected',
      value: createDefaultState(),
      resetSections: [],
      issues: [issue('', 'invalid-root', 'Persisted state must be an object')],
    };
  }

  if (input.schemaVersion === 0) return parseVersionZero(input);
  if (input.schemaVersion !== EXPERIENCE_STATE_SCHEMA_VERSION) {
    return {
      status: 'rejected',
      sourceVersion: typeof input.schemaVersion === 'number' ? input.schemaVersion : undefined,
      value: createDefaultState(),
      resetSections: [],
      issues: [issue('schemaVersion', 'unknown-schema-version', 'Schema version is unsupported')],
    };
  }

  return assembleState(
    1,
    parseDiscoverySlice(input.discovery),
    parseTourSlice(input.tour),
    parseStimulationSlice(input.stimulation),
  );
}
