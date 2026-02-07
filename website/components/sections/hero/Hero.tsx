"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HeroContent } from "./HeroContent";

interface HeroProps {
  className?: string;
}

/**
 * Main hero section with centered vertical layout.
 * - Content: Centered headline + Subtitle + CTAs
 * - Panels: 3-panel cascade with Linear-style adjacency
 *
 * LCP Strategy:
 * - Desktop: GSAP animations loaded dynamically after initial render
 * - Mobile: No GSAP animations - content visible immediately for fast LCP
 * - ActivityFeed panel self-animates via motion/react
 *
 * Entrance Choreography (Desktop only):
 * - 6-phase GSAP timeline completing in ~1.2s
 * - Elements marked with data-hero-* attributes for timeline targeting
 * - Activity Feed panel handles its own entrance (motion/react)
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

      // Phase 6: Activity feed trigger (1000ms)
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
        // Minimal top gap (nav clearance already in layout.tsx pt-16)
        "pt-4 md:pt-6",
        // Bottom padding - extra space for the large 3D panel
        "pb-48 md:pb-64 lg:pb-[400px]",
        // Extend below the fold for immersive effect
        "min-h-screen lg:min-h-[140vh]",
        // Allow panels to overflow for Linear-style effect
        "overflow-visible",
        className
      )}
    >
      {/* Container */}
      <div className="container mx-auto">
        {/* Content above panels, right-aligned (start in RTL) */}
        <div className="flex flex-col max-w-7xl mx-auto">
          {/* Content - right aligned (start in RTL) */}
          <div className="w-full max-w-2xl">
            <HeroContent />
          </div>
        </div>
      </div>
    </section>
  );
}
