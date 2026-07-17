import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MuseumFallbackShell from '@/components/museum/MuseumFallbackShell';
import ExhibitFallback from '@/components/museum/ExhibitFallback';
import { createExperienceLoaderRegistry } from '@/lib/museum/experienceLoaders';
import { loadMuseumExhibits } from '@/lib/museum/loadExhibits';

describe('museum exhibit server boundary', () => {
  it('builds graph-backed serializable views for every current project', async () => {
    const result = await loadMuseumExhibits();
    expect(result.issues).toEqual([]);
    expect(result.exhibits).toHaveLength(9);
    expect(result.exhibits.every(exhibit => exhibit.status === 'registered')).toBe(true);
    expect(JSON.parse(JSON.stringify(result.exhibits))).toHaveLength(9);
  });

  it('renders useful copy and stable anchors without an experience module', async () => {
    const { exhibits } = await loadMuseumExhibits();
    const markup = renderToStaticMarkup(<MuseumFallbackShell exhibits={exhibits} />);

    expect(markup).toContain('Project museum');
    expect(markup).toContain('id="lifeinbox"');
    expect(markup).toContain('Local-first Android inbox for life admin');
    expect(markup).toContain('href="/projects#lifeinbox"');
    expect(markup).toContain('https://lifeinbox.marknperera.ca/');
  });

  it('preserves the authored fallback when a flagship module fails', async () => {
    const { exhibits, registry } = await loadMuseumExhibits();
    const lifeinbox = registry.bySlug.get('lifeinbox')!;
    const loaders = createExperienceLoaderRegistry({
      'experience:lifeinbox': async () => { throw new Error('experience unavailable'); },
    });

    await expect(loaders.load(lifeinbox)).resolves.toEqual({ status: 'failed' });
    const markup = renderToStaticMarkup(
      <ExhibitFallback exhibit={exhibits.find(exhibit => exhibit.slug === 'lifeinbox')!} />,
    );
    expect(markup).toContain('LifeInbox');
    expect(markup).toContain('href="/projects#lifeinbox"');
    expect(markup).toContain('https://lifeinbox.marknperera.ca/');
  });
});
