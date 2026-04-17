import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "edge";

type LocaleResponse = {
  country: string | null;
};

function extractCountryCode(headerMap: Headers): string | null {
  const countryCode =
    headerMap.get("x-vercel-ip-country") ||
    headerMap.get("cf-ipcountry") ||
    headerMap.get("x-country-code") ||
    "";

  const normalizedCountry = countryCode.trim().toUpperCase();
  if (!normalizedCountry) return null;
  return normalizedCountry;
}

export async function GET() {
  const headerMap = await headers();
  const country = extractCountryCode(headerMap);

  return NextResponse.json<LocaleResponse>(
    { country },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
