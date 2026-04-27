"use client";

import GlassCard from "@/components/ui/GlassCard";
import { useImpactCalendar } from "@/hooks/useImpactCalendar";
import { ImpactDay } from "@/lib/impact-intelligence";
import { ImpactCalendarSkeleton } from "@/components/weather/CardSkeletons";
import { AnimatePresence, motion } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Brain,
    Bug,
    CalendarDays,
    Cloud,
    Flame,
    Flower2,
    Heart,
    HeartPulse,
    MessageCircleHeart,
    Plane,
    Shield,
    Sparkles,
    TreePine,
    Wind,
} from "lucide-react";
import Link from "next/link";
import React, { memo, useMemo, useState } from "react";

type CategoryType = "health" | "travel" | "outdoor" | "airQuality" | "pests" | "allergies" | "love" | "meditation";
type LoveSubTab = "romance" | "compatibility" | "dating" | "emotional";
type MindSubTab = "focus" | "stress" | "clarity" | "relaxation";

const CATEGORIES: { id: CategoryType; label: string; icon: React.ComponentType<{ className?: string }>; activeColor: string }[] = [
  { id: "health", label: "Health", icon: HeartPulse, activeColor: "bg-emerald-500 border-emerald-400" },
  { id: "travel", label: "Travel", icon: Plane, activeColor: "bg-emerald-500 border-emerald-400" },
  { id: "outdoor", label: "Outdoor", icon: TreePine, activeColor: "bg-emerald-500 border-emerald-400" },
  { id: "airQuality", label: "Air Quality", icon: Wind, activeColor: "bg-emerald-500 border-emerald-400" },
  { id: "pests", label: "Pests", icon: Bug, activeColor: "bg-emerald-500 border-emerald-400" },
  { id: "allergies", label: "Allergies", icon: Flower2, activeColor: "bg-emerald-500 border-emerald-400" },
  { id: "love", label: "Love & Dating", icon: Heart, activeColor: "bg-rose-500 border-rose-400" },
  { id: "meditation", label: "Meditation & Mind", icon: Brain, activeColor: "bg-indigo-500 border-indigo-400" },
];

const LOVE_SUBTABS: { id: LoveSubTab; label: string }[] = [
  { id: "romance", label: "Romance Mood" },
  { id: "compatibility", label: "Compatibility" },
  { id: "dating", label: "Dating Conditions" },
  { id: "emotional", label: "Emotional Energy" },
];

const MIND_SUBTABS: { id: MindSubTab; label: string }[] = [
  { id: "focus", label: "Focus Level" },
  { id: "stress", label: "Stress Index" },
  { id: "clarity", label: "Mental Clarity" },
  { id: "relaxation", label: "Relaxation Score" },
];

interface ImpactCalendarProps {
  lat: number;
  lon: number;
}

function healthBand(value: number): "GOOD" | "FAIR" | "POOR" {
  if (value >= 75) return "GOOD";
  if (value >= 50) return "FAIR";
  return "POOR";
}

function getColorClass(value: "GOOD" | "FAIR" | "IDEAL" | "POOR" | "HIGH" | "LOW") {
  if (value === "HIGH") return "bg-rose-500 border-rose-300/40";
  if (value === "POOR") return "bg-orange-500 border-orange-300/40";
  if (value === "LOW") return "bg-emerald-500 border-emerald-300/40";
  if (value === "GOOD") return "bg-emerald-500 border-emerald-300/40";
  if (value === "IDEAL") return "bg-emerald-400 border-emerald-300/40";
  return "bg-teal-500 border-teal-300/40";
}

function getLoveColorClass(score: number): string {
  if (score >= 75) return "bg-rose-500 border-rose-300/40";
  if (score >= 55) return "bg-pink-500 border-pink-300/40";
  if (score >= 35) return "bg-violet-500 border-violet-300/40";
  return "bg-slate-500 border-slate-300/40";
}

function getMindColorClass(score: number, invert = false): string {
  // For stress, higher is worse (inverted)
  const adjusted = invert ? 100 - score : score;
  if (adjusted >= 75) return "bg-indigo-500 border-indigo-300/40";
  if (adjusted >= 55) return "bg-blue-500 border-blue-300/40";
  if (adjusted >= 35) return "bg-purple-500 border-purple-300/40";
  return "bg-slate-500 border-slate-300/40";
}

