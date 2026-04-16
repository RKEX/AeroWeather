"use client";

import { usePerformance } from "@/components/Providers/performance-provider";
import { DailyForecastSkeleton, HourlyForecastSkeleton } from "@/components/weather/ForecastSkeleton";
import { LocationSearch } from "@/components/weather/location-search";
import { MapSkeleton } from "@/components/weather/MapSkeleton";
import { WeatherHero } from "@/components/weather/weather-hero";
import { WindPressureCard } from "@/components/weather/wind-pressure-card";
import { useWeather } from "@/hooks/useWeather";
import { extractSkyTimeData } from "@/lib/sky-time";
import { getCurrentWindKmh } from "@/lib/wind";
import { useSkyStore } from "@/store/useSkyStore";
import { LocationResult, WeatherData } from "@/types/weather";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { memo, Suspense, useEffect, useState } from "react";

const HourlyForecast = dynamic(
  () => import("@/components/weather/hourly-forecast").then((mod) => mod.HourlyForecast),
  { ssr: false, loading: () => <HourlyForecastSkeleton /> }
);
const AiWeatherInsight = dynamic(
  () => import("@/components/weather/ai-weather-insight").then((mod) => mod.AiWeatherInsight),
  { ssr: false, loading: () => <div className="h-32 w-full rounded-3xl border border-white/10 bg-white/5" /> }
);
const DailyForecast = dynamic(
  () => import("@/components/weather/daily-forecast").then((mod) => mod.DailyForecast),
  { ssr: false, loading: () => <DailyForecastSkeleton /> }
);
const AqiCard = dynamic(
  () => import("@/components/weather/aqi-card").then((mod) => mod.AqiCard),
  { ssr: false, loading: () => <div className="h-64 w-full rounded-3xl border border-white/10 bg-white/5" /> }
);
const SunArc = dynamic(
  () => import("@/components/weather/sun-arc").then((mod) => mod.SunArc),
  { ssr: false, loading: () => <div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5" /> }
);
const RadarMap = dynamic(
  () => import("@/components/weather/radar-map").then((mod) => mod.RadarMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

type IdleHandle = number;
type Timer = ReturnType<typeof setTimeout>;

function scheduleIdleTask(callback: () => void, timeout = 200): () => void {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const id = (
      window as Window & {
        requestIdleCallback: (cb: () => void, options?: { timeout: number }) => IdleHandle;
        cancelIdleCallback: (cb: IdleHandle) => void;
      }
    ).requestIdleCallback(callback, { timeout });
    return () => {
      (window as Window & { cancelIdleCallback: (cb: IdleHandle) => void }).cancelIdleCallback(id);
    };
  }
  const timer: Timer = setTimeout(callback, Math.min(timeout, 120));
  return () => clearTimeout(timer);
}

function getInitialLocation(fallback: { lat: number; lon: number; name: string }) {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem("aeroweather_location");
    if (!saved) return fallback;
    const parsed = JSON.parse(saved) as { lat?: number; lon?: number; name?: string };
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lon === "number" &&
      typeof parsed.name === "string"
    ) {
      return { lat: parsed.lat, lon: parsed.lon, name: parsed.name };
    }
  } catch {}
  return fallback;
}

function codeToWeatherKind(
  code: number
): "clear" | "cloudy" | "rain" | "snow" | "fog" | "storm" {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 95) return "storm";
  return "clear";
}

