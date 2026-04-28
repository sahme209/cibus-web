"use client";

import { useState } from "react";
import * as api from "@/lib/api";

const STATS = [
  { value: "Rs. 800+", label: "Avg daily earnings" },
  { value: "1,000+", label: "Active riders" },
  { value: "Weekly", label: "Payouts" },
  { value: "24/7", label: "Support" },
];

const STEPS = [
  {
    step: "01",
    title: "Sign up",
    desc: "Submit your application with a valid CNIC and bike documents. Approval takes 24-48 hours.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    step: "02",
    title: "Get equipped",
    desc: "Pick up your HUBB rider kit — insulated bag, safety gear, and access to the rider app.",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    step: "03",
    title: "Start earning",
    desc: "Go online whenever you want. Accept deliveries, earn per trip, and keep 100% of your tips.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const FEATURES = [
  { title: "Flexible Hours", desc: "Work when you want. Log in and out of the app at your convenience — no minimum hours required.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Competitive Pay", desc: "Earn per delivery plus 100% of tips. Bonuses during peak hours and bad weather.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { title: "Safety First", desc: "Insurance coverage while delivering, in-app SOS button, and safety training for all riders.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "In-App Navigation", desc: "Built-in turn-by-turn navigation to every restaurant and delivery address.", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
  { title: "Weekly Payouts", desc: "Get paid every week directly to your bank or JazzCash/Easypaisa account. No delays.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { title: "Rider Community", desc: "Join a community of thousands of riders. Access exclusive perks, events, and career growth.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
];

const FAQ = [
  { q: "What do I need to start?", a: "You need a valid CNIC, a motorcycle or bicycle, a smartphone with internet access, and a clean background. No prior delivery experience required." },
  { q: "How much can I earn?", a: "Earnings depend on the number of deliveries and your zone. Top riders earn Rs. 40,000+ per month. Peak hour bonuses and tips add to your base pay." },
  { q: "Do I need my own bike?", a: "Yes, you need your own motorcycle or bicycle. HUBB provides the delivery bag and branded gear at no cost." },
  { q: "Is there insurance coverage?", a: "Yes. All active riders are covered by our partner insurance policy during delivery hours, including accident and health coverage." },
  { q: "Can I work part-time?", a: "Absolutely. There are no minimum hours. Many riders combine HUBB with studies or other work." },
];

type PayoutMethod = "bank" | "jazzcash" | "easypaisa";

interface FieldErrors {
  [key: string]: string;
}

export default function PartnerRidersPage() {
  // Form step management
  const [formStep, setFormStep] = useState(1);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Step 1 fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [cnic, setCnic] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [step1Errors, setStep1Errors] = useState<FieldErrors>({});

  // Step 2 fields
  const [vehicleType, setVehicleType] = useState("motorcycle");
  const [vehicleColor, setVehicleColor] = useState("");
  const [city, setCity] = useState("");
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>("bank");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [jazzCashWallet, setJazzCashWallet] = useState("");
  const [easypaisaWallet, setEasypaisaWallet] = useState("");
  const [step2Errors, setStep2Errors] = useState<FieldErrors>({});

  // Step 3 data
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  function validateStep1(): boolean {
    const errors: FieldErrors = {};

    if (!name.trim()) errors.name = "Full name is required";
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Phone must be at least 10 digits";
    }
    if (!cnic.trim()) {
      errors.cnic = "CNIC is required";
    } else if (cnic.replace(/\D/g, "").length !== 13) {
      errors.cnic = "CNIC must be exactly 13 digits";
    }
    if (!drivingLicense.trim()) errors.drivingLicense = "Driving license number is required";
    if (!vehiclePlate.trim()) errors.vehiclePlate = "Vehicle plate number is required";

    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateStep2(): boolean {
    const errors: FieldErrors = {};

    if (!vehicleColor.trim()) errors.vehicleColor = "Vehicle color is required";
    if (!city.trim()) errors.city = "City is required";

    if (payoutMethod === "bank") {
      if (!bankName.trim()) errors.bankName = "Bank name is required";
      if (!accountNumber.trim()) errors.accountNumber = "Account number is required";
    } else if (payoutMethod === "jazzcash") {
      if (!jazzCashWallet.trim()) errors.jazzCashWallet = "JazzCash wallet number is required";
    } else if (payoutMethod === "easypaisa") {
      if (!easypaisaWallet.trim()) errors.easypaisaWallet = "Easypaisa wallet number is required";
    }

    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    setApiError("");

    try {
      const res = await api.riderSignUp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        cnic: cnic.replace(/\D/g, ""),
        drivingLicenseNumber: drivingLicense.trim(),
        vehicleNumber: vehiclePlate.trim(),
      });

      setAccessToken(res.data.access_token);
      setFormStep(2);
    } catch (err) {
      if (err instanceof api.APIError) {
        if (err.status === 409) {
          setApiError("An account with this email, CNIC, or phone already exists. Please use different credentials or sign in to the rider app.");
        } else if (err.status === 429) {
          setApiError("Too many attempts. Please wait a few minutes and try again.");
        } else {
          setApiError(err.message || "Something went wrong. Please try again.");
        }
      } else {
        setApiError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setApiError("");

    const payoutInfo: Record<string, string> = {};
    if (payoutMethod === "bank") {
      payoutInfo.bankName = bankName.trim();
      payoutInfo.accountNumber = accountNumber.trim();
    } else if (payoutMethod === "jazzcash") {
      payoutInfo.jazzCashWallet = jazzCashWallet.trim();
    } else if (payoutMethod === "easypaisa") {
      payoutInfo.easypaisaWallet = easypaisaWallet.trim();
    }

    try {
      const res = await api.submitRiderVerification(accessToken, {
        vehicleType,
        vehiclePlateNumber: vehiclePlate.trim(),
        vehicleColor: vehicleColor.trim(),
        drivingLicenseNumber: drivingLicense.trim(),
        city: city.trim(),
        payoutInfo,
        documents: [
          { type: "cnic_front", isPendingUpload: true },
          { type: "cnic_back", isPendingUpload: true },
          { type: "driving_license", isPendingUpload: true },
          { type: "vehicle_registration", isPendingUpload: true },
          { type: "selfie_verification", isPendingUpload: true },
        ],
      });

      setVerificationStatus(res.verificationStatus || "pending_review");
      setVerificationMessage(res.message || "Your application has been submitted successfully.");
      setFormStep(3);
    } catch (err) {
      if (err instanceof api.APIError) {
        setApiError(err.message || "Failed to submit verification. Please try again.");
      } else {
        setApiError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function scrollToApply(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  }

  function renderStepIndicator() {
    return (
      <div className="flex items-center justify-center gap-3 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
              style={{
                background: formStep >= step ? "var(--hubb-accent)" : "var(--bg-search)",
                color: formStep >= step ? "white" : "var(--text-tertiary)",
              }}
            >
              {formStep > step ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div
                className="w-12 sm:w-16 h-0.5 rounded-full"
                style={{
                  background: formStep > step ? "var(--hubb-accent)" : "var(--border-default)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  function renderInput(
    label: string,
    value: string,
    onChange: (v: string) => void,
    error: string | undefined,
    opts: {
      type?: string;
      placeholder?: string;
      maxLength?: number;
      inputMode?: "text" | "email" | "tel" | "numeric";
    } = {}
  ) {
    const { type = "text", placeholder = "", maxLength, inputMode } = opts;
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
          style={{
            background: "var(--bg-search)",
            border: error ? "1.5px solid var(--hubb-orange)" : "1.5px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
        />
        {error && (
          <p className="text-xs" style={{ color: "var(--hubb-orange)" }}>{error}</p>
        )}
      </div>
    );
  }

  function renderStep1() {
    return (
      <form onSubmit={handleStep1Submit} className="space-y-4">
        <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Personal Information
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Fill in your details to create a rider account.
        </p>

        {renderInput("Full Name", name, setName, step1Errors.name, {
          placeholder: "e.g. Ahmad Khan",
        })}
        {renderInput("Email Address", email, setEmail, step1Errors.email, {
          type: "email",
          placeholder: "you@example.com",
          inputMode: "email",
        })}
        {renderInput("Password", password, setPassword, step1Errors.password, {
          type: "password",
          placeholder: "Minimum 8 characters",
        })}
        {renderInput("Phone Number", phone, setPhone, step1Errors.phone, {
          type: "tel",
          placeholder: "03XX XXXXXXX",
          inputMode: "tel",
        })}
        {renderInput("CNIC Number", cnic, setCnic, step1Errors.cnic, {
          placeholder: "XXXXX-XXXXXXX-X",
          maxLength: 15,
          inputMode: "numeric",
        })}
        {renderInput("Driving License Number", drivingLicense, setDrivingLicense, step1Errors.drivingLicense, {
          placeholder: "Your driving license number",
        })}
        {renderInput("Vehicle Plate Number", vehiclePlate, setVehiclePlate, step1Errors.vehiclePlate, {
          placeholder: "e.g. LEA-1234",
        })}

        {apiError && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: "var(--hubb-error-bg)", color: "var(--hubb-error)" }}
          >
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--hubb-accent)" }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            "Continue"
          )}
        </button>
      </form>
    );
  }

  function renderStep2() {
    return (
      <form onSubmit={handleStep2Submit} className="space-y-4">
        <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Vehicle & Payout Details
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          Tell us about your vehicle and how you want to get paid.
        </p>

        {/* Vehicle Type */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            Vehicle Type
          </label>
          <div className="flex gap-3">
            {[
              { value: "motorcycle", label: "Motorcycle" },
              { value: "bicycle", label: "Bicycle" },
              { value: "car", label: "Car" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors"
                style={{
                  background: vehicleType === opt.value ? "var(--hubb-tint)" : "var(--bg-search)",
                  border: vehicleType === opt.value ? "1.5px solid var(--hubb-accent)" : "1.5px solid var(--border-default)",
                  color: vehicleType === opt.value ? "var(--hubb-accent)" : "var(--text-secondary)",
                }}
              >
                <input
                  type="radio"
                  name="vehicleType"
                  value={opt.value}
                  checked={vehicleType === opt.value}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {renderInput("Vehicle Color", vehicleColor, setVehicleColor, step2Errors.vehicleColor, {
          placeholder: "e.g. Red, Black, White",
        })}
        {/* City dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors appearance-none"
            style={{
              background: "var(--bg-search)",
              border: step2Errors.city ? "1.5px solid var(--hubb-orange)" : "1.5px solid var(--border-default)",
              color: "var(--text-primary)",
            }}
          >
            <option value="">Select city</option>
            <option value="Islamabad">Islamabad</option>
          </select>
          {step2Errors.city && (
            <p className="text-xs" style={{ color: "var(--hubb-orange)" }}>{step2Errors.city}</p>
          )}
        </div>

        {/* Payout Method */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            Payout Method
          </label>
          <div className="flex gap-3">
            {[
              { value: "bank" as PayoutMethod, label: "Bank Account" },
              { value: "jazzcash" as PayoutMethod, label: "JazzCash" },
              { value: "easypaisa" as PayoutMethod, label: "Easypaisa" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex-1 flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors"
                style={{
                  background: payoutMethod === opt.value ? "var(--hubb-tint)" : "var(--bg-search)",
                  border: payoutMethod === opt.value ? "1.5px solid var(--hubb-accent)" : "1.5px solid var(--border-default)",
                  color: payoutMethod === opt.value ? "var(--hubb-accent)" : "var(--text-secondary)",
                }}
              >
                <input
                  type="radio"
                  name="payoutMethod"
                  value={opt.value}
                  checked={payoutMethod === opt.value}
                  onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Payout fields conditional on method */}
        {payoutMethod === "bank" && (
          <>
            {renderInput("Bank Name", bankName, setBankName, step2Errors.bankName, {
              placeholder: "e.g. HBL, Meezan, UBL",
            })}
            {renderInput("Account Number / IBAN", accountNumber, setAccountNumber, step2Errors.accountNumber, {
              placeholder: "Your bank account or IBAN",
            })}
          </>
        )}
        {payoutMethod === "jazzcash" && (
          renderInput("JazzCash Wallet Number", jazzCashWallet, setJazzCashWallet, step2Errors.jazzCashWallet, {
            type: "tel",
            placeholder: "03XX XXXXXXX",
            inputMode: "tel",
          })
        )}
        {payoutMethod === "easypaisa" && (
          renderInput("Easypaisa Wallet Number", easypaisaWallet, setEasypaisaWallet, step2Errors.easypaisaWallet, {
            type: "tel",
            placeholder: "03XX XXXXXXX",
            inputMode: "tel",
          })
        )}

        {apiError && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: "var(--hubb-error-bg)", color: "var(--hubb-error)" }}
          >
            {apiError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => { setFormStep(1); setApiError(""); }}
            className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-80"
            style={{
              background: "var(--bg-search)",
              color: "var(--text-secondary)",
              border: "1.5px solid var(--border-default)",
            }}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--hubb-accent)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    );
  }

  function renderStep3() {
    return (
      <div className="text-center py-4">
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
        <p className="text-sm mb-4 max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
          {verificationMessage}
        </p>
        <div
          className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6"
          style={{ background: "var(--hubb-tint)", color: "var(--hubb-accent)" }}
        >
          Status: {verificationStatus.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </div>
        <div
          className="rounded-xl p-5 text-left space-y-3"
          style={{ background: "var(--bg-search)", border: "1.5px solid var(--border-default)" }}
        >
          <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Next Steps
          </h4>
          <div className="space-y-2">
            {[
              "Download the HUBB Rider app from the App Store or Google Play.",
              "Sign in with the email and password you just used.",
              "Upload your documents (CNIC, driving license, vehicle registration, selfie) in the app.",
              "Our team will review your application within 24-48 hours.",
            ].map((step, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{ background: "var(--hubb-accent)", color: "white" }}
                >
                  {i + 1}
                </span>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
              BECOME A RIDER
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              Deliver with
              <br />
              <span style={{ color: "var(--hubb-accent)" }}>HUBB</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/60 max-w-lg">
              Set your own schedule. Earn competitive pay. Join our growing rider team and start delivering today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#apply"
                onClick={scrollToApply}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--hubb-accent)" }}
              >
                Apply Now
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
        <div className="animate-fade-up">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2" style={{ color: "var(--text-primary)" }}>
            Apply to ride with HUBB
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: "var(--text-secondary)" }}>
            Complete the form below to get started. It only takes a few minutes.
          </p>

          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-lg)" }}
          >
            {renderStepIndicator()}
            {formStep === 1 && renderStep1()}
            {formStep === 2 && renderStep2()}
            {formStep === 3 && renderStep3()}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-10" style={{ color: "var(--text-primary)" }}>
          Why ride with HUBB?
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
            Start earning in 3 steps
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
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to hit the road?</h2>
            <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
              Join thousands of riders earning on their own terms with HUBB.
            </p>
            <a
              href="#apply"
              onClick={scrollToApply}
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
