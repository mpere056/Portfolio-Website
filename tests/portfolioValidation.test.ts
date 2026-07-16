import { describe, expect, it } from 'vitest';
import { portfolioActions, type PortfolioAction } from '@/lib/portfolioActions';
import type { DiscoveryEvent } from '@/lib/portfolioContracts';
import {
  DEFAULT_PERSISTED_EXPERIENCE_STATE,
  parseDestinationRequest,
  parsePersistedExperienceState,
  parsePortfolioAction,
} from '@/lib/portfolioValidation';

const discovery = {
  id: 'dreamlife-understood-1',
  type: 'understood',
  discoveryId: 'discovery:dreamlife-understood',
  destinationId: 'destination:project-dreamlife',
  occurredAt: '2026-07-16T00:00:00.000Z',
  contentVersion: '1-0-0:dreamlife',
} as const satisfies DiscoveryEvent;

describe('portfolio runtime validation', () => {
  it('accepts canonical output from every approved action creator', () => {
    const actions: PortfolioAction[] = [
      portfolioActions.depthChanged({
        destinationId: 'destination:about',
        stage: 'handle',
        selectedPartId: 'discord-server-growth',
        safeState: { event: 'discord-server-growth' },
      }),
      portfolioActions.destinationRequested('destination:about', {
        event: 'discord-server-growth',
      }),
      portfolioActions.relationshipSelected('relationship:about-growth-to-ai-systems'),
      portfolioActions.projectStateUpdated('project:dreamlife', '1-0-0:dreamlife'),
      portfolioActions.discoveryRecorded(discovery),
      portfolioActions.stimulationChanged(0.35),
      portfolioActions.experienceFailed('experience:dreamlife-future-paths', 'asset-load-failed'),
    ];

    for (const action of actions) {
      expect(parsePortfolioAction(action)).toEqual({ ok: true, value: action, issues: [] });
    }
  });

  it('rejects malformed or unavailable destination requests with structured issues', () => {
    expect(parseDestinationRequest({
      destinationId: 'destination:about',
      safeState: { event: 'discord-server-growth' },
      href: 'https://example.com/unsafe',
    })).toEqual({
      ok: true,
      value: {
        destinationId: 'destination:about',
        safeState: { event: 'discord-server-growth' },
      },
      issues: [],
    });

    expect(parseDestinationRequest({
      destinationId: 'destination:archive',
    })).toMatchObject({
      ok: false,
      issues: [{ path: 'destinationId', code: 'unavailable-destination' }],
    });
    expect(parseDestinationRequest({
      destinationId: 'destination:about',
      safeState: { project: 'dreamlife' },
    })).toMatchObject({
      ok: false,
      issues: [{ path: 'safeState', code: 'unsupported-safe-state' }],
    });
  });

  it('rejects malformed action discriminants and payload invariants', () => {
    const invalidActions = [
      { type: 'unknown.event', payload: {} },
      { type: 'relationship.selected', payload: { relationshipId: 'raw-string' } },
      { type: 'project_state.updated', payload: { projectId: 'timeline:dreamlife', contentVersion: 'latest' } },
      { type: 'discovery.recorded', payload: { ...discovery, occurredAt: 'yesterday' } },
      { type: 'stimulation.changed', payload: { normalizedValue: 2 } },
      { type: 'experience.failed', payload: { experienceId: 'experience:demo', code: 'Not Valid' } },
    ];

    for (const action of invalidActions) {
      expect(parsePortfolioAction(action).ok).toBe(false);
    }
  });

  it('accepts current semantic state and ignores unknown fields', () => {
    const result = parsePersistedExperienceState({
      schemaVersion: 1,
      unknownRoot: 'ignored',
      discovery: {
        firstNoteCompleted: true,
        discoveredIds: ['home:first-note', 'project:dreamlife'],
        handledIds: ['destination:about'],
        enteredIds: [],
        understoodIds: ['discovery:dreamlife-understood'],
        alteredObjects: {
          'experience:dreamlife-future-paths': { scenario: 'wild-card', expanded: true },
        },
        lastCheckpoint: {
          destinationId: 'destination:about',
          stage: 'handle',
          selectedPartId: 'discord-server-growth',
          safeState: { event: 'discord-server-growth' },
          cameraMatrix: [1, 0, 0],
        },
        seenContentVersions: { 'project:dreamlife': '1-0-0:dreamlife' },
        privateHistory: ['ignored'],
      },
      tour: {
        enabled: true,
        role: 'recruiter',
        suggestedDestinationIds: ['destination:about'],
        visitedSuggestedIds: [],
        dismissedHintIds: ['home:first-note'],
      },
      stimulation: {
        soundEnabled: false,
        normalizedValue: 0.3,
        reducedMotionRequested: true,
      },
    });

    expect(result).toMatchObject({
      status: 'current',
      sourceVersion: 1,
      resetSections: [],
      issues: [],
    });
    expect(result.value.discovery.lastCheckpoint).toEqual({
      destinationId: 'destination:about',
      stage: 'handle',
      selectedPartId: 'discord-server-growth',
      safeState: { event: 'discord-server-growth' },
    });
    expect(result.value).not.toHaveProperty('unknownRoot');
  });

  it('resets only a corrupt section while preserving valid siblings', () => {
    const result = parsePersistedExperienceState({
      schemaVersion: 1,
      discovery: {
        ...DEFAULT_PERSISTED_EXPERIENCE_STATE.discovery,
        firstNoteCompleted: true,
        discoveredIds: ['home:first-note'],
      },
      tour: {
        enabled: true,
        role: 'administrator',
        suggestedDestinationIds: [],
        visitedSuggestedIds: [],
        dismissedHintIds: [],
      },
      stimulation: {
        soundEnabled: true,
        normalizedValue: 0.25,
        reducedMotionRequested: false,
      },
    });

    expect(result.status).toBe('partial-reset');
    expect(result.resetSections).toEqual(['tour']);
    expect(result.value.discovery.firstNoteCompleted).toBe(true);
    expect(result.value.tour).toEqual(DEFAULT_PERSISTED_EXPERIENCE_STATE.tour);
    expect(result.value.stimulation.normalizedValue).toBe(0.25);
  });

  it('migrates the flat version-zero draft into version-one slices', () => {
    const result = parsePersistedExperienceState({
      schemaVersion: 0,
      firstNoteCompleted: true,
      discoveredIds: ['home:first-note'],
      handledIds: ['destination:projects'],
      enteredIds: [],
      understoodIds: [],
      alteredObjects: {},
      lastCheckpoint: {
        destinationId: 'destination:projects',
        stage: 'approach',
      },
      seenContentVersions: { 'project:dreamlife': '1-0-0:dreamlife' },
      tour: {
        enabled: false,
        suggestedDestinationIds: [],
        visitedSuggestedIds: [],
        dismissedHintIds: [],
      },
      stimulation: {
        soundEnabled: true,
        stimulation: 0.5,
        reducedMotionRequested: false,
      },
    });

    expect(result).toMatchObject({
      status: 'migrated',
      sourceVersion: 0,
      resetSections: [],
      issues: [],
      value: {
        schemaVersion: 1,
        discovery: {
          firstNoteCompleted: true,
          discoveredIds: ['home:first-note'],
        },
        stimulation: { normalizedValue: 0.5 },
      },
    });
  });

  it('reports and isolates a malformed legacy section during migration', () => {
    const result = parsePersistedExperienceState({
      schemaVersion: 0,
      firstNoteCompleted: true,
      discoveredIds: ['home:first-note'],
      stimulation: 'corrupt',
    });

    expect(result.status).toBe('migrated');
    expect(result.resetSections).toEqual(['stimulation']);
    expect(result.value.discovery.firstNoteCompleted).toBe(true);
    expect(result.value.stimulation).toEqual(DEFAULT_PERSISTED_EXPERIENCE_STATE.stimulation);
    expect(result.issues).toContainEqual(expect.objectContaining({
      path: 'stimulation',
      code: 'section-reset',
    }));
  });

  it('rejects malformed roots and unknown versions to clean defaults', () => {
    for (const input of [null, [], { schemaVersion: 99 }]) {
      const result = parsePersistedExperienceState(input);
      expect(result.status).toBe('rejected');
      expect(result.value).toEqual(DEFAULT_PERSISTED_EXPERIENCE_STATE);
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });
});
