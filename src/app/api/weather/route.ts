import { createFallbackWeatherData } from "@/lib/fallback-weather";
import { getCachedOpenMeteoData } from "@/lib/open-meteo-weather";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
// 10 minute revalidation for the entire route
export const revalidate = 600;

function parseCoordinate(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

export async function GET(request: NextRequest) {
  const lat = parseCoordinate(request.nextUrl.searchParams.get("lat"));
  const lon = parseCoordinate(request.nextUrl.searchParams.get("lon"));

  if (lat === null || lon === null) {
    return NextResponse.json(
      { error: "Query params lat and lon are required numbers." },
      { status: 400 }
    );
  }

  try {
    const { data, cacheHit } = await getCachedOpenMeteoData(lat, lon);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
        "X-Weather-Cache": cacheHit ? "HIT" : "MISS",
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(createFallbackWeatherData(), {
      headers: {
        "Cache-Control": "no-store",
        "X-Weather-Cache": "FALLBACK",
      },
    });
  }
}
