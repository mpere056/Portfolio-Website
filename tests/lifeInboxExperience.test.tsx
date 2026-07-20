import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ExplorationWorldProvider } from '@/components/experience/ExplorationWorldProvider';
import LifeInboxExperience from '@/components/museum/LifeInboxExperience';

function renderStage(stage: 'handle' | 'enter' | 'understand') {
  return renderToStaticMarkup(
    <ExplorationWorldProvider>
      <LifeInboxExperience
        stage={stage}
        onStageChange={vi.fn()}
        projectHref="https://lifeinbox.marknperera.ca/"
      />
    </ExplorationWorldProvider>,
  );
}

describe('LifeInbox flagship depth experience', () => {
  it('teaches the synthetic local-first Handle state without implying live services', () => {
    const html = renderStage('handle');
    expect(html).toContain('Trust begins before intelligence');
    expect(html).toContain('Settle locally');
    expect(html).toContain('Nothing here sends personal information anywhere');
    expect(html).toContain('data-capture-state="empty"');
    expect(html).toContain('data-layer="lifeinbox:matte"');
    expect(html).toContain('data-layer="lifeinbox:ingress"');
    expect(html).toContain('data-layer="lifeinbox:material"');
    expect(html).toContain('data-layer="lifeinbox:local-core"');
    expect(html).not.toContain('Source repository');
  });

  it('renders the exploded Enter system and evidence-grounded Understand layer', () => {
    const enter = renderStage('enter');
    expect(enter).toContain('one thought, four promises');
    expect(enter).toContain('Inspect the proof');

    const understand = renderStage('understand');
    expect(understand).toContain('Every promise begins at a different boundary');
    expect(understand).toContain('LifeInbox-Option-B');
    expect(understand).toContain('local-first-capture-needs-trust');
    expect(understand).toContain('Continue through the LifeInbox instrument');
    expect(understand).toContain('data-depth-stage="understand"');
    expect(understand).toContain('data-layer="lifeinbox:boundaries"');
    expect(understand).toContain('data-layer="lifeinbox:return"');
    expect(understand).toContain('data-layer="lifeinbox:evidence"');
  });
});
