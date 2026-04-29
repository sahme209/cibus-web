"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/store";

const GOOGLE_CLIENT_ID =
  "776253420503-da34poid2mtt6cbbm6040sb2jd96e20d.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
        };
      };
    };
  }
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^\+?\d{10,15}$/.test(phone.replace(/[\s-]/g, ""));
}

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, googleLogin, isLoggedIn } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleContainerRef = useRef<HTMLDivElement>(null);

  const handleGoogleResponse = useCallback(
    async (response: { credential: string }) => {
      setLoading(true);
      setError("");
      try {
        await googleLogin(response.credential);
        router.push("/");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Google sign-in failed";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [googleLogin, router]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = document.querySelector(
      'script[src*="accounts.google.com/gsi/client"]'
    );
    if (existing) {
      setGoogleReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!googleReady || !window.google || !googleContainerRef.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
    });
    window.google.accounts.id.renderButton(googleContainerRef.current, {
      type: "standard",
      theme: "filled_blue",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: googleContainerRef.current.offsetWidth || 380,
    });
  }, [googleReady, mode, handleGoogleResponse]);

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
        errors.name = "First name is required";
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
        const fullName = lastName.trim()
          ? `${name.trim()} ${lastName.trim()}`
          : name.trim();
        await signup(fullName, email, password, phone);
      }
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;
  const strengthColors = [
    "",
    "var(--hubb-orange)",
    "var(--hubb-yellow)",
    "var(--hubb-accent)",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  const googleButton = (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ height: 48 }}>
      <div
        className="absolute inset-0 flex items-center justify-center gap-3 text-sm font-semibold pointer-events-none"
        style={{ background: "var(--hubb-accent)", color: "white" }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="white"
            fillOpacity={0.8}
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="white"
            fillOpacity={0.9}
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="white"
            fillOpacity={0.8}
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="white"
            fillOpacity={0.8}
          />
        </svg>
        {loading ? "Signing in..." : "Continue with Google"}
      </div>
      <div
        ref={googleContainerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ opacity: 0.01, zIndex: 2 }}
      />
    </div>
  );

  const appleButton = (
    <button
      disabled
      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all relative opacity-60 cursor-not-allowed"
      style={{
        background: "var(--text-primary)",
        color: "var(--bg-primary)",
      }}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      Continue with Apple
      <span
        className="absolute right-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
        style={{
          background: "var(--bg-search)",
          color: "var(--text-tertiary)",
        }}
      >
        SOON
      </span>
    </button>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
      {/* Background image with overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl animate-fade-up overflow-hidden"
        style={{
          background: "var(--bg-card)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header with close + incentive */}
        <div className="px-8 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "var(--bg-search)" }}
              aria-label="Close"
            >
              <svg
                className="w-4 h-4"
                style={{ color: "var(--text-primary)" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Link>
            {mode === "signin" && (
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "var(--hubb-tint)" }}
                >
                  <svg
                    className="w-3 h-3"
                    style={{ color: "var(--hubb-accent)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Sign in to access your orders and deals
                </span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-6 mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                  setFieldErrors({});
                }}
                className="relative px-1 py-2 text-sm font-semibold transition-colors"
                style={{
                  color:
                    mode === m
                      ? "var(--text-primary)"
                      : "var(--text-tertiary)",
                }}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
                {mode === m && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "var(--text-primary)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8">
          {mode === "signin" ? (
            <>
              {/* Social login first for Sign In */}
              <div className="space-y-2.5 mb-5">
                {googleButton}
                {appleButton}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border-default)" }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  or continue with email
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border-default)" }}
                />
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="Required"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "var(--bg-search)",
                      color: "var(--text-primary)",
                      border: fieldErrors.email
                        ? "1.5px solid var(--hubb-orange)"
                        : "1.5px solid var(--border-default)",
                    }}
                  />
                  {fieldErrors.email && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--hubb-orange)" }}
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFieldErrors((p) => ({ ...p, password: "" }));
                      }}
                      placeholder="Required"
                      autoComplete="current-password"
                      className="w-full px-4 py-3 pr-16 rounded-xl text-sm"
                      style={{
                        background: "var(--bg-search)",
                        color: "var(--text-primary)",
                        border: fieldErrors.password
                          ? "1.5px solid var(--hubb-orange)"
                          : "1.5px solid var(--border-default)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--hubb-orange)" }}
                    >
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {error && (
                  <div
                    className="text-sm text-center py-2.5 px-4 rounded-xl flex items-center gap-2 justify-center"
                    style={{
                      background: "var(--hubb-error-bg)",
                      color: "var(--hubb-error)",
                    }}
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] btn-gradient"
                >
                  {loading ? "Signing in..." : "Continue to Sign In"}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Sign Up form fields first */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setFieldErrors((p) => ({ ...p, name: "" }));
                      }}
                      placeholder=""
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={{
                        background: "var(--bg-search)",
                        color: "var(--text-primary)",
                        border: fieldErrors.name
                          ? "1.5px solid var(--hubb-orange)"
                          : "1.5px solid var(--border-default)",
                      }}
                    />
                    {fieldErrors.name && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--hubb-orange)" }}
                      >
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder=""
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={{
                        background: "var(--bg-search)",
                        color: "var(--text-primary)",
                        border: "1.5px solid var(--border-default)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder=""
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "var(--bg-search)",
                      color: "var(--text-primary)",
                      border: fieldErrors.email
                        ? "1.5px solid var(--hubb-orange)"
                        : "1.5px solid var(--border-default)",
                    }}
                  />
                  {fieldErrors.email && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--hubb-orange)" }}
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div
                      className="flex items-center gap-1 px-3 py-3 rounded-xl text-sm shrink-0"
                      style={{
                        background: "var(--bg-search)",
                        border: "1.5px solid var(--border-default)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span>🇵🇰</span>
                      <span>+92</span>
                      <svg
                        className="w-3 h-3"
                        style={{ color: "var(--text-tertiary)" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setFieldErrors((p) => ({ ...p, phone: "" }));
                      }}
                      placeholder=""
                      autoComplete="tel"
                      className="flex-1 px-4 py-3 rounded-xl text-sm"
                      style={{
                        background: "var(--bg-search)",
                        color: "var(--text-primary)",
                        border: fieldErrors.phone
                          ? "1.5px solid var(--hubb-orange)"
                          : "1.5px solid var(--border-default)",
                      }}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--hubb-orange)" }}
                    >
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFieldErrors((p) => ({ ...p, password: "" }));
                      }}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-16 rounded-xl text-sm"
                      style={{
                        background: "var(--bg-search)",
                        color: "var(--text-primary)",
                        border: fieldErrors.password
                          ? "1.5px solid var(--hubb-orange)"
                          : "1.5px solid var(--border-default)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--hubb-orange)" }}
                    >
                      {fieldErrors.password}
                    </p>
                  )}
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className="flex-1 h-1 rounded-full overflow-hidden"
                        style={{ background: "var(--bg-search)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(passwordStrength / 3) * 100}%`,
                            background: strengthColors[passwordStrength],
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-medium"
                        style={{
                          color: strengthColors[passwordStrength],
                        }}
                      >
                        {strengthLabels[passwordStrength]}
                      </span>
                    </div>
                  )}
                </div>

                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  By tapping &ldquo;Sign Up&rdquo; or &ldquo;Continue
                  with...&rdquo;, you agree to HUBB&apos;s{" "}
                  <Link
                    href="/terms"
                    className="underline"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>

                {error && (
                  <div
                    className="text-sm text-center py-2.5 px-4 rounded-xl flex items-center gap-2 justify-center"
                    style={{
                      background: "var(--hubb-error-bg)",
                      color: "var(--hubb-error)",
                    }}
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] btn-gradient"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-5">
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border-default)" }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  or
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border-default)" }}
                />
              </div>

              {/* Social login below for Sign Up */}
              <div className="space-y-2.5">
                {googleButton}
                {appleButton}
              </div>
            </>
          )}

          {/* Legal — Sign In only (Sign Up has it inline) */}
          {mode === "signin" && (
            <p
              className="text-[11px] text-center mt-5 leading-relaxed"
              style={{ color: "var(--text-tertiary)" }}
            >
              By tapping any &ldquo;Continue&rdquo; button, you agree to
              HUBB&apos;s{" "}
              <Link
                href="/terms"
                className="underline"
                style={{ color: "var(--text-secondary)" }}
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline"
                style={{ color: "var(--text-secondary)" }}
              >
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
