import type { Metadata } from 'next';
import MuseumArchiveCoreProof from '@/components/museum/MuseumArchiveCoreProof';

export const metadata: Metadata = {
  title: 'Museum Archive Core Proof | Mark Perera',
  description: 'A bounded authored-memory study for the living Project Museum.',
  robots: { index: false, follow: false },
};

export default function MuseumArchiveCoreProofPage() {
  return <MuseumArchiveCoreProof />;
}
