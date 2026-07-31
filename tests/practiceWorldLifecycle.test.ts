import { describe, expect, it, vi } from 'vitest';
import {
  createPracticeWorldRegistry,
  createPracticeWorldRuntimeHost,
  createPracticeWorldState,
  practiceWorldDiagnosticsEnabled,
  practiceWorldDraftHref,
  reducePracticeWorld,
  type PracticeWorldModule,
  type PracticeWorldRuntime,
} from '@/lib/experience/practiceWorldLifecycle';

function moduleFor(
  id: PracticeWorldModule['id'],
  runtime?: PracticeWorldRuntime,
): PracticeWorldModule {
  return {
    id,
    previewLayers: ['signal', 'contact', 'path', 'horizon'],
    selectedLayers: ['environment', 'landmarks'],
    anchors: {
      instrument: 'practice-instrument',
      piano: 'piano',
      river: 'river',
      horizon: 'horizon',
    },
    budget: {
      maxDrawCalls: 8,
      maxContinuousSchedulers: 1,
      maxFullScreenPasses: 0,
    },
    createRuntime: vi.fn(() => runtime as PracticeWorldRuntime),
  };
}

describe('practice world lifecycle', () => {
  it('starts with exact neutral ownership and no pending world', () => {
    expect(createPracticeWorldState()).toEqual({
      phase: 'neutral',
      owner: null,
      attention: null,
      pendingOwner: null,
      transition: 0,
    });
  });

  it('allows only one preview owner and releases only the matching source', () => {
    const music = reducePracticeWorld(createPracticeWorldState(), {
      type: 'attend',
      id: 'music-performance',
      source: 'pointer',
    });
    const life = reducePracticeWorld(music, {
      type: 'attend',
      id: 'life-systems-tools',
      source: 'focus',
    });
    const staleRelease = reducePracticeWorld(life, {
      type: 'release',
      id: 'music-performance',
      source: 'pointer',
    });
    const neutral = reducePracticeWorld(staleRelease, {
      type: 'release',
      id: 'life-systems-tools',
      source: 'focus',
    });

    expect(life.owner).toBe('life-systems-tools');
    expect(staleRelease).toBe(life);
    expect(neutral.phase).toBe('neutral');
    expect(neutral.owner).toBeNull();
  });

  it('keeps semantic selection authoritative over later hover', () => {
    const selected = reducePracticeWorld(createPracticeWorldState(), {
      type: 'select',
      id: 'play-community',
    });
    const hovered = reducePracticeWorld(selected, {
      type: 'attend',
      id: 'music-performance',
      source: 'pointer',
    });

    expect(hovered).toBe(selected);
    expect(hovered.owner).toBe('play-community');
  });

  it('retreats to neutral and switches selected owners in two bounded steps', () => {
    const selected = reducePracticeWorld(createPracticeWorldState(), {
      type: 'select',
      id: 'music-performance',
    });
    const retreat = reducePracticeWorld(selected, { type: 'retreat' });
    const neutral = reducePracticeWorld(retreat, { type: 'retreat-complete' });
    const selectedAgain = reducePracticeWorld(selected, {
      type: 'select',
      id: 'life-systems-tools',
    });
    const switched = reducePracticeWorld(selectedAgain, { type: 'retreat-complete' });

    expect(retreat.phase).toBe('retreat');
    expect(retreat.owner).toBe('music-performance');
    expect(neutral.phase).toBe('neutral');
    expect(neutral.owner).toBeNull();
    expect(selectedAgain.pendingOwner).toBe('life-systems-tools');
    expect(switched.phase).toBe('selected');
    expect(switched.owner).toBe('life-systems-tools');
  });

  it('does not load or create hidden runtimes before explicit demand', async () => {
    const world = moduleFor('music-performance');
    const loader = vi.fn(async () => world);
    const registry = createPracticeWorldRegistry({
      'music-performance': loader,
    });

    expect(registry.status('music-performance')).toBe('idle');
    expect(registry.status('play-community')).toBe('unavailable');
    expect(loader).not.toHaveBeenCalled();

    const first = await registry.load('music-performance');
    const second = await registry.load('music-performance');

    expect(first).toBe(world);
    expect(second).toBe(world);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(world.createRuntime).not.toHaveBeenCalled();
    expect(registry.status('music-performance')).toBe('ready');
  });

  it('owns at most one runtime and reuses it across preview depth', () => {
    const runtime: PracticeWorldRuntime = {
      id: 'music-performance',
      setPhase: vi.fn(),
      retreat: vi.fn(),
      dispose: vi.fn(),
    };
    const music = moduleFor('music-performance', runtime);
    const life = moduleFor('life-systems-tools', {
      ...runtime,
      id: 'life-systems-tools',
    });
    const host = createPracticeWorldRuntimeHost();
    const context = {
      canvas: {} as HTMLCanvasElement,
      reducedMotion: false,
    };

    expect(host.runtimeCount()).toBe(0);
    host.activate(music, context, 'preview');
    host.activate(music, context, 'selected');

    expect(host.activeId()).toBe('music-performance');
    expect(host.runtimeCount()).toBe(1);
    expect(music.createRuntime).toHaveBeenCalledTimes(1);
    expect(runtime.setPhase).toHaveBeenNthCalledWith(1, 'preview');
    expect(runtime.setPhase).toHaveBeenNthCalledWith(2, 'selected');
    expect(() => host.activate(life, context, 'preview'))
      .toThrow(/music-performance owns the practice world/);
  });

  it('disposes deterministically after retreat, including failed retreat', async () => {
    const dispose = vi.fn();
    const runtime: PracticeWorldRuntime = {
      id: 'music-performance',
      setPhase: vi.fn(),
      retreat: vi.fn(async () => {
        throw new Error('retreat interrupted');
      }),
      dispose,
    };
    const host = createPracticeWorldRuntimeHost();
    host.activate(moduleFor('music-performance', runtime), {
      canvas: {} as HTMLCanvasElement,
      reducedMotion: false,
    }, 'preview');

    await expect(host.retreatAndDispose('music-performance'))
      .rejects.toThrow('retreat interrupted');
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(host.activeId()).toBeNull();
    expect(host.runtimeCount()).toBe(0);
  });

  it('keeps diagnostics development-only and exposes the draft route family', () => {
    expect(practiceWorldDiagnosticsEnabled('development', '?worldDebug=1')).toBe(true);
    expect(practiceWorldDiagnosticsEnabled('production', '?worldDebug=1')).toBe(false);
    expect(practiceWorldDiagnosticsEnabled('development', '')).toBe(false);
    expect(practiceWorldDraftHref('life-systems-tools'))
      .toBe('/work/life-systems-tools');
  });
});
