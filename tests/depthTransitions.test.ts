import { describe, expect, it } from 'vitest';
import {
  DEPTH_STAGES,
  type DepthState,
} from '@/lib/portfolioContracts';
import {
  getExpectedDepthReason,
  getNextDepthStage,
  getPreviousDepthStage,
  transitionDepth,
  type DepthTransitionContext,
} from '@/lib/experience/depth';

const context: DepthTransitionContext = {
  route: '/projects',
  destinationId: 'destination:museum-project-dreamlife',
  nodeId: 'project:dreamlife',
  experienceId: 'experience:dreamlife',
};

function state(stage: DepthState['stage']): DepthState {
  return { destinationId: context.destinationId, stage };
}

describe('five-stage depth transition foundation', () => {
  it('keeps stage order and forward interaction reasons explicit', () => {
    expect(DEPTH_STAGES).toEqual(['signal', 'approach', 'handle', 'enter', 'understand']);
    expect(getNextDepthStage('signal')).toBe('approach');
    expect(getPreviousDepthStage('understand')).toBe('enter');
    expect(getExpectedDepthReason('signal')).toBe('proximity');
    expect(getExpectedDepthReason('handle')).toBe('enter');
    expect(getExpectedDepthReason('understand')).toBeUndefined();
  });

  it('advances only through the matching adjacent interaction grammar', () => {
    const reasons = ['proximity', 'interaction', 'enter', 'evidence'] as const;
    let current = state('signal');

    reasons.forEach((reason, index) => {
      const result = transitionDepth(current, {
        stage: DEPTH_STAGES[index + 1],
        reason,
      }, context);
      expect(result.accepted).toBe(true);
      if (result.accepted) current = result.next;
    });

    expect(current.stage).toBe('understand');
  });

  it('emits one action, checkpoint, and AI context from an accepted transition', () => {
    const result = transitionDepth(state('approach'), {
      stage: 'handle',
      reason: 'interaction',
      selectedPartId: 'vision-loop',
    }, context);

    expect(result).toMatchObject({
      accepted: true,
      reason: 'interaction',
      action: {
        type: 'depth.changed',
        payload: {
          destinationId: 'destination:museum-project-dreamlife',
          stage: 'handle',
          selectedPartId: 'vision-loop',
        },
      },
      checkpoint: {
        destinationId: 'destination:museum-project-dreamlife',
        stage: 'handle',
        selectedPartId: 'vision-loop',
      },
      aiContext: {
        route: '/projects',
        destinationId: 'destination:museum-project-dreamlife',
        nodeId: 'project:dreamlife',
        experienceId: 'experience:dreamlife',
        depthStage: 'handle',
      },
    });
  });

  it('rejects skips, wrong reasons, and destination mismatches without side effects', () => {
    expect(transitionDepth(state('signal'), {
      stage: 'handle',
      reason: 'interaction',
    }, context)).toMatchObject({ accepted: false, code: 'transition-not-allowed' });
    expect(transitionDepth(state('approach'), {
      stage: 'handle',
      reason: 'proximity',
    }, context)).toMatchObject({ accepted: false, code: 'transition-not-allowed' });
    expect(transitionDepth(state('signal'), {
      stage: 'approach',
      reason: 'proximity',
    }, { ...context, destinationId: 'destination:about' })).toMatchObject({
      accepted: false,
      code: 'destination-mismatch',
    });
  });

  it('allows one-stage retreat, explicit reset, and direct semantic restoration', () => {
    expect(transitionDepth(state('enter'), {
      stage: 'handle',
      reason: 'retreat',
    }, context)).toMatchObject({ accepted: true, next: { stage: 'handle' } });
    expect(transitionDepth(state('understand'), {
      stage: 'signal',
      reason: 'reset',
    }, context)).toMatchObject({ accepted: true, next: { stage: 'signal' } });
    expect(transitionDepth(state('signal'), {
      stage: 'understand',
      reason: 'restore',
      safeState: { panel: 'evidence' },
    }, context)).toMatchObject({
      accepted: true,
      next: { stage: 'understand', safeState: { panel: 'evidence' } },
    });
  });
});
