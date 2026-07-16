import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  PortfolioAIProvider,
  usePortfolioAI,
  usePortfolioAIContext,
} from '../src/components/ai/PortfolioAIProvider';

vi.mock('next/navigation', () => ({
  usePathname: () => '/projects',
}));

function Consumer() {
  const ai = usePortfolioAI();
  return (
    <output
      data-enabled={String(ai.enabled)}
      data-route={ai.context.route}
      data-open={String(ai.shell.open)}
      data-label={ai.presentation.presenceLabel}
    />
  );
}

function LegacyContextConsumer() {
  const route = usePortfolioAIContext(state => state.activeContext.route);
  return <output data-legacy-route={route} />;
}

describe('PortfolioAIProvider', () => {
  it('provides one route-aware shell boundary without opening it', () => {
    const markup = renderToStaticMarkup(
      <PortfolioAIProvider enabled>
        <Consumer />
      </PortfolioAIProvider>,
    );
    expect(markup).toContain('data-enabled="true"');
    expect(markup).toContain('data-route="/projects"');
    expect(markup).toContain('data-open="false"');
    expect(markup).toContain('data-label="Ask Mark&#x27;s archive"');
  });

  it('rejects consumers outside the global ownership boundary', () => {
    expect(() => renderToStaticMarkup(<Consumer />)).toThrow(
      'usePortfolioAI must be used inside PortfolioAIProvider',
    );
  });

  it('preserves the accepted Phase 1 selector hook', () => {
    const markup = renderToStaticMarkup(
      <PortfolioAIProvider initialContext={{ route: '/about' }}>
        <LegacyContextConsumer />
      </PortfolioAIProvider>,
    );
    expect(markup).toContain('data-legacy-route="/about"');
  });
});
