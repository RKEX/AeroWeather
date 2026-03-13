"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

import SkyBackground from "@/components/weather/sky-background";
import { geistMono, geistSans } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: Readonly<RootLayoutProps>) => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden bg-transparent will-change-transform">
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
      </body>
    </html>
  );
};

export default RootLayout;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden bg-transparent will-change-transform">
        <SkyBackground />

        <div className="fixed inset-0 -z-40 bg-black/35 backdrop-blur-[2px]" />

        <main className="relative z-10">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
  }, []);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="overflow-x-hidden bg-transparent">
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
      </body>
    </html>
  );
};

export default RootLayout;
