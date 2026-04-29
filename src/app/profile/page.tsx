"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, useAddress } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";
import * as api from "@/lib/api";

export default function ProfilePage() {
  const { isLoggedIn, user, logout, refreshUser } = useAuth();
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
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({ push: true, email: true, sms: true });

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

        {/* Loyalty Points Card */}
        <div
          className="rounded-2xl p-5 mb-5 animate-fade-up flex items-center gap-4"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
              150 <span className="text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>points</span>
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Earn 1 point per Rs. 10 spent</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold" style={{ color: "var(--hubb-accent)" }}>Rs. 150</p>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Redeemable</p>
          </div>
        </div>

        {/* User Info Card */}
        <div
          className="rounded-2xl p-5 mb-5 animate-fade-up"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
        >
          {editing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                  style={{ background: "var(--hubb-accent)" }}
                >
                  {editName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Edit Profile</h2>
              </div>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--bg-search)", color: "var(--text-primary)", border: "none" }}
              />
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "var(--bg-search)", color: "var(--text-primary)", border: "none" }}
              />
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{user?.email}</p>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (!editName.trim()) { showToast("Name is required", "error"); return; }
                    setSaving(true);
                    try {
                      await api.updateProfile({ name: editName.trim(), phone: editPhone.trim() || undefined });
                      await refreshUser();
                      setEditing(false);
                      showToast("Profile updated");
                    } catch (err: any) {
                      showToast(err.message || "Failed to update profile", "error");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: "var(--hubb-accent)" }}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "var(--bg-search)", color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
                style={{ background: "var(--hubb-accent)" }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
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
              <button
                onClick={() => { setEditName(user?.name || ""); setEditPhone(user?.phone || ""); setEditing(true); }}
                className="p-2.5 rounded-xl transition-colors hover:opacity-70 shrink-0"
                style={{ background: "var(--bg-search)" }}
                aria-label="Edit profile"
              >
                <svg className="w-4 h-4" style={{ color: "var(--text-secondary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* HUBB+ Membership */}
        <Link
          href="/hubb-plus"
          className="block rounded-2xl p-5 mb-5 animate-fade-up relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, var(--hubb-accent), #005C3C)", boxShadow: "var(--shadow-md)" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: "#FFD700" }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">HUBB+</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "rgba(255,255,255,0.2)" }}>
                  30 DAYS FREE
                </span>
              </div>
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-sm text-white/80 mb-3">
              Rs. 0 delivery fees, 5% cashback, exclusive deals, and priority support.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Free delivery
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                5% cashback
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                VIP support
              </span>
            </div>
            <span
              className="inline-block px-5 py-2 rounded-full text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
            >
              Start Free Trial →
            </span>
          </div>
        </Link>

        {/* Refer & Earn */}
        <div
          className="rounded-2xl p-5 mb-5 animate-fade-up"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,179,71,0.15)" }}>
              <svg className="w-5 h-5" style={{ color: "#FFB347" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Refer & Earn</h2>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Give Rs. 200, get Rs. 200</p>
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
            Share your code with friends. When they order, you both get Rs. 200 off!
          </p>
          <div className="flex items-center gap-2">
            <div
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-mono font-bold tracking-wider text-center"
              style={{ background: "var(--bg-search)", color: "var(--text-primary)", border: "1px dashed var(--border-default)" }}
            >
              HUBB-{user?.name?.slice(0, 4).toUpperCase() || "USER"}-200
            </div>
            <button
              onClick={() => {
                const code = `HUBB-${user?.name?.slice(0, 4).toUpperCase() || "USER"}-200`;
                navigator.clipboard.writeText(code);
                showToast("Referral code copied!");
              }}
              className="px-4 py-2.5 rounded-lg text-xs font-bold text-white shrink-0 transition-all hover:scale-105"
              style={{ background: "var(--hubb-accent)" }}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div
          className="rounded-2xl overflow-hidden divide-y mb-5 animate-fade-up"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", borderColor: "var(--border-subtle)" }}
        >
          {[
            { label: "My Orders", href: "/orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", subtitle: "Track active and past orders" },
            { label: "Saved Restaurants", href: "/", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", subtitle: "Your favorite places" },
            { label: "Payment Methods", href: "/profile", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", subtitle: "Manage cards and wallets" },
            { label: "Help & Support", href: "/help", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", subtitle: "FAQs, contact, and feedback" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--bg-search)" }}>
                <svg className="w-5 h-5" style={{ color: "var(--text-secondary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold block" style={{ color: "var(--text-primary)" }}>
                  {link.label}
                </span>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {link.subtitle}
                </span>
              </div>
              <svg className="w-4 h-4 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="rounded-xl p-4 mb-4 space-y-3 animate-fade-up"
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
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--hubb-tint)" }}>
                    <svg className="w-4 h-4" style={{ color: "var(--hubb-accent)" }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                    </svg>
                  </div>
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
                    aria-label="Delete address"
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

        {/* Preferences */}
        <div
          className="rounded-2xl overflow-hidden divide-y mb-5 animate-fade-up"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", borderColor: "var(--border-subtle)" }}
        >
          <div className="px-5 py-3">
            <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Preferences</h2>
          </div>
          {[
            { label: "Push Notifications", description: "Order updates, promos, and deals", key: "push" as const },
            { label: "Email Updates", description: "Weekly deals and restaurant picks", key: "email" as const },
            { label: "SMS Alerts", description: "Delivery and order status texts", key: "sms" as const },
          ].map((pref) => (
            <div
              key={pref.label}
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{pref.label}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{pref.description}</p>
              </div>
              <button
                onClick={() => {
                  setPrefs((p) => ({ ...p, [pref.key]: !p[pref.key] }));
                  showToast(`${pref.label} ${prefs[pref.key] ? "disabled" : "enabled"}`);
                }}
                className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
                style={{ background: prefs[pref.key] ? "var(--hubb-accent)" : "var(--border-default)" }}
                role="switch"
                aria-checked={prefs[pref.key]}
                aria-label={pref.label}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all"
                  style={{ left: prefs[pref.key] ? "calc(100% - 22px)" : "2px" }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div
          className="rounded-2xl overflow-hidden divide-y mb-5 animate-fade-up"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", borderColor: "var(--border-subtle)" }}
        >
          {[
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between px-5 py-3.5 transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{link.label}</span>
              <svg className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* App version */}
        <p className="text-center text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>
          HUBB v1.0.0
        </p>

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
