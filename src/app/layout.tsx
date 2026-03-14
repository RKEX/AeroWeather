import RootClientLayout from "@/components/layout/root-client-layout";
import SkyBackground from "@/components/weather/sky-background";
import { Footer } from "@/components/footer";
import { geistMono, geistSans } from "@/lib/fonts";
import { defaultSEO } from "@/lib/seo-config";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: defaultSEO.title,
    template: `%s | AeroWeather`,
  },
  description: defaultSEO.description,
  keywords: defaultSEO.keywords,
  authors: [{ name: "Rick Das" }],
  openGraph: {
    title: defaultSEO.title,
    description: defaultSEO.description,
    url: defaultSEO.url,
    siteName: "AeroWeather",
    images: [{ url: defaultSEO.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: [defaultSEO.ogImage],
    creator: defaultSEO.twitterHandle,
  },
  icons: {
  icon: [
    {
      url: "/icon.svg",
      type: "image/svg+xml",
    },
  ],
  apple: [
    {
      url: "/icon.svg",
    },
  ],
},
  verification: {
    google: "5AQfg1BzRq4wAzL9_4IVKwgKmM6ubXUn9PpPVkletgA",
  },
};

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
        <RootClientLayout>
          {/* SKY BACKGROUND */}
          <SkyBackground />

          {/* DARK OVERLAY */}
          <div className="fixed inset-0 -z-40 bg-black/35 backdrop-blur-[2px]" />

          {/* APP */}
          <main className="relative z-10 min-h-screen">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>

          <Footer />
        </RootClientLayout>
      </body>
    </html>
  );
}
