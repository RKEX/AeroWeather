"use client";


import { useEffect, useState } from "react";

export default function CustomScrollbar() {
  const [scroll, setScroll] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(20);

  useEffect(() => {
    let lenisInstance: any = null;

    const handleLenisScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      const percent = limit > 0 ? scroll / limit : 0;
      setScroll(percent);
    };

    const handleResize = () => {
      const heightPercent =
        (window.innerHeight / document.documentElement.scrollHeight) * 100;
      setThumbHeight(Math.max(heightPercent, 8));
    };

    const attachListener = () => {
      lenisInstance.on("scroll", handleLenisScroll);
      window.addEventListener("resize", handleResize);
      handleResize(); // Initial calculation
    };

    // Poll until LenisProvider exposes window.lenis
    const checkLenis = setInterval(() => {
      if ((window as any).lenis) {
        lenisInstance = (window as any).lenis;
        clearInterval(checkLenis);
        attachListener();
      }
    }, 50);

    return () => {
      clearInterval(checkLenis);
      if (lenisInstance) {
        lenisInstance.off("scroll", handleLenisScroll);
      }
      window.removeEventListener("resize", handleResize);
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
