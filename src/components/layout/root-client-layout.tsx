"use client";

import { subscribeSharedRaf } from "@/lib/shared-raf";
import Lenis from "lenis";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Scrollbar } from "react-scrollbars-custom";

export default function RootClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollbarRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let unsubscribeRaf: (() => void) | null = null;

    const timer = setTimeout(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const lowEndDevice =
        (navigator.hardwareConcurrency || 4) <= 4 ||
        window.devicePixelRatio > 2 ||
        window.innerWidth < 768;

      if (reducedMotion || lowEndDevice) return;

      const scrollerEl = scrollbarRef.current?.scrollerElement;
      if (!scrollerEl) return;

      lenisRef.current = new Lenis({
        wrapper: scrollerEl,
        content: scrollerEl.firstElementChild as HTMLElement,
        duration: 1.1,
        lerp: 0.12,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        smoothWheel: true,
      });

      unsubscribeRaf = subscribeSharedRaf((time) => {
        lenisRef.current?.raf(time);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      unsubscribeRaf?.();
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [mounted]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("debugOverflow")) return;

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
        if (rect.left < -1 || rect.right > viewportWidth + 1) {
          el.setAttribute("data-overflowing", "true");
          offenders.push(`${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}`);
        }
      });
      if (offenders.length > 0) {
        console.warn("[overflow-debug]", offenders);
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
    };
  }, []);

  return (
    <Scrollbar
      ref={scrollbarRef}
      style={{ width: "100%", height: "100dvh" }}
      wrapperProps={{ style: { right: 0 } }}
      noScrollX
      trackXProps={{ style: { display: "none" } }}

      // ✅ Track — পাতলা, আধা-transparent glass line
      trackYProps={{
        style: {
          background: "rgba(255, 255, 255, 0.04)",
          width: "5px",
          right: "3px",
          top: "8px",
          bottom: "8px",
          borderRadius: "99px",
          // Glass border effect
          border: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(4px)",
        },
      }}

      // ✅ Thumb — design এর সাথে match, আধা-white glass
      thumbYProps={{
        style: {
          background: "rgba(255, 255, 255, 0.28)",
          borderRadius: "99px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          transition: "background 0.2s ease",
          cursor: "grab",
        },
        onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255, 255, 255, 0.45)";
          (e.currentTarget as HTMLDivElement).style.cursor = "grabbing";
        },
        onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(255, 255, 255, 0.28)";
          (e.currentTarget as HTMLDivElement).style.cursor = "grab";
        },
      }}
    >
      <div className="relative max-w-full overflow-x-clip">
        {children}
      </div>
    </Scrollbar>
  );
}