"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { generateWeatherInsight } from "@/lib/ai-insight";
import { WeatherData } from "@/types/weather";
import { Sparkles } from "lucide-react";

interface AiWeatherInsightProps {
  weather: WeatherData;
  dayIndex?: number;
}

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
  return {
    border: "from-indigo-400/40 via-violet-400/20 to-transparent",
    glow: "shadow-indigo-400/20",
    badge: "bg-indigo-400/20 text-indigo-200 border-indigo-400/30",
  };
}

export function AiWeatherInsight({ weather, dayIndex = -1 }: AiWeatherInsightProps) {
  const textPrimary = "text-white";
  const textTertiary = "text-white/60";

  const insight = generateWeatherInsight(weather, dayIndex);
  const colors = accentColors(insight);

  return (
    <GlassCard className="relative w-full overflow-hidden p-6">
      {/* Gradient border accent (top edge) */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r ${colors.border}`}
      />

      {/* Subtle inner glow blob */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl bg-white/5" />

      <div className="relative flex items-start gap-4">
        {/* AI Icon Badge */}
        <div className={`shrink-0 rounded-2xl border p-3 ${colors.badge}`}>
          <Sparkles className="h-5 w-5" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-widest ${textTertiary}`}>
              AI Insight
            </span>
            {/* Animated indicator */}
            <div className="relative flex items-center ml-2">
              <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-sky-400 opacity-70 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
            </div>
          </div>

          {/* ✅ framer-motion সরানো হয়েছে — CSS animation-fill-mode দিয়ে fade-in */}
          <p
            key={insight}
            className={`text-base font-medium leading-relaxed ${textPrimary}`}
            style={{
              animation: "ai-fade-in 0.4s ease-out both",
            }}
          >
            {insight}
          </p>
        </div>
      </div>

      {/* ✅ Inline keyframe — zero JS, GPU composited opacity */}
      <style>{`
        @keyframes ai-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </GlassCard>
  );
}