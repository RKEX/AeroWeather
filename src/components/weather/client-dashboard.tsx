"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { usePerformance } from "@/components/Providers/performance-provider";
import GlassCard from "@/components/ui/GlassCard";
import {
  AiWeatherInsightSkeleton,
  AqiCardSkeleton,
  AstroPanelSkeleton,
  ImpactCalendarSkeleton,
  RainTimelineCardSkeleton,
} from "@/components/weather/CardSkeletons";
import {
  DailyForecastSkeleton,
  HourlyForecastSkeleton,
} from "@/components/weather/ForecastSkeleton";
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
import Link from "next/link";
import { memo, Suspense, useEffect, useState } from "react";

const HourlyForecast = dynamic(
  () =>
    import("@/components/weather/hourly-forecast").then(
      (mod) => mod.HourlyForecast,
    ),
  { ssr: false, loading: () => <HourlyForecastSkeleton /> },
);
const AiWeatherInsight = dynamic(
  () =>
    import("@/components/weather/ai-weather-insight").then(
      (mod) => mod.AiWeatherInsight,
    ),
  {
    ssr: false,
    loading: () => <AiWeatherInsightSkeleton />,
  },
);
const DailyForecast = dynamic(
  () =>
    import("@/components/weather/daily-forecast").then(
      (mod) => mod.DailyForecast,
    ),
  { ssr: false, loading: () => <DailyForecastSkeleton /> },
);
const AqiCard = dynamic(
  () => import("@/components/weather/aqi-card").then((mod) => mod.AqiCard),
  {
    ssr: false,
    loading: () => <AqiCardSkeleton />,
  },
);
const AstroPanel = dynamic(
  () =>
    import("@/components/weather/astro-panel").then((mod) => mod.AstroPanel),
  {
    ssr: false,
    loading: () => <AstroPanelSkeleton />,
  },
);
const ImpactCalendar = dynamic(
  () =>
    import("@/components/weather/impact-calendar").then(
      (mod) => mod.ImpactCalendar,
    ),
  {
    ssr: false,
    loading: () => <ImpactCalendarSkeleton />,
  },
);
const RadarMap = dynamic(
  () => import("@/components/weather/radar-map").then((mod) => mod.RadarMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);
const RainTimelineCard = dynamic(
  () =>
    import("@/components/weather/rain-timeline-card").then(
      (mod) => mod.RainTimelineCard,
    ),
  {
    ssr: false,
    loading: () => <RainTimelineCardSkeleton />,
  },
);

type IdleHandle = number;
type Timer = ReturnType<typeof setTimeout>;
const HOME_SKY_STATE_KEY = "aeroweather_home_sky_state";

function scheduleIdleTask(callback: () => void, timeout = 200): () => void {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const id = (
      window as Window & {
        requestIdleCallback: (
          cb: () => void,
          options?: { timeout: number },
        ) => IdleHandle;
        cancelIdleCallback: (cb: IdleHandle) => void;
      }
    ).requestIdleCallback(callback, { timeout });
    return () => {
      (
        window as Window & { cancelIdleCallback: (cb: IdleHandle) => void }
      ).cancelIdleCallback(id);
    };
  }
  const timer: Timer = setTimeout(callback, Math.min(timeout, 120));
  return () => clearTimeout(timer);
}

function getInitialLocation(fallback: {
  lat: number;
  lon: number;
  name: string;
}) {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem("aeroweather_location");
    if (!saved) return fallback;
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
      return { lat: parsed.lat, lon: parsed.lon, name: parsed.name };
    }
  } catch {}
  return fallback;
}

