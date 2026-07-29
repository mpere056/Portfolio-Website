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
  | 'play'
  | 'lobby'
  | 'console'
  | 'network'
  | 'community'
  | 'fracture'
  | 'rebuild'
  | 'dream'
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
    title: 'Mark Perera',
    accent: 'Software developer',
    statement: '',
    motif: 'origin',
  },
  {
    chapter: '01 / LittleBigPlanet 2',
    title: 'My first',
    accent: 'logic gates',
    statement: 'At 14, I built locks and sequences without realizing I was learning programming.',
    metrics: [
      { value: 'AND', label: 'All inputs' },
      { value: 'OR', label: 'Any input' },
      { value: 'XOR', label: 'One input' },
    ],
    motif: 'play',
  },
  {
    chapter: '02 / Modern Warfare 2',
    title: 'Then I learned systems',
    accent: 'could be bent.',
    statement: 'I flashed firmware, loaded patched files, and hosted unusual lobbies for hundreds of players.',
    tags: ['Reverse the rules', 'Operate the system', 'Create an experience'],
    motif: 'lobby',
  },
  {
    chapter: '03 / C++',
    title: 'Then code allowed me',
    accent: 'to take things further.',
    statement: 'Tic-Tac-Toe became a command-line platformer with jumping, shooting, and a Kamehameha beam.',
    tags: ['Input', 'Condition', 'Loop', 'State'],
    motif: 'console',
  },
  {
    chapter: '04 / AoTTG modding',
    title: 'Modding became',
    accent: 'multiplayer engineering.',
    statement: 'I edited Unity assemblies, shared DLLs, and learned how networked actions stay in sync.',
    tags: ['DNSpy', '.NET', 'RPC calls', 'Network sync'],
    motif: 'network',
  },
  {
    chapter: '05 / Discord',
    title: 'Code became',
    accent: 'community infrastructure.',
    statement: 'Discord bots and a system operating at real scale.',
    metrics: [
      { value: '26K', label: 'Community members' },
      { value: '25K', label: 'Messages each day' },
      { value: '50', label: 'Person moderator team' },
    ],
    motif: 'community',
  },
  {
    chapter: '06 / CRA',
    title: 'My first career',
    accent: 'looked right on paper.',
    statement: 'It was stable work.',
    metrics: [
      { value: '1st', label: 'Full-time role' },
      { value: '1000+', label: 'People supported' },
      { value: '≠', label: 'The right direction' },
    ],
    motif: 'fracture',
  },
  {
    chapter: '07 / Return',
    title: 'So I finished',
    accent: 'what I had started.',
    statement: 'In my final semester, I joined AirOps and began building AI workflows professionally.',
    metrics: [
      { value: '2024', label: 'CS degree complete' },
    ],
    motif: 'rebuild',
  },
  {
    chapter: '08 / Building products',
    title: 'Then I built',
    accent: 'a possible future of my own.',
    statement: 'A small story app evolved into Dreamlife: an AI mobile product for exploring possible lives.',
    metrics: [
      { value: '$100K', label: 'Development offer' },
    ],
    motif: 'dream',
  },
  {
    chapter: '09 / Today',
    title: 'Today, I build software.',
    accent: 'The pattern is still the same.',
    statement: 'At FirePower Capital, I keep opening systems, understanding their rules, and making them useful. AI is the newest one.',
    tags: ['Software Developer', 'Next: AI in business'],
    motif: 'continuum',
  },
];

function Visual({ motif }: { motif: Motif }) {
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

  if (motif === 'lobby') {
    return (
      <div className={`${styles.visual} ${styles.lobbyField}`} aria-hidden="true">
        <div className={styles.lobbyCore}>HOST</div>
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            style={{
              '--angle': `${index * 20}deg`,
              '--radius': `${118 + (index % 3) * 58}px`,
              '--delay': `${index * -0.24}s`,
            } as CSSProperties}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        ))}
      </div>
    );
  }

  if (motif === 'console') {
    return (
      <div className={`${styles.visual} ${styles.consoleField}`} aria-hidden="true">
        <div className={styles.consoleWindow}>
          <div className={styles.consoleBar}><i /><i /><i /></div>
          <code>
            <span>&gt; world.load()</span>
            <span>&gt; player.jump()</span>
            <span>&gt; if (input === &quot;=&quot;)</span>
            <strong>████████ KAMEHAMEHA</strong>
            <span className={styles.consoleCursor}>&gt; _</span>
          </code>
        </div>
      </div>
    );
  }

  if (motif === 'network') {
    return (
      <div className={`${styles.visual} ${styles.networkField}`} aria-hidden="true">
        <svg viewBox="0 0 720 520" role="presentation">
          {[
            [360, 255, 112, 106],
            [360, 255, 600, 122],
            [360, 255, 130, 388],
            [360, 255, 594, 390],
            [360, 255, 360, 70],
          ].map(([x1, y1, x2, y2], index) => (
            <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
          <g className={styles.networkCore}><circle cx="360" cy="255" r="62" /><text x="360" y="262">RPC</text></g>
          {[[112, 106], [600, 122], [130, 388], [594, 390], [360, 70]].map(([x, y], index) => (
            <g key={index} className={styles.networkNode} style={{ '--node-delay': `${index * -0.7}s` } as CSSProperties}>
              <circle cx={x} cy={y} r="24" />
              <circle cx={x} cy={y} r="5" />
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
        <span className={styles.hudTitle}>From play to programming</span>
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
