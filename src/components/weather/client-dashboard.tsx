"use client";

import { AiWeatherInsight } from "@/components/weather/ai-weather-insight";
import { AqiCard } from "@/components/weather/aqi-card";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { LocationSearch } from "@/components/weather/location-search";
import { SunArc } from "@/components/weather/sun-arc";
import { WeatherHero } from "@/components/weather/weather-hero";
import { useWeather } from "@/hooks/useWeather";
import { LocationResult, WeatherData } from "@/types/weather";
import { AnimatePresence, motion } from "framer-motion";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RadarMap = dynamic(
  () => import("@/components/weather/radar-map").then((m) => m.RadarMap),
  { ssr: false },
);

export default function ClientDashboard({
  initialWeather,
  initialLocation,
}: {
  initialWeather: WeatherData | null;
  initialLocation: { lat: number; lon: number; name: string };
}) {
  const [activeLocation, setActiveLocation] = useState(initialLocation);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem("aeroweather_location");
    if (saved) {
      try {
        setActiveLocation(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved location", e);
      }
    }
  }, []);

  const { weather, error } = useWeather(
    hasMounted ? activeLocation.lat : initialLocation.lat,
    hasMounted ? activeLocation.lon : initialLocation.lon
  );

  const displayWeather = hasMounted && weather ? weather : initialWeather;

  useEffect(() => {
    if (hasMounted && activeLocation) {
      localStorage.setItem(
        "aeroweather_location",
        JSON.stringify(activeLocation),
      );
    }
  }, [activeLocation, hasMounted]);

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
  const currentCity = hasMounted ? activeLocation.name : initialLocation.name;

  return (
    <div className="relative min-h-screen overflow-x-hidden transition-colors duration-1000">
      {/* Background glows matching DayDetailPage but with increased depth */}
      <div className="pointer-events-none fixed top-1/4 left-1/4 h-[50vw] w-[50vw] rounded-full bg-white/10 mix-blend-overlay blur-[150px] opacity-40" />
      <div className="pointer-events-none fixed right-1/4 bottom-1/4 h-[40vw] w-[40vw] rounded-full bg-white/5 mix-blend-overlay blur-[120px] opacity-30" />

      <main className="relative z-10 container mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:py-12">
        <header className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 shadow-xl backdrop-blur-2xl">
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

        <AnimatePresence mode="wait">
          {displayWeather && (
            <motion.div
              key={currentCity}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-8">
                <WeatherHero
                  weather={displayWeather}
                  locationName={currentCity}
                />
                <AiWeatherInsight weather={displayWeather} />
                <HourlyForecast weather={displayWeather} />
                <RadarMap
                  lat={hasMounted ? activeLocation.lat : initialLocation.lat}
                  lon={hasMounted ? activeLocation.lon : initialLocation.lon}
                  isNight={isNight}
                />
              </div>
              <div className="flex flex-col gap-6 lg:col-span-4">
                <DailyForecast weather={displayWeather} />
                <SunArc weather={displayWeather} />
                <AqiCard
                  aqiData={displayWeather.airQuality}
                  isNight={isNight}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
