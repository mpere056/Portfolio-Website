import type { Metadata } from 'next';
import AboutPresentation from '@/components/presentation/AboutPresentation';

export const metadata: Metadata = {
  title: 'About Mark | Presentation',
  description: 'A concise presentation about Mark Perera: music, software, AI, communities, and possible futures.',
  robots: { index: false, follow: false },
};

export default function PresentationPage() {
  return <AboutPresentation />;
}
