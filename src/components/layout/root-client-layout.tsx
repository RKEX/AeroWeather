"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function RootClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEndDevice =
      (navigator.hardwareConcurrency || 4) <= 4 ||
      window.devicePixelRatio > 2 ||
      window.innerWidth < 768;

    if (reducedMotion || lowEndDevice) return;

    const lenis = new Lenis({
      duration: 1.1,
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      document.querySelectorAll("[data-reveal], .glass-card")
        .forEach((target) => target.classList.add("is-visible"));
      return;
    }

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
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    document.querySelectorAll("[data-reveal], .glass-card").forEach((target) => {
      target.classList.add("reveal-item");
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [mounted, pathname]);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip scroll-smooth selection:bg-indigo-500/30 selection:text-white">
      {children}
    </div>
  );
}