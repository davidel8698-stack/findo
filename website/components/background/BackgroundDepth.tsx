"use client";

import { cn } from "@/lib/utils";

interface BackgroundDepthProps {
  className?: string;
}

/**
 * BackgroundDepth - Solid background
 *
 * Simple solid #08090A background for the entire site.
 */
export function BackgroundDepth({ className }: BackgroundDepthProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
      {/* Solid Background - #08090A */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#08090A" }}
      />
    </div>
  );
}
