"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/store";

const PERKS = [
  {
    title: "Rs. 0 Delivery",
    desc: "Free delivery on every order, no minimum required. Save hundreds every month.",
    icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
    color: "#00704A",
    savings: "Avg. Rs. 600/mo saved",
  },
  {
    title: "5% Cashback",
    desc: "Get 5% back as HUBB credits on every order. Credits never expire.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#FFB347",
    savings: "Avg. Rs. 300/mo earned",
  },
  {
    title: "Exclusive Deals",
    desc: "Member-only discounts, early access to promotions, and special restaurant offers.",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    color: "#5856D6",
    savings: "Up to 40% off",
  },
  {
    title: "Priority Support",
    desc: "Skip the queue with dedicated VIP customer support, available 24/7.",
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    color: "#FF3008",
    savings: "< 2 min response",
  },
  {
    title: "No Surge Pricing",
    desc: "Pay the same delivery fee (Rs. 0) even during peak hours and bad weather.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "#00A86B",
    savings: "Save during rush hour",
  },
  {
    title: "Cancel for Free",
    desc: "Changed your mind? Cancel any order within 2 minutes at no charge.",
    icon: "M6 18L18 6M6 6l12 12",
    color: "#D4AF37",
    savings: "100% refund guarantee",
  },
];

const FAQ = [
  {
    q: "How much does HUBB+ cost?",
    a: "HUBB+ is Rs. 499/month. Your first 30 days are completely free — cancel anytime.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, cancel your subscription at any time from your profile. No cancellation fees, no questions asked.",
  },
  {
    q: "How does cashback work?",
    a: "5% of every order total is added to your HUBB wallet as credits. Credits can be applied to any future order and never expire.",
  },
  {
    q: "Is there a minimum order for free delivery?",
    a: "No minimum! HUBB+ members get Rs. 0 delivery on every order, regardless of size.",
  },
  {
    q: "What happens after the free trial?",
    a: "After 30 days, you'll be charged Rs. 499/month. We'll send a reminder 3 days before your trial ends.",
  },
];

export default function HubbPlusPage() {
  const { isLoggedIn } = useAuth();

  return (
    <div style={{ background: "var(--bg-secondary)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(0,77,51,0.92), rgba(0,60,40,0.88))" }}
        />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "#FFD700" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#00A86B" }} />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: "rgba(255,215,0,0.25)", color: "#FFD700" }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              MEMBERSHIP
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
              HUBB<span style={{ color: "#FFD700" }}>+</span>
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-white/80 max-w-lg mx-auto leading-relaxed">
              Unlimited free delivery, 5% cashback, and exclusive perks. Your first month is on us.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              {[
                { val: "Rs. 0", sub: "Delivery, always" },
                { val: "5%", sub: "Cashback" },
                { val: "30 days", sub: "Free trial" },
              ].map((stat) => (
                <div key={stat.sub} className="text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-white">{stat.val}</p>
                  <p className="text-xs text-white/50 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={isLoggedIn ? "/profile" : "/auth"}
                className="px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] animate-subtle-pulse"
                style={{ background: "white", color: "#00704A" }}
              >
                Start Free Trial
              </Link>
              <span className="text-sm text-white/50">
                Then Rs. 499/month • Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Savings calculator */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div
            className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}
          >
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-center mb-2" style={{ color: "var(--text-primary)" }}>
              How much could you save?
            </h2>
            <p className="text-sm text-center mb-8" style={{ color: "var(--text-secondary)" }}>
              Average HUBB+ member ordering 3× per week
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Delivery fees saved", value: "Rs. 1,188", sub: "/month", icon: "🚀" },
                { label: "Cashback earned", value: "Rs. 540", sub: "/month", icon: "💰" },
                { label: "Net savings", value: "Rs. 1,229", sub: "/month after membership", icon: "✨", highlight: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-5 text-center"
                  style={{
                    background: item.highlight ? "var(--hubb-tint)" : "var(--bg-search)",
                    border: item.highlight ? "2px solid var(--hubb-accent)" : "none",
                  }}
                >
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <p className="text-2xl font-extrabold" style={{ color: item.highlight ? "var(--hubb-accent)" : "var(--text-primary)" }}>
                    {item.value}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{item.sub}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: "var(--text-secondary)" }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Perks grid */}
      <section style={{ background: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
            Everything included
          </h2>
          <p className="text-sm text-center mb-10" style={{ color: "var(--text-secondary)" }}>
            One membership, unlimited benefits
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERKS.map((perk) => (
              <div
                key={perk.title}
                className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${perk.color}15` }}
                >
                  <svg className="w-6 h-6" style={{ color: perk.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={perk.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{perk.title}</h3>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{perk.desc}</p>
                <span
                  className="inline-block mt-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: `${perk.color}15`, color: perk.color }}
                >
                  {perk.savings}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-8" style={{ color: "var(--text-primary)" }}>
            Free vs. HUBB+
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}
          >
            <div className="grid grid-cols-3 text-center text-sm font-bold py-4 px-4" style={{ background: "var(--bg-search)" }}>
              <span style={{ color: "var(--text-secondary)" }}>Feature</span>
              <span style={{ color: "var(--text-secondary)" }}>Free</span>
              <span style={{ color: "var(--hubb-accent)" }}>HUBB+</span>
            </div>
            {[
              { feature: "Delivery fee", free: "Rs. 49-149", plus: "Rs. 0" },
              { feature: "Cashback", free: "None", plus: "5% every order" },
              { feature: "Member deals", free: "—", plus: "Exclusive access" },
              { feature: "Support", free: "Standard", plus: "Priority VIP" },
              { feature: "Surge pricing", free: "Yes", plus: "Never" },
              { feature: "Free cancellation", free: "—", plus: "Within 2 min" },
            ].map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-3 text-center text-sm py-3.5 px-4"
                style={{ borderTop: "1px solid var(--border-default)" }}
              >
                <span className="font-medium text-left" style={{ color: "var(--text-primary)" }}>{row.feature}</span>
                <span style={{ color: "var(--text-tertiary)" }}>{row.free}</span>
                <span className="font-semibold" style={{ color: "var(--hubb-accent)" }}>{row.plus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-8" style={{ color: "var(--text-primary)" }}>
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
              >
                <summary
                  className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-semibold list-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.q}
                  <svg
                    className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                    style={{ color: "var(--text-tertiary)" }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div
            className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #00704A, #004D33)" }}
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: "#FFD700" }} />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10 blur-3xl" style={{ background: "#00A86B" }} />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Ready to save on every order?
              </h2>
              <p className="text-sm sm:text-base text-white/70 mt-2 max-w-md mx-auto">
                Join thousands of HUBB+ members saving Rs. 1,200+ per month.
              </p>
              <Link
                href={isLoggedIn ? "/profile" : "/auth"}
                className="inline-flex items-center gap-2 mt-7 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "white", color: "#00704A" }}
              >
                Start Your Free Month
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <p className="text-xs text-white/40 mt-3">
                Rs. 499/month after free trial. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
