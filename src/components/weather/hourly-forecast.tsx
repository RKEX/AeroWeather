"use client";

import { getWeatherIcon } from "@/lib/weather-theme";
import { WeatherData } from "@/types/weather";
import { format } from "date-fns";
import { Droplets } from "lucide-react";
import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { memo } from "react";

/* ---------- Custom Tooltip ---------- */

const CustomTooltip = memo(({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-white/20 bg-white/10 p-3 text-white shadow-xl backdrop-blur-md dark:bg-black/60">
      <p className="border-b border-white/20 pb-1 text-sm font-medium">
        {label}
      </p>

      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
        <p className="text-sm">{payload[0]?.value}°C</p>
      </div>

      {payload[1] && (
        <div className="flex items-center gap-2">
          <Droplets className="h-3 w-3 text-blue-400" />
          <p className="text-sm text-blue-200">{payload[1]?.value}% rain</p>
        </div>
      )}
    </div>
  );
});
CustomTooltip.displayName = "CustomTooltip";

/* ---------- Props ---------- */

interface HourlyForecastProps {
  weather: WeatherData;
  dayIndex?: number;
}

/* ---------- Main Component ---------- */

const HourlyForecastComponent = ({ weather, dayIndex = -1 }: HourlyForecastProps) => {
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
      <div
        className="glass-scroll mb-6 flex gap-4 overflow-x-auto pb-4"
        data-lenis-prevent>
        {data.slice(0, 12).map((hour, i) => {
          const Icon = getWeatherIcon(hour.code, true);
          const itemBg = "bg-white/10 border-white/15 hover:bg-white/20 shadow-lg backdrop-blur-2xl";

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

      {/* Chart */}
      <div className="mt-4 h-62.5 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient
                id="colorTemp"
                x1="0"
                y1="0"
                x2="0"
                y2="1">
                <stop
                  offset="5%"
                  stopColor="#eab308"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="#eab308"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />

            <YAxis
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}°`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.2)" }}
            />

            <Area
              type="monotone"
              dataKey="temp"
              stroke="#facc15"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTemp)"
              activeDot={{
                r: 6,
                fill: "#facc15",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />

            <Line
              type="monotone"
              dataKey="precip"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
              name="Rain %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};

export const HourlyForecast = memo(HourlyForecastComponent);
HourlyForecast.displayName = "HourlyForecast";
