import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  DepthControllerProvider,
  useDepthControllerSnapshot,
} from '@/components/experience/DepthControllerProvider';
import { createPortfolioAIContextStore } from '@/lib/ai/context';
import { createDepthController } from '@/lib/experience/controller';
import { createExplorationStore } from '@/lib/experience/store';

function ControlledSceneProbe() {
  const snapshot = useDepthControllerSnapshot();
  return (
    <output
      data-stage={snapshot.state.stage}
      data-next-stage={snapshot.nextStage}
      data-reason={snapshot.expectedReason}
    >
      {snapshot.state.stage}
    </output>
  );
}

function createController() {
  return createDepthController({
    initialState: {
      destinationId: 'destination:museum-project-dreamlife',
      stage: 'signal',
    },
    context: {
      route: '/projects',
      destinationId: 'destination:museum-project-dreamlife',
      nodeId: 'project:dreamlife',
      experienceId: 'experience:dreamlife',
    },
    semanticId: 'project:dreamlife',
    sourceId: 'depth.test.dreamlife',
    explorationStore: createExplorationStore(),
    aiContextStore: createPortfolioAIContextStore({ route: '/projects' }),
  });
}

describe('DepthControllerProvider', () => {
  it('exposes a stable controlled-scene snapshot without mounting production UI', () => {
    const controller = createController();

    const initialMarkup = renderToStaticMarkup(
      <DepthControllerProvider controller={controller}>
        <ControlledSceneProbe />
      </DepthControllerProvider>,
    );
    expect(initialMarkup).toContain('data-stage="signal"');
    expect(initialMarkup).toContain('data-next-stage="approach"');
    expect(initialMarkup).toContain('data-reason="proximity"');

    controller.transition({ stage: 'approach', reason: 'proximity' });
    const transitionedMarkup = renderToStaticMarkup(
      <DepthControllerProvider controller={controller}>
        <ControlledSceneProbe />
      </DepthControllerProvider>,
    );
    expect(transitionedMarkup).toContain('data-stage="approach"');
    expect(transitionedMarkup).toContain('data-next-stage="handle"');
    expect(transitionedMarkup).toContain('data-reason="interaction"');
    controller.dispose();
  });

  it('requires consumers to remain inside the controller boundary', () => {
    expect(() => renderToStaticMarkup(<ControlledSceneProbe />)).toThrow(
      'useDepthController must be used inside DepthControllerProvider',
    );
  });
});
