"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

export const MapSkeleton = memo(function MapSkeleton() {
  return (
    <div className="relative h-105 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="absolute top-4 left-4 z-10">
        <Skeleton className="mb-2 h-6 w-28 bg-white/15" />
        <Skeleton className="h-4 w-20 bg-white/10" />
      </div>

      <Skeleton className="h-full w-full rounded-2xl bg-white/10" />

      <div className="absolute right-4 bottom-4 left-4 z-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3">
        <Skeleton className="h-9 w-9 rounded-xl bg-white/15" />
        <Skeleton className="h-2 flex-1 bg-white/15" />
        <Skeleton className="h-9 w-9 rounded-xl bg-white/15" />
      </div>
    </div>
  );
});
