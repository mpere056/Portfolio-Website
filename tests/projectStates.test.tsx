import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ProjectStateSummary from '@/components/museum/ProjectStateSummary';
import { getProjectState, loadProjectStates } from '@/lib/content/projectStates';
import { loadMuseumExhibits } from '@/lib/museum/loadExhibits';

describe('selected flagship living state', () => {
  it('loads one valid source-grounded evolving LifeInbox record', async () => {
    const states = await loadProjectStates();
    expect(states).toHaveLength(1);
    expect(states[0]).toMatchObject({
      projectId: 'project:lifeinbox',
      lifecycle: 'evolving',
      contentVersion: '2026-7-18:lifeinbox-state',
    });
    expect(states[0].evidence).toHaveLength(2);
  });

  it('attaches the record to the museum view and renders a correction path', async () => {
    const state = await getProjectState('project:lifeinbox');
    expect(state).toBeDefined();
    const { exhibits } = await loadMuseumExhibits();
    expect(exhibits.find(exhibit => exhibit.slug === 'lifeinbox')?.projectState).toEqual(state);
    const html = renderToStaticMarkup(<ProjectStateSummary state={state!} />);
    expect(html).toContain('Living state / evolving');
    expect(html).toContain('Current question');
    expect(html).toContain('can be corrected by Mark');
  });
});

