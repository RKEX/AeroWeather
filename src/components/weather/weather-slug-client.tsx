"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import GlassCard from "@/components/ui/GlassCard";
import {
  AiWeatherInsightSkeleton,
  AirQualityMiniCardSkeleton,
  AqiCardSkeleton,
  AstroPanelSkeleton,
  ImpactCalendarSkeleton,
  RainTimelineCardSkeleton,
  RealFeelCardSkeleton,
  UVIndexCardSkeleton,
} from "@/components/weather/CardSkeletons";
import {
  DailyForecastSkeleton,
  HourlyForecastSkeleton,
} from "@/components/weather/ForecastSkeleton";
import { MapSkeleton } from "@/components/weather/MapSkeleton";
import { WeatherHero } from "@/components/weather/weather-hero";
import { WindPressureCard } from "@/components/weather/wind-pressure-card";
import { useWeather } from "@/hooks/useWeather";
import { resolveDayIndex } from "@/lib/day-slug";
import { toLocaleTag } from "@/lib/i18n";
import { extractSkyTimeData } from "@/lib/sky-time";
import { getCurrentWindKmh } from "@/lib/wind";
import { getThemeClasses, getWeatherTheme } from "@/lib/weather-theme";
import { Link } from "@/navigation";
import { useSkyStore } from "@/store/useSkyStore";
import { WeatherData } from "@/types/weather";
import { AlertCircle, ArrowLeft, Navigation, Radio, Satellite, Activity } from "lucide-react";
import type { Route } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

const AiWeatherInsight = dynamic(
  () =>
    import("@/components/weather/ai-weather-insight").then(
      (mod) => mod.AiWeatherInsight,
    ),
  { ssr: false, loading: () => <AiWeatherInsightSkeleton /> },
);
const HourlyForecast = dynamic(
  () =>
    import("@/components/weather/hourly-forecast").then(
      (mod) => mod.HourlyForecast,
    ),
  { ssr: false, loading: () => <HourlyForecastSkeleton /> },
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
  { ssr: false, loading: () => <AqiCardSkeleton /> },
);
const AstroPanel = dynamic(
  () =>
    import("@/components/weather/astro-panel").then((mod) => mod.AstroPanel),
  { ssr: false, loading: () => <AstroPanelSkeleton /> },
);
const ImpactCalendar = dynamic(
  () =>
    import("@/components/weather/impact-calendar").then(
      (mod) => mod.ImpactCalendar,
    ),
  { ssr: false, loading: () => <ImpactCalendarSkeleton /> },
);
const RainTimelineCard = dynamic(
  () =>
    import("@/components/weather/rain-timeline-card").then(
      (mod) => mod.RainTimelineCard,
    ),
  { ssr: false, loading: () => <RainTimelineCardSkeleton /> },
);
const AirQualityMiniCard = dynamic(
  () =>
    import("@/components/weather/air-quality-mini-card").then(
      (mod) => mod.AirQualityMiniCard,
    ),
  { ssr: false, loading: () => <AirQualityMiniCardSkeleton /> },
);
const RealFeelCard = dynamic(
  () =>
    import("@/components/weather/real-feel-card").then(
      (mod) => mod.RealFeelCard,
    ),
  { ssr: false, loading: () => <RealFeelCardSkeleton /> },
);
const UVIndexCard = dynamic(
  () =>
    import("@/components/weather/uv-index-card").then((mod) => mod.UVIndexCard),
  { ssr: false, loading: () => <UVIndexCardSkeleton /> },
);
const RadarMap = dynamic(
  () => import("@/components/weather/radar-map").then((mod) => mod.RadarMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);

// ✅ Default: Kolkata
const DEFAULT_LOCATION = { lat: 22.5726, lon: 88.3639, name: "Kolkata" };

interface WeatherSlugClientProps {
  initialWeather: WeatherData;
  locationName: string;
  slug: string;
  lat: number;
  lon: number;
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

function checkIsDaySlug(slug: string): boolean {
  const dummyDates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0]!;
  });
  return resolveDayIndex(slug.toLowerCase(), dummyDates) >= 0;
}

