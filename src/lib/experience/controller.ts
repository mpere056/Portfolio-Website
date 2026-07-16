import type { StoreApi } from 'zustand/vanilla';
import type { PortfolioAIContextState } from '../ai/context';
import type { PortfolioAction } from '../portfolioActions';
import {
  isSemanticExperienceId,
  type DepthStage,
  type DepthState,
  type ExperienceCheckpoint,
  type SemanticExperienceId,
} from '../portfolioContracts';
import type { ExplorationStoreState } from './store';
import {
  getExpectedDepthReason,
  getNextDepthStage,
  getPreviousDepthStage,
  transitionDepth,
  type AcceptedDepthTransition,
  type DepthTransitionContext,
  type DepthTransitionReason,
  type DepthTransitionRequest,
  type RejectedDepthTransition,
} from './depth';

export interface DepthControllerSnapshot {
  state: DepthState;
  nextStage?: DepthStage;
  expectedReason?: DepthTransitionReason;
  disposed: boolean;
}

export interface DepthControllerOptions {
  initialState: DepthState;
  context: DepthTransitionContext;
  semanticId: SemanticExperienceId;
  sourceId: string;
  explorationStore: StoreApi<ExplorationStoreState>;
  aiContextStore: StoreApi<PortfolioAIContextState>;
  onAction?: (action: PortfolioAction) => void;
}

export interface ControllerRejectedTransition extends Omit<RejectedDepthTransition, 'code'> {
  code: RejectedDepthTransition['code'] | 'checkpoint-rejected' | 'controller-disposed';
}

export type ControllerTransition = AcceptedDepthTransition | ControllerRejectedTransition;

export interface DepthController {
  getSnapshot(): DepthControllerSnapshot;
  subscribe(listener: () => void): () => void;
  transition(request: DepthTransitionRequest): ControllerTransition;
  retreat(): ControllerTransition;
  reset(): ControllerTransition;
  restore(checkpoint: ExperienceCheckpoint): ControllerTransition;
  dispose(): void;
}

function snapshot(state: DepthState, disposed: boolean): DepthControllerSnapshot {
  return {
    state,
    ...(disposed ? {} : { nextStage: getNextDepthStage(state.stage) }),
    ...(disposed ? {} : { expectedReason: getExpectedDepthReason(state.stage) }),
    disposed,
  };
}

function rejected(
  previous: DepthState,
  stage: DepthStage,
  reason: DepthTransitionReason,
  code: ControllerRejectedTransition['code'],
): ControllerRejectedTransition {
  return {
    accepted: false,
    previous,
    attemptedStage: stage,
    reason,
    code,
  };
}

export function createDepthController(options: DepthControllerOptions): DepthController {
  if (options.initialState.destinationId !== options.context.destinationId) {
    throw new TypeError('Depth controller destination is inconsistent');
  }
  if (!isSemanticExperienceId(options.semanticId)) {
    throw new TypeError('Depth controller semantic ID is invalid');
  }

  let currentState = options.initialState;
  let currentSnapshot = snapshot(currentState, false);
  let disposed = false;
  const listeners = new Set<() => void>();

  options.aiContextStore.getState().pushContext(options.sourceId, {
    route: options.context.route,
    destinationId: options.context.destinationId,
    depthStage: currentState.stage,
    ...(options.context.nodeId ? { nodeId: options.context.nodeId } : {}),
    ...(options.context.experienceId ? { experienceId: options.context.experienceId } : {}),
  });

  function apply(request: DepthTransitionRequest): ControllerTransition {
    if (disposed) {
      return rejected(currentState, request.stage, request.reason, 'controller-disposed');
    }
    const result = transitionDepth(currentState, request, options.context);
    if (!result.accepted) return result;
    if (!options.explorationStore.getState().applyDepthTransition(
      options.semanticId,
      result.checkpoint,
    )) {
      return rejected(currentState, request.stage, request.reason, 'checkpoint-rejected');
    }

    currentState = result.next;
    currentSnapshot = snapshot(currentState, false);
    options.aiContextStore.getState().pushContext(options.sourceId, result.aiContext);
    options.onAction?.(result.action);
    listeners.forEach(listener => listener());
    return result;
  }

  return {
    getSnapshot() {
      return currentSnapshot;
    },

    subscribe(listener) {
      if (disposed) return () => {};
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    transition: apply,

    retreat() {
      const previousStage = getPreviousDepthStage(currentState.stage);
      return apply({
        stage: previousStage ?? currentState.stage,
        reason: 'retreat',
      });
    },

    reset() {
      return apply({ stage: 'signal', reason: 'reset' });
    },

    restore(checkpoint) {
      if (checkpoint.destinationId !== options.context.destinationId) {
        return rejected(currentState, checkpoint.stage, 'restore', 'destination-mismatch');
      }
      return apply({
        stage: checkpoint.stage,
        reason: 'restore',
        ...(checkpoint.selectedPartId ? { selectedPartId: checkpoint.selectedPartId } : {}),
        ...(checkpoint.safeState ? { safeState: checkpoint.safeState } : {}),
      });
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.clear();
      options.aiContextStore.getState().popContext(options.sourceId);
      currentSnapshot = snapshot(currentState, true);
    },
  };
}
