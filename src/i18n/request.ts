import { DEFAULT_LOCALE, normalizeSupportedLocale } from "@/lib/locales";
import { getLocaleMessages } from "@/lib/message-loader";
import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  const headerStore = await headers();
  const localeFromHeader = headerStore.get("x-aw-locale");

  const locale = normalizeSupportedLocale(localeFromHeader, DEFAULT_LOCALE);

  return {
    locale,
    messages: await getLocaleMessages(locale),
  };
});
