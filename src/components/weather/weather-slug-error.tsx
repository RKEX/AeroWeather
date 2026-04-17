"use client";

import { useLanguage } from "@/components/Providers/language-provider";

export function WeatherSlugError() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <p className="text-white/60">{t("weatherLoadingError")}</p>
    </div>
  );
}
