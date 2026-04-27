"use client";

import { useState, useEffect, type ReactNode } from "react";
import { StoreProvider, useCart } from "@/lib/store";
import { ToastProvider } from "./ToastProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ActiveOrderBanner from "./ActiveOrderBanner";
import CartDrawer from "./CartDrawer";
import MobileNav from "./MobileNav";

function RestaurantSwitchModal() {
  const { pendingSwitch, confirmSwitch, cancelSwitch } = useCart();
  if (!pendingSwitch) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={cancelSwitch} />
      <div
        className="relative mx-4 w-full max-w-sm rounded-2xl p-6 animate-fade-up"
        style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-lg)" }}
      >
        <div
          className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4"
          style={{ background: "var(--hubb-tint)" }}
        >
          <svg className="w-7 h-7" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-center" style={{ color: "var(--text-primary)" }}>
          Start a new order?
        </h3>
        <p className="text-sm text-center mt-2" style={{ color: "var(--text-secondary)" }}>
          Your cart has items from <strong>{pendingSwitch.fromRestaurant}</strong>. Adding items from <strong>{pendingSwitch.item.restaurantName}</strong> will clear your current cart.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={cancelSwitch}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{
              background: "var(--bg-search)",
              color: "var(--text-primary)",
            }}
          >
            Keep Cart
          </button>
          <button
            onClick={confirmSwitch}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "var(--hubb-accent)" }}
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>
  );
}

function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    function goOffline() { setOffline(true); }
    function goOnline() { setOffline(false); }
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      className="w-full py-2.5 text-center text-sm font-medium text-white flex items-center justify-center gap-2"
      style={{ background: "var(--hubb-orange)" }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a4 4 0 010-5.656M6.343 6.343a8 8 0 000 11.314" />
      </svg>
      You&apos;re offline. Check your connection.
    </div>
  );
}

function ShellContent({ children, cartOpen, setCartOpen }: { children: ReactNode; cartOpen: boolean; setCartOpen: (v: boolean) => void }) {
  return (
    <>
      {/* Skip to content — keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold focus:text-white"
        style={{ background: "var(--hubb-accent)" }}
      >
        Skip to content
      </a>
      <OfflineBanner />
      <ActiveOrderBanner />
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main id="main-content" className="flex-1 pb-16 sm:pb-0">{children}</main>
      <div className="hidden sm:block">
        <Footer />
      </div>
      <MobileNav />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <RestaurantSwitchModal />
    </>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <StoreProvider>
      <ToastProvider>
        <ShellContent cartOpen={cartOpen} setCartOpen={setCartOpen}>
          {children}
        </ShellContent>
      </ToastProvider>
    </StoreProvider>
  );
}
