"use client";

import { Skeleton } from "@/components/ui/skeleton";
import SkeletonCard from "@/components/ui/skeleton-card";
import { memo } from "react";

export const AiWeatherInsightSkeleton = memo(function AiWeatherInsightSkeleton() {
  return (
    <SkeletonCard className="relative flex h-full w-full flex-col justify-between overflow-hidden p-6">
      <div className="relative flex items-start gap-4">
        {/* AI Icon Badge Skeleton */}
        <Skeleton className="h-11 w-11 shrink-0 rounded-2xl bg-white/5" />
        
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-32 bg-white/5" />
            <Skeleton className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-[90%] bg-white/5" />
          </div>
        </div>
      </div>
    </SkeletonCard>
  );
});

export const AqiCardSkeleton = memo(function AqiCardSkeleton() {
  return (
    <SkeletonCard className="w-full px-6 py-11">
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 bg-white/5" />
          <Skeleton className="h-4 w-32 bg-white/5" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-10 w-16 bg-white/5" />
          <Skeleton className="h-5 w-24 bg-white/5" />
        </div>
      </div>

      {/* Scale Bar Skeleton */}
      <Skeleton className="mb-6 h-2 w-full rounded-full bg-white/5" />

      {/* Pollutants Grid Skeleton */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-3">
            <Skeleton className="mb-1 h-3 w-12 bg-white/5" />
            <Skeleton className="h-5 w-20 bg-white/5" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
});

export const AstroPanelSkeleton = memo(function AstroPanelSkeleton() {
  return (
    <SkeletonCard className="relative w-full p-5 h-[520px] flex flex-col">
      {/* Header & Tabs Skeleton */}
      <div className="flex-none flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 bg-white/5" />
          <Skeleton className="h-3 w-32 bg-white/5" />
        </div>
        <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 gap-1">
          <Skeleton className="h-8 w-16 rounded-lg bg-white/5" />
          <Skeleton className="h-8 w-16 rounded-lg bg-white/5" />
          <Skeleton className="h-8 w-16 rounded-lg bg-white/5" />
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="flex-1 flex flex-col items-center">
        <Skeleton className="h-44 w-44 rounded-full bg-white/5 mt-4" />
        
        <div className="grid grid-cols-2 gap-12 mt-8 w-full max-w-sm">
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-3 w-16 bg-white/5" />
            <Skeleton className="h-6 w-20 bg-white/5" />
          </div>
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-3 w-16 bg-white/5" />
            <Skeleton className="h-6 w-20 bg-white/5" />
          </div>
        </div>

        <div className="w-full mt-10 border-t border-white/5 pt-6 space-y-4">
          <Skeleton className="h-4 w-40 bg-white/5" />
          <Skeleton className="h-24 w-full rounded-xl bg-white/5" />
        </div>
      </div>
    </SkeletonCard>
  );
});

export const ImpactCalendarSkeleton = memo(function ImpactCalendarSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 overflow-hidden flex flex-col">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48 bg-white/5" />
          <Skeleton className="h-5 w-24 bg-white/5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-lg bg-white/5" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full bg-white/5" />
        ))}
        {Array.from({ length: 30 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-md bg-white/5" />
        ))}
      </div>

      <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-3 w-12 bg-white/5" />
            <Skeleton className="h-6 w-24 bg-white/5" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg bg-white/5" />
          ))}
        </div>
      </div>
    </SkeletonCard>
  );
});

export const AirQualityMiniCardSkeleton = memo(function AirQualityMiniCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-full flex flex-col justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32 bg-white/5" />
        <Skeleton className="h-3 w-full bg-white/5" />
      </div>
      <div className="flex justify-between items-end">
        <Skeleton className="h-12 w-20 bg-white/5" />
        <Skeleton className="h-8 w-24 rounded-full bg-white/5" />
      </div>
    </SkeletonCard>
  );
});

export const RainTimelineCardSkeleton = memo(function RainTimelineCardSkeleton() {
  return (
    <SkeletonCard className="relative flex h-full w-full flex-col overflow-hidden p-6">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-6 w-40 bg-white/5" />
        <Skeleton className="h-5 w-20 rounded-full bg-white/5" />
      </div>
      
      <div className="relative flex-1 flex items-end gap-1.5 pt-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 bg-white/5 rounded-t-sm" style={{ height: `${((i * 13) % 70) + 10}%` }} />
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <Skeleton className="h-3 w-12 bg-white/5" />
        <Skeleton className="h-3 w-12 bg-white/5" />
        <Skeleton className="h-3 w-12 bg-white/5" />
      </div>
    </SkeletonCard>
  );
});

export const RealFeelCardSkeleton = memo(function RealFeelCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-full flex flex-col justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32 bg-white/5" />
        <Skeleton className="h-3 w-full bg-white/5" />
      </div>
      <Skeleton className="h-16 w-32 bg-white/5" />
      <Skeleton className="h-4 w-full bg-white/5" />
    </SkeletonCard>
  );
});

export const UVIndexCardSkeleton = memo(function UVIndexCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-full flex flex-col justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32 bg-white/5" />
        <Skeleton className="h-3 w-full bg-white/5" />
      </div>
      <Skeleton className="h-16 w-32 bg-white/5" />
      <Skeleton className="h-4 w-full bg-white/5" />
    </SkeletonCard>
  );
});

export const WindPressureCardSkeleton = memo(function WindPressureCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-full flex flex-col gap-6">
      <Skeleton className="h-7 w-40 bg-white/5" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <Skeleton className="h-full min-h-[120px] w-full rounded-2xl bg-white/5" />
        <Skeleton className="h-full min-h-[120px] w-full rounded-2xl bg-white/5" />
      </div>
    </SkeletonCard>
  );
});

export const WeatherHeroSkeleton = memo(function WeatherHeroSkeleton() {
  return (
    <SkeletonCard className="p-6">
      <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Skeleton className="mb-1 h-9 w-64 bg-white/5" />
          <Skeleton className="mb-6 h-6 w-32 bg-white/5" />

          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 bg-white/5" />
            <Skeleton className="h-24 w-40 bg-white/5" />
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex min-w-17.5 h-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3">
              <Skeleton className="h-6 w-6 bg-white/5" />
              <div className="mt-2 flex flex-col items-center gap-1">
                <Skeleton className="h-3 w-12 bg-white/5" />
                <Skeleton className="h-5 w-16 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonCard>
  );
});
