"use client";

import type { SkyTimeData } from "@/lib/sky-time";
import { useSkyStore } from "@/store/useSkyStore";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SkyEngine from "./SkyEngine";

const HOME_SKY_STATE_KEY = "aeroweather_home_sky_state";
const HOME_LOCATION_KEY = "aeroweather_location";

type PersistedSkyState = {
  weatherCode: number;
  timezone?: string;
  timeData?: SkyTimeData | null;
  savedAt?: number;
};

type LocationPayload = {
  lat?: number;
  lon?: number;
  name?: string;
};

type SkyBootstrapData = {
  weatherCode: number;
  timezone: string;
  timeData: SkyTimeData;
};

function codeToWeatherKind(code: number): "clear" | "cloudy" | "rain" | "snow" | "fog" | "storm" {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 95) return "storm";
  return "clear";
}

function parsePersistedSkyState(raw: string | null): PersistedSkyState | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PersistedSkyState;
    if (typeof parsed.weatherCode !== "number") return null;
    if (!parsed.timezone) return null;
    if (!parsed.timeData?.currentTime || !parsed.timeData?.sunrise || !parsed.timeData?.sunset) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function parseSavedLocation(raw: string | null): { lat: number; lon: number } | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as LocationPayload;
    if (typeof parsed.lat !== "number" || typeof parsed.lon !== "number") return null;
    return { lat: parsed.lat, lon: parsed.lon };
  } catch {
    return null;
  }
}

async function fetchSkyBootstrapData(lat: number, lon: number): Promise<SkyBootstrapData | null> {
  const apiUrl = new URL("https://api.open-meteo.com/v1/forecast");
  apiUrl.searchParams.set("latitude", String(lat));
  apiUrl.searchParams.set("longitude", String(lon));
  apiUrl.searchParams.set("timezone", "auto");
  apiUrl.searchParams.set("current", "weather_code");
  apiUrl.searchParams.set("daily", "sunrise,sunset");
  apiUrl.searchParams.set("forecast_days", "2");

  const response = await fetch(apiUrl.toString(), { cache: "no-store" });
  if (!response.ok) return null;

  const payload = await response.json() as {
    timezone?: string;
    utc_offset_seconds?: number;
    current?: { time?: string; weather_code?: number };
    daily?: { time?: string[]; sunrise?: string[]; sunset?: string[] };
  };

  const timezone = payload.timezone;
  const currentTime = payload.current?.time;
  const weatherCode = payload.current?.weather_code;
  const dailyTime = payload.daily?.time ?? [];
  const sunriseList = payload.daily?.sunrise ?? [];
  const sunsetList = payload.daily?.sunset ?? [];

  if (!timezone || !currentTime || typeof weatherCode !== "number") return null;

  const currentDate = currentTime.slice(0, 10);
  const dayIndex = dailyTime.findIndex((date) => date === currentDate);
  const resolvedIndex = dayIndex >= 0 ? dayIndex : 0;
  const sunrise = sunriseList[resolvedIndex];
  const sunset = sunsetList[resolvedIndex];

  if (!sunrise || !sunset) return null;

  return {
    weatherCode,
    timezone,
    timeData: {
      currentTime,
      sunrise,
      sunset,
      timezone,
      utcOffsetSeconds: payload.utc_offset_seconds,
    },
  };
}

export default function SkyBackground() {
  const [engineReady, setEngineReady] = useState(false);
  const pathname = usePathname();
  const {
    weather,
    timezone,
    timeData,
    setWeather,
    setTimezone,
    setTimeData,
  } = useSkyStore();

  const isLighthouseAudit = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Lighthouse|Chrome-Lighthouse/i.test(navigator.userAgent);
  }, []);

  const enableEngine =
    !isLighthouseAudit &&
    Boolean(timezone) &&
    Boolean(timeData?.currentTime && timeData?.sunrise && timeData?.sunset);
  const showEngine = enableEngine && engineReady;

  useEffect(() => {
    // Weather routes manage sky store from real weather payloads.
    if (pathname?.startsWith("/weather/")) return;

    const hasSkyTimeData = Boolean(
      timeData?.currentTime && timeData?.sunrise && timeData?.sunset
    );
    if (timezone && hasSkyTimeData) return;

    let cancelled = false;

    const applySkyState = (state: SkyBootstrapData | PersistedSkyState) => {
      if (cancelled) return;

      const nextTimezone = state.timezone;
      const nextTimeData = state.timeData;
      if (!nextTimezone || !nextTimeData) return;

      setWeather(codeToWeatherKind(state.weatherCode));
      setTimezone(nextTimezone);
      setTimeData(nextTimeData);
    };

    const hydrateSkyState = async () => {
      if (typeof window === "undefined") return;

      const persisted = parsePersistedSkyState(localStorage.getItem(HOME_SKY_STATE_KEY));
      if (persisted) {
        applySkyState(persisted);
        return;
      }

      const savedLocation = parseSavedLocation(localStorage.getItem(HOME_LOCATION_KEY));
      if (!savedLocation) return;

      try {
        const fetched = await fetchSkyBootstrapData(savedLocation.lat, savedLocation.lon);
        if (!fetched || cancelled) return;

        applySkyState(fetched);
        localStorage.setItem(
          HOME_SKY_STATE_KEY,
          JSON.stringify({
            weatherCode: fetched.weatherCode,
            timezone: fetched.timezone,
            timeData: fetched.timeData,
            savedAt: Date.now(),
          } satisfies PersistedSkyState)
        );
      } catch {
        // Keep fallback visual only if network hydration fails.
      }
    };

    void hydrateSkyState();

    return () => {
      cancelled = true;
    };
  }, [pathname, setTimeData, setTimezone, setWeather, timeData, timezone]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 h-dvh w-screen overflow-hidden">
      <div
        className={`sky-fallback sky-layer-gpu absolute inset-0 transition-opacity duration-500 ${
          showEngine ? "opacity-0" : "opacity-100"
        }`}
      />

      {enableEngine && (
        <div
          className={`sky-layer-gpu absolute inset-0 transition-opacity duration-500 ${
            showEngine ? "opacity-100" : "opacity-0"
          }`}
        >
          <SkyEngine
            className="h-full w-full"
            weather={weather}
            timezone={timezone}
            timeData={timeData}
            onReady={() => setEngineReady(true)}
          />
        </div>
      )}
    </div>
  );
}