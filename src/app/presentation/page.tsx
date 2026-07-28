import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './presentation.module.css';

export const metadata: Metadata = {
  title: 'Presentation | Mark Perera',
  description: 'A temporary presentation space for Mark Perera.',
  robots: { index: false, follow: false },
};

export default function PresentationPage() {
  return (
    <main className={styles.stage} data-presentation-stage="temporary">
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Presentation staging room</p>
        <h1>The stage is ready.</h1>
        <p className={styles.intro}>
          This temporary space is prepared for the presentation we&apos;ll build next.
        </p>
        <div className={styles.status}>
          <span aria-hidden="true" />
          Awaiting presentation direction
        </div>
      </section>
      <Link className={styles.returnLink} href="/">
        <span aria-hidden="true">←</span>
        Return to the valley
      </Link>
    </main>
  );
}
