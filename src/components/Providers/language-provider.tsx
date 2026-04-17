"use client";

import {
    LANGUAGE_STORAGE_KEY,
    LanguageCode,
    TranslationKey,
} from "@/lib/i18n";
import {
    SupportedLocale,
    isRtlLocale,
    normalizeSupportedLocale,
} from "@/lib/locales";
import { useLocale, useMessages } from "next-intl";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from "react";
import enMessages from "../../../messages/en.json";

type TranslateParams = Record<string, string | number>;
type MessageDictionary = Record<string, unknown>;

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (next: LanguageCode) => void;
  t: (key: TranslationKey, params?: TranslateParams) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolate(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = params[key];
    if (value === undefined || value === null) return match;
    return String(value);
  });
}

function normalizeLocaleForUi(value?: string | null): SupportedLocale {
  return normalizeSupportedLocale(value, "en");
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const intlLocale = useLocale();
  const rawMessages = useMessages() as MessageDictionary;

  const language = normalizeLocaleForUi(intlLocale) as LanguageCode;
  const messages = useMemo(() => rawMessages, [rawMessages]);

  const setLanguage = useCallback(() => {}, []);

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) => {
      const localized = messages[key];
      const fallback = enMessages[key as keyof typeof enMessages] ?? key;
      const template = typeof localized === "string" ? localized : fallback;
      return interpolate(template, params);
    },
    [messages]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir =
        isRtlLocale(language as SupportedLocale) ? "rtl" : "ltr";
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      <React.Fragment key={language}>{children}</React.Fragment>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
