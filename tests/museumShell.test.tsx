import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ExplorationWorldProvider } from '@/components/experience/ExplorationWorldProvider';
import { PortfolioAIProvider } from '@/components/ai/PortfolioAIProvider';
import MuseumShell from '@/components/museum/MuseumShell';
import { loadMuseumExhibits } from '@/lib/museum/loadExhibits';
import { resolveMuseumHash, resolveMuseumStage } from '@/lib/museum/navigation';

describe('museum Signal and Approach shell', () => {
  it('renders all canonical signals without loading a flagship interaction', async () => {
    const { exhibits } = await loadMuseumExhibits();
    const html = renderToStaticMarkup(
      <ExplorationWorldProvider>
        <MuseumShell exhibits={exhibits} enabledExperiences={{ dreamlife: true, lifeinbox: true, sudoku: true }} />
      </ExplorationWorldProvider>,
    );

    expect(exhibits).toHaveLength(9);
    for (const exhibit of exhibits) expect(html).toContain(`href="#${exhibit.slug}"`);
    expect(html).toContain('Move toward');
    expect(html).toContain('%2Fimages%2Fart-direction%2Fmuseum-signal-ecology.webp');
    expect(html).toContain('data-layer="museum:matte"');
    expect(html).toContain('data-layer="museum:membrane"');
    expect(html).toContain('data-layer="museum:particles"');
    expect(html).toContain('--x:9%');
    expect(html).not.toContain('Capture locally');
    expect(html).not.toContain('Sudoku board');
  });

  it('renders reviewed semantic material when a connected exhibit is selected', async () => {
    const { exhibits } = await loadMuseumExhibits();
    const html = renderToStaticMarkup(
      <ExplorationWorldProvider>
        <PortfolioAIProvider>
          <MuseumShell
            exhibits={exhibits}
            initialSlug="lifeinbox"
            enabledExperiences={{ dreamlife: true, lifeinbox: true, sudoku: true }}
          />
        </PortfolioAIProvider>
      </ExplorationWorldProvider>,
    );

    expect(html).toContain('Reviewed connection');
    expect(html).toContain('relationship:lifeinbox-documented-in-trust-post');
    expect(html).toContain('Follow the record');
  });

  it('resolves exact known anchors and ignores unknown or lobby hashes', async () => {
    const { exhibits } = await loadMuseumExhibits();
    expect(resolveMuseumHash('#lifeinbox', exhibits)).toBe('lifeinbox');
    expect(resolveMuseumHash('#discord-sudoku-activity', exhibits)).toBe('discord-sudoku-activity');
    expect(resolveMuseumHash('#unknown', exhibits)).toBeUndefined();
    expect(resolveMuseumHash('#museum-lobby', exhibits)).toBeUndefined();
    const lifeInbox = exhibits.find(exhibit => exhibit.slug === 'lifeinbox');
    expect(resolveMuseumStage('?stage=handle', lifeInbox)).toBe('handle');
    expect(resolveMuseumStage('?stage=understand', lifeInbox)).toBe('understand');
    expect(resolveMuseumStage('?stage=handle', exhibits.find(exhibit => exhibit.slug === 'dreamlife'))).toBe('handle');
    expect(resolveMuseumStage('?stage=unsafe', lifeInbox)).toBe('approach');
  });
});
