import type { Metadata } from 'next';
import Link from 'next/link';
import PianoClearingProof from '@/components/home/PianoClearingProof';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Mark Perera | Ideas in Motion',
  description: 'Mark Perera explores software, AI, games, music, and living systems.',
};

export default function HomePage() {
  return (
    <>
      <PianoClearingProof />
      <Link
        className={styles.presentationDoorway}
        href="/presentation"
        aria-label="Open tomorrow's presentation"
      >
        <span className={styles.signal} aria-hidden="true" />
        <span className={styles.copy}>
          <span className={styles.eyebrow}>Temporary doorway</span>
          <strong>Tomorrow&apos;s presentation</strong>
        </span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </Link>
    </>
  );
}
