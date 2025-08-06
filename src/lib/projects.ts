import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const PROJECTS_PATH = path.join(process.cwd(), 'src/content/projects');

export interface Project {
  slug: string;
  name: string;
  year: string;
  headline: string;
  summary: string;
  responsibilities: string[];
  results: string[];
  tech: string[];
  media: {
    type: 'gif' | 'video' | 'image' | 'iframe';
    src: string;
    poster?: string;
  }[];
  repoUrl?: string;
  liveUrl?: string;
  heroModel?: string;
  cameraPosition?: [number, number, number];
  body: string;
}

export async function getProjects(): Promise<Project[]> {
  const files = await glob('*.mdx', { cwd: PROJECTS_PATH });

  const projects = files.map((file) => {
    const filePath = path.join(PROJECTS_PATH, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...data,
      body: content,
    } as Project;
  });

  return projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
}
