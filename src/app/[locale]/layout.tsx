import { Footer } from "@/components/footer";
import LanguageRootLayout from "@/components/layout/language-root-layout";
import { LanguageProvider } from "@/components/Providers/language-provider";
import { PerformanceProvider } from "@/components/Providers/performance-provider";
import { SettingsProvider } from "@/components/Providers/settings-provider";
import SkyBackground from "@/components/weather/sky-background";
import { constructMetadata } from "@/config/metadata";
import { geistMono, geistSans } from "@/lib/fonts";
import {
    isRtlLocale,
    normalizeSupportedLocale,
    SUPPORTED_LOCALES,
    type SupportedLocale,
} from "@/lib/locales";
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

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = normalizeSupportedLocale(locale);

  return constructMetadata({
    locale: resolvedLocale,
    pathname: "/",
  });
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<LocaleLayoutProps>) {
  const { locale } = await params;
  const resolvedLocale = normalizeSupportedLocale(locale) as SupportedLocale;
  const messages = await getLocaleMessages(resolvedLocale);
  const isProd = process.env.NODE_ENV === "production";
  const localizedPersonSchema = {
    ...personSchema,
    inLanguage: resolvedLocale,
    url: `https://www.aeroweather.app/${resolvedLocale}/rick-das`,
  };
  const localizedOrganizationSchema = {
    ...organizationSchema,
    inLanguage: resolvedLocale,
    url: `https://www.aeroweather.app/${resolvedLocale}`,
    contactPoint: {
      ...organizationSchema.contactPoint,
      url: `https://www.aeroweather.app/${resolvedLocale}/contact`,
    },
  };
  const localizedWebsiteSchema = {
    ...websiteSchema,
    inLanguage: resolvedLocale,
    url: `https://www.aeroweather.app/${resolvedLocale}`,
  };

  return (
    <html
      lang={resolvedLocale}
      dir={isRtlLocale(resolvedLocale) ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href="https://api.rainviewer.com" />
        <link rel="dns-prefetch" href="https://tilecache.rainviewer.com" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />

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
            <NextIntlClientProvider locale={resolvedLocale} messages={messages}>
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

                  <div className="pointer-events-none fixed inset-0 -z-40 overflow-hidden">
                    <div className="h-full w-full bg-black/35" />
                  </div>

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