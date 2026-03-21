import { Footer } from "@/components/footer";
import RootClientLayout from "@/components/layout/root-client-layout";
import { PerformanceProvider } from "@/components/Providers/performance-provider";
import { SettingsProvider } from "@/components/Providers/settings-provider";
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
import Script from "next/script";
import { ReactNode } from "react";

import { constructMetadata } from "@/config/metadata";
import "./globals.css";

export const metadata: Metadata = constructMetadata();

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const isProd = process.env.NODE_ENV === "production";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning>
      <head>
        {/* Preconnect external APIs used by weather and radar calls to reduce fetch setup latency. */}
        <link
          rel="preconnect"
          href="https://api.open-meteo.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://air-quality-api.open-meteo.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://api.rainviewer.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="overflow-x-hidden bg-transparent font-sans">
        <PerformanceProvider>
          <SettingsProvider>
            <Script
              id="person-schema"
              type="application/ld+json"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <Script
              id="organization-schema"
              type="application/ld+json"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(organizationSchema),
              }}
            />
            <Script
              id="website-schema"
              type="application/ld+json"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(websiteSchema),
              }}
            />

            <RootClientLayout>
              <SkyBackground />

              {/* Dark overlay — all pages */}
              <div className="fixed inset-0 -z-40 bg-black/35" />

              {/* Ambient glow blobs — all pages */}
              <div className="pointer-events-none fixed top-1/4 left-1/4 -z-30 h-[50vw] w-[50vw] rounded-full bg-white/10 opacity-40" />
              <div className="pointer-events-none fixed right-1/4 bottom-1/4 -z-30 h-[40vw] w-[40vw] rounded-full bg-white/5 opacity-30" />

              <main className="relative z-10 min-h-screen">
                {children}
                {isProd && <Analytics />}
                {isProd && <SpeedInsights />}
              </main>

              <Footer />
            </RootClientLayout>

            <Script
              id="service-worker-register"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html:
                  'if ("serviceWorker" in navigator) { window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js"); }); }',
              }}
            />
          </SettingsProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
