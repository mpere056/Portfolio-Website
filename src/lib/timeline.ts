import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const TIMELINE_PATH = path.join(process.cwd(), 'src/content/about');

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
}

export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  const files = await glob('*.mdx', { cwd: TIMELINE_PATH });

  const entries = files.map((file) => {
    const filePath = path.join(TIMELINE_PATH, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...data,
      body: content,
    } as TimelineEntry;
  });

  return entries.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
}
