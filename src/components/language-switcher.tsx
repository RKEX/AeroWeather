"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { LanguageCode, TranslationKey } from "@/lib/i18n";
import { Check, ChevronDown } from "lucide-react";
import { type WheelEvent, memo, useEffect, useMemo, useRef, useState } from "react";

const options: { code: LanguageCode; key: TranslationKey }[] = [
  { code: "en", key: "english" },
  { code: "zh", key: "chinese" },
  { code: "ja", key: "japanese" },
  { code: "ko", key: "korean" },
  { code: "es", key: "spanish" },
  { code: "fr", key: "french" },
  { code: "de", key: "german" },
  { code: "ar", key: "arabic" },
  { code: "ru", key: "russian" },
  { code: "pt", key: "portuguese" },
  { code: "bn", key: "bengali" },
  { code: "hi", key: "hindi" },
];

const LANGUAGE_SETTINGS_ENABLED = false;

function LanguageSwitcherComponent({
  className = "",
}: {
  className?: string;
}) {
  if (!LANGUAGE_SETTINGS_ENABLED) {
    return null;
  }

  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const currentLanguageLabel = useMemo(() => {
    const currentOption = options.find((option) => option.code === language);
    return currentOption ? t(currentOption.key) : t("english");
  }, [language, t]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage);
    setIsOpen(false);
  };

  const handleDropdownWheel = (event: WheelEvent<HTMLUListElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.scrollTop += event.deltaY;
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex items-center gap-2 text-xs font-medium text-white/85 ${className}`}
    >
      <span>{t("language")}</span>
      <button
        type="button"
        aria-label={t("language")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex min-w-28 items-center justify-between gap-2 rounded-lg border border-white/25 bg-black/30 px-2.5 py-1.5 text-xs text-white shadow-[0_6px_20px_rgba(0,0,0,0.28)] backdrop-blur-md transition-colors hover:bg-black/40"
      >
        <span className="truncate">{currentLanguageLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      <div
        className={`absolute top-full right-0 z-1200 mt-1.5 min-w-44 overflow-hidden rounded-xl border border-white/20 bg-slate-900/90 shadow-[0_18px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-150 ${
          isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <ul
          role="listbox"
          aria-label={t("language")}
          data-lenis-prevent
          onWheel={handleDropdownWheel}
          className="glass-scroll max-h-72 overflow-y-auto p-1"
        >
        {options.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                role="option"
                aria-selected={language === option.code}
                onClick={() => handleSelect(option.code)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                  language === option.code
                    ? "bg-indigo-500/30 text-white"
                    : "text-white/85 hover:bg-white/10"
                }`}
              >
                <span>{t(option.key)}</span>
                {language === option.code && <Check className="h-3.5 w-3.5" />}
              </button>
            </li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export const LanguageSwitcher = memo(LanguageSwitcherComponent);
LanguageSwitcher.displayName = "LanguageSwitcher";
