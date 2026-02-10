"use client";

import Hero from "@/components/sections/hero";
import { StickyCtaBar } from "@/components/sections/hero";
// Phase 19 - SEO structured data
import { StructuredData } from "@/components/seo/StructuredData";

export default function HomePage() {
  return (
    <main className="min-h-screen text-foreground relative z-10">
      {/* SEO Structured Data - Phase 19 */}
      <StructuredData />

      {/* Hero Section - Phase 32 Complete (Linear-quality) */}
      <Hero />

      {/* Sticky CTA Bar - Phase 14 */}
      <StickyCtaBar />
    </main>
  );
}
