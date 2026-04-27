"use client";

import { useState } from "react";
import Link from "next/link";
import { useAddress, useAuth } from "@/lib/store";

export default function AddressSelector() {
  const { isLoggedIn } = useAuth();
  const { addresses, selectedAddress, selectAddress } = useAddress();
  const [open, setOpen] = useState(false);

  if (!isLoggedIn || addresses.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm max-w-[200px] transition-colors"
        style={{ background: "var(--bg-search)", color: "var(--text-primary)" }}
      >
        <svg className="w-4 h-4 shrink-0" style={{ color: "var(--hubb-accent)" }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
        </svg>
        <span className="truncate font-medium">
          {selectedAddress?.label || "Select address"}
        </span>
        <svg className="w-3 h-3 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-11 w-72 rounded-xl py-2 z-50"
            style={{
              background: "var(--bg-card)",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border-default)",
            }}
          >
            <p
              className="px-4 py-2 text-xs font-semibold"
              style={{ color: "var(--text-tertiary)" }}
            >
              DELIVER TO
            </p>
            {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => {
                  selectAddress(addr);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:opacity-80"
                style={{
                  background:
                    selectedAddress?.id === addr.id
                      ? "var(--hubb-tint)"
                      : "transparent",
                }}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  style={{
                    color:
                      selectedAddress?.id === addr.id
                        ? "var(--hubb-accent)"
                        : "var(--text-tertiary)",
                  }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                </svg>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {addr.label}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {addr.street}, {addr.city}
                  </p>
                </div>
                {selectedAddress?.id === addr.id && (
                  <svg className="w-4 h-4 shrink-0 ml-auto" style={{ color: "var(--hubb-accent)" }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
            ))}
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors hover:opacity-80 border-t"
              style={{ color: "var(--hubb-accent)", borderColor: "var(--border-subtle)" }}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add new address
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
