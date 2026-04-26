"use client";

import { Skeleton } from "@/components/ui/skeleton";
import SkeletonCard from "@/components/ui/skeleton-card";
import { memo } from "react";

export const MapSkeleton = memo(function MapSkeleton() {
  return (
    <SkeletonCard className="relative h-[320px] md:h-[380px] lg:h-[420px] w-full overflow-hidden p-4">
      <div className="absolute top-4 left-4 z-10">
        <Skeleton className="mb-2 h-6 w-28 bg-white/5" />
        <Skeleton className="h-4 w-20 bg-white/5" />
      </div>

      <Skeleton className="h-full w-full rounded-2xl bg-white/5" />

      <div className="absolute right-4 bottom-4 left-4 z-10 flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        <Skeleton className="h-9 w-9 rounded-xl bg-white/5" />
        <Skeleton className="h-2 flex-1 bg-white/5" />
        <Skeleton className="h-9 w-9 rounded-xl bg-white/5" />
      </div>
    </SkeletonCard>
  );
});
