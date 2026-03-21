"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { WeatherData } from "@/types/weather";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Sunrise, Sunset } from "lucide-react";
import { memo, useEffect, useState } from "react";

const SunArcComponent = ({ 
  weather, 
  dayIndex = -1,
  timezone,
}: { 
  weather: WeatherData, 
  dayIndex?: number,
  timezone?: string,
}) => {
    const textPrimary = "text-white";
    const textTertiary = "text-white/60";

    // ✅ location এর current time (timezone অনুযায়ী)
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

    const isForecast = dayIndex >= 0;
    const actualIndex = isForecast ? dayIndex : 0;
    
    const sunriseStr = weather.daily.sunrise[actualIndex];
    const sunsetStr = weather.daily.sunset[actualIndex];

    if (!sunriseStr || !sunsetStr) return null;

    // ✅ KEY FIX: open-meteo "2026-03-22T05:42" format টা local time —
    // browser এটাকে UTC বা IST হিসেবে parse করে ফেলে।
    // তাই timezone দিয়ে manually correct Date বানাতে হবে।
    const parseLocalTimeStr = (str: string, tz?: string): Date => {
      // str = "2026-03-22T05:42" (no Z, no offset)
      // এটাকে সেই timezone এর local time হিসেবে treat করতে হবে
      if (!tz) return new Date(str);
      
      // Intl.DateTimeFormat দিয়ে offset বের করে correct করা
      const naive = new Date(str); // browser নিজের timezone এ parse করে
      
      // Target timezone এ এখন কত বাজে সেটা বের করো
      const targetNow = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
      const localNow = new Date();
      const tzOffset = targetNow.getTime() - localNow.getTime();
      
      // naive থেকে local offset বাদ দিয়ে target offset যোগ করো
      const localOffset = -new Date().getTimezoneOffset() * 60000;
      return new Date(naive.getTime() - localOffset - tzOffset);
    };

    const sunrise = parseLocalTimeStr(sunriseStr, timezone);
    const sunset = parseLocalTimeStr(sunsetStr, timezone);

    // ✅ progress calculation — সব same timezone এ তুলনা হচ্ছে
    let progress = (currentTime.getTime() - sunrise.getTime()) / (sunset.getTime() - sunrise.getTime());
    progress = Math.max(0, Math.min(1, progress));

    // ✅ status text
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

    // ✅ Location local time format (e.g. Tokyo time)
    const toLocationTime = (date: Date, tz?: string) => {
      if (!tz) return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      // sunriseStr directly use করো — এটাই local time
      return "";
    };

    // ✅ sunriseStr থেকে directly local time display করা সবচেয়ে সঠিক
    const formatRawTime = (str: string): string => {
      // "2026-03-22T05:42" → "5:42 AM"
      const parts = str.split("T");
      if (!parts[1]) return str;
      const [hStr, mStr] = parts[1].split(":");
      const h = parseInt(hStr ?? "0", 10);
      const m = parseInt(mStr ?? "0", 10);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
    };

    // ✅ IST time formatter
    const toIST = (str: string, tz?: string): string => {
      if (!tz) return "";
      // str = "2026-03-22T05:42", tz = "Asia/Tokyo"
      // এটাকে IST তে convert করো
      const naive = new Date(str + ":00");
      // naive এ browser offset আছে, সেটা correct করো
      const browserOffsetMs = naive.getTimezoneOffset() * 60000;
      
      // Tokyo offset (UTC+9) = -9*60*60*1000 ms from UTC
      // IST offset (UTC+5:30) = -5.5*60*60*1000 ms from UTC
      // কিন্তু dynamic offset ব্যবহার করা ভালো:
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
    
    const angle = Math.PI - (progress * Math.PI);
    const sunX = cx + r * Math.cos(angle);
    const sunY = cy - r * Math.sin(angle);

    return (
        <GlassCard className="p-6 w-full overflow-hidden relative transition-all">
            <h3 className={`text-xl font-medium mb-4 drop-shadow-sm ${textPrimary}`}>Sunrise & Sunset</h3>
            
            <div className="relative mx-auto mt-6 h-36 w-full max-w-85 px-5">
                <svg width="100%" height="120" viewBox="0 0 300 120" className="overflow-visible">
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

                    {/* Progress arc */}
                    <LazyMotion features={domAnimation}>
                      <m.path
                          d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                          fill="none"
                          stroke="url(#sunGradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: progress }}
                          transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </LazyMotion>
                </svg>

                {/* Sun position dot */}
                {progress > 0 && progress < 1 && (
                    <LazyMotion features={domAnimation}>
                      <m.div
                          className="absolute top-0 left-0 h-6 w-6 rounded-full bg-yellow-400 will-change-transform"
                          style={{
                              boxShadow: "0 0 12px rgba(250, 204, 21, 0.6), 0 0 30px rgba(250, 204, 21, 0.35)",
                          }}
                          initial={{ x: cx - 12, y: cy - 12, opacity: 0 }}
                          animate={{ 
                              x: sunX - 12,
                              y: sunY - 12,
                              opacity: 1 
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </LazyMotion>
                )}

                {/* Sunrise & Sunset labels */}
                <div className="absolute top-27.5 right-0 left-0 flex items-end justify-between px-2">
                    <div className="flex flex-col items-center gap-1 translate-y-1">
                        <Sunrise className="w-4 h-4 text-yellow-500/80" />
                        {/* ✅ sunriseStr থেকে directly local time */}
                        <span className={`text-[11px] font-semibold tracking-wide ${textPrimary}`}>
                          {formatRawTime(sunriseStr)}
                        </span>
                        {/* ✅ IST equivalent */}
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