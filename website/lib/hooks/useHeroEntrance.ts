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
 * 7-phase orchestrated entrance completing in ~1.2s:
 * - Phase 1: Background fade (0-300ms)
 * - Phase 2: Nav slide down (200-500ms)
 * - Phase 3: Headline reveal (300-800ms) - 30px rise
 * - Phase 4: Subheadline fade up (600-900ms)
 * - Phase 5: CTAs scale in (800-1100ms) - back.out easing
 * - Phase 6: Phone mockup (500-1200ms) - 60px rise (special treatment)
 * - Phase 7: Activity feed trigger (1000ms)
 *
 * Reduced motion: Opacity-only, 150ms duration per CONTEXT.md
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

          // Set initial state - everything invisible
          gsap.set("[data-hero-animate]", { opacity: 0 });

          if (reduceMotion) {
            // Reduced motion: opacity-only, 150ms per CONTEXT.md
            gsap.to("[data-hero-animate]", {
              opacity: 1,
              duration: 0.15,
              stagger: 0.05,
              onComplete: () => {
                isCompleteRef.current = true;
                window.dispatchEvent(new CustomEvent("hero-entrance-complete"));
              },
            });
            return;
          }

          // Full 7-phase entrance
          const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            onComplete: () => {
              isCompleteRef.current = true;
            },
          });

          // Phase 1: Background (0-300ms)
          tl.to("[data-hero-bg]", { opacity: 1, duration: 0.3 }, 0);

          // Phase 2: Nav slide down (200-500ms)
          tl.fromTo(
            "[data-hero-nav]",
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 },
            0.2
          );

          // Phase 3: Headline (300-800ms) - 30px rise per CONTEXT.md
          tl.fromTo(
            "[data-hero-headline]",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            0.3
          );

          // Phase 4: Subheadline (600-900ms)
          tl.fromTo(
            "[data-hero-subheadline]",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 },
            0.6
          );

          // Phase 5: CTAs (800-1100ms) - bounce easing
          tl.fromTo(
            "[data-hero-cta]",
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 0.3 },
            0.8
          );

          // Phase 6: Phone mockup (500-1200ms) - special treatment, 60px rise
          tl.fromTo(
            "[data-hero-mockup]",
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 },
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
