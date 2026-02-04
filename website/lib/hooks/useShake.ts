"use client";

import { useCallback, useRef } from "react";

type ShakeSeverity = "hint" | "gentle" | "blocking";

/**
 * Hook for triggering shake/error animations on form elements
 *
 * Severity levels (per CONTEXT.md):
 * - hint: color change only (user already focused)
 * - gentle: pulse animation (1-2 cycles)
 * - blocking: shake + glow (payment failed, auth errors)
 *
 * @example
 * const { ref, triggerShake } = useShake<HTMLInputElement>();
 * // On error:
 * triggerShake("gentle");
 */
export function useShake<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const triggerShake = useCallback((severity: ShakeSeverity = "gentle") => {
    const element = ref.current;
    if (!element) return;

    // Remove any existing error classes
    element.classList.remove("error-hint", "error-gentle", "error-shake");

    // Force reflow to restart animation if same class applied again
    void element.offsetWidth;

    // Apply severity-appropriate class
    const className =
      severity === "hint"
        ? "error-hint"
        : severity === "blocking"
          ? "error-shake"
          : "error-gentle";

    element.classList.add(className);

    // Clean up after animation completes
    const cleanup = () => {
      // Keep error-hint (it's not animated, just styling)
      if (severity !== "hint") {
        element.classList.remove(className);
      }
      element.removeEventListener("animationend", cleanup);
    };

    if (severity !== "hint") {
      element.addEventListener("animationend", cleanup);
    }
  }, []);

  const clearError = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    element.classList.remove("error-hint", "error-gentle", "error-shake");
  }, []);

  return { ref, triggerShake, clearError };
}
