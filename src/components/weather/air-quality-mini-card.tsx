"use client";

import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/types/weather";
import { Wind } from "lucide-react";
import { memo, useMemo } from "react";

interface AirQualityMiniCardProps {
  aqiData?: WeatherData["airQuality"];
}

function getAqiLevel(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "text-green-400", bg: "bg-green-400", ring: "ring-green-400/30", emoji: "😊" };
  if (aqi <= 100) return { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-400", ring: "ring-yellow-400/30", emoji: "😐" };
  if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "text-orange-400", bg: "bg-orange-400", ring: "ring-orange-400/30", emoji: "😷" };
  if (aqi <= 200) return { label: "Unhealthy", color: "text-red-400", bg: "bg-red-400", ring: "ring-red-400/30", emoji: "🤢" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "text-purple-400", bg: "bg-purple-400", ring: "ring-purple-400/30", emoji: "💀" };
  return { label: "Hazardous", color: "text-rose-500", bg: "bg-rose-500", ring: "ring-rose-500/30", emoji: "☠️" };
}

const AirQualityMiniCardComponent = ({ aqiData }: AirQualityMiniCardProps) => {
  const aqi = aqiData?.usAqi ?? 0;
  const level = useMemo(() => getAqiLevel(aqi), [aqi]);
  const pct = Math.min(100, (aqi / 300) * 100);

  if (!aqiData) return null;

  return (
    <GlassCard className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] hover:shadow-xl">
      {/* Glow accent */}
      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full ${level.bg} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 ring-2 ${level.ring}`}>
            <Wind className="h-5 w-5 text-white/70" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Air Quality</h4>
            <p className={`text-xs font-medium ${level.color}`}>{level.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{level.emoji}</span>
          <span className={`text-2xl font-bold ${level.color}`}>{aqi}</span>
        </div>
      </div>

      {/* Mini scale bar */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full ${level.bg} transition-all duration-700`}
            style={{ width: `${pct}%`, opacity: 0.8 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/30">
          <span>0</span>
          <span>100</span>
          <span>200</span>
          <span>300</span>
        </div>
      </div>

      {/* Key pollutants row */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
          <span className="text-[10px] text-white/50">PM2.5</span>
          <p className="text-sm font-semibold text-white">{aqiData.pm2_5.toFixed(1)} <span className="text-[10px] text-white/40">μg/m³</span></p>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
          <span className="text-[10px] text-white/50">Ozone</span>
          <p className="text-sm font-semibold text-white">{aqiData.ozone.toFixed(1)} <span className="text-[10px] text-white/40">μg/m³</span></p>
        </div>
      </div>
    </GlassCard>
  );
};

export const AirQualityMiniCard = memo(AirQualityMiniCardComponent);
AirQualityMiniCard.displayName = "AirQualityMiniCard";
