import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About HUBB",
  description: "Learn about HUBB — Islamabad's fast-growing food delivery platform delivering in minutes, not hours.",
};

const VALUES = [
  {
    title: "Speed matters",
    desc: "We optimize every step — from order placement to restaurant preparation to rider dispatch — so your food arrives fresh and fast.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "#FF3008",
  },
  {
    title: "Quality first",
    desc: "We partner with restaurants that meet our quality standards and train riders to handle every order with care.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    color: "#00704A",
  },
  {
    title: "Everyone eats",
    desc: "Affordable delivery fees, fair restaurant commissions, and competitive rider pay. We grow when the whole ecosystem grows.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    color: "#FFB347",
  },
  {
    title: "Built for Pakistan",
    desc: "Cash-on-delivery, local payment methods, Urdu support, and features designed for the way Pakistanis eat and live.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#5856D6",
  },
];

const TIMELINE = [
  { year: "2024", title: "The idea", desc: "Saw the gap — Islamabad deserved a food delivery app built for its neighborhoods." },
  { year: "2025", title: "First order", desc: "Launched with 50 restaurants in F-sectors. Delivered our first biryani in 22 minutes." },
  { year: "2026", title: "Scaling up", desc: "500+ restaurants, 1,000+ riders, expanding across all of Islamabad." },
  { year: "Next", title: "Beyond food", desc: "Groceries, shops, and same-day delivery — building the everything app for Islamabad." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      {/* Hero with background image */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,60,40,0.8))" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white/80 mb-6" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
              About HUBB
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Delivery in minutes,
              <br />
              <span style={{ color: "#00D474" }}>not hours</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg leading-relaxed">
              HUBB connects Islamabad&apos;s hungry customers with their favorite restaurants through a network of dedicated riders — all in one app.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 py-10 sm:py-12">
            {[
              { value: "500+", label: "Restaurant Partners" },
              { value: "1,000+", label: "Active Riders" },
              { value: "10K+", label: "Happy Customers" },
              { value: "30 min", label: "Avg. Delivery Time" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--hubb-accent)" }}>{s.value}</p>
                <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: "var(--text-tertiary)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-5" style={{ color: "var(--text-primary)" }}>
            Our mission
          </h2>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            To make food delivery fast, affordable, and reliable across Islamabad. We&apos;re building the best food delivery experience in the capital — one neighborhood at a time — because great food shouldn&apos;t require a long wait, and the people who make and deliver it deserve a fair deal.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
            What we stand for
          </h2>
          <p className="text-sm text-center mb-10" style={{ color: "var(--text-secondary)" }}>The principles that guide every decision we make</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl p-6 transition-all hover:-translate-y-0.5" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${v.color}15` }}>
                  <svg className="w-6 h-6" style={{ color: v.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
          Our story
        </h2>
        <p className="text-sm text-center mb-12" style={{ color: "var(--text-secondary)" }}>From an idea to Islamabad&apos;s fastest-growing delivery platform</p>
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5" style={{ background: "var(--border-default)" }} />
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <div key={t.year} className="relative flex gap-5 sm:gap-6">
                <div className="shrink-0 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-extrabold z-10" style={{ background: i === TIMELINE.length - 1 ? "var(--hubb-accent)" : "var(--bg-card)", color: i === TIMELINE.length - 1 ? "white" : "var(--hubb-accent)", boxShadow: "var(--shadow-md)", border: `2px solid ${i === TIMELINE.length - 1 ? "var(--hubb-accent)" : "var(--border-default)"}` }}>
                  {t.year}
                </div>
                <div className="pb-2">
                  <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{t.title}</h3>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #00704A, #004D33)" }}>
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: "#00A86B" }} />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Join the HUBB ecosystem</h2>
              <p className="text-sm sm:text-base text-white/60 mb-8 max-w-md mx-auto">Whether you want to earn, grow your business, or build the future of delivery — there&apos;s a place for you.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/partner/restaurants"
                  className="px-7 py-3.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background: "white", color: "#00704A" }}
                >
                  Partner with us
                </Link>
                <Link
                  href="/partner/riders"
                  className="px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  Become a rider
                </Link>
                <Link
                  href="/careers"
                  className="px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  View careers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
