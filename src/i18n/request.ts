import { DEFAULT_LOCALE } from "@/lib/locales";
import { getLocaleMessages } from "@/lib/message-loader";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = DEFAULT_LOCALE;

  return {
    locale,
    messages: await getLocaleMessages(locale),
  };
});
