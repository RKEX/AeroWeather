"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { WeatherData } from "@/types/weather";
import { Sunrise, Sunset } from "lucide-react";
import { memo, useEffect, useState } from "react";

const SunArcComponent = ({
  weather,
  dayIndex = -1,
  timezone,
}: {
  weather: WeatherData;
  dayIndex?: number;
  timezone?: string;
}) => {
  const textPrimary = "text-white";
  const textTertiary = "text-white/60";

  const getLocationTime = () => {
    if (timezone) {
      return new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
    }
    return new Date();
  };

  const [currentTime, setCurrentTime] = useState(getLocationTime);

  useEffect(() => {
    setCurrentTime(getLocationTime());
    const timer = setInterval(() => {
      setCurrentTime(getLocationTime());
    }, 60000);
    return () => clearInterval(timer);
  }, [timezone]);

  const actualIndex = dayIndex >= 0 ? dayIndex : 0;
  const sunriseStr = weather.daily.sunrise[actualIndex];
  const sunsetStr = weather.daily.sunset[actualIndex];

  if (!sunriseStr || !sunsetStr) return null;

  const parseLocalTimeStr = (str: string, tz?: string): Date => {
    if (!tz) return new Date(str);
    const naive = new Date(str);
    const targetNow = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
    const localNow = new Date();
    const tzOffset = targetNow.getTime() - localNow.getTime();
    const localOffset = -new Date().getTimezoneOffset() * 60000;
    return new Date(naive.getTime() - localOffset - tzOffset);
  };

  const sunrise = parseLocalTimeStr(sunriseStr, timezone);
  const sunset = parseLocalTimeStr(sunsetStr, timezone);

  let progress = (currentTime.getTime() - sunrise.getTime()) / (sunset.getTime() - sunrise.getTime());
  progress = Math.max(0, Math.min(1, progress));

  let statusText = "";
  if (currentTime.getTime() < sunrise.getTime()) {
    const diff = Math.round((sunrise.getTime() - currentTime.getTime()) / 60000);
    statusText = diff < 60 ? `Sunrise in ${diff}m` : "Waiting for sunrise";
  } else if (currentTime.getTime() < sunset.getTime()) {
    const diff = Math.round((sunset.getTime() - currentTime.getTime()) / 60000);
    statusText = diff < 60 ? `Sunset in ${diff}m` : "Sun is up";
  } else {
    statusText = "Sun has set";
  }

  const formatRawTime = (str: string): string => {
    const parts = str.split("T");
    if (!parts[1]) return str;
    const [hStr, mStr] = parts[1].split(":");
    const h = parseInt(hStr ?? "0", 10);
    const m = parseInt(mStr ?? "0", 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const toIST = (str: string, tz?: string): string => {
    if (!tz) return "";
    const naive = new Date(str + ":00");
    const browserOffsetMs = naive.getTimezoneOffset() * 60000;
    const ref = new Date("2026-01-01T00:00:00");
    const tzTime = new Date(ref.toLocaleString("en-US", { timeZone: tz }));
    const istTime = new Date(ref.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const tzToISTDiffMs = istTime.getTime() - tzTime.getTime();
    const corrected = new Date(naive.getTime() + browserOffsetMs + tzToISTDiffMs);
    return corrected.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const r = 100;
  const cx = 150;
  const cy = 110;

  const angle = Math.PI - progress * Math.PI;
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  // ✅ Real arc segment — no stroke-dashoffset needed
  const largeArc = progress > 0.5 ? 1 : 0;
  const progressArcPath =
    progress >= 1
      ? `M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`
      : `M ${cx - r},${cy} A ${r},${r} 0 ${largeArc},1 ${sunX.toFixed(2)},${sunY.toFixed(2)}`;

  return (
    <GlassCard className="p-6 w-full overflow-hidden relative transition-all">
      <h3 className={`text-xl font-medium mb-4 drop-shadow-sm ${textPrimary}`}>
        Sunrise & Sunset
      </h3>

      <div className="relative mx-auto mt-6 h-36 w-full max-w-85 px-5">
        <svg
          width="100%"
          height="120"
          viewBox="0 0 300 120"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Background dashed arc */}
          <path
            d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* ✅ Progress arc — real SVG arc path, zero CSS animation */}
          {progress > 0 && (
            <path
              d={progressArcPath}
              fill="none"
              stroke="url(#sunGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* ✅ Sun dot — uses SVG transform (GPU composited), NOT cx/cy transition */}
          {progress > 0 && progress < 1 && (
            <g transform={`translate(${sunX.toFixed(2)}, ${sunY.toFixed(2)})`}>
              <circle r="14" fill="rgba(250,204,21,0.15)" />
              <circle r="8" fill="#facc15" />
              <circle r="4" fill="#fef08a" />
            </g>
          )}
        </svg>

        {/* Sunrise & Sunset labels */}
        <div className="absolute top-27.5 right-0 left-0 flex items-end justify-between px-2">
          <div className="flex flex-col items-center gap-1 translate-y-1">
            <Sunrise className="w-4 h-4 text-yellow-500/80" />
            <span className={`text-[11px] font-semibold tracking-wide ${textPrimary}`}>
              {formatRawTime(sunriseStr)}
            </span>
            {timezone && (
              <span className={`text-[9px] ${textTertiary}`}>
                {toIST(sunriseStr, timezone)} IST
              </span>
            )}
          </div>

          <div className="mx-4 h-px flex-1 -translate-y-1.5 bg-white/5" />

          <div className="flex flex-col items-center gap-1 translate-y-1">
            <Sunset className="w-4 h-4 text-orange-500/80" />
            <span className={`text-[11px] font-semibold tracking-wide ${textPrimary}`}>
              {formatRawTime(sunsetStr)}
            </span>
            {timezone && (
              <span className={`text-[9px] ${textTertiary}`}>
                {toIST(sunsetStr, timezone)} IST
              </span>
            )}
          </div>
        </div>
      </div>

      <p className={`text-center text-sm mt-8 font-medium tracking-wide ${textTertiary}`}>
        {statusText}
      </p>
    </GlassCard>
  );
};

export const SunArc = memo(SunArcComponent);
SunArc.displayName = "SunArc";