import type { Metadata } from 'next';
import PianoClearingProof from '@/components/home/PianoClearingProof';

export const metadata: Metadata = {
  title: 'Piano Clearing Proof | Mark Perera',
  description: 'A private, performance-bounded outdoor world proof for the evolving portfolio home.',
  robots: { index: false, follow: false },
};

export default function HomeWorldProofPage() {
  return <PianoClearingProof />;
}
