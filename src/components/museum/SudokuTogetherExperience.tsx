'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useExplorationWorld } from '@/components/experience/ExplorationWorldProvider';
import { ART_DIRECTION_ASSETS } from '@/lib/artDirection';
import { createStimulationProfile } from '@/lib/experience/environment';
import { applySyntheticSudokuMove, placeSudokuNumber } from '@/lib/museum/sudokuBoard';
import { getSudokuSceneFrame, getSudokuSyncPath } from '@/lib/museum/sudokuScene';
import type { DepthStage } from '@/lib/portfolioContracts';
import styles from './FlagshipExperiences.module.css';

const SOLUTION = [5,3,4,6,7,8,9,1,2, 6,7,2,1,9,5,3,4,8, 1,9,8,3,4,2,5,6,7, 8,5,9,7,6,1,4,2,3, 4,2,6,8,5,3,7,9,1, 7,1,3,9,2,4,8,5,6, 9,6,1,5,3,7,2,8,4, 2,8,7,4,1,9,6,3,5, 3,4,5,2,8,6,1,7,9];
const GIVEN = new Set([0,3,7,10,13,17,20,23,24,27,31,35,36,39,41,44,45,49,53,54,55,58,62,63,67,71,73,76,80]);
const INITIAL = SOLUTION.map((value, index) => GIVEN.has(index) ? value : 0);
const COMPUTER_SEQUENCE = [1, 2, 4, 5, 6, 8, 9, 11, 12];

const ARCHITECTURE = [
  ['Discord SDK', 'OAuth identity and activity state begin inside the embedded iframe.'],
  ['Proxy boundary', 'CSP-safe Vercel routes keep credentials and database access out of the client.'],
  ['Persistent room', 'Versioned game sessions preserve the shared board, progression, and daily puzzle state.'],
  ['Adaptive sync', 'Polling and version checks reconcile changes without pretending the iframe has a direct socket.'],
] as const;

