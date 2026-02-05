"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackCtaClick } from "@/lib/posthog/events";

interface StickyCtaBarProps {
  className?: string;
  formId?: string;
}

/**
 * Mobile sticky CTA bar that appears after scrolling past hero.
 * Shows on mobile only (md:hidden) with solid glass fallback.
 * Includes iOS safe area support for notched devices.
 *
 * Per Phase 26 glass system:
 * - Mobile-only component uses solid fallback (no backdrop-blur)
 * - bg-[rgb(24_24_27/0.8)] = --glass-bg-fallback equivalent
 * - border-white/20 = --glass-border-fallback equivalent
 */
export function StickyCtaBar({ className, formId = "hero-form" }: StickyCtaBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px (hero CTA no longer visible)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to form when CTA is clicked
  const handleClick = () => {
    trackCtaClick("sticky_bar", "התחל בחינם");
    const formElement = document.getElementById(formId);
    if (formElement) {
      formElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Don't render when not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        // Positioning
        "fixed bottom-0 inset-x-0 z-50",
        // Only show on mobile
        "md:hidden",
        // Glass effect - using glass system fallback pattern
        // Mobile gets solid background (StickyCtaBar is md:hidden)
        "bg-[rgb(24_24_27/0.8)]",
        // Glass border fallback
        "border-t border-white/20",
        // Padding with iOS safe area support
        "p-4 pb-[env(safe-area-inset-bottom,1rem)]",
        className
      )}
    >
      <Button size="lg" glow="cta-static" className="w-full" onClick={handleClick}>
        התחל בחינם
      </Button>
    </div>
  );
}
