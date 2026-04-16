"use client";

import React from "react";

import { GlassCard } from "@/components/ui/glass-card";
import {
  formatWindKmh,
  getCurrentWindKmh,
  getForecastPeakWindKmh,
  roundWindKmh,
} from "@/lib/wind";
import { getWeatherConditionText, getWeatherIcon } from "@/lib/weather-theme";
import { WeatherData } from "@/types/weather";
import { Droplets, Eye, Thermometer, Wind } from "lucide-react";
import { memo, useEffect, useMemo } from "react";

interface WeatherHeroProps {
  weather: WeatherData;
  locationName: string;
  dayIndex?: number;
  showDetails?: boolean;
  windSourceKmh?: number;
}

export const WeatherHero = memo(function WeatherHero({
  weather,
  locationName,
  dayIndex = -1,
  showDetails = true,
  windSourceKmh,
}: WeatherHeroProps) {
  const textPrimary = "text-white";
  const textTertiary = "text-white/60";

  const model = useMemo(() => {
    const isForecast = dayIndex >= 0;
    const current = weather.current;
    const daily = weather.daily;
    const currentWind = windSourceKmh ?? getCurrentWindKmh(weather);

    const weatherCode = isForecast
      ? (daily.weatherCode[dayIndex] ?? current.weatherCode)
      : current.weatherCode;
    const temperature = isForecast
      ? (daily.temperature2mMax[dayIndex] ?? current.temperature2m)
      : current.temperature2m;
    const isDay = isForecast ? 1 : current.isDay;

    const humidity = isForecast
      ? (() => {
          const startH = dayIndex * 24;
          const slice = weather.hourly.relativeHumidity2m.slice(startH, startH + 24);
          if (slice.length === 0) return current.relativeHumidity2m;
          return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
        })()
      : current.relativeHumidity2m;

    const wind = isForecast
      ? getForecastPeakWindKmh(weather, dayIndex)
      : currentWind;

    const apparent = isForecast ? temperature : current.apparentTemperature;
    const visibilityKm =
      !isForecast && weather.hourly?.visibility?.[0]
        ? `${(weather.hourly.visibility[0] / 1000).toFixed(1)} km`
        : "Forecast";

    return {
      weatherCode,
      temperature,
      isDay,
      conditionText: getWeatherConditionText(weatherCode),
      apparent,
      humidity,
      wind,
      visibilityKm,
    };
  }, [dayIndex, weather, windSourceKmh]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Wind Source:", roundWindKmh(model.wind));
    }
  }, [model.wind]);

  return (
    <GlassCard className="p-8">
      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h2 className={`mb-1 text-3xl font-medium tracking-tight drop-shadow-sm ${textPrimary}`}>
            {locationName}
          </h2>
          <div className={`mb-6 flex items-center gap-2 font-medium drop-shadow-sm ${textTertiary}`}>
            <span className="text-lg">{model.conditionText}</span>
          </div>

          <div className="flex items-center gap-6">
            {React.createElement(getWeatherIcon(model.weatherCode, model.isDay), {
              className: "h-24 w-24 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]",
            })}
            <div className={`text-8xl font-light tracking-tighter drop-shadow-xl ${textPrimary}`}>
              {Math.round(model.temperature)}&deg;
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
          <WeatherMetric
            icon={Thermometer}
            label="Feels Like"
            value={showDetails ? `${Math.round(model.apparent)}°` : "--"}
          />
          <WeatherMetric
            icon={Droplets}
            label="Humidity"
            value={showDetails ? `${Math.round(model.humidity)}%` : "--"}
          />
          <WeatherMetric
            icon={Wind}
            label="Wind"
            value={showDetails ? formatWindKmh(model.wind) : "--"}
          />
          <WeatherMetric
            icon={Eye}
            label="Visibility"
            value={showDetails ? model.visibilityKm : "--"}
          />
        </div>
      </div>
    </GlassCard>
  );
});

WeatherHero.displayName = "WeatherHero";

const WeatherMetric = memo(function WeatherMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
    const textMain = "text-white";
    const textSub = "text-white/60";

    return (
    <div className="flex min-w-17.5 flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3 shadow-lg transition-all hover:bg-white/20">
      <Icon className={`h-6 w-6 drop-shadow-md ${textMain}`} />
      <div className="mt-2 text-center">
        <p className={`mb-0.5 text-xs font-medium uppercase tracking-wider ${textSub}`}>
          {label}
        </p>
        <p className={`text-lg font-bold drop-shadow-md ${textMain}`}>{value}</p>
      </div>
    </div>
  );
});

WeatherMetric.displayName = "WeatherMetric";
