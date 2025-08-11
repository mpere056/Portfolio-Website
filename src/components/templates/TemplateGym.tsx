interface Props {
  variant: 'home' | 'pricing' | 'schedule' | 'trainers' | 'stories'
}

export default function TemplateGym({ variant }: Props) {
  return (
    <div className="bg-gradient-to-b from-emerald-950/40 via-transparent to-transparent">
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-16">
        {variant === 'home' && (
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Strong brand, stronger results</h2>
            <p className="text-white/70">Promote classes, trainers, and memberships with bold typography and high-contrast CTAs.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-medium shadow">Join Now</button>
              <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15">View Classes</button>
            </div>
          </section>
        )}

        {variant === 'pricing' && (
          <section className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-semibold text-center">Membership Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {['Basic', 'Pro', 'Elite'].map((plan, i) => (
                <div key={plan} className="rounded-xl bg-white/[0.06] border border-white/10 p-6 text-center">
                  <div className="text-emerald-300 font-semibold">{plan}</div>
                  <div className="text-3xl font-bold mt-2">${(i + 1) * 19}<span className="text-base font-medium text-white/70">/mo</span></div>
                  <button className="mt-4 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 font-medium">Choose</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {variant === 'schedule' && (
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-semibold">Schedule & Booking</h2>
            <div className="mt-4 rounded-xl bg-white/[0.06] border border-white/10 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-black/30 border border-white/10 p-4">
                  <div className="font-semibold">Class #{i + 1}</div>
                  <div className="text-sm text-white/70">Mon/Wed/Fri · 6:00 PM</div>
                  <button className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 font-medium">Book</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {variant === 'trainers' && (
          <section className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-semibold">Trainers & Coaches</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-white/[0.06] border border-white/10 p-4">
                  <div className="aspect-square rounded-md bg-black/30 mb-3" />
                  <div className="font-semibold">Coach {i + 1}</div>
                  <div className="text-sm text-white/70">Strength · Conditioning</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {variant === 'stories' && (
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-semibold">Success Stories</h2>
            <div className="space-y-4 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white/[0.06] border border-white/10 p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="aspect-video rounded-md bg-black/30" />
                  <div className="md:col-span-2">
                    <div className="font-semibold">Member Transformation #{i + 1}</div>
                    <p className="text-sm text-white/70">Brief narrative about goals, program, and results.</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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


