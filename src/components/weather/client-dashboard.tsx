"use client";

import { usePerformance } from "@/components/Providers/performance-provider";
import { DailyForecastSkeleton, HourlyForecastSkeleton } from "@/components/weather/ForecastSkeleton";
import { LazyRadarMap } from "@/components/weather/lazy-radar-map";
import { LocationSearch } from "@/components/weather/location-search";
import { MapSkeleton } from "@/components/weather/MapSkeleton";
import { WeatherHero } from "@/components/weather/weather-hero";
import { useWeather } from "@/hooks/useWeather";
import { useSkyStore } from "@/store/useSkyStore";
import { LocationResult, WeatherData } from "@/types/weather";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { memo, Suspense, useEffect, useMemo, useState } from "react";

const HourlyForecast = dynamic(() => import("@/components/weather/hourly-forecast").then(mod => mod.HourlyForecast), { 
  ssr: false,
  loading: () => <HourlyForecastSkeleton />,
});
const AiWeatherInsight = dynamic(() => import("@/components/weather/ai-weather-insight").then(mod => mod.AiWeatherInsight), { 
  ssr: false,
  loading: () => <div className="h-32 w-full rounded-3xl border border-white/10 bg-white/5" />,
});
const DailyForecast = dynamic(() => import("@/components/weather/daily-forecast").then(mod => mod.DailyForecast), { 
  ssr: false,
  loading: () => <DailyForecastSkeleton />,
});
const AqiCard = dynamic(() => import("@/components/weather/aqi-card").then(mod => mod.AqiCard), { 
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-3xl border border-white/10 bg-white/5" />,
});
const SunArc = dynamic(() => import("@/components/weather/sun-arc").then(mod => mod.SunArc), { 
  ssr: false,
  loading: () => <div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5" />,
});

type IdleHandle = number;
type Timer = ReturnType<typeof setTimeout>;

function scheduleIdleTask(callback: () => void, timeout = 200): () => void {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const id = (window as Window & {
      requestIdleCallback: (cb: () => void, options?: { timeout: number }) => IdleHandle;
      cancelIdleCallback: (cb: IdleHandle) => void;
    }).requestIdleCallback(callback, { timeout });

    return () => {
      (window as Window & { cancelIdleCallback: (cb: IdleHandle) => void }).cancelIdleCallback(id);
    };
  }

  const timer: Timer = setTimeout(callback, Math.min(timeout, 120));
  return () => clearTimeout(timer);
}

// ✅ weatherCode থেকে WeatherKind বের করা
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

function ClientDashboard({
  initialWeather,
  initialLocation,
}: {
  initialWeather: WeatherData;
  initialLocation: { lat: number; lon: number; name: string };
}) {
  const [activeLocation, setActiveLocation] = useState(initialLocation);
  const [priority2Ready, setPriority2Ready] = useState(false);
  const [priority3Ready, setPriority3Ready] = useState(false);
  const { tier } = usePerformance();
  const isLowEnd = tier === "LOW";

  const { weather, error } = useWeather(activeLocation.lat, activeLocation.lon);
  const safeWeather = weather ?? initialWeather;

  // ✅ zustand store update — SkyBackground sync হবে
  const { setWeather: setSkyWeather, setTimezone } = useSkyStore();
  useEffect(() => {
    setSkyWeather(codeToWeatherKind(safeWeather.current.weatherCode));
    if (safeWeather.timezone) {
      setTimezone(safeWeather.timezone);
    }
  }, [safeWeather.current.weatherCode, safeWeather.timezone]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("aeroweather_location");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { lat?: number; lon?: number; name?: string };
      if (typeof parsed.lat === "number" && typeof parsed.lon === "number" && typeof parsed.name === "string") {
        setActiveLocation({ lat: parsed.lat, lon: parsed.lon, name: parsed.name });
      }
    } catch {
      // Keep server-provided location when cached data is malformed.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("aeroweather_location", JSON.stringify(activeLocation));
  }, [activeLocation]);

  useEffect(() => {
    const cancelP2 = scheduleIdleTask(() => setPriority2Ready(true), 160);
    const cancelP3 = scheduleIdleTask(() => setPriority3Ready(true), 360);
    return () => { cancelP2(); cancelP3(); };
  }, []);

  const handleLocationSelect = (loc: LocationResult) => {
    setActiveLocation({ lat: loc.latitude, lon: loc.longitude, name: loc.name });
  };

  const isNight = useMemo(() => safeWeather.current.isDay === 0, [safeWeather.current.isDay]);
  const textPrimary = "text-white";
  const textTertiary = "text-white/60";
  const currentCity = activeLocation.name;
  const shouldRenderPriority3 = priority3Ready;

  return (
    <div className={`relative min-h-screen max-w-full overflow-x-clip transition-colors duration-1000 ${isLowEnd ? 'performance-low' : ''}`}>
      <main className="relative z-10 container mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:py-12 gpu-accel">
        <header className="relative z-50 flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight drop-shadow-sm ${textPrimary}`}>
                AeroWeather
              </h1>
              <p className={`text-sm font-medium ${textTertiary}`}>Ultra-Premium Forecast</p>
            </div>
          </div>
          <div className="w-full max-w-xl flex-1 md:w-auto">
            <LocationSearch onSelect={handleLocationSelect} />
          </div>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-center text-white">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <div>
              <WeatherHero weather={safeWeather} locationName={currentCity} showDetails={priority2Ready} />
            </div>

            <div>
              {priority2Ready ? (
                <Suspense fallback={<div className="h-32 w-full rounded-3xl border border-white/10 bg-white/5" />}>
                  <AiWeatherInsight weather={safeWeather} />
                </Suspense>
              ) : (
                <div className="h-32 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
              )}
            </div>

            <div>
              {priority2Ready ? (
                <Suspense fallback={<HourlyForecastSkeleton />}>
                  <HourlyForecast weather={safeWeather} />
                </Suspense>
              ) : (
                <HourlyForecastSkeleton />
              )}
            </div>
            {shouldRenderPriority3 ? (
              <div>
                <LazyRadarMap lat={activeLocation.lat} lon={activeLocation.lon} isNight={isNight} />
              </div>
            ) : (
              <MapSkeleton />
            )}
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4">
            {shouldRenderPriority3 ? (
              <>
                <div>
                  <Suspense fallback={<DailyForecastSkeleton />}>
                    <DailyForecast weather={safeWeather} />
                  </Suspense>
                </div>
                <div>
                  <Suspense fallback={<div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5" />}>
                    {/* ✅ timezone prop যোগ করা হয়েছে */}
                    <SunArc weather={safeWeather} timezone={safeWeather.timezone} />
                  </Suspense>
                </div>
                <div>
                  <Suspense fallback={<div className="h-64 w-full rounded-3xl border border-white/10 bg-white/5" />}>
                    <AqiCard aqiData={safeWeather.airQuality} isNight={isNight} />
                  </Suspense>
                </div>
              </>
            ) : (
              <>
                <div className="h-125 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                <div className="h-48 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                <div className="h-64 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default memo(ClientDashboard);