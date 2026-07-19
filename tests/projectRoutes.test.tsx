import { describe, expect, it } from 'vitest';
import { generateMetadata, generateStaticParams } from '@/app/projects/[slug]/page';
import { loadMuseumExhibits } from '@/lib/museum/loadExhibits';

describe('canonical project exhibit routes', () => {
  it('prebuilds every project and publishes project-specific canonical metadata', async () => {
    const params = await generateStaticParams();
    expect(params).toHaveLength(9);
    expect(params).toContainEqual({ slug: 'dreamlife' });
    await expect(generateMetadata({ params: Promise.resolve({ slug: 'dreamlife' }) })).resolves.toMatchObject({
      title: 'Dreamlife | Mark Perera',
      alternates: { canonical: '/projects/dreamlife' },
    });
  });

  it('feeds direct routes from the shared museum registry with full flagship depth', async () => {
    const { exhibits } = await loadMuseumExhibits();
    expect(exhibits.find(exhibit => exhibit.slug === 'dreamlife')).toMatchObject({
      href: '/projects/dreamlife',
      supportedStages: ['signal', 'approach', 'handle', 'enter', 'understand'],
      status: 'registered',
    });
  });
});
