"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface PhoneMockupProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Pure CSS phone frame mockup using Tailwind.
 * Provides a modern phone shape with notch, side buttons, and rounded screen.
 * Uses logical properties (start/end) for RTL support.
 */
export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div
      className={cn(
        // Phone frame container
        "relative h-[500px] w-[240px] md:h-[600px] md:w-[290px]",
        // Frame styling
        "rounded-[2.5rem] border-[12px] border-card-foreground/90",
        // Shadow for depth
        "shadow-xl",
        // Background
        "bg-card",
        className
      )}
    >
      {/* Notch at top */}
      <div
        className={cn(
          "absolute top-0 start-1/2 -translate-x-1/2",
          "h-6 w-24 md:h-7 md:w-28",
          "rounded-b-xl",
          "bg-card-foreground/90"
        )}
      />

      {/* Volume buttons - start side (right in RTL) */}
      <div className="absolute start-full top-24 flex flex-col gap-4 ms-1">
        {/* Volume up */}
        <div className="h-8 w-1 rounded-e-sm bg-card-foreground/90" />
        {/* Volume down */}
        <div className="h-8 w-1 rounded-e-sm bg-card-foreground/90" />
      </div>

      {/* Power button - end side (left in RTL) */}
      <div className="absolute end-full top-32 me-1">
        <div className="h-12 w-1 rounded-s-sm bg-card-foreground/90" />
      </div>

      {/* Screen area */}
      <div
        className={cn(
          "absolute inset-0",
          "m-1 mt-8",
          "rounded-[1.75rem]",
          "overflow-hidden",
          "bg-background"
        )}
      >
        {/* Screen content */}
        <div className="h-full w-full overflow-hidden p-3">
          {children}
        </div>
      </div>
    </div>
  );
}
