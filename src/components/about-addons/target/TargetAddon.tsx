'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AddonCommonProps } from '../types';

interface Target {
  id: number;
  x: number;
  y: number;
  type: 'static' | 'moving';
  velocityX?: number;
  velocityY?: number;
  timeLeft: number;
  hit: boolean;
}

interface Shot {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

const GAME_DURATION = 15000; // 15 seconds
const TARGET_LIFETIME = 1000; // 1 second per target
const SHOT_DURATION = 300; // shot effect duration
const TARGET_SIZE = 40;
const CONTAINER_WIDTH_DESKTOP = 600;
const CONTAINER_HEIGHT_DESKTOP = 400;
const CONTAINER_WIDTH_MOBILE = 280;
const CONTAINER_HEIGHT_MOBILE = 200;

export default function TargetAddon(_: AddonCommonProps) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const targetSpawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextTargetId = useRef(0);
  const nextShotId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef(gameState);
  const timeLeftRef = useRef(timeLeft);

  // Update refs whenever state changes
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper functions to get current container dimensions
  const getContainerWidth = useCallback(() => isMobile ? CONTAINER_WIDTH_MOBILE : CONTAINER_WIDTH_DESKTOP, [isMobile]);
  const getContainerHeight = useCallback(() => isMobile ? CONTAINER_HEIGHT_MOBILE : CONTAINER_HEIGHT_DESKTOP, [isMobile]);

