"use client";

import GlassCard from "@/components/ui/GlassCard";
import { useImpactCalendar } from "@/hooks/useImpactCalendar";
import { ImpactDay } from "@/lib/impact-intelligence";
import { ImpactCalendarSkeleton } from "@/components/weather/CardSkeletons";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    Bug,
    CalendarDays,
    Flower2,
    HeartPulse,
    Plane,
    TreePine,
    Wind,
} from "lucide-react";
import React, { memo, useMemo, useState } from "react";

type CategoryType = "health" | "travel" | "outdoor" | "airQuality" | "pests" | "allergies";

const CATEGORIES: { id: CategoryType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "health", label: "Health", icon: HeartPulse },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "outdoor", label: "Outdoor", icon: TreePine },
  { id: "airQuality", label: "Air Quality", icon: Wind },
  { id: "pests", label: "Pests", icon: Bug },
  { id: "allergies", label: "Allergies", icon: Flower2 },
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

function getCategoryValue(day: ImpactDay, category: CategoryType): { status: "GOOD" | "FAIR" | "IDEAL" | "POOR" | "HIGH" | "LOW"; label: string } {
  if (category === "health") {
    const band = healthBand(day.health);
    return { status: band, label: `${day.health}` };
  }

  if (category === "travel") return { status: day.travel, label: day.travel };
  if (category === "outdoor") return { status: day.outdoor, label: day.outdoor };
  if (category === "airQuality") return { status: day.airQuality, label: day.airQuality };
  if (category === "pests") return { status: day.pests, label: day.pests };
  return { status: day.allergies, label: day.allergies };
}

function buildDetailRows(day: ImpactDay) {
  return [
    { label: "Health", value: `${day.health}` },
    { label: "Travel", value: day.travel },
    { label: "Outdoor", value: day.outdoor },
    { label: "Air Quality", value: day.airQuality },
    { label: "Pests", value: day.pests },
    { label: "Allergies", value: day.allergies },
  ];
}



export const ImpactCalendar = memo(function ImpactCalendar({ lat, lon }: ImpactCalendarProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("health");
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const { data, loading, error } = useImpactCalendar(lat, lon);

  const days = data?.days ?? [];

  const boundedSelectedDay = useMemo(() => {
    if (days.length === 0) return 0;
    if (selectedDay >= days.length) return days.length - 1;
    return selectedDay;
  }, [days.length, selectedDay]);

  const activeDay = days[boundedSelectedDay];
  const activeValue = activeDay ? getCategoryValue(activeDay, activeCategory) : { status: "POOR" as const, label: "-" };

  if (loading) {
    return <ImpactCalendarSkeleton />;
  }

  if (error || days.length === 0) {
    return (
      <GlassCard className="w-full p-6 border-white/10 bg-white/5 overflow-hidden">
        <div className="flex items-center gap-2 text-rose-300 mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-semibold">Impact Intelligence unavailable</span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          {error ?? "Could not load impact data. Showing no forecast right now."}
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="w-full p-6 border-white/10 bg-white/5 overflow-hidden">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-400" />
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
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedDay(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeCategory === cat.id
                  ? "bg-emerald-500 border-emerald-400 text-white"
                  : "bg-white/5 border-white/5 text-white/40 hover:text-white/70"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[9px] font-black text-white/30 text-center uppercase py-1">
            {d}
          </div>
        ))}

        {days.map((day, idx) => {
          const value = getCategoryValue(day, activeCategory);
          return (
            <motion.button
              key={day.date}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDay(idx)}
              className={`relative h-8 w-full rounded-md border flex items-center justify-center transition-all ${getColorClass(value.status)} ${
                boundedSelectedDay === idx ? "ring-2 ring-white scale-105 z-10" : "opacity-85 hover:opacity-100"
              }`}
            >
              <span className="text-[10px] font-bold text-white select-none">{idx + 1}</span>
              {boundedSelectedDay === idx && (
                <motion.div layoutId="impactDay" className="absolute inset-0 rounded-md border-2 border-white" />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCategory}-${boundedSelectedDay}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-black/20 rounded-2xl p-4 border border-white/5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Day {boundedSelectedDay + 1}</p>
              <h4 className="text-lg font-black text-white">{CATEGORIES.find((c) => c.id === activeCategory)?.label}</h4>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${getColorClass(activeValue.status)}`}>
              {activeValue.label}
            </div>
          </div>

          {activeDay && (
            <div className="space-y-2">
              {buildDetailRows(activeDay).map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/5 px-3 py-2">
                  <span className="text-xs font-semibold text-white/70">{row.label}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${getColorClass(
                    row.label === "Health" ? healthBand(activeDay.health) : (row.value as "GOOD" | "FAIR" | "IDEAL" | "POOR" | "HIGH" | "LOW")
                  )} text-white`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between px-1">
        <span className="text-[9px] font-black text-rose-400 uppercase tracking-tighter">POOR / HIGH</span>
        <div className="flex-1 mx-3 h-1 rounded-full bg-white/10 opacity-80" />
        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">GOOD / LOW</span>
      </div>
    </GlassCard>
  );
});
