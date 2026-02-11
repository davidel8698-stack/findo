"use client";

import Hero from "@/components/sections/hero";
import { StickyCtaBar } from "@/components/sections/hero";
import { LogoCarousel } from "@/components/sections/logo-carousel";
import { TextJourneySection } from "@/components/sections/text-journey";
// Phase 19 - SEO structured data
import { StructuredData } from "@/components/seo/StructuredData";

export default function HomePage() {
  return (
    <main className="min-h-screen text-foreground relative z-10">
      {/* SEO Structured Data - Phase 19 */}
      <StructuredData />

      {/* Hero Section - Phase 32 Complete (Linear-quality) */}
      <Hero />

      {/* Logo Carousel - Phase 33 */}
      <LogoCarousel />

      {/* Text Journey - Phase 34 */}
      <TextJourneySection />

      {/* Sticky CTA Bar - Phase 14 */}
      <StickyCtaBar />
    </main>
  );
}
