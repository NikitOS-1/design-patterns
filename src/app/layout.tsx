import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

const SITE_DESCRIPTION =
  "Classic GoF design patterns plus modern React patterns, redrawn as React, Next.js, and TypeScript blueprints — with production-grade examples instead of abstract Animal/Shape demos.";

export const metadata: Metadata = {
  // The homepage uses `default`; every other page sets its own title, which
  // `template` wraps — e.g. "Singleton — Design Patterns / Frontend".
  title: {
    default: "Design Patterns for the Frontend — React, Next.js & TypeScript",
    template: "%s — Design Patterns / Frontend",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Design Patterns / Frontend",
  keywords: [
    "design patterns",
    "React",
    "Next.js",
    "TypeScript",
    "Gang of Four",
    "frontend architecture",
  ],
  openGraph: {
    title: "Design Patterns for the Frontend",
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0E14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body flex min-h-screen flex-col">
        <LocaleProvider>
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
