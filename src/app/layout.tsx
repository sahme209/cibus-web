import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HUBB — Food Delivery | Order Online",
    template: "%s | HUBB Food Delivery",
  },
  description:
    "Order food delivery from the best restaurants near you. Rs. 0 delivery on your first order. Fast delivery, exclusive deals, and premium quality. Download the HUBB app today.",
  keywords: ["food delivery", "HUBB", "restaurants", "order food online", "Pakistan", "Islamabad", "Lahore", "Karachi", "delivery app", "biryani", "pizza", "burgers"],
  metadataBase: new URL("https://gethubb.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HUBB — Food Delivery | Order Online",
    description: "Order food delivery from the best restaurants near you. Rs. 0 delivery on your first order.",
    type: "website",
    siteName: "HUBB",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "HUBB — Food Delivery",
    description: "Order food delivery from the best restaurants near you. Fast delivery, exclusive deals.",
    creator: "@gethubb",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HUBB",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
