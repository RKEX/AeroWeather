"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { WeatherData } from "@/types/weather";
import { Sunrise, Sunset } from "lucide-react";
import { memo, useEffect, useState } from "react";

// ✅ open-meteo "2026-03-22T05:38" → UTC timestamp
function localStrToUTC(str: string, timezone: string): Date {
  const [datePart, timePart] = str.split("T");
  if (!datePart || !timePart) return new Date(str);
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const naiveUTC = Date.UTC(year!, month! - 1, day!, hour!, minute!, 0);
  const naiveDate = new Date(naiveUTC);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(naiveDate);
  const p: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") p[part.type] = parseInt(part.value, 10);
  }
  const tzHour = (p["hour"] === 24 ? 0 : p["hour"]) ?? 0;
  const tzMinute = p["minute"] ?? 0;
  const diffMs = (hour! - tzHour) * 3600000 + (minute! - tzMinute) * 60000;
  return new Date(naiveUTC + diffMs);
}

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

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const actualIndex = dayIndex >= 0 ? dayIndex : 0;
  const sunriseStr = weather.daily.sunrise[actualIndex];
  const sunsetStr = weather.daily.sunset[actualIndex];
  if (!sunriseStr || !sunsetStr) return null;

  const tz = timezone || "UTC";

  // ✅ timezone-aware parsing
  const sunriseUTC = localStrToUTC(sunriseStr, tz);
  const sunsetUTC = localStrToUTC(sunsetStr, tz);

  let progress =
    (now.getTime() - sunriseUTC.getTime()) /
    (sunsetUTC.getTime() - sunriseUTC.getTime());
  progress = Math.max(0, Math.min(1, progress));

  let statusText = "";
  if (now < sunriseUTC) {
    const diff = Math.round((sunriseUTC.getTime() - now.getTime()) / 60000);
    statusText = diff < 60 ? `Sunrise in ${diff}m` : "Waiting for sunrise";
  } else if (now < sunsetUTC) {
    const diff = Math.round((sunsetUTC.getTime() - now.getTime()) / 60000);
    statusText = diff < 60 ? `Sunset in ${diff}m` : "Sun is up";
  } else {
    statusText = "Sun has set";
  }

  // ✅ local time display directly from string (most accurate)
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

  const isIST = tz === "Asia/Kolkata" || tz === "Asia/Calcutta" || !timezone;
  const toIST = (utcDate: Date): string => {
    if (isIST) return "";
    return utcDate.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  // ✅ Same as original — strokeDashoffset approach (always on the arc)
  const r = 100;
  const cx = 150;
  const cy = 110;
  const arcLength = Math.PI * r;

  // Sun dot position
  const angle = Math.PI - progress * Math.PI;
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  const sunriseIST = toIST(sunriseUTC);
  const sunsetIST = toIST(sunsetUTC);

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

          {/* ✅ Background dashed arc */}
          <path
            d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* ✅ Progress arc — strokeDashoffset trick (always follows the arc perfectly) */}
          <path
            d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
            fill="none"
            stroke="url(#sunGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={(1 - progress) * arcLength}
          />
        </svg>

        {/* ✅ Sun dot — div positioned by sunX/sunY (same as original) */}
        {progress > 0 && progress < 1 && (
          <div
            className="absolute -ml-2.5 -mt-2.5 h-5 w-5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.7)]"
            style={{
              left: `${(sunX / 300) * 100}%`,
              top: `${sunY}px`,
            }}
          />
        )}

        {/* Labels */}
        <div className="absolute top-27.5 right-0 left-0 flex items-end justify-between px-2">
          <div className="flex flex-col items-center gap-1 translate-y-1">
            <Sunrise className="w-4 h-4 text-yellow-500/80" />
            <span className={`text-[11px] font-semibold tracking-wide ${textPrimary}`}>
              {formatRawTime(sunriseStr)}
            </span>
            {sunriseIST && (
              <span className={`text-[9px] ${textTertiary}`}>{sunriseIST} IST</span>
            )}
          </div>
          <div className="mx-4 h-px flex-1 -translate-y-1.5 bg-white/5" />
          <div className="flex flex-col items-center gap-1 translate-y-1">
            <Sunset className="w-4 h-4 text-orange-500/80" />
            <span className={`text-[11px] font-semibold tracking-wide ${textPrimary}`}>
              {formatRawTime(sunsetStr)}
            </span>
            {sunsetIST && (
              <span className={`text-[9px] ${textTertiary}`}>{sunsetIST} IST</span>
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