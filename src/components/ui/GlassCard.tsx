"use client";
import { cn } from "@/lib/utils";
import React from "react";

type GlassCardProps<T extends React.ElementType = "div"> = {
  as?: T;
  children?: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export const GlassCard = React.forwardRef(
  <T extends React.ElementType = "div">(
    { children, className = "", as, ...props }: GlassCardProps<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.Ref<any>
  ) => {
    const Component = as || "div";
    return (
      <Component
        ref={ref}
        className={cn("rounded-2xl border border-white/10 bg-white/5", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
