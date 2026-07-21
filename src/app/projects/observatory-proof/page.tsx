import type { Metadata } from 'next';
import MuseumObservatoryProof from '@/components/museum/MuseumObservatoryProof';

export const metadata: Metadata = {
  title: 'Museum Observatory Proof | Mark Perera',
  description: 'A bounded optical-mechanical study for the living Project Museum.',
  robots: { index: false, follow: false },
};

export default function MuseumObservatoryProofPage() {
  return <MuseumObservatoryProof />;
}

