import { Footer } from "@/components/footer";
import RootClientLayout from "@/components/layout/root-client-layout";
import SkyBackground from "@/components/weather/sky-background";
import { geistMono, geistSans } from "@/lib/fonts";
import {
  organizationSchema,
  personSchema,
  websiteSchema,
} from "@/lib/schema/person";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { ReactNode } from "react";
import { PerformanceProvider } from "@/components/Providers/performance-provider";
import { SettingsProvider } from "@/components/Providers/settings-provider";

import "./globals.css";

import { constructMetadata } from "@/config/metadata";

export const metadata: Metadata = constructMetadata();

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden bg-transparent font-sans">
        <PerformanceProvider>
          <SettingsProvider>
            {/* ── Structured Data (JSON-LD) ── */}

            {/* 1. Person Schema ── Rick Das founder identity + social links */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(personSchema),
              }}
            />

            {/* 2. Organization Schema ── AeroWeather brand entity */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(organizationSchema),
              }}
            />

            {/* 3. Website Schema ── enables Google Search sitelinks box */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(websiteSchema),
              }}
            />

            <RootClientLayout>
              <SkyBackground />

              <div className="fixed inset-0 -z-40 bg-black/35 backdrop-blur-[2px]" />

              <main className="relative z-10 min-h-screen">
                {children}
                <Analytics />
                <SpeedInsights />
              </main>

              <Footer />
            </RootClientLayout>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ("serviceWorker" in navigator) {
                    window.addEventListener("load", function() {
                      navigator.serviceWorker.register("/sw.js");
                    });
                  }
                `,
              }}
            />
          </SettingsProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}