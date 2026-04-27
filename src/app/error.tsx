"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="text-center animate-fade-up mx-4 max-w-md">
        <div className="relative mx-auto w-32 h-32 mb-6">
          <div
            className="absolute inset-0 rounded-full opacity-20 blur-2xl"
            style={{ background: "var(--hubb-orange)" }}
          />
          <div
            className="relative w-32 h-32 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "var(--bg-search)" }}
          >
            <svg className="w-16 h-16" style={{ color: "var(--hubb-orange)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Oops, something broke
        </h2>
        <p
          className="text-sm mt-2 max-w-sm mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          We ran into an unexpected issue. Don&apos;t worry — your cart and account are safe.
        </p>
        <div className="flex gap-3 justify-center mt-7">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--hubb-accent)" }}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </span>
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          >
            Go Home
          </Link>
        </div>
        <p className="text-[11px] mt-6" style={{ color: "var(--text-tertiary)" }}>
          If this keeps happening, try refreshing or clearing your browser cache.
        </p>
      </div>
    </div>
  );
}
