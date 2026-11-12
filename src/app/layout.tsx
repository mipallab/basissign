import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TimedQuoteModal } from "@/components/TimedQuoteModal";
import { BRAND_FACTS } from "@/data/catalog";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || BRAND_FACTS.domain;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BASISSIGN | UL 48 Custom Channel Letters & Wholesale Commercial Signage",
    template: "%s | BASISSIGN",
  },
  description:
    "Factory-direct US custom front-lit, halo-lit, and dual-lit channel letters plus push-thru light boxes and double-sided blade signs. UL 48 Listed (#E555259) & NEC Article 600 compliant. Free 24h 3D Day/Night mockups and 8–10 business day production.",
  keywords: [
    "UL 48 channel letters",
    "wholesale sign manufacturing",
    "custom LED channel letters",
    "halo-lit channel letters",
    "front-lit channel letters",
    "dual-lit channel letters",
    "push-thru light box",
    "double-sided blade sign",
    "illuminated architectural signage",
    "UL E555259",
    "NEC Article 600 sign disconnect",
    "BASISSIGN",
    "Basis Sign LLC",
  ],
  authors: [{ name: BRAND_FACTS.legalName, url: siteUrl }],
  creator: BRAND_FACTS.legalName,
  publisher: BRAND_FACTS.legalName,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: BRAND_FACTS.name,
    title: "BASISSIGN | UL 48 Custom Channel Letters & Architectural Signage",
    description:
      "UL 48 (#E555259) custom illuminated front-lit, halo-lit, and dual-lit channel letters plus blade & push-thru light boxes. 8–10 business day production with free 24h 3D Day/Night mockups.",
    images: [
      {
        url: "/images/hero/hero-01-on.webp",
        width: 1440,
        height: 900,
        alt: "BASISSIGN UL 48 Custom Illuminated Channel Letters on architectural commercial facade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BASISSIGN | UL 48 Custom Channel Letters & Commercial Signage",
    description:
      "Factory-direct UL 48 (#E555259) custom channel letters, dual-lit signage, and blade & push-thru light boxes. Free 24h 3D Day/Night mockups & <1% freight damage.",
    images: ["/images/hero/hero-01-on.webp"],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <TimedQuoteModal />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
