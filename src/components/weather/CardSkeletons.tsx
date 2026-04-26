"use client";

import { Skeleton } from "@/components/ui/skeleton";
import SkeletonCard from "@/components/ui/skeleton-card";
import { memo } from "react";

export const AiWeatherInsightSkeleton = memo(function AiWeatherInsightSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-32 flex flex-col gap-3">
      <Skeleton className="h-6 w-40 bg-white/5" />
      <Skeleton className="h-10 w-full bg-white/5" />
    </SkeletonCard>
  );
});

export const AqiCardSkeleton = memo(function AqiCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-64 flex flex-col gap-4">
      <Skeleton className="h-6 w-32 bg-white/5" />
      <Skeleton className="h-20 w-full bg-white/5" />
      <Skeleton className="h-6 w-48 bg-white/5" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 bg-white/5" />
        <Skeleton className="h-10 flex-1 bg-white/5" />
        <Skeleton className="h-10 flex-1 bg-white/5" />
      </div>
    </SkeletonCard>
  );
});

export const AstroPanelSkeleton = memo(function AstroPanelSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-64 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32 bg-white/5" />
        <Skeleton className="h-8 w-24 rounded-xl bg-white/5" />
      </div>
      <div className="flex justify-center flex-1">
        <Skeleton className="h-32 w-32 rounded-full bg-white/5" />
      </div>
    </SkeletonCard>
  );
});

export const ImpactCalendarSkeleton = memo(function ImpactCalendarSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 overflow-hidden flex flex-col">
      <Skeleton className="h-6 w-40 rounded bg-white/5" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-8 rounded bg-white/5" />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-7 gap-2 flex-1">
        {Array.from({ length: 35 }).map((_, idx) => (
          <Skeleton key={idx} className="h-8 w-full rounded bg-white/5" />
        ))}
      </div>
      <Skeleton className="mt-6 h-28 rounded-2xl bg-white/5" />
    </SkeletonCard>
  );
});

export const AirQualityMiniCardSkeleton = memo(function AirQualityMiniCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-48 flex flex-col justify-between">
      <Skeleton className="h-6 w-32 bg-white/5" />
      <Skeleton className="h-12 w-full bg-white/5" />
      <Skeleton className="h-8 w-3/4 bg-white/5" />
    </SkeletonCard>
  );
});

export const RainTimelineCardSkeleton = memo(function RainTimelineCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-48 flex flex-col gap-4">
      <Skeleton className="h-6 w-36 bg-white/5" />
      <div className="flex items-end gap-2 flex-1 pt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 bg-white/5" style={{ height: `${((i * 7) % 60) + 20}%` }} />
        ))}
      </div>
    </SkeletonCard>
  );
});

export const RealFeelCardSkeleton = memo(function RealFeelCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-48 flex flex-col justify-between">
      <Skeleton className="h-6 w-32 bg-white/5" />
      <Skeleton className="h-16 w-1/2 bg-white/5" />
      <Skeleton className="h-6 w-full bg-white/5" />
    </SkeletonCard>
  );
});

export const UVIndexCardSkeleton = memo(function UVIndexCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-48 flex flex-col justify-between">
      <Skeleton className="h-6 w-32 bg-white/5" />
      <Skeleton className="h-16 w-1/2 bg-white/5" />
      <Skeleton className="h-6 w-full bg-white/5" />
    </SkeletonCard>
  );
});

export const WindPressureCardSkeleton = memo(function WindPressureCardSkeleton() {
  return (
    <SkeletonCard className="w-full p-6 h-64 flex flex-col gap-4">
      <Skeleton className="h-6 w-32 bg-white/5" />
      <div className="grid grid-cols-2 gap-4 flex-1">
        <Skeleton className="h-full w-full bg-white/5" />
        <Skeleton className="h-full w-full bg-white/5" />
      </div>
    </SkeletonCard>
  );
});

export const WeatherHeroSkeleton = memo(function WeatherHeroSkeleton() {
  return (
    <SkeletonCard className="w-full p-8 md:p-12 h-80 flex flex-col justify-between rounded-[3rem]">
      <div className="space-y-4">
        <Skeleton className="h-4 w-32 bg-white/5" />
        <Skeleton className="h-12 w-64 bg-white/5" />
      </div>
      <div className="flex items-end justify-between">
        <Skeleton className="h-24 w-40 bg-white/5" />
        <Skeleton className="h-16 w-16 rounded-full bg-white/5" />
      </div>
    </SkeletonCard>
  );
});
