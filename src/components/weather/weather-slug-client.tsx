"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { resolveDayIndex } from "@/lib/day-slug";
import {
  getThemeClasses,
  getWeatherTheme,
} from "@/lib/weather-theme";
import { WeatherData } from "@/types/weather";
import { useWeather } from "@/hooks/useWeather";

import { WeatherHero } from "@/components/weather/weather-hero";
import { AiWeatherInsight } from "@/components/weather/ai-weather-insight";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { SunArc } from "@/components/weather/sun-arc";

interface WeatherSlugClientProps {
  initialWeather: WeatherData;
  locationName: string;
  slug: string;
}

export function WeatherSlugClient({ initialWeather, locationName, slug }: WeatherSlugClientProps) {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [activeLocation, setActiveLocation] = useState({
    lat: 40.7128, // Default placeholders, will be updated from initial or local
    lon: -74.006,
    name: locationName
  });

  // 1. Identify if it's a day slug
  const dummyDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const isDaySlug = resolveDayIndex(slug.toLowerCase(), dummyDates) >= 0;

  useEffect(() => {
    setHasMounted(true);
    
    // Only hydrate from localStorage if it's a day-based slug (today, tomorrow, etc.)
    // For city slugs like /weather/london, we want to stick to the URL's city.
    if (isDaySlug) {
      const saved = localStorage.getItem("aeroweather_location");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setActiveLocation(parsed);
        } catch (e) {
          console.error("Failed to parse saved location", e);
        }
      }
    }
  }, [isDaySlug]);

  // Use the useWeather hook to re-fetch if the location changed after mount
  const { weather, loading } = useWeather(
    hasMounted && isDaySlug ? activeLocation.lat : null,
    hasMounted && isDaySlug ? activeLocation.lon : null
  );

  const displayWeather = (hasMounted && isDaySlug && weather) ? weather : initialWeather;
  const displayName = (hasMounted && isDaySlug) ? activeLocation.name : locationName;

  const dayIndex = resolveDayIndex(slug, displayWeather.daily.time);
  const actualDayIndex = dayIndex >= 0 ? dayIndex : 0;

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

  const themeCode = getWeatherTheme(displayWeather.daily.weatherCode[actualDayIndex], 1);
  const themeClasses = getThemeClasses(themeCode);

  if (hasMounted && isDaySlug && loading && !weather) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-sky-400" />
          <p className="text-white/60 animate-pulse">Syncing location weather...</p>
        </div>
      </div>
    );
  }

  return (
    <main className={`relative min-h-screen overflow-x-hidden text-white transition-colors duration-1000 ${themeClasses}`}>
      <div className="pointer-events-none fixed top-1/4 left-1/4 h-[50vw] w-[50vw] rounded-full bg-white/10 mix-blend-overlay blur-[150px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/15">
              <ArrowLeft className="h-4 w-4" />
              Back Dashboard
            </Link>
            <div className="text-right">
               <h2 className="text-2xl font-bold">{format(new Date(displayWeather.daily.time[actualDayIndex] + "T00:00:00"), "EEEE, MMM do")}</h2>
               <p className="text-white/60">Weather in {displayName}</p>
            </div>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => handleSwipe(info.offset.x)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 cursor-grab active:cursor-grabbing select-none"
        >
          <div className="lg:col-span-8 flex flex-col gap-6">
            <WeatherHero weather={displayWeather} locationName={displayName} dayIndex={actualDayIndex} />
            <AiWeatherInsight weather={displayWeather} dayIndex={actualDayIndex} />
            <HourlyForecast weather={displayWeather} dayIndex={actualDayIndex} />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <SunArc weather={displayWeather} dayIndex={actualDayIndex} />
            <DailyForecast weather={displayWeather} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
