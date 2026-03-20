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
import { ReactNode } from "react";

import { constructMetadata } from "@/config/metadata";
import "./globals.css";

export const metadata: Metadata = constructMetadata();

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning>
      <body className="overflow-x-hidden bg-transparent font-sans">
        <PerformanceProvider>
          <SettingsProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(organizationSchema),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(websiteSchema),
              }}
            />

            <RootClientLayout>
              <SkyBackground />

              {/* Dark overlay — all pages */}
              <div className="fixed inset-0 -z-40 bg-black/35 backdrop-blur-[2px]" />

              {/* Ambient glow blobs — all pages */}
              <div className="pointer-events-none fixed top-1/4 left-1/4 -z-30 h-[50vw] w-[50vw] rounded-full bg-white/10 opacity-40 mix-blend-overlay blur-[150px]" />
              <div className="pointer-events-none fixed right-1/4 bottom-1/4 -z-30 h-[40vw] w-[40vw] rounded-full bg-white/5 opacity-30 mix-blend-overlay blur-[120px]" />

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
