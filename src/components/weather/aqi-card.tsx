"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/types/weather";
import { Wind } from "lucide-react";

import { memo } from "react";

interface AqiCardProps {
  aqiData?: WeatherData["airQuality"];
  isNight?: boolean;
}

const Pollutant = memo(
  ({ label, value, unit }: { label: string; value: number; unit: string }) => {
    const itemBg = "bg-white/5 border-white/10";
    const textMain = "text-white";
    const textSub = "text-white/80";
    const textUnit = "text-white/60";

    return (
      <div
        className={`flex flex-col rounded-2xl border p-3 transition-all hover:bg-white/10 ${itemBg}`}>
        <span className={`mb-1 text-xs ${textSub}`}>{label}</span>
        <span className={`font-medium ${textMain}`}>
          {value.toFixed(1)}{" "}
          <span className={`text-[10px] ${textUnit}`}>{unit}</span>
        </span>
      </div>
    );
  },
);
Pollutant.displayName = "Pollutant";

export const AqiCard = memo(({ aqiData }: AqiCardProps) => {
  const { t } = useLanguage();
  if (!aqiData) return null;
  const textPrimary = "text-white";
  const textSecondary = "text-white/80";

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50)
      return {
        label: t("aqiGood"),
        color: "bg-green-500",
        text: "text-green-500",
      };
    if (aqi <= 100)
      return {
        label: t("aqiModerate"),
        color: "bg-yellow-500",
        text: "text-yellow-500",
      };
    if (aqi <= 150)
      return {
        label: t("aqiUnhealthySensitive"),
        color: "bg-orange-500",
        text: "text-orange-500",
      };
    if (aqi <= 200)
      return {
        label: t("aqiUnhealthy"),
        color: "bg-red-500",
        text: "text-red-500",
      };
    if (aqi <= 300)
      return {
        label: t("aqiVeryUnhealthy"),
        color: "bg-purple-500",
        text: "text-purple-500",
      };
    return {
      label: t("aqiHazardous"),
      color: "bg-rose-900",
      text: "text-rose-900",
    };
  };

  const status = getAqiStatus(aqiData.usAqi);

  return (
    <GlassCard className="w-full px-6 py-6 transition-all">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3
            className={`flex items-center gap-2 text-xl font-medium ${textPrimary}`}>
            <Wind className="h-5 w-5" /> {t("aqiTitle")}
          </h3>
          <p className={`mt-1 text-sm ${textSecondary}`}>{t("aqiBasedOnUs")}</p>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${status.text}`}>
            {aqiData.usAqi}
          </div>
          <div className={`mt-1 font-medium ${textPrimary}`}>
            {status.label}
          </div>
        </div>
      </div>

      {/* Scale Bar */}
      <div className="mb-6 flex h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-green-500"
          style={{ width: "20%" }}></div>
        <div
          className="h-full bg-yellow-500"
          style={{ width: "20%" }}></div>
        <div
          className="h-full bg-orange-500"
          style={{ width: "20%" }}></div>
        <div
          className="h-full bg-red-500"
          style={{ width: "20%" }}></div>
        <div
          className="h-full bg-purple-500"
          style={{ width: "20%" }}></div>
      </div>

      {/* Pollutants Grid */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Pollutant
          label="PM2.5"
          value={aqiData.pm2_5}
          unit="μg/m³"
        />
        <Pollutant
          label="PM10"
          value={aqiData.pm10}
          unit="μg/m³"
        />
        <Pollutant
          label="Ozone (O3)"
          value={aqiData.ozone}
          unit="μg/m³"
        />
        <Pollutant
          label="NO2"
          value={aqiData.nitrogenDioxide}
          unit="μg/m³"
        />
      </div>
    </GlassCard>
  );
});
AqiCard.displayName = "AqiCard";
