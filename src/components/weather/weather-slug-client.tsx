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
import { type TouchEvent, Suspense, useEffect, useMemo, useRef } from "react";
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
  const router = useRouter();
  const touchStartXRef = useRef<number | null>(null);
  const { setWeather: setSkyWeather, setTimezone, setTimeData } = useSkyStore();
  const { t, language } = useLanguage();

  const isDaySlug = checkIsDaySlug(slug);

  // ✅ Day slug হলে localStorage থেকে user এর saved location পড়ো
  // City slug হলে null — server data ব্যবহার হবে
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

  // ✅ Day slug হলে client location দিয়ে weather fetch করো
  // City slug হলে fetch করার দরকার নেই — server data আছে
  const fetchLat = isDaySlug && clientLocation ? clientLocation.lat : null;
  const fetchLon = isDaySlug && clientLocation ? clientLocation.lon : null;
  const { weather: clientWeather, loading } = useWeather(fetchLat, fetchLon);

  // ✅ কোন data দেখাবে:
  // Day slug + client weather ready → client weather (correct user location)
  // Day slug + loading → skeleton
  // City slug → server initialWeather (correct city from URL)
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
      // Wait for actual client-location weather on day routes to avoid showing stale/default sky.
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

  // Swipe navigation
  const allSlugs = displayWeather.daily.time.map((t) => {
    const d = new Date(t + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return "today";
    if (diff === 1) return "tomorrow";
    return d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  });

  const slugIndex = allSlugs.indexOf(slug);
  const prevSlug = slugIndex > 0 ? allSlugs[slugIndex - 1] : null;
  const nextSlug =
    slugIndex >= 0 && slugIndex < allSlugs.length - 1 ?
      allSlugs[slugIndex + 1]
    : null;
  const dateHeadingFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(toLocaleTag(language), {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    [language],
  );

  const handleSwipe = (offsetX: number) => {
    if (offsetX < -60 && nextSlug) {
      const nextPath = `/weather/${nextSlug}` as Route;
      router.push(nextPath);
    }

    if (offsetX > 60 && prevSlug) {
      const prevPath = `/weather/${prevSlug}` as Route;
      router.push(prevPath);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartXRef.current;
    if (start === null) return;
    const end = event.changedTouches[0]?.clientX ?? start;
    handleSwipe(end - start);
    touchStartXRef.current = null;
  };

  const themeCode = getWeatherTheme(
    displayWeather.daily.weatherCode[actualDayIndex],
    1,
  );
  const themeClasses = getThemeClasses(themeCode);

  // ✅ Day slug এ client location পেয়েছি কিন্তু weather এখনো আসেনি → skeleton
  if (isDaySlug && clientLocation && loading && !clientWeather) {
    return (
      <main className="relative min-h-screen max-w-full overflow-x-clip bg-slate-950 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <WeatherSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main
      className={`relative min-h-screen max-w-full overflow-x-clip text-white transition-colors duration-1000 ${themeClasses}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-[50vw] w-[50vw] rounded-full bg-white/5 opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-12">
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
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
            {t("backToHome")}
          </Link>
          <div className="text-right">
            <h2 className="text-xl font-bold text-white/50">
              {dateHeadingFormatter.format(
                new Date(
                  displayWeather.daily.time[actualDayIndex] + "T00:00:00",
                ),
              )}
            </h2>
            <h1 className="text-2xl font-bold text-white">
              {displayName} Weather Forecast & AQI – Live Radar
            </h1>
            <Link
              href="/blog"
              className="text-xs font-medium text-indigo-400/60 hover:text-indigo-400 hover:underline">
              View Atmospheric Insights & Blog
            </Link>
          </div>
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="grid grid-cols-1 gap-6 select-none lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <WeatherHero
              weather={displayWeather}
              locationName={displayName}
              dayIndex={actualDayIndex}
            />

            {/* ✅ AdSense Content Boost: City Description */}
            <CityWeatherDescription city={displayName} />

            <Suspense fallback={<HourlyForecastSkeleton />}>
              <HourlyForecast
                weather={displayWeather}
                dayIndex={actualDayIndex}
              />
            </Suspense>

            {/* ✅ User Value Signal Section */}
            <GlassCard className="p-8">
              <h3 className="mb-4 text-xl font-bold text-white">
                How to Use This Weather Intelligence
              </h3>
              <p className="leading-relaxed text-white/70">
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

          <div className="flex flex-col gap-6 lg:col-span-1">
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
          </div>
        </div>
      </div>
    </main>
  );
}
