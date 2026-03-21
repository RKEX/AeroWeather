import { Navigation } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

export function Footer() {
  return (
    // ✅ animate-in fade-in slide-in-from-bottom-4 সরানো হয়েছে
    // filter-related property GPU composited না — CLS বাড়াচ্ছিল
    <footer className="relative z-10 mt-20 w-full px-4 pb-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl md:p-12">
        {/* Decorative background glow inside the footer card */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />

        <div className="relative z-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-white/15 bg-white/10 p-2 shadow-lg">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                AeroWeather
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed font-medium text-white/60">
                Ultra-Premium Weather Intelligence Platform providing real-time
                forecasts, interactive radar and AI weather insights for a
                global audience.
              </p>
              <p className="text-[11px] font-bold tracking-widest text-indigo-400/80 uppercase">
                Weather data powered by Open-Meteo API
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              Navigation
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/weather/today">7 Day Forecast</FooterLink>
              <FooterLink href="/weather/tomorrow">Hourly Forecast</FooterLink>
              <FooterLink href="/">Weather Radar</FooterLink>
              <FooterLink href="/sitemap.xml">City Weather</FooterLink>
              <FooterLink href="/">Weather Maps</FooterLink>
            </nav>
          </div>

          {/* Popular Cities Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              Popular Cities
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/weather/kolkata">
                Weather in Kolkata
              </FooterLink>
              <FooterLink href="/weather/delhi">Weather in Delhi</FooterLink>
              <FooterLink href="/weather/mumbai">Weather in Mumbai</FooterLink>
              <FooterLink href="/weather/london">Weather in London</FooterLink>
              <FooterLink href="/weather/new-york">
                Weather in New York
              </FooterLink>
              <FooterLink href="/weather/tokyo">Weather in Tokyo</FooterLink>
            </nav>
          </div>

          {/* Company Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              Company
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/contact">Contact us</FooterLink>
              <FooterLink href="/about">About AeroWeather</FooterLink>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 mt-16 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-8">
          <p className="text-sm text-white/50">
            &copy; 2026{" "}
            <span className="font-semibold text-white/80">AeroWeather</span>.
            All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-white/10" />
            <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
              Built and maintained by{" "}
              <span className="text-indigo-400/50">Rick Das</span>
            </p>
            <div className="h-px w-8 bg-white/10" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isStatic = href.endsWith(".xml") || href === "#";

  const content = (
    <span className="text-sm text-white/60 transition-colors duration-300 hover:text-white">
      {children}
    </span>
  );

  if (isStatic) {
    return <a href={href}>{content}</a>;
  }

  return (
    <Link href={href as Route} className="group">
      {content}
    </Link>
  );
}