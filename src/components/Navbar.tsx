"use client";

import Link from "next/link";
import { useCart } from "@/lib/store";
import { useAuth } from "@/lib/store";
import { useState } from "react";

export default function Navbar() {
  const { itemCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b" style={{ background: "var(--bg-primary)", borderColor: "var(--border-default)" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-white text-lg"
            style={{ background: "var(--cibus-accent)" }}
          >
            C
          </div>
          <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Cibus
          </span>
        </Link>

        {/* Search */}
        <div className="hidden flex-1 max-w-lg mx-8 sm:block">
          <Link
            href="/search"
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-full text-sm"
            style={{
              background: "var(--bg-search)",
              color: "var(--text-placeholder)",
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search restaurants, cuisines, dishes...
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors"
            style={{ background: itemCount > 0 ? "var(--cibus-accent)" : "var(--bg-surface)" }}
          >
            <svg className="w-5 h-5" fill="none" stroke={itemCount > 0 ? "white" : "var(--text-secondary)"} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {itemCount > 0 && (
              <span>{itemCount}</span>
            )}
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors"
                style={{ background: "var(--bg-search)", color: "var(--text-primary)" }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "var(--cibus-accent)" }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline">{user?.name?.split(" ")[0]}</span>
              </button>
              {showUserMenu && (
                <div
                  className="absolute right-0 top-12 w-48 rounded-xl py-2"
                  style={{
                    background: "var(--bg-card)",
                    boxShadow: "var(--shadow-lg)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  <Link
                    href="/orders"
                    className="block px-4 py-2.5 text-sm hover:opacity-70"
                    style={{ color: "var(--text-primary)" }}
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:opacity-70"
                    style={{ color: "var(--cibus-orange)" }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
              style={{
                background: "var(--text-primary)",
                color: "var(--bg-primary)",
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
