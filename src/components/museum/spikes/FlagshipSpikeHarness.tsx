import LifeInboxSpike from './LifeInboxSpike';
import SudokuSpike from './SudokuSpike';

export default function FlagshipSpikeHarness() {
  return (
    <main className="min-h-screen bg-[#060706] px-4 py-20 text-white md:px-10">
      <header className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/45">Feasibility study / not a finished exhibit</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.045em] md:text-6xl">Two product truths, tested at equal depth.</h1>
      </header>
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-2">
        <LifeInboxSpike />
        <SudokuSpike />
      </div>
    </main>
  );
}

