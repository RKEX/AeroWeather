"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/types/weather";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Moon, 
  Sun, 
  Sparkles, 
  Info, 
  Telescope,
  ChevronRight,
  Wind,
  Cloud
} from "lucide-react";
import React, { memo, useEffect, useId, useMemo, useState } from "react";
import SunCalc from "suncalc";
import * as Astronomy from "astronomy-engine";
// Replaced by pre-calculated moon data

/* ---------- UTILS ---------- */

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

// Replaced by calculateMoonPhase and getMoonPhaseName from astro-utils.ts

/* ---------- COMPONENTS ---------- */

type TabType = "SUN" | "MOON" | "ASTRO";

interface AstroPanelProps {
  weather: WeatherData;
  dayIndex?: number;
  timezone?: string;
  lat: number;
  lon: number;
}

export const AstroPanel = memo(function AstroPanel({
  weather,
  dayIndex = -1,
  timezone = "UTC",
  lat,
  lon
}: AstroPanelProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("SUN");
  const [now, setNow] = useState(() => new Date());
  
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const actualIndex = dayIndex >= 0 ? dayIndex : 0;
  
  // Memoized astro data using high-precision calculations
  const astro = useMemo(() => {
    const moonData = weather.moon;
    const dailyMoon = weather.dailyMoon;
    
    // For current day or forecast day
    const mRiseStr = dayIndex >= 0 ? dailyMoon?.moonrise[dayIndex] : moonData?.moonrise;
    const mSetStr = dayIndex >= 0 ? dailyMoon?.moonset[dayIndex] : moonData?.moonset;
    const mPhase = dayIndex >= 0 ? dailyMoon?.phase[dayIndex] : moonData?.phase;
    const mIllum = dayIndex >= 0 ? dailyMoon?.illumination[dayIndex] : moonData?.illumination;
    const mName = dayIndex >= 0 ? dailyMoon?.phaseName[dayIndex] : moonData?.phaseName;

    const mRise = mRiseStr ? new Date(mRiseStr) : null;
    const mSet = mSetStr ? new Date(mSetStr) : null;

    // 1. Next 30 days Lunar / Solar events
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Solar Eclipse (Global Search)
    const nextSolarEclipse = Astronomy.SearchGlobalSolarEclipse(now);
    const hasSolarInThirty = nextSolarEclipse.peak.date < thirtyDaysLater;

    // Lunar Phase Search (Full / New)
    // 180 = Full Moon, 0 = New Moon
    const nextFullMoon = Astronomy.SearchMoonPhase(180, now, 32); 
    const nextNewMoon = Astronomy.SearchMoonPhase(0, now, 32);

    // Lunar Eclipse
    const nextLunarEclipse = Astronomy.SearchLunarEclipse(now);
    const hasLunarInThirty = nextLunarEclipse.peak.date < thirtyDaysLater;

    // Factors: Clouds (negative), Moonlight (negative if not watching moon)
    const cloudCover = weather.current.cloudCover ?? 0;
    const moonIsUp = mRise && mSet ? (mRise < mSet ? (now >= mRise && now <= mSet) : (now >= mRise || now <= mSet)) : false;
    
    let stargazingScore = 100;
    stargazingScore -= cloudCover * 0.7;
    if (moonIsUp) {
      stargazingScore -= (mIllum ?? 0) * 0.3;
    }
    if (stargazingScore < 10) stargazingScore = 15;

    // Best Stargazing Dates Logic
    const stargazingDates = [];
    for (let i = 0; i < 30; i++) {
        const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
        const illum = SunCalc.getMoonIllumination(d).fraction;
        if (illum < 0.15) {
            stargazingDates.push({
                date: d,
                reason: illum < 0.05 ? "New Moon Phase" : "Low Illumination"
            });
        }
        if (stargazingDates.length >= 3) break;
    }
    
    return {
      moonPhase: mPhase ?? 0,
      moonIllum: Math.round(mIllum ?? 0),
      moonName: mName ?? "Unknown",
      moonRise: mRise,
      moonSet: mSet,
      stargazingScore: Math.round(stargazingScore),
      stargazingDates,
      solarEvent: hasSolarInThirty ? nextSolarEclipse : null,
      lunarEvent: hasLunarInThirty ? nextLunarEclipse : null,
      nextFullMoon,
      nextNewMoon,
      isAmavasya: mPhase === 0,
      isPurnima: mPhase === 0.5, // 0.5 is full moon in suncalc
      moonStatus: moonIsUp ? "Moon is up" : (mRise && now < mRise ? `Rising at ${mRise.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : "Moon is set")
    };
  }, [now, lat, lon, weather.current.cloudCover]);

  // Sun Arc logic
  const sunriseStr = weather.daily.sunrise[actualIndex];
  const sunsetStr = weather.daily.sunset[actualIndex];
  
  const sunData = useMemo(() => {
    if (!sunriseStr || !sunsetStr) return null;
    const sunriseUTC = localStrToUTC(sunriseStr, timezone);
    const sunsetUTC = localStrToUTC(sunsetStr, timezone);
    
    let progress = (now.getTime() - sunriseUTC.getTime()) / (sunsetUTC.getTime() - sunriseUTC.getTime());
    progress = Math.max(0, Math.min(1, progress));
    
    let status = "";
    if (now < sunriseUTC) {
      const diff = Math.round((sunriseUTC.getTime() - now.getTime()) / 60000);
      status = diff < 60 ? t("sunriseIn", { minutes: diff }) : t("waitingForSunrise");
    } else if (now < sunsetUTC) {
      const diff = Math.round((sunsetUTC.getTime() - now.getTime()) / 60000);
      status = diff < 60 ? t("sunsetIn", { minutes: diff }) : t("sunIsUp");
    } else {
      status = t("sunHasSet");
    }

    return { progress, status, sunriseUTC, sunsetUTC };
  }, [now, sunriseStr, sunsetStr, timezone, t]);

  return (
    <GlassCard className="relative w-full p-5 transition-all h-[520px] flex flex-col">
      {/* FIXED HEADER & TABS */}
      <div className="flex-none flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white/95 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white/60" />
            Astro Intelligence
          </h3>
          <p className="text-xs text-white/40 font-medium uppercase tracking-widest mt-1">Celestial Dynamics</p>
        </div>

        <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 self-start">
          {(["SUN", "MOON", "ASTRO"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab 
                  ? "bg-white text-slate-900" 
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="astro-scroll flex-1 relative min-h-0 overflow-y-auto overscroll-contain pr-1 scroll-smooth">
        <AnimatePresence mode="wait">
          {activeTab === "SUN" && sunData && (
            <motion.div
              key="sun-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-full flex flex-col items-center"
            >
              <SunVisualization progress={sunData.progress} uid={uid} />
              
              <div className="grid grid-cols-2 gap-12 mt-4 w-full max-w-sm">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1">Sunrise</p>
                  <p className="text-lg font-bold text-white/95">{formatRawTime(sunriseStr!)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-1">Sunset</p>
                  <p className="text-lg font-bold text-white/95">{formatRawTime(sunsetStr!)}</p>
                </div>
              </div>

              {/* Solar Events (Next 30 Days) */}
              <div className="w-full mt-8 border-t border-white/5 pt-6">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Sun className="w-3 h-3" />
                  Solar Events (30 Days)
                </h4>
                {astro.solarEvent ? (
                  <EventCard 
                    type="SOLAR"
                    title={`${astro.solarEvent.kind.charAt(0).toUpperCase() + astro.solarEvent.kind.slice(1)} Solar Eclipse`}
                    date={astro.solarEvent.peak.date}
                    icon={Sun}
                    details={[
                        { label: "Peak Time", value: astro.solarEvent.peak.date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) },
                        { label: "Obscuration", value: `${Math.round((astro.solarEvent.obscuration ?? 0) * 100)}%` }
                    ]}
                  />
                ) : (
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                     <p className="text-xs text-white/40 italic">No solar eclipse in the next 30 days</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "MOON" && (
            <motion.div
              key="moon-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-full flex flex-col items-center"
            >
              <div className="flex items-center gap-3 mb-2">
                <MoonPhaseSmall phase={astro.moonPhase} />
                <div className="text-left">
                  <h4 className="text-sm font-black text-white/95 leading-none mb-1">{astro.moonName}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-semibold text-white/40">{astro.moonIllum}% Illumination</p>
                    <div className="h-1 w-1 rounded-full bg-white/10" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/60">{astro.moonStatus}</p>
                  </div>
                </div>
              </div>

              {/* Moon Path Arc Visualization (MAIN) */}
              <MoonPathArc 
                rise={astro.moonRise} 
                set={astro.moonSet} 
                now={now} 
                illum={astro.moonIllum}
                uid={uid} 
              />

              <div className="grid grid-cols-2 gap-3 mb-2 w-full max-w-sm">
                <div className="text-center bg-white/5 rounded-xl py-2 border border-white/5">
                  <p className="text-[8px] uppercase font-bold tracking-widest text-white/30 mb-0.5">Moonrise</p>
                  <p className="text-sm font-bold text-white/95 leading-tight">
                    {astro.moonRise ? astro.moonRise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Not visible"}
                  </p>
                </div>
                <div className="text-center bg-white/5 rounded-xl py-2 border border-white/5">
                  <p className="text-[8px] uppercase font-bold tracking-widest text-white/30 mb-0.5">Moonset</p>
                  <p className="text-sm font-bold text-white/95 leading-tight">
                    {astro.moonSet ? astro.moonSet.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Not visible"}
                  </p>
                </div>
              </div>

              {/* Lunar Events (Next 30 Days) */}
              <div className="w-full border-t border-white/5 pt-3 space-y-2">
                <h4 className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Moon className="w-2 h-2" />
                  Lunar Calendar
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                    {astro.nextFullMoon && (
                        <MiniPhaseCard 
                            label="Full Moon (Purnima)" 
                            date={astro.nextFullMoon.date} 
                        />
                    )}
                    {astro.nextNewMoon && (
                        <MiniPhaseCard 
                            label="New Moon (Amavasya)" 
                            date={astro.nextNewMoon.date} 
                        />
                    )}
                </div>

                {astro.lunarEvent ? (
                  <EventCard 
                    type="LUNAR"
                    title="Lunar Eclipse"
                    date={astro.lunarEvent.peak.date}
                    icon={Moon}
                    details={[
                        { label: "Type", value: "Partial" },
                        { label: "Peak", value: astro.lunarEvent.peak.date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }
                    ]}
                  />
                ) : (
                  <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                     <p className="text-[10px] text-white/40 text-center italic">No lunar eclipse in next 30d</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "ASTRO" && (
            <motion.div
              key="astro-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-full pr-1"
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 gap-4 w-full">
                {/* STARGAZING SCORE */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-4 opacity-5">
                    <Telescope className="w-20 h-20 text-white" />
                  </div>
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                       <div className="p-2 rounded-xl bg-white/10 text-white/60">
                          <Sparkles className="w-4 h-4" />
                       </div>
                       <h4 className="font-bold text-white tracking-wide">Stargazing Score</h4>
                     </div>
                     <span className="text-3xl font-black text-white/90">{astro.stargazingScore}<span className="text-sm font-normal text-white/40">/100</span></span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${astro.stargazingScore}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                         className="h-full bg-white/40"
                     />
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed font-medium">
                    {astro.stargazingScore > 75 
                      ? "Peak atmospheric transparency. Ideal for deep-space photography and planetary viewing." 
                      : astro.stargazingScore > 40
                          ? "Moderate sky clarity. Fainter stars may be obscured by atmospheric moisture."
                          : "Low visibility. Significant interference from cloud cover or light pollution."}
                  </p>
                </div>

                 {/* Best Stargazing Dates */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                   <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Telescope className="w-3 h-3" />
                      Best Viewing Windows (30 Days)
                   </h4>
                   <div className="space-y-2">
                      {astro.stargazingDates.map((d, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                               <div className="flex items-center gap-3">
                                  <div className="h-2 w-2 rounded-full bg-white/40" />
                                  <p className="text-sm font-bold text-white/90">
                                      {d.date.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })}
                                  </p>
                              </div>
                              <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-black uppercase">
                                  {d.reason}
                              </span>
                          </div>
                      ))}
                   </div>
                </div>

                {/* LUNAR INSIGHT */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-4">
                     <div className="mt-1 p-2 rounded-xl bg-white/5 text-white/80">
                        <Info className="w-4 h-4" />
                     </div>
                     <div>
                        <h4 className="font-bold text-white mb-2">Lunar Intelligence</h4>
                        <p className="text-sm text-white/60 leading-relaxed italic font-medium">
                          {astro.isAmavasya 
                            ? "Today marks Amavasya, a period of total lunar darkness. Ideal for spiritual grounding and night sky photography."
                            : astro.isPurnima 
                              ? "Tonight is Purnima. Atmospheric energy is at its peak. Expect high tidal influence and brilliant natural night illumination."
                              : `The current ${astro.moonName} phase presents a stable atmospheric envelope. ${astro.moonIllum > 60 ? "Moonlight will be prominent." : "Subtle moon presence."}`}
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
});

/* ---------- SUB-COMPONENTS ---------- */

interface EventCardProps {
    type: "SOLAR" | "LUNAR";
    title: string;
    date: Date;
    icon: React.ElementType;
    details: { label: string; value: string | number }[];
}

const EventCard = ({ title, date, icon: Icon, details }: EventCardProps) => (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10">
            <Icon className="w-12 h-12 text-white/40" />
        </div>
        <div className="flex items-start gap-3 mb-4">
            <div className={`p-2 rounded-lg bg-white/10 text-white/60`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <h5 className="font-black text-white leading-tight">{title}</h5>
                <p className="text-xs text-white/40 font-bold uppercase tracking-tighter">
                    {date.toLocaleDateString([], { weekday:'long', month:'long', day:'numeric' })}
                </p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-auto">
            {details.map((d, i) => (
                <div key={i} className="bg-black/20 p-2 rounded-lg border border-white/5">
                    <p className="text-[9px] uppercase font-black text-white/30 leading-none mb-1">{d.label}</p>
                    <p className="text-xs font-bold text-white">{d.value}</p>
                </div>
            ))}
        </div>
    </div>
);

const MiniPhaseCard = ({ label, date }: { label: string, date: Date }) => (
    <div className="bg-white/5 border border-white/5 p-2 rounded-lg flex flex-col items-center">
        <p className="text-[8px] font-black uppercase text-white/30 mb-1 tracking-tighter text-center">{label}</p>
        <p className="text-[11px] font-bold text-white text-center">
            {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </p>
    </div>
);

/* ---------- SUB-COMPONENTS ---------- */

const MoonPathArc = memo(({ rise, set, now, illum, uid }: { rise: Date | null, set: Date | null, now: Date, illum: number, uid: string }) => {
  const r = 85;
  const cx = 150;
  const cy = 100;

  const sunData = useMemo(() => {
    if (!rise || !set) return { progress: 0, status: "Unknown", isMoonUp: false };
    
    let isMoonUp = false;
    let progress = 0;
    
    if (rise.getTime() < set.getTime()) {
      isMoonUp = now >= rise && now <= set;
      progress = (now.getTime() - rise.getTime()) / (set.getTime() - rise.getTime());
    } else {
      isMoonUp = now >= rise || now <= set;
      if (now >= rise) {
          progress = (now.getTime() - rise.getTime()) / (set.getTime() + 24*3600000 - rise.getTime());
      } else {
          progress = (now.getTime() - (rise.getTime() - 24*3600000)) / (set.getTime() - (rise.getTime() - 24*3600000));
      }
    }
    
    progress = Math.max(0, Math.min(1, progress));
    
    let status = "";
    if (!isMoonUp) {
        if (now < rise) {
            const diff = Math.round((rise.getTime() - now.getTime()) / 60000);
            status = diff < 60 ? `Rising in ${diff}m` : `Will rise at ${rise.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
        } else {
            status = "Moon has set";
        }
    } else {
        status = "Moon is up";
    }

    return { progress, status, isMoonUp };
  }, [now, rise, set]);

  const angle = Math.PI - sunData.progress * Math.PI;
  const moonX = cx + r * Math.cos(angle);
  const moonY = cy - r * Math.sin(angle);

  const gradId = `moonGrad-${uid}`;

  return (
    <div className="flex flex-col items-center rounded-2xl overflow-hidden">
        <svg width="240" height="110" viewBox="0 0 300 110" className="overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Faint dotted arc for the entire path */}
        <path
            d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2"
            strokeDasharray="4 4"
        />

        {/* Solid active arc up to progress */}
        {sunData.isMoonUp && (
            <path
                d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={Math.PI * r}
                strokeDashoffset={Math.PI * r * (1 - sunData.progress)}
                style={{
                  filter: "drop-shadow(0 0 6px rgba(168, 85, 247, 0.4))",
                }}
            />
        )}
        
        {/* Moon Indicator */}
        {sunData.isMoonUp && (
            <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <circle
                    cx={moonX}
                    cy={moonY}
                    r="6"
                    fill={`url(#${gradId})`}
                    style={{
                      filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.9))",
                    }}
                />
            </motion.g>
        )}
        
        <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </svg>
    </div>
  );
});
MoonPathArc.displayName = "MoonPathArc";

