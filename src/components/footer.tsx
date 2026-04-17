"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Navigation } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

export function Footer() {
  const { t } = useLanguage();

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
            <div>
              <LanguageSwitcher />
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

          {/* Navigation Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              {t("footerNavigation")}
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/weather/today">{t("footer7DayForecast")}</FooterLink>
              <FooterLink href="/weather/tomorrow">{t("footerHourlyForecast")}</FooterLink>
              <FooterLink href="/">{t("footerWeatherRadar")}</FooterLink>
              <FooterLink href="/sitemap.xml">{t("footerCityWeather")}</FooterLink>
              <FooterLink href="/">{t("footerWeatherMaps")}</FooterLink>
            </nav>
          </div>

          {/* Popular Cities Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              {t("footerPopularCities")}
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/weather/kolkata">
                {t("footerWeatherInKolkata")}
              </FooterLink>
              <FooterLink href="/weather/delhi">{t("footerWeatherInDelhi")}</FooterLink>
              <FooterLink href="/weather/mumbai">{t("footerWeatherInMumbai")}</FooterLink>
              <FooterLink href="/weather/london">{t("footerWeatherInLondon")}</FooterLink>
              <FooterLink href="/weather/new-york">
                {t("footerWeatherInNewYork")}
              </FooterLink>
              <FooterLink href="/weather/tokyo">{t("footerWeatherInTokyo")}</FooterLink>
            </nav>
          </div>

          {/* Company Section */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
              {t("footerCompany")}
            </h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/privacy">{t("footerPrivacyPolicy")}</FooterLink>
              <FooterLink href="/terms">{t("footerTermsOfService")}</FooterLink>
              <FooterLink href="/contact">{t("footerContactUs")}</FooterLink>
              <FooterLink href="/about">{t("footerAboutAeroWeather")}</FooterLink>
              <FooterLink href="/rick-das">{t("footerRickDasFounder")}</FooterLink>
              <FooterLink href="/rick-das">{t("footerLearnRickDasBn")}</FooterLink>
              <FooterLink href="/rick-das">{t("footerLearnRickDasHi")}</FooterLink>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 mt-16 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-8">
          <p className="text-sm text-white/50">
            &copy; 2026{" "}
            <span className="font-semibold text-white/80">AeroWeather</span>.
            {t("footerRightsReserved")}
          </p>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-white/10" />
            <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">
              {t("footerBuiltBy")}{" "}
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