"use client";

import { useState, type ReactNode } from "react";
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

function ShellContent({ children, cartOpen, setCartOpen }: { children: ReactNode; cartOpen: boolean; setCartOpen: (v: boolean) => void }) {
  return (
    <>
      <ActiveOrderBanner />
      <Navbar onCartClick={() => setCartOpen(true)} />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
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
