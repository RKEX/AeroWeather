"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { GlassCard } from "@/components/ui/glass-card";
import { TranslationKey } from "@/lib/i18n";
import { getCurrentWindKmh, roundWindKmh } from "@/lib/wind";
import { WeatherData } from "@/types/weather";
import { Gauge, Navigation } from "lucide-react";
import { memo, useEffect } from "react";

function getWindDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8] ?? "N";
}

function getBeaufortScale(speed: number): { level: number; labelKey: TranslationKey } {
  if (speed < 1) return { level: 0, labelKey: "beaufortCalm" };
  if (speed < 6) return { level: 1, labelKey: "beaufortLightAir" };
  if (speed < 12) return { level: 2, labelKey: "beaufortLightBreeze" };
  if (speed < 20) return { level: 3, labelKey: "beaufortGentleBreeze" };
  if (speed < 29) return { level: 4, labelKey: "beaufortModerateBreeze" };
  if (speed < 39) return { level: 5, labelKey: "beaufortFreshBreeze" };
  if (speed < 50) return { level: 6, labelKey: "beaufortStrongBreeze" };
  if (speed < 62) return { level: 7, labelKey: "beaufortNearGale" };
  if (speed < 75) return { level: 8, labelKey: "beaufortGale" };
  if (speed < 89) return { level: 9, labelKey: "beaufortSevereGale" };
  if (speed < 103) return { level: 10, labelKey: "beaufortStorm" };
  if (speed < 118) return { level: 11, labelKey: "beaufortViolentStorm" };
  return { level: 12, labelKey: "beaufortHurricane" };
}

function getPressureStatus(hpa: number): { labelKey: TranslationKey; color: string } {
  if (hpa < 1000) return { labelKey: "pressureLow", color: "text-blue-400" };
  if (hpa < 1013) return { labelKey: "pressureBelowNormal", color: "text-sky-300" };
  if (hpa < 1020) return { labelKey: "pressureNormal", color: "text-green-400" };
  if (hpa < 1030) return { labelKey: "pressureHigh", color: "text-orange-400" };
  return { labelKey: "pressureVeryHigh", color: "text-red-400" };
}

interface WindPressureCardProps {
  weather: WeatherData;
  windSourceKmh?: number;
}

const WindPressureCardComponent = ({ weather, windSourceKmh }: WindPressureCardProps) => {
  const { t } = useLanguage();
  const { current } = weather;
  const windSpeed = roundWindKmh(windSourceKmh ?? getCurrentWindKmh(weather));
  const windDir = current.windDirection10m ?? 0;
  const windGusts = roundWindKmh(current.windGusts10m ?? 0);
  const pressure = Math.round(current.pressureMsl ?? 1013);
  const surfacePressure = Math.round(current.surfacePressure ?? 1010);

  const beaufort = getBeaufortScale(windSpeed);
  const pressureStatus = getPressureStatus(pressure);
  const dirLabel = getWindDirection(windDir);

  // Wind compass arc — progress 0→1 based on direction
  const compassAngle = windDir;

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Wind Source:", windSpeed);
    }
  }, [windSpeed]);

  return (
    <GlassCard className="p-6 w-full flex flex-col gap-5">
      <h3 className="text-xl font-medium text-white drop-shadow-sm">
        {t("windPressureTitle")}
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
          <span className="text-xs text-white/50">
            {t("fromDirection", { direction: dirLabel, level: t(beaufort.labelKey) })}
          </span>
          <span className="text-xs text-white/40">{t("gustsUpTo", { value: windGusts })}</span>
        </div>
      </div>

      {/* ✅ Beaufort scale bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">{t("beaufortScale")}</span>
          <span className="text-xs font-semibold text-white">
            {beaufort.level} / 12
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-400 via-yellow-400 to-red-500 transition-all duration-700"
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
            {t(pressureStatus.labelKey)}
          </span>
          <span className="text-xs text-white/40">
            {t("surfacePressure", { value: surfacePressure })}
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
            className="h-full rounded-full bg-linear-to-r from-blue-400 via-green-400 to-orange-400 transition-all duration-700"
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