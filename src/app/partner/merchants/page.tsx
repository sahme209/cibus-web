"use client";

const STATS = [
  { value: "50+", label: "Categories" },
  { value: "24hr", label: "Onboarding" },
  { value: "0%", label: "Sign-up fee" },
  { value: "Weekly", label: "Payouts" },
];

const STEPS = [
  {
    step: "01",
    title: "Register your store",
    desc: "Submit a quick form with your business details. Our team verifies and approves within 24 hours.",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    step: "02",
    title: "Upload your catalog",
    desc: "Add products with photos, descriptions, and pricing. Organize into categories for easy browsing.",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    step: "03",
    title: "Start selling",
    desc: "Receive orders through the HUBB Merchant app. Our riders handle all the deliveries.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const FEATURES = [
  { title: "Wider Reach", desc: "Access thousands of customers in your city without the overhead of a physical storefront.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Quick Onboarding", desc: "Get set up and start selling in as little as 24 hours with our streamlined process.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Real-time Analytics", desc: "Track sales, monitor popular items, and optimize your offerings with our live dashboard.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { title: "Inventory Management", desc: "Mark items in/out of stock in real time. Set operating hours and manage availability.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { title: "Promotional Tools", desc: "Create discounts, featured placements, and bundle deals to attract more customers.", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
  { title: "Dedicated Support", desc: "Merchant support team available via chat and phone to help with any issue.", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
];

const FAQ = [
  { q: "What types of products can I sell?", a: "You can sell groceries, pharmacy items, flowers, pet supplies, electronics, and other retail goods. Food items follow the same regulations as our restaurant partners." },
  { q: "What are the fees?", a: "There's no sign-up or monthly fee. HUBB charges a commission per order, which varies based on your product category and delivery zone." },
  { q: "How do I manage my catalog?", a: "Use the HUBB Merchant dashboard or mobile app to add, edit, and manage your product listings in real time." },
  { q: "What areas do you deliver to?", a: "HUBB operates in major cities across Pakistan. Contact us to check if your area is currently covered." },
];

export default function PartnerMerchantsPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--hubb-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl animate-fade-up">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5"
              style={{ background: "var(--hubb-accent)", color: "white" }}
            >
              MERCHANTS
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Sell on
              <br />
              <span style={{ color: "var(--hubb-accent)" }}>HUBB</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg">
              Expand your reach by listing your products on HUBB. From groceries to essentials, connect with customers who need what you offer.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:merchants@hubb.pk?subject=Merchant%20Partnership%20Inquiry"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--hubb-accent)" }}
              >
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white/80 transition-all hover:text-white"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "var(--hubb-accent)" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#FFD700" }} />
      </section>

      {/* Stats bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div
          className="rounded-2xl grid grid-cols-2 sm:grid-cols-4 divide-x"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-lg)", borderColor: "var(--border-subtle)" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center py-6 px-4" style={{ borderColor: "var(--border-subtle)" }}>
              <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--hubb-accent)" }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>
          Grow your business online
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl p-6" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--hubb-tint)" }}>
                <svg className="w-6 h-6" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20" style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-12" style={{ color: "var(--text-primary)" }}>
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t border-dashed" style={{ borderColor: "var(--border-default)" }} />
                )}
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: "var(--hubb-tint)" }}>
                    <svg className="w-8 h-8" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                    </svg>
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--hubb-accent)" }}>STEP {s.step}</span>
                  <h3 className="text-base font-bold mt-1 mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                  <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl overflow-hidden"
              style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
            >
              <summary
                className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold list-none"
                style={{ color: "var(--text-primary)" }}
              >
                {item.q}
                <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--hubb-accent), #005C3C)" }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-15 blur-3xl" style={{ background: "#FFD700" }} />
          <div className="relative">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to start selling?</h2>
            <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
              List your products and reach more customers than ever.
            </p>
            <a
              href="mailto:merchants@hubb.pk?subject=Merchant%20Partnership%20Inquiry"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "white", color: "var(--hubb-accent)" }}
            >
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
