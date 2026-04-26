"use client";

import GlassCard from "@/components/ui/GlassCard";
import { generateLoveSeoContent } from "@/lib/love-seo";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
  Heart,
  Sparkles,
  BookOpen,
  Wind,
  Activity,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { memo, useState, useMemo } from "react";

interface LoveSeoContentProps {
  city: string;
  slug: string;
}

export const LoveSeoContent = memo(function LoveSeoContent({ city, slug }: LoveSeoContentProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);

  const seoContent = useMemo(() => generateLoveSeoContent(city), [city]);

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:py-16">
      {/* ── FAQ Section ── */}
      <GlassCard className="p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Love & Dating FAQ – {city}
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Science-backed answers about weather, mood, and relationships
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {seoContent.faqItems.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                aria-expanded={expandedFaq === index}
              >
                <span className="text-sm font-semibold text-white/90 pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 ${
                    expandedFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-3">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Expandable SEO Long Content ── */}
      <GlassCard className="p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
            <BookOpen className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Weather & Relationship Science
            </h2>
            <p className="text-sm text-white/50 mt-1">
              How atmospheric conditions influence human emotions and romantic behavior
            </p>
          </div>
        </div>

        <div className={`relative ${!showFullContent ? "max-h-[200px] overflow-hidden" : ""}`}>
          <div
            className="prose prose-invert max-w-none text-white/70 
              prose-headings:text-white prose-headings:font-bold prose-headings:text-lg
              prose-p:leading-relaxed prose-p:mb-4 prose-p:text-sm md:prose-p:text-base
              prose-em:text-white/50
              prose-h3:mt-8 prose-h3:mb-3"
            dangerouslySetInnerHTML={{ __html: seoContent.longContent }}
          />

          {!showFullContent && (
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[rgb(13,13,20)] via-[rgb(13,13,20)]/80 to-transparent pointer-events-none" />
          )}
        </div>

        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white/80 hover:bg-white/10 transition-all"
        >
          <Sparkles className="w-3 h-3" />
          {showFullContent ? "Show Less" : "Read Full Analysis"}
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-300 ${showFullContent ? "rotate-180" : ""}`}
          />
        </button>
      </GlassCard>

      {/* ── Internal Links Grid ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href={`/weather/${slug}`} className="group">
          <GlassCard className="p-5 transition-all hover:bg-white/[0.08] hover:border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Wind className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                {city} Weather Forecast
              </span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Full hourly & 7-day forecast with live radar maps
            </p>
            <ExternalLink className="w-3 h-3 text-white/20 mt-2 group-hover:text-white/40 transition-colors" />
          </GlassCard>
        </Link>

        <Link href={`/weather/${slug}`} className="group">
          <GlassCard className="p-5 transition-all hover:bg-white/[0.08] hover:border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Air Quality Index
              </span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Real-time AQI monitoring & pollution data for {city}
            </p>
            <ExternalLink className="w-3 h-3 text-white/20 mt-2 group-hover:text-white/40 transition-colors" />
          </GlassCard>
        </Link>

        <Link href="/blog" className="group">
          <GlassCard className="p-5 transition-all hover:bg-white/[0.08] hover:border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Weather Blog & Insights
              </span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Deep dives into meteorology, climate science & more
            </p>
            <ExternalLink className="w-3 h-3 text-white/20 mt-2 group-hover:text-white/40 transition-colors" />
          </GlassCard>
        </Link>

        <Link href="/" className="group">
          <GlassCard className="p-5 transition-all hover:bg-white/[0.08] hover:border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Explore Other Cities
              </span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Love forecasts & weather intelligence worldwide
            </p>
            <ExternalLink className="w-3 h-3 text-white/20 mt-2 group-hover:text-white/40 transition-colors" />
          </GlassCard>
        </Link>
      </div>

      {/* ── Google Discover Optimized Content Block ── */}
      <GlassCard className="relative overflow-hidden p-8 md:p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-violet-500/5 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
            {seoContent.discoverTitle}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/60 md:text-lg">
            AeroWeather&apos;s Love & Dating Intelligence combines real-time meteorological data
            with behavioral science research to reveal how today&apos;s atmospheric conditions in{" "}
            <strong className="text-white/80">{city}</strong> affect your emotional energy,
            communication patterns, and romantic potential. This is not astrology—it&apos;s
            atmospheric psychology, powered by data you can trust.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["Weather-Powered", "Science-Based", "Updated Daily", "All Relationship Stages"].map(
              (tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white/50"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </GlassCard>
    </section>
  );
});
