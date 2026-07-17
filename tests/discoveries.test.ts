import { describe, expect, it } from 'vitest';
import { loadKnowledgeGraph } from '@/lib/content/graph';
import {
  DISCOVERY_KINDS,
  MEANINGFUL_DISCOVERIES,
  PERSONAL_ARTIFACT_ID,
  RELATIONAL_CONNECTION_ID,
  RELATIONSHIP_INSTRUMENT_ID,
  TECHNICAL_LESSON_ID,
  getAvailableMeaningfulDiscoveries,
  getDiscoveryAvailability,
  validateDiscoveryKnowledgeNodes,
  validateMeaningfulDiscoveryRegistry,
} from '@/lib/experience/discoveries';
import { TOUR_PROFILES } from '@/lib/experience/tour';
import { DEFAULT_PERSISTED_EXPERIENCE_STATE } from '@/lib/portfolioValidation';
import type { PersistedDiscoverySlice } from '@/lib/portfolioContracts';

describe('meaningful discovery registry', () => {
  it('contains exactly one reviewed, public, non-tour discovery of each kind', async () => {
    expect(validateMeaningfulDiscoveryRegistry()).toBe(true);
    expect(MEANINGFUL_DISCOVERIES.map(item => item.kind).sort()).toEqual([...DISCOVERY_KINDS].sort());
    expect(MEANINGFUL_DISCOVERIES.every(item => item.tourEligible === false)).toBe(true);
    expect(validateDiscoveryKnowledgeNodes(await loadKnowledgeGraph())).toBe(true);
    const serializedTour = JSON.stringify(TOUR_PROFILES);
    MEANINGFUL_DISCOVERIES.forEach(item => expect(serializedTour).not.toContain(item.id));
  });

  it('exposes the personal artifact only on About without marking it discovered', () => {
    const discovery = DEFAULT_PERSISTED_EXPERIENCE_STATE.discovery;
    const personal = MEANINGFUL_DISCOVERIES.find(item => item.id === PERSONAL_ARTIFACT_ID)!;
    expect(getDiscoveryAvailability(personal, discovery, '/')).toBe('concealed');
    expect(getDiscoveryAvailability(personal, discovery, '/about')).toBe('available');
    expect(discovery.discoveredIds).toEqual([]);
  });

  it('requires understood environmental evidence before exposing the technical residue', () => {
    const technical = MEANINGFUL_DISCOVERIES.find(item => item.id === TECHNICAL_LESSON_ID)!;
    const discovery = DEFAULT_PERSISTED_EXPERIENCE_STATE.discovery;
    expect(getDiscoveryAvailability(technical, discovery, '/projects')).toBe('concealed');
    expect(getDiscoveryAvailability(technical, {
      ...discovery,
      understoodIds: [RELATIONSHIP_INSTRUMENT_ID],
    }, '/projects')).toBe('available');
  });

  it('requires both prior discoveries before exposing the cross-domain insight on Home', () => {
    const relational = MEANINGFUL_DISCOVERIES.find(item => item.id === RELATIONAL_CONNECTION_ID)!;
    const discovery = DEFAULT_PERSISTED_EXPERIENCE_STATE.discovery;
    expect(getDiscoveryAvailability(relational, {
      ...discovery,
      discoveredIds: [PERSONAL_ARTIFACT_ID],
    }, '/')).toBe('concealed');
    const completePrerequisites: PersistedDiscoverySlice = {
      ...discovery,
      discoveredIds: [PERSONAL_ARTIFACT_ID, TECHNICAL_LESSON_ID],
    };
    expect(getDiscoveryAvailability(relational, completePrerequisites, '/')).toBe('available');
    expect(getAvailableMeaningfulDiscoveries(completePrerequisites, '/').map(item => item.id))
      .toEqual([RELATIONAL_CONNECTION_ID]);
  });

  it('rejects duplicate kinds and non-canonical reveal links', () => {
    const duplicateKind = MEANINGFUL_DISCOVERIES.map((item, index) => (
      index === 1 ? { ...item, kind: 'personal-artifact' as const } : item
    ));
    expect(validateMeaningfulDiscoveryRegistry(duplicateKind)).toBe(false);
    const malformedLink = MEANINGFUL_DISCOVERIES.map((item, index) => (
      index === 1
        ? { ...item, reveal: { ...item.reveal, links: [{ label: 'Unsafe', destinationId: 'destination:unknown' as const }] } }
        : item
    ));
    expect(validateMeaningfulDiscoveryRegistry(malformedLink)).toBe(false);
  });
});
