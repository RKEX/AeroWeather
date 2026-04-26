"use client";

import GlassCard from "@/components/ui/GlassCard";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [status, setStatus] = useState<"idle" | "accepted" | "rejected">(
    "idle",
  );

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");

    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = (action: "accepted" | "rejected") => {
    localStorage.setItem("cookie-consent", action);
    setStatus(action);

    setTimeout(() => {
      setShowBanner(false);
    }, 1800);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-6 left-1/2 z-[100] w-[calc(100%-2rem)] -translate-x-1/2 px-4 md:max-w-xl">
        <GlassCard className="border-white/20 bg-black/70 shadow-2xl backdrop-blur-xl">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* ===== DEFAULT STATE ===== */}
              {status === "idle" ?
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  {/* TEXT */}
                  <p className="w-full text-sm leading-relaxed text-white/80">
                    We use cookies and similar technologies to enhance your
                    browsing experience, deliver real-time weather intelligence,
                    personalize forecasts, and analyze traffic patterns. These
                    technologies help us optimize performance, improve
                    prediction accuracy, and continuously refine AeroWeather’s
                    atmospheric models.
                    <br />
                    By clicking{" "}
                    <span className="font-semibold text-white">“Accept”</span>,
                    you agree to our use of cookies for analytics and experience
                    optimization.
                  </p>

                  {/* BUTTONS */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAction("rejected")}
                      className="rounded-lg bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white uppercase transition hover:bg-white/20 active:scale-95">
                      Reject
                    </button>

                    <button
                      onClick={() => handleAction("accepted")}
                      className="rounded-lg bg-white px-4 py-2 text-xs font-black tracking-wide text-slate-900 uppercase transition hover:bg-white/90 active:scale-95">
                      Accept
                    </button>
                  </div>
                </motion.div>
              : /* ===== SUCCESS STATE ===== */
                <motion.div
                  key="status"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2 py-2">
                  {status === "accepted" ?
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span className="text-sm font-semibold text-white">
                        Cookies accepted
                      </span>
                    </>
                  : <>
                      <XCircle className="h-5 w-5 text-red-400" />
                      <span className="text-sm font-semibold text-white">
                        Cookies rejected
                      </span>
                    </>
                  }
                </motion.div>
              }
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}
