"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import GlassCard from "@/components/ui/GlassCard";
import {
    generateWeatherInsight,
    type InsightCategory,
} from "@/lib/ai-insight";
import type { TranslationKey } from "@/lib/i18n";
import { WeatherData } from "@/types/weather";
import {
    CloudLightning,
    CloudRain,
    CloudSnow,
    Droplets,
    Flame,
    MoonStar,
    Snowflake,
    Sparkles,
    Sun,
    Wind,
    type LucideIcon,
} from "lucide-react";

interface AiWeatherInsightProps {
  weather: WeatherData;
  dayIndex?: number;
}

function accentTheme(category: InsightCategory): {
  labelKey: TranslationKey;
  icon: LucideIcon;
  border: string;
  glow: string;
  badge: string;
  indicatorOuter: string;
  indicatorInner: string;
} {
  if (category === "rain") {
    return {
      labelKey: "insightRainOutlook",
      icon: CloudRain,
      border: "from-blue-500/40 via-cyan-500/20 to-transparent",
      glow: "shadow-blue-500/20",
      badge: "bg-blue-500/20 text-blue-200 border-blue-500/30",
      indicatorOuter: "bg-sky-400",
      indicatorInner: "bg-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]",
    };
  }

  if (category === "storm") {
    return {
      labelKey: "insightStormAdvisory",
      icon: CloudLightning,
      border: "from-purple-500/40 via-violet-500/20 to-transparent",
      glow: "shadow-purple-500/20",
      badge: "bg-purple-500/20 text-purple-200 border-purple-500/30",
      indicatorOuter: "bg-violet-400",
      indicatorInner: "bg-violet-300 shadow-[0_0_6px_rgba(196,181,253,0.8)]",
    };
  }

  if (category === "snow") {
    return {
      labelKey: "insightSnowWatch",
      icon: CloudSnow,
      border: "from-sky-400/40 via-blue-300/20 to-transparent",
      glow: "shadow-sky-400/20",
      badge: "bg-sky-400/20 text-sky-200 border-sky-400/30",
      indicatorOuter: "bg-cyan-300",
      indicatorInner: "bg-cyan-200 shadow-[0_0_6px_rgba(103,232,249,0.75)]",
    };
  }

  if (category === "wind") {
    return {
      labelKey: "insightWindTrend",
      icon: Wind,
      border: "from-teal-400/40 via-emerald-400/20 to-transparent",
      glow: "shadow-teal-400/20",
      badge: "bg-teal-400/20 text-teal-200 border-teal-400/30",
      indicatorOuter: "bg-emerald-300",
      indicatorInner: "bg-emerald-200 shadow-[0_0_6px_rgba(110,231,183,0.8)]",
    };
  }

  if (category === "humidity") {
    return {
      labelKey: "insightHumiditySignal",
      icon: Droplets,
      border: "from-emerald-500/40 via-teal-500/20 to-transparent",
      glow: "shadow-emerald-500/20",
      badge: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
      indicatorOuter: "bg-emerald-400",
      indicatorInner: "bg-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.85)]",
    };
  }

  if (category === "uv") {
    return {
      labelKey: "insightUvAlert",
      icon: Sun,
      border: "from-amber-500/40 via-orange-500/20 to-transparent",
      glow: "shadow-amber-500/20",
      badge: "bg-amber-500/20 text-amber-200 border-amber-500/30",
      indicatorOuter: "bg-amber-300",
      indicatorInner: "bg-amber-200 shadow-[0_0_6px_rgba(252,211,77,0.8)]",
    };
  }

  if (category === "heat") {
    return {
      labelKey: "insightHeatSignal",
      icon: Flame,
      border: "from-orange-500/40 via-red-500/20 to-transparent",
      glow: "shadow-orange-500/20",
      badge: "bg-orange-500/20 text-orange-200 border-orange-500/30",
      indicatorOuter: "bg-orange-300",
      indicatorInner: "bg-orange-200 shadow-[0_0_6px_rgba(253,186,116,0.8)]",
    };
  }

  if (category === "cold") {
    return {
      labelKey: "insightColdTrend",
      icon: Snowflake,
      border: "from-cyan-500/40 via-sky-500/20 to-transparent",
      glow: "shadow-cyan-500/20",
      badge: "bg-cyan-500/20 text-cyan-200 border-cyan-500/30",
      indicatorOuter: "bg-cyan-300",
      indicatorInner: "bg-cyan-200 shadow-[0_0_6px_rgba(103,232,249,0.85)]",
    };
  }

  if (category === "clear") {
    return {
      labelKey: "insightClearWindow",
      icon: MoonStar,
      border: "from-indigo-500/40 via-sky-500/20 to-transparent",
      glow: "shadow-indigo-500/20",
      badge: "bg-indigo-500/20 text-indigo-200 border-indigo-500/30",
      indicatorOuter: "bg-indigo-300",
      indicatorInner: "bg-indigo-200 shadow-[0_0_6px_rgba(165,180,252,0.8)]",
    };
  }

  return {
    labelKey: "insightAiInsight",
    icon: Sparkles,
    border: "from-indigo-400/40 via-violet-400/20 to-transparent",
    glow: "shadow-indigo-400/20",
    badge: "bg-indigo-400/20 text-indigo-200 border-indigo-400/30",
    indicatorOuter: "bg-indigo-300",
    indicatorInner: "bg-indigo-200 shadow-[0_0_6px_rgba(165,180,252,0.8)]",
  };
}

export function AiWeatherInsight({ weather, dayIndex = -1 }: AiWeatherInsightProps) {
  const textPrimary = "text-white";
  const textTertiary = "text-white/60";
  const { t } = useLanguage();

  const insight = generateWeatherInsight(weather, dayIndex);
  const theme = accentTheme(insight.category);
  const Icon = theme.icon;

  return (
    <GlassCard className={`relative flex h-full w-full flex-col justify-between overflow-hidden p-6 ${theme.glow}`}>
      {/* Gradient border accent (top edge) */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r ${theme.border}`}
      />

      {/* Subtle inner glow blob */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl bg-white/5" />

      <div className="relative flex items-start gap-4">
        {/* AI Icon Badge */}
        <div
          className={`shrink-0 rounded-2xl border p-3 ${theme.badge}`}
          style={{ animation: "ai-pop-in 0.35s ease-out both" }}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-widest ${textTertiary}`}>
              {t(theme.labelKey)}
            </span>
            {/* Animated indicator */}
            <div className="relative ml-2 flex items-center">
              <span
                className={`absolute inline-flex h-2.5 w-2.5 rounded-full opacity-70 animate-ping ${theme.indicatorOuter}`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${theme.indicatorInner}`}
              />
            </div>
          </div>

          <p
            key={`${insight.category}:${insight.message}`}
            className={`text-base font-medium leading-relaxed ${textPrimary}`}
            style={{ animation: "ai-fade-in 0.45s ease-out both" }}
          >
            {insight.message}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes ai-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ai-pop-in {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </GlassCard>
  );
}
