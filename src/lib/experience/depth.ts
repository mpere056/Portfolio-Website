import { portfolioActions, type DepthChangedAction } from '../portfolioActions';
import {
  DEPTH_STAGES,
  type DepthStage,
  type DepthState,
  type ExperienceCheckpoint,
  type PortfolioAIContext,
} from '../portfolioContracts';

export const DEPTH_TRANSITION_REASONS = [
  'proximity',
  'interaction',
  'enter',
  'evidence',
  'retreat',
  'restore',
  'reset',
] as const;

export type DepthTransitionReason = (typeof DEPTH_TRANSITION_REASONS)[number];

export interface DepthTransitionContext {
  route: string;
  destinationId: DepthState['destinationId'];
  nodeId?: PortfolioAIContext['nodeId'];
  experienceId?: PortfolioAIContext['experienceId'];
}

export interface DepthTransitionRequest {
  stage: DepthStage;
  reason: DepthTransitionReason;
  selectedPartId?: string;
  safeState?: DepthState['safeState'];
}

export interface AcceptedDepthTransition {
  accepted: true;
  previous: DepthState;
  next: DepthState;
  reason: DepthTransitionReason;
  action: DepthChangedAction;
  checkpoint: ExperienceCheckpoint;
  aiContext: PortfolioAIContext;
}

export interface RejectedDepthTransition {
  accepted: false;
  previous: DepthState;
  attemptedStage: DepthStage;
  reason: DepthTransitionReason;
  code: 'destination-mismatch' | 'transition-not-allowed';
}

export type DepthTransition = AcceptedDepthTransition | RejectedDepthTransition;

const FORWARD_REASON: Readonly<Partial<Record<DepthStage, DepthTransitionReason>>> = {
  approach: 'proximity',
  handle: 'interaction',
  enter: 'enter',
  understand: 'evidence',
};

function stageIndex(stage: DepthStage) {
  return DEPTH_STAGES.indexOf(stage);
}

export function getNextDepthStage(stage: DepthStage): DepthStage | undefined {
  return DEPTH_STAGES[stageIndex(stage) + 1];
}

export function getPreviousDepthStage(stage: DepthStage): DepthStage | undefined {
  return DEPTH_STAGES[stageIndex(stage) - 1];
}

export function getExpectedDepthReason(stage: DepthStage) {
  const nextStage = getNextDepthStage(stage);
  return nextStage ? FORWARD_REASON[nextStage] : undefined;
}

function isAllowedTransition(
  currentStage: DepthStage,
  requestedStage: DepthStage,
  reason: DepthTransitionReason,
) {
  if (reason === 'restore') return true;
  if (reason === 'reset') return requestedStage === 'signal';
  if (reason === 'retreat') return getPreviousDepthStage(currentStage) === requestedStage;
  return getNextDepthStage(currentStage) === requestedStage
    && FORWARD_REASON[requestedStage] === reason;
}

export function transitionDepth(
  current: DepthState,
  request: DepthTransitionRequest,
  context: DepthTransitionContext,
): DepthTransition {
  if (current.destinationId !== context.destinationId) {
    return {
      accepted: false,
      previous: current,
      attemptedStage: request.stage,
      reason: request.reason,
      code: 'destination-mismatch',
    };
  }
  if (!isAllowedTransition(current.stage, request.stage, request.reason)) {
    return {
      accepted: false,
      previous: current,
      attemptedStage: request.stage,
      reason: request.reason,
      code: 'transition-not-allowed',
    };
  }

  const next: DepthState = {
    destinationId: context.destinationId,
    stage: request.stage,
    ...(request.selectedPartId ? { selectedPartId: request.selectedPartId } : {}),
    ...(request.safeState ? { safeState: request.safeState } : {}),
  };
  return {
    accepted: true,
    previous: current,
    next,
    reason: request.reason,
    action: portfolioActions.depthChanged(next),
    checkpoint: {
      destinationId: next.destinationId,
      stage: next.stage,
      ...(next.selectedPartId ? { selectedPartId: next.selectedPartId } : {}),
      ...(next.safeState ? { safeState: next.safeState } : {}),
    },
    aiContext: {
      route: context.route,
      destinationId: context.destinationId,
      depthStage: next.stage,
      ...(context.nodeId ? { nodeId: context.nodeId } : {}),
      ...(context.experienceId ? { experienceId: context.experienceId } : {}),
    },
  };
}
