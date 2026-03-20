"use client";

import { WeatherData } from "@/types/weather";
import { Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";

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
            
            <div className="relative w-full max-w-[340px] h-36 mx-auto mt-6 px-5">
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
                    <motion.path
                        d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                        fill="none"
                        stroke="url(#sunGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>

                {/* Glowing Sun Position */}
                {progress > 0 && progress < 1 && (
                     <motion.div
                        className="absolute w-6 h-6 -ml-3 -mt-3 bg-yellow-400 rounded-full"
                        style={{
                            boxShadow: "0 0 12px rgba(250, 204, 21, 0.6), 0 0 30px rgba(250, 204, 21, 0.35)",
                        }}
                        initial={{ left: "50%", top: "110px", opacity: 0 }}
                        animate={{ 
                            left: `${(sunX / 300) * 100}%`, 
                            top: `${sunY}px`,
                            opacity: 1 
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                )}

                {/* Markers & Baseline */}
                <div className="absolute top-[110px] left-0 right-0 flex justify-between items-end px-2">
                    <div className="flex flex-col items-center gap-1.5 translate-y-1">
                        <Sunrise className="w-4 h-4 text-yellow-500/80" />
                        <span className={`text-[11px] font-semibold tracking-wide ${textPrimary}`}>{format(sunrise, 'h:mm a')}</span>
                    </div>
                    
                    {/* Minimal Baseline */}
                    <div className="flex-1 h-px bg-white/5 mx-4 translate-y-[-6px]"></div>

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
