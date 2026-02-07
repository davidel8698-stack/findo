"use client";

import { cn } from "@/lib/utils";

/**
 * SkipLink - Accessibility skip-to-content link (A11Y-01)
 *
 * WCAG 2.4.1: Bypass Blocks - allows keyboard users to skip navigation
 * Must be first focusable element in the document
 *
 * Pattern: sr-only (screen-reader accessible but hidden) until focused
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        // Off-screen by default (accessible to screen readers)
        "sr-only focus:not-sr-only",
        // On focus: fixed position, high z-index, centered
        "focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-[100]",
        // Visual styling
        "bg-primary text-primary-foreground",
        "px-6 py-3 rounded-lg",
        "font-semibold text-sm",
        // Focus ring per CONTEXT.md (2px ring, primary color, 2px offset)
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        // Ensure 48px minimum touch target (A11Y-06)
        "min-h-[48px] flex items-center"
      )}
    >
      {/* Hebrew: "Skip to main content" */}
      דלג לתוכן הראשי
    </a>
  );
}
