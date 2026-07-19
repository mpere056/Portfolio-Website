import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ProjectStateSummary from '@/components/museum/ProjectStateSummary';
import { getProjectState, loadProjectStates } from '@/lib/content/projectStates';
import { loadMuseumExhibits } from '@/lib/museum/loadExhibits';

describe('reviewed portfolio lifecycle states', () => {
  it('loads one valid state for every project with the reviewed lifecycle set', async () => {
    const states = await loadProjectStates();
    expect(states).toHaveLength(9);
    expect(states.find(state => state.projectId === 'project:lifeinbox')).toMatchObject({
      projectId: 'project:lifeinbox',
      lifecycle: 'evolving',
      contentVersion: '2026-7-18:lifeinbox-state',
    });
    expect(states.filter(state => state.lifecycle === 'evolving').map(state => state.projectId).sort()).toEqual([
      'project:discord-sudoku-activity',
      'project:dreamlife',
      'project:lifeinbox',
    ]);
    expect(states.filter(state => state.lifecycle === 'complete').map(state => state.projectId).sort()).toEqual([
      'project:group-finder',
      'project:story-app',
    ]);
    expect(states.filter(state => state.lifecycle === 'archived')).toHaveLength(4);
    expect(states.every(state => state.evidence.length > 0)).toBe(true);
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

  it('renders lifecycle-specific language for completed and archived work', async () => {
    const complete = await getProjectState('project:story-app');
    const archived = await getProjectState('project:discord-bot');
    const completeHtml = renderToStaticMarkup(<ProjectStateSummary state={complete!} />);
    const archivedHtml = renderToStaticMarkup(<ProjectStateSummary state={archived!} />);
    expect(completeHtml).toContain('Final outcome');
    expect(completeHtml).toContain('Later work influenced');
    expect(archivedHtml).toContain('Why it rests');
    expect(archivedHtml).toContain('Last verified state');
    expect(archivedHtml).not.toContain('Current question');
  });
});
