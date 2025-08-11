interface Props {
  variant: 'home' | 'menu' | 'reservations' | 'ordering' | 'gallery'
}

export default function TemplateRestaurant({ variant }: Props) {
  return (
    <div className="bg-gradient-to-b from-rose-950/40 via-transparent to-transparent">
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-16">
        {variant === 'home' && (
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Taste the experience</h2>
            <p className="text-white/70">A refined restaurant landing page with menu highlights, reservations, and gallery sections.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button className="px-5 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-medium shadow">Book a Table</button>
              <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15">View Menu</button>
            </div>
          </section>
        )}

        {variant === 'menu' && (
          <section className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-semibold">Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-xl bg-white/[0.06] border border-white/10 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Signature Dish #{i}</div>
                      <p className="text-white/70 text-sm">Short description of ingredients and preparation.</p>
                    </div>
                    <div className="text-rose-300 font-semibold">$14.{i}0</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {variant === 'reservations' && (
          <section className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-semibold text-center">Reservations</h2>
            <div className="rounded-xl bg-white/[0.06] border border-white/10 p-5 grid gap-3 md:grid-cols-2">
              <input placeholder="Name" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
              <input placeholder="Email" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
              <input placeholder="Date" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
              <input placeholder="Time" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
              <input placeholder="Guests" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
              <button className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 font-medium">Book</button>
            </div>
          </section>
        )}

        {variant === 'ordering' && (
          <section className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-semibold">Online Ordering</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-xl bg-white/[0.06] border border-white/10 p-5 space-y-2">
                  <div className="font-semibold">Meal #{i}</div>
                  <p className="text-sm text-white/70">Tasty and fresh. Add customization here.</p>
                  <button className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-medium">Add to Cart</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {variant === 'gallery' && (
          <section className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-semibold">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-video rounded-lg bg-white/[0.06] border border-white/10" />
              ))}
            </div>
          </section>
        )}

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


