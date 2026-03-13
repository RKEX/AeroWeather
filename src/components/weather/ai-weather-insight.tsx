"use client";

import { WeatherData } from "@/types/weather";
import { generateWeatherInsight } from "@/lib/ai-insight";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AiWeatherInsightProps {
  weather: WeatherData;
}

/**
 * Determines a colour accent for the insight card based on the insight content.
 */
function accentColors(insight: string): {
  border: string;
  glow: string;
  badge: string;
} {
  const lower = insight.toLowerCase();
  if (lower.includes("rain") || lower.includes("precipitation") || lower.includes("umbrella")) {
    return {
      border: "from-blue-500/40 via-cyan-500/20 to-transparent",
      glow: "shadow-blue-500/20",
      badge: "bg-blue-500/20 text-blue-200 border-blue-500/30",
    };
  }
  if (lower.includes("thunder") || lower.includes("storm")) {
    return {
      border: "from-purple-500/40 via-violet-500/20 to-transparent",
      glow: "shadow-purple-500/20",
      badge: "bg-purple-500/20 text-purple-200 border-purple-500/30",
    };
  }
  if (lower.includes("snow") || lower.includes("freez")) {
    return {
      border: "from-sky-400/40 via-blue-300/20 to-transparent",
      glow: "shadow-sky-400/20",
      badge: "bg-sky-400/20 text-sky-200 border-sky-400/30",
    };
  }
  if (lower.includes("uv") || lower.includes("sun") || lower.includes("heat") || lower.includes("hot")) {
    return {
      border: "from-orange-400/40 via-amber-400/20 to-transparent",
      glow: "shadow-orange-400/20",
      badge: "bg-orange-400/20 text-orange-200 border-orange-400/30",
    };
  }
  if (lower.includes("wind")) {
    return {
      border: "from-teal-400/40 via-emerald-400/20 to-transparent",
      glow: "shadow-teal-400/20",
      badge: "bg-teal-400/20 text-teal-200 border-teal-400/30",
    };
  }
  // Pleasant / generic
  return {
    border: "from-indigo-400/40 via-violet-400/20 to-transparent",
    glow: "shadow-indigo-400/20",
    badge: "bg-indigo-400/20 text-indigo-200 border-indigo-400/30",
  };
}

export function AiWeatherInsight({ weather }: AiWeatherInsightProps) {
  const isNight = weather.current.isDay === 0;
  const textPrimary = isNight ? "text-white" : "text-slate-900";
  const textSecondary = isNight ? "text-white/50" : "text-slate-500";
  const glassCard = isNight
    ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl"
    : "bg-white/70 backdrop-blur-xl border border-slate-200 text-slate-900 shadow-lg";

  const insight = generateWeatherInsight(weather);
  const colors = accentColors(insight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative w-full overflow-hidden rounded-3xl backdrop-blur-xl transition-all p-6 ${glassCard} ${isNight ? colors.glow : ''}`}
    >
      {/* Animated gradient border accent (top edge) */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r ${colors.border}`}
      />

      {/* Subtle inner glow blob */}
      <div className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl ${isNight ? 'bg-white/5' : 'bg-black/5'}`} />

      <div className="relative flex items-start gap-4">
        {/* AI Icon Badge */}
        <div className={`shrink-0 rounded-2xl border p-3 ${colors.badge}`}>
          <Sparkles className="h-5 w-5" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-widest ${textSecondary}`}>
              AI Insight
            </span>
            {/* Animated sky glow indicator */}
            <div className="relative flex items-center ml-2">
              <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-sky-400 opacity-70 animate-ping"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]"></span>
            </div>
          </div>

          <motion.p
            key={insight} // re-animate when insight changes
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`text-base font-medium leading-relaxed ${textPrimary}`}
          >
            {insight}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
