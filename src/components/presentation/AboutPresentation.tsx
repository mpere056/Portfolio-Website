'use client';

import Link from 'next/link';
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import styles from '@/app/presentation/presentation.module.css';

type Motif =
  | 'origin'
  | 'resonance'
  | 'play'
  | 'community'
  | 'fracture'
  | 'rebuild'
  | 'signal'
  | 'dream'
  | 'practices'
  | 'continuum';

interface Slide {
  chapter: string;
  title: string;
  accent?: string;
  statement?: string;
  metrics?: Array<{ value: string; label: string }>;
  tags?: string[];
  motif: Motif;
}

const slides: Slide[] = [
  {
    chapter: 'Mark Perera',
    title: 'I build worlds people can move through.',
    statement: 'Software. AI. Music. Communities.',
    motif: 'origin',
  },
  {
    chapter: '01 / Discipline',
    title: 'Before code, there was piano.',
    statement: 'Depth is built one deliberate repetition at a time.',
    metrics: [
      { value: '4', label: 'First lesson' },
      { value: '12', label: 'Practical exams complete' },
      { value: '5h', label: 'Peak daily practice' },
    ],
    motif: 'resonance',
  },
  {
    chapter: '02 / Curiosity',
    title: 'I stopped only playing games.',
    accent: 'I started opening them.',
    tags: ['Logic gates', 'C++', 'Unity modding', 'Multiplayer RPC'],
    motif: 'play',
  },
  {
    chapter: '03 / Community',
    title: '10 people became 26,000.',
    statement: 'The code mattered. The culture mattered more.',
    metrics: [
      { value: '25K', label: 'Messages each day' },
      { value: '50', label: 'Person moderator team' },
      { value: '24/7', label: 'Community coverage' },
    ],
    motif: 'community',
  },
  {
    chapter: '04 / The break',
    title: 'Then I lost the plot.',
    statement: '2019 forced an honest reset.',
    tags: ['Stopped university', 'Isolation', 'Long walks', 'Start again'],
    motif: 'fracture',
  },
  {
    chapter: '05 / Return',
    title: 'Rebuilding was my hardest system.',
    statement: 'Not a comeback story. A sequence of stubborn next steps.',
    metrics: [
      { value: '8', label: 'Courses to re-enter' },
      { value: '4', label: 'Universities coordinated' },
      { value: '2024', label: 'CS degree complete' },
    ],
    motif: 'rebuild',
  },
  {
    chapter: '06 / Leverage',
    title: 'AI turned curiosity into momentum.',
    statement: 'Experiment, measure, learn, repeat.',
    metrics: [
      { value: '1M', label: 'Monthly Pinterest views' },
      { value: '5mo', label: 'Time to reach them' },
      { value: 'AirOps', label: 'AI workflow engineering' },
    ],
    motif: 'signal',
  },
  {
    chapter: '07 / Dreamlife',
    title: 'What if we could prototype a life',
    accent: 'before committing to it?',
    statement: 'AI-generated futures became a working mobile product.',
    metrics: [
      { value: '$100K', label: 'Development offer' },
    ],
    motif: 'dream',
  },
  {
    chapter: '08 / Now',
    title: 'I build in four directions.',
    tags: [
      'AI + possible futures',
      'Life systems + tools',
      'Play + community',
      'Music + performance',
    ],
    motif: 'practices',
  },
  {
    chapter: '09 / The thread',
    title: 'The work changes.',
    accent: 'The pattern does not.',
    statement: 'I turn complexity into systems people can explore.',
    motif: 'continuum',
  },
];

