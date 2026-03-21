"use client";

import { DailyForecastSkeleton, HourlyForecastSkeleton } from "@/components/weather/ForecastSkeleton";
import { WeatherHero } from "@/components/weather/weather-hero";
import { WeatherSkeleton } from "@/components/weather/weather-skeleton";
import { useWeather } from "@/hooks/useWeather";
import { resolveDayIndex } from "@/lib/day-slug";
import { getThemeClasses, getWeatherTheme } from "@/lib/weather-theme";
import { useSkyStore } from "@/store/useSkyStore";
import { WeatherData } from "@/types/weather";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type TouchEvent, Suspense, useEffect, useRef, useState } from "react";

const AiWeatherInsight = dynamic(() => import("@/components/weather/ai-weather-insight").then(mod => mod.AiWeatherInsight), { ssr: false, loading: () => <div className="h-32 w-full rounded-3xl border border-white/10 bg-white/5" /> });
const HourlyForecast = dynamic(() => import("@/components/weather/hourly-forecast").then(mod => mod.HourlyForecast), { ssr: false, loading: () => <HourlyForecastSkeleton /> });
const DailyForecast = dynamic(() => import("@/components/weather/daily-forecast").then(mod => mod.DailyForecast), { ssr: false, loading: () => <DailyForecastSkeleton /> });
const SunArc = dynamic(() => import("@/components/weather/sun-arc").then(mod => mod.SunArc), { ssr: false, loading: () => <div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5" /> });

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

export function WeatherSlugClient({ initialWeather, locationName, slug }: WeatherSlugClientProps) {
  const router = useRouter();
  const dummyDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const isDaySlug = resolveDayIndex(slug.toLowerCase(), dummyDates) >= 0;

  const [savedLocation, setSavedLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // ✅ zustand sky store
  const { setWeather: setSkyWeather, setTimezone } = useSkyStore();

  useEffect(() => {
    if (!isDaySlug || typeof window === "undefined") return;
    const saved = localStorage.getItem("aeroweather_location");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { lat?: number; lon?: number; name?: string };
      if (typeof parsed.lat === "number" && typeof parsed.lon === "number" && typeof parsed.name === "string") {
        setSavedLocation({ lat: parsed.lat, lon: parsed.lon, name: parsed.name });
      }
    } catch {
      // ignore
    }
  }, [isDaySlug]);

  const fetchLat = isDaySlug && savedLocation ? savedLocation.lat : null;
  const fetchLon = isDaySlug && savedLocation ? savedLocation.lon : null;
  const { weather, loading } = useWeather(fetchLat, fetchLon);

  const displayWeather = (isDaySlug && weather) ? weather : initialWeather;
  const displayName = (isDaySlug && savedLocation) ? savedLocation.name : locationName;

  const dayIndex = resolveDayIndex(slug, displayWeather.daily.time);
  const actualDayIndex = dayIndex >= 0 ? dayIndex : 0;

  // ✅ forecast day এর weatherCode + timezone দিয়ে SkyEngine sync
  useEffect(() => {
    const code = displayWeather.daily.weatherCode[actualDayIndex] ?? 0;
    setSkyWeather(codeToWeatherKind(code));
    if (displayWeather.timezone) {
      setTimezone(displayWeather.timezone);
    }
  }, [actualDayIndex, displayWeather.daily.weatherCode, displayWeather.timezone]);

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

  const handleSwipe = (offsetX: number) => {
    if (offsetX < -60 && nextSlug) router.push(`/weather/${nextSlug}`);
    if (offsetX > 60 && prevSlug) router.push(`/weather/${prevSlug}`);
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

  if (isDaySlug && loading && !weather) {
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
            Back to Home
          </Link>
          <div className="text-right">
            <h2 className="text-2xl font-bold">{format(new Date(displayWeather.daily.time[actualDayIndex] + "T00:00:00"), "EEEE, MMM do")}</h2>
            <p className="text-white/60">Weather in {displayName}</p>
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