"use client";

import { WeatherData } from "@/types/weather";
import { format } from "date-fns";
import { getWeatherIcon } from "@/lib/weather-theme";
import { getDaySlug } from "@/lib/day-slug";
import { Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { ElementType } from "react";
import Link from "next/link";

/* ─────────── Types ─────────── */

interface DailyForecastProps {
  weather: WeatherData;
}

/* ─────────── Helpers ─────────── */

function tempColor(temp: number): string {
  if (temp < 15) return "text-blue-300";
  if (temp > 30) return "text-orange-300";
  return "text-white";
}

export function DetailMetric({
  icon: Icon,
  label,
  value,
}: {
  icon?: ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
      {Icon && <Icon className="h-5 w-5 shrink-0 text-white/60" />}
      <div className="min-w-0">
        <p className="mb-0.5 truncate text-[10px] uppercase tracking-widest text-white/50">
          {label}
        </p>
        <p className="text-lg font-semibold leading-none">{value}</p>
      </div>
    </div>
  );
}

/* ─────────── Main Component ─────────── */

export function DailyForecast({ weather }: DailyForecastProps) {
  const isNight = weather.current.isDay === 0;
  const textPrimary = isNight ? "text-white" : "text-slate-900";
  const textSecondary = isNight ? "text-white/70" : "text-slate-700";
  const glassCard = isNight
    ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl"
    : "bg-white/70 backdrop-blur-xl border border-slate-200 text-slate-900 shadow-lg";

  const daily = weather.daily;
  const hourly = weather.hourly;

  /* aggregate hourly data per day */
  const getAggregates = (dayIdx: number) => {
    const start = dayIdx * 24;
    const humSlice = hourly.relativeHumidity2m.slice(start, start + 24);
    const windSlice = hourly.windSpeed10m.slice(start, start + 24);
    const avgHumidity =
      humSlice.length > 0
        ? Math.round(humSlice.reduce((a, b) => a + b, 0) / humSlice.length)
        : 0;
    const maxWind =
      windSlice.length > 0 ? Math.round(Math.max(...windSlice)) : 0;
    return { avgHumidity, maxWind };
  };

  /* build 7-day array starting tomorrow (index 1) */
  const forecastDays = daily.time.slice(1, 8).map((time, i) => {
    const globalIdx = i + 1;
    const aggs = getAggregates(globalIdx);
    const date = new Date(time + "T00:00:00");
    return {
      date,
      slug: getDaySlug(date),
      maxTemp: Math.round(daily.temperature2mMax[globalIdx]),
      minTemp: Math.round(daily.temperature2mMin[globalIdx]),
      code: daily.weatherCode[globalIdx],
      precipProb: daily.precipitationProbabilityMax[globalIdx] ?? 0,
      sunrise: daily.sunrise?.[globalIdx],
      sunset: daily.sunset?.[globalIdx],
      uvIndexMax: daily.uvIndexMax?.[globalIdx]
        ? Math.round(daily.uvIndexMax[globalIdx])
        : 0,
      avgHumidity: aggs.avgHumidity,
      maxWind: aggs.maxWind,
    };
  });

  return (
    <div className={`flex w-full flex-col gap-3 rounded-3xl p-6 backdrop-blur-xl ${glassCard}`}>
      <h3 className={`mb-2 text-xl font-semibold tracking-tight drop-shadow-sm ${textPrimary}`}>7-Day Forecast</h3>

      <div className="flex flex-col gap-2">
        {forecastDays.map((day, i) => {
          const Icon = getWeatherIcon(day.code, true);
          const label = i === 0 ? "Tomorrow" : format(day.date, "EEE, MMM d");
          const itemBg = isNight ? "bg-white/5 border-transparent hover:bg-white/10" : "bg-black/5 border-transparent hover:bg-black/10";

          return (
            <Link key={i} href={`/weather/${day.slug}`} className="outline-none">
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors hover:border-indigo-400/40 hover:shadow-md hover:shadow-indigo-500/10 ${itemBg}`}
              >
                {/* Day label */}
                <span className={`w-28 shrink-0 text-sm font-medium ${textSecondary}`}>{label}</span>

                {/* Icon + precip */}
                <div className="flex flex-1 items-center justify-center gap-1.5">
                  <Icon className={`h-5 w-5 ${textPrimary}`} />
                  {day.precipProb > 5 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-blue-500 font-bold">
                      <Droplets className="h-2.5 w-2.5" />
                      {day.precipProb}%
                    </span>
                  )}
                </div>

                {/* High / Low */}
                <div className="flex gap-2 font-semibold">
                  <span className={tempColor(day.maxTemp)}>{day.maxTemp}°</span>
                  <span className={`${isNight ? 'text-white/40' : 'text-slate-400'}`}>{day.minTemp}°</span>
                </div>

                {/* Chevron hint */}
                <svg className={`h-4 w-4 shrink-0 ${isNight ? 'text-white/30' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Re-export helpers so the day detail page can reuse them
export { tempColor };
export { DetailMetric as _DetailMetric };
