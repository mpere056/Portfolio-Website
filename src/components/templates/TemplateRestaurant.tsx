import Image from 'next/image';

interface Props {
  variant: 'home' | 'menu' | 'reservations' | 'ordering' | 'gallery'
}

export default function TemplateRestaurant({ variant }: Props) {
  return (
    <div className="bg-[#0e0d11]">
      <div className="px-6 md:px-8 lg:px-12 py-10 md:py-16 space-y-20 md:space-y-28">
        {variant === 'home' && (
          <>
            <HeroBanner />
            <HallOfFame />
            <MenuHero />
            <PrivateEvents />
          </>
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

function HeroBanner() {
  return (
    <section className="relative rounded-xl overflow-hidden border border-white/10">
      <div className="aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4] bg-gradient-to-b from-black/40 to-black/60">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div className="text-xs tracking-[0.35em] text-white/70">WELCOME TO</div>
        <h1 className="mt-3 text-3xl md:text-5xl lg:text-6xl font-semibold">CANADA&apos;S RESTAURANT</h1>
        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 rounded-md bg-rose-500 hover:bg-rose-400 text-white font-medium">Reservations</button>
          <button className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15">Locations</button>
        </div>
      </div>
    </section>
  );
}

function HallOfFame() {
  const items = [
    {
      title: 'Cozy Café Corner',
      text: 'Relax with a warm drink in a charming, intimate café setting.',
      img: encodeURI('/images/restaurant/Cozy Café Corner.jpg'),
    },
    {
      title: 'Steak & Herb Feast',
      text: 'Perfectly cooked steak served with pasta, fresh herbs, and artisan bread.',
      img: encodeURI('/images/restaurant/Steak & Herb Feast.jpg'),
    },
    {
      title: 'Korean-Inspired Banquet',
      text: 'A vibrant spread of traditional dishes, brimming with rich flavors and textures.',
      img: encodeURI('/images/restaurant/Korean-Inspired Banquet.jpg'),
    },
  ];
  return (
    <section className="max-w-6xl mx-auto">
      <h3 className="text-xs tracking-[0.3em] text-white/60">HALL OF FAME</h3>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((it, idx) => (
          <article
            key={it.title}
            className="group rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)] card-edge"
          >
            <div className="relative aspect-[4/3]">
              <Image src={it.img} alt={it.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>
            <div className="p-5">
              <h4 className="font-semibold text-white tracking-tight">{it.title}</h4>
              <p className="text-sm text-white/70 mt-1.5 leading-relaxed">{it.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MenuHero() {
  return (
    <section className="relative max-w-6xl mx-auto rounded-xl overflow-hidden border border-white/10">
      <div className="aspect-[16/7] bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs tracking-[0.3em] text-white/70">MENU</div>
          <h3 className="mt-3 text-3xl md:text-5xl font-semibold">OUR STEAKHOUSE<br/>CLASSICS</h3>
          <button className="mt-6 px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15">VIEW OUR MENU</button>
        </div>
      </div>
    </section>
  );
}

function PrivateEvents() {
  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <div className="text-xs tracking-[0.3em] text-white/60">PRIVATE EVENTS, A CUT ABOVE THE REST.</div>
        <h3 className="text-3xl md:text-5xl font-semibold text-emerald-200">MEET.<br/>CELEBRATE.<br/>GATHER.</h3>
        <p className="text-white/80">Beautiful private spaces and dining rooms, flexible package options, and top‑notch S&W service. Expect the exceptional.</p>
        <button className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 w-fit">EXPLORE EVENT SPACES</button>
      </div>
      <div className="rounded-xl overflow-hidden border border-white/10">
        <div className="aspect-[4/3] bg-white/[0.06]" />
      </div>
    </section>
  );
}


