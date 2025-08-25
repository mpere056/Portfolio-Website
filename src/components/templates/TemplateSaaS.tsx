"use client";

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from '@/components/FramerMotion';

interface Props { variant: 'landing' }

export default function TemplateSaaS({ variant }: Props) {
  if (variant !== 'landing') return null;

  return (
    <div className="bg-[#0a0a12]">
      <div className="px-6 md:px-10 lg:px-14 py-12 md:py-16 space-y-32 md:space-y-36 lg:space-y-48">
        <HeroSection />
        <LogosRow />
        <MiniFeatures />
        <AnalyticsShowcase />
        <FeatureColumns />
        <Testimonial />
        <Integrations />
        <BlogTeasers />
        <FinalCTA />
        <FooterMock />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div className="text-center lg:text-left space-y-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-semibold tracking-tight"
        >
          Turn your idea into a stunning website
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="text-white/70"
        >
          A modern, animated SaaS landing page. Production-ready sections, responsive layout, and delightful micro-interactions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center justify-center lg:justify-start gap-3 pt-2"
        >
          <button className="px-5 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white font-medium shadow">Get Started</button>
          <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15">Live Demo</button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl saas-hero-bg border border-white/10 p-4 md:p-6 shadow-xl"
      >
        <DashboardMock />
      </motion.div>
    </section>
  );
}

function LogosRow() {
  const brands = ['Glossy', 'Hues', 'Orbitc', 'Horme', 'Sitemark', 'Volume'];
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      className="max-w-5xl mx-auto"
    >
    </motion.section>
  );
}

function MiniFeatures() {
  const items = [
    { title: 'Self-hosted', desc: 'Own your stack and deploy anywhere with simple CI/CD.' },
    { title: 'Customizable', desc: 'Swap sections, tweak colors, and ship a unique brand.' },
  ];
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
      {items.map((it, i) => (
        <motion.div
          key={it.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl bg-white/[0.06] border border-white/10 p-6"
        >
          <div className="text-violet-300 font-semibold">{it.title}</div>
          <p className="text-sm text-white/70 mt-2">{it.desc}</p>
        </motion.div>
      ))}
    </section>
  );
}

