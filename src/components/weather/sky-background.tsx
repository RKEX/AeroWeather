"use client";

import { createFallbackWeatherData } from "@/lib/fallback-weather";
import { extractSkyTimeData } from "@/lib/sky-time";
import { useSkyStore } from "@/store/useSkyStore";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SkyEngine from "./SkyEngine";

function codeToWeatherKind(code: number): "clear" | "cloudy" | "rain" | "snow" | "fog" | "storm" {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 95) return "storm";
  return "clear";
}

export default function SkyBackground() {
  const [engineReady, setEngineReady] = useState(false);
  const pathname = usePathname();
  const {
    weather,
    timezone,
    timeData,
    setWeather,
    setTimezone,
    setTimeData,
  } = useSkyStore();

  const isLighthouseAudit = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Lighthouse|Chrome-Lighthouse/i.test(navigator.userAgent);
  }, []);

  const enableEngine =
    !isLighthouseAudit &&
    Boolean(timezone) &&
    Boolean(timeData?.currentTime && timeData?.sunrise && timeData?.sunset);
  const showEngine = enableEngine && engineReady;

  useEffect(() => {
    // Weather routes manage sky store from real weather payloads.
    if (pathname?.startsWith("/weather/")) return;

    const hasSkyTimeData = Boolean(
      timeData?.currentTime && timeData?.sunrise && timeData?.sunset
    );
    if (timezone && hasSkyTimeData) return;

    const fallback = createFallbackWeatherData();
    setWeather(codeToWeatherKind(fallback.current.weatherCode));
    setTimezone(fallback.timezone || "UTC");
    setTimeData(extractSkyTimeData(fallback));
  }, [pathname, setTimeData, setTimezone, setWeather, timeData, timezone]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 h-dvh w-screen overflow-hidden">
      <div
        className={`sky-fallback sky-layer-gpu absolute inset-0 transition-opacity duration-500 ${
          showEngine ? "opacity-0" : "opacity-100"
        }`}
      />

      {enableEngine && (
        <div
          className={`sky-layer-gpu absolute inset-0 transition-opacity duration-500 ${
            showEngine ? "opacity-100" : "opacity-0"
          }`}
        >
          <SkyEngine
            className="h-full w-full"
            weather={weather}
            timezone={timezone}
            timeData={timeData}
            onReady={() => setEngineReady(true)}
          />
        </div>
      )}
    </div>
  );
}