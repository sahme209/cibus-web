import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the HUBB team and help build Pakistan's leading food delivery platform.",
};

const PERKS = [
  { title: "Remote-first", desc: "Work from anywhere in Pakistan. We care about output, not office hours.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { title: "Competitive pay", desc: "Market-rate salaries, performance bonuses, and equity for senior roles.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Real impact", desc: "Your work ships to thousands of users. Small team, big ownership.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Growth", desc: "Learning budget, conference tickets, and mentorship from experienced founders.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
];

const OPENINGS = [
  { team: "Engineering", roles: ["Senior Backend Engineer (Node.js)", "iOS Engineer (Swift/SwiftUI)", "Android Engineer (Kotlin/Compose)"] },
  { team: "Product", roles: ["Product Manager — Growth", "UX Designer"] },
  { team: "Operations", roles: ["City Launcher — Lahore", "Rider Operations Lead"] },
  { team: "Marketing", roles: ["Performance Marketing Manager", "Content & Social Lead"] },
];

export default function CareersPage() {
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
              WE&apos;RE HIRING
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Build the future
              <br />
              <span style={{ color: "var(--hubb-accent)" }}>of food delivery</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg">
              Join a small, fast-moving team shipping real products to thousands of users across Pakistan.
            </p>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "var(--hubb-accent)" }} />
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>
          Why work at HUBB
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERKS.map((p) => (
            <div key={p.title} className="rounded-2xl p-6" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--hubb-tint)" }}>
                <svg className="w-6 h-6" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={p.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Openings */}
      <section style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>
            Open positions
          </h2>
          <div className="space-y-6">
            {OPENINGS.map((group) => (
              <div key={group.team}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
                  {group.team}
                </h3>
                <div className="space-y-2">
                  {group.roles.map((role) => (
                    <a
                      key={role}
                      href={`mailto:careers@hubb.pk?subject=Application%20—%20${encodeURIComponent(role)}`}
                      className="flex items-center justify-between px-5 py-4 rounded-xl transition-all hover:-translate-y-0.5"
                      style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
                    >
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{role}</span>
                      <svg className="w-4 h-4 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-10" style={{ color: "var(--text-secondary)" }}>
            Don&apos;t see your role? Send us your CV at{" "}
            <a href="mailto:careers@hubb.pk" className="font-semibold underline" style={{ color: "var(--hubb-accent)" }}>
              careers@hubb.pk
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
