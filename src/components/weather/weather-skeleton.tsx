import { WeatherHeroSkeleton, AstroPanelSkeleton, AqiCardSkeleton } from "@/components/weather/CardSkeletons";
import { HourlyForecastSkeleton } from "@/components/weather/ForecastSkeleton";
import { MapSkeleton } from "@/components/weather/MapSkeleton";

export function WeatherSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Skeleton */}
          <WeatherHeroSkeleton />
          
          {/* Chart Skeleton */}
          <HourlyForecastSkeleton />
        </div>

        <div className="space-y-6 lg:col-span-1">
          {/* Astro Panel Skeleton */}
          <AstroPanelSkeleton />

          {/* Radar Skeleton */}
          <MapSkeleton />

          {/* AQI Skeleton */}
          <AqiCardSkeleton />
        </div>
      </div>
    </div>
  );
}
