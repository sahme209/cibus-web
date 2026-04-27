"use client";

import Link from "next/link";
import { useCart } from "@/lib/store";
import { useAuth } from "@/lib/store";
import { useState } from "react";
import AddressSelector from "./AddressSelector";

interface NavbarProps {
  onCartClick?: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const { itemCount, subtotal } = useCart();
  const { isLoggedIn, user, logout, loading: authLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("delivery");

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "color-mix(in srgb, var(--bg-primary) 92%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "var(--border-default)",
      }}
      role="banner"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-white text-lg"
            style={{ background: "var(--hubb-accent)" }}
          >
            H
          </div>
          <span className="text-xl font-bold hidden sm:inline" style={{ color: "var(--text-primary)" }}>
            HUBB
          </span>
        </Link>

        {/* Search — DoorDash style */}
        <div className="hidden flex-1 max-w-xl mx-4 sm:block">
          <Link
            href="/search"
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-full text-sm transition-all hover:shadow-md"
            style={{
              background: "var(--bg-search)",
              color: "var(--text-placeholder)",
            }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search &quot;DashMart&quot;
          </Link>
        </div>

        {/* Address selector */}
        <div className="hidden lg:block">
          <AddressSelector />
        </div>

        {/* Delivery / Pickup toggle */}
        <div
          className="hidden md:flex items-center rounded-full p-0.5"
          style={{ background: "var(--bg-search)" }}
        >
          {(["delivery", "pickup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setDeliveryMode(m)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize"
              style={{
                background: deliveryMode === m ? "var(--bg-card)" : "transparent",
                color: deliveryMode === m ? "var(--text-primary)" : "var(--text-tertiary)",
                boxShadow: deliveryMode === m ? "var(--shadow-sm)" : "none",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            onClick={onCartClick}
            aria-label={itemCount > 0 ? `Cart with ${itemCount} items` : "Cart"}
            className="relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: itemCount > 0 ? "var(--hubb-accent)" : "var(--bg-surface)",
              color: itemCount > 0 ? "white" : "var(--text-secondary)",
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {itemCount > 0 && (
              <span className="hidden sm:inline">Rs. {Math.round(subtotal)}</span>
            )}
            {itemCount > 0 && (
              <span
                className="sm:hidden absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "var(--hubb-primary)" }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {authLoading ? (
            <div className="hidden sm:block w-8 h-8 rounded-full skeleton-shimmer" />
          ) : isLoggedIn ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors"
                style={{ background: "var(--bg-search)", color: "var(--text-primary)" }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "var(--hubb-accent)" }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden md:inline max-w-[80px] truncate">{user?.name?.split(" ")[0]}</span>
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div
                    className="absolute right-0 top-12 w-56 rounded-xl py-2 z-50 animate-fade-in"
                    style={{
                      background: "var(--bg-card)",
                      boxShadow: "var(--shadow-lg)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                      <Link href="/profile" className="text-xs hover:underline" style={{ color: "var(--hubb-accent)" }} onClick={() => setShowUserMenu(false)}>
                        View Profile
                      </Link>
                    </div>
                    {[
                      { label: "Home", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                      { label: "Orders", href: "/orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                      { label: "Account", href: "/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:opacity-70 transition-opacity"
                        style={{ color: "var(--text-primary)" }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t mt-1 pt-1" style={{ borderColor: "var(--border-subtle)" }}>
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm hover:opacity-70 transition-opacity"
                        style={{ color: "var(--hubb-orange)" }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/auth"
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ color: "var(--hubb-accent)" }}
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--hubb-accent)" }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
