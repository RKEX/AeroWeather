import SkyBackground from "@/components/weather/sky-background";
import { geistMono, geistSans } from "@/lib/fonts";
import { ReactNode } from "react";
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning>
      <body className="overflow-x-hidden bg-transparent">
        {/* SKY BACKGROUND */}
        <SkyBackground />

        {/* DARK OVERLAY */}
        <div className="fixed inset-0 -z-40 bg-black/35 backdrop-blur-[2px]" />

        {/* APP */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
