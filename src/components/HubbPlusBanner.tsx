"use client";

export default function HubbPlusBanner() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #1D1D1F 0%, #2C2C2E 50%, #1D1D1F 100%)",
      }}
    >
      <div className="px-6 py-5 flex items-center justify-between gap-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider"
              style={{ background: "var(--hubb-gold)", color: "#1D1D1F" }}
            >
              HUBB+
            </span>
            <span className="text-white/60 text-xs">Members save more</span>
          </div>
          <p className="text-white font-bold text-base sm:text-lg">
            Free delivery on every order
          </p>
          <p className="text-white/50 text-xs mt-1">
            Plus exclusive deals and priority support. Try free for 14 days.
          </p>
        </div>
        <button
          className="shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: "var(--hubb-gold)", color: "#1D1D1F" }}
        >
          Try Free
        </button>
      </div>
      {/* Decorative */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.04]"
        style={{ background: "var(--hubb-gold)", filter: "blur(40px)" }}
      />
      <div
        className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-[0.06]"
        style={{ background: "var(--hubb-accent)", filter: "blur(30px)" }}
      />
    </div>
  );
}
