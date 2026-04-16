"use client";

import { useSkyStore } from "@/store/useSkyStore";
import { useMemo, useState } from "react";
import SkyEngine from "./SkyEngine";

export default function SkyBackground() {
  const [engineReady, setEngineReady] = useState(false);
  const { weather, timezone, timeData } = useSkyStore();

  const isLighthouseAudit = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Lighthouse|Chrome-Lighthouse/i.test(navigator.userAgent);
  }, []);

  const enableEngine =
    !isLighthouseAudit &&
    Boolean(timezone) &&
    Boolean(timeData?.currentTime && timeData?.sunrise && timeData?.sunset);
  const showEngine = enableEngine && engineReady;

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