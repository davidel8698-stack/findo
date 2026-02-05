"use client";

import { useCallback, useRef } from "react";
import { useReducedMotion } from "motion/react";

type ShakeSeverity = "hint" | "gentle" | "blocking";

/**
 * Hook for triggering shake/error animations on form elements
 *
 * Severity levels (per CONTEXT.md):
 * - hint: color change only (user already focused)
 * - gentle: pulse animation (1-2 cycles)
 * - blocking: shake + glow (payment failed, auth errors)
 *
 * Accessibility: Respects prefers-reduced-motion via:
 * 1. CSS media query fallback (globals.css disables shake animations)
 * 2. Motion's useReducedMotion hook (skips animation trigger entirely)
 *
 * @example
 * const { ref, triggerShake } = useShake<HTMLInputElement>();
 * // On error:
 * triggerShake("gentle");
 */
export function useShake<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  const triggerShake = useCallback((severity: ShakeSeverity = "gentle") => {
    const element = ref.current;
    if (!element) return;

    // Remove any existing error classes
    element.classList.remove("error-hint", "error-gentle", "error-shake");

    // Force reflow to restart animation if same class applied again
    void element.offsetWidth;

    // Apply severity-appropriate class
    // For reduced motion: apply hint (color only) instead of animated classes
    // CSS also provides fallback via @media (prefers-reduced-motion: reduce)
    const className = prefersReducedMotion
      ? "error-hint"
      : severity === "hint"
        ? "error-hint"
        : severity === "blocking"
          ? "error-shake"
          : "error-gentle";

    element.classList.add(className);

    // Clean up after animation completes (skip if reduced motion or hint)
    const shouldCleanup = !prefersReducedMotion && severity !== "hint";

    if (shouldCleanup) {
      const cleanup = () => {
        element.classList.remove(className);
        element.removeEventListener("animationend", cleanup);
      };
      element.addEventListener("animationend", cleanup);
    }
  }, [prefersReducedMotion]);

  const clearError = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    element.classList.remove("error-hint", "error-gentle", "error-shake");
  }, []);

  return { ref, triggerShake, clearError };
}
