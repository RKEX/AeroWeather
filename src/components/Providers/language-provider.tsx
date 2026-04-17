"use client";

import {
    LANGUAGE_STORAGE_KEY,
    LanguageCode,
    TranslationKey,
} from "@/lib/i18n";
import {
    LOCALE_COOKIE_KEY,
    SupportedLocale,
    isRtlLocale,
    isSupportedLocale,
    normalizeSupportedLocale,
    withLocalePrefix,
} from "@/lib/locales";
import type { Route } from "next";
import { useLocale, useMessages } from "next-intl";
import { useRouter } from "next/navigation";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useTransition,
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
const LANGUAGE_MANUAL_OVERRIDE_KEY = "aeroweather_lang_manual_override";
const LANGUAGE_SETTINGS_ENABLED = false;

function interpolate(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = params[key];
    if (value === undefined || value === null) return match;
    return String(value);
  });
}

function normalizeLocaleForUi(value?: string | null): SupportedLocale {
  const normalized = normalizeSupportedLocale(value);
  if (isSupportedLocale(normalized)) {
    return normalized;
  }
  return "en";
}

function resolveTargetLocale(next: LanguageCode): SupportedLocale {
  const normalized = String(next).toLowerCase();
  if (isSupportedLocale(normalized)) {
    return normalized;
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const intlLocale = useLocale();
  const rawMessages = useMessages() as MessageDictionary;
  const [isPending, startTransition] = useTransition();

  const language = normalizeLocaleForUi(intlLocale) as LanguageCode;

  const messages = useMemo(() => rawMessages, [rawMessages]);

  const setLanguage = useCallback((next: LanguageCode) => {
    if (!LANGUAGE_SETTINGS_ENABLED) {
      return;
    }

    const nextLocale = resolveTargetLocale(next);

    if (typeof window === "undefined") return;

    const currentPathname = window.location.pathname;
    const currentSearch = window.location.search;
    const nextPathname = withLocalePrefix(currentPathname, nextLocale);
    const currentUrl = `${currentPathname}${currentSearch}`;
    const nextUrl = `${nextPathname}${currentSearch}`;

    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLocale);
    localStorage.setItem(LANGUAGE_MANUAL_OVERRIDE_KEY, "1");
    document.cookie = `${LOCALE_COOKIE_KEY}=${nextLocale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    if (currentUrl === nextUrl) {
      return;
    }

    startTransition(() => {
      router.push(nextUrl as Route, { scroll: false });
    });
  }, [router]);

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
      document.documentElement.dir = isRtlLocale(language as SupportedLocale) ? "rtl" : "ltr";
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
      <React.Fragment key={language}>
        {children}
      </React.Fragment>
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
