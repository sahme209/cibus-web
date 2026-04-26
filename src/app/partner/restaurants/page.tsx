"use client";

import Link from "next/link";

export default function PartnerRestaurantsPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      <section className="relative overflow-hidden" style={{ background: "var(--hubb-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Grow your business
              <br />
              <span style={{ color: "var(--hubb-accent)" }}>with HUBB</span>
            </h1>
            <p className="mt-4 text-base text-white/60 max-w-lg">
              Reach thousands of hungry customers in your city. Join HUBB&apos;s restaurant partner network and increase your revenue.
            </p>
            <a
              href="mailto:partners@hubb.pk?subject=Restaurant%20Partnership%20Inquiry"
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
            { title: "More Customers", desc: "Access a growing network of food lovers looking for quality meals in your area.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            { title: "Easy Management", desc: "Manage orders, update menus, and track performance with our restaurant dashboard.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { title: "Reliable Delivery", desc: "Our trained riders ensure your food reaches customers fresh and on time.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
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
