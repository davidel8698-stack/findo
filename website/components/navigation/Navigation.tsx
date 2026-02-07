"use client";

import { GlassNav } from "@/components/sections/hero/GlassNav";
import { Button } from "@/components/ui/button";

/**
 * Navigation - Main site navigation with GlassNav wrapper
 *
 * Features:
 * - GlassNav wrapper provides scroll-triggered glass effect (COMP-08, COMP-09)
 * - Text-based Findo logo (minimalist Linear aesthetic)
 * - Single CTA for conversion focus
 * - RTL-appropriate layout with justify-between
 *
 * Navigation is fixed at 64px height (h-16) with:
 * - Transparent state at top of page
 * - Glass effect (85% opacity + 16px blur) after scrolling 50px
 */
export function Navigation() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <GlassNav>
      <div className="container mx-auto h-full px-4 md:px-6">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-xl font-bold text-white">
            Findo
          </a>

          {/* CTA Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToContact}
            className="text-white/80 hover:text-white"
          >
            התחל בחינם
          </Button>
        </div>
      </div>
    </GlassNav>
  );
}
