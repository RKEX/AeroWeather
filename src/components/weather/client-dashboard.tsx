"use client";

import { memo, useEffect, useState } from "react";
import { LocationSearch } from "@/components/weather/location-search";
import { useWeather } from "@/hooks/useWeather";
import { LocationResult, WeatherData } from "@/types/weather";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { usePerformance } from "@/components/Providers/performance-provider";

const RadarMap = dynamic(() => import("@/components/weather/radar-map").then(mod => mod.RadarMap), { 
  ssr: false,
  loading: () => <div className="h-105 w-full animate-pulse bg-white/10 rounded-3xl border border-white/10" />
});
const HourlyForecast = dynamic(() => import("@/components/weather/hourly-forecast").then(mod => mod.HourlyForecast), { 
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse bg-white/10 rounded-3xl border border-white/10" />
});
const AiWeatherInsight = dynamic(() => import("@/components/weather/ai-weather-insight").then(mod => mod.AiWeatherInsight), { 
  ssr: false,
  loading: () => <div className="h-32 w-full animate-pulse bg-white/10 rounded-3xl border border-white/10" />
});
const DailyForecast = dynamic(() => import("@/components/weather/daily-forecast").then(mod => mod.DailyForecast), { 
  ssr: false,
  loading: () => <div className="h-125 w-full animate-pulse bg-white/10 rounded-3xl border border-white/10" />
});
const AqiCard = dynamic(() => import("@/components/weather/aqi-card").then(mod => mod.AqiCard), { 
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse bg-white/10 rounded-3xl border border-white/10" />
});
const SunArc = dynamic(() => import("@/components/weather/sun-arc").then(mod => mod.SunArc), { 
  ssr: false,
  loading: () => <div className="h-48 w-full animate-pulse bg-white/10 rounded-3xl border border-white/10" />
});

const WeatherHero = dynamic(() => import("@/components/weather/weather-hero").then(mod => mod.WeatherHero), { 
  ssr: true,
  loading: () => <div className="h-64 w-full animate-pulse bg-white/10 rounded-3xl border border-white/10" />
});

function ClientDashboard({
  initialWeather,
  initialLocation,
}: {
  initialWeather: WeatherData | null;
  initialLocation: { lat: number; lon: number; name: string };
}) {
  const [activeLocation, setActiveLocation] = useState(initialLocation);
  const [hasMounted, setHasMounted] = useState(false);
  const { tier } = usePerformance();
  const isLowEnd = tier === "LOW";

  useEffect(() => {
    setHasMounted(true);
    const saved = localStorage.getItem("aeroweather_location");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lat !== activeLocation.lat || parsed.lon !== activeLocation.lon) {
          setActiveLocation(parsed);
        }
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
        staggerChildren: isLowEnd ? 0.05 : 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: isLowEnd ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "none",
      transition: { 
        duration: isLowEnd ? 0.2 : 0.45, 
        ease: [0.22, 1, 0.36, 1] 
      },
    },
  };

  return (
    <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-1000 ${isLowEnd ? 'performance-low' : ''}`}>


      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 container mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:py-12 gpu-accel">
        <motion.header 
          variants={itemVariants}
          className="relative z-50 flex w-full flex-col items-center justify-between gap-6 md:flex-row">
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

export default memo(ClientDashboard);
