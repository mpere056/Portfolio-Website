import type { Metadata } from 'next';
import HomePracticeWorldNeutral from '@/components/home/HomePracticeWorldNeutral';

export const metadata: Metadata = {
  title: 'Home Practice World Proof | Mark Perera',
  description: 'A private neutral-composition proof for the evolving portfolio home.',
  robots: { index: false, follow: false },
};

export default function HomeWorldProofPage() {
  return <HomePracticeWorldNeutral />;
}
