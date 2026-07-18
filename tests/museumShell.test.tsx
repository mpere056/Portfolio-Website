import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MuseumShell from '@/components/museum/MuseumShell';
import { loadMuseumExhibits } from '@/lib/museum/loadExhibits';
import { resolveMuseumHash, resolveMuseumStage } from '@/lib/museum/navigation';

describe('museum Signal and Approach shell', () => {
  it('renders all canonical signals without loading a flagship interaction', async () => {
    const { exhibits } = await loadMuseumExhibits();
    const html = renderToStaticMarkup(<MuseumShell exhibits={exhibits} />);

    expect(exhibits).toHaveLength(9);
    for (const exhibit of exhibits) expect(html).toContain(`href="#${exhibit.slug}"`);
    expect(html).toContain('Move toward');
    expect(html).not.toContain('Capture locally');
    expect(html).not.toContain('Sudoku board');
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
    expect(resolveMuseumStage('?stage=handle', exhibits.find(exhibit => exhibit.slug === 'dreamlife'))).toBe('approach');
    expect(resolveMuseumStage('?stage=unsafe', lifeInbox)).toBe('approach');
  });
});