function ClientDashboard({
  initialWeather,
  initialLocation,
}: {
  initialWeather: WeatherData;
  initialLocation: { lat: number; lon: number; name: string };
}) {
  const [activeLocation, setActiveLocation] = useState(() =>
    getInitialLocation(initialLocation)
  );
  const [priority2Ready, setPriority2Ready] = useState(false);
  const [priority3Ready, setPriority3Ready] = useState(false);
  const { tier } = usePerformance();
  const isLowEnd = tier === "LOW";

  const { weather, error } = useWeather(activeLocation.lat, activeLocation.lon);
  const safeWeather = weather ?? initialWeather;

  const { setWeather: setSkyWeather, setTimezone, setTimeData } = useSkyStore();
  useEffect(() => {
    // Only sync sky state from real fetched weather to avoid dummy/fallback flashes.
    if (!weather) {
      setTimeData(null);
      return;
    }

    setSkyWeather(codeToWeatherKind(weather.current.weatherCode));
    if (weather.timezone) setTimezone(weather.timezone);
    setTimeData(extractSkyTimeData(weather));
  }, [weather, setSkyWeather, setTimezone, setTimeData]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("aeroweather_location", JSON.stringify(activeLocation));
  }, [activeLocation]);

  useEffect(() => {
    const cancelP2 = scheduleIdleTask(() => setPriority2Ready(true), 160);
    const cancelP3 = scheduleIdleTask(() => setPriority3Ready(true), 360);
    return () => {
      cancelP2();
      cancelP3();
    };
  }, []);

  const handleLocationSelect = (loc: LocationResult) => {
    setActiveLocation({ lat: loc.latitude, lon: loc.longitude, name: loc.name });
  };

  const isNight = safeWeather.current.isDay === 0;
  const windSourceKmh = getCurrentWindKmh(safeWeather);
  const currentCity = activeLocation.name;
  const shouldRenderPriority3 = priority3Ready;

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-clip transition-colors duration-1000 ${
        isLowEnd ? "performance-low" : ""
      }`}
    >
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:py-10 gpu-accel">

        {/* ── Header ── */}
        <header className="relative z-50 flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                AeroWeather
              </h1>
              <p className="text-sm font-medium text-white/60">Ultra-Premium Forecast</p>
            </div>
          </div>
          <div className="w-full sm:max-w-md lg:max-w-xl">
            <LocationSearch onSelect={handleLocationSelect} />
          </div>
        </header>

        {/* ── Error banner ── */}
        {error && (
          <div className="rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-center text-white">
            {error}
          </div>
        )}

        {/* ── Main grid ── */}
        {/*
          Mobile  : single column, components stack in reading order
          Desktop : left col (flex-1) + right sidebar (fixed 340px)
          Right sidebar is sticky so it stays visible while scrolling left col
        */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">

          {/* ════ LEFT / MAIN COLUMN ════ */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">

            {/* 1. Hero */}
            <WeatherHero
              weather={safeWeather}
              locationName={currentCity}
              showDetails={priority2Ready}
              windSourceKmh={windSourceKmh}
            />

            {/* 2. AI Insight */}
            {priority2Ready ? (
              <Suspense
                fallback={
                  <div className="h-32 w-full rounded-3xl border border-white/10 bg-white/5" />
                }
              >
                <AiWeatherInsight weather={safeWeather} />
              </Suspense>
            ) : (
              <div className="h-32 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
            )}

            {/* 3. Hourly Forecast */}
            {priority2Ready ? (
              <Suspense fallback={<HourlyForecastSkeleton />}>
                <HourlyForecast weather={safeWeather} />
              </Suspense>
            ) : (
              <HourlyForecastSkeleton />
            )}

            {/*
              4. Mobile only — 7-Day + SunArc appear here so users don't
                 have to scroll past the radar map to see the forecast.
                 On lg+ these are hidden here and shown in the sidebar instead.
            */}
            <div className="flex flex-col gap-6 lg:hidden">
              {shouldRenderPriority3 ? (
                <>
                  <Suspense fallback={<DailyForecastSkeleton />}>
                    <DailyForecast weather={safeWeather} />
                  </Suspense>
                  <Suspense
                    fallback={
                      <div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5" />
                    }
                  >
                    <SunArc weather={safeWeather} timezone={safeWeather.timezone} />
                  </Suspense>
                </>
              ) : (
                <>
                  <div className="h-105 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                  <div className="h-48 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                </>
              )}
            </div>

            {/* 5. Live Radar */}
            <RadarMap
              lat={activeLocation.lat}
              lon={activeLocation.lon}
              isNight={isNight}
            />

            {/* 6. Mobile only — AQI + Wind after radar */}
            <div className="flex flex-col gap-6 lg:hidden">
              {shouldRenderPriority3 ? (
                <>
                  <Suspense
                    fallback={
                      <div className="h-64 w-full rounded-3xl border border-white/10 bg-white/5" />
                    }
                  >
                    <AqiCard aqiData={safeWeather.airQuality} isNight={isNight} />
                  </Suspense>
                  <WindPressureCard weather={safeWeather} windSourceKmh={windSourceKmh} />
                </>
              ) : (
                <>
                  <div className="h-64 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                  <div className="h-64 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                </>
              )}
            </div>
          </div>

          {/* ════ RIGHT / SIDEBAR — desktop only ════ */}
          {/*
            w-[340px] fixed width keeps sidebar from squishing.
            sticky top-6 means it stays visible as you scroll.
            hidden on mobile — content is reordered in LEFT column above.
          */}
          <aside className="hidden w-85 shrink-0 flex-col gap-6 lg:sticky lg:top-6 lg:flex">
            {shouldRenderPriority3 ? (
              <>
                {/* 7-Day Forecast */}
                <Suspense fallback={<DailyForecastSkeleton />}>
                  <DailyForecast weather={safeWeather} />
                </Suspense>

                {/* Sun Arc */}
                <Suspense
                  fallback={
                    <div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5" />
                  }
                >
                  <SunArc weather={safeWeather} timezone={safeWeather.timezone} />
                </Suspense>

                {/* AQI */}
                <Suspense
                  fallback={
                    <div className="h-64 w-full rounded-3xl border border-white/10 bg-white/5" />
                  }
                >
                  <AqiCard aqiData={safeWeather.airQuality} isNight={isNight} />
                </Suspense>

                {/* Wind & Pressure */}
                <WindPressureCard weather={safeWeather} windSourceKmh={windSourceKmh} />
              </>
            ) : (
              <>
                <div className="h-105 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                <div className="h-48 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                <div className="h-64 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                <div className="h-64 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
              </>
            )}
          </aside>

        </div>
      </main>
    </div>
  );
}

export default memo(ClientDashboard);