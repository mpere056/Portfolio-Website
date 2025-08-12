import { Montserrat, Open_Sans } from 'next/font/google';

const gymHead = Montserrat({ subsets: ['latin'], weight: ['700','800','900'], variable: '--font-gym-head' });
const gymBody = Open_Sans({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-gym-body' });

interface Props {
  variant: 'home' | 'pricing' | 'schedule' | 'trainers' | 'stories'
}

export default function TemplateGym({ variant }: Props) {
  if (variant === 'home') return <GymHomeLanding />;

  return (
    <div className="bg-gradient-to-b from-emerald-950/40 via-transparent to-transparent">
      <div className="px-6 md:px-10 lg:px-14 py-10 md:py-16">
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


function GymHomeLanding() {
  return (
    <div className={`bg-white text-neutral-900 ${gymBody.className}`}>
      <GymNav />
      <GymHero />
      <MembershipStrip />
      <SecondaryHero />
      <WelcomeStats />
      <FitnessClasses />
      <ClassesCTA />
      <GymFooter />
    </div>
  );
}

function GymNav() {
  return (
    <header className="sticky top-0 z-30 bg-red-700 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-12 flex items-center justify-between">
        <div className={`font-black tracking-wide ${gymHead.className}`}>Your Gym</div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {['Membership','Clubs','Classes','Training','Blog','About'].map(i => (
            <a key={i} href="#" className="hover:opacity-90">{i}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden md:inline-flex px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-sm">Become a Member</button>
          <button className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-sm">Log in</button>
        </div>
      </div>
    </header>
  );
}

function GymHero() {
  return (
    <section className="relative h-[68vh] min-h-[520px]">
      <img src="/images/fitness/hero_image.jpg" alt="Gym hero" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
        <h1 className={`text-white uppercase leading-[0.95] tracking-tight text-4xl md:text-7xl font-black ${gymHead.className}`}>LIVE YOUR BEST LIFE</h1>
      </div>
    </section>
  );
}

function MembershipStrip() {
  return (
    <>
    <section className="relative text-white">
    <div className="bg-red-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 text-center">
        <div className={`uppercase tracking-wider text-sm ${gymHead.className}`}>Proudly Canadian since 1998</div>
        <h2 className={`mt-3 text-2xl md:text-4xl font-black ${gymHead.className}`}>Memberships that power your fitness</h2>
      </div>
      </div>
      {/* Red chevron pointer */}
      <div className="w-full h-20 bg-red-700 -mt-px"
      style={{clipPath:'polygon(0 0,100% 0,100% 60%,50% 100%,0 60%)', WebkitClipPath:'polygon(0 0,100% 0,100% 60%,50% 100%,0 60%)'}} />
    </section>
    <div className="bg-white text-neutral-900">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto items-start md:pl-28">
            <ul className="space-y-3 text-[15px] md:pl-12">
              {['10+ clubs','Fitness classes','Personal training','Premium equipment','Court sports'].map(x => (
                <li key={x} className="flex items-start gap-2"><span className="text-red-600">✔</span> <span>{x}</span></li>
              ))}
            </ul>
            <ul className="space-y-3 text-[15px]">
              {['Recovery & sauna','Small-group training','On-demand workouts','and much more'].map(x => (
                <li key={x} className="flex items-start gap-2"><span className="text-red-600">✔</span> <span>{x}</span></li>
              ))}
            </ul>
          </div>
          <div className="text-center mt-10">
            <button className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-sm">Explore membership options</button>
          </div>
        </div>
      </div>
    </>
  );
}

function SecondaryHero() {
  return (
    <section
      className="relative h-[46vh] min-h-[360px]"
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 84%, 0 100%)', WebkitClipPath: 'polygon(0 0, 100% 0, 100% 84%, 0 100%)' }}
    >
      <img src="/images/fitness/2nd_section.jpg" alt="Gym secondary" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/20" />
    </section>
  );
}

function WelcomeStats() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 text-center">
      <h3 className="uppercase font-black tracking-tight leading-tight text-3xl md:text-5xl">
        A PLACE WHERE <span className="text-purple-600">EVERYONE</span> FEELS
        <br className="hidden md:block" />
        WELCOME
      </h3>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          ['Best value in Ottawa','High quality experience at an affordable cost.'],
          ['Tons of equipment','Cardio and strength equipment in a clean environment.'],
          ['Many locations','Multiple clubs to choose from.'],
        ].map(([t,s]) => (
          <div key={t} className="space-y-3">
            <div className="mx-auto h-10 w-10 rounded-full bg-purple-600/20 text-purple-700 grid place-items-center text-base">★</div>
            <div className="font-semibold text-lg">{t}</div>
            <p className="text-sm text-neutral-700 max-w-sm mx-auto">{s}</p>
            <a href="#" className="inline-block text-purple-700 hover:underline text-sm font-medium">Learn More</a>
          </div>
        ))}
      </div>
    </section>
  );
}

function FitnessClasses() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
      <div className="text-center">
  <h3 className="text-2xl md:text-3xl font-extrabold relative inline-block">
    FITNESS CLASSES
    <span className="block w-12 h-[3px] bg-red-600 mx-auto mt-3"></span>
  </h3>
  <p className="mt-5 text-neutral-700 max-w-xl mx-auto leading-relaxed">
    With 120+ classes to choose from,<br />
    there’s a class for everyone.
  </p>
</div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:[&>*:nth-child(2)]:mt-10 md:[&>*:nth-child(4)]:mt-10">
        <div className="w-full">
          <ClassCard title="CARDIO" img="/images/fitness/cardio.jpg" />
        </div>
        <div className="w-full">
          <ClassCard title="MIND & BODY" img="/images/fitness/mind_body.jpg" />
        </div>
        <div className="w-full">
          <ClassCard title="STRENGTH" img="/images/fitness/strength.jpg" />
        </div>
        <div className="w-full">
          <ClassCard title="CYCLING" img="/images/fitness/cycling.jpg" />
        </div>
      </div>
    </section>
  );
}

