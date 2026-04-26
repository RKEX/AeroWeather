// src/components/lenis-provider.tsx
'use client';

import Lenis from '@studio-freight/lenis';
import { useEffect, ReactNode } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // 1. Detect device
    const isTouchDevice = 
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    // 2. Initialize ONLY for non-touch
    if (isTouchDevice) {
      document.documentElement.classList.add("no-lenis");
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      infinite: false,
      gestureOrientation: "vertical",
      normalizeWheel: true,
    } as any);

    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