export default function SudokuTogetherExperience({
  stage,
  onStageChange,
  projectHref,
}: {
  stage: DepthStage;
  onStageChange: (stage: DepthStage) => void;
  projectHref: string;
}) {
  const [board, setBoard] = useState(INITIAL);
  const [owners, setOwners] = useState<Record<number, 'visitor' | 'computer'>>({});
  const [selected, setSelected] = useState(1);
  const [computerJoined, setComputerJoined] = useState(false);
  const moveIndex = useRef(0);
  const boardRef = useRef(INITIAL);
  const [visible, setVisible] = useState(true);
  const experienceRef = useRef<HTMLElement>(null);
  const { store, state: world } = useExplorationWorld();
  const visitorMoves = Object.values(owners).filter(owner => owner === 'visitor').length;
  const computerMoves = Object.values(owners).filter(owner => owner === 'computer').length;
  const stimulation = createStimulationProfile(world.stimulation.normalizedValue, {
    reducedMotionRequested: world.stimulation.reducedMotionRequested,
    soundEnabled: world.stimulation.soundEnabled,
  });
  const scene = getSudokuSceneFrame({
    selectedCell: selected,
    visitorMoves,
    computerMoves,
    computerJoined,
    stage,
    stimulation: stimulation.normalizedValue,
    reducedMotion: world.stimulation.reducedMotionRequested,
    visible,
  });
  const sceneStyle = {
    '--sudoku-energy': scene.energy,
    '--sudoku-visitor': scene.visitorStrength,
    '--sudoku-computer': scene.computerStrength,
    '--sudoku-sync': scene.syncStrength,
    '--sudoku-boundary': scene.boundaryStrength,
    '--sudoku-evidence': scene.evidenceStrength,
    '--sudoku-row': scene.selectedRow,
    '--sudoku-column': scene.selectedColumn,
  } as CSSProperties;

  useEffect(() => {
    store.getState().applyDepthTransition('project:discord-sudoku-activity', {
      destinationId: 'destination:museum-project-sudokutogether',
      stage,
      safeState: { stage },
    });
  }, [stage, store]);

  useEffect(() => {
    const element = experienceRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { rootMargin: '160px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!computerJoined || stage !== 'handle') return;
    const timer = window.setInterval(() => {
      const index = COMPUTER_SEQUENCE[moveIndex.current];
      if (index === undefined) {
        window.clearInterval(timer);
        return;
      }
      moveIndex.current += 1;
      const move = applySyntheticSudokuMove({ board: boardRef.current, owners, index, solution: SOLUTION });
      if (!move.changed) return;
      boardRef.current = move.board;
      setBoard(move.board);
      setOwners(move.owners);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [computerJoined, owners, stage]);

  const placeNumber = (number: number) => {
    const move = placeSudokuNumber({ board: boardRef.current, owners, selected, number, given: GIVEN.has(selected) });
    if (!move.changed) return;
    boardRef.current = move.board;
    setBoard(move.board);
    setOwners(move.owners);
  };
  const reset = () => { boardRef.current = INITIAL; setBoard(INITIAL); setOwners({}); setSelected(1); setComputerJoined(false); moveIndex.current = 0; onStageChange('handle'); };

  return (
    <section
      ref={experienceRef}
      aria-label="Sudoku Together depth experience"
      className={`${styles.experience} ${styles.sudoku} ${styles.sudokuScene}`}
      data-computer-joined={computerJoined}
      data-depth-stage={stage}
      data-selected-cell={selected}
      data-selected-value={board[selected]}
      data-selected-given={GIVEN.has(selected)}
      data-scene-settled={scene.settled}
      data-reduced-motion={world.stimulation.reducedMotionRequested}
      style={sceneStyle}
    >
      <div className={styles.experienceArtwork} aria-hidden="true" data-layer="sudoku:matte">
        <Image src={ART_DIRECTION_ASSETS.sudoku.src} alt="" fill sizes="(max-width: 900px) 100vw, 1200px" />
      </div>
      <svg className={styles.sudokuTraceField} viewBox="0 0 1040 620" aria-hidden="true" data-layer="sudoku:sync-wave">
        <path d={getSudokuSyncPath(scene.selectedRow, scene.selectedColumn, scene.syncStrength)} className={styles.sudokuSyncPath} />
        {[0, 1, 2, 3].map(index => <path key={index} d={`M${160 + index * 170} 520 L${220 + index * 170} ${180 - index * 18}`} className={styles.sudokuBoundaryPath} />)}
      </svg>
      <div className={styles.rail}>
        <div className={styles.depthMarks} aria-label="Exhibit depth">{(['handle', 'enter', 'understand'] as const).map(item => <span key={item} data-active={stage === item}>{item}</span>)}</div>
        <button type="button" className={styles.textButton} onClick={reset}>Reset room</button>
      </div>

      {stage === 'handle' ? (
        <div className={`${styles.stage} ${styles.sudokuLayout}`}>
          <div>
            <p className={styles.eyebrow}>Handle / one board, two traces</p>
            <h3 className={styles.title}>A second presence changes the puzzle.</h3>
            <p className={styles.intro}>Place a number, then let the computer join. Its quiet mint trace and your coral trace share one board without pretending a real visitor is present.</p>
            <div className={styles.actions}>{!computerJoined ? <button type="button" className={styles.primaryAction} onClick={() => setComputerJoined(true)}>Invite the computer</button> : <button type="button" className={styles.primaryAction} onClick={() => onStageChange('enter')}>Enter the room boundary</button>}</div>
          </div>
          <div className={styles.boardInstrument} data-layer="sudoku:grid">
            <div className={styles.sudokuSelectionPlane} aria-hidden="true" />
            <div className={styles.board} role="grid" aria-label="Playable Sudoku sample">
              {board.map((value, index) => <button key={index} type="button" role="gridcell" aria-label={`Cell ${index + 1}${value ? ` value ${value}` : ''}`} className={styles.cell} data-given={GIVEN.has(index)} data-owner={owners[index]} data-selected={selected === index} onClick={() => setSelected(index)}>{value || ''}</button>)}
            </div>
            <div className={styles.numberRail} aria-label="Number input">{[1,2,3,4,5,6,7,8,9].map(number => <button key={number} type="button" aria-label={`Place ${number}`} data-number={number} className={styles.numberButton} onClick={() => placeNumber(number)}>{number}</button>)}</div>
            <div className={styles.presenceLine}><span className={styles.visitorPresence}>your trace</span><span className={styles.computerPresence}>{computerJoined ? 'computer is considering' : 'computer absent'}</span></div>
          </div>
        </div>
      ) : null}

      {stage === 'enter' || stage === 'understand' ? (
        <div className={`${styles.stage} ${styles.sudokuLayout}`}>
          <div className={styles.boardInstrument} data-layer="sudoku:grid">
            <div className={styles.sudokuSelectionPlane} aria-hidden="true" />
            <div className={styles.board} aria-hidden="true">{board.map((value, index) => <span key={index} className={styles.cell} data-given={GIVEN.has(index)} data-owner={owners[index]}>{value || ''}</span>)}</div>
            <div className={styles.presenceLine}><span className={styles.visitorPresence}>local intent</span><span className={styles.computerPresence}>shared version</span></div>
          </div>
          <div>
            <p className={styles.eyebrow}>{stage} / the iframe boundary</p>
            <h3 className={styles.title}>{stage === 'enter' ? 'The board crosses four precise boundaries.' : 'Multiplayer trust is a versioning problem.'}</h3>
            <div className={styles.architectureTrace} data-layer="sudoku:evidence">{ARCHITECTURE.map(([label, detail]) => <div key={label} className={styles.traceRow}><strong>{label}</strong><span>{detail}</span></div>)}</div>
            <div className={styles.actions}>
              {stage === 'enter' ? <button type="button" className={styles.primaryAction} onClick={() => onStageChange('understand')}>Inspect synchronization</button> : <a href="https://github.com/mpere056/Discord-Activity-Sudoku" className={styles.primaryAction}>Open source</a>}
              <a href={projectHref} className={styles.secondaryAction}>Enter Sudoku Together</a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
