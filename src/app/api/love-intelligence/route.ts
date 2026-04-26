import { buildImpactInputs, createFallbackImpactDays } from "@/lib/impact-intelligence";
import { calculateLoveDay, LoveDay } from "@/lib/love-intelligence";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const OPEN_METEO_FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const CACHE_TTL_MS = 10 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  data: { days: LoveDay[] };
};

type LoveCacheStore = {
  cache: Map<string, CacheEntry>;
  inFlight: Map<string, Promise<{ days: LoveDay[] }>>;
};

function getCacheStore(): LoveCacheStore {
  const globalStore = globalThis as typeof globalThis & {
    __aeroweather_love_cache__?: LoveCacheStore;
  };

  if (!globalStore.__aeroweather_love_cache__) {
    globalStore.__aeroweather_love_cache__ = {
      cache: new Map<string, CacheEntry>(),
      inFlight: new Map<string, Promise<{ days: LoveDay[] }>>(),
    };
  }

  return globalStore.__aeroweather_love_cache__;
}

function cacheKey(lat: number, lon: number): string {
  return `love:${lat.toFixed(4)},${lon.toFixed(4)}`;
}

function parseCoordinate(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

async function fetchLoveDaysFromOpenMeteo(lat: number, lon: number): Promise<{ days: LoveDay[] }> {
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
  return { days: inputDays.map((d) => calculateLoveDay(d, lat, lon)) };
}

function createFallbackLoveDays(lat: number, lon: number): LoveDay[] {
  // Re-use the impact fallback input structure to generate love days
  const today = new Date();
  const inputDays = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const isoDate = date.toISOString().slice(0, 10);

    // Simple deterministic fallback weather
    function hashUnit(seed: string): number {
      let hash = 2166136261;
      for (let i = 0; i < seed.length; i++) {
        hash ^= seed.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      return (hash >>> 0) / 4294967295;
    }

    const seed = `${lat.toFixed(3)}:${lon.toFixed(3)}:${isoDate}`;
    const seasonal = Math.sin((index / 8) * Math.PI) * 0.08;

    return {
      date: isoDate,
      tempMax: Math.max(-10, Math.min(48, 29 * (1 + (hashUnit(`${seed}:tmax`) * 2 - 1) * 0.1 + seasonal))),
      tempMin: Math.max(-15, Math.min(40, 20 * (1 + (hashUnit(`${seed}:tmin`) * 2 - 1) * 0.1 + seasonal * 0.5))),
      precipitationProbability: Math.max(0, Math.min(100, 35 * (1 + (hashUnit(`${seed}:prec`) * 2 - 1) * 0.1 - seasonal * 0.4))),
      windMax: Math.max(0, Math.min(80, 14 * (1 + (hashUnit(`${seed}:wind`) * 2 - 1) * 0.1))),
      humidityMax: Math.max(20, Math.min(100, 68 * (1 + (hashUnit(`${seed}:hum`) * 2 - 1) * 0.1))),
    };
  });

  return inputDays.map((d) => calculateLoveDay(d, lat, lon));
}

async function getCachedLoveDays(lat: number, lon: number): Promise<{ data: { days: LoveDay[] }; cacheHit: boolean; usedFallback: boolean }> {
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

  const requestPromise = fetchLoveDaysFromOpenMeteo(lat, lon)
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
    const fallbackData = { days: createFallbackLoveDays(lat, lon) };
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
    const { data, cacheHit, usedFallback } = await getCachedLoveDays(lat, lon);

    return NextResponse.json(
      data,
      {
        headers: {
          "Cache-Control": "private, max-age=600",
          "X-Love-Cache": cacheHit ? "HIT" : "MISS",
          "X-Love-Fallback": usedFallback ? "TRUE" : "FALSE",
        },
      }
    );
  } catch {
    const fallback = { days: createFallbackLoveDays(lat, lon) };
    return NextResponse.json(fallback, {
      headers: {
        "Cache-Control": "private, max-age=600",
        "X-Love-Cache": "MISS",
        "X-Love-Fallback": "TRUE",
      },
    });
  }
}
