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
    default: "HUBB — Food Delivery",
    template: "%s | HUBB",
  },
  description:
    "Order food online from your favorite restaurants. Fast delivery, exclusive deals, and premium quality.",
  keywords: ["food delivery", "HUBB", "restaurants", "order food online", "Pakistan"],
  openGraph: {
    title: "HUBB — Food Delivery",
    description: "Order food online from your favorite restaurants. Fast delivery, exclusive deals, and premium quality.",
    type: "website",
    siteName: "HUBB",
  },
  twitter: {
    card: "summary_large_image",
    title: "HUBB — Food Delivery",
    description: "Order food online from your favorite restaurants.",
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
