import {
    DEFAULT_LOCALE,
    LOCALE_COOKIE_KEY,
    getLocaleFromPathname,
    stripLocalePrefix,
    withLocalePrefix,
} from "@/lib/locales";
import { NextRequest, NextResponse } from "next/server";

const REQUEST_LOCALE_HEADER = "x-aw-locale";

function setLocaleCookie(response: NextResponse, locale: string): NextResponse {
  response.cookies.set(LOCALE_COOKIE_KEY, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;

  const urlLocale = getLocaleFromPathname(pathname);

  if (urlLocale) {
    const pathWithoutLocale = stripLocalePrefix(pathname);

    if (urlLocale !== DEFAULT_LOCALE) {
      const redirectUrl = nextUrl.clone();
      redirectUrl.pathname = withLocalePrefix(pathWithoutLocale, DEFAULT_LOCALE);

      const response = NextResponse.redirect(redirectUrl);
      return setLocaleCookie(response, DEFAULT_LOCALE);
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(REQUEST_LOCALE_HEADER, DEFAULT_LOCALE);

    const rewriteUrl = nextUrl.clone();
    rewriteUrl.pathname = pathWithoutLocale;

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    return setLocaleCookie(response, DEFAULT_LOCALE);
  }

  const redirectUrl = nextUrl.clone();
  redirectUrl.pathname = withLocalePrefix(pathname, DEFAULT_LOCALE);

  const response = NextResponse.redirect(redirectUrl);
  return setLocaleCookie(response, DEFAULT_LOCALE);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};