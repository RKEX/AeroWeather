export const locales = [
  "en", "bn", "hi", "zh", "ja", "ko", "es", "fr", "de", "ru", "ar", "pt",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";