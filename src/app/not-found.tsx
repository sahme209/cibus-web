import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="text-center animate-fade-up mx-4">
        <div
          className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-5"
          style={{ background: "var(--bg-search)" }}
        >
          <svg className="w-12 h-12" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1
          className="text-6xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          404
        </h1>
        <h2
          className="text-xl font-bold mt-2"
          style={{ color: "var(--text-primary)" }}
        >
          Page not found
        </h2>
        <p
          className="text-sm mt-2 max-w-sm mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--hubb-accent)" }}
          >
            Back to Home
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
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}