function codeToWeatherKind(
  code: number,
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
  const [activeLocation, setActiveLocation] = useState(initialLocation);

  const [priority2Ready, setPriority2Ready] = useState(false);
  const [priority3Ready, setPriority3Ready] = useState(false);
  const { tier } = usePerformance();
  const { t } = useLanguage();
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

    const skyTimeData = extractSkyTimeData(weather);
    setTimeData(skyTimeData);

    if (typeof window !== "undefined" && skyTimeData) {
      localStorage.setItem(
        HOME_SKY_STATE_KEY,
        JSON.stringify({
          weatherCode: weather.current.weatherCode,
          timezone: weather.timezone,
          timeData: skyTimeData,
          savedAt: Date.now(),
        }),
      );
    }
  }, [weather, setSkyWeather, setTimezone, setTimeData]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "aeroweather_location",
      JSON.stringify(activeLocation),
    );
  }, [activeLocation]);

  useEffect(() => {
    const saved = getInitialLocation(initialLocation);
    if (saved.name !== initialLocation.name) {
      requestAnimationFrame(() => setActiveLocation(saved));
    }

    const cancelP2 = scheduleIdleTask(() => setPriority2Ready(true), 160);
    const cancelP3 = scheduleIdleTask(() => setPriority3Ready(true), 360);
    return () => {
      cancelP2();
      cancelP3();
    };
  }, []);

  const handleLocationSelect = (loc: LocationResult) => {
    setActiveLocation({
      lat: loc.latitude,
      lon: loc.longitude,
      name: loc.name,
    });
  };

  const isNight = safeWeather.current.isDay === 0;
  const windSourceKmh = getCurrentWindKmh(safeWeather);
  const currentCity = activeLocation.name;
  const shouldRenderPriority3 = priority3Ready;

  return (
    <div
      className={`main-container relative min-h-screen w-full max-w-full overflow-visible transition-colors duration-1000 ${
        isLowEnd ? "performance-low" : ""
      }`}>
      <main className="gpu-accel relative z-10 mx-auto flex max-w-7xl touch-pan-y flex-col gap-6 overflow-visible px-4 py-6 md:py-10">
        {/* ── Header ── */}
        <header className="relative z-50 flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <GlassCard className="p-3 shadow-none">
              <Navigation className="h-6 w-6 text-white" />
            </GlassCard>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                AeroWeather: Live Weather Forecast, AQI & Radar Maps
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white/60">
                  {t("appTagline")}
                </p>
                <div className="h-1 w-1 rounded-full bg-white/10" />
                <Link
                  href="/blog"
                  className="text-xs font-bold text-white/40 hover:text-white/60 hover:underline">
                  Blog
                </Link>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:max-w-md lg:max-w-xl">
            <LocationSearch onSelect={handleLocationSelect} />
          </div>
        </header>

        {/* ── Error banner ── */}
        {error && (
          <div className="rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-center text-white">
            {error}
          </div>
        )}

        {/* ── Main content area ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ════ LEFT / MAIN SECTION (2/3 width) ════ */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* 1. Hero */}
            <WeatherHero
              weather={safeWeather}
              locationName={currentCity}
              showDetails={priority2Ready}
              windSourceKmh={windSourceKmh}
            />

            {/* 2. Weather Intelligence Analytics */}
            <GlassCard className="p-6">
              <h3 className="mb-2 text-xl font-bold text-white">
                Weather Intelligence Index
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                AeroWeather uses a groundbreaking framework to quantify
                atmospheric impact on human life. Our index analyzes the complex
                interplay of humidity, pressure, and UV radiation to provide
                hyper-local insights for your health and travel.
              </p>
            </GlassCard>

            {/* 3. Hourly Forecast */}
            {priority2Ready ?
              <Suspense fallback={<HourlyForecastSkeleton />}>
                <HourlyForecast weather={safeWeather} />
              </Suspense>
            : <HourlyForecastSkeleton />}

            {/* 4. 7-Day Forecast */}
            {shouldRenderPriority3 ?
              <Suspense fallback={<DailyForecastSkeleton />}>
                <DailyForecast weather={safeWeather} />
              </Suspense>
            : <DailyForecastSkeleton />}

            {/* 5. Live Radar Map */}
            <RadarMap
              lat={activeLocation.lat}
              lon={activeLocation.lon}
              isNight={isNight}
            />

            {/* 6. AQI Card */}
            {shouldRenderPriority3 && (
              <Suspense fallback={<AqiCardSkeleton />}>
                <AqiCard
                  aqiData={safeWeather.airQuality}
                  isNight={isNight}
                />
              </Suspense>
            )}
          </div>

          {/* ════ RIGHT / SIDEBAR SECTION (1/3 width) ════ */}
          <aside className="flex h-fit flex-col gap-6 lg:col-span-1">
            {shouldRenderPriority3 ?
              <>
                {/* 1. Astro Intelligence Panel */}
                <Suspense fallback={<AstroPanelSkeleton />}>
                  <AstroPanel
                    weather={safeWeather}
                    timezone={safeWeather.timezone}
                    lat={activeLocation.lat}
                    lon={activeLocation.lon}
                  />
                </Suspense>

                <Suspense fallback={<ImpactCalendarSkeleton />}>
                  <ImpactCalendar
                    lat={activeLocation.lat}
                    lon={activeLocation.lon}
                  />
                </Suspense>

                {/* 3. Wind & Pressure */}
                <WindPressureCard
                  weather={safeWeather}
                  windSourceKmh={windSourceKmh}
                />

                {/* 4. Rain Forecast */}
                <RainTimelineCard weather={safeWeather} />

                {/* 5. AI Insight */}
                <Suspense fallback={<AiWeatherInsightSkeleton />}>
                  <AiWeatherInsight weather={safeWeather} />
                </Suspense>
              </>
            : <>
                <AstroPanelSkeleton />
                <ImpactCalendarSkeleton />
                <AiWeatherInsightSkeleton />
              </>
            }
          </aside>
        </div>

        {/* ✅ AdSense Content Boost: Professional Meteorological Data Block */}
        <GlassCard className="mt-8 p-8 text-center md:p-12">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Advanced Atmospheric Intelligence Platform
          </h2>
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-white/70">
            AeroWeather is more than just a forecast tool; it is a comprehensive
            environmental intelligence ecosystem. Our platform utilizes elite
            scientific data sources to provide high-resolution insights into the
            global atmosphere. By monitoring{" "}
            <strong>barometric pressure systems</strong>,{" "}
            <strong>humidity gradients</strong>, and{" "}
            <strong>particulate matter concentrations</strong>, we deliver a
            multi-dimensional view of the weather that affects your daily life.
            Whether you are tracking the arrival of the <strong>monsoon</strong>{" "}
            in South Asia or monitoring a <strong>heatwave</strong> in Western
            Europe, our interactive radar and AI-powered comfort summaries
            ensure you have the most precise information available. We believe
            that professional-grade meteorological data should be beautiful,
            accessible, and actionable for everyone.
          </p>
        </GlassCard>
      </main>
    </div>
  );
}

export default memo(ClientDashboard);
