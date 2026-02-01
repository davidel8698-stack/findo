"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyCtaBarProps {
  className?: string;
  formId?: string;
}

/**
 * Mobile sticky CTA bar that appears after scrolling past hero.
 * Shows on mobile only (md:hidden) with frosted glass effect.
 * Includes iOS safe area support for notched devices.
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
        // Frosted glass effect
        "bg-background/80 backdrop-blur-md",
        // Separation from content
        "border-t border-border",
        // Padding with iOS safe area support
        "p-4 pb-[env(safe-area-inset-bottom,1rem)]",
        className
      )}
    >
      <Button size="lg" className="w-full" onClick={handleClick}>
        התחל בחינם
      </Button>
    </div>
  );
}
