import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const TIMELINE_PATH = path.join(process.cwd(), 'src/content/about');

const defaultColors = [
  '#2E0219', '#220126', '#140028', '#010023', '#02192E', '#012622', '#002814', '#232301',
  '#2E1902', '#261101', '#280000', '#230114', '#19022E', '#110126', '#000028', '#012323'
];

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
      color: data.color || defaultColors[index % defaultColors.length],
    } as TimelineEntry;
  });

  return entries.sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
}
