import Image from 'next/image';
import { Montserrat, Open_Sans } from 'next/font/google';

// Dedicated, modern fonts for the Trades template
const tradesHead = Montserrat({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-trades-head' });
const tradesBody = Open_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-trades-body' });

interface Props {
  variant: 'landing' | 'services' | 'booking' | 'about' | 'locations'
}

export default function TemplateTrades({ variant }: Props) {
  return (
    <div className={`bg-white text-neutral-900 ${tradesBody.className}`}>
      {variant === 'landing' && <TradesHomeLanding />}
    </div>
  );
}


function TradesHomeLanding() {
  return (
    <div className="relative">
      <HeroSection />
      <BrandSolutions />
      <ReviewsStrip />
      <InstallationsSection />
      <ConsultCTA />
      <ContactFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full h-[82vh] md:h-[90vh] min-h-[620px]">
      <Image src="/images/trades/hero_image.jpg" alt="Hero" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/60" />
      {/* Badge overlay (Canadian products / family business) */}
      <div className="pointer-events-none absolute right-[6%] top-1/2 -translate-y-1/2 hidden md:block">
        <Image src="/images/canada_icon.png" alt="Canadian products preferred • family business" width={220} height={220} className="opacity-90 drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)]" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto h-full px-6 md:px-10 lg:px-14 flex flex-col justify-center">
        <h1 className={`text-white text-3xl md:text-5xl font-extrabold tracking-tight ${tradesHead.className}`}>Trades & Home Services</h1>
        <p className="text-white/80 mt-2">Expert residential and commercial services, delivered reliably.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GreenPill>Free Quote</GreenPill>
          <GreenPill>Service Request</GreenPill>
        </div>
      </div>
      {/* Curved divider at bottom to better match reference */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[160px] text-white"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,120 C480,90 960,90 1440,120 L1440,160 L0,160 Z"

        />
      </svg>
    </section>
  );
}

function BrandSolutions() {
  return (
    <section className="relative bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 md:px-10 lg:px-14 py-12 md:py-16">
        <div>
          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 ${tradesHead.className}`}>Solutions For Every Need</h2>
          <p className="mt-3 text-neutral-700 text-sm leading-relaxed">
            From small fixes to full installations, this template showcases how your business can support a wide range of services and equipment with
            professional workmanship and clear communication.
          </p>
          <ul className="mt-4 space-y-2 text-neutral-700 text-sm list-disc list-inside">
            <li>Code‑compliant installations and upgrades</li>
            <li>Residential and commercial projects</li>
            <li>Material sourcing, cleanup, and follow‑up support</li>
          </ul>
          <button className="mt-5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium">Request a Free Quote</button>
        </div>
        <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
          <Image src="/images/trades/2nd_image.jpg" alt="Showcase" fill className="object-cover" />
        </div>
      </div>
      <div className="h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 transform skew-y-1" />
    </section>
  );
}

function ReviewsStrip() {
  const reviews = [
    {
      name: 'Bruce Levitt',
      text: 'Did a quick, clean professional job.',
      date: '2025-01-10',
    },
    {
      name: 'john toreli',
      text: 'Very professional company to deal with',
      date: '2025-01-09',
    },
    {
      name: 'miro vukojavic',
      text: 'The electrician I worked with was great. Would recommend.',
      date: '2025-01-09',
    },
  ];
  return (
    <section className="relative bg-neutral-900 text-white">
      {/* angled green header stripe */}
      <div className="absolute -top-6 left-0 w-full h-8 bg-emerald-600 transform -skew-y-3 origin-top" />
      {/* thin white edge above content */}
      <div className="absolute top-0 left-0 w-full h-6 bg-white transform -skew-y-2 origin-top" />

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-14 py-10 md:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
          {/* Company badge */}
          <div className="rounded-lg bg-white/5 border border-white/10 p-4 h-full min-h-[200px] flex flex-col">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-white/20 grid place-items-center text-xs font-bold">TEW</div>
              <div>
                <div className="text-sm font-medium">Your Company Name</div>
                <div className="text-amber-400 text-sm leading-none mt-1">★★★★★</div>
                <div className="text-xs text-white/70 mt-1">100+ Google reviews</div>
              </div>
            </div>
            <button className="mt-3 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 text-sm">Write a review</button>
          </div>

          {reviews.map((r, i) => (
            <div key={i} className="rounded-lg bg-white/5 border border-white/10 p-4 min-h-[200px] flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20" />
                  <div className="text-sm font-medium capitalize">{r.name}</div>
                </div>
                <Image src="/images/google_logo.png" alt="Google" width={20} height={20} className="opacity-90" />
              </div>
              <div className="text-amber-400 text-sm mt-2">★★★★★</div>
              <div className="mt-2 text-sm line-clamp-3">{r.text}</div>
              <div className="mt-2 text-xs text-white/70">↪ Owner&apos;s reply</div>
              <div className="text-xs text-white/60 mt-1">Read more</div>
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-white/70 mt-4">Showing our latest reviews</div>
      </div>

      {/* white angled footer edge */}
      <div className="absolute bottom-0 left-0 w-full h-6 bg-white transform skew-y-2 origin-bottom" />
    </section>
  );
}

function InstallationsSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-6 md:px-10 lg:px-14 py-12 md:py-16">
        <div className="rounded-xl overflow-hidden border border-neutral-200 shadow-md">
          <div className="relative aspect-[16/10]">
            <Image src="/images/trades/3rd_image.jpg" alt="Installation" fill className="object-cover" />
          </div>
        </div>
        <div>
          <h3 className={`text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 ${tradesHead.className}`}>Reliable Service, Easy Installations</h3>
          <p className="text-neutral-700 mt-3 text-[15px] leading-relaxed">
            We handle permits, site preparation, coordination, and the little details. Use this section to describe how you guide customers from
            quote to completion with clear timelines and dependable results.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl bg-white border border-neutral-200 p-5 shadow-sm">
              <div className="font-semibold text-emerald-700">Easy Installations</div>
              <ul className="mt-3 text-sm text-neutral-800 space-y-2">
                {[
                  'Installation & Commissioning',
                  'Permits & Inspections',
                  'Scheduling & Coordination',
                  'Flexible Payment Options',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-4 w-4 rounded-full bg-emerald-600 text-white text-[10px] grid place-items-center">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white border border-neutral-200 p-5 shadow-sm">
              <div className="font-semibold text-emerald-700">Popular Installation Package</div>
              <ul className="mt-3 text-sm text-neutral-800 space-y-2">
                {[
                  'Primary Equipment Install',
                  'Required Safety Switch/Device',
                  'System Power or Battery Module',
                  'Whole‑Home Surge / Protection Option',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 inline-block h-4 w-4 rounded-full bg-emerald-600 text-white text-[10px] grid place-items-center">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-7">
            <button
              className="mx-auto block rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 shadow-md"
              type="button"
            >
              Schedule an In-Home Consultation
            </button>
          </div>
        </div>
      </div>
      {/* subtle decorative wave */}
      <svg className="absolute -bottom-10 left-0 w-full h-10 text-neutral-100" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0,24 C240,48 480,0 720,22 C960,44 1200,10 1440,28 L1440,40 L0,40 Z" />
      </svg>
    </section>
  );
}

function ConsultCTA() {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-emerald-700/95" />
      <div className="absolute inset-0 opacity-15 bg-[url('/images/piano_background.png')] bg-cover bg-center" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 lg:px-14 py-12 text-center">
        <h3 className={`text-2xl md:text-4xl font-extrabold tracking-tight ${tradesHead.className}`}>Fast Response & Free Consultations</h3>
        <div className="mx-auto mt-3 h-0.5 w-16 bg-white/80" />
        <p className="mt-4 max-w-4xl mx-auto text-white/90 text-sm md:text-base">
          Planning a project or upgrade? Friendly consultants are ready to help. Use this area to describe your expertise and how customers can
          schedule a free phone consultation to get started.
        </p>
        <button className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 font-semibold">
          Contact Us
        </button>
      </div>
    </section>
  );
}

function ContactFooter() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-14 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div className="text-center md:text-left">
          <div className={`text-3xl font-extrabold text-emerald-700 ${tradesHead.className}`}>Your Company Name</div>
        </div>
        <div className="text-center md:text-left">
          <div className={`font-semibold text-neutral-900 ${tradesHead.className}`}>Contact Us</div>
          <div className="text-sm text-neutral-700 mt-2">(123) 456-7890</div>
          <div className="text-sm text-neutral-700">hello@example.com</div>
          <div className="mt-2 inline-flex items-center gap-2 text-sm text-neutral-800">
            <span className="h-5 w-5 rounded-full bg-[#1877F2] text-white grid place-items-center text-[12px]">f</span>
            <span>Like us on Facebook</span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <div className={`font-semibold text-neutral-900 ${tradesHead.className}`}>Our Location</div>
          <div className="text-sm text-neutral-700 mt-2">123 Main Street</div>
          <div className="text-sm text-neutral-700">Anytown, ST 00000</div>
          <div className="text-xs text-neutral-600 mt-2">Open Mon - Fri: 08:00 AM – 04:00 PM</div>
        </div>
      </div>
    </section>
  );
}

function GreenPill({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow">
      {children}
    </button>
  );
}

