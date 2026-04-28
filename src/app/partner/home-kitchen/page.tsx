"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import * as api from "@/lib/api";

const STATS = [
  { value: "0%", label: "Sign-up fee" },
  { value: "24hr", label: "Approval time" },
  { value: "Rs. 500+", label: "Avg daily sales" },
  { value: "4.9", label: "Partner rating" },
];

const STEPS = [
  {
    step: "01",
    title: "Tell us about yourself",
    desc: "Fill out your details and describe your home kitchen. It only takes a few minutes.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    step: "02",
    title: "Add your menu",
    desc: "List your signature dishes with prices. Start with even just 3-5 items — you can add more later.",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    step: "03",
    title: "Start selling",
    desc: "Once approved, customers in your area can discover and order your home-cooked meals.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

const FEATURES = [
  { title: "Zero Setup Cost", desc: "No registration fee, no minimum orders. Start earning from day one with what you already have.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Flexible Hours", desc: "Cook when you want. Set your own availability and take a break whenever you need to.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Local Customers", desc: "Reach food lovers in your neighborhood who are looking for authentic home-cooked meals.", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
  { title: "Order Management", desc: "Accept or decline orders through the HUBB app. Full control over your kitchen workload.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { title: "Weekly Payouts", desc: "Earnings deposited directly to your bank account or mobile wallet every week.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { title: "Growth Support", desc: "Get featured in curated collections. We help you build a loyal customer base.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
];

const FAQ = [
  { q: "Do I need a commercial kitchen?", a: "No. You can cook from your home kitchen. We just ask that you maintain basic hygiene standards, which we'll verify during onboarding." },
  { q: "What documents do I need?", a: "Just your CNIC. A PFA license is optional but encouraged. We'll guide you through the process." },
  { q: "How many items should I start with?", a: "You can start with as few as 3 items. Many successful home chefs start small and grow their menu over time." },
  { q: "Can I set my own delivery area?", a: "Yes. You choose how far you want to deliver, and only customers within that radius will see your kitchen." },
  { q: "What commission does HUBB charge?", a: "HUBB charges a small commission on each completed order. Your first 30 days are commission-free so you can get started risk-free." },
];

const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar"];

const CUISINES = [
  "Pakistani",
  "Desi Home Food",
  "Biryani",
  "BBQ",
  "Desserts & Mithai",
  "Snacks & Chaat",
  "Bakery",
  "Healthy Meals",
  "Other",
];

const HYGIENE_ITEMS = [
  { key: "cleanKitchen", label: "I maintain a clean and hygienic kitchen" },
  { key: "separateStorage", label: "I store raw and cooked food separately" },
  { key: "handWashing", label: "I follow proper handwashing practices" },
  { key: "freshIngredients", label: "I use only fresh ingredients" },
  { key: "properCovering", label: "I properly cover and package all food" },
] as const;

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

type MenuItem = { id: string; name: string; price: string; category: string };

type FormData = {
  ownerName: string;
  email: string;
  password: string;
  phone: string;
  cnic: string;
  kitchenName: string;
  kitchenDescription: string;
  cuisineType: string;
  address: string;
  city: string;
  sector: string;
};

type HygieneChecklist = {
  cleanKitchen: boolean;
  separateStorage: boolean;
  handWashing: boolean;
  freshIngredients: boolean;
  properCovering: boolean;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

type SuccessData = {
  kitchenName: string;
  partnerId: string;
  message: string;
};

export default function HomeKitchenOnboardingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    cnic: "",
    kitchenName: "",
    kitchenDescription: "",
    cuisineType: "",
    address: "",
    city: "",
    sector: "",
  });
  const [hygiene, setHygiene] = useState<HygieneChecklist>({
    cleanKitchen: false,
    separateStorage: false,
    handWashing: false,
    freshIngredients: false,
    properCovering: false,
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [menuError, setMenuError] = useState("");
  const [hygieneError, setHygieneError] = useState("");
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
        // server-side check will catch duplicates
      } finally {
        setEmailChecking(false);
      }
    }, 600);
  }, []);

  const validateStep1 = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.ownerName.trim()) errs.ownerName = "Full name is required";
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
    if (!form.cnic.trim()) {
      errs.cnic = "CNIC is required";
    } else if (form.cnic.replace(/\D/g, "").length !== 13) {
      errs.cnic = "CNIC must be exactly 13 digits";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.kitchenName.trim()) errs.kitchenName = "Kitchen name is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city) errs.city = "Select a city";
    if (!form.sector.trim()) errs.sector = "Sector/area is required";
    if (!form.cuisineType) errs.cuisineType = "Select a cuisine type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    if (menuItems.length === 0) {
      setMenuError("Add at least one menu item");
      return false;
    }
    setMenuError("");
    return true;
  };

  const validateStep4 = (): boolean => {
    const allChecked = Object.values(hygiene).every(Boolean);
    if (!allChecked) {
      setHygieneError("Please confirm all hygiene standards");
      return false;
    }
    setHygieneError("");
    return true;
  };

  const addMenuItem = () => {
    if (!newItem.name.trim() || !newItem.price.trim()) return;
    const price = parseFloat(newItem.price);
    if (isNaN(price) || price <= 0) return;
    setMenuItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: newItem.name.trim(), price: newItem.price, category: newItem.category || "Main" },
    ]);
    setNewItem({ name: "", price: "", category: "" });
    setMenuError("");
  };

  const removeMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;
    setSubmitting(true);
    setApiError("");
    try {
      const res = await api.homeKitchenOnboarding({
        ownerName: form.ownerName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone.replace(/\D/g, ""),
        cnic: form.cnic.replace(/\D/g, ""),
        kitchenName: form.kitchenName.trim(),
        kitchenDescription: form.kitchenDescription.trim(),
        cuisineType: form.cuisineType,
        address: form.address.trim(),
        city: form.city,
        sector: form.sector.trim(),
        menuItems: menuItems.map((m) => ({ name: m.name, price: parseFloat(m.price), category: m.category })),
        hygieneChecklist: hygiene,
      });
      setSuccessData({
        kitchenName: res.data.kitchenName,
        partnerId: res.data.partnerId,
        message: res.message,
      });
      setStep(5);
    } catch (err: any) {
      if (err?.status === 409) {
        setApiError("An account with this email already exists.");
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

  const totalSteps = 5;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            style={{
              background: step >= s ? "var(--hubb-accent)" : "var(--bg-search)",
              color: step >= s ? "white" : "var(--text-tertiary)",
              border: step >= s ? "none" : "1.5px solid var(--border-default)",
            }}
          >
            {step > s ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              s
            )}
          </div>
          {s < totalSteps && (
            <div
              className="w-6 sm:w-10 h-0.5 rounded-full"
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
        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Personal Information</h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Tell us about yourself</p>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Full Name <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Fatima Ahmed"
          value={form.ownerName}
          onChange={(e) => updateField("ownerName", e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
          style={inputStyle("ownerName")}
        />
        {errors.ownerName && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.ownerName}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Email Address <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => { updateField("email", e.target.value); setEmailAvailable(null); }}
            onBlur={() => checkEmail(form.email)}
            className="w-full px-4 py-3 rounded-xl text-sm pr-10 transition-colors focus:ring-0"
            style={inputStyle("email")}
          />
          {emailChecking && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--border-default)", borderTopColor: "var(--hubb-accent)" }} />
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
        {errors.email && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.email}</p>}
      </div>

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
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-search)" }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: passwordStrength.width, background: passwordStrength.color }} />
            </div>
            <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
          </div>
        )}
        {errors.password && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.password}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Phone Number <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <div className="flex">
          <div
            className="flex items-center gap-1.5 px-3 py-3 rounded-l-xl text-sm font-medium shrink-0"
            style={{ background: "var(--bg-search)", border: "1.5px solid var(--border-default)", borderRight: "none", color: "var(--text-secondary)" }}
          >
            <span>🇵🇰</span><span>+92</span>
          </div>
          <input
            type="tel"
            placeholder="3XX XXXXXXX"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value.replace(/[^0-9\s-]/g, ""))}
            className="w-full px-4 py-3 rounded-r-xl text-sm transition-colors focus:ring-0"
            style={{ ...inputStyle("phone"), borderLeft: "none", borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          />
        </div>
        {errors.phone && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          CNIC Number <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="XXXXX-XXXXXXX-X"
          value={form.cnic}
          onChange={(e) => updateField("cnic", e.target.value.replace(/[^0-9-]/g, ""))}
          maxLength={15}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
          style={inputStyle("cnic")}
        />
        {errors.cnic && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.cnic}</p>}
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
        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Kitchen Details</h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Tell us about your kitchen</p>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Kitchen Name <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Fatima's Kitchen"
          value={form.kitchenName}
          onChange={(e) => updateField("kitchenName", e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
          style={inputStyle("kitchenName")}
        />
        {errors.kitchenName && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.kitchenName}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Description</label>
        <textarea
          placeholder="Describe your specialty, e.g. 'Authentic Lahori home-cooked meals made with love'"
          value={form.kitchenDescription}
          onChange={(e) => updateField("kitchenDescription", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0 resize-none"
          style={inputStyle()}
        />
      </div>

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
          {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.cuisineType && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.cuisineType}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Home Address <span style={{ color: "var(--hubb-orange)" }}>*</span>
        </label>
        <input
          type="text"
          placeholder="Full home address"
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
          style={inputStyle("address")}
        />
        {errors.address && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.address}</p>}
      </div>

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
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.city}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
            Sector / Area <span style={{ color: "var(--hubb-orange)" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. G-11, Bahria Town"
            value={form.sector}
            onChange={(e) => updateField("sector", e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm transition-colors focus:ring-0"
            style={inputStyle("sector")}
          />
          {errors.sector && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{errors.sector}</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
          style={{ background: "var(--bg-search)", color: "var(--text-secondary)", border: "1.5px solid var(--border-default)" }}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: "var(--hubb-accent)" }}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5 animate-fade-up">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Your Menu</h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Add at least one item to get started</p>
      </div>

      {menuItems.length > 0 && (
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: "var(--bg-search)", border: "1.5px solid var(--border-default)" }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{item.category} &middot; Rs. {item.price}</p>
              </div>
              <button onClick={() => removeMenuItem(item.id)} className="p-1.5 rounded-lg transition-colors hover:bg-black/5">
                <svg className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl p-4" style={{ background: "var(--bg-search)", border: "1.5px solid var(--border-default)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>Add a menu item</p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Item name, e.g. Chicken Biryani"
            value={newItem.name}
            onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg text-sm focus:ring-0"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-primary)", outline: "none" }}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Price (Rs.)"
              value={newItem.price}
              onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value.replace(/[^0-9.]/g, "") }))}
              className="w-full px-4 py-2.5 rounded-lg text-sm focus:ring-0"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-primary)", outline: "none" }}
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg text-sm focus:ring-0 appearance-none"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-primary)", outline: "none" }}
            >
              <option value="">Category</option>
              <option value="Main">Main Course</option>
              <option value="Starter">Starter</option>
              <option value="Dessert">Dessert</option>
              <option value="Drink">Drink</option>
              <option value="Side">Side</option>
            </select>
          </div>
          <button
            onClick={addMenuItem}
            disabled={!newItem.name.trim() || !newItem.price.trim()}
            className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: "var(--hubb-tint)", color: "var(--hubb-accent)" }}
          >
            + Add Item
          </button>
        </div>
      </div>

      {menuError && <p className="text-xs text-center" style={{ color: "var(--hubb-orange)" }}>{menuError}</p>}

      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
          style={{ background: "var(--bg-search)", color: "var(--text-secondary)", border: "1.5px solid var(--border-default)" }}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: "var(--hubb-accent)" }}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5 animate-fade-up">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Hygiene Standards</h3>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Confirm that you meet these basic hygiene requirements</p>
      </div>

      <div className="space-y-3">
        {HYGIENE_ITEMS.map((item) => (
          <label
            key={item.key}
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 cursor-pointer transition-all"
            style={{
              background: hygiene[item.key] ? "var(--hubb-tint)" : "var(--bg-search)",
              border: `1.5px solid ${hygiene[item.key] ? "var(--hubb-accent)" : "var(--border-default)"}`,
            }}
          >
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
              style={{
                background: hygiene[item.key] ? "var(--hubb-accent)" : "transparent",
                border: hygiene[item.key] ? "none" : "2px solid var(--border-default)",
              }}
            >
              {hygiene[item.key] && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={hygiene[item.key]}
              onChange={(e) => { setHygiene((prev) => ({ ...prev, [item.key]: e.target.checked })); setHygieneError(""); }}
              className="sr-only"
            />
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</span>
          </label>
        ))}
      </div>

      {hygieneError && <p className="text-xs text-center" style={{ color: "var(--hubb-orange)" }}>{hygieneError}</p>}

      {apiError && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--hubb-error-bg)", color: "var(--hubb-error)" }}>
          {apiError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
          style={{ background: "var(--bg-search)", color: "var(--text-secondary)", border: "1.5px solid var(--border-default)" }}
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
              <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
              Submitting...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center animate-fade-up py-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "var(--hubb-tint)" }}>
        <svg className="w-8 h-8" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Application Submitted!</h3>
      {successData && (
        <>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{successData.message}</p>
          <div
            className="rounded-xl p-5 text-left space-y-3 mb-6"
            style={{ background: "var(--bg-search)", border: "1.5px solid var(--border-default)" }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Kitchen</span>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{successData.kitchenName}</span>
            </div>
            <div className="border-t" style={{ borderColor: "var(--border-subtle)" }} />
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Partner ID</span>
              <span className="text-sm font-mono font-semibold" style={{ color: "var(--hubb-accent)" }}>{successData.partnerId}</span>
            </div>
            <div className="border-t" style={{ borderColor: "var(--border-subtle)" }} />
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Menu Items</span>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{menuItems.length} items</span>
            </div>
          </div>
          <div
            className="rounded-xl px-4 py-3 text-sm text-left"
            style={{ background: "var(--hubb-tint)", color: "var(--hubb-accent)" }}
          >
            Your home kitchen is under review. We&apos;ll verify your details and activate your listing within 24 hours. Download the HUBB Restaurant app to start managing orders.
          </div>
        </>
      )}
    </div>
  );

  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--hubb-primary)" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl animate-fade-up">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5"
              style={{ background: "var(--hubb-accent)", color: "white" }}
            >
              HOME KITCHEN
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Sell food from home
              <br />
              <span style={{ color: "var(--hubb-accent)" }}>with HUBB</span>
            </h1>
            <p className="mt-3 text-lg font-medium" style={{ color: "var(--hubb-accent)" }}>
              Ghar se khana becho!
            </p>
            <p className="mt-4 text-base sm:text-lg text-white/60 max-w-lg">
              Turn your home kitchen into a business. No rent, no setup costs — just your cooking skills and HUBB&apos;s platform to reach hungry customers nearby.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--hubb-accent)" }}
              >
                Start Your Kitchen
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold text-white/80 transition-all hover:text-white"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "var(--hubb-accent)" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#FFD700" }} />
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
            Start your home kitchen
          </h2>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            Fill out the form below and start selling in as little as 24 hours
          </p>
        </div>
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-lg)" }}>
          {renderStepIndicator()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>
          Why home chefs love HUBB
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl p-6" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--hubb-tint)" }}>
                <svg className="w-6 h-6" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to start cooking?</h2>
            <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
              Join hundreds of home chefs already earning on HUBB. No rent, no overhead — just great food.
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
