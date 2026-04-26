"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description: string;
}

interface ToastContextType {
  toast: (props: { type: ToastType; title: string; description: string }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ type, title, description }: { type: ToastType; title: string; description: string }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed right-6 top-6 z-[9999] flex flex-col gap-4 w-full max-w-[400px] pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] group">
                {/* Accent Glow */}
                <div 
                  className={`absolute -left-1 -top-1 h-24 w-24 blur-3xl opacity-20 transition-colors ${
                    t.type === "success" ? "bg-emerald-500" : "bg-red-500"
                  }`} 
                />
                
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 rounded-full p-1 ${
                    t.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {t.type === "success" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-white tracking-tight">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-white/50 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <button 
                    onClick={() => removeToast(t.id)}
                    className="rounded-lg p-1 text-white/20 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-1 ${
                    t.type === "success" ? "bg-emerald-500/50" : "bg-red-500/50"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
