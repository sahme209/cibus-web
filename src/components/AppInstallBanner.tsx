"use client";

import { useState, useEffect } from "react";

const DISMISSED_KEY = "hubb_app_banner_dismissed";

export default function AppInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isMobile && !isStandalone) {
      setTimeout(() => setVisible(true), 3000);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 animate-fade-up"
      style={{
        background: "color-mix(in srgb, var(--bg-card) 96%, transparent)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
        borderTop: "1px solid var(--border-default)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ background: "var(--hubb-accent)" }}
        >
          H
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Get the HUBB app
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            Faster ordering, exclusive deals, real-time tracking
          </p>
        </div>
        <a
          href="https://apps.apple.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full text-xs font-bold text-white shrink-0 transition-all hover:scale-105"
          style={{ background: "var(--hubb-accent)" }}
        >
          Open
        </a>
        <button
          onClick={() => {
            setVisible(false);
            localStorage.setItem(DISMISSED_KEY, "1");
          }}
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--bg-search)" }}
          aria-label="Dismiss"
        >
          <svg className="w-3.5 h-3.5" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
