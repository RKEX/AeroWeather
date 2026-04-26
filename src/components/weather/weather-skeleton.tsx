import { 
  WeatherHeroSkeleton, 
  AstroPanelSkeleton, 
  AqiCardSkeleton, 
  ImpactCalendarSkeleton,
  RainTimelineCardSkeleton,
  AiWeatherInsightSkeleton,
  WindPressureCardSkeleton
} from "@/components/weather/CardSkeletons";
import { 
  HourlyForecastSkeleton, 
  DailyForecastSkeleton 
} from "@/components/weather/ForecastSkeleton";
import { MapSkeleton } from "@/components/weather/MapSkeleton";
import SkeletonCard from "@/components/ui/skeleton-card";
import { Skeleton } from "@/components/ui/skeleton";

export function WeatherSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ════ LEFT / MAIN SECTION (2/3 width) ════ */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* 1. Hero Skeleton */}
          <WeatherHeroSkeleton />
          
          {/* 2. Weather Intelligence Analytics Skeleton */}
          <SkeletonCard className="p-6">
            <Skeleton className="mb-2 h-7 w-64 bg-white/5" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-[90%] bg-white/5" />
            </div>
          </SkeletonCard>

          {/* 3. Hourly Forecast Skeleton */}
          <HourlyForecastSkeleton />

          {/* 4. 7-Day Forecast Skeleton */}
          <DailyForecastSkeleton />

          {/* 5. Live Radar Map Skeleton */}
          <MapSkeleton />

          {/* 6. AQI Skeleton */}
          <AqiCardSkeleton />
        </div>

        {/* ════ RIGHT / SIDEBAR SECTION (1/3 width) ════ */}
        <aside className="flex flex-col gap-6 lg:col-span-1">
          {/* 1. Astro Panel Skeleton */}
          <AstroPanelSkeleton />

          {/* 2. Impact Calendar Skeleton */}
          <ImpactCalendarSkeleton />

          {/* 3. Wind & Pressure Skeleton */}
          <WindPressureCardSkeleton />

          {/* 4. Rain Forecast Skeleton */}
          <RainTimelineCardSkeleton />

          {/* 5. AI Insight Skeleton */}
          <AiWeatherInsightSkeleton />
        </aside>
      </div>
    </div>
  );
}
