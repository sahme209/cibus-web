import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the HUBB team and help build Pakistan's leading food delivery platform.",
};

const PERKS = [
  { title: "Remote-first", desc: "Work from anywhere in Pakistan. We care about output, not office hours.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", color: "#5856D6" },
  { title: "Competitive pay", desc: "Market-rate salaries, performance bonuses, and equity for senior roles.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#00704A" },
  { title: "Real impact", desc: "Your work ships to thousands of users. Small team, big ownership.", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "#FF3008" },
  { title: "Growth", desc: "Learning budget, conference tickets, and mentorship from experienced founders.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "#FFB347" },
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
      {/* Hero with background */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,60,40,0.8))" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl animate-fade-up">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-5"
              style={{ background: "rgba(0,112,74,0.9)", color: "white" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              WE&apos;RE HIRING
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Build the future
              <br />
              <span style={{ color: "#00D474" }}>of food delivery</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg leading-relaxed">
              Join a small, fast-moving team shipping real products to thousands of users across Pakistan.
            </p>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight mb-3" style={{ color: "var(--text-primary)" }}>
          Why work at HUBB
        </h2>
        <p className="text-sm text-center mb-10" style={{ color: "var(--text-secondary)" }}>Perks built for people who ship fast</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERKS.map((p) => (
            <div key={p.title} className="rounded-2xl p-6 transition-all hover:-translate-y-0.5" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${p.color}15` }}>
                <svg className="w-6 h-6" style={{ color: p.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
