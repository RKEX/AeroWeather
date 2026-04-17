"use client";

import {
    LANGUAGE_STORAGE_KEY,
    LanguageCode,
    TranslationKey,
    isLanguageCode,
    normalizeLanguage,
    translations,
} from "@/lib/i18n";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type TranslateParams = Record<string, string | number>;

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (next: LanguageCode) => void;
  t: (key: TranslationKey, params?: TranslateParams) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolveInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";

  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved && isLanguageCode(saved)) {
    return saved;
  }

  return normalizeLanguage(navigator.language);
}

function interpolate(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = params[key];
    if (value === undefined || value === null) return match;
    return String(value);
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(resolveInitialLanguage);

  const setLanguage = useCallback((next: LanguageCode) => {
    setLanguageState((prev) => {
      if (prev === next) return prev;
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) => {
      const localized = translations[language][key];
      const fallback = translations.en[key];
      const template = localized ?? fallback ?? key;
      return interpolate(template, params);
    },
    [language]
  );

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