function Visual({ motif }: { motif: Motif }) {
  if (motif === 'resonance') {
    return (
      <div className={`${styles.visual} ${styles.resonance}`} aria-hidden="true">
        <div className={styles.pianoArc}>
          {Array.from({ length: 15 }, (_, index) => <span key={index} />)}
        </div>
        <i /><i /><i /><i />
      </div>
    );
  }

  if (motif === 'play') {
    return (
      <div className={`${styles.visual} ${styles.logicField}`} aria-hidden="true">
        <svg viewBox="0 0 720 520" role="presentation">
          <path d="M70 310C166 310 177 128 282 128S394 354 492 354 581 206 666 206" />
          <path d="M66 386C164 386 196 266 286 266S398 110 510 110 586 314 674 314" />
          {[90, 282, 492, 666].map((x, index) => (
            <g key={x} className={styles.logicNode} style={{ '--node-delay': `${index * -1.1}s` } as CSSProperties}>
              <circle cx={x} cy={[310, 128, 354, 206][index]} r="18" />
              <circle cx={x} cy={[310, 128, 354, 206][index]} r="5" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (motif === 'community') {
    return (
      <div className={`${styles.visual} ${styles.communityField}`} aria-hidden="true">
        <div className={styles.communityCore}>26K</div>
        {Array.from({ length: 28 }, (_, index) => (
          <span
            key={index}
            style={{
              '--angle': `${index * (360 / 28)}deg`,
              '--radius': `${118 + (index % 4) * 29}px`,
              '--delay': `${index * -0.19}s`,
            } as CSSProperties}
          />
        ))}
      </div>
    );
  }

  if (motif === 'fracture') {
    return (
      <div className={`${styles.visual} ${styles.fractureField}`} aria-hidden="true">
        <div className={styles.fractureLine} />
        <span /><span /><span /><span />
      </div>
    );
  }

  if (motif === 'rebuild') {
    return (
      <div className={`${styles.visual} ${styles.rebuildField}`} aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} style={{ '--step': index } as CSSProperties} />
        ))}
        <div className={styles.climbingSignal} />
      </div>
    );
  }

  if (motif === 'signal') {
    return (
      <div className={`${styles.visual} ${styles.signalField}`} aria-hidden="true">
        {Array.from({ length: 34 }, (_, index) => (
          <span
            key={index}
            style={{
              '--x': `${(index * 37) % 100}%`,
              '--y': `${(index * 61) % 100}%`,
              '--delay': `${index * -0.13}s`,
            } as CSSProperties}
          />
        ))}
        <div className={styles.signalWave} />
      </div>
    );
  }

  if (motif === 'dream') {
    return (
      <div className={`${styles.visual} ${styles.dreamField}`} aria-hidden="true">
        <div className={styles.dreamOrb}>
          <span>Current</span>
          <span>Fallback</span>
          <span>Wild card</span>
        </div>
        <i /><i /><i />
      </div>
    );
  }

  if (motif === 'practices') {
    const practiceLabels = ['AI', 'Life', 'Play', 'Music'];
    return (
      <div className={`${styles.visual} ${styles.practiceField}`} aria-hidden="true">
        {practiceLabels.map((label, index) => (
          <span key={label} style={{ '--practice': index } as CSSProperties}>
            {label}
          </span>
        ))}
        <div className={styles.practiceCore}>M</div>
      </div>
    );
  }

  if (motif === 'continuum') {
    return (
      <div className={`${styles.visual} ${styles.continuumField}`} aria-hidden="true">
        <svg viewBox="0 0 760 360" role="presentation">
          <path d="M20 190C125 56 217 320 334 174S538 40 740 182" />
          <path d="M20 224C146 92 226 336 352 196S566 82 740 214" />
          <path d="M20 158C112 18 216 290 320 142S516 10 740 150" />
        </svg>
        <span />
      </div>
    );
  }

  return (
    <div className={`${styles.visual} ${styles.originField}`} aria-hidden="true">
      <div className={styles.originOrb} />
      <div className={styles.originOrbit} />
      <div className={styles.originOrbit} />
      <div className={styles.originOrbit} />
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          style={{
            '--spark': index,
            '--spark-radius': `${160 + (index % 4) * 26}px`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export default function AboutPresentation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [fullscreen, setFullscreen] = useState(false);
  const pointerStart = useRef<number | null>(null);

  const goTo = (nextIndex: number) => {
    const bounded = Math.max(0, Math.min(slides.length - 1, nextIndex));
    if (bounded === activeIndex) return;
    setDirection(bounded > activeIndex ? 'forward' : 'backward');
    setActiveIndex(bounded);
  };

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      goTo(Math.min(slides.length - 1, activeIndex + 1));
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(Math.max(0, activeIndex - 1));
    }
    if (event.key === 'Home') goTo(0);
    if (event.key === 'End') goTo(slides.length - 1);
  });

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    pointerStart.current = event.clientX;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 55) return;
    goTo(activeIndex + (distance < 0 ? 1 : -1));
  };

  const slide = slides[activeIndex];

  return (
    <main
      className={styles.stage}
      data-presentation-stage="about-mark"
      data-slide={activeIndex + 1}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <header className={styles.hud}>
        <Link href="/" className={styles.homeLink}>Mark Perera</Link>
        <span className={styles.hudTitle}>A life in systems</span>
        <button
          className={styles.fullscreenButton}
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {fullscreen ? 'Exit full' : 'Full screen'}
        </button>
      </header>

      <section
        key={activeIndex}
        className={`${styles.slide} ${styles[direction]}`}
        aria-live="polite"
        aria-label={`Slide ${activeIndex + 1} of ${slides.length}`}
      >
        <div className={styles.content}>
          <p className={styles.chapter}>{slide.chapter}</p>
          <h1>
            {slide.title}
            {slide.accent && <em>{slide.accent}</em>}
          </h1>
          {slide.statement && <p className={styles.statement}>{slide.statement}</p>}
          {slide.metrics && (
            <div className={styles.metrics}>
              {slide.metrics.map(metric => (
                <div key={`${metric.value}-${metric.label}`}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          )}
          {slide.tags && (
            <div className={styles.tags}>
              {slide.tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </div>
        <Visual motif={slide.motif} />
      </section>

      <footer className={styles.controls}>
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous slide"
        >
          <span aria-hidden="true">&larr;</span>
          Previous
        </button>
        <div className={styles.progress}>
          {slides.map((item, index) => (
            <button
              key={item.chapter}
              type="button"
              onClick={() => goTo(index)}
              className={index === activeIndex ? styles.activeDot : ''}
              aria-label={`Go to slide ${index + 1}: ${item.chapter}`}
              aria-current={index === activeIndex ? 'step' : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex === slides.length - 1}
          aria-label="Next slide"
        >
          Next
          <span aria-hidden="true">&rarr;</span>
        </button>
      </footer>

      <div className={styles.counter} aria-hidden="true">
        <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
        <span>/</span>
        <span>{String(slides.length).padStart(2, '0')}</span>
      </div>
    </main>
  );
}
