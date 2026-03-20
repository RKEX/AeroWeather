import { ReactNode, forwardRef, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={`rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
