"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/types/weather";
import { memo, useEffect, useId, useState } from "react";

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
  const { t } = useLanguage();
  // ✅ React useId — SSR-safe, always unique per instance
  const uid = useId().replace(/:/g, "");
  const gradId = `sunGrad-${uid}`;

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const actualIndex = dayIndex >= 0 ? dayIndex : 0;
  const sunriseStr = weather.daily.sunrise[actualIndex];
  const sunsetStr = weather.daily.sunset[actualIndex];
  if (!sunriseStr || !sunsetStr) return null;

  const tz = timezone || "UTC";
  const sunriseUTC = localStrToUTC(sunriseStr, tz);
  const sunsetUTC = localStrToUTC(sunsetStr, tz);

  let progress =
    (now.getTime() - sunriseUTC.getTime()) /
    (sunsetUTC.getTime() - sunriseUTC.getTime());
  progress = Math.max(0, Math.min(1, progress));

  let statusText = "";
  if (now < sunriseUTC) {
    const diff = Math.round((sunriseUTC.getTime() - now.getTime()) / 60000);
    statusText = diff < 60 ? t("sunriseIn", { minutes: diff }) : t("waitingForSunrise");
  } else if (now < sunsetUTC) {
    const diff = Math.round((sunsetUTC.getTime() - now.getTime()) / 60000);
    statusText = diff < 60 ? t("sunsetIn", { minutes: diff }) : t("sunIsUp");
  } else {
    statusText = t("sunHasSet");
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

  const isIST = tz === "Asia/Kolkata" || tz === "Asia/Calcutta" || !timezone;
  const toIST = (utcDate: Date): string => {
    if (isIST) return "";
    return utcDate.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  // ── SVG geometry ──────────────────────────────────────────────
  const VW = 300;
  const VH = 160;   // enough room for arc (top ~20px) + labels (~40px below baseline)
  const cx = 150;
  const cy = 115;   // baseline — arc sits above, labels below
  const r  = 95;    // slightly smaller so left/right edges have padding

  const arcLength = Math.PI * r;

  // Sun position: angle goes π→0 as progress 0→1 (left to right)
  const angle = Math.PI - progress * Math.PI;
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  const sunriseIST = toIST(sunriseUTC);
  const sunsetIST  = toIST(sunsetUTC);

  return (
    <GlassCard className="p-6 w-full relative transition-all">
      <h3 className="text-xl font-bold mb-2 text-white/95">
        {t("sunTitle")}
      </h3>

    <div className="mt-2 rounded-2xl overflow-hidden">
      <svg
        width="100%"
        viewBox={`0 0 ${VW} ${VH}`}
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* ── Dashed background arc ── */}
        <path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {/* ── Progress arc ── */}
        <path
          d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={arcLength - progress * arcLength}
          style={{
            filter: "drop-shadow(0 0 6px rgba(250, 204, 21, 0.4))",
          }}
        />

        {/* ── Sun dot ── */}
        {progress > 0 && progress < 1 && (
          <circle
            cx={sunX}
            cy={sunY}
            r="7"
            fill={`url(#${gradId})`}
            style={{
              filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.9))",
            }}
          />
        )}

        {/* ── Baseline ── */}
        <line
          x1={cx - r - 2} y1={cy}
          x2={cx + r + 2} y2={cy}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />

        {/* ── Sunrise (left) ── */}
        <g>
          {/* icon: horizon line */}
          <line
            x1={cx - r - 8} y1={cy + 16}
            x2={cx - r + 8} y2={cy + 16}
            stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"
          />
          {/* icon: sun rising arc */}
          <path
            d={`M ${cx - r - 7},${cy + 14} Q ${cx - r},${cy + 6} ${cx - r + 7},${cy + 14}`}
            fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"
          />
          {/* icon: rays */}
          <line x1={cx - r}     y1={cy + 4}  x2={cx - r}     y2={cy + 2}  stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <line x1={cx - r - 7} y1={cy + 8}  x2={cx - r - 9} y2={cy + 6}  stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <line x1={cx - r + 7} y1={cy + 8}  x2={cx - r + 9} y2={cy + 6}  stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>

          <text
            x={cx - r} y={cy + 30}
            textAnchor="middle"
            fontSize="11" fontWeight="600"
            fill="white" letterSpacing="0.4"
          >
            {formatRawTime(sunriseStr)}
          </text>
          {sunriseIST && (
            <text x={cx - r} y={cy + 42} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)">
              {sunriseIST} IST
            </text>
          )}
        </g>

        {/* ── Sunset (right) ── */}
        <g>
          {/* icon: horizon line */}
          <line
            x1={cx + r - 8} y1={cy + 16}
            x2={cx + r + 8} y2={cy + 16}
            stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"
          />
          {/* icon: sun setting arc */}
          <path
            d={`M ${cx + r - 7},${cy + 14} Q ${cx + r},${cy + 6} ${cx + r + 7},${cy + 14}`}
            fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round"
          />
          {/* icon: rays */}
          <line x1={cx + r}     y1={cy + 4}  x2={cx + r}     y2={cy + 2}  stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <line x1={cx + r - 7} y1={cy + 8}  x2={cx + r - 9} y2={cy + 6}  stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          <line x1={cx + r + 7} y1={cy + 8}  x2={cx + r + 9} y2={cy + 6}  stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>

          <text
            x={cx + r} y={cy + 30}
            textAnchor="middle"
            fontSize="11" fontWeight="600"
            fill="white" letterSpacing="0.4"
          >
            {formatRawTime(sunsetStr)}
          </text>
          {sunsetIST && (
            <text x={cx + r} y={cy + 42} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.45)">
              {sunsetIST} IST
            </text>
          )}
        </g>

        {/* ── Divider between labels ── */}
        <line
          x1={cx - r + 36} y1={cy + 16}
          x2={cx + r - 36} y2={cy + 16}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      </svg>
    </div>

      {/* ── Status text ── */}
      <p className="text-center text-sm mt-1 font-medium tracking-wide text-white/60">
        {statusText}
      </p>
    </GlassCard>
  );
};

export const SunArc = memo(SunArcComponent);
SunArc.displayName = "SunArc";