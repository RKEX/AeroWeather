import {
    SUPPORTED_LOCALES,
    isSupportedLocale,
} from "@/lib/locales";
import {
    clearLocaleMessagesCache,
    getLocaleMessages,
    warmLocaleMessages,
} from "@/lib/message-loader";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale");
  const force = request.nextUrl.searchParams.get("force") === "1";

  if (force) {
    clearLocaleMessagesCache();
  }

  if (!localeParam || localeParam === "all") {
    await warmLocaleMessages(SUPPORTED_LOCALES);
    return NextResponse.json({
      ok: true,
      locales: SUPPORTED_LOCALES,
    });
  }

  if (!isSupportedLocale(localeParam)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Unsupported locale: ${localeParam}`,
      },
      { status: 400 }
    );
  }

  const messages = await getLocaleMessages(localeParam);

  return NextResponse.json({
    ok: true,
    locale: localeParam,
    keyCount: Object.keys(messages).length,
  });
}