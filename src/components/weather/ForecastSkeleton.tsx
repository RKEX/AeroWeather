"use client";

import { Skeleton } from "@/components/ui/skeleton";
import SkeletonCard from "@/components/ui/skeleton-card";
import { memo } from "react";

export const HourlyForecastSkeleton = memo(function HourlyForecastSkeleton() {
  return (
    <SkeletonCard className="w-full p-6">
      <Skeleton className="mb-6 h-7 w-44 bg-white/5" />

      {/* Timeline cards skeleton */}
      <div className="flex gap-4 overflow-hidden pb-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex min-w-17.5 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3"
          >
            <Skeleton className="mb-2 h-4 w-10 bg-white/5" />
            <Skeleton className="mb-2 h-6 w-6 rounded-full bg-white/5" />
            <Skeleton className="h-5 w-8 bg-white/5" />
            <Skeleton className="mt-1 h-2.5 w-7 bg-white/5 invisible" />
          </div>
        ))}
      </div>

      <div className="mt-4 h-48 w-full rounded-2xl border border-white/10 bg-white/5 p-4">
        <Skeleton className="h-full w-full bg-white/5" />
      </div>
    </SkeletonCard>
  );
});

export const DailyForecastSkeleton = memo(function DailyForecastSkeleton() {
  return (
    <SkeletonCard className="flex w-full flex-col gap-3 p-6">
      <Skeleton className="mb-2 h-7 w-40 bg-white/5" />

      <div className="flex flex-col gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <Skeleton className="h-4 w-28 shrink-0 bg-white/5" />
            
            <div className="flex flex-1 items-center justify-center gap-1.5">
              <Skeleton className="h-5 w-5 rounded-full bg-white/5" />
              <Skeleton className="h-2.5 w-6 bg-white/5" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-4 w-8 bg-white/5" />
              <Skeleton className="h-4 w-8 bg-white/5" />
            </div>

            <Skeleton className="h-4 w-4 shrink-0 bg-white/5" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  );
});
