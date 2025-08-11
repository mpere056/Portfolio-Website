interface Props {
  variant: 'landing' | 'services' | 'booking' | 'about' | 'locations'
}

export default function TemplateTrades({ variant }: Props) {
  return (
    <div className="bg-gradient-to-b from-sky-950/40 via-transparent to-transparent">
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-16">
        {variant === 'landing' && (
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Reliable trades & home services</h2>
            <p className="text-white/70">Showcase services, certifications, service areas, and quick booking.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium shadow">Get a Quote</button>
              <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15">See Services</button>
            </div>
          </section>
        )}

        {variant === 'services' && (
          <section className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-semibold">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {['Electrical Safety Inspection', 'Panel Upgrade', 'Fixture Installation'].map((svc) => (
                <div key={svc} className="rounded-xl bg-white/[0.06] border border-white/10 p-5">
                  <div className="font-semibold">{svc}</div>
                  <p className="text-sm text-white/70 mt-1">Short summary of service scope, timelines, and benefits.
                  </p>
                  <button className="mt-3 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 font-medium">Request Quote</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {variant === 'booking' && (
          <section className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-semibold text-center">Book a Service</h2>
            <div className="rounded-xl bg-white/[0.06] border border-white/10 p-5 grid gap-3 md:grid-cols-2">
              <input placeholder="Name" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
              <input placeholder="Email" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
              <input placeholder="Phone" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
              <select className="px-3 py-2 rounded-lg bg-black/30 border border-white/10">
                <option>Service Type</option>
              </select>
              <input placeholder="Preferred Date" className="px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
              <button className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 font-medium">Submit</button>
            </div>
          </section>
        )}

        {variant === 'about' && (
          <section className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-semibold">About Us</h2>
            <div className="rounded-xl bg-white/[0.06] border border-white/10 p-6">
              <p className="text-white/80">Brief company intro, years of experience, certifications, and customer-first values.
              </p>
            </div>
          </section>
        )}

        {variant === 'locations' && (
          <section className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-semibold">Service Areas</h2>
            <div className="rounded-xl bg-white/[0.06] border border-white/10 p-6 space-y-4">
              <div className="flex gap-3">
                <input placeholder="Enter postal code" className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/10" />
                <button className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 font-medium">Check</button>
              </div>
              <div className="text-sm text-white/70">Example: show whether the postal code is inside coverage and closest branch info.</div>
            </div>
          </section>
        )}

        <section className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Licensed & Insured', 'Upfront Pricing', 'Emergency Support'].map((k) => (
            <div key={k} className="rounded-xl bg-white/[0.06] border border-white/10 p-5">
              <div className="text-sky-300 font-semibold">{k}</div>
              <p className="text-sm text-white/70 mt-2">Trust-building highlights; link to details.
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}


