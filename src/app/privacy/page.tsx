import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how HUBB collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    id: "info-collect",
    title: "1. Information We Collect",
    paragraphs: [
      "We collect information you provide when creating an account, placing orders, and using our services. This includes your name, email address, phone number, delivery addresses, and order history.",
      "We also collect usage data automatically, including device information, IP address, browser type, pages visited, and interaction patterns. Location data is collected when you enable delivery services to find nearby restaurants.",
    ],
  },
  {
    id: "how-use",
    title: "2. How We Use Your Information",
    paragraphs: [
      "Your information is used to process and deliver orders, provide customer support, send order updates and notifications, and improve our services. We personalize your experience by recommending restaurants and dishes based on your order history and preferences.",
      "We may also use aggregated, anonymized data for analytics, performance monitoring, and service optimization. This data cannot be used to identify individual users.",
    ],
  },
  {
    id: "data-security",
    title: "3. Data Security",
    paragraphs: [
      "We implement industry-standard security measures to protect your personal information, including TLS encryption for data in transit, encrypted storage for sensitive data at rest, and regular security audits.",
      "Access to personal data is restricted to authorized employees and service providers who need it to operate, develop, or improve our services. All such parties are bound by strict confidentiality obligations.",
    ],
  },
  {
    id: "sharing",
    title: "4. Sharing of Information",
    paragraphs: [
      "We share your delivery information with restaurant partners and delivery riders only as necessary to fulfill your orders. We do not sell your personal information to third parties.",
      "We may share information with service providers who assist us in operating our platform (e.g., payment processors, cloud hosting, analytics). These providers are contractually required to protect your data and may only use it for the services they provide to us.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking",
    paragraphs: [
      "We use cookies and similar technologies to maintain your session, remember preferences, and analyze site traffic. Essential cookies are required for the platform to function; analytics cookies help us understand usage patterns.",
      "You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.",
    ],
  },
  {
    id: "retention",
    title: "6. Data Retention",
    paragraphs: [
      "We retain your personal data for as long as your account is active or as needed to provide services. Order history is retained for record-keeping, legal compliance, and dispute resolution purposes.",
      "When you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention.",
    ],
  },
  {
    id: "rights",
    title: "7. Your Rights",
    paragraphs: [
      "You have the right to access, correct, or delete your personal information at any time through your account settings. You may also request a copy of your data in a portable format.",
      "You can opt out of marketing communications at any time. To exercise any of these rights, contact us at privacy@hubb.pk or use the settings in your account.",
    ],
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    paragraphs: [
      "HUBB is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.",
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    paragraphs: [
      "We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. We will notify you of significant changes via email or an in-app notification.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    paragraphs: [
      "For privacy-related inquiries, data requests, or complaints, please contact our Data Protection team at privacy@hubb.pk. We aim to respond to all requests within 14 business days.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-tertiary)" }}>
            Last updated: April 15, 2026
          </p>
          <p
            className="text-sm mt-3 leading-relaxed max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            At HUBB, we take your privacy seriously. This policy describes how we collect,
            use, and protect your personal information when you use our platform and services.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Table of Contents — desktop sidebar */}
          <nav
            className="hidden lg:block shrink-0 w-56 sticky top-24 self-start"
            aria-label="Table of contents"
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-tertiary)" }}
            >
              On this page
            </p>
            <ul className="space-y-1.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block text-xs leading-snug py-1 transition-colors hover:opacity-80"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div
            className="flex-1 rounded-2xl p-6 sm:p-8 space-y-8"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}
          >
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2
                  className="text-base font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {section.title}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed mb-2 last:mb-0"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <hr style={{ borderColor: "var(--border-subtle)" }} />

            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              If you have questions about this Privacy Policy, please email us at{" "}
              <a
                href="mailto:privacy@hubb.pk"
                className="font-medium underline"
                style={{ color: "var(--hubb-accent)" }}
              >
                privacy@hubb.pk
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
