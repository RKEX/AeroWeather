"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { getWeatherIcon } from "@/lib/weather-theme";
import { WeatherData } from "@/types/weather";
import { format } from "date-fns";
import { Droplets } from "lucide-react";
import dynamic from "next/dynamic";
import { memo } from "react";

const HourlyChart = dynamic(
  () => import("@/components/weather/hourly-chart").then((mod) => mod.HourlyChart),
  {
    ssr: false,
  },
);

/* ---------- Props ---------- */

interface HourlyForecastProps {
  weather: WeatherData;
  dayIndex?: number;
}

/* ---------- Main Component ---------- */

const HourlyForecastComponent = ({
  weather,
  dayIndex = -1,
}: HourlyForecastProps) => {
  const textPrimary = "text-white";
  const textSecondary = "text-white/80";

  const isForecast = dayIndex >= 0;

  let startIndex: number;
  let endIndex: number;

  if (isForecast) {
    startIndex = dayIndex * 24;
    endIndex = startIndex + 24;
  } else {
    const nowIndex = weather.hourly.time.findIndex(
      (t) => new Date(t) > new Date(),
    );
    startIndex = Math.max(0, nowIndex - 1);
    endIndex = startIndex + 24;
  }

  const data = weather.hourly.time
    .slice(startIndex, endIndex)
    .map((time, idx) => {
      const globalIdx = startIndex + idx;

      return {
        time: format(new Date(time), "ha"),
        temp: Math.round(weather.hourly.temperature2m[globalIdx]),
        precip: weather.hourly.precipitationProbability[globalIdx],
        wind: Math.round(weather.hourly.windSpeed10m[globalIdx]),
        code: weather.hourly.weatherCode[globalIdx],
        rawTime: time,
      };
    });

  return (
    <GlassCard className="w-full p-6">
      <h3 className={`mb-6 text-xl font-medium drop-shadow-sm ${textPrimary}`}>
        Hourly Forecast
      </h3>

      {/* Timeline cards */}
      <div className="glass-scroll mb-6 flex gap-4 overflow-x-auto pb-4">
        {data.slice(0, 12).map((hour, i) => {
          const Icon = getWeatherIcon(hour.code, true);
          const itemBg =
            "bg-white/10 border-white/15 hover:bg-white/20 shadow-lg";

          return (
            <div
              key={i}
              className={`flex min-w-17.5 flex-col items-center justify-center rounded-2xl border p-3 transition-colors ${itemBg}`}>
              <span className={`mb-2 text-sm ${textSecondary}`}>
                {i === 0 ? "Now" : hour.time}
              </span>

              <Icon className={`mb-2 h-6 w-6 shadow-sm ${textPrimary}`} />

              <span className={`font-medium ${textPrimary}`}>{hour.temp}°</span>

              {hour.precip > 0 && (
                <span className="mt-1 flex items-center text-[10px] font-semibold text-blue-500">
                  <Droplets className="mr-0.5 h-2 w-2" />
                  {hour.precip}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 w-full">
        <HourlyChart data={data} />
      </div>
    </GlassCard>
  );
};

export const HourlyForecast = memo(HourlyForecastComponent);
HourlyForecast.displayName = "HourlyForecast";
