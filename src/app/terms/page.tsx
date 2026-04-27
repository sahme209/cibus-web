import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions that govern your use of HUBB's food delivery platform.",
};

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing or using the HUBB platform, website, or mobile applications, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree to these terms, you must discontinue use of our platform immediately.",
      "We may update these terms from time to time. Continued use of HUBB after changes constitutes acceptance of the revised terms. We will notify you of material changes via email or in-app notification.",
    ],
  },
  {
    id: "service",
    title: "2. Service Description",
    paragraphs: [
      "HUBB is a food delivery platform that connects customers with restaurants and delivery partners. We facilitate orders but do not prepare food ourselves. The quality, safety, and accuracy of food orders are the responsibility of the restaurant partners.",
      "Service availability, delivery areas, and participating restaurants may vary by location and are subject to change without prior notice.",
    ],
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    paragraphs: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate, current, and complete information when creating an account.",
      "You must be at least 16 years old to create an account. HUBB reserves the right to suspend or terminate accounts that violate these terms, provide false information, or engage in fraudulent activity.",
    ],
  },
  {
    id: "orders",
    title: "4. Orders & Payments",
    paragraphs: [
      "All orders are subject to restaurant availability and acceptance. Prices displayed include applicable taxes unless stated otherwise. HUBB may charge service fees, delivery fees, and small order fees as displayed during checkout.",
      "Payment is processed at the time of order placement for online payments, or upon delivery for cash-on-delivery orders. You agree to pay all charges associated with your orders, including any applicable fees and taxes.",
      "Promotional codes and discounts are subject to their specific terms and conditions, may expire, and can be withdrawn at any time.",
    ],
  },
  {
    id: "cancellations",
    title: "5. Cancellations & Refunds",
    paragraphs: [
      "Orders may be cancelled before the restaurant begins preparation. Once preparation has started, cancellation may not be possible. The cancellation window varies depending on the restaurant and order type.",
      "Refund eligibility depends on the order status at the time of cancellation and the reason for the refund request. Approved refunds are processed within 5-7 business days to the original payment method. HUBB reserves the right to offer store credits instead of monetary refunds in certain cases.",
    ],
  },
  {
    id: "delivery",
    title: "6. Delivery",
    paragraphs: [
      "Delivery times are estimates and may vary due to traffic, weather, restaurant preparation time, or order volume. HUBB is not responsible for delays beyond our reasonable control.",
      "You are responsible for providing accurate delivery information, including address and contact details. Failed deliveries due to incorrect information or unavailability at the delivery address may not be eligible for refunds.",
    ],
  },
  {
    id: "conduct",
    title: "7. User Conduct",
    paragraphs: [
      "You agree not to misuse the platform, including but not limited to: placing fraudulent orders, harassing delivery riders or restaurant staff, attempting to manipulate ratings or reviews, or using automated systems to access the service.",
      "HUBB reserves the right to restrict or ban users who violate these conduct guidelines or engage in behavior that is harmful to the community.",
    ],
  },
  {
    id: "ip",
    title: "8. Intellectual Property",
    paragraphs: [
      "All content, trademarks, logos, and intellectual property on the HUBB platform are owned by or licensed to HUBB Technologies. You may not copy, reproduce, distribute, or create derivative works from any content without prior written consent.",
    ],
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    paragraphs: [
      "HUBB is not liable for the quality, safety, or accuracy of food prepared by restaurant partners. To the maximum extent permitted by law, HUBB's total liability for any claim arising from use of the platform is limited to the amount you paid for the specific order in question.",
      "HUBB is not responsible for indirect, incidental, or consequential damages arising from the use of our services.",
    ],
  },
  {
    id: "governing",
    title: "10. Governing Law",
    paragraphs: [
      "These terms shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising from these terms shall be resolved through arbitration in Islamabad, Pakistan.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact",
    paragraphs: [
      "For questions about these Terms of Service, please contact us at support@hubb.pk. For legal inquiries, write to legal@hubb.pk.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-tertiary)" }}>
            Last updated: April 15, 2026
          </p>
          <p
            className="text-sm mt-3 leading-relaxed max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            These terms govern your use of the HUBB platform. Please read them carefully
            before placing an order or creating an account.
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
              Questions about these terms? Email{" "}
              <a
                href="mailto:support@hubb.pk"
                className="font-medium underline"
                style={{ color: "var(--hubb-accent)" }}
              >
                support@hubb.pk
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
