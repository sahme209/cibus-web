"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 sm:bottom-8 right-4 z-40 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-fade-up"
      style={{
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--border-default)",
      }}
      aria-label="Scroll to top"
    >
      <svg
        className="w-4 h-4"
        style={{ color: "var(--text-secondary)" }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
