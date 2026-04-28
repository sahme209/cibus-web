import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="text-center animate-fade-up mx-4 max-w-md">
        <div className="relative mx-auto w-40 h-40 mb-6">
          <div
            className="absolute inset-0 rounded-full opacity-15 blur-3xl"
            style={{ background: "var(--hubb-accent)" }}
          />
          <div
            className="relative w-40 h-40 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "var(--bg-search)" }}
          >
            <svg className="w-20 h-20" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1
          className="text-7xl font-black tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          404
        </h1>
        <h2
          className="text-xl font-bold mt-2"
          style={{ color: "var(--text-primary)" }}
        >
          This page took a wrong turn
        </h2>
        <p
          className="text-sm mt-2 max-w-sm mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved or the link may be broken.
        </p>
        <div className="flex gap-3 justify-center mt-7">
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--hubb-accent)" }}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </span>
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </span>
          </Link>
        </div>

        <div
          className="mt-10 pt-6 flex flex-wrap justify-center gap-4"
          style={{ borderTop: "1px solid var(--border-default)" }}
        >
          {[
            { label: "Browse Restaurants", href: "/", icon: "🍽️" },
            { label: "View Orders", href: "/orders", icon: "📋" },
            { label: "Get Help", href: "/profile", icon: "💬" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", color: "var(--text-secondary)" }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
