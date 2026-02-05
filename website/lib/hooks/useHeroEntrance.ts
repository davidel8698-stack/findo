"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

interface UseHeroEntranceReturn {
  scopeRef: React.RefObject<HTMLElement | null>;
  isComplete: boolean;
}

/**
 * Hero entrance choreography hook using GSAP timeline.
 *
 * LCP OPTIMIZATION:
 * - Initial state is set via CSS (opacity: 1 by default) to avoid blocking LCP
 * - JavaScript only enhances with animation AFTER first paint
 * - Phone mockup stays visible throughout (transform-only animation)
 *
 * 7-phase orchestrated entrance completing in ~1.2s:
 * - Phase 1: Background fade (0-300ms)
 * - Phase 2: Nav slide down (200-500ms)
 * - Phase 3: Headline reveal (300-800ms) - 30px rise
 * - Phase 4: Subheadline fade up (600-900ms)
 * - Phase 5: CTAs scale in (800-1100ms) - back.out easing
 * - Phase 6: Phone mockup (500-1200ms) - 60px rise, transform-only (no opacity)
 * - Phase 7: Activity feed trigger (1000ms)
 *
 * Reduced motion: Respects prefers-reduced-motion with simple fade
 *
 * @example
 * const { scopeRef } = useHeroEntrance();
 * return <section ref={scopeRef}>...</section>
 */
export function useHeroEntrance(): UseHeroEntranceReturn {
  const scopeRef = useRef<HTMLElement>(null);
  const isCompleteRef = useRef(false);

  useGSAP(
    () => {
      if (!scopeRef.current) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions!;

          // LCP FIX: Do NOT set opacity:0 on load - let content be visible immediately
          // Content is server-rendered and visible by default
          // Animation enhances from the current visible state

          if (reduceMotion) {
            // Reduced motion: just dispatch event, content already visible
            isCompleteRef.current = true;
            window.dispatchEvent(new CustomEvent("hero-entrance-complete"));
            return;
          }

          // Full 7-phase entrance - animate FROM current state (opacity 1)
          // Use gsap.from() to animate from offscreen/invisible TO current position
          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            onComplete: () => {
              isCompleteRef.current = true;
            },
          });

          // Phase 1: Background - no animation needed, already visible

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

          // Phase 6: Phone mockup (500-1200ms) - transform-only (NO opacity)
          // LCP FIX: Phone image stays visible (opacity:1), only Y position animates
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
        }
      );

      return () => mm.revert();
    },
    { scope: scopeRef }
  );

  return {
    scopeRef,
    isComplete: isCompleteRef.current,
  };
}
