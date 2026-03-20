"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";

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
  const [fps, setFps] = useState(60);
  const [targetFps, setTargetFps] = useState(60);
  
  const callbacksRef = useRef<Map<string, (timestamp: number) => void>>(new Map());
  const rafIdRef = useRef<number | null>(null);
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);

  const setQuality = useCallback((mode: QualityMode) => {
    setQualityState(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("aeroweather_quality_mode", mode);
    }
  }, []);

  // Register/Unregister for the central loop
  const registerCallback = useCallback((id: string, callback: (timestamp: number) => void) => {
    callbacksRef.current.set(id, callback);
  }, []);

  const unregisterCallback = useCallback((id: string) => {
    callbacksRef.current.delete(id);
  }, []);

  // Use a named function for the loop to avoid hoisting/circular reference issues in useCallback
  const startLoop = useCallback(() => {
    const loop = (timestamp: number) => {
      if (lastTimeRef.current !== 0) {
        const delta = timestamp - lastTimeRef.current;
        const currentFps = 1000 / delta;
        
        frameTimesRef.current.push(currentFps);
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }
        
        if (timestamp % 500 < 20) {
          const avgFps = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
          setFps(Math.round(avgFps));
        }
      }
      lastTimeRef.current = timestamp;

      callbacksRef.current.forEach((cb) => cb(timestamp));
      rafIdRef.current = requestAnimationFrame(loop);
    };
    
    rafIdRef.current = requestAnimationFrame(loop);
  }, []);

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
    startLoop();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [startLoop]);

  const value = {
    tier,
    quality,
    fps,
    targetFps,
    isLowEnd: quality === "LITE" || tier === "LOW",
    isHighEnd: quality === "ULTRA" && tier === "HIGH",
    registerCallback,
    unregisterCallback,
    setQuality,
  };

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
