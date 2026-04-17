"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DailyForecastSkeleton, HourlyForecastSkeleton } from "@/components/weather/ForecastSkeleton";
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
import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { type TouchEvent, Suspense, useEffect, useMemo, useRef } from "react";

const AiWeatherInsight = dynamic(() => import("@/components/weather/ai-weather-insight").then(mod => mod.AiWeatherInsight), { ssr: false, loading: () => <div className="h-32 w-full rounded-3xl border border-white/10 bg-white/5" /> });
const HourlyForecast = dynamic(() => import("@/components/weather/hourly-forecast").then(mod => mod.HourlyForecast), { ssr: false, loading: () => <HourlyForecastSkeleton /> });
const DailyForecast = dynamic(() => import("@/components/weather/daily-forecast").then(mod => mod.DailyForecast), { ssr: false, loading: () => <DailyForecastSkeleton /> });
const SunArc = dynamic(() => import("@/components/weather/sun-arc").then(mod => mod.SunArc), { ssr: false, loading: () => <div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5" /> });

// ✅ Default: Kolkata
const DEFAULT_LOCATION = { lat: 22.5726, lon: 88.3639, name: "Kolkata" };

interface WeatherSlugClientProps {
  initialWeather: WeatherData;
  locationName: string;
  slug: string;
}

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

// ✅ slug টা day slug কিনা check করো
function checkIsDaySlug(slug: string): boolean {
  const dummyDates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0]!;
  });
  return resolveDayIndex(slug.toLowerCase(), dummyDates) >= 0;
}

export function WeatherSlugClient({ initialWeather, locationName, slug }: WeatherSlugClientProps) {
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
        const parsed = JSON.parse(saved) as { lat?: number; lon?: number; name?: string };
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
  const displayWeather = isDaySlug ? (clientWeather ?? initialWeather) : initialWeather;
  const displayName = isDaySlug ? (clientLocation?.name ?? locationName) : locationName;

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
  const nextSlug = slugIndex >= 0 && slugIndex < allSlugs.length - 1 ? allSlugs[slugIndex + 1] : null;
  const dateHeadingFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(toLocaleTag(language), {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    [language]
  );

  const handleSwipe = (offsetX: number) => {
    if (offsetX < -60 && nextSlug) {
      const nextPath = `/${language}/weather/${nextSlug}` as Route;
      router.push(nextPath);
    }

    if (offsetX > 60 && prevSlug) {
      const prevPath = `/${language}/weather/${prevSlug}` as Route;
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

  const themeCode = getWeatherTheme(displayWeather.daily.weatherCode[actualDayIndex], 1);
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
    <main className={`relative min-h-screen max-w-full overflow-x-clip text-white transition-colors duration-1000 ${themeClasses}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-[50vw] w-[50vw] rounded-full bg-white/10 opacity-40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/15">
            <ArrowLeft className="h-4 w-4" />
            {t("backToHome")}
          </Link>
          <div className="text-right">
            <div className="mb-2 flex justify-end">
              <LanguageSwitcher />
            </div>
            <h2 className="text-2xl font-bold">
              {dateHeadingFormatter.format(
                new Date(displayWeather.daily.time[actualDayIndex] + "T00:00:00")
              )}
            </h2>
            <p className="text-white/60">{t("weatherIn", { city: displayName })}</p>
          </div>
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="grid grid-cols-1 gap-6 select-none lg:grid-cols-12"
        >
          <div className="lg:col-span-8 flex flex-col gap-6">
            <WeatherHero weather={displayWeather} locationName={displayName} dayIndex={actualDayIndex} />
            <Suspense fallback={<HourlyForecastSkeleton />}>
              <HourlyForecast weather={displayWeather} dayIndex={actualDayIndex} />
            </Suspense>
            <Suspense fallback={<div className="h-32 w-full rounded-3xl border border-white/10 bg-white/5" />}>
              <AiWeatherInsight weather={displayWeather} dayIndex={actualDayIndex} />
            </Suspense>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <Suspense fallback={<div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5" />}>
              <SunArc weather={displayWeather} dayIndex={actualDayIndex} timezone={displayWeather.timezone} />
            </Suspense>
            <Suspense fallback={<DailyForecastSkeleton />}>
              <DailyForecast weather={displayWeather} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}