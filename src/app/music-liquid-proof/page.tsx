import type { Metadata } from 'next';
import PianoClearingProof from '@/components/home/PianoClearingProof';

export const metadata: Metadata = {
  title: 'Music Liquid Landscape Proof | Mark Perera',
  description: 'A private, performance-bounded material metamorphosis proof for the Music world.',
  robots: { index: false, follow: false },
};

export default function MusicLiquidProofPage() {
  return <PianoClearingProof musicLiquidProof />;
}
