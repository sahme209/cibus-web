export default function TermsPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Terms of Service
        </h1>
        <div className="rounded-2xl p-6 space-y-6" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
          {[
            { title: "Acceptance of Terms", body: "By using HUBB, you agree to these terms of service. If you do not agree to these terms, please do not use our platform." },
            { title: "Service Description", body: "HUBB is a food delivery platform that connects customers with restaurants and delivery partners. We facilitate orders but do not prepare food ourselves." },
            { title: "User Accounts", body: "You are responsible for maintaining the security of your account credentials. You must provide accurate information when creating an account and keep it up to date." },
            { title: "Orders and Payments", body: "All orders are subject to restaurant availability and acceptance. Prices displayed include applicable taxes. Payment is due at the time of order placement or upon delivery for cash orders." },
            { title: "Cancellations and Refunds", body: "Orders may be cancelled before the restaurant begins preparation. Refund eligibility depends on the order status at the time of cancellation and will be processed according to our refund policy." },
            { title: "Delivery", body: "Delivery times are estimates and may vary due to traffic, weather, or order volume. HUBB is not responsible for delays beyond our reasonable control." },
            { title: "Contact", body: "For questions about these terms, please contact us at support@hubb.pk." },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
