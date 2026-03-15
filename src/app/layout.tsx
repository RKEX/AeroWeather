import { Footer } from "@/components/footer";
import RootClientLayout from "@/components/layout/root-client-layout";
import SkyBackground from "@/components/weather/sky-background";
import { geistMono, geistSans } from "@/lib/fonts";
import {
  organizationSchema,
  personSchema,
  websiteSchema,
} from "@/lib/schema/person";
import { defaultSEO } from "@/lib/seo-config";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(defaultSEO.url),

  title: {
    default: defaultSEO.title,
    template: "%s | AeroWeather",
  },

  description: defaultSEO.description,
  keywords: defaultSEO.keywords,

  authors: [
    {
      name: "Rick Das",
      url: "https://github.com/RKEX",
    },
  ],

  creator: "Rick Das",
  publisher: "AeroWeather",

  alternates: {
    canonical: defaultSEO.url,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: defaultSEO.title,
    description: defaultSEO.description,
    url: defaultSEO.url,
    siteName: "AeroWeather",
    images: [
      {
        url: defaultSEO.ogImage,
        width: 1200,
        height: 630,
        alt: "AeroWeather - Ultra Accurate Weather Forecast by Rick Das",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: [defaultSEO.ogImage],
    creator: defaultSEO.twitterHandle,
    site: "@aeroweather",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.ico",
  },

  verification: {
    google: "5AQfg1BzRq4wAzL9_4IVKwgKmM6ubXUn9PpPVkletgA",
  },

  other: {
    "google-adsense-account": "ca-pub-3928601593161247",
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
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden bg-transparent font-sans">

        {/* ── Structured Data (JSON-LD) ── */}

        {/* 1. Person Schema — Rick Das founder identity + social links */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />

        {/* 2. Organization Schema — AeroWeather brand entity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* 3. Website Schema — enables Google Search sitelinks box */}
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

      </body>
    </html>
  );
}