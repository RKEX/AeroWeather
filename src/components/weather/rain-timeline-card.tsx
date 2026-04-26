"use client";

import GlassCard from "@/components/ui/GlassCard";
import { WeatherData } from "@/types/weather";
import { CloudRain, Droplets, Activity } from "lucide-react";
import { memo, useMemo } from "react";

interface RainTimelineCardProps {
  weather: WeatherData;
}

const RainTimelineCardComponent = ({ weather }: RainTimelineCardProps) => {
  const timeline = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const slots: {
      hour: string;
      probability: number;
      precipitation: number;
    }[] = [];

    for (let i = 0; i < 8; i++) {
      const idx = currentHour + i;
      if (idx >= weather.hourly.time.length) break;
      const h = new Date(weather.hourly.time[idx]);
      slots.push({
        hour: h
          .toLocaleTimeString([], { hour: "2-digit", hour12: true })
          .replace(/\s/g, ""),
        probability: weather.hourly.precipitationProbability[idx] ?? 0,
        precipitation: weather.hourly.precipitation[idx] ?? 0,
      });
    }
    return slots;
  }, [weather]);

  const maxPrecip = useMemo(
    () => Math.max(0.1, ...timeline.map((s) => s.precipitation)),
    [timeline],
  );

  const isRaining = weather.current.rain > 0 || weather.current.precipitation > 0;
  
  const intensityLabel = useMemo(() => {
    const max = Math.max(...timeline.map(s => s.precipitation));
    if (max === 0) return "No rain expected. Clear skies ahead.";
    if (max < 0.5) return "Light drizzle expected. No disruption.";
    if (max < 2.5) return "Moderate rain possible. Stay alert.";
    return "Heavy rain expected. Exercise caution.";
  }, [timeline]);

  return (
    <GlassCard className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 p-5 md:p-6 shadow-[0_0_30px_rgba(56,189,248,0.15)] transition-all hover:scale-[1.01]">
      
      {/* Animated Rain Lines Effect */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
        <div className="animate-rain-line absolute left-[10%] top-0 h-10 w-[1px] bg-white" style={{ animationDelay: '0.2s' }} />
        <div className="animate-rain-line absolute left-[30%] top-0 h-12 w-[1px] bg-white" style={{ animationDelay: '0.5s' }} />
        <div className="animate-rain-line absolute left-[50%] top-0 h-8 w-[1px] bg-white" style={{ animationDelay: '1.2s' }} />
        <div className="animate-rain-line absolute left-[70%] top-0 h-14 w-[1px] bg-white" style={{ animationDelay: '0.8s' }} />
        <div className="animate-rain-line absolute left-[90%] top-0 h-10 w-[1px] bg-white" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner">
            <CloudRain className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight text-white uppercase opacity-90">Rain Forecast</h4>
            <p className="text-[10px] text-white/50 font-medium">Next 8 hours • Hourly</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 animate-pulse">
          <Activity className="h-3 w-3 text-cyan-400" />
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-tighter">Real-time</span>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-24 mb-4">
        {timeline.map((slot, i) => {
          const barH = Math.max(8, (slot.precipitation / maxPrecip) * 100);
          const opacity = 0.4 + (slot.probability / 100) * 0.6;
          
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-2 group/bar">
              <span className="text-[10px] font-bold text-white/60 group-hover/bar:text-white transition-colors">
                {slot.probability}%
              </span>
              <div className="relative w-full h-full min-h-[60px] flex items-end">
                <div 
                  className="w-full rounded-full bg-gradient-to-t from-blue-500/80 to-cyan-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                  style={{ height: `${barH}%`, opacity }}
                />
              </div>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">
                {slot.hour}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rain Intensity Label */}
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-white/5 p-3 border border-white/5">
        <Droplets className={`h-4 w-4 ${isRaining ? 'text-blue-400 animate-bounce' : 'text-white/20'}`} />
        <p className="text-[11px] font-medium text-white/70">
          {intensityLabel}
        </p>
      </div>

    </GlassCard>
  );
};

export const RainTimelineCard = memo(RainTimelineCardComponent);
RainTimelineCard.displayName = "RainTimelineCard";
