import { cn } from "@/lib/utils";
import React from "react";


interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function SkeletonCard({
  className,
  children,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default SkeletonCard;
