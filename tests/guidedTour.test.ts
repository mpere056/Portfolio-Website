import { describe, expect, it } from 'vitest';
import {
  dismissTourHint,
  getActiveTourRecommendations,
  recordTourVisit,
  resetTour,
  setTourEnabled,
  startTour,
  TOUR_PROFILES,
  validateTourProfiles,
} from '../src/lib/experience/tour';

describe('non-linear guided tour', () => {
  it('keeps every authored role bounded, canonical, and free of hidden discoveries', () => {
    expect(validateTourProfiles()).toEqual([]);
    for (const profile of Object.values(TOUR_PROFILES)) {
      expect(profile.recommendations).toHaveLength(3);
      expect(profile.recommendations.every(item => !item.hintId.startsWith('discovery:'))).toBe(true);
    }
  });

  it('starts with authored recommendations and records visits in any order', () => {
    let tour = startTour(resetTour(), 'recruiter');
    const [first, second, third] = tour.suggestedDestinationIds;
    tour = recordTourVisit(tour, third);
    tour = recordTourVisit(tour, first);
    tour = recordTourVisit(tour, third);
    expect(tour.visitedSuggestedIds).toEqual([third, first]);
    expect(tour.visitedSuggestedIds).not.toContain(second);
    expect(getActiveTourRecommendations(tour)).toHaveLength(3);
  });

  it('dismisses and resumes without losing role, visits, or recommendations', () => {
    let tour = startTour(resetTour(), 'builder');
    tour = recordTourVisit(tour, tour.suggestedDestinationIds[1]);
    tour = dismissTourHint(tour, 'home:tour-sudoku-post');
    tour = setTourEnabled(tour, false);
    expect(tour.enabled).toBe(false);
    expect(tour.role).toBe('builder');
    expect(setTourEnabled(tour, true)).toEqual({ ...tour, enabled: true });
  });

  it('ignores destinations outside the authored profile and resets only tour state', () => {
    const tour = startTour(resetTour(), 'explorer');
    expect(recordTourVisit(tour, 'destination:studio')).toBe(tour);
    expect(resetTour()).toEqual({
      enabled: false,
      suggestedDestinationIds: [],
      visitedSuggestedIds: [],
      dismissedHintIds: [],
    });
  });
});
