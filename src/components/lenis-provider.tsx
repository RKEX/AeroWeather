// src/components/lenis-provider.tsx
"use client";

import Lenis from "@studio-freight/lenis";
import { ReactNode, useEffect } from "react";

type WindowWithLenis = {
  lenis?: Lenis;
};

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
    } as ConstructorParameters<typeof Lenis>[0]);

    // Expose globally for CustomScrollbar
    (window as unknown as WindowWithLenis).lenis = lenis;

    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis?.destroy();
      delete (window as unknown as WindowWithLenis).lenis;
    };
  }, []);

  return <>{children}</>;
}
