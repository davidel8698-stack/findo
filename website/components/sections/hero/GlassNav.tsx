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
 * Linear Design System specifications:
 * - COMP-08: 64px height (h-16), sticky position, semi-transparent + blur on scroll
 * - COMP-09: 85% opacity + stronger 16px blur when scrolled
 * - Mobile fallback: solid dark background (85% opacity)
 * - Desktop with @supports: glass effect (15% bg + 16px blur)
 * - Transition timing: 300ms ease-out
 * - Height consistent throughout scroll (no compacting)
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
        // Base positioning - 64px height per COMP-08
        "fixed top-0 inset-x-0 z-50 h-16",
        // Transition for smooth glass appearance
        "transition-all duration-300 ease-out",
        isScrolled
          ? cn(
              // Glass effect when scrolled (COMP-09)
              // Mobile fallback: 85% opacity solid
              "bg-[rgb(24_24_27/0.85)] border-b border-white/10",
              // Desktop glass: lighter bg (15%) + stronger blur (16px)
              "md:supports-[backdrop-filter:blur(1px)]:bg-[rgb(24_24_27/0.15)]",
              "md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[16px]",
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
