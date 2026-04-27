"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/store";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^\+?\d{10,15}$/.test(phone.replace(/[\s-]/g, ""));
}

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, isLoggedIn } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  if (isLoggedIn) {
    router.push("/");
    return null;
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (mode === "signup") {
      if (!name.trim()) {
        errors.name = "Full name is required";
      }
      if (!phone.trim()) {
        errors.phone = "Phone number is required";
      } else if (!validatePhone(phone)) {
        errors.phone = "Enter a valid phone number";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === "signin") {
        await login(email, password);
      } else {
        await signup(name, email, password, phone);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "var(--hubb-orange)", "var(--hubb-yellow)", "var(--hubb-accent)"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 animate-fade-up"
        style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-lg)" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ background: "var(--hubb-accent)" }}
          >
            H
          </div>
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            HUBB
          </span>
        </div>

        <p className="text-center text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          {mode === "signin" ? "Sign in to access your orders and saved places" : "Create an account to start ordering"}
        </p>

        {/* Social Login */}
        <div className="space-y-2.5 mb-5">
          <button
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--bg-search)", color: "var(--text-primary)" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: "var(--bg-search)" }}
        >
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setFieldErrors({}); }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: mode === m ? "var(--bg-card)" : "transparent",
                color: mode === m ? "var(--text-primary)" : "var(--text-secondary)",
                boxShadow: mode === m ? "var(--shadow-sm)" : "none",
              }}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: "" })); }}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "var(--bg-search)",
                  color: "var(--text-primary)",
                  border: fieldErrors.name ? "1.5px solid var(--hubb-orange)" : "1.5px solid transparent",
                }}
              />
              {fieldErrors.name && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{fieldErrors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{
                background: "var(--bg-search)",
                color: "var(--text-primary)",
                border: fieldErrors.email ? "1.5px solid var(--hubb-orange)" : "1.5px solid transparent",
              }}
            />
            {fieldErrors.email && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: "" })); }}
                placeholder="••••••••"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm"
                style={{
                  background: "var(--bg-search)",
                  color: "var(--text-primary)",
                  border: fieldErrors.password ? "1.5px solid var(--hubb-orange)" : "1.5px solid transparent",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{fieldErrors.password}</p>}
            {mode === "signup" && password.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-search)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(passwordStrength / 3) * 100}%`,
                      background: strengthColors[passwordStrength],
                    }}
                  />
                </div>
                <span className="text-[10px] font-medium" style={{ color: strengthColors[passwordStrength] }}>
                  {strengthLabels[passwordStrength]}
                </span>
              </div>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: "" })); }}
                placeholder="+92 3XX XXXXXXX"
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "var(--bg-search)",
                  color: "var(--text-primary)",
                  border: fieldErrors.phone ? "1.5px solid var(--hubb-orange)" : "1.5px solid transparent",
                }}
              />
              {fieldErrors.phone && <p className="text-xs mt-1" style={{ color: "var(--hubb-orange)" }}>{fieldErrors.phone}</p>}
            </div>
          )}

          {error && (
            <div
              className="text-sm text-center py-2.5 px-4 rounded-xl flex items-center gap-2 justify-center"
              style={{ background: "var(--bg-search)", color: "var(--hubb-orange)" }}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: "var(--hubb-accent)" }}
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <p
          className="text-xs text-center mt-6"
          style={{ color: "var(--text-tertiary)" }}
        >
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline" style={{ color: "var(--text-secondary)" }}>
            Terms of Service
          </Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline" style={{ color: "var(--text-secondary)" }}>
            Privacy Policy
          </Link>.
        </p>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 mt-6 pt-5" style={{ borderTop: "1px solid var(--border-default)" }}>
          {[
            { icon: "🔒", label: "Secure" },
            { icon: "⚡", label: "Fast Delivery" },
            { icon: "🛡️", label: "Safe Payments" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-1.5">
              <span className="text-sm">{badge.icon}</span>
              <span className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
