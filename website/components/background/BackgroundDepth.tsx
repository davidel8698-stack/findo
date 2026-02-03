"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";
import { cn } from "@/lib/utils";

interface BackgroundDepthProps {
  className?: string;
}

/**
 * BackgroundDepth - Three-layer background system with parallax
 *
 * Layers:
 * 1. Grid pattern (base) - Inline SVG at 5% opacity
 * 2. Gradient orbs (middle) - Blurred container with parallax animation
 * 3. Noise texture (top) - Inline SVG feTurbulence at 3% opacity
 *
 * Performance considerations:
 * - blur(80px) applied to container, NOT individual orbs
 * - will-change-transform only on 3 orb elements (within budget)
 * - Respects prefers-reduced-motion
 *
 * @see BG-01 through BG-06 in requirements
 */
export function BackgroundDepth({ className }: BackgroundDepthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  // Check for reduced motion preference (BG-06)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Parallax animation - only if motion is allowed (BG-06)
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const orbs = [
        orb1Ref.current,
        orb2Ref.current,
        orb3Ref.current,
      ].filter(Boolean);
      // Subtle y-offset values for organic parallax feel
      // Different speeds create depth perception
      const speeds = [-80, -120, -60];

      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: speeds[i],
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5, // 1.5s smoothing for organic feel
          },
        });
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
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

      {/* Layer 2: Gradient Orbs (BG-03, BG-04) - blur on container for performance */}
      <div className="absolute inset-0" style={{ filter: "blur(80px)" }}>
        {/* Orb 1: Top-right - primary orange */}
        <div
          ref={orb1Ref}
          className="absolute w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-orange-500/20 will-change-transform"
          style={{ top: "5%", right: "5%" }}
        />
        {/* Orb 2: Bottom-left - amber accent */}
        <div
          ref={orb2Ref}
          className="absolute w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-amber-500/15 will-change-transform"
          style={{ bottom: "15%", left: "10%" }}
        />
        {/* Orb 3: Center - subtle secondary */}
        <div
          ref={orb3Ref}
          className="absolute w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full bg-orange-400/10 will-change-transform"
          style={{ top: "40%", left: "40%" }}
        />
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
