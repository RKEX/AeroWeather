"use client";

import Lenis from "@studio-freight/lenis";
import { useEffect, useState } from "react";

export default function CustomScrollbar() {
  const [scroll, setScroll] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(20);

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 🔥 THIS IS THE FIX
    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      const percent = limit > 0 ? scroll / limit : 0;
      setScroll(percent);

      const heightPercent =
        (window.innerHeight / document.documentElement.scrollHeight) * 100;

      setThumbHeight(Math.max(heightPercent, 10));
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed top-4 right-2 bottom-4 z-[9999] w-[12px]">
      {/* TRACK */}
      <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />

      {/* THUMB */}
      <div
        className="absolute w-full rounded-full"
        style={{
          height: `${thumbHeight}%`,
          top: `${scroll * (100 - thumbHeight)}%`,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.5))",
          boxShadow: "0 0 14px rgba(255,255,255,0.4)",
        }}
      />
    </div>
  );
}
