"use client";

import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/types/weather";
import { CloudRain, Droplets } from "lucide-react";
import { memo, useMemo } from "react";

interface RainTimelineCardProps {
  weather: WeatherData;
}

const RainTimelineCardComponent = ({ weather }: RainTimelineCardProps) => {
  const timeline = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const slots: {
      hour: string;
      probability: number;
      precipitation: number;
    }[] = [];

    for (let i = 0; i < 8; i++) {
      const idx = currentHour + i;
      if (idx >= weather.hourly.time.length) break;
      const h = new Date(weather.hourly.time[idx]);
      slots.push({
        hour: h
          .toLocaleTimeString([], { hour: "2-digit", hour12: true })
          .replace(/\s/g, ""),
        probability: weather.hourly.precipitationProbability[idx] ?? 0,
        precipitation: weather.hourly.precipitation[idx] ?? 0,
      });
    }
    return slots;
  }, [weather]);

  const maxPrecip = useMemo(
    () => Math.max(0.1, ...timeline.map((s) => s.precipitation)),
    [timeline],
  );

  const isRaining =
    weather.current.rain > 0 || weather.current.precipitation > 0;

  return (
    <GlassCard className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5">
      {/* Glow */}
      <div className="pointer-events-none absolute -top-8 -left-8 h-28 w-28 rounded-full bg-blue-500 opacity-10" />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <CloudRain className="h-5 w-5 text-blue-400/80" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Rain Forecast</h4>
            <p className="text-xs text-white/50">Next 8 hours</p>
          </div>
        </div>
        {isRaining && (
          <div className="flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1">
            <Droplets className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[11px] font-medium text-blue-400">
              Raining
            </span>
          </div>
        )}
      </div>

      {/* Bar chart */}
      <div
        className="flex items-end gap-1.5"
        style={{ height: "80px" }}>
        {timeline.map((slot, i) => {
          const barH = Math.max(6, (slot.precipitation / maxPrecip) * 100);
          const opacity = 0.3 + (slot.probability / 100) * 0.7;
          return (
            <div
              key={i}
              className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[9px] font-medium text-white/40">
                {slot.probability}%
              </span>
              <div className="relative w-full flex-1">
                <div
                  className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ height: `${barH}%`, opacity }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Time labels */}
      <div className="mt-2 flex gap-1.5">
        {timeline.map((slot, i) => (
          <div
            key={i}
            className="flex-1 text-center text-[9px] text-white/30">
            {slot.hour}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export const RainTimelineCard = memo(RainTimelineCardComponent);
RainTimelineCard.displayName = "RainTimelineCard";
