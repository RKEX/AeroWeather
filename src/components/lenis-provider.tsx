// src/components/lenis-provider.tsx
"use client";

import Lenis from "@studio-freight/lenis";
import { ReactNode, useEffect } from "react";

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // 2. Initialize for all devices

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      infinite: false,
      gestureOrientation: "vertical",
      normalizeWheel: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
