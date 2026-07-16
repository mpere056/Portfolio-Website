import { describe, expect, it } from 'vitest';
import { PROJECT_LIFECYCLES, validateProjectState } from '@/lib/content/lifecycle';

const sectionFixtures = {
  evolving: {
    stableFoundation: 'Working product foundation.',
    currentQuestion: 'What should be tested next?',
    latestMeaningfulChange: 'Reliability improved.',
    nextExperiment: 'Test a smaller workflow.',
  },
  maintained: {
    stableRole: 'A stable utility.',
    latestMeaningfulMaintenanceChange: 'Deployment was repaired.',
  },
  complete: {
    finalOutcome: 'The intended result shipped.',
    finalMeaningfulState: 'The project is complete.',
    mainLesson: 'Keep the interaction direct.',
    laterWorkInfluenced: 'It informed a later system.',
  },
  archived: {
    archiveReason: 'The platform changed.',
    historicalImportance: 'It was an early implementation.',
    lastVerifiedState: 'Preserved as source and screenshots.',
  },
} as const;

describe('project lifecycle schema', () => {
  it('accepts every lifecycle only with its required authored sections', () => {
    for (const lifecycle of PROJECT_LIFECYCLES) {
      expect(validateProjectState({
        projectId: 'project:example',
        lifecycle,
        contentVersion: '1-0-0:example',
        updatedAt: '2026-07-16',
        sections: sectionFixtures[lifecycle],
      })).toEqual([]);
    }
  });

  it('rejects missing sections, invalid versions, and evolving-only claims on historical states', () => {
    expect(validateProjectState({
      projectId: 'project:example',
      lifecycle: 'complete',
      contentVersion: 'latest',
      updatedAt: 'not-a-date',
      sections: { currentQuestion: 'This should not be current.' },
    })).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'invalid-content-version' }),
      expect.objectContaining({ code: 'invalid-date' }),
      expect.objectContaining({ code: 'missing-lifecycle-section' }),
      expect.objectContaining({ code: 'section-not-allowed', path: 'sections.currentQuestion' }),
    ]));
  });
});
