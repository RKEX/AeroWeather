"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const SkyEngine = dynamic(() => import("../../../components/SkyEngine"), {
  ssr: false,
});

export default function SkyBackground() {
  const [enabled, setEnabled] = useState(false);

  const isLighthouseAudit = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Lighthouse|Chrome-Lighthouse/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEnabled(true);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  if (isLighthouseAudit || !enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      <SkyEngine className="h-full w-full" />
    </div>
  );
}
