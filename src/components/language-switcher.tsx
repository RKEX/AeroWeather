"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { LanguageCode } from "@/lib/i18n";
import { memo } from "react";

const options: { code: LanguageCode; key: "english" | "bengali" | "hindi" | "japanese" | "korean" }[] = [
  { code: "en", key: "english" },
  { code: "bn", key: "bengali" },
  { code: "hi", key: "hindi" },
  { code: "ja", key: "japanese" },
  { code: "ko", key: "korean" },
];

function LanguageSwitcherComponent({
  className = "",
}: {
  className?: string;
}) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className={`inline-flex items-center gap-2 text-xs font-medium text-white/85 ${className}`}>
      <span>{t("language")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        aria-label={t("language")}
        className="rounded-lg border border-white/20 bg-black/35 px-2 py-1 text-xs text-white outline-none transition-colors hover:bg-black/45"
      >
        {options.map((option) => (
          <option key={option.code} value={option.code} className="text-black">
            {t(option.key)}
          </option>
        ))}
      </select>
    </label>
  );
}

export const LanguageSwitcher = memo(LanguageSwitcherComponent);
LanguageSwitcher.displayName = "LanguageSwitcher";