function AnalyticsShowcase() {
  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      <div className="space-y-3 order-2 md:order-1">
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-2xl md:text-3xl font-semibold"
        >
          <span>Analytics that will </span>
          <span className="text-gradient-violet">help you!</span>
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-white/70 max-w-md"
        >
          In today’s data-driven world, measuring and analyzing everything unlocks new opportunities and smarter decisions.
        </motion.p>
      </div>
      <div className="flex gap-6 order-1 md:order-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <GlassPanel>
            <GraphCard title="Revenue" period="Weekly" value="$1,621" trend="▲ 4.9%" />
          </GlassPanel>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="flex-1"
        >
          <GlassPanel>
            <ChannelsCard />
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureColumns() {
  return (
    <section className="max-w-6xl mx-auto dot-grid">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h3 className="text-2xl md:text-3xl font-semibold">Effortlessly customize <span className="text-gradient-violet">for your unique projects.</span></h3>
          <p className="text-white/70 max-w-xl">Customization is key—mix and match modular sections to match your brand and product needs.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['Dynamic Content Editor','Adaptive Layouts','Modular Components','Smart Suggestions'].map((title) => (
            <div key={title} className="rounded-xl bg-white/[0.06] border border-white/10 p-5">
              <div className="font-semibold text-violet-300">{title}</div>
              <p className="text-sm text-white/70 mt-2">Short blurb describing how this feature helps customization.</p>
              <button className="mt-2 text-sm px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 border border-white/15">Learn more</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="max-w-6xl mx-auto text-center space-y-6">
      <div className="space-y-3">
        <h3 className="text-2xl md:text-4xl font-semibold">Discover what our customers</h3>
        <h3 className="text-2xl md:text-4xl font-semibold"><span className="text-gradient-violet">have to say about our SaaS solution</span></h3>
        <p className="text-white/70 max-w-3xl mx-auto">Explore the testimonials and feedback from our valued customers to gain insights into their experiences and satisfaction with our SaaS solution.</p>
      </div>
      <div className="relative flex items-center justify-center">
        <button type="button" aria-label="Previous" className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/15 bg-white/10 hover:bg-white/15">‹</button>
        <GlassPanel>
          <div className="p-6 md:p-8 text-left max-w-3xl">
            <p className="text-white/90">“It was a great experience! We shipped our MVP in days, and the site looks like a million bucks. Animations, content, and performance—handled.”</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20" />
              <div>
                <div className="font-medium">John Smith</div>
                <div className="text-xs text-white/70">Happy Founder</div>
              </div>
            </div>
          </div>
        </GlassPanel>
        <button type="button" aria-label="Next" className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/15 bg-white/10 hover:bg-white/15">›</button>
      </div>
    </section>
  );
}

function Integrations() {
  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-semibold">Seamless integration <span className="text-gradient-violet">for enhanced efficiency</span></h3>
        <button className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-400 text-white font-medium">Explore Integrations</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-xl bg-white/[0.06] border border-white/10 p-5"
        >
          <div className="font-semibold text-violet-300">Payments</div>
          <div className="mt-3 h-40 rounded-md bg-black/30 border border-white/10" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-xl bg-white/[0.06] border border-white/10 p-5"
        >
          <div className="font-semibold text-violet-300">Analytics</div>
          <div className="mt-3 h-40 rounded-md bg-black/30 border border-white/10" />
        </motion.div>
      </div>
    </section>
  );
}

function BlogTeasers() {
  return (
    <section className="max-w-3xl mx-auto space-y-4">
      <h3 className="text-center text-2xl md:text-3xl font-semibold">Check out the blogs we have prepared for you</h3>
      <div className="grid grid-cols-1 gap-4">
        {[1, 2].map(i => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-xl bg-white/[0.06] border border-white/10 p-5 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="aspect-video rounded-md bg-black/30" />
            <div className="md:col-span-2">
              <div className="font-semibold">Feature deep dive #{i}</div>
              <p className="text-sm text-white/70">Learn how our integrations unlock automation in minutes.</p>
              <button className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15">Read More</button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="text-center max-w-3xl mx-auto space-y-6">
      <div className="mx-auto h-14 w-14 rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_10px_40px_rgba(0,0,0,0.35)] grid place-items-center">
        <span className="text-lg">✦</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl md:text-5xl font-semibold">Get started today and unlock</h3>
        <h3 className="text-3xl md:text-5xl font-semibold text-gradient-violet">the power of our SaaS platform</h3>
      </div>
      <p className="text-white/70">Join us now and let’s work wonders together to build a better future</p>
      <button className="px-5 py-2.5 rounded-md bg-violet-500/90 hover:bg-violet-500 text-white font-medium border border-white/10 shadow">Get Started</button>
    </section>
  );
}

function FooterMock() {
  return (
    <footer className="mt-16 md:mt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand + description */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md border border-white/15 bg-white/10 flex items-center justify-center">✦</div>
          </div>
          <p className="text-sm text-white/70 max-w-sm">
            This template empowers businesses to showcase their offerings with a visually stunning interface and immersive digital experience.
          </p>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <a key={i} href="#" className="h-8 w-8 rounded-md border border-white/15 bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/70 text-xs">{['IG','TW','GH','DB','IN'][i] || '*'}
              </a>
            ))}
          </div>
        </div>

        {/* Menu */}
        <nav className="md:col-span-3 space-y-3">
          <div className="text-white/90 font-medium">Menu</div>
          <ul className="space-y-2 text-sm text-white/70">
            {['Home','About','Features','Pricing','Blog','Contact'].map(item => (
              <li key={item}><a href="#" className="hover:text-white/90 transition-colors">{item}</a></li>
            ))}
          </ul>
        </nav>

        {/* Utility Pages */}
        <nav className="md:col-span-4 space-y-3">
          <div className="text-white/90 font-medium">Utility Pages</div>
          <ul className="space-y-2 text-sm text-white/70">
            {['Login','Register','404','More Templates'].map(item => (
              <li key={item}><a href="#" className="hover:text-white/90 transition-colors">{item}</a></li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

function DashboardMock() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-black/40 border border-white/10 p-4">
        <div className="h-40 md:h-56 rounded-md bg-gradient-to-b from-violet-500/20 to-transparent relative overflow-hidden">
          <Bars />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-black/40 border border-white/10 p-3">
          <div className="h-20 rounded-md bg-white/[0.06]" />
        </div>
        <div className="rounded-lg bg-black/40 border border-white/10 p-3">
          <div className="h-20 rounded-md bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

interface MetricProps { title: string; value: string; delta: string }
function MetricCard({ title, value, delta }: MetricProps) {
  return (
    <div>
      <div className="text-white/70 text-sm">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      <div className="text-xs text-emerald-300 mt-1">{delta}</div>
    </div>
  );
}

function Bars() {
  return (
    <div className="absolute inset-x-0 bottom-4 flex items-end gap-1 px-4">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="w-1.5 md:w-2 bg-violet-400/60" style={{ height: `${12 + (Math.sin(i / 1.6) + 1) * 22}%` }} />
      ))}
    </div>
  );
}

function GraphCard({ title, period, value, trend }: { title: string; period: string; value: string; trend?: string }) {
  return (
    <div className="space-y-3 p-4 h-[360px] flex flex-col">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {trend && <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">{trend}</span>}
        </span>
        <span className="px-2 py-0.5 rounded bg-white/10 border border-white/15">{period}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="h-28 rounded-md bg-white/[0.06] mt-2" />
      <div className="mt-3 rounded-lg overflow-hidden border border-white/10 grow">
        <div className="grid grid-cols-3 text-xs text-white/60 bg-white/5">
          <div className="px-3 py-2">Date</div>
          <div className="px-3 py-2">Id</div>
          <div className="px-3 py-2 text-right">Price</div>
        </div>
        {[
          ['Jan 22, 2022', '56210', '$12.00'],
          ['Jan 21, 2022', '56209', '$99.00'],
          ['Jan 21, 2022', '56208', '$39.00'],
          ['Jan 20, 2022', '56207', '$12.00'],
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-3 text-sm border-t border-white/10">
            <div className="px-3 py-2 text-white/80">{row[0]}</div>
            <div className="px-3 py-2 text-white/70">{row[1]}</div>
            <div className="px-3 py-2 text-right">{row[2]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChannelsCard() {
  const rows = [
    ['Google', '83', 'Organic search'],
    ['Youtube', '77', 'Advertising'],
    ['Instagram', '54', 'Referral'],
  ];
  return (
    <div className="space-y-3 p-4 h-[360px] flex flex-col">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>New users</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">▲ 17.2%</span>
      </div>
      <div className="text-2xl font-semibold">319</div>
      <div className="mt-2 rounded-lg overflow-hidden border border-white/10 grow">
        <div className="grid grid-cols-[1fr_auto] text-xs text-white/60 bg-white/5">
          <div className="px-3 py-2">Source</div>
          <div className="px-3 py-2 text-right">Count</div>
        </div>
        <div className="max-h-[180px] overflow-auto">
          {rows.map(([name, val, sub], i) => (
            <div key={name} className="grid grid-cols-[1fr_auto] text-sm border-t border-white/10">
              <div className="px-3 py-2">
                <div className="text-white/80">{name}</div>
                <div className="text-xs text-white/60">{sub}</div>
              </div>
              <div className="px-3 py-2 text-right">{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GlassPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] backdrop-blur-lg shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(167,139,250,0.08),transparent_60%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}