function ClassCard({ title, img }: { title: string; img: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden grid grid-cols-1 sm:grid-cols-2">
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="text-lg font-extrabold">{title}</div>
          <p className="text-sm text-neutral-700 mt-1">Get moving. High energy, great results.</p>
        </div>
        <button className="mt-4 w-fit px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-sm">Class schedule</button>
      </div>
      <div
  className="relative min-h-[260px] md:min-h-[300px] overflow-hidden"
  style={{
    clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0% 100%)',
    WebkitClipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0% 100%)'
  }}
>
  <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover" />
</div>
    </div>
  );
}

function ClassesCTA() {
  return (
    <div className="text-center py-8">
      <button className="px-5 py-2 rounded bg-neutral-900 hover:bg-neutral-800 text-white">Learn more about classes</button>
    </div>
  );
}

function GymFooter() {
  return (
    <footer className="bg-neutral-900 text-white/80">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-6 gap-6 text-sm">
        {[
          ['MEMBERSHIP',['Join YourGym', 'Log in to my account','Corporate membership','Teen Fitness']],
          ['CLASSES & TRAINING',['Book a class','Find a class','Find training programs','On-Demand Workouts']],
          ['CLUBS',['Find a club','Coming soon']],
          ['WOMEN',['Find classes for women','Find training for women','Find clubs for women']],
          ['CAREERS',['Become a Trainer','Become an Instructor','Join our team']],
          ['YourGym',['About YourGym', 'Contact us','FAQ','Blog']]
        ].map(([h, items]: any) => (
          <div key={h}>
            <div className="text-white font-semibold mb-2">{h}</div>
            <ul className="space-y-1">
              {items.map((t: string) => (
                <li key={t}><a href="#" className="hover:underline">{t}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

