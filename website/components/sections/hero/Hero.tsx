"use client";

import { cn } from "@/lib/utils";
import { HeroContent } from "./HeroContent";
import { PhoneMockup } from "./PhoneMockup";
import { ActivityFeed } from "./ActivityFeed";
import { useHeroEntrance } from "@/lib/hooks";

interface HeroProps {
  className?: string;
}

/**
 * Main hero section with RTL-native grid layout.
 * Content appears on the RIGHT side in RTL desktop (natural for Hebrew).
 * Phone mockup appears on the LEFT side in RTL desktop.
 * On mobile, visual appears first, then content below.
 *
 * LCP Strategy:
 * - Headline text (h1) is the LCP element, rendered via server-side HeroContent
 * - ActivityFeed animation runs after initial paint (client-only)
 * - No images in hero - pure CSS phone mockup optimizes LCP
 * - Animation uses GPU-accelerated properties (transform, opacity)
 *
 * Entrance Choreography:
 * - 7-phase GSAP timeline completing in ~1.2s
 * - Elements marked with data-hero-* attributes for timeline targeting
 * - Reduced motion: opacity-only fallback
 */
export function Hero({ className }: HeroProps) {
  const { scopeRef } = useHeroEntrance();

  return (
    <section
      ref={scopeRef as React.RefObject<HTMLElement>}
      data-hero-bg
      data-hero-animate
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
        {/* Grid layout - RTL-native, bounded for visual balance */}
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2",
            "gap-8 lg:gap-12",
            "items-center",
            // Max-width + center ensures visual balance relative to screen center
            "max-w-6xl mx-auto"
          )}
        >
          {/* Content - order-2 on mobile (below visual), lg:order-1 (right side in RTL) */}
          <div className="order-2 lg:order-1">
            <HeroContent />
          </div>

          {/* Visual - order-1 on mobile (above content), lg:order-2 (left side in RTL) */}
          {/* Phone centered in its column for visual balance relative to screen center */}
          <div
            className="order-1 lg:order-2 flex justify-center"
            data-hero-mockup
            data-hero-animate
          >
            <PhoneMockup>
              <ActivityFeed />
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}