export function WeatherSlugClient({
  initialWeather,
  locationName,
  slug,
  lat,
  lon,
}: WeatherSlugClientProps) {
  const { setWeather: setSkyWeather, setTimezone, setTimeData } = useSkyStore();
  const { t, language } = useLanguage();

  const isDaySlug = checkIsDaySlug(slug);

  const clientLocation = useMemo<{
    lat: number;
    lon: number;
    name: string;
  } | null>(() => {
    if (!isDaySlug || typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("aeroweather_location");
      if (saved) {
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
      }
    } catch {}
    return DEFAULT_LOCATION;
  }, [isDaySlug]);

  const fetchLat = isDaySlug && clientLocation ? clientLocation.lat : null;
  const fetchLon = isDaySlug && clientLocation ? clientLocation.lon : null;
  const { weather: clientWeather } = useWeather(fetchLat, fetchLon);

  const displayWeather = isDaySlug ? (clientWeather ?? initialWeather) : initialWeather;
  const displayName = isDaySlug ? (clientLocation?.name ?? locationName) : locationName;
  const impactLat = isDaySlug && clientLocation ? clientLocation.lat : lat;
  const impactLon = isDaySlug && clientLocation ? clientLocation.lon : lon;

  const dayIndex = resolveDayIndex(slug, displayWeather.daily.time);
  const actualDayIndex = dayIndex >= 0 ? dayIndex : 0;

  useEffect(() => {
    const code = displayWeather.daily.weatherCode[actualDayIndex] ?? 0;
    setSkyWeather(codeToWeatherKind(code));
    if (displayWeather.timezone) setTimezone(displayWeather.timezone);
    setTimeData(extractSkyTimeData(displayWeather));
  }, [actualDayIndex, displayWeather, setSkyWeather, setTimeData, setTimezone]);

  const dateHeadingFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(toLocaleTag(language), {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    [language],
  );

  const themeCode = getWeatherTheme(
    displayWeather.daily.weatherCode[actualDayIndex],
    1,
  );
  const themeClasses = getThemeClasses(themeCode);
  const isNight = displayWeather.current.isDay === 0;
  const windSourceKmh = getCurrentWindKmh(displayWeather);
  
  const isToday = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const pageDateStr = displayWeather.daily.time[actualDayIndex];
    return todayStr === pageDateStr;
  }, [displayWeather.daily.time, actualDayIndex]);

  return (
    <div
      className={`main-container relative min-h-screen w-full max-w-full overflow-visible transition-colors duration-1000 ${themeClasses}`}>
      <main className="gpu-accel relative z-10 mx-auto flex max-w-7xl touch-pan-y flex-col gap-6 overflow-visible px-4 py-6 md:py-10">
        {/* ── Header ── */}
        <header className="relative z-50 flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Link href="/" className="group">
              <GlassCard className="p-3 shadow-none transition-transform group-hover:scale-105">
                <ArrowLeft className="h-6 w-6 text-white" />
              </GlassCard>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {displayName} Weather Forecast & AQI – Live Radar
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white/60">
                  {dateHeadingFormatter.format(
                    new Date(displayWeather.daily.time[actualDayIndex] + "T00:00:00"),
                  )}
                </p>
                <div className="h-1 w-1 rounded-full bg-white/10" />
                <Link
                  href="/blog"
                  className="text-xs font-bold text-white/40 hover:text-white/60 hover:underline">
                  Atmospheric Insights
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* ── Error banner ── */}
        {displayWeather.isFallback && (
          <div className="rounded-xl border border-orange-500/50 bg-orange-500/20 p-4 text-center text-white">
            <AlertCircle className="mr-2 inline-block h-5 w-5" />
            Showing last known or estimated atmospheric signals for this region.
          </div>
        )}

        {/* ── Main content area ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ════ LEFT / MAIN SECTION (2/3 width) ════ */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* 1. Hero */}
            <WeatherHero
              weather={displayWeather}
              locationName={displayName}
              dayIndex={actualDayIndex}
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
            <Suspense fallback={<HourlyForecastSkeleton />}>
              <HourlyForecast
                weather={displayWeather}
                dayIndex={actualDayIndex}
              />
            </Suspense>

            {/* 4. 7-Day Forecast */}
            <Suspense fallback={<DailyForecastSkeleton />}>
              <DailyForecast weather={displayWeather} />
            </Suspense>

            {/* 5. Live Radar Map */}
            <GlassCard className="h-[320px] overflow-hidden shadow-none md:h-[380px] lg:h-[420px]">
              {isToday ?
                <RadarMap
                  lat={impactLat}
                  lon={impactLon}
                  isNight={isNight}
                />
              : <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-white/[0.02] to-transparent p-8 text-center">
                  {/* Subtle Background Signal Waveform */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                    <div className="h-64 w-64 animate-ping rounded-full border border-white" />
                    <div className="absolute h-48 w-48 animate-pulse rounded-full border border-white" style={{ animationDuration: '3s' }} />
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                      <Radio className="h-10 w-10 text-white/30 animate-pulse" />
                    </div>
                    
                    <div className="max-w-md space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="h-4 w-4 text-white/20" />
                        <h4 className="text-lg font-bold tracking-tight text-white/80 uppercase">
                          Atmospheric Signal Monitoring
                        </h4>
                      </div>
                      
                      <p className="text-sm leading-relaxed text-white/40">
                        Live Doppler radar and satellite feeds are synchronized to real-time atmospheric conditions. Forecasting models are currently processing future meteorological shifts.
                      </p>
                      
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/20">
                        <Satellite className="h-3 w-3" />
                        <span>Real-time signals active on current day only</span>
                      </div>
                    </div>
                  </div>

                  {/* Corner Accents */}
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-white/5" />
                  <div className="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-white/5" />
                </div>
              }
            </GlassCard>

            {/* 6. AQI Card */}
            <Suspense fallback={<AqiCardSkeleton />}>
              <AqiCard
                aqiData={displayWeather.airQuality}
                isNight={isNight}
              />
            </Suspense>

            {/* ── Mobile-only: Extra insight cards (below main content) ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
              <AirQualityMiniCard aqiData={displayWeather.airQuality} />
              <RealFeelCard weather={displayWeather} />
              <UVIndexCard weather={displayWeather} />
            </div>
          </div>

          {/* ════ RIGHT / SIDEBAR SECTION (1/3 width) ════ */}
          <aside className="flex h-fit flex-col gap-6 lg:col-span-1">
            {/* 1. Astro Intelligence Panel */}
            <Suspense fallback={<AstroPanelSkeleton />}>
              <AstroPanel
                weather={displayWeather}
                dayIndex={actualDayIndex}
                timezone={displayWeather.timezone}
                lat={lat}
                lon={lon}
              />
            </Suspense>

            <Suspense fallback={<ImpactCalendarSkeleton />}>
              <ImpactCalendar
                lat={impactLat}
                lon={impactLon}
              />
            </Suspense>

            {/* 3. Wind & Pressure */}
            <WindPressureCard
              weather={displayWeather}
              windSourceKmh={windSourceKmh}
            />

            {/* 4. Rain Forecast */}
            <RainTimelineCard weather={displayWeather} />

            {/* 5. AI Insight */}
            <Suspense fallback={<AiWeatherInsightSkeleton />}>
              <AiWeatherInsight
                weather={displayWeather}
                dayIndex={actualDayIndex}
              />
            </Suspense>

            {/* ── Tablet: 2-col grid for extra insight cards ── */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-4 lg:hidden">
              <AirQualityMiniCard aqiData={displayWeather.airQuality} />
              <RealFeelCard weather={displayWeather} />
              <UVIndexCard weather={displayWeather} />
            </div>
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
