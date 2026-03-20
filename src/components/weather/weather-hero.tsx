"use client";

import React from "react";

import { WeatherData } from "@/types/weather";
import { getWeatherIcon, getWeatherConditionText } from "@/lib/weather-theme";
import { Wind, Droplets, Eye, Thermometer } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface WeatherHeroProps {
  weather: WeatherData;
  locationName: string;
  dayIndex?: number;
}

export function WeatherHero({ weather, locationName, dayIndex = -1 }: WeatherHeroProps) {
  const isForecast = dayIndex >= 0;
  const current = weather.current;
  const daily = weather.daily;
  
  const weatherCode = isForecast ? daily.weatherCode[dayIndex] : current.weatherCode;
  const temperature = isForecast ? daily.temperature2mMax[dayIndex] : current.temperature2m;
  const isDay = isForecast ? 1 : current.isDay; // Assume day icon for forecast days
  
  const conditionText = getWeatherConditionText(weatherCode);
  const textPrimary = "text-white";
  const textTertiary = "text-white/60";

  // Daily aggregates for metrics if forecast
  const humidity = isForecast ? 
    Math.round(weather.hourly.relativeHumidity2m.slice(dayIndex * 24, (dayIndex + 1) * 24).reduce((a, b) => a + b, 0) / 24) : 
    current.relativeHumidity2m;
  
  // For forecast mode, compute max wind speed from the hourly data slice for that day
  const wind = isForecast
    ? (() => {
        const startH = dayIndex * 24;
        const slice = weather.hourly.windSpeed10m.slice(startH, startH + 24);
        return slice.length > 0 ? Math.round(Math.max(...slice)) : 0;
      })()
    : current.windSpeed10m;

  const apparent = isForecast ? temperature : current.apparentTemperature;

  return (
    <GlassCard 
      className="p-8"
    >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className={`text-3xl font-medium tracking-tight mb-1 drop-shadow-sm ${textPrimary}`}>{locationName}</h2>
                <div className={`flex items-center gap-2 mb-6 font-medium drop-shadow-sm ${textTertiary}`}>
                    <span className="text-lg">{conditionText}</span>
                </div>

                <div className="flex items-center gap-6">
                    {React.createElement(getWeatherIcon(weatherCode, isDay), { 
                        className: "w-24 h-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] text-white" 
                    })}
                    <div className={`text-8xl font-light tracking-tighter drop-shadow-xl ${textPrimary}`}>
                        {Math.round(temperature)}&deg;
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <WeatherMetric icon={Thermometer} label="Feels Like" value={`${Math.round(apparent)}°`} />
                <WeatherMetric icon={Droplets} label="Humidity" value={`${Math.round(humidity)}%`} />
                <WeatherMetric icon={Wind} label="Wind" value={`${wind} km/h`} />
                <WeatherMetric icon={Eye} label="Visibility" value={!isForecast && weather.hourly?.visibility?.[0] ? `${(weather.hourly.visibility[0] / 1000).toFixed(1)} km` : 'Forecast'} />
            </div>
        </div>
    </GlassCard>
  );
}

function WeatherMetric({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) {
    const textMain = "text-white";
    const textSub = "text-white/60";

    return (
        <div className="flex min-w-17.5 flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3 transition-all hover:bg-white/20 shadow-lg backdrop-blur-2xl">
            <Icon className={`w-6 h-6 drop-shadow-md ${textMain}`} />
            <div className="text-center mt-2">
                <p className={`text-xs mb-0.5 font-medium uppercase tracking-wider ${textSub}`}>{label}</p>
                <p className={`font-bold text-lg drop-shadow-md ${textMain}`}>{value}</p>
            </div>
        </div>
    )
}
