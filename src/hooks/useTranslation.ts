"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { useMessages } from "next-intl";
import { useCallback, useMemo } from "react";
import enMessages from "../../messages/en.json";

type TranslateParams = Record<string, string | number>;

export type SourceTranslationKey = keyof typeof enMessages;
export type TranslationDictionary = Record<SourceTranslationKey, string>;

function toDictionary(rawMessages: Record<string, unknown>): TranslationDictionary {
  return Object.fromEntries(
    (Object.keys(enMessages) as SourceTranslationKey[]).map((key) => [
      key,
      typeof rawMessages[key] === "string"
        ? (rawMessages[key] as string)
        : (enMessages[key] as string),
    ])
  ) as TranslationDictionary;
}


export function useTranslation() {
  const { language, t: baseTranslate } = useLanguage();
  const rawMessages = useMessages() as Record<string, unknown>;
  const dict = useMemo(() => toDictionary(rawMessages), [rawMessages]);

  const t = useCallback(
    (key: SourceTranslationKey, params?: TranslateParams) => {
      return baseTranslate(key, params);
    },
    [baseTranslate]
  );

  return { t, language, dict };
}
