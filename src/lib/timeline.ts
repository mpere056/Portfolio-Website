import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const TIMELINE_PATH = path.join(process.cwd(), 'src/content/about');

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
  const files = await glob('*.mdx', { cwd: TIMELINE_PATH });

  const entries = files.map((file, index) => {
    const filePath = path.join(TIMELINE_PATH, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...data,
      body: content,
      position: data.position || 'left',
      color: data.color as string | undefined,
    } as TimelineEntry;
  });

  return entries.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
}
