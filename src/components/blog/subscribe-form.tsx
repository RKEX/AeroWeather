"use client";

import React, { useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { useToast } from "@/components/ui/premium-toast";
import { Loader2, CheckCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      toast({
        type: "error",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setEmail("");
      } else {
        toast({
          type: "error",
          title: "Subscription Failed",
          description: data.error || "Please try again",
        });
      }
    } catch (err) {
      toast({
        type: "error",
        title: "Subscription Failed",
        description: "Failed to connect to the server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md relative">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
              <GlassCard
                as="input"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                className="flex-1 px-8 py-5 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none transition-all shadow-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-[1.25rem] bg-white px-10 py-5 font-black text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10 disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 flex items-center justify-center min-w-[140px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining...
                  </span>
                ) : (
                  "Join"
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative"
          >
            {/* Success Glow */}
            <div className="absolute -inset-4 rounded-full bg-green-500/10 blur-2xl pointer-events-none" />
            
            <GlassCard className="flex flex-col items-center p-10 text-center relative z-10 overflow-hidden">
               <div className="mb-6 rounded-full bg-green-500/10 p-4 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                 <CheckCircle className="h-10 w-10 text-green-400" />
               </div>
               
               <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                 You&apos;re in 🎉
               </h3>
               <p className="text-white/50 text-sm font-medium mb-8 leading-relaxed max-w-[240px]">
                 Welcome to AeroWeather Insights. <br/>Check your inbox for a personal note.
               </p>

               <button
                 onClick={() => setIsSuccess(false)}
                 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors group"
               >
                 <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-45" />
                 Subscribe another email
               </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
