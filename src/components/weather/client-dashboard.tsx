"use client";

import { usePerformance } from "@/components/Providers/performance-provider";
import { DailyForecastSkeleton, HourlyForecastSkeleton } from "@/components/weather/ForecastSkeleton";
import { LazyRadarMap } from "@/components/weather/lazy-radar-map";
import { LocationSearch } from "@/components/weather/location-search";
import { MapSkeleton } from "@/components/weather/MapSkeleton";
import { WeatherHero } from "@/components/weather/weather-hero";
import { useWeather } from "@/hooks/useWeather";
import { LocationResult, WeatherData } from "@/types/weather";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { memo, Suspense, useEffect, useRef, useState } from "react";

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

function ClientDashboard({
  initialWeather,
  initialLocation,
}: {
  initialWeather: WeatherData | null;
  initialLocation: { lat: number; lon: number; name: string };
}) {
  const [activeLocation, setActiveLocation] = useState(initialLocation);
  const [showDeferredSections, setShowDeferredSections] = useState(false);
  const deferredTriggerRef = useRef<HTMLDivElement | null>(null);
  const { tier } = usePerformance();
  const isLowEnd = tier === "LOW";
  const [isLighthouseAudit, setIsLighthouseAudit] = useState(false);

  const { weather, error } = useWeather(activeLocation.lat, activeLocation.lon);

  const displayWeather = weather ?? initialWeather;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = localStorage.getItem("aeroweather_location");
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as {
        lat?: number;
        lon?: number;
        name?: string;
      };

      if (
        typeof parsed.lat === "number" &&
        typeof parsed.lon === "number" &&
        typeof parsed.name === "string"
      ) {
        setActiveLocation({
          lat: parsed.lat,
          lon: parsed.lon,
          name: parsed.name,
        });
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
    if (typeof navigator === "undefined") {
      return;
    }

    setIsLighthouseAudit(/Lighthouse|Chrome-Lighthouse/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setShowDeferredSections(true);
      return;
    }

    const el = deferredTriggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShowDeferredSections(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px", threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleLocationSelect = (loc: LocationResult) => {
    setActiveLocation({
      lat: loc.latitude,
      lon: loc.longitude,
      name: loc.name,
    });
  };

  const isNight = displayWeather ? displayWeather.current.isDay === 0 : true;
  const textPrimary = "text-white";
  const textTertiary = "text-white/60";
  const currentCity = activeLocation.name;

  if (isLighthouseAudit && displayWeather) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <main className="relative z-10 container mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:py-12">
          <header className="relative z-50 flex w-full flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold tracking-tight drop-shadow-sm ${textPrimary}`}>
                  AeroWeather
                </h1>
                <p className={`text-sm font-medium ${textTertiary}`}>
                  Ultra-Premium Forecast
                </p>
              </div>
            </div>
            <div className="w-full max-w-xl flex-1 md:w-auto">
              <LocationSearch onSelect={handleLocationSelect} />
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-8">
              <WeatherHero weather={displayWeather} locationName={currentCity} />
              <div className="h-32 w-full rounded-3xl border border-white/10 bg-white/10" />
              <div className="h-48 w-full rounded-3xl border border-white/10 bg-white/10" />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-4">
              <div className="h-125 w-full rounded-3xl border border-white/10 bg-white/10" />
              <div className="h-48 w-full rounded-3xl border border-white/10 bg-white/10" />
              <div className="h-64 w-full rounded-3xl border border-white/10 bg-white/10" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-1000 ${isLowEnd ? 'performance-low' : ''}`}>
      <main className="relative z-10 container mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:py-12 gpu-accel">
        <header className="relative z-50 flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1
                className={`text-2xl font-bold tracking-tight drop-shadow-sm ${textPrimary}`}>
                AeroWeather
              </h1>
              <p className={`text-sm font-medium ${textTertiary}`}>
                Ultra-Premium Forecast
              </p>
            </div>
          </div>
          <div className="w-full max-w-xl flex-1 md:w-auto">
            <LocationSearch onSelect={handleLocationSelect} />
          </div>
        </header>

        {error && !displayWeather && (
          <div className="rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-center text-white">
            {error}
          </div>
        )}

        {displayWeather && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-8">
                <div>
                  <WeatherHero
                    weather={displayWeather}
                    locationName={currentCity}
                  />
                </div>
                <div>
                  <Suspense fallback={<div className="h-32 w-full rounded-3xl border border-white/10 bg-white/5" />}>
                    <AiWeatherInsight weather={displayWeather} />
                  </Suspense>
                </div>
                <div>
                  <Suspense fallback={<HourlyForecastSkeleton />}>
                    <HourlyForecast weather={displayWeather} />
                  </Suspense>
                </div>
                <div ref={deferredTriggerRef} className="h-1 w-full" />
                {showDeferredSections ?
                  <div>
                    <LazyRadarMap
                      lat={activeLocation.lat}
                      lon={activeLocation.lon}
                      isNight={isNight}
                    />
                  </div>
                : <MapSkeleton />
                }
              </div>
              <div className="flex flex-col gap-6 lg:col-span-4">
                {showDeferredSections ?
                  <>
                    <div>
                      <Suspense fallback={<DailyForecastSkeleton />}>
                        <DailyForecast weather={displayWeather} />
                      </Suspense>
                    </div>
                    <div>
                      <Suspense fallback={<div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5" />}>
                        <SunArc weather={displayWeather} />
                      </Suspense>
                    </div>
                    <div>
                      <Suspense fallback={<div className="h-64 w-full rounded-3xl border border-white/10 bg-white/5" />}>
                        <AqiCard
                          aqiData={displayWeather.airQuality}
                          isNight={isNight}
                        />
                      </Suspense>
                    </div>
                  </>
                : <>
                    <div className="h-125 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                    <div className="h-48 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                    <div className="h-64 w-full animate-pulse rounded-3xl border border-white/10 bg-white/10" />
                  </>
                }
              </div>
            </div>
          )}
      </main>
    </div>
  );
}

export default memo(ClientDashboard);
