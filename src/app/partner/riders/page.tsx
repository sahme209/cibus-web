"use client";

export default function PartnerRidersPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      <section className="relative overflow-hidden" style={{ background: "var(--hubb-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Deliver with
              <br />
              <span style={{ color: "var(--hubb-accent)" }}>HUBB</span>
            </h1>
            <p className="mt-4 text-base text-white/60 max-w-lg">
              Set your own schedule. Earn competitive pay. Join our rider team and start delivering today.
            </p>
            <a
              href="mailto:riders@hubb.pk?subject=Rider%20Application"
              className="inline-block mt-8 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "var(--hubb-accent)" }}
            >
              Apply Now
            </a>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "var(--hubb-accent)" }} />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Flexible Hours", desc: "Work when you want. Choose your own hours and be your own boss.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Competitive Pay", desc: "Earn per delivery plus tips. Weekly payouts directly to your account.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { title: "Support & Safety", desc: "24/7 support team, in-app navigation, and insurance coverage while delivering.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
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
