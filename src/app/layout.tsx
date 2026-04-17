import { Footer } from "@/components/footer";
import LanguageRootLayout from "@/components/layout/language-root-layout";
import { LanguageProvider } from "@/components/Providers/language-provider";
import { PerformanceProvider } from "@/components/Providers/performance-provider";
import { SettingsProvider } from "@/components/Providers/settings-provider";
import SkyBackground from "@/components/weather/sky-background";
import { geistMono, geistSans } from "@/lib/fonts";
import { DEFAULT_LOCALE, isRtlLocale } from "@/lib/locales";
import { getLocaleMessages } from "@/lib/message-loader";
import {
    organizationSchema,
    personSchema,
    websiteSchema,
} from "@/lib/schema/person";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script";
import { ReactNode } from "react";

import { constructMetadata } from "@/config/metadata";
import "./globals.css";

export const metadata: Metadata = constructMetadata();

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const locale = DEFAULT_LOCALE;
  const messages = await getLocaleMessages(locale);
  const isProd = process.env.NODE_ENV === "production";
  const localizedPersonSchema = {
    ...personSchema,
    inLanguage: locale,
    url: `https://www.aeroweather.app/${locale}/rick-das`,
  };
  const localizedOrganizationSchema = {
    ...organizationSchema,
    inLanguage: locale,
    url: `https://www.aeroweather.app/${locale}`,
    contactPoint: {
      ...organizationSchema.contactPoint,
      url: `https://www.aeroweather.app/${locale}/contact`,
    },
  };
  const localizedWebsiteSchema = {
    ...websiteSchema,
    inLanguage: locale,
    url: `https://www.aeroweather.app/${locale}`,
  };

  return (
    <html
      lang={locale}
      dir={isRtlLocale(locale) ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning>
      <head>
        {/* ✅ DNS prefetch — rainviewer map lazy load এর জন্য */}
        <link rel="dns-prefetch" href="https://api.rainviewer.com" />
        <link rel="dns-prefetch" href="https://tilecache.rainviewer.com" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />

        {/* ✅ Preconnect শুধু critical APIs — max 3টা */}
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
        <link rel="dns-prefetch" href="https://nominatim.openstreetmap.org" />

        <link rel="preload" as="image" href="/sky-texture.png" />
        <link rel="preload" as="image" href="/sky-texture.svg" />
        <link rel="preload" as="script" href="/sky-engine.js" />
      </head>
      <body className="bg-transparent font-sans">
        <PerformanceProvider>
          <SettingsProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <LanguageProvider>
                <Script
                  id="person-schema"
                  type="application/ld+json"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(localizedPersonSchema),
                  }}
                />
                <Script
                  id="organization-schema"
                  type="application/ld+json"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(localizedOrganizationSchema),
                  }}
                />
                <Script
                  id="website-schema"
                  type="application/ld+json"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(localizedWebsiteSchema),
                  }}
                />

                <LanguageRootLayout>
                  <SkyBackground />

                  {/* Dark overlay — fixed to viewport */}
                  <div className="pointer-events-none fixed inset-0 -z-40 overflow-hidden">
                    <div className="h-full w-full bg-black/35" />
                  </div>

                  {/* Ambient glow blobs — fixed to viewport */}
                  <div className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 h-[50vw] w-[50vw] rounded-full bg-white/10 opacity-40" />
                    <div className="absolute right-1/4 bottom-1/4 h-[40vw] w-[40vw] rounded-full bg-white/5 opacity-30" />
                  </div>

                  <div id="app-shell">
                    <main className="relative z-10 min-h-screen max-w-full">
                      {children}
                      {isProd && <Analytics />}
                      {isProd && <SpeedInsights />}
                    </main>

                    <Footer />
                  </div>
                </LanguageRootLayout>

                <Script
                  id="service-worker-register"
                  strategy="lazyOnload"
                  dangerouslySetInnerHTML={{
                    __html:
                      'if ("serviceWorker" in navigator) { window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js"); }); }',
                  }}
                />
              </LanguageProvider>
            </NextIntlClientProvider>
          </SettingsProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}