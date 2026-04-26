"use client";

import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/types/weather";
import { Thermometer } from "lucide-react";
import { memo, useMemo } from "react";

interface RealFeelCardProps {
  weather: WeatherData;
}

function getFeelDescription(diff: number): { label: string; tip: string } {
  if (diff <= -8) return { label: "Much Colder", tip: "Bundle up! Wind chill makes it dangerously cold." };
  if (diff <= -4) return { label: "Colder", tip: "Feels notably colder due to wind and humidity." };
  if (diff <= -1) return { label: "Slightly Cooler", tip: "A light jacket should be enough." };
  if (diff <= 1) return { label: "Accurate", tip: "Temperature matches how it feels." };
  if (diff <= 4) return { label: "Warmer", tip: "Humidity makes it feel warmer than shown." };
  if (diff <= 8) return { label: "Much Warmer", tip: "Stay hydrated—heat index is elevated." };
  return { label: "Extreme Heat", tip: "Dangerous conditions. Avoid prolonged exposure." };
}

function getTempColor(temp: number): string {
  if (temp <= 0) return "text-cyan-400";
  if (temp <= 10) return "text-blue-400";
  if (temp <= 20) return "text-emerald-400";
  if (temp <= 30) return "text-amber-400";
  if (temp <= 38) return "text-orange-400";
  return "text-red-400";
}

const RealFeelCardComponent = ({ weather }: RealFeelCardProps) => {
  const actual = Math.round(weather.current.temperature2m);
  const apparent = Math.round(weather.current.apparentTemperature);
  const diff = apparent - actual;
  const humidity = weather.current.relativeHumidity2m;

  const feel = useMemo(() => getFeelDescription(diff), [diff]);
  const tempColor = useMemo(() => getTempColor(apparent), [apparent]);

  // Gauge arc: map apparent from -20..50 to 0..100%
  const pct = Math.min(100, Math.max(0, ((apparent + 20) / 70) * 100));

  return (
    <GlassCard className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
      {/* Glow */}
      <div className="pointer-events-none absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-orange-500 opacity-[0.08] blur-3xl transition-opacity group-hover:opacity-[0.15]" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Thermometer className="h-5 w-5 text-white/70" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Real Feel</h4>
            <p className="text-xs text-white/50">{feel.label}</p>
          </div>
        </div>

        <div className="text-right">
          <span className={`text-3xl font-bold ${tempColor}`}>{apparent}°</span>
          <p className="text-[11px] text-white/40">Actual {actual}°C</p>
        </div>
      </div>

      {/* Temperature gauge */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 via-amber-400 to-red-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/25">
          <span>-20°</span>
          <span>0°</span>
          <span>25°</span>
          <span>50°</span>
        </div>
      </div>

      {/* Info row */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
          <span className="text-[10px] text-white/50">Humidity</span>
          <p className="text-sm font-semibold text-white">{humidity}%</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
          <span className="text-[10px] text-white/50">Difference</span>
          <p className="text-sm font-semibold text-white">{diff > 0 ? "+" : ""}{diff}°C</p>
        </div>
      </div>

      {/* Tip */}
      <p className="mt-3 text-[11px] leading-relaxed text-white/40">{feel.tip}</p>
    </GlassCard>
  );
};

export const RealFeelCard = memo(RealFeelCardComponent);
RealFeelCard.displayName = "RealFeelCard";
