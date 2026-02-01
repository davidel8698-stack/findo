"use client";

import { cn } from "@/lib/utils";
import { HeroContent } from "./HeroContent";
import { PhoneMockup } from "./PhoneMockup";

interface HeroProps {
  className?: string;
}

/**
 * Main hero section with RTL-native grid layout.
 * Content appears on the RIGHT side in RTL desktop (natural for Hebrew).
 * Phone mockup appears on the LEFT side in RTL desktop.
 * On mobile, visual appears first, then content below.
 */
export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        // Full viewport height with dynamic viewport units for mobile
        "min-h-[100dvh]",
        // Vertical centering
        "flex items-center",
        // Breathing room
        "py-16 md:py-20",
        className
      )}
    >
      {/* Container */}
      <div className="container mx-auto">
        {/* Grid layout - RTL-native */}
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2",
            "gap-8 lg:gap-12",
            "items-center"
          )}
        >
          {/* Content - order-2 on mobile (below visual), lg:order-1 (right side in RTL) */}
          <div className="order-2 lg:order-1">
            <HeroContent />
          </div>

          {/* Visual - order-1 on mobile (above content), lg:order-2 (left side in RTL) */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
            <PhoneMockup>
              {/* Placeholder for activity cards - will be added in Plan 02 */}
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <span className="text-sm">Activity Feed</span>
                <span className="text-xs">(Plan 02)</span>
              </div>
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}
