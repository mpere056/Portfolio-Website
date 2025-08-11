export default function TemplateRestaurant() {
  return (
    <div className="bg-gradient-to-b from-rose-950/40 via-transparent to-transparent">
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-16">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Taste the experience</h2>
          <p className="text-white/70">A refined restaurant landing page with menu highlights, reservations, and gallery sections.</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button className="px-5 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-medium shadow">Book a Table</button>
            <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15">View Menu</button>
          </div>
        </section>

        <section className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Seasonal Menu', 'Chef’s Picks', 'Private Events'].map((k) => (
            <div key={k} className="rounded-xl bg-white/[0.06] border border-white/10 p-5">
              <div className="text-rose-300 font-semibold">{k}</div>
              <p className="text-sm text-white/70 mt-2">Designed to showcase vibrant imagery and convert visitors to reservations.</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}


