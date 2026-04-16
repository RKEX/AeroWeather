"use client";

import { MapSkeleton } from "@/components/weather/MapSkeleton";
import dynamic from "next/dynamic";
import { memo } from "react";

const RadarMap = dynamic(
  () => import("@/components/weather/radar-map").then((mod) => mod.RadarMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

type LazyRadarMapProps = {
  lat: number;
  lon: number;
  isNight: boolean;
};

function LazyRadarMapComponent({ lat, lon, isNight }: LazyRadarMapProps) {
  return <RadarMap lat={lat} lon={lon} isNight={isNight} />;
}

export const LazyRadarMap = memo(LazyRadarMapComponent);
LazyRadarMap.displayName = "LazyRadarMap";