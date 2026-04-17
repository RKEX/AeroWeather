import {
    DEFAULT_LOCALE,
    SupportedLocale,
    normalizeSupportedLocale,
} from "@/lib/locales";
import { getLocaleMessages } from "@/lib/message-loader";

export type UiLanguageCode = SupportedLocale;
export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export type LocaleDictionary = Record<string, string>;

export function normalizeToUiLanguage(input?: string | null): UiLanguageCode {
  return normalizeSupportedLocale(input, DEFAULT_LOCALE);
}

export function resolveUiLanguage(_searchParams?: SearchParamsRecord): UiLanguageCode {
  return DEFAULT_LOCALE;
}

export async function resolveUiLanguageFromRequest(
  _searchParams?: SearchParamsRecord
): Promise<UiLanguageCode> {
  return DEFAULT_LOCALE;
}

export async function getLocaleDictionary(
  language: UiLanguageCode
): Promise<LocaleDictionary> {
  return getLocaleMessages(language);
}

export function interpolateLocaleText(
  template: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce((result, [key, value]) => {
    const pattern = new RegExp(`\\{${key}\\}`, "g");
    return result.replace(pattern, String(value));
  }, template);
}
