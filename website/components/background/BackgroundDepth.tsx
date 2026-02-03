"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BackgroundDepthProps {
  className?: string;
}

/**
 * BackgroundDepth - Three-layer background system with parallax
 *
 * Layers:
 * 1. Grid pattern (base) - Inline SVG at 5% opacity
 * 2. Gradient orbs (middle) - Blurred with parallax animation
 * 3. Noise texture (top) - Inline SVG feTurbulence at 3% opacity
 *
 * Performance considerations:
 * - blur(80px) applied per orb wrapper for independent parallax
 * - will-change-transform only on 3 orb elements (within budget)
 * - Respects prefers-reduced-motion
 *
 * @see BG-01 through BG-06 in requirements
 */
export function BackgroundDepth({ className }: BackgroundDepthProps) {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  // Simple parallax with scroll listener
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const speeds = [0.05, 0.08, 0.03]; // Subtle parallax multipliers

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const orbs = [orb1Ref.current, orb2Ref.current, orb3Ref.current];

      orbs.forEach((orb, i) => {
        if (orb) {
          const yOffset = scrollY * speeds[i];
          orb.style.transform = `translateY(${-yOffset}px)`;
        }
      });
    };

    // Initial call
    handleScroll();

    // Add listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
      {/* Layer 0: Base Background - dark backdrop for all layers */}
      <div className="absolute inset-0 bg-background" />

      {/* Layer 1: Grid Pattern (BG-02) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="bg-grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-zinc-500 dark:text-zinc-400"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid-pattern)" />
      </svg>

      {/* Layer 2: Gradient Orbs (BG-03, BG-04) - each orb in its own blur wrapper for parallax */}
      {/* Orb 1: Top-right corner - primary orange */}
      <div
        ref={orb1Ref}
        className="absolute will-change-transform"
        style={{ top: "-10%", right: "-10%", filter: "blur(80px)" }}
      >
        <div className="w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-orange-500/20" />
      </div>
      {/* Orb 2: Bottom-left - amber accent */}
      <div
        ref={orb2Ref}
        className="absolute will-change-transform"
        style={{ bottom: "5%", left: "-5%", filter: "blur(80px)" }}
      >
        <div className="w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-amber-500/15" />
      </div>
      {/* Orb 3: Left side middle - subtle secondary */}
      <div
        ref={orb3Ref}
        className="absolute will-change-transform"
        style={{ top: "40%", left: "5%", filter: "blur(80px)" }}
      >
        <div className="w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full bg-orange-400/15" />
      </div>

      {/* Layer 3: Noise Texture (BG-05) - feTurbulence for premium grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px",
        }}
      />
    </div>
  );
}
