"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export default function RootClientLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    // Defer initialization to after first paint
    const timer = setTimeout(() => {
      lenis = new Lenis({
        duration: 1.2,
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
