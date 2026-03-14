import RootClientLayout from "@/components/layout/root-client-layout";
import SkyBackground from "@/components/weather/sky-background";
import { geistMono, geistSans } from "@/lib/fonts";
import { defaultSEO } from "@/lib/seo-config";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: defaultSEO.title,
  description: defaultSEO.description,
  keywords: defaultSEO.keywords,
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
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
      <body className="overflow-x-hidden bg-transparent">
        <RootClientLayout>
          {/* SKY BACKGROUND */}
          <SkyBackground />

          {/* DARK OVERLAY */}
          <div className="fixed inset-0 -z-40 bg-black/35 backdrop-blur-[2px]" />

          {/* APP */}
          <main className="relative z-10">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
        </RootClientLayout>
      </body>
    </html>
  );
}
