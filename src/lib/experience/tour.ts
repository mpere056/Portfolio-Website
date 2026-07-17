import { getDestinationDefinition } from '../destinations';
import {
  TOUR_ROLES,
  type DestinationId,
  type PersistedTourSlice,
  type SemanticExperienceId,
  type TourRole,
} from '../portfolioContracts';

export interface TourRecommendation {
  destinationId: DestinationId;
  title: string;
  reason: string;
  hintId: SemanticExperienceId;
}

export interface TourProfile {
  role: TourRole;
  label: string;
  description: string;
  recommendations: readonly TourRecommendation[];
}

export const TOUR_PROFILES: Readonly<Record<TourRole, TourProfile>> = {
  recruiter: {
    role: 'recruiter',
    label: 'Recruiting',
    description: 'See product judgment, AI work, and full-stack evidence.',
    recommendations: [
      { destinationId: 'destination:museum-project-dreamlife', title: 'Dreamlife', reason: 'AI product design and mobile product strategy.', hintId: 'home:tour-dreamlife' },
      { destinationId: 'destination:museum-project-lifeinbox', title: 'LifeInbox', reason: 'Local-first systems and workflow automation.', hintId: 'home:tour-lifeinbox' },
      { destinationId: 'destination:museum-project-sudokutogether', title: 'Sudoku Together', reason: 'A playable Discord and full-stack product.', hintId: 'home:tour-sudoku' },
    ],
  },
  client: {
    role: 'client',
    label: 'Exploring a collaboration',
    description: 'Explore product directions and the thinking behind them.',
    recommendations: [
      { destinationId: 'destination:projects', title: 'Project museum', reason: 'Start with the range of products and systems.', hintId: 'home:tour-projects' },
      { destinationId: 'destination:museum-project-dreamlife', title: 'Dreamlife', reason: 'See how AI can support a thoughtful product loop.', hintId: 'home:tour-dreamlife' },
      { destinationId: 'destination:museum-project-lifeinbox', title: 'LifeInbox', reason: 'See automation grounded in a dependable workflow.', hintId: 'home:tour-lifeinbox' },
    ],
  },
  builder: {
    role: 'builder',
    label: 'Building something',
    description: 'Follow architecture decisions, constraints, and implementation.',
    recommendations: [
      { destinationId: 'destination:post-lifeinbox-local-first-capture-needs-trust', title: 'Local-first trust', reason: 'A focused architecture and product lesson.', hintId: 'home:tour-lifeinbox-post' },
      { destinationId: 'destination:post-sudokutogether-why-discord-sudoku-needed-a-proxy', title: 'Discord proxy', reason: 'A platform constraint turned into architecture.', hintId: 'home:tour-sudoku-post' },
      { destinationId: 'destination:post-dreamlife-building-a-life-design-loop', title: 'Life-design loop', reason: 'Product reasoning around an AI-supported loop.', hintId: 'home:tour-dreamlife-post' },
    ],
  },
  explorer: {
    role: 'explorer',
    label: 'Just exploring',
    description: 'Choose whichever doorway feels interesting first.',
    recommendations: [
      { destinationId: 'destination:about', title: 'A life in chapters', reason: 'Move through the moments behind the work.', hintId: 'home:tour-about' },
      { destinationId: 'destination:projects', title: 'Project museum', reason: 'Approach the products from the outside in.', hintId: 'home:tour-projects' },
      { destinationId: 'destination:museum-project-dreamlife', title: 'Dreamlife', reason: 'Enter through an unusual AI life-design project.', hintId: 'home:tour-dreamlife' },
    ],
  },
};

function unique<T>(values: readonly T[]) {
  return [...new Set(values)];
}

export function validateTourProfiles() {
  const issues: string[] = [];
  for (const role of TOUR_ROLES) {
    const profile = TOUR_PROFILES[role];
    if (profile.recommendations.length < 2 || profile.recommendations.length > 4) {
      issues.push(`${role} must contain two to four recommendations`);
    }
    for (const recommendation of profile.recommendations) {
      const destination = getDestinationDefinition(recommendation.destinationId);
      if (!destination || destination.status !== 'canonical') {
        issues.push(`${role} references unavailable destination ${recommendation.destinationId}`);
      }
      if (!recommendation.title.trim() || !recommendation.reason.trim()) {
        issues.push(`${role} has empty recommendation copy`);
      }
      if (recommendation.hintId.startsWith('discovery:')) {
        issues.push(`${role} exposes a hidden discovery hint`);
      }
    }
  }
  return issues;
}

export function startTour(_current: PersistedTourSlice, role: TourRole): PersistedTourSlice {
  const profile = TOUR_PROFILES[role];
  return {
    enabled: true,
    role,
    suggestedDestinationIds: profile.recommendations.map(item => item.destinationId),
    visitedSuggestedIds: [],
    dismissedHintIds: [],
  };
}

export function setTourEnabled(current: PersistedTourSlice, enabled: boolean): PersistedTourSlice {
  return { ...current, enabled: Boolean(current.role) && enabled };
}

export function recordTourVisit(
  current: PersistedTourSlice,
  destinationId: DestinationId,
): PersistedTourSlice {
  if (!current.suggestedDestinationIds.includes(destinationId)) return current;
  return {
    ...current,
    visitedSuggestedIds: unique([...current.visitedSuggestedIds, destinationId]),
  };
}

export function dismissTourHint(
  current: PersistedTourSlice,
  hintId: SemanticExperienceId,
): PersistedTourSlice {
  return { ...current, dismissedHintIds: unique([...current.dismissedHintIds, hintId]) };
}

export function resetTour(): PersistedTourSlice {
  return {
    enabled: false,
    suggestedDestinationIds: [],
    visitedSuggestedIds: [],
    dismissedHintIds: [],
  };
}

export function getActiveTourRecommendations(tour: PersistedTourSlice) {
  if (!tour.role) return [];
  const allowed = new Set(tour.suggestedDestinationIds);
  return TOUR_PROFILES[tour.role].recommendations.filter(item => allowed.has(item.destinationId));
}
