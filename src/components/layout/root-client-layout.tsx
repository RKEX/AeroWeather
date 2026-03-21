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

    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
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
      clearTimeout(timer);
      unsubscribeRaf?.();
      lenis?.destroy();
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (!params.has("debugOverflow")) {
      return;
    }

    document.documentElement.classList.add("debug-overflow");

    let rafId = 0;

    const scanOverflow = () => {
      document.querySelectorAll("[data-overflowing='true']").forEach((el) => {
        el.removeAttribute("data-overflowing");
      });

      const viewportWidth = window.innerWidth;
      const allElements = document.querySelectorAll<HTMLElement>("body *");
      const offenders: string[] = [];

      allElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const overflowsLeft = rect.left < -1;
        const overflowsRight = rect.right > viewportWidth + 1;

        if (!overflowsLeft && !overflowsRight) {
          return;
        }

        el.setAttribute("data-overflowing", "true");
        offenders.push(
          `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${el.className ? `.${el.className.toString().trim().replace(/\s+/g, ".")}` : ""}`,
        );
      });

      if (offenders.length > 0) {
        console.warn("[overflow-debug] Potential overflowing elements:", offenders);
      }
    };

    const scheduleScan = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(scanOverflow);
    };

    scheduleScan();
    window.addEventListener("resize", scheduleScan, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleScan);
      document.documentElement.classList.remove("debug-overflow");
      document.querySelectorAll("[data-overflowing='true']").forEach((el) => {
        el.removeAttribute("data-overflowing");
      });
    };
  }, []);

  return <div className="relative max-w-full overflow-x-clip">{children}</div>;
}
