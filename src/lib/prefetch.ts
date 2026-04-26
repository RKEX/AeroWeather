"use client";
const prefetchCache = new Set<string>();

export function prefetchWeather(lat: number, lon: number) {
  const cacheKey = `${lat},${lon}`;
  if (prefetchCache.has(cacheKey)) return;

  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      fetch(`/api/weather?lat=${lat}&lon=${lon}`, { cache: "no-store" }).catch(() => {
        // Prefetch failures are non-blocking.
      });

      prefetchCache.add(cacheKey);
      
      // Clean up cache periodically
      if (prefetchCache.size > 20) {
        prefetchCache.clear();
      }
    }, { timeout: 2000 });
  }
}
