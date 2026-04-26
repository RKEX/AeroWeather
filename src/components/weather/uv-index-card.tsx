"use client";

import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/types/weather";
import { Sun } from "lucide-react";
import { memo, useMemo } from "react";

interface UVIndexCardProps {
  weather: WeatherData;
}

function getUVLevel(uv: number) {
  if (uv <= 2)
    return { label: "Low", color: "text-green-400", bg: "bg-green-400", tip: "Safe for outdoor activities." };
  if (uv <= 5)
    return { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-400", tip: "Wear sunscreen if outside for extended periods." };
  if (uv <= 7)
    return { label: "High", color: "text-orange-400", bg: "bg-orange-400", tip: "Protection essential. Reduce sun exposure 10AM–4PM." };
  if (uv <= 10)
    return { label: "Very High", color: "text-red-400", bg: "bg-red-400", tip: "Extra precautions needed. Avoid midday sun." };
  return { label: "Extreme", color: "text-purple-400", bg: "bg-purple-400", tip: "Stay indoors during peak hours. Burns in minutes." };
}

const UVIndexCardComponent = ({ weather }: UVIndexCardProps) => {
  // Current hour UV from hourly data
  const currentUV = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    return weather.hourly.uvIndex[currentHour] ?? 0;
  }, [weather]);

  const maxUV = weather.daily.uvIndexMax?.[0] ?? currentUV;
  const level = useMemo(() => getUVLevel(currentUV), [currentUV]);

  // Arc gauge: 0..11+ mapped to degrees
  const arcDeg = Math.min(180, (currentUV / 11) * 180);

  return (
    <GlassCard className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
      {/* Glow */}
      <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-yellow-400 opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-[0.15]" />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Sun className="h-5 w-5 text-yellow-400/80" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">UV Index</h4>
            <p className={`text-xs font-medium ${level.color}`}>{level.label}</p>
          </div>
        </div>
        <span className={`text-3xl font-bold ${level.color}`}>
          {currentUV.toFixed(1)}
        </span>
      </div>

      {/* Semi-circle gauge */}
      <div className="relative mx-auto flex h-[72px] w-[144px] items-end justify-center overflow-hidden">
        <svg viewBox="0 0 144 72" className="absolute inset-0 h-full w-full">
          {/* Track */}
          <path
            d="M 8 68 A 60 60 0 0 1 136 68"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d="M 8 68 A 60 60 0 0 1 136 68"
            fill="none"
            stroke="url(#uvGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(arcDeg / 180) * 188.5} 188.5`}
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id="uvGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="33%" stopColor="#facc15" />
              <stop offset="66%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center label */}
        <div className="relative z-10 mb-1 flex flex-col items-center">
          <span className="text-[10px] text-white/30">of 11+</span>
        </div>
      </div>

      {/* Info row */}
      <div className="mt-3 flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2">
        <div>
          <span className="text-[10px] text-white/50">Today&apos;s Peak</span>
          <p className="text-sm font-semibold text-white">{maxUV.toFixed(1)}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-white/50">Protection</span>
          <p className="text-sm font-semibold text-white">
            {currentUV >= 3 ? "Required" : "Optional"}
          </p>
        </div>
      </div>

      {/* Tip */}
      <p className="mt-3 text-[11px] leading-relaxed text-white/40">{level.tip}</p>
    </GlassCard>
  );
};

export const UVIndexCard = memo(UVIndexCardComponent);
UVIndexCard.displayName = "UVIndexCard";
