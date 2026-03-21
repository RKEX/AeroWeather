"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type PerformanceTier = "LOW" | "MID" | "HIGH";
export type QualityMode = "LITE" | "BALANCED" | "ULTRA";

interface PerformanceContextType {
  tier: PerformanceTier;
  quality: QualityMode;
  fps: number;
  targetFps: number;
  isLowEnd: boolean;
  isHighEnd: boolean;
  registerCallback: (id: string, callback: (timestamp: number) => void) => void;
  unregisterCallback: (id: string) => void;
  setQuality: (mode: QualityMode) => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) throw new Error("usePerformance must be used within PerformanceProvider");
  return context;
};

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<PerformanceTier>("MID");
  const [quality, setQualityState] = useState<QualityMode>("BALANCED");
  const [fps] = useState(60);
  const [targetFps, setTargetFps] = useState(60);

  const setQuality = (mode: QualityMode) => {
    setQualityState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("aeroweather_quality_mode", mode);
    }
  };

  useEffect(() => {
    const detectCapability = () => {
      let detectedTier: PerformanceTier = "MID";
      let hz = 60;

      const cores = (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 4;
      // @ts-expect-error - deviceMemory is experimental
      const memory = (typeof navigator !== "undefined" && navigator.deviceMemory) || 4;
      const isMobile = typeof navigator !== "undefined" && /Mobi|Android|iPhone/i.test(navigator.userAgent);

      if (isMobile) {
        detectedTier = (memory < 3 || cores < 4) ? "LOW" : "MID";
      } else {
        if (cores >= 8 && memory >= 8) {
          detectedTier = "HIGH";
          hz = 120; 
        } else if (cores <= 2 || memory <= 2) {
          detectedTier = "LOW";
          hz = 30; 
        }
      }

      setTier(detectedTier);
      setTargetFps(hz);

      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("aeroweather_quality_mode") as QualityMode;
        if (saved) {
          setQualityState(saved);
        } else {
          const initialQuality = detectedTier === "HIGH" ? "ULTRA" : detectedTier === "LOW" ? "LITE" : "BALANCED";
          setQualityState(initialQuality);
        }
      }
    };

    detectCapability();
  }, []);

  const value = useMemo(() => ({
    tier,
    quality,
    fps,
    targetFps,
    isLowEnd: quality === "LITE" || tier === "LOW",
    isHighEnd: quality === "ULTRA" && tier === "HIGH",
    // Kept for API compatibility; no global RAF subscriptions for lower TBT.
    registerCallback: () => {},
    unregisterCallback: () => {},
    setQuality,
  }), [tier, quality, fps, targetFps]);

  return (
    <PerformanceContext.Provider value={value}>
      <div 
        className={`performance-wrapper ${quality.toLowerCase()}-mode ${tier === "LOW" ? "reduce-motion" : ""} contents`}
        style={{ 
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        {children}
      </div>
    </PerformanceContext.Provider>
  );
}
