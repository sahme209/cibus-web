"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, useAddress } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";
import * as api from "@/lib/api";
import type { DeliveryAddress } from "@/lib/types";

export default function ProfilePage() {
  const { isLoggedIn, user, logout } = useAuth();
  const { addresses, refreshAddresses } = useAddress();
  const { showToast } = useToast();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    latitude: 33.6844,
    longitude: 73.0479,
  });
  const [addingAddress, setAddingAddress] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="text-center animate-fade-up">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ background: "var(--bg-search)" }}
          >
            <svg className="w-10 h-10" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Sign in to view your profile
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage your account, addresses, and preferences
          </p>
          <Link
            href="/auth"
            className="inline-block mt-5 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--hubb-accent)" }}
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  async function handleAddAddress() {
    if (!newAddress.label.trim() || !newAddress.street.trim() || !newAddress.city.trim()) {
      showToast("Please fill in all address fields", "error");
      return;
    }
    setAddingAddress(true);
    try {
      await api.addAddress(newAddress);
      await refreshAddresses();
      setNewAddress({ label: "", street: "", city: "", latitude: 33.6844, longitude: 73.0479 });
      setShowAddAddress(false);
      showToast("Address added successfully");
    } catch (err: any) {
      showToast(err.message || "Failed to add address", "error");
    } finally {
      setAddingAddress(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    setDeletingId(id);
    try {
      await api.deleteAddress(id);
      await refreshAddresses();
      showToast("Address removed");
    } catch (err: any) {
      showToast(err.message || "Failed to remove address", "error");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          My Account
        </h1>

        {/* User Info Card */}
        <div
          className="rounded-2xl p-5 mb-5 animate-fade-up"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
              style={{ background: "var(--hubb-accent)" }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold truncate" style={{ color: "var(--text-primary)" }}>
                {user?.name || "User"}
              </h2>
              <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                {user?.email}
              </p>
              {user?.phone && (
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {user.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div
          className="rounded-2xl overflow-hidden divide-y mb-5 animate-fade-up"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", borderColor: "var(--border-subtle)" }}
        >
          {[
            { label: "My Orders", href: "/orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
            { label: "Browse Restaurants", href: "/", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
            { label: "View Cart", href: "/cart", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-3 px-5 py-4 transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <svg className="w-5 h-5 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
              </svg>
              <span className="text-sm font-medium flex-1" style={{ color: "var(--text-primary)" }}>
                {link.label}
              </span>
              <svg className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Addresses */}
        <div
          className="rounded-2xl p-5 mb-5 animate-fade-up"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              Delivery Addresses
            </h2>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--hubb-accent)" }}
            >
              {showAddAddress ? "Cancel" : "+ Add New"}
            </button>
          </div>

          {showAddAddress && (
            <div
              className="rounded-xl p-4 mb-4 space-y-3"
              style={{ background: "var(--bg-search)" }}
            >
              <input
                type="text"
                placeholder="Label (e.g. Home, Office)"
                value={newAddress.label}
                onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
              />
              <input
                type="text"
                placeholder="Street address"
                value={newAddress.street}
                onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}
              />
              <button
                onClick={handleAddAddress}
                disabled={addingAddress}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50"
                style={{ background: "var(--hubb-accent)" }}
              >
                {addingAddress ? "Adding..." : "Save Address"}
              </button>
            </div>
          )}

          {addresses.length > 0 ? (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "var(--bg-search)" }}
                >
                  <svg className="w-4 h-4 shrink-0" style={{ color: "var(--hubb-accent)" }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {addr.label}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                      {addr.street}, {addr.city}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    disabled={deletingId === addr.id}
                    className="p-2 rounded-lg transition-colors hover:opacity-70 disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" style={{ color: "var(--hubb-orange)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-tertiary)" }}>
              No saved addresses yet
            </p>
          )}
        </div>

        {/* Sign Out */}
        <button
          onClick={() => {
            logout();
            showToast("Signed out successfully");
          }}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-80 animate-fade-up"
          style={{
            background: "var(--bg-card)",
            color: "var(--hubb-orange)",
            border: "1px solid var(--border-default)",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
