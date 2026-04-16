"use client";

import { subscribeSharedRaf } from "@/lib/shared-raf";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

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

  useEffect(() => {
    if (!mounted) return;

    const scrollerEl = scrollbarRef.current?.scrollerElement as HTMLElement | undefined;
    if (!scrollerEl) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      scrollerEl
        .querySelectorAll<HTMLElement>("[data-reveal], .glass-card")
        .forEach((target) => target.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("motion-enabled");

    const targets = Array.from(
      scrollerEl.querySelectorAll<HTMLElement>("[data-reveal], .glass-card")
    );

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");
          obs.unobserve(target);
        }
      },
      {
        root: scrollerEl,
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    targets.forEach((target) => {
      target.classList.add("reveal-item");
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [mounted, pathname]);

  useEffect(() => {
    if (!mounted) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEndDevice =
      (navigator.hardwareConcurrency || 4) <= 4 ||
      window.devicePixelRatio > 2 ||
      window.innerWidth < 768;

    if (reducedMotion || lowEndDevice) return;

    const scrollerEl = scrollbarRef.current?.scrollerElement as HTMLElement | undefined;
    const appShell = document.getElementById("app-shell");
    if (!scrollerEl || !appShell) return;

    let bounceLocked = false;
    let bounceTimer: number | null = null;
    let touchStartY: number | null = null;

    const EDGE_EPSILON = 2;

    const isAtTop = () => scrollerEl.scrollTop <= EDGE_EPSILON;
    const isAtBottom = () => {
      const maxScrollTop = Math.max(0, scrollerEl.scrollHeight - scrollerEl.clientHeight);
      return maxScrollTop > 0 && scrollerEl.scrollTop >= maxScrollTop - EDGE_EPSILON;
    };

    const clearBounce = () => {
      appShell.classList.remove("edge-bounce-active");
      appShell.style.transform = "translate3d(0, 0, 0)";
      bounceLocked = false;
      if (bounceTimer !== null) {
        window.clearTimeout(bounceTimer);
        bounceTimer = null;
      }
    };

    const triggerBounce = (direction: 1 | -1) => {
      if (bounceLocked) return;
      bounceLocked = true;

      appShell.classList.add("edge-bounce-active");
      appShell.style.transform = `translate3d(0, ${direction * 7}px, 0)`;

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          appShell.style.transform = "translate3d(0, 0, 0)";
        });
      });

      bounceTimer = window.setTimeout(clearBounce, 240);
    };

    const handleWheel = (event: WheelEvent) => {
      if (isAtTop() && event.deltaY < -0.5) {
        triggerBounce(1);
      } else if (isAtBottom() && event.deltaY > 0.5) {
        triggerBounce(-1);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY === null) return;

      const currentY = event.touches[0]?.clientY;
      if (typeof currentY !== "number") return;

      // Positive delta means swipe up (content down), negative means swipe down (content up).
      const deltaY = touchStartY - currentY;

      if (isAtTop() && deltaY < -6) {
        triggerBounce(1);
      } else if (isAtBottom() && deltaY > 6) {
        triggerBounce(-1);
      }
    };

    const clearTouchStart = () => {
      touchStartY = null;
    };

    scrollerEl.addEventListener("wheel", handleWheel, { passive: true });
    scrollerEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    scrollerEl.addEventListener("touchmove", handleTouchMove, { passive: true });
    scrollerEl.addEventListener("touchend", clearTouchStart, { passive: true });
    scrollerEl.addEventListener("touchcancel", clearTouchStart, { passive: true });

    return () => {
      scrollerEl.removeEventListener("wheel", handleWheel);
      scrollerEl.removeEventListener("touchstart", handleTouchStart);
      scrollerEl.removeEventListener("touchmove", handleTouchMove);
      scrollerEl.removeEventListener("touchend", clearTouchStart);
      scrollerEl.removeEventListener("touchcancel", clearTouchStart);
      clearBounce();
    };
  }, [mounted]);

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
          width: "12px",
          right: "2px",
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