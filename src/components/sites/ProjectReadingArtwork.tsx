import Image from 'next/image';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';
import styles from './ProjectReadingArtwork.module.css';

const ASSETS = {
  dreamlife: ART_DIRECTION_ASSETS.dreamlife,
  lifeinbox: ART_DIRECTION_ASSETS.lifeinbox,
  sudokutogether: ART_DIRECTION_ASSETS.sudoku,
} as const;

export default function ProjectReadingArtwork({ site }: { site: keyof typeof ASSETS }) {
  const asset = ASSETS[site];
  return (
    <div className={styles.artwork} data-site={site} aria-hidden="true">
      <Image src={asset.src} alt="" fill priority sizes="100vw" />
      <span />
    </div>
  );
}
