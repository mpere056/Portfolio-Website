export default function TemplateGym() {
  return (
    <div className="bg-gradient-to-b from-emerald-950/40 via-transparent to-transparent">
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-16">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Strong brand, stronger results</h2>
          <p className="text-white/70">Promote classes, trainers, and memberships with bold typography and high-contrast CTAs.</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-medium shadow">Join Now</button>
            <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15">View Classes</button>
          </div>
        </section>

        <section className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Personal Training', 'Group Sessions', 'Nutrition'].map((k) => (
            <div key={k} className="rounded-xl bg-white/[0.06] border border-white/10 p-5">
              <div className="text-emerald-300 font-semibold">{k}</div>
              <p className="text-sm text-white/70 mt-2">Optimized for quick contact and trial sign-ups.
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}


