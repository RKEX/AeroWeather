"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { WeatherData } from "@/types/weather";
import { Gauge, Navigation } from "lucide-react";
import { memo } from "react";

function getWindDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8] ?? "N";
}

function getBeaufortScale(speed: number): { level: number; label: string } {
  if (speed < 1) return { level: 0, label: "Calm" };
  if (speed < 6) return { level: 1, label: "Light air" };
  if (speed < 12) return { level: 2, label: "Light breeze" };
  if (speed < 20) return { level: 3, label: "Gentle breeze" };
  if (speed < 29) return { level: 4, label: "Moderate breeze" };
  if (speed < 39) return { level: 5, label: "Fresh breeze" };
  if (speed < 50) return { level: 6, label: "Strong breeze" };
  if (speed < 62) return { level: 7, label: "Near gale" };
  if (speed < 75) return { level: 8, label: "Gale" };
  if (speed < 89) return { level: 9, label: "Severe gale" };
  if (speed < 103) return { level: 10, label: "Storm" };
  if (speed < 118) return { level: 11, label: "Violent storm" };
  return { level: 12, label: "Hurricane" };
}

function getPressureStatus(hpa: number): { label: string; color: string } {
  if (hpa < 1000) return { label: "Low pressure", color: "text-blue-400" };
  if (hpa < 1013) return { label: "Below normal", color: "text-sky-300" };
  if (hpa < 1020) return { label: "Normal", color: "text-green-400" };
  if (hpa < 1030) return { label: "High pressure", color: "text-orange-400" };
  return { label: "Very high", color: "text-red-400" };
}

interface WindPressureCardProps {
  weather: WeatherData;
}

const WindPressureCardComponent = ({ weather }: WindPressureCardProps) => {
  const { current } = weather;
  const windSpeed = Math.round(current.windSpeed10m);
  const windDir = current.windDirection10m ?? 0;
  const windGusts = Math.round(current.windGusts10m ?? 0);
  const pressure = Math.round(current.pressureMsl ?? 1013);
  const surfacePressure = Math.round(current.surfacePressure ?? 1010);

  const beaufort = getBeaufortScale(windSpeed);
  const pressureStatus = getPressureStatus(pressure);
  const dirLabel = getWindDirection(windDir);

  // Wind compass arc — progress 0→1 based on direction
  const compassAngle = windDir;

  return (
    <GlassCard className="p-6 w-full flex flex-col gap-5">
      <h3 className="text-xl font-medium text-white drop-shadow-sm">
        Wind & Pressure
      </h3>

      {/* ✅ Wind compass */}
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/10" />
          {/* Direction markers */}
          {["N", "E", "S", "W"].map((d, i) => {
            const angle = i * 90;
            const rad = (angle - 90) * (Math.PI / 180);
            const x = 50 + 42 * Math.cos(rad);
            const y = 50 + 42 * Math.sin(rad);
            return (
              <span
                key={d}
                className="absolute text-[9px] font-bold text-white/30"
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              >
                {d}
              </span>
            );
          })}
          {/* Arrow */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${compassAngle}deg)` }}
          >
            <Navigation className="h-7 w-7 text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.6)]" />
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-light text-white">{windSpeed}</span>
            <span className="mb-1 text-sm text-white/60">km/h</span>
          </div>
          <span className="text-xs text-white/50">From {dirLabel} · {beaufort.label}</span>
          <span className="text-xs text-white/40">Gusts up to {windGusts} km/h</span>
        </div>
      </div>

      {/* ✅ Beaufort scale bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">Beaufort Scale</span>
          <span className="text-xs font-semibold text-white">
            {beaufort.level} / 12
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 transition-all duration-700"
            style={{ width: `${(beaufort.level / 12) * 100}%` }}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-white/8" />

      {/* ✅ Pressure */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Gauge className="h-6 w-6 text-white/70" />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-light text-white">{pressure}</span>
            <span className="mb-0.5 text-sm text-white/60">hPa</span>
          </div>
          <span className={`text-xs font-medium ${pressureStatus.color}`}>
            {pressureStatus.label}
          </span>
          <span className="text-xs text-white/40">
            Surface: {surfacePressure} hPa
          </span>
        </div>
      </div>

      {/* ✅ Pressure gauge bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[10px] text-white/30">
          <span>980</span>
          <span>1000</span>
          <span>1013</span>
          <span>1030</span>
          <span>1050</span>
        </div>
        <div className="relative h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-orange-400 transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.max(0, ((pressure - 980) / (1050 - 980)) * 100))}%`,
            }}
          />
        </div>
      </div>
    </GlassCard>
  );
};

export const WindPressureCard = memo(WindPressureCardComponent);
WindPressureCard.displayName = "WindPressureCard";