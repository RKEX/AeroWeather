"use client";

import dynamic from "next/dynamic";

const SkyEngine = dynamic(() => import("@/components/weather/sky-engine"), {
  ssr: false,
});

export default function SkyBackground() {
  return (
    <div className="fixed inset-0 -z-50">
      <SkyEngine />
    </div>
  );
}
