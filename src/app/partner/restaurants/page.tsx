"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import * as api from "@/lib/api";

const STATS = [
  { value: "10,000+", label: "Active customers" },
  { value: "30 min", label: "Avg delivery time" },
  { value: "25%", label: "Revenue increase" },
  { value: "4.8", label: "Partner rating" },
];

const STEPS = [
  {
    step: "01",
    title: "Apply online",
    desc: "Fill out a quick application with your restaurant details. Our team reviews it within 48 hours.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    step: "02",
    title: "Set up your menu",
    desc: "Upload your menu, set prices, and customize options using our restaurant dashboard.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    step: "03",
    title: "Start receiving orders",
    desc: "Accept orders through the HUBB Restaurant app. Our riders pick up and deliver to customers.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const FEATURES = [
  { title: "More Customers", desc: "Access a growing network of food lovers looking for quality meals in your area.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "#007AFF" },
  { title: "Easy Management", desc: "Manage orders, update menus, and track performance with our real-time dashboard.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "#5856D6" },
  { title: "Reliable Delivery", desc: "Our trained riders ensure your food reaches customers fresh and on time, every time.", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "#FF3008" },
  { title: "Marketing Support", desc: "Get featured in promotions, deals, and curated collections to boost your visibility.", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z", color: "#FFB347" },
  { title: "Flexible Payouts", desc: "Weekly settlements directly to your bank account with transparent fee breakdowns.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#00704A" },
  { title: "24/7 Support", desc: "Dedicated partner support team available round the clock to resolve any issues quickly.", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", color: "#34C759" },
];

const FAQ = [
  { q: "How much does it cost to join?", a: "There's no sign-up fee. HUBB charges a commission on each completed order, which varies based on your agreement and services selected." },
  { q: "How long does onboarding take?", a: "Most restaurants are live within 48 hours of submitting their application and menu." },
  { q: "Can I set my own prices?", a: "Yes, you have full control over your menu items, pricing, and availability." },
  { q: "How do payouts work?", a: "Payouts are processed weekly and deposited directly into your registered bank account." },
  { q: "Can I pause my listing?", a: "Yes. You can temporarily mark your restaurant as closed from the dashboard at any time." },
];

const CITIES = ["Islamabad"];

const CUISINES = [
  "Pakistani",
  "Fast Food",
  "Chinese",
  "BBQ",
  "Desi",
  "Biryani",
  "Continental",
  "Desserts",
  "Cafe",
  "Other",
];

const INTEGRATION_TYPES = [
  { value: "APP", label: "Restaurant App", desc: "Manage orders through the HUBB Restaurant mobile app" },
  { value: "WEB", label: "Web Dashboard", desc: "Use the browser-based restaurant dashboard" },
  { value: "POS", label: "POS Integration", desc: "Connect your existing POS system via API" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i.toString().padStart(2, "0");
  return `${h}:00`;
});

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length < 8) return { label: "Too short", color: "var(--hubb-error)", width: "20%" };
  let score = 0;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score <= 2) return { label: "Weak", color: "var(--hubb-orange)", width: "33%" };
  if (score <= 3) return { label: "Fair", color: "#E5A100", width: "66%" };
  return { label: "Strong", color: "var(--hubb-accent)", width: "100%" };
}

type FormData = {
  partnerName: string;
  email: string;
  password: string;
  phone: string;
  restaurantName: string;
  address: string;
  city: string;
  sector: string;
  cuisineType: string;
  integrationType: string;
  openTime: string;
  closeTime: string;
  deliveryRadiusKm: number;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

type SuccessData = {
  restaurantName: string;
  partnerId: string;
  message: string;
};

export default function PartnerRestaurantsPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    partnerName: "",
    email: "",
    password: "",
    phone: "",
    restaurantName: "",
    address: "",
    city: "",
    sector: "",
    cuisineType: "",
    integrationType: "APP",
    openTime: "09:00",
    closeTime: "23:00",
    deliveryRadiusKm: 5,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const emailCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const checkEmail = useCallback((email: string) => {
    if (emailCheckTimer.current) clearTimeout(emailCheckTimer.current);
    setEmailAvailable(null);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setEmailChecking(true);
    emailCheckTimer.current = setTimeout(async () => {
      try {
        const res = await api.checkRestaurantEmail(email);
        setEmailAvailable(res.available);
        if (!res.available) {
          setErrors((prev) => ({ ...prev, email: "This email is already registered" }));
        }
      } catch {
        // silently fail — server-side check will catch duplicates
      } finally {
        setEmailChecking(false);
      }
    }, 600);
  }, []);

  const validateStep1 = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.partnerName.trim()) errs.partnerName = "Full name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    } else if (emailAvailable === false) {
      errs.email = "This email is already registered";
    }
    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (form.phone.replace(/\D/g, "").length < 10) {
      errs.phone = "Enter a valid phone number (10+ digits)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.restaurantName.trim()) errs.restaurantName = "Restaurant name is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city) errs.city = "Select a city";
    if (!form.sector.trim()) errs.sector = "Sector/area is required";
    if (!form.cuisineType) errs.cuisineType = "Select a cuisine type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setSubmitting(true);
    setApiError("");
    try {
      const res = await api.restaurantOnboarding({
        partnerName: form.partnerName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.replace(/\D/g, ""),
        restaurantName: form.restaurantName.trim(),
        address: form.address.trim(),
        city: form.city,
        sector: form.sector.trim(),
        cuisineType: form.cuisineType,
        integrationType: form.integrationType,
        openHours: { open: form.openTime, close: form.closeTime },
        deliveryRadiusKm: form.deliveryRadiusKm,
      });
      setSuccessData({
        restaurantName: res.data.restaurantName,
        partnerId: res.data.partnerId,
        message: res.message,
      });
      setStep(3);
    } catch (err: any) {
      if (err?.status === 409) {
        setApiError("An account with this email already exists. Please use a different email.");
      } else if (err?.status === 400) {
        setApiError(err.message || "Please check your details and try again.");
      } else {
        setApiError(err?.message || "Something went wrong. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  const inputStyle = (field?: keyof FormData) => ({
    background: "var(--bg-search)",
    border: `1.5px solid ${errors[field!] ? "var(--hubb-orange)" : "var(--border-default)"}`,
    color: "var(--text-primary)",
    outline: "none",
  });

  const labelStyle = { color: "var(--text-secondary)" };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
            style={{
              background: step >= s ? "var(--hubb-accent)" : "var(--bg-search)",
              color: step >= s ? "white" : "var(--text-tertiary)",
              border: step >= s ? "none" : "1.5px solid var(--border-default)",
            }}
          >
            {step > s ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              s
            )}
          </div>
          {s < 3 && (
            <div
              className="w-12 sm:w-20 h-0.5 rounded-full"
              style={{ background: step > s ? "var(--hubb-accent)" : "var(--border-default)" }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5 animate-fade-up">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          Partner Information
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Tell us about yourself
        </p>
      </div>

      {/* Partner Name */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Full Name <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Ahmed Khan"
          value={form.partnerName}
          onChange={(e) => updateField("partnerName", e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
          style={inputStyle("partnerName")}
        />
        {errors.partnerName && (
          <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.partnerName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Email Address <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => {
              updateField("email", e.target.value);
              setEmailAvailable(null);
            }}
            onBlur={() => checkEmail(form.email)}
            className="w-full px-4 py-3 rounded-xl text-sm pr-10 transition-colors focus:ring-0"
            style={inputStyle("email")}
          />
          {emailChecking && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: "var(--border-default)", borderTopColor: "var(--hubb-accent)" }}
              />
            </div>
          )}
          {!emailChecking && emailAvailable === true && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {!emailChecking && emailAvailable === false && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5" style={{ color: "var(--hubb-orange)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Password <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <input
          type="password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
          style={inputStyle("password")}
        />
        {form.password.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-search)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: passwordStrength.width, background: passwordStrength.color }}
                />
              </div>
              <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}
        {errors.password && (
          <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.password}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Phone Number <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <div className="flex">
          <div
            className="flex items-center gap-1.5 px-3 py-3 rounded-l-xl text-sm font-medium shrink-0"
            style={{
              background: "var(--bg-search)",
              border: "1.5px solid var(--border-default)",
              borderRight: "none",
              color: "var(--text-secondary)",
            }}
          >
            <span>🇵🇰</span>
            <span>+92</span>
          </div>
          <input
            type="tel"
            placeholder="3XX XXXXXXX"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value.replace(/[^0-9\s-]/g, ""))}
            className="w-full px-4 py-3 rounded-r-xl text-sm transition-colors focus:ring-0"
            style={{
              ...inputStyle("phone"),
              borderLeft: "none",
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          />
        </div>
        {errors.phone && (
          <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.phone}</p>
        )}
      </div>

      <button
        onClick={handleNext}
        className="w-full px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{ background: "var(--hubb-accent)" }}
      >
        Continue
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5 animate-fade-up">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          Restaurant Details
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Tell us about your restaurant
        </p>
      </div>

      {/* Restaurant Name */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Restaurant Name <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Karachi Broast"
          value={form.restaurantName}
          onChange={(e) => updateField("restaurantName", e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
          style={inputStyle("restaurantName")}
        />
        {errors.restaurantName && (
          <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.restaurantName}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Address <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="Full street address"
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
          style={inputStyle("address")}
        />
        {errors.address && (
          <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.address}</p>
        )}
      </div>

      {/* City + Sector */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
            City <span style={{ color: "var(--hubb-orange)" }}>*</span>
          </label>
          <select
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0 appearance-none"
            style={inputStyle("city")}
          >
            <option value="">Select city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.city && (
            <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.city}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
            Sector / Area <span style={{ color: "var(--hubb-orange)" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. F-7, DHA Phase 5"
            value={form.sector}
            onChange={(e) => updateField("sector", e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
            style={inputStyle("sector")}
          />
          {errors.sector && (
            <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.sector}</p>
          )}
        </div>
      </div>

      {/* Cuisine Type */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Cuisine Type <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <select
          value={form.cuisineType}
          onChange={(e) => updateField("cuisineType", e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0 appearance-none"
          style={inputStyle("cuisineType")}
        >
          <option value="">Select cuisine</option>
          {CUISINES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.cuisineType && (
          <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.cuisineType}</p>
        )}
      </div>

      {/* Integration Type */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Integration Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {INTEGRATION_TYPES.map((it) => (
            <button
              key={it.value}
              type="button"
              onClick={() => updateField("integrationType", it.value)}
              className="text-left rounded-xl p-3 transition-all"
              style={{
                background: form.integrationType === it.value ? "var(--hubb-tint)" : "var(--bg-search)",
                border: `1.5px solid ${form.integrationType === it.value ? "var(--hubb-accent)" : "var(--border-default)"}`,
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: form.integrationType === it.value ? "var(--hubb-accent)" : "var(--text-primary)" }}
              >
                {it.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                {it.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Opening Hours */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Opening Hours
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>Open</label>
            <select
              value={form.openTime}
              onChange={(e) => updateField("openTime", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0 appearance-none"
              style={inputStyle()}
            >
              {HOURS.map((h) => (
                <option key={`open-${h}`} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>Close</label>
            <select
              value={form.closeTime}
              onChange={(e) => updateField("closeTime", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0 appearance-none"
              style={inputStyle()}
            >
              {HOURS.map((h) => (
                <option key={`close-${h}`} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Delivery Radius */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Delivery Radius: <span style={{ color: "var(--hubb-accent)" }}>{form.deliveryRadiusKm} km</span>
        </label>
        <input
          type="range"
          min={1}
          max={15}
          step={1}
          value={form.deliveryRadiusKm}
          onChange={(e) => updateField("deliveryRadiusKm", Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: "var(--hubb-accent)", background: "var(--bg-search)" }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>1 km</span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>15 km</span>
        </div>
      </div>

      {/* API Error */}
      {apiError && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "var(--hubb-error-bg)", color: "var(--hubb-error)" }}
        >
          {apiError}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: "var(--bg-search)",
            color: "var(--text-secondary)",
            border: "1.5px solid var(--border-default)",
          }}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          style={{ background: "var(--hubb-accent)" }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <div
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }}
              />
              Submitting...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center animate-fade-up py-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background: "var(--hubb-tint)" }}
      >
        <svg className="w-8 h-8" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Application Submitted!
      </h3>
      {successData && (
        <>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            {successData.message}
          </p>
          <div
            className="rounded-xl p-5 text-left space-y-3 mb-6"
            style={{ background: "var(--bg-search)", border: "1.5px solid var(--border-default)" }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Restaurant</span>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {successData.restaurantName}
              </span>
            </div>
            <div
              className="border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Partner ID</span>
              <span className="text-sm font-mono font-semibold" style={{ color: "var(--hubb-accent)" }}>
                {successData.partnerId}
              </span>
            </div>
          </div>
          <div
            className="rounded-xl px-4 py-3 text-sm text-left"
            style={{ background: "var(--hubb-tint)", color: "var(--hubb-accent)" }}
          >
            Your listing is under review and will be activated within 1-3 business days. Download the HUBB Restaurant app to manage your orders.
          </div>
        </>
      )}
    </div>
  );

  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80"
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
              PARTNER WITH US
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Grow your restaurant
              <br />
              <span style={{ color: "#00D474" }}>with HUBB</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg leading-relaxed">
              Reach thousands of hungry customers in your city. Join HUBB&apos;s restaurant partner network and increase your revenue.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#apply"
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
      <section id="apply" className="scroll-mt-20 mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Apply to become a partner
          </h2>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            Fill out the form below and we&apos;ll get you started
          </p>
        </div>
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-lg)" }}
        >
          {renderStepIndicator()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>
          Everything you need to succeed
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
            Get started in 3 easy steps
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
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to grow your business?</h2>
            <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
              Join hundreds of restaurant partners already thriving on HUBB.
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "white", color: "var(--hubb-accent)" }}
            >
              Apply Now
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
