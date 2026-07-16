import { loadContentRecords } from './content/loaders';

// Colors are optional per-entry; when missing, UI derives a color from the entry's texture

export interface TimelineEntry {
  id: string;
  from: string;
  to?: string;
  headline: string;
  summary: string;
  body: string;
  media?: {
    type: 'image' | 'video' | '3d';
    src: string;
    poster?: string;
  };
  projectSlug?: string;
  position?: 'left' | 'center';
  color?: string;
  addon?: string;
  /** Optional texture key (without extension) to override background sphere image */
  texture?: string;
  /** Optional opacity for the background texture overlay (0..1). */
  textureOpacity?: number;
}

export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  const records = await loadContentRecords({ patterns: 'about/*.mdx' });

  const entries = records.map(record => {
    const data = record.frontmatter;
    return {
      ...data,
      body: record.body,
      position: data.position || 'left',
      color: data.color as string | undefined,
    } as unknown as TimelineEntry;
  });

  return entries.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
}
