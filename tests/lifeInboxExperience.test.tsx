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
    expect(html).toContain('Capture locally');
    expect(html).toContain('Nothing here sends personal information anywhere');
    expect(html).not.toContain('Source repository');
  });

  it('renders the exploded Enter system and evidence-grounded Understand layer', () => {
    const enter = renderStage('enter');
    expect(enter).toContain('One thought, four different promises');
    expect(enter).toContain('Inspect the trust boundary');

    const understand = renderStage('understand');
    expect(understand).toContain('Fast capture is an architectural claim');
    expect(understand).toContain('LifeInbox-Option-B');
    expect(understand).toContain('local-first-capture-needs-trust');
    expect(understand).toContain('Enter LifeInbox');
  });
});
