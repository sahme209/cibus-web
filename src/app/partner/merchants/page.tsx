"use client";

import { useState } from "react";
import Image from "next/image";
import * as api from "@/lib/api";

const STATS = [
  { value: "50+", label: "Categories" },
  { value: "24hr", label: "Onboarding" },
  { value: "0%", label: "Sign-up fee" },
  { value: "Weekly", label: "Payouts" },
];

const STEPS = [
  {
    step: "01",
    title: "Register your store",
    desc: "Submit a quick form with your business details. Our team verifies and approves within 24 hours.",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    step: "02",
    title: "Upload your catalog",
    desc: "Add products with photos, descriptions, and pricing. Organize into categories for easy browsing.",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    step: "03",
    title: "Start selling",
    desc: "Receive orders through the HUBB Merchant app. Our riders handle all the deliveries.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const FEATURES = [
  { title: "Wider Reach", desc: "Access thousands of customers in your city without the overhead of a physical storefront.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#007AFF" },
  { title: "Quick Onboarding", desc: "Get set up and start selling in as little as 24 hours with our streamlined process.", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "#FF3008" },
  { title: "Real-time Analytics", desc: "Track sales, monitor popular items, and optimize your offerings with our live dashboard.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "#5856D6" },
  { title: "Inventory Management", desc: "Mark items in/out of stock in real time. Set operating hours and manage availability.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", color: "#00704A" },
  { title: "Promotional Tools", desc: "Create discounts, featured placements, and bundle deals to attract more customers.", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z", color: "#FFB347" },
  { title: "Dedicated Support", desc: "Merchant support team available via chat and phone to help with any issue.", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", color: "#34C759" },
];

const FAQ = [
  { q: "What types of products can I sell?", a: "You can sell groceries, pharmacy items, flowers, pet supplies, electronics, and other retail goods. Food items follow the same regulations as our restaurant partners." },
  { q: "What are the fees?", a: "There's no sign-up or monthly fee. HUBB charges a commission per order, which varies based on your product category and delivery zone." },
  { q: "How do I manage my catalog?", a: "Use the HUBB Merchant dashboard or mobile app to add, edit, and manage your product listings in real time." },
  { q: "What areas do you deliver to?", a: "HUBB operates in major cities across Pakistan. Contact us to check if your area is currently covered." },
];

const SHOP_TYPES = [
  { value: "grocery", label: "Grocery" },
  { value: "bakery", label: "Bakery" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "convenience", label: "Convenience Store" },
  { value: "desserts_sweets", label: "Desserts & Sweets" },
  { value: "specialty_local", label: "Specialty & Local" },
  { value: "other", label: "Other" },
];

const CITIES = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Faisalabad",
  "Peshawar",
];

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: "", color: "transparent" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "var(--hubb-error)" };
  if (score <= 2) return { level: 2, label: "Fair", color: "var(--hubb-orange)" };
  if (score <= 3) return { level: 3, label: "Good", color: "var(--hubb-accent)" };
  return { level: 4, label: "Strong", color: "var(--hubb-accent)" };
}

export default function PartnerMerchantsPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [partnerId, setPartnerId] = useState("");
  const [shopId, setShopId] = useState("");

  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("");
  const [address, setAddress] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");

  const passwordStrength = getPasswordStrength(password);

  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!ownerName.trim()) errors.ownerName = "Owner name is required";
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else {
      const digitsOnly = phone.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        errors.phone = "Phone number must be at least 10 digits";
      }
    }
    if (!shopName.trim()) errors.shopName = "Shop name is required";
    if (!shopType) errors.shopType = "Please select a shop type";
    if (!address.trim()) errors.address = "Address is required";
    if (!sector.trim()) errors.sector = "Sector/area is required";
    if (!city) errors.city = "Please select a city";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const fullPhone = "+92" + phone.replace(/\D/g, "").replace(/^0+/, "");
      const result = await api.shopOnboarding({
        ownerName: ownerName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: fullPhone,
        shopName: shopName.trim(),
        shopType,
        address: address.trim(),
        sector: sector.trim(),
        city,
      });

      if (result.success) {
        setPartnerId(result.partnerId || "");
        setShopId(result.shopId || "");
        setStep(2);
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      if (message.includes("409") || message.toLowerCase().includes("duplicate") || message.toLowerCase().includes("already")) {
        setError("An account with this email already exists. Please use a different email or sign in.");
      } else if (message.includes("400") || message.toLowerCase().includes("validation")) {
        setError("Please check your information and try again.");
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = {
    background: "var(--bg-search)",
    border: "1.5px solid var(--border-default)",
    color: "var(--text-primary)",
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors focus:border-[var(--hubb-accent)]";

  function scrollToApply(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,60,40,0.8))" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl animate-fade-up">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-5"
              style={{ background: "rgba(0,112,74,0.9)", color: "white" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              MERCHANTS
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Sell on
              <br />
              <span style={{ color: "#00D474" }}>HUBB</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg leading-relaxed">
              Expand your reach by listing your products on HUBB. From groceries to essentials, connect with customers who need what you offer.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#apply"
                onClick={scrollToApply}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--hubb-accent)" }}
              >
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white/80 transition-all hover:text-white"
                style={{ border: "1px solid rgba(255,255,255,0.3)" }}
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div
          className="rounded-2xl grid grid-cols-2 sm:grid-cols-4 divide-x"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-lg)", borderColor: "var(--border-subtle)" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center py-6 px-4" style={{ borderColor: "var(--border-subtle)" }}>
              <p className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--hubb-accent)" }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="scroll-mt-20 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-fade-up rounded-2xl p-6 sm:p-8" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-lg)" }}>
          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4"
                  style={{ background: "var(--hubb-tint)" }}
                >
                  <svg className="w-7 h-7" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Register your shop
                </h2>
                <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                  Fill in your details and we will get you set up in no time.
                </p>
              </div>

              {error && (
                <div
                  className="rounded-xl px-4 py-3 mb-6 text-sm font-medium"
                  style={{ background: "var(--hubb-error-bg)", color: "var(--hubb-error)" }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                  {/* Owner Name */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      Owner Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={ownerName}
                      onChange={(e) => { setOwnerName(e.target.value); setFieldErrors((p) => ({ ...p, ownerName: "" })); }}
                      className={inputClasses}
                      style={inputStyle}
                    />
                    {fieldErrors.ownerName && (
                      <p className="text-xs mt-1" style={{ color: "var(--hubb-error)" }}>{fieldErrors.ownerName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
                      className={inputClasses}
                      style={inputStyle}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs mt-1" style={{ color: "var(--hubb-error)" }}>{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: "" })); }}
                        className={inputClasses}
                        style={{ ...inputStyle, paddingRight: "3rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-colors"
                              style={{
                                background: i <= passwordStrength.level ? passwordStrength.color : "var(--border-default)",
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-xs mt-1" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </p>
                      </div>
                    )}
                    {fieldErrors.password && (
                      <p className="text-xs mt-1" style={{ color: "var(--hubb-error)" }}>{fieldErrors.password}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div
                        className="flex items-center gap-1.5 px-3 py-3 rounded-xl text-sm shrink-0"
                        style={{ background: "var(--bg-search)", border: "1.5px solid var(--border-default)", color: "var(--text-secondary)" }}
                      >
                        <span>🇵🇰</span>
                        <span>+92</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="3XX XXXXXXX"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d\s-]/g, "");
                          setPhone(val);
                          setFieldErrors((p) => ({ ...p, phone: "" }));
                        }}
                        className={inputClasses}
                        style={inputStyle}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-xs mt-1" style={{ color: "var(--hubb-error)" }}>{fieldErrors.phone}</p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="pt-2 pb-1">
                    <div className="border-t" style={{ borderColor: "var(--border-subtle)" }} />
                    <p className="text-xs font-medium mt-4 mb-1" style={{ color: "var(--text-tertiary)" }}>
                      SHOP DETAILS
                    </p>
                  </div>

                  {/* Shop Name */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      Shop Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your business name"
                      value={shopName}
                      onChange={(e) => { setShopName(e.target.value); setFieldErrors((p) => ({ ...p, shopName: "" })); }}
                      className={inputClasses}
                      style={inputStyle}
                    />
                    {fieldErrors.shopName && (
                      <p className="text-xs mt-1" style={{ color: "var(--hubb-error)" }}>{fieldErrors.shopName}</p>
                    )}
                  </div>

                  {/* Shop Type */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      Shop Type
                    </label>
                    <select
                      value={shopType}
                      onChange={(e) => { setShopType(e.target.value); setFieldErrors((p) => ({ ...p, shopType: "" })); }}
                      className={inputClasses}
                      style={inputStyle}
                    >
                      <option value="">Select shop type</option>
                      {SHOP_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    {fieldErrors.shopType && (
                      <p className="text-xs mt-1" style={{ color: "var(--hubb-error)" }}>{fieldErrors.shopType}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Shop address"
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); setFieldErrors((p) => ({ ...p, address: "" })); }}
                      className={inputClasses}
                      style={inputStyle}
                    />
                    {fieldErrors.address && (
                      <p className="text-xs mt-1" style={{ color: "var(--hubb-error)" }}>{fieldErrors.address}</p>
                    )}
                  </div>

                  {/* Sector & City row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                        Sector / Area
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. F-7, Gulberg"
                        value={sector}
                        onChange={(e) => { setSector(e.target.value); setFieldErrors((p) => ({ ...p, sector: "" })); }}
                        className={inputClasses}
                        style={inputStyle}
                      />
                      {fieldErrors.sector && (
                        <p className="text-xs mt-1" style={{ color: "var(--hubb-error)" }}>{fieldErrors.sector}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                        City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => { setCity(e.target.value); setFieldErrors((p) => ({ ...p, city: "" })); }}
                        className={inputClasses}
                        style={inputStyle}
                      >
                        <option value="">Select city</option>
                        {CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      {fieldErrors.city && (
                        <p className="text-xs mt-1" style={{ color: "var(--hubb-error)" }}>{fieldErrors.city}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-8 px-6 py-4 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "var(--hubb-accent)" }}
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Step 2: Success */
            <div className="text-center animate-fade-up py-4">
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5"
                style={{ background: "var(--hubb-tint)" }}
              >
                <svg className="w-8 h-8" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                Application submitted!
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Your shop is under verification and will be activated within 1-3 business days. Download the HUBB Merchant app to manage your store.
              </p>

              <div
                className="rounded-xl p-4 mb-6 text-left space-y-3"
                style={{ background: "var(--bg-search)", border: "1.5px solid var(--border-subtle)" }}
              >
                {partnerId && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>Partner ID</span>
                    <span className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>{partnerId}</span>
                  </div>
                )}
                {shopId && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>Shop ID</span>
                    <span className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>{shopId}</span>
                  </div>
                )}
              </div>

              <div
                className="rounded-xl p-4 mb-6 flex items-start gap-3 text-left"
                style={{ background: "var(--hubb-tint)" }}
              >
                <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Save your Partner ID and Shop ID for your records. You will receive a confirmation email with next steps shortly.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>
          Grow your business online
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl p-6 transition-all hover:-translate-y-0.5" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${f.color}15` }}>
                <svg className="w-6 h-6" style={{ color: f.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20" style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-12" style={{ color: "var(--text-primary)" }}>
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t border-dashed" style={{ borderColor: "var(--border-default)" }} />
                )}
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: "var(--hubb-tint)" }}>
                    <svg className="w-8 h-8" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                    </svg>
                  </div>
                  <span className="text-xs font-bold" style={{ color: "var(--hubb-accent)" }}>STEP {s.step}</span>
                  <h3 className="text-base font-bold mt-1 mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                  <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8" style={{ color: "var(--text-primary)" }}>
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl overflow-hidden"
              style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
            >
              <summary
                className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold list-none"
                style={{ color: "var(--text-primary)" }}
              >
                {item.q}
                <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--hubb-accent), #005C3C)" }}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-15 blur-3xl" style={{ background: "#FFD700" }} />
          <div className="relative">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to start selling?</h2>
            <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
              List your products and reach more customers than ever.
            </p>
            <a
              href="#apply"
              onClick={scrollToApply}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "white", color: "var(--hubb-accent)" }}
            >
              Get Started
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
