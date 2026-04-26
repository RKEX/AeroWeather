"use client";

import { Skeleton } from "@/components/ui/skeleton";
import SkeletonCard from "@/components/ui/skeleton-card";
import { memo } from "react";

export const MapSkeleton = memo(function MapSkeleton() {
  return (
    <SkeletonCard className="relative h-[320px] md:h-[380px] lg:h-[420px] w-full overflow-hidden shadow-none">
      {/* Background Skeleton Base */}
      <Skeleton className="h-full w-full bg-white/5" />

      {/* Mocking the placeholder/radar UI structure */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <Skeleton className="h-20 w-20 rounded-3xl bg-white/10 mb-6" />
        
        <div className="flex flex-col items-center gap-3 w-full max-w-md">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-white/10" />
            <Skeleton className="h-5 w-48 bg-white/10" />
          </div>
          <Skeleton className="h-3 w-full bg-white/5" />
          <Skeleton className="h-3 w-4/5 bg-white/5" />
          <Skeleton className="mt-2 h-6 w-56 rounded-full bg-white/5" />
        </div>
      </div>

      {/* Corner Accents mirroring real placeholder */}
      <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-white/5" />
      <div className="absolute bottom-4 left-4 h-2 w-2 rounded-full bg-white/5" />
    </SkeletonCard>
  );
});
