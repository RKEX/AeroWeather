"use client";

import { WeatherData } from "@/types/weather";
import { Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SunArc({ weather }: { weather: WeatherData }) {
    const isNight = weather.current.isDay === 0;
    const textPrimary = isNight ? "text-white" : "text-slate-900";
    const textSecondary = isNight ? "text-white/60" : "text-slate-600";
    const glassCard = isNight
        ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl"
        : "bg-white/70 backdrop-blur-xl border border-slate-200 text-slate-900 shadow-lg";

    const [progress, setProgress] = useState(0);

    const sunriseStr = weather.daily.sunrise[0];
    const sunsetStr = weather.daily.sunset[0];

    useEffect(() => {
        if (!sunriseStr || !sunsetStr) return;
        
        const now = new Date().getTime();
        const sunrise = new Date(sunriseStr).getTime();
        const sunset = new Date(sunsetStr).getTime();

        let rawProgress = (now - sunrise) / (sunset - sunrise);
        rawProgress = Math.max(0, Math.min(1, rawProgress)); // Clamp between 0 and 1
        
        // Slight delay for animation effect
        setTimeout(() => setProgress(rawProgress), 500);

    }, [sunriseStr, sunsetStr]);

    if (!sunriseStr || !sunsetStr) return null;

    // SVG Arc Path 
    const r = 120; // radius
    const cx = 150; // center x
    const cy = 130; // base y
    
    // Calculate sun position on the arc
    // Angle goes from 180deg (PI) to 0
    const angle = Math.PI - (progress * Math.PI);
    const sunX = cx + r * Math.cos(angle);
    const sunY = cy - r * Math.sin(angle);

    return (
        <div className={`rounded-3xl p-6 w-full overflow-hidden relative backdrop-blur-xl transition-all ${glassCard}`}>
            <h3 className={`text-xl font-medium mb-4 drop-shadow-sm ${textPrimary}`}>Sunrise & Sunset</h3>
            <div className="relative w-75 h-37.5 mx-auto mt-6">
                
                {/* Background Arc */}
                <svg width="300" height="150" viewBox="0 0 300 150" className="absolute top-0 left-0">
                    <path
                        d="M 30,130 A 120,120 0 0,1 270,130"
                        fill="none"
                        stroke={isNight ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                </svg>

                {/* Animated Path fill container using a clip logic or simple animated stroke */}
                <svg width="300" height="150" viewBox="0 0 300 150" className="absolute top-0 left-0">
                    <motion.path
                        d="M 30,130 A 120,120 0 0,1 270,130"
                        fill="none"
                        stroke="rgba(250, 204, 21, 0.8)" /* yellow-400 */
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>

                {/* Glowing Sun Position */}
                {progress > 0 && progress < 1 && (
                     <motion.div
                        className="absolute w-8 h-8 -ml-4 -mt-4 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.8)]"
                        initial={{ x: 30, y: 130, opacity: 0 }}
                        animate={{ x: sunX, y: sunY, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                )}

                {/* Base Line */}
                <div className={`absolute bottom-5 left-0 right-0 h-px ${isNight ? 'bg-white/20' : 'bg-black/10'}`}></div>

                <div className="absolute bottom-0 left-5 transform -translate-x-1/2 flex flex-col items-center">
                    <Sunrise className="w-5 h-5 text-yellow-500 mb-1" />
                    <span className={`text-sm font-medium ${textPrimary}`}>{format(new Date(sunriseStr), 'h:mm a')}</span>
                </div>
                <div className="absolute bottom-0 left-70 transform -translate-x-1/2 flex flex-col items-center">
                    <Sunset className="w-5 h-5 text-orange-500 mb-1" />
                    <span className={`text-sm font-medium ${textPrimary}`}>{format(new Date(sunsetStr), 'h:mm a')}</span>
                </div>
            </div>
            {progress >= 1 && (
                 <p className={`text-center text-sm mt-2 ${textSecondary}`}>The sun has set.</p>
            )}
            {progress === 0 && (
                 <p className={`text-center text-sm mt-2 ${textSecondary}`}>Waiting for sunrise.</p>
            )}
        </div>
    );
}
