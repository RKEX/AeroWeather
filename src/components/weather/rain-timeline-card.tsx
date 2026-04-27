"use client";

import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/types/weather";
import { motion } from "framer-motion";
import { Activity, CloudRain, Droplets } from "lucide-react";
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

  const isRaining =
    weather.current.rain > 0 || weather.current.precipitation > 0;

  const intensityLabel = useMemo(() => {
    const maxProb = Math.max(...timeline.map((s) => s.probability));
    if (maxProb < 15) return "No rain expected. Clear skies ahead.";
    if (maxProb <= 40) return "Low chance of rain. Slight clouds possible.";
    if (maxProb <= 70) return "Rain likely in some hours. Stay prepared.";
    return "High chance of rain. Carry protection.";
  }, [timeline]);

  return (
    <GlassCard className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 p-5 shadow-[0_0_30px_rgba(56,189,248,0.15)] transition-all md:p-6">
      {/* Animated Rain Lines Effect */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
        <div
          className="animate-rain-line absolute top-0 left-[10%] h-10 w-[1px] bg-white"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="animate-rain-line absolute top-0 left-[30%] h-12 w-[1px] bg-white"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="animate-rain-line absolute top-0 left-[50%] h-8 w-[1px] bg-white"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="animate-rain-line absolute top-0 left-[70%] h-14 w-[1px] bg-white"
          style={{ animationDelay: "0.8s" }}
        />
        <div
          className="animate-rain-line absolute top-0 left-[90%] h-10 w-[1px] bg-white"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner">
            <CloudRain className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight text-white uppercase opacity-90">
              Rain Forecast
            </h4>
            <p className="text-[10px] font-medium text-white/50">
              Next 8 hours • Hourly
            </p>
          </div>
        </div>

        <div className="flex animate-pulse items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1">
          <Activity className="h-3 w-3 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-tighter text-cyan-400 uppercase">
            Real-time
          </span>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="relative mb-6 flex h-20 w-full items-end justify-between overflow-hidden px-1">
        {timeline.map((slot, i) => {
          const opacity = 0.3 + (slot.probability / 100) * 0.7;
          return (
            <div
              key={i}
              className="group/bar flex h-full flex-col items-center justify-end gap-2">
              <div className="relative flex w-6 flex-1 items-end overflow-hidden rounded-full bg-white/5">
                {/* The animated probability bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(10, slot.probability)}%` }}
                  transition={{
                    duration: 1,
                    delay: i * 0.08,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="relative z-10 w-full rounded-t-full bg-gradient-to-t from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                  style={{ opacity }}
                />
              </div>
              <span className="text-[9px] font-bold tracking-tighter text-white/30 uppercase transition-colors group-hover/bar:text-white/60">
                {slot.hour}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rain Intensity Label */}
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10">
          <Droplets
            className={`h-3.5 w-3.5 ${isRaining ? "animate-bounce text-blue-400" : "text-white/30"}`}
          />
        </div>
        <p className="text-[11px] font-semibold tracking-tight text-white/80">
          {intensityLabel}
        </p>
      </div>
    </GlassCard>
  );
};

export const RainTimelineCard = memo(RainTimelineCardComponent);
RainTimelineCard.displayName = "RainTimelineCard";
