"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HeroContent } from "./HeroContent";
import { LinearHeroPanel } from "./LinearHeroPanel";

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

      // Phase 6: 3D Panel reveal (1000-1500ms) - rises into view
      tl.from(
        "[data-hero-panel]",
        {
          opacity: 0,
          y: 60,
          rotateX: 25, // Start more tilted back
          duration: 0.5,
          ease: "power2.out",
        },
        1.0
      );

      // Phase 7: Activity feed trigger (1400ms)
      tl.call(
        () => {
          window.dispatchEvent(new CustomEvent("hero-entrance-complete"));
        },
        [],
        1.4
      );
    });
  }, [isDesktop]);

  return (
    <section
      ref={scopeRef as React.RefObject<HTMLElement>}
      data-hero-bg
      className={cn(
        // Match Linear hero section - exact tone match
        "pt-24 md:pt-28 relative",
        // Background - Linear's near-pure black
        "bg-[#09090b]",
        // Prevent horizontal scroll from 3D panel overflow
        "overflow-x-hidden",
        className
      )}
    >
      {/* Minimal radial glow - Linear-style neutral */}
      <div
        className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.015) 0%, transparent 70%)",
        }}
      />

      {/* Hero Header - centered on mobile, right-aligned on desktop */}
      <div className="relative z-[2] max-w-[1294px] mx-auto px-5 md:px-6 lg:pr-[18%] lg:pl-6 lg:text-right">
        <HeroContent />
      </div>

      {/* 3D Panel - Linear-style tilted dashboard showcase */}
      <LinearHeroPanel />

      {/* Bottom spacer - smooth gradient transition, Linear-style */}
      <div
        className="h-[100px] md:h-[240px]"
        style={{
          background: "linear-gradient(to bottom, #09090b 0%, #050506 100%)"
        }}
      />
    </section>
  );
}
