import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('about presentation', () => {
  it('uses a concise, source-grounded ten-slide arc', async () => {
    const component = await readFile(
      path.join(root, 'src/components/presentation/AboutPresentation.tsx'),
      'utf8',
    );

    expect(component).toContain('data-presentation-stage="about-mark"');
    expect(component).toContain('Before code, there was piano.');
    expect(component).toContain('10 people became 26,000.');
    expect(component).toContain('Rebuilding was my hardest system.');
    expect(component).toContain('AI turned curiosity into momentum.');
    expect(component).toContain('$100K');
    expect(component).toContain('I build in four directions.');
    expect(component).toContain('I turn complexity into systems people can explore.');
    expect(component.match(/chapter: '/g)).toHaveLength(10);
  });

  it('supports presentation navigation and a reduced-motion path', async () => {
    const [component, styles] = await Promise.all([
      readFile(
        path.join(root, 'src/components/presentation/AboutPresentation.tsx'),
        'utf8',
      ),
      readFile(
        path.join(root, 'src/app/presentation/presentation.module.css'),
        'utf8',
      ),
    ]);

    expect(component).toContain("event.key === 'ArrowRight'");
    expect(component).toContain("event.key === 'ArrowLeft'");
    expect(component).toContain("event.key === 'Home'");
    expect(component).toContain("event.key === 'End'");
    expect(component).toContain('requestFullscreen()');
    expect(component).toContain('onPointerDown={handlePointerDown}');
    expect(component).toContain('onPointerUp={handlePointerUp}');
    expect(component).toContain('aria-live="polite"');
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('keeps the presentation free from global exploration chrome', async () => {
    const [tour, discoveries, physics, ai] = await Promise.all([
      readFile(path.join(root, 'src/components/experience/GuidedTour.tsx'), 'utf8'),
      readFile(path.join(root, 'src/components/experience/HiddenDiscoveries.tsx'), 'utf8'),
      readFile(path.join(root, 'src/components/experience/DiscoveryPhysicsInstrument.tsx'), 'utf8'),
      readFile(path.join(root, 'src/components/ai/GlobalAIPresence.tsx'), 'utf8'),
    ]);

    for (const component of [tour, discoveries, physics, ai]) {
      expect(component).toContain("'/presentation'");
      expect(component).toContain('return null');
    }
  });
});
