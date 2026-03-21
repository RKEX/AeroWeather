"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { WeatherData } from "@/types/weather";
import { format } from "date-fns";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Sunrise, Sunset } from "lucide-react";
import { useEffect, useState } from "react";

import { memo } from "react";

const SunArcComponent = ({ weather, dayIndex = -1 }: { weather: WeatherData, dayIndex?: number }) => {
    const textPrimary = "text-white";
    const textTertiary = "text-white/60";

    const [currentTime, setCurrentTime] = useState(new Date());

    const isForecast = dayIndex >= 0;
    const actualIndex = isForecast ? dayIndex : 0;
    
    const sunriseStr = weather.daily.sunrise[actualIndex];
    const sunsetStr = weather.daily.sunset[actualIndex];

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    if (!sunriseStr || !sunsetStr) return null;

    const sunrise = new Date(sunriseStr);
    const sunset = new Date(sunsetStr);

    let progress = (currentTime.getTime() - sunrise.getTime()) / (sunset.getTime() - sunrise.getTime());
    progress = Math.max(0, Math.min(1, progress));

    let statusText = "";
    if (currentTime < sunrise) {
        const diff = Math.round((sunrise.getTime() - currentTime.getTime()) / 60000);
        statusText = diff < 60 ? `Sunrise in ${diff}m` : "Waiting for sunrise";
    } else if (currentTime < sunset) {
        const diff = Math.round((sunset.getTime() - currentTime.getTime()) / 60000);
        statusText = diff < 60 ? `Sunset in ${diff}m` : "Sun is up";
    } else {
        statusText = "Sun has set";
    }

    // SVG Arc Path Configuration
    const r = 100; // Refined radius
    const cx = 150; // Center X remains 150 for the 300px viewBox
    const cy = 110; // Refined base Y for a natural arc height
    
    // Calculate sun position on the arc
    const angle = Math.PI - (progress * Math.PI);
    const sunX = cx + r * Math.cos(angle);
    const sunY = cy - r * Math.sin(angle);

    return (
        <GlassCard className="p-6 w-full overflow-hidden relative transition-all">
            <h3 className={`text-xl font-medium mb-4 drop-shadow-sm ${textPrimary}`}>Sunrise & Sunset</h3>
            
            <div className="relative mx-auto mt-6 h-36 w-full max-w-85 px-5">
                {/* SVG Container for the Arc */}
                <svg width="100%" height="120" viewBox="0 0 300 120" className="overflow-visible">
                    <defs>
                        <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#facc15" />
                            <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                    </defs>

                    {/* Background Arc - Thin & Subtle */}
                    <path
                        d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />

                    {/* Progress Arc - Elegant & Gradient */}
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

                {/* Glowing Sun Position */}
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

                {/* Markers & Baseline */}
                <div className="absolute top-27.5 right-0 left-0 flex items-end justify-between px-2">
                    <div className="flex flex-col items-center gap-1.5 translate-y-1">
                        <Sunrise className="w-4 h-4 text-yellow-500/80" />
                        <span className={`text-[11px] font-semibold tracking-wide ${textPrimary}`}>{format(sunrise, 'h:mm a')}</span>
                    </div>
                    
                    {/* Minimal Baseline */}
                    <div className="mx-4 h-px flex-1 -translate-y-1.5 bg-white/5"></div>

                    <div className="flex flex-col items-center gap-1.5 translate-y-1">
                        <Sunset className="w-4 h-4 text-orange-500/80" />
                        <span className={`text-[11px] font-semibold tracking-wide ${textPrimary}`}>{format(sunset, 'h:mm a')}</span>
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
