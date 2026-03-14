export function WeatherSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-64 w-full bg-white/20 rounded-4xl backdrop-blur-[18px] border border-white/30" />
      
      {/* Forecasts Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="h-96 bg-white/20 rounded-4xl backdrop-blur-[18px] border border-white/30" />
        <div className="h-96 bg-white/20 rounded-4xl backdrop-blur-[18px] border border-white/30" />
      </div>

      {/* Hero Bottom Skeleton */}
      <div className="h-48 w-full bg-white/20 rounded-4xl backdrop-blur-[18px] border border-white/30" />
    </div>
  );
}
