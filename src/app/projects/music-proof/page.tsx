import type { Metadata } from 'next';
import HeroCube from '@/components/HeroCube';

export const metadata: Metadata = {
  title: 'Home Music Proof | Mark Perera',
  description: 'A restrained extension of the existing homepage piano scene.',
  robots: { index: false, follow: false },
};

export default function MuseumMusicProofPage() {
  return (
    <main>
      <HeroCube variant="music-proof" />
    </main>
  );
}
