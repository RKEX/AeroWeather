"use client";

import { LocationSearch } from "@/components/weather/location-search";
import { WeatherHero } from "@/components/weather/weather-hero";
import { useWeather } from "@/hooks/useWeather";
import { LocationResult, WeatherData } from "@/types/weather";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RadarMap = dynamic(() => import("@/components/weather/radar-map").then(mod => mod.RadarMap), { ssr: false });
const HourlyForecast = dynamic(() => import("@/components/weather/hourly-forecast").then(mod => mod.HourlyForecast), { ssr: false });
const AiWeatherInsight = dynamic(() => import("@/components/weather/ai-weather-insight").then(mod => mod.AiWeatherInsight), { ssr: false });
const DailyForecast = dynamic(() => import("@/components/weather/daily-forecast").then(mod => mod.DailyForecast), { ssr: false });
const AqiCard = dynamic(() => import("@/components/weather/aqi-card").then(mod => mod.AqiCard), { ssr: false });
const SunArc = dynamic(() => import("@/components/weather/sun-arc").then(mod => mod.SunArc), { ssr: false });

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.96, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.45, 
        ease: [0.22, 1, 0.36, 1] 
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden transition-colors duration-1000">
      {/* Background glows matching DayDetailPage but with increased depth */}
      <div className="pointer-events-none fixed top-1/4 left-1/4 h-[50vw] w-[50vw] rounded-full bg-white/10 mix-blend-overlay blur-[150px] opacity-40" />
      <div className="pointer-events-none fixed right-1/4 bottom-1/4 h-[40vw] w-[40vw] rounded-full bg-white/5 mix-blend-overlay blur-[120px] opacity-30" />

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 container mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:py-12">
        <motion.header 
          variants={itemVariants}
          className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
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
        </motion.header>

        {error && !displayWeather && (
          <motion.div 
            variants={itemVariants}
            className="rounded-xl border border-red-500/50 bg-red-500/20 p-4 text-center text-white">
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {displayWeather && (
            <motion.div
              key={currentCity}
              variants={itemVariants}
              className="grid grid-cols-1 gap-6 lg:grid-cols-12 will-change-[transform,opacity]">
              <div className="flex flex-col gap-6 lg:col-span-8">
                <motion.div variants={itemVariants}>
                  <WeatherHero
                    weather={displayWeather}
                    locationName={currentCity}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AiWeatherInsight weather={displayWeather} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <HourlyForecast weather={displayWeather} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <RadarMap
                    lat={hasMounted ? activeLocation.lat : initialLocation.lat}
                    lon={hasMounted ? activeLocation.lon : initialLocation.lon}
                    isNight={isNight}
                  />
                </motion.div>
              </div>
              <div className="flex flex-col gap-6 lg:col-span-4">
                <motion.div variants={itemVariants}>
                  <DailyForecast weather={displayWeather} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SunArc weather={displayWeather} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AqiCard
                    aqiData={displayWeather.airQuality}
                    isNight={isNight}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
