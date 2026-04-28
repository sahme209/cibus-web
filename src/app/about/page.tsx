import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About HUBB",
  description: "Learn about HUBB — Islamabad's fast-growing food delivery platform delivering in minutes, not hours.",
};

const VALUES = [
  {
    title: "Speed matters",
    desc: "We optimize every step — from order placement to restaurant preparation to rider dispatch — so your food arrives fresh and fast.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Quality first",
    desc: "We partner with restaurants that meet our quality standards and train riders to handle every order with care.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Everyone eats",
    desc: "Affordable delivery fees, fair restaurant commissions, and competitive rider pay. We grow when the whole ecosystem grows.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    title: "Built for Pakistan",
    desc: "Cash-on-delivery, local payment methods, Urdu support, and features designed for the way Pakistanis eat and live.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--hubb-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Delivery in minutes,
              <br />
              <span style={{ color: "var(--hubb-accent)" }}>not hours</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg">
              HUBB connects Islamabad&apos;s hungry customers with their favorite restaurants through a network of dedicated riders — all in one app.
            </p>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "var(--hubb-accent)" }} />
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Our mission
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            To make food delivery fast, affordable, and reliable across Islamabad. We&apos;re building the best food delivery experience in the capital — one neighborhood at a time — because great food shouldn&apos;t require a long wait, and the people who make and deliver it deserve a fair deal.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>
            What we stand for
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl p-6" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--hubb-tint)" }}>
                  <svg className="w-6 h-6" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div
          className="rounded-2xl grid grid-cols-2 sm:grid-cols-4 divide-x"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-md)", borderColor: "var(--border-subtle)" }}
        >
          {[
            { value: "1", label: "City" },
            { value: "500+", label: "Restaurants" },
            { value: "1,000+", label: "Riders" },
            { value: "10,000+", label: "Happy customers" },
          ].map((s) => (
            <div key={s.label} className="text-center py-6 px-4" style={{ borderColor: "var(--border-subtle)" }}>
              <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--hubb-accent)" }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Join the HUBB ecosystem
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/partner/restaurants"
              className="px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
              style={{ background: "var(--hubb-accent)" }}
            >
              Partner with us
            </Link>
            <Link
              href="/partner/riders"
              className="px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.02]"
              style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
            >
              Become a rider
            </Link>
            <Link
              href="/careers"
              className="px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.02]"
              style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
            >
              View careers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
