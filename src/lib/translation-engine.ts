import { SupportedLocale } from "@/lib/locales";

export type MessageDictionary = Record<string, string>;

type TranslationProvider = "deepl" | "google";

const PLACEHOLDER_REGEX = /\{(\w+)\}/g;

const DEEPL_TARGET_MAP: Partial<Record<SupportedLocale, string>> = {
  en: "EN",
  zh: "ZH",
  ja: "JA",
  ko: "KO",
  es: "ES",
  fr: "FR",
  de: "DE",
  ar: "AR",
  ru: "RU",
  pt: "PT-BR",
};

const GOOGLE_TARGET_MAP: Record<SupportedLocale, string> = {
  en: "en",
  bn: "bn",
  hi: "hi",
  zh: "zh-CN",
  ja: "ja",
  ko: "ko",
  es: "es",
  fr: "fr",
  de: "de",
  ar: "ar",
  ru: "ru",
  pt: "pt",
};

function protectPlaceholders(value: string): {
  text: string;
  restore: (input: string) => string;
} {
  const placeholders: string[] = [];
  const text = value.replace(PLACEHOLDER_REGEX, (_match, key: string) => {
    const token = `__AW_PH_${placeholders.length}_${key.toUpperCase()}__`;
    placeholders.push(`{${key}}`);
    return token;
  });

  const restore = (input: string) =>
    placeholders.reduce((result, original, index) => {
      const tokenPattern = new RegExp(`__AW_PH_${index}_[A-Z0-9_]+__`, "g");
      return result.replace(tokenPattern, original);
    }, input);

  return { text, restore };
}

async function translateWithDeepL(
  text: string,
  locale: SupportedLocale,
  apiKey: string
): Promise<string> {
  const targetLang = DEEPL_TARGET_MAP[locale];
  if (!targetLang) {
    throw new Error(`DeepL does not support target locale: ${locale}`);
  }

  const endpoint = process.env.DEEPL_API_URL ?? "https://api-free.deepl.com/v2/translate";
  const payload = new URLSearchParams({
    auth_key: apiKey,
    source_lang: "EN",
    target_lang: targetLang,
    text,
    preserve_formatting: "1",
  });

  const response = await fetch(endpoint, {
    method: "POST",
    body: payload,
  });

  if (!response.ok) {
    throw new Error(`DeepL translation failed (${response.status})`);
  }

  const body = (await response.json()) as {
    translations?: Array<{ text?: string }>;
  };

  return body.translations?.[0]?.text?.trim() || text;
}

async function translateWithGoogle(
  text: string,
  locale: SupportedLocale,
  apiKey: string
): Promise<string> {
  const target = GOOGLE_TARGET_MAP[locale];
  const endpoint = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      source: "en",
      target,
      format: "text",
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Translate failed (${response.status})`);
  }

  const body = (await response.json()) as {
    data?: {
      translations?: Array<{ translatedText?: string }>;
    };
  };

  return body.data?.translations?.[0]?.translatedText?.trim() || text;
}

function resolveTranslationProvider(locale: SupportedLocale): {
  provider: TranslationProvider;
  key: string;
} | null {
  const deepLKey = process.env.DEEPL_API_KEY?.trim();
  if (deepLKey && DEEPL_TARGET_MAP[locale]) {
    return {
      provider: "deepl",
      key: deepLKey,
    };
  }

  const googleKey = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
  if (googleKey) {
    return {
      provider: "google",
      key: googleKey,
    };
  }

  return null;
}

async function translateText(
  text: string,
  locale: SupportedLocale,
  providerConfig: { provider: TranslationProvider; key: string }
): Promise<string> {
  if (providerConfig.provider === "deepl") {
    return translateWithDeepL(text, locale, providerConfig.key);
  }

  return translateWithGoogle(text, locale, providerConfig.key);
}

export async function autoTranslateDictionary(
  locale: SupportedLocale,
  sourceDictionary: MessageDictionary
): Promise<MessageDictionary | null> {
  if (locale === "en") {
    return sourceDictionary;
  }

  const providerConfig = resolveTranslationProvider(locale);
  if (!providerConfig) {
    return null;
  }

  const translated: MessageDictionary = {};

  for (const [key, value] of Object.entries(sourceDictionary)) {
    const sourceText = String(value ?? "");
    if (!sourceText) {
      translated[key] = sourceText;
      continue;
    }

    const { text: protectedText, restore } = protectPlaceholders(sourceText);

    try {
      const translatedText = await translateText(
        protectedText,
        locale,
        providerConfig
      );
      translated[key] = restore(translatedText);
    } catch {
      // Keep strict stability: if any translation fails, fallback text remains stable.
      translated[key] = sourceText;
    }
  }

  return translated;
}