function getCategoryValue(day: ImpactDay, category: CategoryType, loveSub: LoveSubTab, mindSub: MindSubTab): { status: "GOOD" | "FAIR" | "IDEAL" | "POOR" | "HIGH" | "LOW"; label: string; score?: number } {
  if (category === "health") return { status: healthBand(day.health), label: `${day.health}` };
  if (category === "travel") return { status: day.travel, label: day.travel };
  if (category === "outdoor") return { status: day.outdoor, label: day.outdoor };
  if (category === "airQuality") return { status: day.airQuality, label: day.airQuality };
  if (category === "pests") return { status: day.pests, label: day.pests };
  if (category === "allergies") return { status: day.allergies, label: day.allergies };
  
  if (category === "love") {
    let score = 0;
    if (loveSub === "romance") score = day.romanceScore;
    if (loveSub === "compatibility") score = Math.round((day.emotionalStability + day.communicationLevel) / 2);
    if (loveSub === "dating") score = day.attractionEnergy;
    if (loveSub === "emotional") score = day.emotionalStability;
    return { status: score >= 60 ? "GOOD" : "POOR", label: `${score}`, score };
  }

  if (category === "meditation") {
    let score = 0;
    if (mindSub === "focus") score = day.focusLevel;
    if (mindSub === "stress") score = day.stressIndex;
    if (mindSub === "clarity") score = day.mentalClarity;
    if (mindSub === "relaxation") score = day.relaxationScore;
    return { status: score >= 60 ? "GOOD" : "POOR", label: `${score}`, score };
  }

  return { status: "POOR", label: "-" };
}

const LOVE_LABEL_EMOJI: Record<string, string> = { Excellent: "❤️", Good: "💚", Neutral: "⚪", Low: "💔" };
const MIND_LABEL_EMOJI: Record<string, string> = { Peak: "✨", Good: "🧘", Moderate: "⚖️", Low: "☁️" };

function findBestDay(days: ImpactDay[], metric: (d: ImpactDay) => number): string | null {
  if (days.length === 0) return null;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let bestIdx = 0;
  let bestScore = -1;
  for (let i = 0; i < Math.min(days.length, 7); i++) {
    const s = metric(days[i]);
    if (s > bestScore) {
      bestScore = s;
      bestIdx = i;
    }
  }
  const d = new Date(`${days[bestIdx].date}T00:00:00.000Z`);
  return dayNames[d.getUTCDay()];
}

