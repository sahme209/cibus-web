"use client";

import { useState, type ReactNode } from "react";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "./ToastProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ActiveOrderBanner from "./ActiveOrderBanner";
import CartDrawer from "./CartDrawer";
import MobileNav from "./MobileNav";

export default function AppShell({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <StoreProvider>
      <ToastProvider>
        <ActiveOrderBanner />
        <Navbar onCartClick={() => setCartOpen(true)} />
        <main className="flex-1 pb-16 sm:pb-0">{children}</main>
        <div className="hidden sm:block">
          <Footer />
        </div>
        <MobileNav />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </ToastProvider>
    </StoreProvider>
  );
}