const MoonPhaseSmall = memo(({ phase }: { phase: number }) => {
     return (
      <div className="relative w-12 h-12 rounded-full border border-white/5 bg-slate-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-1 rounded-full bg-slate-300 opacity-90 overflow-hidden">
           <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-black/10" />
           <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-black/10" />
        </div>
        <motion.div 
          className="absolute inset-1 rounded-full bg-slate-950/90"
          style={{
            clipPath: phase <= 0.5 
              ? `inset(0 0 0 ${phase * 200}%)` 
              : `inset(0 ${(1 - phase) * 200}% 0 0)`,
          }}
        />
      </div>
    );
});
MoonPhaseSmall.displayName = "MoonPhaseSmall";

const SunVisualization = memo(({ progress, uid }: { progress: number, uid: string }) => {
  const r = 90;
  const cx = 150;
  const cy = 110;
  const angle = Math.PI - progress * Math.PI;
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  const gradId = `sunVisGrad-${uid}`;

  return (
    <div className="flex flex-col items-center rounded-2xl overflow-hidden">
      <svg width="240" height="130" viewBox="0 0 300 130" className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {/* Background Arc */}
      <path
        d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      {/* Active Arc */}
       <path
        d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={Math.PI * r}
        strokeDashoffset={Math.PI * r * (1 - progress)}
        style={{
          filter: "drop-shadow(0 0 6px rgba(250, 204, 21, 0.4))",
        }}
      />
      {/* Sun Dot */}
      <motion.circle
        cx={sunX}
        cy={sunY}
        r="7"
        fill={`url(#${gradId})`}
        style={{
          filter: "drop-shadow(0 0 10px rgba(250, 204, 21, 0.9))",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
      <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
    </div>
  );
});
SunVisualization.displayName = "SunVisualization";

const MoonVisualization = memo(({ phase, illum }: { phase: number, illum: number }) => {
  return (
     <div className="relative w-24 h-24 rounded-full border border-white/5 bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Moon base */}
      <div className="absolute inset-2 rounded-full bg-slate-300 opacity-90 overflow-hidden">
         {/* Craters - simplistic */}
         <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-black/10" />
         <div className="absolute bottom-6 right-6 w-3 h-3 rounded-full bg-black/10" />
      </div>

      {/* Shadow overlay based on phase */}
      <motion.div 
        className="absolute inset-2 rounded-full bg-slate-950/85"
        style={{
          clipPath: phase <= 0.5
            ? `inset(0 0 0 ${phase * 200}%)`
            : `inset(0 ${(1 - phase) * 200}% 0 0)`,
        }}
      />
      
      {/* Phase Label Badge */}
      <div className="absolute -bottom-1 -right-1 bg-white/20 text-[10px] font-black px-2 py-0.5 rounded-full border border-white/20 text-white">
        {illum}%
      </div>
    </div>
  );
});
MoonVisualization.displayName = "MoonVisualization";

