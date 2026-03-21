"use client";

import { MapSkeleton } from "@/components/weather/MapSkeleton";
import dynamic from "next/dynamic";
import { memo, useEffect, useRef, useState } from "react";

const RadarMap = dynamic(
  () => import("@/components/weather/radar-map").then((mod) => mod.RadarMap),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  },
);

type LazyRadarMapProps = {
  lat: number;
  lon: number;
  isNight: boolean;
};

function LazyRadarMapComponent({ lat, lon, isNight }: LazyRadarMapProps) {
  const [isVisible, setIsVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible || typeof IntersectionObserver === "undefined") {
      return;
    }

    const element = triggerRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px", threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={triggerRef} className="w-full">
      {isVisible ? (
        <RadarMap lat={lat} lon={lon} isNight={isNight} />
      ) : (
        <MapSkeleton />
      )}
    </div>
  );
}

export const LazyRadarMap = memo(LazyRadarMapComponent);
LazyRadarMap.displayName = "LazyRadarMap";
