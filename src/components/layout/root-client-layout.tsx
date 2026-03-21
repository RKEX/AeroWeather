"use client";

import { subscribeSharedRaf } from "@/lib/shared-raf";
import Lenis from "lenis";
import { ReactNode, useEffect } from "react";

export default function RootClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let unsubscribeRaf: (() => void) | null = null;

    const timer = window.setTimeout(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const lowEndDevice =
        (navigator.hardwareConcurrency || 4) <= 4 ||
        window.devicePixelRatio > 2 ||
        window.innerWidth < 768;

      // Skip smooth-scroll on constrained devices to preserve animation budget.
      if (reducedMotion || lowEndDevice) {
        return;
      }

      lenis = new Lenis({
        duration: 1.1,
        lerp: 0.12,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        smoothWheel: true,
      });

      unsubscribeRaf = subscribeSharedRaf((time) => {
        lenis?.raf(time);
      });
    }, 100);

    return () => {
      window.clearTimeout(timer);
      unsubscribeRaf?.();
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
