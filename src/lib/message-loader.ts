import { promises as fs } from "node:fs";
import path from "node:path";

import {
    DEFAULT_LOCALE,
    SUPPORTED_LOCALES,
    SupportedLocale,
    isSupportedLocale,
} from "@/lib/locales";

export type MessageDictionary = Record<string, string>;

const MESSAGES_ROOT_DIR = path.join(process.cwd(), "messages");
const GENERATED_MESSAGES_DIR = path.join(MESSAGES_ROOT_DIR, "generated");

const runtimeCache = new Map<SupportedLocale, MessageDictionary>();

function getStaticMessagePath(locale: SupportedLocale): string {
  return path.join(MESSAGES_ROOT_DIR, `${locale}.json`);
}

function getGeneratedMessagePath(locale: SupportedLocale): string {
  return path.join(GENERATED_MESSAGES_DIR, `${locale}.json`);
}

async function readJsonDictionary(
  filePath: string
): Promise<MessageDictionary | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key, String(value ?? "")])
    );
  } catch {
    return null;
  }
}

function isCompleteDictionary(
  dictionary: MessageDictionary,
  sourceDictionary: MessageDictionary
): boolean {
  const sourceKeys = Object.keys(sourceDictionary);
  return sourceKeys.every((key) => typeof dictionary[key] === "string");
}

async function readSourceEnglishDictionary(): Promise<MessageDictionary> {
  const cached = runtimeCache.get(DEFAULT_LOCALE);
  if (cached) return cached;

  const englishDictionary = await readJsonDictionary(getStaticMessagePath("en"));
  if (!englishDictionary) {
    throw new Error("Missing required messages/en.json source dictionary");
  }

  runtimeCache.set(DEFAULT_LOCALE, englishDictionary);
  return englishDictionary;
}

async function readSeedDictionary(
  locale: SupportedLocale
): Promise<MessageDictionary | null> {
  const staticDictionary = await readJsonDictionary(getStaticMessagePath(locale));
  if (staticDictionary) return staticDictionary;

  return readJsonDictionary(getGeneratedMessagePath(locale));
}

async function buildDictionaryWithFallback(
  locale: SupportedLocale,
  englishSource: MessageDictionary
): Promise<MessageDictionary> {
  const generatedPath = getGeneratedMessagePath(locale);

  const generatedFromCache = await readJsonDictionary(generatedPath);
  if (generatedFromCache && isCompleteDictionary(generatedFromCache, englishSource)) {
    return generatedFromCache;
  }

  // Deterministic fallback for production stability: no runtime machine translation.
  return englishSource;
}

export async function getLocaleMessages(
  locale: SupportedLocale
): Promise<MessageDictionary> {
  const normalizedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const cached = runtimeCache.get(normalizedLocale);
  if (cached) return cached;

  const englishSource = await readSourceEnglishDictionary();

  if (normalizedLocale === DEFAULT_LOCALE) {
    return englishSource;
  }

  const seedDictionary = await readSeedDictionary(normalizedLocale);
  if (seedDictionary && isCompleteDictionary(seedDictionary, englishSource)) {
    runtimeCache.set(normalizedLocale, seedDictionary);
    return seedDictionary;
  }

  const generatedOrFallback = await buildDictionaryWithFallback(
    normalizedLocale,
    englishSource
  );

  runtimeCache.set(normalizedLocale, generatedOrFallback);
  return generatedOrFallback;
}

export function clearLocaleMessagesCache(): void {
  runtimeCache.clear();
}

export async function warmLocaleMessages(
  locales: readonly SupportedLocale[] = SUPPORTED_LOCALES
): Promise<void> {
  await Promise.all(locales.map((locale) => getLocaleMessages(locale)));
}