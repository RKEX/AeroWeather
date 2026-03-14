import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div className={`rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] ${className}`}>
      {children}
    </div>
  );
}
