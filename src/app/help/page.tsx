import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Get help with your HUBB orders, account, payments, and more. Contact us via email.",
};

const TOPICS = [
  {
    title: "Orders & Delivery",
    desc: "Late delivery, missing items, wrong order, cancellations",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    questions: [
      { q: "My order is late", a: "Delivery times are estimates and may vary due to traffic or restaurant preparation time. If your order is significantly delayed, email us with your order number and we'll look into it." },
      { q: "Items are missing from my order", a: "If items are missing, email us at support@hubb.pk with your order number and a description of the missing items. We'll arrange a refund or redelivery." },
      { q: "I received the wrong order", a: "We're sorry about that. Please email support@hubb.pk with your order number and photos if possible. We'll resolve it promptly." },
      { q: "How do I cancel an order?", a: "You can cancel an order from the tracking screen before the restaurant starts preparing it. If the cancel button is no longer available, email us and we'll help." },
    ],
  },
  {
    title: "Payments & Refunds",
    desc: "Billing questions, refund status, promo codes",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    questions: [
      { q: "When will I receive my refund?", a: "Refunds are processed within 5-7 business days to the original payment method. Cash-on-delivery refunds are applied as HUBB credits." },
      { q: "I was charged incorrectly", a: "If you believe there's a billing error, email support@hubb.pk with your order number and the discrepancy details." },
      { q: "My promo code isn't working", a: "Promo codes may have expiry dates, minimum order requirements, or be limited to specific restaurants. Check the terms on the promotion, or email us for help." },
    ],
  },
  {
    title: "Account & Security",
    desc: "Password, email, data privacy, account deletion",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    questions: [
      { q: "How do I reset my password?", a: "Go to the sign-in page and tap 'Forgot password'. We'll send a reset link to your registered email." },
      { q: "How do I delete my account?", a: "Email support@hubb.pk with the subject 'Account Deletion Request' from your registered email. We'll process it within 14 days." },
      { q: "How do I update my email or phone?", a: "Go to Profile > Edit Profile to update your contact information." },
    ],
  },
  {
    title: "Delivery Addresses",
    desc: "Add, edit, or remove saved addresses",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
    questions: [
      { q: "How do I add a new address?", a: "Go to Profile > Delivery Addresses > Add New. You can also add an address during checkout." },
      { q: "My address isn't showing correctly", a: "Try adjusting the pin on the map when adding your address. If the issue persists, email us with the correct address details." },
    ],
  },
];

export default function HelpPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,60,40,0.8))" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-5" style={{ background: "rgba(0,112,74,0.9)", color: "white" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              24/7 SUPPORT
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
              How can we
              <br />
              <span style={{ color: "#00D474" }}>help you?</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/60 max-w-md mx-auto">
              Browse topics below or email us directly for personalized support.
            </p>
            <a
              href="mailto:support@hubb.pk"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "white", color: "var(--hubb-accent)" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@hubb.pk
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">

        {/* Topics with FAQ */}
        <div className="space-y-8">
          {TOPICS.map((topic) => (
            <section key={topic.title}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--hubb-tint)" }}>
                  <svg className="w-5 h-5" style={{ color: "var(--hubb-accent)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={topic.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{topic.title}</h3>
                  <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{topic.desc}</p>
                </div>
              </div>
              <div className="space-y-2 ml-[52px]">
                {topic.questions.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-xl overflow-hidden"
                    style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
                  >
                    <summary
                      className="flex items-center justify-between px-5 py-3.5 cursor-pointer text-sm font-medium list-none"
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
          ))}
        </div>

        {/* Bottom links */}
        <div className="mt-12 text-center">
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            Still need help?
          </p>
          <a
            href="mailto:support@hubb.pk"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background: "var(--hubb-accent)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email support@hubb.pk
          </a>
          <div className="flex justify-center gap-6 mt-6">
            <Link href="/privacy" className="text-xs underline" style={{ color: "var(--text-tertiary)" }}>Privacy Policy</Link>
            <Link href="/terms" className="text-xs underline" style={{ color: "var(--text-tertiary)" }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
