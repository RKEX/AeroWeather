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
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // ✅ Map শুধু তখনই load হবে যখন viewport এ আসবে
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        // ✅ 200px আগে থেকেই load শুরু হবে — user scroll করতে করতেই ready হয়ে যাবে
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      {shouldRender ? (
        <RadarMap lat={lat} lon={lon} isNight={isNight} />
      ) : (
        <MapSkeleton />
      )}
    </div>
  );
}

export const LazyRadarMap = memo(LazyRadarMapComponent);
LazyRadarMap.displayName = "LazyRadarMap";