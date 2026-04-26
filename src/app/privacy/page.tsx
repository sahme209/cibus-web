export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg-secondary)" }} className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Privacy Policy
        </h1>
        <div className="rounded-2xl p-6 space-y-6" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)" }}>
          {[
            { title: "Information We Collect", body: "We collect information you provide when creating an account, placing orders, and using our services. This includes your name, email address, phone number, delivery addresses, and order history." },
            { title: "How We Use Your Information", body: "Your information is used to process and deliver orders, provide customer support, send order updates and notifications, and improve our services." },
            { title: "Data Security", body: "We implement industry-standard security measures to protect your personal information. All data transmissions are encrypted and we regularly review our security practices." },
            { title: "Sharing of Information", body: "We share your delivery information with restaurant partners and delivery riders only as necessary to fulfill your orders. We do not sell your personal information to third parties." },
            { title: "Your Rights", body: "You can access, update, or delete your personal information through your account settings. You may also contact us to request data export or account deletion." },
            { title: "Contact Us", body: "For privacy-related inquiries, please contact us at privacy@hubb.pk." },
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
