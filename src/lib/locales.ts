import {
    defaultLocale,
    locales,
    type Locale,
} from "@/i18n";

export const SUPPORTED_LOCALES = locales;

export type SupportedLocale = Locale;

export const DEFAULT_LOCALE: SupportedLocale = defaultLocale;
export const LOCALE_COOKIE_KEY = "aeroweather_locale";

const RTL_LOCALES: ReadonlySet<SupportedLocale> = new Set(["ar"]);
const SUPPORTED_LOCALE_SET: ReadonlySet<string> = new Set(SUPPORTED_LOCALES);

const MIDDLE_EAST_COUNTRIES = new Set([
  "AE", "BH", "DZ", "EG", "IQ", "JO", "KW", "LB", "LY", "MA", "OM", "QA", "SA", "SD", "SY", "TN", "YE",
]);

const EUROPE_GERMAN_COUNTRIES = new Set(["DE", "AT", "CH", "LI"]);
const EUROPE_FRENCH_COUNTRIES = new Set(["FR", "BE", "LU", "MC"]);

function parseBaseLocale(value?: string | null): string | null {
  const normalized = (value ?? "").trim().toLowerCase();
  if (!normalized) return null;
  return normalized.split("-")[0] ?? null;
}

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALE_SET.has(value);
}

export function normalizeSupportedLocale(
  value?: string | null,
  fallback: SupportedLocale = DEFAULT_LOCALE
): SupportedLocale {
  const base = parseBaseLocale(value);
  if (base && isSupportedLocale(base)) {
    return base;
  }
  return fallback;
}

export function isRtlLocale(locale: SupportedLocale): boolean {
  return RTL_LOCALES.has(locale);
}

export function getLocaleFromPathname(pathname: string): SupportedLocale | null {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  if (!firstSegment) return null;

  const candidate = firstSegment.toLowerCase();
  if (isSupportedLocale(candidate)) {
    return candidate;
  }

  return null;
}

export function stripLocalePrefix(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname || "/";

  const segments = pathname.split("/").filter(Boolean);
  const remaining = segments.slice(1);
  return remaining.length > 0 ? `/${remaining.join("/")}` : "/";
}

export function withLocalePrefix(pathname: string, locale: SupportedLocale): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const pathWithoutLocale = stripLocalePrefix(normalizedPath);

  if (pathWithoutLocale === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathWithoutLocale}`;
}

type LanguagePreference = {
  locale: string;
  quality: number;
};

function parseAcceptLanguageHeader(acceptLanguage?: string | null): LanguagePreference[] {
  if (!acceptLanguage) return [];

  return acceptLanguage
    .split(",")
    .map((part) => {
      const [rawLocale, rawQ] = part.trim().split(";");
      const quality = rawQ?.startsWith("q=") ? Number(rawQ.slice(2)) : 1;
      return {
        locale: rawLocale?.trim().toLowerCase() ?? "",
        quality: Number.isFinite(quality) ? quality : 1,
      };
    })
    .filter((entry) => entry.locale.length > 0)
    .sort((a, b) => b.quality - a.quality);
}

export function detectLocaleFromAcceptLanguage(
  acceptLanguage?: string | null
): SupportedLocale | null {
  const preferences = parseAcceptLanguageHeader(acceptLanguage);

  for (const preference of preferences) {
    const base = parseBaseLocale(preference.locale);
    if (base && isSupportedLocale(base)) {
      return base;
    }

    if (!base) continue;

    if (base === "ko") return "ko";
    if (base === "ja") return "ja";
    if (base === "zh") return "zh";
    if (base === "es") return "es";
    if (base === "fr") return "fr";
    if (base === "de") return "de";
    if (base === "ar") return "ar";
    if (base === "ru") return "ru";
    if (base === "pt") return "pt";
    if (base === "hi") return "hi";
    if (base === "bn") return "bn";
    if (base === "en") return "en";
  }

  return null;
}

export function detectLocaleFromCountry(
  countryCode?: string | null,
  acceptLanguage?: string | null
): SupportedLocale | null {
  const country = (countryCode ?? "").trim().toUpperCase();
  if (!country) return null;

  if (country === "CN" || country === "HK" || country === "MO" || country === "TW") {
    return "zh";
  }

  if (country === "JP") return "ja";
  if (country === "KR") return "ko";

  if (country === "IN") {
    const preferred = detectLocaleFromAcceptLanguage(acceptLanguage);
    if (preferred === "hi" || preferred === "bn") return preferred;
    return "en";
  }

  if (country === "BD") return "bn";

  if (MIDDLE_EAST_COUNTRIES.has(country)) return "ar";

  if (EUROPE_GERMAN_COUNTRIES.has(country)) return "de";
  if (EUROPE_FRENCH_COUNTRIES.has(country)) return "fr";

  if (country === "ES") return "es";
  if (country === "PT") return "pt";
  if (country === "RU") return "ru";

  return null;
}

type ResolveRequestLocaleInput = {
  urlLocale?: string | null;
  persistedLocale?: string | null;
  acceptLanguage?: string | null;
  countryCode?: string | null;
};

export function resolveRequestLocale({
  urlLocale,
  persistedLocale,
  acceptLanguage,
  countryCode,
}: ResolveRequestLocaleInput): SupportedLocale {
  // 1) URL locale has top priority.
  const localeFromUrl = parseBaseLocale(urlLocale);
  if (localeFromUrl && isSupportedLocale(localeFromUrl)) {
    return localeFromUrl;
  }

  // 2) Persisted user override (cookie/localStorage mirror).
  const persisted = parseBaseLocale(persistedLocale);
  if (persisted && isSupportedLocale(persisted)) {
    return persisted;
  }

  // 3) Browser preference via Accept-Language.
  const localeFromBrowser = detectLocaleFromAcceptLanguage(acceptLanguage);
  if (localeFromBrowser) return localeFromBrowser;

  // 4) Optional IP/country signal.
  const localeFromCountry = detectLocaleFromCountry(countryCode, acceptLanguage);
  if (localeFromCountry) return localeFromCountry;

  // 5) Safe global fallback.
  return DEFAULT_LOCALE;
}