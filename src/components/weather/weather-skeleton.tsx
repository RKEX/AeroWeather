"use client";

import { memo } from "react";

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
);

export const CardSkeleton = memo(({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm ${className}`}>
    <Shimmer />
  </div>
));
CardSkeleton.displayName = "CardSkeleton";

export const WeatherHeroSkeleton = () => (
  <div className="relative flex flex-col gap-6 p-8 rounded-4xl bg-white/5 border border-white/10 overflow-hidden h-64 md:h-72">
    <Shimmer />
    <div className="h-8 w-48 bg-white/10 rounded-lg mb-2" />
    <div className="h-16 w-32 bg-white/10 rounded-xl" />
    <div className="mt-auto flex gap-4">
      <div className="h-6 w-24 bg-white/10 rounded-full" />
      <div className="h-6 w-24 bg-white/10 rounded-full" />
    </div>
  </div>
);

export const ForecastSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="h-48 w-full bg-white/5 rounded-3xl border border-white/10 overflow-hidden relative">
      <Shimmer />
      <div className="p-6 flex flex-col gap-4">
        <div className="h-6 w-32 bg-white/10 rounded-md" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="shrink-0 w-16 h-28 bg-white/10 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className="flex flex-col gap-6">
    <CardSkeleton className="h-112.5" />
    <CardSkeleton className="h-48" />
    <CardSkeleton className="h-64" />
  </div>
);

export function WeatherSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 w-full">
      <div className="flex flex-col gap-6 lg:col-span-8">
        <WeatherHeroSkeleton />
        <CardSkeleton className="h-32" />
        <ForecastSkeleton />
        <CardSkeleton className="h-105" />
      </div>
      <div className="lg:col-span-4">
        <SidebarSkeleton />
      </div>
    </div>
  );
}
