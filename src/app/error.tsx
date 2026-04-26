"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/Providers/language-provider";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("Global boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
      <div className="mb-8 h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
         <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight">
        Weather data temporarily unavailable
      </h2>
      <p className="mb-8 max-w-md text-white/50 text-sm leading-relaxed">
        We encountered a synchronization issue with our meteorological nodes. 
        Your current session has been protected from a crash.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-xl bg-white/10 px-8 py-3 font-bold text-white transition-all hover:bg-white/15 border border-white/10 shadow-lg"
      >
        Retry Synchronization
      </button>
    </div>
  );
}
