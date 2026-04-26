"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import React from "react";

import GlassCard from "@/components/ui/GlassCard";
import { getWeatherConditionKey, getWeatherIcon } from "@/lib/weather-theme";
import {
    formatWindKmh,
    getCurrentWindKmh,
    getForecastPeakWindKmh,
    roundWindKmh,
} from "@/lib/wind";
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
  const textPrimary = "text-white/95";
  const textTertiary = "text-white/70";
  const { t } = useLanguage();

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
    const visibilityKm = (() => {
      const startH = isForecast ? dayIndex * 24 : 0;
      // For current, we take current hour (approx index 0 for simple logic)
      // For forecast, we take the average of that day
      const count = isForecast ? 24 : 1;
      const slice = weather.hourly.visibility.slice(startH, startH + count);
      if (slice.length === 0) return "--";
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      return `${(avg / 1000).toFixed(1)} km`;
    })();

    return {
      weatherCode,
      temperature,
      isDay,
      conditionText: t(getWeatherConditionKey(weatherCode)),
      apparent,
      humidity,
      wind,
      visibilityKm,
    };
  }, [dayIndex, t, weather, windSourceKmh]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Wind Source:", roundWindKmh(model.wind));
    }
  }, [model.wind]);

  return (
    <GlassCard className="p-6" aria-label={`Weather summary for ${locationName}`}>
      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h2 className={`mb-1 text-3xl font-bold tracking-tight ${textPrimary}`}>
            {locationName}
          </h2>
          <div className={`mb-6 flex items-center gap-2 font-medium ${textTertiary}`}>
            <span className="text-lg">{model.conditionText}</span>
          </div>

          <div className="flex items-center gap-6">
            {React.createElement(getWeatherIcon(model.weatherCode, model.isDay), {
              className: "h-24 w-24 text-white",
            })}
            <div className={`text-8xl font-bold tracking-tighter ${textPrimary}`}>
              {model.temperature !== undefined && model.temperature !== null ? `${Math.round(model.temperature)}°` : "--"}
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
          <WeatherMetric
            icon={Thermometer}
            label={t("feelsLike")}
            value={showDetails && model.apparent !== undefined && model.apparent !== null ? `${Math.round(model.apparent)}°` : "--"}
          />
          <WeatherMetric
            icon={Droplets}
            label={t("humidity")}
            value={showDetails && model.humidity !== undefined && model.humidity !== null ? `${Math.round(model.humidity)}%` : "--"}
          />
          <WeatherMetric
            icon={Wind}
            label={t("wind")}
            value={showDetails && model.wind !== undefined && model.wind !== null ? formatWindKmh(model.wind) : "--"}
          />
          <WeatherMetric
            icon={Eye}
            label={t("visibility")}
            value={showDetails && model.visibilityKm !== undefined ? model.visibilityKm : "--"}
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
    <div 
      className="flex min-w-17.5 h-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 transition-all hover:bg-white/10"
      aria-label={`${label}: ${value}`}
    >
      <Icon className={`h-6 w-6 ${textMain}`} />
      <div className="mt-2 text-center">
        <p className={`mb-0.5 text-xs font-medium uppercase tracking-wider ${textSub}`}>
          {label}
        </p>
        <p className={`text-lg font-bold ${textMain}`}>{value}</p>
      </div>
    </div>
  );
});

WeatherMetric.displayName = "WeatherMetric";
