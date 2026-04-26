"use client";

import GlassCard from "@/components/ui/GlassCard";
import { useLoveCalendar } from "@/hooks/useLoveCalendar";
import {
  LoveDay,
  LoveSubTab,
  findBestLoveDay,
  getLoveLabelEmoji,
  getLoveScoreColor,
  getLoveSubTabValue,
} from "@/lib/love-intelligence";
import { LoveCalendarSkeleton } from "@/components/weather/CardSkeletons";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Heart,
  Sparkles,
  MessageCircleHeart,
  Flame,
  Brain,
  TrendingUp,
  Shield,
  Users,
} from "lucide-react";
import React, { memo, useMemo, useState } from "react";

const SUB_TABS: { id: LoveSubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "romance", label: "Romance Mood", icon: Heart },
  { id: "compatibility", label: "Compatibility", icon: Sparkles },
  { id: "dating", label: "Dating Conditions", icon: Flame },
  { id: "emotional", label: "Emotional Energy", icon: Brain },
];

interface LoveCalendarProps {
  lat: number;
  lon: number;
}

function buildLoveDetailRows(day: LoveDay) {
  return [
    { label: "Romance Score", value: `${day.romanceScore}/100`, score: day.romanceScore, icon: Heart },
    { label: "Emotional Stability", value: `${day.emotionalStability}/100`, score: day.emotionalStability, icon: Shield },
    { label: "Communication Level", value: `${day.communicationLevel}/100`, score: day.communicationLevel, icon: MessageCircleHeart },
    { label: "Attraction Energy", value: `${day.attractionEnergy}/100`, score: day.attractionEnergy, icon: Flame },
  ];
}

function getAudienceLabel(hint: "singles" | "couples" | "married"): string {
  switch (hint) {
    case "singles": return "Singles";
    case "couples": return "Couples";
    case "married": return "Married";
  }
}

function getAudienceIcon(hint: "singles" | "couples" | "married") {
  switch (hint) {
    case "singles": return TrendingUp;
    case "couples": return Heart;
    case "married": return Users;
  }
}

export const LoveCalendar = memo(function LoveCalendar({ lat, lon }: LoveCalendarProps) {
  const [activeTab, setActiveTab] = useState<LoveSubTab>("romance");
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const { data, loading, error } = useLoveCalendar(lat, lon);

  const days = data?.days ?? [];

  const boundedSelectedDay = useMemo(() => {
    if (days.length === 0) return 0;
    if (selectedDay >= days.length) return days.length - 1;
    return selectedDay;
  }, [days.length, selectedDay]);

  const activeDay = days[boundedSelectedDay];
  const activeValue = activeDay ? getLoveSubTabValue(activeDay, activeTab) : { score: 0, label: "-" };

  const bestDay = useMemo(() => findBestLoveDay(days), [days]);

  if (loading) {
    return <LoveCalendarSkeleton />;
  }

  if (error || days.length === 0) {
    return (
      <GlassCard className="w-full p-6 border-white/10 bg-white/5 overflow-hidden">
        <div className="flex items-center gap-2 text-rose-300 mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-semibold">Love & Dating Intelligence unavailable</span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          {error ?? "Could not load love data. Showing no forecast right now."}
        </p>
      </GlassCard>
    );
  }

  const AudienceIcon = activeDay ? getAudienceIcon(activeDay.audienceHint) : Heart;

  return (
    <GlassCard className="w-full p-6 border-white/10 bg-white/5 overflow-hidden">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            Love & Dating
          </h3>
          <div className="text-[10px] font-black bg-white/5 px-2 py-1 rounded text-white/50 uppercase tracking-widest">
            30-Day Outlook
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedDay(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === tab.id
                  ? "bg-rose-500 border-rose-400 text-white"
                  : "bg-white/5 border-white/5 text-white/40 hover:text-white/70"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[9px] font-black text-white/30 text-center uppercase py-1">
            {d}
          </div>
        ))}

        {days.map((day, idx) => {
          const value = getLoveSubTabValue(day, activeTab);
          return (
            <motion.button
              key={day.date}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(idx)}
              className={`relative h-8 w-full rounded-md border flex items-center justify-center transition-all ${getLoveScoreColor(value.score)} ${
                boundedSelectedDay === idx ? "ring-2 ring-white scale-105 z-10" : "opacity-85 hover:opacity-100"
              }`}
            >
              <span className="text-[10px] font-bold text-white select-none">{idx + 1}</span>
              {boundedSelectedDay === idx && (
                <motion.div layoutId="loveDay" className="absolute inset-0 rounded-md border-2 border-white" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Best day of the week hook */}
      {bestDay && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="text-[11px] font-bold text-rose-300">
            Best day this week for love: <span className="text-white">{bestDay.dayName}</span>
          </span>
        </div>
      )}

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${boundedSelectedDay}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-black/20 rounded-2xl p-4 border border-white/5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Day {boundedSelectedDay + 1}</p>
              <h4 className="text-lg font-black text-white">{SUB_TABS.find((t) => t.id === activeTab)?.label}</h4>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${getLoveScoreColor(activeValue.score)}`}>
              {activeValue.label}
            </div>
          </div>

          {/* Love Score Label */}
          {activeDay && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-base">{getLoveLabelEmoji(activeDay.loveLabel)}</span>
              <span className="text-xs font-bold text-white">{activeDay.loveLabel} Love Day</span>
              <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-white/50">
                <AudienceIcon className="w-3 h-3" />
                {getAudienceLabel(activeDay.audienceHint)}
              </span>
            </div>
          )}

          {/* Detail rows */}
          {activeDay && (
            <div className="space-y-2">
              {buildLoveDetailRows(activeDay).map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <row.icon className="w-3 h-3 text-white/40" />
                    <span className="text-xs font-semibold text-white/70">{row.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Mini progress bar */}
                    <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.score}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          row.score >= 75 ? "bg-rose-400" : row.score >= 50 ? "bg-pink-400" : row.score >= 30 ? "bg-violet-400" : "bg-slate-400"
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${getLoveScoreColor(row.score)} text-white`}>
                      {row.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Insight */}
          {activeDay && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 px-3 py-3 rounded-xl bg-gradient-to-r from-rose-500/8 to-violet-500/8 border border-rose-500/10"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                <p className="text-[11px] font-medium text-white/80 leading-relaxed italic">
                  &ldquo;{activeDay.insight}&rdquo;
                </p>
              </div>
            </motion.div>
          )}

          {/* Tag badges */}
          {activeDay && activeDay.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeDay.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-gradient-to-r from-rose-500/15 to-pink-500/15 border border-rose-500/20 text-rose-300"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between px-1">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">LOW 💔</span>
        <div className="flex-1 mx-3 h-1 rounded-full bg-gradient-to-r from-slate-500/30 via-violet-500/30 via-pink-500/30 to-rose-500/30 opacity-80" />
        <span className="text-[9px] font-black text-rose-400 uppercase tracking-tighter">EXCELLENT ❤️</span>
      </div>
    </GlassCard>
  );
});
