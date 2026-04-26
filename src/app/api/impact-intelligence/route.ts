import {
    buildImpactInputs,
    calculateImpactDay,
    createFallbackImpactDays,
    ImpactDay,
} from "@/lib/impact-intelligence";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const OPEN_METEO_FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const CACHE_TTL_MS = 10 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  data: { days: ImpactDay[] };
};

type ImpactCacheStore = {
  cache: Map<string, CacheEntry>;
  inFlight: Map<string, Promise<{ days: ImpactDay[] }>>;
};

function getCacheStore(): ImpactCacheStore {
  const globalStore = globalThis as typeof globalThis & {
    __aeroweather_impact_cache__?: ImpactCacheStore;
  };

  if (!globalStore.__aeroweather_impact_cache__) {
    globalStore.__aeroweather_impact_cache__ = {
      cache: new Map<string, CacheEntry>(),
      inFlight: new Map<string, Promise<{ days: ImpactDay[] }>>(),
    };
  }

  return globalStore.__aeroweather_impact_cache__;
}

function cacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

function parseCoordinate(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

async function fetchImpactDaysFromOpenMeteo(lat: number, lon: number): Promise<{ days: ImpactDay[] }> {
  const url = new URL(OPEN_METEO_FORECAST_ENDPOINT);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("timezone", "auto");
  url.searchParams.set(
    "daily",
    [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "relative_humidity_2m_max",
    ].join(",")
  );
  url.searchParams.set("forecast_days", "16");

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Open-Meteo API failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    daily?: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_probability_max: number[];
      wind_speed_10m_max?: number[];
      windspeed_10m_max?: number[];
      relative_humidity_2m_max: number[];
    };
  };

  if (!payload.daily) {
    throw new Error("Open-Meteo response missing daily data");
  }

  const inputDays = buildImpactInputs({ lat, lon, daily: payload.daily });
  return { days: inputDays.map(calculateImpactDay) };
}

async function getCachedImpactDays(lat: number, lon: number): Promise<{ data: { days: ImpactDay[] }; cacheHit: boolean; usedFallback: boolean }> {
  const store = getCacheStore();
  const key = cacheKey(lat, lon);
  const now = Date.now();

  const cached = store.cache.get(key);
  if (cached && cached.expiresAt > now) {
    return { data: cached.data, cacheHit: true, usedFallback: false };
  }

  const ongoing = store.inFlight.get(key);
  if (ongoing) {
    const data = await ongoing;
    return { data, cacheHit: true, usedFallback: false };
  }

  const requestPromise = fetchImpactDaysFromOpenMeteo(lat, lon)
    .then((data) => {
      store.cache.set(key, {
        data,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return data;
    })
    .finally(() => {
      store.inFlight.delete(key);
    });

  store.inFlight.set(key, requestPromise);

  try {
    const data = await requestPromise;
    return { data, cacheHit: false, usedFallback: false };
  } catch {
    const fallbackData = { days: createFallbackImpactDays(lat, lon) };
    store.cache.set(key, {
      data: fallbackData,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    return { data: fallbackData, cacheHit: false, usedFallback: true };
  }
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
    const { data, cacheHit, usedFallback } = await getCachedImpactDays(lat, lon);

    return NextResponse.json(
      data,
      {
        headers: {
          "Cache-Control": "private, max-age=600",
          "X-Impact-Cache": cacheHit ? "HIT" : "MISS",
          "X-Impact-Fallback": usedFallback ? "TRUE" : "FALSE",
        },
      }
    );
  } catch {
    const fallback = { days: createFallbackImpactDays(lat, lon) };
    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "private, max-age=600",
        "X-Impact-Cache": "MISS",
        "X-Impact-Fallback": "TRUE",
      },
    });
  }
}
