import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dating-weather/") || pathname.startsWith("/love-forecast/")) {
    const city = pathname.split("/")[2];
    if (city) {
      const target = request.nextUrl.clone();
      target.pathname = `/love/${city}`;
      return NextResponse.redirect(target, 308);
    }
  }

  if (pathname.startsWith("/meditation-forecast/")) {
    const city = pathname.split("/")[2];
    if (city) {
      const target = request.nextUrl.clone();
      target.pathname = `/meditation/${city}`;
      return NextResponse.redirect(target, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dating-weather/:path*", "/love-forecast/:path*", "/meditation-forecast/:path*"],
};
