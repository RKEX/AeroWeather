"use client";

import { WeatherData } from "@/types/weather";
import { getWeatherIcon, getWeatherConditionText } from "@/lib/weather-theme";
import { Wind, Droplets, Eye, Thermometer, Info } from "lucide-react";
import { generateWeatherInsight } from "@/lib/ai-insight";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface WeatherHeroProps {
  weather: WeatherData;
  locationName: string;
}

export function WeatherHero({ weather, locationName }: WeatherHeroProps) {
  const current = weather.current;
  const conditionText = getWeatherConditionText(current.weatherCode);
  const WeatherIcon = useMemo(() => getWeatherIcon(current.weatherCode, current.isDay), [current.weatherCode, current.isDay]);

  const isNight = current.isDay === 0;
  const textPrimary = isNight ? "text-white" : "text-slate-900";
  const textSecondary = isNight ? "text-white/70" : "text-slate-700";
  const glassCard = isNight
    ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl"
    : "bg-white/70 backdrop-blur-xl border border-slate-200 text-slate-900 shadow-lg";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative w-full rounded-3xl overflow-hidden p-8 ${glassCard}`}
    >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className={`text-3xl font-medium tracking-tight mb-1 drop-shadow-sm ${textPrimary}`}>{locationName}</h2>
                <div className={`flex items-center gap-2 mb-6 font-medium drop-shadow-sm ${textSecondary}`}>
                    <span className="text-lg">{conditionText}</span>
                </div>

                <div className="flex items-center gap-6">
                    <WeatherIcon className={`w-24 h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] ${isNight ? "text-white" : "text-slate-900"}`} />
                    <div className={`text-8xl font-light tracking-tighter drop-shadow-xl ${textPrimary}`}>
                        {Math.round(current.temperature2m)}&deg;
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <WeatherMetric icon={Thermometer} label="Feels Like" value={`${Math.round(current.apparentTemperature)}°`} isNight={isNight} />
                <WeatherMetric icon={Droplets} label="Humidity" value={`${Math.round(current.relativeHumidity2m)}%`} isNight={isNight} />
                <WeatherMetric icon={Wind} label="Wind" value={`${Math.round(current.windSpeed10m)} km/h`} isNight={isNight} />
                <WeatherMetric icon={Eye} label="Visibility" value={weather.hourly?.visibility?.[0] ? `${(weather.hourly.visibility[0] / 1000).toFixed(1)} km` : 'N/A'} isNight={isNight} />
            </div>
        </div>
    </motion.div>
  );
}

function WeatherMetric({ icon: Icon, label, value, isNight }: { icon: React.ElementType, label: string, value: string | number, isNight: boolean }) {
    const metricGlass = isNight 
        ? "bg-white/10 border-white/10 hover:bg-white/20" 
        : "bg-black/5 border-black/5 hover:bg-black/10";
    const textMain = isNight ? "text-white" : "text-slate-900";
    const textSub = isNight ? "text-white/60" : "text-slate-600";

    return (
        <div className={`flex min-w-17.5 flex-col items-center justify-center rounded-2xl border p-3 transition-colors backdrop-blur-md ${metricGlass}`}>
            <Icon className={`w-6 h-6 drop-shadow-sm ${textMain}`} />
            <div className="text-center mt-2">
                <p className={`text-xs mb-0.5 font-medium uppercase tracking-wider ${textSub}`}>{label}</p>
                <p className={`font-bold text-lg drop-shadow-sm ${textMain}`}>{value}</p>
            </div>
        </div>
    )
}