export const ImpactCalendar = memo(function ImpactCalendar({ lat, lon }: ImpactCalendarProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("health");
  const [loveSubTab, setLoveSubTab] = useState<LoveSubTab>("romance");
  const [mindSubTab, setMindSubTab] = useState<MindSubTab>("focus");
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [locationName] = useState(() => {
    if (typeof window === "undefined") return "your location";
    try {
      const saved = localStorage.getItem("aeroweather_location");
      if (saved) {
        const parsed = JSON.parse(saved) as { name?: string };
        if (parsed.name) return parsed.name;
      }
    } catch { /* ignore */ }
    return "your location";
  });

  const { data, loading, error } = useImpactCalendar(lat, lon);
  const days = useMemo(() => data?.days ?? [], [data?.days]);

  const boundedSelectedDay = useMemo(() => {
    if (days.length === 0) return 0;
    return Math.min(selectedDay, days.length - 1);
  }, [days.length, selectedDay]);

  const activeDay = days[boundedSelectedDay];
  const isLoveTab = activeCategory === "love";
  const isMindTab = activeCategory === "meditation";

  const bestLoveDay = useMemo(() => isLoveTab ? findBestDay(days, d => d.romanceScore) : null, [days, isLoveTab]);
  const bestMindDay = useMemo(() => isMindTab ? findBestDay(days, d => d.focusLevel) : null, [days, isMindTab]);

  if (loading) return <ImpactCalendarSkeleton />;
  if (error || days.length === 0) {
    return (
      <GlassCard className="w-full p-6 border-white/10 bg-white/5 overflow-hidden">
        <div className="flex items-center gap-2 text-rose-300 mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-semibold">Impact Intelligence unavailable</span>
        </div>
      </GlassCard>
    );
  }

  // Generate dynamic SEO based on category
  const getSeoData = () => {
    const city = locationName;
    if (isLoveTab) {
      return {
        title: `Love & Dating Forecast in ${city} | Relationship Insights`,
        desc: `Check today's love and dating conditions in ${city}. AI-powered relationship insights based on real weather data.`,
        about: "relationships, dating, emotional wellness"
      };
    }
    if (isMindTab) {
      return {
        title: `Mental Clarity & Meditation Forecast in ${city} | Focus & Stress Insights`,
        desc: `Discover today's mental clarity, focus level, and stress insights in ${city}. Powered by weather-based intelligence.`,
        about: "mental health, meditation, stress, focus"
      };
    }
    return null;
  };

  const seoData = getSeoData();

  return (
    <GlassCard className="w-full p-6 border-white/10 bg-white/5 overflow-hidden">
      {seoData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["WebPage", "Article"],
            headline: seoData.title,
            description: seoData.desc,
            datePublished: new Date().toISOString(),
            about: { "@type": "Thing", name: seoData.about }
          })
        }} />
      )}

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className={`w-5 h-5 ${isLoveTab ? "text-rose-400" : isMindTab ? "text-indigo-400" : "text-emerald-400"}`} />
            Impact Intelligence
          </h3>
          <div className="text-[10px] font-black bg-white/5 px-2 py-1 rounded text-white/50 uppercase tracking-widest">
            30-Day Outlook
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSelectedDay(0); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeCategory === cat.id ? `${cat.activeColor} text-white` : "bg-white/5 border-white/5 text-white/40 hover:text-white/70"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sub-tabs for Love & Dating */}
        {isLoveTab && (
          <div className="flex flex-wrap gap-2 mt-2 bg-black/20 p-2 rounded-xl">
            {LOVE_SUBTABS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setLoveSubTab(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  loveSubTab === sub.id ? "bg-rose-500/20 text-rose-300" : "text-white/40 hover:text-white/60"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Sub-tabs for Meditation & Mind */}
        {isMindTab && (
          <div className="flex flex-wrap gap-2 mt-2 bg-black/20 p-2 rounded-xl">
            {MIND_SUBTABS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setMindSubTab(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mindSubTab === sub.id ? "bg-indigo-500/20 text-indigo-300" : "text-white/40 hover:text-white/60"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[9px] font-black text-white/30 text-center uppercase py-1">{d}</div>
        ))}
        {days.map((day, idx) => {
          const value = getCategoryValue(day, activeCategory, loveSubTab, mindSubTab);
          let cellColor = getColorClass(value.status);
          if (isLoveTab && value.score !== undefined) cellColor = getLoveColorClass(value.score);
          if (isMindTab && value.score !== undefined) cellColor = getMindColorClass(value.score, mindSubTab === "stress");

          return (
            <motion.button
              key={day.date}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(idx)}
              className={`relative h-8 w-full rounded-md border flex items-center justify-center transition-all ${cellColor} ${
                boundedSelectedDay === idx ? "ring-2 ring-white scale-105 z-10" : "opacity-85 hover:opacity-100"
              }`}
            >
              <span className="text-[10px] font-bold text-white select-none">{idx + 1}</span>
              {boundedSelectedDay === idx && <motion.div layoutId="impactDay" className="absolute inset-0 rounded-md border-2 border-white" />}
            </motion.button>
          );
        })}
      </div>

      {/* Engagement Hooks */}
      {isLoveTab && bestLoveDay && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="text-[11px] font-bold text-rose-300">
            Best day for love this week: <span className="text-white">{bestLoveDay}</span>
          </span>
        </div>
      )}

      {isMindTab && bestMindDay && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
          <Brain className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-[11px] font-bold text-indigo-300">
            Best focus day this week: <span className="text-white">{bestMindDay}</span>
          </span>
        </div>
      )}

      {/* Detail Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCategory}-${boundedSelectedDay}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-black/20 rounded-2xl p-4 border border-white/5"
        >
          {activeDay && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Day {boundedSelectedDay + 1}</p>
                <h4 className="text-lg font-black text-white">{CATEGORIES.find((c) => c.id === activeCategory)?.label}</h4>
              </div>
            </div>
          )}

          {activeDay && !isLoveTab && !isMindTab && (
            <div className="space-y-2">
              {[
                { label: "Health", value: `${activeDay.health}` },
                { label: "Travel", value: activeDay.travel },
                { label: "Outdoor", value: activeDay.outdoor },
                { label: "Air Quality", value: activeDay.airQuality },
                { label: "Pests", value: activeDay.pests },
                { label: "Allergies", value: activeDay.allergies },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/5 px-3 py-2">
                  <span className="text-xs font-semibold text-white/70">{row.label}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${getColorClass(
                    row.label === "Health" ? healthBand(activeDay.health) : (row.value as "GOOD" | "FAIR" | "IDEAL" | "POOR" | "HIGH" | "LOW")
                  )} text-white`}>{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeDay && isLoveTab && (
            <>
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-base">{LOVE_LABEL_EMOJI[activeDay.loveLabel] ?? "⚪"}</span>
                <span className="text-xs font-bold text-white">{activeDay.loveLabel} Love Day</span>
                <span className="ml-auto text-[10px] font-bold text-white/40 capitalize">{activeDay.loveAudience}</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Romance Score", score: activeDay.romanceScore, icon: Heart },
                  { label: "Emotional Stability", score: activeDay.emotionalStability, icon: Shield },
                  { label: "Communication Level", score: activeDay.communicationLevel, icon: MessageCircleHeart },
                  { label: "Attraction Energy", score: activeDay.attractionEnergy, icon: Flame },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/5 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <row.icon className="w-3 h-3 text-white/40" />
                      <span className="text-xs font-semibold text-white/70">{row.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${row.score}%` }} transition={{ duration: 0.6 }}
                          className={`h-full rounded-full ${row.score >= 75 ? "bg-rose-400" : row.score >= 50 ? "bg-pink-400" : "bg-violet-400"}`} />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${getLoveColorClass(row.score)} text-white`}>{row.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-4 px-3 py-3 rounded-xl bg-gradient-to-r from-rose-500/[0.08] to-violet-500/[0.08] border border-rose-500/10">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] font-medium text-white/80 italic">&ldquo;{activeDay.loveInsight}&rdquo;</p>
                </div>
              </motion.div>
              {activeDay.loveTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeDay.loveTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-gradient-to-r from-rose-500/15 to-pink-500/15 border border-rose-500/20 text-rose-300">
                      <Sparkles className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {activeDay && isMindTab && (
            <>
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-base">{MIND_LABEL_EMOJI[activeDay.mindLabel] ?? "⚪"}</span>
                <span className="text-xs font-bold text-white">{activeDay.mindLabel} Clarity</span>
                <span className="ml-auto text-[10px] font-bold text-white/40 capitalize">Mindfulness</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Focus Score", score: activeDay.focusLevel, icon: Brain, invert: false },
                  { label: "Stress Level", score: activeDay.stressIndex, icon: Activity, invert: true },
                  { label: "Calmness Index", score: activeDay.mentalClarity, icon: Cloud, invert: false },
                  { label: "Relaxation Score", score: activeDay.relaxationScore, icon: TreePine, invert: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/5 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <row.icon className="w-3 h-3 text-white/40" />
                      <span className="text-xs font-semibold text-white/70">{row.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${row.score}%` }} transition={{ duration: 0.6 }}
                          className={`h-full rounded-full ${getMindColorClass(row.score, row.invert).split(" ")[0]}`} />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${getMindColorClass(row.score, row.invert)} text-white`}>{row.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-4 px-3 py-3 rounded-xl bg-gradient-to-r from-indigo-500/[0.08] to-blue-500/[0.08] border border-indigo-500/10">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] font-medium text-white/80 italic">Recommended: &ldquo;{activeDay.mindInsight}&rdquo;</p>
                </div>
              </motion.div>
              {activeDay.mindTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeDay.mindTags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-gradient-to-r from-indigo-500/15 to-blue-500/15 border border-indigo-500/20 text-indigo-300">
                      <Brain className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Internal Linking Footer */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2">
            <Link href="/" className="flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white/80 transition-colors">
              View Weather Forecast <ArrowRight className="w-3 h-3" />
            </Link>
            <div className="w-px h-3 bg-white/10 my-auto" />
            <Link href="/" className="flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white/80 transition-colors">
              Check Air Quality <ArrowRight className="w-3 h-3" />
            </Link>
            <div className="w-px h-3 bg-white/10 my-auto" />
            <button onClick={() => setActiveCategory("health")} className="flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white/80 transition-colors">
              Explore Health Impact <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between px-1">
        {isLoveTab ? (
          <>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">LOW 💔</span>
            <div className="flex-1 mx-3 h-1 rounded-full bg-gradient-to-r from-slate-500/30 via-violet-500/30 via-pink-500/30 to-rose-500/30 opacity-80" />
            <span className="text-[9px] font-black text-rose-400 uppercase tracking-tighter">EXCELLENT ❤️</span>
          </>
        ) : isMindTab ? (
          <>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">LOW ☁️</span>
            <div className="flex-1 mx-3 h-1 rounded-full bg-gradient-to-r from-slate-500/30 via-purple-500/30 via-blue-500/30 to-indigo-500/30 opacity-80" />
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">PEAK ✨</span>
          </>
        ) : (
          <>
            <span className="text-[9px] font-black text-rose-400 uppercase tracking-tighter">POOR / HIGH</span>
            <div className="flex-1 mx-3 h-1 rounded-full bg-white/10 opacity-80" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">GOOD / LOW</span>
          </>
        )}
      </div>
    </GlassCard>
  );
});