  const spawnTarget = useCallback(() => {
    console.log('Attempting to spawn target, gameState:', gameStateRef.current);
    if (gameStateRef.current !== 'playing') return;

    const isMoving = Math.random() > 0.5; // 50% chance of moving target
    const margin = TARGET_SIZE;
    const containerWidth = getContainerWidth();
    const containerHeight = getContainerHeight();
    
    let x, y, velocityX = 0, velocityY = 0;
    
    if (isMoving) {
      // Spawn moving targets from edges
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0: // top
          x = Math.random() * (containerWidth - margin * 2) + margin;
          y = -TARGET_SIZE;
          velocityY = 120 + Math.random() * 60; // 120-180 px/s downward
          break;
        case 1: // right
          x = containerWidth + TARGET_SIZE;
          y = Math.random() * (containerHeight - margin * 2) + margin;
          velocityX = -(120 + Math.random() * 60); // 120-180 px/s leftward
          break;
        case 2: // bottom
          x = Math.random() * (containerWidth - margin * 2) + margin;
          y = containerHeight + TARGET_SIZE;
          velocityY = -(120 + Math.random() * 60); // 120-180 px/s upward
          break;
        case 3: // left
          x = -TARGET_SIZE;
          y = Math.random() * (containerHeight - margin * 2) + margin;
          velocityX = 120 + Math.random() * 60; // 120-180 px/s rightward
          break;
        default:
          x = margin;
          y = margin;
      }
    } else {
      // Static targets spawn randomly inside
      x = Math.random() * (containerWidth - margin * 2) + margin;
      y = Math.random() * (containerHeight - margin * 2) + margin;
    }

    const newTarget: Target = {
      id: nextTargetId.current++,
      x,
      y,
      type: isMoving ? 'moving' : 'static',
      velocityX,
      velocityY,
      timeLeft: TARGET_LIFETIME,
      hit: false,
    };

    console.log('Spawning target:', newTarget);
    setTargets(prev => {
      const updated = [...prev, newTarget];
      console.log('Updated targets array:', updated);
      return updated;
    });
  }, [getContainerWidth, getContainerHeight]);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setTargets([]);
    setShots([]);
    nextTargetId.current = 0;
    nextShotId.current = 0;

    // Spawn first target immediately
    setTimeout(spawnTarget, 100);

    // Game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          setGameState('finished');
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    // Target spawning timer with gradually increasing spawn rate
    let spawnCount = 0;
    const scheduleNextSpawn = () => {
      // Calculate progress through the game (0 to 1)
      const gameProgress = Math.max(0, (GAME_DURATION - timeLeftRef.current) / GAME_DURATION);
      
      // Base delay: 0.4-0.8 seconds at start
      // End delay: 0.2-0.4 seconds at end (2x faster)
      const baseMinDelay = 400;
      const baseMaxDelay = 800;
      const endMinDelay = 200;
      const endMaxDelay = 400;
      
      const currentMinDelay = baseMinDelay - (baseMinDelay - endMinDelay) * gameProgress;
      const currentMaxDelay = baseMaxDelay - (baseMaxDelay - endMaxDelay) * gameProgress;
      const randomRange = currentMaxDelay - currentMinDelay;
      
      const delay = currentMinDelay + Math.random() * randomRange;
      
      targetSpawnTimerRef.current = setTimeout(() => {
        console.log('Spawn timer triggered, spawn count:', spawnCount++, 'delay:', Math.round(delay), 'progress:', Math.round(gameProgress * 100) + '%');
        spawnTarget();
        // Continue spawning while game is active
        scheduleNextSpawn();
      }, delay);
    };
    scheduleNextSpawn();
  }, [spawnTarget, gameState]);

  const handleShoot = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add shot effect
    const shot: Shot = {
      id: nextShotId.current++,
      x,
      y,
      opacity: 1,
    };
    setShots(prev => [...prev, shot]);

    // Fade out shot effect
    setTimeout(() => {
      setShots(prev => prev.filter(s => s.id !== shot.id));
    }, SHOT_DURATION);

    // Check for target hits
    setTargets(prev => prev.map(target => {
      if (target.hit) return target;
      
      const dx = target.x - x;
      const dy = target.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= TARGET_SIZE / 2) {
        setScore(s => s + (target.type === 'moving' ? 4 : 2)); // Moving targets worth 4 points, static worth 2
        return { ...target, hit: true };
      }
      return target;
    }));
  }, [gameState]);

  // Update targets (movement, lifetime)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTargets(prev => prev
        .map(target => {
          if (target.hit) return target;
          
          let newX = target.x;
          let newY = target.y;
          
          if (target.type === 'moving') {
            newX += (target.velocityX || 0) * 0.016; // ~60fps
            newY += (target.velocityY || 0) * 0.016;
          }
          
          return {
            ...target,
            x: newX,
            y: newY,
            timeLeft: target.timeLeft - 16,
          };
        })
        .filter(target => 
          target.timeLeft > 0 && 
          target.x > -TARGET_SIZE && 
          target.x < getContainerWidth() + TARGET_SIZE &&
          target.y > -TARGET_SIZE && 
          target.y < getContainerHeight() + TARGET_SIZE
        )
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [gameState, getContainerWidth, getContainerHeight]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (targetSpawnTimerRef.current) clearTimeout(targetSpawnTimerRef.current);
    };
  }, []);

  // Stop timers when game ends
  useEffect(() => {
    if (gameState === 'finished' || gameState === 'idle') {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (targetSpawnTimerRef.current) clearTimeout(targetSpawnTimerRef.current);
    }
  }, [gameState]);

  return (
    <div className="mx-auto w-full max-w-[640px] px-2 sm:px-4">
      <div className="relative overflow-hidden rounded-xl bg-transparent shadow-xl backdrop-blur">
        {/* Game Container */}
        <div 
          ref={containerRef}
          className="relative cursor-crosshair select-none"
          style={{ width: getContainerWidth(), height: getContainerHeight() }}
          onClick={handleShoot}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px]" />
          </div>

          {/* Targets */}
          {console.log('Rendering targets:', targets.length, targets)}
          {targets.map(target => (
            <div
              key={target.id}
              className={`absolute transition-opacity duration-200 ${
                target.hit ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                left: target.x - TARGET_SIZE / 2,
                top: target.y - TARGET_SIZE / 2,
                width: TARGET_SIZE,
                height: TARGET_SIZE,
              }}
            >
              {/* Target rings */}
              <div className="relative h-full w-full">
                <div className="absolute inset-0 rounded-full bg-red-500 border-2 border-red-700" />
                <div className="absolute inset-2 rounded-full bg-white border border-red-300" />
                <div className="absolute inset-4 rounded-full bg-red-400 border border-red-600" />
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-800" />
                
                {/* Moving target indicator */}
                {target.type === 'moving' && (
                  <div className="absolute -inset-1 animate-pulse rounded-full border-2 border-yellow-400" />
                )}
              </div>
            </div>
          ))}

          {/* Shot effects */}
          {shots.map(shot => (
            <div
              key={shot.id}
              className="absolute pointer-events-none animate-ping"
              style={{
                left: shot.x - 8,
                top: shot.y - 8,
                width: 16,
                height: 16,
              }}
            >
              <div className="h-full w-full rounded-full bg-yellow-400 opacity-75" />
            </div>
          ))}

          {/* Game UI Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between text-white">
            <div className="rounded bg-black/50 px-3 py-1 text-sm font-medium backdrop-blur">
              Score: {score}
            </div>
            {gameState === 'playing' && (
              <div className="rounded bg-black/50 px-3 py-1 text-sm font-medium backdrop-blur">
                Time: {Math.ceil(timeLeft / 1000)}s
              </div>
            )}
          </div>

          {/* Start/Restart Button */}
          {gameState !== 'playing' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="text-center">
                {gameState === 'finished' && (
                  <div className="mb-4 text-white">
                    <div className="text-3xl font-bold mb-2">Game Over!</div>
                    <div className="text-xl">Final Score: {score}</div>
                    <div className="text-sm opacity-75 mt-1">
                      (Moving targets = 4pts, Static targets = 2pt)
                    </div>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="rounded-lg bg-blue-950 hover:bg-blue-800 active:bg-green-800 px-6 py-3 text-white font-medium shadow-lg transition-colors"
                >
                  {gameState === 'idle' ? 'Start Game' : 'Play Again'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-3 text-center text-xs text-blue-200 bg-blue-900/30">
          <span className="ml-2 opacity-75">Moving targets = 8pts</span>
          <br />
          <span className="ml-2 opacity-75">Static targets = 4pts</span>
        </div>
      </div>
    </div>
  );
}
