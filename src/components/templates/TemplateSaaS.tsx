export default function TemplateSaaS() {
  return (
    <div className="bg-gradient-to-b from-violet-950/40 via-transparent to-transparent">
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-16">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">Launch faster with our modern SaaS template</h2>
          <p className="text-white/70">Beautiful, responsive, and production-ready UI sections to validate your idea and start selling.</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button className="px-5 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white font-medium shadow">Get Started</button>
            <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15">Live Demo</button>
          </div>
        </section>

        <section className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Analytics', 'Billing', 'Authentication'].map((k, i) => (
            <div key={k} className="rounded-xl bg-white/[0.06] border border-white/10 p-5">
              <div className="text-violet-300 font-semibold">{k}</div>
              <p className="text-sm text-white/70 mt-2">Plug-and-play sections for common SaaS needs. Built with accessibility and performance in mind.</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}


