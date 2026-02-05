"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlassNavProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * GlassNav - Navigation wrapper with scroll-triggered glass effect
 *
 * Per CONTEXT.md:
 * - "Navigation: Glass background when scrolled/sticky"
 * - Mobile fallback: solid dark background
 * - Desktop with @supports: glass effect
 * - Transition timing: 300ms ease-out
 */
export function GlassNav({ className, children }: GlassNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show glass effect after scrolling 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        // Base positioning
        "fixed top-0 inset-x-0 z-50",
        // Transition for smooth glass appearance
        "transition-all duration-300 ease-out",
        isScrolled
          ? cn(
              // Glass effect when scrolled
              // Mobile fallback (solid)
              "bg-[rgb(24_24_27/0.8)] border-b border-white/20",
              // Desktop glass enhancement
              "md:supports-[backdrop-filter:blur(1px)]:bg-[rgb(24_24_27/0.2)]",
              "md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[10px]",
              "md:supports-[backdrop-filter:blur(1px)]:border-white/10"
            )
          : // Transparent when not scrolled
            "bg-transparent border-b border-transparent",
        className
      )}
    >
      {children}
    </nav>
  );
}
