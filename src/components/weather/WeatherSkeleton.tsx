"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DailyForecastSkeleton, HourlyForecastSkeleton } from "@/components/weather/ForecastSkeleton";
import { MapSkeleton } from "@/components/weather/MapSkeleton";
import { memo } from "react";

export const WeatherHeroSkeleton = memo(function WeatherHeroSkeleton() {
  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Skeleton className="mb-2 h-9 w-48 bg-white/10" />
          <Skeleton className="mb-6 h-6 w-36 bg-white/10" />

          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full bg-white/15" />
            <Skeleton className="h-24 w-32 bg-white/15" />
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:w-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex min-w-17.5 flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3"
            >
              <Skeleton className="h-6 w-6 rounded-full bg-white/15" />
              <Skeleton className="mt-2 h-3 w-12 bg-white/10" />
              <Skeleton className="mt-1 h-6 w-14 bg-white/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export const WeatherSkeleton = memo(function WeatherSkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-8">
        <WeatherHeroSkeleton />
        <div className="h-32 w-full rounded-3xl border border-white/10 bg-white/5 p-6">
          <Skeleton className="h-full w-full bg-white/10" />
        </div>
        <HourlyForecastSkeleton />
        <MapSkeleton />
      </div>
      <div className="flex flex-col gap-6 lg:col-span-4">
        <DailyForecastSkeleton />
        <div className="h-48 w-full rounded-3xl border border-white/10 bg-white/5 p-6">
          <Skeleton className="h-full w-full bg-white/10" />
        </div>
        <div className="h-64 w-full rounded-3xl border border-white/10 bg-white/5 p-6">
          <Skeleton className="h-full w-full bg-white/10" />
        </div>
      </div>
    </div>
  );
});
