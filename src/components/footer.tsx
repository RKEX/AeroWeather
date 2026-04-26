"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { Link } from "@/navigation";
import { Navigation } from "lucide-react";
import type { Route } from "next";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 mt-20 w-full px-4 pb-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl md:p-12">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />

        <div className="relative z-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
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
                {t("footerDescription")}
              </p>
              <p className="text-[11px] font-bold tracking-widest text-indigo-400/80 uppercase">
                {t("footerDataPowered")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              {t("footerNavigation")}
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/blog">Weather Blog</FooterLink>
              <FooterLink href="/weather/today">{t("forecastWord")}</FooterLink>
              <FooterLink href="/weather/tomorrow">{t("tomorrow")}</FooterLink>
              <FooterLink href="/analytics">Analytics</FooterLink>
              <FooterLink href="/">{t("home")}</FooterLink>
              <FooterLink href="/weather">{t("footerCityWeather") || "City Weather"}</FooterLink>
            </nav>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              {t("footerPopularCities")}
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/weather/kolkata">Kolkata</FooterLink>
              <FooterLink href="/weather/delhi">Delhi</FooterLink>
              <FooterLink href="/weather/mumbai">Mumbai</FooterLink>
              <FooterLink href="/weather/london">London</FooterLink>
              <FooterLink href="/weather/new-york">New York</FooterLink>
              <FooterLink href="/weather/tokyo">Tokyo</FooterLink>
            </nav>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              {t("footerCompany")}
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/privacy">{t("privacyTitle") || "Privacy Policy"}</FooterLink>
              <FooterLink href="/terms">{t("termsTitle") || "Terms of Service"}</FooterLink>
              <FooterLink href="/contact">{t("contactTitle") || "Contact Us"}</FooterLink>
              <FooterLink href="/about">{t("footerAboutAeroWeather") || "About Us"}</FooterLink>
              <FooterLink href="/rick-das">{t("footerRickDasFounder") || "Rick Das"}</FooterLink>
            </nav>
          </div>
        </div>

        <div className="relative z-10 mt-16 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-8">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white/80">AeroWeather</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-white/10" />
            <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
              {t("footerBuiltBy") || "Built by"}{" "}
              <Link href="/rick-das" className="text-indigo-400/70 hover:text-indigo-300">
                Rick Das
              </Link>
            </p>
            <div className="h-px w-8 bg-white/10" />
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  isStatic?: boolean;
}

function FooterLink({ href, children, isStatic = false }: FooterLinkProps) {
  const content = (
    <span className="text-sm text-white/60 transition-colors duration-300 hover:text-white">
      {children}
    </span>
  );

  const handleClick = () => {
    console.log(`[Footer] Navigating to: ${href}`);
  };

  if (isStatic || href.endsWith(".xml") || href === "#") {
    return (
      <a href={href} onClick={handleClick}>
        {content}
      </a>
    );
  }

  return (
    <Link 
      href={href as Route} 
      className="group" 
      onClick={handleClick}
    >
      {content}
    </Link>
  );
}