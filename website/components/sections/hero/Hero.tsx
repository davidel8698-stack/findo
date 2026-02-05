"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HeroContent } from "./HeroContent";
import { PhoneMockup } from "./PhoneMockup";
import { ActivityFeed } from "./ActivityFeed";

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
 * - Phone mockup image is the LCP element (largest contentful paint)
 * - Mockup is visible immediately (opacity:1) - NOT hidden by GSAP initial state
 * - Desktop: GSAP animations loaded dynamically after initial render
 * - Mobile: No GSAP animations - content visible immediately for fast LCP
 * - ActivityFeed animation runs after hero-entrance-complete event
 *
 * Entrance Choreography (Desktop only):
 * - 7-phase GSAP timeline completing in ~1.2s
 * - Elements marked with data-hero-* attributes for timeline targeting
 * - Mockup uses data-hero-mockup ONLY for transform-only animation
 */
export function Hero({ className }: HeroProps) {
  const scopeRef = useRef<HTMLElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop vs mobile
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 769);
    };
    checkDesktop();

    // If mobile, dispatch event immediately so ActivityFeed starts
    if (window.innerWidth < 769) {
      window.dispatchEvent(new CustomEvent("hero-entrance-complete"));
    }
  }, []);

  // Dynamically load GSAP animations ONLY on desktop
  useEffect(() => {
    if (!isDesktop || !scopeRef.current) return;

    // Check reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.dispatchEvent(new CustomEvent("hero-entrance-complete"));
      return;
    }

    // Dynamic import GSAP only on desktop
    import("@/lib/gsapConfig").then(({ gsap }) => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      // Phase 2: Nav slide down (200-500ms)
      tl.from(
        "[data-hero-nav]",
        { y: -20, opacity: 0, duration: 0.3 },
        0.2
      );

      // Phase 3: Headline (300-800ms) - 30px rise
      tl.from(
        "[data-hero-headline]",
        { y: 30, opacity: 0, duration: 0.5 },
        0.3
      );

      // Phase 4: Subheadline (600-900ms)
      tl.from(
        "[data-hero-subheadline]",
        { y: 20, opacity: 0, duration: 0.3 },
        0.6
      );

      // Phase 5: CTAs (800-1100ms) - bounce easing
      tl.from(
        "[data-hero-cta]",
        { scale: 0.9, opacity: 0, ease: "back.out(1.7)", duration: 0.3 },
        0.8
      );

      // Phase 6: Phone mockup (500-1200ms) - transform-only
      tl.from(
        "[data-hero-mockup]",
        { y: 60, duration: 0.7 },
        0.5
      );

      // Phase 7: Activity feed trigger (1000ms)
      tl.call(
        () => {
          window.dispatchEvent(new CustomEvent("hero-entrance-complete"));
        },
        [],
        1.0
      );
    });
  }, [isDesktop]);

  return (
    <section
      ref={scopeRef as React.RefObject<HTMLElement>}
      data-hero-bg
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
          {/* LCP FIX: Removed data-hero-animate to keep mockup visible immediately (prevents 10.5s LCP delay) */}
          {/* Animation uses transform-only via data-hero-mockup (opacity stays 1) */}
          <div
            className="order-1 lg:order-2 flex justify-center"
            data-hero-mockup
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
