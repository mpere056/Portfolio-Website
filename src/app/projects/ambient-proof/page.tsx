import type { Metadata } from 'next';
import MuseumAmbientProof from '@/components/museum/MuseumAmbientProof';

export const metadata: Metadata = {
  title: 'Museum Ambient Material Proof | Mark Perera',
  description: 'A bounded hybrid WebGL study for the living Project Museum.',
  robots: { index: false, follow: false },
};

export default function MuseumAmbientProofPage() {
  return <MuseumAmbientProof />;
}
