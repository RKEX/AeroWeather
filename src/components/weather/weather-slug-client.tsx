"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import {
  AiWeatherInsightSkeleton,
  AstroPanelSkeleton,
  ImpactCalendarSkeleton,
} from "@/components/weather/CardSkeletons";
import { CityWeatherDescription } from "@/components/weather/city-weather-description";
import {
  DailyForecastSkeleton,
  HourlyForecastSkeleton,
} from "@/components/weather/ForecastSkeleton";
import { WeatherHero } from "@/components/weather/weather-hero";
import { WeatherSkeleton } from "@/components/weather/weather-skeleton";
import { useWeather } from "@/hooks/useWeather";
import { resolveDayIndex } from "@/lib/day-slug";
import { toLocaleTag } from "@/lib/i18n";
import { extractSkyTimeData } from "@/lib/sky-time";
import { getThemeClasses, getWeatherTheme } from "@/lib/weather-theme";
import { Link } from "@/navigation";
import { useSkyStore } from "@/store/useSkyStore";
import { WeatherData } from "@/types/weather";
import { AlertCircle, ArrowLeft } from "lucide-react";
import type { Route } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef } from "react";
import GlassCard from "../ui/GlassCard";

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

// ✅ slug টা day slug কিনা check করো
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
    } catch {
      // ignore
    }

    return DEFAULT_LOCATION;
  }, [isDaySlug]);

  const fetchLat = isDaySlug && clientLocation ? clientLocation.lat : null;
  const fetchLon = isDaySlug && clientLocation ? clientLocation.lon : null;
  const { weather: clientWeather, loading } = useWeather(fetchLat, fetchLon);

  const displayWeather =
    isDaySlug ? (clientWeather ?? initialWeather) : initialWeather;
  const displayName =
    isDaySlug ? (clientLocation?.name ?? locationName) : locationName;
  const impactLat = isDaySlug && clientLocation ? clientLocation.lat : lat;
  const impactLon = isDaySlug && clientLocation ? clientLocation.lon : lon;

  const dayIndex = resolveDayIndex(slug, displayWeather.daily.time);
  const actualDayIndex = dayIndex >= 0 ? dayIndex : 0;

  useEffect(() => {
    if (isDaySlug) {
      if (!clientWeather) {
        setTimezone("");
        setTimeData(null);
        return;
      }
      const code = clientWeather.daily.weatherCode[actualDayIndex] ?? 0;
      setSkyWeather(codeToWeatherKind(code));
      if (clientWeather.timezone) {
        setTimezone(clientWeather.timezone);
      }
      setTimeData(extractSkyTimeData(clientWeather));
      return;
    }

    const code = displayWeather.daily.weatherCode[actualDayIndex] ?? 0;
    setSkyWeather(codeToWeatherKind(code));
    if (displayWeather.timezone) {
      setTimezone(displayWeather.timezone);
    }
    setTimeData(extractSkyTimeData(displayWeather));
  }, [
    actualDayIndex,
    clientWeather,
    displayWeather,
    displayWeather.daily.weatherCode,
    displayWeather.timezone,
    isDaySlug,
    setSkyWeather,
    setTimeData,
    setTimezone,
  ]);

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

  if (isDaySlug && clientLocation && loading && !clientWeather) {
    return (
      <main className="main-container relative min-h-screen w-full max-w-full bg-slate-950 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-7xl overflow-visible">
          <WeatherSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main
      className={`main-container relative min-h-screen w-full max-w-full text-white transition-colors duration-1000 overflow-visible ${themeClasses}`}>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/4 h-[50vw] w-[50vw] rounded-full bg-white/5 opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-12 overflow-visible">
        {displayWeather.isFallback && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-orange-200">
            <AlertCircle className="h-5 w-5" />
            <div className="text-sm">
              <p className="font-bold">Atmospheric Synchronization Degraded</p>
              <p className="opacity-80">
                Showing last known or estimated atmospheric signals for this
                region.
              </p>
            </div>
          </div>
        )}
        
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:translate-x-[-2px]">
            <ArrowLeft className="h-4 w-4" />
            {t("backToHome")}
          </Link>
          <div className="text-left sm:text-right">
            <h2 className="text-lg font-bold tracking-tight text-white/40 uppercase">
              {dateHeadingFormatter.format(
                new Date(
                  displayWeather.daily.time[actualDayIndex] + "T00:00:00",
                ),
              )}
            </h2>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {displayName} Weather Forecast & AQI – Live Radar
            </h1>
            <Link
              href="/blog"
              className="text-xs font-bold text-indigo-400/80 hover:text-indigo-400 hover:underline transition-colors">
              View Atmospheric Insights & Blog
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 overflow-visible touch-pan-y">
          <div className="flex flex-col gap-6 lg:col-span-2 overflow-visible">
            <WeatherHero
              weather={displayWeather}
              locationName={displayName}
              dayIndex={actualDayIndex}
            />

            <CityWeatherDescription city={displayName} />

            <Suspense fallback={<HourlyForecastSkeleton />}>
              <HourlyForecast
                weather={displayWeather}
                dayIndex={actualDayIndex}
              />
            </Suspense>

            <GlassCard className="w-full rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
              <h3 className="mb-4 text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                How to Use This Weather Intelligence
              </h3>
              <p className="leading-relaxed text-white/70 text-sm md:text-base">
                Our ultra-premium weather dashboard is designed to provide
                actionable insights. The <strong>AQI index</strong> tells you
                when it is safe for outdoor activities, while the{" "}
                <strong>Impact Calendar</strong> predicts how atmospheric shifts
                might affect your health, travel, and environmental comfort. By
                monitoring the <strong>Real-Feel</strong> temperature instead of
                just the ambient air, you can better prepare for the true impact
                of humidity and wind on your body. Use the{" "}
                <strong>Live Radar</strong> to find dry windows in rainy
                conditions and plan your day with precision.
              </p>
            </GlassCard>

            <Suspense fallback={<DailyForecastSkeleton />}>
              <DailyForecast weather={displayWeather} />
            </Suspense>
          </div>

          <aside className="flex flex-col gap-6 lg:col-span-1 overflow-visible">
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
            <Suspense fallback={<AiWeatherInsightSkeleton />}>
              <AiWeatherInsight
                weather={displayWeather}
                dayIndex={actualDayIndex}
              />
            </Suspense>
          </aside>
        </div>
      </div>
    </main>
  );
}
