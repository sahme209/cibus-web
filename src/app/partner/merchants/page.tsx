"use client";

export default function PartnerMerchantsPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      <section className="relative overflow-hidden" style={{ background: "var(--hubb-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Sell on
              <br />
              <span style={{ color: "var(--hubb-accent)" }}>HUBB</span>
            </h1>
            <p className="mt-4 text-base text-white/60 max-w-lg">
              Expand your reach by listing your products on HUBB. From groceries to essentials, connect with customers who need what you offer.
            </p>
            <a
              href="mailto:merchants@hubb.pk?subject=Merchant%20Partnership%20Inquiry"
              className="inline-block mt-8 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "var(--hubb-accent)" }}
            >
              Get Started
            </a>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "var(--hubb-accent)" }} />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Wider Reach", desc: "Access thousands of customers in your city without the overhead of a storefront.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Quick Onboarding", desc: "Get set up and start selling in as little as 48 hours with our streamlined process.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { title: "Real-time Analytics", desc: "Track sales, monitor popular items, and optimize your offerings with our dashboard.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl p-6"
              style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--hubb-tint)" }}>
                <svg className="w-6 h-6" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
