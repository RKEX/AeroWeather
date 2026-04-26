"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect, useState } from "react";

export default function CustomScrollbar() {
  const [scroll, setScroll] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(20);

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      gestureOrientation: "vertical",
      touchMultiplier: 1.2,
      wrapper: window, // 🔥 VERY IMPORTANT
      content: document.documentElement,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on(
      "scroll",
      ({ scroll, limit }: { scroll: number; limit: number }) => {
        const percent = limit > 0 ? scroll / limit : 0;
        setScroll(percent);

        const heightPercent =
          (window.innerHeight / document.documentElement.scrollHeight) * 100;

        setThumbHeight(Math.max(heightPercent, 8));
      },
    );

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-y-4 right-0 z-[9999]">
      {/* EDGE SAFE WRAPPER */}
      <div className="relative h-full pr-[6px] md:pr-[8px]">
        {/* TRACK */}
        <div className="absolute top-0 right-[2px] bottom-0 w-[5px] rounded-full bg-white/10 backdrop-blur-md md:right-[4px] md:w-[10px]" />

        {/* THUMB */}
        <div
          className="absolute right-[2px] w-[5px] rounded-full md:right-[4px] md:w-[10px]"
          style={{
            height: `${thumbHeight}%`,
            top: `${scroll * (100 - thumbHeight)}%`,
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.5))",
            boxShadow: "0 0 12px rgba(255,255,255,0.35)",
          }}
        />
      </div>
    </div>
  );
}
