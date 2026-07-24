import type { Metadata } from 'next';
import MuseumMusicProof from '@/components/museum/MuseumMusicProof';

export const metadata: Metadata = {
  title: 'Museum Music Chamber Proof | Mark Perera',
  description: 'A bounded procedural piano and resonance study for the living Project Museum.',
  robots: { index: false, follow: false },
};

export default function MuseumMusicProofPage() {
  return <MuseumMusicProof />;
}
