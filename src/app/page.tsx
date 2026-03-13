"use client";

import { AiWeatherInsight } from "@/components/weather/ai-weather-insight";
import { AqiCard } from "@/components/weather/aqi-card";
import { DailyForecast } from "@/components/weather/daily-forecast";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { LocationSearch } from "@/components/weather/location-search";

import { SunArc } from "@/components/weather/sun-arc";
import { WeatherHero } from "@/components/weather/weather-hero";
import { useGeolocation } from "@/hooks/useLocation";
import { useWeather } from "@/hooks/useWeather";
import { getThemeClasses, getWeatherTheme } from "@/lib/weather-theme";
import { LocationResult } from "@/types/weather";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RadarMap = dynamic(
  () => import("@/components/weather/radar-map").then((m) => m.RadarMap),
  { ssr: false },
);
export default function Home() {
  const geo = useGeolocation();  // Custom Location State (defaults to NY or browser location if available)
  const [activeLocation, setActiveLocation] = useState<{
    lat: number;
    lon: number;
    name: string;
  } | null>(null);

  // Initialize location from localStorage or Geolocation
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Try localStorage
    const saved = localStorage.getItem("aeroweather_location");
    if (saved && !activeLocation) {
      try {
        setActiveLocation(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved location", e);
      }
      return;
    }

    // 2. Try Geolocation or Default
    if (!activeLocation && !geo.loading) {
      if (geo.lat && geo.lon) {
        setActiveLocation({
          lat: geo.lat,
          lon: geo.lon,
          name: "Current Location",
        });
      } else {
        setActiveLocation({ lat: 40.7128, lon: -74.006, name: "New York" });
      }
    }
  }, [geo, activeLocation]);

  // Persist active location to localStorage
  useEffect(() => {
    if (activeLocation && typeof window !== "undefined") {
      localStorage.setItem(
        "aeroweather_location",
        JSON.stringify(activeLocation),
      );
    }
  }, [activeLocation]);

  const {
    weather,
    loading: weatherLoading,
    error,
  } = useWeather(activeLocation?.lat || null, activeLocation?.lon || null);

  // Dispatch custom event when weather data updates
  useEffect(() => {
    if (!weather) return;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("aeroweather_code_update", {
          detail: weather.current.weatherCode,
        }),
      );

      localStorage.setItem(
        "aeroweather_current_code",
        weather.current.weatherCode.toString(),
      );
    }
  }, [weather]);
  const themeCode =
    weather ?
      getWeatherTheme(weather.current.weatherCode, weather.current.isDay)
    : "clear";
  const themeClasses = getThemeClasses(themeCode);

  if (!activeLocation || (weatherLoading && !weather)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-white/50" />
      </div>
    );
  }

  const handleLocationSelect = (loc: LocationResult) => {
    setActiveLocation({
      lat: loc.latitude,
      lon: loc.longitude,
      name: loc.name,
    });
  };

  const isNight = weather ? weather.current.isDay === 0 : true;
  const textPrimary = isNight ? "text-white" : "text-slate-900";
  const textSecondary = isNight ? "text-white/70" : "text-slate-700";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent transition-colors duration-1000">
      {/* Background overlay that adapts to day/night */}
      <div
        className={`fixed inset-0 -z-10 transition-colors duration-1000 ${isNight ? "bg-black/20" : "bg-white/30 backdrop-blur-[2px]"}`}
      />

      <main className="relative z-10 container mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:py-12">
        {/* Header / Search */}
        <header className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-2xl border p-3 shadow-lg transition-colors ${isNight ? "border-white/20 bg-white/20" : "border-slate-200 bg-white/80"}`}>
              <Navigation
                className={`h-6 w-6 ${isNight ? "text-white" : "text-slate-900"}`}
              />
            </div>
            <div>
              <h1
                className={`text-2xl font-bold tracking-tight drop-shadow-sm ${textPrimary}`}>
                AeroWeather
              </h1>
              <p className={`text-sm font-medium ${textSecondary}`}>
                Ultra-Premium Forecast
              </p>
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

        {/* Dashboard Grid */}
        <AnimatePresence mode="wait">
          {weather && (
            <motion.div
              key={activeLocation.name}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Main Left Column (Hero + AI Insight + Hourly) */}
              <div className="flex flex-col gap-6 lg:col-span-8">
                <WeatherHero
                  weather={weather}
                  locationName={activeLocation.name}
                />
                <AiWeatherInsight weather={weather} />
                <HourlyForecast weather={weather} />
                <RadarMap
                  lat={activeLocation.lat}
                  lon={activeLocation.lon}
                  isNight={isNight}
                />
              </div>

              {/* Right Sidebar (10 Day + Extras) */}
              <div className="flex flex-col gap-6 lg:col-span-4">
                <DailyForecast weather={weather} />
                <SunArc weather={weather} />
                <AqiCard
                  aqiData={weather.airQuality}
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
